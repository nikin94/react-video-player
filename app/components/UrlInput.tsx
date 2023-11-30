'use client'
import { useState } from 'react'
import { Box, Button, InputAdornment, TextField } from '@mui/material'
import { Link } from '@mui/icons-material'
import isURL from 'validator/lib/isURL'
import { getImageMeta, isValidVideoUrl } from '@/helpers'
import { AssetTypes } from '@/lib/enums'
import { useAssetsStore } from '@/store/AssetsStore'

const UrlInput = () => {
  const assets = useAssetsStore(s => s.assets)
  const addAsset = useAssetsStore(s => s.addAsset)

  const [inputValue, setInputValue] = useState<string>('')
  const [error, setError] = useState<string>('')

  const onSubmit = async () => {
    const _inputValue = inputValue.trim()
    if (!isURL(_inputValue)) return setError('Invalid URL')

    const isAlreadyUploaded = assets.some(a => a.url === _inputValue)
    if (isAlreadyUploaded) return setError('Asset already uploaded')

    const isVideo = await isValidVideoUrl(_inputValue)
    const img = await getImageMeta(_inputValue)
    if (!isVideo && !img) return setError('Asset cannot be loaded')

    addAsset({
      url: _inputValue,
      type: img ? AssetTypes.image : AssetTypes.video
    })

    setInputValue('')
    setError('')
    return
  }

  const onInputChange = (e: React.ChangeEvent<any>) => {
    setError('')
    setInputValue(e.target.value)
  }

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', mb: 1 }}>
        <TextField
          value={inputValue}
          onChange={onInputChange}
          size='small'
          sx={{ flex: 1 }}
          error={!!error}
          helperText={error}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Button
                  type='submit'
                  onClick={onSubmit}
                  variant='text'
                  sx={{ p: 0, minWidth: 20, color: '#333' }}
                >
                  <Link />
                </Button>
              </InputAdornment>
            )
          }}
        />
      </Box>
    </form>
  )
}

export default UrlInput
