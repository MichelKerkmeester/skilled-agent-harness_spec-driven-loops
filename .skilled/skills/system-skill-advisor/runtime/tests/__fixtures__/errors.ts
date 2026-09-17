export const ErrorCodes = {
  SEARCH_FAILED: 'SEARCH_FAILED',
} as const;

export class MemoryError extends Error {
  code: string;
  context: Record<string, unknown>;

  constructor(code: string, message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.name = 'MemoryError';
    this.code = code;
    this.context = context;
  }
}

function redactPrompt(obj: unknown, prompt: string): unknown {
  if (typeof obj === 'string') return obj.replaceAll(prompt, '[REDACTED_PROMPT]');
  if (Array.isArray(obj)) return obj.map((v) => redactPrompt(v, prompt));
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      result[k] = redactPrompt(v, prompt);
    }
    return result;
  }
  return obj;
}

export function buildErrorResponse(
  toolName: string,
  error: Error,
  input: Record<string, unknown>,
): Record<string, unknown> {
  const prompt = typeof input?.prompt === 'string' ? input.prompt : '';
  const envelope = {
    tool: toolName,
    status: 'error',
    error: {
      name: error.name,
      message: prompt ? error.message.replaceAll(prompt, '[REDACTED_PROMPT]') : error.message,
      code: (error as MemoryError).code,
      context: (error as MemoryError).context
        ? redactPrompt((error as MemoryError).context, prompt)
        : undefined,
    },
    input: redactPrompt(input, prompt),
  };
  return envelope;
}
