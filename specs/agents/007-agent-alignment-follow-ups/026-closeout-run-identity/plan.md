---
title: "Implementation Plan: Phase 26: closeout-run-identity"
description: "Read the run's session id from the config beside the state log and scope every closeout row by it, keeping the folder name only as a fallback."
trigger_phrases:
  - "closeout run identity plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 26: closeout-run-identity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS script; Vitest |
| **Framework** | The deep-loop runtime scripts and the `/deep:*` workflows |
| **Storage** | JSONL state logs and the typed review ledger |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
`closeOut` resolves the scope once from the config next to `--state-log` and passes it to `buildStem`, which keeps its per-mode shape.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Phase 25 committed

### Definition of Done
- [x] Both modes' rows carry the config's ids
- [x] The gateway accepts the review row
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A config read with a fallback, at the one place the scope is built.

### Key Components
- **`runScope`**: returns the per-mode scope from the config, or the folder-name scope
- **`buildStem`**: unchanged shape, new input

### Data Flow
Config beside the state log, then the scope, then each staged row.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit tests per mode, one append through the gateway, and one case with no config that keeps the old fallback.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---

