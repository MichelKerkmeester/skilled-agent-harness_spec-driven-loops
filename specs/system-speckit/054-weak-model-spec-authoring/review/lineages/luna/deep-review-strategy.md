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
version: 1.11.0.13
---

# Deep Review Strategy - Luna lineage

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
Review the phase parent, nine child phases, and named system-spec-kit implementation surfaces in `specs/system-speckit/054-weak-model-spec-authoring`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
No implementation fixes; findings only. Do not expand into `sk-prompt` or unrelated packets. Do not rerun benchmarks; inspect reported artifacts and their evidence.

---

## 5. STOP CONDITIONS
Hard stop after iteration 10. `max-iterations` makes convergence telemetry only; broaden the review angle each pass.

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
- P1 (Required): 2
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
Initial approach: reconcile canonical goal and phase evidence against the implementation surfaces (iteration 1).
- Comparing the contract, paired source paths, and parity test isolated two untested cases and ruled out the already fixed angle-token mismatch (iteration 2).

---

## 9. WHAT FAILED
No failed approach recorded yet.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A completion claim based only on the earlier failing benchmark sets: ruled out; the closeout evidence identifies the later fresh set as deciding and keeps earlier sets as history. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A completion claim based only on the earlier failing benchmark sets: ruled out; the closeout evidence identifies the later fresh set as deciding and keeps earlier sets as history.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A completion claim based only on the earlier failing benchmark sets: ruled out; the closeout evidence identifies the later fresh set as deciding and keeps earlier sets as history.

### A live parent-versus-phase-009 C5 contradiction: ruled out by the current PASS row in `scratch/closeout/criteria.txt:8`, AC-011/AC-015 marked Met, and the later progress entry in the parent goal. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A live parent-versus-phase-009 C5 contradiction: ruled out by the current PASS row in `scratch/closeout/criteria.txt:8`, AC-011/AC-015 marked Met, and the later progress entry in the parent goal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A live parent-versus-phase-009 C5 contradiction: ruled out by the current PASS row in `scratch/closeout/criteria.txt:8`, AC-011/AC-015 marked Met, and the later progress entry in the parent goal.

### AC-001 through AC-007 → task verification and implementation-summary evidence: PASS. The recorded outputs match the criteria for card length, router, inventory, checklist, task format, guard, and vocabulary check. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: AC-001 through AC-007 → task verification and implementation-summary evidence: PASS. The recorded outputs match the criteria for card length, router, inventory, checklist, task format, guard, and vocabulary check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: AC-001 through AC-007 → task verification and implementation-summary evidence: PASS. The recorded outputs match the criteria for card length, router, inventory, checklist, task format, guard, and vocabulary check.

### AC-008 → baseline metrics: PASS. baseline.json contains three rows; its values match the summary and goal log: strict pass 1, zero leftover tokens, zero missing anchors, zero out-of-scope writes, and 266, 143, and 203 seconds. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: AC-008 → baseline metrics: PASS. baseline.json contains three rows; its values match the summary and goal log: strict pass 1, zero leftover tokens, zero missing anchors, zero out-of-scope writes, and 266, 143, and 203 seconds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: AC-008 → baseline metrics: PASS. baseline.json contains three rows; its values match the summary and goal log: strict pass 1, zero leftover tokens, zero missing anchors, zero out-of-scope writes, and 266, 143, and 203 seconds.

### AC-009 → frontier review disposition: PASS. T014 contains eight finding lines; the goal log records each with an outcome and reason. The two card P1 items later received the documented 2026-10-24 amendment. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: AC-009 → frontier review disposition: PASS. T014 contains eight finding lines; the goal log records each with an outcome and reason. The two card P1 items later received the documented 2026-10-24 amendment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: AC-009 → frontier review disposition: PASS. T014 contains eight finding lines; the goal log records each with an outcome and reason. The two card P1 items later received the documented 2026-10-24 amendment.

### Benchmark result → current C5 status: PASS. `criteria.txt` labels the first three C5 sets as history and the second fresh set as the deciding PASS; the implementation summary preserves the earlier failures as limitations. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Benchmark result → current C5 status: PASS. `criteria.txt` labels the first three C5 sets as history and the second fresh set as the deciding PASS; the implementation summary preserves the earlier failures as limitations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Benchmark result → current C5 status: PASS. `criteria.txt` labels the first three C5 sets as history and the second fresh set as the deciding PASS; the implementation summary preserves the earlier failures as limitations.

### Card allowed-write statement to tracked scaffold behavior: PARTIAL. The command-managed track-root metadata update is documented in the CLI README but not in the card. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Card allowed-write statement to tracked scaffold behavior: PARTIAL. The command-managed track-root metadata update is documented in the CLI README but not in the card.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Card allowed-write statement to tracked scaffold behavior: PARTIAL. The command-managed track-root metadata update is documented in the CLI README but not in the card.

### Parent completion criteria → phase 009 closeout: PASS. The parent marks its seven criteria complete; its progress log distinguishes three historical C5 failures from the later passing fresh set. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Parent completion criteria → phase 009 closeout: PASS. The parent marks its seven criteria complete; its progress log distinguishes three historical C5 failures from the later passing fresh set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent completion criteria → phase 009 closeout: PASS. The parent marks its seven criteria complete; its progress log distinguishes three historical C5 failures from the later passing fresh set.

