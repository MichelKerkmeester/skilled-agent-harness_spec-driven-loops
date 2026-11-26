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
specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers -- a Level 2 spec-folder target: the deep-loop command-offer packet, its sixth to ninth fix rounds, and the advisor gate copies they touch.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Accepted-risk decisions recorded in an existing ADR (ADR-001, ADR-002, ADR-003, ADR-007, ADR-008) are traced, not re-litigated.
- Implementation fixes are out of scope; this run reports findings only.
- Files outside the review scope file are evidence only, never finding targets.

---

## 5. STOP CONDITIONS
[Explicit conditions beyond convergence that should end the session -- populated during initialization]

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
- P1 (Required): 4
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the cited `path:line` and the symbol's real declaration side by side: exposed every stale evidence cell in one pass (iteration 1)
- Counting the fixture cases and vocabulary pairs directly instead of trusting the recorded numbers: separated stale counts from missing behavior (iteration 1)
- Replaying each task's `Verify:` command instead of reading its "Observed" sentence: found the task-level citation drift the acceptance rows hid (iteration 2)

---

## 9. WHAT FAILED
- Trusting the packet's own "observed on the final tree" cells as re-derivable evidence: four of them describe an earlier fixture (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "A child-supplied unknown command can reach the brief": ruled out by `trackedCommandForOwner` and the golden test at `tests/command-brief-golden.vitest.ts:353-380`. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "A child-supplied unknown command can reach the brief": ruled out by `trackedCommandForOwner` and the golden test at `tests/command-brief-golden.vitest.ts:353-380`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A code comment carries an ephemeral label": ruled out by a search of the changed modules for `REQ-`, `ADR-` and `specs/` in comment lines. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "A code comment carries an ephemeral label": ruled out by a search of the changed modules for `REQ-`, `ADR-` and `specs/` in comment lines.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A negated symptom still reads as a stuck run": ruled out. The symptom pattern carries a negation lookbehind and the fixture row for REQ-018 reads as a run. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "A negated symptom still reads as a stuck run": ruled out. The symptom pattern carries a negation lookbehind and the fixture row for REQ-018 reads as a run.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A new class is worth opening at the cap": ruled out. The cap gives no iteration to substantiate a new finding, and the persona forbids speculative findings. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "A new class is worth opening at the cap": ruled out. The cap gives no iteration to substantiate a new finding, and the persona forbids speculative findings.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A P1 could be raised to `pass` from a re-read": ruled out. The contradicted text and the contradicting code were both re-read this pass and are unchanged, so the honest terminal status is `partial` for both core protocols. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "A P1 could be raised to `pass` from a re-read": ruled out. The contradicted text and the contradicting code were both re-read this pass and are unchanged, so the honest terminal status is `partial` for both core protocols.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A probe artifact is missing": ruled out. Every file the tasks cite under `scratch/probes/` exists, and each result file holds the 69 rows it claims. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "A probe artifact is missing": ruled out. Every file the tasks cite under `scratch/probes/` exists, and each result file holds the 69 rows it claims.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A prompt can inject argv through the compiled-route probe": ruled out; the prompt is stdin-only and the argv list is fixed. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "A prompt can inject argv through the compiled-route probe": ruled out; the prompt is stdin-only and the argv list is fixed.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A refusal is lost when a typed command is also present": ruled out. `typesThisCommand` only bypasses the wording gate for the command actually typed, and `commandOnlyMentioned` still drops a refused naming (`command-attach.ts:1616`, `:1646`). -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "A refusal is lost when a typed command is also present": ruled out. `typesThisCommand` only bypasses the wording gate for the command actually typed, and `commandOnlyMentioned` still drops a refused naming (`command-attach.ts:1616`, `:1646`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A refusal or no-edit phrase can be bypassed by a typed command": ruled out. The typed command only bypasses the wording gate for itself, and `commandOnlyMentioned` still drops a refused naming (`command-attach.ts:1616-1618`, `:1646`). -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "A refusal or no-edit phrase can be bypassed by a typed command": ruled out. The typed command only bypasses the wording gate for itself, and `commandOnlyMentioned` still drops a refused naming (`command-attach.ts:1616-1618`, `:1646`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A REQ-035 to REQ-044 prompt is missing from the fixture": ruled out by a prompt-by-prompt lookup -- every one resolves, with its column. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "A REQ-035 to REQ-044 prompt is missing from the fixture": ruled out by a prompt-by-prompt lookup -- every one resolves, with its column.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The checklist summary is miscounted": ruled out. Twelve P0 boxes, eleven checked, with CHK-020 the single open one; thirteen P1 and one P2 all checked. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "The checklist summary is miscounted": ruled out. Twelve P0 boxes, eleven checked, with CHK-020 the single open one; thirteen P1 and one P2 all checked.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The mode vocabulary is out of sync with the hub router": ruled out. The guard compares `MODE_CUES`, `MODE_CUE_WORDS` and `hub-router.json` `routerSignals` on the same sorted mode list (`deep-loop-offer-cases.vitest.ts:487-492`). -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The mode vocabulary is out of sync with the hub router": ruled out. The guard compares `MODE_CUES`, `MODE_CUE_WORDS` and `hub-router.json` `routerSignals` on the same sorted mode list (`deep-loop-offer-cases.vitest.ts:487-492`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The no-edit guard withholds a read-only loop": ruled out by the routed and deferred branches, each sparing `READ_ONLY_LOOP_MODES`. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The no-edit guard withholds a read-only loop": ruled out by the routed and deferred branches, each sparing `READ_ONLY_LOOP_MODES`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The sixth-round refusal logic is missing": ruled out. `RUN_ASK_REFUSAL_LEADS` (`command-attach.ts:688`) builds the negation pattern (`:736`) and the fixture carries twelve refusal-verb rows, all reading `asksForLoopRun: false` where they should. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "The sixth-round refusal logic is missing": ruled out. `RUN_ASK_REFUSAL_LEADS` (`command-attach.ts:688`) builds the negation pattern (`:736`) and the fixture carries twelve refusal-verb rows, all reading `asksForLoopRun: false` where they should.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The two gate copies have drifted on a vocabulary list": ruled out on the lists the guard compares; a scratch edit to one copy fails the guard by design (`tests/deep-loop-offer-cases.vitest.ts:448-460`). -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "The two gate copies have drifted on a vocabulary list": ruled out on the lists the guard compares; a scratch edit to one copy fails the guard by design (`tests/deep-loop-offer-cases.vitest.ts:448-460`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The typed-on-stuck exception is unrecorded": ruled out. ADR-005 (`decision-record.md:412`) records it, the fixture row carries `typedReviewKept: false` with `servedReviewKept: true` (`deep-loop-offer-cases.json:123`), and `typed-on-stuck-serving.vitest.ts:112` pins the served head. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "The typed-on-stuck exception is unrecorded": ruled out. ADR-005 (`decision-record.md:412`) records it, the fixture row carries `typedReviewKept: false` with `servedReviewKept: true` (`deep-loop-offer-cases.json:123`), and `typed-on-stuck-serving.vitest.ts:112` pins the served head.
- Why ruled out: One pass of evidence did not support this direction.
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
[No direction ruled out yet]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. The run reached its iteration cap and synthesis is complete. Registry: 0 P0, 4 P1, 8 P2. Terminal stop: maxIterationsReached with the coverage gate failing.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior rounds recorded in `implementation-summary.md` and `decision-record.md` claim every code fix landed and every closure cell was refreshed. This run re-reads those claims against the tree rather than restating them.

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
| `spec_code` | core | partial | 1 | REQ-001 to REQ-030 resolve; REQ-031 contradicts the guard; REQ-033 open (AC-040 Unmet) |
| `checklist_evidence` | core | partial | 1 | Ticked tasks exist; counts and several line cells stale |
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
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | - | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | - | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/reduce-state-refinement-other-file.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-refinements.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-ask-routing.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/multi-typed-command-gates.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` | - | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-heading.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-duplicate-command.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-plural-noun.vitest.ts` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-3-1795544069299-46zw3s, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-24T18:16:36.264Z
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
