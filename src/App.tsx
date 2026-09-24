import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Checklist from './pages/Checklist'
import Kresz from './pages/Kresz'
import Calculator from './pages/Calculator'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/kresz" element={<Kresz />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

