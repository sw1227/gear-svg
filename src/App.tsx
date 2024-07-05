import { FC, useState, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import './App.css'
import { Box, Button, Heading, VStack, Text } from '@chakra-ui/react'
import GearSvg from './components/GearSvg.tsx'
import TeethNumberForm from './components/TeethNumberForm.tsx'
import ModuleForm from './components/ModuleForm.tsx'
import PressureAngleForm from './components/PressureAngleForm.tsx'
import HoleDiameterForm from './components/HoleDiameterForm.tsx'
import VisibilityForm from './components/VisibilityForm.tsx'
import {
  teethNumberState,
  moduleState,
  pressureAngleDegreeState,
  holeDiameterState,
  pitchDiameterState,
  tipRadiusState,
} from './recoil'

const App: FC = () => {
  const [teethNumber, setTeethNumber] = useRecoilState(teethNumberState)
  const [module, setModule] = useRecoilState(moduleState)
  const [pressureAngleDegree, setPressureAngleDegree] = useRecoilState(pressureAngleDegreeState)
  const [, setHoleDiameter] = useRecoilState(holeDiameterState)
  const pitchDiameter = useRecoilValue(pitchDiameterState)
  const tipRadius = useRecoilValue(tipRadiusState)

  // Svg margin: proportional to tip radius
  const svgMargin = tipRadius / 10

  // Circle visibility
  const [showCircle, setShowCircle] = useState<boolean>(true)

  // svg size
  const [svgSize, setSvgSize] = useState<number>(0);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Max size of svg is 800
  const updateSize = () => {
    if (svgContainerRef.current) {
      const newSize = Math.min(svgContainerRef.current.clientWidth, 800);
      setSvgSize(newSize);
    }
  };

  // Update size when mounted and resized
  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // For svg download
  const svgRef = useRef(null)
  const handleDownload = () => {
    const svgElement = svgRef.current
    if (!svgElement) return
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'image.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  };

  return (
    <>
      <Box p={4}>
        <Heading mb={4}>Parameters</Heading>
        <VStack spacing={4}>
          {/* Number of teeth */}
          <TeethNumberForm teethValue={teethNumber} onChange={setTeethNumber} />
          {/* Module [mm] */}
          <ModuleForm moduleValue={module} onChange={setModule} />
          {/* Pressure angle [deg] */}
          <PressureAngleForm pressureAngleValue={pressureAngleDegree} onChange={setPressureAngleDegree} />
        </VStack>

        <Heading mt={8}>Options</Heading>
        <VStack spacing={4}>
          <HoleDiameterForm onChange={setHoleDiameter}/>
          <VisibilityForm visibilityValue={showCircle} onChange={setShowCircle} />
        </VStack>

        <Heading mt={4}>Rendered Gear</Heading>

        <Box mt={4}>
          <VStack spacing={2}>
            <Text>歯先直径 = {2 * tipRadius} [mm]</Text>
            <Text>ピッチ円直径 = {pitchDiameter} [mm]</Text>
          </VStack>
        </Box>

        {/* Download button */}
        <Button onClick={handleDownload} mt={4}>Download SVG</Button>

        <Box ref={svgContainerRef} display="flex" justifyContent="center" boxSizing='border-box'>
          {/* svg to draw a gear */}
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width={svgSize}
            height={svgSize}
            viewBox={`-${tipRadius + svgMargin} -${tipRadius + svgMargin} ${(tipRadius + svgMargin) * 2} ${(tipRadius + svgMargin) * 2}`}
          >
            <GearSvg showCircle={showCircle} />
          </svg>
        </Box>
      </Box>
    </>
  )
}

export default App
