---
title: "DeepSeek Lineage Synthesis — Jev Round 2: seams, the key gate and failure paths"
description: "Terminal synthesis of the deepseek lineage in 004-deep-research-expansion: five forced iterations on the key gate, the compaction seams, the goal seams, missed seams and the engineering failure view, measured against the round-1 re-synthesis."
trigger_phrases:
  - "jev round 2 deepseek lineage"
  - "jev key gate failure paths"
importance_tier: "important"
contextType: "research"
---

# DeepSeek Lineage Synthesis — Jev Round 2

Lineage `deepseek` (cli-pi, `deepseek-v4.1-flash`, max) in `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion`. Lens: **seams, the key gate and failure paths**. Five forced iterations, `stopPolicy: max-iterations`, convergence off. Baseline: `../001-deep-research/research/research.md` (round-1 re-synthesis); this file never restates a baseline finding without new evidence, and every load-bearing claim names where it was opened.

## 1. Executive summary

- The round-1 D5 gate holds as specified and costs zero network and zero quota in all three checks (Python package: a shell builtin plus two spawns). Its weak points are now named: the version check tests a hardcoded string (`jev 0.6.2` literal), and the Python `auth status` cannot tell an environment-variable key from a stored one. Two one-line additions fix the visibility (N-deepseek-01-1, N-deepseek-01-2).
- The compaction census can read far more than BASE assumed: the transcript records the boundary (`system/compact_boundary` + `compactMetadata`), the host summary (`user/isCompactSummary`) and the **injected brief** (`attachment/hook_success` with `hookEvent: SessionStart`, `hookName: SessionStart:compact`, `stdout`/`content`). The brief-replay fallback is now second choice (N-deepseek-02-1). The production `session.compact` budget is still UNKNOWN; the vendored types describe host 2.1.274 while the installed host is 2.1.283.
- The goal seams resolved: Pi **awaits** async `turn_end` handlers, so a later Jev form must not await inside the handler; the OpenCode failure catch would turn a Jev transport error into `blocked`, so the shadow must catch first; and R20's lint can only cover `/create:goal` authoring, not the native string, direct edits or `/goal-opencode set`.
- Open question 26 is resolved: the round-1 DeepSeek registry loss dropped no verdict-changing finding; five residue items are design-level and verified.
- One genuinely missed surface: the Human Voice Rules scan's documented reader-needed half (N-deepseek-04-1, later).
- Verdicts are unchanged from BASE. This lineage contributes text-level corrections (the fit column; the decided universe note from swe-01; the flip-rate repair extended to R2 and R20), two gate-visibility lines, one census design change, one doc-time table, and one new later candidate.

## 2. What this lineage changes against the round-1 baseline

| Item | Change | Evidence |
|---|---|---|
| D5 check 1-3 | Cost/network/quota profile confirmed per check; check 2 is a literal-string test, check 3 passes on an env-var key and mislabels it as stored | `jev-cli-main/src/jev_cli/__init__.py:327`, `:90-93`, `:419-421`; npm `cli.ts:89`, `:166-183`; `docs/auth.md` |
| Row 43 family | The npm package's own docs recommend the tracked-settings `env` placement, and the shared `TYPESAFE_API_KEY` name means that placement also satisfies the Python gate | npm `docs/auth.md`; `credentials.ts:13-16`; `__init__.py:21` |
| R19 brief column | Read the recorded `SessionStart:compact` attachment first; replay `buildMergedCompactResult` only if absent | transcript census (2 compactions; attachment at +13; `stdout` 2,335 chars) |
| R19 fit column | Estimate the **staged fitted state** (`estimateTokens` + `stage`, throw past the ceiling); never compare host `preTokens` with 25,000 | `vendor/compaction/state.ts:191-214`, `:225`, `:305`; `compact.ts:19-27` |
| R2 plugin mode | Pi must not await a Jev call inside `turn_end`; OpenCode errors must be caught before the catch at `:2378-2380` | Pi dist `emitBoundary()`; `opencode-goal.js:2368-2380` |
| R20 coverage | Lint covers `/create:goal` authoring only; three bypass paths documented | `SKILL.md:110`; `create-goal-auto.yaml:214-228`; `goal-opencode.md:1-30` |
| Flip-rate clause | The 0.10 per-row cap is a unanimity test at 3 reruns in R1, R2 and R20; restate as aggregate + per-row unanimity | mimo-01-1 verified; BASE R2/R20 |
| Open question 26 | Resolved: no verdict-changing round-1 DeepSeek finding was lost | iteration-004 F1 table |
| New candidate | HVR scan reader-needed categories (`noul`/`score`), later | `hvr_scan.py:1-29` |

## 3. Angle results

