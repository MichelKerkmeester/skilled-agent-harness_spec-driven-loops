---
title: "Implementation Plan: Phase 54: handover-review-remediation"
description: "Add withdrawOnPrompt to lib/withdraw.cjs, point the five adapters at it and correct three hook docs, each edit dispatched to Vibe deepseek-flash as a literal brief."
trigger_phrases:
  - "handover review remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 54: handover-review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM, TypeScript (Pi) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test, vitest |

### Overview
`withdrawOnPrompt` wraps `withdrawHandOver` for a runtime prompt hook: it logs a failure as `context-nudge-error`, logs the runtime's own success event and returns a boolean. The Claude, Codex, OpenCode, Pi and Vibe adapters call it in place of their own copies. Three hook docs are corrected and two name the helper. Each edit ran as a literal brief on Vibe `deepseek-flash`.
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
- [x] `node --test .skilled/hooks/session-handover/tests/*.test.cjs` prints `pass 1055` and `fail 0`, and the hooks vitest config prints `509 passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared helper in place of five copies.

### Key Components
- **`withdrawOnPrompt` in `lib/withdraw.cjs`**: the prompt-hook form of `withdrawHandOver`.
- **The adapters**: each passes its own log writer and success event name.

### Data Flow
A prompt reaches an adapter, the adapter calls `withdrawOnPrompt`, the helper disarms the record under its lock and logs the outcome through the adapter's writer.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup, the five iterations, then synthesis.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Four helper tests cover a withdrawal, nothing to withdraw, a throwing withdrawal and a throwing log. The full node suite and the hooks vitest config run against a baseline taken before any edit, and the Pi adapter is typechecked against its original.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node` and the `vibe` 3.1.2 CLI with the repository's `deepseek-flash` row. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a runtime stops withdrawing a hand-over on a prompt. Revert the commit; the adapters return to their own copies and nothing else depends on the helper.
<!-- /ANCHOR:rollback -->

---
