import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createProvider, envApiKeyAuth } from "@earendil-works/pi-ai";
import {
	buildSessionContext,
	type ExtensionAPI,
	type ExtensionContext,
	estimateTokens,
	getAgentDir,
} from "@earendil-works/pi-coding-agent";
import { candidates, type Judgments, type Message, prune, recentConversation } from "./context.ts";
import { judge } from "./jev.ts";

const STATE = "jev-context";
const PROVIDER = "typesafe";

interface Settings {
	enabled: boolean;
	threshold: number;
	buffer: number;
	cache: boolean;
	model: string;
	timeoutMs: number;
}

const DEFAULTS: Settings = {
	enabled: false,
	threshold: 0.8,
	buffer: 5,
	cache: true,
	model: "jev-latest",
	timeoutMs: 60_000,
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function settingsFrom(value: unknown): Settings {
	if (!isRecord(value) || Object.keys(value).some((key) => !Object.hasOwn(DEFAULTS, key))) {
		throw new Error("Invalid jev-context settings.");
	}
	const settings = { ...DEFAULTS, ...value };
	if (
		typeof settings.enabled !== "boolean" ||
		typeof settings.cache !== "boolean" ||
		typeof settings.threshold !== "number" ||
		!Number.isFinite(settings.threshold) ||
		settings.threshold < 0 ||
		settings.threshold > 1 ||
		!Number.isSafeInteger(settings.buffer) ||
		settings.buffer < 0 ||
		typeof settings.model !== "string" ||
		!settings.model.trim() ||
		!Number.isInteger(settings.timeoutMs) ||
		settings.timeoutMs < 1 ||
		settings.timeoutMs > 2_147_483_647
	) {
		throw new Error(
			"Jev requires boolean enabled/cache, threshold 0..1, a nonnegative integer buffer, " +
				"a model name, and a positive integer timeoutMs.",
		);
	}
	return settings;
}

function loadDefaults(): Settings {
	try {
		return settingsFrom(JSON.parse(readFileSync(join(getAgentDir(), "jev-context.json"), "utf8")));
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") return { ...DEFAULTS };
		throw error;
	}
}

export default function jevContext(pi: ExtensionAPI): void {
	pi.registerProvider(
		createProvider({
			id: PROVIDER,
			name: "TypeSafe (Jev)",
			auth: { apiKey: envApiKeyAuth("TypeSafe API key", ["TYPESAFE_API_KEY"]) },
			// Jev uses the judgment API in jev.ts, not a chat completion API.
			models: [],
			api: {},
		}),
	);

	let defaults = { ...DEFAULTS };
	let settings = { ...DEFAULTS };
	let judgments: Judgments = new Map();
	let running: AbortController | undefined;
	let paused = false;

	function status(ctx: ExtensionContext): void {
		if (!ctx.hasUI) return;
		ctx.ui.setStatus(
			STATE,
			!settings.enabled
				? undefined
				: `jev: ${running ? "judging" : paused ? "paused" : `${judgments.size} judged`}`,
		);
	}

	function stop(): void {
		running?.abort();
		running = undefined;
	}

	function restore(ctx: ExtensionContext): void {
		stop();
		paused = false;
		settings = { ...defaults };
		judgments = new Map();
		const branch = ctx.sessionManager.getBranch();
		// Resolve settings first so earlier judgments use the branch's effective model.
		for (const entry of branch) {
			if (
				entry.type === "custom" &&
				entry.customType === STATE &&
				isRecord(entry.data) &&
				entry.data.version === 1 &&
				entry.data.settings
			) {
				settings = settingsFrom(entry.data.settings);
			}
		}
		for (const entry of branch) {
			if (
				entry.type !== "custom" ||
				entry.customType !== STATE ||
				!isRecord(entry.data) ||
				entry.data.version !== 1
			)
				continue;
			const data = entry.data;
			if (data.model !== settings.model || !Array.isArray(data.judgments)) continue;
			for (const row of data.judgments) {
				if (
					Array.isArray(row) &&
					row.length === 2 &&
					typeof row[0] === "string" &&
					/^[a-f0-9]{64}$/.test(row[0]) &&
					typeof row[1] === "number" &&
					Number.isFinite(row[1]) &&
					row[1] >= 0 &&
					row[1] <= 1
				)
					judgments.set(row[0], row[1]);
			}
		}
		status(ctx);
	}

	function history(ctx: ExtensionContext): Message[] {
		return buildSessionContext(ctx.sessionManager.getEntries(), ctx.sessionManager.getLeafId())
			.messages;
	}

	async function scan(
		ctx: ExtensionContext,
		messages: Message[],
		buffer: number,
		force = false,
	): Promise<boolean> {
		stop();
		if (!settings.enabled || (paused && !force)) return false;
		const units = candidates(messages, buffer).filter(
			(unit) => force || !settings.cache || !judgments.has(unit.key),
		);
		if (!units.length) {
			status(ctx);
			return true;
		}
		const controller = new AbortController();
		running = controller;
		const signal = AbortSignal.any([
			controller.signal,
			AbortSignal.timeout(settings.timeoutMs),
			...(ctx.signal ? [ctx.signal] : []),
		]);
		status(ctx);
		try {
			const apiKey = (await ctx.modelRegistry.getProviderAuth(PROVIDER))?.auth.apiKey;
			if (!apiKey) throw new Error("Run /login typesafe, then /jev on.");
			const scores = await judge(
				units,
				recentConversation(messages),
				settings.model,
				apiKey,
				signal,
			);
			signal.throwIfAborted();
			if (running !== controller) return false;
			// Commit only complete scans. Cancellation or errors cannot install partial decisions.
			pi.appendEntry(STATE, { version: 1, model: settings.model, judgments: [...scores] });
			for (const [key, probability] of scores) judgments.set(key, probability);
			paused = false;
			return true;
		} catch (error) {
			if (running !== controller || controller.signal.aborted || ctx.signal?.aborted) return false;
			paused = true;
			if (ctx.hasUI)
				ctx.ui.notify(
					`Jev paused: ${error instanceof Error ? error.message : String(error)} ` +
						"Existing judgments are unchanged. Use /rejev or /jev on to retry.",
					"warning",
				);
			return false;
		} finally {
			if (running === controller) {
				running = undefined;
				status(ctx);
			}
		}
	}

	async function idleScan(
		ctx: ExtensionContext,
		{ force = false, showSavings = false }: { force?: boolean; showSavings?: boolean } = {},
	): Promise<void> {
		if (!ctx.isIdle() || ctx.hasPendingMessages()) return;
		const messages = history(ctx);
		const completed = await scan(ctx, messages, 0, force);
		if (
			!completed ||
			!showSavings ||
			!settings.enabled ||
			!ctx.hasUI ||
			!ctx.isIdle() ||
			ctx.hasPendingMessages()
		)
			return;
		const kept = prune(messages, judgments, settings.threshold, 0);
		const before = messages.reduce((total, message) => total + estimateTokens(message), 0);
		const after = kept.reduce((total, message) => total + estimateTokens(message), 0);
		const saved = Math.max(0, before - after);
		const amount = saved < 1000 ? String(saved) : `${(saved / 1000).toFixed(1)}k`;
		ctx.ui.notify(`Jev saved ~${amount} context tokens.`, "info");
	}

	pi.on("session_start", (_event, ctx) => {
		defaults = loadDefaults();
		restore(ctx);
	});
	pi.on("session_tree", (_event, ctx) => restore(ctx));
	pi.on("session_shutdown", () => stop());
	pi.on("session_before_switch", () => stop());
	pi.on("session_before_fork", () => stop());
	pi.on("session_before_tree", () => stop());
	pi.on("session_before_compact", () => stop());
	pi.on("input", (_event, ctx) => {
		stop();
		status(ctx);
	});
	pi.on("before_agent_start", (_event, ctx) => {
		stop();
		status(ctx);
	});
	pi.on("agent_start", (_event, ctx) => {
		stop();
		status(ctx);
	});

	pi.on("context", async (event, ctx) => {
		if (!settings.enabled) return;
		// Pi emits this after the complete tool batch, before the next model request.
		// No tool waits for Jev and no partial call/result exchange is removed.
		await scan(ctx, event.messages, settings.buffer);
		if (settings.enabled)
			return { messages: prune(event.messages, judgments, settings.threshold, settings.buffer) };
	});
	pi.on("agent_settled", (_event, ctx) => {
		// Do not hold Pi's event queue while idle. New input cancels this request.
		void idleScan(ctx, { showSavings: true });
	});

	pi.registerCommand("jev", {
		description: "Context pruning: on, off, status, threshold <0..1>, buffer <calls>, cache on|off",
		handler: async (args, ctx) => {
			const [command = "status", value, ...extra] = args.trim().split(/\s+/).filter(Boolean);
			if (command === "status" && value === undefined) {
				ctx.ui.notify(
					`Jev ${settings.enabled ? "on" : "off"}${paused ? " (judging paused)" : ""}. ` +
						`Keep > ${settings.threshold}. Buffer ${settings.buffer}. Cache ${settings.cache ? "on" : "off"}. ` +
						`${judgments.size} judgments. Model ${settings.model}.`,
					"info",
				);
				return;
			}
			let next: Settings;
			try {
				if (extra.length) throw new Error("Too many arguments.");
				const patch: Partial<Settings> = {};
				if ((command === "on" || command === "off") && value === undefined)
					patch.enabled = command === "on";
				else if (command === "threshold" && value !== undefined) patch.threshold = Number(value);
				else if (command === "buffer" && value !== undefined) patch.buffer = Number(value);
				else if (command === "cache" && (value === "on" || value === "off"))
					patch.cache = value === "on";
				else
					throw new Error(
						"Use /jev on|off|status, /jev threshold 0.8, /jev buffer 5, or /jev cache on|off.",
					);
				next = settingsFrom({ ...settings, ...patch });
			} catch (error) {
				ctx.ui.notify(error instanceof Error ? error.message : String(error), "error");
				return;
			}
			stop();
			settings = next;
			paused = false;
			pi.appendEntry(STATE, { version: 1, settings });
			status(ctx);
			ctx.ui.notify(
				settings.enabled
					? "Jev enabled. Candidate history and recent conversation are sent to TypeSafe."
					: "Jev disabled. History is no longer filtered.",
				"info",
			);
			await idleScan(ctx);
		},
	});

	pi.registerCommand("rejev", {
		description:
			"Rejudge all eligible history, including hidden tools, against the recent conversation",
		handler: async (_args, ctx) => {
			if (!settings.enabled) {
				ctx.ui.notify("Enable context pruning with /jev on first.", "info");
				return;
			}
			if (!ctx.isIdle() || ctx.hasPendingMessages()) {
				ctx.ui.notify("Run /rejev when the agent is idle.", "warning");
				return;
			}
			await idleScan(ctx, { force: true });
		},
	});
}
