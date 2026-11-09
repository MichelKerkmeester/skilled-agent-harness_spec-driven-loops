---
title: "Implementation Plan: Phase 20: operator-approved-closeout"
description: "Apply the operator's 2026-11-09 answers in the lead's order: cut AGENTS.md for Devin headroom and write its manifest, regenerate sk-design's compiled routing without the unused outcome, and rebuild the trigger index last."
trigger_phrases:
  - "operator approved closeout plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 20: operator-approved-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, Node.js generators |
| **Framework** | AGENTS.md delivery canary and manifest, compiled routing, trigger index |
| **Storage** | None |
| **Testing** | `check-rule-copies.js` and its test, AGENTS.md readers' tests, six doctor test files, the CI manifest step, sk-design freshness, guard, sync and package checks, compiled-routing bin tests, trigger index `--check` and retrieval parity tests |

### Overview
Each step uses the tool its earlier decision record named; no generated artifact is edited by hand. The rebuild runs after the last document write so the committed index covers this phase.
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
- [x] Every check below passes and phase 013 closes Complete
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`AGENTS.md`**: shipped instruction file
- **`agents-md-manifest.json`**: released-body record
- **sk-design `hub-router.json` and activation manifests**: compiled routing
- **`runtime/data/trigger-index.json` and sidecars**: Gate 1 index

### Data Flow
AGENTS.md feeds the canary and the manifest; the hub router feeds the policy hash in the activation manifest; every spec and skill doc feeds the trigger index.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| AGENTS.md sections 1 and 2 | every runtime | update | canary, readers' tests, line-by-line review |
| AGENTS.md manifest | doctor and CI | regenerate | `--check`, doctor tests, CI step |
| sk-design routing | advisor and hub | regenerate | freshness, guard, sync, package, probes |
| Trigger index | Gate 1 | regenerate | `--check`, parity tests |

Required inventories:
- AGENTS.md readers: check-rule-copies, gate1-pointer-sync, workflow-invariance, graph-key-file-declarations, resource-map-extractor, three sk-doc rule tests, six doctor test files.
- sk-design `none` references: only `hub-router.json`.
- Index consumers: the lookup CLI and the retrieval parity tests.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup records baselines, implementation sends one worker brief per change group, verification reruns the probes and the baseline suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Canary | delivery prefix and invariants | `check-rule-copies.js` and its test script |
| Unit | AGENTS.md readers | vitest, pytest |
| Integration | manifest and doctor | six doctor test files, CI step |
| Integration | sk-design routing | freshness, guard, sync, package, bin tests, three probes |
| Regression | index | `--check`, retrieval parity |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi DeepSeek | External | Green | none |
| cli-codex Luna | External | Red (quota until 2026-11-13) | DeepSeek took every brief |
| Operator answers | Decision | Green | relayed by the lead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a baseline-passing test fails after the change.
- **Procedure**: `git revert <phase commit>` in the worktree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines, negative controls) | None | Implementation |
| Implementation (worker briefs) | Setup | Verification |
| Verification (probes, suites, cross-family review) | Implementation | Close and commit |
<!-- /ANCHOR:phase-deps -->

---
