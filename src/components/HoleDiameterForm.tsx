import { FC, useState } from 'react'
import {
  HStack,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'

interface HoleDiameterFormProps {
  onChange: (val: number | null) => void
}

const HoleDiameterForm: FC<HoleDiameterFormProps> = ({ onChange }) => {
  const [strValue, setStrValue] = useState<string>('')

  const handleChange = (val: string) => {
    setStrValue(val)
    const floatVal = parseFloat(val)
    if (!isNaN(floatVal) && floatVal >= 0) {
      onChange(floatVal)
    } else {
      onChange(null)
    }
  }

  return (
    <FormControl id="holeDiameter">
      <HStack spacing={4} align="center">
        <FormLabel width="full">軸穴径</FormLabel>
        <Input
          value={strValue}
          onChange={e => handleChange(e.target.value)}
          errorBorderColor='crimson'
          isInvalid={!!strValue && (isNaN(parseFloat(strValue)) || parseFloat(strValue) < 0)}
          placeholder='直径[mm]'
        >
        </Input>
      </HStack>
    </FormControl>
  )
}
export default HoleDiameterForm