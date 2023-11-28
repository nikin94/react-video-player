'use client'
import Image from 'next/image'
import { Box } from '@mui/material'
import { getAspectRatio } from '@/helpers'
import { useAssetsStore } from '@/store/AssetsStore'
import { IAsset, IAssetSize } from '@/lib/interfaces'
import constants from '@/lib/constants'

const { IMAGE_BASE_WIDTH } = constants

const ImageAsset = ({
  asset,
  isResizing,
  localSize
}: {
  asset: IAsset
  isResizing: boolean
  localSize: IAssetSize
}) => {
  const { id, name, url, size } = asset
  const setAssetSize = useAssetsStore(s => s.setAssetSize)
  const setAssetAspectRatio = useAssetsStore(s => s.setAssetAspectRatio)

  return (
    <Box
      sx={{
        position: 'relative',
        cursor: 'move',
        width: isResizing && localSize.width ? localSize.width : size.width,
        height: isResizing && localSize.height ? localSize.height : size.height
      }}
    >
      <Image
        onLoad={e => {
          const AR = getAspectRatio(
            e.currentTarget.naturalWidth,
            e.currentTarget.naturalHeight
          )
          setAssetSize(id, IMAGE_BASE_WIDTH, IMAGE_BASE_WIDTH / AR)
          setAssetAspectRatio(id, AR)
        }}
        loader={({ src }) => src}
        fill
        src={url}
        alt={name}
        draggable={false}
        unoptimized
        priority
      />
    </Box>
  )
}

export default ImageAsset
