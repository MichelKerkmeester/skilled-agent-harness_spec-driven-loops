// Mirrors real monorepo runners: npm sets cwd to the package directory and a
// project script spawns the actual node:test invocation from there, so every
// test process runs with a cwd deep inside the workspace rather than at its
// root. Attribution must survive that shape.
import { execSync } from "node:child_process";
execSync(
  "node --test --test-isolation=process --test-concurrency=2 tests/app.test.mjs",
  { stdio: "inherit", env: { ...process.env, NODE_ENV: "test" } },
);
