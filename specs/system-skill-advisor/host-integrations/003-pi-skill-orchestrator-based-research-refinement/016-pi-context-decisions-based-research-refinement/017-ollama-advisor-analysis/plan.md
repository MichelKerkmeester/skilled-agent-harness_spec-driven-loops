---
title: "Implementation Plan: Phase 17: ollama-advisor-analysis"
description: "One read-only Fable 5.2 medium dispatch through the claude2 account analyses the advisor's Ollama and embedder path. The conductor saves the report and checks its top findings against the code."
trigger_phrases:
  - "ollama advisor analysis plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: ollama-advisor-analysis

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS advisor runtime, Python scorer |
| **Framework** | None: Node daemon behind `.skilled/bin/system-skill-advisor-launcher.cjs` |
| **Storage** | Skill-graph SQLite and embedding cache under the advisor DB dir |
| **Testing** | None run: report-only phase |

### Overview
Nothing in the advisor changes. A fresh Fable 5.2 session on the `claude2` account reads the Ollama adapter, the semantic lane, the launcher and the doctor embedder route in plan mode and prints one report. The conductor saves it as `evidence/report.md` and confirms or refutes its top findings by reading the cited lines.
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
- [x] `rg -c 'ts:[0-9]+|cjs:[0-9]+|mjs:[0-9]+' evidence/report.md` prints at least 5, and `git status --short` shows nothing outside this folder
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single read-only dispatch

### Key Components
- **`claude2 -p` dispatch**: Fable 5.2, `--effort medium`, `--permission-mode plan`, `--agent review`, child env set.
- **`evidence/report.md`**: the saved stdout.

### Data Flow
Prompt file, then `claude2 -p`, then stdout captured to scratch, then copied to `evidence/report.md` after the conductor reads it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup writes the prompt, Implementation runs the dispatch and saves the report, Verification checks the top findings and the clean status.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A: a report-only phase runs no tests. Its checks are the two Definition of Done commands.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `claude2` shell function with its account-2 OAuth token, and Claude Code accepting `claude-fable-5-2`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A: the phase writes only its own folder; deleting `evidence/report.md` undoes it.
<!-- /ANCHOR:rollback -->

---
