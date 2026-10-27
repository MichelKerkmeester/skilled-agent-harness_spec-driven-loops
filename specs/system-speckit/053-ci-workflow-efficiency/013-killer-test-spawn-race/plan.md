---
title: "Implementation Plan: killer test spawn race"
description: "Report readiness from the signal-handling test targets after their SIGTERM handler is installed, and wait for it in the tests instead of waiting for the spawn event."
trigger_phrases:
  - "killer test spawn race plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: killer test spawn race

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) |
| **Framework** | node:test |
| **Storage** | None |
| **Testing** | `node --test` on the file itself |

### Overview
Change one test file. The two target helpers that install a SIGTERM handler write a ready line to stdout once it is registered, and one shared helper awaits that line. Prove it with a forced 600 ms handler delay and ten full runs.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/killer.test.cjs` prints `pass 64` and `fail 0`, ten times
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test helper readiness handshake.

### Key Components
- **`startTarget` / `startCountingTarget`**: spawn a node child whose script registers the SIGTERM handler, then prints the ready line; stdout is a pipe, the other streams stay ignored.
- **`waitForTargetReady`**: resolves on the ready line, rejects on child exit, spawn error or a 15 s timeout.

### Data Flow
Child registers the handler, writes `sigterm-handler-ready`, the test resumes, then starts the killer.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The race needs the handler to arrive late, so the proof copies the test file outside the repo and inserts a 600 ms busy wait ahead of the handler in both target scripts. The old file must fail with `ENOENT` on `target-signal`, and the fixed file must pass. Then the fixed file runs ten times unforced.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the killer suite hangs or fails on a runner. Revert the one commit that touches `killer.test.cjs`.
<!-- /ANCHOR:rollback -->

---
