const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { resolve } = require("node:path");
const { OpaqueImageBuilder } = require("./sdk.cjs");

async function main() {
  const temporary = mkdtempSync(resolve(tmpdir(), "supercov-opaque-guest-"));
  const guestRoot = resolve(temporary, "workspace");
  try {
    const image = await OpaqueImageBuilder.build({
      mounts: [{ source: process.cwd(), target: guestRoot }],
      snapshotKey: "public-opaque-runner-fixture",
    });
    const pool = image.createPool();
    const machine = await pool.acquire();
    const environment = Object.fromEntries(
      ["CI", "FORCE_COLOR", "HOME", "NO_COLOR", "PATH", "TMPDIR"]
        .filter((name) => process.env[name] !== undefined)
        .map((name) => [name, process.env[name]]),
    );
    const result = await machine.exec({
      argv: [
        "npm",
        "test",
      ],
      env: environment,
    });
    if (result.signal) throw new Error(`Opaque guest exited on ${result.signal}`);
    process.exitCode = result.exitCode ?? 1;
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
