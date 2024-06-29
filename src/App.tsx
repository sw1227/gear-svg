import { FC } from 'react'
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
} from './recoil'


const App: FC = () => {
  const [teethNumber, setTeethNumber] = useRecoilState(teethNumberState)
  const [module, setModule] = useRecoilState(moduleState)
  const [pressureAngleDegree, setPressureAngleDegree] = useRecoilState(pressureAngleDegreeState)
  const pitchDiameter = useRecoilValue(pitchDiameterState)

  const handleTeethChange = (val: number) => {
    setTeethNumber(val)
  }
  const handleModuleChange = (val: number) => {
    setModule(val)
  }
  const handlePressureAngleChange = (val: number) => {
    setPressureAngleDegree(val)
  }

  return (
    <>
      <Box p={4}>
        <Heading mb={4}>Parameters</Heading>
        <VStack spacing={4}>
          {/* Number of teeth */}
          <TeethNumberForm teethValue={teethNumber} onChange={handleTeethChange} />
          {/* Module [mm] */}
          <ModuleForm moduleValue={module} onChange={handleModuleChange} />
          {/* Pressure angle [deg] */}
          <PressureAngleForm pressureAngleValue={pressureAngleDegree} onChange={handlePressureAngleChange} />
        </VStack>

        <Box mt={8}>teethNumber = {teethNumber}, module = {module}, pitch diameter={pitchDiameter}, pressure angle={pressureAngleDegree}</Box>
      </Box>
    </>
  )
}

export default App
