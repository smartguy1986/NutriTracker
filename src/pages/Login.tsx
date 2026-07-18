import { useEffect } from 'react';
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
  const navigate = useNavigate();
  const { login } = useAuth();

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

  // Generate Truecaller parameters on render
    const requestNonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Construct the deep link
    const appKey = "y22al892a7e025a814b0593e8a0ab6597ca1a";
    const appName = "NutriTrack";
    const deepLink = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${requestNonce}&partnerKey=${appKey}&partnerName=${encodeURIComponent(appName)}&lang=en`;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <div className="flex-1 flex flex-col justify-center px-6 pt-16 pb-8 max-w-md mx-auto w-full">
        <div className="mb-12">
          <div className="w-14 h-14 rounded-2xl bg-brand-green/20 flex items-center justify-center mb-6">
            <FireIcon className="w-7 h-7 text-brand-green" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-text mb-2">Track your<br />nutrition.</h1>
          <p className="text-brand-gray text-sm">Sign in to get started with your personalized calorie journey.</p>
        </div>

        <div className="space-y-6">
          
          <a
            href={deepLink}
            onClick={(e) => {
              sessionStorage.setItem('tc_nonce', requestNonce);
              // Fallback if Truecaller is not installed
              setTimeout(() => {
                if (document.hasFocus()) {
                  console.log("Truecaller app not detected or user cancelled.");
                }
              }, 2000);
            }}
            style={{
              width: "100%", padding: "16px", borderRadius: 14,
              background: "#0087FF", // Truecaller Blue
              color: "#ffffff", textDecoration: "none",
              fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer",
              transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
            }}
            className="active:scale-95 shadow-[0_4px_16px_rgba(0,135,255,0.3)]"
          >
            {/* Minimal Truecaller icon representation */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.12 16.48C19.12 16.48 20.36 17.5 21.05 18.2C21.74 18.9 22.37 19.86 21.93 20.91C21.49 21.96 20.21 22.18 19.13 22.04C16.49 21.7 8.35 18.66 4.3 12.56C2.33 9.61 1.7 6.47 2.05 4.3C2.22 3.16 2.89 1.63 4.14 1.73C5.12 1.81 6.07 2.76 6.8 3.51C7.8 4.54 8.76 5.56 8.76 5.56C9.28 6.08 9.29 6.88 8.73 7.42C8.73 7.42 7.74 8.44 7.21 9C6.83 9.4 6.78 9.94 7.03 10.37C8.18 12.35 9.77 13.98 11.66 15.15C12.08 15.41 12.61 15.36 12.99 14.98C13.56 14.41 14.54 13.43 14.54 13.43C15.09 12.87 15.89 12.88 16.41 13.41C16.41 13.41 17.7 14.77 19.12 16.48Z" fill="white"/>
            </svg>
            Verify with Truecaller
          </a>

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
