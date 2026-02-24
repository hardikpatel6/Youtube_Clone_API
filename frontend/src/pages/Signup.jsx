// src/pages/Signup.jsx
import { useState } from "react";
import { signupApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // ✅ default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    if(e.target.name !== "name" && e.target.name !== "email" && e.target.name !== "password" && e.target.name !== "role") {
      return;
    }
    if(e.target.name === "email" && !e.target.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Invalid email address");
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupApi(form);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <h2>Signup</h2>
  //     <input
  //       name="name"
  //       placeholder="Name"
  //       onChange={handleChange}
  //       required
  //     />
  //     <input
  //       name="email"
  //       placeholder="Email"
  //       onChange={handleChange}
  //       required
  //     />
  //     <input
  //       name="password"
  //       type="password"
  //       placeholder="Password"
  //       onChange={handleChange}
  //       required
  //     />
  //     <div>
  //       <label>
  //         <input
  //           type="radio"
  //           name="role"
  //           value="user"
  //           checked={form.role === "user"}
  //           onChange={handleChange}
  //         />
  //         User
  //       </label>
  //       <label>
  //         <input
  //           type="radio"
  //           name="role"
  //           value="admin"
  //           checked={form.role === "admin"}
  //           onChange={handleChange}
  //         />
  //         Admin
  //       </label>
  //     </div>
  //     <button type="submit">Signup</button>
  //   </form>
  // // );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
