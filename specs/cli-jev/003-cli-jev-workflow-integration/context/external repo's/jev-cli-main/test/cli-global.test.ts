// Behavior shared by every command: version, help, errors, credentials, plus
// the `models` and `config` commands.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { cliHarness } from "./helpers/cli.js";

const h = cliHarness();

const COMMANDS = [
  "verify",
  "screen",
  "classify",
  "extract",
  "match",
  "route",
  "ask",
  "find",
  "rerank",
  "compact",
  "batch",
  "models",
  "auth",
  "config",
  "update",
];

describe("global behavior", () => {
  test("--version, version, and --help list every command", async () => {
    expect((await h.run(["--version"])).stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
    expect((await h.run(["version"])).stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
    const help = await h.run(["--help"]);
    expect(help.code).toBe(0);
    expect(help.stdout).toContain("Exit codes:");
    for (const cmd of [
      "verify",
      "screen",
      "find",
      "ask",
      "classify",
      "extract",
      "batch",
      "models",
      "config",
      "update",
      "version",
    ]) {
      expect(help.stdout).toContain(cmd);
    }
  });

  test("--help groups commands and options under headings", async () => {
    const help = (await h.run(["--help"])).stdout;
    for (const heading of [
      "Output:",
      "Model and transport:",
      "Judgments:",
      "Ranking:",
      "Pipelines:",
      "Account:",
      "Examples:",
    ]) {
      expect(help).toContain(`\n${heading}\n`);
    }
    expect(help.indexOf("Judgments:")).toBeLessThan(help.indexOf("Account:"));
  });

  test("help <command> prints that command's help; unknown command exits 1", async () => {
    const r = await h.run(["help", "screen"]);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/^Usage: jev screen/);
    const bad = await h.run(["help", "nope"]);
    expect(bad.code).toBe(1);
    expect(bad.stderr).toMatch(/unknown command 'nope'/);
  });

  test("unknown command exits 1 with a hint", async () => {
    const r = await h.run(["bogus"]);
    expect(r.code).toBe(1);
    expect(r.stderr).toMatch(/unknown command/);
  });

  test("missing credentials is a clear error", async () => {
    const r = await h.run(["screen", "hello"], { noApi: true });
    expect(r.code).toBe(1);
    expect(r.stderr).toMatch(/No credentials found/);
  });

  test("bad API key surfaces the HTTP status", async () => {
    const r = await h.run(["screen", "hello"], { env: { TYPESAFE_API_KEY: "wrong" } });
    expect(r.code).toBe(1);
    expect(r.stderr).toMatch(/401|invalid api key/i);
  });

  test("global flags work before or after the subcommand", async () => {
    const before = await h.run(["--json", "screen", "hi"]);
    const after = await h.run(["screen", "hi", "--json"]);
    expect(JSON.parse(before.stdout).command).toBe("screen");
    expect(JSON.parse(after.stdout).command).toBe("screen");
  });
});

describe("update warning", () => {
  test("warns on stderr when a fresh cache says a newer version is out", async () => {
    const cache = join(h.dir(), "update-check.json");
    writeFileSync(cache, JSON.stringify({ latest: "99.0.0", checkedAt: Date.now() }));
    const r = await h.run(["models"], { env: { JEV_NO_UPDATE_CHECK: "0", JEV_VERSION_CACHE: cache } });
    expect(r.stderr).toMatch(/update available.*99\.0\.0/i);
  });

  test("stays quiet when the cache reports the current version", async () => {
    const cache = join(h.dir(), "update-check.json");
    writeFileSync(cache, JSON.stringify({ latest: "0.0.1", checkedAt: Date.now() }));
    const r = await h.run(["models"], { env: { JEV_NO_UPDATE_CHECK: "0", JEV_VERSION_CACHE: cache } });
    expect(r.stderr).not.toMatch(/update available/i);
  });

  test("--quiet and JEV_NO_UPDATE_CHECK suppress the warning", async () => {
    const cache = join(h.dir(), "update-check.json");
    writeFileSync(cache, JSON.stringify({ latest: "99.0.0", checkedAt: Date.now() }));
    const quiet = await h.run(["models", "--quiet"], {
      env: { JEV_NO_UPDATE_CHECK: "0", JEV_VERSION_CACHE: cache },
    });
    expect(quiet.stderr).not.toMatch(/update available/i);
    const disabled = await h.run(["models"], { env: { JEV_VERSION_CACHE: cache } });
    expect(disabled.stderr).not.toMatch(/update available/i);
  });

  test("the version subcommand never shows the warning", async () => {
    const cache = join(h.dir(), "update-check.json");
    writeFileSync(cache, JSON.stringify({ latest: "99.0.0", checkedAt: Date.now() }));
    const env = { JEV_NO_UPDATE_CHECK: "0", JEV_VERSION_CACHE: cache };
    expect((await h.run(["version"], { env })).stderr).not.toMatch(/update available/i);
  });
});

describe("models", () => {
  test("lists models from the API in text and JSON", async () => {
    const r = await h.run(["models"]);
    expect(r.code).toBe(0);
    expect(r.stdout).toContain("jev-latest");
    expect(r.stdout).toContain("jev-preview");
    expect(JSON.parse((await h.run(["models", "--json"])).stdout).models).toHaveLength(2);
  });

  test("--dry-run prints the request and calls nothing", async () => {
    const r = await h.run(["models", "--dry-run"]);
    expect(r.code).toBe(0);
    expect(JSON.parse(r.stdout)).toMatchObject({ command: "models", method: "GET" });
    expect(JSON.parse(r.stdout).url).toMatch(/\/v1\/models$/);
    expect(h.api().requests).toHaveLength(0);
  });
});

describe("config", () => {
  test("path, init, set, show, unset, reset round trip", async () => {
    const cfg = join(h.dir(), "cfg", "config.json");
    const env = { JEV_CONFIG: cfg };
    expect((await h.run(["config", "path"], { env })).stdout.trim()).toBe(cfg);

    expect((await h.run(["config", "init"], { env })).code).toBe(0);
    expect((await h.run(["config", "init"], { env })).code).toBe(1);

    expect((await h.run(["config", "set", "screen.blockAt", "0.6"], { env })).code).toBe(0);
    expect((await h.run(["config", "set", "screen.blockAt", "7"], { env })).code).toBe(1);
    expect((await h.run(["config", "set", "batch.concurrency", "8"], { env })).code).toBe(0);

    const out = JSON.parse((await h.run(["config", "show", "--json"], { env })).stdout);
    expect(out.config.screen.blockAt).toBe(0.6);
    expect(out.config.batch.concurrency).toBe(8);
    expect(out.resolved_provider).toBe("typesafe");
    expect(out.credentials.TYPESAFE_API_KEY).toBe("********");
    expect(out.config_file_exists).toBe(true);

    expect((await h.run(["config", "unset", "screen"], { env })).code).toBe(0);
    expect(JSON.parse((await h.run(["config", "--json"], { env })).stdout).config.screen.blockAt).toBe(0.75);
    expect((await h.run(["config", "reset"], { env })).code).toBe(0);
    expect((await h.run(["config", "reset"], { env })).code).toBe(1);
  });

  test("show without credentials reports the problem and exits 1", async () => {
    const r = await h.run(["config"], { noApi: true });
    expect(r.code).toBe(1);
    expect(r.stdout).toMatch(/No credentials found/);
  });
});

describe("option tables", () => {
  // Commander matches a root option before dispatching to the subcommand, so a
  // short flag declared on both binds to the root one: the subcommand's form is
  // unreachable even though its --help still prints it.
  test("no subcommand short flag is shadowed by a global one", async () => {
    const shorts = (help: string) => [...help.matchAll(/^ {2}(-[A-Za-z]), --/gm)].map((m) => m[1]!);
    const globals = new Set(shorts((await h.run(["--help"])).stdout).filter((f) => f !== "-h"));
    const shadowed: string[] = [];
    for (const name of COMMANDS) {
      for (const flag of shorts((await h.run([name, "--help"])).stdout)) {
        if (flag !== "-h" && globals.has(flag)) shadowed.push(`${name} ${flag}`);
      }
    }
    expect(shadowed).toEqual([]);
  });
});
