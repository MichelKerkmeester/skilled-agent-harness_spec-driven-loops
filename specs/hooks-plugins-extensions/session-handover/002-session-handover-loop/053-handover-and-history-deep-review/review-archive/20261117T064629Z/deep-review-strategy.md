---
title: "Deep Review Strategy: session handover and history search"
description: "Live strategy for the five-iteration deep review of session handover logic and session history search across all runtimes."
trigger_phrases:
  - "handover deep review strategy"
importance_tier: normal
contextType: review
---
# Deep Review Strategy: session handover and history search

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC

Review of session handover logic and session history search across every runtime: `.skilled/hooks/session-handover/` (Claude, Codex, OpenCode, Pi and Vibe adapters, `lib/`, `bin/`, `history/`) and the `.skilled/bin/skilled-loop` wrapper. Target type: files. Executor: cli-claude-code, `claude-opus-5-5`, effort medium.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Editing any reviewed file: the target is read-only.
- Devin and DSH handover, which these folders do not implement; note only where shared code assumes them.
- Test files as review targets in their own right; they are cross-references for traceability.

---

## 5. STOP CONDITIONS

- Stop policy `max-iterations`: all 5 iterations run; convergence is telemetry only.
- Terminal pause sentinel, unrecoverable executor error or `maxDurationMinutes` (120) still stop the run.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
traceability

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

Prior deep reviews of overlapping code:
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/review/`: verdict CONDITIONAL, P0=0 P1=0 P2=7; its one P1 was a false positive.
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/review/`: earlier loop review; children 036 and later remediated findings.
- Child 052 (2026-11-16) changed `name_stem` in `.skilled/bin/skilled-loop` to strip every trailing number and reset `SKILLED_LOOP_HOPS` at launch.

### Bounded Context Snapshot
- Target pointers: the 49 source files in Files Under Review; tests under `.skilled/hooks/session-handover/tests/`.
- Behavior claims: `README.md`, `runtime-behavior.md`, `handoff-protocol.md`, `state-files.md`, `goal-carry-over.md`, `troubleshooting.md` in the hook folder.
- Reuse and conventions: one shared core in `lib/`, thin per-runtime adapters, `history/` as its own package.
- Review risks and gaps: no resource-map.md; Devin and DSH are out of this folder's scope.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/hooks/session-handover/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/bin/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/bin/history-lookup.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/claude/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/claude/handover-compact-pointer.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/claude/handover-context-nudge.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/claude/handover-stop-arm.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/claude/handover-subagent-guard.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/codex/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/codex/handover-compact-pointer.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/codex/handover-context-nudge.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/codex/handover-prompt-seed.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/codex/handover-stop-arm.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/codex/shared.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/goal-carry-over.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/handoff-protocol.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/cli.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/core.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/history-entry.schema.json` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/history.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/index.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/loads.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/locator-digest.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/navigator.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/pages.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/projection.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/lib/response.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/package.json` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/tsconfig.json` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/history/vitest.config.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/lib/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/lib/context-usage.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/lib/goal-handover.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/lib/hop-history.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/lib/killer.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/lib/nudge.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/lib/withdraw.cjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/opencode/session-handover.js` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/pi/README.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/pi/session-handover.ts` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/runtime-behavior.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/state-files.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/troubleshooting.md` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.skilled/bin/skilled-loop` | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-17T06:45:14Z, parentSessionId=2026-11-17T06:14:04Z, generation=2, lineageMode=restart
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-17T06:45:14Z
<!-- MACHINE-OWNED: END -->
