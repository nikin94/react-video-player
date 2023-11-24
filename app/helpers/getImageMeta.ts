const getImageMeta = (url: string) =>
  new Promise(resolve => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = () => resolve(false)
  })

export default getImageMeta
