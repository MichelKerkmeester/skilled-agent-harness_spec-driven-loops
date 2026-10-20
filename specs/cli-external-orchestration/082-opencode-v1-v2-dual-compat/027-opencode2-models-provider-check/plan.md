---
title: "Implementation Plan: Phase 27: opencode2-models-provider-check"
description: "Probe what OpenCode 2.0.32's models command accepts, move every current doc to the standalone listing filtered by provider prefix, regenerate the Hermes copy, and hold the result with a node test in the battery job."
trigger_phrases:
  - "opencode2 models provider check plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 27: opencode2-models-provider-check

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, a shell snippet, a Node.js test |
| **Framework** | `node:test` |
| **Storage** | None |
| **Testing** | `node --test`, live probes of `opencode` 1.19.3 and `opencode2` 2.0.32 |

### Overview
The live probes set the target: v2 `models` accepts only `--standalone` and `--server`, and a provider check filters `opencode2 models --standalone` for the `<provider>/` prefix. One mechanical pass adds `--standalone` to the inline spans, one targeted pass rewrites the provider-argument sentences and the pre-flight line, and a test scans every current doc so neither old form returns.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing, and the new test fails on main's docs
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc correction held by a scan test.

### Key Components
- **`opencode2-models-form.test.cjs`**: classifies a quoted `opencode2 models` command, scans the CLI skill docs and the Hermes copy, and checks the pre-flight block filters a standalone listing.
- **`sync-skills-hermes.cjs`**: regenerates `.hermes/skills/cli-opencode/SKILL.md` from the edited source.

### Data Flow
Source docs are edited, the Hermes copy is regenerated from them, and the test reads both.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new test runs against main's docs (it must fail) and against this branch (it must pass). Two classifier mutants each drop one rule and must fail the classifier test. The pre-flight line runs live against a listed and an unlisted provider.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit; the docs, the Hermes copy, the test and the workflow line go back together.
<!-- /ANCHOR:rollback -->

---
