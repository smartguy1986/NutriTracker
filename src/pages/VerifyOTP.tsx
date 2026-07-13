import { useState, useEffect } from 'react';
import { ShieldCheckIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const phone = location.state?.phone || "your number";

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleInput = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      const el = document.getElementById(`otp-${idx + 1}`);
      el?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const filled = otp.every((d) => d !== "");

  const handleVerify = () => {
    // Simulate successful verify
    login();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col px-6 pt-14 pb-8 font-sans max-w-md mx-auto w-full">
      <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-brand-gray mb-10 w-fit active:scale-95 transition-transform">
        <ChevronLeftIcon className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      <div className="mb-10">
        <div className="w-14 h-14 rounded-2xl bg-brand-green/20 flex items-center justify-center mb-6">
          <ShieldCheckIcon className="w-8 h-8 text-brand-green" />
        </div>
        <h2 className="text-2xl font-extrabold text-brand-text mb-2">Verify your<br />number</h2>
        <p className="text-sm text-brand-gray">
          We sent a 6-digit code to <span style={{ color: "#4ade80" }} className="font-mono">{phone}</span>
        </p>
      </div>

      <div className="flex gap-3 mb-8 justify-between">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInput(e.target.value, i)}
            onKeyDown={(e) => handleKey(e, i)}
            style={{
              width: 48, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700,
              background: "#1e2230", borderRadius: 12,
              border: `1.5px solid ${digit ? "#4ade80" : "rgba(255,255,255,0.08)"}`,
              color: "#f0f2f5", outline: "none", transition: "border-color 0.2s",
            }}
            className="font-mono"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={!filled}
        style={{
          width: "100%", padding: 16, borderRadius: 14,
          background: filled ? "#4ade80" : "#1e2230",
          color: filled ? "#0d1a0f" : "#6b7585",
          fontWeight: 700, fontSize: 16, border: "none", cursor: filled ? "pointer" : "default",
          transition: "all 0.2s", marginBottom: 20,
        }}
      >
        Verify & Continue
      </button>

      <div className="text-center">
        {timer > 0 ? (
          <p className="text-sm text-brand-gray">Resend code in <span style={{ color: "#4ade80" }} className="font-mono">{timer}s</span></p>
        ) : (
          <button onClick={() => setTimer(30)} className="text-sm text-brand-green font-semibold">
            Resend OTP
          </button>
        )}
      </div>

      <div style={{ marginTop: "auto", background: "#1a1e28", borderRadius: 16, padding: 16 }}>
        <p style={{ fontSize: 12, color: "#6b7585", textAlign: "center" }}>
          For demo purposes, any 6-digit code works
        </p>
      </div>
    </div>
  );
}
