import { createHash } from "node:crypto";
import type { ContextEvent } from "@earendil-works/pi-coding-agent";

export type Message = ContextEvent["messages"][number];
export type Judgments = Map<string, number>;

type Position = { message: number } & (
	| { block: number; result: number }
	| { block?: undefined; result?: undefined }
);

export type Candidate = Position & { key: string; text: string };

function candidate(text: string, identity: unknown, position: Position): Candidate {
	return {
		...position,
		text,
		key: createHash("sha256").update(JSON.stringify(identity)).update(text).digest("hex"),
	};
}

/** Keep unknown roles, user instructions, summaries, and non-text input by construction. */
export function candidates(messages: Message[], buffer: number): Candidate[] {
	const calls: Array<{ message: number; block: number; id: string }> = [];
	const results = new Map<string, number[]>();
	for (const [index, message] of messages.entries()) {
		if (message.role === "assistant") {
			for (const [block, content] of message.content.entries()) {
				if (content.type === "toolCall") calls.push({ message: index, block, id: content.id });
			}
		} else if (message.role === "toolResult") {
			const indexes = results.get(message.toolCallId) ?? [];
			indexes.push(index);
			results.set(message.toolCallId, indexes);
		}
	}
	const protectedCalls = new Set(calls.slice(Math.max(0, calls.length - buffer)));
	const counts = new Map<string, number>();
	for (const call of calls) counts.set(call.id, (counts.get(call.id) ?? 0) + 1);

	const units: Candidate[] = [];
	for (const call of calls) {
		if (protectedCalls.has(call) || counts.get(call.id) !== 1) continue;
		const matches = results.get(call.id);
		if (matches?.length !== 1 || matches[0] <= call.message) continue;
		const result = messages[matches[0]];
		const assistant = messages[call.message];
		if (result.role !== "toolResult" || assistant.role !== "assistant") continue;
		if (result.addedToolNames?.length || result.content.some((block) => block.type !== "text"))
			continue;
		const block = assistant.content[call.block];
		if (block.type !== "toolCall") continue;
		// Todo state outlives model context. Keep its operations visible so the agent
		// can use existing task IDs instead of recreating work it has forgotten.
		if (block.name === "todo") continue;
		const text = JSON.stringify({
			kind: "tool",
			call: { name: block.name, arguments: block.arguments },
			result: result.content.map((part) => (part.type === "text" ? part.text : "")),
			isError: result.isError,
		});
		units.push(
			candidate(text, [block.id, assistant.timestamp, result.timestamp], {
				message: call.message,
				block: call.block,
				result: matches[0],
			}),
		);
	}

	for (const [index, message] of messages.entries()) {
		if (message.role === "assistant") {
			const content = message.content.filter((block) => block.type !== "toolCall");
			// Opaque/redacted thinking must not be classified as empty or useless.
			if (
				!content.length ||
				content.some(
					(block) =>
						block.type !== "text" &&
						(block.type !== "thinking" || block.redacted || !block.thinking),
				)
			)
				continue;
			const text = JSON.stringify({
				kind: "assistant",
				content: content.map((block) =>
					block.type === "text" ? { text: block.text } : { thinking: block.thinking },
				),
			});
			units.push(
				candidate(text, [message.timestamp, message.provider, message.model, content], {
					message: index,
				}),
			);
		} else if (message.role === "bashExecution" && !message.excludeFromContext) {
			units.push(
				candidate(
					JSON.stringify({
						kind: "bashExecution",
						command: message.command,
						output: message.output,
						exitCode: message.exitCode,
						cancelled: message.cancelled,
					}),
					message.timestamp,
					{ message: index },
				),
			);
		}
	}
	return units;
}

/** Remove complete call/result pairs. Keep the original reasoning with any surviving calls. */
export function prune(
	messages: Message[],
	judgments: Judgments,
	threshold: number,
	buffer: number,
): Message[] {
	const dropMessages = new Set<number>();
	const dropBlocks = new Map<number, Set<number>>();
	for (const unit of candidates(messages, buffer)) {
		const probability = judgments.get(unit.key);
		if (probability === undefined || probability > threshold) continue;
		if (unit.block === undefined) {
			dropMessages.add(unit.message);
		} else {
			const blocks = dropBlocks.get(unit.message) ?? new Set<number>();
			blocks.add(unit.block);
			dropBlocks.set(unit.message, blocks);
			dropMessages.add(unit.result);
		}
	}
	return messages.flatMap((message, index): Message[] => {
		if (message.role !== "assistant") return dropMessages.has(index) ? [] : [message];
		const content = message.content.filter((_block, block) => !dropBlocks.get(index)?.has(block));
		if (!content.length) return [];
		if (dropMessages.has(index) && !content.some((block) => block.type === "toolCall")) return [];
		return [{ ...message, content }];
	});
}

/** Recent user/assistant text is evidence, not instructions for the judge. Never send image data. */
export function recentConversation(messages: Message[]): string {
	const parts: string[] = [];
	let latestRequest = "";
	for (const message of messages) {
		if (message.role === "user") {
			const text =
				typeof message.content === "string"
					? message.content
					: message.content
							.filter((block) => block.type === "text")
							.map((block) => block.text)
							.join("\n");
			latestRequest = text;
			parts.push(`User: ${text}`);
		} else if (message.role === "assistant") {
			const text = message.content
				.filter((block) => block.type === "text")
				.map((block) => block.text)
				.join("\n");
			if (text) parts.push(`Assistant: ${text}`);
		}
	}
	// A bounded excerpt is intentional. Candidate content itself is never truncated.
	const request = Array.from(latestRequest);
	const requestExcerpt =
		request.length <= 800
			? latestRequest
			: `${request.slice(0, 400).join("")}\n[excerpt omitted]\n${request.slice(-400).join("")}`;
	const recent = Array.from(parts.slice(-6).join("\n\n")).slice(-800).join("");
	return `Latest user request (excerpt):\n${requestExcerpt}\n\nRecent conversation (excerpt):\n${recent}`;
}
