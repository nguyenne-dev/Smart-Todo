import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AllRouter from "./AllRouter";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AllRouter />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
