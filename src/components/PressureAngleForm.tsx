import { FC, ReactNode } from 'react'
import { HStack, FormControl, FormLabel, useRadio, useRadioGroup, UseRadioProps, Box } from '@chakra-ui/react'

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

interface RadioCardProps extends UseRadioProps {
  children: ReactNode
}

const RadioCard: FC<RadioCardProps> = (props) => {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'teal.600',
          color: 'white',
        }}
        px={4}
        py={2}
        minWidth="110px"
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default PressureAngleForm
