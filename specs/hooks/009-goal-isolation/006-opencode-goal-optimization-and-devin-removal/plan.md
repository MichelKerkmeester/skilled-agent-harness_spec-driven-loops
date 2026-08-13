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
    packet_pointer: "hooks/009-goal-isolation/006-opencode-goal-optimization-and-devin-removal"
    last_updated_at: "2026-08-10T21:28:22Z"
    last_updated_by: "codex"
    recent_action: "Post-review implementation and content proof completed; delivery freshness remains pending"
    next_safe_action: "Rerun default strict validation after authorized delivery makes packet paths clean"
    blockers:
      - "The no-commit task boundary leaves the completion-freshness gate red on dirty packet paths."
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

The initial implementation changed OpenCode's storage-address layer. The post-review repair also hardens the sibling core's archive and mutation boundaries, canonicalizes its complete scope tuple, closes two OpenCode legacy edge cases, and replaces Claude's whole-directory command link with a filtered generated tree.
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

- [x] All fifteen phase requirements and nine success criteria are verified.
- [x] Fixed-key, compatibility, and lifecycle tests pass with the full focused suite at 128/128.
- [x] Active Devin goal-remnant scan returns zero matches.
- [x] Unrelated Devin hook surfaces have no Phase 6 diff.
- [ ] Code-quality and document-quality gates pass; strict child and recursive parent content rules pass under dirty-tree isolation, while the default delivery-state gate awaits clean packet paths.
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
- **Archive boundary**: maps hostile identifiers to safe segments and rejects archive roots that resolve outside the state root.
- **Mutation lock**: serializes same-scope lifecycle read-modify-write operations and singleton migration across processes.
- **Composite scope resolver**: hashes canonical repository root, runtime, and native session id as one JSON tuple.
- **Claude command filter**: generates per-command symlinks while excluding runtime-exclusive canonical commands.

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
| Runtime-neutral core and CLI/Pi tests | Shared scoped persistence | Add containment, cross-process locking, complete scope hashing, and compatibility coverage | Complete cross-runtime run after repair |
| OpenCode legacy deletion/adoption | Compatibility path | Ignore impossible legacy filenames after canonical deletion and require embedded identity | Long-id clear/delete plus missing-id regressions |
| `.claude/commands` and mirror generator | Claude repository command discovery | Replace whole-tree link with filtered per-command links | Negative mirror check, regeneration, and final `--check` |

### Algorithm Invariants

- Every new session key is `sha256(normalizedSessionID)` in lowercase hex.
- Digest state wins when both layouts exist; migration never overwrites it.
- Legacy source deletion occurs only after successful validation and adoption.
- Embedded session identity remains the authority against file misbinding.
- New writes and archives use only digest names.
- Archive filenames are safe path segments and their resolved roots remain inside goal state.
- Same-scope mutations and singleton migration acquire deterministic cross-process locks.
- Sibling-core keys hash `JSON.stringify([repositoryRoot, runtime, sessionId])` without exposing any part.
- Claude mirrors every shared command by symlink and never mirrors `goal-opencode.md`.
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
- [ ] Run default strict Phase 6 and recursive packet validation after authorized delivery leaves packet paths clean.

### Phase 4: Post-Review Repair

- [x] Reproduce all six review findings in isolated temporary state.
- [x] Add adversarial archive, concurrency, canonical workspace, long deletion, legacy identity, and Claude discovery regressions.
- [x] Implement containment, locks, composite scopes, OpenCode edge handling, and filtered command mirrors.
- [ ] Reconcile the final delivery-state completion claim after the default strict gate can observe clean packet paths.
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
| Adversarial archive | Hostile ids for replace/clear/complete/migration plus symlink escape | `node:test` shared-core suite |
| Multiprocess | Concurrent turn updates, terminal operations, and singleton migration | Spawned Node workers under isolated state roots |
| Composite identity | Nested CWD, runtime/workspace collision, shared explicit state root | `node:test` shared-core suite |
| Discovery boundary | Old whole-tree negative control, filtered regeneration, excluded command | Runtime mirror script plus path assertions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node `crypto.createHash` | Built-in runtime | Green | Cannot produce collision-resistant fixed keys |
| Existing mutation queue | Internal | Green | Migration cannot serialize with same-session writes |
| Filesystem lock directories | Built-in filesystem | Green | Sibling-core cross-process updates could be lost without them |
| Existing atomic rename/fsync path | Internal | Green | Migration durability would need a separate design |
| Spec Kit validation scripts | Internal tooling | Content rules green; delivery freshness blocked by uncommitted packet paths | Completion claim remains blocked until default strict validation passes |
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
