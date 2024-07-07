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
  cutoutTypeState,
  cutoutCircleParamsState,
  cutoutSpokeParamsState,
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
  const [cutoutType] = useRecoilState(cutoutTypeState)
  const [cutoutCircleParams] = useRecoilState(cutoutCircleParamsState)
  const [cutoutSpokeParams] = useRecoilState(cutoutSpokeParamsState)
  const pressureAngle = useRecoilValue(pressureAngleState)
  const pitchRadius = useRecoilValue(pitchRadiusState)
  const baseRadius = useRecoilValue(baseRadiusState)
  const tipRadius = useRecoilValue(tipRadiusState)
  const rootRadius = useRecoilValue(rootRadiusState)
  const maxInvoluteAngle = useRecoilValue(maxInvoluteAngleState)

  const isCutoutCircleParamsNonNull = (
    param: { diameter: number | null, count: number | null, distance: number | null }
  ): param is { diameter: number, count: number, distance: number } => (
    param.diameter !== null &&
    param.count !== null &&
    param.distance !== null
  )
  const isCutoutSpokeParamsNonNull = (
    param: { count: number | null, innerRadius: number | null, outerRadius: number | null }
  ): param is { count: number, innerRadius: number, outerRadius: number } => (
    param.count !== null &&
    param.innerRadius !== null &&
    param.outerRadius !== null
  )

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
      {/* Center Hole */}
      {holeDiameter && <circle cx="0" cy="0" r={holeDiameter / 2} fill="none" stroke="teal" strokeWidth={strokeWidthThick} />}
      {/* Other Holes */}
      {cutoutType === 'Circle' && isCutoutCircleParamsNonNull(cutoutCircleParams) && (
        Array.from({ length: cutoutCircleParams.count }, (_, i) => {
          const angle = 2 * i * Math.PI / cutoutCircleParams.count
          return (
            <circle
              key={`cutout_circle_${i}`}
              cx={cutoutCircleParams.distance * Math.cos(angle)}
              cy={cutoutCircleParams.distance * Math.sin(angle)}
              r={cutoutCircleParams.diameter / 2}
              fill='none'
              stroke='teal'
              strokeWidth={strokeWidthThick}
            />
          )
        })
      )}
      {/* Spoke */}
      {cutoutType === 'Spoke' && isCutoutSpokeParamsNonNull(cutoutSpokeParams) && (
        Array.from({ length: cutoutSpokeParams.count }, (_, i) => {
          const angle1 = 2 * i * Math.PI / cutoutSpokeParams.count
          const angle2 = 2 * (i + 1) * Math.PI / cutoutSpokeParams.count
          const dAngle = (angle2 - angle1) * (1 - cutoutSpokeParams.ratio) / 2

          const inner = {
            start: {
              x: cutoutSpokeParams.innerRadius * Math.cos(angle1 + dAngle),
              y: cutoutSpokeParams.innerRadius * Math.sin(angle1 + dAngle),
            },
            end: {
              x: cutoutSpokeParams.innerRadius * Math.cos(angle2 - dAngle),
              y: cutoutSpokeParams.innerRadius * Math.sin(angle2 - dAngle),
            }
          }
          const outer = {
            start: {
              x: cutoutSpokeParams.outerRadius * Math.cos(angle1 + dAngle),
              y: cutoutSpokeParams.outerRadius * Math.sin(angle1 + dAngle),
            },
            end: {
              x: cutoutSpokeParams.outerRadius * Math.cos(angle2 - dAngle),
              y: cutoutSpokeParams.outerRadius * Math.sin(angle2 - dAngle),
            }
          }
          return (
            <g key={`cutout_spoke_${i}`}>
              <path
                d={`M ${inner.start.x},${inner.start.y} A ${cutoutSpokeParams.innerRadius},${cutoutSpokeParams.innerRadius} 0 0,1 ${inner.end.x},${inner.end.y}`}
                stroke='teal'
                strokeWidth={strokeWidthThick}
                fill='none'
              />
              <path
                d={`M ${outer.start.x},${outer.start.y} A ${cutoutSpokeParams.outerRadius},${cutoutSpokeParams.outerRadius} 0 0,1 ${outer.end.x},${outer.end.y}`}
                stroke='teal'
                strokeWidth={strokeWidthThick}
                fill='none'
              />
              <line
                x1={inner.start.x}
                y1={inner.start.y}
                x2={outer.start.x}
                y2={outer.start.y}
                stroke='teal'
                strokeWidth={strokeWidthThick}
              />
              <line
                x1={inner.end.x}
                y1={inner.end.y}
                x2={outer.end.x}
                y2={outer.end.y}
                stroke='teal'
                strokeWidth={strokeWidthThick}
              />
            </g>
          )
        })
      )}
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
            <path
              d={
                `M ${baseRadius * Math.cos(offsetAngle)} ${baseRadius * Math.sin(offsetAngle)}` +
                Array.from({ length: INVOLUTE_RESOLUTION }, (_, j) => {
                  const angle = (j + 1) * maxInvoluteAngle / INVOLUTE_RESOLUTION;
                  const x = baseRadius * (Math.cos(angle + offsetAngle) + angle * Math.sin(angle + offsetAngle));
                  const y = baseRadius * (Math.sin(angle + offsetAngle) - angle * Math.cos(angle + offsetAngle));
                  return ` L ${x} ${y}`;
                }).join('')
              }
              stroke="teal"
              strokeWidth={strokeWidthThick}
              fill="none"
            />
            {/* Involute (another side) */}
            <path
              d={
                `M ${baseRadius * Math.cos(offsetAngle2)} ${baseRadius * Math.sin(offsetAngle2)}` +
                Array.from({ length: INVOLUTE_RESOLUTION }, (_, j) => {
                  const angle = (j + 1) * maxInvoluteAngle / INVOLUTE_RESOLUTION;
                  const x = baseRadius * (Math.cos(offsetAngle2 - angle) - angle * Math.sin(offsetAngle2 - angle));
                  const y = baseRadius * (Math.sin(offsetAngle2 - angle) + angle * Math.cos(offsetAngle2 - angle));
                  return ` L ${x} ${y}`;
                }).join('')
              }
              stroke="teal"
              strokeWidth={strokeWidthThick}
              fill="none"
            />
          </g>
        )
      })}
    </>
  )
}

export default GearSvg
