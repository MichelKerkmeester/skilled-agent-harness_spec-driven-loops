---
title: "Implementation Plan: Phase 2: mode-scaffold"
description: "Builds sk-create-frontmatter as an empty but structurally conforming sk-doc mode packet, authored from the create-skill templates and shaped on the most recently built sibling, so the packaging gate says something about the file shape alone before any content depends on it. Records the one premise the phase disproved: an unregistered child directory is not inert to the parent-hub check."
trigger_phrases:
  - "sk-create-frontmatter mode scaffold"
  - "empty mode packet build"
  - "package skill strict gate"
  - "parent hub child directory"
  - "unregistered packet inert premise"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: mode-scaffold

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill-packet authoring under `.opencode/skills/sk-doc/`; the gates that judge it are Python and Node |
| **Framework** | None. A mode packet is four markdown files plus a directory shape, not a runtime component |
| **Storage** | None |
| **Testing** | `package_skill.py --check --strict` for the packaging gate, `parent-skill-check.cjs` for the hub gate, `resolve_skill_markdown_links.py` for link integrity |

### Overview
This phase creates `.opencode/skills/sk-doc/sk-create-frontmatter/` with `SKILL.md`, `README.md`,
`references/README.md` and `changelog/v1.0.0.0.md`, authored from the `sk-create-skill` templates and
modelled on `sk-create-repo-rule`, the most recently built sibling mode. Nothing moves into it and
nothing registers it, so the packaging gate's verdict is a statement about the shape alone. One planning
premise did not survive contact: the phase spec assumed an unregistered packet is inert, and the hub
check disagrees.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — spec.md §2 states why shape and content are built separately, and §3 freezes scope to the skeleton with no migration and no registration
- [x] Success criteria measurable — SC-001 is a packaging-gate verdict and SC-002 is a hub-gate comparison against a captured baseline; both are commands with an exit status
- [x] Dependencies identified — the create-skill templates, `sk-create-repo-rule` as the shape reference, and the two gate scripts; nothing external

### Definition of Done
- [x] All acceptance criteria met — three of five are `Met`; AC-002 and AC-005 are `Superseded` by ADR-001 in `decision-record.md`, because REQ-002 and SC-002 rest on a premise this phase disproved
- [x] Tests passing (if applicable) — `package_skill.py --check --strict` reports `Result: PASS` with 2 warnings, and link integrity on the new packet reports `failures=0`. The hub check reports one invariant failure, which is the deviation ADR-001 records and phase 004 closes
- [x] Docs updated (spec/plan/tasks) — plan.md, tasks.md, acceptance-criteria.md, decision-record.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The sk-doc mode-packet layout defined by `sk-create-skill`: one `SKILL.md` carrying the packet's
frontmatter and routing keywords, one `README.md` for a human reader, a `references/` tree with its own
`README.md` index, and a `changelog/` opened at the packet's first version.

### Key Components
- **`SKILL.md`** — the packet's identity: name, description, allowed tools, version, keyword comment, and the workflow prose. Its `description` field is the file that the packaging gate measures against the 130-character soft target.
- **`README.md`** — the human entry point for the packet, written to the create-skill README template.
- **`references/README.md`** — the index of the reference tree. It exists at scaffold time with no reference documents under it yet, which is what makes the packet legitimately empty rather than incomplete.
- **`changelog/v1.0.0.0.md`** — the packet changelog opened at its first version, so later phases append rather than create.

