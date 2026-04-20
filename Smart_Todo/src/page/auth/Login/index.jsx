import { useEffect, useState } from "react";
import "./LoginForm.scss";
import { UserLogin } from "../../../services/authService";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLogin, setIsLogin } = useAuth();
  const navigate = useNavigate();

  const {success, error} = useToast();

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      username: username,
      password: password,
    };

    try {
      const result = await UserLogin(data);

      if (result.status === "success") {
        setIsLogin(true);
        navigate("/");
      } else {
        error(result.message);
      }
    } catch (error) {
      error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-form">
          {/* Header với icon */}
          <div className="form-header">
            <div className="avatar__sig-in">
              <i
                className="fa-solid fa-user"
                style={{ fontSize: "42px", color: "white" }}
              ></i>
            </div>
            <h2 className="title">Chào mừng trở lại</h2>
            <p className="subtitle">Đăng nhập để tiếp tục</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="input-group">
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Tài khoản của bạn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="input-group">
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="16"
                    r="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePassword}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="form-options">
              <label className="remember-me" htmlFor="id1">
                <input type="checkbox" id="id1" />
                <span className="checkmark"></span>
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="forgot-password">
                Quên mật khẩu?
              </a>
            </div>

            {/* Login Button */}
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="loading-spinner" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      opacity="0.75"
                    />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <i className="fa-solid fa-right-to-bracket"></i>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>Hoặc</span>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <button type="button" className="social-btn google">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button type="button" className="social-btn facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </form>

          {/* Register Link */}
          <p className="register-link">
            Chưa có tài khoản? <a href="/sign-up">Tạo tài khoản mới</a>
          </p>
        </div>
      </div>
    </div>
  );
}
