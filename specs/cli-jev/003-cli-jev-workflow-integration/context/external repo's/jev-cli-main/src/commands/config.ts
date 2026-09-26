import { existsSync, unlinkSync } from "node:fs";
import type { Command } from "commander";
import { configPath, DEFAULT_CONFIG, readConfigFile, setConfigValue, writeConfigFile } from "../config.js";
import type { CommandContext } from "../context.js";
import { resolveCredentials } from "../credentials.js";
import { CliError, EXIT } from "../errors.js";
import { emit, paint } from "../output.js";
import { resolveProvider } from "../provider.js";

/** Mask a secret to its first four and last two characters. */
export function mask(secret: string | undefined): string | null {
  if (!secret) return null;
  // Show only the last four characters, regardless of source, so env and stored keys look alike.
  return secret.length > 8 ? `…${secret.slice(-4)}` : "********";
}

export function credentialReport(env: NodeJS.ProcessEnv) {
  return {
    TYPESAFE_API_KEY: mask(env.TYPESAFE_API_KEY),
    OPENROUTER_API_KEY: mask(env.OPENROUTER_API_KEY),
    CLOUDFLARE_API_TOKEN: mask(env.JEV_CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_API_TOKEN),
    CLOUDFLARE_ACCOUNT_ID: mask(env.CLOUDFLARE_ACCOUNT_ID),
    TYPESAFE_BASE_URL: env.TYPESAFE_BASE_URL ?? null,
  };
}

/** `rawEnv` is the shell environment; `ctx.env` additionally holds stored credentials. */
export async function configShow(ctx: CommandContext, rawEnv: NodeJS.ProcessEnv): Promise<number> {
  const env = ctx.env;
  const path = configPath(env);
  let resolved: string | null = null;
  let problem: string | null = null;
  try {
    resolved = resolveProvider(env, ctx.config.provider);
  } catch (err) {
    problem = (err as Error).message;
  }
  const payload = {
    config_file: path,
    config_file_exists: existsSync(path),
    config: ctx.config,
    credentials: credentialReport(env),
    credential_sources: Object.fromEntries(resolveCredentials(rawEnv).map((c) => [c.provider, c.source])),
    resolved_provider: resolved,
    problem,
  };
  emit(ctx.output, payload, () => {
    const c = ctx.output.color;
    const rows: string[][] = [
      ["config file", `${path}${payload.config_file_exists ? "" : paint(c, "dim", " (not present)")}`],
      ["provider", `${ctx.config.provider}${resolved ? paint(c, "dim", ` → ${resolved}`) : ""}`],
      ["model", ctx.config.model],
      ["timeoutMs", String(ctx.config.timeoutMs)],
      ["format", ctx.config.format],
      ["verify.autoAccept", String(ctx.config.verify.autoAccept)],
      ["screen.blockAt / reviewAt", `${ctx.config.screen.blockAt} / ${ctx.config.screen.reviewAt}`],
      [
        "find.topK / found / absent",
        `${ctx.config.find.topK} / ${ctx.config.find.found} / ${ctx.config.find.absent}`,
      ],
      [
        "classify.minConfidence / threshold",
        `${ctx.config.classify.minConfidence} / ${ctx.config.classify.threshold}`,
      ],
      ["extract.minConfidence", String(ctx.config.extract.minConfidence)],
      ["batch.concurrency", String(ctx.config.batch.concurrency)],
      ["rerank.topK / min", `${ctx.config.rerank.topK} / ${ctx.config.rerank.min}`],
      ["route.minConfidence", String(ctx.config.route.minConfidence)],
      [
        "compact.keepThreshold / preserveRecent / minReduction",
        `${ctx.config.compact.keepThreshold} / ${ctx.config.compact.preserveRecent} / ${ctx.config.compact.minReduction}`,
      ],
    ];
    for (const [k, v] of Object.entries(payload.credentials)) rows.push([k, v ?? paint(c, "dim", "unset")]);
    for (const [k, v] of Object.entries(payload.credential_sources)) {
      rows.push([`${k} key source`, v === "none" ? paint(c, "dim", "none (run: jev auth login)") : v]);
    }
    return {
      table: { columns: ["Key", "Value"], rows },
      tail: problem ? [paint(c, "yellow", problem)] : undefined,
    };
  });
  return problem ? EXIT.ERROR : EXIT.OK;
}

export function registerConfig(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  const config = program.command("config").description("Show or edit the jev configuration file.");

  config
    .command("show", { isDefault: true })
    .description(
      "Show the effective configuration, detected credentials (masked), and the resolved provider.",
    )
    .action(async (_flags: unknown, cmd: Command) => {
      await run((ctx) => configShow(ctx, process.env), cmd);
    });

  config
    .command("path")
    .description("Print the config file path.")
    .action(() => {
      process.stdout.write(`${configPath(process.env)}\n`);
    });

  config
    .command("set")
    .description(
      "Set a value, e.g. `jev config set model jev-1.13.0` or `jev config set screen.blockAt 0.6`.",
    )
    .argument(
      "<key>",
      "dotted key: provider, model, timeoutMs, format, verify.autoAccept, screen.blockAt, ...",
    )
    .argument("<value>", "value to set")
    .action((key: string, value: string) => {
      const path = configPath(process.env);
      const next = setConfigValue(readConfigFile(path), key, value);
      writeConfigFile(path, next);
      process.stdout.write(`Set ${key} in ${path}\n`);
    });

  config
    .command("unset")
    .description("Remove a top-level key from the config file.")
    .argument("<key>", "top-level key to remove")
    .action((key: string) => {
      const path = configPath(process.env);
      const current = readConfigFile(path) as Record<string, unknown>;
      if (!(key in current)) throw new CliError(`${key} is not set in ${path}.`);
      delete current[key];
      writeConfigFile(path, current);
      process.stdout.write(`Removed ${key} from ${path}\n`);
    });

  config
    .command("init")
    .description("Write a config file with the default values (does not overwrite an existing file).")
    .action(() => {
      const path = configPath(process.env);
      if (existsSync(path)) throw new CliError(`${path} already exists. Edit it or use \`jev config set\`.`);
      writeConfigFile(path, DEFAULT_CONFIG);
      process.stdout.write(`Wrote defaults to ${path}\n`);
    });

  config
    .command("reset")
    .description("Delete the config file.")
    .action(() => {
      const path = configPath(process.env);
      if (!existsSync(path)) throw new CliError(`${path} does not exist.`);
      unlinkSync(path);
      process.stdout.write(`Deleted ${path}\n`);
    });
}
