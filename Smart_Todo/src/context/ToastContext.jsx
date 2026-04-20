import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    type: "",
  });

  const success = (message) => {
    setToast({ message, type: "success" });
  };

  const error = (message) => {
    setToast({ message, type: "error" });
  };

  // ✅ AUTO HIDE
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: "" });
      }, 3000); // 3s

      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}

      {toast.message && (
        <div className={`notify notify--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);