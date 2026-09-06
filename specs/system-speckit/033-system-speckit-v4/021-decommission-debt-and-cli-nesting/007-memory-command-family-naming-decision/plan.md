---
title: "Implementation Plan: Phase 7: memory-command-family-naming-decision"
description: "Present the keep-literal and rename-with-compatibility-window options with grep-counted blast radius, and require a decision-record.md before any rename work is scheduled - no code changes in this phase."
trigger_phrases:
  - "memory command naming plan"
  - "memory save search rename"
  - "two naming options ADR"
  - "blast radius reproducible count"
  - "decision gate not implementation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: memory-command-family-naming-decision

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown decision document; `rg` for the blast-radius evidence |
| **Framework** | None - a decision phase |
| **Storage** | None - `decision-record.md` is the only artifact this phase produces |
| **Testing** | Not applicable - no code to test; the "test" is that the blast-radius count is reproducible (SC-002) |

### Overview
This phase is a decision gate, not an implementation. It lays out the two naming options with reproducible evidence and requires the operator to record a choice before any rename work is scheduled. No file outside this folder's own documents changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — AC-004 stays Unmet until the Stage B follow-on packet is opened under Gate 3
- [x] `decision-record.md` exists and names a choice — ADR-001, Option B, hard cutover
- [x] Docs updated (spec/plan/tasks) — spec.md carries a dated Scope Amendment, tasks.md records Stage A evidence and Stage B's open task, acceptance-criteria.md and implementation-summary.md reflect the in-progress state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Decision-record gate: evidence is gathered and presented in `spec.md`; the decision itself lives in a separate `decision-record.md` so it is a distinct, dated artifact rather than a buried paragraph.

### Key Components
- **Blast-radius evidence**: the `rg` command in `spec.md`'s Success Criteria, run against the live (non-`specs/`, non-`node_modules`, non-`dist`, non-`z_archive`) file set.
- **`decision-record.md`**: does not exist yet in this folder; created by the operator (or on the operator's behalf, with explicit sign-off) once the choice is made. Its shape: which option, why, and what follow-on packet (if Option B) will execute it.

### Data Flow
`spec.md`'s Problem/Scope sections (already written, evidence already gathered) → operator reads and decides → `decision-record.md` created → (if Option B) a new follow-on packet is opened under Gate 3 to execute the rename, seeded with this phase's blast-radius table.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable - this phase makes no code change and touches no production surface. The table below records what a future Option-B execution phase would need to touch, for planning continuity only.

| Surface | Current Role | Action (this phase) | Action (future Option-B phase, if chosen) |
|---------|--------------|----------------------|--------------------------------------------|
| `.opencode/commands/memory/{save,search}.md` | Command definitions | none | rename, with an aliasing compatibility window |
| `scripts/memory/generate-context.ts` / `scripts/dist/memory/generate-context.js` | Continuity writer source and compiled output | none | rename directory, update every one of the 87 live references |
| `runtime/hooks/claude/session-stop.ts:73-76` | Hard-codes four candidate resolutions of the compiled writer path | none | update all four candidates in the same commit as the rename |
| `.opencode/commands/doctor/_routes.yaml:33-38`, `doctor-memory.yaml` | `/doctor memory` route, now diagnosing the trigger index | none | rename route and asset, or add a documented compatibility alias |
| `scripts/package.json:4` | Package description says "memory management" | none | update description |

Required inventories:
- Same-class producers: not applicable - no code change.
- Consumers of changed symbols: `rg -l "scripts/dist/memory" --glob '*.md' --glob '*.json' --glob '*.ts' --glob '*.sh' --glob '*.cjs' --glob '*.mjs' --glob '*.yaml' . | grep -v node_modules | grep -v '/dist/' | grep -v '^specs/' | grep -v z_archive` - the exact 87-file list this spec's count is built from; a future Option-B phase re-runs this as its own starting inventory.
- Matrix axes: not applicable - a decision phase, not a fix.
- Algorithm invariant: not applicable.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not applicable - no code | N/A |
| Integration | Not applicable | N/A |
| Manual | Re-run the blast-radius `rg` command and confirm the count matches what `spec.md` states, or update `spec.md` if the surface has drifted | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator availability to make and record the decision | External | Needs scheduling | This phase cannot close without REQ-002's `decision-record.md`; it can remain open indefinitely without blocking the other six phases |
| Packet 052's D7 decision record, as precedent | Internal | Green - already read and cited | The decision would otherwise lack its historical context |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable - this phase makes no reversible change; it produces a decision document.
- **Procedure**: If the recorded decision is later reconsidered, a new decision record or an amendment supersedes it - the original stays as history, per the packet's acceptance-criteria conventions for `Superseded` rows.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (confirm blast-radius count is current) ──► Core (operator makes the decision) ──► Verify (decision-record.md exists and names a choice)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup, operator availability | Verify |
| Verify | Core | Any future Option-B execution packet |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Blast-radius evidence already gathered and written into `spec.md` |
| Core Implementation | Low | The decision itself is the operator's, not an implementation task |
| Verification | Low | Confirming `decision-record.md` exists and names a choice |
| **Total** | | **Depends on operator scheduling, not implementation effort** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Not applicable - no deployment in a decision-only phase

### Rollback Procedure
1. Not applicable - no code or file outside this folder's own documents changes in this phase.
2. If `decision-record.md` needs revision, edit or supersede it directly.
3. No re-run of any gate is needed since nothing outside this folder changed.
4. No stakeholder notification needed beyond the operator who made the decision.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
