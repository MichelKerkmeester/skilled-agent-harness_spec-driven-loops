---
title: "Implementation Plan: Repo doc debt reference and coverage fixes"
description: "Classify all 96 broken-reference findings under four ordered rules, batch the README edits per tree, close the 13 coverage gaps, then rerun the fast checker, the README validator, the two README tests and the link guard."
trigger_phrases:
  - "reference and coverage fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Repo doc debt reference and coverage fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `validate_document.py`, the manifest and parity tests, the markdown link guard |

### Overview
Classify all 96 broken-reference findings under four ordered rules, batch the README edits per tree, close the 13 coverage gaps, then rerun the fast checker, the README validator, the two README tests and the link guard.
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
- [x] The fast checker prints 27 broken and 0 coverage over the 59 READMEs, and `validate_document.py --type readme` exits 0 on 59 of 59
- [x] `test_readme_manifest.py` prints `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible` and `test_readme_verdict_parity.py` prints `PARITY PASS: verdict diff is empty`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: documentation edits classified by a four-rule ledger and checked by the repo's own validators.

### Key Components
- **The fast checker**: the audit's own extract and resolve functions, run over the 59 READMEs in scope, reporting a broken and a coverage count
- **The four rules**: the classification order that decides whether a finding is text to leave, a placeholder to reshape, or a pointer to repair
- **`validate_document.py`**: the README template check, one run per file
- **The manifest and parity tests**: proof that discovery still reproduces and that the validator verdict did not move

### Data Flow
The audit lists each finding as a README plus a token. The token is tested in order: `git check-ignore -v` for a runtime artifact, then resolve from the nearest ancestor that holds a `package.json`, then a placeholder shape, and if none matches it is real. Real findings are repaired against `git ls-files` and `readlink`, the READMEs are edited in batches per tree, and then the fast checker, the validator, the two tests and the link guard run again on the final tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The 59 READMEs | Own the prose a reader follows | update | fast checker: 96 to 27 broken, 13 to 0 coverage; `validate_document.py` exit 0 on 59 of 59 |
| The audit's exclusion list | Decides which READMEs the audit skips | unchanged | `.skilled/commands/create/readme.md` stays excluded; the 59 are all outside `*/benchmark/reports/` |
| Changelog entries and version carriers | Record what changed per skill | update | 11 patch entries, each carrier at the same version, `validate_document.py` exit 0 and `hvr_scan` 0 hard blockers |
| The README manifest and verdict baseline | Record expected discovery and verdicts | unchanged | `manifest=reproducible` and `PARITY PASS: verdict diff is empty` with no baseline rewrite |
| The repo markdown link guard | Checks every tracked link | unchanged | 7663 files, 13976 links checked, 0 broken |

Required inventories:
- Same-class producers: the audit's `extract` and `resolve` functions produce every finding, so one pass over the 59 READMEs covers the class.
- Consumers: `validate_document.py`, the manifest test, the parity test and the link guard read the edited READMEs; each was rerun rather than inspected.
- Matrix axes: the rule (1 to 4) and the tree the README sits under (system-spec-kit, hooks, sk-doc, other) are the two independent axes, and every finding takes one cell of each.
- Algorithm invariant: for every reference left in place, `git check-ignore -v` matches or the path resolves from the nearest `package.json` ancestor. The adversarial cases are a truncated name, a symlink target spelled from the link's folder, a compiled `.js` name whose `.ts` source is tracked, and a path with no target at all.
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
| Unit | Each edited README | `validate_document.py --type readme` |
| Integration | The 59 READMEs and the whole repo | fast checker over the 59, `test_readme_manifest.py`, `test_readme_verdict_parity.py`, `check-markdown-links.cjs` |
| Manual | Every diff, for a lost fact or an invented target | `git diff` read in full |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The audit's extract and resolve functions | Internal | Green | No before and after count |
| `git check-ignore`, `git ls-files`, `readlink` | Internal | Green | Rules 1 and 2 cannot be proven, so no finding can be classified |
| The spec-gate and retrieval vitest suites | Internal | Green | The two rewritten test commands would be unproven: 9 tests and 222 tests in 6 files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A repaired path turns out wrong, or a README loses a fact the batch edit did not carry
- **Procedure**: Revert the batch commit for that tree; every change is a line edit inside one README, and no code, manifest or baseline moved
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The fast checker baseline | Implementation |
| Implementation | Setup and the four-rule classification | Verification |
| Verification | Implementation | Closing the packet |
<!-- /ANCHOR:phase-deps -->

---
