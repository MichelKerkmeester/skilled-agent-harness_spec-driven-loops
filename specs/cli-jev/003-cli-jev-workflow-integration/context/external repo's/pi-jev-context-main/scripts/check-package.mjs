import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

execFileSync("npm", ["run", "check"], { stdio: "inherit" });
const temporary = mkdtempSync(join(tmpdir(), "pi-jev-pack-"));
try {
	const output = execFileSync(
		"npm",
		["pack", "--ignore-scripts", "--json", "--pack-destination", temporary],
		{
			encoding: "utf8",
			stdio: ["ignore", "pipe", "inherit"],
		},
	);
	const [packed] = JSON.parse(output);
	const paths = packed.files.map((file) => file.path);
	for (const path of [
		"src/index.ts",
		"src/context.ts",
		"src/jev.ts",
		"README.md",
		"LICENSE",
		"package.json",
	])
		assert.ok(paths.includes(path), `Missing ${path}`);
	for (const path of paths)
		assert.match(
			path,
			/^(src\/[^/]+\.ts|assets\/[^/]+\.(png|svg)|README\.md|LICENSE|package\.json)$/,
			`Unexpected published file: ${path}`,
		);
	const manifest = JSON.parse(readFileSync("package.json", "utf8"));
	assert.deepEqual(manifest.pi.extensions, ["./src/index.ts"]);
	assert.ok(manifest.keywords.includes("pi-package"));
	// Load the exact packed source through Pi's loader, outside the checkout.
	execFileSync("tar", ["-xzf", join(temporary, packed.filename), "-C", temporary]);
	const { discoverAndLoadExtensions } = await import("@earendil-works/pi-coding-agent");
	const loaded = await discoverAndLoadExtensions(
		[join(temporary, "package/src/index.ts")],
		temporary,
		join(temporary, "agent"),
	);
	assert.deepEqual(loaded.errors, []);
	assert.equal(loaded.extensions.length, 1, "Pi must load the packed extension");
	assert.ok(loaded.extensions[0].commands.has("jev"));
	assert.ok(loaded.extensions[0].commands.has("rejev"));
	console.log(
		`Package verified: ${paths.length} files, ${packed.size} bytes. Pi loaded /jev and /rejev.`,
	);
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
