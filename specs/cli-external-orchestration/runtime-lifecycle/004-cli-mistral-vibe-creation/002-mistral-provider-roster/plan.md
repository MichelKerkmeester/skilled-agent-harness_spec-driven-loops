---
title: "Implementation Plan: Phase 2: mistral-provider-roster"
description: "Add a mistral section to the cli-opencode and cli-pi closed rosters for Mistral's DeepSeek V4.1 Flash 1017 and GLM-5.3-Flash ids. Each row rests on a live probe with a same-run control."
trigger_phrases:
  - "mistral provider roster plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: mistral-provider-roster

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill references |
| **Framework** | cli-external-orchestration hub, OpenCode 2.3.0, Pi 1.5.2 |
| **Storage** | None |
| **Testing** | Live CLI probes, `validate_document.py`, `default-model-id.test.cjs` |

### Overview
Two roster documents gain a `mistral` section and two `SKILL.md` files change their provider count. Each id is probed on each CLI beside a DevPass control first, so a roster row never rests on a listing alone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `opencode models --standalone` and `pi --list-models mistral` list both ids
- [x] The operator named the two models

### Definition of Done
- [x] Every probe in `evidence/probes.md` replied `OK` or has a named cause
- [x] `validate_document.py` prints `Total issues: 0` for the four edited files
- [x] `node cli-opencode/scripts/tests/default-model-id.test.cjs` prints `pass 6`, `fail 0`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Closed roster document.

### Key Components
- **cli-opencode roster**: the only enforcement for OpenCode, since `--model` is free-form there.
- **cli-pi roster**: discipline for direct dispatch; `PI_SUPPORTED_MODELS` enforces only the fan-out.

### Data Flow
A caller reads the roster, then dispatches `mistral/<id>` to OpenCode's or Pi's builtin `mistral` provider, which calls `api.mistral.ai`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup lists the live ids on both CLIs and probes each beside a control. Implementation writes the two roster sections and the two provider counts. Verification runs the sk-doc validator and the default-model test. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each probe sends `Reply with exactly the word OK and nothing else.` and the reply text decides, not the exit code. A DevPass control in the same run tells a provider failure from a credential failure.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator's Mistral credential in each CLI. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a Mistral route stops answering. Revert the commit that carries the four skill files.
<!-- /ANCHOR:rollback -->

---
