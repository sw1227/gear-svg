import { selector } from 'recoil'
import { teethNumberState, moduleState } from './atoms'

// Pitch diameter [mm] = module * number of teeth
// Pirch circle is identical to reference circle in standard spur gear
export const pitchDiameterState = selector<number>({
  key: 'pitchDiameterState',
  get: ({ get }) => {
    const teethNumber = get(teethNumberState)
    const module = get(moduleState)
    return module * teethNumber
  }
})
