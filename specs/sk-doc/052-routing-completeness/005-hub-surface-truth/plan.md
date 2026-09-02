---
title: "Implementation Plan: Phase 5: hub-surface-truth"
description: "How the three hub surfaces were reconciled with their registries, and how invariant 6c was proven able to fail before it was trusted."
trigger_phrases:
  - "hub surface truth plan"
  - "invariant 6c approach"
  - "registry is source of truth"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/005-hub-surface-truth"
    last_updated_at: "2026-09-02T18:54:23Z"
    last_updated_by: "claude-code"
    recent_action: "Filled the phase plan against shipped commits"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-005-hub-surface-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: hub-surface-truth

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown hub documents plus a CommonJS check under the doctor surface |
| **Framework** | The parent-hub check that already runs invariants 1 through 6b |
| **Storage** | `ROUTER.md`, `README.md`, `SKILL.md`, the mode registry and the leaf manifest |
| **Testing** | `parent-skill-check-command-column.test.cjs`, five cases |

### Overview

The registry was treated as the source of truth throughout and the document moved to match
it. The inventory was completed rather than its claim narrowed, the readme description was
rewritten inside its budget rather than appended to, and the new invariant shipped red on the
one real instance it was written to catch, with its fix landing in the commit that owns the
file it touches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing: the five-case command column test file
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Registry-first reconciliation. A registry is machine-read at route time, so a document that
disagrees with it is wrong by construction rather than merely out of date.

### Key Components
- **`ROUTER.md` FULL_INVENTORY**: the single explicit full-toolkit intent, and the one place
  that promises to enumerate the whole hub.
- **`README.md` summary surfaces**: description, trigger phrases and the at-a-glance table,
  each read independently of the link table an earlier fix had already corrected.
- **`parent-skill-check.cjs` invariant 6c**: requires a declared command to appear in the
  mode's own row rather than anywhere in the document.

### Data Flow

