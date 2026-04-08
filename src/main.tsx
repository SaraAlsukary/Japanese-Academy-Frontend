import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
    <ToastContainer position="top-center" autoClose={3000} />
  </StrictMode>,
)
