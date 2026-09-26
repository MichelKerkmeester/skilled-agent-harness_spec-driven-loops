import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  credentialsPath,
  fileStore,
  resolveCredentials,
  resolveStore,
  withStoredCredentials,
} from "../../src/credentials.js";
import { cliHarness } from "../helpers/cli.js";

describe("auth: core (file store)", () => {
  const h = cliHarness();

  test("credentialsPath follows JEV_CREDENTIALS, else sits beside the config file", () => {
    expect(credentialsPath({ JEV_CREDENTIALS: "/x/c.json" })).toBe("/x/c.json");
    expect(credentialsPath({ JEV_CONFIG: "/cfg/jev/config.json" })).toBe("/cfg/jev/credentials.json");
  });

  test("file store round-trips with 0600 permissions and removes the file when empty", () => {
    const path = join(h.dir(), "creds.json");
    const store = fileStore({ JEV_CREDENTIALS: path });
    expect(store.get("typesafe")).toBeUndefined();
    store.set("typesafe", "ts-key");
    store.set("openrouter", "sk-or-x");
    expect(statSync(path).mode & 0o777).toBe(0o600);
    expect(store.get("typesafe")).toBe("ts-key");
    expect(store.delete("typesafe")).toBe(true);
    expect(store.delete("typesafe")).toBe(false);
    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({ openrouter: "sk-or-x" });
    expect(store.delete("openrouter")).toBe(true);
    expect(existsSync(path)).toBe(false);
  });

  test("resolveStore honors JEV_CREDENTIAL_STORE and rejects unknown values", () => {
    expect(resolveStore({ JEV_CREDENTIAL_STORE: "file", JEV_CREDENTIALS: "/x" }).kind).toBe("file");
    expect(() => resolveStore({ JEV_CREDENTIAL_STORE: "vault" })).toThrow(/JEV_CREDENTIAL_STORE/);
  });

  test("resolution: env wins, then the store; JEV_NO_STORED_CREDENTIALS disables the store", () => {
    const path = join(h.dir(), "creds.json");
    const store = fileStore({ JEV_CREDENTIALS: path });
    store.set("typesafe", "stored");
    const fromStore = resolveCredentials({}, store);
    expect(fromStore).toEqual([
      { provider: "typesafe", source: "file", value: "stored" },
      { provider: "openrouter", source: "none" },
    ]);
    expect(resolveCredentials({ TYPESAFE_API_KEY: "env" }, store)[0]).toEqual({
      provider: "typesafe",
      source: "env",
    });
    expect(withStoredCredentials({}, store).TYPESAFE_API_KEY).toBe("stored");
    expect(withStoredCredentials({ TYPESAFE_API_KEY: "env" }, store).TYPESAFE_API_KEY).toBe("env");
    expect(withStoredCredentials({ JEV_NO_STORED_CREDENTIALS: "1" }, store).TYPESAFE_API_KEY).toBeUndefined();
  });

  test("a corrupt credentials file is a clear error", () => {
    const path = join(h.dir(), "creds.json");
    writeFileSync(path, "{nope");
    expect(() => fileStore({ JEV_CREDENTIALS: path }).get("typesafe")).toThrow(/not valid JSON/);
  });
});

describe("auth: cli", () => {
  const h = cliHarness();

  test("login via stdin, status, a command that uses the stored key, logout", async () => {
    const creds = join(h.dir(), "store", "credentials.json");
    const env = { JEV_CREDENTIALS: creds };

    const login = await h.run(["auth", "login", "--key-stdin"], { noApi: true, env, stdin: "test-key\n" });
    expect(login.code).toBe(0);
    expect(login.stdout).toMatch(/Stored the typesafe key in .*credentials\.json/);
    expect(statSync(creds).mode & 0o777).toBe(0o600);

    const status = await h.run(["auth", "status", "--json"], { noApi: true, env });
    expect(status.code).toBe(0);
    const s = JSON.parse(status.stdout);
    expect(s.store).toBe("file");
    expect(s.credentials[0]).toEqual({
      provider: "typesafe",
      env_var: "TYPESAFE_API_KEY",
      source: "file",
      key: "********",
    });

    // No TYPESAFE_API_KEY in the environment: the stored key must be used against the fake API.
    const screen = await h.run(["screen", "hello", "--json"], {
      noApi: true,
      env: { ...env, TYPESAFE_BASE_URL: h.api().url },
    });
    expect(screen.code).toBe(0);
    expect(JSON.parse(screen.stdout).command).toBe("screen");
    expect(h.api().requests[0]!.headers.authorization).toBe("Bearer test-key");

    const cfg = await h.run(["config", "--json"], {
      noApi: true,
      env: { ...env, TYPESAFE_BASE_URL: h.api().url },
    });
    expect(JSON.parse(cfg.stdout).credential_sources).toEqual({ typesafe: "file", openrouter: "none" });

    const logout = await h.run(["auth", "logout"], { noApi: true, env });
    expect(logout.code).toBe(0);
    expect(existsSync(creds)).toBe(false);
    expect((await h.run(["auth", "status"], { noApi: true, env })).code).toBe(1);
  });

  test("env var takes precedence over the store and status says so", async () => {
    const creds = join(h.dir(), "credentials.json");
    await h.run(["auth", "login", "--key-stdin"], {
      noApi: true,
      env: { JEV_CREDENTIALS: creds },
      stdin: "stored\n",
    });
    const status = await h.run(["auth", "status", "--json"], { env: { JEV_CREDENTIALS: creds } });
    expect(JSON.parse(status.stdout).credentials[0].source).toBe("env");
    const login = await h.run(["auth", "login", "--key-stdin"], {
      env: { JEV_CREDENTIALS: creds },
      stdin: "again\n",
    });
    expect(login.stdout).toMatch(/TYPESAFE_API_KEY is set in this shell/);
  });

  test("validation: empty key, whitespace, openrouter prefix, unknown provider", async () => {
    const env = { JEV_CREDENTIALS: join(h.dir(), "c.json") };
    expect((await h.run(["auth", "login", "--key-stdin"], { noApi: true, env, stdin: "\n" })).stderr).toMatch(
      /No key entered/,
    );
    expect(
      (await h.run(["auth", "login", "--key-stdin"], { noApi: true, env, stdin: "a b\n" })).stderr,
    ).toMatch(/whitespace/);
    expect(
      (
        await h.run(["auth", "login", "openrouter", "--key-stdin"], {
          noApi: true,
          env,
          stdin: "nope\n",
        })
      ).stderr,
    ).toMatch(/sk-or-/);
    expect(
      (await h.run(["auth", "login", "x", "--key-stdin"], { noApi: true, env, stdin: "k\n" })).stderr,
    ).toMatch(/Unknown provider/);
    expect((await h.run(["auth", "logout"], { noApi: true, env })).stdout).toMatch(/Nothing stored/);
  });
});
