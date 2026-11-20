---
title: "Implementation Plan: Phase 11: readme-guards"
description: "Fix the two sk-create-skill templates and the checklist line in this session, add a README-only Mermaid check with tests first, then have one Hy4 writer and one Hy4 reviewer per failing README apply a marker or a rewording."
trigger_phrases:
  - "readme guards plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: readme-guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python 3 |
| **Framework** | sk-doc `validate_document.py`, the sk-create-readme checkers |
| **Storage** | None |
| **Testing** | pytest through `run-script-tests.sh`, both README checkers, `test_readme_verdict_parity.py` |

### Overview
The template and checklist edits are small and go in first. The Mermaid check sits beside `validate_folds`, keys on the file name and skips a fence nested in a longer one. Each failing README gets an exact change list: a `readme-check` marker for a path or count the checkout cannot prove, or a rewording where plain prose reads as a count or a placeholder reads as a path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Both README checkers print `fail=0` on the 19 files and `run-script-tests.sh` prints `all sk-doc script tests passed`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One validator rule beside the fold rule, and per-file change lists for the READMEs.

### Key Components
- **`validate_readme_diagrams`**: tracks fence state line by line and flags a fence that opens at the top level with the info string `mermaid`, backtick or tilde, in a file named `README.md`
- **Writer sessions**: Hy4 Flash Free at `high` through cli-opencode, one README per session, each given its exact change list
- **Reviewer sessions**: the same model, read-only, confirming each marker names something the checkout cannot hold and each rewording keeps the meaning

### Enumeration
```bash
cat refs-final.txt claims-final.txt | grep ^FAIL | awk '{print $2}' | tr -d : | sort -u
```
Expected: 19 lines. The two lists are the phase 010 checker results in the session scratchpad.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the findings. Implementation edits the templates, adds the check and runs the writers. Verification reruns every gate and pushes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Two pytest cases for the check, run red first: one where each of three fence shapes blocks a README, and one where a non-README file and an example inside an outer fence pass. A scan of every tracked README with the new check and the parity test prove no current README flips. Both checkers and the validator run on each of the 19 files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode-go/hy4-flash-free#high` | External | Green in phase 010 | The README fixes wait for another executor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. The template edits, the check, its tests and the README fixes all sit in it.
<!-- /ANCHOR:rollback -->

---
