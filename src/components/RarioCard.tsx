import { FC, ReactNode } from 'react'
import { useRadio, UseRadioProps, Box } from '@chakra-ui/react'

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

export default RadioCard
