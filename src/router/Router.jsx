import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import CourseSwap from "../pages/home/CourseSwap";
import Menu from "../pages/menuPage/Menu";
import Signup from "../components/Signup";
import Order from "../pages/dashboard/Order";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import UserProfile from "../pages/dashboard/UserProfile";
import CartPage from "../pages/menuPage/CartPage";
import Login from "../components/Login";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/dashboard/admin/Dashboard";
import Users from "../pages/dashboard/admin/Users";
import AddMenu from "../pages/dashboard/admin/AddMenu";
import ManageItems from "../pages/dashboard/admin/ManageItems";
import UpdateMenu from "../pages/dashboard/admin/UpdateMenu";
import SwapCourses from "../pages/home/Swaptable";
import EditUserSwapCourses from '../pages/home/OwnCourses'; // Adjust the import based on your project structure
 
const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      children: [
        {
            path: "/",
            element: <Home/>
        },
        {
          path: "/course-swap",
          element: <CourseSwap/>
        },
        {
          path: "/swaptable",
          element: <SwapCourses/>
        },
        {
          path: "/swap/:userId",
          element: <PrivateRoute><EditUserSwapCourses/></PrivateRoute>
      },  
        {
          path: "/order",
          element:<PrivateRoute><Order/></PrivateRoute>
        },
        {
          path: "/update-profile",
          element: <UserProfile/>
        },
        
      ]
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: 'dashboard',
      element: <PrivateRoute><DashboardLayout/></PrivateRoute>,
      children: [
        {
          path: '',
          element: <Dashboard/>
        },
        {
          path: 'users', 
          element: <Users/>
        },
        {
          path: "manage-items",
          element: <ManageItems/>
        },
        
      ]
    }
  ]);

  export default router;