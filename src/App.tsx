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
} from './recoil'


const App: FC = () => {
  const [teethNumber, setTeethNumber] = useRecoilState(teethNumberState)
  const [module, setModule] = useRecoilState(moduleState)
  const [pressureAngleDegree, setPressureAngleDegree] = useRecoilState(pressureAngleDegreeState)
  const pitchDiameter = useRecoilValue(pitchDiameterState)
  const pressureAngle = useRecoilValue(pressureAngleState)

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

        <Box mt={8} ref={svgContainerRef} display="flex" justifyContent="center" boxSizing='border-box'>
          {/* TODO: 歯車の収まるviewBoxを設定 */}
          <svg xmlns="http://www.w3.org/2000/svg" width={svgSize} height={svgSize} viewBox="-50 -50 100 100">
            <circle cx="0" cy="0" r="50" fill="none" stroke="blue" />
          </svg>
        </Box>
      </Box>
    </>
  )
}

export default App
