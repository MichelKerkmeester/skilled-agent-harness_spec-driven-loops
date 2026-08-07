import { lstat, mkdtemp, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import {
	atomicWriteFile,
	registerHashlines,
	validateEdits,
} from "../extensions/deeppi/hashlines.js";

const created: string[] = [];
afterEach(async () => {
	readFileRace.armedPath = "";
	readFileRace.externalContent = "";
	for (const path of created.splice(0)) await rm(path, { recursive: true });
});

it("atomically replaces content and preserves the file mode", async () => {
	const dir = await mkdtemp(join(tmpdir(), "deeppi-hashlines-"));
	created.push(dir);
	const path = join(dir, "sample.ts");
	await writeFile(path, "old\n", { mode: 0o640 });
	await atomicWriteFile(path, "new\n");
	expect(await readFile(path, "utf8")).toBe("new\n");
	expect((await stat(path)).mode & 0o777).toBe(0o640);
});

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { lineHash } from "../extensions/deeppi/utils.js";

const readFileRace = vi.hoisted(() => ({
	armedPath: "",
	externalContent: "",
}));

vi.mock("node:fs/promises", async (importOriginal) => {
	const fs = await importOriginal<typeof import("node:fs/promises")>();
	return {
		...fs,
		readFile: async (...args: any[]) => {
			const read = fs.readFile as (...values: any[]) => Promise<string>;
			if (args[0] === readFileRace.armedPath) {
				readFileRace.armedPath = "";
				const original = await read(...args);
				await (fs.writeFile as (path: string, content: string) => Promise<void>)(
					args[0], readFileRace.externalContent,
				);
				return original;
			}
			return read(...args);
		},
	};
});

function captureEditLines() {
	let tool: any;
	const pi = {
		on() {},
		registerTool(value: any) { tool = value; },
	} as unknown as ExtensionAPI;
	const stats = registerHashlines(
		pi,
		(model) => model?.provider === "deepseek" && model.id === "deepseek-v4-pro",
	);
	return { stats, tool };
}

it("rejects unsupported models without touching the file", async () => {
	const dir = await mkdtemp(join(tmpdir(), "deeppi-hashlines-"));
	created.push(dir);
	const path = join(dir, "sample.ts");
	const original = "alpha\nbeta\n";
	await writeFile(path, original);
	const { stats, tool } = captureEditLines();
	const result = await tool.execute("call-1", {
		path: "sample.ts",
		edits: [{ from: 1, from_hash: lineHash("alpha"), to: 1, to_hash: lineHash("alpha"), new_text: "A" }],
	}, new AbortController().signal, undefined, {
		cwd: dir,
		model: { provider: "openrouter", id: "deepseek/deepseek-v4-pro" },
	});
	expect(result.isError).toBe(true);
	expect(result.content[0].text).toContain("dormant");
	expect(await readFile(path, "utf8")).toBe(original);
	expect(stats.editSuccesses).toBe(0);
});

it("validates the entire batch before atomically replacing the file", async () => {
	const dir = await mkdtemp(join(tmpdir(), "deeppi-hashlines-"));
	created.push(dir);
	const path = join(dir, "sample.ts");
	const original = "alpha\nbeta\n";
	await writeFile(path, original);
	const { stats, tool } = captureEditLines();
	const result = await tool.execute("call-2", {
		path: "sample.ts",
		edits: [
			{ from: 1, from_hash: lineHash("alpha"), to: 1, to_hash: lineHash("alpha"), new_text: "A" },
			{ from: 2, from_hash: "stale", to: 2, to_hash: "stale", new_text: "B" },
		],
	}, new AbortController().signal, undefined, {
		cwd: dir,
		model: { provider: "deepseek", id: "deepseek-v4-pro" },
	});
	expect(result.isError).toBe(true);
	expect(await readFile(path, "utf8")).toBe(original);
	expect(stats.editSuccesses).toBe(0);
	expect(stats.hashMismatches).toBe(1);
});

it("rejects overlapping edit ranges", () => {
	const lines = ["A", "B", "C"];
	const error = validateEdits(lines, [
		{ from: 1, from_hash: lineHash("A"), to: 2, to_hash: lineHash("B"), new_text: "X" },
		{ from: 2, from_hash: lineHash("B"), to: 3, to_hash: lineHash("C"), new_text: "Y" },
	]);
	expect(error ?? "").toMatch(/overlap/i);
});

it("does not replace a symlink while leaving its target stale", async () => {
	const dir = await mkdtemp(join(tmpdir(), "deeppi-hashlines-"));
	created.push(dir);
	const target = join(dir, "target.ts");
	const link = join(dir, "link.ts");
	await writeFile(target, "old\n");
	await symlink(target, link);
	let rejected = false;
	try {
		await atomicWriteFile(link, "new\n");
	} catch {
		rejected = true;
	}
	expect((await lstat(link)).isSymbolicLink()).toBe(true);
	expect(await readFile(target, "utf8")).toBe(rejected ? "old\n" : "new\n");
});

it("guards atomic replacements with the validated source snapshot", async () => {
	const dir = await mkdtemp(join(tmpdir(), "deeppi-hashlines-"));
	created.push(dir);
	const path = join(dir, "sample.ts");
	await writeFile(path, "snapshot\n");
	const { tool } = captureEditLines();
	const params = {
		path: "sample.ts",
		edits: [{
			from: 1,
			from_hash: lineHash("snapshot"),
			to: 1,
			to_hash: lineHash("snapshot"),
			new_text: "agent edit",
		}],
	};
	const ctx = {
		cwd: dir,
		model: { provider: "deepseek", id: "deepseek-v4-pro" },
	};
	const matchingResult = await tool.execute(
		"call-matching", params, new AbortController().signal, undefined, ctx,
	);
	expect(matchingResult.isError).not.toBe(true);
	expect(await readFile(path, "utf8")).toBe("agent edit\n");
	await writeFile(path, "snapshot\n");
	readFileRace.armedPath = path;
	readFileRace.externalContent = "newer external content\n";
	const staleResult = await tool.execute(
		"call-stale", params, new AbortController().signal, undefined, ctx,
	);
	expect(staleResult.isError).toBe(true);
	expect(await readFile(path, "utf8")).toBe("newer external content\n");
});

it("does not give known distinct line content the same hash", () => {
	expect(lineHash("critical setting = false"))
		.not.toBe(lineHash("critical setting = true # 7571"));
});
