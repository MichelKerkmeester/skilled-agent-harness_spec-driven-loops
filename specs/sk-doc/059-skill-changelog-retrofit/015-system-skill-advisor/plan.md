---
title: "Implementation Plan: Phase 15: system-skill-advisor changelogs"
description: "Runs the phase 001 driver over the 12 listed system-skill-advisor changelogs on two lanes, keeps each rewrite only when all three gates pass, then commits the skill once."
trigger_phrases:
  - "system-skill-advisor changelog rewrite plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: system-skill-advisor changelogs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown changelogs |
| **Framework** | sk-create-changelog's compact and expanded format contract |
| **Storage** | The changelog files in place, with run records in `../scratch/` |
| **Testing** | The shape checker, `hvr_scan.py` and the fact-check dispatch per file |

### Overview
The driver takes `../scratch/lists/system-skill-advisor.txt` and the shared state file, so files the pilot already kept are skipped. 12 files run through GPT-6 Luna at xhigh on cli-pi and cli-codex, each gated by the checker, the HVR scan and a fact check. The skill is committed once, after a final gate run over every kept file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 records the operator's style approval
- [x] The target list exists at `../scratch/lists/system-skill-advisor.txt`
- [x] The driver, checker and briefs exist in `../scratch/`

### Definition of Done
- [ ] Every listed file is kept or restored with its reason
- [ ] The final checker and HVR run over the kept files is clean
- [ ] The system-skill-advisor commit is pushed, with routing and mirrors fresh
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The phase 001 queue with two worker lanes, unchanged.

### Key Components
- **`../scratch/rewrite-driver.cjs`**: run as `--list ../scratch/lists/system-skill-advisor.txt --state ../scratch/state.jsonl`
- **`../scratch/check_changelog_shape.py`**: the final shape and frontmatter gate over the kept files

### Data Flow
Each file is copied to `../scratch/orig/`, rewritten in place, gated, and either kept or restored with its draft in `../scratch/failed/`. Every result is appended to `../scratch/state.jsonl`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The per-file gates run inside the driver. Before the commit, the checker with `--old` and `hvr_scan.py` run again over every kept file, and the orchestrator reads a sample old beside new.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 001's tooling and style approval, and GPT-6 Luna on the GPT plan through cli-pi and cli-codex.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before the commit, restore a file from `../scratch/orig/` or with `git checkout -- <file>`. After it, revert the system-skill-advisor commit.
<!-- /ANCHOR:rollback -->
