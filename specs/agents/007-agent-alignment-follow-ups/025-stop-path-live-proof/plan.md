---
title: "Implementation Plan: Phase 25: stop-path-live-proof"
description: "Replay each review stop path through the real scripts in one integration test, then run one live review on DeepSeek through Pi with a one-minute time limit and record what it wrote."
trigger_phrases:
  - "stop path live proof plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 25: stop-path-live-proof

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Vitest integration test; one live workflow run |
| **Framework** | The `/deep:review` workflow and the deep-loop runtime scripts |
| **Storage** | Temp run directories; this folder's `review/` for the live run |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
The test drives `convergence.cjs --stop-decision`, `terminal-gates.cjs`, `append-mode-event.cjs` and `reduce-state.cjs` as child processes. The live run lets a real agent follow the YAML from init to synthesis.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Phase 24 committed

### Definition of Done
- [ ] The replay test passes and the suite matches the baseline plus it
- [ ] The live run's outcome is recorded with evidence
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
End-to-end replay through existing scripts.

### Key Components
- **The replay test**: one case per stop reason.
- **The live run**: one review on one small file.

### Data Flow
Stop decision, then the gates script, then the typed record through the gateway into the state log, then the reducer's dashboard verdict.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The replay test plus a deliberate broken assertion to show it can fail. The live run is read from its own state log and report.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Pi with the `llmgateway/deepseek-v4.1-flash-1017` route for the live run. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit; the live run's `review/` folder goes with it.
<!-- /ANCHOR:rollback -->

---

