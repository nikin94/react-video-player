import { create } from 'zustand'
import { IAsset, IBasicAsset } from '@/lib/interfaces'
import { v4 as uuid } from 'uuid'

interface IState {
  assets: IAsset[]
  addAsset: (basicAsset: IBasicAsset) => void
  removeAssetByUrl: (url: string) => void
  getAssetsCount: () => number
  getAssetById: (id: string) => IAsset | undefined
  getAssetByUrl: (url: string) => IAsset | undefined
  setAssetSize: (id: string, width: number, height: number) => void
  setAssetPosition: (id: string, x: number, y: number) => void
  setAssetZIndexToMaximal: (url: string) => void
}

export const useAssetsStore = create<IState>()((set, get) => ({
  assets: [],
  addAsset: (basicAsset: IBasicAsset) => {
    const assets = get().assets
    if (assets.some(a => a.url === basicAsset.url)) return
    const url = new URL(basicAsset.url)
    const path = url.pathname.split('/')

    set(state => ({
      assets: [
        ...state.assets,
        {
          ...basicAsset,
          id: uuid(),
          name: path[path.length - 1],
          zIndex: state.assets.length,
          size: { width: 0, height: 0 },
          position: { x: 0, y: 0 }
        } as IAsset
      ]
    }))
  },
  removeAssetByUrl: (url: string) =>
    set(state => ({ assets: state.assets.filter(a => a.url !== url.trim()) })),
  getAssetsCount: () => get().assets.length,
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
  setAssetZIndexToMaximal: (url: string) => {
    const assets = get().assets
    const currentZIndex = get().getAssetByUrl(url)?.zIndex
    if (typeof currentZIndex === 'undefined') return

    const _assets = assets.map(a => {
      if (a.zIndex > currentZIndex) return { ...a, zIndex: a.zIndex - 1 }
      if (a.zIndex === currentZIndex) return { ...a, zIndex: assets.length - 1 }
      return a
    })
    set({ assets: _assets })
  }
}))
