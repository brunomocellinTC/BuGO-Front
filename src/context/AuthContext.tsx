import { ReactNode, createContext, useState, useContext, useEffect } from "react";

interface User {
  email: string;
  name: string;
  oid: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const basename = import.meta.env.VITE_BASENAME || "/";
  const appUrl = `${window.location.origin}${basename}`;

  // Carregar token do localStorage ao montar
  useEffect(() => {
    const storedToken = localStorage.getItem("app_token");
    const storedUser = localStorage.getItem("app_user");

    if (storedToken && storedUser) {
      try {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("app_token");
        localStorage.removeItem("app_user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
      const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;

      if (!clientId || !tenantId) {
        throw new Error(
          "❌ Variáveis do Azure não configuradas. " +
          "Adicione VITE_AZURE_CLIENT_ID e VITE_AZURE_TENANT_ID no arquivo .env"
        );
      }

      const redirectUri =
        import.meta.env.VITE_REDIRECT_URI ||
        `${appUrl}auth/callback`;

      const authUrl =
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
        `client_id=${clientId}&` +
        `response_type=token&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid+profile+email&` +
        `response_mode=fragment`;

      window.location.href = authUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao fazer login";

      setError(message);
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);

    localStorage.removeItem("app_token");
    localStorage.removeItem("app_user");

    const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;

    window.location.href =
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(appUrl)}`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}