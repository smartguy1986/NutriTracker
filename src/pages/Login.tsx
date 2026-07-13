import { useState, useEffect } from 'react';
import { FireIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Declare global google object for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

export function Login() {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const valid = phone.replace(/\D/g, "").length >= 10;

  const handlePhoneSubmit = () => {
    if (valid) {
      navigate('/verify-otp', { state: { phone } });
    }
  };

  useEffect(() => {
    // Initialize Google Sign-In when the script loads
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: "768377164273-mkdj4ml7rlc7dd40kss457kqlqp7emk0.apps.googleusercontent.com",
          callback: handleGoogleResponse
        });

        // Render the official Google button into our div
        window.google.accounts.id.renderButton(
          document.getElementById("google-button-container"),
          { theme: "filled_black", size: "large", shape: "pill", width: 320 }
        );
      }
    };

    // If already loaded
    if (window.google) {
      initGoogle();
    } else {
      // Poll for it
      const timer = setInterval(() => {
        if (window.google) {
          clearInterval(timer);
          initGoogle();
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, []);

  const handleGoogleResponse = (response: any) => {
    if (response.credential) {
      // Simple base64url decoding to bypass npm dependency
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);

      login({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <div className="flex-1 flex flex-col justify-center px-6 pt-16 pb-8 max-w-md mx-auto w-full">
        <div className="mb-12">
          <div className="w-14 h-14 rounded-2xl bg-brand-green/20 flex items-center justify-center mb-6">
            <FireIcon className="w-7 h-7 text-brand-green" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-text mb-2">Track your<br />nutrition.</h1>
          <p className="text-brand-gray text-sm">Enter your phone number to get started with your personalized calorie journey.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-brand-gray tracking-widest uppercase mb-3 block">Phone Number</label>
            <div
              style={{
                display: "flex", alignItems: "center", background: "#1e2230",
                borderRadius: 14, border: `1.5px solid ${focused ? "#4ade80" : "rgba(255,255,255,0.08)"}`,
                transition: "border-color 0.2s", padding: "0 16px",
              }}
            >
              <span style={{ color: "#6b7585", fontSize: 15, marginRight: 8, fontWeight: 500 }}>+91</span>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", marginRight: 12 }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="98765 43210"
                maxLength={15}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#f0f2f5", fontSize: 17, padding: "16px 0", letterSpacing: 1,
                }}
                className="font-mono"
              />
            </div>
          </div>

          <button
            onClick={handlePhoneSubmit}
            disabled={!valid}
            style={{
              width: "100%", padding: "16px", borderRadius: 14,
              background: valid ? "#4ade80" : "#1e2230",
              color: valid ? "#0d1a0f" : "#6b7585",
              fontWeight: 700, fontSize: 16, border: "none", cursor: valid ? "pointer" : "default",
              transition: "all 0.2s",
            }}
          >
            Continue →
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-xs text-brand-gray uppercase tracking-widest">or</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          <div className="flex justify-center w-full overflow-hidden rounded-xl">
            <div id="google-button-container"></div>
          </div>
        </div>

        <p className="text-xs text-brand-gray text-center mt-12 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      <div className="px-6 pb-12 grid grid-cols-3 gap-4 max-w-md mx-auto w-full">
        {[
          { label: "Calories", value: "2,000", unit: "daily goal" },
          { label: "Meals", value: "5", unit: "categories" },
          { label: "Users", value: "50K+", unit: "tracking" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#1a1e28", borderRadius: 14, padding: "14px 12px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#6b7585", marginTop: 2 }}>{s.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
