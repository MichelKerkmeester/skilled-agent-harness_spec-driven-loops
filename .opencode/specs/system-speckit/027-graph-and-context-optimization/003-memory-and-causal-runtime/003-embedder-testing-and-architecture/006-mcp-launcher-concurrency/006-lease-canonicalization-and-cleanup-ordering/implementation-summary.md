---
title: "Implementation Summary: Lease Canonicalization and Cleanup Ordering"
description: "Phase 006 closes council findings by canonicalizing lease identity, probing legacy owners, ordering cleanup before signal mirrors, and reconciling traceability docs."
trigger_phrases:
  - "012/006 implementation summary"
  - "lease canonicalization summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase 006 remediation"
    next_safe_action: "Run final verification gates"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-006-implementation-summary"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "P2-Seat4 launcher-lease.md files remain outside frozen scope"
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
| **Spec Folder** | `006-lease-canonicalization-and-cleanup-ordering` |
| **Completed** | 2026-05-18 |
| **Level** | 2 |
| **Status** | Implementation complete; commit blocked by sandbox Git index permissions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 006 closes the remaining load-bearing lease gaps from the Phase 005 council review. Lease ownership now follows canonical filesystem identity, live legacy owners still block rolling-start duplicates, and launchers clear leases before any child signal mirror can terminate the parent.

### Finding Closure

| Finding | Closure |
|---------|---------|
| P1-Seat1-A | `lease.ts` and all three launchers canonicalize DB/lease paths with `realpathSync.native()` when possible. |
| P1-Seat1-B | Current lease checks fall back to legacy locations and emit `(legacy path)` when a live old owner is found. |
| P1-Seat2 | Child exit handlers call `clearLeaseFile()` before signal mirroring and before mirrored normal exits. |
| P1-Seat3-A | 005 `tasks.md` T022 is complete with `bd8a90747` commit evidence. |
| P1-Seat3-B | Launcher test REQ comments are phase-namespaced; resolved DB-dir tests map to `005-REQ-011`. |
| P1-Seat4 | Skill-advisor daemon lease contract documents canonical DB-dir lease location, legacy probes, and cleanup ordering. |
| P2-Seat1 | Inline lease files use `0600`; owned lease/DB dirs use `0700`; skill-advisor lease DB chmods to `0600`. |
| P2-Seat2 | Backstop tests use child fixtures that ignore SIGTERM until parent SIGKILL cleanup. |
| P2-Seat3-A | Arc parent invariant splits inline PID-file leases from skill-advisor daemon SQLite lease DB. |
| P2-Seat3-B | 002 checklist pending text replaced with concrete evidence language. |
| P2-Seat4 | Deferred by frozen scope: the two `launcher-lease.md` files are explicitly excluded in §3. |
| P2-Seat5 | `advisor_rebuild` runtime test observes WAL and busy_timeout through the real DB opener; one static watcher wiring check remains. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modified | Canonical lease DB path, legacy probe, secure perms. |
| `.opencode/bin/mk-*-launcher.cjs` | Modified | Canonical lease paths, legacy probes, cleanup ordering, secure PID-file writes. |
| `launcher-lease.vitest.ts` suites | Modified | Symlink, legacy, SIGKILL-backstop coverage plus namespaced anchors. |
| `launcher-bootstrap.vitest.ts` | Modified | Runtime rebuild-path DB pragma coverage. |
| `daemon-lease-contract.md` | Modified | Reference contract alignment. |
| `../spec.md`, `../002.../checklist.md`, `../005.../tasks.md` | Modified | Arc and older packet reconciliation. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation keeps the existing lease primitives and limits compatibility logic to the startup preflight. No old lease is migrated automatically; live legacy owners block, stale legacy owners are logged, and the new canonical lease remains the source of truth after startup proceeds.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Canonicalize with ENOENT fallback | First startup may create the DB directory; existing aliases still collapse to one real path. |
| Probe but do not migrate legacy leases | Rolling starts need safety without mutating old state unexpectedly. |
| Keep P2-Seat4 as a documented deferral | The frozen scope explicitly excludes direct edits to the two `launcher-lease.md` files. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <006> --strict` | PASS, exit 0. `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <arc> --strict` | PASS, exit 0. `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | PASS, exit 0. |
| `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest --run launcher-lease launcher-bootstrap` | PASS, exit 0. 2 files passed; 20 tests passed. |
| `cd .opencode/skills/system-code-graph/mcp_server && npx vitest --run launcher-lease` | FAIL before tests. Vite bundle loader hit `EPERM` writing `.opencode/skills/system-code-graph/node_modules/.vite-temp/...`. |
| `cd .opencode/skills/system-code-graph/mcp_server && npx vitest --run --configLoader runner launcher-lease` | PASS, exit 0. 1 file passed; 9 tests passed. |
| `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest --run launcher-lease` | PASS, exit 0. 1 file passed; 8 tests passed. |
| `git add <explicit Phase 006 paths>` | FAIL, exit 128. Git cannot create `.git/index.lock` in this sandbox: `Operation not permitted`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:commit-handoff -->
## Commit Handoff

The implementation is ready for the main agent to stage and commit outside the sandbox. Use this exact explicit path list:

```bash
git add \
  .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts \
  .opencode/bin/mk-skill-advisor-launcher.cjs \
  .opencode/bin/mk-code-index-launcher.cjs \
  .opencode/bin/mk-spec-memory-launcher.cjs \
  .opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts \
  .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts \
  .opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts \
  .opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts \
  .opencode/skills/system-skill-advisor/references/daemon-lease-contract.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/spec.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation/checklist.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability/tasks.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering/spec.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering/plan.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering/tasks.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering/checklist.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering/implementation-summary.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering/description.json \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering/graph-metadata.json
```

Commit subject:

```text
feat(012/006): close 6 P1 + 6 P2 from 005 council review
```

<!-- /ANCHOR:commit-handoff -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **P2-Seat4 is scope-conflicted.** The direct `system-code-graph/references/launcher-lease.md` and `system-spec-kit/references/launcher-lease.md` edits are deferred because the frozen file list says not to touch them.
2. **Code-graph exact Vitest command is blocked by Vite temp-file EPERM.** The same test suite passes with Vitest's `--configLoader runner`, which avoids the temp config bundle write.
3. **Commit is blocked by sandbox Git permissions.** The worktree has the implementation and evidence, but this runtime cannot create `.git/index.lock` to stage the explicit paths.
<!-- /ANCHOR:limitations -->
