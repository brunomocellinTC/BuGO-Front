import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useAuth();
  const [configError, setConfigError] = useState<string | null>(null);
  const error = searchParams.get("error");

  useEffect(() => {
    // Verificar se as variáveis estão configuradas
    const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
    const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;

    if (!clientId || !tenantId) {
      setConfigError(
        "⚠️ Aplicação não configurada. Adicione VITE_AZURE_CLIENT_ID e VITE_AZURE_TENANT_ID no arquivo .env"
      );
    }

    // Se já está autenticado, redireciona
    const token = localStorage.getItem("app_token");
    if (token && !error) {
      const basename = import.meta.env.VITE_BASENAME || "/";
      window.location.href = basename;
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
        <div className="w-full space-y-8">
          {/* Logo/Título */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">BuGO</h1>
            <p className="text-slate-400">Sistema de Reportagem de Bugs</p>
          </div>

          {/* Card de Login */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Login</h2>
                <p className="text-sm text-slate-400">
                  Faça login com sua conta Microsoft da empresa
                </p>
              </div>

              {configError && (
                <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                  <p className="text-sm text-yellow-200 font-mono">{configError}</p>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <button
                onClick={login}
                disabled={isLoading || !!configError}
                className="w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
                  bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed
                  text-white shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Autenticando...
                  </>
                ) : configError ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                    Configurar .env Primeiro
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.4 24H0V12.6h11.4V24ZM24 24H12.6v-11.4H24V24ZM11.4 11.4H0V0h11.4v11.4Zm12.6 0H12.6V0H24v11.4Z" />
                    </svg>
                    Entrar com Microsoft
                  </>
                )}
              </button>

              <div className="text-center text-xs text-slate-500">
                Apenas usuários da empresa podem acessar
              </div>
            </div>
          </div>

          {/* Info Footer */}
          <div className="rounded-lg bg-slate-800/30 p-4 text-xs text-slate-400">
            <p>
              ℹ️ Você será redirecionado para fazer login com sua conta Microsoft corporativa. Apenas
              endereços de email da empresa serão autorizados.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
