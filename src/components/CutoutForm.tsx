import { FC, useState } from 'react'
import {
  HStack,
  VStack,
  FormControl,
  FormLabel,
  useRadioGroup,
  Input,
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { cutoutTypeState, cutoutCircleParamsState, cutoutSpokeParamsState, pitchRadiusState } from '../recoil'
import RadioCard from './RarioCard'

type CutoutType = 'None' | 'Circle' | 'Spoke'

const cutoutTypes: { value: CutoutType, label: string }[] = [
  { value: 'None', label: 'なし' },
  { value: 'Circle', label: '円形' },
  { value: 'Spoke', label: 'スポーク' },
]

interface CutoutFormProps { }

const CutoutForm: FC<CutoutFormProps> = () => {
  const [cutoutType, setCutoutType] = useRecoilState(cutoutTypeState)
  const [cutoutCircleParams, setCutoutCircleParams] = useRecoilState(cutoutCircleParamsState)
  const [cutoutSpokeParams, setCutoutSpokeParams] = useRecoilState(cutoutSpokeParamsState)
  const pitchRadius = useRecoilValue(pitchRadiusState)

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'cutoutType',
    value: cutoutType,
    onChange: (val) => {
      // Set initial parameters proportional to pitch radius if null
      if (val === 'Circle') {
        const newParams = { ...cutoutCircleParams }
        if (cutoutCircleParams.distance === null) {
          newParams.distance = Math.floor(pitchRadius / 2)
        }
        if (cutoutCircleParams.diameter === null) {
          newParams.diameter = Math.floor(pitchRadius / 5)
        }
        setCutoutCircleParams(newParams)
      }
      if (val === 'Spoke') {
        const newParams = { ...cutoutSpokeParams }
        if (cutoutSpokeParams.innerRadius === null) {
          newParams.innerRadius = Math.floor(pitchRadius * 0.3)
        }
        if (cutoutSpokeParams.outerRadius === null) {
          newParams.outerRadius = Math.floor(pitchRadius * 0.7)
        }
        setCutoutSpokeParams(newParams)
      }
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
              <FormLabel minWidth={40}>個数</FormLabel>
              <ParamInput
                numberType='int'
                onChange={val => setCutoutCircleParams({ ...cutoutCircleParams, count: val })}
                label='切り抜き円の個数'
                value={cutoutCircleParams.count}
              />
            </HStack>
            <HStack spacing={4} align="center" width='full'>
              <FormLabel minWidth={40}>直径[mm]</FormLabel>
              <ParamInput
                numberType='float'
                onChange={val => setCutoutCircleParams({ ...cutoutCircleParams, diameter: val })}
                label='切り抜き円の直径[mm]'
                value={cutoutCircleParams.diameter}
              />
            </HStack>
            <HStack spacing={4} align="center" width='full'>
              <FormLabel minWidth={40}>距離[mm]</FormLabel>
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

      {cutoutType === 'Spoke' && (
        <FormControl id="cutoutCircle" bg='gray.100' p={4} borderRadius={4}>
          <VStack spacing={2} align="center">
            <Heading size='sm' pb={2}>スポーク状切り抜き</Heading>
            <HStack spacing={4} align="center" width='full'>
              <FormLabel minWidth={40}>個数</FormLabel>
              <ParamInput
                numberType='int'
                onChange={val => setCutoutSpokeParams({ ...cutoutSpokeParams, count: val })}
                label='切り抜きの個数'
                value={cutoutSpokeParams.count}
              />
            </HStack>
            <HStack spacing={4} align="center" width='full'>
              <FormLabel minWidth={40}>内径[mm]</FormLabel>
              <ParamInput
                numberType='float'
                onChange={val => setCutoutSpokeParams({ ...cutoutSpokeParams, innerRadius: val })}
                label='内径[mm]'
                value={cutoutSpokeParams.innerRadius}
              />
            </HStack>
            <HStack spacing={4} align="center" width='full'>
              <FormLabel minWidth={40}>外径[mm]</FormLabel>
              <ParamInput
                numberType='float'
                onChange={val => setCutoutSpokeParams({ ...cutoutSpokeParams, outerRadius: val })}
                label='外径[mm]'
                value={cutoutSpokeParams.outerRadius}
              />
            </HStack>
            <HStack spacing={4} align="center" width='full' mb={4}>
              <FormLabel minWidth={40}>切り抜き率</FormLabel>
              <Slider
                value={cutoutSpokeParams.ratio}
                min={0.1}
                max={0.9}
                step={0.05}
                onChange={val => setCutoutSpokeParams({ ...cutoutSpokeParams, ratio: val })}
                colorScheme='teal'
              >
                <SliderMark
                  value={cutoutSpokeParams.ratio}
                  textAlign='center'
                  bg='teal'
                  color='white'
                  mt='3'
                  ml='-5'
                  w='12'
                  borderRadius={8}
                >
                  {cutoutSpokeParams.ratio * 100}%
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
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
