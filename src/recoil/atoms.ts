import { atom } from "recoil"

export const teethNumberState = atom<number>({
  key: 'teethNumberState',
  default: 12
})

export const moduleState = atom<number>({
  key: 'moduleState',
  default: 1
})
