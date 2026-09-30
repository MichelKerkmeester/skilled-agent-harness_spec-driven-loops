---
title: "Deep Research Round 2: Jev Typed Judgments, Deepened and Widened [cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research]"
description: "Round 2 synthesis of four non-Claude lineages over the round-1 re-synthesis. R1 and R19 stay build-now as zero-call censuses, R2 rises to rank 3 on 1,457 recorded Pi verifier nudges, R20 and R21 stay next, R22 joins at later and every Jev call stays dormant without a key."
trigger_phrases:
  - "jev round 2 synthesis"
  - "jev advisor census first slice"
  - "jev compaction census brief recorded"
  - "pi goal verifier nudge census"
  - "goal criteria lint rubric"
importance_tier: "important"
contextType: "research"
---

# Deep Research Round 2: Jev Typed Judgments, Deepened and Widened

Final synthesis of round 2 for `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion`, written on 2026-09-27 by a fresh Opus 5.5 max leaf (phase `goal.md:53`, D6). It extends the round-1 re-synthesis at `../001-deep-research/research/research.md`, called BASE below, and never silently overrides it: the section after section 1 lists every change against BASE. Every `jev` in this file is the Python `jev-cli` 0.6.2 that `.skilled/skills/cli-jev/cli-usage/` wraps, unless the sentence names the npm `jevctl` 0.2.3 vendored under `../context/external repo's/jev-cli-main`. Names marked "proposed" do not exist yet. D5 is the parent's key gate (`../goal.md:53`), while "council D2" and "council D5" name the council disagreements BASE carried. Prices, latencies and accuracy figures from READMEs, websites and posts are vendor claims or user reports, never reproduced here.

## Table of Contents

1. Executive Summary
   - Changes From the Round-1 Re-Synthesis
2. Scope, Method and Inputs
3. RQ1: First slices
4. RQ2: Compaction
5. RQ3: Goal criteria and goal judges
6. RQ4: R1's power
7. RQ5: The vendored material
8. RQ6: What round 1 and the council both missed
9. RQ7: Order, cost and kill criteria
10. Cross-Lineage Agreement
11. Recommendations
   - What Not To Build
   - Divergence Map
12. Open Questions
13. Proposed Build Phases
14. Citation Verification Ledger
15. Evidence Quality and Caveats
16. References
17. Convergence Report

---

## 1. Executive Summary

