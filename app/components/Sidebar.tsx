'use client'
import { useCallback, useMemo } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

import { AssetListItem, UrlInput } from '@/components'
import { useAssetsStore } from '@/store/AssetsStore'
import { AssetTypes } from '@/lib/enums'

const Sidebar = () => {
  const assets = useAssetsStore(s => s.assets)
  const playAllVideos = useAssetsStore(s => s.playAllVideos)
  const pauseAllVideos = useAssetsStore(s => s.pauseAllVideos)

  const renderAssetsListSidebar = useCallback(
    () => assets.map(a => <AssetListItem key={a.id} asset={a} />),
    [assets]
  )

  const isVideoExists = useMemo(
    () => assets.some(a => a.type === AssetTypes.video),
    [assets]
  )

  const handlePauseAll = () => pauseAllVideos()
  const handlePlayAll = () => playAllVideos()

  return (
    <Box
      sx={{
        width: 400,
        p: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <UrlInput />
      {isVideoExists && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly'
          }}
        >
          <Tooltip title='Pause all'>
            <IconButton onClick={handlePauseAll}>
              <PauseIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Play all'>
            <IconButton onClick={handlePlayAll}>
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <Box
        sx={{
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '0.4em'
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
          }
        }}
      >
        {renderAssetsListSidebar()}
      </Box>
    </Box>
  )
}

export default Sidebar
