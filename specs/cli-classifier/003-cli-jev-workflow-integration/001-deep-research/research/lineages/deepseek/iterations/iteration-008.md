---
title: "Iteration 8: The measurement harness as code"
trigger_phrases: []
---
# Iteration 8: The measurement harness as code

**Angle:** deepseek-08 · **Lens:** integration engineer · **Wave 3** · **Jev package under study:** Python `jev-cli` 0.6.2

## Focus

What is the smallest runnable harness for the top two ideas: the latency and cost probe, a gold-set scorer, or a new grader kind on H9? Where does it live and what does it write? Hand-off target: the harness file list, its output format, and how it runs with no key (skip and say so).

## Sibling check (required from wave 2 onward)

Newest siblings: grok is complete at 10; mimo added `iteration-002.md`. Mimo-002 supplies the headroom arithmetic this angle needs: at most 6 rows movable on the ambiguity slice (18/24 today) and at most 17 on the holdout (53/70), the eligible-count is UNKNOWN until top-2 margins are recorded, the eval baseline uses tau 0.03 while the live cluster uses 0.05 (`ambiguity.ts:7-8`), and the H2 script skips gold-`none` rows so abstention cannot be scored (`score-outcome-rerank.mjs:47`). Because my iteration 2 and mimo-002 cross-read, this is agreement after cross-reading, not independent corroboration. It changes the harness design: the census must be check 1, before any Jev call.

## Actions Taken (opened this iteration)

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` (directory listing; `score-outcome-rerank.mjs`, corpora, `scorer-eval-baseline.json` siblings)
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:1-45` (stability formula)
- Sibling: `research/lineages/mimo/iterations/iteration-002.md`
- Digest claims (reused): H1 ratchet, H2 metrics, H9 grader, the gaps table

## Harness A (first): the routing tie-break arm with a margin census and a call record

