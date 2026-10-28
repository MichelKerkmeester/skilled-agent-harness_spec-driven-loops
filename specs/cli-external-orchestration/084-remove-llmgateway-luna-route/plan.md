---
title: "Implementation Plan: Remove the llmgateway GPT-6 Luna route from Pi, OpenCode and Hermes rosters"
description: "Removes gpt-6-luna from the Pi llmgateway provider block, its picker entry and the Hermes allowlist pair, then rewrites the docs and changelogs that offer or describe that route and regenerates the mirrors."
trigger_phrases:
  - "remove llmgateway luna route plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Remove the llmgateway GPT-6 Luna route from Pi, OpenCode and Hermes rosters

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config, TypeScript, CommonJS, Markdown |
| **Framework** | Pi config, deep-loop fan-out runtime |
| **Storage** | None |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
Delete the Luna object from the Pi `llmgateway` provider block and its `enabledModels` line, and delete `gpt-6-luna` from the Hermes allowlist and its CommonJS mirror. Rewrite the docs that offer the DevPass Luna route, then regenerate the Hermes skill mirror and the trigger index. Prove it with `pi --list-models gpt-6`, the two vitest files and a residue search.
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
- [x] `npx vitest run --no-coverage tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` prints `Test Files  2 passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Roster entry removal.

### Key Components
- **Pi config (`.pi/models.json`, `.pi/settings.json`)**: registers and enables the DevPass models Pi can dispatch.
- **Hermes allowlist (`HERMES_SUPPORTED_MODELS`, `HERMES_ALLOWED_MODELS`)**: the closed roster the fan-out dispatches with `--provider llmgateway`.

### Data Flow
A fan-out lineage names a model, the builder checks it against the allowlist and composes the provider flag. Pi's bare `gpt-6-luna` maps to `openai` in `PI_MODEL_PROVIDERS` and stays; Hermes pins every id to `llmgateway`, so its Luna entry is the code route this plan removes.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline listing, the baseline test count and the inventory. Implementation edits the configs, the allowlist pair, the tests and the docs, then runs the generators. Verification reruns the listing, the tests, the residue search and strict validation. The ordered work lives in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `npx vitest run --no-coverage tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` from `.skilled/skills/system-deep-loop/runtime`. The baseline printed 281 passed in 2 files; the final run must print 2 files passed with no failure.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `pi` binary for the listing, Node with the runtime's installed Vitest, and the two generators `sync-skills-hermes.cjs` and `generate-trigger-index.mjs`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a Hermes or Pi dispatch that must reach Luna through DevPass again. Revert this packet's file edits with `git checkout -- <file>` per file before commit, or revert the commit after it, then rerun both generators.
<!-- /ANCHOR:rollback -->

---
