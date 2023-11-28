'use client'
import { useCallback } from 'react'
import { Box } from '@mui/material'
import { AssetContainer } from '@/components'
import { useAssetsStore } from '@/store/AssetsStore'

const Canvas = () => {
  const assets = useAssetsStore(s => s.assets)

  const renderAssets = useCallback(
    () => assets.map(a => <AssetContainer key={a.id} asset={a} />),
    [assets]
  )

  return (
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
  )
}

export default Canvas
