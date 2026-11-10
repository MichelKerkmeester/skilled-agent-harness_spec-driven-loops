---
title: "Implementation Plan: Benchmark report READMEs: restructure 235 legacy reports to the numbered template and resolve their broken references"
description: "A deterministic text transform rewrites each of the 235 report READMEs into the numbered layout without touching a fact, a line checker compares every file with its HEAD revision, and the 13 touched skills get a patch entry with version carriers."
trigger_phrases:
  - "benchmark report readmes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Benchmark report READMEs: restructure 235 legacy reports to the numbered template and resolve their broken references

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reports, Python 3 for the transform and the checkers |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `validate_document.py`, `audit_readmes.py`, `test_readme_verdict_parity.py`, `test_readme_manifest.py` |

### Overview
One deterministic transform rewrites the 235 report READMEs into the numbered layout the template asks for: separators inserted, the Reading This Folder paragraph moved up as the overview, and two headings renamed. It refuses any file outside the census, so the change cannot spread past the reports. A line checker proves each file kept every non-heading line, and the repo's own README checks prove the result.
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
- [x] `validate_document.py --type readme --json` on all 235 prints `valid: true` with 0 blocking errors and 0 warnings, and `test_readme_verdict_parity.py` prints `PARITY PASS: verdict diff is empty`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a deterministic in-place text transform, checked by the repo's own README validator rather than by a new test.

### Key Components
- **The census**: Names the 235 files by their shared heading sequence, so the transform has a set it can refuse to leave
- **The transform**: Inserts separators, moves one paragraph, renames two headings, and refuses any file that does not match the census or already carries the new headings
- **The line checker**: Compares each file with its HEAD revision and proves the non-heading, non-separator, non-blank multiset unchanged
- **The verdict baseline**: Stores the validator verdict per tracked README, so the parity test reads the 235 as fixed rather than as drift

### Data Flow
The census lists the files, the transform rewrites each one in place, the line checker compares the result with HEAD, then the README validator, the audit, the parity test and the manifest test run in that order over the rewritten tree. A file that fails the census is refused before anything is written, and a second pass over a transformed file is refused by the idempotence guard.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The fix is text, but its consumers are the repo's README checks, so each one is named here with the rerun that answers it.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `*/benchmark/reports/*/README.md` (producer) | Owns the report text a reader opens after a run | update, 235 files | heading diff, plus `checked=235 pass=235 fail=0` |
| `validate_document.py --type readme` (consumer) | Reports the missing overview as a blocking error | unchanged | 235 valid, 0 blocking errors, 0 warnings |
| `audit_readmes.py` (consumer) | Counts template-invalid READMEs across the repo | unchanged | `template_invalid` 237 -> 2 |
| `test_readme_verdict_parity.py` and its stored baseline (consumer) | Compares each tracked README's verdict with the baseline | baseline rebuilt | `PARITY PASS: verdict diff is empty` |
| `test_readme_manifest.py` (consumer) | Checks discovery and manifest reproducibility | unchanged | `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible` |

Required inventories:
- Same-class producers: `rg -n '^## (Run|Files|Reading This Folder)$' --glob '**/benchmark/reports/*/README.md'` lists the census before the pass and nothing after it.
- Consumers of changed symbols: the four rows above are the consumers, and each one is a rerun rather than an inspection.
- Matrix axes: one axis is the report shape (a record with a derived-record line and verdict line, one with neither, one with a two-line `>` quote); the other is the outcome (already valid, restructured, refused).
- Algorithm invariant: the transform only inserts separators, moves one paragraph and renames two headings. Every other line survives with its order intact, and no file is written unless its heading sequence matched the census.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the census and the before counts. Implementation transforms the 235, fixes the removed-runner reference and rebuilds the verdict baseline. Verification reruns the validator, the audit and both README tests.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each of the 235 rewritten reports | `validate_document.py --type readme --json` |
| Integration | The whole repo | `audit_readmes.py`, `test_readme_verdict_parity.py`, `test_readme_manifest.py`, before and after |
| Manual | Diff review for a lost or invented line | `git diff` against HEAD |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Python 3 and the repo's README scripts | Internal | Green | No transform and no counts; the reports stay as they were |
| The reports the current renderer already wrote | Internal | Green | The target numbering would have to be read off the template alone |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A restructure turns out to have moved a fact, or a report reads wrong after the pass
- **Procedure**: Restore the affected files from HEAD and rerun the census, since the transform is deterministic and reproduces the same result from the same input
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The before counts | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---
