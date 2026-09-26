#!/usr/bin/env node
// jev: TypeSafe's Jev model at the command line.

import { createRequire } from "node:module";
import { styleText } from "node:util";
import { Command } from "commander";
import { registerAsk } from "./commands/ask.js";
import { registerAuth } from "./commands/auth.js";
import { registerBatch } from "./commands/batch.js";
import { registerClassify } from "./commands/classify.js";
import { registerCompact } from "./commands/compact.js";
import { registerConfig } from "./commands/config.js";
import { registerExtract } from "./commands/extract.js";
import { registerFind } from "./commands/find.js";
import { registerMatch } from "./commands/match.js";
import { registerModels } from "./commands/models.js";
import { registerRerank } from "./commands/rerank.js";
import { registerRoute } from "./commands/route.js";
import { registerScreen } from "./commands/screen.js";
import { npmRunner, registerUpdate } from "./commands/update.js";
import { registerVerify } from "./commands/verify.js";
import { buildContext, type CommandContext, type GlobalFlags } from "./context.js";
import { CliError, describeError, EXIT } from "./errors.js";
import { checkForUpdate } from "./versionCheck.js";

const require = createRequire(import.meta.url);
const { version, description } = require("../package.json") as { version: string; description: string };

/** One-line summaries and groups for the top-level command list. Full descriptions live on each command. */
const COMMANDS: Record<string, { group: string; summary: string }> = {
  verify: { group: "Judgments", summary: "Check claims against evidence; verdict + probabilities per claim" },
  screen: {
    group: "Judgments",
    summary: "Flag prompt injection, filler, and irrelevance before an agent reads text",
  },
  classify: { group: "Judgments", summary: "Assign one, several, or hierarchical labels with confidence" },
  extract: {
    group: "Judgments",
    summary: "Pull typed values out of text (regex candidates, Jev picks, code normalizes)",
  },
  match: {
    group: "Judgments",
    summary: "Decide if record pairs are the same thing: same, different, or unclear",
  },
  route: {
    group: "Judgments",
    summary: "Pick a handler for a request and fill its arguments from closed sets",
  },
  ask: { group: "Judgments", summary: "Ask raw yes/no, choice, or score questions about any state" },
  find: { group: "Ranking", summary: "Rank up to 250 candidates against a plain-language query" },
  rerank: { group: "Ranking", summary: "Score each candidate's relevance independently and sort" },
  compact: {
    group: "Pipelines",
    summary: "Shrink an agent transcript by dropping stale tool calls, verbatim otherwise",
  },
  batch: { group: "Pipelines", summary: "Run a command over many rows with a concurrency pool; emits JSONL" },
  models: { group: "Account", summary: "List the models available to your account" },
  auth: { group: "Account", summary: "Store, inspect, or remove API keys (keychain or 0600 file)" },
  config: { group: "Account", summary: "Show or edit the jev configuration file" },
  update: { group: "Account", summary: "Check npm for a newer jevctl release and install it" },
  version: { group: "Account", summary: "Print the jev version (same as -V/--version)" },
};

const HELP_FOOTER = `
Examples:
  jev verify "Helmets are optional for adults" --evidence @ordinance.txt
  curl -s https://example.com | jev screen --purpose "extract pricing" --fail-on block,review
  jev classify "The invoice total is wrong" --labels billing,bug,feature --json
  jev find "how do I rotate API keys" --files docs/*.md -k 3
  jev batch classify -i @tickets.txt -- --labels billing,technical,sales

Exit codes:
  0  success
  1  usage, configuration, input, or transport error
  2  a --fail-on judgment condition matched (e.g. a contradicted claim)

Credentials (first found wins unless --provider is set; environment first, then the jev auth login store):
  TYPESAFE_API_KEY                                https://console.typesafe.ai/settings/keys
  OPENROUTER_API_KEY (sk-or-...)                  OpenRouter Decisions API
  CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID    Cloudflare Workers AI

Website: https://jevcli.vectorz.app   Docs: https://docs.typesafe.ai   Per-command help: jev <command> --help`;

