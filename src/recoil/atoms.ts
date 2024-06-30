import { atom } from "recoil"

export const teethNumberState = atom<number>({
  key: 'teethNumberState',
  default: 12
})

export const moduleState = atom<number>({
  key: 'moduleState',
  default: 1
})

export const pressureAngleDegreeState = atom<number>({
  key: 'pressureAngleDegreeState',
  default: 20
})

export const holeDiameterState = atom<number | null>({
  key: 'holeDiameterState',
  default: null // null means no hole
})
