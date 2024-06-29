import { FC } from 'react'
import { HStack, FormControl, FormLabel, Select } from '@chakra-ui/react'

interface ModuleFormProps {
  onChange: (val: number) => void
  moduleValue: number
}

const ModuleForm: FC<ModuleFormProps> = ({ onChange, moduleValue }) => {
  const iSeries = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50]
  const iiSeries = [1.125, 1.375, 1.75, 2.25, 2.75, 3.5, 4.5, 5.5, 6.5, 7, 9, 11, 14, 18, 22, 28, 36, 45]

  return (
    <FormControl id="module">
      <HStack spacing={4} align="center">
        <FormLabel width="full">モジュール</FormLabel>
        <Select
          placeholder="モジュール値を選択"
          value={moduleValue}
          onChange={e => onChange(parseFloat(e.target.value))}
        >
          <optgroup label="I系列 (優先)">
            {iSeries.map(value => (
              <option key={`I-${value}`} value={value}>
                {`${value} [mm]`}
              </option>
            ))}
          </optgroup>
          <optgroup label="II系列">
            {iiSeries.map(value => (
              <option key={`II-${value}`} value={value}>
                {`${value} [mm]`}
              </option>
            ))}
          </optgroup>
        </Select>
      </HStack>
    </FormControl>
  );
};

export default ModuleForm
