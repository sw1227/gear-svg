import { FC } from 'react'
import {
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

interface TeethNumberFormProps {
  onChange: (val: number) => void
  teethValue?: number
}

const TeethNumberForm: FC<TeethNumberFormProps> = ({ onChange, teethValue }) => {
  return (
    <FormControl id="teeth">
      <HStack spacing={4} align="center">
        <FormLabel width="full">歯数</FormLabel>
        <NumberInput
          defaultValue={12}
          min={3}
          value={teethValue}
          onChange={(_, val) => onChange(val)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
    </FormControl>
  )
}
export default TeethNumberForm
