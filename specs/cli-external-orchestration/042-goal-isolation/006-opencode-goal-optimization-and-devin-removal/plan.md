---
title: "Implementation Plan: OpenCode Goal Optimization and Devin Goal Remnant Removal"
description: "Test-drive fixed SHA-256 session keys and compare-safe legacy migration in mk-goal, then remove active Devin goal references and rerun the full OpenCode and packet gates."
trigger_phrases:
  - "opencode goal optimization plan"
  - "legacy goal state migration"
  - "devin goal remnant removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/006-opencode-goal-optimization-and-devin-removal"
    last_updated_at: "2026-08-10T19:20:00Z"
    last_updated_by: "codex"
    recent_action: "Implementation and final-state proof completed"
    next_safe_action: "Monitor digest-keyed state and compatibility migration during normal use"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: OpenCode Goal Optimization and Devin Goal Remnant Removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ESM plugin plus CommonJS Node test runner |
| **Framework** | OpenCode plugin API and `node:test` |
| **Storage** | Private per-session JSON files under `.opencode/skills/.goal-state/` |
| **Testing** | Focused `node --test` suite, residue scans, syntax and spec validation |

### Overview

The implementation changes only the storage-address layer. SHA-256 replaces reversible hex filenames, and a narrow migration helper adopts valid legacy state only when the digest target is absent. After the focused code path is green, active goal docs and stale mirror prose lose retired Devin-specific references.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Baseline focused suite passes 119/119.
- [x] The long-id negative control reproduces `READ_GOAL_FAILED` with `ENAMETOOLONG` at a 285-character filename.
- [x] Active and historical Devin matches are separated so runtime cleanup does not erase audit evidence.
- [x] Scope and rollback are explicit in `spec.md`.

### Definition of Done

- [x] All nine phase requirements and six success criteria are verified.
- [x] Fixed-key and migration tests pass with the full focused suite at 125/125.
- [x] Active Devin goal-remnant scan returns zero matches.
- [x] Unrelated Devin hook surfaces have no Phase 6 diff.
- [x] Code-quality, document-quality, strict child, and recursive parent gates pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Compatibility migration at the persistence boundary.

### Key Components

- **Digest key resolver**: normalizes and hashes the native session id into a fixed 64-character lowercase hexadecimal key.
- **Legacy path resolver**: computes the current reversible hex path only for migration lookup.
- **Active-state adoption**: reads and validates the legacy record, then atomically moves it when no digest target exists.
- **Archive adoption**: makes legacy archived state discoverable without duplicate history records.
- **Residue boundary**: removes current goal-specific Devin references while preserving unrelated runtime and historical material.

### Data Flow

