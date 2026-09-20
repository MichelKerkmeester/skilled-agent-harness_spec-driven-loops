---
title: "Implementation Plan: Phase 4: Research Adoption and Rule-Set Reconciliation"
description: "Read phase 3 ranked recommendations, verify each against the repository before believing it, record one disposition per item, and implement only the accepted subset. AGENTS.md items batch into a single approval request, and the phase closes by reconciling the parent packet status, phase map and completion claims, then validating the parent and all four children recursively."
trigger_phrases:
  - "adoption plan"
  - "disposition table"
  - "operator approval batch"
  - "packet reconciliation"
  - "recursive validation"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: Research Adoption and Rule-Set Reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown doctrine files plus the packet's own spec documents |
| **Framework** | The router-plus-leaves architecture the parent packet established |
| **Storage** | Git working tree |
| **Testing** | Per-item verification against the repository, then `validate.sh --recursive --strict` on the parent |

### Overview
Read phase 3's ranked list, verify each item against the repository before believing it, record a disposition for every one, and implement only the accepted set. Any item touching `AGENTS.md` is batched into a single consolidated approval request rather than asked one at a time. The phase ends by reconciling the parent packet so its status, its Phase Documentation Map, and its completion claims all describe the same reality.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 3 closed, with a validated ranked recommendation list
- [x] Recommendation count known, so the disposition table can be checked for completeness
- [x] Items touching `AGENTS.md` identified and batched for one approval request

### Definition of Done
- [x] Every recommendation has exactly one disposition
- [x] Every accepted item implemented and verified
- [x] No `AGENTS.md` edit without recorded approval
- [x] `validate.sh --recursive --strict` passes for the parent and all four children
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Decide, then implement. The two are deliberately separate steps with a written artifact between them, because a recommendation applied in the same motion as it is read never gets judged.

### Key Components
- **`adoption-decisions.md`**: one row per recommendation - id, target file, verdict, reason, owner if deferred.
- **Verification pass**: each accepted item checked against the repository before it is written, since the research asserted it rather than proved it.
- **Approval batch**: every `AGENTS.md` item in one consolidated request, per the consolidated question protocol.
- **Reconciliation pass**: parent status, Phase Documentation Map, and the parent's completion claims brought into agreement.

### Data Flow
Ranked list to per-item verification to disposition table to implementation of the accepted subset to recursive validation to packet closure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase writes to doctrine, so the inventory is about what a doctrine change reaches.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/*.md` | The rules | update or create, only where accepted | Each changed file traces to an accepted recommendation id |
| `REPO RULES.md` | Router | update where a new rule was accepted | Row counts match the rule-file count; every link resolves |
| `AGENTS.md` | Always-loaded, carries hard blockers | update only under recorded approval | Approval text quoted in `adoption-decisions.md`; line delta stated |
| `../spec.md` Phase Documentation Map | Rollup of child state | update | Each row's status matches the child's actual status |
| `../implementation-summary.md` | Parent completion record | update | No completion claim contradicts a child's state |
| Every runtime that loads `REPO RULES.md` at GATE 5 | Consumer of the rule set | not a code consumer; behavior changes by intent | The gate output line still names a rule file that exists |

Required inventories:
- Same-class producers: for each accepted item, `rg` the doctrine the recommendation claims is missing, to confirm it is actually missing before writing it.
- Consumers of changed symbols: `rg -n 'repo-rules/|REPO RULES' . --glob '*.md'` after every router edit.
- Matrix axes: verdict (accept, decline, defer) x target (`repo-rules/`, router, `AGENTS.md`); every combination that occurs needs a row in the disposition table.
- Algorithm invariant: after adoption, every rule file is still independently readable - no rule requires another to be actionable.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the numbered task state (T001-T019); the stages below say what each one has to establish before the next can start.

### Phase 1: Verify and decide
- [x] Every recommendation checked against the repository before it is believed
- [x] One disposition recorded per recommendation, with a reason

### Phase 2: Approve and implement
- [x] `AGENTS.md` items batched into a single approval request
- [x] Only accepted items implemented, each traceable to a recommendation id

### Phase 3: Reconcile and close
- [x] Parent status, Phase Documentation Map and completion claims brought into agreement
- [x] Recursive validation run across the parent and all four children
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Completeness | Disposition row count equals phase-3 recommendation count | Count both, compare |
| Traceability | Every changed file traces to an accepted recommendation id | Map `git diff --stat` paths against the disposition table |
| Pre-write verification | Each accepted claim confirmed against the repository | `rg` / `sed -n` evidence recorded per item |
| Approval | No `AGENTS.md` change without quoted approval | `git diff -- AGENTS.md` empty, or approval text present |
| Format conformance | New and edited rules match phase 1's format | The phase-1 assertions, re-run |
| Packet gate | Parent and all children | `validate.sh <parent> --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 ranked list | Internal | Yellow until phase 3 closes | Nothing to adopt |
| Operator approval for `AGENTS.md` items | External | Unknown until the items exist | Those items defer with a named follow-on; the rest of the phase proceeds |
| Phase 1 format conventions | Internal | Green once phase 1 closes | New rules would be born non-conforming |
| `validate.sh` orchestrator, compiled and not stale | Internal | Green | Closure cannot be gated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an adopted change is found to duplicate existing doctrine, to contradict `AGENTS.md`, or to have been written without the verification REQ-006 requires.
- **Procedure**: revert the specific rule file and its router rows; the disposition table keeps the record of what was tried and why, so a reverted item is a decision with history rather than a silent disappearance. `AGENTS.md` reverts independently of `repo-rules/`, which is the point of keeping the two edits separate.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Verify each item --> Disposition table --> Approval batch (AGENTS.md items) --> Implement accepted --> Reconcile parent --> Recursive validate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Verify | Phase 3 closed | Disposition |
| Disposition | Verify | Approval batch, Implement |
| Approval batch | Disposition | Implement (`AGENTS.md` items only) |
| Implement | Disposition, Approval | Reconcile |
| Reconcile | Implement | Recursive validate |
| Recursive validate | Reconcile | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Verify and disposition | Medium | scales with the recommendation count |
| Core Implementation | Medium | only the accepted subset |
| Reconciliation and validation | Low | 1-2 hours |
| **Total** | | **1 day, dominated by per-item verification** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Disposition table complete before the first implementation edit
- [x] `AGENTS.md` approval recorded before any edit to it
- [x] Working tree clean, so each item's diff is attributable

### Rollback Procedure
1. Identify the recommendation id behind the change
2. Revert that item's files only, leaving other adopted items intact
3. Mark the row declined with the reason, so the record explains the reversal
4. Re-run recursive validation

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - doctrine files carry no persisted state
<!-- /ANCHOR:enhanced-rollback -->

---

