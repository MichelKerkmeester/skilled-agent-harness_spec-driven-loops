---
title: "Implementation Plan: Phase 11: authoring-speed-research"
description: "Five `/deep:research` iterations with cli-pi DeepSeek V4.1 Flash max study where models spend time writing and maintaining spec docs. An Opus high subagent then ranks each change by time saved against quality risk in `research/research.md`."
trigger_phrases:
  - "authoring speed research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 11: authoring-speed-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSONL research artifacts |
| **Framework** | `/deep:research` with the cli-pi executor |
| **Storage** | Files under `research/` |
| **Testing** | `validate.sh --strict` and `rg` counts |

### Overview
Five `/deep:research` iterations with cli-pi DeepSeek V4.1 Flash max study where models spend time writing and maintaining spec docs. An Opus high subagent then ranks each change by time saved against quality risk in `research/research.md`. No source file changes in this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research loop, then synthesis.

### Key Components
- **`pi-deepseek` lineage**: runs the five iterations and writes them under `research/lineages/pi-deepseek/`.
- **Opus high synthesis**: reads the iterations and writes `research/research.md`.

### Data Flow
Iterations cite templates, the card and phase 009 timings. The synthesis ranks their findings, and the conductor assigns each one to a later phase or a deferral.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns task state.

### Step 1: Run the research

Five iterations run in the `pi-deepseek` lineage.

Acceptance: five iteration files exist and each cites source lines.
Verify: `ls research/lineages/pi-deepseek/iterations/ | wc -l` prints 5.

### Step 2: Synthesize

An Opus high subagent writes `research/research.md`, ranking each change by time saved against quality risk.

Acceptance: every ranked row carries a `[SOURCE: path:line]` citation.
Verify: `rg -c 'SOURCE:' research/research.md` prints a count at least equal to the ranked rows.

### Step 3: Assign each recommendation

Each recommendation goes to a later phase, built by Opus medium subagents, or is recorded as deferred with its reason.

Acceptance: no ranked row lacks a phase or a deferral.
Verify: `rg -n 'Deferred|Phase' research/research.md` prints one line per ranked row.

### Step 4: Validate

Acceptance: the folder passes strict validation.
Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No speed benchmark runs here. Timing is measured on 2026-10-26. Steps 1 to 4 carry the checks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

cli-pi with DeepSeek V4.1 Flash max, and an Opus high subagent.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the research output is unusable. Delete the `research/` lineage output and rerun Step 1. No source file changes, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---

