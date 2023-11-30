import { AssetTypes } from '@/lib/enums'

export interface IAssetSize {
  width: number
  height: number
}

interface IAssetPosition {
  x: number
  y: number
}

export interface IBasicAsset {
  url: string
  type: AssetTypes
}

export interface IAsset extends IBasicAsset {
  id: string
  name: string
  zIndex: number
  size: IAssetSize
  position: IAssetPosition
  aspectRatio: number
  draggable?: boolean
  playing?: boolean
  progress?: number
  duration?: number
  borderDisabled?: boolean
  frameAspectRatioUnlocked?: boolean
}
