---
title: "Implementation Plan: Phase 10: validate-and-retrieval-exit-honesty"
description: "Change each checker at the point where it decides its exit or marker, prove each with a fixture or probe that failed before, and rerun the spec-kit suites against the baseline."
trigger_phrases:
  - "validate and retrieval exit honesty plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: validate-and-retrieval-exit-honesty

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and ES modules on Node, bash rule scripts, CommonJS for check-goal |
| **Framework** | spec-kit validation orchestrator, rule registry and retrieval corpus walker |
| **Storage** | None |
| **Testing** | vitest cli and root projects, `node --test` for check-goal, validation shell suites |

### Overview
Seven checkers change where they choose an exit code or marker and nothing else in them moves. Each change carries one test that fails on the old code. The phase closes when the Measured Behavior probes behave and the baseline suites hold.
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
- [x] The cli and root vitest projects, the validation shell suites and the check-goal tests keep every baseline pass
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`orchestrator.ts`, `spec-doc-structure.ts`**: turn rule results into markers, counts and the RESULT line
- **Rule scripts and the lookup, goal and alignment CLIs**: each owns its own exit
- **`retrieval/lib/corpus.mjs`**: decides which spec docs the trigger index reads

### Data Flow
A rule sets its status; the orchestrator maps it to a marker and a summary count; `passed` is `errors === 0`. A cannot-run rule must surface as an error under strict, and a skipped rule as a non-pass status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lookup-trigger-index.mjs` | Gate 1 and `/speckit:search` lookup | update exit only | typo probe |
| Lookup callers (AGENTS.md, speckit resume and search, doctor) | read exit 1 as no-hit | unchanged | `rg -n lookup-trigger-index` |
| `corpus.mjs` walker and `repo-era.mjs` | corpus walk and its excluded report | update walker | corpus and repo-era tests |
| `check-goal.cjs` | goal checker | update | fixture corpus test |
| `spec-doc-structure.ts` | contamination marker | update | validate on a real packet |
| `check-source-tags.sh` | SOURCE_TAGS rule | update | fixture outside git |
| `spec/check-placeholders.sh` | post-edit scan | update | Draft and handover fixtures |
| `check-source-dist-alignment.ts` | dist check | update | stale and unprovisioned cases |

Required inventories:
- Same-class producers: `rg -n 'process.exit|exit 0|return 0'` over each changed file.
- Consumers: `rg -n 'check-placeholders.sh|check-goal.cjs|check-source-dist-alignment|lookup-trigger-index' .skilled --glob '!**/dist/**'`.
- Matrix axes: strict on/off by rule outcome (pass, warn, cannot run, skipped).
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
| Unit | each changed exit | vitest, `node --test` |
| Integration | `validate.sh` on fixture packets | validation shell suites |
| Manual | the Measured Behavior probes | bash from the worktree |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 009 commit | Internal | Green | `validate.sh` conflicts |
| cli-codex Luna | External | Green | DeepSeek fallback |
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
