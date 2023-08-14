import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";

import Home from './Pages/Home'
import AdminPanel from './Pages/AdminPanel'
import Navbar from './Components/Navbar'

// Defining router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

function Root() {
  return (
    <div>
      <Navbar />
    </div>
  );
}

export default App
