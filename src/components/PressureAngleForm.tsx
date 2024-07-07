import { FC } from 'react'
import { HStack, FormControl, FormLabel, useRadioGroup } from '@chakra-ui/react'
import RadioCard from './RarioCard'

interface PressureAngleFormProps {
  onChange: (val: number) => void
  pressureAngleValue: number
}

const PressureAngleForm: FC<PressureAngleFormProps> = ({ onChange, pressureAngleValue }) => {
  const pressureAngles = [14.5, 17.5, 20]

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'pressureAngle',
    value: pressureAngleValue.toString(),
    onChange: (val) => onChange(parseFloat(val)),
  })

  const group = getRootProps()

  return (
    <FormControl id="pressureAngle">
      <HStack spacing={4} align="center">
        <FormLabel width="full">圧力角</FormLabel>
        <HStack {...group}>
          {pressureAngles.map(value => {
            const radio = getRadioProps({ value: value.toString() })
            return (
              <RadioCard key={value} {...radio}>
                {`${value}°${value === 20 ? ' (標準)' : ''}`}
              </RadioCard>
            )
          })}
        </HStack>
      </HStack>
    </FormControl>
  )
}

export default PressureAngleForm
