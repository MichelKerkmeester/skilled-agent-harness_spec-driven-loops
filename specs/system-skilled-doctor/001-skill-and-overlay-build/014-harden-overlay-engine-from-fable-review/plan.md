---
title: "Implementation Plan: Phase 14: harden-overlay-engine-from-fable-review"
description: "Nine fixes in the overlay engine from the Fable review, in four groups: apply-failure state first, then data safety, status honesty and the pinned-copy cross-check. Each fix lands with a test that fails on 969335a6380."
trigger_phrases:
  - "harden overlay engine from fable review plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: harden-overlay-engine-from-fable-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, no dependencies |
| **Framework** | None |
| **Storage** | `sync-state.json` and the overlay manifest, both JSON files |
| **Testing** | `node --test` |

### Overview
Change one file, `overlay-engine.cjs`, in nine places, and the doctor overlay docs that describe its output. Each fix lands with a test that shows the problem on `969335a6380` first. The suite proves the whole: `fail 0`, ten or more tests above 1220.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The three open questions in `spec.md` §7 have operator answers
- [ ] The probes for items 2, 3 and 5 show the problem on `969335a6380`
- [ ] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` as the baseline

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with at least 1230 tests
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single engine module.

### Key Components
- **`applyUnderLock`**: writes the state right after the destination writes, and marks a regenerate as pending so a rerun runs it.
- **`planJsonOverlay`**: catches a malformed entry set as a problem, and builds the cross-check result from the pinned text.
- **`restoreDroppedSets`**: reads the `added` flag before it deletes a key.
- **`loadState` and `writeStateIfChanged`**: check record shapes on load and write through a temporary file and a rename.
- **`staleRootFiles` and `pinnedUpstreamBytes`**: report a skipped check and resolve `pin.checkout` against the tree root.

### Data Flow
Status and apply read the manifest and the state, plan each overlay against the live file, and print one line per destination. This phase adds `NOTE` and cross-check lines to that output and moves the state write earlier in apply.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup writes the three probes and records the baseline. Implementation lands the apply-failure group first, because the item 3 fix depends on item 2's early state write, then data safety, status honesty and the cross-check. Verification runs the full doctor suite and the probes on the built engine. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/commands/doctor/scripts/tests` must print `fail 0` with at least 1230 tests. Each probe in `scratch/` must show its problem on `969335a6380` and not on the built engine.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond Node.js and git, which the engine already uses.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a Barter re-pin or status run fails on a behavior this phase changed. Revert the phase's one commit and tell Barter to stay on `969335a6380`.
<!-- /ANCHOR:rollback -->

---
