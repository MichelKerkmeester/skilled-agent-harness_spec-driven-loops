// vitest globalSetup: the CLI tests spawn dist/cli.js, so make sure it is fresh.
import { execSync } from "node:child_process";

export default function setup(): void {
  execSync("npx tsc -p tsconfig.build.json", { stdio: "inherit" });
}
