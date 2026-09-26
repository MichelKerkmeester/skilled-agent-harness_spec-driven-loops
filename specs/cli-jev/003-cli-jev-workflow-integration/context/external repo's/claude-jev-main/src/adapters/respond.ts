export interface ToolResponse {
  [key: string]: unknown;
  content: { type: 'text'; text: string }[];
  isError?: boolean;
}

function message(error: unknown): string {
  if (error instanceof Error) {
    return error.name === 'Error' ? error.message : `${error.name}: ${error.message}`;
  }
  return String(error);
}

/** Every tool answers with one block of text, and a failure reads the same way. */
export async function respond(produce: () => Promise<string>): Promise<ToolResponse> {
  try {
    return { content: [{ type: 'text', text: await produce() }] };
  } catch (error) {
    return { content: [{ type: 'text', text: message(error) }], isError: true };
  }
}
