---
title: "Implementation Plan: Deep Improvement Rollback Hash Guard"
description: "Plan for a scoped rollback guard that validates accepted-state hashes without blocking legitimate pre-ship rollback."
trigger_phrases:
  - "deep improvement rollback hash guard plan"
  - "rollback accepted state hash plan"
  - "promote candidate benchmark rollback plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/001-deep-improvement-rollback-hash-guard"
    last_updated_at: "2026-06-29T10:50:10Z"
    last_updated_by: "codex"
    recent_action: "Planned and implemented rollback guard"
    next_safe_action: "Phase complete; rollback hash guard shipped and verified"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "rollback-hash-guard-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The guard should compare current target state against accepted-state hashes, not reject every mismatch from the pre-acceptance hash."
---
# Implementation Plan: Deep Improvement Rollback Hash Guard

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS plus Vitest TypeScript tests |
| **Framework** | OpenCode deep-improvement scripts |
| **Storage** | Filesystem acceptance files, target snapshots, and backup files |
| **Testing** | Vitest suite plus direct Node CLI verification |

### Overview
The implementation adds a rollback hash guard directly before `fs.copyFileSync(backup, target)`. The guard validates the backup against `preAcceptTargetHash` and accepts rollback only when the current target matches either the pre-acceptance hash or the accepted candidate hash stored in the acceptance file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Acceptance-state hash guard implemented
- [x] Regression test added to benchmark promotion suite
- [x] Direct CLI verification passed
- [x] Full requested Vitest suite passed
- [x] Docs updated with current verification state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard clause in the rollback CLI before destructive file copy.

### Key Components
- **Acceptance state**: Provides `preAcceptTargetHash`, `candidateHash`, target path, backup path, config path, and manifest path.
- **Rollback hash guard**: Recomputes hashes for the current target and backup, then fails before copy when state is unexpected.
- **Benchmark promotion test**: Exercises accept, rollback, drift, and rollback failure using temporary files.

### Data Flow
`rollback-candidate.cjs` resolves the target and backup, validates the config and canonical manifest target, verifies the backup hash, verifies the current target hash against accepted source states, then copies the backup to the target and appends a rollback event.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Fix Addendum: Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `rollback-candidate.cjs` | Restores the pre-acceptance target backup. | Add hash guard before backup copy. | `node --check`; direct Node rollback scenario. |
| `promote-candidate.cjs` acceptance state | Produces `preAcceptTargetHash` and `candidateHash`. | Unchanged producer. | Read existing acceptance state creation. |
| `promote-candidate-benchmark.vitest.ts` | Covers benchmark accept, ship, and rollback behavior. | Add pre-ship success and unexpected drift failure coverage. | Test file updated; full suite blocked by missing Vitest dependency. |

Required inventories:
- Same-class producers checked with `rg -n "preAcceptTargetHash|candidateHash|rollback" .opencode/skills/deep-loop-workflows/deep-improvement/scripts -S`.
- Consumers checked with `rg -n "rollback-candidate|preAcceptTargetHash|candidateHash" .opencode/skills/deep-loop-workflows/deep-improvement/scripts -S`.
- Matrix axes: current target state is pre-acceptance, accepted candidate, missing, or unexpected drift; backup state is matching or mismatched.
- Algorithm invariant: rollback with an acceptance file may copy only a backup whose hash matches `preAcceptTargetHash`, and only from a current target hash matching a stored accepted-state hash.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read rollback helper, promotion acceptance producer, and benchmark promotion tests
- [x] Run requested baseline command and capture dependency failure
- [x] Confirm no local Vitest binary is available

### Phase 2: Core Implementation
- [x] Add SHA-256 helper to rollback CLI
- [x] Add accepted-state source hash resolution
- [x] Add backup and current-target hash guard before copy
- [x] Add regression coverage for pre-ship rollback and unexpected drift

### Phase 3: Verification
- [x] Run `node --check` on rollback helper
- [x] Run direct Node CLI verification for pre-ship, drift, and post-ship rollback
- [x] Rerun requested Vitest command and record dependency failure
- [x] Update Level-1 phase docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | `rollback-candidate.cjs` parses under Node | `PATH=/opt/homebrew/bin:$PATH node --check` |
| Behavioral CLI | Accept, pre-ship rollback, drift failure, post-ship rollback | Direct `node` script using real CLIs and temporary files |
| Suite | All deep-improvement tests, including regression test | `PATH=/opt/homebrew/bin:$PATH npx vitest run` |
| Spec validation | Level-1 phase docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node at `/opt/homebrew/bin` | External runtime | Green | Cannot run CLI or syntax checks |
| Vitest binary | External dev dependency | Red | Full requested suite cannot execute |
| Existing acceptance state fields | Internal contract | Green | Guard has no hash source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Full suite reveals rollback compatibility regression, or downstream callers require legacy acceptance files without hashes.
- **Procedure**: Revert the changes in `rollback-candidate.cjs` and `promote-candidate-benchmark.vitest.ts`, then restore the prior docs state for this phase.
<!-- /ANCHOR:rollback -->