- **Start with R1's zero-call census in `002-advisor-jev-tiebreak-arm`.** It needs no key and no label. Its power line says, before any billed call, whether a Jev `keep` is reachable here at all: at most 55 rows are movable, so even a full deck needs a true win rate near 0.68 for 80% power. R19's zero-call census in `005-compaction-recall-harness` runs beside it. Every Jev call in either stays dormant unless the three D5 checks pass.
- **Round 2 changed clauses, not ranks, for R1 and R19.** R1 gets an aggregate flip rule (BASE's per-row rule passes only on unanimity), a decided universe that keeps gold demotions as losses, a power line and the capture's exact env. R19 gets a staged fit column instead of `preTokens` against 25,000 and reads the brief the transcripts already record (210 of 222 boundaries, counted today).
- **Pi already runs the goal verifier, unseen.** This repository's Pi sessions hold 1,457 hidden `goal-verify-nudge` messages in 28 sessions, 253 of them from the truncation branch the clamp defect feeds. Pi 0.87.1 hands each one to the model as a user message. That answers question 19 for Pi, refutes the zero-use counts of mimo-03 and swe-03 and lifts R2 to rank 3 with a Pi census as its first slice.
- **Verdicts:** 2 build-now (R1 and R19), 3 next (R2, R20 and the conditional R21), 15 later (R3 to R18 without R11 and R14, plus the new R22) and 1 drop (R14), with R11 still folded into R19. What Not To Build grows from 43 rows to 72.
- **Two confirmed gaps sit in front of the first billed call.** The redaction miss spans three module copies, which a 48-character test fixture would hide. D5's check 3 and `jev auth test` read the `official` key while judgments follow `JEV_PROVIDER`. Both go to their owners as reports, not as fixes made here.

---

## Changes From the Round-1 Re-Synthesis

BASE is `../001-deep-research/research/research.md`, last changed at commit `8ea2a05454`. Every row below rests on code or a count reopened in this synthesis, or says lineage-reported. Section 14 holds the citation results.

### Changed verdicts, ranks and phases

| # | Item | Old state | New state | Reason | Evidence |
|---|---|---|---|---|---|
| V1 | Verdict counts | 2 build-now, 3 next, 14 later, R14 dropped. What Not To Build: 40 drop rows and 3 dead ends | 2 build-now, 3 next, 15 later, R14 dropped, R11 folded. What Not To Build: 64 drop rows and 8 dead ends | R22 and rows 44 to 72 | This section |
| V2 | R2 goal verifier | Rank 4. next for the zero-call slice, Jev arm and plugin mode later behind recorded OpenCode or Pi use | Rank 3. next, with a zero-call Pi census as the first slice. The Jev arm stays later behind a rewritten gate (C19) | Pi records verifier use, which BASE's premise treated as absent | 1,457 `goal-verify-nudge` custom messages in 28 Pi sessions (counted today). `goal-context.ts:233-238` |
| V3 | R20 goal-criteria lint | Rank 3 | Rank 4, still next | Its first number waits on a rubric the operator has not chosen, and it reaches `/create:goal` only | mimo-02's method spread (section 5). deepseek-03 F4 |
| V4 | R22 HVR reader-needed lens | Absent | later, rank 20 | A seam neither BASE nor the seam map names, failing only Q1 | `hvr_scan.py:17-21`. deepseek-04, N-deepseek-04-1 |
| V5 | Phase 006 name | `006-goal-criteria-jev-lint` | `006-goal-criteria-lint` | The first slice makes no Jev call, and the folder name should not promise one | No 005 or 006 folder exists (listed today) |
| V6 | Phase 003 first slice | The zero-call three-arm scorer | A zero-call Pi census, then the three arms. The Out of Scope line on Pi is replaced | The recorded use is in Pi, and 003's stated reason for excluding Pi is wrong | 003 `spec.md:91`, `goal-context.ts:221-244` |
| V7 | Build order | 002 and 005 censuses, 002's arm, 006's lint and 003's slice, later arms | 002, 005 and 003's Pi census first, then 002's arm, then the rubric and 006's lint, then 003's arms, later arms last. Redaction fixes land before any egress, not before the censuses | Section 9 | grok-05, mimo-05, deepseek-05, swe-05 |
| V8 | What Not To Build | Rows 1 to 43 | Rows 44 to 72 added. Rows 8, 9 and 43 gain evidence | Every dropped idea and dead end from the four lineages | What Not To Build |
| V9 | Open questions | 30 | 38. Eleven change status (5, 7, 19, 21 to 23, 25, 26 and 28 to 30), three gain evidence while staying open (1, 11 and 17) and eight are new | Section 12 | Section 12 |

### Changed records

| # | Record | Old state | New state | Reason | Evidence |
|---|---|---|---|---|---|
| C1 | R1 flip rule | A per-row flip rate of at most 0.10 | An aggregate flip rate, non-modal answers over all measured calls, of at most 0.10. A row with three different picks is `unstable` and undecided | With 3 reruns a row's rate is 0, 1/3 or 2/3, so the per-row rule is a unanimity test | mimo-01 (N-mimo-01-1), arithmetic rechecked here |
| C2 | R1 decided universe | Not defined | Every eligible row whose modal pick changes the gold's reciprocal rank, gold-first rows included. Movable wins and gold demotions print apart | A movable-only deck cannot lose on gold-first rows, so a pick that demotes correct rows could still earn `keep` | swe-01 proposed movable-only. Rejected here. `ambiguity.ts:22-36` |
| C3 | R1 power line | None | The census prints movable rows, the decided-row ceiling, the wins a keep needs and the win rate needed for 80% power. `underpowered` still fires below 5 movable rows | A keep can be unreachable well above 5 rows (section 6) | mimo-01, exact binomial recomputed here |
| C4 | R1 missing answers | Exit 4 or a malformed answer marks the row `unmeasured` | A row is decided only when all 3 reruns return a submitted key. A missing answer never becomes 0 or `none` | The npm `jevctl` `rerank` stores a missing answer as 0 | grok-03 (N-grok-03-1). npm `rerank.ts:77` |
| C5 | R1 `none` | An abstention (002 REQ-010) | Unchanged, now counted and printed apart, with a line for `none` on rows whose gold was in the cluster | grok-03 would count it a loss. The served order keeps the fused order on `none`, so the gold's rank does not move | 002 `spec.md:125`. npm `route.ts:180-192` |
| C6 | R1 env | The capture's env plus `VITEST=true` | Exactly `capture-scorer-eval-baseline.mjs:35-46`: a fresh temporary DB directory, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `PYTHONDONTWRITEBYTECODE=1`, `VITEST=true` and the three lane variables deleted | 002 `plan.md:63` lists neither `VITEST` nor `PYTHONDONTWRITEBYTECODE` | Reopened today |
| C7 | R1 spawn cap | None | 90 s per call (proposed), status `unmeasured_timeout` | The client's HTTP read stops at 60 s, but a spawn that never exits would hang the arm | `__init__.py:288`. swe-05's failure table |
| C8 | R1 gate lines | One skip-line form | Same form, plus one identity line before check 1 with the resolved binary path and the provider the arm will use, `JEV_PROVIDER` or `official` (proposed). Check 3, `jev auth test` and every judgment receive that provider as `--provider` (proposed, needs the operator's D5 approval). No key-origin check: it would put a key name in the script, which 002's REQ-003 forbids | `auth status` and `auth test` default to `official` while judgments follow `JEV_PROVIDER` | `__init__.py:307`, `:339`, `:420`, 002 `spec.md:113`. deepseek-01 (N-deepseek-01-1 adopted, N-deepseek-01-2 rejected) |
| C9 | R1 cost line | Payload class and planned call count | Adds estimated input tokens. No dollar figure is printed | Every price is a vendor claim | grok-04 (N-grok-04-2) |
| C10 | R1 size | 250 to 320 LOC | About 330 to 530 LOC, of which about 180 are the census (lineage estimates) | swe-01's function table and swe-05's census and arm split | swe-01, swe-05 |
| C11 | R19 fit column | Placeholder-state estimate against 25,000 tokens | The vendored staged estimate, with the stage reached and throws counted. Host `preTokens` is never divided into 25,000 | The ceiling applies to the fitted state after staged shrinking, not to the host's context | `state.ts:198-306`, `:304-306`, `compact.ts:24`. grok-01, swe-02, conceded by deepseek-05 |
| C12 | R19 brief column | Replay `buildMergedCompactResult` if the brief is not recorded (UNKNOWN) | Read the recorded `SessionStart:compact` attachment first. Replay only where none exists, stamped with a `replay_version` field (proposed) | The brief is recorded at 210 of 222 boundaries | Counted today. deepseek-02, swe-05 |
| C13 | R19 parser | Stop on an unknown record shape | A closed whitelist of record types, a named error per violation and a non-zero exit | A skip-with-warning parser shrinks the denominator unseen | swe-02, deepseek-02 (N-deepseek-02-1) |
| C14 | R19 spec-folder rule | "The bound spec folder" | Matched with a `specs/` path pattern. `detectSpecFolder` is not reused | Its regex matches only `.opencode/specs/` paths, which do not exist in this repository | `compact-inject.ts:181-190`. swe-02 |
| C15 | R19 arm stop | Fewer than half the points fit 25,000 tokens, or kept tokens above 3 times stock | `arm not built: fit_throws>=50% OR offline_reduction_upper_bound<0.25`, plus the kept-token bound | Both halves are local and printable. 0.25 is the vendored `minReduction` default | grok-01. npm `core/compact.ts:75`, `docs/compact.md:30` |
| C16 | R19 live form | A live hook form needs a p95 inside the budget | Only the `precompute` trigger is considered, and only after question 18 is answered and a latency exists | `precompute` installs nothing and keeps its result for the next compaction | `claude-code.d.ts:7278-7285`. deepseek-02 (N-deepseek-02-2) |
| C17 | R19 size | 200 to 300 LOC | About 690 to 730 LOC plus fixtures (lineage estimate) | The estimator port and the parser dominate | swe-02's function table |
| C18 | R2 first slice | Rows pre-labeled from native records, then three arms | A Pi census first: `goal-verify-nudge` counts per session, verdict and reason category, no text. Then the three arms | Pi is where the recorded use is. The census also replaces mimo-03's store-only tripwire | Counted today. N-mimo-03-1 modified |
| C19 | R2 Jev arm gate | Recorded OpenCode or Pi verifier use, and two redaction unit cases | All three hold: the tail-window arm leaves false `not_met` it cannot fix. The redaction unit cases pass in three modules, with fixtures under 48 characters. 002 has recorded a latency | The old gate is met for Pi, so it no longer separates anything | Section 5 |
| C20 | R2 stability | Per-row flip rate | Aggregate flip rate, as C1 | Same unanimity defect | deepseek-03 (N-deepseek-03-1) |
| C21 | R2 later forms | Async shadow bounded by the verifier timeout | Adds: a Pi form never awaits inside `turn_end`. Shadow errors are caught inside the shadow call and never reach `:2378-2380`. Confidence bands are pre-registered. `verifier_shadow` prints one line only on disagreement (proposed) | Pi awaits each handler. The plugin's catch turns any throw into `blocked` | deepseek-03, grok-02 (N-grok-02-1), mimo-03 (N-mimo-03-2) |
| C22 | R2 redaction precondition | Two unit cases, `opencode-goal.js:474` and `secret-scrubber.ts:128` | Three modules, adding `goal-core.cjs:374`, with fixture values under 48 characters | goal-core carries a third copy of the assignment rule. The plugin's generic rule redacts a 48-character fixture, which would hide the gap | Expressions run today |
| C23 | R2 size | 120 to 170 LOC | Pi census 80 to 120 LOC (estimate), scorer about 280 and fixture builder about 140 (lineage estimates), plus tests | The tail-window and parity arms and the attribution | swe-03 |
| C24 | R20 labels | About 100 operator labels | The operator adopts a rubric first, then labels about 100 lines under the schema `{id, text_sha12, rubric, rule4_ok, rule5_ok, labeler}` (proposed). The population skips scratch paths. The flip rule is aggregate | Three base rates measure three failure definitions | mimo-02 (N-mimo-02-1), swe-04, deepseek-03 |
| C25 | R20 coverage and placement | Reaches every runtime through `/create:goal` | Covers `/create:goal` authoring only. Native `/goal` strings, direct edits and `/goal-opencode set` bypass it. A line in `create-goal-auto.yaml` waits on sk-doc's owner and on the lint's measured precision | No repository hook sits on the bypass paths | deepseek-03, mimo-02 (N-mimo-02-2 modified) |
| C26 | R19 and R20 arm exit handling | Not written | Inherit R1's exit table by reference when each arm is specified | One table, written once | deepseek-01 (N-deepseek-01-3). Scheduled to doc time by grok-05 |
| C27 | R10 evidence | Question 7 open | Narrative-mined P0 gold is effectively absent | 1 file in 4,915 by the strict phrase, 6 by a broader one. grok-04: 0 usable in 3,271 | Recount today |
| C28 | R3 evidence | Question 21 open | 0 recorded `ambiguousWith` events. No shadow sink file exists in either checkout | R3's value estimate starts from zero events | `shadow-sink.ts:34-37`. Listed today |

### Corrected claims

| # | Where | Claim | Correction | Evidence |
|---|---|---|---|---|
| K1 | swe-01, swe-03, swe-05, deepseek-05 | State reaches `jev` only with `-s -`, so 002's and 003's plans send none | The Python `jev-cli` reads stdin when `-s` is absent, and a TTY on stdin exits 2. `-s -` is optional and harmless | `__init__.py:180-184`, `:351` |
| K2 | deepseek-01 F5 | The npm docs tell users to put the key in the settings file the vendored hook reads | They name the user-level `~/.claude/settings.json`, not the tracked project file. Row 43 stands on BASE's blog evidence | npm `docs/auth.md:53` |
| K3 | swe-02 | The transcript does not record the brief (question 25 no) | It does, as a `SessionStart:compact` `hook_success` attachment. swe-02 checked only the `hook_additional_context` and `async_hook_response` types | 218 of 222 boundaries within 30 records, 210 with the marker (counted today) |
| K4 | mimo-03, mimo-05, swe-03, swe-05 | Recorded verifier use is zero, so R2's arm kill already fires | Zero only in the goal store. Pi records its verdicts as hidden nudges in its own session files, which no lineage read | 1,457 nudges (counted today). Store: 6 records, all Hermes, all `not_evaluated` |
| K5 | mimo-03 | 75 of 610 (12.3%) is the question 23 proxy | Rejected. It measures the native judge's reason text, not verifier evidence | mimo-03 method |
| K6 | swe-05 | R1's stability check is 1 minus stddev over mean at 0.95 | BASE replaced it with a per-row flip rate, and C1 with an aggregate one | BASE R-a |
| K7 | swe-01, deepseek-05 | Decided rows are movable rows only | C2 | C2 |
| K8 | grok-03 | A `none` pick on a gold-in-cluster row is a loss | C5 | C5 |
| K9 | grok-04 | The redaction miss is new | It confirms BASE section 5 item 11 with a fresh run | BASE |
| K10 | deepseek-04 | `harness.cjs:231-260` holds the grader statuses | Drifted to `:231-284` | Section 14 |
| K11 | deepseek-02 | `claude-code.d.ts:7283-7287` holds the `precompute` text | Drifted to `:7278-7285` | Section 14 |
| K12 | mimo-03 | `opencode-goal.js:40` holds the 1,200 limit | Drifted to `:42` | Section 14 |
| K13 | swe-03 (D-f) | 003's REQ-006 citation `benchmark-stability.cjs:22-28` drifted to `:102-108` | It holds: `:22-28` states the formula and the 0.95 threshold. `:102-108` computes it | Section 14 |
| K14 | deepseek-04 | `sk-communication-projection.js:20-43` holds the no-egress policy | Drifted: the fallback sits at `:33-37` and the policy at `:45-49` | Section 14 |
| K15 | BASE section 1, section 5 item 9, R2 | The goal verdicts on record are the native judge's | Incomplete. Pi's heuristic verdicts are recorded in Pi session files | Pi census |
| K16 | BASE counts | 208 compactions, 755 `goal_status` records, 5 store records | 222 boundaries (210 in main-session files, 12 in subagent files), 758 `goal_status` records (757 before the run started) and 6 store records (5 active, 1 archived). Sessions keep running, so every count drifts upward | Counted today |
| K17 | deepseek-04 | `hvr_scan.py:15-19` names the HVR standard | Drifted: it is named at `:9` and loaded at `:51-53` | Section 14 |

### Handed-over questions and council disagreements

| Item | Status | Evidence | What remains |
|---|---|---|---|
| Question 30, cross-family corroboration | Partly resolved | R1's call and R19's rank were reached independently in wave 1 by two and three non-Claude families from code or counts they opened (A1, A2). R2's clamp path was confirmed after cross-reading from code (G4). R2's gate premise was misjudged by every lineage. The synthesizer is still Claude | An operator read of the three calls |
| Question 22, criteria base rate | Partly resolved, reframed | mimo-02's 44-row sample: 79.5% strict, 45.5% lenient. Against 1.5% by regex and 28% one-lens. The spread is the rubric, not the sample | Question 34, then about 100 labels |
| Question 18, function-hook budget | Unresolved | No production budget is readable. The vendored types, written by Claude Code 2.1.274, say an overrun hook is skipped and core runs, with ten seconds on the test clock. Installed: 2.1.283 | One timed run with a stub hook, or a host reference |
| Question 19, verifier use | Resolved yes for Pi, open for OpenCode | 1,457 nudges in 28 Pi sessions, all between 2026-07-29 and 2026-08-10. The goal store holds no OpenCode or Pi verdict. OpenCode's own session database was not queried | Questions 36 and 38 |
| Question 23, evidence over 1,200 characters | Partly resolved | No evidence length is recorded anywhere. Pi's truncation branch fired 253 times, an upper bound on over-long evidence without blocking language, inferred from the check order at `goal-core.cjs:596-620` | Question 32 |
| Question 25, recorded brief | Resolved yes | 218 of 222 boundaries have a `SessionStart:compact` `hook_success` attachment within 30 records (offset 5 to 28, p50 13). 210 carry the recovered-context marker | Question 35 |
| Question 26, DeepSeek registry loss | Resolved, no verdict change | deepseek-04 compared all ten round-1 DeepSeek iterations with BASE. The residue is five design-level rows, spot-checked here | None |
| Question 28, Pi await | Resolved yes | Pi 0.87.1's `emitBoundary` awaits each handler, and `TurnEndEventResult` is a `BoundaryResult` with optional `entries` and `continue` | None. No Pi Jev form awaits inside `turn_end` |
| Question 7, narrative P0 gold | Resolved no | grok-04: 0 usable rows in 3,271 files. Recount: 1 of 4,915 review iteration files by the strict phrase, 6 by a broader pattern, against R10's bar of 20 | None |
| Question 21, live `ambiguousWith` rate | Resolved at 0 recorded | No `shadow-deltas` file exists in either checkout, in source or in `dist` | A live rate needs the shadow sink enabled |
| Council D2, parking 003 | Resolved differently: 003 is not parked | Pi records verifier use. The zero-call slice stays next and rises to rank 3 | None |
| Council D5, criteria-lint base rate | Partly resolved | The estimates measure three failure definitions (section 5) | Question 34 |
| Question 27, recall spot check (from D1) | Unresolved, design ready | swe-02's print shape: per boundary, one row per must-survive item marked survived, not survived or uncheckable, with names and paths only | The operator's 3-session read after the census |

### Other open questions whose status or evidence changed

| # | Old status | New status | Evidence |
|---|---|---|---|
| 1 | Open | Open, bounded: at most 55 movable rows | 38 wrong skill-firing labeled rows plus 17 wrong holdout rows (section 6) |
| 5 | Open | Partly answered for Pi: 314 blocking-language and 253 truncation-branch verdicts among 1,457 | Pi census. Error rates still need labels |
| 11 | Open | Open, with the vendor's own warning that filtering can invalidate a provider's prompt cache | pi-jev-context `README.md:85`. User reports in the Pi post `:464`, `:743`, `:761` |
| 17 | Open for two modules | Open for three modules, with the fixture trap | C22 |
| 29 | Open | Partly resolved as ill-posed: records after a boundary carry earlier timestamps, so a within-a-minute rule gives opposite answers by detector | mimo-04, lineage-reported |

Everything not listed in this section is unchanged from BASE: the verdicts and records of R3 to R18 (apart from C27 and C28), What Not To Build rows 1 to 42 (apart from rows 8 and 9) and the council rulings on D1, D3 and D4.

---

## 2. Scope, Method and Inputs

**Scope.** RQ1 to RQ7 in the `Research Brief` section of `spec.md` (`spec.md:103-118`). They start from the operator's four ideas in `../context/ideas from michel kerkmeester.md`. The first three carry the note to stay optional behind an env switch and an active Jev key. D5 holds all four to that rule:
- grading AI responses
- active skill-advisor recommendations
- upgrading the goal hook, plugin and extension
- Jev plus a compressor for compaction or other context reduction

**Lineages.** Durations come from the runner's own `completed` events in `research/observability-events.jsonl`, never from lineage timestamps.

| Label | Model and effort | Executor | Lens | Runner duration | Runner events |
|---|---|---|---|---|---|
| `grok` | `grok-4.7-xhigh-fast`, no effort set (Grok 4.7 lists no MAX tier) | cli-cursor, `cursor-agent` | Contrarian and outside patterns, owns `../context/` | 809,384 ms (13.5 min) | `timestamp_anomaly`: 6 of 7 state timestamps after the run window |
| `mimo` | `mimo-v2.6-pro`, high | cli-pi | UX and measurement | 2,298,079 ms (38.3 min) | One `stall_detected` after 300 s of quiet. `lineage_registry_empty`. Its registry uses a non-canonical `findings` key |
| `swe` | `swe-2-max`, no effort set | cli-devin | Code-level slice design | 2,867,537 ms (47.8 min) | None |
| `deepseek` | `deepseek-v4.1-flash`, max | cli-pi | Seams, the key gate and failure paths | 940,904 ms (15.7 min) | One `stall_detected` after 300 s of quiet |

**Run configuration.** `research/deep-research-config.json`: 5 iterations per lineage, stop policy `max-iterations`, `convergenceMode` off with an empty `divergent` block and concurrency 4. The four lineages started within 0.9 s of each other by the runner's clock. All four ran with `workspace-write` and `acceptEdits` (`invocation-metadata.json`). Each wrote five iteration files and a state log whose last record carries `maxIterationsReached`. The runner logged 127 events: 4 `started`, 113 `progress`, 2 `stall_detected`, 1 `timestamp_anomaly`, 4 `completed`, 1 `lineage_registry_empty` and 2 `metadata_refresh_ok`. None is a containment event.

**Angles and waves** (`context/research-angles.md`):
- **W1, independent:** grok-01, grok-02, mimo-01, mimo-02, swe-01, swe-02, deepseek-01 and deepseek-02. Each declares that it read no round-2 sibling file. swe-02 words it as "no swe sibling dependencies this iteration (W1)".
- **W2, cross-read:** grok-03, grok-04, mimo-03, mimo-04, swe-03, swe-04, deepseek-03 and deepseek-04.
- **W3, order and kills:** grok-05, mimo-05, swe-05 and deepseek-05.
- The lineages ran at very different speeds, so W2 views went stale: grok-03 and grok-04 saw only deepseek-01, deepseek-03 and deepseek-04 saw no swe file, while swe-03, swe-04 and the mimo W2 files read the finished grok and deepseek runs. Section 10 names each sibling read.

**What I read.** Every input the brief names: the 20 iteration files, the four lineage `research.md` files, each lineage's strategy, state log, registry, deltas and invocation metadata, the merged `findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json`, the runner events and config, this phase's `spec.md`, `plan.md`, `goal.md` and angles, BASE (section 1, its Changes section, sections 9, 11, 12 and 13 and What Not To Build), the council report, the four round-1 digests and the vendored files the lineages cite.

**What I verified, and how.**
- Every `file:line` a kept recommendation rests on was reopened (section 14).
- Counts were rerun read-only with node scripts that print numbers only:
  - Claude Code transcripts in this project's directory, 1,087 files: compaction boundaries and triggers, `SessionStart:compact` attachments with their offsets, marker presence, lengths and hook durations, PreCompact hook events and `goal_status` records.
  - Pi session files under `~/.pi/agent/sessions`, 5,609 files: `goal-verify-nudge` custom messages by session, verdict, reason category and date. The reason is one of the heuristic's five fixed strings. No evidence or reply text was read.
  - The goal store in the main checkout and in this worktree.
  - The three routing corpus files, the baseline file and the shadow sink paths in both checkouts.
  - 308 `goal.md` files, their criterion lines and scratch paths, plus four rows of mimo-02's sample against its labels.
  - 4,915 review iteration files for rejected-P0 phrases.
  - The three redaction expressions, copied and run with node on constructed fake keys.
  - Exact binomial tails and power for the sign test.
- The installed Pi 0.87.1 package was read for its types and runtime source. The installed Claude Code versions were listed: 2.1.280 to 2.1.283, with `~/.local/bin/claude` pointing at 2.1.283.

**Not run.** No `jev` of either package, not even `--version`. No repository module, test suite, `validate.sh`, `generate-context.js` or install. No git write. No `.env` file was opened: rg listed `.env.example` and it stayed closed. OpenCode's `~/.local/share/opencode/auth.json` was not opened and its `opencode.db` was not queried. No hook was timed. Not reopened: the social-post lines cited only by BASE rows, supercov's `properties.json`, BASE's `goal-core.test.cjs:631-651`, the hook READMEs and deepseek-04's `rewrite/response.md:16-24`.

**Deviations, recorded.**
- **Launch HEAD.** The run's own files record no commit, so the launch HEAD is UNKNOWN from the run. The orchestrator reports `2ac4db9118`, the parent of the fan-out record `1c4fc55a3a`. `git status` was clean when this synthesis started.
- **R3 to R18** are carried from BASE by reference with notes, not re-recorded.
- **Scratch scripts.** Five read-only count scripts were written to this session's scratchpad outside the repository: `q25.cjs`, `q25b.cjs`, `q25c.cjs`, `pi-nudge-keys.cjs` and `pi-nudge-count.cjs`. They print counts only. They are the only writes besides this file, which departs from the letter of "no other write". They can be deleted.
- **One observation** in section 4 comes from the recovered brief injected into this synthesis session, not from any operator transcript.

---

## 3. RQ1: First slices

Each slice is one caller, end to end, with zero Jev calls unless marked. Function names are proposed unless they exist. LOC figures are estimates, and a lineage estimate names its lineage.

### R1 (build-now): the advisor census, then the arm

- **Files.** New: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` (proposed name, from 002) and one vitest file beside it. Read only: the three corpus files, `scorer-eval-baseline.json` and the built `dist` scorer.
- **Env first.** The block at `capture-scorer-eval-baseline.mjs:35-46`, exactly (C6), set before any dynamic `dist` import.
- **Census functions, about 180 LOC:**
  - `loadCorpora()` reads `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and `ambiguity-prompts.jsonl` and asserts 195, 70 and 24 rows. It copies the gold-none filter at `score-outcome-rerank.mjs:40-51`.
  - `clusterFor(row)` runs the scorer once and reads the passing top and its `ambiguousWith` list as `applyAmbiguity` wrote them (`ambiguity.ts:44-58`). It never recomputes margins (row 54).
  - `classifyRows()` marks eligible (a cluster of 2 or more), movable (gold in the cluster but not first), gold-first, gold-outside and gold in the top 3, with the alias-aware match at `capture-scorer-eval-baseline.mjs:70-76`, per file and per 50/50 split (`score-outcome-rerank.mjs:118-121`).
  - `reprintBaseline()` must print holdout top-1 at 53/70. Anything else prints `baseline mismatch: comparison void` and stops the run.
  - `comparators()` scores confidence order inside the cluster, always-second and the outcome-weighted rerank on held-out rows only (`score-outcome-rerank.mjs:123`), each with MRR, right@1 and right@3.
  - `powerLine()` prints the exact binomial minimum wins and the win rate needed for 80% power (C3).
- **Arm functions, about 150 to 350 LOC behind `--jev`:** `gate()` with the identity line and the three checks, `preflight()` with the payload class, planned calls and estimated input tokens, `askJev(row)` with an argument array, no shell, the prompt on stdin, stdin closed and a 90 s cap, `rerunLoop()` for 3 passes with no cache, `modalPick()`, `signTest()`, `flipRate()` (aggregate), `verdict()` and a `calls.jsonl` writer.
- **Test cases:**
  1. The baseline reproduces 53/70 against the pinned file.
  2. A synthetic corpus with one movable win, one gold demotion, one gold-outside row and one `none` lands each in its column.
  3. Zero movable rows prints `no headroom`. One to four prints `underpowered`. Neither runs the arm.
  4. A stub `jev` placed first on PATH logs no call in the default run or in any gate-failure run.
  5. With the stub, exit 3 at check 3 prints the skip line.
  6. With the stub, exit 3 after the gate prints `jev arm stopped: key rejected` (proposed) and marks finished rows `partial`.
  7. With the stub, exit 4 retries once and then marks the row `unmeasured`. Exit 2 stops the arm. A key outside the submitted set marks the row `unmeasured`. A hang marks it `unmeasured_timeout`.
  8. A row with one missing rerun answer never enters the sign test.
- **Keep or kill, pre-registered.** `keep` needs all four: an exact one-sided sign test at 0.05 over decided rows, a win over each comparator on identical rows, no fall in right@3 and an aggregate flip rate of at most 0.10. `kill` means the sign test at 0.05 favors the scorer's order. Anything else prints `inconclusive`. `underpowered` fires below 5 movable rows at the census or below 5 decided rows in the arm.
- **Size.** About 330 to 530 LOC (swe-01 and swe-05, lineage estimates), plus about 50 for R21.

### R19 (build-now): the compaction census

- **Files.** New: `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs` (proposed name and placement, from swe-02), one test file and about six small fixture transcripts. It reads a transcript directory the operator names and writes one report outside it.
- **Functions, from swe-02's table with the round-2 changes:**
  - `parseTranscript()` keeps a closed `KNOWN_TYPES` whitelist and stops with a named error, file and line on an unknown type, a malformed line or a missing field (C13).
  - `findBoundaries()` finds `system` records whose `subtype` is `compact_boundary` and that carry `compactMetadata`.
  - `readRecordedBrief()` finds the `SessionStart:compact` `hook_success` attachment within 30 records after the boundary and records its marker presence and length only (C12).
  - `replayBrief()` runs only where no brief is recorded, behind `--replay`, imports the built merger and stamps `replay_version` (proposed).
  - `toMessages()` feeds ports of `estimateTokens` (`state.ts:31-41`) and `fitState` (`state.ts:198-306`), which print the staged estimate, the stage reached or a counted throw (C11).
  - `offlineReductionUpperBound()` cuts every unpinned tool result to the vendored 300-character head, leaves prose alone and calls no model.
  - Five must-survive rules: (1) identifiers used after the boundary, (2) files written through Write or Edit, (3) the bound spec folder by a `specs/` pattern (C14), (4) the last user instruction as an identifier proxy that prints `uncheckable` when it names none and (5) a preserved-segment sanity check.
  - `report()` prints counts, names and paths only.
- **Test cases.** swe-02's six: a missing written file gives 1 violation, an unknown type exits non-zero with a named error, a malformed line does the same, an empty directory exits 0 with `compactions=0`, a clean session gives 0 violations and an oversized state records `fitError` and continues. Three more: a recorded brief is read and not replayed, a boundary without one takes the replay path with `replay_version` and a grep over the report finds no transcript text.
- **Keep or kill.** The census is void if more than half the sessions stop on an unknown shape or if any transcript text reaches the report. The Jev arm is not built on `fit_throws>=50% OR offline_reduction_upper_bound<0.25` or on kept tokens above 3 times stock.
- **Size.** About 690 to 730 LOC plus fixtures (swe-02, lineage estimate).

### R2 (next): the Pi census, then the three zero-call arms

- **Pi census.** New: `.skilled/hooks/goal/lib/count-pi-goal-nudges.mjs` (proposed). It reads a Pi session directory the operator names and prints, per session, the count of `goal-verify-nudge` custom messages, their verdicts, their reason categories and the first and last date. No text. About 80 to 120 LOC (estimate). Tests: a fixture session with one nudge per reason, an unknown record type that exits non-zero with a named error and a grep that finds no message text in the output.
- **The three arms, from swe-03's design:**
  - `score-verifier-labeled-set.cjs`, about 280 LOC. `runHeuristicArm(row)` drives the shipped plugin through `MkGoalPlugin.__test.writeGoalAtomic` and `maybeVerifyGoal` (`opencode-goal.js:3377`, `:3382`) against a temporary state directory, so no export is added. `runTailWindowArm(row)` judges the raw last 1,200 characters with no marker. `runGoalCoreParityArm(row)` calls `verifyGoalHeuristic` (`goal-core.cjs:1611`). `normalizeVerdict()` keeps `unclear` as its own row and folds it only inside the two-class table. Attribution matches the five reason strings (`opencode-goal.js:2202`, `:2206`, `:2210`, `:2214`, `:2220`).
  - `build-verifier-fixture.cjs`, about 140 LOC. Each row holds the objective, the raw text, its as-ingested form and the raw length. Claude rows are pre-labeled from native `goal_status` records. Pi rows carry the recorded nudge verdict as the heuristic column and need an operator label.
- **Test cases.** A 1,300-character message that ends in a full stop reaches the truncation branch in the as-ingested arm and not in the tail-window arm. A blocking-language row is held by the wrapper rule. An `unclear` row keeps its own report row. Fewer than 30 valid rows prints `stop: fewer than 30 rows`. A stub `jev` logs no call.
- **Keep or kill.** If the better of the heuristic and tail-window arms adds no false `met` and keeps false `not_met` at or below 0.10 (003's REQ-008 boundary), the report names the clamp fix for the plugin and goal-core owners and no Jev arm is built. Fewer than 30 rows ends the phase.
- **Size.** 80 to 120 LOC for the census and about 420 for the arms (swe-03, lineage estimate), plus tests.

### R20 (next): the lexical lint

- **Order.** The operator adopts a rubric first (question 34). mimo-02's two readings, strict referent resolution and lenient unresolvable referents, are the starting candidates.
- **Files, from swe-04's design.** New, beside `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`: `lint-goal-criteria.cjs` (about 200 LOC), `score-goal-lint.cjs` (about 80 LOC), `lint-goal-criteria.test.cjs` (about 90 LOC) and a labels file. `check-goal.cjs` stays read only.
- **Functions.** Imports from `goal-slice.cjs`, a copy of the criterion parser (`check-goal.cjs:135-144`, `:162-201`, `:207-212`, about 60 LOC) with a durable "ported from" comment, `rule4DanglingRefs()`, `rule5ExternalFile()`, a walker that skips `z_archive` and scratch paths and a report. It always exits 0. The scorer joins labels by `text_sha12` and counts stale labels apart.
- **Test cases, seven.** Rule 4 fail, rule 4 pass, rule 5 fail, rule 5 pass, both failing, a goal file with no criteria and a scratch path excluded.
- **Keep or kill.** The phase stops when the labeled violation rate under the adopted rubric is under 5%. A line in `create-goal-auto.yaml` waits on per-rule precision of at least 0.8 (proposed) and on sk-doc's owner.
- **Size.** About 370 LOC with tests (swe-04, lineage estimate).

### R21 (next, conditional): the Gate 3 calibration

It runs inside `score-jev-tiebreak.mjs` only when the census prints `underpowered`, in about 40 to 60 LOC (BASE, swe-01 says about 50). One `noul` per labeled prompt over 3 reruns gives accuracy, F1, Brier score and the aggregate flip rate beside the classifier's 0.9843. Unmeasured rows leave every average. Test: a stub run with one malformed answer excludes that row.

---

## 4. RQ2: Compaction

**Can a Claude Code function hook host a Jev keep-or-drop pass within its real deadline?** Not shown, and no live form is recommended.

- **The route is on.** `.claude/settings.json:38` sets `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` to `"1"`, in a tracked file.
- **The deadline is UNKNOWN in production (question 18).** The vendored type reference was written by Claude Code 2.1.274 (`fast-jev.ts:9-10`), and the installed host is 2.1.283. It says a hook that throws, overruns its budget or answers a wrong shape is skipped while core runs in its place (`claude-code.d.ts:3024-3026`), that the budget is the handler's own grace (`:3799-3818`) and that the test clock lets a held wait go after ten seconds of real time (`:10177-10178`). For a compaction hook, core is the stock summary, so an overrun costs the wait and then falls back (inferred from the type text, not measured).
- **The PreCompact command hook stays out.** It has 3 s (`.claude/settings.json:215-222`, BASE row 5).
- **`precompute` is the only trigger worth a later look.** It is "the one dispatch that installs nothing", and its result is kept for the next compaction if the conversation still leads (`claude-code.d.ts:7278-7285`). It moves a pass off the wait, not off the payload (N-deepseek-02-2, adopted as C16).
- **The vendored procedure's calls.** It sends the fitted history with tool results omitted and asks the keep-result question from the result's character count (`compact.ts:58-69`), in batches that each resend the state (`compact.ts:76-102`). Calls per compaction equal the batch count, UNKNOWN until the census sizes it. Only pinned calls reach the default keep at `compact.ts:284-285`, because a missing candidate answer throws (`compact.ts:131-132`, `request.ts:69-83`), as grok-01 read it.

**What the zero-call census shows first.** Counted today over 1,087 transcript files, numbers only:

| Measure | Value |
|---|---|
| `compact_boundary` records | 222: 210 in main-session files and 12 in subagent files. 220 predate the run |
| Triggers | auto 219, manual 3 |
| `SessionStart:compact` attachments | 933: 920 `hook_success`, 12 `hook_cancelled` and 1 `hook_non_blocking_error` |
| Boundaries with a `hook_success` brief within 30 records | 218 of 222, at offsets 5 to 28, p50 13 |
| Boundaries whose brief carries the recovered-context marker | 210 of 222, of them 201 of the 210 main-session boundaries |
| Recorded brief length | 703 to 4,426 characters, p50 1,906 |
| Brief hook duration | p50 285 ms, p90 498 ms, max 1,576 ms |
| PreCompact hook events recorded | 0 |
| Host wait per compaction | p50 about 104 s (BASE's count). mimo-04: max 280.3 s over 209 main-thread boundaries, lineage-reported |

So the census's first job is still the fit line. BASE found every compaction starting at 450,019 tokens or more. Whether the vendored staged fit can bring that history under 25,000 tokens is what the fit column prints, with zero calls. If it throws on most boundaries, the arm dies before any key is needed.

Two details the census now handles:
- **The spec-folder rule.** `detectSpecFolder` matches only `.opencode/specs/` paths (`compact-inject.ts:181-190`), which do not exist in this repository. The recovered brief injected into this synthesis session named `.opencode/specs/**` as its active spec folder, which fits that regex lifting a glob out of text (observed once). The census matches `specs/` paths instead (C14).
- **The watched-or-unattended split (question 29).** mimo-04 found that records after a boundary carry earlier timestamps, so a within-a-minute rule gives 0 of 209 or 209 of 209 depending on the detector (lineage-reported, row 71). The census prints trigger, sidechain and entrypoint fields and makes no claim about attention.

---

## 5. RQ3: Goal criteria and goal judges

**Three judges read goals here, and none of them checks how a criterion is worded.**

| Judge | What it reads | Recorded use | Evidence |
|---|---|---|---|
| Claude Code's native goal judge | The stored goal string only | 758 `goal_status` records: 62 met, 696 not met, 610 with a reason | `goal-set-string-playbook.md:55-57`. Counted today |
| OpenCode plugin heuristic, `llm` or supervisor mode | The session's last evidence, clamped at 1,200 characters | None in the goal store: 6 records, all Hermes, all `not_evaluated`, all with empty `lastEvidence`. The store sweeps active records after 2 days, so it is no usage log | `opencode-goal.js:42`, `:47`, `:1107`. Counted today |
| goal-core heuristic in Pi | The turn's text, clamped the same way | 1,457 hidden nudges in 28 sessions of this repository, 365 more in other workspaces | `goal-context.ts:221-244`, `goal-core.cjs:290-297`, `:596-620`. Counted today |

**The Pi census.** Reasons among the 1,457 nudges in this repository's Pi session directories, all dated 2026-07-29 to 2026-08-10:

| Heuristic reason | Verdict | Count | Share |
|---|---|---|---|
| No completion signal | `unclear` | 542 | 37.2% |
| Blocking language | `not-met` | 314 | 21.6% |
| Truncated evidence | `unclear` | 253 | 17.4% |
| Evidence too short | `unclear` | 237 | 16.3% |
| Weak link to the objective | `unclear` | 111 | 7.6% |

Pi sends a nudge only on a verdict other than `met`, so the number of `met` turns, and with it every rate, is UNKNOWN. Each nudge is a custom message with `display: false` (`goal-context.ts:233-238`), which Pi 0.87.1 turns into a user message the model sees (`session-manager.d.ts:98-108`). The operator sees nothing, while the model sees a verdict line after every turn that is not `met`. Sent without options, the nudge starts no turn of its own. The extension API's `sendMessage` calls `sendCustomMessage` (`agent-session.js:2396-2398`), which appends a message sent without `triggerTurn` to the session when Pi is idle and queues it into a running loop otherwise (`agent-session.d.ts:455-471`). The truncation branch is where the clamp defect lands: any text over 1,200 characters is clamped with an appended `...` and then fails the truncation test (`goal-core.cjs:290-297`, `:607`). How many of the 253 are clamp artifacts is question 32.

**How a criteria lint should work.** As R20 in section 3: a separate advisory script beside `check-goal.cjs`, lexical first, the rubric before the labels, exit 0 always and `check-goal.cjs` byte-identical. The rule it checks is `sk-create-goal/SKILL.md:121-122`, and `SKILL.md:110` already runs `check-goal.cjs` before handoff. Coverage is `/create:goal` authoring only. Three paths bypass it: the native `/goal` string, a direct edit of `goal.md` and `/goal-opencode set`, which is a state-free router (`goal-opencode.md:15`, `:37`). Claude Code's native judge, the one with the most recorded verdicts, therefore meets only criteria that were authored through `/create:goal` and never edited by hand.

**The walker leak.** `walkGoalFiles` skips only `z_archive` (`check-goal.cjs:417-441`, `:433`). Of the 308 `goal.md` files, 14 sit under scratch paths, including review-lineage fixtures, and hold 24 criterion lines. mimo-02's sample row 38 was one of them. A lint or a base rate drawn through that walker counts fixture debris (row 70).

**The base rate of unverifiable criteria.**

| Reading | Violations | Share | 95% interval (Wilson) | Family | Source |
|---|---|---|---|---|---|
| Strict regex for explicit references | 21 of 1,387 | 1.5% | not given | Claude | Council seat-002 |
| One-lens reading | 7 of 25 | 28% | about 14 to 48% | Claude | Council seat-003 |
| Rule 4 strict, referent resolution | 35 of 44 | 79.5% | 65.5 to 88.8% | MiMo | mimo-02 |
| Rule 5 strict, another document needed | 23 of 44 | 52.3% | 37.9 to 66.2% | MiMo | mimo-02 |
| Lenient, only unresolvable referents | 20 of 44 | 45.5% | 31.7 to 59.9% | MiMo | mimo-02 |

My spot check of mimo-02's rows 2, 3, 12 and 14 agrees with its strict labels on all four. The population differs by method: my anchor parse finds 1,381 criterion lines in 308 files, and mimo-02 counts 1,313 in the completion section only. The five numbers do not estimate one quantity. They measure three failure definitions: lexical reference, referent resolution and delegation to another document. Council D5 therefore closes on a rubric, not on more samples. That is mimo-02's finding, and I agree with it on the evidence above. Under any referential rubric the violation rate sits far above R20's 5% stop line, so the lint's first slice stops there only if the operator adopts the strict-regex reading.

**What a violating criterion costs.** mimo-02 counts 280 of 610 native-judge reasons that mention criterion or checkability wording, against council seat-002's 31 of 576 that blame the criterion as the cause. Both are lineage- or seat-reported, and their gap is the same method gap. No number here shows how many goal turns an unverifiable criterion wastes.

---

## 6. RQ4: R1's power

**How many decided rows can the corpus files yield?** Derived from committed counts, with zero calls:
- `labeled-prompts.jsonl` holds 195 rows: 18 gold-none and 177 skill-firing. The baseline scores 152 of 195 top-1 correct, including 13 correct abstentions on gold-none rows, and 5 gold-none rows fire falsely (`scorer-eval-baseline.json`, captured at `2dbaa8fd66`). So 139 skill-firing rows are right and 38 are wrong.
- `holdout-prompts.jsonl` holds 70 rows: 6 gold-none and 64 skill-firing, with 53 of 70 correct. The baseline gives no abstention split for this file, so 17 wrong rows is the bound.
- A win needs a movable row, a wrong top-1 whose gold sits in the cluster. At most 38 plus 17, so 55 rows, can be won. mimo-01 reached the same bound, and I recomputed it.
- Decided rows can exceed 55. A gold-first row whose modal pick is another key demotes the gold, which is a decided loss (C2). How many eligible gold-first rows exist is UNKNOWN until the census runs.
- The frozen tau 0.03 slice overstates headroom: 5 of its 24 rows are gold-none (20.8%, against 18 of 195 or 9.2% in the corpus). mimo-01 found it and I counted it.

**The exact one-sided sign test at 0.05**, recomputed here:

| Decided rows | Wins needed | Tail probability | True win rate for 80% power |
|---|---|---|---|
| 4 | none reaches 0.05 | 0.0625 at 4 of 4 | none |
| 5 | 5 | 0.0312 | 0.956 |
| 8 | 7 | 0.0352 | 0.896 |
| 10 | 9 | 0.0107 | 0.917 |
| 13 | 10 | 0.0461 | 0.818 |
| 16 | 12 | 0.0384 | 0.801 |
| 20 | 15 | 0.0207 | 0.799 |
| 24 | 17 | 0.0320 | 0.760 |
| 30 | 20 | 0.0494 | 0.718 |
| 38 | 25 | 0.0365 | 0.706 |
| 55 | 35 | 0.0290 | 0.680 |

Below 5 decided rows no keep is possible, so `underpowered` stays at 5. Between 5 and about 20 decided rows a keep needs Jev to win 8 or 9 of every 10 rows it changes, a high bar for a tie-break among skills the scorer already ranks within 0.05 of each other. mimo-01's table agrees: 0.92 at 10 rows and 0.68 at 55. The census prints this line so the operator knows, before any call, whether `keep` is a realistic outcome. A low power line does not stop the arm, because even an `inconclusive` run yields the first latency record that every live idea waits on.

**Which zero-call comparator must it beat?** All three, on identical rows, as BASE set them:
- confidence order inside the cluster
- always-second, which wins exactly the movable rows whose gold sits second
- the outcome-weighted rerank, on held-out rows only, because it trains its fold on the train half (`score-outcome-rerank.mjs:123`)

Which one is hardest is UNKNOWN until the census prints their metrics. Always-second sets the floor any real judgment has to clear. Because the cluster is a union of two margins, on score or on confidence (`ambiguity.ts:22-36`), a member can sit below a non-member in score order. The census therefore reads membership from the scorer's own output and never re-derives it from scores.

**The counting rules.**
- Decided rows are every row whose modal pick changes the gold's reciprocal rank (C2).
- A row is decided only when all 3 reruns return a submitted key (C4). Three different picks make the row `unstable` and undecided.
- `none` is an abstention, counted apart (C5).
- The flip rate is aggregate over all measured calls (C1).
- The tau 0.03 split is reported, never a veto (BASE D4). 002's REQ-012 still carries the veto and is amended in section 13.

---

## 7. RQ5: The vendored material

The npm `jevctl` 0.2.3 and the other vendored repos are sources of patterns only. D5 pins the Python `jev-cli` 0.6.2, so an adopted pattern is ported to it, never installed from npm.

| Pattern | Where | Verdict here | Used by |
|---|---|---|---|
| A missing answer throws and never becomes a number | claude-jev `question.ts:76-80`, npm `request.ts:69-83` | Adopt | R1 (C4) and every later arm |
| An over-budget request is refused, never cut | pi-jev-context `jev.ts:95-96` | Adopt | Every arm (row 48) |
| A `choice` with an explicit `none` key | npm `route.ts:114`, `:180-192` | Adopt, with `none` as an abstention | R1 |
| Unsure bands: `review` for a null confidence or one below `minConfidence`, `partial` between 0.35 and 0.7, `says_nothing` as unsupported | npm `lib.ts:54-58`, `:63-65`, `:113-115`, `classify.ts:130`, `verify.ts:57-63` | Adopt as pre-registered labels in the later cascade table | R2 (C21) |
| Staged state fitting that throws rather than truncates | npm `state.ts:198-306` | Adopt, ported | R19's fit column |
| The keep-result question asked from the character count, not the body | npm `compact.ts:58-69` | Adopt | R19's arm |
| `worth_it` at a reduction of 0.25 or more | npm `core/compact.ts:75`, `docs/compact.md:30` | Adopt as the printed kill | R19 (C15) |
| The first message and the newest 6 pinned | npm `compact.ts:23`, `state.ts:53-58` | Adopt | R19's arm |
| Falling back to the built-in summary on any error | npm `fast-jev.ts:283-285` | Adopt for any later live form | R19 |
| An estimate line before a paid run | supercov `docs/quality.md:195` | Adopt as tokens, never dollars | Every arm (C9) |
| Off by default | pi-jev-context `README.md:95-98` | Consistent with D5 | Every feature |
| A `noul` near 0.5 means uncertain, not "medium" | claude-jev `skills/jev/SKILL.md:75` | Adopt as a reading rule | Every `noul` arm |
| A missing answer stored as 0 | npm `rerank.ts:77`, `screen.ts:56`, `classify.ts:177-178` | Refuse. npm's own `provider.ts:116-121` says why | Row 9 |
| Ties broken by input order | npm `rerank.ts:81` | Refuse | Row 47 |
| Exit 2 for a tripped `--fail-on` | npm `errors.ts:2-9` | Refuse on the Python package, where exit 2 is a usage error | Row 46 |
| `verify` as a lint | npm `verify.ts:46-47` | Refuse: it throws without evidence | Row 46 |
| A hook on by default that reads a key outside any gate | npm `fast-jev.ts:75`, `:237-253` | Refuse | Rows 6 and 43 |
| Filtering every model request | pi-jev-context `src/index.ts:264-270`, `README.md:85`, `:87` | Refuse | Row 44 |
| An answer cache during reruns | supercov `docs/quality.md:197-199` and the jevcache.sh page | Refuse | Rows 30 and 36 |
| Refusing source paths as secret protection | claude-jev `fs-source-reader.ts:16-33` | Refuse as a redaction fix | Row 49 |
| Dropping a finding live below 0.5 | claude-jev `review.ts:21-28`, `:91-100` | Refuse live. The thresholds may inform a later offline review arm | Row 8 |
| Switching models per prompt | Pi post `:464`, `:743`, `:761`, user reports | Refuse: users report it defeats prompt caching | Open question 11 |

**The two websites.** `external websites/classifier dev.md` holds only `https://classifier.dev/` and `jevcache.md` only `https://jevcache.sh/`. Everything said about either service is a vendor claim carried from BASE rows 36 and 37, not reopened.

**The three posts** are user reports. The Pi thread's done gate (`:1121`) reports meraGPT's Decider 1, whose relation to Jev the line does not state (BASE K2), and it judged a reply, not a stored goal (grok-02). The Hermes thread and the compaction blog add nothing round 2 relies on beyond BASE rows 5 and 43.

**Vendor claims this file uses.** $0.042 per million input tokens (claude-jev `skills/jev/SKILL.md:93`), supercov's estimate-line example (`docs/quality.md:195`) and the 2 to 18% calibration note on the vendored token estimate (`state.ts:25-29`). None was reproduced.

---

## 8. RQ6: What round 1 and the council both missed

1. **Pi's hidden verifier channel.** 1,457 nudges in 28 sessions, each a user message the model reads (section 5). BASE saw the nudge in code but counted verdicts only in Claude transcripts and the goal store. This is not a new Jev seam. It is R2's seam with recorded use, which lifts R2 to rank 3. The note at `goal-context.ts:169-173` says `turn_end` is void-returning and cannot force continuation, while the installed Pi 0.87.1 types `TurnEndEventResult` as a `BoundaryResult` with optional `entries` and `continue` (`types.d.ts:615-618`, `:883`). The note is stale for this runtime (confirmed from the installed types, found by deepseek-03).
2. **The HVR scanner's reader-needed half.** `hvr_scan.py` settles only what a machine can settle without reading for meaning. It lists the categories that need a reader and calls its subtotal "a floor on the deductions" (`hvr_scan.py:13-21`). A `noul` per category over flagged sections is a lens for exactly that half. It becomes R22, later on Q1 (deepseek-04).
3. **The D5 provider mismatch.** Judgments take their provider from `JEV_PROVIDER` (`__init__.py:307`), while `auth status` and `auth test` default to `official` (`:339`, `:420`). With `JEV_PROVIDER` set to another provider, check 3 can pass on the official key while every judgment exits 3. It can also fail on a missing official key while a working key sits idle. `jev auth test` would record the wrong provider's model for 002's REQ-009. No lineage and no doc names `JEV_PROVIDER`. The fix is proposed in C8.
4. **A third redaction copy.** `goal-core.cjs:367-376` redacts evidence with its own copy of the assignment rule at `:374` and no generic rule. It is exported at `:1606`, and rg finds no caller. With `(?<![A-Za-z0-9])` in place of `\b`, the plugin's expression catches both `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=`. The scrubber's also needs `service` in its prefix set (swe-03's diff, rerun here).
5. **The 48-character fixture trap.** The plugin's generic rule redacts high-entropy strings of 48 characters or more (`opencode-goal.js:433-439`, `:473`). A 48-character `TYPESAFE_API_KEY=` assignment was redacted by that rule at entropy 4.532. A 36-character one was not, and neither was a 42-character `SERVICE_TOKEN=` one. A unit case built on the long fixture passes while the gap stays open, and swe-03's proposed fixture is that long.
6. **The scratch leak** in `walkGoalFiles` (section 5).
7. **`detectSpecFolder`** matches a path layout this repository does not use (section 4).
8. **Surfaces checked and dropped.** The four hook families (post-edit-quality, session-lifecycle, directive-lifecycle and permission-policy), `system-deep-loop-guard.js`, `sk-communication-projection.js` (`egressConsent: false` at `:47`), the Hermes repo-guards and `check-rule-copies.js` are deterministic or presentation surfaces (deepseek-04, row 63). The harness plumbing that mimo-04 ranked by use, AskUserQuestion (516 uses), Monitor (273), ToolSearch (233) and SendMessage (108), belongs to the host runtime and has no repository seam (row 64).

Only R22 passes the fitness checklist today, and it fails Q1 until labels exist. Items 3 to 7 are defects to report to their owners, not Jev seams. One more miss explains question 21: the shadow sink's default path is relative to its module (`shadow-sink.ts:34-37`), so once compiled it resolves under `runtime/dist/runtime/data/`, and no `shadow-deltas` file exists there or in the source tree.

---

## 9. RQ7: Order, cost and kill criteria

**Order.** Free numbers first, the first billed call second, labels third and later arms last.
1. 002's census (R1), with 005's census (R19) and 003's Pi census (R2) beside it. Zero calls and zero labels.
2. The redaction fixes, reported to the plugin, scrubber and goal-core owners with unit cases in three modules and fixtures under 48 characters. They land before any egress, not before the censuses.
3. 002's billed arm, only if the census prints neither `no headroom` nor `baseline mismatch`. It produces the first latency record. R21 runs instead only on `underpowered`.
4. The rubric (question 34), then 006's lexical lint and its labels.
5. 003's zero-call arms, which need the operator's adjudication.
6. Later arms, each past its own kill line: R20's arm, R19's arm, R2's arm and last the plugin shadow mode. None starts before 002 has a latency record and the redaction cases pass.

This is BASE's order with mimo-05's three insertions (the rubric before the labels, the power line before the arm, a use check before R2's wait) and one change of mine: the Pi census joins step 1, because it costs nothing and settles R2's value.

**Cost per survivor.** Calls come from the designs above. Operator minutes are mimo-05's arithmetic, lineage-reported. Latency is UNKNOWN for every call until 002's `calls.jsonl` exists.

| Item | Calls | Deadline or cap | What leaves the machine | Operator minutes |
|---|---|---|---|---|
| R1 census | 0 | none | nothing | 5 to 10 |
| R1 arm | at most 723, plus 1 `jev auth test` | 90 s per call (proposed), no deadline | corpus prompts and skill descriptions (low) | included in R1's census row |
| R21 | 585 short calls, only on `underpowered` | as R1 | as R1 | none |
| R19 census | 0 | none | nothing | 17 to 32, the 3-session spot check |
| R19 arm (later) | one per batch, UNKNOWN until the census | none offline. The live budget is UNKNOWN | fitted session history with tool results omitted (highest) | UNKNOWN |
| R2 Pi census | 0 | none | nothing | not priced |
| R2 zero-call arms | 0 | none | nothing | 16 to 40 |
| R2 Jev arm (later) | at most 150, 50 rows times 3 | 30 s plugin budget for any live form | operator conversation (highest) | included in the arms row |
| R20 lint | 0 | none | nothing | 55 to 65, plus 10 for the rubric |
| R20 arm (later) | about 600 | none | committed criteria (low) | none |
| R22 (later) | one per flagged section per category | none | document prose the operator names | about 50 labels |

At the vendor-claimed $0.042 per million input tokens, R1's arm costs cents (BASE's inferred arithmetic on a vendor claim). Money is not the constraint, while operator minutes and egress are. mimo-05 prices the whole program at about 2 to 2.5 hours of operator time, two thirds of it 006's labels (lineage-reported). Of the phases mimo-05 priced, 002 is the only one that returns a number with no operator labor, a second reason to start there. The Pi census added here shares that property.

**Kill lines, one string family.** N-mimo-05-2 is adopted with its R2 line rewritten. Each line prints from its script and is fixed in its phase's spec before the build.

| Phase | Printed line | Effect |
|---|---|---|
| 002 | `baseline mismatch: comparison void` | Stops the run before any call |
| 002 | `no headroom` | No arm, and no R21 |
| 002 | `verdict: underpowered` | No arm. R21 runs when `--jev` is set |
| 002 | `verdict: kill` | Closes R3's served order and the live advisor forms |
| Every arm | `jev arm skipped: <check>`, plus a details line where one applies | Nothing else changes |
| Every arm | `jev arm stopped: key rejected` (proposed) | Finished rows print as `partial` |
| 005 | `unknown record shape: <type> at <file>:<line>` | Stops the census with a non-zero exit |
| 005 | `arm not built: fit_throws>=50% OR offline_reduction_upper_bound<0.25` | Closes R19's arm |
| 003 | `stop: fewer than 30 rows`, `stop: no headroom` or `stop: no reachable rows` | As 003's REQ-001 and REQ-008 |
| 003 | `r2 jev arm not built: tail-window arm leaves no false not_met` (proposed) | Closes R2's arm and the plugin mode |
| 006 | `r20 jev arm not built: labeled_violation_rate<0.05` | Stops R20 under the adopted rubric |

mimo-05's original R2 line, `no recorded OpenCode or Pi verifier use`, is retired because it is false for Pi today.

---

## 10. Cross-Lineage Agreement

Only wave 1 (iterations 1 and 2) counts as independent. A later agreement counts only when the lineage cites code or counts it opened itself. Agreement inside one lineage never counts, and agreement between BASE and my own reading is a Claude reading, not corroboration.

### Independent (wave 1, counted)

| # | Agreement | Lineages | Grounding | Against BASE |
|---|---|---|---|---|
| A1 | R1 stays build-now, census first, with a keep rule that can fail | mimo-01, swe-01 | mimo-01 from committed counts and its own binomial table. swe-01 from the eval, capture and scorer code | Agrees on the verdict. Each contests one clause (C1, C2) |
| A2 | R19 stays build-now for the census and later for the arm | grok-01, swe-02, deepseek-02 | grok-01 from the vendored compaction code. swe-02 and deepseek-02 from transcript records they counted | Agrees |
| A3 | R19's fit column is the vendored staged estimate, not host `preTokens` against 25,000 | grok-01, swe-02 | Both opened `state.ts` | Extends (C11) |
| A4 | R20 starts as a zero-call lexical lint, separate from `check-goal.cjs` | grok-02, mimo-02 | grok-02 from `verify.ts` and the goal rules. mimo-02 from `check-goal.cjs` and its own sample | Agrees. mimo-02 wants build-now (disagreement 5) |

### After cross-reading, grounded in code or counts the lineage opened (counted)

| # | Agreement | Lineages | Grounding |
|---|---|---|---|
| G1 | The fit column (A3) | deepseek-05 joins grok-01 and swe-02 | Opened `state.ts:191-214`, `:225`, `:305` and `compact.ts:19-27` itself and withdrew its deepseek-02 column |
| G2 | Question 21 reads 0 recorded events | grok-05 joins mimo-01 | grok-05 listed the advisor data directory itself |
| G3 | The Python version literal is `jev 0.6.2` | grok-03 joins deepseek-01 | Reopened `__init__.py:327` |
| G4 | The clamp defeats `met` for long evidence in both runtimes | swe-03, deepseek-03 | Each opened the plugin and goal-core clamp chains |
| G5 | Both local assignment regexes miss `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` | grok-04, swe-03 | Each ran the expressions. Confirms BASE |
| G6 | R20 is a separate script that never changes `check-goal.cjs` exit codes | swe-04, deepseek-03 | Each opened `check-goal.cjs` |
| G7 | R2's Jev arm stays later | mimo-03, swe-03, deepseek-03 | Each opened code or the store. Their shared premise of zero recorded use fails for Pi (K4) |
| G8 | If one phase ships, it is 002's census | mimo-05 joins grok-05 | mimo-05 grounds it on its own mimo-01 counts |

### After cross-reading, citing a sibling only (not counted)

| # | Agreement | Lineage | Source |
|---|---|---|---|
| S1 | Decided rows are movable rows only, and `-s -` is missing | deepseek-05 | swe-01. Both claims are rejected here (K1, K7) |
| S2 | The dependency order | swe-05 | deepseek-05, adopted "wholesale" |
| S3 | N-deepseek-01-3 is doc-time work | deepseek-05 | grok-05 |
| S4 | 002's census is the first PR-sized slice | swe-05 | grok-05. swe-01 had designed the census independently |

### Found by one lineage, and what verification showed

| Finding | Lineage | Verification |
|---|---|---|
| The npm `jevctl` prints a bare `0.2.3` for `--version`, so check 2 refuses it | deepseek-01 | Confirmed: npm `cli.ts:89`, `package.json` |
| `auth status` prints the store path whether or not the key came from the environment | deepseek-01 | Confirmed: `__init__.py:419-421` |
| Pi awaits async `turn_end` handlers | deepseek-03 | Confirmed in the installed runtime |
| Any other verifier throw reaches the catch that returns `blocked` | deepseek-03 | Confirmed: `opencode-goal.js:2378-2380` |
| The HVR scanner's reader-needed half | deepseek-04 | Confirmed: `hvr_scan.py:13-21` |
| The DeepSeek round-1 residue is five design-level rows | deepseek-04 | Spot-checked: `goal-core.cjs:59`, `capture-scorer-eval-baseline.mjs:122`, `harness.cjs:231-284` |
| A missing answer becomes 0 in npm `rerank` | grok-03 | Confirmed: `rerank.ts:77`, `:81` |
| claude-jev's path rule does not catch assignments inside a file | grok-04 | Confirmed: `fs-source-reader.ts:16-33` |
| `verify` cannot serve as a lint | grok-02 | Confirmed: `verify.ts:46-47` |
| The per-row flip rule is a unanimity test | mimo-01 | Confirmed by arithmetic |
| The frozen slice holds 5 gold-none rows of 24 | mimo-01 | Confirmed by count |
| The criteria base rate splits by rubric | mimo-02 | Spot-checked 4 rows, all agree |
| Records after a boundary carry earlier timestamps | mimo-04 | Not rerun, lineage-reported |
| Harness plumbing surfaces rank high by use | mimo-04 | Not rerun. Dropped on the missing seam either way |
| The operator's labor per phase | mimo-05 | Arithmetic on counts, lineage-reported |
| `check-goal.cjs` is safe to `require` but exports no criterion text | swe-04 | Confirmed: `:681-689`, `:691-699` |
| `walkGoalFiles` leaks scratch fixtures | swe-04 | Confirmed: `:433`, with 14 files counted |
| 003's docs omit the tail-window arm and the `verifier_shadow` field | swe-03 | Confirmed against 003 `spec.md` |
| Two failure modes print no line: a spawn that never exits and replay version skew | swe-05 | Confirmed against 002's REQ-009 and REQ-010 and swe-02's design |

### Disagreements

1. **Question 25.** swe-02 said the transcript does not record the brief. deepseek-02 said it does, as the `SessionStart:compact` injection. The corpus count settles it for deepseek-02 at 218 of 222 boundaries. swe-02 checked two attachment types in two files.
2. **The decided universe.** swe-01, and deepseek-05 from swe-01 only, would decide on movable rows. This file counts every row whose gold rank changes. The stronger argument is what a served pick does: it acts on gold-first rows too, so a test that cannot lose there can pass a harmful pick (C2).
3. **`none` on a gold-in-cluster row.** grok-03 calls it a loss, and 002's REQ-010 calls it an abstention. The served form keeps the fused order on `none`, so the gold's rank does not change and the row is not decided. It prints apart, so a later served form that honored `none` by showing nothing would see its cost (C5).
4. **The fit column.** deepseek-02 kept BASE's column, while grok-01 and swe-02 replaced it. deepseek-05 conceded after opening the code. Resolved.
5. **R20's tier.** mimo-02 says build-now. grok-02, deepseek-03, deepseek-05, swe-04 and BASE say next. The rubric is unchosen and the labels cost an hour of operator time, so next holds.
6. **The skip lines.** swe-04 splits `skipped:` from `refused:`, and BASE keeps one form. One form holds, with a second line for the found version and path, because one string is easier to grep and to quote as a kill line.
7. **Verifier use.** mimo-03, mimo-05, swe-03 and swe-05 say zero. The Pi census says 1,457. The count wins, and the lineages' zero stays right for the goal store alone (K4).
8. **`-s -`.** swe-01 says 002's plan sends no state. The Python code reads stdin by default (K1).
9. **Redaction timing.** grok-05 puts the redaction cases first, before the censuses. deepseek-05 and swe-05 put them before any egress, which the censuses never cause. The latter holds, since the censuses send nothing.
10. **R21's trigger.** mimo-01 and mimo-03 would widen it to "power cannot reach 0.80". grok-03 and BASE keep `underpowered`. A power trigger needs a plausible win rate nobody can pre-register, so the countable trigger holds and the census prints the power line instead (row 68).

### Cross-family corroboration of the Claude baseline (open question 30)

- **R1's keep rule.** Three lineages reached it from code or counts they opened. swe-01 (W1) wrote the rule as functions over the real eval and capture code. mimo-01 (W1) derived the movable bound and the power table from committed counts. grok-03 (W2) checked it against vendored ranking code. Contested with evidence: mimo-01's unanimity finding (arithmetic, adopted as C1), swe-01's movable-only universe (rejected, C2), grok-03's missing-answer clause (adopted, C4) and its `none`-as-loss clause (modified, C5). The rule's shape is corroborated independently by two non-Claude families, and three of its clauses changed.
- **R19's rank.** Reached independently in wave 1 by grok-01, swe-02 and deepseek-02, each from code or transcript records it opened, and later by mimo-04 from its own counts. Nobody contested the rank. The fit and brief columns were contested and then settled by code and count (A3, disagreement 1). Corroborated independently by three families.
- **R2's reshaping.** swe-03 and deepseek-03 confirmed the clamp path from code, both after cross-reading, so it is grounded but not independent. grok-02 (W1) kept R2's zero-call slice at next from the heuristic's reply-side checks. The gate premise, recorded OpenCode or Pi use, was judged by mimo-03 and swe-03 against the goal store only, where both counted zero, and it fails for Pi. The reshaping's core is corroborated from code, and its gate was misjudged by every family, BASE included.

Question 30 is therefore partly resolved. This synthesis itself stays single-family.

---

## 11. Recommendations

Ranked by value to the operator against cost, latency, privacy and risk, smallest measurable slice first. The Python `jev-cli` 0.6.2 is the package for every item. Switch names, file names and printed lines marked "proposed" do not exist yet.

| Rank | ID | Recommendation | Verdict | Jev type | Phase |
|---|---|---|---|---|---|
| 1 | R1 | Offline advisor tie-break arm, census first | build-now | `choice` | 002 |
| 2 | R19 | Compaction recall census, then an offline Jev deletion arm (R11 folded in) | build-now for the census, later for the arm | `noul`, batched with `run` | 005 |
| 3 | R2 | Goal verifier: Pi census and zero-call arms, then an opt-in shadow | next for the zero-call slice, later for the Jev arm and mode | `choice` | 003 |
| 4 | R20 | Goal-criteria lint | next | `noul` | 006 |
| 5 | R21 | Gate 3 calibration arm | next, only when R1's census prints `underpowered` | `noul` | 002 |
| 6 | R3 | Advisor suggested order inside the cluster | later | `choice` | not phased |
| 7 | R4 | Completion-claim offline audit | later | `noul` | not phased |
| 8 | R5 | Reviewer verdict classification fallback | later | `choice` | not phased |
| 9 | R6 | Reply-harness blinded judge | later | `score` | not phased |
| 10 | R7 | D4 hallucination grader kind | later | `noul` or `score` | not phased |
| 11 | R8 | Stop second-rater replay, Jev arm | later | `score` | not phased |
| 12 | R9 | Confirm-mode stop suggestion | later | none at use time | not phased |
| 13 | R10 | Severity replay, P0 reread order and a validity funnel log | later | `choice`, `score` or `noul` | not phased |
| 14 | R12 | Compiled-routing clarify suggested default | later | `choice` | not phased |
| 15 | R13 | Alignment below-50 suggestion | later | `choice` | not phased |
| 16 | R15 | Fan-out shadow pair record | later | `noul` | not phased |
| 17 | R16 | Injection screen on fetched text | later | `noul` | not phased |
| 18 | R17 | PR-claims advisory report | later | `noul` | not phased |
| 19 | R18 | Debug `next_check` choice | later | `choice` | not phased |
| 20 | R22 | HVR reader-needed lens (new) | later | `noul` | not phased |
| none | R11 | Compaction brief selection pass | folded into R19 | `noul` or `run` | 005, as R19's brief column |
| none | R14 | Next-focus shadow comparator | drop (What Not To Build row 41) | `choice` | none |

### The shared gate contract

Every Jev arm below follows this contract. Only the switch differs.
- **Switch.** Each arm has its own, and no global switch exists (row 42). Without the switch a script never spawns `jev`, which a stub `jev` placed first on PATH proves by logging nothing.
- **Identity line (proposed).** With the switch set, one line before check 1 prints the resolved binary path and the provider the arm will use, `JEV_PROVIDER` or `official`.
- **The three D5 checks, in order, once per run, or once per session for a live form:**
  1. `command -v jev`. Failing prints `jev arm skipped: jev not on PATH`.
  2. `jev --version` prints `jev 0.6.2` (`__init__.py:327`). Failing prints `jev arm skipped: version`, then one details line with the version line found and the binary's path. The npm `jevctl` prints a bare `0.2.3` and fails here.
  3. `jev auth status` exits 0, given the arm's provider as `--provider` once the operator approves C8. Failing prints `jev arm skipped: no credential`.
- **Each gate failure** leaves the zero-call output byte-identical, and the script exits 0.
- **After the gate.** Exit 3 from `jev auth test` or any judgment prints `jev arm stopped: key rejected` (proposed) and marks finished rows `partial`. Exit 4 gets one backoff retry, then the row is `unmeasured`. Exit 1, unparseable stdout or a key outside the submitted set marks the row `unmeasured`. Exit 2 stops the arm, because the script built a bad command. A spawn past its cap is `unmeasured_timeout`. Exit 130 stops the arm as `interrupted`. No path writes a default score or a default verdict.
- **Payload notice.** Before the first billed call the arm prints its payload class, planned calls and estimated input tokens, never a dollar figure.
- **No secret.** No arm reads, logs or passes a key. `jev` resolves its own from its store or the provider's environment variable.

### R1. Offline advisor tie-break arm, census first

| Field | Record |
|---|---|
| **Verdict** | **build-now, unchanged, rank 1.** The census needs no key, no label and no operator labor, and it tells the operator with a number whether any Jev arm here can earn a keep. |
| **What Jev judges** | A `choice` in the Python `jev-cli` 0.6.2 over the passing top skill, its `ambiguousWith` members and an explicit `none` key, each option described by the skill's projection `description`. The state is the prompt text on stdin. Each call records the pick, the pick probability and the `none` probability. |
| **Seam** | `ambiguity.ts:22-36` and `:44-58`, the cluster with margins at `:7-8` and no size cap. Eval template: `score-outcome-rerank.mjs:40-51`, `:85-93`, `:118-121`, `:123`, `:149-150`. Gold matching: `capture-scorer-eval-baseline.mjs:70-76`. Env: `:35-46`. |
| **Value** | Which skill goes first on a near-tie, decided with a number instead of the fused order alone. `keep` is the evidence R3 needs. `kill` closes the served advisor forms of the operator's second idea. The power line prices that question before any call. |
| **Metric, baseline and harness** | H1, the advisor scorer-eval baseline ratchet, and H2, the outcome-weighted rerank eval (MRR and right@3). Gap rows: "Jev latency and cost per call", "Jev judgment accuracy against gold" and "Judgment stability". Baselines: holdout top-1 53/70, ambiguity slice 18/24 and full corpus 152/195 (`scorer-eval-baseline.json`, captured at `2dbaa8fd66`). H2's MRR is UNKNOWN because that eval has never been run, and the census's baseline column produces it. Design: census columns and comparators with zero calls, then 3 reruns per eligible row on identical rows, modal picks and the four-outcome rule. |
| **Cost, latency and privacy** | Census: 0 calls. Arm: at most 723 calls, 241 rows times 3, plus 1 `jev auth test`, each capped at 90 s (proposed). No deadline applies, because a person runs it. Payload: corpus prompts and projection descriptions, both authored in this repository (low). Prompt provenance was not checked. |
| **Opt-in, key gate and no-key behavior** | Switch: `--jev` (proposed) on the new script. The default run never spawns `jev`. With `--jev` the shared gate runs once at arm start: check 1 failing prints `jev arm skipped: jev not on PATH`, check 2 failing prints `jev arm skipped: version` plus the details line and check 3 failing prints `jev arm skipped: no credential`, each with the census byte-identical. Exit 3 after the gate stops the arm with finished rows `partial`. Exit 4 retries once. A malformed answer marks the row `unmeasured`. With the gate failing nothing in the repository behaves differently from today, because no existing file changes. |
| **Smallest slice** | The census alone: `score-jev-tiebreak.mjs` (proposed) with the census functions and test cases 1 to 4 of section 3, about 180 LOC. To undo this: delete the script, its test and its report directory. |
| **Keep or kill rule** | `keep` needs all four: an exact one-sided sign test at 0.05 over decided rows, a win over each comparator, no fall in right@3 and an aggregate flip rate of at most 0.10. `kill` means the sign test at 0.05 favors the scorer. Otherwise `inconclusive`. `underpowered` below 5 movable or decided rows. Only `kill` closes R3's served order. |
| **Fitness checklist** | Passes all 15. Q2: the proof plan can now fail, because the unanimity flaw and the missing-answer hole are closed. Q4: a separate file, because the eval runs on import (`score-outcome-rerank.mjs:159`) and its flip rule decides its own flag. Q8: it never writes the corpus or `scorer-eval-baseline.json`. Q12: it spawns the installed Python `jev-cli` and adds no package. Q15: the no-key run is the edge case. |
| **Confidence** | Confirmed from code or counts: the cluster rule, the env, the split, the metrics, the alias match, the baselines, the corpus counts, the movable bound, the power table, the stdin default and the provider defaults. Inferred: that movable rows exist inside the bound, that a `choice` beats the comparators and the per-call latency. The census and the arm confirm or refute each. |
| **Lineage agreement** | Two, independent (A1: mimo-01 and swe-01), plus grok-03 (W2, grounded) and deepseek-05 (W3). Against BASE: agrees on the verdict and changes the clauses in C1 to C10. |
| **Citation check** | Resolved (section 14, groups A and B). One lineage claim failed: swe-01's missing `-s -`. |

### R19. Compaction recall census, then an offline Jev deletion arm (R11 folded in)

| Field | Record |
|---|---|
| **Verdict** | **build-now for the zero-call census, later for the Jev arm. Unchanged, rank 2.** It is the operator's fourth idea at the seam where the measured cost sits, and the census can close that idea with a number and no key. |
| **What Jev judges** | Nothing in the census. The later arm asks two `noul` questions per unpinned tool call, keep the call and keep its result verbatim, batched through `jev run` on the Python `jev-cli` 0.6.2 as a port of the npm `jevctl` 0.2.3 vendored procedure (keep threshold 0.5 and the newest 6 messages pinned, `compact.ts:20-27`). |
| **Seam** | Host compaction as local transcripts record it: `system` records with `subtype` `compact_boundary` and `compactMetadata`, then the `SessionStart:compact` `hook_success` brief. The brief's builder: `compact-inject.ts:284`, `:343-350`, `:511`. The function-hook route: `.claude/settings.json:38` and the vendored `claude-code.d.ts:3024-3026`, `:3799-3818`, `:7278-7285`. The vendored procedure: `state.ts:198-306`, `compact.ts:58-69`, `:76-102`. |
| **Value** | 222 boundaries in this project's transcripts, 219 of them automatic, each a wait the operator's turn absorbs (p50 about 104 s, BASE and mimo-04). The census answers two questions with numbers: whether a deletion pass can fit these sessions at all, and what the stock summary and the recorded brief each keep. |
| **Metric, baseline and harness** | No harness exists. The use-case map lists compaction keep-or-drop as "None today", and the gap row is "Compaction recovery quality". The census is the smallest harness. Per boundary: trigger, pre and post tokens, host duration, the staged fit estimate with its stage or a counted throw, the offline reduction upper bound, recorded-brief presence and length, stock-summary recall and brief recall under five must-survive rules, plus an `uncheckable` count. Baselines: stock `postTokens` and stock-summary recall, both produced by the census. Spot check: the operator reads the rule-derived items for 3 sessions (question 27). |
| **Cost, latency and privacy** | Census: 0 calls. Nothing leaves the machine. It reads a transcript directory the operator names and prints counts, names and paths, never transcript text. The later arm sends the fitted session history once per batch, with tool results omitted but abridged prose and truncated tool inputs included. That is the highest payload class here. Its calls per compaction are UNKNOWN until the census counts batches. |
| **Opt-in, key gate and no-key behavior** | The census needs no key and never spawns `jev`. The later arm's switch is its own `--jev` (proposed) on the census script. The shared gate runs once at arm start, with R1's three skip lines, R1's exit handling and the same stop line (C26). With the gate failing, the census output is byte-identical and the host's compaction is untouched, exactly as today. The vendored npm hook is never installed (rows 6 and 43). A later live form, if ever built, uses only `precompute`, falls back to the stock summary on any error (`fast-jev.ts:283-285`) and needs question 18 answered first. |
| **Smallest slice** | The census over 10 to 20 sessions the operator names: `score-compaction-recall.mjs` (proposed) with the functions and tests of section 3, about 690 to 730 LOC plus fixtures (swe-02). To undo this: delete the script directory and its report. |
| **Keep or kill rule** | The census is void on an unknown shape in more than half the sessions or on any transcript text in the report. The arm is not built on `fit_throws>=50% OR offline_reduction_upper_bound<0.25` or on kept tokens above 3 times stock. A later arm keeps only with p50 at most 30 s, recall no lower than stock, kept tokens at most 3 times stock and a fallback rate of at most 20% (BASE). |
| **Fitness checklist** | Q1 fails until the census runs, acceptable because the census is the slice. Q8: it reads an undocumented host format, so the parser is a closed whitelist that fails loudly. Q9 and Q11 fail for the arm until the redaction cases pass in three modules, a notice exists and the operator accepts the payload. Q12: the arm is a Python `jev-cli` port with no npm dependency. Q14: function hooks are early access. The rest pass. |
| **Confidence** | Confirmed: the boundary and brief counts, the staged fit mechanics, the pinned-call default, the type texts and the enabled flag. Inferred: that the fit throws on most boundaries at these sizes. Also inferred: that brief and summary recall differ enough to matter. The census confirms or refutes both. |
| **Lineage agreement** | Three, independent (A2: grok-01, swe-02 and deepseek-02), plus mimo-04 (W2, its own counts). The fit column is A3 and G1. The brief column was disputed (disagreement 1) and settled by count. Against BASE: agrees on rank and verdict and changes the columns in C11 to C17. |
| **Citation check** | Resolved (section 14, groups C and D). One drift: `claude-code.d.ts:7283-7287` sits at `:7278-7285`. |

### R2. Goal verifier: Pi census and zero-call arms, then an opt-in shadow

| Field | Record |
|---|---|
| **Verdict** | **next for the zero-call slice, later for the Jev arm and the plugin shadow mode. Rank 3, up from 4.** Pi records its heuristic verdicts, so the slice now measures a channel in real use, and a free clamp fix may remove about a sixth of the recorded nudges before any Jev call. |
| **What Jev judges** | Nothing in the zero-call slice. The later arm is a `choice` in the Python `jev-cli` 0.6.2 over `met`, `not_met` and `blocked` (`opencode-goal.js:179`), with pre-registered confidence bands. The state is the objective and the evidence, scrubbed. |
| **Seam** | Pi: `goal-context.ts:221-244`, the nudge at `:233-238`. goal-core: the clamp at `goal-core.cjs:290-297`, the heuristic at `:596-620`. OpenCode: the clamp at `opencode-goal.js:382-389` and `:1107`, the heuristic at `:2197-2230`, the runner at `:2354-2366`, the `blocked` catch at `:2378-2380`, the mode set at `:134` and its silent fallback at `:226-229`. Pi's context rule: `session-manager.d.ts:98-108`. |
| **Value** | "Is this goal done" in OpenCode's autonomous mode, and the hidden verdict line Pi hands the model after every turn that is not `met`. 1,457 such lines reached the model in 28 sessions, 253 of them from the truncation branch the clamp feeds. A false `not_met` costs a continuation turn in OpenCode and a steering message in Pi. A false `met` stops a goal early. |
| **Metric, baseline and harness** | H12, the goal hook verifier tests, plus the gap row "Goal verifier accuracy". H12 has unit tests and no labeled set (BASE cites `goal-core.test.cjs:631-651`, not reopened here). First baseline: the Pi census, 1,457 verdicts other than `met` by reason, with the `met` count UNKNOWN. Then 30 to 50 rows with three zero-call arms on identical rows: the heuristic as shipped on the as-ingested form, the tail-window arm and goal-core parity. Stop rule: the better zero-call arm adds no false `met` and keeps false `not_met` at or below 0.10. |
| **Cost, latency and privacy** | The slice makes 0 calls. A later offline arm makes at most 150. A later live shadow makes one call per verification inside the plugin's 30 s budget (`opencode-goal.js:49`), latency UNKNOWN until 002 measures one. The payload is the operator's own conversation, the most sensitive class after R19's arm. |
| **Opt-in, key gate and no-key behavior** | The slice needs no key and never spawns `jev`. Later offline arm: its own `--jev` (proposed), the shared gate once per run and R1's lines and exit handling. Later plugin mode: a new value of the existing switch, `OPENCODE_GOAL_VERIFIER=jev` (proposed), with the gate once per session. Today an unknown value falls back to `heuristic` silently (`:226-229`), so the build must print one enablement line naming any failed check and then behave exactly as `heuristic`. Exit 3 disables the shadow for the session with one line. Exit 4, a timeout or a malformed answer skips that one shadow record. Every shadow error is caught inside the shadow call and never reaches the catch that returns `blocked`. A Pi form never awaits inside `turn_end`. With the gate failing, every verdict equals today's. |
| **Smallest slice** | The Pi census: `count-pi-goal-nudges.mjs` (proposed), 80 to 120 LOC with its three tests. Then the scorer and fixture builder, about 420 LOC. To undo this: delete the scripts and the fixture. The plugin stays untouched. |
| **Keep or kill rule** | The phase stops at `stop: fewer than 30 rows`. If the tail-window arm meets the stop rule, the clamp fix goes to the owners and no Jev arm is built. A later Jev arm keeps only under 003's REQ-006 (a) to (c) plus an aggregate flip rate of at most 0.10, and any added false `met` fails it. |
| **Fitness checklist** | Q1 fails until the rows exist, acceptable because the rows are the slice. Q7 for Pi: Pi awaits its handlers, so any Pi form is detached or offline. Q8: the clamp fix belongs to the plugin and goal-core owners, and the mode set is a frozen surface with one in-module consumer (`:249`) plus its docs (`goal-plugin.md:64-74`, `:101-103`). Q9: the later arm waits on the redaction cases in three modules. Q11: the heuristic keeps authority, and the wrapper rule keeps blocking language away from Jev. Q14: 003 is a Planned phase, amended rather than replaced. |
| **Confidence** | Confirmed: the nudge counts and reasons, Pi's context rule, Pi's await, the clamp in both runtimes, the silent fallback and the store contents. Inferred: that most of the 253 truncation-branch verdicts are clamp artifacts (question 32) and that Pi goals still run (question 38). The `met` denominator is UNKNOWN. |
| **Lineage agreement** | Disputed on its premise. grok-02 (W1) kept it next. swe-03 and deepseek-03 confirmed the clamp from code after cross-reading (G4). mimo-03 and swe-03 counted zero use in the store (G7, K4). The rise to rank 3 is my judgment on my own count, a Claude reading. Against BASE: contests the gate's premise and extends the slice (C18 to C23). |
| **Citation check** | Resolved (section 14, group E). One drift: mimo-03's `opencode-goal.js:40` sits at `:42`. |

### R20. Goal-criteria lint

| Field | Record |
|---|---|
| **Verdict** | **next, rank 4, down from 3.** The first slice costs zero calls, but its first number waits on a rubric the operator has not chosen and on about an hour of labels. |
| **What Jev judges** | Nothing in the lint. The later arm asks two `noul` questions per criterion in the Python `jev-cli` 0.6.2: can it be checked from its own text, and does it name one observable result. Never the npm `jevctl` `verify` (row 46). |
| **Seam** | `check-goal.cjs:44-49`, four structural checks and none for rules 4 and 5. The parser at `:135-144`, `:162-201`, `:207-212`, the walker at `:417-441` and the exit codes at `:659-675`. The rules at `sk-create-goal/SKILL.md:121-122` and the handoff rule at `:110`. The workflow at `create-goal-auto.yaml:209-229`. |
| **Value** | A criterion the judge cannot check leaves completion open. The native judge reads only the stored string (`goal-set-string-playbook.md:55-57`), so a criterion that points elsewhere cannot be checked there. The lint reaches every goal authored through `/create:goal`. |
| **Metric, baseline and harness** | No harness and no gap row cover it. The labels are the smallest harness: about 100 criterion lines, stratified and labeled under the adopted rubric. Metric: per-rule precision and recall of the lexical lint against the labels. Baseline: the lint itself, with the method-dominated base rates of section 5 as context. |
| **Cost, latency and privacy** | The lint makes 0 calls. The later arm makes about 600: 100 criteria, 2 questions, 3 reruns. Committed repository text only (low). |
| **Opt-in, key gate and no-key behavior** | The lint needs no key, always exits 0 and never touches `check-goal.cjs`, whose output stays byte-identical. The later arm's switch is its own `--jev` (proposed), after the shared gate once per run, with R1's skip lines and exit handling by reference (C26). With the gate failing, the lexical findings print with the skip line and nothing else changes. |
| **Smallest slice** | The rubric, then `lint-goal-criteria.cjs`, `score-goal-lint.cjs`, the test file and the labels (section 3), about 370 LOC. To undo this: delete the scripts, the test and the labels. `check-goal.cjs` is never edited. |
| **Keep or kill rule** | Stop when the labeled violation rate under the adopted rubric is under 5%. The workflow line waits on per-rule precision of at least 0.8 (proposed). A later arm keeps only with an F1 gain of at least 0.2 over the lint, precision of at least 0.8 and an aggregate flip rate of at most 0.10. |
| **Fitness checklist** | Q1 fails until the labels exist, acceptable because the labels are the slice. Q3: the lexical lint is the build-nothing competitor. Q8: a line in `create-goal-auto.yaml` is sk-doc's to accept, and deepseek-05 lists that asset's callers as `.skilled/commands/create/goal.md` and a naming fixture (lineage-reported). The rest pass. |
| **Confidence** | Confirmed: the missing checks, the parser, the exit contract, the walker leak and the coverage limits. The base rate is not one fact: it depends on the rubric. |
| **Lineage agreement** | Two, independent (A4: grok-02 and mimo-02), plus swe-04 and deepseek-03 grounded (G6). mimo-02 would rank it build-now (disagreement 5). Against BASE: agrees on the tier, drops one rank and changes labels and coverage (C24, C25). |
| **Citation check** | Resolved (section 14, group F). |

### R21. Gate 3 calibration arm (conditional, inside 002)

| Field | Record |
|---|---|
| **Verdict** | **next, conditional, unchanged, rank 5.** It runs only when R1's census prints `underpowered`, so 002 still returns a latency and calibration number. |
| **What Jev judges** | One `noul` per labeled prompt in the Python `jev-cli` 0.6.2: does this request require writing a file (proposed wording). |
| **Seam** | The Gate 3 labels in `labeled-prompts.jsonl`, 127 `yes` and 68 `no` (counted today). The classifier's archived F1 is 0.9843 (H3). |
| **Value** | A Jev latency p50 and p95, a flip rate and a calibration, even when the advisor leaves no headroom. |
| **Metric, baseline and harness** | H3, the routing corpus gate with the Gate 3 classifier F1. Accuracy, F1, Brier score and the aggregate flip rate over 3 reruns, beside 0.9843. A calibration, not a race (row 21 stands). |
| **Cost, latency and privacy** | 585 short calls. The payload is R1's class. |
| **Opt-in, key gate and no-key behavior** | No new switch: it runs under R1's `--jev` and R1's gate, with R1's skip lines and exit handling. With the gate failing it prints R1's skip line and nothing else changes. |
| **Smallest slice** | About 40 to 60 LOC inside `score-jev-tiebreak.mjs`. To undo this: remove the branch. |
| **Keep or kill rule** | None of its own. It reports numbers, and a missing answer never enters them. It is not built at all unless the census prints `underpowered`. |
| **Fitness checklist** | All pass. Scope creep in 002 is bounded by the trigger. |
| **Confidence** | Confirmed: the label counts. Inferred: that latency on short routing prompts says much about longer payloads. |
| **Lineage agreement** | grok-03 (W2) keeps it unchanged. mimo-01 would widen the trigger (disagreement 10, row 68). Against BASE: agrees. |
| **Citation check** | Resolved. |

### R22. HVR reader-needed lens (new)

| Field | Record |
|---|---|
| **Verdict** | **later, new, rank 20.** The scanner documents this seam itself, but no labels exist and no decision changes until precision is known. |
| **What Jev judges** | One `noul` per reader-needed category per flagged section, asked offline in the Python `jev-cli` 0.6.2 over a document the operator names, for the categories the Human Voice Rules standard defines, such as synonym cycling, significance inflation and false ranges. |
| **Seam** | `hvr_scan.py:17-21`, the categories that "need a reader" and the subtotal as a floor, and `:26`, the `--json` output. |
| **Value** | Candidate passages for the half of the standard the scanner cannot settle, so an author knows what to reread before a doc ships. |
| **Metric, baseline and harness** | No harness and no gap row. Smallest harness: about 50 labeled passages with positives and negatives per category. Metric: per-category precision and recall. Baseline: the scanner's floor, which measures none of these categories. |
| **Cost, latency and privacy** | One call per flagged section per category, offline, no deadline. Document prose leaves the machine: low for committed docs, higher for drafts. |
| **Opt-in, key gate and no-key behavior** | Its own `--jev` (proposed) on a new sibling script. `hvr_scan.py` is never edited, so its output stays byte-identical. The shared gate runs once per run, with R1's skip lines and exit handling. With the gate failing, the sibling script prints its skip line and nothing else. |
| **Smallest slice** | The labels with zero calls, then the sibling script, about 80 to 140 LOC (deepseek-04's estimate). To undo this: delete the script and the labels. |
| **Keep or kill rule** | Proposed: keep with precision of at least 0.8 on at least two categories. Kill below 0.6 on every category. |
| **Fitness checklist** | Fails Q1 until labels exist, which is why it is later. The rest pass. |
| **Confidence** | Confirmed: the scanner's stated gap. UNKNOWN: whether Jev agrees with a human reader on these categories, which the labeled set would show. |
| **Lineage agreement** | One: deepseek-04 (W2), grounded in the scanner it opened. New against BASE. N-deepseek-04-1 maps here. |
| **Citation check** | Resolved, with one lineage drift: deepseek-04's `hvr_scan.py:15-19` names the standard, which sits at `:9` (K17). |

**Promote when.** About 50 labeled passages exist and an author names the decision the candidate list would change.

### R3 to R18, carried from BASE

Their records stand in BASE section 11. Round 2 changes only the notes below.

| ID | Recommendation | Verdict | Round-2 note | Promote when |
|---|---|---|---|---|
| R3 | Advisor suggested order inside the cluster | later | 0 recorded `ambiguousWith` events, so its value estimate starts from zero (C28) | R1 prints `keep` and its measured p95, spawn included, fits the advisor's remaining budget |
| R4 | Completion-claim offline audit | later | None | R2's rows exist with the claims column, the regex cannot cut false fires without new misses and a reader is named |
| R5 | Reviewer verdict classification fallback | later | None | A reviewer run on cases without recorded output shows verdict-line misses |
| R6 | Reply-harness blinded judge | later | None | A human-scored subset of about 20 masked replies exists |
| R7 | D4 hallucination grader kind | later | The grader's parse statuses (`harness.cjs:231-284`) are a vocabulary any Jev grader can reuse (deepseek-04) | A labeled D4 set exists and the silent `mock` fallback is fixed |
| R8 | Stop second-rater replay, Jev arm | later | None | The local replay shows the heuristic stops later than the derived gold where a stop can move. A five-lineage read confirms the gold |
| R9 | Confirm-mode stop suggestion | later | None | R8 yields a signal with precision of at least 0.9 |
| R10 | Severity replay, P0 reread order and a validity funnel log | later | Question 7 answered no: the narrative gold does not exist (C27) | A gold of at least 20 labeled P0 negatives exists by another route |
| R12 | Compiled-routing clarify suggested default | later | None | A clarify gold of 30 or more rows exists |
| R13 | Alignment below-50 suggestion | later | None | Enough archived below-50 saves with their final folder exist |
| R15 | Fan-out shadow pair record | later | None | A labeled pair set with cross-body pairs exists and a reader is named |
| R16 | Injection screen on fetched text | later | None | A hook that handles fetched web content exists |
| R17 | PR-claims advisory report | later | Never through npm `verify` (grok-02, row 46) | A Python `jev-cli` port and a labeled PR-claims corpus exist and sk-git's owner asks for it |
| R18 | Debug `next_check` choice | later | None | A debug workflow caller line and a reader of the logged choice are named |
| R11 | Compaction brief selection pass | folded into R19 | The brief column now reads the recorded brief (C12) | Not separately promotable |
| R14 | Next-focus shadow comparator | drop, row 41 | None | Only if a runtime caller of `compareNextFocusShadow` exists and a focus gold is named |

### Lineage ideas and where they went

The lineages named 25 new ideas. swe named none and put its designs into existing records.

| N id | Idea | Disposition | Where |
|---|---|---|---|
| N-grok-01-1 | R19's fit column as the staged estimate with its stage and throws | Adopted | R19, C11 |
| N-grok-01-2 | R19's arm as two `noul` questions per unpinned call through `jev run`, the result question asked from its character count | Adopted into the later arm | R19 |
| N-grok-02-1 | R2's cascade copies the unsure bands and refuses a missing-answer 0 | Adopted | R2, C21 |
| N-grok-02-2 | Never shell npm `jevctl verify` for R20 or R2 | Adopted as a drop | Row 46 |
| N-grok-03-1 | Rows with a missing rerun answer leave the sign test | Adopted | R1, C4 |
| N-grok-04-1 | The credential-name class matches after a word-character prefix | Adopted as an owner report, never inside a Jev phase | Section 8 item 4, row 65 |
| N-grok-04-2 | A planned-call line with tokens, and a refusal instead of a cut prompt | Adopted | R1, C9. Row 48 |
| N-grok-05-1 | If one phase ships, ship 002's census | Adopted | Section 13 |
| N-mimo-01-1 | Repair the flip clause before the arm runs | Adopted | R1, C1 |
| N-mimo-01-2 | Widen R21's trigger to a power threshold | Rejected | Row 68 |
| N-mimo-02-1 | A rubric before any base rate is quoted | Adopted | R20, C24 |
| N-mimo-02-2 | The lint's placement and defaults in `/create:goal` | Modified: the workflow line waits on the owner and on measured precision | R20, C25 |
| N-mimo-03-1 | A recorded-use tripwire over the goal store | Modified: the Pi census replaces a store-only count, which would read 0 forever for Pi | R2, C18 |
| N-mimo-03-2 | `verifier_shadow` printed as one line, only on disagreement | Adopted as proposed spec text for the later shadow | R2, C21 |
| N-mimo-04-1 | ToolSearch re-rank arm | Dropped | Row 64 |
| N-mimo-04-2 | AskUserQuestion question-quality lint | Dropped | Row 64 |
| N-mimo-05-1 | The measurement-first order with the operator's day priced | Adopted, with the Pi census added | Section 9 |
| N-mimo-05-2 | One kill-line string family | Adopted, with its R2 line rewritten | Section 9 |
| N-deepseek-01-1 | One gate identity line | Adopted as path and provider (proposed) | R1, C8 |
| N-deepseek-01-2 | A key-origin line | Rejected | Row 67 |
| N-deepseek-01-3 | One exit table for the R19 and R20 arms, by reference to R1's | Adopted at arm time | C26 |
| N-deepseek-02-1 | The census parser names its record shapes and fails loudly | Adopted | R19, C13 |
| N-deepseek-02-2 | `precompute` as the only live dispatch | Adopted | R19, C16 |
| N-deepseek-03-1 | The flip repair for every 3-rerun keep rule | Adopted | R2 (C20), R20 (C24) |
| N-deepseek-04-1 | The HVR reader-needed lens | New recommendation | R22 |

---

## What Not To Build

This is the workflow's eliminated-alternatives section. Rows 1 to 43 stand as BASE wrote them, except the three changed rows listed after the table. Rows 44 to 72 consolidate every idea the four lineages dropped or ruled out, plus the lineage ideas this synthesis drops against their lineage's own verdict (rows 64, 67 and 68). Rows 45, 50, 57, 59 and 71 are dead-end approaches, and the rest are dropped ideas. Totals: 64 drop rows and 8 dead ends.

| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |
|---|---|---|---|---|---|
| 44 | pi-jev-context's per-request context filter, or any per-turn Pi history pruning, as R19's arm | When enabled it awaits a Jev scan before every model request, its README warns that filtering can invalidate the provider's prompt cache and saved pruning keeps applying after an API error. It sends history every turn. Its off-by-default setting is right, but the seam is per request, not a compaction boundary | Q7, Q9, open question 11 | pi-jev-context `src/index.ts:264-270`, `README.md:85`, `:87`, `:95-98` | grok-01 |
| 45 | Dead end: R19's fit column as host `preTokens` against the 25,000-token `maxStateTokens` | Two different objects. The ceiling applies to the fitted placeholder state after staged shrinking, which can throw | Q2, a proof plan built on the wrong measure | `state.ts:198-306`, `:304-306`, `compact.ts:24` | grok-01 and swe-02, independent. deepseek-02 held it and deepseek-05 withdrew it |
| 46 | Shelling any npm `jevctl` subcommand, `verify` above all, as R20's lint or R2's arm | D5 pins the Python `jev-cli`. `verify` throws without evidence, and a criterion line has none. npm exit 2 is a tripped `--fail-on`, which the Python exit table reads as a usage error | Q12, Q14 | npm `verify.ts:46-47`, `errors.ts:2-9` | grok-02 (N-grok-02-2), grok-05 |
| 47 | npm `rerank`, one `noul` per key and then an argmax, as R1's modal pick | A missing answer becomes 0 and ties follow input order, so a transport failure can fake a win. A `choice` with a `none` key avoids both | Q11, red flag "a default that papers over a missing value" | npm `rerank.ts:77`, `:81` | grok-03 |
| 48 | Sending a clamped or cut prompt to Jev | A cut state changes the question. The plugin's clamp appends `...`. The vendored pi-jev-context refuses an over-budget request instead. A row over the bound is skipped and counted | Q11, red flag "a default that papers over a missing value" | `opencode-goal.js:388`, pi-jev-context `jev.ts:95-96` | grok-04 (N-grok-04-2) |
| 49 | claude-jev's source-path refuse rule as the fix for the redaction miss | It refuses paths by pattern and never sees an assignment inside file content | Q9 | claude-jev `fs-source-reader.ts:16-33` | grok-04 |
| 50 | Dead end: narrative-mined rejected-P0 rows as R10's gold | 0 usable rows in 3,271 iteration files under grok-04's phrase walk. The recount finds the strict phrase in 1 of 4,915 review iteration files and a broader pattern in 6, against R10's bar of 20 | Q1 | Counts by grok-04 and today | grok-04, this synthesis |
| 51 | Parking R19's census until its Jev arm is eligible | The census is the build-nothing test and can close the operator's fourth idea with zero calls | Q3 | `council-report.md:310`, seat-001's dissent | grok-05 |
| 52 | A dollar figure in any cost or planned-call line | Every price here is a vendor claim or an illustration, never reproduced | Red flag "a cost asserted without measurement" | claude-jev `skills/jev/SKILL.md:93`, supercov `docs/quality.md:195` | grok-01, grok-04, grok-05, mimo-05 |
| 53 | Importing, exporting from or refactoring `score-outcome-rerank.mjs` for R1 | It exports nothing and runs on import. Its flip rule decides its own flag. Copying about 35 lines keeps that eval's meaning | Q4, Q8 | `score-outcome-rerank.mjs:149-150`, `:159` | swe-01, swe-04 |
| 54 | Census cluster membership from recomputed margins, `includeAllCandidates: true` or the frozen slice file | Each measures a different cluster than the live rule. The slice file stores ids and a top-two raw margin, not candidate lists | Q2 | `ambiguity.ts:22-36`, `derive-ambiguity-slice.mjs:77-86` | swe-01, mimo-01 |
| 55 | R19 estimator shortcuts: a metadata-only census, a tokenizer dependency or `thinking` blocks counted as message text | Recall needs the message records. A tokenizer adds a dependency to answer a feasibility question the vendored estimator already answers with a documented bias. The vendored message type has no thinking field | Q6, Q12 | `state.ts:25-29`, `:31-41` | swe-02 |
| 56 | A skip-with-warning transcript parser | A silent skip shrinks the denominator unseen. The parser keeps a closed whitelist and stops with a named error | Q2, red flag "a default that papers over a missing value" | BASE R19 proof plan step 1 | swe-02, deepseek-02 (N-deepseek-02-1), independent |
| 57 | Dead end: R19's brief from PreCompact hook records, or from replay alone | No PreCompact hook event is recorded. PreCompact stdout is not injected. The brief is recorded as the `SessionStart:compact` `hook_success` attachment at 218 of 222 boundaries | Q2 | `compact-inject.ts:8`. Counts today | deepseek-02 dropped the PreCompact read. swe-02's replay-only design is refuted by the count |
| 58 | Injecting `options.supervisorVerifier` to measure the plugin heuristic | The heuristic is not exported, so an injected verifier replaces it instead of wrapping it. The scorer drives `maybeVerifyGoal` through `__test` in a temporary state directory | Q2 | `opencode-goal.js:250`, `:2360`, `:3377`, `:3382` | swe-03 |
| 59 | Dead end: the goal store as R2's evidence source or as proof that no verifier runs | 6 records in the main checkout, all Hermes, all `not_evaluated`, all with empty `lastEvidence`, swept after 2 days. Pi never writes its verdicts there | Q1 | `opencode-goal.js:47`. Store count and Pi census today | swe-03, mimo-03 |
| 60 | Collapsing goal-core's `unclear` into `not_met` in R2's report | `unclear` is the verdict on 1,143 of the 1,457 Pi nudges, so it keeps its own row and folds only inside the two-class table | Q2 | `goal-context.ts:233-238`. Pi census today | swe-03 |
| 61 | R20's lint inside `check-goal.cjs`, as a `CHECKS` entry or through new exports | `check-goal.cjs` is a completion gate with frozen exit codes. A separate script copies its parser and leaves its surface and tests untouched | Q8 | `check-goal.cjs:44-49`, `:659-675`, `:681-689` | deepseek-03, swe-04, both grounded |
| 62 | Expecting R20's lint to reach native `/goal` strings, direct edits or `/goal-opencode set` | No repository hook sits on those paths | Q8 | `goal-set-string-playbook.md:55-57`, `goal-opencode.md:15`, `:37` | deepseek-03 |
| 63 | Jev in the projection, permission, guard or checker surfaces, or in `/rewrite:response` and `/prompt:improve` | Each is deterministic or presentation-bound. The projection keeps a byte-fidelity contract with `egressConsent: false`, permission-policy fails closed, the deep-loop guard decides on repository facts, the checkers check file facts, `/rewrite:response` uses no external provider and `/prompt:improve` has no labels | Q8, Q9, Q11 | `sk-communication-projection.js:33-37`, `:45-49`. The hook READMEs and `rewrite/response.md:16-24` are lineage-reported | deepseek-04 |
| 64 | Harness plumbing surfaces as Jev seams: a ToolSearch re-rank arm, an AskUserQuestion question-quality lint or arms on Monitor and SendMessage | Each surface belongs to the host runtime and has no repository seam at `file:line`, so no opt-in field can be stated. ToolSearch's gold, the tool the agent then invoked, comes from the returned set and so measures agreement with the agent's own pick (my judgment). The operator already judges every AskUserQuestion | Q1, Q8, red flag "delegation that costs more than the work" | mimo-04's usage counts, lineage-reported | mimo-04 rated N-mimo-04-1 and N-mimo-04-2 later. Dropped here |
| 65 | Fixing the redaction regexes inside a Jev build phase | The fix belongs to the goal plugin, the scrubber and goal-core. Every no-key path needs it too. Tying it to a research schedule would delay a security fix | Q8, red flag "work outside the frozen scope" | `opencode-goal.js:474`, `secret-scrubber.ts:128`, `goal-core.cjs:374` | swe-05, grok-05 |
| 66 | Merging the R1 and R19 censuses into one script | Different owners and different inputs. Each must delete cleanly on its own | Q6, red flag "DRY this up across two call sites" | swe-05's phase table | swe-05 |
| 67 | Reporting the key's origin, by parsing `auth status` output or by testing the key variable | The status line prints the store path either way. Testing the variable puts a key name in the script, which 002's REQ-003 forbids with a grep. The provider fix in C8 covers the case that matters | Q6, Q9 | `__init__.py:419-421`, 002 `spec.md:113` | deepseek-01 dropped the parse and proposed the variable test (N-deepseek-01-2) |
| 68 | Widening R21's trigger from `underpowered` to "power cannot reach 0.80" | It needs a plausible win rate nobody can pre-register, so the trigger could not be counted before the arm. The census prints the power line instead | Q2, Q5 | Section 6 | mimo-01 (N-mimo-01-2), mimo-03 |
| 69 | Awaiting a Jev call inside Pi's `turn_end` handler | Pi's `emitBoundary` awaits each handler, so a network call would hold every turn | Q7 | The installed Pi 0.87.1 runtime, `types.d.ts:883` | deepseek-03 |
| 70 | Counting scratch-tree fixture goals in R20's population | `walkGoalFiles` skips only `z_archive`. 14 goal files with 24 criterion lines sit under scratch paths, including a test fixture whose whole criterion is one word | Q1 | `check-goal.cjs:433`. Counted today | swe-04, mimo-02 (its sample row 38) |
| 71 | Dead end: splitting host compactions into watched and unattended by a within-a-minute rule | Records after a boundary carry earlier timestamps, so the rule reads 0 of 209 or 209 of 209 depending on the detector | Q2 | mimo-04, lineage-reported | mimo-04 |
| 72 | An R2 Jev arm whose only evidence is the stored goal string | It duplicates R20's question and sends the goal off the machine for no new fact | Q3, Q9 | `goal-set-string-playbook.md:55-57` | grok-02 |

**Baseline rows round 2 changes.**
- **Row 8** gains claude-jev's thresholds and verdict mapping (`review.ts:21-28`, `:91-100`) and its throw on a missing answer (`question.ts:76-80`). The drop stands (grok-02).
- **Row 9** gains npm `rerank.ts:77` and `classify.ts:177-178`, with the direction of each default: `screen`'s 0 lands on the pass side of the injection gate, while `classify`'s 0 silently drops a label (grok-02, grok-03).
- **Row 43** gains the npm `jevctl` docs, which name the user-level `~/.claude/settings.json` (`docs/auth.md:53`), not the tracked project file (K2). The drop still covers the tracked file only. A key in the user-level `env` reaches the environment, which the Python `jev-cli` reads first (`__init__.py:90-92`), so D5's check 3 passes on it by design.

**Restated without change.** Lineages restated rows 5 and 6 (grok-01), 7 and 32 (grok-02), 12 (deepseek-04), 27 (swe-05) and 30 and 36 (grok-03, grok-04) with no new evidence that moves them.

---

## Divergence Map

**No divergent pivots happened in round 2.** The run set `convergenceMode` off with an empty `divergent` block and a max-iterations stop. Every iteration took its assigned angle. The merged registry's `metrics.iterationsCompleted` of 15, against 20 iteration files on disk, is a merge artifact, not evidence.

**Saturated directions.**
- Zero-call slices first: every lineage's order starts with a census.
- No live Jev call inside a hook or any deadline-bearing path: no lineage proposed one.
- A missing answer never becomes a number: grok-02, grok-03, deepseek-05 and swe-05 each reach it.
- The redaction miss: confirmed three times (BASE, grok-04 and swe-03), now extended to a third copy.

**Contested ideas.** The ten disagreements in section 10. Council disagreement D2 is resolved differently here and D5 partly.

**Failures.**
- The shared premise of zero recorded verifier use (K4).
- swe-02's unrecorded brief (K3), swe-01's missing `-s -` (K1) and deepseek-01's reading of the npm auth doc (K2).
- mimo-03's 12.3% proxy (K5) and swe-05's return to the stability coefficient (K6).
- Five drifted lines (K10 to K12, K14 and K17).
- The merge: 74 key findings kept from 112 delta records, 15 of 20 iterations counted and 32 of 74 resource-map references flagged missing, most of them paths with a trailing line list that exist on disk (section 15).

**Remaining frontier.**
- The numbers the censuses exist to produce: movable and decided rows, compaction fit and recall and the clamp's share of Pi verdicts.
- The function-hook budget (question 18) and OpenCode's own goal history (question 36).
- Whether Pi goals still run (question 38).
- The rubric (question 34) and the labels it unlocks.
- Gold nobody has built, carried from BASE: a D4 set, a human-scored reply subset, a clarify gold and now HVR category labels.

---

## 12. Open Questions

Questions 1 to 30 carry forward from BASE with their new status. Questions 31 to 38 are new.

| # | Question | Status | What would resolve it |
|---|---|---|---|
| 1 | How many rows across the labeled corpus and the holdout file are movable? | Open, bounded at 55 (section 6) | R1's census |
| 2 | Does a Python `jev-cli` `choice` beat the scorer's order and each zero-call comparator on those rows? | Open | R1's arm |
| 3 | What are the per-call latency p50 and p95 of the Python `jev-cli` here? | Open | R1's `calls.jsonl`, or R21's run |
| 4 | How far does an R1 loss reach? | Open | A `kill` from R1, then R2's Jev arm as a second closed-set measurement |
| 5 | What are the goal heuristic's error rates, and how many false `not_met` come from the blocking pattern and from the clamp? | Partly answered for Pi: 314 blocking-language and 253 truncation-branch verdicts among 1,457. Rates need labels | R2's zero-call arms with the clamp-error count |
| 6 | Do live reviewer outputs miss the verdict line often enough for a classifier to matter? | Open | One reviewer run on cases without `reviewer_output` |
| 7 | Do iteration narratives hold rejected-P0 downgrades usable as severity gold? | Answered no (C27) | None |
| 8 | Does the derived stop gold match the iteration prose? | Open | MiMo's five-lineage manual read (BASE) |
| 9 | What is the completion sentinel's real false-fire rate? | Open | Its advisory log in the main checkout, plus labeled excerpts |
| 10 | How often do clarify outcomes happen in real use? | Open | A count of real clarify events, then a 30-row gold |
| 11 | Would a Jev pass break a provider prompt cache? | Open. pi-jev-context's README warns that filtering can, and users report it for per-prompt model switching | A cache-hit comparison, only if a Pi pruning pass is ever proposed (row 44 drops it) |
| 12 | What is the H2 rerank baseline today? | Open | R1's baseline column |
| 13 | Can provider and model be recorded per call from the Python `jev-cli` output? | Open. `jev auth test` reports the `official` provider's model unless given `--provider` (C8) | Reading one judgment's JSON at build time |
| 14 | Is any routing corpus prompt private? | Open | The corpus authoring history |
| 15 | Do git preflight (S12) and executor demotion (S21) have any Jev fit? | Answered in BASE: no fit (row 39) | None |
| 16 | How many rows have the gold in the top 3 but not first? | Open | R1's census, top-3 column |
| 17 | Do the redaction rules, in their real modules, catch `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=`? | Open, now for three modules: the plugin, the scrubber and goal-core. Copies of all three fail today | One unit case per module with fixture values under 48 characters (C22) |
| 18 | Does Claude Code bound a `session.compact` function hook's run time in production, and at what? | Unresolved | One timed run with a stub hook on 2.1.283, or a host reference |
| 19 | Does the operator run OpenCode or Pi goals with a verifier? | Resolved yes for Pi (1,457 nudges). Open for OpenCode | Question 36 |
| 20 | Should R1 veto on the tau 0.03 slice? | Answered in BASE: report the split, no veto | None |
| 21 | How often does the live advisor set `ambiguousWith`? | Resolved at 0 recorded. No shadow sink file exists | Enabling the shadow sink, if R1 keeps |
| 22 | What share of goal criteria cannot be checked from their own text? | Partly resolved, reframed as a rubric question (section 5) | Question 34, then about 100 labels |
| 23 | How often does live OpenCode or Pi evidence exceed 1,200 characters? | Partly resolved. No length is recorded. At most 253 of Pi's non-`met` verdicts can come from over-long evidence without blocking language | Question 32 |
| 24 | Can a Jev deletion pass fit these sessions at all? | Open | R19's census fit column |
| 25 | Does the transcript record the brief the PreCompact hook prepared? | Resolved yes, at 218 of 222 boundaries | None |
| 26 | Did the DeepSeek registry loss drop a finding that would change a verdict? | Resolved: no verdict change | None |
| 27 | Does rule-derived must-survive recall agree with an operator's reading? | Unresolved, design ready | The operator's 3-session read after R19's census |
| 28 | Does Pi await async `turn_end` handlers? | Resolved yes | None |
| 29 | Does the operator watch host compaction waits? | Partly resolved: ill-posed on this record format. mimo-04 finds `entrypoint` `cli` and `userType` `external` on all 209 boundaries it counted (lineage-reported) | Operator answer |
| 30 | Would a model family other than Claude reach the same calls on R1, R19 and R2? | Partly resolved (section 10) | An operator read of the three calls |
| 31 | Should D5's check 3 pass the provider the arm will use? | New, open | The operator's approval of C8, because D5 names the check verbatim |
| 32 | How many of Pi's 253 truncation-branch verdicts are clamp artifacts, and how many genuinely trail off? | New, open | A zero-call pass over the Pi session files that prints, per nudge, the length of the turn text behind it, lengths only |
| 33 | What do the hidden nudges cost in context, and do they change what the model does next? | New, open. They start no turn of their own (section 5) | A character count of nudges per session, then an operator read of a few turns that follow one |
| 34 | Which rubric does the operator adopt for rules 4 and 5? | New, open | An operator decision among mimo-02's readings, before any label |
| 35 | Are the 12 boundaries without a recovered-context brief the 12 cancelled `SessionStart:compact` hooks? | New, open | Pairing each unbriefed boundary with its attachment status, counts only |
| 36 | Does OpenCode's own session history show the goal verifier running? | New, open | A read-only count over OpenCode's session database, which this synthesis did not query |
| 37 | Will the plugin and goal-core owners take the clamp fix? | New, open | An owner decision. R2's tail-window arm shows the effect first |
| 38 | Does the operator still run Pi goals? All 1,457 nudges fall between 2026-07-29 and 2026-08-10 | New, open | Operator answer, or the Pi census rerun later |

---

## 13. Proposed Build Phases

Four build phases, within the cap of six, all under `specs/cli-jev/003-cli-jev-workflow-integration/`. 002 and 003 are Planned children under an approved plan, so each change below is an amendment the operator approves before their docs change. Both were last changed at `021437ceda`, before BASE. `004-deep-research-expansion` is this research phase, not a build phase. New build phases number from 005. No separate measurement-only phase is needed, because each phase's first slice is its own zero-call measurement.

### 002-advisor-jev-tiebreak-arm (Planned, amended)

| Field | Record |
|---|---|
| **Scope** | Measure, offline and by hand, whether a Python `jev-cli` `choice` over the near-tie cluster beats the scorer's order and three zero-call comparators, under a keep rule that can fail and a power line printed first |
| **Recommendations** | R1. R21 only when the census prints `underpowered` |
| **First slice** | The census: alias-aware counts over both corpus files, the baseline column at 53/70, the comparators and the power line, with zero calls |
| **Likely files** | New: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` (proposed name) and its vitest file. Read only: the three corpus files, `scorer-eval-baseline.json` and the built `dist` scorer |
| **Switch and key gate** | `--jev` (proposed). The shared gate once at arm start (section 11). Without the flag, or with the gate failing, the census prints byte-identical and no `jev` is spawned |
| **Dependency** | The advisor `dist` is built first. None on other phases |
| **Rough size** | About 330 to 530 LOC, of which about 180 are the census (lineage estimates), plus about 50 for R21 |
| **Kill criterion** | `baseline mismatch: comparison void` voids the run. `verdict: kill` closes R3's served order and the live advisor forms. `no headroom` and `underpowered` close nothing |
| **Observable check** | With no key: per-file counts, 53/70, the comparator metrics and the power line, while a stub `jev` logs no call. With a key: wins, losses, ties, abstentions and unmeasured rows, the exact p, the aggregate flip rate, p50 and p95 and one verdict line. `git status` shows only the new script, its test and its reports |

**Proposed amendments to the Planned docs:**
- **REQ-002:** the check-2 line becomes `jev arm skipped: version` plus a details line with the version found and the path, replacing `jev arm refused: expected jev 0.6.2`. Add the identity line. Pass the arm's provider to `auth status`, `auth test` and every judgment, pending the operator's D5 approval (C8).
- **REQ-004:** the census covers every skill-firing row of both files, 177 plus 64, not only the labeled file's held-out half. It is alias-aware, with eligible, movable, gold-first, gold-outside and top-3 columns and the power line (C3).
- **REQ-005 and `plan.md:63`:** the env is `capture-scorer-eval-baseline.mjs:35-46` exactly (C6). REQ-005's list omits `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `PYTHONDONTWRITEBYTECODE=1`, `VITEST=true` and the lane deletes. `plan.md:63` omits `PYTHONDONTWRITEBYTECODE=1` and `VITEST=true`.
- **REQ-007:** the four-outcome rule over decided rows, with movable wins and gold demotions printed apart (C2) and the rerank comparator on held-out rows only.
- **REQ-008:** an aggregate flip rate of at most 0.10 replaces the stability coefficient (C1).
- **REQ-009:** each call also records the pick probability, the `none` probability and a `unmeasured_timeout` status. Provider and model come from `jev auth test` given the arm's provider (proposed).
- **REQ-010:** a row is decided only when all 3 reruns return a submitted key (C4). Add the 90 s spawn cap (C7), print the `none` count on gold-in-cluster rows (C5) and print `jev arm stopped: key rejected` (proposed) on exit 3 after the gate.
- **REQ-011:** the payload line adds estimated input tokens, and the risk table drops its dollar figure (C9).
- **REQ-012:** report the tau 0.03 split without a veto (BASE D4).
- **Risks and cost:** the ceiling is 723 calls plus 1, not 456. The size is 330 to 530 LOC, not 150 to 200.
- **Kill criterion:** only `kill` closes R3, not any failure to beat the scorer.
- **R21:** added as conditional scope.
- **Unchanged:** the stdin edge case stays, and the plan already sends the prompt on stdin with no `-s`, which the Python client reads by default (K1). One detail for its wording: an inherited TTY makes `jev` exit 2 rather than hang (`__init__.py:180-184`).

### 003-goal-verifier-jev-shadow (Planned, amended)

| Field | Record |
|---|---|
| **Scope** | Count the verifier's recorded use in Pi, give it its first measured error rates and test a free fix for the clamp, all with zero calls. The Jev arm and the plugin shadow mode follow only past the new gate |
| **Recommendations** | R2, plus R4's optional claims column (BASE) |
| **First slice** | The Pi census: per-session counts of `goal-verify-nudge` messages by verdict and reason, with no text |
| **Likely files** | New, beside `.skilled/hooks/goal/lib/`: `count-pi-goal-nudges.mjs`, `score-verifier-labeled-set.cjs`, `build-verifier-fixture.cjs`, a labeled JSONL fixture and a test file (proposed names). Only if promoted: `.opencode/plugins/opencode-goal.js`, `.skilled/hooks/goal/goal-plugin.md` and the plugin tests |
| **Switch and key gate** | None for the slice. A later offline arm: `--jev` (proposed) with the shared gate. A later plugin mode: `OPENCODE_GOAL_VERIFIER=jev` (proposed) with the gate once per session and one enablement line on failure |
| **Dependency** | None for the census and the zero-call arms. The Jev arm waits on 002's latency record and on the redaction cases in three modules |
| **Rough size** | 80 to 120 LOC for the Pi census (estimate) and about 420 for the arms (swe-03), plus 30 to 50 rows. A later plugin mode is about 60 to 100 LOC (BASE) |
| **Kill criterion** | `stop: fewer than 30 rows` ends the phase. If the tail-window arm meets the stop rule, the clamp fix goes to the owners and no Jev arm is built |
| **Observable check** | The census reproduces this file's 1,457 nudges for the same directory and date range, printing no text. The three arms print confusion tables on identical rows with the clamp-error count. A stub `jev` logs no call |

**Proposed amendments to the Planned docs:**
- **Scope and Out of Scope:** add the Pi census. Replace the Out of Scope line on Pi (`spec.md:91`), whose reason is wrong: Pi runs goal-core's own heuristic on every turn and does not follow OpenCode's result (`goal-context.ts:221-244`).
- **REQ-001 and T001:** rows carry the raw text, its as-ingested form and the raw length. Claude rows are pre-labeled from native `goal_status` records. Pi rows carry the recorded nudge verdict.
- **REQ-002:** three zero-call arms, heuristic, tail-window and goal-core parity, with the clamp-error count. swe-03 found that 003's docs omit the tail-window arm.
- **REQ-005:** `unclear` keeps its own report row and folds into `not_met` only inside the two-class table.
- **REQ-006 (d):** an aggregate flip rate of at most 0.10 replaces the stability coefficient, read against the tail-window arm as well as the heuristic.
- **REQ-007:** redaction unit cases pass in three modules (`opencode-goal.js:474`, `secret-scrubber.ts:128`, `goal-core.cjs:374`), with fixture values under 48 characters, before any egress.
- **REQ-008:** the stop boundaries read against the better of the heuristic and tail-window arms.
- **REQ-009:** each call records confidence, and the report adds the cascade table with pre-registered bands.
- **REQ-010 and REQ-011:** shadow errors are caught inside the shadow call and never reach `opencode-goal.js:2378-2380`. `verifier_shadow` prints one line only on disagreement (proposed). A Pi form never awaits inside `turn_end`.
- **Slice 2 gate:** the tail-window arm leaves false `not_met` it cannot fix, the three redaction cases pass and 002 has a latency record (C19).
- **The open question at `spec.md:201`:** answered. The npm `jevctl` prints a bare `0.2.3` for `--version` (npm `cli.ts:89`).
- **Unchanged:** `plan.md:69` sends objective and evidence on stdin with no `-s`, which works as written (K1).

### 004-deep-research-expansion (exists, In Progress, research)

This research phase, not a build phase. Its remaining tasks, the convergence report, the phase reconciliation, verification and closeout, follow this file.

### 005-compaction-recall-harness (new, name kept)

| Field | Record |
|---|---|
| **Scope** | Measure host compactions and what the stock summary and the recorded brief keep, over transcripts the operator names, with zero calls. Then decide by the printed stop line whether an offline Jev deletion arm is worth building |
| **Recommendations** | R19, with R11 folded in |
| **First slice** | The census over 10 to 20 sessions, fit column first |
| **Likely files** | New: `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs` (proposed, swe-02's placement), its test and about six fixture transcripts. It writes nothing under the transcript directory |
| **Switch and key gate** | None for the census, which never spawns `jev`. A later arm: `--jev` (proposed) with the shared gate |
| **Dependency** | None for the census. A later arm waits on the redaction cases, the operator's acceptance of the payload and 002's latency record. A live form also waits on question 18 |
| **Rough size** | About 690 to 730 LOC plus fixtures (swe-02, lineage estimate) |
| **Kill criterion** | `arm not built: fit_throws>=50% OR offline_reduction_upper_bound<0.25`, or kept tokens above 3 times stock. The census itself is void on unknown shapes in more than half the sessions |
| **Observable check** | One row per boundary with the fields in R19's record and one stop line. On this project's transcripts the recorded-brief column finds a brief at about 218 of 222 boundaries. No transcript text appears, and a stub `jev` logs no call |

### 006-goal-criteria-lint (new, renamed from `006-goal-criteria-jev-lint`)

| Field | Record |
|---|---|
| **Scope** | Lint goal criteria for rules 4 and 5 of `sk-create-goal`, lexical first, under a rubric the operator adopts before labeling. A Jev arm only past the stop rule |
| **Recommendations** | R20 |
| **First slice** | The rubric decision, then the lexical lint plus about 100 labels |
| **Likely files** | New, beside `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`: `lint-goal-criteria.cjs`, `score-goal-lint.cjs`, `lint-goal-criteria.test.cjs` and a labels file. `check-goal.cjs` is read only. A line in `create-goal-auto.yaml` only with sk-doc's approval |
| **Switch and key gate** | None for the lint, which always exits 0. A later arm: `--jev` (proposed) with the shared gate |
| **Dependency** | The operator's rubric (question 34) and labels. None on other phases for the lint |
| **Rough size** | About 370 LOC with tests (swe-04, lineage estimate) |
| **Kill criterion** | `r20 jev arm not built: labeled_violation_rate<0.05`, under the adopted rubric |
| **Observable check** | Per-rule violation rates with lexical precision and recall print, scratch paths are excluded and counted apart, `check-goal.cjs` exit codes are unchanged across all active goals and a stub `jev` logs no call |

**Do 002's census first.** It needs no key and no label, and mimo-05 prices its operator time at 5 to 10 minutes to read one report (lineage-reported). Its power line decides with a number whether the billed arm is worth running. That arm, or R21 in its place, produces the latency record every later arm waits on. Two non-Claude families reached "R1 first" independently in wave 1 (A1). 005's census and 003's Pi census also make no call and can run beside it.

### Not phased (later), with what would promote each

| Item | Promote when |
|---|---|
| R2's Jev arm and plugin shadow mode (inside 003) | The tail-window arm leaves false `not_met` it cannot fix, the three redaction cases pass and 002 has a latency record |
| R19's Jev arm (inside 005) | The census clears its stop line, the redaction cases pass and the operator accepts the payload. A live form also needs question 18 |
| R20's Jev arm (inside 006) | The labeled violation rate under the adopted rubric is at least 5%, and the lint's F1 leaves room for a 0.2 gain |
| R3 | R1 prints `keep`, and its p95, spawn included, fits the advisor's remaining budget |
| R4 to R10, R12, R13 and R15 to R18 | As in section 11's carried table |
| R22 | About 50 labeled passages exist and an author names the decision it would change |
| R14 (dropped) | Only if a runtime caller of `compareNextFocusShadow` exists and a focus gold is named |

---

## 14. Citation Verification Ledger

Every row was reopened on 2026-09-27 in this worktree, which had a clean `git status` when the synthesis started. "Cited by" names the lineage iterations that cite the row, with their own line range in parentheses where it differs. "Synthesis" marks a citation this file adds. Results: **resolved** (the lines hold what the claim needs), **drifted** (right file, wrong lines, right lines given), **failed** (the lines do not hold what the claim needs), **count** (a count rerun today, figure given) and **not reopened** (carried, never checked here).

Totals: 166 rows. 149 citations checked: 142 resolved, 5 drifted and 2 failed. 16 counts rerun. 1 row not reopened.

### A. Skill advisor (R1, R3, R21)

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 1 | `score-outcome-rerank.mjs:40-51` | swe-01 | resolved | `loadCorpus` keeps skill-firing rows only |
| 2 | `score-outcome-rerank.mjs:85-93` | mimo-01, BASE, swe-01 (`:83-112`) | resolved | Reciprocal rank and top-k match ids exactly |
| 3 | `score-outcome-rerank.mjs:118-121` | 002 `plan.md:64`, swe-01 (`:118-123`) | resolved | The 50/50 split by sorted id |
| 4 | `score-outcome-rerank.mjs:123` | BASE | resolved | The fold is trained on the train half |
| 5 | `score-outcome-rerank.mjs:149-150` | swe-01, 002 `spec.md:122` | resolved | The eval's own flip rule |
| 6 | `score-outcome-rerank.mjs:159` | swe-01 | resolved | It runs on import. The file has no `export` |
| 7 | `capture-scorer-eval-baseline.mjs:35-46` | mimo-01, swe-01, swe-05 | resolved | The pinned env: `VITEST` at `:43`, lane variables deleted at `:44-46` |
| 8 | `capture-scorer-eval-baseline.mjs:49-50` | swe-01 | resolved | The alias and workspace-root `dist` imports, after the fusion import at `:48` |
| 9 | `capture-scorer-eval-baseline.mjs:70-76` | mimo-01, swe-01 | resolved | Alias-aware top-1 |
| 10 | `capture-scorer-eval-baseline.mjs:122` | deepseek-04 | resolved | It spawns git only |
| 11 | `capture-local-native-divergence-ledger.mjs:95` | deepseek-04 | resolved | It spawns python3 |
| 12 | `ambiguity.ts:7-8` | swe-01 | resolved | The 0.05 margins |
| 13 | `ambiguity.ts:22-36` | mimo-01, swe-01 | resolved | The cluster on score or confidence, with no size cap |
| 14 | `ambiguity.ts:44-58`, `:47-56` | swe-01 | resolved | `applyAmbiguity` writes `ambiguousWith`. `isAmbiguousTopTwo` sits at `:38-42` |
| 15 | `derive-ambiguity-slice.mjs:77-86` | swe-01 | resolved | The frozen slice stores ids and a margin, not candidates |
| 16 | `labeled-prompts.jsonl` | mimo-01, swe-01 | count | 195 rows: 18 gold-none, 177 skill-firing. Gate 3: 127 `yes`, 68 `no` |
| 17 | `holdout-prompts.jsonl` | mimo-01, swe-01 | count | 70 rows: 6 gold-none, 64 skill-firing |
| 18 | `ambiguity-prompts.jsonl` | mimo-01 | count | 24 rows, 5 gold-none. Margins: 11 negative, 2 zero, 11 positive |
| 19 | `scorer-eval-baseline.json` | mimo-01, swe-01 | resolved | Captured at `2dbaa8fd66`: 152/195 with 13 unknown and 5 false fires, holdout 53/70, slice 18/24 |
| 20 | `benchmark-stability.cjs:22-28`, `:102-108` | 003 `spec.md:124`, swe-03 (D-f), swe-01 (`:86-108`), swe-05 (`:102-108`) | resolved | `:22-28` states the formula and the 0.95 threshold. `:102-108` computes it. swe-03's drift claim does not hold (K13) |
| 21 | `shadow-sink.ts:25-45`, `:35-36` | mimo-01 | resolved | `defaultShadowDeltaPath` at `:34-37` resolves relative to its module |
| 22 | Shadow sink files | mimo-01, grok-05 | count | 0 `shadow-deltas` files in either checkout, in source or `dist` |
| 23 | 002 `plan.md:63` | swe-01 | resolved | The env lacks `VITEST` and `PYTHONDONTWRITEBYTECODE` |
| 24 | 002 `plan.md:71` and 003 `plan.md:69`, cited as missing `-s -` | swe-01, swe-03 (D-e), swe-05 | failed | Both plans are right: the Python client reads stdin by default (rows 29 and 35) |
| 25 | 002 `spec.md:113`, `:125`, `:139` | Synthesis | resolved | REQ-003's grep, REQ-010's `none` abstention and the stdin edge case |

### B. Python `jev-cli` 0.6.2 and the D5 gate

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 26 | `__init__.py:21`, `:41` | deepseek-01 | resolved | The official provider's key variable and the store path. The provider map spans `:18-39` |
| 27 | `__init__.py:46-49` | Synthesis | resolved | `CliError` defaults to exit 2 |
| 28 | `__init__.py:90-109` | deepseek-01 (also `:90-93`) | resolved | Environment first, then the store, else exit 3 |
| 29 | `__init__.py:180-184` | Synthesis | resolved | Stdin by default. A TTY exits 2 |
| 30 | `__init__.py:288` | BASE | resolved | `urlopen` timeout 60 s |
| 31 | `__init__.py:296-299` | Synthesis | resolved | 401 and 403 exit 3. 429, 5xx, connection errors and timeouts exit 4. Other HTTP errors exit 1 |
| 32 | `__init__.py:307` | Synthesis | resolved | `JEV_PROVIDER` sets the judgment default |
| 33 | `__init__.py:327` | deepseek-01, deepseek-03, grok-03, grok-05 | resolved | The `jev 0.6.2` version literal |
| 34 | `__init__.py:339` | Synthesis | resolved | The `auth` subcommands default to `official` |
| 35 | `__init__.py:351` | Synthesis | resolved | `choice` state defaults to stdin |
| 36 | `__init__.py:396-422` | deepseek-01 (also `:403-418`) | resolved | `auth test` builds a request, calls the provider and prints the model (`:403-418`). BASE marks it billed |
| 37 | `__init__.py:419-421` | deepseek-01 (also `:421`) | resolved | `auth status` prints the store path whether or not the key came from the environment |
| 38 | `__init__.py:435-443` | deepseek-01 | resolved | The exit 1 and 130 mapping |
| 39 | `cli-usage/SKILL.md:146-151`, `:162` | grok-01 | resolved | Four dispatch shapes and the default output |
| 40 | `cli-usage/SKILL.md:155` | swe-01, swe-03 | resolved | The `-s` forms, with `-` among them. The claim built on it fails (row 24) |
| 41 | `cli-usage/references/cli-reference.md:146-159` | deepseek-01 (also `:157-159`) | resolved | The exit table and the stderr JSON |
| 42 | `cli-usage/SKILL.md:167-174` | Synthesis | resolved | The exit table with each class's next move |

### C. npm `jevctl` 0.2.3 and the other vendored material

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 43 | npm `package.json` | deepseek-01 | resolved | Name `jevctl`, version 0.2.3, bin `jev` |
| 44 | npm `src/cli.ts:89`, `:139-144` | deepseek-01 | resolved | A bare semver for `--version` and `version` |
| 45 | npm `src/cli.ts:166-183`, `:192-196`, `:200` | deepseek-01 | resolved | The outdated check runs after parsing. Errors print as `jev: <message>`. That `--version` exits before the check is inferred from commander's default |
| 46 | npm `src/errors.ts:2-9` | deepseek-01, BASE | resolved | Exit 2 is a tripped `--fail-on` |
| 47 | npm `src/credentials.ts:13-16` | deepseek-01 | resolved | The environment variable map |
| 48 | npm `src/commands/auth.ts:100-127` | deepseek-01 | resolved | `auth status` reports each key's source and exits 1 when none is set |
| 49 | npm `docs/auth.md`, its subcommand table (`:16`) and resolution order (`:29-34`) | deepseek-01 | resolved | `status` exits 1 with no key. The environment wins over the store |
| 50 | npm `docs/auth.md`, its closing line (`:53`), read as recommending the tracked settings file | deepseek-01 F5 | failed | The line names the user-level `~/.claude/settings.json` (K2) |
| 51 | npm `state.ts:18-20` | swe-02, grok-01 (`:18`) | resolved | Input caps of 1,000 then 200 then 60 characters, a 400-character head and a 150-character tail |
| 52 | npm `state.ts:24-30` | swe-02 | resolved | The 2 to 18% calibration note, a vendor claim |
| 53 | npm `state.ts:31-41` | grok-01, swe-02 | resolved | `estimateTokens` |
| 54 | npm `state.ts:53-58` | grok-01, swe-02 (`:53-59`) | resolved | Pinning of the first message and the newest ones |
| 55 | npm `state.ts:108-109`, `:113-123` | grok-01 (`:108-109`), swe-02 (`:113-123`) | resolved | The result note and the one-line call |
| 56 | npm `state.ts:191-214`, `:225`, `:305` | deepseek-05 | resolved | Staged fitting reports its stage |
| 57 | npm `state.ts:198-306` | grok-01, swe-02 (`:198-307`) | resolved | `fitState` and its throw at `:304-306` |
| 58 | npm `compact.ts:20-27` | swe-02, deepseek-05 (`:19-27`), grok-01 (`:23`, `:24`, `:26`) | resolved | Defaults: keep threshold 0.5, 6 pinned messages, 25,000 state tokens and a 300-character head |
| 59 | npm `compact.ts:58-69` | grok-01, swe-02 (`:59-70`) | resolved | The result question carries the character count |
| 60 | npm `compact.ts:76-102` | Synthesis, swe-02 (`:81`) | resolved | Each batch resends the state. Batching throws when one call cannot fit |
| 61 | npm `compact.ts:131-132` | Synthesis | resolved | Candidate answers go through the throwing parser |
| 62 | npm `compact.ts:244-246`, `:257-258` | grok-01 | resolved | `reductionRatio`. A throw is left to the caller |
| 63 | npm `compact.ts:284-285` | grok-01 | resolved | The default keep covers calls absent from the answers, which only pinned calls can be |
| 64 | npm `core/compact.ts:68-75`, `:84-88`, `docs/compact.md:30`, `:33`, `:36-37` | grok-01 | resolved | `worth_it` at a 0.25 reduction, exit 2 on `low-reduction` and the one-line result notes |
| 65 | npm `request.ts:68-82` | grok-01 | resolved | `noulAnswer` throws. The function spans `:69-83` |
| 66 | npm `route.ts:114`, `:180-192` | grok-03 (`:180-189`, `:190-192`) | resolved | The `none` key and its action |
| 67 | npm `rerank.ts:77`, `:81` | grok-03, grok-04 (`:77`) | resolved | A missing answer as 0, ties by input order |
| 68 | npm `provider.ts:116-120`, `:134-137` | grok-04 | resolved | Why a missing answer must not become 0. The throw on one follows |
| 69 | npm `lib.ts:54-58`, `:63-65`, `:113-115` | grok-02 | resolved | The verdict map, `review` for a null confidence and the `partial` band |
| 70 | npm `classify.ts:130`, `:177-178` | grok-02 | resolved | `review` below the threshold, a missing `noul` as 0 |
| 71 | npm `screen.ts:56` | grok-02, grok-03, BASE | resolved | A missing injection answer as 0 |
| 72 | npm `verify.ts:46-47`, `:57-63`, `:94` | grok-02 | resolved | It throws without evidence, asks three relation keys and falls back to `unknown` |
| 73 | npm `plugin/hooks/fast-jev.ts:9-10` | deepseek-02, grok-01 | resolved | Types written by Claude Code 2.1.274 |
| 74 | npm `fast-jev.ts:75`, `:237-253` | grok-01, deepseek-02 (`:237-253`), BASE | resolved | On unless set false, with the key read outside any gate |
| 75 | npm `fast-jev.ts:283-285` | grok-01 | resolved | Any error falls back to the built-in summary |
| 76 | npm `claude-code.d.ts:3024-3026` | deepseek-02, deepseek-05 | resolved | A failing hook is skipped and core runs |
| 77 | npm `claude-code.d.ts:3799-3818` | deepseek-02 | resolved | The budget is the handler's own grace |
| 78 | npm `claude-code.d.ts:7283-7287` | deepseek-02 | drifted | The `precompute` text is at `:7278-7285`. deepseek-02's wider `:7278-7292` resolves |
| 79 | npm `claude-code.d.ts:10177-10178` | deepseek-02 | resolved | Ten seconds on the test clock |
| 80 | claude-jev `src/domain/catalog/options.ts:24-26`, `:110` | grok-03 | resolved | The 0.5 `lowConfidence` threshold and the `flat` flag |
| 81 | claude-jev `src/infrastructure/fs-source-reader.ts:16-33` | grok-04 | resolved | Path refuse patterns |
| 82 | claude-jev `src/domain/question.ts:76-80` | grok-02 | resolved | `noulOf` throws on a missing answer, at `:79` |
| 83 | claude-jev `src/domain/catalog/review.ts:21-27`, `:91-92` | grok-02 | resolved | The thresholds (the object closes at `:28`) and the first drop rule. The verdict mapping runs to `:100` |
| 84 | claude-jev `skills/jev/SKILL.md:75`, `:93` | grok-02 | resolved | The 0.5 reading rule and the vendor price |
| 85 | pi-jev-context `README.md:85`, `:87`, `:95-98` | grok-01 | resolved | The cache warning, pruning that persists after errors and the off-by-default setting |
| 86 | pi-jev-context `src/index.ts:264-270` | grok-01 | resolved | It awaits a scan before each request |
| 87 | pi-jev-context `src/jev.ts:95-96` | grok-04 (also `:89-96`, `:96`) | resolved | It refuses an over-budget request |
| 88 | supercov `docs/quality.md:195`, `:197-199` | grok-04, grok-05 (`:195`) | resolved | The estimate line and the answer cache, a vendor illustration |
| 89 | jev-review `src/review/workflow.ts:47-48`, `:76-80` and `src/domain/config.ts:5`, `:15` | grok-04 | resolved | Counts logged before each billed loop, follow-ups cut at 8. Nothing here rests on it |
| 90 | Pi post `:1121`, `:464`, `:743`, `:761` | grok-02 (`:1121`), grok-03 | resolved | User reports. `:1121` concerns meraGPT's Decider 1 |
| 91 | `external websites/classifier dev.md:1`, `jevcache.md:1` | grok-02, grok-03 | resolved | One URL each |
| 92 | `ideas from michel kerkmeester.md` | Synthesis | resolved | Four ideas. The first three carry the note to stay optional behind an env switch and an active key |

### D. Compaction

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 93 | `.claude/settings.json:38` | deepseek-02 | resolved | Function hooks on, in a tracked file |
| 94 | `.claude/settings.json:215-222` | deepseek-02, BASE | resolved | The PreCompact command hook with a 3 s timeout |
| 95 | `compact-inject.ts:1-8` | deepseek-02 (also `:8`) | resolved | PreCompact stdout is not injected |
| 96 | `compact-inject.ts:53-59` | deepseek-02 | resolved | The marker guards, from `:52` |
| 97 | `compact-inject.ts:133` | swe-02 | resolved | Topics by a `specs/` pattern |
| 98 | `compact-inject.ts:181-189`, `:182` | swe-02 | resolved | `detectSpecFolder` matches `.opencode/specs/` only |
| 99 | `compact-inject.ts:284-370`, `:511` | swe-02, deepseek-02 | resolved | The brief builder with its merge at `:343-350`, the 50-line tail read and the call site at `:527` |
| 100 | Compaction boundaries | swe-02 (47 in two files), mimo-04 (209), deepseek-02 (2 in one file) | count | 222 records: 210 main-session, 12 subagent. Triggers: auto 219, manual 3 |
| 101 | `SessionStart:compact` attachments | deepseek-02 | count | 933 attachments. A `hook_success` brief within 30 records at 218 of 222 boundaries, the marker at 210 |
| 102 | PreCompact hook events | deepseek-02, swe-02 | count | 0 |
| 103 | Installed Claude Code | deepseek-02 | resolved | 2.1.280 to 2.1.283 installed. `~/.local/bin/claude` points at 2.1.283 |

### E. Goal verification and redaction

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 104 | `opencode-goal.js:36-38` | mimo-03 (also `:30-50`) | resolved | The state directory default at `:36-37` |
| 105 | `opencode-goal.js:40`, cited as the evidence limit | mimo-03 | drifted | `DEFAULT_MAX_EVIDENCE_CHARS = 1200` is at `:42` |
| 106 | `opencode-goal.js:36-49` | swe-03 | resolved | Env and defaults: 1,200 at `:42`, 8 auto turns at `:43`, 2-day active retention at `:47` and a 30 s verifier at `:49` |
| 107 | `opencode-goal.js:49` | swe-05 | resolved | The 30 s verifier timeout |
| 108 | `opencode-goal.js:134-136` | deepseek-03, swe-03 | resolved | Modes and patterns |
| 109 | `opencode-goal.js:179` | mimo-03, deepseek-03, swe-03 | resolved | `met`, `not_met` and `blocked` |
| 110 | `opencode-goal.js:226-229`, `:249` | deepseek-05, mimo-03 (`:226-229`) | resolved | The silent fallback and its call site |
| 111 | `opencode-goal.js:250` | swe-03 | resolved | The injected supervisor verifier |
| 112 | `opencode-goal.js:382-389` | swe-03, grok-04 (`:382-388`, `:388`) | resolved | `clampText` appends `...` at `:388` |
| 113 | `opencode-goal.js:433-439`, `:473-474` | Synthesis, swe-03 (`:473`), grok-04, mimo-05 and swe-05 (`:474`) | resolved | The generic 48-character rule and the assignment rule |
| 114 | `opencode-goal.js:1107` | swe-03 | resolved | Evidence redacted and clamped on capture |
| 115 | `opencode-goal.js:2197-2230` | deepseek-03, swe-03, grok-02 (`:2202-2220`) | resolved | The heuristic and its five reasons |
| 116 | `opencode-goal.js:2209-2211` | swe-03 | resolved | The truncation test |
| 117 | `opencode-goal.js:2335-2340` | mimo-03 | resolved | Unknown verdicts become `not_met` |
| 118 | `opencode-goal.js:2354-2388` | swe-03 (also `:2360`) | resolved | The runner. No evidence means `not_met` |
| 119 | `opencode-goal.js:2378-2380` | deepseek-03, deepseek-05, swe-03 (`:2378-2386`) | resolved | Any other throw returns `blocked` |
| 120 | `opencode-goal.js:2429` | mimo-03 | resolved | `not_met` counts an iteration |
| 121 | `opencode-goal.js:3377`, `:3382` | swe-03 | resolved | `maybeVerifyGoal` and `writeGoalAtomic` in `__test`, which opens at `:3359` |
| 122 | `goal-core.cjs:39-43`, `:171-177` | mimo-03 | resolved | State directory resolution |
| 123 | `goal-core.cjs:59` | deepseek-04 | resolved | The objective limit of 4,000 |
| 124 | `goal-core.cjs:290-297` | deepseek-03, swe-03 (also `:295-296`) | resolved | `clampText` |
| 125 | `goal-core.cjs:367-376`, `:1606` | Synthesis | resolved | The third assignment copy at `:374`, exported, with no caller found |
| 126 | `goal-core.cjs:527`, `:1305` | mimo-03 | resolved | The `not_evaluated` default |
| 127 | `goal-core.cjs:596-619` | deepseek-03, swe-03 (`:596-620`, `:601-619`) | resolved | The heuristic, with truncation at `:606-607` |
| 128 | `goal-core.cjs:1477-1489`, `:1611` | Synthesis, swe-03 and swe-05 (`:1611`) | resolved | `recordTurn` and the heuristic export |
| 129 | `goal-context.ts:169-173` | deepseek-03 | resolved | The void-return note, stale for Pi 0.87.1 |
| 130 | `goal-context.ts:221-244`, `:233-238` | deepseek-03, swe-03 (`:233-238`), mimo-03 (`:228-238`, `:233-237`) | resolved | The handler and the hidden nudge |
| 131 | Pi `dist/bundle/chunks/chunk-OJP47DM6.js`, `emitBoundary` by name | deepseek-03 | resolved | The chunk awaits each handler. The readable copy is `dist/core/extensions/runner.js:662-681`, with the await at `:677` |
| 132 | Pi `dist/core/extensions/types.d.ts`, `TurnEndEventResult` by name | deepseek-03 | resolved | `BoundaryResult` at `:615-618`, `TurnEndEventResult` at `:883` |
| 133 | Pi `dist/core/session-manager.d.ts:98-108` | Synthesis | resolved | Custom messages join model context as user messages |
| 134 | Pi `dist/core/agent-session.d.ts:455-471` | Synthesis | resolved | A custom message sent without `triggerTurn` starts no turn |
| 135 | Pi `dist/core/agent-session.js:2396-2398`, `dist/core/extensions/types.d.ts:1045-1049` | Synthesis | resolved | The extension API's `sendMessage` calls `sendCustomMessage` |
| 136 | Pi session census | Synthesis | count | 1,457 nudges in 28 sessions of this repository, 1,822 in all. Reasons as in section 5 |
| 137 | Goal store census | mimo-03, swe-03 | count | Main checkout 6 records, worktree 0. `OPENCODE_GOAL_STATE_DIR` unset |
| 138 | `secret-scrubber.ts:128` | grok-04, mimo-05, swe-05, swe-03 (`:100-131`) | resolved | The scrubber's assignment rule |
| 139 | The three redaction expressions, run | grok-04, swe-03 | count | Both local copies miss both names. With the prefix fix the plugin's catches both. The scrubber's also needs `service`. The generic rule redacts the 48-character fixture but not the 36- and 42-character ones |
| 140 | `goal-plugin.md:53`, `:70` | swe-03 | resolved | The documented contract and the verifier switch |
| 141 | `goal-plugin.md:64-74`, `:101-103` | deepseek-05 | resolved | The env table and the `show` fields |
| 142 | `goal-set-string-playbook.md:55-57` | deepseek-03, mimo-02, grok-02 (`:55`) | resolved | The judge sees only the stored string |
| 143 | `.skilled/commands/goal-opencode.md:15`, `:37` | deepseek-03 (`:1-30`) | resolved | A state-free router |
| 144 | 003 `spec.md:91` | Synthesis | resolved | Its Pi rationale is wrong |
| 145 | 003 `spec.md:201` | Synthesis | resolved | The npm `--version` question, answered `0.2.3` by deepseek-01's finding |

### F. Goal authoring

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 146 | `check-goal.cjs:44-49` | mimo-02, swe-04 | resolved | Four checks, none for rules 4 and 5 |
| 147 | `check-goal.cjs:135-144`, `:162-201`, `:207-212` | swe-04, mimo-02 (`:207-212`) | resolved | The criterion parser |
| 148 | `check-goal.cjs:417-441`, `:433` | swe-04 | resolved | The walker skips only `z_archive`, named at `:28` |
| 149 | `check-goal.cjs:659-675` | swe-04 | resolved | Exits 0, 1 and 2 |
| 150 | `check-goal.cjs:681-689`, `:691-699` | swe-04 | resolved | The exports and the `require.main` guard |
| 151 | `sk-create-goal/SKILL.md:110` | deepseek-03, deepseek-05, swe-04 | resolved | The handoff rule |
| 152 | `sk-create-goal/SKILL.md:121-122` | grok-02, mimo-02 | resolved | Rules 4 and 5 |
| 153 | `create-goal-auto.yaml:209-229` | swe-04, deepseek-03 (`:214-228`), mimo-02 (`:215-226`), grok-02 (`:221`) | resolved | `step_measure` at `:212-219`, `step_check` at `:220-221` |
| 154 | Criterion census | mimo-02, swe-04 | count | 308 files, 1,381 lines by anchor parse (mimo-02: 1,313). 14 scratch files with 24 lines |
| 155 | mimo-02 sample rows 2, 3, 12 and 14 | mimo-02 | count | 4 of 4 match its strict labels |
| 156 | `goal_status` records | mimo-02 | count | 758, of them 757 before the run: 62 met, 696 not met, 610 with a reason |

### G. Other

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 157 | `hvr_scan.py:1-29` | deepseek-04 | resolved | The gap at `:17-21`, `--json` at `:26` |
| 158 | `hvr_scan.py:15-19`, cited as naming the standard | deepseek-04 | drifted | `hvr-rules.md` is named at `:9` and loaded at `:51-53` |
| 159 | `harness.cjs:231-260` | deepseek-04 | drifted | The `parseGraderResponse` statuses run to `:284` |
| 160 | `sk-communication-projection.js:20-43` | deepseek-04 | drifted | The no-context fallback sits at `:33-37` and the policy with `egressConsent: false` at `:45-49` |
| 161 | Review phrase recount | grok-04 | count | 4,915 files: the strict phrase in 1, a broader pattern in 6. grok-04: 0 usable in 3,271 |
| 162 | `council-report.md:310`, `:314` | grok-05 | resolved | seat-001's dissent and the unresolved criteria-lint base rate |
| 163 | Measurement digest harness ids, gap rows and use-case map | Synthesis | resolved | The rows section 11 quotes, at `measurement-digest.md:132-139` and `:146-153` |
| 164 | Runner events and summary | Synthesis | count | 127 events, no containment event, 0 advisories, durations as in section 2 |
| 165 | Lineage registries and deltas | Synthesis | count | Deltas 15, 26, 30 and 41. Registries 7, 26, 20 and 21. Merged 74 |
| 166 | Social-post lines cited only by BASE rows, supercov `properties.json` (named by grok-04 without a line), BASE's `goal-core.test.cjs:631-651`, the hook READMEs and `rewrite/response.md:16-24` (deepseek-04) | BASE, grok-04, deepseek-04 | not reopened | Carried as cited |

---

## 15. Evidence Quality and Caveats

**Independence.** Only wave 1 counts. This file counts 4 independent agreements (A1 to A4), 8 grounded after cross-reading (G1 to G8) and 4 that cite a sibling only (S1 to S4). The lineages ran at very different speeds, 13.5 to 47.8 minutes, so W2 views went stale: grok-03 and grok-04 saw only deepseek-01, and deepseek-03 and deepseek-04 saw no swe file. grok's `research.md` says swe had no file, which was true when grok wrote it and false by the end of the run.

**One Claude synthesizer.** BASE, the council and this file are all Claude Opus 5.5. Where I agree with BASE from my own reading, that is one family agreeing with itself. The four lineages are the only cross-family evidence, and they count as corroboration only where they opened the code or ran the count.

**Timestamps.** Never used as evidence of order. The runner flagged 6 of 7 grok state timestamps after the run window, 21:26:22.532Z to 21:39:51.912Z with a 120 s tolerance. swe's iteration files carry a date of 2025-12-02, which cannot be right, and mimo's state log carries none. Durations here are the runner's own.

**`newInfoRatio` is self-report.** grok 0.75 to 0.81 and then 0.62, mimo 0.75 to 0.85, swe 0.75 to 0.92 and deepseek 0.95 falling to 0.70. None is a measurement. New information was judged from each iteration's New-against-baseline table and from the code. My reading, a judgment: the round's genuinely new facts are few and concentrated in the recorded brief (deepseek-02), the Pi await (deepseek-03), the staged fit (grok-01, swe-02), the flip-rule arithmetic (mimo-01), the rubric spread (mimo-02), the HVR seam (deepseek-04) and swe's code-level designs. The Pi channel came from this synthesis's own count, not from any lineage.

**Two packages.** Every lineage kept the Python `jev-cli` 0.6.2 and the npm `jevctl` 0.2.3 apart, and no kept claim holds only for the npm package. deepseek-01's reading of the npm auth doc failed on which settings file it names (K2), not on mixing packages.

**Vendor claims.** Prices, the 2 to 18% calibration note, supercov's estimate example, pi-jev-context's cache warning and everything said about jevcache.sh and classifier.dev are vendor claims or user reports. None was reproduced.

**Containment advisories: none.** `orchestration-summary.json` records `completed_with_containment_advisory` at 0 for 4 lineages. The runner events hold no containment event. All eight quarantine directories under the lineages (an audit ledger and an effect ledger each) hold no file. No advisory names `scratch/synthesis-brief.md`.

**Private data.** No iteration quotes transcript text, reply text or goal-state content, so none is listed here as quoting private text. Transcript and goal-state findings arrive as counts, lengths and field names: mimo-02's reason lengths and mention counts, mimo-03's store fields, mimo-04's usage counts and swe-02's record-type inventory. Quotes from committed files appear in mimo-02 and swe-04 (criterion phrases from committed `goal.md` files) and in deepseek-04 (`hvr_scan.py` and the `/rewrite:response` contract). grok-02 and grok-04 quote vendored code and public posts. This file carries no transcript, reply or Pi message text, and it reports the Pi heuristic's fixed reason categories only.

**Other run events.** Two stall warnings after 300 s of quiet, mimo at 21:31:52Z and deepseek at 21:35:23Z by the runner's clock, each followed by completion. A `lineage_registry_empty` event for mimo, whose registry uses a non-canonical `findings` key that the merge coerced (26 entries). The mimo and deepseek error logs each hold one pi-web-access notice and one advisor-hook `fail_open` event after 2,507 ms (`CLI_RETRYABLE_UNAVAILABLE`, exit 75). grok's and swe's error logs are empty. mimo also wrote an `implementation-summary.md` inside its own lineage directory, which is within its allowed path.

**The merge under-counts again.** 112 delta records against 74 merged key findings: grok 15 against 7, mimo 26 against 26, swe 30 against 20 and deepseek 41 against 21. The merged metrics count 15 of 20 iterations. The resource map flags 32 of its 74 references as missing on disk, most of them paths written with a trailing list of line numbers, which do exist. This synthesis read all 20 iteration files directly, so no verdict rests on the registry.

**Judgment calls**, each open to the operator: R2 above R20, the aggregate flip rule's 0.10, the 90 s cap, `none` as an abstention, R22's thresholds, rejecting the key-origin line and dropping mimo-04's plumbing ideas.

**Adjacent defects**, reported and not fixed here. Each is confirmed from code unless marked:
1. The clamp in the plugin and in goal-core: evidence over 1,200 characters can never reach `met`. In Pi it feeds hidden nudges to the model.
2. Three redaction copies share the prefix gap (`opencode-goal.js:474`, `secret-scrubber.ts:128`, `goal-core.cjs:374`), and a generic rule hides the gap from a 48-character test fixture.
3. `detectSpecFolder` matches only `.opencode/specs/` paths (`compact-inject.ts:181-190`).
4. `walkGoalFiles` walks scratch fixtures (`check-goal.cjs:433`).
5. D5's check 3 and `jev auth test` default to the `official` provider while judgments follow `JEV_PROVIDER` (`__init__.py:307`, `:339`).
6. An unknown `OPENCODE_GOAL_VERIFIER` value falls back to `heuristic` silently (`opencode-goal.js:226-229`).
7. 003's Out of Scope line gives a wrong reason for excluding Pi (`spec.md:91`).
8. The note at `goal-context.ts:169-173` is stale for Pi 0.87.1.
9. 002's and 003's docs predate BASE's amendments, last changed at `021437ceda`.
10. The merge under-count and the resource map's false "missing" flags.
11. The shadow sink, if ever enabled, writes under `runtime/dist/runtime/data/` (inferred from its module-relative default).

---

## 16. References

**Research inputs** (under `specs/cli-jev/003-cli-jev-workflow-integration/`)
- `004-deep-research-expansion/spec.md`, `plan.md`, `goal.md`, `tasks.md`, `context/research-angles.md` and `scratch/synthesis-brief.md`
- `004-deep-research-expansion/research/lineages/{grok,mimo,swe,deepseek}/`: `iterations/iteration-001.md` to `iteration-005.md`, `research.md`, `deep-research-state.jsonl`, `findings-registry.json`, `deep-research-strategy.md`, `deltas/`, `invocation-metadata.json` and `logs/`, plus `mimo/implementation-summary.md`
- `004-deep-research-expansion/research/`: `findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json`, `orchestration-status.log`, `observability-events.jsonl` and `deep-research-config.json`
- `001-deep-research/research/research.md` (BASE) and `001-deep-research/ai-council/council-report.md`
- `001-deep-research/context/repo-rules-digest.md`, `seam-map.md`, `jev-material-digest.md` and `measurement-digest.md`
- `002-advisor-jev-tiebreak-arm/spec.md` and `plan.md`, `003-goal-verifier-jev-shadow/spec.md` and `plan.md`
- `goal.md` (the parent's decisions, D5 at `:53`) and `context/ideas from michel kerkmeester.md`

**Skill advisor** (`.skilled/skills/system-skill-advisor/runtime/`)
- `scripts/routing-accuracy/`: `score-outcome-rerank.mjs`, `capture-scorer-eval-baseline.mjs`, `capture-local-native-divergence-ledger.mjs`, `derive-ambiguity-slice.mjs`, `scorer-eval-baseline.json`, `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and `ambiguity-prompts.jsonl`
- `lib/scorer/ambiguity.ts` and `lib/shadow/shadow-sink.ts`

**Deep loop and grading** (`.skilled/skills/system-deep-loop/deep-improvement/scripts/`)
- `agent-improvement/benchmark-stability.cjs` and `model-benchmark/scorer/grader/harness.cjs`
- Review iteration files across `specs/`, counted for phrases only

**Spec-kit, compaction and settings**
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`
- `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts`
- `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`
- `.claude/settings.json`

**Goal hooks, plugins and authoring**
- `.opencode/plugins/opencode-goal.js`. Its copy at `.skilled/plugins/opencode-goal.js` is byte-identical today (`cmp`)
- `.opencode/plugins/sk-communication-projection.js`
- `.skilled/hooks/goal/lib/goal-core.cjs`, `.skilled/hooks/goal/pi/goal-context.ts` and `.skilled/hooks/goal/goal-plugin.md`
- `.skilled/commands/goal-opencode.md` and `.skilled/commands/create/assets/create-goal-auto.yaml`
- `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` and `scripts/check-goal.cjs`
- `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py`

**cli-jev contract**
- `.skilled/skills/cli-jev/cli-usage/SKILL.md` and `references/cli-reference.md`
- `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`

**Vendored material** (under `specs/cli-jev/003-cli-jev-workflow-integration/context/`)
- `external repo's/jev-cli-main/` (npm `jevctl`): `package.json`, `src/cli.ts`, `src/errors.ts`, `src/credentials.ts`, `src/commands/auth.ts`, `src/provider.ts`, `src/lib.ts`, `src/core/route.ts`, `src/core/rerank.ts`, `src/core/classify.ts`, `src/core/screen.ts`, `src/core/verify.ts`, `src/core/compact.ts`, `src/vendor/compaction/state.ts`, `src/vendor/compaction/compact.ts`, `src/vendor/compaction/request.ts`, `docs/auth.md`, `docs/compact.md`, `plugin/hooks/fast-jev.ts` and `plugin/hooks/types/claude-code.d.ts`
- `external repo's/claude-jev-main/`: `src/domain/question.ts`, `src/domain/catalog/review.ts`, `src/domain/catalog/options.ts`, `src/infrastructure/fs-source-reader.ts` and `skills/jev/SKILL.md`
- `external repo's/pi-jev-context-main/`: `README.md`, `src/index.ts` and `src/jev.ts`
- `external repo's/supercov-main/docs/quality.md`
- `external repo's/jev-review-main/`: `src/review/workflow.ts` and `src/domain/config.ts`
- `external websites/classifier dev.md` and `external websites/jevcache.md`
- `social posts/Reddit - I think i found the best use case for JEV and PI.md`

**Installed runtimes, read only**
- Pi 0.87.1 at `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/`: `extensions/runner.js`, `extensions/types.d.ts`, `session-manager.d.ts`, `agent-session.d.ts`, `agent-session.js` and `../bundle/chunks/chunk-OJP47DM6.js`
- Claude Code 2.1.280 to 2.1.283 under `~/.local/share/claude/versions/`

**Local data, counts only and never quoted**
- This project's Claude Code transcripts, 1,087 files
- Pi session files under `~/.pi/agent/sessions`, 5,609 files
- The goal store at `.skilled/skills/.state/goal/` in the main checkout and in this worktree

---

## 17. Convergence Report

The deep-research workflow appends the convergence report under this heading after this synthesis.

- Stop reason: maxIterationsReached
- Total iterations: 20 (grok 5, mimo 5, swe 5, deepseek 5)
- Questions answered: 7 / 7
- Remaining questions: none of RQ1 to RQ7; section 12's open questions stay open
- Last 4 iteration summaries: grok-05, "The contrarian build order and kill list" (newInfoRatio 0.62, self-reported); mimo-05, "Measurement-first build order, operator labor" (0.75); swe-05, "Build order in code: files, LOC, tests, switches, rollback" (0.75); deepseek-05, "Failure modes and kill criteria for the survivors" (0.7)
- Convergence threshold: 0.05, unused, because convergence mode was off and each lineage was forced to 5 iterations
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
- Synthesis event: `synthesis_incomplete` (ledger sequence 1), failing invariant `count_only_state_findings_not_reconstructed`. The lineage state records carry only `findingsCount`, 118 in total, and the merge rebuilt 74: mimo 26 of 26, swe 20 of 30, deepseek 21 of 41, grok 7 of 21. This synthesis read all 20 iteration files directly (brief, inputs), so its ranking does not rest on the merged registry. The same merge-parser gap hit round 1; it is recorded, not fixed here.
