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

export const cutoutTypeState = atom<'None' | 'Circle' | 'Spoke'>({
  key: 'cutoutTypeState',
  default: 'None'
})

export const cutoutCircleParamsState = atom<{
  diameter: number | null,
  count: number | null,
  distance: number | null,
}>({
  key: 'cutoutCircleParamsState',
  default: { diameter: null, count: null, distance: null },
})

export const cutoutSpokeParamsState = atom<{
  count: number | null,
  innerRadius: number | null,
  outerRadius: number | null,
  ratio: number,
}>({
  key: 'cutoutSpokeParamsState',
  default: { count: null, innerRadius: null, outerRadius: null, ratio: 0.6 }
})