`sessionID -> requireSessionID -> SHA-256 digest -> digest state path`. On a digest miss, the reader checks the legacy hex path, validates the embedded session id, adopts it under the existing mutation queue, invalidates cache state, and continues from the digest path. New writes never use the legacy path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sessionKeyForSession` | Produces every active and archive basename | Replace reversible hex with SHA-256 | Unit assertions for length, charset, privacy, uniqueness |
| `goalPathForSession` / `readGoal` | Resolves and loads active state | Add digest-first legacy adoption | Long-id and migration tests |
| `archiveGoalStateFile` / history | Moves and enumerates archived state | Recognize legacy archive names safely | Lifecycle archive tests |
| `goalBriefCache` | Caches injection reads by path | Invalidate old and new paths during migration | Transform/migration regression |
| Token usage extraction and ledger | Charges native OpenCode usage | Unchanged consumer | Existing native token tests stay green |
| Active goal docs and mirror comments | Describe runtime support and command exclusions | Remove goal-specific Devin remnants | Scoped zero-match scan |
| `.devin/hooks.v1.json` and non-goal Devin code | Unrelated runtime support | Unchanged | Phase 6 diff exclusion check |

### Algorithm Invariants

- Every new session key is `sha256(normalizedSessionID)` in lowercase hex.
- Digest state wins when both layouts exist; migration never overwrites it.
- Legacy source deletion occurs only after successful validation and adoption.
- Embedded session identity remains the authority against file misbinding.
- New writes and archives use only digest names.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read OpenCode plugin, focused tests, goal docs, phase history, and runtime mirror consumers.
- [x] Capture 119/119 baseline and the long-id negative control.
- [x] Scaffold and author Level-2 Phase 6 from manifest-backed templates.

### Phase 2: Implementation

- [x] Add path, long-id, migration, target-conflict, and archive tests.
- [x] Implement digest keys and compare-safe active/archive migration.
- [x] Remove active goal-specific Devin references and stale mirror prose.
- [x] Update operator docs and manual playbooks without changing unrelated runtime claims.

### Phase 3: Verification

- [x] Run focused tests, syntax, comment hygiene, and OpenCode drift guards.
- [x] Run zero-residue and unchanged-Devin-boundary scans.
- [x] Reconcile checklist, summaries, parent phase map, handover, and metadata.
- [x] Run strict Phase 6 and recursive packet validation from final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | Long session filename fails before implementation | Direct helper invocation |
| Unit | Digest format, distinct ids, legacy active migration, conflicts, malformed state | `node:test` state suite |
| Lifecycle | Legacy archive migration, deletion, history, orphan sweep | `node:test` lifecycle suite |
| Regression | Native usage, budgets, verifier, continuation, tools, injection | Seven-file focused OpenCode suite |
| Static | Syntax, comment hygiene, active Devin residue | `node --check`, project scripts, `rg` |
| Documentation | Structure/DQI plus packet contracts | sk-doc scripts and Spec Kit validators |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node `crypto.createHash` | Built-in runtime | Green | Cannot produce collision-resistant fixed keys |
| Existing mutation queue | Internal | Green | Migration cannot serialize with same-session writes |
| Existing atomic rename/fsync path | Internal | Green | Migration durability would need a separate design |
| Spec Kit validation scripts | Internal tooling | Green after renderer fallback | Completion claim remains blocked if strict validation fails |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: any state loss, session misbinding, duplicate archive history, native token-accounting regression, or focused-suite failure.
- **Procedure**: revert the scoped plugin, tests, docs, and packet changes through Git; the migration moves rather than transforms JSON, so a digest-keyed file can be renamed back to its legacy key if rollback occurs before new divergent writes.
- **Data protection**: do not delete an unreadable or conflicting source. Preserve both layouts and report the blocker.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES

```text
Baseline + negative control -> failing tests -> storage implementation
                                      |-> active Devin residue removal
storage + residue work -> regression gates -> packet reconciliation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup and proof | Existing Phase 5 completion | Implementation |
| Storage implementation | Failing test matrix | Verification |
| Residue removal | Exact active-surface inventory | Verification |
| Verification | Both implementation lanes | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and proof | Medium | 1-2 hours |
| Storage and migration | High | 3-5 hours |
| Residue removal and docs | Medium | 1-2 hours |
| Verification and reconciliation | Medium | 1-2 hours |
| **Total** |  | **6-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. ENHANCED ROLLBACK

### Pre-Implementation Checklist

- [x] Git status captured; unrelated dirty paths identified.
- [x] Existing plugin suite and failure symptom recorded.
- [x] Exact mutable surfaces listed in the phase spec.

### Rollback Procedure

1. Stop OpenCode processes that could mutate the same state root.
2. Restore only the Phase 6 tracked files from the pre-change revision or reviewed patch.
3. If migrated live data must be rolled back, derive the legacy hex filename from the embedded session id and move only that exact digest file after confirming the legacy target is absent.
4. Rerun the 119-test baseline and inspect one isolated state canary.

### Data Reversal

- **Has data migrations?** Yes, filename-only and lazy.
- **Reversal procedure**: rename the validated digest-keyed JSON back to its legacy hex basename. File content is unchanged.
<!-- /ANCHOR:enhanced-rollback -->
