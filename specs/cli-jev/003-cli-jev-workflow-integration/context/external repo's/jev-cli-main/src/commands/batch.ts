import { createWriteStream, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Command } from "commander";
import type { CommandContext } from "../context.js";
import { type BatchItemRunner, type BatchRecord, parseRows, runBatch } from "../core/batch.js";
import { CliError, EXIT } from "../errors.js";
import { readInput } from "../input.js";
import { paint, pluck, renderDelimited, renderMarkdown, renderPluck, type View } from "../output.js";
import { prepareAskBatch, registerAsk } from "./ask.js";
import { prepareClassifyBatch, registerClassify } from "./classify.js";
import { prepareExtractBatch, registerExtract } from "./extract.js";
import { prepareFindBatch, registerFind } from "./find.js";
import { prepareRerankBatch, registerRerank } from "./rerank.js";
import { prepareRouteBatch, registerRoute } from "./route.js";
import { prepareScreenBatch, registerScreen } from "./screen.js";
import { prepareVerifyBatch, registerVerify } from "./verify.js";

type Register = (
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) => void;
// biome-ignore lint/suspicious/noExplicitAny: each command has its own flag type; the registry erases it
type Prepare = (flags: any, ctx: CommandContext) => BatchItemRunner;

/** Commands that accept one text input per row. */
export const BATCHABLE: Record<string, { register: Register; prepare: Prepare; rowIs: string }> = {
  classify: { register: registerClassify, prepare: prepareClassifyBatch, rowIs: "the text to classify" },
  screen: { register: registerScreen, prepare: prepareScreenBatch, rowIs: "the text to screen" },
  extract: { register: registerExtract, prepare: prepareExtractBatch, rowIs: "the text to extract from" },
  ask: { register: registerAsk, prepare: prepareAskBatch, rowIs: "the state" },
  verify: {
    register: registerVerify,
    prepare: prepareVerifyBatch,
    rowIs: "one claim (evidence is shared via -e)",
  },
  find: {
    register: registerFind,
    prepare: prepareFindBatch,
    rowIs: "one query (candidates are shared via --files etc.)",
  },
  rerank: {
    register: registerRerank,
    prepare: prepareRerankBatch,
    rowIs: "one query (candidates are shared via --files etc.)",
  },
  route: { register: registerRoute, prepare: prepareRouteBatch, rowIs: "the request to route" },
};

export interface BatchFlags {
  input?: string;
  output?: string;
  concurrency?: string;
  failFast?: boolean;
}

const PLACEHOLDER = "__jev_batch_row__";

/**
 * Parse the sub-command's own flags by running its commander definition in capture mode.
 * Commands with a required positional (find, rerank) get a placeholder so parsing succeeds;
 * any other positional means the user passed a text argument that each row should supply.
 */
export async function captureSubFlags(command: string, argv: string[]): Promise<Record<string, unknown>> {
  const entry = BATCHABLE[command];
  if (!entry)
    throw new CliError(`"${command}" cannot be batched. Batchable: ${Object.keys(BATCHABLE).join(", ")}.`);
  let captured: Record<string, unknown> | undefined;
  let positional: string[] = [];
  const tmp = new Command().exitOverride().configureOutput({ writeErr: () => {}, writeOut: () => {} });
  entry.register(tmp, async (_fn, cmd) => {
    captured = cmd.opts();
    positional = cmd.args;
  });
  const parse = (args: string[]) => tmp.parseAsync(["node", "jev", command, ...args]);
  try {
    await parse(argv);
  } catch (err) {
    const message = (err as Error).message ?? "";
    if (!/missing required argument/i.test(message)) {
      throw new CliError(`Invalid ${command} flags: ${message.replace(/^error: /, "")}`);
    }
    try {
      await parse([...argv, PLACEHOLDER]);
    } catch (err2) {
      throw new CliError(
        `Invalid ${command} flags: ${((err2 as Error).message ?? "").replace(/^error: /, "")}`,
      );
    }
  }
  const leaked = positional.filter((p) => p !== PLACEHOLDER);
  if (leaked.length > 0) {
    throw new CliError(
      `Do not pass positional input to a batched ${command}; each row supplies ${entry.rowIs}.`,
    );
  }
  return captured ?? {};
}

