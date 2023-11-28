import { Box } from '@mui/material'
import { Canvas, Sidebar } from '@/components'

const Home = () => (
  <Box display='flex' maxHeight='100vh'>
    <Sidebar />
    <Canvas />
  </Box>
)

export default Home
