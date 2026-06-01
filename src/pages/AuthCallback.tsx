import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiBaseUrl } from "../pages/WorkItemCreator/functions/api/getApiBaseUrl";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Extrair token da URL (após #)
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const microsoftToken = params.get("access_token");

        if (!microsoftToken) {
          throw new Error("Token não recebido do Microsoft");
        }

        // Enviar para backend trocar por JWT
        const response = await fetch(`${getApiBaseUrl()}/api/auth/microsoft-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: microsoftToken })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Autenticação falhou");
        }

        const data = await response.json();

        // Guardar token e usuário
        localStorage.setItem("app_token", data.access_token);
        localStorage.setItem("app_user", JSON.stringify(data.user));

        // Recarregar página para atualizar context
        window.location.href = "/";
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro na autenticação";
        console.error("[Auth Callback Error]", message);
        localStorage.removeItem("app_token");
        localStorage.removeItem("app_user");
        navigate("/login?error=" + encodeURIComponent(message));
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Autenticando...</p>
    </div>
  );
}
