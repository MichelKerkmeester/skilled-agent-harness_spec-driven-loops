import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import {
  type AskOutput,
  parseQuestions,
  questionsFromFlags,
  type RawQuestions,
  runAsk,
} from "../core/ask.js";
import type { BatchItemRunner } from "../core/batch.js";
import { CliError, EXIT } from "../errors.js";
import { parseJson, readInput, readStdin } from "../input.js";
import { emit, formatProbability, paint, type View } from "../output.js";

export interface AskFlags {
  questions?: string;
  noul?: string[];
  choice?: string[];
  score?: string[];
  stateJson?: boolean;
}

export function resolveState(positional: string | undefined, flags: AskFlags): unknown {
  let raw: string;
  if (positional !== undefined) raw = readInput(positional, "state");
  else if (!process.stdin.isTTY) raw = readStdin("state");
  else throw new CliError("Provide state as an argument, @file, or pipe it on stdin.");
  return flags.stateJson ? parseJson(raw, "state") : raw;
}

export function resolveQuestions(flags: AskFlags): RawQuestions {
  const fromFlags = (flags.noul?.length ?? 0) + (flags.choice?.length ?? 0) + (flags.score?.length ?? 0) > 0;
  if (flags.questions && fromFlags) {
    throw new CliError("Use either --questions or the --noul/--choice/--score shorthands, not both.");
  }
  try {
    if (flags.questions)
      return parseQuestions(parseJson(readInput(flags.questions, "questions"), "questions"));
    if (fromFlags) return questionsFromFlags(flags);
  } catch (err) {
    if (err instanceof CliError) throw err;
    throw new CliError((err as Error).message);
  }
  throw new CliError(
    "Provide questions with --questions <ref> or one or more --noul/--choice/--score flags.",
  );
}

export async function askAction(
  positional: string | undefined,
  flags: AskFlags,
  ctx: CommandContext,
): Promise<number> {
  const state = resolveState(positional, flags);
  const questions = resolveQuestions(flags);

  if (ctx.dryRun) {
    emit({ ...ctx.output, format: "json" }, { model: ctx.config.model, state, questions }, () => ({}));
    return EXIT.OK;
  }

  const output = await runAsk(ctx.ask(), { state, questions });
  emit(ctx.output, output, () => renderAsk(output, ctx));
  return EXIT.OK;
}

export function renderAsk(out: AskOutput, ctx: CommandContext): View {
  const c = ctx.output.color;
  const head: string[] = [];
  const kv: Array<[string, string]> = [];
  for (const [id, answer] of Object.entries(out.answers)) {
    // biome-ignore lint/suspicious/noExplicitAny: answer payloads are the SDK's loosely typed union
    const a = answer as Record<string, any>;
    if (a?.type === "noul") {
      head.push(`${paint(c, "bold", id)}: ${formatProbability(a.noul)}`);
      kv.push([id, formatProbability(a.noul)]);
    } else if (a?.type === "choice") {
      const dist = Object.entries(a.probabilities ?? {})
        .sort(([, x], [, y]) => (y as number) - (x as number))
        .map(([k, v]) => `${k} ${formatProbability(v as number)}`)
        .join(", ");
      head.push(
        `${paint(c, "bold", id)}: ${paint(c, "green", String(a.choice))}  conf ${formatProbability(a.confidence)}  [${dist}]`,
      );
      kv.push([id, `${a.choice} (conf ${formatProbability(a.confidence)})`]);
    } else if (a?.type === "score") {
      const levels = Object.entries(a.probabilities ?? {})
        .map(([k, v]) => `${k} ${formatProbability(v as number)}`)
        .join(", ");
      head.push(
        `${paint(c, "bold", id)}: ${paint(c, "green", Number(a.score).toFixed(2))}  conf ${formatProbability(a.confidence)}  [${levels}]`,
      );
      kv.push([id, `${Number(a.score).toFixed(2)} (conf ${formatProbability(a.confidence)})`]);
    } else {
      head.push(`${paint(c, "bold", id)}: ${JSON.stringify(answer)}`);
      kv.push([id, JSON.stringify(answer)]);
    }
  }
  return { head, kv, usage: { usage: out.usage, model: out.model, provider: out.provider } };
}

export function registerAsk(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("ask")
    .description(
      "Ask raw System One questions (noul, choice, score) about any state. Answers come back typed.",
    )
    .argument("[state]", "state text, @file, or - for stdin (default: stdin)")
    .option("--state-json", "parse the state as JSON instead of treating it as text")
    .option("-Q, --questions <ref>", "JSON questions map (@file or -), same shape as the TypeSafe API")
    .option("--noul <id=instructions>", "yes/no question (repeatable)", collect, [])
    .option(
      "--choice <id=instructions|a,b:desc,c>",
      "pick-one question with options (repeatable)",
      collect,
      [],
    )
    .option("--score <id=instructions|low,mid,high>", "ordered rubric question (repeatable)", collect, [])
    .addHelpText(
      "after",
      `
Examples:
  jev ask "I was charged twice, fix it now" --noul urgent="Does this convey urgency?"
  jev ask @ticket.txt --choice team="Which team handles this?|billing:refunds and invoices,technical:bugs,sales"
  jev ask @review.txt --score tone="How harsh is the tone?|gentle,direct,harsh"
  jev ask @record.json --state-json --questions @questions.json --json`,
    )
    .action(async (state: string | undefined, flags: AskFlags, cmd: Command) => {
      await run((ctx) => askAction(state, flags, ctx), cmd);
    });
}

function collect(value: string, previous: string[]): string[] {
  return [...previous, value];
}

/** Batch: each row is the state; questions are shared. Rows with a "state" field send it as-is. */
export function prepareAskBatch(flags: AskFlags, ctx: CommandContext): BatchItemRunner {
  const questions = resolveQuestions(flags);
  return async (row) => {
    const state =
      row.state !== undefined && typeof row.state !== "string"
        ? row.state
        : flags.stateJson
          ? parseJson(row.text, `row ${row.id} state`)
          : row.text;
    const output = await runAsk(ctx.ask(), { state, questions });
    return { output, failed: false };
  };
}