### Phase 003 parity test → boundary coverage: PARTIAL. The test covers v2.3 Draft/Complete, v2.2 Draft, and open-question cases, but does not exercise indented fences or the shell-only title-token branch. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Phase 003 parity test → boundary coverage: PARTIAL. The test covers v2.3 Draft/Complete, v2.2 Draft, and open-question cases, but does not exercise indented fences or the shell-only title-token branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 003 parity test → boundary coverage: PARTIAL. The test covers v2.3 Draft/Complete, v2.2 Draft, and open-question cases, but does not exercise indented fences or the shell-only title-token branch.

### Phase 003 recorded legacy angle-token finding → current implementation: PASS. The current orchestrator only defers the exact bracketed `[YOUR_VALUE_HERE:` marker, and the phase goal records that the earlier angle-token mismatch was fixed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Phase 003 recorded legacy angle-token finding → current implementation: PASS. The current orchestrator only defers the exact bracketed `[YOUR_VALUE_HERE:` marker, and the phase goal records that the earlier angle-token mismatch was fixed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 003 recorded legacy angle-token finding → current implementation: PASS. The current orchestrator only defers the exact bracketed `[YOUR_VALUE_HERE:` marker, and the phase goal records that the earlier angle-token mismatch was fixed.

### Phase 003 REQ-002 → orchestrator and shell implementation: CONDITIONAL. The core lifecycle cells are represented in both, but the two parity gaps above remain. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Phase 003 REQ-002 → orchestrator and shell implementation: CONDITIONAL. The core lifecycle cells are represented in both, but the two parity gaps above remain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 003 REQ-002 → orchestrator and shell implementation: CONDITIONAL. The core lifecycle cells are represented in both, but the two parity gaps above remain.

### Phase 005 scope to card deliverable: PASS. The card is listed as the phase's primary artifact. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Phase 005 scope to card deliverable: PASS. The card is listed as the phase's primary artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 005 scope to card deliverable: PASS. The card is listed as the phase's primary artifact.

### Phase 009 acceptance criteria → closeout records: PASS. AC-001 through AC-015 are marked Met, the closure statement says all fifteen are Met, and `criteria.txt` records C1 through C7 PASS. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 009 acceptance criteria → closeout records: PASS. AC-001 through AC-015 are marked Met, the closure statement says all fifteen are Met, and `criteria.txt` records C1 through C7 PASS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 009 acceptance criteria → closeout records: PASS. AC-001 through AC-015 are marked Met, the closure statement says all fifteen are Met, and `criteria.txt` records C1 through C7 PASS.

### Phase completion state across acceptance criteria, goal, and implementation summary: PASS. The nine acceptance rows are Met, the goal completion checklist is checked, and the summary records Complete. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Phase completion state across acceptance criteria, goal, and implementation summary: PASS. The nine acceptance rows are Met, the goal completion checklist is checked, and the summary records Complete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase completion state across acceptance criteria, goal, and implementation summary: PASS. The nine acceptance rows are Met, the goal completion checklist is checked, and the summary records Complete.

### The previously reported `<YOUR_VALUE_HERE:` Draft deferral mismatch: ruled out by the current `match[0] === '[YOUR_VALUE_HERE:'` guard and phase 003 goal record. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The previously reported `<YOUR_VALUE_HERE:` Draft deferral mismatch: ruled out by the current `match[0] === '[YOUR_VALUE_HERE:'` guard and phase 003 goal record.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The previously reported `<YOUR_VALUE_HERE:` Draft deferral mismatch: ruled out by the current `match[0] === '[YOUR_VALUE_HERE:'` guard and phase 003 goal record.

### Track destination containment: FAIL. The raw track value reaches directory creation without canonical containment validation. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Track destination containment: FAIL. The raw track value reaches directory creation without canonical containment validation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Track destination containment: FAIL. The raw track value reaches directory creation without canonical containment validation.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
No directions ruled out yet.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: security - Focus area: inspect input validation and repository-path containment in the authoring-card scaffold command. - Reason: move from validator behavior to a user-controlled path construction surface. - Rotation status: correctness and security are covered; traceability and maintainability remain uncovered. - Blocked/productive carry-forward: the static contract-to-implementation comparison found two parity gaps; do not retry the fixed angle-token case. - Required evidence: command argument parsing, track/path composition, write destination checks, and the phase 005 authoring-card instructions. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Review context was loaded from parent and child packet docs plus a read-only inventory of the current packet.

### Bounded Context Snapshot

Seeded from the packet inventory. Keep review evidence tied to primary docs, implementation surfaces, and run artifacts:

- Target pointers: root `spec.md` and `goal.md`; child phases `001` through `009`; implementation files named in the phase scopes and parent Files to Change table.
- Behavior claims: versioned placeholder handling, per-section fill guidance, authoring-card routing, command/agent alignment, playbook coverage, and measured authoring outcomes.
- Reuse and conventions: the phase-child acceptance criteria and `system-spec-kit` scripts/templates define expected behavior.
- Review risks and gaps: reconcile stale generated metadata against canonical goal/spec evidence; the review coverage graph is omitted because its writer targets outside this lineage.

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
Scope is recorded at grouped packet level because the resolved scope spans 67 primary docs and implementation surfaces.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `specs/system-speckit/054-weak-model-spec-authoring/**` | - | - | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-1792949481267-fym7sk, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-25T17:41:36Z
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
