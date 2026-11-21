---
title: "Implementation Plan: Phase 5: v1-reference-purge"
description: "Remove the OpenCode 1 branch from every version parser and consumer, delete the remove-v1 helper and the wrapper refusal, rewrite the refusal tests onto another-major samples, and strip OpenCode 1 text from docs, CI and the sk-git fixture, then regenerate the trigger index."
trigger_phrases:
  - "v1 reference purge plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: v1-reference-purge

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (ESM and CJS), bash, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, vitest |

### Overview
The version family contract narrows from `v2 | unsupported | unknown` to `v2 | unknown`. Each parser drops its major-1 branch, each consumer drops its `unsupported` handling, and the code that existed only to name or remove an OpenCode 1 install is deleted. Docs follow the code.
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
- [x] `gate.sh after` prints exit 0 for every leg, and the totals differ from the baseline only by the named removed tests
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: four copies of one version grammar, kept in step by a shared corpus.

### Key Components
- **Resolvers**: `opencode-version.mjs` (fails open) and `opencode-version.cjs` (fails closed) parse `--version` output into a family.
- **Consumers**: the rule engine's unresolved list, the deep-loop lineage builder, the doctor battery and the setup helper's `check` mode.

### Data Flow
A binary's `--version` output goes through a parser, and the family decides whether the deep loop dispatches (only `v2`) and how the guard weighs rules (`unknown` holds every rule).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Both resolvers, battery parser, `classify_version` | Producers of the family | Drop the major-1 branch | `rg -n "'unsupported'"` over them prints nothing |
| `dispatch-rule-checks.mjs` `UNRESOLVED_FAMILIES` | Consumer | Holds only `unknown` | dispatch-rule-checks tests pass |
| `skilled-loop` refusal, battery detail, `remove-v1` mode | Consumers that named OpenCode 1 | Delete | wrapper, battery and classify tests pass |
| Shared corpus and every parity test | Contract | v1 rows replaced by the same shapes on v2 or another major | corpus has 13 rows; parity tests pass |

Required inventories:
- Same-class producers: `rg -n "major === 1|1\) printf" .skilled` found the four parsers.
- Consumers of changed symbols: `rg -n "'unsupported'|\"unsupported\"" .skilled .opencode .github` found the rule engine, the wrapper, the battery and the tests.
- Matrix axes: parser copy (4) by output shape (bare, prefixed, prerelease, joined, noisy, empty).
- Algorithm invariant: the first version token decides; major 2 is `v2`, anything else `unknown`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Parsers, rule engine, battery, setup helper usage, wrapper launch arguments | `node --test`, vitest |
| Integration | Whole deep-loop runtime suite, doctor suite, sk-skill-convert fixtures | vitest, `node --test` |
| Manual | Live battery on OpenCode 2.3.2 | `opencode-version-battery.cjs --family=v2 --json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode 2.3.2 install | External | Green | The live battery leg could not run |
| Concurrent session-handover work | Internal | Yellow | Rebase conflict on shared files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer breaks on the narrowed family, or a leftover OpenCode 1 install needs the removal helper back.
- **Procedure**: `git revert` the phase's commits on main; the helper and the refusal return as they were.
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
| Implementation | Baseline gate captured | Verification |
| Verification | Implementation | Push |
<!-- /ANCHOR:phase-deps -->

---
