---
title: Deep Review Strategy - 007-overlay-framework-root-layout (lineage opus-medium)
description: Session tracking for the follow-up deep review of the overlay framework-root layout change and its remediation.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - 007-overlay-framework-root-layout (fan-out lineage opus-medium)

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
Follow-up review (generation 2 of the root fan-out) of `specs/system-skilled-doctor/007-overlay-framework-root-layout` after remediation. Verify that the 16 findings of the previous generation (2 P1, 14 P2) are fixed without regression, then re-review the whole change: the overlay engine (`.skilled/commands/doctor/scripts/overlay-engine.cjs`), doctor docs, and the read-only nested Barter repository `barter/ai-speckit` (commits 64cfee51628..e63bd038a5d). Frontier scope for this lineage: F-1-001, F-1-003, F-1-005, F-1-007.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not implementing fixes; review only.
- Not reviewing unrelated Skilled subsystems beyond the doctor overlay engine, its docs, and the Barter overlay surfaces.
- Not re-running repo tooling that writes outside the lineage (validate.sh, generate-context.js, git writes).

---

## 5. STOP CONDITIONS
- All four frontier nodes reviewed across their applicable dimensions and the prior-generation findings each adjudicated fixed or still open.
- Legal convergence per the workflow convergence check, or maxIterations=24.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 10
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Snapshot-equality reading of the relayout failure tests plus a targeted test rerun confirmed R1-P1-001 fixed (iteration 1)
- Comparing every printed engine line with the doc that names it found the next-step row contradiction (iteration 2)
- git grep across both repositories with history paths excluded isolated the one live barter-overlays leftover (iteration 3)
- Rerunning the cited test suites and checking git ancestry turned record claims into evidence (iteration 4)
- A temp git repository with an env-printing hook, then the strict-writes fixture run with and without GIT_DIR, reproduced R5-P1-001 end to end (iterations 5-6)
- A posture map per hook (fail open vs fail closed) separated design choices from defects (iteration 7)
- Running the new rollback tests against the engine before 3aab896957e proved they guard the fix: 3 of 3 fail (iteration 16)
- Function-level reading of the code outside relayoutUnderLock's try block found R14-P2-001 during stuck recovery (iteration 14)

---

## 9. WHAT FAILED
- Hook vs engine fallback mismatch looked like a fail-open but the engine call fails closed behind it (iteration 3)
- A refines row whose severity differs from its target rewrites the target's severity: R9-P2-001 lowered R5-P1-001 to P2 (iteration 9, repaired at 16)
- A claim packet merged into a delta row with a `type` key overwrote the row's `type:"finding"`, and the reducer skipped it (iteration 15, repaired at 16)
- Recording core protocols as fail for doc-to-code drift blocked the stop on a gate that measures spec-to-code alignment (iteration 15, re-adjudicated at 17)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `skilled-barter-overlays` spec-track name in sk-git ROUTER.md and SKILL.md: a track name, not the folder. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skilled-barter-overlays` spec-track name in sk-git ROUTER.md and SKILL.md: a track name, not the folder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skilled-barter-overlays` spec-track name in sk-git ROUTER.md and SKILL.md: a track name, not the folder.

### A 039 claim with no evidence behind it: none found. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: A 039 claim with no evidence behind it: none found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A 039 claim with no evidence behind it: none found.

### A real change in R5-P1-001's evidence between iterations 5 and 9: none; the drop was a recording artifact. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: A real change in R5-P1-001's evidence between iterations 5 and 9: none; the drop was a recording artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A real change in R5-P1-001's evidence between iterations 5 and 9: none; the drop was a recording artifact.

### A record count that the live tree no longer reproduces: all four reruns match. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A record count that the live tree no longer reproduces: all four reruns match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A record count that the live tree no longer reproduces: all four reruns match.

### A secret pasted into a record: none found. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: A secret pasted into a record: none found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A secret pasted into a record: none found.

### A spec REQ the code misses: none. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: A spec REQ the code misses: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A spec REQ the code misses: none.

### Blocked merge left unrecorded: T002 names it and its resolution. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Blocked merge left unrecorded: T002 names it and its resolution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blocked merge left unrecorded: T002 names it and its resolution.

### Changelog and spec hits for barter-overlays (`overlays/framework/changelog/skilled-coder/v4.1.0.0.md`, `specs/skilled-barter-overlays/`): history, out of scope by the node question. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Changelog and spec hits for barter-overlays (`overlays/framework/changelog/skilled-coder/v4.1.0.0.md`, `specs/skilled-barter-overlays/`): history, out of scope by the node question.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog and spec hits for barter-overlays (`overlays/framework/changelog/skilled-coder/v4.1.0.0.md`, `specs/skilled-barter-overlays/`): history, out of scope by the node question.

