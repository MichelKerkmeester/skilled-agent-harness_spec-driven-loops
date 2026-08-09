import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const RECORD_PATH = join(ROOT, ".opencode/scripts/vendored-fork-provenance.json");
const FORKS = [
	{
		name: "deep-pi",
		directory: ".pi/extensions/deep-pi",
		identity: {
			repository: "https://github.com/christopherarter/deep-pi.git",
			commit: "0f1cbd8124b4fb35df97f85aa943d730f4aae549",
		},
	},
	{
		name: "pi-cache-optimizer",
		directory: ".pi/extensions/pi-cache-optimizer",
		identity: {
			repository: "https://github.com/MichelKerkmeester/pi-cache-optimizer.git",
			commit: "5132d137ce28cb91ec12a5475832df4d5154085a",
		},
	},
];

function isInside(root, candidate) {
	const rootPath = resolve(root);
	const candidatePath = resolve(candidate);
	return candidatePath === rootPath || candidatePath.startsWith(`${rootPath}/`);
}

async function collectFiles(root, entry, output) {
	const candidate = resolve(root, entry);
	if (!isInside(root, candidate)) throw new Error(`files entry escapes package: ${entry}`);

	const details = await stat(candidate);
	if (details.isFile()) {
		output.add(relative(root, candidate));
		return;
	}
	if (!details.isDirectory()) throw new Error(`files entry is not a file or directory: ${entry}`);

	const names = await readdir(candidate, { withFileTypes: true });
	for (const name of names) {
		const child = join(candidate, name.name);
		if (name.isDirectory()) await collectFiles(root, relative(root, child), output);
		else if (name.isFile()) output.add(relative(root, child));
	}
}

async function shippedFiles(packageRoot) {
	const packageJson = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));
	if (!Array.isArray(packageJson.files) || packageJson.files.some((entry) => typeof entry !== "string")) {
		throw new Error(`${relative(ROOT, packageRoot)} has no usable files allowlist`);
	}

	const files = new Set(["package.json"]);
	for (const entry of packageJson.files) await collectFiles(packageRoot, entry, files);
	return [...files].sort();
}

async function hashFiles(packageRoot, files) {
	const hash = createHash("sha256");
	for (const file of files) {
		hash.update(`${file}\0`);
		hash.update(await readFile(join(packageRoot, file)));
		hash.update("\0");
	}
	return `sha256:${hash.digest("hex")}`;
}

async function currentState(fork) {
	const packageRoot = join(ROOT, fork.directory);
	const files = await shippedFiles(packageRoot);
	return {
		identity: fork.identity,
		files,
		filesHash: await hashFiles(packageRoot, files),
	};
}

async function readRecord() {
	try {
		return JSON.parse(await readFile(RECORD_PATH, "utf8"));
	} catch (error) {
		if (error?.code === "ENOENT") return null;
		throw error;
	}
}

function compareState(current, recorded) {
	if (!recorded) return ["no recorded baseline"];
	const reasons = [];
	if (recorded.identity?.repository !== current.identity.repository) reasons.push("repository identity changed");
	if (recorded.identity?.commit !== current.identity.commit) reasons.push("commit identity changed");
	if (recorded.filesHash !== current.filesHash) reasons.push("shipped file content changed");
	if (JSON.stringify(recorded.files) !== JSON.stringify(current.files)) reasons.push("shipped file set changed");
	return reasons;
}

function renderReport(results, recordPath) {
	const lines = ["Vendored fork provenance", `record: ${recordPath}`];
	for (const result of results) {
		const status = result.reasons.length === 0 ? "clean" : "drift";
		lines.push(`${result.name}: ${status}`);
		lines.push(`  identity: ${result.current.identity.repository}@${result.current.identity.commit}`);
		lines.push(`  files: ${result.current.files.length}`);
		lines.push(`  current: ${result.current.filesHash}`);
		if (result.recorded?.filesHash) lines.push(`  recorded: ${result.recorded.filesHash}`);
		for (const reason of result.reasons) lines.push(`  reason: ${reason}`);
	}
	return lines.join("\n");
}

async function main() {
	const record = await readRecord();
	const states = [];
	for (const fork of FORKS) {
		const current = await currentState(fork);
		const recorded = record?.forks?.[fork.name] ?? null;
		states.push({ name: fork.name, current, recorded, reasons: compareState(current, recorded) });
	}

	const output = {
		record: relative(ROOT, RECORD_PATH),
		forks: Object.fromEntries(states.map(({ name, current, recorded, reasons }) => [name, {
			identity: current.identity,
			files: current.files,
			filesHash: current.filesHash,
			recordedHash: recorded?.filesHash ?? null,
			drift: reasons.length > 0,
			reasons,
		}])),
	};

	if (process.argv.includes("--record")) {
		await writeFile(RECORD_PATH, `${JSON.stringify({ schemaVersion: 1, forks: Object.fromEntries(states.map(({ name, current }) => [name, current])) }, null, 2)}\n`);
	}

	if (process.argv.includes("--json")) console.log(JSON.stringify(output, null, 2));
	else console.log(renderReport(states, output.record));
}

try {
	await main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
