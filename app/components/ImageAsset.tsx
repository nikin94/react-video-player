import Image from 'next/image'
import { Box } from '@mui/material'
import { getAspectRatio } from '@/helpers'
import { useAssetsStore } from '@/store/AssetsStore'
import { IAsset } from '@/lib/interfaces'
import constants from '@/lib/constants'

const { IMAGE_BASE_WIDTH } = constants

const ImageAsset = ({
  asset,
  isResizing
}: {
  asset: IAsset
  isResizing: boolean
}) => {
  const { id, name, url, size } = asset
  const setAssetSize = useAssetsStore(s => s.setAssetSize)

  return (
    <Box
      sx={{
        position: 'relative',
        width: size.width,
        height: size.height
      }}
    >
      <Image
        onLoad={e => {
          setAssetSize(
            id,
            IMAGE_BASE_WIDTH,
            IMAGE_BASE_WIDTH /
              getAspectRatio(
                e.currentTarget.naturalWidth,
                e.currentTarget.naturalHeight
              )
          )
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