| Field | Content |
|---|---|
| **Name** | `score-jev-tiebreak.mjs` |
| **Home** | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` beside `score-outcome-rerank.mjs`; it reuses that script's corpora, deterministic split (`score-outcome-rerank.mjs:118-121`) and metric functions (`:100-111`). |
| **Phase 0, no key required** | Census only: load `labeled-prompts.jsonl` (195), `holdout-prompts.jsonl` (70) and `ambiguity-prompts.jsonl` (24); compute the top-two passing margin per row; count rows inside the live cluster margin 0.05 on score-or-confidence (`ambiguity.ts:7-8`, `:28-35`) and report the 0.03 slice separately; count the abstention population (13 unknown, 5 gold-none false fires per the baseline capture) that the H2 script cannot even load. Writes `census-<date>.json`. This is the number nothing has recorded. |
| **Phase 1, key required** | For each eligible row: spawn `jev choice` with the candidate skill ids plus their descriptions as options and a `none` key, `</dev/null`, per-call timeout (10 s), probe `jev --version` + `auth status` first; record `{rowId, arm:'jev', pick, prob, noneProbability, latencyMs, exit, version}` per call to `<date>-calls.jsonl`; then compute baseline vs arm MRR, right@1, right@3 on the holdout as the headline and the ambiguity slice separately. |
| **Latency and cost probe folded in** | The per-call JSONL is the latency probe: it yields p50/p95 wall time and exit-code counts for free. No separate script yet. |
| **Stability** | Rerun the arm three times; report the flip rate and the stability coefficient `1 - (stddev/mean)` with the warning threshold 0.95 copied from `benchmark-stability.cjs:24-28`. |
| **Writes** | `census-<date>.json`, `<date>-report.json` (baseline vs arm), `<date>-calls.jsonl` (per call). Never touches `scorer-eval-baseline.json` or the ratchet. |
| **No key** | Phase 0 runs and prints the census; phase 1 prints `jev arm skipped: no key` and exits 0. Baseline numbers are unchanged; nothing is fabricated. |
| **Kill criterion (from grok-010, accepted)** | If held-out MRR or right@3 does not beat the similarity-only arm, the closed-set `choice` family drops for the quarter. |
| **LOC** | ~150-200 LOC, one file plus fixtures already existing. |

## Harness B (second): the D4 `jev` grader kind

| Field | Content |
|---|---|
| **Name** | `jev` grader kind |
| **Home** | `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/jev.cjs` plus one factory branch in `score-model-variant.cjs:207-226` and the `--grader` surface (`run-benchmark.cjs:577`, `:582`; `.skilled/commands/deep/model-benchmark.md:111`). |
| **Required fixes while wiring** | An unknown grader kind currently falls through to `mock` (`score-model-variant.cjs:211`); a `jev` branch must be explicit and an unknown kind must fail, not silently mock. The exception path today returns `score 0.0 / parse_status 'failed'` (`:222-224`), which reads as "maximally hallucinated"; the jev arm must represent "not measured" as a skip (mimo-001's catch, accepted). |
| **Run** | `node run-benchmark.cjs --profile reviewer-regression --scorer 5dim --grader jev --outputs-dir <dir>`; the agreement row compares against `expectedVerdict` and `expectedFindings` (`reviewer-schema.md:59-60`), with hidden cases as the overfit guard (`:66-68`). |
| **Writes** | The standard run report plus one agreement row (score/verdict agreement, cost, latency); the grader cache stays run-scoped (`harness.cjs:60-70`). |
| **No key** | Refuse the run at startup with a stderr message, mirroring the family-collision refusal (`run-benchmark.cjs:614-621`); never fall back to `mock` for a jev-requested run. |
| **LOC** | ~60-100 LOC across the wrapper, the factory branch and the flag/doc row. |

## Findings

1. **The top idea's harness must start with a census, not a call.** Mimo-002 proved the eligible-row count does not exist anywhere; without it the arm's denominator is unknown and the "can this show a gain" question cannot be answered even after a run. Phase 0 costs no Jev call and produces the first new number.
2. **The existing eval script and its metrics are reusable as-is.** `score-outcome-rerank.mjs` already loads the corpora, splits deterministically (`:118-121`), and reports MRR/right@1/right@3 (`:100-111`). A sibling script imports the same shapes rather than inventing a new metric family.
3. **The latency and cost probe should not be a separate first deliverable.** The routing arm makes the calls anyway; recording wall time, exit code and version per call fills gap row 1 for free. A standalone probe script would duplicate caller one's spawn logic ahead of demand (iteration 7's rule).
4. **Stability has a formula to copy.** `benchmark-stability.cjs:24-28` defines coefficient `1 - (stddev/mean)` with a 0.95 warning threshold and a minimum replay count of 3 (`:20-21`); the arm reruns follow the same shape instead of inventing a flip-rate definition.
5. **The D4 grader has its gold set today.** The reviewer fixtures carry `expectedVerdict` and hidden cases (`reviewer-schema.md:59-68`); the gap row "Grader agreement with oracle" is filled by one `llm` run and one `jev` run. This is the one harness whose Gold exists; the routing arm's gold is a split, not an oracle.
6. **Both harnesses write JSON/JSONL reports, not state.** Neither touches a ratchet baseline, a config, or a frozen contract: the routing arm writes beside the eval scripts, the grader kind writes through the existing run report. Reversibility is file deletion.

## Ruled Out

- **A standalone latency probe as the first harness**: duplicates caller one; fold the record into the arm.
- **Writing the Jev arm into the ratchet baseline**: the arm is network-dependent and non-deterministic; the ratchet pins a deterministic environment.
- **A new metric family for the arm**: MRR/right@3 already exist and match the rerank literature the repo cites.
- **Scaffolding both harnesses behind a shared client**: iteration 7's caller-three rule still holds.

## Questions Answered

- Harness file list: `score-jev-tiebreak.mjs` (arm + census + call record) first; `scorer/grader/jev.cjs` + factory branch second.
- Output format: census JSON, report JSON (baseline vs arm), per-call JSONL with latency/exit/version; standard benchmark report for the grader.
- No-key behavior: phase 0 census runs, phase 1 prints skipped and exits 0; the grader refuses the run at startup.

## Questions Remaining

- The census number itself (how many eligible rows) — check 1, unrun.
- Whether reviewer fixtures are numerous enough to give the agreement number a meaningful denominator (mimo-001's open question; count them in the build phase).

## Hand-off (for iteration 9)

- Harness A is the first build; its census runs with no key and its arm carries the kill criterion. Harness B is second and fixes the silent-mock and silent-zero paths while wiring.
- Iteration 9 must test the failure modes against these two harnesses: exit 3 at probe, exit 4 mid-arm, malformed answer, timeout near the per-call budget, and the wrong package on PATH.

## Assessment

- `newInfoRatio`: `0.66`
- Novelty justification: Turned mimo-002's headroom arithmetic into a census-first harness design, folded the latency probe into the arm's call record, and pinned the two required fixes for the D4 grader kind. Sibling agreement is cross-read, not independent.
- Confidence: high for the reusable script shapes and stability formula; medium for the census-to-gain relationship (unrun); UNKNOWN for per-call latency until the arm records it.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` (directory and digest-described files)
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs`
- Sibling: `research/lineages/mimo/iterations/iteration-002.md`
- Digest claims (not reopened): `context/measurement-digest.md` (H1, H2, H9, gaps), earlier iterations of this lineage
