import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verify_register } from "../../../services/authService";
import "./verify.css";

export default function VerifyRegister() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Đang xác minh...");

  useEffect(() => {
    if (!token) {
      setStatus("Vui lòng kiểm tra email và nhấp vào liên kết xác minh!");
      return;
    }

    const fetchApi = async () => {
      try {
        const result = await verify_register(token);

        if (result.status === "success") {
          setStatus(result.message || "✅ Xác minh thành công!");
        } else {
          setStatus(result.message || "❌ Xác minh thất bại");
        }
      } catch (err) {
        console.error("Lỗi xác minh:", err);
        setStatus("❌ Xác minh thất bại do lỗi server");
      }
    };

    fetchApi();
  }, [token]);
console.log("Token xác minh:", token);
  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-status-box">
          <h2 className="verify-status">{status}</h2>
        </div>

        <div className="verify-actions-box">
          <h3 className="verify-actions-title">Thực hiện tiếp:</h3>
          <div className="verify-actions">
            <a href="https://gmail.com" className="verify-link">
              Kiểm tra email
            </a>
            <a href="/" className="verify-link">
              Về trang chủ
            </a>
            <a href="/sign-in" className="verify-link">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}