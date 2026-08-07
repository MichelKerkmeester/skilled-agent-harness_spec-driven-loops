---
title: "Implementation Summary: Idempotency Flag-On Correctness"
description: "Memory idempotency correctness fixes make replay response-stable, preserve first receipt writes, and restrict memory-save receipt storage to successful mutating saves while keeping SPECKIT_MEMORY_IDEMPOTENCY default-off."
trigger_phrases:
  - "idempotency correctness summary"
  - "memory receipt replay fixed"
  - "SPECKIT_MEMORY_IDEMPOTENCY fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness"
    last_updated_at: "2026-06-11T12:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented idempotency receipt correctness fixes"
    next_safe_action: "Phase complete; preserve final verification evidence."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Replay markers were removed because idempotent replay must return the original response."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness` |
| **Completed** | 2026-06-11 |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase fixes the default-off memory idempotency path so explicit flag-on runs have correct replay, conflict, and write-gating behavior.

### FIX 1: Replay Response Stability

`lookupIdempotencyReceipt` now returns the stored MCP response exactly as persisted. It no longer injects replay data into the response payload, hints, or metadata. This preserves idempotent response equivalence.

### FIX 2: Immutable Receipt Storage

`storeIdempotencyReceipt` now inserts the first receipt for a key and leaves it unchanged on later conflicts. This prevents a repeated store or race from replacing the authoritative original response for the same key.

### FIX 3: Mutating-Success Write Guard

`shouldStoreMemorySaveReceipt` centralizes the receipt-write decision. The handler stores a receipt only when the save result is a non-error positive-id `indexed`, `updated`, or `deferred` mutation. Duplicate, unchanged, rejected, error, and error-envelope candidates are skipped so failed retries are not blocked.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts` | Modified | Return original replay response, preserve first receipt row, and expose tested write guard. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Use write guard before storing memory-save receipts. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts` | Modified | Add flag-on correctness regressions while keeping near-duplicate coverage. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness/*` | Created | Document phase scope, plan, checklist, tasks, metadata, and summary. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix was delivered as a focused receipt-layer correction plus one handler guard replacement. The test file first captured the red state for replay mutation and repeated-store overwrite, then validated the final behavior with in-memory SQLite fixtures. No schema migration, host daemon, live database shard, or feature-flag default change was required.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Remove replay response decoration. | Idempotency replay must return the original response, not a semantically modified response. |
| Preserve the first receipt response. | First-write semantics are safer for retries and concurrent misses than replacing receipt payloads later. |
| Use an allowlist for receipt-write statuses. | Unknown, non-mutating, or failed statuses should fail closed while the flag remains default-off. |
| Keep the flag default-off. | This phase fixes correctness only; enablement needs separate review and rollout evidence. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Red-state flag-on idempotency test after adding replay/store regressions | FAIL as expected, exit 1, 1 file failed, 2 tests failed, 7 passed. |
| Flag-on idempotency/near-duplicate suite after fixes | PASS, exit 0, 1 file passed, 12 tests passed (includes the won/lost store-contract and concurrent-loser replay regressions added in deep-review remediation). |
| Related memory-save suites with flag enabled | PASS, exit 0, 2 files passed, 17 tests passed, 51 skipped. |
| Flag-off idempotency/near-duplicate suite | PASS, exit 0, 1 file passed, 10 tests passed. |
| `npx tsc --noEmit` from `.opencode/skills/system-spec-kit/mcp_server` | PASS, exit 0, no output. |
| `validate.sh --strict` for this phase | PASS, exit 0, 0 errors, 0 warnings. |
| Changed-code comment-hygiene check | PASS, exit 0 for all three changed TypeScript files; targeted numeric-id-list grep had no output. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Replay equals original response | Deep equality test covers stored response replay | Pass |
| NFR-R02 | Retry after failure is not blocked | Error-envelope candidate remains `miss` | Pass |
| NFR-S01 | Client tokens ignored | Existing and extended normalization tests cover token aliases | Pass |
| NFR-S02 | No live shard or daemon touched | Tests use in-memory/temp fixtures | Pass |
| NFR-M01 | Minimal local fix | Only receipt storage, memory-save guard, tests, and docs changed | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Feature remains default-off.** Correctness is improved for explicit flag-on runs, but no default enablement or rollout guard changes are included.
2. **Replay observability is not embedded in the response.** This preserves correctness. If operators need replay telemetry, it should be added outside the replayed MCP response.
3. **Receipt-write statuses are intentionally allowlisted.** New future mutating statuses will need explicit review before they can write receipts.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Use the aggregate `memory-save.vitest.ts` related suite | Ran constituent memory-save suites directly | Vitest config excludes the aggregate entry file. |
| Create the phase folder | Reused existing empty phase directory containing only `review/` | The approved phase directory already existed; existing contents were not modified. |
| Only four authored docs requested | Added `checklist.md` | Level 2 validation requires a checklist. |
<!-- /ANCHOR:deviations -->
