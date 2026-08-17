import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { readHandoff, writeHandoff } from "../src/handoff";
import { HANDOFF_ENV } from "../src/types";

describe("handoff propagation", () => {
  it.each([
    ["1", true],
    ["0", false],
  ])("passes the exact %s value to a child process", (value, expected) => {
    const child = spawnSync(
      process.execPath,
      ["-e", 'process.stdout.write(process.env.PI_FAST_MODE_W_SUBAGENT_SUPPORT || "")'],
      {
        env: { ...process.env, [HANDOFF_ENV]: value },
        encoding: "utf8",
      },
    );

    expect(child.status).toBe(0);
    expect(child.stdout).toBe(value);
    expect(readHandoff({ ...process.env, [HANDOFF_ENV]: child.stdout })).toBe(
      expected,
    );
  });

  it("keeps a child's environment copy separate from the parent", () => {
    const parentValue = process.env[HANDOFF_ENV];
    const childEnv = { ...process.env };

    writeHandoff(childEnv, true);

    expect(childEnv[HANDOFF_ENV]).toBe("1");
    expect(process.env[HANDOFF_ENV]).toBe(parentValue);
  });
});
