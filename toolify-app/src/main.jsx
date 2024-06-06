import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/Root.jsx'
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Orders from './pages/Orders.jsx';
import SendOrder from './pages/SendOrder.jsx';
import AllOrders from './pages/AllOrders.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Admin from './routes/Admin.jsx';
import AdminDash from './pages/AdminDash.jsx';
import UserOrders from './routes/UserOrders.jsx';
import CreateQuotation from './pages/CreateQuotation.jsx';
import Customers from './pages/Customers.jsx';
import Reports from './pages/Reports.jsx';
import CreatePo from './pages/CreatePo.jsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: 'admin-portal',
    element: <SignIn admin={true} />,
    errorElement: <ErrorPage />
  },
  {
    path: 'admin-dash',
    element: <Admin />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <AdminDash/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'pending-quotes',
        element: <Orders status="pending"/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'sendquote/:id',
        element: <CreateQuotation/>,
        errorElement: <ErrorPage/>
      },
      {
        path: 'purchase-orders',
        element: <Orders status="processing"/>,
        errorElement: <ErrorPage/>
      },
      {
        path: 'delivered',
        element: <Orders status="delivered"/>,
        errorElement: <ErrorPage/>
      },
      { 
        path: 'customers',
        element: <Customers/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'reports',
        element: <Reports/>,
        errorElement: <ErrorPage />
      }
    ]
  },
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signin',
    element: <SignIn />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup',
    element: <SignUp />,
    errorElement: <ErrorPage />
  },
  {
    path: '/orders',
    element: <UserOrders/>,
    errorElement: <ErrorPage />,
    children:[
      {
        path: '',
        element: <SendOrder/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'pending-quotes',
        element: <AllOrders status="pending"/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'received-quotes',
        element: <AllOrders status="ready"/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'in-production',
        element: <AllOrders status="processing"/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'send-po/:id',
        element: <CreatePo/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'delivered',
        element: <AllOrders status="delivered"/>,
        errorElement: <ErrorPage />
      },
    ]
  },
  {
    path: "/orders/send",
    element: <SendOrder />,
    errorElement: <ErrorPage />
  },
  {
    path: "/orders/allorders",
    element: <AllOrders />,
    errorElement: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
