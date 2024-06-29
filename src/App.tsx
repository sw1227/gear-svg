import { FC } from 'react'
import './App.css'
import { Box, Heading, VStack } from '@chakra-ui/react'
import ModuleForm from './components/ModuleForm.tsx'
import TeethNumberForm from './components/TeethNumberForm.tsx'

const App: FC = () => {
  const handleTeethChange = (val: number) => {
    console.log('teeth', val)
  }
  const handleModuleChange = (val: number) => {
    console.log('module', val)
  }

  return (
    <>
      <Box p={4}>
        <Heading mb={4}>Parameters</Heading>
        <VStack spacing={4}>
          {/* Number of teeth */}
          <TeethNumberForm onChange={handleTeethChange} />
          {/* Module [mm] */}
          <ModuleForm onChange={handleModuleChange} />
        </VStack>
      </Box>
    </>
  )
}

export default App
