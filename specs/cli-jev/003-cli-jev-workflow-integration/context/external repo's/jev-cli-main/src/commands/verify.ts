import type { Command } from "commander";
import type { CommandContext } from "../context.js";
import type { BatchItemRunner } from "../core/batch.js";
import {
  buildVerifyRequest,
  runVerify,
  VERIFY_FAIL_CONDITIONS,
  type VerifyOutput,
  verifyFailed,
} from "../core/verify.js";
import { CliError, EXIT } from "../errors.js";
import { parseItems, parseList, readInput, referenceId } from "../input.js";
import { parseFailOn, parseProbability } from "../lib.js";
import { clip, emit, formatProbability, paint, type View } from "../output.js";

export interface VerifyFlags {
  evidence?: string[];
  evidenceJson?: string;
  claims?: string;
  autoAccept?: string;
  failOn?: string;
}

export function collectEvidence(flags: VerifyFlags) {
  const items: Array<{ id?: string; text: string }> = [];
  for (const ref of flags.evidence ?? []) {
    const id = referenceId(ref);
    items.push(id ? { id, text: readInput(ref, "evidence") } : { text: readInput(ref, "evidence") });
  }
  if (flags.evidenceJson)
    items.push(...parseItems(readInput(flags.evidenceJson, "evidence JSON"), "evidence"));
  if (items.length === 0)
    throw new CliError("Provide evidence with --evidence <text|@file|-> or --evidence-json <ref>.");
  return items;
}

export function collectClaims(positional: string[], flags: VerifyFlags): string[] {
  const claims = [...positional];
  if (flags.claims) claims.push(...parseList(readInput(flags.claims, "claims"), "claims"));
  if (claims.length === 0)
    throw new CliError("Provide at least one claim as an argument or with --claims <@file|->.");
  if (claims.some((c) => c.trim().length === 0)) throw new CliError("A claim must not be empty.");
  return claims;
}

export async function verifyAction(
  positional: string[],
  flags: VerifyFlags,
  ctx: CommandContext,
): Promise<number> {
  const claims = collectClaims(positional, flags);
  const evidence = collectEvidence(flags);
  const autoAccept = parseProbability("--auto-accept", flags.autoAccept, ctx.config.verify.autoAccept);
  const failOn = parseFailOn(flags.failOn, VERIFY_FAIL_CONDITIONS, ["contradicted"]);

  if (ctx.dryRun) {
    const { state, questions } = buildVerifyRequest({ claims, evidence });
    emit({ ...ctx.output, format: "json" }, { model: ctx.config.model, state, questions }, () => ({}));
    return EXIT.OK;
  }

  const output = await runVerify(ctx.ask(), { claims, evidence, autoAccept });
  emit(ctx.output, output, () => renderVerify(output, ctx));
  return verifyFailed(output, failOn) ? EXIT.JUDGMENT : EXIT.OK;
}

export function renderVerify(out: VerifyOutput, ctx: CommandContext): View {
  const c = ctx.output.color;
  const verdictStyle = (v: string) =>
    v === "verified"
      ? paint(c, "green", v)
      : v === "contradicted"
        ? paint(c, "red", v)
        : v === "unsupported"
          ? paint(c, "yellow", v)
          : paint(c, "dim", v);
  const multiSource = out.results.some((r) => r.supporting_evidence !== null);
  const columns = ["#", "Verdict", "Conf", "Action", "Claim"];
  if (multiSource) columns.push("Source");
  const rows = out.results.map((r, i) => {
    const row = [
      String(i + 1),
      verdictStyle(r.verdict),
      formatProbability(r.confidence),
      r.action === "review" ? paint(c, "yellow", "review") : "auto",
      clip(r.claim, 70),
    ];
    if (multiSource) row.push(r.supporting_evidence ?? "-");
    return row;
  });
  const s = out.summary;
  return {
    table: { columns, rows },
    tail: [
      `${s.verified} verified · ${s.contradicted} contradicted · ${s.unsupported} unsupported · ${s.needs_review} need review (auto-accept ≥ ${out.auto_accept})`,
    ],
    usage: { usage: out.usage, model: out.model, provider: out.provider },
  };
}

export function registerVerify(
  program: Command,
  run: (fn: (ctx: CommandContext) => Promise<number>, cmd: Command) => Promise<void>,
) {
  program
    .command("verify")
    .description(
      "Check claims against evidence. Each claim gets a verdict, probability distribution, and confidence.",
    )
    .argument("[claims...]", "claims to verify (or use --claims)")
    .option("-e, --evidence <ref>", "evidence text, @file, or - for stdin (repeatable)", collect, [])
    .option("--evidence-json <ref>", "JSON evidence: array of strings, array of {id,text}, or {id: text} map")
    .option("-c, --claims <ref>", "claims from @file or - (one per line, or a JSON array)")
    .option("--auto-accept <p>", "confidence at or above which a verdict stands (default 0.8)")
    .option(
      "--fail-on <list>",
      `exit 2 when any result matches: ${VERIFY_FAIL_CONDITIONS.join(", ")}, none (default contradicted)`,
    )
    .addHelpText(
      "after",
      `
Examples:
  jev verify "Helmets are optional for adults" --evidence @ordinance.txt
  jev verify --claims @claims.txt --evidence @spec.md --evidence @rfc.txt --fail-on contradicted,unsupported
  git diff | jev verify "This PR only touches tests" --evidence - --json`,
    )
    .action(async (claims: string[], flags: VerifyFlags, cmd: Command) => {
      await run((ctx) => verifyAction(claims, flags, ctx), cmd);
    });
}

function collect(value: string, previous: string[]): string[] {
  return [...previous, value];
}

/** Batch: each row is one claim checked against the shared evidence. */
export function prepareVerifyBatch(flags: VerifyFlags, ctx: CommandContext): BatchItemRunner {
  const evidence = collectEvidence(flags);
  const autoAccept = parseProbability("--auto-accept", flags.autoAccept, ctx.config.verify.autoAccept);
  const failOn = parseFailOn(flags.failOn, VERIFY_FAIL_CONDITIONS, ["contradicted"]);
  return async (row) => {
    const output = await runVerify(ctx.ask(), { claims: [row.text], evidence, autoAccept });
    return { output, failed: verifyFailed(output, failOn) };
  };
}
