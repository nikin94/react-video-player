'use client'
import { useRef, useState, useMemo, useEffect } from 'react'
import ReactPlayer from 'react-player'
import debounce from 'lodash/debounce'

import { Box } from '@mui/material'

import { VideoAssetControls } from '@/components'
import { getAspectRatio } from '@/helpers'
import { useAssetsStore } from '@/store/AssetsStore'
import { IAsset, IAssetSize } from '@/lib/interfaces'
import constants from '@/lib/constants'

type Progress = {
  playedSeconds: number
  played: number
  loadedSeconds: number
  loaded: number
}

const { VIDEO_BASE_WIDTH } = constants

const VideoAsset = ({
  asset,
  isResizing,
  localSize
}: {
  asset: IAsset
  isResizing: boolean
  localSize: IAssetSize
}) => {
  const { id, url, size, playing, progress } = asset

  const playerWrapperRef = useRef<HTMLElement>(null)
  const playerRef = useRef<ReactPlayer>(null)
  const [muted, setMuted] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(100)
  const [localProgress, setLocalProgress] = useState<number>(progress || 0)
  const [controlsOpacity, setControlsOpacity] = useState<number>(0)
  const [controlsCursor, setControlsCursor] = useState<string>('default')

  const {
    setAssetSize,
    setAssetAspectRatio,
    setAssetDuration,
    setAssetProgress,
    removeAssetById
  } = useAssetsStore()

  const setLocalProgressToState = useMemo(
    () => debounce(() => setAssetProgress(id, localProgress), 1500),
    []
  )

  const progressHandler = (_progress: Progress) => {
    setLocalProgress(_progress.playedSeconds)
    setLocalProgressToState()
  }

  const onReady = (e: ReactPlayer) => {
    setAssetDuration(id, e.getDuration())
    const _player = e.getInternalPlayer()
    const AR = getAspectRatio(_player.videoWidth, _player.videoHeight)
    setAssetSize(id, VIDEO_BASE_WIDTH, VIDEO_BASE_WIDTH / AR)
    setAssetAspectRatio(id, AR)
  }

  const hideControls = useMemo(
    () =>
      debounce(() => {
        setControlsOpacity(0)
        setControlsCursor('none')
      }, 1500),
    []
  )

  const handleControlsMouseMove = () => {
    setControlsOpacity(1)
    setControlsCursor('default')
    hideControls()
  }

  useEffect(() => {
    if (!playing) return

    const interval = setInterval(
      () => playing && setAssetProgress(id, localProgress),
      1000
    )

    return () => clearInterval(interval)
  }, [playing])

  return (
    <Box
      ref={playerWrapperRef}
      position='relative'
      width={isResizing && localSize.width ? localSize.width : size?.width}
      height={isResizing && localSize.height ? localSize.height : size?.height}
      onMouseMove={handleControlsMouseMove}
    >
      <ReactPlayer
        ref={playerRef}
        onError={error => {
          console.log('Failed to load video: ', error)
          removeAssetById(id)
        }}
        onReady={onReady}
        onProgress={progressHandler}
        progressInterval={100}
        width='100%'
        height='100%'
        url={url}
        playing={playing}
        volume={volume / 100}
        muted={muted}
      />
      <VideoAssetControls
        asset={asset}
        localProgress={localProgress}
        setLocalProgress={setLocalProgress}
        setLocalProgressToState={setLocalProgressToState}
        muted={muted}
        setMuted={setMuted}
        volume={volume}
        setVolume={setVolume}
        playerRef={playerRef}
        playerWrapperRef={playerWrapperRef}
        controlsOpacity={controlsOpacity}
        controlsCursor={controlsCursor}
      />
    </Box>
  )
}

export default VideoAsset
