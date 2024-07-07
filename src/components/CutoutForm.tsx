import { FC, useState } from 'react'
import { HStack, VStack, FormControl, FormLabel, useRadioGroup, Input, Heading } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { cutoutTypeState, cutoutCircleParamsState } from '../recoil/atoms'
import RadioCard from './RarioCard'

type CutoutType = 'None' | 'Circle' | 'Triangle'

const cutoutTypes: { value: CutoutType, label: string }[] = [
  { value: 'None', label: 'なし' },
  { value: 'Circle', label: '円形' },
  // { value: 'Triangle', label: '三角形' },
]

interface CutoutFormProps { }

const CutoutForm: FC<CutoutFormProps> = () => {
  const [cutoutType, setCutoutType] = useRecoilState(cutoutTypeState)
  const [cutoutCircleParams, setCutoutCircleParams] = useRecoilState(cutoutCircleParamsState)

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'cutoutType',
    value: cutoutType,
    onChange: (val) => {
      setCutoutType(val as CutoutType)
    },
  })

  const group = getRootProps()

  return (
    <>
      <FormControl id="cutoutType">
        <HStack spacing={4} align="center">
          <FormLabel width="full">切り抜き</FormLabel>
          <HStack {...group}>
            {cutoutTypes.map(({ label, value }) => {
              const radio = getRadioProps({ value })
              return (
                <RadioCard key={label} {...radio}>
                  {`${label}`}
                </RadioCard>
              )
            })}
          </HStack>
        </HStack>
      </FormControl>

      {cutoutType === 'Circle' && (
        <FormControl id="cutoutCircle" bg='gray.100' p={4} borderRadius={4}>
          <VStack spacing={2} align="center">
            <Heading size='sm' pb={2}>円形切り抜き</Heading>
            <HStack spacing={4} align="center" width='full'>
              <FormLabel minWidth={40}>直径</FormLabel>
              <ParamInput
                numberType='float'
                onChange={val => setCutoutCircleParams({ ...cutoutCircleParams, diameter: val })}
                label='切り抜き円の直径[mm]'
                value={cutoutCircleParams.diameter}
              />
            </HStack>
            <HStack spacing={4} align="center" width='full'>
              <FormLabel minWidth={40}>個数</FormLabel>
              <ParamInput
                numberType='int'
                onChange={val => setCutoutCircleParams({ ...cutoutCircleParams, count: val })}
                label='切り抜き円の個数'
                value={cutoutCircleParams.count}
              />
            </HStack>
            <HStack spacing={4} align="center" width='full'>
              <FormLabel minWidth={40}>距離</FormLabel>
              <ParamInput
                numberType='float'
                onChange={val => setCutoutCircleParams({ ...cutoutCircleParams, distance: val })}
                label='中心からの距離[mm]'
                value={cutoutCircleParams.distance}
              />
            </HStack>
          </VStack>
        </FormControl>
      )}
    </>
  )
}

export default CutoutForm


interface ParamInputProps {
  onChange: (val: number | null) => void
  label: string
  numberType: 'float' | 'int'
  value: number | null
}

const ParamInput: FC<ParamInputProps> = ({ onChange, label, numberType, value }) => {
  const parse = numberType === 'float' ? parseFloat : parseInt
  const [strValue, setStrValue] = useState<string>(value ? value.toString() : '')

  const handleChange = (val: string) => {
    setStrValue(val)
    const numValue = parse(val)
    if (!isNaN(numValue) && numValue >= 0) {
      if (numberType === 'int') setStrValue(numValue.toString())
      onChange(numValue)
    } else {
      onChange(null)
    }
  }

  return (
    <Input
      bg='white'
      value={strValue}
      onChange={e => handleChange(e.target.value)}
      errorBorderColor='crimson'
      isInvalid={!!strValue && (isNaN(parse(strValue)) || parse(strValue) < 0)}
      placeholder={label}
    />
  )
}
