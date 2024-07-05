import { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  teethNumberState,
  holeDiameterState,
  pressureAngleState,
  pitchRadiusState,
  baseRadiusState,
  tipRadiusState,
  rootRadiusState,
  maxInvoluteAngleState,
} from '../recoil'

// Involute function (angle: radian)
const invloluteFunc = (angle: number) => Math.tan(angle) - angle

interface GearSvgProps {
  showCircle: boolean
}

const GearSvg: FC<GearSvgProps> = ({ showCircle }) => {
  const INVOLUTE_RESOLUTION = 20

  const [teethNumber] = useRecoilState(teethNumberState)
  const [holeDiameter] = useRecoilState(holeDiameterState)
  const pressureAngle = useRecoilValue(pressureAngleState)
  const pitchRadius = useRecoilValue(pitchRadiusState)
  const baseRadius = useRecoilValue(baseRadiusState)
  const tipRadius = useRecoilValue(tipRadiusState)
  const rootRadius = useRecoilValue(rootRadiusState)
  const maxInvoluteAngle = useRecoilValue(maxInvoluteAngleState)

  // Stroke width: proportional to tip radius
  const strokeWidthThick = tipRadius / 150
  const strokeWidthThin = tipRadius / 300

  return (
    <>
      {/* Circles */}
      {showCircle && (
        <g>
          <circle cx="0" cy="0" r={tipRadius} fill="none" stroke="#ddd" strokeWidth={strokeWidthThin} />
          <circle cx="0" cy="0" r={pitchRadius} fill="none" stroke="#ddd" strokeWidth={strokeWidthThin} />
          <circle cx="0" cy="0" r={baseRadius} fill="none" stroke="#ddd" strokeWidth={strokeWidthThin} />
          <circle cx="0" cy="0" r={rootRadius} fill="none" stroke="#ddd" strokeWidth={strokeWidthThin} />
        </g>
      )}
      {/* Hole */}
      {holeDiameter && <circle cx="0" cy="0" r={holeDiameter / 2} fill="none" stroke="teal" strokeWidth={strokeWidthThick} />}
      {/* Involute */}
      {Array.from({ length: teethNumber }, (_, i) => {
        const offsetAngle = 2 * i * Math.PI / teethNumber
        const offsetAngle2 = (2 * i + 1) * Math.PI / teethNumber + 2 * invloluteFunc(pressureAngle)
        const tip = {
          x1: baseRadius * (Math.cos(maxInvoluteAngle + offsetAngle) + maxInvoluteAngle * Math.sin(maxInvoluteAngle + offsetAngle)),
          y1: baseRadius * (Math.sin(maxInvoluteAngle + offsetAngle) - maxInvoluteAngle * Math.cos(maxInvoluteAngle + offsetAngle)),
          x2: baseRadius * (Math.cos(offsetAngle2 - maxInvoluteAngle) - maxInvoluteAngle * Math.sin(offsetAngle2 - maxInvoluteAngle)),
          y2: baseRadius * (Math.sin(offsetAngle2 - maxInvoluteAngle) + maxInvoluteAngle * Math.cos(offsetAngle2 - maxInvoluteAngle)),
        }
        const root = {
          x1: rootRadius * Math.cos(offsetAngle2),
          y1: rootRadius * Math.sin(offsetAngle2),
          x2: rootRadius * Math.cos(2 * (i + 1) * Math.PI / teethNumber),
          y2: rootRadius * Math.sin(2 * (i + 1) * Math.PI / teethNumber),
        }
        return (
          <g key={`g_${i}`}>
            {/* root */}
            <line
              x1={rootRadius * Math.cos(offsetAngle)}
              y1={rootRadius * Math.sin(offsetAngle)}
              x2={baseRadius * Math.cos(offsetAngle)}
              y2={baseRadius * Math.sin(offsetAngle)}
              stroke="teal"
              strokeWidth={strokeWidthThick}
              key={`root_${i}`}
            />
            <line
              x1={rootRadius * Math.cos(offsetAngle2)}
              y1={rootRadius * Math.sin(offsetAngle2)}
              x2={baseRadius * Math.cos(offsetAngle2)}
              y2={baseRadius * Math.sin(offsetAngle2)}
              stroke="teal"
              strokeWidth={strokeWidthThick}
              key={`root_2_${i}`}
            />
            {/* tip arc */}
            <path
              d={`M ${tip.x1},${tip.y1} A ${tipRadius},${tipRadius} 0 0,1 ${tip.x2},${tip.y2}`}
              stroke="teal"
              strokeWidth={strokeWidthThick}
              fill="none"
            />
            {/* root arc */}
            <path
              d={`M ${root.x1},${root.y1} A ${rootRadius},${rootRadius} 0 0,1 ${root.x2},${root.y2}`}
              stroke="teal"
              strokeWidth={strokeWidthThick}
              fill="none"
            />
            {/* involute */}
            {
              Array.from({ length: INVOLUTE_RESOLUTION }, (_, j) => {
                const angle = j * maxInvoluteAngle / INVOLUTE_RESOLUTION
                const nextAngle = (j + 1) * maxInvoluteAngle / INVOLUTE_RESOLUTION
                return (
                  <line
                    x1={baseRadius * (Math.cos(angle + offsetAngle) + angle * Math.sin(angle + offsetAngle))}
                    y1={baseRadius * (Math.sin(angle + offsetAngle) - angle * Math.cos(angle + offsetAngle))}
                    x2={baseRadius * (Math.cos(nextAngle + offsetAngle) + nextAngle * Math.sin(nextAngle + offsetAngle))}
                    y2={baseRadius * (Math.sin(nextAngle + offsetAngle) - nextAngle * Math.cos(nextAngle + offsetAngle))}
                    stroke="teal"
                    strokeWidth={strokeWidthThick}
                    key={`involute_${i}_${j}`}
                  />
                )
              })
            }
            {/* Involute (another side) */}
            {
              Array.from({ length: INVOLUTE_RESOLUTION }, (_, j) => {
                const angle = j * maxInvoluteAngle / INVOLUTE_RESOLUTION
                const nextAngle = (j + 1) * maxInvoluteAngle / INVOLUTE_RESOLUTION
                return (
                  <line
                    x1={baseRadius * (Math.cos(offsetAngle2 - angle) - angle * Math.sin(offsetAngle2 - angle))}
                    y1={baseRadius * (Math.sin(offsetAngle2 - angle) + angle * Math.cos(offsetAngle2 - angle))}
                    x2={baseRadius * (Math.cos(offsetAngle2 - nextAngle) - nextAngle * Math.sin(offsetAngle2 - nextAngle))}
                    y2={baseRadius * (Math.sin(offsetAngle2 - nextAngle) + nextAngle * Math.cos(offsetAngle2 - nextAngle))}
                    stroke="teal"
                    strokeWidth={strokeWidthThick}
                    key={`involute_${i}_${j}`}
                  />
                )
              })
            }
          </g>
        )
      })}
    </>
  )
}

export default GearSvg
