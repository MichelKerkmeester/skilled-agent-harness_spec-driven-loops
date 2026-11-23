---
title: Deep Review Strategy Template
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

# Deep Review Strategy - 016 Epic, Generation 3

Live strategy for the third five-pass review of the whole 016 epic, run after phase 028 fixed the second review's six P2 findings.

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
Review of the whole 016 pi-context-decisions epic, phases 001 to 028, as the code stands at HEAD. Target type: spec-folder. Focus: Review the code and docs the whole epic shipped across phases 001 to 028 as they stand at HEAD: pasted-reply stripping, crash fallback, route receipts, the Ollama and embedding lane removal and its residue tool, the doctor cleanup, the third-round fixes (bridge env parity, deep-loop offer gate, exclusion reload) and phase 028's fixes for the second review's six P2 findings (subprocess stdin guard, curly-apostrophe fold and ITERATION_COUNT comment in both offer-gate runtimes, child 007 to 010 statuses, receipt-guard catalog sources, 027 AC-006). Judge from code and tests; treat packet evidence and verdict tables as claims to check, not facts.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not a re-review of the earlier runs as such; they are archived under `review-archive/2026-11-23T05-50-33Z/` (generation 1) and `review-archive/2026-11-23T09-35-19Z/` (generation 2). Generation 2's six P2s are claims to recheck at HEAD, not findings to carry.
- Not the cut or research-only items in the epic spec (R1, R4, R6, R7, R8, N5, N6, N7).
- Not code outside the files the epic touched, except where a finding needs a caller or callee read.
- Not the deep-loop skill's own tooling (the reducer-generated resource map), which belongs to another packet.
- No fixes: the review target is read-only.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: all 5 iterations run; convergence is telemetry only.
- Halt on a P0 that needs operator attention before more passes.

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
- P1 (Required): 0
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Probing both offer gates with hand-written prompts (Python on source, native via dist) surfaced a shared gap the fixture misses (iteration 1)
- Running the targeted vitest files plus the Python fixture replay confirmed the 028 fixes cheaply (iteration 1)
- Comparing sibling state stores (route-receipt ownedFolder vs Vibe head receipt) exposed a missing folder-trust check (iteration 2)
- A timing probe on the built dist settled the pasted-strip ReDoS question in one call (iteration 2)
- One scripted pass over all 28 children's spec, graph and acceptance status found the stale child a named-instance fix missed (iteration 3)
- Rerunning goal and AC commands plus validate.sh --recursive --strict (about 42 s) checked packet claims cheaply (iteration 3)
- Grepping every caller of the exported offer-gate predicates, then probing dist and Python with a straight/curly pair, found the one predicate the fold fix missed (iteration 4)
- Grepping the shared fixture and both test suites for each vocabulary entry exposed branches no parity case guards (iteration 4)
- Rerunning validate.sh --recursive --strict plus the goal and 028 AC commands, and one paired-prompt probe over both runtimes, rechecked all seven P2s and settled checklist_evidence (iteration 5)

---

## 9. WHAT FAILED
- No TS runner (tsx) installed, so native probes rely on a possibly stale dist build (iteration 1)
- macOS has no `timeout` binary; run probes without it (iteration 2)
- Naive backtick-path resolution over catalog files flags many relative cross-links; resolve against the catalog root before reading hits (iteration 3)
- zsh does not word-split an unquoted variable of paths; wrap multi-file greps in bash -c (iteration 4)
- `${PIPESTATUS[0]}` after a `cd && npx vitest | tail` chain printed empty under zsh, so the goal-101 vitest exit was not captured (iteration 5)
- Exhausted-approach entries reuse generation 2's ids (R2-P2-001, R4-P2-001, R4-P2-002 "fixed"), which collide with this run's open findings of the same ids; match by title plus file:line (iteration 5)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### 003 graph status in_progress: explained by the recorded no-ship decision. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: 003 graph status in_progress: explained by the recorded no-ship decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 003 graph status in_progress: explained by the recorded no-ship decision.

### A phase 028 fix regressing: ruled out by the rechecks above. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A phase 028 fix regressing: ruled out by the rechecks above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A phase 028 fix regressing: ruled out by the rechecks above.

### Bridge env drift between launcher and Python bridge: none beyond the documented launcher-only keys. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Bridge env drift between launcher and Python bridge: none beyond the documented launcher-only keys.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Bridge env drift between launcher and Python bridge: none beyond the documented launcher-only keys.

### Comment hygiene violations in the epic's changed code: none. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Comment hygiene violations in the epic's changed code: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comment hygiene violations in the epic's changed code: none.

### Current native/Python drift on the untested vocabulary branches: none (six-prompt probe). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Current native/Python drift on the untested vocabulary branches: none (six-prompt probe).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Current native/Python drift on the untested vocabulary branches: none (six-prompt probe).

### Dangling cross-skill catalog links at advisor-recommend.md:31: targets exist in other skills and predate the epic. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Dangling cross-skill catalog links at advisor-recommend.md:31: targets exist in other skills and predate the epic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dangling cross-skill catalog links at advisor-recommend.md:31: targets exist in other skills and predate the epic.

### Doctor lane-cleanup wiring untested: ruled out by `doctor-update-contract.test.cjs:213-328`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Doctor lane-cleanup wiring untested: ruled out by `doctor-update-contract.test.cjs:213-328`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Doctor lane-cleanup wiring untested: ruled out by `doctor-update-contract.test.cjs:213-328`.

