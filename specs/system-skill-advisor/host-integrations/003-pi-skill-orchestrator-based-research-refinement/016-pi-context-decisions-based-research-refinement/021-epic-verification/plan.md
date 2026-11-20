---
title: "Implementation Plan: Phase 21: epic-verification"
description: "One read-only Fable 5.2 high dispatch through the claude2 account checks the epic's Ollama claims and its other main claims against the advisor code at HEAD. The conductor saves the report and checks every verdict that is not CONFIRMED."
trigger_phrases:
  - "epic verification plan"
importance_tier: "normal"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 21: epic-verification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS advisor runtime, Python scorer |
| **Framework** | None: Node daemon behind `.skilled/bin/system-skill-advisor-launcher.cjs` |
| **Storage** | Skill-graph SQLite under the advisor DB dir |
| **Testing** | None run: report-only phase |

### Overview
Nothing in the advisor changes. A fresh Fable 5.2 session at high effort on the `claude2` account reads the advisor code in plan mode and gives each of ten claims a verdict with file:line, then lists defects. The conductor saves it as `evidence/report.md` and confirms or refutes each verdict that is not CONFIRMED, and each P0 or P1 defect, by reading the cited lines.
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
- [x] `evidence/report.md` has a verdict line for each of O1 to O6 and S1 to S4, and `git status --short` shows nothing from this phase outside this folder and the parent `spec.md`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single read-only dispatch

### Key Components
- **`claude2 -p` dispatch**: `--model claude-fable-5-2`, `--effort high`, `--permission-mode plan`, `--agent review`, with `AI_SESSION_CHILD=1`, `SYSTEM_SPEC_GATE_ENFORCE=0` and the child preamble.
- **`evidence/report.md`**: the saved stdout.

### Data Flow
`scratch/prompt.md`, then `claude2 -p`, then stdout captured in the session scratchpad, then copied to `evidence/report.md` after the conductor reads it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup writes the prompt, Implementation runs the dispatch and saves the report, Verification checks the verdicts and the clean status.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A: a report-only phase runs no tests. Its checks are the two Definition of Done commands and the conductor's line reads.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `claude2` shell function with its account-2 OAuth token, and Claude Code accepting `claude-fable-5-2`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A: the phase writes only its own folder and two parent map rows; reverting its commit undoes it.
<!-- /ANCHOR:rollback -->

---