export async function batchAction(
  command: string,
  subArgs: string[],
  flags: BatchFlags,
  ctx: CommandContext,
): Promise<number> {
  if (!flags.input)
    throw new CliError("Provide --input <@file|-> with one row per line (plain text or JSONL).");
  const subFlags = await captureSubFlags(command, subArgs);
  const entry = BATCHABLE[command]!;
  const item = entry.prepare(subFlags, ctx);
  const concurrency =
    flags.concurrency === undefined ? ctx.config.batch.concurrency : Number(flags.concurrency);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 64)
    throw new CliError("--concurrency must be an integer from 1 to 64.");

  let rows: ReturnType<typeof parseRows>;
  try {
    rows = parseRows(readInput(flags.input, "batch input"));
  } catch (err) {
    if (err instanceof CliError) throw err;
    throw new CliError((err as Error).message);
  }

  if (ctx.dryRun) {
    process.stdout.write(
      `${JSON.stringify({ command, rows: rows.length, concurrency, flags: subFlags }, null, 2)}\n`,
    );
    return EXIT.OK;
  }

  const out = flags.output ? openOutput(flags.output) : process.stdout;
  const format = ctx.output.format;
  const streaming = format === "text" || format === "jsonl";
  const collected: BatchRecord[] = [];
  const write = (record: BatchRecord) => {
    if (ctx.output.pluck) {
      out.write(`${renderPluck(pluck(record, ctx.output.pluck), format === "json" ? "jsonl" : format)}\n`);
    } else if (streaming) {
      out.write(`${JSON.stringify(record)}\n`);
    } else collected.push(record);
  };
  const stopOnError = Boolean(flags.failFast);
  let aborted = false;
  const guarded: BatchItemRunner = async (row) => {
    if (aborted) throw new Error("skipped after earlier failure (--fail-fast)");
    try {
      return await item(row);
    } catch (err) {
      if (stopOnError) aborted = true;
      throw err;
    }
  };

  const { summary } = await runBatch(rows, guarded, { concurrency, onRecord: write });
  if (!ctx.output.pluck && !streaming) {
    if (format === "json") out.write(`${JSON.stringify(collected, null, 2)}\n`);
    else {
      const view: View = {
        table: {
          columns: ["id", "ok", "failed", "result"],
          rows: collected.map((r) => [
            r.id,
            String(r.ok),
            String(r.failed),
            r.ok ? summarizeResult(r.result) : `error: ${r.error}`,
          ]),
        },
      };
      out.write(
        `${format === "md" ? renderMarkdown(view, { quiet: true }) : renderDelimited(view, format === "tsv" ? "\t" : ",")}\n`,
      );
    }
  }
  if (out !== process.stdout)
    await new Promise<void>((resolve) => (out as ReturnType<typeof createWriteStream>).end(resolve));

  const c = ctx.output.color;
  const line = `${summary.total} rows · ${summary.ok} ok · ${summary.errors} errors · ${summary.failed} matched fail-on · ${summary.input_tokens} in / ${summary.output_tokens} out tokens`;
  if (!ctx.output.quiet || out === process.stdout)
    process.stderr.write(`${paint(c, summary.errors ? "yellow" : "dim", line)}\n`);

  if (summary.errors > 0) return EXIT.ERROR;
  return summary.failed > 0 ? EXIT.JUDGMENT : EXIT.OK;
}

/** One-cell summary of a sub-command result, for csv/tsv/md batch tables. */
export function summarizeResult(result: unknown): string {
  // biome-ignore lint/suspicious/noExplicitAny: answer payloads are the SDK's loosely typed union
  const r = (result ?? {}) as Record<string, any>;
  if (typeof r.label === "string") return r.label;
  if (Array.isArray(r.applied)) return r.applied.join("; ");
  if (Array.isArray(r.path)) return r.path.join(" > ");
  if (r.handler !== undefined) return r.handler ?? "none";
  if (r.recommendation?.action) return r.recommendation.action;
  if (r.exists_verdict)
    return `${r.exists_verdict}: ${(r.top ?? []).map((t: { id: string }) => t.id).join("; ")}`;
  if (Array.isArray(r.kept)) return r.kept.join("; ");
  if (Array.isArray(r.results) && r.results[0]?.verdict)
    return r.results.map((x: { verdict: string }) => x.verdict).join("; ");
  if (r.fields)
    return Object.entries(r.fields)
      .map(([k, v]) => `${k}=${(v as { value: string | null }).value ?? ""}`)
      .join("; ");
  if (r.answers)
    return Object.entries(r.answers)
      .map(([k, v]) => {
        const a = v as { choice?: unknown; noul?: unknown; score?: unknown };
        return `${k}=${a.choice ?? a.noul ?? a.score ?? ""}`;
      })
      .join("; ");
  return "";
}

function openOutput(ref: string) {
  const path = ref.startsWith("@") ? ref.slice(1) : ref;
  mkdirSync(dirname(path), { recursive: true });
  return createWriteStream(path, { encoding: "utf8" });
}

export function registerBatch(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("batch")
    .description(
      "Run classify, screen, extract, ask, verify, or find over many rows with a concurrency pool. Emits JSONL.",
    )
    .argument("<command>", `one of: ${Object.keys(BATCHABLE).join(", ")}`)
    .argument("[args...]", "flags for that command, after --")
    .requiredOption(
      "-i, --input <ref>",
      "rows: @file or - ; plain lines, or JSONL objects with text (or state) and optional id",
    )
    .option("-o, --output <path>", "write JSONL records here instead of stdout")
    .option("--concurrency <n>", "parallel requests (default 4)")
    .option("--fail-fast", "stop scheduling new rows after the first error")
    .allowUnknownOption()
    .addHelpText(
      "after",
      `
Output: one JSON object per row: {index, id, ok, failed, result | error, meta}. Rows keep input order.
        --format json collects rows into one array; --format csv|tsv|md prints a summary table (id, ok,
        failed, result). --pluck <path> prints one value per row, e.g. --pluck result.label.
Exit:   1 if any row errored, 2 if any row matched the command's --fail-on, else 0.

Examples:
  jev batch classify --input @tickets.txt -- --labels billing,technical,sales --other
  jev batch screen -i @pages.jsonl -o results.jsonl --concurrency 8 -- --purpose "extract pricing"
  jev batch extract -i @emails.jsonl -- --want sender=email --want date
  jev batch verify -i @claims.txt -- --evidence @spec.md --fail-on contradicted,unsupported`,
    )
    .action(async (command: string, args: string[], flags: BatchFlags, cmd: Command) => {
      await run(
        (ctx) =>
          batchAction(
            command,
            args.filter((a) => a !== "--"),
            flags,
            ctx,
          ),
        cmd,
      );
    });
}
