import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../api/authApi";

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters long");
        }

        setLoading(true);
        try {
            const res = await resetPasswordApi(resetToken, { password });
            setMessage(res.data.message || "Password updated successfully");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired token");
        } finally {
            setLoading(false);
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
                        Create New Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please enter your new password below
                    </p>
                </div>

                {message && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-200">
                        {message} <br /> Redirecting to login...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="sr-only" htmlFor="password">New Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                                placeholder="New Password"
                            />
                        </div>
                        <div>
                            <label className="sr-only" htmlFor="confirm-password">Confirm New Password</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                                placeholder="Confirm New Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md disabled:bg-blue-400"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Remember your password?{" "}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                            Back to Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
