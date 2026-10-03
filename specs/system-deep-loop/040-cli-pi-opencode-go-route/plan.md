---
title: "Implementation Plan: Let the deep-loop cli-pi executor reach DeepSeek V4.1 Flash through opencode-go"
description: "Add a provider-prefixed opencode-go DeepSeek literal to the cli-pi roster and let the command builder pass a literal that already names its provider as the full selector."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Let the deep-loop cli-pi executor reach DeepSeek V4.1 Flash through opencode-go

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS, TypeScript |
| **Framework** | deep-loop runtime |
| **Storage** | None |
| **Testing** | vitest |

### Overview
Add a provider-prefixed opencode-go DeepSeek literal to the cli-pi roster and let the command builder pass a literal that already names its provider as the full selector.
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
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Allowlist plus provider map, read by one command builder

### Key Components
- **`buildPiLineageCommand` in `fanout-run.cjs`**: checks the allowlist, maps the provider and builds the `pi` command
- **`PI_SUPPORTED_MODELS` in `executor-config.ts`**: validates the configured model at config-write time

### Data Flow
The deep-loop config stores `--model`, `parseExecutorConfig` checks it against `PI_SUPPORTED_MODELS`, and the builder turns it into `pi -p --offline --model <selector> --thinking max`.
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

`git checkout` the six changed files in Public. The change is additive, so no run depends on it until one passes the new literal.
<!-- /ANCHOR:rollback -->

---

