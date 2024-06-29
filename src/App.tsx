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
  maxInvoluteAngleState,
} from './recoil'

// Involute function (angle: radian)
const invloluteFunc = (angle: number) => Math.tan(angle) - angle


const App: FC = () => {
  const SVG_MARGIN = 10
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
            {/* Circles */}
            <circle cx="0" cy="0" r={tipRadius} fill="none" stroke="#ddd" strokeWidth={0.5} />
            <circle cx="0" cy="0" r={pitchRadius} fill="none" stroke="#ddd" strokeWidth={0.5} />
            <circle cx="0" cy="0" r={baseRadius} fill="none" stroke="#ddd" strokeWidth={0.5} />
            <circle cx="0" cy="0" r={rootRadius} fill="none" stroke="#ddd" strokeWidth={0.5} />
            {/* Involute */}
            {Array.from({ length: teethNumber }, (_, i) => {
              const offsetAngle = 2 * Math.PI * i / teethNumber
              return (
                <g>
                  {/* root */}
                  <line
                    x1={rootRadius * Math.cos(offsetAngle)}
                    y1={rootRadius * Math.sin(offsetAngle)}
                    x2={baseRadius * Math.cos(offsetAngle)}
                    y2={baseRadius * Math.sin(offsetAngle)}
                    stroke="teal"
                    strokeWidth={1}
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
                          strokeWidth={1}
                          key={`involute_${i}_${j}`}
                        />
                      )
                    })
                  }
                </g>
              )
            })}
            {/* Involute (another side) */}
            {Array.from({ length: teethNumber }, (_, i) => {
              const offsetAngle = Math.PI * (2 * i + 1) / teethNumber + 2 * invloluteFunc(pressureAngle)
              return (
                <g>
                  {/* root */}
                  <line
                    x1={rootRadius * Math.cos(offsetAngle)}
                    y1={rootRadius * Math.sin(offsetAngle)}
                    x2={baseRadius * Math.cos(offsetAngle)}
                    y2={baseRadius * Math.sin(offsetAngle)}
                    stroke="teal"
                    strokeWidth={1}
                    key={`root_${i}`}
                  />
                  {/* involute */}
                  {
                    Array.from({ length: INVOLUTE_RESOLUTION }, (_, j) => {
                      const angle = j * maxInvoluteAngle / INVOLUTE_RESOLUTION
                      const nextAngle = (j + 1) * maxInvoluteAngle / INVOLUTE_RESOLUTION
                      return (
                        <line
                          x1={baseRadius * (Math.cos(offsetAngle - angle) - angle * Math.sin(offsetAngle - angle))}
                          y1={baseRadius * (Math.sin(offsetAngle - angle) + angle * Math.cos(offsetAngle - angle))}
                          x2={baseRadius * (Math.cos(offsetAngle - nextAngle) - nextAngle * Math.sin(offsetAngle - nextAngle))}
                          y2={baseRadius * (Math.sin(offsetAngle - nextAngle) + nextAngle * Math.cos(offsetAngle - nextAngle))}
                          stroke="teal"
                          strokeWidth={1}
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
