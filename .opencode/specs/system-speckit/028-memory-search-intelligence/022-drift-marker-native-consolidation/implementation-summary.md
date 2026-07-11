---
title: "Implementation Summary: Drift Marker Native Consolidation"
description: "Status COMPLETE. The drift-marker writer is a compiled TypeScript entrypoint with shared API helpers, focused Vitest coverage, and a validated hook smoke test."
trigger_phrases:
  - "drift marker native consolidation"
  - "git hook embedded heredoc duplication"
  - "drift marker lock staleness constant mismatch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/022-drift-marker-native-consolidation"
    last_updated_at: "2026-07-10T18:43:03.872Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Stripped title scaffold-template placeholder marker"
    next_safe_action: "Review the committed change if further work is requested"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-drift-marker-native-consolidation |
| **Status** | COMPLETE |
| **Completed** | 2026-07-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The embedded git-hook writer was replaced with a compiled TypeScript entrypoint at
`scripts/git-hooks/drift-marker-write.ts`. It parses the unchanged environment payload,
delegates DB path resolution, deduplication, atomic writes, and lock reclaim through the public
MCP API, and catches operational errors so the hook remains non-fatal.

### Delivered: Drift-Marker Native Consolidation

The fix replaces `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`'s embedded
`node <<'NODE' ... NODE` heredoc with one delegated call to the compiled TypeScript entrypoint,
`scripts/git-hooks/drift-marker-write.ts`, that imports and reuses four already-tested TS
helpers instead of re-implementing them: `resolveDatabasePaths`
(DB-directory-override precedence, including the boundary-enforcement check the shell copy
currently lacks), `memoryDriftMarkerEntryKey` (the suspect/marker dedup-key format),
`atomicWriteFile` (the temp-file-plus-rename write pattern), and a staleness-parameterized
version of `spec-folder-mutex.ts`'s `isReclaimableLock`/`reclaimInterprocessLock` (the
lock-acquire/stale-reclaim logic, gaining an owner-liveness check while preserving the git
hook's own 45-second staleness window rather than silently inheriting the mutex's 5-minute
default).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/git-hooks/drift-marker-write.ts` | Created | Compiled entrypoint over the public MCP API |
| `memory-drift-marker.sh` | Modified | Delegates to the compiled entrypoint while retaining git plumbing and env payload |
| `mcp_server/api/index.ts` | Modified | Exposes the reused helpers to the scripts tree |
| `spec-folder-mutex.ts` | Modified | Adds optional `staleMs` with the existing five-minute default |
| `scripts/tests/drift-marker-write.vitest.ts` | Created | Covers deduplication, atomic recovery, both reclaim paths, and boundary rejection |

The three lifecycle hook call sites remain unchanged and retain their `|| true` wrappers.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The source and distributions were force-built because the worktree links `dist/` to the parent
checkout. A scratch repository committed a spec-file rename and called the shared hook with no
DB override; the expected marker entry was written and then removed as test cleanup.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Parameterize `spec-folder-mutex.ts`'s `isReclaimableLock` with an optional `staleMs` (default = today's `LOCK_STALE_MS`) rather than extracting a wholly separate shared primitive | Both functions are already pure, already exported, and only depend on one hardcoded constant — parameterizing avoids duplicating the function signatures for no behavioral gain, while a default value keeps every existing caller byte-identical |
| Keep the drift-marker entrypoint's staleness window at the `013`-tested 45 seconds, not the mutex's 5-minute default | Naively reusing the mutex's hardcoded constant would silently regress `013`'s empirically-tested, domain-appropriate recovery window (a ~6.7x slower self-heal after a killed hook process) |
| Preserve the existing `MEMORY_DRIFT_DIFF`/`MEMORY_DRIFT_REPO_ROOT`/`MEMORY_DRIFT_SOURCE` env-var transport unchanged, rather than switching to stdin/argv | Requires zero edits to `post-commit`/`post-merge`/`post-rewrite`'s call sites, the smallest possible externally-visible change |
| Resolve the marker directory via the already-exported `resolveDatabasePaths()` rather than re-deriving `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` precedence in the new entrypoint | `resolveDatabasePaths()` already performs both the override precedence `013`'s shell fix mirrors AND the boundary-enforcement check the shell copy has no equivalent of, in one call — re-deriving either half separately would reopen the exact duplication this phase exists to close |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| spec, plan, tasks, checklist authored | PASS, `validate.sh --strict` run against the scaffold (see report below) |
| Typecheck and build | PASS: forced MCP and scripts builds; scripts no-emit typecheck passed |
| New entrypoint built | PASS |
| Barrel exports added | PASS |
| `spec-folder-mutex.ts` staleness parameter added | PASS |
| Git hook shrunk | PASS |
| New vitest coverage and unchanged mutex regression suite | PASS: 8 tests |
| `check-api-boundary.sh` | PASS |
| `check-source-dist-alignment.ts` | PASS: 524 aligned files, zero violations |
| `check-no-mcp-lib-imports.ts` | BASELINE FAILURE: 17 unrelated existing violations; the new entrypoint imports only `@spec-kit/mcp-server/api` |
| Manual hook smoke test | PASS: no-override scratch-repo rename wrote the expected marker |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The full import-policy scanner has 17 pre-existing violations outside this packet. The new file
has no prohibited internal MCP imports; the separate API-boundary check and source/dist alignment
checks both pass.
<!-- /ANCHOR:limitations -->
