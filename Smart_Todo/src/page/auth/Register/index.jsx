import React, { useState } from "react";
import "./RegisterForm.scss";
import { register } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const {success, error} = useToast();

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm kiểm tra độ mạnh mật khẩu (trùng UI hiển thị)
  const getPasswordStrength = (password) => {
    if (password.length === 0) return "empty";
    if (password.length < 6) return "weak";
    if (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      return "very-strong";
    }
    if (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return "strong";
    }
    if (password.length >= 6 && /[A-Z]/.test(password)) {
      return "medium";
    }
    return "weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dữ liệu form trước khi gửi:", formData);

    if (formData.password !== formData.confirmPassword) {
      error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!acceptTerms) {
      error("Vui lòng đồng ý với điều khoản sử dụng!");
      return;
    }

    const strength = getPasswordStrength(formData.password);
    if (formData.password.length < 6) {
      error("Mật khẩu cần có ít nhất 6 ký tự.");
      return;
    }
    // Cảnh báo nếu mật khẩu quá yếu, nhưng tạm thời vẫn cho phép đăng ký để người dùng có thể tự quyết định
    // if (["weak", "empty"].includes(strength)) {
    //   error("Mật khẩu quá yếu, vui lòng nhập mạnh hơn (Nên có ký tự in hoa, số và kí tự đặc biệt, tối thiểu 6 kí tự).");
    //   return;
    // }

    const payload = {
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender.toLowerCase(),
      password: formData.password,
    };

    try {
      setIsLoading(true);
      const result = await register(payload);
      console.log("Kết quả đăng ký:", result);
      if (result.status !== "fail") {
        success("Đã gửi email xác nhận, hãy kiểm tra và xác nhận!");
        navigate("/verify-register");
      } else {
        error(`${result.message}!`);
      }
    } catch (err) {
      error("Đã xảy ra lỗi khi gửi request. Vui lòng thử lại.");
      console.error("❌ Lỗi khi gửi request:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-form">
          {/* Header */}
          <div className="form-header">
            <div className="avatar-sigup">
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h2 className="title">Tạo tài khoản mới</h2>
            <p className="subtitle">Tham gia cùng chúng tôi ngay hôm nay</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name Input */}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="input-row">
              <div className="input-group half-width">
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
                    type="email"
                    name="email"
                    placeholder="Email của bạn"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group half-width">
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
                    name="username"
                    placeholder="Tài khoản của bạn"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth & Gender Row */}
            <div className="input-row">
              <div className="input-group half-width">
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <line
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <line
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <line
                      x1="3"
                      y1="10"
                      x2="21"
                      y2="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                  {/* <label className="date-label">Ngày sinh</label> */}
                </div>
              </div>

              <div className="input-group half-width">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password Row */}
            <div className="input-row">
              <div className="input-group half-width">
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
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
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

              <div className="input-group half-width">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPassword}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {showConfirmPassword ? (
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
            </div>

            {/* Password Strength Indicator */}
            <div className="password-strength">
              <div className="strength-bars">
                <div
                  className={`strength-bar ${formData.password.length >= 6 ? "active" : ""}`}
                ></div>
                <div
                  className={`strength-bar ${formData.password.length >= 6 && /[A-Z]/.test(formData.password) ? "active" : ""}`}
                ></div>
                <div
                  className={`strength-bar ${formData.password.length >= 6 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) ? "active" : ""}`}
                ></div>
                <div
                  className={`strength-bar ${formData.password.length >= 6 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) && /[!@#$%^&*]/.test(formData.password) ? "active" : ""}`}
                ></div>
              </div>
              <span className="strength-text">
                {formData.password.length === 0
                  ? "Nhập mật khẩu"
                  : formData.password.length < 6
                    ? "Yếu"
                    : formData.password.length >= 6 &&
                        /[A-Z]/.test(formData.password) &&
                        /[0-9]/.test(formData.password) &&
                        /[!@#$%^&*]/.test(formData.password)
                      ? "Rất mạnh"
                      : formData.password.length >= 6 &&
                          /[A-Z]/.test(formData.password) &&
                          /[0-9]/.test(formData.password)
                        ? "Mạnh"
                        : formData.password.length >= 6 &&
                            /[A-Z]/.test(formData.password)
                          ? "Trung bình"
                          : "Yếu"}
              </span>
            </div>

            {/* Terms & Conditions */}
            <div className="form-options">
              <label className="accept-terms">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span className="checkmark"></span>
                Tôi đồng ý với{" "}
                <a tabIndex={-1} href="#" className="terms-link">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a tabIndex={1} href="#" className="terms-link">
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="btn-register"
              disabled={isLoading || !acceptTerms}
            >
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
                  Đang tạo tài khoản...
                </>
              ) : (
                <>
                  <span>Tạo tài khoản +</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>hoặc đăng ký với</span>
            </div>

            {/* Social Register */}
            <div className="social-register">
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

          {/* Login Link */}
          <p className="login-link">
            Đã có tài khoản? <a href="/sign-in">Đăng nhập ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
}
