import { statSync } from "node:fs";
import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import type { BatchItemRunner } from "../core/batch.js";
import {
  buildFindRequest,
  type CandidateInput,
  FIND_FAIL_CONDITIONS,
  type FindOutput,
  findFailed,
  runFind,
} from "../core/find.js";
import { CliError, EXIT } from "../errors.js";
import { parseItems, readFile, readInput } from "../input.js";
import { MAX_CANDIDATES, parseFailOn, parseProbability } from "../lib.js";
import { clip, emit, formatProbability, paint, type View } from "../output.js";

export interface FindFlags {
  candidates?: string;
  files?: string[];
  lines?: string;
  topK?: string;
  found?: string;
  absent?: string;
  failOn?: string;
}

export function collectCandidates(flags: FindFlags): CandidateInput[] {
  const items: CandidateInput[] = [];
  if (flags.candidates) items.push(...parseItems(readInput(flags.candidates, "candidates"), "candidates"));
  for (const path of flags.files ?? []) {
    let isDir = false;
    try {
      isDir = statSync(path).isDirectory();
    } catch (err) {
      throw new CliError(`Cannot read file ${path}: ${(err as Error).message}`);
    }
    if (isDir) throw new CliError(`${path} is a directory. Pass files, e.g. --files docs/*.md`);
    items.push({ id: path, text: readFile(path, "candidate file") });
  }
  if (flags.lines) {
    // Ids are source line numbers (1-based, blank lines counted) so a hit can be found in the file.
    readInput(flags.lines, "lines")
      .split(/\r?\n/)
      .forEach((raw, i) => {
        const line = raw.trim();
        if (line.length > 0) items.push({ id: `L${i + 1}`, text: line });
      });
  }
  if (items.length === 0) {
    throw new CliError("Provide candidates with --candidates <ref>, --files <paths...>, or --lines <ref>.");
  }
  if (items.length > MAX_CANDIDATES) {
    throw new CliError(`Too many candidates (${items.length}); the limit is ${MAX_CANDIDATES} per call.`);
  }
  return items;
}

export async function findAction(query: string, flags: FindFlags, ctx: CommandContext): Promise<number> {
  const candidates = collectCandidates(flags);
  const topK = flags.topK === undefined ? ctx.config.find.topK : Number(flags.topK);
  if (!Number.isInteger(topK) || topK < 1 || topK > 50)
    throw new CliError("--top-k must be an integer from 1 to 50.");
  const found = parseProbability("--found", flags.found, ctx.config.find.found);
  const absent = parseProbability("--absent", flags.absent, ctx.config.find.absent);
  const failOn = parseFailOn(flags.failOn, FIND_FAIL_CONDITIONS, []);

  if (ctx.dryRun) {
    const { state, questions } = buildFindRequest({ query, candidates });
    emit({ ...ctx.output, format: "json" }, { model: ctx.config.model, state, questions }, () => ({}));
    return EXIT.OK;
  }

  const output = await runFind(ctx.ask(), { query, candidates, topK, found, absent });
  emit(ctx.output, output, () => renderFind(output, ctx));
  return findFailed(output, failOn) ? EXIT.JUDGMENT : EXIT.OK;
}

export function renderFind(out: FindOutput, ctx: CommandContext): View {
  const c = ctx.output.color;
  const verdict =
    out.exists_verdict === "answered"
      ? paint(c, "green", out.exists_verdict)
      : out.exists_verdict === "absent"
        ? paint(c, "red", out.exists_verdict)
        : paint(c, "yellow", out.exists_verdict);
  const rows = out.top.map((hit, i) => [
    String(i + 1),
    formatProbability(hit.probability),
    hit.id,
    clip(hit.text, 60),
  ]);
  return {
    head: [`${verdict}  (exists ${formatProbability(out.exists)})  ${paint(c, "dim", out.query)}`],
    table: { columns: ["#", "Prob", "Id", "Text"], rows },
    usage: { usage: out.usage, model: out.model, provider: out.provider },
  };
}

export function registerFind(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("find")
    .description(
      `Rank candidates against a plain-language query. No embeddings; up to ${MAX_CANDIDATES} candidates per call.`,
    )
    .argument("<query>", "what you are looking for")
    .option(
      "-c, --candidates <ref>",
      "JSON candidates (@file or -): array of strings, array of {id,text}, or {id: text}",
    )
    .option("-f, --files <paths...>", "treat each file as a candidate (id = path)")
    .option(
      "-l, --lines <ref>",
      "treat each non-empty line of @file or - as a candidate (id = L<line number>)",
    )
    .option("-k, --top-k <n>", "how many ranked results to return (default 5)")
    .option("--found <p>", "exists probability at or above which the verdict is 'answered' (default 0.7)")
    .option("--absent <p>", "exists probability below which the verdict is 'absent' (default 0.35)")
    .option(
      "--fail-on <list>",
      `exit 2 when the exists verdict is one of: ${FIND_FAIL_CONDITIONS.join(", ")}, none (default none)`,
    )
    .addHelpText(
      "after",
      `
Examples:
  jev find "how do I rotate API keys" --files docs/*.md
  jev find "refund policy" --lines @terms.txt -k 3
  jev find "caching and infra cost" --candidates @notes.json --fail-on absent`,
    )
    .action(async (query: string, flags: FindFlags, cmd: Command) => {
      await run((ctx) => findAction(query, flags, ctx), cmd);
    });
}

/** Batch: each row is a query ranked against the shared candidates. */
export function prepareFindBatch(flags: FindFlags, ctx: CommandContext): BatchItemRunner {
  const candidates = collectCandidates(flags);
  const topK = flags.topK === undefined ? ctx.config.find.topK : Number(flags.topK);
  if (!Number.isInteger(topK) || topK < 1 || topK > 50)
    throw new CliError("--top-k must be an integer from 1 to 50.");
  const found = parseProbability("--found", flags.found, ctx.config.find.found);
  const absent = parseProbability("--absent", flags.absent, ctx.config.find.absent);
  const failOn = parseFailOn(flags.failOn, FIND_FAIL_CONDITIONS, []);
  return async (row) => {
    const output = await runFind(ctx.ask(), { query: row.text, candidates, topK, found, absent });
    return { output, failed: findFailed(output, failOn) };
  };
}
