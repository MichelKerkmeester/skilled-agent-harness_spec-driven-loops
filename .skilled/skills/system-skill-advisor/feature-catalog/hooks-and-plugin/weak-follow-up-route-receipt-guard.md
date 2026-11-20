---
title: "Weak Follow-Up Route-Receipt Guard"
description: "Suppresses a confidence-floored route on a weak follow-up when it conflicts with a current session route receipt."
trigger_phrases:
  - "Weak Follow-Up Route-Receipt Guard"
  - "weak follow-up route receipt"
  - "session route receipt"
  - "confidence-floored follow-up"
version: 1.0.2.0
---

# Weak Follow-Up Route-Receipt Guard

## 1. OVERVIEW

The Claude hook holds back a confidence-floored route when a weak follow-up points to a different skill than the session's current route receipt.

---

## 2. HOW IT WORKS

When receipt tracking is enabled and the session clock is available, the hook records a receipt for a brief with a recommendation not marked confidence-floored and a non-degraded result. The receipt stores the routed skill and the session lifecycle clock. It also stores the transcript size.

On a later turn, the hook suppresses a recommendation only when it is a floored work-intent route to a different skill and the prompt points back to earlier work. The saved receipt must still match the session clock, and a transcript smaller than the recorded size leaves the turn to deliver normally. A missing receipt or storage error also leaves the turn to deliver. DSH sends no transcript path, so its adapter drops the session's receipt directly at a session start or a clean compaction. It holds that session's next turn until the drop and the clock rotation finish.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts` | Shared | Stores session route receipts and decides when a weak follow-up is suppressed. |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Handler | Checks Claude follow-ups against receipts and prepares eligible receipt writes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/route-receipt.vitest.ts` | Automated test | Guard decisions, lifecycle changes, transcript shrink and receipt storage. |

---

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `hooks-and-plugin/weak-follow-up-route-receipt-guard.md`

Related references:

- [claude-hook.md](./claude-hook.md).
- [pi-prompt-advisor.md](./pi-prompt-advisor.md).
