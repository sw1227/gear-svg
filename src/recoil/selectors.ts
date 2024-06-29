import { selector } from 'recoil'
import { teethNumberState, moduleState, pressureAngleDegreeState } from './atoms'

// Pressure angle [rad]
export const pressureAngleState = selector<number>({
  key: 'pressureAngleState',
  get: ({ get }) => {
    return get(pressureAngleDegreeState) * Math.PI / 180
  }
})

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

// Pitch radius [mm] = pitch diameter / 2
export const pitchRadiusState = selector<number>({
  key: 'pitchRadiusState',
  get: ({ get }) => {
    return get(pitchDiameterState) / 2
  }
})

// Base radius [mm] = Pitch radius * cos(pressure angle)
export const baseRadiusState = selector<number>({
  key: 'baseRadiusState',
  get: ({ get }) => {
    const pitchRadius = get(pitchRadiusState)
    const pressureAngle = get(pressureAngleState)
    return pitchRadius * Math.cos(pressureAngle)
  }
})

// Tip radius [mm] = Pitch radius + module
export const tipRadiusState = selector<number>({
  key: 'tipRadiusState',
  get: ({ get }) => {
    return get(pitchRadiusState) + get(moduleState)
  }
})

// Root radius [mm] = Pitch radius - 1.25 * module
export const rootRadiusState = selector<number>({
  key: 'rootRadiusState',
  get: ({ get }) => {
    return get(pitchRadiusState) - 1.25 * get(moduleState)
  }
})
