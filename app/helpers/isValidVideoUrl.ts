import ReactPlayer from 'react-player'

const isValidVideoUrl = (url: string) => ReactPlayer.canPlay(url)

export default isValidVideoUrl
