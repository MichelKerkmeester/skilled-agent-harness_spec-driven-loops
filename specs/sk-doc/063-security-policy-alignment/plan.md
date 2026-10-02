---
title: "Implementation Plan: Align SECURITY.md with sk-doc and expand it"
description: "Restructures SECURITY.md to the sk-doc README rule set and adds reporter, threat-model, safe-running and safeguard sections built only from facts read in the repository, then proves it with the sk-doc validator, DQI extraction and the HVR scanner."
trigger_phrases:
  - "security policy plan"
  - "security.md readme rule set"
  - "grounded threat model"
  - "dqi hvr security"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Align SECURITY.md with sk-doc and expand it

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc README rule set in `.skilled/skills/sk-doc/shared/assets/template-rules.json` |
| **Storage** | None |
| **Testing** | `validate_document.py`, `extract_structure.py` and `hvr_scan.py` from sk-doc |

### Overview
No sk-doc template targets a root policy document. `validate_document.py` matches no rule for `SECURITY.md` and falls back to the README rules, so the README rule set and its template, `sk-create-readme/assets/readme-template.md`, are the closest standard. The root `README.md` already passes the same rules with numbered emoji H2 headings, which this plan keeps. Content comes from reading the repository's hooks, runtime configs, dispatch skills, installers, git hooks, `.gitignore` and CI files.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-document rewrite under the README rule set.

### Key Components
- **Sections 1 and 2**: an OVERVIEW that names both readers, then the reporting channel with an expanded checklist and a note on `sk-` scanner false positives.
- **Sections 3 to 5**: the operator's acknowledgement, supported-versions and scope wording, kept word for word, plus a table of where each in-scope surface lives.
- **Sections 6 to 8**: what can go wrong, how to run Skilled safely and the safeguards the repository has, each tied to a file.
- **Section 9**: related documents, last as the rule set requires.

### Data Flow
Each claim starts as a file read during research, for example `.claude/settings.json` for the permission mode or `fanout-run.cjs` for dispatch flags, and lands in the document with that file named beside it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Baseline before the edit: `validate_document.py` exited 1 with a missing overview, DQI was 86 and the HVR ceiling was 99. After the edit the same three commands run again, and `git diff b0f89ee5f0 -- SECURITY.md` confirms which original lines left.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A. The change needs no new tool or package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit, or restore the original with `git checkout b0f89ee5f0 -- SECURITY.md`.
<!-- /ANCHOR:rollback -->

---
