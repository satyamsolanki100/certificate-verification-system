import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "university",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/register", form);

      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-xl p-10">
        <h2 className="text-3xl font-bold mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Institution Name"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded"
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded"
          >
            <option value="university">University</option>
            <option value="admin">Admin</option>
            <option value="company">Company</option>
          </select>

          <button className="w-full bg-green-500 p-3 rounded">Register</button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