export function createProgram(): Command {
  const program = new Command();
  program
    .name("jev")
    .description(description)
    .version(version, "-V, --version", "print the version")
    .showHelpAfterError("(run with --help for usage)")
    .showSuggestionAfterError()
    .configureHelp({
      helpWidth: Math.min(process.stdout.columns || 100, 110),
      styleTitle: (s) => styleText("bold", s),
      styleCommandText: (s) => styleText("cyan", s),
      styleSubcommandText: (s) => styleText("cyan", s),
      styleOptionText: (s) => styleText("green", s),
      styleArgumentText: (s) => styleText("yellow", s),
    })
    .optionsGroup("Output:")
    .option("--json", "print results as JSON (same as --format json)")
    .option("--md", "Markdown output (same as --format md)")
    .option("--format <fmt>", "text, json, jsonl, csv, tsv, or md")
    .option("--pluck <path>", "print one value from the JSON result, e.g. label or results[].verdict")
    .option("-q, --quiet", "omit the usage/model footer in text output")
    .option("--no-color", "disable colored output")
    .optionsGroup("Model and transport:")
    .option("-m, --model <name>", "Jev model, e.g. jev-latest or jev-1.13.0")
    .option("-P, --provider <name>", "auto, typesafe, openrouter, or cloudflare")
    .option("--timeout <ms>", "per-request timeout in milliseconds")
    .option("--dry-run", "print the request that would be sent and exit without calling the API")
    .optionsGroup("Options:")
    .addHelpText("after", HELP_FOOTER);

  const run = async (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => {
    const flags = cmd.optsWithGlobals<GlobalFlags>();
    const ctx = buildContext(flags);
    const code = await fn(ctx);
    if (code !== EXIT.OK) process.exitCode = code;
  };

  // Registration order is the order shown in --help.
  registerVerify(program, run);
  registerScreen(program, run);
  registerClassify(program, run);
  registerExtract(program, run);
  registerMatch(program, run);
  registerRoute(program, run);
  registerAsk(program, run);
  registerFind(program, run);
  registerRerank(program, run);
  registerCompact(program, run);
  registerBatch(program, run);
  registerModels(program, run);
  registerAuth(program, run);
  registerConfig(program, run);
  registerUpdate(program, run, version);

  program
    .command("version")
    .description("Print the jev version. Same as jev -V or jev --version.")
    .action(() => {
      process.stdout.write(`${version}\n`);
    });

  for (const cmd of program.commands) {
    const meta = COMMANDS[cmd.name()];
    if (!meta) throw new Error(`jev: no help metadata for command "${cmd.name()}"`);
    cmd.summary(meta.summary).helpGroup(`${meta.group}:`);
  }
  program
    .helpCommand(false)
    .command("help [command]")
    .summary("Show help for a command")
    .description("Show help for a command, e.g. jev help verify. Same as jev <command> --help.")
    .helpGroup("Account:")
    .action((name: string | undefined) => {
      const target = name ? program.commands.find((c) => c.name() === name) : program;
      if (!target) throw new CliError(`unknown command '${name}' (run jev --help for the list)`, EXIT.ERROR);
      target.outputHelp();
    });
  return program;
}

/** Commands where an update warning would be noise rather than help. */
const SKIP_UPDATE_CHECK = new Set(["update", "version", "help"]);

function warnIfOutdated(argv: string[]): void {
  if (process.env.JEV_NO_UPDATE_CHECK === "1") return;
  if (argv.includes("--quiet") || argv.includes("-q")) return;
  const command = argv.slice(2).find((a) => !a.startsWith("-"));
  if (command && SKIP_UPDATE_CHECK.has(command)) return;

  const latest = checkForUpdate({ currentVersion: version, fetchLatest: () => npmRunner().latestVersion() });
  if (latest) {
    process.stderr.write(
      styleText(
        "yellow",
        `jev: update available (${version} -> ${latest}). Run \`jev update\` to install.\n`,
      ),
    );
  }
}

export async function main(argv: string[] = process.argv): Promise<void> {
  const program = createProgram();
  try {
    await program.parseAsync(argv);
  } catch (err) {
    const debug = process.env.JEV_DEBUG === "1";
    if (err instanceof CliError) {
      process.stderr.write(`jev: ${err.message}\n`);
      process.exitCode = err.exitCode;
    } else {
      process.stderr.write(`jev: ${describeError(err)}\n`);
      process.exitCode = EXIT.ERROR;
    }
    if (debug && err instanceof Error && err.stack) process.stderr.write(`${err.stack}\n`);
  }
  warnIfOutdated(argv);
}

await main();