1. **deepseek-01 — the key gate as code.** Both packages' version, credential, output and exit surfaces traced to source. The Python `--version` is a hardcoded literal, the npm `--version` prints a bare semver and fetches nothing, the Python package resolves `TYPESAFE_API_KEY` from the environment first, and the exit matrices disagree (Python 0/1/2/3/4/130 vs npm 0/1/2). Gate cost: zero network/quota; per-check latency UNKNOWN.
2. **deepseek-02 — the compaction seams.** Question 25 resolved from a 14,868-record transcript census (field names only): boundary and summary records identified, the brief found in the SessionStart:compact attachment, no PreCompact records exist. Question 18 partly resolved: the only budget figure is test-clock prose; the vendored types are 2.1.274 against an installed 2.1.283; the binary context probe timed out and is reported as such.
3. **deepseek-03 — goal seams across runtimes.** Question 28 resolved: Pi awaits each async `turn_end` handler and consumes `{entries, continue}` results, so the goal-context NOTE is imprecise and the critical-path constraint is the await. Both clamp paths restated with exact return lines; the `blocked` catch mapped; `check-goal.cjs` callers listed with bypass paths.
4. **deepseek-04 — missed seams.** Question 26 resolved with a five-row residue table. The four hook families and four plugins classified as deterministic or presentation surfaces; the projection, permission, guard and checker surfaces dropped as Jev homes; the HVR reader-needed gap recorded as the one genuine missed seam.
5. **deepseek-05 — failure modes and kill criteria.** Per-survivor failure matrix, frozen-touch map (R2's plugin enum; R20's placement), no-key tests, kill criteria as printed results, and the build order with rollback sentences. Sibling contest on the fit column resolved in grok's favor and verified in vendored code.

## 4. Recommendation verdicts from this lens

| Recommendation | Verdict | This lineage's contribution |
|---|---|---|
| R1 offline advisor tie-break arm (+R21) | build-now | Gate and failure paths confirmed; decided universe fix (swe-01) adopted; first latency record remains the key product |
| R19 compaction recall census | build-now | Brief column simplified to read-first; fit column corrected to staged-state estimate |
| R20 goal-criteria lint | next | Insertion point and coverage statement fixed |
| R2 goal verifier zero-call slice | next | Pi await constraint; blocked-catch constraint; vocabulary mapping confirmed |
| R2 Jev arm and plugin mode | later | Same constraints; no key behavior test specified |
| R21 Gate 3 calibration | next, conditional | Rides R1's gate; missing answers must be excluded |
| N-deepseek-01-1 identity line | next | Doc amendment to 002/003 skip lines |
| N-deepseek-01-2 key-origin line | next | Exposes the settings-env accident |
| N-deepseek-01-3 per-code table | doc-time | For 005/006 when written (grok-05 scheduling accepted) |
| N-deepseek-02-1 parser contract | next | Three record shapes, fail loudly |
| N-deepseek-02-2 precompute form | later | Off-critical-path candidate; egress multiplier kill |
| N-deepseek-03-1 flip repair for R2/R20 | build-now as text | Extends mimo-01-1 |
| N-deepseek-04-1 HVR reader-needed lens | later | No labels; harness named |

## 5. Failure matrix (compact)

Exit 3 mid-run stops R1 (rows `partial`) and disables the plugin shadow for the session; exit 4 gets one backoff then `unmeasured`; a malformed answer is `unmeasured`; the wrong package is refused at check 2 with found version and path; no path returns a default score; only call-record statuses persist. The plugin mode is the only survivor whose failure could alter today's user-visible behavior, and only through the `blocked` catch — which its spec already keeps Jev out of.

## 6. Kill criteria (printed results)

- R1: `verdict: kill` closes R3; `baseline mismatch: comparison void` stops the arm; `no headroom`/`underpowered` close nothing.
- R19 census: unknown record shape on more than half the sessions, or any transcript text in the report; arm: fit throws ≥50% or reduction upper bound <0.25 (grok-05), plus ≤30 s p50, recall ≥ stock, kept tokens ≤3×, fallback ≤20%.
- R20: labeled violation rate <5%; no npm-only subcommand.
- R2: under 30 rows stops the slice; no recorded verifier use keeps the arm; any added false `met` fails the keep.
- R21: only on `underpowered`, with missing answers excluded.

## 7. Handed-over questions and open items

- Question 18 (production `session.compact` budget): **UNKNOWN**; only test-clock prose exists; installed 2.1.283 vs vendored 2.1.274.
- Question 19 (OpenCode/Pi verifier use): not answered here; it gates R2's later arm.
- Question 25 (transcript records the brief): **resolved yes**, via SessionStart:compact.
- Question 26 (registry loss): **resolved**, no verdict change.
- Question 28 (Pi awaits `turn_end`): **resolved yes**, with result semantics.
- Gate questions: **resolved** (network/quota, env-first resolution, shared variable name).
- Remaining unknowns: per-check latency; movable-row power; HVR labels; whether every compaction carries the SessionStart:compact attachment (counted by the census); precompute cadence.

## 8. Sibling agreements and contests

- Agreed with grok-003 on the version literal (my F1, reopened in both); agreed with grok-005's fit-column correction and verified it in vendored code; accepted its scheduling of N-deepseek-01-3.
- Agreed with mimo-01's flip-rate resolution and extended it to R2 and R20 (N-deepseek-03-1).
- Adopted swe-01's R1 findings (decided universe, `-s -`, exact tail) into the failure table.
- No sibling contested this lineage's gate findings; the only substantive contest on my work was the fit column, resolved.

## 9. Convergence report

- Stop reason: **maxIterationsReached** (cap 5, forced).
- Iterations: 5 of 5; self-reported `newInfoRatio` series `[0.95, 0.9, 0.85, 0.8, 0.7]` (self-report, telemetry only; convergence mode off).
- Angles answered: deepseek-01 to deepseek-05, one each.
- Key findings: 41 delta finding records across five deltas; new ideas 7; ruled-out directions 7.
- Question coverage: 4 resolved (gate cost/origin, brief recording, registry loss, Pi await), 1 partly (production budget), the rest logged as open.
- Writes: all artifacts under `research/lineages/deepseek/` only; no `jev` call of either package; no `.env` opened; no repository module executed.
