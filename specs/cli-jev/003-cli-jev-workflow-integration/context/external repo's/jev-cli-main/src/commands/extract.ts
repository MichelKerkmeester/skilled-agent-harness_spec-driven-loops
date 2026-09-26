import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import type { BatchItemRunner } from "../core/batch.js";
import {
  BUILTIN_FIELDS,
  buildExtractRequest,
  EXTRACT_FAIL_CONDITIONS,
  type ExtractOutput,
  extractFailed,
  type FieldSpec,
  parseFieldSpec,
  runExtract,
} from "../core/extract.js";
import { CliError, EXIT } from "../errors.js";
import { readInput, readStdin } from "../input.js";
import { parseFailOn, parseProbability } from "../lib.js";
import { clip, emit, formatProbability, paint, type View } from "../output.js";

export interface ExtractFlags {
  want?: string[];
  context?: string;
  minConfidence?: string;
  failOn?: string;
}

export function resolveFields(flags: ExtractFlags): FieldSpec[] {
  const raw = flags.want ?? [];
  if (raw.length === 0)
    throw new CliError(
      `Provide at least one --want field. Builtins: ${Object.keys(BUILTIN_FIELDS).join(", ")}.`,
    );
  try {
    // Allow comma-separated builtins in one flag: --want email,phone
    return raw
      .flatMap((entry) =>
        entry.includes("=")
          ? [entry]
          : entry
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
      )
      .map(parseFieldSpec);
  } catch (err) {
    throw new CliError((err as Error).message);
  }
}

export function resolveExtractText(positional: string | undefined): string {
  if (positional !== undefined) return readInput(positional, "text");
  if (process.stdin.isTTY) throw new CliError("Provide text as an argument, @file, or pipe it on stdin.");
  return readStdin("text");
}

export async function extractAction(
  positional: string | undefined,
  flags: ExtractFlags,
  ctx: CommandContext,
): Promise<number> {
  const fields = resolveFields(flags);
  const text = resolveExtractText(positional);
  const minConfidence = parseProbability(
    "--min-confidence",
    flags.minConfidence,
    ctx.config.extract.minConfidence,
  );
  const failOn = parseFailOn(flags.failOn, EXTRACT_FAIL_CONDITIONS, []);

  if (ctx.dryRun) {
    const { state, questions } = buildExtractRequest({ text, fields, context: flags.context });
    emit({ ...ctx.output, format: "json" }, { model: ctx.config.model, state, questions }, () => ({}));
    return EXIT.OK;
  }

  const output = await runExtract(ctx.ask(), { text, fields, context: flags.context, minConfidence });
  emit(ctx.output, output, () => renderExtract(output, ctx));
  return extractFailed(output, failOn) ? EXIT.JUDGMENT : EXIT.OK;
}

export function renderExtract(out: ExtractOutput, ctx: CommandContext): View {
  const c = ctx.output.color;
  const rows = Object.entries(out.fields).map(([name, f]) => [
    name,
    f.value === null ? paint(c, "dim", "-") : paint(c, "green", clip(f.value, 40)),
    f.normalized === null || f.normalized === undefined || f.normalized === f.value
      ? ""
      : clip(typeof f.normalized === "string" ? f.normalized : JSON.stringify(f.normalized), 30),
    formatProbability(f.confidence),
    f.action === "review"
      ? paint(c, "yellow", f.action)
      : f.action === "none"
        ? paint(c, "dim", `none${f.reason ? ` (${f.reason})` : ""}`)
        : "auto",
    String(f.candidates),
  ]);
  return {
    table: { columns: ["Field", "Value", "Normalized", "Conf", "Action", "Cands"], rows },
    usage: { usage: out.usage, model: out.model, provider: out.provider },
  };
}

/** Batch: each row's text is extracted with the shared field specs. */
export function prepareExtractBatch(flags: ExtractFlags, ctx: CommandContext): BatchItemRunner {
  const fields = resolveFields(flags);
  const minConfidence = parseProbability(
    "--min-confidence",
    flags.minConfidence,
    ctx.config.extract.minConfidence,
  );
  const failOn = parseFailOn(flags.failOn, EXTRACT_FAIL_CONDITIONS, []);
  return async (row) => {
    const output = await runExtract(ctx.ask(), {
      text: row.text,
      fields,
      context: flags.context,
      minConfidence,
    });
    return { output, failed: extractFailed(output, failOn) };
  };
}

export function registerExtract(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("extract")
    .description(
      "Pull values out of text without hallucination: regex finds candidates, Jev picks the right one, code normalizes it.",
    )
    .argument("[text]", "text to extract from, @file, or - for stdin (default: stdin)")
    .option("-w, --want <field>", "field to extract (repeatable, or comma-separated builtins)", collect, [])
    .option("-c, --context <text>", 'what the document is, e.g. "supplier invoice"; sharpens the questions')
    .option("--min-confidence <p>", "confidence below which a value is flagged 'review' (default 0.6)")
    .option(
      "--fail-on <list>",
      `exit 2 when any field is: ${EXTRACT_FAIL_CONDITIONS.join(", ")}, or none (default none)`,
    )
    .addHelpText(
      "after",
      `
Fields:
  Builtins: ${Object.keys(BUILTIN_FIELDS).join(", ")}
  Custom:   name=/regex/            e.g. invoice=/INV-\\d+/
            name=/regex/:description e.g. po=/PO\\s?\\d{6}/:the purchase order number
            name=builtin:description e.g. "sender=email:the sender's address" (quote descriptions with spaces)

Examples:
  jev extract @invoice.txt --want amount,date --want invoice=/INV-\\d+/ --context "supplier invoice"
  cat email.eml | jev extract --want "sender=email:the sender" --want "reply_by=date:the reply deadline" --json`,
    )
    .action(async (text: string | undefined, flags: ExtractFlags, cmd: Command) => {
      await run((ctx) => extractAction(text, flags, ctx), cmd);
    });
}

function collect(value: string, previous: string[]): string[] {
  return [...previous, value];
}
