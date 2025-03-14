import { createBrowserRouter, Navigate } from "react-router-dom";
import { useStateContext } from "./context/ContextProvider.jsx";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/auth/Login.jsx";
import NotFound from "./views/NotFound";
import Signup from "./views/auth/Signup";
import Users from "./views/Users/Users";
import UserForm from "./views/Users/UserForm";
import Commissions from "./views/Commissions/Commissions";  
import Meetings from "./views/Meetings/Meetings";        
import PV from "./views/PV/PV.jsx";     
import Chat from "./views/Chat/Chat.jsx";
import Profile from "./views/User/profile.jsx";

import UserDashboard from "./views/User/UserDashboard.jsx";


// Protect routes based on role
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useStateContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return element;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: '/dashboard',
        element: <UserDashboard />
      },
      {
        path: '/admin-dashboard',
        element: <ProtectedRoute element={<Dashboard />} allowedRoles={["admin"]} />,
      },
      {
        path: '/users',
        element: <ProtectedRoute element={<Users />} allowedRoles={["admin"]} />
      },
      {
        path: '/users/new',
        element: <ProtectedRoute element={<UserForm key="userCreate" />} allowedRoles={["admin"]} />
      },
      {
        path: '/users/:id',
        element: <ProtectedRoute element={<UserForm key="userUpdate" />} allowedRoles={["admin"]} />
      },
      {
        path: '/commissions',
        element: <Commissions />  
      },
      {
        path: '/prf',
        element: <Profile />  
      },
      
      {
        path: '/meetings',
        element: <Meetings />     
      },
      {
        path: '/chat',
        element: <Chat />
      },
      {
        path: '/pv',
        element: <PV />          
      },
    ]
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;
