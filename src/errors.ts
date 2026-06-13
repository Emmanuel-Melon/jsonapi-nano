import type { ErrorConfig } from "./types";

export function serializeErrors(errors: ErrorConfig | ErrorConfig[]) {
  const errorArray = Array.isArray(errors) ? errors : [errors];
  return {
    errors: errorArray.map((err) => ({
      status: String(err.status),
      title: err.title ?? "Error",
      ...(err.detail && { detail: err.detail }),
      ...(err.code && { code: err.code }),
      ...(err.source && { source: err.source }),
      ...(err.meta && { meta: err.meta }),
    })),
  };
}
