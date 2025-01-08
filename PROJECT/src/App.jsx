import React from 'react'
import{
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';
import Home from './pages/Home';
import Sell from './pages/Sell';
import Properties from './pages/Properties';
import Viewmore from './pages/Viewmore';
import Purchased from './pages/Purchased';
import Sold from './pages/Sold';


  const App = () => {
    const router=createBrowserRouter(createRoutesFromElements(
      <>
        <Route path="/" element={<Home />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/purchased" element={<Purchased />} />
        <Route path="/sold" element={<Sold />} />

        <Route path="/view-more/:id" element={<Viewmore />} />


      </>
  ))
  return (
    <RouterProvider router={router}/>
  )
}
export default App