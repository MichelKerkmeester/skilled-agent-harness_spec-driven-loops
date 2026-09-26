import type { Message } from "../src/context.ts";

export function assistant(content: Extract<Message, { role: "assistant" }>["content"]): Message {
	return {
		role: "assistant",
		content,
		api: "openai-completions",
		provider: "test",
		model: "test",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
		},
		stopReason: "stop",
		timestamp: 1,
	};
}

export function exchange(name = "read", id = "call-1"): Message[] {
	return [
		assistant([{ type: "toolCall", id, name, arguments: { path: "example.ts" } }]),
		{
			role: "toolResult",
			toolCallId: id,
			toolName: name,
			content: [{ type: "text", text: "Example output" }],
			isError: false,
			timestamp: 2,
		},
	];
}
