'use client'
import { useRef, useState, useMemo, SetStateAction } from 'react'
import ReactPlayer from 'react-player'
import moment from 'moment'
import screenfull from 'screenfull'

import { Box, Slider, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'

import { useAssetsStore } from '@/store/AssetsStore'
import { IAsset } from '@/lib/interfaces'

type VideoAssetControlsProps = {
  asset: IAsset
  localProgress: number
  setLocalProgress: React.Dispatch<SetStateAction<number>>
  setLocalProgressToState: () => void
  muted: boolean
  setMuted: React.Dispatch<SetStateAction<boolean>>
  volume: number
  setVolume: React.Dispatch<SetStateAction<number>>
  playerRef: React.RefObject<ReactPlayer>
  playerWrapperRef: React.RefObject<HTMLElement>
  controlsOpacity: number
  controlsCursor: string
}

const VideoAssetControls = ({
  asset,
  localProgress,
  setLocalProgress,
  setLocalProgressToState,
  muted,
  setMuted,
  volume,
  setVolume,
  playerRef,
  playerWrapperRef,
  controlsOpacity,
  controlsCursor
}: VideoAssetControlsProps) => {
  const { id, playing, name, draggable, duration } = asset

  const controlsRef = useRef<HTMLElement>(null)
  const [videoWasPlaying, setVideoWasPlaying] = useState<boolean>(false)

  const isVideoOver = localProgress && localProgress === duration

  const {
    toggleVideoPlay,
    enableDragging,
    disableDragging,
    removeAssetById,
    stopVideo,
    playVideo,
    pauseAllVideos
  } = useAssetsStore()

  const handleChangeVolume = (e: Event, value: number | number[]) => {
    setMuted(value === 0)
    setVolume(value as number)
  }

  const handleChangeMuted = () => {
    if (muted && volume === 0) setVolume(100)
    setMuted(!muted)
  }

  const handleCloseButtonClick = () => removeAssetById(id)

  const handleChangeProgress = (e: Event) => {
    if (playing) {
      setVideoWasPlaying(true)
      stopVideo(id)
    }
    if (!playerRef.current) return
    const inputValue = parseFloat((e.target as HTMLInputElement).value)
    playerRef.current.seekTo(inputValue, 'seconds')
    setLocalProgressToState()
    setLocalProgress(inputValue)
  }

  const handleChangeProgressCommited = () => {
    setVideoWasPlaying(false)
    setLocalProgressToState()
    if (videoWasPlaying && !playing) playVideo(id)
  }

  const handlePlayButtonClick = () => toggleVideoPlay(id)

  const handleFullscreenButtonClick = (e: React.SyntheticEvent): void => {
    if (!playerWrapperRef.current) return
    if (!screenfull.isEnabled) return
    if (screenfull.isFullscreen) {
      screenfull.exit()
      return
    }
    pauseAllVideos()
    playVideo(id)
    screenfull.request(playerWrapperRef.current)
  }

  const readableProgress = useMemo(
    () =>
      localProgress
        ? moment.utc(localProgress * 1000).format('mm:ss')
        : '00:00',
    [localProgress]
  )

  const readableDuration = useMemo(
    () => (duration ? moment.utc(duration * 1000).format('mm:ss') : '00:00'),
    [duration]
  )

  const PlayingIcon = isVideoOver
    ? ReplayCircleFilledIcon
    : playing
    ? PauseCircleIcon
    : PlayCircleIcon

  const VolumeIcon = muted ? VolumeOffIcon : VolumeUpIcon

  const isCursorHidden = controlsCursor === 'none'

  return (
    <Box
      ref={controlsRef}
      id='controls'
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity .3s ease',
        opacity: controlsOpacity,
        cursor: controlsCursor
      }}
    >
      <Box // top bar
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            bgcolor: '#ffffffcc',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isCursorHidden ? 'none' : 'move',
            textWrap: 'nowrap',
            height: 24
          }}
          onMouseEnter={() => !draggable && enableDragging(id)}
          onMouseLeave={() => draggable && disableDragging(id)}
        >
          {name}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            right: 0
          }}
        >
          <CropSquareIcon
            onClick={handleFullscreenButtonClick}
            sx={{
              transition: 'all .2s ease',
              '&:hover': { bgcolor: '#00000033' }
            }}
          />
          <CloseIcon
            onClick={handleCloseButtonClick}
            sx={{
              transition: 'all .2s ease',
              '&:hover': { bgcolor: '#ff0000aa' }
            }}
          />
        </Box>
      </Box>
      <Box // content
        sx={{
          display: 'flex',
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        onClick={handlePlayButtonClick}
      >
        <Box
          sx={{
            bgcolor: '#ffffffcc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <PlayingIcon
            sx={{
              fontSize: 64,
              cursor: isCursorHidden ? 'none' : 'pointer',
              color: 'primary.main',
              borderRadius: '50%'
            }}
          />
        </Box>
      </Box>
      <Box // bottom bar
        sx={{
          display: 'flex',
          bgcolor: '#ffffffcc',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          height: 30
        }}
      >
        <Typography sx={{ ml: 2 }}>{readableProgress}</Typography>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            mx: 2,
            flexDirection: 'row'
          }}
        >
          <Slider
            sx={{
              width: '100%',
              '& .MuiSlider-thumb': { boxShadow: 'none' }
            }}
            size='small'
            value={localProgress}
            max={duration}
            step={0.01}
            onChange={handleChangeProgress}
            onChangeCommitted={handleChangeProgressCommited}
          />
        </Box>
        <Typography>{readableDuration}</Typography>
        <Box
          sx={{
            width: 120,
            mx: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <VolumeIcon
            onClick={handleChangeMuted}
            sx={{ cursor: isCursorHidden ? 'none' : 'pointer' }}
            fontSize='small'
            color='action'
          />
          <Slider
            sx={{
              ml: 2,
              '& .MuiSlider-thumb': { boxShadow: 'none' }
            }}
            size='small'
            value={muted ? 0 : volume}
            onChange={handleChangeVolume}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default VideoAssetControls
