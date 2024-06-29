import { FC, useState, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import './App.css'
import { Box, Heading, VStack } from '@chakra-ui/react'
import TeethNumberForm from './components/TeethNumberForm.tsx'
import ModuleForm from './components/ModuleForm.tsx'
import PressureAngleForm from './components/PressureAngleForm.tsx'
import {
  teethNumberState,
  moduleState,
  pressureAngleDegreeState,
  pitchDiameterState,
  pressureAngleState,
  pitchRadiusState,
  baseRadiusState,
  tipRadiusState,
  rootRadiusState,
} from './recoil'


const App: FC = () => {
  const SVG_MARGIN = 10

  const [teethNumber, setTeethNumber] = useRecoilState(teethNumberState)
  const [module, setModule] = useRecoilState(moduleState)
  const [pressureAngleDegree, setPressureAngleDegree] = useRecoilState(pressureAngleDegreeState)
  const pitchDiameter = useRecoilValue(pitchDiameterState)
  const pressureAngle = useRecoilValue(pressureAngleState)
  const pitchRadius = useRecoilValue(pitchRadiusState)
  const baseRadius = useRecoilValue(baseRadiusState)
  const tipRadius = useRecoilValue(tipRadiusState)
  const rootRadius = useRecoilValue(rootRadiusState)

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

        <Box mt={8}>teethNumber = {teethNumber}, module = {module}, pitch diameter={pitchDiameter}, pressure angle={pressureAngleDegree}[deg] ({pressureAngle.toFixed(3)}[rad])</Box>
        <p>tip radius = {tipRadius}</p>

        <Box mt={8} ref={svgContainerRef} display="flex" justifyContent="center" boxSizing='border-box'>
          {/* svg to draw a gear */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={svgSize}
            height={svgSize}
            viewBox={`-${tipRadius + SVG_MARGIN} -${tipRadius + SVG_MARGIN} ${(tipRadius + SVG_MARGIN) * 2} ${(tipRadius + SVG_MARGIN) * 2}`}
          >
            <circle cx="0" cy="0" r={tipRadius} fill="none" stroke="#ddd" strokeWidth={0.5} />
            <circle cx="0" cy="0" r={pitchRadius} fill="none" stroke="#ddd" strokeWidth={0.5} />
            <circle cx="0" cy="0" r={baseRadius} fill="none" stroke="#ddd" strokeWidth={0.5} />
            <circle cx="0" cy="0" r={rootRadius} fill="none" stroke="#ddd" strokeWidth={0.5} />
          </svg>
        </Box>
      </Box>
    </>
  )
}

export default App
