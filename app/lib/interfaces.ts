import { AssetTypes } from '@/lib/enums'

interface IAssetSize {
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
}
