---
title: "Implementation Plan: Phase 3: regeneration-and-alignment-sweep"
description: "Sync the authored routing closure and re-mint the manifests, regenerate the deep contracts and the trigger index, then sweep for residue."
trigger_phrases:
  - "hermes removal alignment sweep"
  - "regenerate after hermes removal"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: regeneration-and-alignment-sweep

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM |
| **Framework** | None |
| **Storage** | None |
| **Testing** | compiled-route tests, contract drift check, trigger index check |

### Overview
Sync the authored routing closure and re-mint the manifests, regenerate the deep contracts and the trigger index, then sweep for residue.
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
- [x] `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Removal. Every surface that names the `cli-hermes` executor or the `hermes` runtime drops that entry, and every other executor keeps its behavior.

### Key Components
- **Compiled routing**: The authored closure under `specs/` builds the served mirror under `.skilled/bin/lib`
- **Command contracts**: Compiled from command sources
- **Trigger index**: Built from frontmatter trigger phrases

### Data Flow
Source edits change policy hashes; manifests pinned to the old hash go stale and routing falls back to legacy. Re-minting pins the new hash and restores compiled serving.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Compiled routing closure | Serves hub routing | update | 101/101 compiled-route tests |
| Deep command contracts | Rendered command bodies | regenerate | contract drift OK commands=3 |
| Trigger index | Gate 1 lookup | regenerate | generator --check |

- Same-class producers: `rg -n -i hermes <area> --glob '!**/node_modules/**' --glob '!**/changelog/**'`.
- Consumers of changed symbols: the test suites named in the Testing Strategy, run before and after.
- Matrix axes: one axis, the executor or runtime roster; every roster that listed Hermes loses exactly one row.
- Algorithm invariant: no remaining executor's command, environment or routing changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline, Implementation removes Hermes, Verification reruns the same checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Compiled routing, contract render and drift | node --test, vitest |
| Integration | Doctor suite, deep-loop full suite | node --test, vitest |
| Manual | Residue sweep and alignment battery | rg, run-battery.cjs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Route manifest minting | Internal | Green | Hubs serve legacy routing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remaining executor or runtime breaks because of the removal, or the operator reverses the decision.
- **Procedure**: The work lives on branch `worktrees/321-deprecate-cli-hermes`. Before merge, discard the branch. After merge, `git revert` the merge commit; every deleted file returns from git history.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup baseline | Verification |
| Verification | Implementation | Next phase |
<!-- /ANCHOR:phase-deps -->

---
