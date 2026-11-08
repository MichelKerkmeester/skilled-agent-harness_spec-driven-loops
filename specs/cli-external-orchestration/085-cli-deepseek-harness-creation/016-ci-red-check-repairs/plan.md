---
title: "Implementation Plan: Phase 16: ci-red-check-repairs"
description: "Reproduce each of the four causes locally, apply the smallest repair for each, and confirm it with the command its CI workflow runs."
trigger_phrases:
  - "ci red check repairs plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: ci-red-check-repairs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Git config, Node `node:test`, Markdown, JSON |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The commands each failing workflow runs |

### Overview
Each cause is reproduced locally first, repaired, and rechecked with its workflow's own command.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each failing workflow's log names its cause.

### Definition of Done
- [x] Every requirement in `spec.md` section 4 is met with evidence.
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Repair at the input each check reads; no check is loosened.

### Key Components
- **Private mirror rule**: `.gitignore` already ignores every runtime's `local-*` mirror except DSH's.
- **Fake binary**: the dispatch test file's own `writeExecutable` helper.

### Data Flow
Workflow log, then local reproduction, then repair, then the same command green.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

One cause at a time, in the order of `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check
node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict
SKIP_TESTS=test_rename_tooling_fixture_harness.py bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None new.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a workflow fails in a new way after the push. `git revert <sha>` restores every file, including the tracked stub.
<!-- /ANCHOR:rollback -->
