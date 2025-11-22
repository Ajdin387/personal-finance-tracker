import { Routes, Route, Navigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import Dashboard from "./pages/Dashboard";
import useAuth from "./hooks/useAuth";
import AddExpense from "./components/AddExpense";

function App() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
      <Route path="/app" element = {
        loading
          ? <div>Loading...</div>
          : user
            ? <Dashboard />
            : <Navigate to="/auth" replace />
      }/>
      <Route path="/addexpense" element={
        loading
        ? <div>Loading...</div>
        : user
            ? <AddExpense />
            : <Navigate to="/auth" replace />
      }/>
    </Routes>
  )
}

export default App
