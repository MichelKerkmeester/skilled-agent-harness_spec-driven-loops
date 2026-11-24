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

# Deep Review Strategy - Session Tracking Template

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
`specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec folder, Level 2). The advisor must offer `/deep:review` or `/deep:research` on an explicit loop ask and on no other wording, and the closure docs must agree with the tree.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Whether the advisor is fast, or how it scores a prompt the packet never names.
- Files outside `review-scope-files.txt`; a defect there is recorded under Edge Cases, not as a finding.
- Gate classification of protocol results: the reducer assigns `hard` to `spec_code` and `checklist_evidence` and `advisory` to the overlays.
- Terminal gates: the orchestrator computes them after the run, so a lineage writes no `terminal_gates` row.

---

## 5. STOP CONDITIONS
- `maxIterations` 7 reached (stop policy is `max-iterations`, so convergence is telemetry only).
- Every configured dimension covered, with `spec_code` and `checklist_evidence` finished.

---

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Naming a symbol and reading its cited line, rather than reading whole files: 53 REQ symbols cleared in one pass, and the five newest landed on the exact lines their AC rows cite (iteration 1).
- Running the citation checker (iteration 1) and reading the reducer's own output for iteration 1: the registry entry it wrote showed the field loss finding 2 reports, which no test would have surfaced (iteration 2).
- Tracing a claim to the branch that implements it instead of the file that mentions it: the read-only and run-refused exceptions sit on both branches of `attachCommand` (iteration 2).
- Diffing two paths that share one helper: the CLI and the hook brief both call `trackedCommandForOwner`, and the difference in what each does with its result is the security finding (iteration 3).
- Reading the module README's rule sentence beside the code branch it describes: the drift is invisible from either side alone (iteration 4).

---

## 9. WHAT FAILED
- Treating a count an AC row states as "the final tree" without comparing it with the tree: four rows still say `cases=359` while the fixture holds 368 (iteration 1, finding R1-P2-001).
- Trusting the reducer's registry as the whole record: it stores nulls where the narrative carries values, and nothing warns (iteration 2, finding R2-P1-001).
- Reading a shared-helper call site as agreement: both paths call it, but only one uses the policy it returns (iteration 3, finding R3-P1-001).
- Reading the drift guard's excuse list as coverage: the guard compares vocabularies and patterns, not the code that consumes them (iteration 4, ruled out after reading the slice).

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### **A `false_offer_attached` regression behind the 1-of-57 reading** -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **A `false_offer_attached` regression behind the 1-of-57 reading**
- Why ruled out: ruled out: the one row is the V7 near-miss the packet records as an intended outcome, and the pre-packet subset is the 0 the row claims.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A blind test that would catch finding R3-P1-001** -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A blind test that would catch finding R3-P1-001**
- Why ruled out: ruled out: the one ownership test uses a row whose child policy equals the tracked policy.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A dangling or absolute path in the review scope** -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **A dangling or absolute path in the review scope**
- Why ruled out: ruled out: 77 of 77 resolve, none is absolute.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A divergence between the native and fallback prompt heads** -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A divergence between the native and fallback prompt heads**
- Why ruled out: ruled out: both cut at 10,000 UTF-16 units.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A doctor row surviving on a run-refusing stuck complaint** -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **A doctor row surviving on a run-refusing stuck complaint**
- Why ruled out: ruled out: the stuck branch returns `undefined` when `isRunRefused` holds (`command-attach.ts:1653`), and `withholdDeepLoopDoctorWithoutRun` reads the same predicate.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A later merge that restores finding R2-P1-001's fields** -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A later merge that restores finding R2-P1-001's fields**
- Why ruled out: ruled out: the narrative finding is skipped before any merge runs.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A missing `dist` rebuild as the cause of the stale count** -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **A missing `dist` rebuild as the cause of the stale count**
- Why ruled out: ruled out: the count comes from the fixture, which the Python suite reads directly; no built artifact is involved.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A missing symbol behind any of the newest nine REQs** -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **A missing symbol behind any of the newest nine REQs**
- Why ruled out: ruled out by direct read of every named symbol at its cited line.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A missing ticked task behind the newest round** -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A missing ticked task behind the newest round**
- Why ruled out: ruled out: T115 to T122 each name a tree artefact that exists, including the three new fixture-row families and the two new unit cases.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A no-edit clause withholding a read-only loop** -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **A no-edit clause withholding a read-only loop**
- Why ruled out: ruled out on both branches by `READ_ONLY_LOOP_MODES` (`command-attach.ts:1676`).
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A one-sided gate-pattern edit outside the guard's slice** -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A one-sided gate-pattern edit outside the guard's slice**
- Why ruled out: ruled out by reading: no pattern compiled before `_DEFECT_CHECK_PATTERN` is referenced inside the gate slice.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A P0 behind the two P1s** -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A P0 behind the two P1s**
- Why ruled out: ruled out on re-read: neither defect can produce a wrong command, a lost run or a security breach in one step; both degrade a record or a rendering.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A scope gap behind T111** -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A scope gap behind T111**
- Why ruled out: ruled out: the two unmatched section-3 paths are directory entries for regenerated output.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A secret or credential surface in the changed code** -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **A secret or credential surface in the changed code**
- Why ruled out: ruled out by reading: the packet's code reads the prompt string and static command tables only, matching NFR-S02.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A stale `Met` row outside the count class** -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A stale `Met` row outside the count class**
- Why ruled out: ruled out for the rows I re-checked by their own artefacts; the remaining rows rest on run records this review cannot re-execute, which is recorded as scope, not as a pass.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A stale module import claim in the README** -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A stale module import claim in the README**
- Why ruled out: ruled out: the file has exactly one import.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A third stale count in the run-record rows** -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **A third stale count in the run-record rows**
- Why ruled out: ruled out by reading each row's artefact; the numbers that differ from the final tree are the two already filed.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A typed command surviving on an untracked command string** -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **A typed command surviving on an untracked command string**
- Why ruled out: ruled out: `typedCommandForTop` skips a command that is not a key of `TRACKED_COMMANDS` (`command-attach.ts:328`).
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The `cases=359` line as a code defect** -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **The `cases=359` line as a code defect**
- Why ruled out: ruled out: the fixture and both suites agree; only four narrative cells state the older count, so the defect is in the record, not the gate.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The `policy` field's type being unvalidated into a non-string** -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The `policy` field's type being unvalidated into a non-string**
- Why ruled out: ruled out at the boundary: `parseRecommendations` keeps only a non-empty string, so the defect is the value's authority, not its type.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The implicit-clause defect the question rule could have** -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The implicit-clause defect the question rule could have**
- Why ruled out: ruled out: `questionClause` bounds the count with `QUESTION_CLAUSE_END` before `ITERATION_COUNT` tests it, so a count in a later clause cannot reach the test.
- Reopen when: a later iteration carries evidence that contradicts that pass.

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
## 12. NEXT FOCUS
- None. The run reached its seventh and final iteration. The active set is two P1 and three P2 findings, so the run's verdict is `CONDITIONAL` and the next step is remediation, not another review angle.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
The continuity ladder found `handover.md` absent, no `_memory.continuity` block in a handover, and the packet docs as the only prior context. `steer.md` is absent in this lineage.

### Bounded Context Snapshot

Populated during initialization. Pointer-based and scoped to the declared review target:

- Target pointers: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md`, `timeline.md` in the packet, and the 77 files of `review-scope-files.txt` (the advisor runtime, the two deep commands, the deep-loop hub and the reducer).
- Behavior claims: the `REQ-001` to `REQ-059` rows and `AC-001` to `AC-067` rows; `SC-001` to `SC-006`; the `T001` to `T122` task list including the thirteenth round (`T115` onward).
- Reuse and conventions: the deep-loop gate exists twice (TypeScript `command-attach.ts` and Python `skill_advisor.py`) and both must agree; the shared fixture `tests/fixtures/deep-loop-offer-cases.json` is read by both suites; the reducer owns the registry.
- Review risks and gaps: the probe rerun needs a rebuilt `dist` that this review may not produce; the corpus recapture was last run on an earlier round; `AC-040` is `Unmet` by design and `T084` is open.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 7 | finished: every REQ-named symbol resolves at its cited line, every waiver names an existing ADR, and the newest nine requirements are implemented in both gate copies |
| `checklist_evidence` | core | partial | 7 | swept to completion: 121 of 122 ticks re-checkable and backed, every evidence tail resolves, run-record rows reproduce; partial on two stale count classes (R1-P2-001, R5-P2-001) |
| `skill_agent` | overlay | pending | - | read as context in iterations 1 and 5; no protocol result recorded |
| `agent_cross_runtime` | overlay | pending | - | not examined in this lineage |
| `feature_catalog_code` | overlay | pending | - | read as context in iteration 4; no protocol result recorded |
| `playbook_capability` | overlay | pending | - | read as context in iterations 4 and 5; no protocol result recorded |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
The 77 scope files are listed in `deep-review-config.json` `reviewScopeFiles`. The load-bearing ones are tracked below; the rest are the command, hub and test surfaces they name.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/README.md` | D4 | 4 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts` | D2 | 3 | 0 P0, 1 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1, D2, D3 | 3 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | D1, D3 | 2 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` | D3 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | D1, D3 | 2 | 0 P0, 1 P1, 0 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7 (`stopPolicy: max-iterations`, so convergence is telemetry only)
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-2-1795556727682-axtzf8, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-24T21:46:40Z
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
