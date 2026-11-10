---
title: "Implementation Plan: Phase 46: final-two-version-proof"
description: "Run the 17 plugin-utilization scenarios on both OpenCode versions from origin/main, rerun every tracked suite, validate the packet and record CI on the final main commit. Verification only; no code changes."
trigger_phrases:
  - "final two version proof plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 46: final-two-version-proof

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node 26 (local) and Node 22 (CI) |
| **Framework** | OpenCode 1.19.3 and 2.0.32 |
| **Storage** | None |
| **Testing** | node:test, vitest, the live playbook runner |

### Overview
A fresh worktree from origin/main runs each scenario file's own command block in sequence, on v1 and then v2. A second worktree at the same commit reruns the suites in parallel, so suite writes never reach the folders the live runner watches. The evidence is copied into this folder, then validated, committed and pushed to main.
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
Other: a verification pass over the existing playbook and suites.

### Key Components
- **`run-plugin-scenario.sh`**: runs one live session through the capture proxy and records events, system prompts, plugin log lines and state files.
- **Suite commands**: the same commands the CI workflows run, with `--test-reporter=tap` for node:test.

### Data Flow
Scenario block, then live session, then evidence files, then the matrix. Suite run, then TAP or log output, then `suites.txt`.
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

