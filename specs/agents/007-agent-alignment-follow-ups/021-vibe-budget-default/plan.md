---
title: "Implementation Plan: Phase 21: vibe-budget-default"
description: "`buildExecutorDispatchEnv` swaps in the keychain sign-in key for a `cli-mistral-vibe` lineage, read once per process through `/usr/bin/security` with an injectable reader for tests. Both quota classifiers gain a `budget exhausted` pattern. DeepSeek V4.1 Flash max builds each code task through cli-pi and the conductor reads every diff."
trigger_phrases:
  - "vibe budget default plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 21: vibe-budget-default

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS on Node, Markdown docs |
| **Framework** | The deep-loop runtime executor env filter and failure classifiers |
| **Storage** | The macOS keychain item `ai.mistral.vibe`, read only |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
`buildExecutorDispatchEnv` swaps in the keychain sign-in key for a `cli-mistral-vibe` lineage, read once per process through `/usr/bin/security` with an injectable reader for tests. Both quota classifiers gain a `budget exhausted` pattern. DeepSeek V4.1 Flash max builds each code task through cli-pi and the conductor reads every diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] `security find-generic-password -s ai.mistral.vibe -a MISTRAL_API_KEY` exits 0 on this machine

### Definition of Done
- [x] All acceptance criteria met
- [x] `npm test` in the runtime fails no test that passed at baseline
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A per-kind override inside the existing env filter.

### Key Components
- **`buildExecutorDispatchEnv`**: builds each lineage's env; gains the sign-in key override.
- **`detectQuotaExhaustion` and `classifyExecutorUnavailable`**: class a lineage failure; gain the budget pattern.

### Data Flow
The runner calls `buildExecutorDispatchEnv` for each lineage, which filters the parent env, then reads the keychain for a Vibe lineage. A failed lineage's stderr goes through the classifiers, which now return quota for a budget refusal.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit tests stub the keychain reader, so no test touches the real keychain. The full suite runs before and after for the delta.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`/usr/bin/security` on macOS. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. The machine changes have backups with the suffix `.bak-20261115-vibe-budget` next to `~/.zshenv`, `~/.pi/agent/auth.json` and OpenCode's `opencode.db`.
<!-- /ANCHOR:rollback -->

---

