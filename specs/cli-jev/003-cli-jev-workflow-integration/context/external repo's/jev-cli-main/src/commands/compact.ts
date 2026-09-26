import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import { COMPACT_FAIL_CONDITIONS, type CompactOutput, compactFailed, runCompact } from "../core/compact.js";
import { parseTranscript } from "../core/transcript.js";
import { CliError, EXIT } from "../errors.js";
import { readInput, readStdin } from "../input.js";
import { parseFailOn, parseProbability } from "../lib.js";
import { clip, emit, formatProbability, paint, type View } from "../output.js";
import { collectToolCalls, fitState, resolveOptions } from "../vendor/compaction/index.js";

export interface CompactFlags {
  goal?: string;
  keepThreshold?: string;
  preserveRecent?: string;
  maxStateTokens?: string;
  maxRequestTokens?: string;
  truncateHead?: string;
  minReduction?: string;
  concurrency?: string;
  out?: string;
  failOn?: string;
}

function int(name: string, raw: string | undefined, fallback: number, min = 0, max = Infinity): number {
  if (raw === undefined) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) {
    const range = max === Infinity ? `≥ ${min}` : `from ${min} to ${max}`;
    throw new CliError(`${name} must be an integer ${range}.`);
  }
  return n;
}

export function resolveCompactOptions(flags: CompactFlags, ctx: CommandContext) {
  const c = ctx.config.compact;
  return {
    goal: flags.goal,
    keepThreshold: parseProbability("--keep-threshold", flags.keepThreshold, c.keepThreshold),
    preserveRecentMessages: int("--preserve-recent", flags.preserveRecent, c.preserveRecent),
    maxStateTokens: int("--max-state-tokens", flags.maxStateTokens, c.maxStateTokens, 1),
    maxRequestTokens: int("--max-request-tokens", flags.maxRequestTokens, c.maxRequestTokens, 1),
    truncateHeadChars: int("--truncate-head", flags.truncateHead, c.truncateHead),
    minReduction: parseProbability("--min-reduction", flags.minReduction, c.minReduction),
    concurrency: int("--concurrency", flags.concurrency, c.concurrency, 1, 64),
    failOn: parseFailOn(flags.failOn, COMPACT_FAIL_CONDITIONS, []),
  };
}

export function loadTranscript(positional: string | undefined) {
  let raw: string;
  if (positional !== undefined) raw = readInput(positional, "transcript");
  else if (!process.stdin.isTTY) raw = readStdin("transcript");
  else throw new CliError("Provide a transcript: @session.jsonl, @messages.json, or - for stdin.");
  try {
    return parseTranscript(raw);
  } catch (err) {
    throw new CliError((err as Error).message);
  }
}

