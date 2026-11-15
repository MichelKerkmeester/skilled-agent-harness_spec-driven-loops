---
title: "Implementation Plan: Phase 7: dispatch-recognition-and-hard-rules"
description: "Map Vibe's print-mode shapes to cli-mistral-vibe in the dispatch hook library, then implement one check per rule in its hard-rules.json, each proven by a refusing and an accepting test."
trigger_phrases:
  - "dispatch recognition and hard rules plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: dispatch-recognition-and-hard-rules

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ES modules, Node built-ins only |
| **Framework** | Shared dispatch hard-rule engine in `.skilled/hooks/dispatch/lib/` |
| **Storage** | None |
| **Testing** | `node --test` for the rule checks, the pinned `.skilled/node_modules/.bin/vitest` under `.skilled/hooks/vitest.config.ts` for dispatch recognition |

### Overview
Two library files change. `dispatch-audit.mjs` learns that a Vibe session start belongs to cli-mistral-vibe, while `vibe --version` and `vibe config schema` stay unrecognized, and `dispatch-rule-checks.mjs` gains one check per rule that packet declares. A refusing and an accepting test per rule prove each check fires.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json` exists and parses as JSON
- [ ] The dispatch hook baseline prints `pass 53` and `fail 0`

### Definition of Done
- [ ] Every rule in cli-mistral-vibe's `hard-rules.json` has a refusing and an accepting test case
- [ ] `node --test lib/dispatch-rule-checks.test.mjs tests/dsh-dispatch.test.mjs` prints `fail 0` with a pass count above 53
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-text preflight rules.

### Key Components
- **`dispatch-audit.mjs` shape registry**: decides which packet governs a command. Without a Vibe row, no Vibe rule is ever read.
- **`dispatch-rule-checks.mjs` check registry**: answers each rule from the command text and the repository root. Without the new checks, `evaluate` skips the Vibe rules as unknown.

### Data Flow
The parent runtime's PreToolUse hook passes the command to `evaluateDispatch`. `resolveDispatchPackets` names cli-mistral-vibe, `readHardRules` loads its `hard-rules.json`, and each rule's check reads the command. A failing `error` rule blocks the dispatch before Vibe starts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads cli-mistral-vibe's `hard-rules.json`, lists its check names and records the 53-test baseline. Implementation adds the Vibe shape rows to `dispatch-audit.mjs` and one check per rule to `dispatch-rule-checks.mjs`. Verification runs a refusing and an accepting command per rule, the session-free commands and both dispatch hook suites. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test lib/dispatch-rule-checks.test.mjs tests/dsh-dispatch.test.mjs`, run from `.skilled/hooks/dispatch`, must print `fail 0` with more passes than the baseline 53. The recognition cases run under `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`, which must print `1 passed (1)` with more tests than the baseline 128. A rule counts as working only when its violating command is refused.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node and the pinned vitest under `.skilled/node_modules`. No new package. The `vibe` binary is not needed, because every check reads command text only.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a new check refuses a dispatch of another executor. Revert the commit that touched the two library files and their tests. cli-mistral-vibe dispatches then resolve to no packet again, as they do today.
<!-- /ANCHOR:rollback -->

---
