import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    
    if (
  !email.trim() ||
  !password.trim()
) {
  
  toast.error("Email and Password are required")

  return;
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (
  !emailRegex.test(email)
) {
  toast.error("Please enter a valid email address")

  return;
}

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );



      const token = response.data.token;

      localStorage.setItem(
        "token",
        token
      );

      toast.success("Login Successful")
      navigate("/dashboard");
    } catch (error: any) {
  console.error(error);

  toast.error(
    error.response?.data?.message ||
    "Login failed"
  )

 
}
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Login
      </h1>

      <form
        onSubmit={handleLogin}
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}

export default Login;