### Data Flow
`package_skill.py` walks the packet directory, reads `SKILL.md`'s frontmatter and section headings, and
reports a pass or fail plus a warning list. `parent-skill-check.cjs` walks the hub root instead, and for
invariant 6a compares each child directory name against a fixed support-directory allowlist and the set
of registered packets. The new directory is in neither set, which is the whole of this phase's deviation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The phase creates a directory rather than fixing a bug, but the hub gate observes directories, so the
surfaces it touches are worth naming exactly.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-doc/sk-create-frontmatter/**` | The new mode packet | Created: 4 files | `package_skill.py --check --strict` reports `Result: PASS` with 2 warnings |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | The packaging gate | Unchanged, run only | Run against the new packet; first run failed on the description length, second passed |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | The hub gate, invariant 6a | Unchanged, run only. It observes the new directory and fails | `FAIL: 6a: child director(ies) neither registered as a packet nor allowlisted: [sk-create-frontmatter]` |
| `.opencode/skills/sk-doc/{mode-registry,hub-router,leaf-manifest}.json`, `ROUTER.md`, `SKILL.md` | The registration surfaces | Not a consumer at this phase: deliberately untouched, per spec.md §3 Out of Scope | `git diff` on each is empty for this phase |
| The other four parent hubs | Peer hubs the same gate walks | Unchanged | Each still exits 0 on `parent-skill-check.cjs` |

Required inventories:
- Same-class producers: the only producer of a hub child directory is a mode packet, and this phase adds exactly one.
- Consumers of the changed surface: `rg -n 'DIRECTORY_ALLOWLIST|registeredPackets' .opencode/commands/doctor/scripts/parent-skill-check.cjs` returns invariant 6a as the single consumer of the child-directory set.
- Matrix axes: two, registered against unregistered and allowlisted against not. The packet occupies the one cell that fails.
- Algorithm invariant: a hub child directory is legal when its name is in `DIRECTORY_ALLOWLIST` or in `registeredPackets`. Registration is what makes a directory legal, not merely what makes it reachable.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

### Phase 1: Establish the shape reference

Capture the pre-packet hub-gate baseline, pick `sk-create-repo-rule` as the most recently built sibling,
and read its file shape and its packaging-gate warning list so the new packet has a concrete target
rather than a template read in the abstract.

### Phase 2: Author the four files

Write `SKILL.md`, `README.md`, `references/README.md` and `changelog/v1.0.0.0.md` from the create-skill
templates, with no reference content and no registration entry anywhere.

### Phase 3: Run the gates and record what they say

Run the packaging gate to a pass, run link integrity on the new packet, run the hub gate, and record the
hub gate's failure and its cause rather than working around it.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packaging conformance | The new packet's file shape, frontmatter and required sections | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-frontmatter --check --strict` |
| Sibling parity | The new packet's warning list against `sk-create-repo-rule`'s | The same command run twice, once per packet, comparing the warning lines |
| Link integrity | Every relative link the four new files contain | `resolve_skill_markdown_links.py` scoped to the new packet: `files_examined=4 entries_examined=2 failures=0` |
| Hub invariants | Whether an unregistered child directory disturbs the hub gate | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs`, run before and after the packet existed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-create-skill` templates | Internal | Green — read and followed | No authoring source for the four files |
| `sk-create-repo-rule` as the shape reference | Internal | Green — its warning list matched exactly | The packaging pass would have no comparison, so REQ-003 would be unverifiable |
| `package_skill.py` | Internal | Green — ran, failed once, then passed | Blocks REQ-001 and SC-001 entirely |
| `parent-skill-check.cjs` | Internal | Red for this phase — reports one invariant failure by design of the check, not of the packet | Recorded as a deviation under ADR-001; closed by phase 004 |
| Phase 004 (routing integration) | Internal, downstream | Green — registration landed there and returned the hub gate to exit 0 | The hub gate would stay red until some later phase registered the mode |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The hub gate failure is judged unacceptable to carry between phases, or the packet shape is rejected before content lands in it.
- **Procedure**: `rm -rf .opencode/skills/sk-doc/sk-create-frontmatter/`. No other file was edited by this phase, so nothing else needs reverting, and the hub gate returns to exit 0 the moment the directory is gone. That single-command reversibility is why the deviation was safe to carry.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
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

Not applicable. No hour-level effort estimate was recorded for this phase; progress is tracked by
per-task completion in `tasks.md` (T001-T012), not against a time budget.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — Not applicable: no data store is touched, and git history plus the single-directory blast radius is the recovery point
- [x] Feature flag configured — Not applicable: no runtime flag governs an unregistered documentation packet. `PARENT_HUB_CHECK_STRICT=0` would demote the hub failure to a soft warning, and was deliberately not used, because suppressing the signal is not the same as resolving it
- [x] Monitoring alerts set — Not applicable: the packet has no runtime surface. The gates themselves are the monitoring

### Rollback Procedure
1. Remove the one directory this phase created: `rm -rf .opencode/skills/sk-doc/sk-create-frontmatter/`.
2. Rerun `node .opencode/commands/doctor/scripts/parent-skill-check.cjs` and confirm it returns to exit 0.
3. Confirm `git status --porcelain .opencode/skills/sk-doc/` reports nothing else changed.
4. No stakeholder notification required: nothing was registered, so no route or command pointed at the packet.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase creates four markdown files and no data.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │Implementation│    │ Verification │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (Setup) | None | The hub-gate baseline and the sibling shape reference | Phase 2 |
| Phase 2 (Implementation) | Phase 1 | The four-file packet at `.opencode/skills/sk-doc/sk-create-frontmatter/` | Phase 3 |
| Phase 3 (Verification) | Phase 2 | The packaging pass, the link-integrity result, and the recorded hub-gate deviation | Phase 3 of the parent packet, which moves content in |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Establish the shape reference)** - Duration: not tracked - CRITICAL
2. **Phase 2 (Author the four files)** - Duration: not tracked - CRITICAL
3. **Phase 3 (Run the gates)** - Duration: not tracked - CRITICAL

**Total Critical Path**: Not applicable. No duration estimates were recorded for this phase.

**Parallel Opportunities**:
- None taken. The packaging gate cannot judge files that are not written yet, and the sibling comparison needs the packaging gate's output from both packets.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline and shape reference captured | Hub gate exit 0 recorded before the packet existed; `sk-create-repo-rule`'s warning list read | Complete |
| M2 | The four files authored | `SKILL.md`, `README.md`, `references/README.md`, `changelog/v1.0.0.0.md` on disk | Complete |
| M3 | Gates run and recorded | Packaging `Result: PASS` with 2 warnings; link integrity `failures=0`; hub-gate deviation documented under ADR-001 | Complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Build the packet empty and unregistered, and carry the hub-gate failure rather than suppress it

**Status**: Accepted

**Context**: spec.md §3 asserts that "an unregistered packet is inert, which is what makes this phase
safe", and REQ-002 and SC-002 are built on that assertion. It is false for this hub. The full record of
the decision, its alternatives and its consequences is `decision-record.md` in this folder; this section
is the plan-side pointer to it, not a second copy of the reasoning.

**Decision**: Follow the spec. Build the four files, register nothing, and record the hub-gate failure as
a deviation with its cause read from the source rather than inferred.

**Consequences**:
- The packaging gate's verdict means what the phase wanted it to mean: it judges the file shape alone, with no content and no routing entry in the picture.
- The hub gate carries one invariant failure between this phase and phase 004. It is transient by construction and reversible with one `rm -rf`.

**Alternatives Rejected**:
- Registering the mode here: it would have made the hub gate pass but destroyed the phase's purpose, which is a gate verdict about shape alone.
- Setting `PARENT_HUB_CHECK_STRICT=0`: it demotes the failure to a warning without changing anything true about the tree.
- Adding the directory name to `DIRECTORY_ALLOWLIST`: that set holds support-directory names such as `shared` and `references`, not mode packets, so the entry would be a lie about what the directory is.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
