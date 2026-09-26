---
title: "Iteration 10: Smallest-first build order, engineering view"
trigger_phrases: []
---
# Iteration 10: Smallest-first build order, engineering view

**Angle:** deepseek-10 · **Lens:** integration engineer · **Wave 4 closes** · **Jev package under study:** Python `jev-cli` 0.6.2

## Focus

In what order should the survivors be built so each slice works end to end for one caller, and what is each slice's LOC and rollback sentence? Hand-off target: the ordered list with slice, LOC, files, callers and rollback, for the synthesis.

## Sibling check (required from wave 2 onward)

Read `research/lineages/grok/research.md` (grok's completed synthesis; 83 lines) and `research/lineages/mimo/iterations/iteration-003.md` (newest).

- **Grok's order:** "the routing arm, then nothing else until that arm has a delta." Its argument: a loss kills the closed-set `choice` family. I accept the first position and the kill criterion, but contest the "nothing else" as too strong for one case: the grader family (`score`/`noul`) is not produced by the routing arm, so a routing loss does not gate it. Where resources allow only one build, the routing arm wins; where two can proceed, the grader is the independent second.
- **Grok's contest of my iteration 3 goal rank:** it argues the labeled transcripts do not exist, so the goal `choice` cannot enter the wave with the `next` label. After mimo-003 (which designs the 30-50 excerpt set 10 per class and says shadow-only, heuristic authoritative), I accept: the goal mode drops from `next` to **later** with the set as its first slice. This is agreement after cross-reading, not independent.
- **Mimo-003:** confirms the goal verifier's felt failure is nudge errors, and that replacing the heuristic's verdict is doctrine-dropped (one-lens rule). Incorporated below.

## Actions Taken (opened this iteration)

- `research/lineages/grok/research.md` (full)
- `research/lineages/mimo/iterations/iteration-003.md`
- Re-ran no code reads; the build order rests on iterations 1-9 of this lineage, each with its own opened citations.

## The ordered build list

### Slice 1 — Routing tie-break arm (harness A)

- **Caller:** the routing-accuracy maintainer runs it; the script is the caller end to end (census in, report out).
- **Files:** new `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`; writes census JSON, report JSON, per-call JSONL beside the existing eval scripts. Nothing else changes.
- **LOC:** ~150-200.
- **Proves:** whether a Python `jev-cli` `choice` over a near-tie cluster beats similarity on MRR/right@3 (held-out headline), plus the first measured latency/cost numbers and the eligible-row census.
- **Fails if:** it loses on the held-out split (grok-010's kill criterion, accepted) — then the whole closed-set `choice` family drops for this round.
- **Rollback sentence:** delete the new script and its reports; no existing file was modified, and the ratchet baseline is untouched.

### Slice 2 — D4 `jev` grader kind (harness B)

- **Caller:** `run-benchmark.cjs --scorer 5dim --grader jev` for the reviewer-regression profile.
- **Files:** new `scorer/grader/jev.cjs`; factory branch in `score-model-variant.cjs`; `--grader` allowlist/usage row in `run-benchmark.cjs`; one doc row in `.skilled/commands/deep/model-benchmark.md`.
- **LOC:** ~60-100.
- **Proves:** grader agreement with the reviewer fixtures' hidden oracle, with cost and latency; also fixes the silent-mock fallthrough and represents "not measured" instead of a `0.0` score.
- **Fails if:** agreement is no better than the existing `llm` grader, or the grader cannot represent an ungraded fixture without corrupting the weighted score.
- **Rollback sentence:** revert the factory branch and flag rows and delete `grader/jev.cjs`; the default grader remains `noop`, so today's runs are unchanged.

### Slice 3 — Stop second-rater replay

- **Caller:** the deep-research maintainer replays archived lineages; offline, no runtime file touched.
- **Files:** a replay script (new, deep-research scripts area) plus a defined gold rule (last iteration that added a cited finding); may reuse slice 1's probe/exit-map inline.
- **LOC:** ~60-100 plus the replay harness.
- **Proves:** agreement between a Jev novelty `score` and the replay gold, especially on the inert-flat-0.9 windows the reducer already warns about.
- **Fails if:** the second rating tracks the self-report without adding signal, or cannot be produced inside reasonable cost.
- **Rollback sentence:** delete the replay script; `convergence.cjs` and the reducer are untouched.

### Slice 4 — Severity replay via H14

- **Caller:** the deep-review maintainer replays archived findings through the blinded adjudication service.
- **Files:** a replay runner plus the frozen adjudicated-severity gold fixture; the service and adapter already exist.
- **LOC:** ~80-120 plus gold extraction.
- **Proves:** whether a Jev severity `choice` agrees with final adjudicated severity enough to save a human pass.
- **Fails if:** agreement is no better than the reviewer's own adversarial replay.
- **Rollback sentence:** delete the runner and gold fixture; the adjudication service keeps its existing consumers.

### Slice 5 — Goal verifier `jev` mode (was next, now later, conditional)

- **Caller:** an operator who opts in on the OpenCode plugin (`OPENCODE_GOAL_VERIFIER=jev`) and optionally Pi.
- **Precondition:** the 30-50 excerpt labeled set exists (mimo-003, 10 per class); shadow-only, heuristic stays authoritative; the wrapper must never return `met` when blocking language is present (grok's kill criterion).
- **Files:** `VALID_VERIFIER_MODES` plus a factory branch in `.skilled/plugins/opencode-goal.js`; a Pi arm behind the same flag family; the labeled set.
- **LOC:** ~60-100 plus the labeled set.
- **Proves:** verifier accuracy per class against the heuristic; fewer spurious nudges at equal safety.
- **Fails if:** it marks `met` on any transcript the heuristic marks `not-met` for blocking language, or its accuracy ties the heuristic.
- **Rollback sentence:** remove the mode value and wrapper branch; default `heuristic` and the heuristic nudge behavior are unchanged.

### Not in the order (later, promotion-gated)

- Advisor cached shadow lane (2.2): needs a cache producer and slice 1's positive result.
- Fan-out shadow pair record (5.2): needs a labeled pair set.
- Alignment below-50 suggestion (6.2) and level risk flags (6.3): need archived gold counts first.
- Level/flag surfaces and any new command/skill: nothing earned (iteration 7).

## Findings

1. **The order is by dependence, not by value:** slice 1 gates the `choice` family; slices 2-4 are independent replays whose gold already exists or can be defined from records; slice 5 is the only runtime change and is gated on a labeled set that does not exist.
2. **Every rollback is a file deletion or a flag removal.** No slice touches a frozen contract, a ratchet baseline, or an existing default: the blast radius of the whole program is eight files or fewer, each reversible in one revert.
3. **No slice needs the shared client helper.** Slice 1 inlines its spawn; if slices 3 and 4 land, they become the second and third callers, and the ~60-80 LOC reference client can be extracted then (iteration 7's rule).
4. **The failure table from iteration 9 is the acceptance criteria set** for slices 1, 2 and 5: probe first, exit-map, not-measured representation, wrapper timeout.
5. **Grok's "nothing else until the arm has a delta" is right for a one-slot budget and too strict for two:** the grader has gold and no dependence on the routing outcome. If only one build happens this quarter, it is slice 1.

## Ruled Out

- **Parallelizing all survivors**: the repo's smallest-complete-result rule and the missing golds say no.
- **Building slice 5 before its labeled set**: rejected twice by siblings and by the safety property (blocking-language gate).
- **Creating the shared helper now**: zero callers until slices 3-4 exist.

## Questions Answered

- The ordered list with slice, LOC, files, callers and rollback: above.
- Which slice first if only one: routing arm (slice 1), kill criterion included.

## Questions Remaining (carried to synthesis)

- Slice 1's census count and arm delta: unrun; everything downstream of `choice` waits on it.
- Whether two builds can actually proceed in parallel under operator capacity: an operator decision, not a research one.

## Hand-off (for synthesis)

- The synthesis should carry: the ordered list, the kill criteria, the position updates (D4 slice build-now-eligible; goal mode next → later), and the failure table as acceptance criteria.
- No further angle remains after this one.

## Assessment

- `newInfoRatio`: `0.58`
- Novelty justification: Produced the dependence-ordered build list with per-slice rollback sentences, revised the goal-mode rank after sibling cross-reading, and bounded the whole program's blast radius to file deletions and flag removals.
- Confidence: high for the rollbacks and dependences; medium for slice 2's exact LOC; UNKNOWN for every unrun delta.

## Sources Consulted

- Siblings: `research/lineages/grok/research.md`, `research/lineages/mimo/iterations/iteration-003.md`
- Iterations 1-9 of this lineage (each cites its own opened files)
- Digest claims (reused): `context/repo-rules-digest.md` section 3 Q5, Q8, Q10
