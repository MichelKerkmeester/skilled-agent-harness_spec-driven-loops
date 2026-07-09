---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. The drift-marker native-consolidation fix is scaffolded with spec, plan, tasks and checklist. No code is built yet."
trigger_phrases:
  - "drift marker native consolidation"
  - "git hook embedded heredoc duplication"
  - "drift marker lock staleness constant mismatch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/022-drift-marker-native-consolidation"
    last_updated_at: "2026-07-09T20:31:22.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Scaffolded plan, tasks and checklist, status PLANNED"
    next_safe_action: "Build the compiled entrypoint and shrink the git hook per plan.md, then verify"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
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
| **Status** | PLANNED, not yet implemented |
| **Completed** | Not completed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is scaffolded only. The spec, plan, tasks and checklist are
authored and the work is PLANNED.

### Planned: Drift-Marker Native Consolidation

The planned fix replaces `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`'s embedded
`node <<'NODE' ... NODE` heredoc (today's entire write-side implementation, untestable by
vitest) with one delegated call to a new compiled TypeScript entrypoint,
`scripts/git-hooks/drift-marker-write.ts`, that imports and reuses four already-tested TS
helpers instead of re-implementing them: `resolveDatabasePaths`/`computeDatabasePaths`
(DB-directory-override precedence, including the boundary-enforcement check the shell copy
currently lacks), `memoryDriftMarkerEntryKey` (the suspect/marker dedup-key format),
`atomicWriteFile` (the temp-file-plus-rename write pattern), and a staleness-parameterized
version of `spec-folder-mutex.ts`'s `isReclaimableLock`/`reclaimInterprocessLock` (the
lock-acquire/stale-reclaim logic, gaining an owner-liveness check while preserving the git
hook's own `013`-tested 45-second staleness window rather than silently inheriting the mutex's
5-minute default). None of this exists in code yet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| spec.md | Created | Records the four duplications with file:line evidence, scope, requirements and acceptance criteria |
| plan.md | Created | Records the implementation approach, the two resolved design decisions, and the phase plan |
| tasks.md | Created | Records the task breakdown |
| checklist.md | Created | Records the QA checklist, all items unchecked |

No source code has been written. `scripts/git-hooks/drift-marker-write.ts` (new),
`memory-drift-marker.sh` (shrink), `mcp_server/api/index.ts` (new barrel exports), and
`spec-folder-mutex.ts` (additive `staleMs` parameter) are all planned, not created or modified.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. This is a planning scaffold. No tests were run and no code was written. Delivery
starts at plan.md Phase 1 (Setup), since this phase's target file
(`memory-drift-marker.sh`) already carries `013-drift-marker-pipeline-resilience`'s shipped F3/F4
fixes and this phase's acceptance criteria are written to preserve those values while
consolidating their implementation, not to redo them.
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
| New entrypoint built | NOT STARTED |
| Barrel exports added | NOT STARTED |
| `spec-folder-mutex.ts` staleness parameter added | NOT STARTED |
| Git hook shrunk | NOT STARTED |
| New vitest coverage (dedup, atomic write, lock reclaim, boundary check) | NOT STARTED |
| `spec-folder-mutex-liveness.vitest.ts` regression re-run | NOT STARTED |
| `check-no-mcp-lib-imports`/`check-api-boundary.sh`/`check-source-dist-alignment.ts` | NOT STARTED |
| Manual post-commit smoke test | NOT STARTED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code exists.** This phase is a planning scaffold only. The compiled entrypoint, the
   barrel exports, the `spec-folder-mutex.ts` parameter, and the shrunk git hook are all planned,
   not built.
2. **Two design decisions were resolved during planning, not left open in shipped code** (see
   Key Decisions above and plan.md §3), but neither has been implementation-verified yet —
   plan.md's documented fallback for the owner-liveness mechanism (staying mtime-only if the
   `owner.json` write is found to conflict with the lock directory's existing reclaim path)
   remains a live possibility until Phase 2 is actually built.
3. **Depends on `013-drift-marker-pipeline-resilience`'s shipped values remaining accurate.**
   This phase's REQ-003/REQ-004 baselines are written against `013`'s documented 45-second
   staleness window and live-DB-path precedence order; Phase 1's first task re-confirms both
   against the live tree before implementation proceeds, in case either has drifted since `013`
   shipped.
<!-- /ANCHOR:limitations -->
