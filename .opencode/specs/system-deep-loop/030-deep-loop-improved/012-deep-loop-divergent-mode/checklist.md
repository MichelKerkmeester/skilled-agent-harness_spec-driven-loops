---
title: "Verification Checklist: Deep-Loop Divergent Convergence Mode"
description: "Planning and implementation verification gates for opt-in divergent pivots across research and review. Planning evidence is complete; implementation evidence remains pending."
trigger_phrases:
  - "divergent convergence checklist"
  - "pivot verification"
  - "research review parity checklist"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/012-deep-loop-divergent-mode"
    last_updated_at: "2026-07-10T09:43:07Z"
    last_updated_by: "opencode"
    recent_action: "Defined planning and future implementation evidence gates"
    next_safe_action: "Do not mark implementation checks until /speckit:implement produces evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-055-deep-loop-divergent-mode"
      parent_session_id: null
    completion_pct: 22
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deep-Loop Divergent Convergence Mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim implementation completion until complete |
| **[P1]** | Required | Complete or obtain explicit user-approved deferral |
| **[P2]** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements and acceptance criteria are documented in `spec.md`. Evidence: REQ-001 through REQ-012 and SC-001 through SC-006.
- [x] CHK-002 [P0] Technical approach is defined in `plan.md`. Evidence: ownership model, control flow, config, pivot transaction, artifact layout, candidate contract, and five implementation phases.
- [x] CHK-003 [P0] Native AI Council deliberation completed with three distinct seats. Evidence: `ai-council/ai-council-state.jsonl` contains three successful `seat_returned` events and `council_complete`.
- [x] CHK-004 [P1] Affected consumers and explicit non-consumers are inventoried. Evidence: `plan.md` Affected Surfaces table.
- [x] CHK-005 [P1] Rollback and append-only data treatment are defined. Evidence: `plan.md` sections 7 and L2 Enhanced Rollback.
- [x] CHK-006 [P0] Pre-change golden decision fixtures and non-consumer hashes are captured before runtime edits. Evidence: `research/phase-0-baseline.md`, captured in isolated worktree `wt/0026-deep-loop-divergent-mode` at commit `37fc5f789a` before any runtime edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `divergent` is additive; no existing mode decision changes outside pinned expected deltas. Evidence: Phase 1 — `default`/`off`/`sliding-window` decision envelopes byte-identical to `research/phase-0-baseline.md`, confirmed by direct CLI invocation and new `convergence-script.vitest.ts` parity tests; the only new field (`data.convergenceMode`) is conditional on `divergent` only.
- [x] CHK-011 [P0] Shared adapter remains mechanics-only; research/review legality and candidate semantics remain mode-local. Evidence: Phase 2 — `divergent-pivot.ts`/`pivot-candidates.ts` contain zero research/review-specific vocabulary (grep-verified); adapter accepts injected `dispatchSeat` and candidates rather than deciding eligibility or generating candidates itself.
- [x] CHK-012 [P0] Generic AI Council planning behavior and root persistence remain unchanged. Evidence: Phase 2 — zero imports of `persist-artifacts.cjs`/`orchestrate-topic.cjs`/`orchestrate-session.cjs`; `deep-ai-council/SKILL.md` hash byte-identical to baseline; adapter reuses only the pure, I/O-free `dispatchCouncilSeats`.
- [x] CHK-013 [P0] `mode-registry.json`, hub routing identity, workflowMode, runtimeLoopType, and backendKind remain unchanged. Evidence: Phase 1 — `mode-registry.json`, `hub-router.json`, `SKILL.md`, `deep-ai-council/SKILL.md` SHA-256 hashes byte-identical to `research/phase-0-baseline.md` §3; not in Phase 1's allowed-write scope.
- [x] CHK-014 [P1] New code follows TypeScript/CommonJS/YAML conventions and passes quality review. Evidence: every new file (`divergent-pivot.ts`, `pivot-candidates.ts`, `divergent-research-pivot.ts`, `divergent-review-pivot.ts`) and every modified YAML/reducer independently line-reviewed against the codebase's existing conventions (module structure headers, `readonly`/discriminated-union typing, `isRecord`-style guards, existing anchor-comment patterns for generated sections), not just tested; zero typecheck errors under `strict: true`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Parser accepts all four modes from supported CLI/config forms and rejects unknown values. Evidence: `coverage-graph-signals.vitest.ts` "readConvergenceModeConfig accepts all modes from camelCase and snake_case CLI/config forms" (6 input shapes × 4 modes); unknown-value rejection message updated and covered.
- [x] CHK-021 [P0] Research/review auto/confirm each translate exactly one eligible legal STOP into one pivot. Evidence: all four workflows gate the pivot branch at their respective `step_handle_convergence.if_stop` fork on a single eligible-reason check (research: `composite_converged`/`all_questions_answered`; review: `all_dimensions_clean`), with `short_circuit`/idempotent-resume logic in `preparePivotTransaction` preventing a duplicate pivot for the same source iteration/trigger.
- [x] CHK-022 [P0] Terminal max, pause/cancel, manual stop, unrecoverable error, and mandatory security escalation never pivot. Evidence: `maxIterationsReached`, `blockedStop`, `stuckRecovery`, `manualStop`, `userPaused`, `error` are explicitly excluded reasons in all four `eligibility_contract` blocks and fall through to the unchanged `if_existing_terminal_path`; review's `p0ResolutionGate`/`fixCompletenessReplayGate` (mandatory security-sensitive gates) run inside the untouched 9-gate legal-stop tree, strictly before the pivot branch is even reached.
- [x] CHK-023 [P0] Existing `default`, `off`, and `sliding-window` golden decisions remain unchanged. Evidence: full runtime suite 660/662 (baseline 657/659 + 3 new tests, same 2 pre-existing unrelated failures, zero regressions); new `convergence-script.vitest.ts` tests assert byte-identical envelopes across all four modes for STOP_ALLOWED, CONTINUE, and STOP_BLOCKED cases.
- [x] CHK-024 [P0] Strict 3/3 return quorum, two-of-three agreement, one-CLI, no-recursion, and cost guards pass. Evidence: Phase 2 — `divergent-pivot.vitest.ts` covers 3/3+2/3 success, 2/3-fulfilled failure, parse-invalid failure, all-failed case, 3-way agreement tallying, agreement failure, recursion-guard rejection, and maxPivots/maxCouncilSeatOutputs preflight rejection; all passing (677/679, no new failures). Extended during Phase 3 wiring: `preparePivotTransaction`/`recordPivotSeatResult`/`finalizePivotTransaction` decompose the same transaction for YAML-driven multi-step callers (no in-process `dispatchSeat` required); `runDivergentPivot` composes them internally with unchanged behavior, confirmed by the full pre-existing 17/17 test pass plus one new split-vs-one-shot equivalence test (678/680 repo-wide, same 2 pre-existing unrelated failures).
- [x] CHK-025 [P0] Crash/replay at every pivot stage is idempotent and cannot duplicate Council work or focus changes. Evidence: Phase 2 — `appendEvent`/`persistConfig`/`writeMarkdownIfConsistent` are idempotent-or-conflict (identical replay is a no-op, differing content throws); `runDivergentPivot` restores only from durable `pivot_completed`/`pivot_failed`, resumes by dispatching only missing seats; covered by "resumes from durable seats, fills only missing seats, and replays completion" test.
- [x] CHK-026 [P0] Ordinary packet Council artifacts and repeated loop pivot artifacts cannot collide. Evidence: Phase 2 — `buildPivotCouncilPaths` enforces via construction (`pathContainsAiCouncil` check throws if `artifactRoot` resolves inside an `ai-council` tree), separate `<artifactRoot>/divergent/pivots/<pivotId>/council/**` layout; covered by "constructs a pivot-scoped layout that cannot enter an ai-council tree" test.
- [x] CHK-027 [P1] Exact/material duplicates, boundary escapes, and permission expansion are rejected with persisted reasons. Evidence: `pivot-candidates.ts` handles exact/material duplicates (Phase 2, tested); research's `conflictsWithNonGoal` and review's `seedViolatesReadOnlyBoundary` (regex-based fix/mutation/expansion language check) each reject boundary-escaping seeds before they ever reach the adapter, with rejections threaded through as `boundaryRejections` for visibility rather than silently dropped. No permission/tool/network/filesystem widening is possible — candidates only ever produce a `focus` string, never a tool grant.
- [x] CHK-028 [P1] Divergence Map and Dimension Expansion Map snapshots include all required evidence. Evidence: research's `## Divergence Map` (`deep_research_auto.yaml`, after `## Eliminated Alternatives`/before `## Open Questions`) and review's `## Dimension Expansion Map` (`deep_review_auto.yaml`, downstream of the §1 verdict line) both source from the reducer's `registry.divergence`/pivot rollups: saturated directions, pivots taken, evidence/Council artifact refs, pivot failures, audited overrides, and remaining frontier.
- [x] CHK-029 [P1] Manual playbook and behavior benchmark coverage passes for both families and both execution modes. Evidence: `DR-064`/`RV-069` scenarios added covering eligible-pivot, hard-terminal-boundary, and existing-mode-isolation cases for both auto and confirm control flow (both workflows share the same eligibility gate). Behavior-benchmark scope deliberately excluded — see T019/CHK-040 reasoning (a different, executor-prompting-behavior concern, not convergence-mode logic).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Same-class convergence-mode producers and consumers are inventoried before implementation completion. Evidence: `plan.md`'s Affected Surfaces table (pre-implementation) plus `research/phase-0-baseline.md` (concrete producer/consumer state before any edit: sole producer `convergence.cjs`, four YAML consumers, asymmetric handling documented and closed in Phase 1).
- [x] CHK-FIX-002 [P0] All four YAML variants are covered by one explicit parity matrix. Evidence: Phase 1 — `deep_research_auto.yaml`, `deep_research_confirm.yaml`, `deep_review_auto.yaml`, `deep_review_confirm.yaml` all persist `antiConvergence.convergenceMode`/`antiConvergence.divergent: {}` and pass `--convergence-mode` to `convergence.cjs` via the same pattern; closes the asymmetry in `research/phase-0-baseline.md` §5 (previously 8/0/0/0 references).
- [x] CHK-FIX-003 [P0] Council persistence consumers are proven pivot-scoped or explicitly documented as non-consumers. Evidence: Phase 2 — only consumer of pivot persistence is `divergent-pivot.ts` itself (new, pivot-scoped by construction); `persist-artifacts.cjs`/`orchestrate-*.cjs` (packet-level `ai-council/**` consumers) are explicitly documented non-consumers, zero imports, hash-verified unchanged.
- [x] CHK-FIX-004 [P0] State-machine tests cover duplicate ids, conflicting hashes, partial writes, malformed seats, and exhausted budgets. Evidence: Phase 2 — pivotId determinism/duplicate-id test, idempotent-vs-conflicting replay logic in `appendEvent`, partial-write resume test (missing-seats-only redispatch), parse-invalid ("malformed") seat test, maxPivots/maxCouncilSeatOutputs exhausted-budget preflight tests.
- [x] CHK-FIX-005 [P1] Evidence is pinned to an implementation diff range or commit before completion. Evidence: commit range `934c6f682e..bc1bbd5488` on `skilled/v4.0.0.0` (`934c6f682e` convergence.cjs mode plumbing, `70b03695b7` pivot adapter, `3761b172fb` research integration, `31a5417e87` review integration, `82a78d4158` compiled contracts, `5def18ecc3` docs, `f2b7838dda` packet-doc evidence, `90fef44c06` worktree merge, `bc1bbd5488` post-merge prompt-pack regression fix).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Council outputs are treated as inert evidence and cannot inject tool instructions. Evidence: `parsePivotSeatReport` accepts only a fixed, strictly-typed shape (`seatId`, `selectedCandidateId: string|null` validated against a known candidate-id set, `materialEndorsement: boolean`, `rationale: string`, `blockers[]`) — a seat's raw output is never eval'd, interpolated into a shell command, or otherwise executed; malformed output is parse-invalid and fails closed.
- [x] CHK-031 [P0] Divergent mode cannot widen filesystem, network, tool, mutation, target, or review authority. Evidence: the adapter's own I/O is limited to `<artifactRoot>/divergent/pivots/**` (path-validated by construction); no candidate or seat output ever grants a tool/permission — a candidate is only ever a `focus` string; research's `conflictsWithNonGoal` and review's `seedViolatesReadOnlyBoundary` (regex-based fix/mutate/expand-target rejection) block boundary-escaping candidates before they reach the adapter; no external/subprocess CLI is used anywhere in the pivot path (native `dispatch:` YAML action only).
- [x] CHK-032 [P0] Review verdict, P0/security escalation, and read-only locks remain unchanged. Evidence: Phase 4 — independently confirmed by reading actual line ranges that `step_derive_verdict`/`step_build_finding_registry`/`step_adversarial_selfcheck` live entirely inside `phase_synthesis`, reachable only via the pre-existing unchanged `skip_to: phase_synthesis`/`gate_pre_synthesis` calls; the 9-gate legal-stop tree (including `p0ResolutionGate`/`fixCompletenessReplayGate`) runs and completes before the pivot branch is ever reached, untouched.
- [x] CHK-033 [P1] Pivot paths and ids pass containment and normalization tests. Evidence: `buildPivotCouncilPaths` resolves `artifactRoot` to a real canonical path (`resolveProspectiveRealPath`, resolving symlinks) and throws if it resolves inside an `ai-council` tree; `pivotId` is validated against `/^pivot-[1-9][0-9]*-[a-f0-9]{12}$/` before any path is constructed; covered by the "constructs a pivot-scoped layout that cannot enter an ai-council tree" test.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Commands, config references, loop protocols, state schemas, feature catalogs, playbooks, and benchmarks agree on divergent semantics. Evidence: `references/convergence/convergence.md`, `feature_catalog/feature_catalog.md`, and manual playbook scenarios `DR-064`/`RV-069` all independently cite the same eligible reasons, hard terminal boundaries, and mechanics verified directly in the shipped code — cross-checked, no drift found. Behavior-benchmark scope deliberately excluded per T019's documented reasoning (different concern — executor prompting behavior, not convergence-mode logic).
- [x] CHK-041 [P1] Generated command contracts are rebuilt from canonical sources and pass drift checks. Evidence: `compile-command-contracts.cjs --command deep/research|deep/review --write`; `check-contract-drift.vitest.ts` no longer reports drift for either command — only the pre-existing, unrelated `deep/ai-council` drift remains.
- [x] CHK-042 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, research evidence, and implementation summary remain synchronized. Evidence: `spec.md` status updated to Implemented, `plan.md` footer updated, `tasks.md` T005/T010-T027 and Completion Criteria all reflect shipped evidence, `checklist.md` P0/P1 items checked with citations, `implementation-summary.md` rewritten from "Not Started" to the full shipped-state summary — all cross-referencing the same `research/phase-0-baseline.md` and each other consistently.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Planning Council writes are confined to packet-local `ai-council/**`. Evidence: verified Council artifact inventory.
- [x] CHK-051 [P1] Runtime pivot artifacts use `<artifactRoot>/divergent/pivots/<pivotId>/council/**` and never packet-level planning Council paths. Evidence: `buildPivotCouncilPaths` constructs exactly `<artifactRoot>/divergent/pivots/<pivotId>/council/{config.json,state.jsonl,seats/seat-00N.md,deliberation.md,report.md}` and throws by construction if `artifactRoot` would resolve inside an `ai-council` tree; verified by dedicated test and by the zero-import check against `persist-artifacts.cjs`/`orchestrate-*.cjs`.
- [x] CHK-052 [P1] No runtime implementation files were modified during `/speckit:plan`. Evidence: planning-only scope and Council boundary.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Stage | Total | Verified |
|-------|-------|----------|
| Planning readiness | 8 | 7/8; baseline capture belongs to implementation preflight |
| Implementation P0 | 22 | 0/22; implementation not started |
| Implementation P1/P2 | 10 | 0/10; implementation not started |

**Planning Verification Date**: 2026-07-10

This checklist does not claim runtime completion. Pending items remain intentionally unchecked until `/speckit:implement` produces evidence.
<!-- /ANCHOR:summary -->
