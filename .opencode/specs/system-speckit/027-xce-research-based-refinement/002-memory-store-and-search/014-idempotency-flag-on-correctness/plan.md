---
title: "Implementation Plan: Idempotency Flag-On Correctness"
description: "Plan for fixing default-off memory idempotency correctness by making receipt replay response-stable, receipt storage immutable, and memory-save receipt writes limited to successful mutating saves."
trigger_phrases:
  - "idempotency correctness plan"
  - "memory save receipt plan"
  - "SPECKIT_MEMORY_IDEMPOTENCY plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness"
    last_updated_at: "2026-06-11T12:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Planned receipt replay and write-guard fixes"
    next_safe_action: "Phase complete; use implementation-summary.md for final verification evidence."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Receipt writes fail closed for unrecognized save statuses while the feature remains default-off."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Idempotency Flag-On Correctness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Spec Kit MCP server handlers and Vitest |
| **Storage** | `better-sqlite3` receipt table via in-memory test fixtures |
| **Testing** | Targeted vitest file with flag on/off, related memory-save suites, `npx tsc --noEmit`, strict spec validation |

### Overview

The implementation fixes flag-on idempotency correctness without enabling the feature. The receipt lookup path stops altering stored responses. The receipt store path becomes immutable for existing keys. The `memory_save` receipt write condition becomes an explicit allowlist for successful mutating outcomes, preventing duplicate, unchanged, rejected, error, and failed retry paths from leaving blocking receipts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target receipt and memory-save code paths read.
- [x] Existing idempotency/near-duplicate tests run with the flag enabled before changes.
- [x] Related memory-save test entry points identified.
- [x] Live shard and host daemon restrictions understood.

### Definition of Done
- [x] Replay returns the originally stored response.
- [x] Repeated receipt store does not overwrite the original response.
- [x] Conflict detection distinguishes non-semantic normalization differences from genuine payload changes.
- [x] Receipt writes are limited to successful mutating save results.
- [x] Flag-on and flag-off test runs pass.
- [x] Final TypeScript, strict spec validation, and comment-hygiene checks recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Minimal correction in the receipt storage boundary and handler write gate.

### Key Components
- **Receipt key derivation**: Hashes operation, content hash, request fingerprint, and payload with client-token stripping.
- **Receipt lookup**: Returns miss, replay, or conflict from `memory_idempotency_receipts`.
- **Receipt store**: Persists the authoritative response for a receipt key.
- **Memory-save write gate**: Decides whether a completed save result is eligible for receipt storage.
- **Near-duplicate markers**: Existing advisory state kept in the same regression file to prevent accidental interaction regressions.

### Data Flow

When the flag is enabled and canonical routing is not planning a save, `memory_save` derives a server receipt key from the canonical path, content hash, route hints, scope, and normalized payload. A matching stored payload replays the original response. A matching key with a different payload hash returns a conflict. A miss proceeds through normal indexing. Only a non-error `indexed`, `updated`, or `deferred` result is eligible to store the response.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `idempotency-receipts.ts` lookup | Reads stored receipt rows | Return parsed stored response without replay decoration | Deep equality replay test |
| `idempotency-receipts.ts` store | Inserts or updates receipt rows | Insert only; preserve first response on key conflict | Repeated store test |
| `idempotency-receipts.ts` guard | No explicit helper existed | Add mutating-success guard for memory-save results | Guard test with skipped failed candidates |
| `memory-save.ts` handler | Stores receipt after save result | Use helper instead of broad id/status condition | Targeted test and TypeScript |
| `memory-idempotency-and-near-duplicate.vitest.ts` | Existing receipt and near-duplicate coverage | Add flag-on correctness regressions | Flag-on and flag-off file runs |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `idempotency-receipts.ts` flag, normalization, derive, lookup, and store APIs.
- [x] Read `memory-save.ts` idempotency lookup, conflict, and store branches.
- [x] Read existing `memory-idempotency-and-near-duplicate.vitest.ts` coverage.
- [x] Run the existing idempotency suite with `SPECKIT_MEMORY_IDEMPOTENCY=true`.

### Phase 2: Implementation
- [x] Add failing tests for replay response equality and immutable receipt storage.
- [x] Remove replay response mutation from lookup.
- [x] Change receipt storage to preserve the first row on key conflict.
- [x] Add a receipt-write helper that allows only `indexed`, `updated`, and `deferred` non-error results.
- [x] Use the helper from `memory-save.ts` before storing receipts.
- [x] Extend tests for normalization, genuine conflict, write gating, and failed retry safety.

### Phase 3: Verification
- [x] Run targeted idempotency suite with the flag enabled after fixes.
- [x] Run related memory-save suites with the flag enabled.
- [x] Run targeted idempotency suite with the flag unset.
- [x] Run `npx tsc --noEmit` from the MCP server directory.
- [x] Run strict spec validation for this phase.
- [x] Run changed-code comment-hygiene checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline red | New replay and immutable-store tests fail on current code | Flag-on Vitest file run |
| Unit regression | Receipt replay, conflict, normalization, immutable store, write gating | `tests/memory-idempotency-and-near-duplicate.vitest.ts` |
| Near-duplicate regression | Existing marker/advisory behavior in same file | Same vitest file with flag on and unset |
| Related memory-save regression | Handler exports and planner-first contracts | `handler-memory-save.vitest.ts`, `memory-save-planner-first.vitest.ts` |
| Type safety | MCP server TypeScript project | `npx tsc --noEmit` |
| Documentation | Level 2 phase docs | `validate.sh --strict` |
| Comment hygiene | Changed code and test files | `check-comment-hygiene.sh` plus grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `memory_idempotency_receipts` schema | Internal | Green | Receipt store and lookup tests rely on existing columns. |
| `normalizeForHash` | Internal | Green | Provides token stripping, sorted object keys, and undefined omission. |
| `buildSaveResponse` status contract | Internal | Green | Defines which statuses represent mutating saves. |
| In-memory SQLite fixtures | Test | Green | Keeps tests isolated from live shards. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TypeScript, required flag-on/off tests, strict validation, or comment hygiene fails and cannot be repaired inside this scoped change.
- **Procedure**: Revert only the idempotency receipt, memory-save guard, test, and 023 phase documentation edits.
- **Data Reversal**: None. No schema migration, daemon operation, or live database write is performed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Code Reads -> Red Tests -> Receipt Fixes -> Flag-On/Off Tests -> Final Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Code Reads | User scope | Red tests |
| Red Tests | Code reads | Receipt fixes |
| Receipt Fixes | Red tests | Flag-on/off tests |
| Final Validation | Tests and docs | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Code reads and baseline testing | Medium | Completed in-session |
| Core implementation | Low | Completed in-session |
| Regression tests | Medium | Completed in-session |
| Documentation and final validation | Medium | Completed in-session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist
- [x] No live database shard modified.
- [x] No host daemon used for tests.
- [x] Parent 027 metadata left untouched.

### Rollback Procedure
1. Revert only the files listed in the scope table.
2. Re-run the idempotency/near-duplicate test file with the flag enabled.
3. Re-run strict spec validation if documentation files are changed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not needed; tests use temp/in-memory fixtures only.
<!-- /ANCHOR:enhanced-rollback -->
