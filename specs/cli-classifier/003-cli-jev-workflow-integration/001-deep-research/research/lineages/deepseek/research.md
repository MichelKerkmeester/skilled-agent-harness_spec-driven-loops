---
title: "Jev typed judgments in .skilled — deepseek lineage synthesis (integration engineer)"
trigger_phrases: []
---
# Jev typed judgments in .skilled — deepseek lineage synthesis

**Lineage:** `deepseek` · **Session:** `fanout-deepseek-1790438758756-5mso8j` · **Loop:** research, 10 iterations, `max-iterations` · **Lens:** integration engineer · **Executor:** cli-pi / deepseek-v4.1-flash (max)

**Jev package under study:** the Python `jev-cli` 0.6.2 wrapped by `.skilled/skills/cli-jev/cli-usage/`. The npm `jevctl` 0.2.3 vendored at `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main` is research material only and is named apart wherever it appears (their exit-2 meanings collide).

## 1. Executive summary

No live Jev call survives the integration-engineer's deadline and determinism tests. Every recommendation that can ship this round is an **offline measurement arm**: a script a person runs, writing a report, with the answer never served before it is measured. The one live candidate with a clean seam — a `jev` goal-verifier mode on the OpenCode plugin — is gated on a labeled transcript set that does not exist and must stay shadow-only and non-authoritative. Nothing needs a new skill, command or helper yet.

The single first build is the **routing tie-break arm**: a `choice` over a near-tie advisor cluster, scored beside the similarity arm on the existing corpus, with a no-key census phase that produces the eligible-row count nothing has recorded. If it loses on the held-out split, the closed-set `choice` family (severity, goal, next-focus) drops for this round. The second independent slice is the **D4 `jev` grader kind**, whose gold set already exists in the reviewer fixtures.

## 2. Method and iterations

Ten angles, one per iteration, each with a per-idea record (value, seam, metric/baseline/harness, cost/latency/privacy, opt-in and no-key, complexity, verdict, confidence). Wave 1 grounded the operator's four ideas (grading, advisor, goal/compaction). Wave 2 covered the cross-cutting judgment points (stop, triage, guards, validation, routing). Wave 3 decided the surface question and designed the harnesses. Wave 4 tested failure modes and fixed the build order. Every load-bearing claim cites a repo-relative `file:line` opened in that iteration; digest-only claims are attributed to their digest. No live `jev` call was made, and no `.env` file was opened.

| # | Angle | Ratio | Verdict highlights |
|---|---|---|---|
| 1 | Grading, the wiring | 0.85 | D4 grader kind offline-only; sentinel later; H13 later |
| 2 | Advisor, the wiring | 0.80 | offline arm first; live child impossible (2200 ms, SIGKILL to `{}`) |
| 3 | Goal/compaction, the wiring | 0.75 | OpenCode verifier mode seam found; PreCompact live dropped |
| 4 | Deep-loop stop | 0.72 | shadow second rater beside the existing corroboration guard |
| 5 | Triage and guards | 0.70 | severity replay via H14 first; guards dropped on evidence type |
| 6 | Validation, clarify/defer, verdicts | 0.68 | routing front door dropped; offline CLI seams later |
| 7 | Smallest new surface | 0.62 | none; helper earned at caller three |
| 8 | Measurement harness as code | 0.66 | census-first arm; grader kind second; latency folded in |
| 9 | Failure modes and caching | 0.64 | exit map, version probe; no survivor touches a cached prompt |
| 10 | Build order, engineering view | 0.58 | ordered slices with rollback sentences; goal mode revised to later |

## 3. Ranked recommendations (integration-engineer view)

Field key: **Seam** (opened `file:line`); **Metric, baseline, harness**; **Failure/opt-in/no-key** summarized; **LOC**; **Confidence**.

