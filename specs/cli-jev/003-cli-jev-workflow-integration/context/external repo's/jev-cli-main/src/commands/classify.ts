import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import type { BatchItemRunner } from "../core/batch.js";
import {
  type AnyClassifyOutput,
  buildClassifyMultiRequest,
  buildClassifyRequest,
  CLASSIFY_FAIL_CONDITIONS,
  classifyFailed,
  type LabelDef,
  parseLabelJson,
  parseLabelList,
  parseTaxonomy,
  runClassify,
  runClassifyMulti,
  runClassifyTaxonomy,
  type Taxonomy,
} from "../core/classify.js";
import { CliError, EXIT } from "../errors.js";
import { parseJson, readInput, readStdin } from "../input.js";
import { parseFailOn, parseProbability } from "../lib.js";
import { emit, formatProbability, paint, type View } from "../output.js";

export interface ClassifyFlags {
  labels?: string;
  labelsJson?: string;
  taxonomy?: string;
  multi?: boolean;
  other?: boolean;
  instructions?: string;
  minConfidence?: string;
  threshold?: string;
  stateJson?: boolean;
  failOn?: string;
}

interface Resolved {
  mode: "single" | "multi" | "taxonomy";
  labels: LabelDef[];
  taxonomy?: Taxonomy;
  minConfidence: number;
  threshold: number;
  failOn: ReturnType<typeof parseFailOn<(typeof CLASSIFY_FAIL_CONDITIONS)[number]>>;
}

export function resolveClassifyFlags(flags: ClassifyFlags, ctx: CommandContext): Resolved {
  const sources = [flags.labels, flags.labelsJson, flags.taxonomy].filter(Boolean).length;
  if (sources !== 1) throw new CliError("Provide exactly one of --labels, --labels-json, or --taxonomy.");
  if (flags.taxonomy && flags.multi) throw new CliError("--multi cannot be combined with --taxonomy.");
  const minConfidence = parseProbability(
    "--min-confidence",
    flags.minConfidence,
    ctx.config.classify.minConfidence,
  );
  const threshold = parseProbability("--threshold", flags.threshold, ctx.config.classify.threshold);
  const failOn = parseFailOn(flags.failOn, CLASSIFY_FAIL_CONDITIONS, []);
  try {
    if (flags.taxonomy) {
      const taxonomy = parseTaxonomy(parseJson(readInput(flags.taxonomy, "taxonomy"), "taxonomy"));
      return { mode: "taxonomy", labels: [], taxonomy, minConfidence, threshold, failOn };
    }
    const labels = flags.labels
      ? parseLabelList(flags.labels)
      : parseLabelJson(parseJson(readInput(flags.labelsJson!, "labels"), "labels"));
    if (labels.length < (flags.multi ? 1 : 2)) {
      throw new CliError(
        flags.multi ? "Provide at least one label." : "Provide at least two labels (or use --multi).",
      );
    }
    return { mode: flags.multi ? "multi" : "single", labels, minConfidence, threshold, failOn };
  } catch (err) {
    if (err instanceof CliError) throw err;
    throw new CliError((err as Error).message);
  }
}

export function resolveClassifyText(positional: string | undefined, flags: ClassifyFlags): unknown {
  let raw: string;
  if (positional !== undefined) raw = readInput(positional, "text");
  else if (!process.stdin.isTTY) raw = readStdin("text");
  else throw new CliError("Provide text as an argument, @file, or pipe it on stdin.");
  return flags.stateJson ? parseJson(raw, "text") : raw;
}

async function classifyOne(
  text: unknown,
  r: Resolved,
  flags: ClassifyFlags,
  ctx: CommandContext,
): Promise<AnyClassifyOutput> {
  const ask = ctx.ask();
  if (r.mode === "taxonomy") {
    return runClassifyTaxonomy(ask, {
      text,
      taxonomy: r.taxonomy!,
      instructions: flags.instructions,
      other: Boolean(flags.other),
      minConfidence: r.minConfidence,
    });
  }
  if (r.mode === "multi") {
    return runClassifyMulti(ask, {
      text,
      labels: r.labels,
      instructions: flags.instructions,
      threshold: r.threshold,
    });
  }
  return runClassify(ask, {
    text,
    labels: r.labels,
    instructions: flags.instructions,
    other: Boolean(flags.other),
    minConfidence: r.minConfidence,
  });
}

export async function classifyAction(
  positional: string | undefined,
  flags: ClassifyFlags,
  ctx: CommandContext,
): Promise<number> {
  const r = resolveClassifyFlags(flags, ctx);
  const text = resolveClassifyText(positional, flags);

  if (ctx.dryRun) {
    if (r.mode === "taxonomy") {
      emit(
        { ...ctx.output, format: "json" },
        {
          model: ctx.config.model,
          note: "taxonomy runs one request per level; showing the first",
          state: text,
          taxonomy: r.taxonomy,
        },
        () => ({}),
      );
      return EXIT.OK;
    }
    const built =
      r.mode === "multi"
        ? buildClassifyMultiRequest({ text, labels: r.labels, instructions: flags.instructions })
        : buildClassifyRequest({
            text,
            labels: r.labels,
            instructions: flags.instructions,
            other: Boolean(flags.other),
          });
    emit(
      { ...ctx.output, format: "json" },
      { model: ctx.config.model, state: built.state, questions: built.questions },
      () => ({}),
    );
    return EXIT.OK;
  }

  const output = await classifyOne(text, r, flags, ctx);
  emit(ctx.output, output, () => renderClassify(output, ctx));
  return classifyFailed(output, r.failOn) ? EXIT.JUDGMENT : EXIT.OK;
}

