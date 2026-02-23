import { useState } from "react";
import { loginApi,googleLoginApi } from "../api/authApi";
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
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginApi(form);
      localStorage.setItem(
        "accessToken",
        res.data.accessToken
      );
      setUser(res.data.user);
      setToken(res.data.accessToken);
      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Login failed"
      );
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("Google ID Token:", idToken);
      const res = await googleLoginApi(idToken);
      console.log("Google Login Response:", res);
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(res.data.user);
      setToken(res.data.accessToken);

      navigate("/");
    } catch (error) {
      alert("Google login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Card */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Sign in
        </h2>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Sign In
          </button>
        </form>
         <div className="my-6 flex items-center justify-center">
          <div className=" border-t"></div>
          <span className="mx-3 text-gray-400 text-sm">OR</span>
          <div className="border-t"></div>
        </div>

        {/* 🔥 Google Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google Login Failed")}
          />
        </div>
        {/* Signup link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-red-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