1. **Routing tie-break arm — NEXT (first build).**
   - What: `choice` over the ambiguity cluster members (plus a `none` key) for near-tie rows, offline.
   - Seam: `score-outcome-rerank.mjs:127-133` (arm pattern), cluster at `ambiguity.ts:22-36`.
   - Metric/baseline/harness: H2 (MRR, right@1, right@3) and H1 (holdout 53/70 = 0.7571; ambiguity 18/24 = 0.75, digest). Census first (no key): eligible rows in the 0.05 live-cluster margin.
   - No key: census runs; arm prints skipped and exits 0. Never writes the ratchet.
   - LOC: ~150-200, one new script. Kill: loses on held-out MRR/right@3.
   - Confidence: confirmed for the template and split; UNKNOWN for the delta.

2. **D4 `jev` grader kind — NEXT.**
   - What: a fourth grader kind returning `{score, confidence, parse_status, dim_id, rationale, evidence}`.
   - Seam: `score-model-variant.cjs:207-226`; flag `run-benchmark.cjs:577`, `:582`; command doc `.skilled/commands/deep/model-benchmark.md:111`.
   - Metric/baseline/harness: H9 agreement with `expectedVerdict` (`reviewer-schema.md:59`); baseline UNKNOWN (gap row "Grader agreement with oracle").
   - No key: refuse the run at startup (mirror `run-benchmark.cjs:614-621`); mid-run failure is a not-measured marker, never `score 0.0` (`:222-224` anti-pattern).
   - LOC: ~60-100. Fixes required: explicit `jev` branch (unknown kinds currently fall to `mock` at `:211`).
   - Confidence: confirmed for shape and gold; UNKNOWN for agreement.

3. **Stop second-rater replay — NEXT (after 1-2).**
   - What: a Jev novelty `score` recorded beside the self-report; replay-only.
   - Seam: `convergence.cjs:506-549` (existing corroboration guard), `:618-631`, `:805-808`; shadow-pair shape `stopping-clock-shadow.ts:11-19`.
   - Metric/baseline/harness: H11 replay; gold = last iteration adding a cited finding; baseline none.
   - No key: replay runs without the arm and says so. LOC: ~60-100 plus replay. Never enters `shouldBlock`.
   - Confidence: confirmed for mechanics; UNKNOWN for agreement.

4. **Severity replay via H14 — NEXT (after 1-2).**
   - What: `choice` (`P0/P1/P2/not_a_finding`) beside P0s, through the reviewer-blind adjudication service.
   - Seam: `blinded-adjudication/README.md:12`, `:26`; `mode-adapters.ts:63`; severity contract `completion-criteria.md:61-63`, `:75`.
   - Metric/harness: H14; gold = archived adjudicated severities (extraction first). LOC: ~80-120 plus gold.
   - Never the recorded severity. Confidence: confirmed for infrastructure; UNKNOWN for agreement.

5. **Goal verifier `jev` mode — LATER (conditional on labeled set).**
   - What: `'jev'` added to `VALID_VERIFIER_MODES` (`opencode-goal.js:134`), 30 s verifier budget (`:49`), plus an optional Pi arm.
   - Metric/harness: H12 plus 30-50 labeled excerpts (10 per class, mimo-003); shadow-only, heuristic authoritative; wrapper must refuse `met` when blocking language is present (`goal-core.cjs:603`).
   - No key: default `heuristic` (`opencode-goal.js:72`); mid-run failure falls back per turn.
   - LOC: ~60-100 plus the labeled set. Rank revised from `next` after grok's contest and mimo-003 (cross-read, not independent).
   - Confidence: confirmed for the mode switch and vocabulary mapping; UNKNOWN for accuracy.

6. **Advisor cached shadow lane — LATER.** Needs a cache/producer (no daemon exists; `user-prompt-submit.ts:109-117`) and slice 1's win. Pattern: `lane-registry.ts:21-29`, `shadow-sink.ts:86-89`, `:151-155`.

7. **Fan-out shadow pair record — LATER.** `noul` same-point check for pairs near the 0.15 line and cross-body pairs (`fanout-merge.cjs:341-351`); never a live merge decision (deterministic today); needs a labeled pair set.

8. **Alignment below-50 suggestion — LATER.** `alignment-validator.ts:73-75`, `:503-521`; contract-permissive console line; needs archived gold count.

