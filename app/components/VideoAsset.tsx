import ReactPlayer from 'react-player'
import { Box } from '@mui/material'
import { getAspectRatio } from '@/helpers'
import { useAssetsStore } from '@/store/AssetsStore'
import { IAsset } from '@/lib/interfaces'
import constants from '@/lib/constants'

const { VIDEO_BASE_WIDTH } = constants

const VideoAsset = ({ asset }: { asset: IAsset }) => {
  const { id, url, size } = asset
  const setAssetSize = useAssetsStore(s => s.setAssetSize)

  return (
    <Box
      position='relative'
      width={size?.width || VIDEO_BASE_WIDTH}
      height={size?.height || 'auto'}
    >
      <ReactPlayer
        onError={() => console.log('Failed to load video')}
        onReady={e => {
          const player = e.getInternalPlayer()
          setAssetSize(
            id,
            VIDEO_BASE_WIDTH,
            VIDEO_BASE_WIDTH /
              getAspectRatio(player.videoWidth, player.videoHeight)
          )
        }}
        width='100%'
        height='100%'
        url={url}
      />
    </Box>
  )
}

export default VideoAsset
