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
import EditUser from './pages/EditUser';
import EditBarn from './pages/EditBarn';
import Profile from './pages/Profile';

import { useAuth } from './context/AuthContext';
// ----------------------------------------------------------------------

function getDefaultRoute(user) {
  if (!user) return <Login />;
  if (user.userDetails.role === 'ADMIN') return <Navigate to="/user" />;
  return <Navigate to="/barn" />;
}


export default function Router() {

    const { user } = useAuth();

  return useRoutes([
    { path: '/', element: getDefaultRoute(user) },
    { path: '/login', element: getDefaultRoute(user) },
    {
      path: '/barn',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <Barn /> },
        { path: 'edit/:id', element: <EditBarn /> }
      ]
    },
    {
      path: '/user',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <User /> },
        { path: 'createnewuser', element: <CreateNewUser /> },
        { path: 'edit/:id', element: <EditUser /> }
      ]
    },
    { path: '/profile',
      element: <DashboardLayout />, 
      children: [
        { path: '', element: <Profile /> }
      ]
    },

    { path: '*', element: <NotFound /> },
  ]);
}
