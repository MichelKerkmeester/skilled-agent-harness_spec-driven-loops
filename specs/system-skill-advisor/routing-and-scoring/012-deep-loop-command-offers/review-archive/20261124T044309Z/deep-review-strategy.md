---
title: Deep Review Strategy
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - Session Tracking

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
Review: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). The deep-loop command offer: the advisor attaches `/deep:review` or `/deep:research` with policy `ask` only when a prompt asks for the loop itself, in the native gate (`command-attach.ts`) and the Python fallback (`skill_advisor.py`), plus packet 013's typed-command hint on the hook head (`render.ts` and the CLI fallback).

Operator focus: The deep-loop offer gate in command-attach.ts and the Python fallback in skill_advisor.py, plus the typed-command hint from packet 013.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

A configured custom dimension, such as `performance`, gets its own line after D4, in configured order.

---

## 4. NON-GOALS
- Re-reporting the seven known limitations recorded in the 012 implementation-summary (see Known Context) as new findings, unless new evidence makes one worse.
- Scorer lane weighting outside the deep-loop offer path.
- Prose style of docs, unless a doc contradicts the code.
- Fixing anything: the review target is read-only.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: exactly 5 iterations run, and convergence is telemetry only.
- Halt on 3 consecutive failed iterations.
- Halt when the 120-minute duration budget is spent.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
None yet.
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
None yet.

---

## 9. WHAT FAILED
None yet.

---

## 10. EXHAUSTED APPROACHES (do not retry)
None yet.

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS
None yet.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: correctness
- Files: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json`
- Why: the offer gate is the packet's core behaviour, and the TS and Python copies must agree.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
Prior work, from the 012 continuity block and implementation-summary: five fix rounds closed, merged to main as `54322bd4bbe`. Merged-tree evidence: vitest 180 files 2735 passed 0 failed, Python `pass=130, fail=0` with 118 shared cases, TS/Python predicate drift 0 of 227, 69 probes 0 changes.

Known limitations already recorded (do not re-report as new unless new evidence makes one worse):
1. Blind -04 holdouts score 2 of 3 ("dig into" is not a research cue).
2. The `/deep:*` argument hints exceed the 140-character soft budget.
3. "Write a memo on" is not read as writing about a topic.
4. The multi-round research alias also catches a memo about research funding (ADR-002, kept).
5. The F6 session asks the offer only some of the time (AC-008 waived, ADR-003).
6. A typed `/deep:review` on a stuck run keeps the typed command on the head (operator confirmed 2026-11-23).
7. "Skip the deep review" is not read as a refusal, and "multi-pass compiler design review" offers the loop.

Observed after closure, not yet recorded: the prompt "Deep review status" got `/deep:review (ask)` from the live hook, which is a status question rather than a run ask.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
All protocols pending.

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/changelog/skilled/v4.2.0.0.md` | - | - | - | pending |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | - | - | - | pending |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | - | - | - | pending |
| `.skilled/commands/deep/research.md` | - | - | - | pending |
| `.skilled/commands/deep/review.md` | - | - | - | pending |
| `.skilled/hooks/injection-contract.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-head-length.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/plan.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/plan.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/spec.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/tasks.md` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-24T04:30:47.974Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-24T04:30:47.974Z
- Stop policy: max-iterations
- Executor: native (opus)
<!-- MACHINE-OWNED: END -->

---
