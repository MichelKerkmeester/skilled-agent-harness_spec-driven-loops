import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import type { BatchItemRunner } from "../core/batch.js";
import {
  buildRerankRequest,
  RERANK_FAIL_CONDITIONS,
  type RerankOutput,
  rerankFailed,
  runRerank,
} from "../core/rerank.js";
import { CliError, EXIT } from "../errors.js";
import { parseFailOn, parseProbability } from "../lib.js";
import { clip, emit, formatProbability, paint, type View } from "../output.js";
import { collectCandidates, type FindFlags } from "./find.js";

export interface RerankFlags extends Pick<FindFlags, "candidates" | "files" | "lines" | "topK" | "failOn"> {
  min?: string;
  criteria?: string;
}

function resolve(flags: RerankFlags, ctx: CommandContext) {
  const candidates = collectCandidates(flags);
  const topK = flags.topK === undefined ? ctx.config.rerank.topK : Number(flags.topK);
  if (!Number.isInteger(topK) || topK < 1 || topK > 250)
    throw new CliError("--top-k must be an integer from 1 to 250.");
  const min = parseProbability("--min", flags.min, ctx.config.rerank.min);
  const failOn = parseFailOn(flags.failOn, RERANK_FAIL_CONDITIONS, []);
  return { candidates, topK, min, failOn };
}

export async function rerankAction(query: string, flags: RerankFlags, ctx: CommandContext): Promise<number> {
  const { candidates, topK, min, failOn } = resolve(flags, ctx);
  if (ctx.dryRun) {
    const { state, questions } = buildRerankRequest({ query, candidates, criteria: flags.criteria });
    emit({ ...ctx.output, format: "json" }, { model: ctx.config.model, state, questions }, () => ({}));
    return EXIT.OK;
  }
  const output = await runRerank(ctx.ask(), { query, candidates, topK, min, criteria: flags.criteria });
  emit(ctx.output, output, () => renderRerank(output, ctx));
  return rerankFailed(output, failOn) ? EXIT.JUDGMENT : EXIT.OK;
}

export function renderRerank(out: RerankOutput, ctx: CommandContext): View {
  const c = ctx.output.color;
  const rows = out.ranked.map((h, i) => [
    String(i + 1),
    h.kept
      ? paint(c, "green", formatProbability(h.relevance))
      : paint(c, "dim", formatProbability(h.relevance)),
    h.kept ? "keep" : paint(c, "dim", "drop"),
    h.id,
    clip(h.text, 60),
  ]);
  return {
    head: [
      `${out.kept.length} of ${out.ranked.length} shown are relevant (min ${out.min})  ${paint(c, "dim", out.query)}`,
    ],
    table: { columns: ["#", "Rel", "Keep", "Id", "Text"], rows },
    usage: { usage: out.usage, model: out.model, provider: out.provider },
  };
}

/** Batch: each row is a query reranked against the shared candidates. */
export function prepareRerankBatch(flags: RerankFlags, ctx: CommandContext): BatchItemRunner {
  const { candidates, topK, min, failOn } = resolve(flags, ctx);
  return async (row) => {
    const output = await runRerank(ctx.ask(), {
      query: row.text,
      candidates,
      topK,
      min,
      criteria: flags.criteria,
    });
    return { output, failed: rerankFailed(output, failOn) };
  };
}

export function registerRerank(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("rerank")
    .description(
      "Score each candidate's relevance to a query independently and sort. Use on search results before showing or using them.",
    )
    .argument("<query>", "what the results should be relevant to")
    .option(
      "-c, --candidates <ref>",
      "JSON candidates (@file or -): array of strings, array of {id,text}, or {id: text}",
    )
    .option("-f, --files <paths...>", "treat each file as a candidate (id = path)")
    .option(
      "-l, --lines <ref>",
      "treat each non-empty line of @file or - as a candidate (id = L<line number>)",
    )
    .option("-k, --top-k <n>", "how many ranked results to return (default 10)")
    .option("--min <p>", "relevance at or above which a candidate is kept (default 0.5)")
    .option(
      "--criteria <text>",
      'what counts as relevant, e.g. "a passage stating the legal rule, not commentary"',
    )
    .option("--fail-on <list>", "exit 2 when: empty (nothing kept), or none (default none)")
    .addHelpText(
      "after",
      `
Unlike find, rerank scores every candidate on its own, so several can be relevant or none can.
Use find to pick the single best answer; use rerank to filter and order a result list.

Examples:
  jev rerank "how do I rotate API keys" --candidates @bm25-top30.json -k 10
  jev rerank "statute of limitations for contract claims" --lines @passages.txt --min 0.7 --fail-on empty`,
    )
    .action(async (query: string, flags: RerankFlags, cmd: Command) => {
      await run((ctx) => rerankAction(query, flags, ctx), cmd);
    });
}
