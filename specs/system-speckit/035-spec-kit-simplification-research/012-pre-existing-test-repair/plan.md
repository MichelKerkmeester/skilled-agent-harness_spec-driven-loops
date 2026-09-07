---
title: "Implementation Plan: Pre-existing test repair"
description: "Reproduce both failures, trace each to its subject, change the fixture and the isolation, and rerun the suites and the full project."
trigger_phrases:
  - "test repair plan"
  - "freshness fixture plan"
  - "manifest isolation plan"
  - "reproduce then repair"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pre-existing test repair

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript vitest suites |
| **Framework** | vitest |
| **Storage** | None |
| **Testing** | The two suites in isolation, then the full CLI project and the runtime suites |

### Overview
Both failures were reproduced with their assertion output before anything changed. The freshness rule was read to find what it hashes; the manifest checker was run by hand to see which entries it called untracked. Each test was then changed at its own fault: the fixture's stale edit moved to the hashed document, and the tracked case gained a manifest of its own.
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
Test-isolation repair: a test exercises its subject through the subject's own contract and owns every input it asserts on.

### Key Components
- **`continuity-freshness.vitest.ts`**: builds a packet whose implementation summary carries a fresh fingerprint, then edits that summary
- **`recursive-child-manifest.vitest.ts`**: writes a two-entry manifest of tracked files before calling the checker

### Data Flow
Fixture packet → `validate.sh --strict --json` with the rule selected → parsed entry status. Tracked manifest → checker → `git ls-files` → exit status and message.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Freshness fixture packet | Input to the rule | update | the two stale cases warn and fail; the match and table-status cases still pass |
| Manifest tracked case | Input to the checker | update | the checker prints "all entries are tracked" for the two-entry manifest |

Required inventories:
- Same-class producers: `grep` for `checklist.md` across both suites; `grep` for the deep-loop packet path across the runtime tests.
- Consumers of changed symbols: none; both changes are local to their test files.
- Matrix axes: freshness by flag state (off, on, enforce) and by claim source (continuity block, metadata table); manifest by tracked, untracked, git unavailable.
- Algorithm invariant: a completion claim is stale only when the implementation summary's recomputed fingerprint differs from the stored one or a packet path is dirty.
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
| Unit | Both suites in isolation; the drift guard beside the freshness suite | vitest |
| Integration | The full CLI project; `npm run check` | vitest, npm |
| Manual | The checker run by hand against the stale goal manifest to count its untracked entries | bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The freshness rule's attestation binding | Internal | Green | Defines which document a stale edit must touch |
| The manifest checker script | Internal | Green | The subject the manifest suite exercises |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: either suite starts failing for a reason unrelated to its subject
- **Procedure**: `git revert` the single commit
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Low | 15 minutes |
| Verification | Low | 10 minutes plus the full project run |
| **Total** | | **Under an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed
- [x] Feature flag configured - none
- [x] Monitoring alerts set - the suites are the alert

### Rollback Procedure
1. `git revert` the repair commit
2. Rerun both suites
3. No stakeholders to notify

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
