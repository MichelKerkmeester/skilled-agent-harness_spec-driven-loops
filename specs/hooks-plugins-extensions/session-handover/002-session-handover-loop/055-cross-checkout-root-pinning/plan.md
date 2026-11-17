---
title: "Implementation Plan: Phase 55: cross-checkout-root-pinning"
description: "Pin one hand-over root per loop in the wrapper, print the CLI by its absolute path, name an outside note with a pinned claim command, and make the shim keep trust across checkouts. Each fix gets a test that fails on the old code first."
trigger_phrases:
  - "cross checkout root pinning plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 55: cross-checkout-root-pinning

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 and zsh (wrapper, shim), Node CommonJS and ESM (CLI, nudge, Claude adapter) |
| **Framework** | None |
| **Storage** | Handoff notes under `<root>/.skilled/skills/.state/session-handover/handoffs/` |
| **Testing** | `node --test`, hooks vitest |

### Overview
The wrapper exports `SESSION_HANDOVER_REPO_ROOT`, the one variable every CLI copy already reads its root from, so the fix sits at the producer and no adapter changes. The nudge module builds its one printed command from its own absolute path, which reaches every adapter that passes `nudge.CLI_COMMAND`. Consume, the wrapper's decline branch and the shim each take a small change, and each gets a test that reproduces the reported symptom first.
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
- [x] `node --test .skilled/hooks/session-handover/tests/*.test.cjs` prints `fail 0`, the OpenCode plugin suite prints `fail 0` and hooks vitest prints all passed
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pin at launch.

### Key Components
- **`skilled-loop`**: exports the root before the first launch and turns an `outside-root` consume into a named warning plus a pinned claim command.
- **`session-handover.cjs consume`**: reports `outside-root`, the loop's root and the note's own root instead of `missing`.
- **`nudge.cjs`**: owns the one absolute CLI command every adapter prints.
- **`skilled-loop-shell.sh`**: carries an earlier checkout into the trusted list and resolves the `skilled-loop` function through the same trust check a runtime launch uses.

### Data Flow
The wrapper exports the root, the runtime inherits it, and every hand-over CLI the session runs plans and prepares the note under it. The wrapper's own consume reads the same directory, so the note is found. A note written before the pin or under a caller-chosen root comes back as `outside-root`, and the wrapper prints a claim command that sets the note's own root.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the wrapper, the shim, `consume` and `resolveRepoRoot()`, and records the suite baselines. Implementation writes each failing test, then changes the wrapper, the shim, the CLI, the nudge module and the docs. Verification reruns the three suites, shellcheck and the doc validators against the baselines. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new test ran against the unchanged code first and failed with the reported symptom, then passed after the change. The whole node suite, the OpenCode plugin suite and hooks vitest ran before and after to compare counts.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a relaunch that worked before now declines, or a note lands outside every root. Revert the phase's commit. The wrapper then stops exporting the root, and every CLI falls back to its own install root as before.
<!-- /ANCHOR:rollback -->

---
