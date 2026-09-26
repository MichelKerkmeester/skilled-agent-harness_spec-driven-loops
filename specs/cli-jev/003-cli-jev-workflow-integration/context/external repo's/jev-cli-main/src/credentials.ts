// Stored credentials: OS keychain where available, else a 0600 file. Used to
// fill TYPESAFE_API_KEY / OPENROUTER_API_KEY when the environment lacks them.

import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { configPath } from "./config.js";
import { CliError } from "./errors.js";

export const CREDENTIAL_PROVIDERS = ["typesafe", "openrouter"] as const;
export type CredentialProvider = (typeof CREDENTIAL_PROVIDERS)[number];

export const ENV_VAR: Record<CredentialProvider, string> = {
  typesafe: "TYPESAFE_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
};

export type StoreKind = "keychain" | "file";
export type CredentialSource = "env" | StoreKind | "none";

const SERVICE = "jevctl";

export interface CredentialStore {
  kind: StoreKind;
  /** Human-readable location, for `auth status`. */
  location: string;
  get(provider: CredentialProvider): string | undefined;
  set(provider: CredentialProvider, secret: string): void;
  delete(provider: CredentialProvider): boolean;
}

// ── file backend ────────────────────────────────────────────────────────────

export function credentialsPath(env: NodeJS.ProcessEnv = process.env): string {
  return env.JEV_CREDENTIALS || join(dirname(configPath(env)), "credentials.json");
}

export function fileStore(env: NodeJS.ProcessEnv = process.env): CredentialStore {
  const path = credentialsPath(env);
  const read = (): Record<string, string> => {
    if (!existsSync(path)) return {};
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8"));
      return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
    } catch {
      throw new CliError(`Credentials file ${path} is not valid JSON. Fix or delete it.`);
    }
  };
  const write = (data: Record<string, string>) => {
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
    chmodSync(path, 0o600);
  };
  return {
    kind: "file",
    location: path,
    get: (p) => read()[p] || undefined,
    set: (p, secret) => write({ ...read(), [p]: secret }),
    delete: (p) => {
      const data = read();
      if (!(p in data)) return false;
      delete data[p];
      if (Object.keys(data).length === 0) {
        unlinkSync(path);
      } else write(data);
      return true;
    },
  };
}

// ── keychain backends ───────────────────────────────────────────────────────

function run(cmd: string, args: string[], input?: string): { ok: boolean; out: string } {
  try {
    const out = execFileSync(cmd, args, { input, stdio: ["pipe", "pipe", "ignore"], encoding: "utf8" });
    return { ok: true, out: out.trimEnd() };
  } catch {
    return { ok: false, out: "" };
  }
}

function hasCommand(cmd: string): boolean {
  return run(process.platform === "win32" ? "where" : "which", [cmd]).ok;
}

function macKeychain(): CredentialStore {
  const account = (p: CredentialProvider) => `${p}-api-key`;
  return {
    kind: "keychain",
    location: `macOS Keychain (service "${SERVICE}")`,
    get: (p) => {
      const r = run("security", ["find-generic-password", "-s", SERVICE, "-a", account(p), "-w"]);
      return r.ok && r.out ? r.out : undefined;
    },
    set: (p, secret) => {
      const r = run("security", [
        "add-generic-password",
        "-U",
        "-s",
        SERVICE,
        "-a",
        account(p),
        "-w",
        secret,
      ]);
      if (!r.ok) throw new CliError("Could not write to the macOS Keychain.");
    },
    delete: (p) => run("security", ["delete-generic-password", "-s", SERVICE, "-a", account(p)]).ok,
  };
}

function linuxSecretTool(): CredentialStore {
  const attrs = (p: CredentialProvider) => ["service", SERVICE, "account", `${p}-api-key`];
  return {
    kind: "keychain",
    location: `Secret Service via secret-tool (service "${SERVICE}")`,
    get: (p) => {
      const r = run("secret-tool", ["lookup", ...attrs(p)]);
      return r.ok && r.out ? r.out : undefined;
    },
    set: (p, secret) => {
      const r = run("secret-tool", ["store", "--label", `jev ${p} API key`, ...attrs(p)], secret);
      if (!r.ok)
        throw new CliError("Could not store the key with secret-tool (is a Secret Service daemon running?).");
    },
    delete: (p) => run("secret-tool", ["clear", ...attrs(p)]).ok,
  };
}

/**
 * Pick the store. `JEV_CREDENTIAL_STORE=file|keychain` forces one; otherwise the
 * OS keychain when a supported tool exists, else the file.
 */
export function resolveStore(env: NodeJS.ProcessEnv = process.env): CredentialStore {
  const forced = env.JEV_CREDENTIAL_STORE?.toLowerCase();
  if (forced === "file") return fileStore(env);
  if (forced && forced !== "keychain" && forced !== "auto") {
    throw new CliError(
      `JEV_CREDENTIAL_STORE must be auto, keychain, or file (got "${env.JEV_CREDENTIAL_STORE}").`,
    );
  }
  if (process.platform === "darwin" && hasCommand("security")) return macKeychain();
  if (process.platform === "linux" && hasCommand("secret-tool")) return linuxSecretTool();
  if (forced === "keychain")
    throw new CliError(
      "No supported keychain tool found on this system (macOS `security` or Linux `secret-tool`).",
    );
  return fileStore(env);
}

// ── resolution ──────────────────────────────────────────────────────────────

export interface ResolvedCredential {
  provider: CredentialProvider;
  source: CredentialSource;
  /** Set only when the value came from a store and should be injected into the env. */
  value?: string;
}

/** For each provider, where its key comes from. Does not touch the store when the env already has a key. */
export function resolveCredentials(env: NodeJS.ProcessEnv, store?: CredentialStore): ResolvedCredential[] {
  let lazy: CredentialStore | undefined = store;
  const getStore = () => {
    lazy ??= resolveStore(env);
    return lazy;
  };
  return CREDENTIAL_PROVIDERS.map((provider) => {
    if (env[ENV_VAR[provider]]?.trim()) return { provider, source: "env" as const };
    let value: string | undefined;
    try {
      value = getStore().get(provider);
    } catch {
      value = undefined;
    }
    return value ? { provider, source: getStore().kind, value } : { provider, source: "none" as const };
  });
}

/** A copy of `env` with stored keys filled in where the environment had none. */
export function withStoredCredentials(env: NodeJS.ProcessEnv, store?: CredentialStore): NodeJS.ProcessEnv {
  if (env.JEV_NO_STORED_CREDENTIALS === "1") return env;
  const out: NodeJS.ProcessEnv = { ...env };
  for (const c of resolveCredentials(env, store)) {
    if (c.value) out[ENV_VAR[c.provider]] = c.value;
  }
  return out;
}
