import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


import api from "../services/api";

function Register() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const handleRegister =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        if (
  !name.trim() ||
  !email.trim() ||
  !password.trim()
) {
  toast.error("All fields are required")

  return;
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (
  !emailRegex.test(email)
) {
  toast.error("Please enter a valid email ID")

  return;
}

if (
  password.length < 8
) {
  toast.error("Password must be of 8 characters or more")
  return;
}
        await api.post(
          "/auth/register",
          {
            name,
            email,
            password,
          }
        );

       toast.success("Verification mail sent successfully.Please check your Inbox")

        navigate("/");
      } catch (error) {
        console.error(error);
        toast.error("Registration Failed")
      }
    };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Register
      </h1>

      <form
        onSubmit={handleRegister}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border rounded-lg px-4 py-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Register
        </button>
        <p className="text-center mt-4">
  Already have an account?{" "}
  <Link
  to="/"
  className="text-blue-500 hover:underline"
>
  Login
</Link>
</p>
      </form>
    </div>
  </div>
  );
}

export default Register;