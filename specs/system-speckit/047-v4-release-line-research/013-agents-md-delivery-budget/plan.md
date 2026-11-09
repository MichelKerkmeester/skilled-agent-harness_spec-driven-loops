---
title: "Implementation Plan: Phase 13: agents-md-delivery-budget"
description: "Measure the manifest failure and the Devin delivery prefix, decide each finding, and hand the operator the two steps only they may take."
trigger_phrases:
  - "agents md delivery budget plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: agents-md-delivery-budget

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown instructions file and a CommonJS manifest tool |
| **Framework** | `/doctor:agents-md` manifest and the sk-code rule-copy canary |
| **Storage** | None |
| **Testing** | `agents-md-manifest.cjs --check`, `check-rule-copies.js` |

### Overview
No product file changes. Both fixes alter the shipped AGENTS.md body or its release record, which the lead reserved for the operator, so the phase records evidence and a ready proposal and closes Blocked.
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
- [ ] Each finding has a recorded decision and an exact operator step
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`agents-md-manifest.cjs` and `agents-md-manifest.json`**: record which AGENTS.md bodies were released
- **`check-rule-copies.js`**: delivery-prefix canary for the 16,384-byte Devin cap

### Data Flow
Devin reads AGENTS.md and keeps its first 16,384 bytes; the canary checks that every hard-rule anchor ends inside them. `/doctor:agents-md` compares AGENTS.md with the released bodies in the manifest.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| AGENTS.md | instructions every runtime reads | unchanged | canary |
| `agents-md-manifest.json` | release record | unchanged (operator write) | `--check` |
| `.devin/SYNC.md` | documents the 16 KB cap | unchanged | read |

Required inventories:
- Producers of the manifest: only `agents-md-manifest.cjs --write`.
- Consumers of the prefix: Devin; the canary in `check-rule-copies.js`.
- Matrix axes: N/A, no code change.
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
| Manual | manifest check and canary | node from the worktree |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator | External | Red | Phase stays Blocked |
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
