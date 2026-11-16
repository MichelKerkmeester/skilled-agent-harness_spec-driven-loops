---
title: "Implementation Plan: Phase 13: fix-review-findings-in-json-entry-set-restore"
description: "Prototype the seven fixes in the overlay engine, then rebuild them from literal briefs on GPT-6 Luna through cli-codex and compare each result byte for byte with the prototype."
trigger_phrases:
  - "fix review findings in json entry set restore plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: fix-review-findings-in-json-entry-set-restore

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, no dependencies |
| **Framework** | None |
| **Storage** | `sync-state.json` in the overlay folder |
| **Testing** | `node --test` |

### Overview
The restore code in `overlay-engine.cjs` gains an item-identity check, outer-first ordering and spelling-agnostic path comparison. The re-pin reads the new commit for files its copy leaves in place and plans them before the backup. A new `cannot-apply` state replaces `both-changed` for an entry set that cannot be applied to an untouched file. Ten tests prove it, eight of which fail on the engine at `35d49e8f638`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The seven findings reproduced by the review's probes
- [x] The four design questions answered by the operator
- [x] Baseline: the doctor test folder printed tests 1204, pass 1204, fail 0

### Definition of Done
- [ ] Every rebuilt file matches the prototype byte for byte
- [x] `node --test .skilled/commands/doctor/scripts/tests` prints tests 1220, fail 0
- [ ] A fresh review of the diff reports no new defect it can reproduce
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A change inside one module.

### Key Components
- **`restoreDroppedSets` and its helpers**: decide whether each dropped record can go back to the pin's value.
- **`repinUnderLock`**: the check before the backup, and the reader that falls back to the new commit.
- **`analyze` and `fixFor`**: the `cannot-apply` state and its fix text.

### Data Flow
`planJsonOverlay` reads the live file and the recorded sets, gets the pinned copy from the run's reader, and `applyJsonOperations` restores dropped sets before it applies the operations the entry set still lists.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup writes the prototype and the briefs. Implementation runs briefs 01 to 07 on Luna, with tests first. Verification runs the whole test folder and a fresh review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/commands/doctor/scripts/tests` must print `fail 0` with 1220 tests. The review's probes p01 to p06 are rerun against the built engine.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`codex` 0.169.0 signed in with ChatGPT, for the Luna runs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a vendoring project's re-pin or apply behaves worse than at `35d49e8f638`. Revert the phase's commit. The new state name appears only in output, never in `sync-state.json`, so a revert needs no state migration.
<!-- /ANCHOR:rollback -->

---
