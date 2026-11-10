---
title: "Implementation Plan: Phase 14: playbook-docs-and-closeout"
description: "Write and run the cli-deepseek-harness manual testing playbook, reconcile governance docs, changelogs and generated indexes to eight runtimes, then reconcile completion metadata and close the packet with a recursive strict validation. The orchestrating Claude session does all of it under sk-doc create modes and sk-code for regeneration."
trigger_phrases:
  - "playbook docs and closeout plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: playbook-docs-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON manifests, Node.js generators |
| **Framework** | sk-doc create modes, system-spec-kit validation and trigger index |
| **Storage** | None |
| **Testing** | `validate.sh --strict --recursive`, `/doctor:agents-md` check, sk-doc code-folder tests, trigger-index lookup |

### Overview
This phase closes the program: it adds the playbook, brings every governance doc and index to eight runtimes and proves the whole packet validates. The orchestrating Claude session authors with `sk-doc` `sk-create-manual-testing-playbook`, `sk-create-readme`, `sk-create-changelog` and `sk-create-feature-catalog`, and regenerates manifests and the index with `sk-code`. Proof is `RESULT: PASSED` on the recursive run plus a trigger-index hit for "deepseek harness".
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phases 002 to 013 each print `RESULT: PASSED` under `validate.sh --strict`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `validate.sh specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation --strict --recursive` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs follow shipped evidence.

### Key Components
- **Manual testing playbook**: scenarios that exercise the mode, each with a recorded result or a blocked reason.
- **Governance docs**: `AGENTS.md`, `README.md`, `SECURITY.md` and the runtime lists that name every CLI runtime.
- **Generated indexes**: `agents-md-manifest.json`, the sk-doc code-folder manifests and `trigger-index.json`, each rebuilt by its owner.

### Data Flow
Phase 013 evidence sets the supported routes. The playbook and docs copy that status, the generators rebuild the indexes from the edited sources and the recursive validation reads every child's completion metadata.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase reconciles docs and fixes no reported finding.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup confirms every child validates. Implementation writes the playbook, docs and changelogs then regenerates. Verification runs the checks and the recursive validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | sk-doc code-folder manifests | sk-doc code-folder tests |
| Integration | Whole packet validation and generated indexes | `validate.sh --strict --recursive`, `/doctor:agents-md` check, `lookup-trigger-index.mjs` |
| Manual | Playbook scenarios | The playbook's own steps, with key-gated rows citing phase 013 evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 002 to 012 | Internal | Red | Docs describe behavior that does not exist |
| `013-dsh-live-contract-pin` | Internal | Red | "Supported" wording cannot be set, routes stay "configured, not verified" |
| Trigger index builder | Internal | Green | The packet stays unfindable by retrieval |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the recursive validation fails after a doc change, or a doc claims a route phase 013 did not verify.
- **Procedure**: `git revert <sha>` on the closeout commit, then rerun the manifest and trigger-index generators so generated files match the reverted sources.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (child validation sweep) | Phases 002 to 013 complete | Implementation |
| Implementation (playbook, docs, changelogs, regeneration) | Setup | Verification |
| Verification (checks and recursive validation) | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---
