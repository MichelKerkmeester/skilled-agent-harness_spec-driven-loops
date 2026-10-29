---
title: "Implementation Plan: Phase 2: remaining-references"
description: "The phase 1 script runs over the 22 fixable references with a hand-listed edits file for the citations it cannot place, then a proof table, a rescan and a routing replay show nothing moved. The five other files are exempted by exact path suffix, recorded in a decision record."
trigger_phrases:
  - "remaining references plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: remaining-references

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, the phase 1 Python script in `../001-diagram-references/scratch/` |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `validate_document.py`, `leaf-route-replay.cjs`, `package_skill.py`, `parent-skill-check.cjs` |

### Overview
The script runs in three modes: wrap the intro as an overview, insert an overview above a bare list, and shift a wrongly numbered doc into sequence. Citations the script cannot place by the words around them are listed by hand in `scratch/edits.json` with the old and new number, and the proof table checks each one against the heading words on both sides.
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
- [x] 22 of 22 fixable files report `Total issues: 0` and the rerun over 454 references reads 445 OK, 5 FAIL, 4 SKIPPED
- [x] The five remaining files are exempted by exact path suffix with a test, and the rerun reads 445 OK, 0 FAIL, 9 SKIPPED
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: reuse the phase 1 plan, check and apply script, extended with an edits file for citations outside the change set.

### Key Components
- **renumber-references.py**: plans, applies, rescans and compares files against their git revision, now with `--edits` for hand-listed prose citations
- **scratch/edits.json**: 23 entries, each with the file, line, old text, new text, the target doc and the number pairs
- **validate_document.py**: counts issues per file

### Data Flow
The script reads each of the 22 references and the 11 edit-only files, maps each wrongly numbered doc to a sequence starting at 1, rewrites the references it can place, applies the listed edits, and then reads the headings back out of the new text to compare each target heading with the old one.
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
| Unit | Each changed file, 33 in all | `validate_document.py` |
| Unit | The format-spec exemption | `test_format_spec_exclusion.py` with `pytest` |
| Integration | The 33 files together | proof table, second reference scan, content-preservation comparison |
| Regression | All 454 tracked references | `validate-all.py` before and after, one row per file |
| Routing | The whole hub set | `leaf-route-replay.cjs` before and after, `cmp` on the reports |
| Package | The 12 touched skills | `package_skill.py --check --strict`, `parent-skill-check.cjs`, `generate-leaf-manifest.cjs --check`, the Hermes sync check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 script | Internal | Green | No proof table |
| validate_document.py | Internal | Green | No counts |
| sk-create-changelog | Internal | Green | No version rule for the bullets |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A citation lands on a different heading than before, or the replay totals line moves
- **Procedure**: Restore the 33 docs, the 12 changelog entries and the Hermes copy from git. The edits file and the script stay in scratch.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification ──► Decisions
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 closed, baseline counts and replay | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Decisions |
| Decisions | Verification | Commit |
<!-- /ANCHOR:phase-deps -->

---
