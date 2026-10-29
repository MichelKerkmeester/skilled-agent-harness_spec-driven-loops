---
title: "Implementation Plan: Phase 1: diagram-references"
description: "One script renumbers the 34 diagram references, rewrites their section citations from per-file maps and proves from the new text that every citation still lands on the same heading."
trigger_phrases:
  - "diagram references plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: diagram-references

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, one Python script in `scratch/` |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `validate_document.py`, `leaf-route-replay.cjs`, `check-diagram-corpus.cjs` |

### Overview
One script wraps each intro as `## 1. OVERVIEW`, shifts every later section and subsection number by one, rewrites each `§N` from the right file's map, capitalises titles and adds the missing rules. It emits the proof table before it writes anything and refuses to write on a mismatch.
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
- [x] 34 of 34 files report `Total issues: 0`, down from 190 issues
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a plan, check and apply script over tracked docs, with the check built from the new text so the renumbering map cannot vouch for itself.

### Key Components
- **renumber-references.py**: plans, applies, rescans and compares files against their git revision
- **validate_document.py**: counts issues per file
- **leaf-route-replay.cjs**: shows routing did not move

### Data Flow
The script parses each file outside code fences, builds an old to new number map per file, places every `§N` on its target file by the words around it (a file name before or after, a type slug, a `rule N` suffix or a hand-listed override), rewrites the references and headings, and then reads the headings back out of the new text to compare each target heading with the old one.
<!-- /ANCHOR:architecture -->

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
| Unit | Each changed file | `validate_document.py` |
| Integration | The 34 files together | proof table, second reference scan, content-preservation comparison |
| Negative control | The reference scan | A copy with renumbered headings and untouched citations reports 20 dangling references |
| Routing | The whole hub set | `leaf-route-replay.cjs` before and after, `cmp` on the reports |
| Corpus | The diagram packet | `check-diagram-corpus.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| validate_document.py | Internal | Green | No counts |
| leaf-route-replay.cjs | Internal | Green | No routing proof |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A citation lands on a different heading than before
- **Procedure**: Restore the 34 files from git. The script is rerunnable and idempotent on a converted tree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Baseline counts and replay | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->
