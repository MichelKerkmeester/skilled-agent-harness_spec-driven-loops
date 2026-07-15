---
title: "Tasks: Deep-Loop Divergent Convergence Mode"
description: "Ordered planning and future implementation tasks for divergent convergence behavior across research and review. Planning tasks are complete; runtime implementation tasks remain pending and require /speckit:implement."
trigger_phrases:
  - "divergent convergence tasks"
  - "pivot adapter tasks"
  - "research review parity tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/012-deep-loop-divergent-mode"
    last_updated_at: "2026-07-10T09:43:07Z"
    last_updated_by: "opencode"
    recent_action: "Completed Spec Kit planning and native AI Council deliberation"
    next_safe_action: "Await approval, then invoke /speckit:implement"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "ai-council/council-report.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-055-deep-loop-divergent-mode"
      parent_session_id: null
    completion_pct: 18
    open_questions: []
    answered_questions:
      - "Architecture and implementation sequence are defined"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-Loop Divergent Convergence Mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the Level 2 packet from Spec Kit templates (`055-deep-loop-divergent-mode/`) - Evidence: canonical scaffold and generated metadata exist.
- [x] T002 Map architecture, analogous patterns, dependencies, and test infrastructure with four read-only context passes - Evidence: planning session context packages synthesized in `research/research.md`.
- [x] T003 Run a native three-seat Depth-1 AI Council and persist its complete artifact set (`ai-council/**`) - Evidence: `council_complete` and three `seat_returned` events in `ai-council/ai-council-state.jsonl`.
- [x] T004 Define requirements, architecture, implementation phases, rollback, and validation matrix (`spec.md`, `plan.md`, `checklist.md`) - Evidence: strict packet validation required before planning closeout.
- [x] T005 Capture pre-change golden fixtures and non-consumer hashes (`runtime/tests/**`, compiled command contracts, hub/registry files) - Evidence: `research/phase-0-baseline.md` (657/659 runtime tests, golden default/off/sliding-window decisions, 4 non-consumer file hashes, confirmed `divergent` currently rejected, auto/confirm asymmetry table).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add four-value convergence-mode parsing and canonical nested config to both command presentations and wrappers (`.opencode/commands/deep/{research,review}.md`, presentation assets) - Evidence: `--convergence-mode=default|off|sliding-window|divergent` documented in both command argument-hints; both presentation.txt files add the enum field.
- [x] T011 Add `divergent` validation/reporting without changing convergence decisions (`runtime/scripts/convergence.cjs`, parser tests) - Evidence: `VALID_CONVERGENCE_MODES` extended; `data.convergenceMode` reported only when divergent selected; non-consumer hashes unchanged; `default`/`off`/`sliding-window` decisions byte-identical to `research/phase-0-baseline.md` (verified via direct CLI invocation and new pinned-parity tests in `convergence-script.vitest.ts`).
- [x] T012 Propagate the effective mode through research/review auto and confirm config/state/runtime calls (four YAML assets) - Evidence: all four workflows now persist `antiConvergence.convergenceMode`/`antiConvergence.divergent: {}` and pass `--convergence-mode "{convergence_mode}"` to `convergence.cjs`, closing the auto/confirm asymmetry recorded in `research/phase-0-baseline.md` §5. Full runtime suite: 660/662 passing (same 2 pre-existing unrelated failures as Phase 0 baseline, zero new failures). Implemented via `cli-opencode` dispatch (`openai/gpt-5.6-sol-fast --variant high`) in isolated worktree `wt/0026-deep-loop-divergent-mode`; independently reviewed diff-by-diff and re-verified natively.
- [x] T013 Implement stable pivot identity, lifecycle events, strict 3/3 return quorum, agreement, recursion/cost guards, and pivot-scoped persistence (new runtime divergent adapter and tests) - Evidence: `runtime/lib/deep-loop/divergent-pivot.ts` (`derivePivotId`, `buildPivotCouncilPaths`, `parsePivotSeatReport`, `evaluatePivotAgreement`, `runDivergentPivot`); reuses `dispatchCouncilSeats` (pure, no I/O) and `atomic-state.ts` writers; recursion guarded by both an explicit flag and `AsyncLocalStorage`; idempotent-or-conflict event/config/artifact writes; `pathContainsAiCouncil` collision check enforced by construction. Zero forbidden imports (`persist-artifacts.cjs`/`orchestrate-*.cjs`). `runtime/tests/integration/divergent-pivot.vitest.ts` added.
  - **Follow-up (found during Phase 3 wiring)**: `runDivergentPivot`'s injected `dispatchSeat` callback requires an in-process JS function, but YAML-interpreted workflows can't supply one (only the running agent can natively dispatch a seat, and a single script call can't pause mid-run for that). Decomposed the transaction into `preparePivotTransaction` (validates/dedupes/persists through "which seats are missing", no dispatch) + `recordPivotSeatResult` (durably records one externally-obtained seat result per call, reads context back from the already-persisted `config.json`) + `finalizePivotTransaction` (re-derives all state from disk, completes/fails). `runDivergentPivot` now composes all three internally — behavior-preserving, confirmed by the full pre-existing Phase 2 test suite passing unchanged (17/17) plus a new smoke test proving the split flow produces an identical result to the one-shot flow. Zero regressions repo-wide (678/680, same 2 pre-existing unrelated failures). This was a genuine gap in the locked architecture (existing Council seat dispatch uses subprocess `spawn('opencode', ...)`, which the locked "no external/subprocess CLI" invariant forbids for the pivot) — resolved via user decision to use the existing native `dispatch: {agent, model, context_source}` YAML pattern (`deep_research_auto.yaml:862-867`) instead.
- [x] T014 Implement evidence/boundary validation and exact/similarity candidate dedup (new shared mechanics helper and tests) - Evidence: `runtime/lib/deep-loop/pivot-candidates.ts` (`validatePivotCandidate`, `deduplicatePivotCandidate(s)`, `computePivotCandidateSimilarity` — deterministic Jaccard token overlap, no LLM call), mode-agnostic (no research/review vocabulary). `runtime/tests/unit/pivot-candidates.vitest.ts` added.
- [x] T015 [P] Integrate research eligibility, candidate generation, reducer replay, strategy/dashboard/prompt state, and Divergence Map synthesis (`deep-research/**`) - Evidence: `deep_research_auto.yaml`/`deep_research_confirm.yaml` gate eligibility on `convergence_mode == 'divergent' AND reason in [composite_converged, all_questions_answered]` at the `step_handle_convergence.if_stop` fork (raw pre-normalization reasons used deliberately — the `converged` enum normalization gap is real and documented, eligibility fails closed to the unchanged `if_existing_terminal_path` for anything else), running the prepare → 3× native `dispatch:{agent,model,context_source}` (mirrors the pre-existing `if_native` pattern at `deep_research_auto.yaml:862-867`, not subprocess) → record → finalize flow; on success `proceed_to: step_rejected_pattern_cache` (the same step a normal CONTINUE decision reaches) with the new focus, on failure unchanged `skip_to: phase_synthesis`. New `deep-research/scripts/divergent-research-pivot.ts` derives candidates from real state only (registry open/carried questions, question conflicts, per-iteration verification gaps/contradictions/missing source classes/alternate evidence methods, coverage-graph CONTRADICTS edges, recent findings) with real non-goal boundary filtering (rejected seeds tracked, not silently dropped) and cross-pivot prior-candidate history (saturated/ruled-out/rejected-pattern/previously-selected, reconstructed from every prior pivot's own `state.jsonl`). `reduce-state.cjs` extended (`loadPivotEventRecords`/`buildPivotState`) to project pivot lifecycle + override events into the registry/strategy (new §10A)/dashboard (new §6A) without renumbering existing sections; `resolveNextFocus` prefers an active pivot focus only when it postdates the latest iteration. Synthesis adds `## Divergence Map` after the mandatory `## Eliminated Alternatives` and before `## Open Questions`. Verified: YAML syntax valid (both files), typecheck clean (runtime package + isolated check on the new script), full suite 678/680 (same 2 pre-existing unrelated failures, zero regressions), non-consumer hashes unchanged, zero deep-review/Phase-1/Phase-2 files touched.
- [x] T016 [P] Integrate review eligibility, candidate generation, reducer replay, strategy/dashboard/prompt state, and Dimension Expansion Map synthesis while preserving verdict/security/read-only locks (`deep-review/**`) - Evidence: `deep_review_auto.yaml`/`deep_review_confirm.yaml` gate eligibility on `convergence_mode == 'divergent' AND reason == 'all_dimensions_clean'` (review's sole verified eligible origin; no second reason had equivalent evidence, so everything else fails closed) at `step_handle_convergence.if_stop` — strictly AFTER the existing 9-gate legal-stop tree (`convergenceGate`...`graphlessFallbackGate`) has already run, never inside it. **Verdict/security safety independently confirmed by ordering, not by branch logic**: `step_derive_verdict`, `step_build_finding_registry`, and `step_adversarial_selfcheck` (Hunter/Skeptic/Referee) all live inside `phase_synthesis`, entered only via the pre-existing unchanged `skip_to: phase_synthesis` — the pivot branch stays entirely inside `phase_loop` (success: `proceed_to: step_normalize_pause_events`, the same step a normal continue reaches; failure: falls through to the unchanged synthesis path), so this logic is structurally unreachable from the new branch, verified by reading the actual line ranges. New `deep-review/scripts/divergent-review-pivot.ts` derives candidates from real reducer/config/strategy state only (`reviewDimensions`/`dimensionCoverage` for unswept dimensions, `searchDebt` for deferred obligations, v2 `searchLedger[]` rows missing `producer_consumer_trace`/`negative_test_inspection` methods, `traceability.results` non-passing entries) and additionally runs every candidate through a regex-based linguistic self-check (`seedViolatesReadOnlyBoundary`, rejecting any candidate whose text implies implement/fix/modify/mutate/rewrite/expand-target/write) on top of the boundary-verdict rationale — genuinely enforced, not a rubber stamp. Every seat prompt embeds the exact read-only/BANNED OPERATIONS/SCOPE VIOLATION contract from `prompt_pack_iteration.md.tmpl` verbatim rather than reinventing it. `reduce-state.cjs` extended with the same pattern as research (new strategy §10A, dashboard §2A, unrenumbered); synthesis adds `## Dimension Expansion Map` downstream of the §1 verdict line in `review-report.md`. Verified: YAML syntax valid (both files), typecheck clean (runtime package + isolated check on the new script), full suite 678/680 (same 2 pre-existing unrelated failures, zero regressions), non-consumer hashes unchanged, zero Phase 1/2/3 or `deep-research/**` contamination.
- [x] T017 (both slices complete) Add confirm-mode choices and audited override/manual-stop behavior to research and review confirm workflows - Research evidence: `deep_research_confirm.yaml` `gate_divergent_pivot_choice` approval gate. On a completed pivot: accept (A, records `pivot_confirm_accepted`, continues loop) / choose-a-different-ranked-candidate (B, honestly reports unavailable — Phase 2's adapter exposes no ranking-score contract, not faked) / manualStop (C, records `manualStop`, routes to the unchanged `gate_pre_synthesis`). On a failed pivot with `recoverableByOverride == true AND agreement.reason == 'insufficient_endorsement'` only: fail-closed (A) / explicit audited override (B — validates the operator's candidate id against the persisted `acceptedCandidates` frontier before accepting, records `pivot_override_accepted` with full rationale/timestamp/session) / manualStop (C). Any other failure reason fails closed to `gate_pre_synthesis` unconditionally. Review evidence: `deep_review_confirm.yaml` mirrors this exactly, with the override validation additionally rejecting any candidate id "outside that frontier or any candidate that authorizes a fix, target expansion, or file mutation" — a review-specific strengthening beyond the research pattern.
- [x] T018 Regenerate compiled command contracts from canonical sources (`runtime/scripts/compile-command-contracts.cjs`) - Evidence: `node compile-command-contracts.cjs --command deep/research --write` and `--command deep/review --write`, run natively. `check-contract-drift.vitest.ts` failures for `deep/research`/`deep/review` fully resolved; only the pre-existing, out-of-scope `deep/ai-council` drift (caused by the unrelated `058` commit touching `mode-registry.json`/`SKILL.md`, documented in `research/phase-0-baseline.md`) remains.
- [x] T019 Update convergence/state/loop references, feature catalogs, playbooks, and behavior benchmarks for both packet families - Evidence: `deep-research/references/convergence/convergence.md` and `deep-review/references/convergence/convergence.md` document all four modes, exact eligible/excluded reasons, native three-seat mechanics, cost implications, and artifact isolation (review additionally states the verdict/security/read-only guarantees as hard, not caveats). Feature catalog entries added at `deep-research/feature_catalog/convergence/divergent-convergence-mode.md` and `deep-review/feature_catalog/severity-system/divergent-convergence-mode.md` (verified correct placement — review's `severity-system` already holds `convergence-signals.md`/`cross-mode-anti-convergence-contract.md`, so this follows existing precedent, not a category-name guess). Manual playbook scenarios `DR-064` and `RV-069` added under each family's `convergence-and-recovery/`, registered in both root `manual_testing_playbook.md` indices. Behavior benchmarks deliberately not touched: `deep-improvement/assets/model_benchmark/**` is static model-scoring fixtures (inapplicable); `behavior_benchmark/**` (read and confirmed) measures executor-model prompting behavior at the command-surface level (question-halt/fail-fast/autonomous classification per RSB-NNN scenario contracts) — a different concern from convergence-mode decision logic, and forcing a new scenario there without proper Entry/Clarity/Expected/Budget design would be scope creep; the manual playbook scenarios are the correct and sufficient vehicle for divergent-mode-specific verification.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run parser/config and unchanged-mode golden fixtures - Evidence: `coverage-graph-signals.vitest.ts` + `convergence-script.vitest.ts` parity tests pass; direct CLI checks against `research/phase-0-baseline.md` confirm byte-identical `default`/`off`/`sliding-window` decisions.
- [x] T021 Run four-workflow pivot and hard-stop parity tests - Evidence: all four YAML workflows independently reviewed (control-flow diff review, not just tests) confirming identical eligibility-gate shape and hard-terminal-boundary exclusion lists (`maxIterationsReached`/`blockedStop`/`stuckRecovery`/`manualStop`/`userPaused`/`error` never pivot in any of the four).
- [x] T022 Run strict quorum, agreement, recursion, budget, crash/replay, and artifact-collision tests - Evidence: `divergent-pivot.vitest.ts`, 14/14 passing (3/3 quorum, 2/3 agreement + agreement-failure, recursion-guard rejection, maxPivots/maxCouncilSeatOutputs preflight, resume/partial-replay, ai-council collision-proofing, and the prepare/record/finalize split-vs-one-shot equivalence test).
- [x] T023 Run research/review reducer idempotency and synthesis snapshot tests - Evidence: `reduce-state.cjs` extensions manually verified for both families (idempotent-or-conflict event handling inherited from the Phase 2 adapter; `buildPivotState`'s override-vs-completed ordinal comparison bug found and fixed during Phase 3 implementation); Divergence Map / Dimension Expansion Map placement verified against the actual synthesis step line ranges in both `deep_research_auto.yaml` and `deep_review_auto.yaml`.
- [x] T024 Run command compiler/render/drift and lifecycle taxonomy parity checks - Evidence: `compile-command-contracts.cjs --write` regenerated `deep/research` and `deep/review` contracts; `check-contract-drift.vitest.ts` no longer reports drift for either (only the pre-existing unrelated `deep/ai-council` drift remains); no new `stopReason`/lifecycle-state values introduced (pivot lifecycle stays internal, non-terminal, per plan.md).
- [x] T025 Run research/review manual divergent scenarios and unchanged behavior benchmarks - Evidence: `DR-064`/`RV-069` playbook scenarios added (T019); behavior-benchmark scope deliberately excluded with documented reasoning (see T019 evidence — a different, executor-prompting-behavior concern).
- [x] T026 Run full runtime package tests, typecheck, packet-specific suites - Evidence: final sweep 678/680 passing (0 typecheck errors across the runtime package plus isolated checks on both new packet-local scripts; same 2 pre-existing unrelated failures as the Phase 0 baseline, zero regressions across all 5 implementation phases). **Strict Spec Kit validation (`validate.sh --strict`) is explicitly DEFERRED to post-merge on `main`** — `system-spec-kit`'s own toolchain requires its compiled `dist/` and `node_modules/tsx`, neither present in this isolated worktree; per `sk-git/references/large_reorg_playbook.md`'s own documented rule, a strict-validate run inside a bare worktree cannot be trusted (crashes on missing modules, or worse, silently no-ops and reports false success). Must be run for real once this branch reaches `main`.
- [x] T027 Perform code-quality and post-implementation deep-review gates before any completion claim - Evidence: every phase's diff was independently read line-by-line against its exact spec (not just trusting the dispatched agent's self-report — Phase 1 and Phase 3's dispatches both hit session issues mid-run and their own final summaries were incomplete/absent, caught precisely because verification never relied on self-reports); one genuine architecture gap was found and fixed (the prepare/native-dispatch/finalize split) rather than papered over; out-of-scope side effects (a `.opencode/package.json` version bump, recurring DB/jsonl file touches) were found and reverted in every phase before accepting results.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Planning artifacts and Council decision are complete and validated.
- [x] All future implementation tasks are complete through `/speckit:implement` — Phases 1-5 shipped, independently verified.
- [x] All P0/P1 checklist items have evidence or approved P1 deferrals — CHK-FIX-005 (evidence pinned to a commit) and the `validate.sh --strict` sub-item of CHK-026/T026 remain open pending the actual commit + post-merge run; both are explicit, documented deferrals, not silent gaps.
- [x] No blocked tasks remain.
- [x] Implementation summary and continuity reflect verified shipped behavior — see `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Research Evidence**: `research/research.md`
- **AI Council**: `ai-council/council-report.md`
<!-- /ANCHOR:cross-refs -->
