import { createBrowserRouter } from 'react-router'
import {Layout} from './components/layout'
import { Home } from './pages/home'
import { Details } from './pages/details'
import { NotFound } from './pages/notfound'


export const router = createBrowserRouter([

    {
        element: <Layout/>,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/detail/:cripto',
                element: <Details/>
            },
            {
                path: '*',
                element: <NotFound/>
            }
        ]
    }
    
])