export function renderClassify(out: AnyClassifyOutput, ctx: CommandContext): View {
  const c = ctx.output.color;
  const dist = (p: Record<string, number>) =>
    Object.entries(p)
      .sort(([, a], [, b]) => b - a)
      .map(([k, v]) => `${k} ${formatProbability(v)}`)
      .join(", ");
  const usage = { usage: out.usage, model: out.model, provider: out.provider };
  if (out.mode === "single") {
    const action = out.action === "review" ? paint(c, "yellow", "review") : paint(c, "dim", "auto");
    return {
      head: [
        `${paint(c, ["bold", "green"], out.label ?? "?")}  conf ${formatProbability(out.confidence)}  ${action}`,
        paint(c, "dim", `[${dist(out.probabilities)}]`),
      ],
      kv: [
        ["label", out.label ?? ""],
        ["confidence", formatProbability(out.confidence)],
        ["action", out.action],
        ["probabilities", dist(out.probabilities)],
      ],
      usage,
    };
  }
  if (out.mode === "multi") {
    const rows = out.labels.map((l) => [
      l.applies ? paint(c, "green", "yes") : paint(c, "dim", "no"),
      formatProbability(l.probability),
      l.label,
    ]);
    return {
      table: { columns: ["Applies", "Prob", "Label"], rows },
      tail: [paint(c, "dim", `threshold ≥ ${out.threshold}`)],
      usage,
    };
  }
  const path = out.path.length ? out.path.join(paint(c, "dim", " > ")) : paint(c, "dim", "(none)");
  const action = out.action === "review" ? paint(c, "yellow", "review") : paint(c, "dim", "auto");
  return {
    head: [
      `${paint(c, ["bold", "green"], path)}${out.stopped_at_other ? paint(c, "yellow", "  → other") : ""}  conf ${formatProbability(out.confidence)}  ${action}`,
      ...out.steps.map((s) =>
        paint(c, "dim", `  ${s.label} ${formatProbability(s.confidence)}  [${dist(s.probabilities)}]`),
      ),
    ],
    kv: [
      ["path", out.path.join(" > ")],
      ["confidence", formatProbability(out.confidence)],
      ["action", out.action],
    ],
    usage,
  };
}

/** Batch: each row is classified with the shared label set. */
export function prepareClassifyBatch(flags: ClassifyFlags, ctx: CommandContext): BatchItemRunner {
  const r = resolveClassifyFlags(flags, ctx);
  return async (row) => {
    const text =
      row.state !== undefined && flags.stateJson
        ? row.state
        : flags.stateJson
          ? parseJson(row.text, `row ${row.id}`)
          : row.text;
    const output = await classifyOne(text, r, flags, ctx);
    return { output, failed: classifyFailed(output, r.failOn) };
  };
}

export function registerClassify(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("classify")
    .description(
      "Assign a label from a set (one, several, or down a hierarchy) with probabilities and confidence.",
    )
    .argument("[text]", "text to classify, @file, or - for stdin (default: stdin)")
    .option("-l, --labels <list>", "labels: a,b,c or a:description,b:description (escape commas as \\,)")
    .option(
      "--labels-json <ref>",
      "labels as JSON: array of strings, array of {label,description}, or {label: description}",
    )
    .option(
      "-t, --taxonomy <ref>",
      'hierarchy as JSON, e.g. {"hardware": {"laptop": null, "phone": null}, "software": ["os","app"]}',
    )
    .option("--multi", "one yes/no probability per label instead of picking one")
    .option("--other", "add an 'other' escape option (single and taxonomy modes)")
    .option("-i, --instructions <text>", "the question to ask instead of the default")
    .option("--min-confidence <p>", "confidence below which the result is flagged 'review' (default 0.6)")
    .option("--threshold <p>", "--multi: probability at or above which a label applies (default 0.5)")
    .option("--state-json", "parse the text as JSON")
    .option(
      "--fail-on <list>",
      `exit 2 when: ${CLASSIFY_FAIL_CONDITIONS.join(", ")} (--multi: nothing applied), or none (default none)`,
    )
    .addHelpText(
      "after",
      `
Examples:
  jev classify @ticket.txt --labels billing,technical,sales --other
  jev classify "Login fails after update" -l "bug:defect in existing feature,feature:new capability,question" --fail-on review
  jev classify @post.md --multi --labels security,performance,docs --threshold 0.6
  jev classify @item.txt --taxonomy @catalog.json --other`,
    )
    .action(async (text: string | undefined, flags: ClassifyFlags, cmd: Command) => {
      await run((ctx) => classifyAction(text, flags, ctx), cmd);
    });
}
