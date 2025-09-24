import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import Blog from './pages/Blog';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import User from './pages/User';
import Barn from './pages/Barn';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import CreateNewUser from './pages/CreateNewUser';
import CreateNewBarn from './pages/CreateNewBarn';
import EditUser from './pages/EditUser';

import PrivateRoute from "./components/PrivateRoute";

import { useAuth } from './context/AuthContext';
// ----------------------------------------------------------------------

export default function Router() {

    const { user } = useAuth();

  return useRoutes([
    { path: '/', element: user ? <Navigate to="/user" /> : <Login /> },
    { path: '/login', element: user ? <Navigate to="/user" /> : <Login /> },
    {
      path: '/user',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <User /> },
        { path: 'createnewuser', element: <CreateNewUser /> },
        { path: 'edit/:id', element: <EditUser /> }
      ]
    },
    {
      path: '/barn',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <Barn /> },
        { path: 'edit/:id', element: <EditUser /> }
      ]
    },
    { path: '*', element: <NotFound /> },
  ]);
}
