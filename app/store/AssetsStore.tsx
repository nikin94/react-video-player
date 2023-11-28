import { create } from 'zustand'
import { IAsset, IBasicAsset } from '@/lib/interfaces'
import { v4 as uuid } from 'uuid'
import { AssetTypes } from '@/lib/enums'

interface IState {
  assets: IAsset[]
  addAsset: (basicAsset: IBasicAsset) => void
  removeAssetById: (id: string) => void

  getAssetById: (id: string) => IAsset | undefined
  getAssetByUrl: (url: string) => IAsset | undefined

  setAssetSize: (id: string, width: number, height: number) => void
  setAssetPosition: (id: string, x: number, y: number) => void
  setAssetZIndexToMaximal: (id: string) => void
  setAssetAspectRatio: (id: string, aspectRatio: number) => void
  setAssetProgress: (id: string, progress: number) => void
  setAssetDuration: (id: string, duration: number) => void

  toggleVideoPlay: (id: string) => void
  stopVideo: (id: string) => void
  playVideo: (id: string) => void
  enableDragging: (id: string) => void
  disableDragging: (id: string) => void

  playAllVideos: () => void
  pauseAllVideos: () => void
}

export const useAssetsStore = create<IState>()((set, get) => ({
  assets: [],
  addAsset: (basicAsset: IBasicAsset) => {
    const assets = get().assets
    if (assets.some(a => a.url === basicAsset.url)) return
    const url = new URL(basicAsset.url)
    const path = url.pathname.split('/')
    const zIndexes = assets.map(a => a.zIndex)
    set(state => ({
      assets: [
        ...state.assets,
        {
          ...basicAsset,
          id: uuid(),
          name: path[path.length - 1],
          zIndex: zIndexes.length ? Math.max(...zIndexes) + 1 : 1,
          size: { width: 0, height: 0 },
          position: { x: 0, y: 0 }
        } as IAsset
      ]
    }))
  },
  removeAssetById: (id: string) => {
    set(state => ({ assets: state.assets.filter(a => a.id !== id) }))
  },
  getAssetById: (id: string) => get().assets.find(a => a.id === id),
  getAssetByUrl: (url: string) => get().assets.find(a => a.url === url.trim()),
  setAssetSize: (id: string, width: number, height: number) => {
    const assets = get().assets
    const _assets = assets.map(asset =>
      asset.id === id ? { ...asset, size: { width, height } } : asset
    )
    set({ assets: _assets })
  },
  setAssetPosition: (id: string, x: number, y: number) => {
    const assets = get().assets
    const _assets = assets.map(asset =>
      asset.id === id ? { ...asset, position: { x, y } } : asset
    )
    set({ assets: _assets })
  },
  setAssetZIndexToMaximal: (id: string) => {
    const assets = get().assets
    const currentZIndex = get().getAssetById(id)?.zIndex
    if (typeof currentZIndex === 'undefined') return

    const zIndexes = assets.map(a => a.zIndex)
    const zIndexMax = Math.max(...zIndexes)
    if (zIndexMax === currentZIndex) return

    const _assets = assets.map(a =>
      a.id === id ? { ...a, zIndex: zIndexMax + 1 } : a
    )
    set({ assets: _assets })
  },
  setAssetAspectRatio: (id: string, aspectRatio: number) => {
    set(state => ({
      assets: state.assets.map(a => (a.id === id ? { ...a, aspectRatio } : a))
    }))
  },
  setAssetProgress: (id: string, progress: number) => {
    set(state => ({
      assets: state.assets.map(a => (a.id === id ? { ...a, progress } : a))
    }))
  },
  setAssetDuration: (id: string, duration: number) => {
    set(state => ({
      assets: state.assets.map(a => (a.id === id ? { ...a, duration } : a))
    }))
  },
  toggleVideoPlay: (id: string) => {
    const isVideo = get().getAssetById(id)?.type === AssetTypes.video
    if (!isVideo) return

    set(state => ({
      assets: state.assets.map(a =>
        a.id === id ? { ...a, playing: !a.playing } : a
      )
    }))
  },
  stopVideo: (id: string) => {
    const isPlaying = get().getAssetById(id)?.playing
    if (!isPlaying) return

    set(state => ({
      assets: state.assets.map(a =>
        a.id === id ? { ...a, playing: false } : a
      )
    }))
  },
  playVideo: (id: string) => {
    const isVideo = get().getAssetById(id)?.type === AssetTypes.video
    if (!isVideo) return

    const isPlaying = get().getAssetById(id)?.playing
    if (isPlaying) return

    set(state => ({
      assets: state.assets.map(a => (a.id === id ? { ...a, playing: true } : a))
    }))
  },
  enableDragging: (id: string) => {
    set(state => ({
      assets: state.assets.map(a =>
        a.id === id ? { ...a, draggable: true } : a
      )
    }))
  },
  disableDragging: (id: string) => {
    set(state => ({
      assets: state.assets.map(a =>
        a.id === id ? { ...a, draggable: false } : a
      )
    }))
  },
  playAllVideos: () => {
    set(state => ({
      assets: state.assets.map(a =>
        a.type === AssetTypes.video ? { ...a, playing: true } : a
      )
    }))
  },
  pauseAllVideos: () => {
    set(state => ({
      assets: state.assets.map(a =>
        a.type === AssetTypes.video ? { ...a, playing: false } : a
      )
    }))
  }
}))
