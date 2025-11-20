export abstract class StatusCodeError extends Error {
  abstract readonly status: number;
}

export class NotFoundError extends StatusCodeError {
  status = 404;

  constructor(message?: string) {
    super(message || "Not Found");
  }
}

export function encodeError(error: unknown):
  | { success: false; digest?: string }
  | {
      success: true;
      digest: string;
    } {
  if (error instanceof NotFoundError) {
    return {
      success: true,
      digest: encodeNotFoundError(error),
    };
  }

  return {
    success: false,
  };
}

function encodeNotFoundError(error: NotFoundError) {
  return JSON.stringify({
    status: 404,
    message: error.message,
  });
}

export function decodeError(error: unknown):
  | {
      success: false;
      error?: unknown;
      digest?: string;
      type?: string;
    }
  | {
      success: true;
      error: NotFoundError;
      digest: string;
      type: "NotFoundError";
    } {
  const decoded = decodeNotFoundError(error);
  if (decoded.success) {
    return {
      ...decoded,
      type: "NotFoundError",
    };
  }

  return {
    success: false,
    error: undefined,
  };
}

function decodeNotFoundError(error: unknown):
  | {
      success: false;
      error?: NotFoundError;
      digest?: string;
    }
  | {
      success: true;
      error: NotFoundError;
      digest: string;
    } {
  try {
    if (
      typeof error === "object" &&
      error &&
      "digest" in error &&
      typeof error.digest === "string"
    ) {
      const json = JSON.parse(error.digest);
      if (
        typeof json === "object" &&
        json &&
        "status" in json &&
        json.status === 404 &&
        "message" in json &&
        typeof json.message === "string"
      ) {
        return {
          success: true,
          error: new NotFoundError(json.message),
          digest: error.digest,
        };
      }
    }
  } catch {}
  return { success: false };
}