### Goal criterion 104 still failing: ruled out (29 PASSED, exit 0). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Goal criterion 104 still failing: ruled out (29 PASSED, exit 0).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Goal criterion 104 still failing: ruled out (29 PASSED, exit 0).

### Native probes reading a stale dist: ruled out by mtime. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Native probes reading a stale dist: ruled out by mtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Native probes reading a stale dist: ruled out by mtime.

### Native/Python drift on the 30 shared offer cases: none. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Native/Python drift on the 30 shared offer cases: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Native/Python drift on the 30 shared offer cases: none.

### R2-P2-001 (stdin write without error listener): fixed at HEAD working tree. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: R2-P2-001 (stdin write without error listener): fixed at HEAD working tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R2-P2-001 (stdin write without error listener): fixed at HEAD working tree.

### R4-P2-001 (curly apostrophe defeats loop-run ask): fixed in both runtimes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: R4-P2-001 (curly apostrophe defeats loop-run ask): fixed in both runtimes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R4-P2-001 (curly apostrophe defeats loop-run ask): fixed in both runtimes.

### R4-P2-002 (ITERATION_COUNT comment contradicts behavior): comment now matches probed behavior. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: R4-P2-002 (ITERATION_COUNT comment contradicts behavior): comment now matches probed behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R4-P2-002 (ITERATION_COUNT comment contradicts behavior): comment now matches probed behavior.

### Receipt-guard catalog naming only the Claude hook: fixed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Receipt-guard catalog naming only the Claude hook: fixed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Receipt-guard catalog naming only the Claude hook: fixed.

### ReDoS in the pasted-reply strip: ruled out by the timing probe. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: ReDoS in the pasted-reply strip: ruled out by the timing probe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: ReDoS in the pasted-reply strip: ruled out by the timing probe.

### Residue apply-mode deleting outside its roots or signalling a foreign process: ruled out by direct read of the containment and ownership guards. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Residue apply-mode deleting outside its roots or signalling a foreign process: ruled out by direct read of the containment and ownership guards.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Residue apply-mode deleting outside its roots or signalling a foreign process: ruled out by direct read of the containment and ownership guards.

### Route-receipt path traversal or symlink redirection: ruled out by direct read. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Route-receipt path traversal or symlink redirection: ruled out by direct read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Route-receipt path traversal or symlink redirection: ruled out by direct read.

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
- R2-P2-001, R4-P2-001, R4-P2-002 rechecked and fixed at HEAD working tree (iteration 1, evidence: subprocess.ts:249, command-attach.ts:478, skill_advisor.py:4559)
- Native/Python drift on the 30 shared offer cases: none (iteration 1)
- Pasted-strip ReDoS, launcher/bridge env drift, residue apply-mode escape or foreign-process signal, route-receipt traversal: all ruled out (iteration 2)
- 003 graph in_progress (recorded no-ship decision), cross-skill catalog links at advisor-recommend.md:31 (pre-epic, targets exist), receipt-guard catalog sources (fixed): ruled out (iteration 3)
- Comment-hygiene violations in scoped code, untested doctor lane-cleanup wiring, current native/Python drift on untested vocabulary branches: ruled out (iteration 4)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (iteration cap reached). Focus area: synthesis. - Reason: all four dimensions covered; core protocols spec_code and checklist_evidence pass; overlays feature_catalog_code and playbook_capability stay partial (advisory). - Rotation status: 4/4 dimensions covered. - Carry-forward: seven confirmed P2s; match by title plus file:line because of the id collision with generation 2. - Required evidence: none outstanding for the core gate. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Generation 2 (archived at `review-archive/2026-11-23T09-35-19Z/`) returned FAIL from the coverage gate and one open search-ledger row (env_parity), with 0 P0, 0 P1 and 6 P2: R2-P2-001 stdin write without an error listener, R3-P2-001 children 007 to 010 still Planned, R3-P2-002 receipt-guard catalog naming only the Claude hook, R3-P2-003 027 AC-006 grep not reproducing, R4-P2-001 curly apostrophe defeating the loop-run ask, R4-P2-002 ITERATION_COUNT comment contradicting behavior. Phase 028 (`028-second-epic-review-fixes/`) claims to fix all six; verify each at HEAD. Generation 2 never recorded the agent_cross_runtime overlay.

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
| `spec_code` | core | pass | 3 | 028 code fixes (iter 1) and doc-side claims (iter 3) hold at HEAD |
| `checklist_evidence` | core | pass | 5 | goal 102-106 and 028 AC-001..005 reproduce; goal 104 now 29/29 PASSED exit 0; goal 100 not rerun (daemon restart); 101 output-verified, exit not captured; R3-P2-001 is metadata drift that falsifies no checked row |
| `skill_agent` | overlay | notApplicable | 3 | epic changed no agent definition |
| `agent_cross_runtime` | overlay | notApplicable | 3 | no agent or agent mirror in scope; hook-adapter parity checked under spec_code |
| `feature_catalog_code` | overlay | partial | 3 | receipt-guard entry matches; pasted-reply entry under-names sources (R3-P2-003) |
| `playbook_capability` | overlay | partial | 3 | link resolution clean for epic changes; scenarios not executed |
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
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-23T09:35:31.105Z, parentSessionId=2026-11-23T05:51:03.170Z, generation=3, lineageMode=restart
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
