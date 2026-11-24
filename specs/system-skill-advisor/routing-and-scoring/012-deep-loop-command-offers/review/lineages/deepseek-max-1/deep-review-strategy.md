---
title: Deep Review Strategy - 012-deep-loop-command-offers (lineage deepseek-max-1)
description: Session tracking for the traceability-focused deep review of the deep-loop command offers change in the skill advisor.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - 012-deep-loop-command-offers (fan-out lineage deepseek-max-1)

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
Traceability-focused deep review of `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`, a change that made the skill advisor offer the `/deep:review` and `/deep:research` commands and attached the typed command to the recommendation brief. The operator focus is the sixth fix round: REQ-023 to REQ-034, AC-030 to AC-042, ADR-005 and ADR-006. Every REQ in spec.md must be checked against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that exists in the tree.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS
- Not implementing fixes; review only.
- Not reviewing unrelated skill-advisor subsystems beyond the deep-loop offer surface and its documented contracts.
- Not re-running repo tooling that writes outside the lineage (validate.sh, generate-context.js, git writes).

---

## 5. STOP CONDITIONS
- All four review dimensions covered, plus the core traceability protocols `spec_code` and `checklist_evidence`.
- Legal convergence per the workflow convergence check, or maxIterations=5 (stopPolicy max-iterations).

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 6. WHAT WORKED
- Reading the implementing line before the REQ text: the spec_code pass found an overstated guard claim that a prose-only read would have accepted (iterations 1 and 3)
- Reading the release test table against the packet's recorded suite counts: surfaced the stale changelog count (iteration 4)
- Reading the exported-list shape against the guard's own rationale: surfaced the unguarded refusal alternation (iteration 5)

---

## 7. WHAT FAILED
- Treating convergence as telemetry under stopPolicy=max-iterations: passes 3 to 5 ran without a recorded graph-convergence event, so the ledger carries pass 1, pass 2 and the stop pass only (process deviation, recorded in the report appendix)
- Scheduling maintainability last under a cap of 5: the fourth dimension was first covered in the cap iteration, so the coverage terminal gate read coverage-too-young and the run verdict is FAIL

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A claimed precedence bug in `typedCommandIn` returning the shorter key: the loop keeps the longer key on a tie at the same index, which is the behaviour REQ-025 preserves for other callers. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A claimed precedence bug in `typedCommandIn` returning the shorter key: the loop keeps the longer key on a tie at the same index, which is the behaviour REQ-025 preserves for other callers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A claimed precedence bug in `typedCommandIn` returning the shorter key: the loop keeps the longer key on a tie at the same index, which is the behaviour REQ-025 preserves for other callers.

### A claimed quadratic-prefix regression in REQ-030: both copies read a bounded 400-character window per match, and the patterns are compiled once per call (TypeScript) or at module load (Python). No whole-prefix scan remains in `hasLoopAsk`, `explicitRunOutranks` or `commandOnlyMentioned`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A claimed quadratic-prefix regression in REQ-030: both copies read a bounded 400-character window per match, and the patterns are compiled once per call (TypeScript) or at module load (Python). No whole-prefix scan remains in `hasLoopAsk`, `explicitRunOutranks` or `commandOnlyMentioned`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A claimed quadratic-prefix regression in REQ-030: both copies read a bounded 400-character window per match, and the patterns are compiled once per call (TypeScript) or at module load (Python). No whole-prefix scan remains in `hasLoopAsk`, `explicitRunOutranks` or `commandOnlyMentioned`.

### A missing `bare-loop-name` fixture row for ADR-006: the row exists and reads `asksForLoopRun: false`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A missing `bare-loop-name` fixture row for ADR-006: the row exists and reads `asksForLoopRun: false`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing `bare-loop-name` fixture row for ADR-006: the row exists and reads `asksForLoopRun: false`.

### A missing REQ-025 Python alignment: the Python gate keeps every typed run row through the `typed` set it computes before the loop (`skill_advisor.py:5320`), so two typed commands cannot hide each other there either. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing REQ-025 Python alignment: the Python gate keeps every typed run row through the `typed` set it computes before the loop (`skill_advisor.py:5320`), so two typed commands cannot hide each other there either.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing REQ-025 Python alignment: the Python gate keeps every typed run row through the `typed` set it computes before the loop (`skill_advisor.py:5320`), so two typed commands cannot hide each other there either.

### A missing REQ-026 Python mirror: T070 records that the Python fallback keeps no mode-cue copy, so the deferred-route cue is a TypeScript-only surface and no drift exists. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing REQ-026 Python mirror: T070 records that the Python fallback keeps no mode-cue copy, so the deferred-route cue is a TypeScript-only surface and no drift exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing REQ-026 Python mirror: T070 records that the Python fallback keeps no mode-cue copy, so the deferred-route cue is a TypeScript-only surface and no drift exists.

### A REQ-034 count mismatch: the Verification Summary (12 P0 / 11 verified, 13 P1, 1 P2) matches the checklist boxes exactly, with CHK-020 the single open P0. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A REQ-034 count mismatch: the Verification Summary (12 P0 / 11 verified, 13 P1, 1 P2) matches the checklist boxes exactly, with CHK-020 the single open P0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A REQ-034 count mismatch: the Verification Summary (12 P0 / 11 verified, 13 P1, 1 P2) matches the checklist boxes exactly, with CHK-020 the single open P0.

