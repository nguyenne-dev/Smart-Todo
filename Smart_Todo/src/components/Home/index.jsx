import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/authService";

function Home() {
    const { isLogin, setIsLogin, user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();

            console.log("Logout success");
            console.log("Before logout:", { isLogin, user });

            // clear auth state
            setIsLogin(false);
            setUser(null);

            console.log("After logout: logged out");
        } catch (error) {
            console.log("Logout error:", error);
        }
    };
    const handleLogin = () => {
        window.location.href = "/sign-in";
    }

    return (
        <div>
            <h2>Home Page</h2>

            <p>
                Status: {isLogin ? "Đã đăng nhập" : "Chưa đăng nhập"}
            </p>

            {user && (
                <p>
                    Xin chào: {user.username || user.name || "User"}
                </p>
            )}

            <button onClick={handleLogout}>
                Đăng xuất
            </button>
            <button onClick={handleLogin}>
                Đăng nhập
            </button>
        </div>
    );
}

export default Home;