import { FC, useState, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import './App.css'
import { Box, Button, Heading, VStack } from '@chakra-ui/react'
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
  maxInvoluteAngleState,
} from './recoil'

// Involute function (angle: radian)
const invloluteFunc = (angle: number) => Math.tan(angle) - angle


const App: FC = () => {
  const INVOLUTE_RESOLUTION = 20

  const [teethNumber, setTeethNumber] = useRecoilState(teethNumberState)
  const [module, setModule] = useRecoilState(moduleState)
  const [pressureAngleDegree, setPressureAngleDegree] = useRecoilState(pressureAngleDegreeState)
  const pitchDiameter = useRecoilValue(pitchDiameterState)
  const pressureAngle = useRecoilValue(pressureAngleState)
  const pitchRadius = useRecoilValue(pitchRadiusState)
  const baseRadius = useRecoilValue(baseRadiusState)
  const tipRadius = useRecoilValue(tipRadiusState)
  const rootRadius = useRecoilValue(rootRadiusState)
  const maxInvoluteAngle = useRecoilValue(maxInvoluteAngleState)

  // Stroke width, svg margin: proportional to tip radius
  const strokeWidthThick = tipRadius / 150
  const strokeWidthThin = tipRadius / 300
  const svgMargin = tipRadius / 10

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

        <Box mt={8}>teethNumber = {teethNumber}, module = {module}, pitch diameter={pitchDiameter}, pressure angle={pressureAngleDegree}[deg] ({pressureAngle.toFixed(3)}[rad])</Box>
        <p>tip radius = {tipRadius}</p>

        <Heading mt={4}>Rendered Gear</Heading>

        {/* Download button */}
        <Button onClick={handleDownload}>Download SVG</Button>

        <Box ref={svgContainerRef} display="flex" justifyContent="center" boxSizing='border-box'>
          {/* svg to draw a gear */}
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width={svgSize}
            height={svgSize}
            viewBox={`-${tipRadius + svgMargin} -${tipRadius + svgMargin} ${(tipRadius + svgMargin) * 2} ${(tipRadius + svgMargin) * 2}`}
          >
            {/* Circles */}
            <circle cx="0" cy="0" r={tipRadius} fill="none" stroke="#ddd" strokeWidth={strokeWidthThin} />
            <circle cx="0" cy="0" r={pitchRadius} fill="none" stroke="#ddd" strokeWidth={strokeWidthThin} />
            <circle cx="0" cy="0" r={baseRadius} fill="none" stroke="#ddd" strokeWidth={strokeWidthThin} />
            <circle cx="0" cy="0" r={rootRadius} fill="none" stroke="#ddd" strokeWidth={strokeWidthThin} />
            {/* Involute */}
            {Array.from({ length: teethNumber }, (_, i) => {
              const offsetAngle = 2 * i * Math.PI / teethNumber
              const offsetAngle2 = (2 * i + 1) * Math.PI / teethNumber + 2 * invloluteFunc(pressureAngle)
              return (
                <g>
                  {/* root */}
                  <line
                    x1={rootRadius * Math.cos(offsetAngle)}
                    y1={rootRadius * Math.sin(offsetAngle)}
                    x2={baseRadius * Math.cos(offsetAngle)}
                    y2={baseRadius * Math.sin(offsetAngle)}
                    stroke="teal"
                    strokeWidth={strokeWidthThick}
                    key={`root_${i}`}
                  />
                  <line
                    x1={rootRadius * Math.cos(offsetAngle2)}
                    y1={rootRadius * Math.sin(offsetAngle2)}
                    x2={baseRadius * Math.cos(offsetAngle2)}
                    y2={baseRadius * Math.sin(offsetAngle2)}
                    stroke="teal"
                    strokeWidth={strokeWidthThick}
                    key={`root_${i}`}
                  />
                  {/* involute */}
                  {
                    Array.from({ length: INVOLUTE_RESOLUTION }, (_, j) => {
                      const angle = j * maxInvoluteAngle / INVOLUTE_RESOLUTION
                      const nextAngle = (j + 1) * maxInvoluteAngle / INVOLUTE_RESOLUTION
                      return (
                        <line
                          x1={baseRadius * (Math.cos(angle + offsetAngle) + angle * Math.sin(angle + offsetAngle))}
                          y1={baseRadius * (Math.sin(angle + offsetAngle) - angle * Math.cos(angle + offsetAngle))}
                          x2={baseRadius * (Math.cos(nextAngle + offsetAngle) + nextAngle * Math.sin(nextAngle + offsetAngle))}
                          y2={baseRadius * (Math.sin(nextAngle + offsetAngle) - nextAngle * Math.cos(nextAngle + offsetAngle))}
                          stroke="teal"
                          strokeWidth={strokeWidthThick}
                          key={`involute_${i}_${j}`}
                        />
                      )
                    })
                  }
                  {/* Involute (another side) */}
                  {
                    Array.from({ length: INVOLUTE_RESOLUTION }, (_, j) => {
                      const angle = j * maxInvoluteAngle / INVOLUTE_RESOLUTION
                      const nextAngle = (j + 1) * maxInvoluteAngle / INVOLUTE_RESOLUTION
                      return (
                        <line
                          x1={baseRadius * (Math.cos(offsetAngle2 - angle) - angle * Math.sin(offsetAngle2 - angle))}
                          y1={baseRadius * (Math.sin(offsetAngle2 - angle) + angle * Math.cos(offsetAngle2 - angle))}
                          x2={baseRadius * (Math.cos(offsetAngle2 - nextAngle) - nextAngle * Math.sin(offsetAngle2 - nextAngle))}
                          y2={baseRadius * (Math.sin(offsetAngle2 - nextAngle) + nextAngle * Math.cos(offsetAngle2 - nextAngle))}
                          stroke="teal"
                          strokeWidth={strokeWidthThick}
                          key={`involute_${i}_${j}`}
                        />
                      )
                    })
                  }
                </g>
              )
            })}
          </svg>
        </Box>
      </Box>
    </>
  )
}

export default App
