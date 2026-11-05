---
title: "Implementation Plan: Check whether the v4.0.1.0 release means AGENTS.md or the repo rules need updating"
description: "Five research iterations checked AGENTS.md, REPO RULES.md and the rule files against the v4.0.1.0 release and found one edit worth making. The approved edit names ROUTER.md in the Gate 2 artifact trigger, and the doctor manifest generator records the new section."
trigger_phrases:
  - "v4 0 1 0 rules refresh plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Check whether the v4.0.1.0 release means AGENTS.md or the repo rules need updating

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown instruction file, JSON manifest |
| **Framework** | The `/doctor:agents-md` tooling under `.skilled/commands/doctor/scripts/` |
| **Storage** | None |
| **Testing** | `agents-md-check.cjs` and `agents-md-manifest.cjs --check` |

### Overview
The research in `research/research.md` found that Gate 2 at `AGENTS.md:70` never names `ROUTER.md`, the file v4.0.1.0 moved every skill's routing into. The plan changes one phrase in that sentence and then regenerates the manifest's `derived` key with `agents-md-manifest.cjs --write`, because the manifest records each shipped section's body and a hand edit reads as a local change. The proof is `agents-md-check.cjs` at 12 of 12 with the delivery budget still passing.
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
- [x] `node .skilled/commands/doctor/scripts/agents-md-check.cjs` prints `STATUS=OK rows=12 findings=0` and A6 reads 16371 of 16384 bytes
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Edit then regenerate.

### Key Components
- **`AGENTS.md`**: the shipped instruction template. Line 70 holds the Gate 2 artifact trigger.
- **`.skilled/commands/doctor/assets/agents-md-manifest.json`**: records each shipped section's body, hash and byte offsets in its `derived` key. `agents-md-manifest.cjs --write` is the only writer of that key.

### Data Flow
The edit changes the Gate 2 section body by three bytes. `agents-md-manifest.cjs --write` re-segments `AGENTS.md`, records the new body and moves the later sections' offsets. `agents-md-check.cjs` then compares the file with the manifest and with the runtime copies.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`agents-md-check.cjs` runs before and after the edit, and `agents-md-manifest.cjs --check` runs after the regeneration. Between the edit and the regeneration the check reports A4, A9 and A12 as findings, which shows it reads the change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the doctor scripts already in the repository.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert `AGENTS.md` and `agents-md-manifest.json` together, then run `agents-md-manifest.cjs --check`. Reverting only one of them leaves A4 reporting an edited section.
<!-- /ANCHOR:rollback -->

---
