import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function KkiapayWidget({ amount, onSuccess, onClose, metadata }) {
  const authUser = useAuthStore((s) => s.authUser);

  useEffect(() => {
    // Charger le script KKiaPay
    const existing = document.getElementById("kkiapay-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id  = "kkiapay-script";
      script.src = "https://cdn.kkiapay.me/k.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openWidget = () => {
    if (!window.openKkiapayWidget) {
      alert("KKiaPay non chargé, réessaie dans quelques secondes.");
      return;
    }

    window.openKkiapayWidget({
      amount:  amount,
      key:     import.meta.env.VITE_KKIAPAY_PUBLIC_KEY,
      sandbox: import.meta.env.VITE_KKIAPAY_SANDBOX === "true",
      name:    authUser?.fullName || "",
      data:    JSON.stringify(metadata || {}),
    });

    window.addSuccessListener((response) => {
      onSuccess && onSuccess(response.transactionId);
    });

    window.addCloseListener(() => {
      onClose && onClose();
    });
  };

  return { openWidget };
}