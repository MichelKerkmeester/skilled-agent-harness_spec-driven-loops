---
title: "Deep Research Strategy: council-revised Jev recommendations, round 2 (swe lineage)"
trigger_phrases: []
---
# Deep Research Strategy: council-revised Jev recommendations, round 2 (swe lineage)

## Research Topic

Deepen and widen the council-revised Jev recommendations for this repository's skills, workflows and logic — measured, opt-in and dormant without a Jev key. The baseline is the round-1 re-synthesis `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md` (BASE). This lineage answers with the code-level slice-design lens: exact files, function names and signatures, imports, test cases with their fixtures, rough LOC per function, and keep or kill rules as checkable logic, including the cases the baseline's rules leave undefined.

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node is intentionally skipped.
- All writes are bounded to this lineage directory. Spec writeback, parent/shared telemetry, continuity/memory save and git staging are out of scope.
- Gate 3 is pre-resolved to the existing packet `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion`.
- The Jev contract under study is the Python `jev-cli` 0.6.2 wrapped by `.skilled/skills/cli-jev/cli-usage/`. The vendored npm `jevctl` 0.2.3 under `context/external repo's/jev-cli-main` is research material only and is named apart in every claim; their exit-2 meanings collide.
- The key gate (parent D5): opt-in and dormant unless `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status` exit 0 all pass; with no key a feature behaves exactly as today.
- No live `jev` call of either package, no `.env` file, no repository module or test suite run, no network call, no git write. Read-only commands (`rg`, `find`, `jq`, `wc`, node one-liners that read data files) are allowed.
- Transcript material under `TX/` (`~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/`) and goal state records are the operator's: counts, lengths, field names and record types only, never content.
- Wave rule: iterations 1-2 read no sibling round-2 file; iterations 3-4 read the newest sibling iterations first; iteration 5 reads all of its own plus the newest siblings.
- Seam ids `S01`-`S26` live in `001-deep-research/context/seam-map.md`; harness ids `H1`-`H15` in `001-deep-research/context/measurement-digest.md`; checklist `Q1`-`Q15` and red flags in `001-deep-research/context/repo-rules-digest.md` §3-4.

## Key Questions

- [x] swe-01 R1 as code: `score-jev-tiebreak.mjs` function by function, the keep rule's undefined cases, test fixtures, and 002's doc divergences (RQ1, RQ4; question 30).
- [x] swe-02 R19's census as code: `score-compaction-recall.mjs` over the transcript format, the placeholder-state estimator, question 25's record-shape answer (RQ1, RQ2; questions 25, 30).
- [x] swe-03 R2's zero-call slice and the two redaction unit cases as code, the driver path and the `not_met`/`unclear` mapping (RQ1, RQ3; questions 23, 30).
- [x] swe-04 R20's lint as code, plus one skip-line contract across R1, R19 and R20 (RQ1, RQ3; question 22).
- [x] swe-05 Build order in code: files, LOC, tests, switches and rollback per phase (RQ7, RQ1).

## What Worked

- swe-01: importing eval functions must be *copied*, not imported — `score-outcome-rerank.mjs` runs on import (:159) and exports nothing; 002's docs diverge from BASE in 15 enumerated places incl. a missing `-s -` stdin flag (plan.md:71 vs SKILL.md:155); the keep rule's decided universe must be *movable* rows (gold-first can only tie/lose); exact sign-test min-wins table computed.
- swe-02: transcript census at field-name level answered Q25 negatively at record level (47 boundaries, zero post-boundary hook attachments, no `PreCompact` hookEvent); the placeholder-state estimate ports the vendored `estimateTokens`/`fitState` verbatim over a record→`Message` map; `buildMergedCompactResult` replay is pure (input = `tailFile(path,50)` raw JSONL, compact-inject.ts:511) but must use the tail at each boundary's position; `detectSpecFolder`'s `.opencode/specs/` regex (:182) is dead on this surface.

- swe-03: `__test.writeGoalAtomic` + `__test.maybeVerifyGoal` over a mkdtemp `stateDir` is the export-free driver (real heuristic end-to-end); all 5 main-checkout goal records are `not_evaluated` — recorded verifier use is zero, D2 stays closed; 003's docs miss BASE's tail-window arm + 5 more divergences; redaction fixes are asymmetric (`:474` lookbehind-only, `:128` lookbehind + `service` prefix).
- swe-04: `check-goal.cjs` is safely requireable but exports the wrong layer — copy ~60 LOC of parser internals, import 3 goal-slice helpers; `walkGoalFiles` admits `review/**/scratch/` fixtures (shared defect); the skip-line family splits `skipped:`/`refused:` (002) vs uniform `skipped:` (003) — unify on 002.
- swe-05: sibling-agreed order rendered as per-phase files/LOC/tests/switches/rollbacks; two unreported failure modes found (hung `jev` spawn → `unmeasured_timeout`; replay version skew → `replay_version=`); wrapper extracts at the third arm, never before.

## What Failed

- swe-01 through swe-05: no failed approach. A first sign-test table computed in swe-01 was misprinted and corrected in-session before any artifact used it.

## Exhausted Approaches

- Reading the PreCompact brief back from post-boundary `attachment` records — disproved at record level in swe-02 (47 boundaries); replay of `buildMergedCompactResult` is the fallback route, with deepseek-02's `hook_success`/`SessionStart:compact` record read first when present.
- Metadata-only compaction census (`compactMetadata` without message records) — cannot score recall; the must-survive rules and estimator need `user`/`assistant`/`tool_result` fields.
- OpenCode state records as an evidence source for R2 rows — all 5 carry `lastEvidence` length 0 and `not_evaluated`; evidence comes from transcript pairing only.
- Extending `check-goal.cjs` exports or wiring into `CHECKS` — contract-pinned surfaces; copy-and-import stays zero-contact.

## Ruled-Out Directions

- Sign test over all eligible rows (asymmetric deck: gold-first rows can only tie/lose — decided = movable rows) — swe-01.
- Recomputing tau-0.03 margins or `includeAllCandidates` in the R1 census (frozen slice is an id set; non-live cluster) — swe-01.
- Real tokenizer for the R19 state estimate (dependency for ±10% when the vendored +2–18% bound suffices) — swe-02.
- `thinking` blocks folded into `Message.text` (no vendored field; counted as a separate diagnostic) — swe-02.
- Skip-with-warning on unknown transcript record type (corrupts the recall denominator; stop-with-named-error stands) — swe-02.
- `supervisorVerifier` injection to wrap the real heuristic (unexported — injection replaces, never wraps) — swe-03.
- Silent `unclear`→`not_met` collapse in all outputs (hides the Pi nudge metric; collapsed only in 2-class math) — swe-03.
- Fixing the redaction regexes in place (reported to owners per contract) — swe-03.
- Labeled fixture from OpenCode state alone (zero usable records) — swe-03.
- Quoting mimo-02's 79.5% as the lint's expected hit rate (different failure class; lint reports its own precision/recall) — swe-04.
- Jev arm inside the lint's first slice; scanning `specs/**` including scratch fixtures — swe-04.
- Early wrapper extraction; merged census script; 003 slice before 002's latency record; redaction fix inside a Jev phase — swe-05.

## Next Focus

Complete. All five angles answered; synthesis written (`research.md`, `findings-registry.json`, `deep-research-dashboard.md`, `resource-map.md`); terminal state records carry `stopReason: "maxIterationsReached"`.
