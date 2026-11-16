---
title: "Implementation Plan: Research the current repository reality for a root README rewrite"
description: "Run a deep-research loop over the release delta and the current inventory, then rewrite the root README from those findings and prove it with the sk-doc validator, the voice scanner and a link check."
trigger_phrases:
  - "root readme rewrite plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Research the current repository reality for a root README rewrite

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc README template and voice rules |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py` and a relative-link check |

### Overview
A 20-iteration deep-research run on the Devin CLI maps what changed since v4.0.0.0 and what the repository holds today. The root `README.md` is then rewritten from those findings. Sentences get shorter, paragraphs replace most bullet lists and detail moves to the skill and hook READMEs. Every claim is checked against a file before it is written.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Section order approved by the operator
- [x] Research findings available in `research/research.md`

### Definition of Done
- [x] `python3 .skilled/skills/sk-doc/scripts/validate_document.py README.md` prints valid with no warning
- [x] `hvr_scan.py README.md` reports 0 hard blockers and a ceiling at or above 81/100
- [x] Every relative link in `README.md` resolves
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation rewrite from verified research

### Key Components
- **`research/research.md`**: The verified facts, including the hook-by-runtime table
- **`README.md`**: The rewritten front page
- **Parent `spec.md` and `graph-metadata.json`**: Register this child in the phase map

### Data Flow
Git history, changelogs and the files on disk feed the research. The research feeds the README. No code reads the README.

### Approved Section Order
Overview, quick start, how it works, everyday workflows, skills, then hooks, plugins and extensions with one subsection each. After that come agents, commands, runtimes and CLI bridges, doctor commands, Code Mode, git worktrees, configuration and privacy, what is new since v4.0.0.0, FAQ and related documents.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Research runs first. Setup takes the README baselines. Implementation rewrites the file. Verification reruns the validator, the scanner and the link check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `validate_document.py` and `hvr_scan.py` on `README.md` and compare with the baseline: valid with one warning, 2 hard blockers, ceiling 81/100. Check every relative link target exists. Spot-check the load-bearing counts and runtime lists against the files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Devin CLI with `deepseek-v4-1-flash-max` | External | Done | Research could not run |
| sk-doc validator and voice scanner | Internal | Green | No objective gate for the rewrite |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rewrite drops a needed fact or reads worse than the original
- **Procedure**: `git checkout HEAD -- README.md` restores the previous version
<!-- /ANCHOR:rollback -->
