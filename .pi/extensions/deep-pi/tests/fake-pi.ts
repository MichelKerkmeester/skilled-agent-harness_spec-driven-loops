import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

type Handler = (event: any, ctx: any) => Promise<any> | any;

export class FakePi {
	handlers = new Map<string, Handler[]>();
	commands = new Map<string, { handler: Handler }>();
	tools = new Map<string, any>();
	activeTools = ["read", "edit", "bash"];

	on(type: string, handler: Handler): void {
		this.handlers.set(type, [...(this.handlers.get(type) ?? []), handler]);
	}
	registerCommand(name: string, command: { handler: Handler }): void {
		this.commands.set(name, command);
	}
	registerTool(tool: { name: string }): void {
		this.tools.set(tool.name, tool);
	}
	getActiveTools(): string[] {
		return [...this.activeTools];
	}
	setActiveTools(names: string[]): void {
		this.activeTools = [...names];
	}
	async emit(type: string, event: any, ctx: any): Promise<any[]> {
		const results: any[] = [];
		for (const handler of this.handlers.get(type) ?? []) results.push(await handler(event, ctx));
		return results;
	}
	asExtensionAPI(): ExtensionAPI {
		return this as unknown as ExtensionAPI;
	}
}

export function fakeContext(model: {
	provider: string;
	id: string;
	name?: string;
	cost?: { input: number; output: number; cacheRead: number; cacheWrite: number };
} | undefined) {
	const statuses = new Map<string, string | undefined>();
	const notifications: string[] = [];
	const notificationSeverities: (string | undefined)[] = [];
	return {
		model,
		cwd: process.cwd(),
		hasUI: true,
		aborted: false,
		abort() { this.aborted = true; },
		ui: {
			setStatus(key: string, value: string | undefined) { statuses.set(key, value); },
			notify(message: string, severity?: string) {
				notifications.push(message);
				notificationSeverities.push(severity);
			},
		},
		statuses,
		notifications,
		notificationSeverities,
	};
}
