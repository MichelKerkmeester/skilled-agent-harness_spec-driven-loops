---
title: "Implementation Plan: Phase 2: playbook-consolidation"
description: "Move the doctor-commands scenarios into the system-skilled-doctor playbook with git mv, merge the two root documents, and rewrite every link and path that pointed at the old folder."
trigger_phrases:
  - "playbook consolidation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: playbook-consolidation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook files, a Python link resolver run once from the shell |
| **Framework** | sk-doc's manual testing playbook package contract |
| **Storage** | None |
| **Testing** | `validate-playbook-package.cjs`, spec-kit vitest, sk-doc README manifest tests |

### Overview
`git mv` moves the category folder so its history follows it. The skill's root keeps its own sections and gains the central root's test environments, command index, verdict rules and source metadata. A resolver then rewrites each relative link from the target it used to reach.
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
- [x] The validator prints `PASS package=system-skilled-doctor` with `scenarios=79` and `violations=0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One playbook package per skill: one root document that indexes every category folder.

### Key Components
- **Skill root `manual-testing-playbook.md`**: the one index, review protocol and environment guide.
- **`doctor-commands/`**: the moved scenarios and their category README.

### Data Flow
Root index → scenario file → `record-playbook-run.cjs` → the skill's `benchmark/reports/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Scenario files and their README | Producer of the scenarios | move and relink | link resolver |
| Validator allowlist | Enforces the fail-closed tier | swap the line | validator tier |
| spec-kit vitest path pins | Consumers that walk the scenarios | update | spec-kit vitest |
| sk-doc README manifests | Consumers that list README paths | update | README manifest tests |
| Other skills' playbooks and catalogs | Link to the scenarios | relink and reword | link resolver |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup lists every reference to the old folder, literal and relative. Implementation moves the folder, writes the merged root, rewrites the links and the path pins. Verification runs the validator, the link resolver and the suites that walk the scenarios. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Provenance and workflow-invariance pins, README manifests | vitest, Python tests |
| Integration | The whole playbook corpus | `validate-playbook-package.cjs` |
| Manual | Every Markdown link in tracked files | the one-off link resolver |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 | Internal | Green | The playbook would move into a skill that does not own its commands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer of the old path that the inventory missed.
- **Procedure**: revert the phase commit; `git mv` keeps both paths in history, so the folder returns intact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 | Implementation |
| Implementation | Reference inventory | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
inventory ──► git mv ──► merged root ──► link rewrite ──► validator and suites
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Inventory | None | Reference list | Move |
| Move | Inventory | New folder | Root merge, relink |
| Root merge | Move | One root | Validator |
| Relink | Move | Resolving links | Validator |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Move and merge** - minutes - CRITICAL
2. **Link rewrite** - minutes - CRITICAL
3. **Validator and suites** - about 5 minutes - CRITICAL

**Total Critical Path**: under half an hour.

**Parallel Opportunities**:
- The merged root can be drafted in `scratch/` while Phase 1's tests run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Inventory done | Every literal and relative reference listed | Setup |
| M2 | Folder moved | Old folder gone, 67 files in the new one | Implementation |
| M3 | Gates green | Validator and suites match the baseline | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One package, one root

**Status**: Accepted

**Context**: sk-doc's package contract gives a playbook exactly one root document. Two roots in one folder would make one of them a second package.

**Decision**: merge the central root into the skill's root, renumber its sections after the skill's own, and delete the central file.

**Consequences**:
- One index lists every scenario once. `SKD-003` stays in section 8 and the `/doctor:overlay` row points there.
- The skill's benchmark corpus now includes every doctor scenario.

**Alternatives Rejected**:
- Keep the central root as a sub-root inside `doctor-commands/`: the validator would read it as a second package.

### ADR-002: Rewrite links by resolving them

**Status**: Accepted

**Context**: the scenarios moved two levels deeper, so every link out of them that climbed the tree broke.

**Decision**: resolve each link against the old folder and rewrite it relative to the new one.

**Consequences**:
- 312 links in the moved files and 12 inbound links rewritten, none left unresolved.

**Alternatives Rejected**:
- Prefix every `../` with two more: wrong for links that stay inside the folder or point at the root.

---
