import { checkAzureAuth } from "../api/checkAzureAuth";

type HandleCheckAzureAuthParams = {
  setIsCheckingAzureAuth: (value: boolean) => void;
  setAzureAuthFeedback: (value: { tone: "success" | "error"; message: string } | null) => void;
};

export async function handleCheckAzureAuth({
  setIsCheckingAzureAuth,
  setAzureAuthFeedback
}: HandleCheckAzureAuthParams) {
  setIsCheckingAzureAuth(true);

  try {
    const result = await checkAzureAuth();
    setAzureAuthFeedback({
      tone: "success",
      message: `PAT valida para ${result.organization}/${result.project}`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao validar PAT";
    setAzureAuthFeedback({
      tone: "error",
      message
    });
  } finally {
    setIsCheckingAzureAuth(false);
  }
}
