import { useState } from "react";
import { loginApi, googleLoginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(form);
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(res.data.user);
      setToken(res.data.accessToken);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await googleLoginApi(idToken);
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(res.data.user);
      setToken(res.data.accessToken);
      navigate("/");
    } catch (error) {
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">

        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 text-white p-1.5 rounded-xl flex items-center justify-center h-10 w-12 shadow-md">
              <svg height="28" viewBox="0 0 24 24" width="28" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            to continue to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="sr-only" htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md disabled:bg-blue-400"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center w-full">
            <div className="w-full flex justify-center overflow-hidden rounded-xl">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google Login Failed")}
                width="320"
                theme="filled_blue"
                shape="pill"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
