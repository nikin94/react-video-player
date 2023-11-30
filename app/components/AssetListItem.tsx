'use client'
import Image from 'next/image'
import Link from 'next/link'
import {
  Box,
  IconButton,
  ButtonGroup,
  Typography,
  Tooltip,
  Divider
} from '@mui/material'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import BorderStyleIcon from '@mui/icons-material/BorderStyle'

import { IAsset } from '@/lib/interfaces'
import { AssetTypes } from '@/lib/enums'
import { useAssetsStore } from '@/store/AssetsStore'
import { getAspectRatio } from '@/helpers'

const AssetListItem = ({ asset }: { asset: IAsset }) => {
  const {
    type,
    id,
    url,
    name,
    size,
    position,
    playing,
    frameAspectRatioUnlocked
  } = asset
  const isImage = type === AssetTypes.image

  const {
    setAssetZIndexToMaximal,
    removeAssetById,
    toggleVideoPlay,
    toggleFrameLock,
    toggleBorderDisabled
  } = useAssetsStore()

  const iconStyle = {
    p: 0.0
  }

  const buttons = [
    <Tooltip key='bringToFront' title='Bring to front' placement='right'>
      <IconButton sx={iconStyle} onClick={() => setAssetZIndexToMaximal(id)}>
        <MoveUpIcon fontSize='small' />
      </IconButton>
    </Tooltip>,
    <Tooltip key='toggleBorder' title='Enable/disable border' placement='right'>
      <IconButton sx={iconStyle} onClick={() => toggleBorderDisabled(id)}>
        <BorderStyleIcon fontSize='small' />
      </IconButton>
    </Tooltip>,
    <Tooltip
      key='bringToFront'
      title='Toggle aspect ratio lock'
      placement='right'
    >
      <IconButton sx={iconStyle} onClick={() => toggleFrameLock(id)}>
        {frameAspectRatioUnlocked ? (
          <LockOpenIcon fontSize='small' />
        ) : (
          <LockIcon fontSize='small' />
        )}
      </IconButton>
    </Tooltip>,
    <Tooltip key='delete' title='Delete' placement='right'>
      <IconButton
        sx={iconStyle}
        onClick={() => removeAssetById(id)}
        color='error'
      >
        <DeleteIcon fontSize='small' />
      </IconButton>
    </Tooltip>
  ]

  const VideoIcon = playing ? PauseCircleOutlineIcon : PlayCircleOutlineIcon

  const onPlayButtonPress = () => toggleVideoPlay(id)

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          px: 1,
          py: 2
        }}
      >
        <Link target='_blank' href={url}>
          <Typography
            onClick={() => setAssetZIndexToMaximal(id)}
            sx={{
              mb: 1,
              textAlign: 'center',
              fontWeight: 500,
              color: '#333',
              textDecoration: 'none'
            }}
          >
            {name}
          </Typography>
        </Link>
        <Box
          sx={{
            display: 'flex',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {isImage ? (
              <Box
                sx={{
                  width: 100 * getAspectRatio(size.width, size.height),
                  height: '100%',
                  position: 'relative',
                  display: 'flex'
                }}
              >
                <Image
                  loader={({ src }) => src}
                  fill
                  unoptimized
                  src={url}
                  alt={name}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  borderWidth: 2,
                  borderColor: '#ffffffcc',
                  borderStyle: 'solid',
                  borderRadius: 2,
                  bgcolor: 'primary.light',
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={onPlayButtonPress}
              >
                <VideoIcon sx={{ fontSize: 44, color: '#ffffffcc' }} />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              ml: 1,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'space-between'
            }}
          >
            <Typography>Width: {~~size.width}</Typography>
            <Typography>Height: {~~size.height}</Typography>
            <Typography>X: {position.x}</Typography>
            <Typography>Y: {position.y}</Typography>
          </Box>
          <ButtonGroup
            orientation='vertical'
            aria-label='vertical button group'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {buttons}
          </ButtonGroup>
        </Box>
      </Box>
      <Divider sx={{ width: '80%', marginX: 'auto' }} />
    </>
  )
}

export default AssetListItem