9. **Spec-level risk flags — LATER.** `recommend-level.sh` (digest S24); weak gold; policy semantics owned by the script.

10. **Completion-claim offline audit — LATER.** `noul` vs regex (`completion-evidence-sentinel.cjs:64`, `:113-119`) over the advisory log; live path impossible (1200 ms, `:90-94`).

11. **H13 reply-harness judge slot — LATER.** Fills an empty judge slot in a manual harness; measurement tooling.

## 4. What not to build (drop, with reasons from code)

| Idea | Reason |
|---|---|
| Live Jev in the advisor child | 2200 ms effective budget, SIGKILL at 2500 ms, fail-open to `{}` (`user-prompt-submit.ts:22-24`, `:105-122`) |
| Jev as a fused live advisor lane | `passes_threshold` is code-owned (`fusion.ts:785-787`); one lens is not a routing verdict |
| Live Jev inside `detectCompletionClaim` | synchronous pure boolean under a 1200 ms check (`completion-evidence-sentinel.cjs:90-119`) |
| Live Jev keep-or-drop in PreCompact | merge warns above 1500 ms against an 1800 ms cap (`compact-inject.ts:353-357`, `shared.ts:12`) |
| Jev verifier on Cursor/Devin | injection-only adapters, no verifier surface (`cursor/goal-inject.mjs:11`, README table) |
| Jev inside `shouldBlock` | STOP is allowed pending self-report agreement (`convergence.cjs:480-481`); a model answer must not become the blocking authority |
| Jev in the dispatch guard or linter | 5 s budget, repository-fact evidence, determinism required (`dispatch-guard.cjs:526-579`) |
| Jev as the live fan-out merge decision | deterministic replayable merge; no gold pair set, no reproducibility story |
| Live Jev in the compiled-routing front door | single legal stdout shape, legacy sentinel, synchronous path, 13-row gold (`compiled-route.cjs:25-47`; digest H7) |
| Jev retrievability score | no retrieval gold; unvalidated number beside a calibrated gate |
| Jev playbook verdict second opinion | 22 PASS / 0 FAIL recorded; human verdict wins by contract |
| Replacing `verifyGoalHeuristic` outright | blocking-language safety property (`goal-core.cjs:603`); judgment-as-authorization |
| New `cli-jev` skill mode or command | transport posture already covers script callers (`cli-usage/SKILL.md:113-114`) |
| Shared client helper now | zero callers; a forwarding wrapper until caller three |
| Writing the Jev arm into the ratchet baseline | network-dependent arm in a pinned deterministic ratchet |
| Client-side answer cache in stability runs | identical cached answers nullify the flip-rate measure |
| `score 0.0` as not-measured | indistinguishable from maximally hallucinated output (`score-model-variant.cjs:222-224`) |

## 5. RQ1–RQ7 answers (condensed)

- **RQ1 grading:** the D4 grader factory is the only site whose return contract matches a Jev answer; offline only; the completion sentinel cannot host a live call; the H13 judge slot is manual. Harness H9; baseline for agreement is UNKNOWN.
- **RQ2 advisor:** a live tie-break inside the 2200 ms child is impossible; the feasible shapes are the offline arm (first) and a cached shadow lane (later). Flag family `SPECKIT_ADVISOR_*`, default off.
- **RQ3 goal/compaction:** the OpenCode plugin's `heuristic|llm` verifier switch is the seam; Pi pays per turn; Cursor/Devin have none; Claude PreCompact fails its 1800 ms budget. The vendored fallback patterns (fail to stock with a notice, minimum reduction, decision log) carry; the feature does not.
- **RQ4 compaction:** no live call; the measurement gap (recovery quality) remains open and is not in this round's build order.
- **RQ5 cross-cutting:** the stop path's existing `noveltyCorroboration` guard is the prefabricated shadow slot; severity replay has the H14 infrastructure; guards, validation triage and routing clarify/defer fail on repository-fact evidence, determinism or gold; the dispatch linter is already the correct surface for Jev rule enforcement.
- **RQ6 new surfaces:** none. Direct transport calls from each seam; helper at caller three (~60-80 LOC: probe, bounded spawn with caller timeout, exit map, strict parse).
- **RQ7 cost/restraint:** the version probe (`jev 0.6.2`) closes the package-collision hazard; retries are asymmetric (4 backs off, 3 never, 1 inspect); no survivor changes a provider-cached prompt; not-measured must be representable; smallest-first order below.

