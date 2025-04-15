import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUri = import.meta.env.VITE_BACKEND_PORT;

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSendOtp = async () => {
    try {
      const res = await axios.post(`${backendUri}/sendOtp`, { email });
      alert(res.data.message);
      setStep("otp");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${backendUri}/verifyOtp`, { email, otp });
      alert(res.data.message);
      setStep("password");
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await axios.post(`${backendUri}/updatePassword`, {
        email,
        password,
      });
      console.log(response);

      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error updating password");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-xl shadow">
      {step === "email" && (
        <>
          <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            onClick={handleSendOtp}
          >
            Send OTP
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-2 mb-4 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>
        </>
      )}

      {step === "password" && (
        <>
          <h2 className="text-xl font-bold mb-4">Set New Password</h2>
          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-2 mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-purple-600 text-white py-2 rounded"
            onClick={handleUpdatePassword}
          >
            Update Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
