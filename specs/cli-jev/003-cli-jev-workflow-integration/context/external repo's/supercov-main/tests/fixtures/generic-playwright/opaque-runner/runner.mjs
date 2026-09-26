import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { OpaqueImageBuilder } from "./sdk.mjs";

const temporary = mkdtempSync(resolve(tmpdir(), "supercov-opaque-esm-guest-"));
const guestRoot = resolve(temporary, "workspace");
try {
  const image = await OpaqueImageBuilder.build({
    mounts: [{ source: process.cwd(), target: guestRoot }],
    snapshotTag: "public-opaque-esm-fixture",
  });
  const machine = await image.createPool().acquire();
  const environment = Object.fromEntries(
    ["CI", "FORCE_COLOR", "HOME", "NO_COLOR", "PATH", "TMPDIR"]
      .filter((name) => process.env[name] !== undefined)
      .map((name) => [name, process.env[name]]),
  );
  const result = await machine.execute(["npm", "test"], { environment });
  if (result.signal) throw new Error(`Opaque ESM guest exited on ${result.signal}`);
  process.exitCode = result.exitCode ?? 1;
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