export async function compactAction(
  positional: string | undefined,
  flags: CompactFlags,
  ctx: CommandContext,
): Promise<number> {
  const { failOn, minReduction, concurrency, ...options } = resolveCompactOptions(flags, ctx);
  const transcript = loadTranscript(positional);

  if (ctx.dryRun) {
    const resolved = resolveOptions(options);
    const calls = collectToolCalls(transcript.messages, resolved.preserveRecentMessages);
    const candidates = calls.filter((c) => !c.pinned);
    const fitted = candidates.length ? fitState(transcript.messages, calls, resolved) : null;
    emit(
      { ...ctx.output, format: "json" },
      {
        model: ctx.config.model,
        format: transcript.format,
        messages: transcript.messages.length,
        skipped_records: transcript.skipped,
        tool_calls: calls.length,
        candidates: candidates.length,
        pinned: calls.length - candidates.length,
        state_tokens: fitted?.tokens ?? 0,
        state_stage: fitted?.stage ?? "",
        state: fitted?.state ?? null,
      },
      () => ({}),
    );
    return EXIT.OK;
  }

  const output = await runCompact(ctx.ask(), {
    messages: transcript.messages,
    minReduction,
    concurrency,
    ...options,
  });
  if (flags.out) {
    const path = flags.out.startsWith("@") ? flags.out.slice(1) : flags.out;
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(output.messages, null, 2)}\n`, "utf8");
  }
  emit(
    ctx.output,
    flags.out ? { ...output, messages: undefined, messages_written_to: flags.out } : output,
    () => renderCompact(output, ctx, transcript.format, flags.out),
  );
  return compactFailed(output, failOn) ? EXIT.JUDGMENT : EXIT.OK;
}

export function renderCompact(out: CompactOutput, ctx: CommandContext, format: string, wrote?: string): View {
  const c = ctx.output.color;
  const s = out.stats;
  const pct = `${Math.round(out.reduction * 100)}%`;
  const headline = out.worth_it
    ? paint(c, ["bold", "green"], `${pct} smaller`)
    : paint(c, ["bold", "yellow"], `${pct} smaller (below ${Math.round(out.min_reduction * 100)}% minimum)`);
  const head = [
    `${headline}  ${s.messagesBefore} → ${s.messagesAfter} messages · ${s.charsBefore.toLocaleString()} → ${s.charsAfter.toLocaleString()} chars`,
    paint(
      c,
      "dim",
      `${s.calls} tool calls: ${s.kept} kept · ${s.resultsDropped} results truncated · ${s.callsDropped} calls dropped · ${s.pinned} pinned · state ~${s.stateTokens} tokens (${s.stateStage || "no request"}) in ${s.requests} request(s), ${s.ms} ms`,
    ),
  ];
  const decided = out.decisions.filter((d) => d.reason !== "pinned");
  const style = (a: string) =>
    a === "keep"
      ? paint(c, "green", a)
      : a === "drop_result"
        ? paint(c, "yellow", "truncate")
        : paint(c, "red", "drop");
  const rows = decided.map((d) => [
    d.id,
    clip(d.tool, 14),
    style(d.action),
    formatProbability(d.keepCall),
    formatProbability(d.keepResult),
  ]);
  return {
    head,
    table: decided.length ? { columns: ["Call", "Tool", "Action", "P(call)", "P(result)"], rows } : undefined,
    tail: [
      paint(
        c,
        "dim",
        wrote
          ? `compacted messages written to ${wrote.replace(/^@/, "")} (${format} in, messages JSON out)`
          : `add --out <file> to write the compacted messages (${format} in, messages JSON out)`,
      ),
    ],
    usage: { usage: out.usage, model: out.model, provider: out.provider },
  };
}

export function registerCompact(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("compact")
    .description(
      "Shrink an agent transcript without summarizing: Jev decides which old tool calls and results still matter; everything kept stays verbatim.",
    )
    .argument("[transcript]", "@session.jsonl (Claude Code), @messages.json, or - for stdin (default: stdin)")
    .option(
      "-g, --goal <text>",
      "the ongoing task, so Jev knows what still matters (default: the last three user prompts)",
    )
    .option(
      "--keep-threshold <p>",
      "keep a call or result when Jev's probability is at least this (default 0.5)",
    )
    .option(
      "--preserve-recent <n>",
      "newest messages never touched; the first message is always kept (default 6)",
    )
    .option("--max-state-tokens <n>", "estimated token budget for the history sent to Jev (default 25000)")
    .option(
      "--max-request-tokens <n>",
      "estimated budget for history plus one batch of questions (default 30000)",
    )
    .option("--truncate-head <n>", "characters of a dropped result to keep before the note (default 300)")
    .option(
      "--min-reduction <p>",
      "below this reduction ratio the result is flagged not worth applying (default 0.25)",
    )
    .option("--concurrency <n>", "question batches in flight at once, 1 to 64 (default 4)")
    .option("-o, --out <path>", "write the compacted transcript (messages JSON) here")
    .option("--fail-on <list>", "exit 2 when: low-reduction, or none (default none)")
    .addHelpText(
      "after",
      `
Input formats:
  Claude Code session log   ~/.claude/projects/<project>/<session>.jsonl (one record per line)
  Messages JSON             [{"role","text","toolUses":[{"tool_use_id","tool","input"}],"toolResults":[{"tool_use_id","text"}]}]

Text messages are never removed or shortened. Only tool calls and their results outside the pinned
first and newest messages are candidates. A dropped result keeps its first --truncate-head chars plus a
note; a dropped call disappears with its result. The assistant can always re-run a tool.

Examples:
  jev compact @~/.claude/projects/-me-repo/abc123.jsonl
  jev compact @session.jsonl --goal "fix the flaky auth test" --out compacted.json --json
  jev compact @messages.json --keep-threshold 0.6 --fail-on low-reduction

In-session use: install the jev Claude Code plugin; its hook replaces Claude Code's compaction summary
with this exact procedure. See plugin/hooks/README.md.`,
    )
    .action(async (transcript: string | undefined, flags: CompactFlags, cmd: Command) => {
      await run((ctx) => compactAction(transcript, flags, ctx), cmd);
    });
}
