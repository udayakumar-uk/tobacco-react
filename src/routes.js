import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';

import PrivateRoute from "./components/PrivateRoute";

import { useAuth } from './context/AuthContext';
// ----------------------------------------------------------------------

export default function Router() {

    const { user } = useAuth();

  return useRoutes([
    { path: '/', element: user ? <Navigate to="/user" /> : <Login /> },
    { path: '/login', element: user ? <Navigate to="/user" /> : <Login /> },
    { path: '/dashboard', element: <PrivateRoute><DashboardLayout children={<DashboardApp />} /></PrivateRoute> },
    { path: '/user', element: <PrivateRoute><DashboardLayout children={<User />} /></PrivateRoute> },
    { path: '/products', element: <PrivateRoute><DashboardLayout children={<Products />} /></PrivateRoute> },
    { path: '/blog', element: <PrivateRoute><DashboardLayout children={<Blog />} /></PrivateRoute> },
    { path: '/register', element: <PrivateRoute><DashboardLayout children={<Register />} /></PrivateRoute> },
    { path: '*', element: <NotFound /> },
  ]);
}