The registry declares modes and commands. The hub documents describe them. Invariant 6c reads
both and fails when the description contradicts the declaration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-doc/ROUTER.md` | Holds the only full-toolkit enumeration | Updated: 128 leaves to 252 | Count matches the leaf manifest, each path resolves on disk |
| `sk-doc/README.md` | Summary surfaces read before the link table | Updated: description, triggers, at-a-glance table | All six previously missing domains named in each |
| `sk-doc/SKILL.md` | The hub manifest routing reads | Updated: hidden command restored to its row | `grep -n 'sk-create-diff'` shows the command at line 35 |
| `parent-skill-check.cjs` | Runs the hub invariants | Updated: invariant 6c added | Fails on three defect shapes, passes on restore |
| `parent-skill-check-command-column.test.cjs` | Pins the invariant behavior | Created | Five cases, all passing |
| `sk-create-frontmatter/SKILL.md`, `sk-create-repo-rule/SKILL.md` | Packet manifests | Updated: keyword-triggers line added | The hub contract states every packet carries one |
| The mode registry and leaf manifest | The source of truth | Unchanged | A registry is not edited to make a document right |

Required inventories:
- Same-class producers: every hub surface that enumerates modes was read, not only the link table an earlier fix had corrected.
- Consumers of changed symbols: the 252 inventory paths were each resolved on disk rather than counted.
- Matrix axes: document surface by defect shape, giving the dash form, a wrong command string and a deleted row.
- Algorithm invariant: a declared command must appear in its own row, and a mention elsewhere in the document does not satisfy it.
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
| Unit | Invariant 6c against four defect shapes and one restore | `parent-skill-check-command-column.test.cjs` |
| Integration | The invariant on the live tree at ship time | The doctor parent-hub check |
| Manual | Inventory paths resolved on disk, readme surfaces read against the registry | Shell and direct reading |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The hub leaf manifest | Internal | Green | The inventory has no count to match |
| The mode registry | Internal | Green | The readme surfaces have no source of truth |
| The doctor parent-hub check | Internal | Green | The new invariant has nowhere to live |
| The routing commit owning `SKILL.md` | Internal | Green | The red check stays red |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: invariant 6c firing on a mode that genuinely has no command.
- **Procedure**: the dash form is legitimate for a commandless mode, so the check would be
  narrowed to declared commands rather than removed. Reverting the document edits restores
  the previous surfaces without touching any registry.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read registries ──┐
                  ├──► Correct documents ──► Add invariant 6c ──► Prove it fails
Count leaves ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Reading the registries and counting the leaves |
| Core Implementation | Medium | 128 inventory lines, three readme surfaces, one invariant |
| Verification | Medium | Five test cases plus a live-tree run |
| **Total** | | **Part of one working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The invariant proven to fail before it is trusted
- [x] Its fix prepared and owned by the commit that owns the file
- [x] No registry edited to make a document right

### Rollback Procedure
1. Restore the previous hub document from git.
2. Leave the registry untouched, since it was never the thing that moved.
3. Re-run the parent-hub check and the command column test file.
4. Record why the invariant was narrowed rather than dropped.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Read the   │────►│  Correct    │────►│  Prove the  │
│  registries │     │  documents  │     │  check      │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Add      │
                    │  6c       │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Leaf manifest read | None | The 252 count | Inventory completion |
| Inventory completion | Leaf manifest read | A complete enumeration | Verification |
| Readme reconciliation | Mode registry | Current summary surfaces | Verification |
| Invariant 6c | Mode registry | A failing check on real data | Verification |
| Verification | All of the above | Five green test cases | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read the registries and count the leaves** - the numbers decide the work - CRITICAL
2. **Complete the inventory to 252** - the largest single edit - CRITICAL
3. **Add invariant 6c and prove it fails four ways** - the durable output - CRITICAL
4. **Land the manifest fix in the commit that owns the file** - CRITICAL

**Total Critical Path**: part of one session.

**Parallel Opportunities**:
- The readme surfaces can be reconciled while the inventory is being completed.
- The link-label class can be swept alongside either.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Surfaces reconciled | Inventory at 252, readme on the current mode set | `98a327edf9` |
| M2 | Check added and proven | Fails three ways, passes on restore | `98a327edf9` |
| M3 | Real instance fixed | The hidden command back in its own row | `08eb67a0de` |
| M4 | Findings recorded closed | Five findings and the new check in the register | `8bb9011584` |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Ship the new check red, with its fix in another commit

**Status**: Accepted

**Context**: invariant 6c was written to catch one real instance, and that instance was live
in a file owned by a parallel routing pass.

**Decision**: land the check exiting non-zero, and let the fix land in the commit that owns
the file it touches.

**Consequences**:
- The check has both failed and passed on real data, rather than only ever passing.
- The routing file stayed under one owner instead of being edited from two directions.

**Alternatives Rejected**:
- Shipping the check green alongside its own fix: that produces another check that has never
  demonstrated it can fail, which is the shape of every finding in this packet.
- Shipping it as a warning: same problem, with the failure hidden behind a severity.

---

## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] Read `goal.md` and carry its three decisions into the work.
- [x] Identify the registry that owns each claim before touching the document that makes it.
- [x] Decide whether a claim is completed or narrowed, and record which.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Read the registry first. A document is corrected against it, never the reverse |
| TASK-SCOPE | False claims only. A sentence that reads poorly is not this phase's work |
| TASK-EVIDENCE | A new check is shown failing on real data before it is trusted |
| TASK-OWNER | A file is edited by the commit that owns it, even when that splits a fix |

### Status Reporting Format

Report the surface, the claim it made, the registry figure it contradicted, and the check
that now covers it. Where no check covers a fix, say so.

### Blocked Task Protocol

A BLOCKED task names the registry it would have to edit to proceed. That is the signal the
document is right and the registry is wrong, which is a different phase.