### Docs claiming relayout applies by itself: the workflow runs apply as a second call (`.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:105`), and the engine prints "run ... apply" (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6557`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Docs claiming relayout applies by itself: the workflow runs apply as a second call (`.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:105`), and the engine prints "run ... apply" (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6557`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Docs claiming relayout applies by itself: the workflow runs apply as a second call (`.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:105`), and the engine prints "run ... apply" (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6557`).

### Docs recommending an unsafe bypass: bypasses are printed only beside the refusal and name the variable exactly. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Docs recommending an unsafe bypass: bypasses are printed only beside the refusal and name the variable exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Docs recommending an unsafe bypass: bypasses are printed only beside the refusal and name the variable exactly.

### Double-counted created folders across moves: missingRelayoutParents runs per move after earlier mkdirs (`:6517`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Double-counted created folders across moves: missingRelayoutParents runs per move after earlier mkdirs (`:6517`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Double-counted created folders across moves: missingRelayoutParents runs per move after earlier mkdirs (`:6517`).

### Ephemeral ids in the remediation's code comments: none found. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Ephemeral ids in the remediation's code comments: none found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ephemeral ids in the remediation's code comments: none found.

### git-write gate failing open when the overlay folder moves: it refuses every write instead. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: git-write gate failing open when the overlay folder moves: it refuses every write instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: git-write gate failing open when the overlay folder moves: it refuses every write instead.

### Half-moved folder on manifest-plan refusal: refusal happens before the first rename (`:6482-6488`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Half-moved folder on manifest-plan refusal: refusal happens before the first rename (`:6482-6488`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Half-moved folder on manifest-plan refusal: refusal happens before the first rename (`:6482-6488`).

### Main-checkout commit gate bypass: git exports no GIT_DIR there (probe a), and the engine refuses (probe b, plain run). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Main-checkout commit gate bypass: git exports no GIT_DIR there (probe a), and the engine refuses (probe b, plain run).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Main-checkout commit gate bypass: git exports no GIT_DIR there (probe a), and the engine refuses (probe b, plain run).

### P2-to-P1 escalation for any active P2: no case reaches a broken tree or a bypassed gate. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: P2-to-P1 escalation for any active P2: no case reaches a broken tree or a bypassed gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P2-to-P1 escalation for any active P2: no case reaches a broken tree or a bypassed gate.

### Push claimed without evidence: origin/main contains b5a630c6efa. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Push claimed without evidence: origin/main contains b5a630c6efa.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Push claimed without evidence: origin/main contains b5a630c6efa.

### R5-P1-001 as unreachable in practice: worktrees are a documented ai-speckit workspace. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: R5-P1-001 as unreachable in practice: worktrees are a documented ai-speckit workspace.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R5-P1-001 as unreachable in practice: worktrees are a documented ai-speckit workspace.

### Rollback tests that would pass without the fix. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Rollback tests that would pass without the fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rollback tests that would pass without the fix.

### Stale engine line pointers in doctor docs: there are none. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Stale engine line pointers in doctor docs: there are none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale engine line pointers in doctor docs: there are none.

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
- Half-move on manifest-plan refusal: refusal precedes the first rename (iteration 1, overlay-engine.cjs:6482)
- Relayout-applies-itself doc claim: workflow runs apply second (iteration 2, doctor-overlay-apply.yaml:105)
- barter-overlays in changelogs/specs: history, out of scope (iteration 3)
- Push claimed without evidence: b5a630c6efa is on origin/main (iteration 4)
- Git-write gate failing open on lookup failure: it refuses every write (iteration 7, barter-git-write-gate.mjs:226)
- Secrets in the records: credential pattern scan clean (iteration 12)
- R5-P1-001 unreachable: worktrees are a documented ai-speckit workspace and core.hooksPath is shared (iteration 13)
- Escalating any P2 to P1: none reaches a broken tree or a bypassed gate (iteration 14)
- Rollback tests insensitive to the fix: 3 of 3 fail on the pre-fix engine (iteration 16)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none - Focus area: synthesis if the stop decision allows it - Reason: core protocols adjudicated - Rotation status: complete - Required evidence: stop decision Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior generation (archived at `review-archive/20261120T163142Z`) left 16 open findings: R1-P1-001 (relayout half-move), R2-P1-001 (commit gate skips when overlay folder absent), and P2s R3-P2-001, R3-P2-002, R12-P2-001, R14-P2-001, R2-P2-001 (x2), R8-P2-001, R1-P2-001 (x2), R13-P2-001, R13-P2-002, R6-P2-001, R11-P2-001, R4-P2-001. Remediation landed in phases 006 (engine), 007 (Barter fixes), 008 (push and re-pin). resource-map.md not present; skipping coverage gate.

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
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 24
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-opus-medium-1795192401900-xpt66n, parentSessionId=2026-11-20T16:33:02.758Z, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-20T16:35:46Z
<!-- MACHINE-OWNED: END -->

---
