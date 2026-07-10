---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Entity-density routing now reflects memory_update mutations immediately, and the atomic-save uuid-suffixed orphan recovery is regression-protected."
trigger_phrases:
  - "entity density invalidation summary"
  - "mutation hook entity density"
  - "atomic save orphan regression"
  - "memory write correctness summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/003-memory-write-correctness"
    last_updated_at: "2026-06-04T20:45:42Z"
    last_updated_by: "cluster-c-write-correctness"
    recent_action: "Shipped C1 hook wiring plus C1/C2 regression tests; docs reconciled to Complete"
    next_safe_action: "Defer mcp_server typecheck and vitest to central verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-types.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-memory-write-correctness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-memory-write-correctness |
| **Completed** | 2026-06-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Entity-density routing used to lag behind metadata edits: renaming a high-degree memory or rewriting its trigger phrases through `memory_update` left the graph channel matching stale tokens for up to 60 seconds. That gap is now closed at its root, and the atomic-save crash-recovery path that nobody had pinned down with a test is finally regression-protected.

### Entity-density invalidation in the shared hook

Every CRUD handler funnels its post-commit cache clears through one function, `runPostMutationHooks`. That function cleared the trigger, tool, constitutional, graph-signal, degree, and co-activation caches but skipped entity-density, so the `memory_update` path silently served stale routing. The fix adds a guarded entity-density clear right there in the shared hook, so update and atomic-save both pick it up and no future mutation path can forget it. The result object now carries an optional `entityDensityCacheCleared` flag so callers can observe the clear without breaking the handlers and fallback literals that omit it.

### Atomic-save orphan recovery regression

A hard crash between the DB commit and the pending-file rename can leave a `*_pending.md.<uuid8>` orphan with no original file. Startup recovery already handles this shape, but no test exercised it end-to-end. The new test writes exactly that orphan plus a committed-row probe, runs `recoverAllPendingFiles`, and asserts the orphan is renamed to its final path with content intact, plus that `findPendingFiles` and `isPendingFile` recognize the double-suffix name.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/handlers/mutation-hooks.ts` | Modified | Import and call `invalidateEntityDensityCache`; record the new flag. |
| `mcp_server/handlers/memory-crud-types.ts` | Modified | Add optional `entityDensityCacheCleared` to `MutationHookResult`. |
| `mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts` | Modified | Add the memory_update trigger-phrase rewrite case. |
| `mcp_server/tests/transaction-manager-recovery.vitest.ts` | Modified | Add the uuid-suffixed orphan-recovery case. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The source change is a single guarded block in the shared hook plus one optional type field, kept minimal so existing lower-layer invalidations stay untouched. Per cluster policy, mcp_server typecheck and vitest were not run here because peers are editing the same package concurrently; verification is deferred to central. Confidence comes from a read-back self-review: the field is optional, so all five `MutationHookResult` fallback literals still compile, and the two new tests are written to fail without the fix (the update-path test asserts no TTL wait, and the orphan test depends on the double-suffix parser).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the entity-density clear in the shared hook, not the update handler | One fan-in point means update, atomic-save, delete, and bulk-delete all stay covered and no future path can forget it. |
| Keep `entityDensityCacheCleared` optional | The type is shared by five call sites and `buildMutationHookFeedback`; an optional field avoids touching any of them. |
| Leave lower-layer invalidations in place | They are idempotent and removing them risks the delete and save fast paths; that cleanup is out of scope. |
| Make C2 test-only, no reorder | There is no real two-phase commit across SQLite and the filesystem; reordering would just move which artifact is orphaned, while the recovery path already closes the window. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Optional-field typecheck safety (read-back of five fallback literals) | PASS, all omit the field and remain valid |
| Import path `../lib/search/entity-density.js` from handlers | PASS, matches existing handler import style |
| Update-path test logic (no manual invalidation, asserts oldToken===0) | PASS by inspection, fails without the hook wiring |
| Orphan-recovery test logic (double-suffix parse + rename) | PASS by inspection against `parsePendingPath` behavior |
| mcp_server `tsc --noEmit` and `vitest` | DEFERRED to central (peers editing concurrently) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A second, structurally similar DB-before-file write exists at `memory-save.ts:2653-2659`** (the non-atomic quality-loop finalize). It is outside the atomic pending/recovery mechanism and outside the stated C2 scope, so it is not covered here. It self-documents that manual file recovery may be needed.
2. **`buildMutationHookFeedback` does not surface the new flag.** That file was outside the C1 `filesToEdit`, so the optional `entityDensityCacheCleared` is recorded on `MutationHookResult` but not echoed in the feedback envelope. Adding it there is a safe follow-on.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