## 6. Failure modes and acceptance criteria (from iteration 9)

Every slice ships with: the exact version probe before any exit-code interpretation; the exit map (0 judgment, 1 inspect, 2 usage/no-quota, 3 operator, 4 retryable, 130 interrupted; errors on stderr with stdout empty); a wrapper-set timeout; a not-measured representation distinct from any score; and no retry on exit 3. The one proposed-but-unmeasured number is the 10 s per-call wrapper timeout; slice 1's latency record replaces it with a measurement.

## 7. Build order with rollback

1. **Routing arm** (~150-200 LOC, one new script): delete the script and its reports; nothing else changed.
2. **D4 grader kind** (~60-100 LOC, scorer factory + wrapper + flag row): revert the branch and flag, delete `grader/jev.cjs`; default `noop` unchanged.
3. **Stop replay** (~60-100 LOC + replay): delete the script; convergence and reducer untouched.
4. **Severity replay** (~80-120 LOC + gold): delete the runner and fixture; adjudication service untouched.
5. **Goal mode** (~60-100 LOC + labeled set): remove the mode value and branch; default `heuristic` unchanged.

If only one build happens, it is slice 1. Slices 2-4 are independent of its outcome; slice 5 is gated on its own labeled set.

## 8. Cross-lineage position (wave rule applies)

- **Grok** reached the same first slice (offline routing arm) and the same kill criterion; grok names this lineage's iteration 2 as its source, so that agreement is *after cross-reading, not independent*. Grok's "nothing else until the arm has a delta" is accepted for a one-slot budget and contested for two: the grader family is not gated by the routing outcome.
- **Grok contests** the iteration-3 rank of the goal mode; this synthesis adopts `later` with the labeled set as the gate (agreement after cross-reading).
- **Mimo** supplies the headroom arithmetic (at most 6 rows on the ambiguity slice, 17 on the holdout, eligible count UNKNOWN; 0.03 slice vs 0.05 live cluster; gold-`none` rows unscorable by the current script) and the D4 build-now slice with the silent-mock catch; both are folded in and marked as cross-read.
- **Independent-in-wave-1 agreements:** the goal/compaction deadline conclusions (this lineage iteration 3 and grok iteration 3, before cross-reading from iteration 4 onward) and the guard exclusions.

## 9. Evidence quality and caveats

- All code citations were opened in the declaring iteration; digest-only claims are attributed. No lineage timestamps were used as evidence. Self-reported `newInfoRatio` values are judgment, not measurement.
- No live `jev` call was made anywhere in this lineage; nothing here has a measured latency, dollar cost or accuracy number. Vendor claims (about 150 ms per answer, $0.042/M input tokens) were not reproduced and are not relied on.
- The worktree carried unrelated uncommitted edits; no lineage write occurred outside this directory.
- The two-package hazard is named on every claim: Python `jev-cli` 0.6.2 (the transport's package; exit 2 = usage, no quota) versus npm `jevctl` 0.2.3 (research material; exit 2 = tripped `--fail-on` gate).

## 10. Convergence report

- **Stop reason:** `maxIterationsReached` (10 of 10).
- `newInfoRatio` trend: `[0.85, 0.80, 0.75, 0.72, 0.70, 0.68, 0.62, 0.66, 0.64, 0.58]`, mean `0.70`, descending; convergence mode off, telemetry only.
- Angles answered: 10/10; no blocked stop, no stuck recovery.
- Open questions carried to the merged synthesis: the census count and arm delta (unrun); every accuracy number (unrun); the archived-gold counts for slices 3-4.
