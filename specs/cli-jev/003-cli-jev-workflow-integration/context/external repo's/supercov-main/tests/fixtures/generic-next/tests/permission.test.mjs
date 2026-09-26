import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test, { after, before } from "node:test";

const port = 44000 + (process.pid % 1000);
let server;

before(async () => {
  server = spawn("next", ["start", "-p", String(port)], {
    stdio: ["ignore", "ignore", "inherit"],
    env: process.env,
  });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Next fixture server did not start");
});

after(() => server?.kill("SIGTERM"));

for (const [name, admin, owner, expected] of [
  ["admin", true, false, "allowed"],
  ["owner", false, true, "allowed"],
  ["both", true, true, "allowed"],
  ["neither", false, false, "denied"],
]) {
  test(name, async () => {
    const response = await fetch(
      `http://127.0.0.1:${port}/api/permission?admin=${admin ? 1 : 0}&owner=${owner ? 1 : 0}`,
    );
    assert.equal((await response.json()).permission, expected);
  });
}
