import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router"
import { router } from './router'
import './index.css'
import './utils/db/schema'
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)
