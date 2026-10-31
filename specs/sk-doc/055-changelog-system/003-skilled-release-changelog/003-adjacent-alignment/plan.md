---
title: "Implementation Plan: Phase 3: adjacent-alignment"
description: "Reproduce each defect, fix it at its source with a test that fails on the old code, then bring the docs, catalogs and playbooks next to the changelog work in line with what ships."
trigger_phrases:
  - "adjacent-alignment plan"
  - "changelog surface fixes"
  - "hub component resolution plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: adjacent-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflows, Python 3, TypeScript, Markdown |
| **Framework** | The `/create:changelog` command, sk-doc's validator, spec-kit's CLI |
| **Storage** | None |
| **Testing** | pytest, vitest, the playbook and catalog validators, `validate.sh` |

### Overview
Each of three code defects is reproduced first, then fixed where the behavior is produced, with a test that fails on the old code. The docs, catalogs and playbooks next to them are then corrected against the fixed behavior, and each of the three changed components receives an entry.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (`acceptance-criteria.md`, 12 of 12 Met)
- [x] Tests passing: pytest 12 of 12 targeted, vitest 81 of 81 in five suites
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer. Each defect is fixed where the behavior comes from, not where it surfaced.

### Key Components
- **Hub resolution**: step 2 of both `/create:changelog` workflows reads a hub folder's links and resolves to one of them
- **Type detection**: `detect_document_type` checks the changelog folder before the install-guide name, and `should_exclude_path` passes over numbered spec folders
- **Rendering**: the nested generator escapes its three frontmatter values and hands `String.replace` a function, so no value is read as a pattern

### Data Flow
A changed path or a hint goes to step 2, which returns `{hub}/{member}` for a hub. The version reader and the write both read that path, so neither needs its own hub logic.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `create-changelog-auto.yaml`, `create-changelog-confirm.yaml` step 2 | Resolves the component | Update | YAML parse, CHG-001 walk-through |
| sk-create-changelog `SKILL.md` sections 4 and 6 | States the component shape and the resolution rule | Update | Read against both YAMLs |
| `validate_document.py` `detect_document_type`, `should_exclude_path` | Types and skips documents | Update | pytest, a sweep over every changelog file |
| `package_skill.py` fixture rule | Skips fixtures in skill trees | Unchanged | No numbered folder ending in "fixtures" sits under `.skilled/skills` |
| `nested-changelog.ts` `renderTemplate`, `generateNestedChangelogMarkdown` | Renders packet changelogs | Update | vitest, the reproduction script |
| Packet changelogs already written | Rendered by the old code | Unchanged | No committed title or description holds a raw `"`. Across 1,600 files, three bodies hold a regex anchor written `` $` ``, which the old renderer would have expanded, and all three read as written. The one other hit, `~$0.17`, is literal to `String.replace` |

Required inventories:
- Same-class producers: `rg -n "endswith\('fixtures'\)"` finds the validator and `package_skill.py`. `rg -n '"parent_id": "null"'` finds two packets.
- Consumers of changed symbols: `detect_document_type` and `should_exclude_path` are read by the validator's own entry point and its tests. `renderTemplate` has one caller.
- Matrix axes: document folder (changelog or not) by name (install-guide word or not), and fixture segment (plain, prefixed, numbered).
- Algorithm invariant: a value pasted into the template appears in the output byte for byte, inside quotes as an escaped YAML scalar.
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
| Unit | Type detection, exclusion, rendering | pytest, vitest |
| Integration | A validator sweep over every changelog file, the generator on a scratch packet | `validate_document.py`, a scratch script |
| Manual | CHG-001 and CHG-006 walked through against the fixed workflows | The playbook scenarios |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1 and 2 committed | Internal | Green | This phase edits their files |
| The shared `dist/` build | Internal | Green | The generator fix reaches callers only after a build |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite fails after a fix, or a sweep shows a document typed or skipped differently than intended
- **Procedure**: Revert that fix's commit. Each owner's changes land in their own commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Code fixes ──► Docs, catalogs, playbooks ──► Entries and versions ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Code fixes |
| Code fixes | Setup | Docs, since the docs describe the fixed behavior |
| Docs, catalogs, playbooks | Code fixes | Entries |
| Entries and versions | Docs | Verify |
| Verify | Entries | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Med | 1 hour |
| Verification | Med | 30 minutes |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the commit that carries the failing fix
2. Rebuild `runtime/cli` if the reverted commit touched the generator
3. Rerun the suite that failed
4. Tell the operator which fix was reverted

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, since the two metadata edits change one value each and a revert restores it
<!-- /ANCHOR:enhanced-rollback -->

---
