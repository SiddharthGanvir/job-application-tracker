import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


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
  alert(
    "All fields are required"
  );

  return;
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (
  !emailRegex.test(email)
) {
  alert(
    "Please enter a valid email address"
  );

  return;
}

if (
  password.length < 8
) {
  alert(
    "Password must be at least 8 characters"
  );

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

        alert(
          "Verification email sent successfully. Please verify your email before logging in."
        );

        navigate("/");
      } catch (error) {
        console.error(error);

        alert(
          "Registration failed"
        );
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