### A wrong Verification Summary count: the three category totals and the 11/12 P0 line match the ticked boxes. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A wrong Verification Summary count: the three category totals and the 11/12 P0 line match the ticked boxes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A wrong Verification Summary count: the three category totals and the 11/12 P0 line match the ticked boxes.

### An unearned `Met` on AC-040: the row reads `Unmet`, so the checklist does not overclaim the rerun. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: An unearned `Met` on AC-040: the row reads `Unmet`, so the checklist does not overclaim the rerun.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An unearned `Met` on AC-040: the row reads `Unmet`, so the checklist does not overclaim the rerun.

### Command injection through the fallback: the prompt is stdin data, never interpolated into an argv string or a shell. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Command injection through the fallback: the prompt is stdin data, never interpolated into an argv string or a shell.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command injection through the fallback: the prompt is stdin data, never interpolated into an argv string or a shell.

### Comment-hygiene violations in the changed code: `rg` over the eight changed modules finds no REQ/AC/ADR/task id in a code comment; the only match is the hygiene directive text itself in `render.ts:131`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Comment-hygiene violations in the changed code: `rg` over the eight changed modules finds no REQ/AC/ADR/task id in a code comment; the only match is the hygiene directive text itself in `render.ts:131`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comment-hygiene violations in the changed code: `rg` over the eight changed modules finds no REQ/AC/ADR/task id in a code comment; the only match is the hygiene directive text itself in `render.ts:131`.

### Duplicated `attachCommand`/Python gate logic as an unmanaged copy: the divergence is explicit in ADR-005 and limitation 8, and each side has a named layer contract. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Duplicated `attachCommand`/Python gate logic as an unmanaged copy: the divergence is explicit in ADR-005 and limitation 8, and each side has a named layer contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicated `attachCommand`/Python gate logic as an unmanaged copy: the divergence is explicit in ADR-005 and limitation 8, and each side has a named layer contract.

### List re-declaration drift in `explicit.ts`: the stage-one rule imports its predicates from `command-attach.ts` rather than copying them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: List re-declaration drift in `explicit.ts`: the stage-one rule imports its predicates from `command-attach.ts` rather than copying them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: List re-declaration drift in `explicit.ts`: the stage-one rule imports its predicates from `command-attach.ts` rather than copying them.

### Privilege escalation through a typed row: a typed mark only suppresses the offer text; it grants no execution. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Privilege escalation through a typed row: a typed mark only suppresses the offer text; it grants no execution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Privilege escalation through a typed row: a typed mark only suppresses the offer text; it grants no execution.

### ReDoS in the new refusal grammar: every quantified group carries a bounded `{0,2}`/`{0,3}` or a negative lookahead, and every read is limited to a 400-character window; no nested unbounded quantifier exists in `RUN_ASK_NEGATED_SOURCE` or the command-decline leads. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: ReDoS in the new refusal grammar: every quantified group carries a bounded `{0,2}`/`{0,3}` or a negative lookahead, and every read is limited to a 400-character window; no nested unbounded quantifier exists in `RUN_ASK_NEGATED_SOURCE` or the command-decline leads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: ReDoS in the new refusal grammar: every quantified group carries a bounded `{0,2}`/`{0,3}` or a negative lookahead, and every read is limited to a 400-character window; no nested unbounded quantifier exists in `RUN_ASK_NEGATED_SOURCE` or the command-decline leads.

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 9. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (all four dimensions complete) - Focus area: synthesis reads the three open P2s and the four protocol rows - Reason: maxIterations=5 is reached; the next step is the workflow's synthesis phase - Rotation status: correctness complete, security complete, traceability complete, maintainability complete - Required evidence: none further under the cap

<!-- /ANCHOR:next-focus -->

---

## 11. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the packet docs (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md`) plus the advisor runtime surfaces in `reviewScopeFiles` (advisor handlers, render, command-attach, scorer lanes, schemas, python fallback, and their vitest suites).
- Behavior claims: the spec's REQ-023 to REQ-034 and AC-030 to AC-042 claim a deep-loop command offer carried in the advisor brief, gated so it only fires for loop-shaped prompts, with rendered brief length held under the head limit; ADR-005 and ADR-006 record the design choices.
- Reuse and conventions: existing command-brief rendering (`runtime/lib/render.ts`), command attach policy (`runtime/lib/command-attach.ts`), lane scoring (`runtime/lib/scorer/lanes/explicit.ts`), and the CLI fallback path (`hooks/lib/skill-advisor-cli-fallback.ts`).
- Review risks and gaps: the packet is at its sixth fix round; some REQ/AC rows were written after the code and may describe intended rather than implemented behavior. Read the code first, then the claim.

---

## 12. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | REQ-001 to REQ-034 and ADR-005/ADR-006 mapped; REQ-031's per-entry half is R1-P2-001 |
| `checklist_evidence` | core | pass | 4 | T068-T083 and AC-030 to AC-042 checked; AC-038 overstated (R1-P2-001), AC-029 count stale (R4-P2-001) |
| `skill_agent` | overlay | notApplicable | - | No skill contract changed |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent definition changed |
| `feature_catalog_code` | overlay | notApplicable | - | No feature catalog entry changed |
| `playbook_capability` | overlay | notApplicable | - | No playbook changed |
<!-- MACHINE-OWNED: END -->

---

## 13. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 14. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-1-1795511183570-92w0ez, parentSessionId=2026-11-24T09:06:03.000Z, generation=3, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T09:07:50.000Z
<!-- MACHINE-OWNED: END -->
