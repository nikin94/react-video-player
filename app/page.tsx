'use client'
import { useCallback } from 'react'
import { Box } from '@mui/material'
import { AssetContainer, AssetListItem, UrlInput } from '@/components'
import { useAssetsStore } from '@/store/AssetsStore'

const Home = () => {
  const assets = useAssetsStore(s => s.assets)

  const renderAssets = useCallback(
    () => assets.map(a => <AssetContainer key={a.id} asset={a} />),
    [assets]
  )

  const renderAssetsListSidebar = useCallback(
    () => assets.map(a => <AssetListItem key={a.id} asset={a} />),
    [assets]
  )

  return (
    <Box display='flex'>
      <Box width={400} p={1}>
        <UrlInput />
        <Box>{renderAssetsListSidebar()}</Box>
      </Box>
      <Box
        sx={{
          bgcolor: '#ccc',
          width: '100%',
          minHeight: `100vh`,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {renderAssets()}
      </Box>
    </Box>
  )
}

export default Home
