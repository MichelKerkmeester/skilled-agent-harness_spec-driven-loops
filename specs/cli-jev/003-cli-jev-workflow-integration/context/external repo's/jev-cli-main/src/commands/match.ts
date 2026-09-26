import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import {
  allPairs,
  buildMatchRequest,
  crossPairs,
  MATCH_FAIL_CONDITIONS,
  MAX_PAIRS,
  type MatchItem,
  type MatchOutput,
  type MatchPair,
  matchFailed,
  runMatch,
} from "../core/match.js";
import { CliError, EXIT } from "../errors.js";
import { parseItems, parseJson, readInput } from "../input.js";
import { parseFailOn } from "../lib.js";
import { clip, emit, formatProbability, paint, type View } from "../output.js";

export interface MatchFlags {
  pairs?: string;
  left?: string;
  right?: string;
  dedupe?: string;
  kind?: string;
  failOn?: string;
}

function toItem(v: unknown, label: string): MatchItem {
  if (typeof v === "string") return { text: v };
  if (v && typeof v === "object" && typeof (v as MatchItem).text === "string") {
    const { id, text } = v as MatchItem;
    return id === undefined ? { text } : { id: String(id), text };
  }
  throw new CliError(`${label} must be a string or an object with a "text" field.`);
}

/** Pairs JSON: array of [a, b] or {left, right}. */
export function parsePairs(raw: string): MatchPair[] {
  const parsed = parseJson<unknown>(raw, "pairs");
  if (!Array.isArray(parsed)) throw new CliError("pairs must be a JSON array.");
  return parsed.map((entry, i) => {
    if (Array.isArray(entry) && entry.length === 2)
      return { left: toItem(entry[0], `pairs[${i}][0]`), right: toItem(entry[1], `pairs[${i}][1]`) };
    if (entry && typeof entry === "object" && "left" in entry && "right" in entry) {
      const e = entry as { left: unknown; right: unknown };
      return { left: toItem(e.left, `pairs[${i}].left`), right: toItem(e.right, `pairs[${i}].right`) };
    }
    throw new CliError(`pairs[${i}] must be [left, right] or {"left", "right"}.`);
  });
}

/** Give unnamed items positional ids so results can be read back. */
function withIds(items: MatchItem[], prefix: string): MatchItem[] {
  return items.map((it, i) => (it.id === undefined ? { ...it, id: `${prefix}${i + 1}` } : it));
}

export function collectPairs(flags: MatchFlags): MatchPair[] {
  const modes = [flags.pairs, flags.left || flags.right, flags.dedupe].filter(Boolean).length;
  if (modes !== 1)
    throw new CliError(
      "Provide exactly one of --pairs <ref>, --left <ref> --right <ref>, or --dedupe <ref>.",
    );
  let pairs: MatchPair[];
  if (flags.pairs) pairs = parsePairs(readInput(flags.pairs, "pairs"));
  else if (flags.dedupe) {
    const items = withIds(parseItems(readInput(flags.dedupe, "items"), "items"), "item");
    if (items.length < 2) throw new CliError("--dedupe needs at least two items.");
    pairs = allPairs(items);
  } else {
    if (!flags.left || !flags.right) throw new CliError("--left and --right must be given together.");
    const left = withIds(parseItems(readInput(flags.left, "left"), "left"), "L");
    const right = withIds(parseItems(readInput(flags.right, "right"), "right"), "R");
    pairs = crossPairs(left, right);
  }
  if (pairs.length === 0) throw new CliError("No pairs to compare.");
  if (pairs.length > MAX_PAIRS) {
    throw new CliError(
      `${pairs.length} pairs exceeds the limit of ${MAX_PAIRS}. Block candidates first (e.g. by name prefix or postcode) and match within blocks.`,
    );
  }
  return pairs;
}

export async function matchAction(flags: MatchFlags, ctx: CommandContext): Promise<number> {
  const pairs = collectPairs(flags);
  const failOn = parseFailOn(flags.failOn, MATCH_FAIL_CONDITIONS, []);
  if (ctx.dryRun) {
    const { state, questions } = buildMatchRequest(pairs.slice(0, 50), flags.kind);
    emit(
      { ...ctx.output, format: "json" },
      {
        model: ctx.config.model,
        pairs: pairs.length,
        note: pairs.length > 50 ? "showing the first request of several" : undefined,
        state,
        questions,
      },
      () => ({}),
    );
    return EXIT.OK;
  }
  const output = await runMatch(ctx.ask(), { pairs, kind: flags.kind });
  emit(ctx.output, output, () => renderMatch(output, ctx));
  return matchFailed(output, failOn) ? EXIT.JUDGMENT : EXIT.OK;
}

export function renderMatch(out: MatchOutput, ctx: CommandContext): View {
  const c = ctx.output.color;
  const style = (d: string) =>
    d === "same" ? paint(c, "green", d) : d === "different" ? paint(c, "dim", d) : paint(c, "yellow", d);
  const rows = out.results.map((r) => [
    style(r.decision),
    formatProbability(r.confidence),
    clip(r.left === r.left_text ? r.left : `${r.left}: ${r.left_text}`, 40),
    clip(r.right === r.right_text ? r.right : `${r.right}: ${r.right_text}`, 40),
  ]);
  const s = out.summary;
  return {
    table: { columns: ["Decision", "Conf", "Left", "Right"], rows },
    tail: [`${s.same} same · ${s.unclear} unclear · ${s.different} different`],
    usage: { usage: out.usage, model: out.model, provider: out.provider },
  };
}

export function registerMatch(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("match")
    .description(
      "Decide whether pairs of records describe the same thing: same, different, or unclear (send to a person).",
    )
    .option("-p, --pairs <ref>", 'JSON pairs: [["a","b"], ...] or [{"left": {...}, "right": {...}}, ...]')
    .option("--left <ref>", "JSON items; every left item is compared with every right item")
    .option("--right <ref>", "JSON items for --left")
    .option("-d, --dedupe <ref>", "JSON items; every pair within the list is compared")
    .option(
      "-k, --kind <text>",
      'what the records are, e.g. "products in a catalogue" or "customer contacts"',
    )
    .option(
      "--fail-on <list>",
      `exit 2 when any pair is: ${MATCH_FAIL_CONDITIONS.join(", ")}, or none (default none)`,
    )
    .addHelpText(
      "after",
      `
Items are strings or {id, text}. Up to ${MAX_PAIRS} pairs per call, sent in groups of 50.
The decision is the most likely of three levels; there is no threshold to tune. "unclear" is a
real outcome meaning a person should look, not a low-confidence "same".

Examples:
  jev match --dedupe @contacts.json --kind "customer contacts" --fail-on same
  jev match --left @our-catalog.json --right @supplier-feed.json --kind "beer products" --json
  jev match --pairs @candidate-pairs.json`,
    )
    .action(async (flags: MatchFlags, cmd: Command) => {
      await run((ctx) => matchAction(flags, ctx), cmd);
    });
}
