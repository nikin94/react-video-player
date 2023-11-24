import { useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import { ImageAsset, VideoAsset } from '@/components'
import { IAsset } from '@/lib/interfaces'
import { AssetTypes } from '@/lib/enums'
import { useAssetsStore } from '@/store/AssetsStore'
import constants from '@/lib/constants'

const { IMAGE_BASE_WIDTH, VIDEO_BASE_WIDTH } = constants

const AssetContainer = ({ asset }: { asset: IAsset }) => {
  const { id, url, type, position } = asset
  const [isResizing, setIsResizing] = useState(false)
  const [localSize, setLocalSize] = useState({ width: 0, height: 0 })

  // useEffect(() => {
  //   setMinSize({
  //     width: asset.size.width,
  //     height: asset.size.height
  //   })
  // }, []) // set assets as object

  const {
    setAssetSize,
    setAssetPosition,
    setAssetZIndexToMaximal,
    getAssetsCount
  } = useAssetsStore()

  return (
    <Rnd
      bounds='parent'
      lockAspectRatio
      style={{ zIndex: asset.zIndex }}
      position={{ x: position.x, y: position.y }}
      onMouseDown={e => {
        const assetsCount = getAssetsCount()
        if (assetsCount !== asset.zIndex) setAssetZIndexToMaximal(url)
      }}
      onDragStop={(e, d) => setAssetPosition(id, d.x, d.y)}
      onResize={(e, direction, ref, delta, _position) => {
        // setAssetSize(id, parseInt(ref.style.width), parseInt(ref.style.height))
      }}
      onResizeStart={(e, d, ref) => {
        setIsResizing(true)
      }}
      onResizeStop={(e, direction, ref, delta, _position) => {
        setIsResizing(false)
        setAssetPosition(id, _position.x, _position.y)
        setAssetSize(id, parseInt(ref.style.width), parseInt(ref.style.height))
      }}
    >
      {type === AssetTypes.image && (
        <ImageAsset asset={asset} isResizing={isResizing} />
      )}
      {type === AssetTypes.video && (
        <VideoAsset asset={asset} isResizing={isResizing} />
      )}
    </Rnd>
  )
}

export default AssetContainer
