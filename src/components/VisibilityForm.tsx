import { FC } from 'react'
import { FormControl, FormLabel, Switch, HStack } from '@chakra-ui/react'

interface VisibilityFormProps {
  onChange: (val: boolean) => void
  visibilityValue: boolean
}

const VisibilityForm: FC<VisibilityFormProps> = ({ onChange, visibilityValue }) => {
  return (
    <FormControl>
      <HStack spacing={4} align='center'>
        <FormLabel width='full'>基礎円・ピッチ円・歯先円・歯底円 を表示</FormLabel>
        <Switch
          size='lg'
          colorScheme='teal'
          isChecked={visibilityValue}
          onChange={e => onChange(e.target.checked)}
        />
      </HStack>
    </FormControl>
  )
}

export default VisibilityForm
