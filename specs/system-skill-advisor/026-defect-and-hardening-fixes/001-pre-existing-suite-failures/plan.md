---
title: "Implementation Plan: The five suite failures the decommission inherited"
description: "Diagnose each failure to its cause before touching anything, fix the three with causes, and measure the fix against the accuracy pins to prove it moved nothing."
trigger_phrases:
  - "diagnose before fixing suite failures"
  - "measure fix against accuracy pin"
  - "half applied rename projection"
  - "recount census pin"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: The five suite failures the decommission inherited

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript scorer projection plus its Vitest suites |
| **Framework** | The advisor runtime |
| **Storage** | None |
| **Testing** | The three command suites, the two parity suites, and the shipped routing-accuracy floor gate |

### Overview

Read each failure before changing anything, because "pre-existing" had already hidden two different kinds of problem behind one label. Three had causes and were fixed at the cause. Two turned out to measure something else entirely, and the plan for those is to say so rather than move the number.
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

One file describes the same two command bridges twice: once as the command-bridge list the scorer consults, once as an inventory projection carrying `inventoryId` and `routingEnabled`. A drift guard exists precisely because two descriptions of one thing will disagree, and here they had.

### Key Components
- **The command-bridge block**: already migrated to the live `/speckit:save`, with the retired id kept as the scorer key
- **The inventory projection block**: the copy the rename missed
- **The census pin**: a hand-maintained count of declared commands, which its own comment says to recount rather than relax
- **The accuracy pins**: two suites asserting the scorer reproduces a dated baseline exactly

### Data Flow

A prompt reaches the scorer, which consults the bridge vocabulary; the guards compare that vocabulary against the command files on disk and against the inventory projection of the same entries.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The risk in this change is invisible: editing routing vocabulary can move scorer accuracy without any test naming the vocabulary. So the accuracy pin was measured with the change and without it, by restoring the file from HEAD and re-running. Both gave 152, which is what makes the claim that this fix is accuracy-neutral an observation rather than an assumption.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the advisor runtime's installed test dependencies.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two files. Both are source-level; no generated artifact or database is touched, and the accuracy numbers are unchanged either way.
<!-- /ANCHOR:rollback -->

---
