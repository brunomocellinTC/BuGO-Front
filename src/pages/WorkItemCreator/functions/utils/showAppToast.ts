import type { CreateToastFnReturn, UseToastOptions } from "@chakra-ui/react";

type AppToastPayload = {
  status: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
};

export function showAppToast(toast: CreateToastFnReturn, payload: AppToastPayload) {
  const options: UseToastOptions = {
    position: "top",
    duration: 5000,
    isClosable: true,
    ...payload
  };

  toast(options);
}
