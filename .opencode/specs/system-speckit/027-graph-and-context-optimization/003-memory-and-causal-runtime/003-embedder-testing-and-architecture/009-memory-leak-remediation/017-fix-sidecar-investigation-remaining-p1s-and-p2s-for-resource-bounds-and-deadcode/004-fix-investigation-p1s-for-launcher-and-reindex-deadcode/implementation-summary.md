---
title: "Implementation Summary: Launcher and Reindex P1 Finding Closure"
description: "F15, F49, and F105 are closed with atomic owner-token writes, child env filtering, and dead reindex cancellation polling removal."
trigger_phrases:
  - "arc 010 003 004 implementation summary"
  - "launcher reindex p1 completed"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "Completed 3 P1 launcher/reindex fixes"
    next_safe_action: "Commit handoff: fix(010/003/004): close 3 P1 launcher + reindex findings - F15+F49+F105"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/bin/lib/ensure-rerank-sidecar.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
    session_dedup:
      fingerprint: "sha256:0100030040100030040100030040100030040100030040100030040100030040"
      session_id: "010-003-004-launcher-reindex-p1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-fix-investigation-p1s-for-launcher-and-reindex-deadcode |
| **Status** | Completed |
| **Completed** | 2026-05-23 |
| **Level** | 2 |
| **Findings Closed** | F15, F49, F105 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed the launcher and reindex P1 packet without broadening into sibling phase files. The launcher now publishes owner tokens through an atomic temp-write path and spawns the sidecar with a filtered environment; reindex no longer carries dead cancellation polling for a production path that does not exist.

### F15 Owner Token Atomicity

`loadOrCreateOwnerToken()` now reads existing tokens first, then uses an exclusive lock file for creation races. The lock holder writes a crypto-random temp path with `wx`, fsyncs the token file descriptor, closes it, and renames it into place. Contenders wait briefly for the winner's token and then return that same value.

### F49 Child Env Filtering

`ensureRerankSidecar()` now calls `buildSidecarEnv()` instead of spreading the full parent process env into `spawn()`. The allowlist passes minimal system keys, locale keys, `SPECKIT_*`, `RERANK_*`, and `HF_*`, then overlays the explicit sidecar port, owner token, and config hash.

### F105 Reindex Dead-Code Removal

`reindex.ts` no longer has `getCancellationStatus()` or the two `runJob()` cancellation polls. The initial cancelled-status guard remains, so queued cancellation before execution still exits. Mid-run cancellation remains unsupported until a production caller exists.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modified | F15 atomic owner-token publication and F49 child env allowlist |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modified | F15 atomic/concurrent fixtures and F49 env leakage fixture |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | F105 dead cancellation polling deletion |
| `decision-record.md` | Created | ADRs for the three P1 closure decisions |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Modified | Completed Level 2 packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The edits stayed inside the approved files. The F15 tests prove both the exact `wx`/fsync/rename sequence and a two-process race that returns one persisted token. The F49 test proves an allowlisted env reaches `spawn()` while an unrelated secret does not. Reindex behavior is covered by the existing `embedder-reindex.vitest.ts` regression suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use an owner-token lock plus temp-write/fsync/rename | Temp rename alone can publish atomically, but the lock makes concurrent launchers return one stable winner token. |
| Allow `SPECKIT_*`, `RERANK_*`, and `HF_*` families through the launcher env filter | The sidecar startup script needs rerank/model/cache knobs and already performs a second scrub before uvicorn. |
| Delete F105 polling instead of wiring cancellation | There is no production caller for mid-run cancellation; adding a feature would exceed this packet's closure scope. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` after scaffold | PASS |
| `node skills/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` from `.opencode/` | PASS, 11 passed and 5 skipped |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | PASS, 4 files and 40 tests passed |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedder-reindex.vitest.ts --config mcp_server/vitest.config.ts` | PASS, 4 tests passed |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` final | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Prompt bin-test path mismatch.** The requested `cd .opencode/skills/system-spec-kit && node node_modules/vitest/vitest.mjs ...` path is absent in this checkout. Equivalent bin tests ran from `.opencode/` using the installed `skills/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs`.
2. **Mid-run reindex cancellation remains unsupported.** This is intentional for F105 and recorded in ADR-003.
<!-- /ANCHOR:limitations -->
