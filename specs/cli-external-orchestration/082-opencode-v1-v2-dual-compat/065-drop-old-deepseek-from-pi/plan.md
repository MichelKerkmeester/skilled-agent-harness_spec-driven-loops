---
title: "Implementation Plan: Phase 65: drop-old-deepseek-from-pi"
description: "Delete the undated 2026-09-10 DeepSeek V4.1 Flash from Pi's `llmgateway` roster and from both cli-pi allowlists, so the runtime registers only the dated 2026-10-17 id and a lineage pinned to the old id is rejected at command construction. Hermes and OpenCode keep the old id on purpose, and updated tests plus a revert proof hold the removal."
trigger_phrases:
  - "drop old deepseek from pi plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 65: drop-old-deepseek-from-pi

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Node.js CommonJS |
| **Framework** | vitest for the deep-loop runtime suites |
| **Storage** | JSON config files: `.pi/models.json` and `.pi/settings.json` |
| **Testing** | vitest suites for `executor-config`, `fanout-run`, `combo-matrix` and `orchestrate-session-cli`, plus a revert proof |

### Overview
Commit `052d1e2e1e` removed the undated 2026-09-10 `deepseek-v4.1-flash` from `.pi/settings.json` `enabledModels`, but the model object stayed in `.pi/models.json` and the cli-pi rosters still accepted the bare literal. The operator asked for the id to leave `models.json` as well. The fix deletes the provider-block entry, drops the bare id from `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS`, and rewords the comments that described the two DeepSeek literals. A lineage pinned to the old id is now rejected with "cli-pi model 'deepseek-v4.1-flash' is not in the enforced allowlist". Hermes keeps the id through its own provider block and OpenCode keeps it as a native `llmgateway` model, both on purpose. The updated suites pass, restoring the old id fails 6 tests, and the live proof, suite counts, push and CI remain open.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
- [x] Live proof on the updated main checkout recorded
- [x] Commit pushed to main with CI green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-closed roster deletion across one config file and two mirrored allowlists, with the rejection moved from request time to command construction.

### Key Components
- **`.pi/models.json` `llmgateway` provider block**: The runtime's registered model list. Deleting the undated object leaves `deepseek-v4.1-flash-1017`, `glm-5.3-flash` and `gpt-6-luna`, so the picker and `--model` can only resolve ids the block still declares.
- **`PI_SUPPORTED_MODELS` in `executor-config.ts`**: The TypeScript roster the deep-loop config validates against. Dropping the bare id makes `isPiModelAllowed('deepseek-v4.1-flash')` false.
- **`PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS` in `fanout-run.cjs`**: The synchronous duplicate that builds a cli-pi command. The allowlist rejects the literal and the provider map no longer has a route to compose, so the failure is explicit and happens before dispatch.
- **`HERMES_ALLOWED_MODELS`**: Deliberately unchanged. Hermes reaches the gateway through its own provider block, which passes any gateway id through, so it does not depend on Pi's roster.
- **Updated tests**: `executor-config`, `fanout-run`, `combo-matrix` and `orchestrate-session-cli` move their representative commands to `-1017` and add checks that cli-pi rejects the old id and that `.pi/models.json` does not register it.

### Data Flow
A cli-pi lineage names a model. `buildPiLineageCommand` checks `PI_ALLOWED_MODELS` first, so an id outside the set throws "cli-pi model '<id>' is not in the enforced allowlist". An allowed bare literal is then looked up in `PI_MODEL_PROVIDERS` to compose `${provider}/${model}`, and `deepseek-v4.1-flash-1017` maps to `llmgateway`, producing `llmgateway/deepseek-v4.1-flash-1017`. The old literal has neither an allowlist entry nor a provider mapping, so it cannot reach command construction. The same roster is mirrored in `executor-config.ts` for config validation, and both copies are edited together so they cannot drift.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---
