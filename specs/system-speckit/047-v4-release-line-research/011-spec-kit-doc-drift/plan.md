---
title: "Implementation Plan: Phase 11: spec-kit-doc-drift"
description: "Rewrite each false sentence to what the code does, check every new sentence against a code line, and keep each touched doc's sk-doc validation result."
trigger_phrases:
  - "spec kit doc drift plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: spec-kit-doc-drift

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown release notes, references and command docs |
| **Framework** | sk-doc document validation, `/doctor:env` reference parser |
| **Storage** | None |
| **Testing** | sk-doc `validate_document.py`, `env-reference-drift.vitest.ts`, rg probes |

### Overview
Five documentation fixes, one per finding. No code changes: each finding is a promise the code never made, and the synthesis names the text as the fix.
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
- [x] Every touched doc holds its `validate_document.py` result and the env reference test passes
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **Release notes v4.0.0.0 and v4.0.0.5**: what each release claims
- **`save-workflow.md`**: how saves route content
- **`ENV-REFERENCE.md`**: env switches, also parsed by `/doctor:env`
- **speckit plan, implement, complete commands**: what strict validation fails on

### Data Flow
An operator or agent reads the doc and acts on it; `/doctor:env` parses ENV-REFERENCE rows into switch metadata.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `v4.0.0.0.md` | release note | update | rg probe |
| `v4.0.0.5.md` | release note | update | rg probe |
| `save-workflow.md` | save reference | update | rg probe and validate_document |
| `ENV-REFERENCE.md` | env reference and parser input | update | env drift test |
| speckit command docs | command contracts | update | rg probe |
| Spec-gate core parser | reads the kill switch | unchanged | code read |

Required inventories:
- Same-class claims: `rg -n 'SYSTEM_SCOPE|LLM_REFORMULATION|pending-route|Tier [123]'` over the touched docs prints nothing.
- Consumers: `/doctor:env` (`doctor-env.yaml` lines 40-50) parses the ENV rows; both duplicate rows carry the same type and default.
- Matrix axes: N/A, prose only.
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
| Doc lint | each touched doc | `validate_document.py` |
| Unit | ENV-REFERENCE shape | `env-reference-drift.vitest.ts` |
| Manual | claims against code lines | Luna read-only review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 010 | Internal | Green | the strict SOURCE_TAGS sentence would be premature |
| cli-pi DeepSeek | External | Green | Luna fallback |
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
