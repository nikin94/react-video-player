'use client'
import { useState } from 'react'
import { Rnd } from 'react-rnd'
import { ImageAsset, VideoAsset } from '@/components'
import { IAsset } from '@/lib/interfaces'
import { AssetTypes } from '@/lib/enums'
import { useAssetsStore } from '@/store/AssetsStore'

const AssetContainer = ({ asset }: { asset: IAsset }) => {
  const {
    id,
    type,
    position,
    draggable,
    frameAspectRatioUnlocked,
    borderDisabled
  } = asset
  const [isResizing, setIsResizing] = useState(false)
  const [localSize, setLocalSize] = useState({ width: 0, height: 0 })

  const { setAssetSize, setAssetPosition, setAssetZIndexToMaximal } =
    useAssetsStore()

  return (
    <Rnd
      bounds='parent'
      lockAspectRatio={!frameAspectRatioUnlocked}
      style={{
        zIndex: asset.zIndex,
        cursor: 'default',
        outline: borderDisabled ? 'none' : '1px solid #333',
        overflow: 'hidden'
      }}
      disableDragging={type === AssetTypes.video && !draggable}
      position={{ x: position.x, y: position.y }}
      onMouseDown={e => setAssetZIndexToMaximal(id)}
      onDragStop={(e, d) => setAssetPosition(id, d.x, d.y)}
      onResize={(e, direction, ref, delta, _position) => {
        const width = parseInt(ref.style.width)
        const height = parseInt(ref.style.height)
        if (width && height) return setLocalSize({ width, height })
      }}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={(e, direction, ref, delta, _position) => {
        const width = parseInt(ref.style.width)
        const height = parseInt(ref.style.height)
        if (width && height) {
          setAssetPosition(id, _position.x, _position.y)
          setAssetSize(id, width, height)
        }
        setIsResizing(false)
      }}
    >
      {type === AssetTypes.image && (
        <ImageAsset
          asset={asset}
          isResizing={isResizing}
          localSize={localSize}
        />
      )}
      {type === AssetTypes.video && (
        <VideoAsset
          asset={asset}
          isResizing={isResizing}
          localSize={localSize}
        />
      )}
    </Rnd>
  )
}

export default AssetContainer
