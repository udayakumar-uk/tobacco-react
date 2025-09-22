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
        children: [
          { path: '', element: <PrivateRoute><DashboardLayout children={<User />} /></PrivateRoute> },
          { path: 'createnewuser', element: <PrivateRoute><DashboardLayout children={<CreateNewUser />} /></PrivateRoute> }
        ]
      },
      {
        path: '/barn',
        children: [
          { path: '', element: <PrivateRoute><DashboardLayout children={<Barn />} /></PrivateRoute> },
          { path: 'createnewbarn', element: <PrivateRoute><DashboardLayout children={<CreateNewBarn />} /></PrivateRoute> }
        ]
      },
      { path: '*', element: <NotFound /> },
  ]);
}
