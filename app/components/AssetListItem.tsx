import Image from 'next/image'
import { Box, Typography } from '@mui/material'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

import { useAssetsStore } from '@/store/AssetsStore'
import { IAsset } from '@/lib/interfaces'
import { AssetTypes } from '@/lib/enums'

const AssetListItem = ({ asset }: { asset: IAsset }) => {
  const isImage = asset.type === AssetTypes.image

  return (
    <Box
      sx={{
        position: 'relative',
        p: 1
      }}
    >
      <Box
        sx={{ width: 100, height: 100, position: 'relative', display: 'flex' }}
      >
        {isImage ? (
          <Image
            loader={({ src }) => src}
            fill
            unoptimized
            src={asset.url}
            alt={asset.name}
          />
        ) : (
          <PlayCircleOutlineIcon fontSize='large' />
        )}
      </Box>
      <Box>
        <Typography>Width: {asset.size.width}</Typography>
        <Typography>Height: {asset.size.width}</Typography>
        <Typography>X: {asset.position.x}</Typography>
        <Typography>Y: {asset.position.y}</Typography>
      </Box>
    </Box>
  )
}

export default AssetListItem
