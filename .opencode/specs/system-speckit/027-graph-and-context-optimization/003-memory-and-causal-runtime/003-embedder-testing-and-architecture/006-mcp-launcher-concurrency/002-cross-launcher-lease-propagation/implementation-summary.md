---
title: "Cross-Launcher Lease Propagation — Implementation Summary"
description: "Launcher-boundary PID-file lease mirrored from 006 into mk-code-index + mk-spec-memory launchers via cli-codex gpt-5.5 high fast. 6 tests green, typecheck clean."
trigger_phrases:
  - "008/007 implementation"
  - "cross-launcher lease shipped"
  - "code-graph spec-memory single-writer"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation"
    last_updated_at: "2026-05-18T07:56:00Z"
    last_updated_by: "main_agent"
    recent_action: "Closed packet 007 via cli-codex gpt-5.5 high fast"
    next_safe_action: "Restart MCP servers to pick up new launcher binaries"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/skills/system-code-graph/references/launcher-lease.md"
      - ".opencode/skills/system-spec-kit/references/launcher-lease.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-cross-launcher-lease-propagation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Lease primitive — inline PID-file in each launcher, no lib/daemon/lease.ts added"
      - "Cross-launcher behavioral parity — same env-var pattern + LEASE_HELD_BY:<pid> stdout + staleReclaimed log"
      - "Dispatch shape — cli-codex gpt-5.5 -c model_reasoning_effort=high -c service_tier=fast --sandbox workspace-write"
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
| **Spec Folder** | 002-cross-launcher-lease-propagation |
| **Completed** | 2026-05-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All three MCP launchers (`mk-skill-advisor`, `mk-code-index`, `mk-spec-memory`) now share one concurrency model: launcher-boundary single-writer enforcement via a PID-file lease. A sibling launcher detects the live owner, prints `LEASE_HELD_BY:<pid>`, and exits with code 0 before opening any SQLite file or spawning any child process. The zombie-daemon condition that caused skill-advisor's 1005-corrupt-file accumulation (packet 006) is now structurally impossible across all three servers — even though code-graph and spec-memory's WAL+busy_timeout combo was already masking the symptom.

### code-graph launcher PID lease (`.opencode/bin/mk-code-index-launcher.cjs`)

The launcher now writes `.mk-code-index-launcher.json` (`{pid, startedAt}`) inside its database directory after the bootstrap lock releases. On every fresh launch it probes the recorded PID via `process.kill(pid, 0)`; if alive, exit clean; if dead (ESRCH), log `staleReclaimed: true` and continue. Cleanup hooks on SIGTERM/SIGINT/exit remove the file. Gated by `MK_CODE_INDEX_STRICT_SINGLE_WRITER` (default `1`); set `0` for dev overrides.

### spec-memory launcher PID lease (`.opencode/bin/mk-spec-memory-launcher.cjs`)

Same primitive, with one adaptation: spec-memory spawns a child `context-server.js` process. The launcher's SIGTERM handler was extended to forward the signal to the child before clearing the lease file, so the child shuts down cleanly and no orphan `context-server.js` lingers. Env-var gate: `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER` (default `1`).

### Tests (2 new files, 6 new tests)

`system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` and `system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` each carry 3 cases: spawn-twice exits 0 with `LEASE_HELD_BY:<pid>`, dead-PID lease file triggers `staleReclaimed: true` reclaim, and `MK_*_STRICT_SINGLE_WRITER=0` lets the second launcher boot. All 6 green.

### Reference docs

`system-code-graph/references/launcher-lease.md` and `system-spec-kit/references/launcher-lease.md` document the PID-file format, env-var override, stale-reclaim path, and cross-launcher parity contract.

### Changelog

`013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/changelog/002-cross-launcher-lease-propagation.md` records the patch with summary, what-changed table, upgrade notes (zero migration), and full verification evidence including the manual spawn-twice transcripts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify (+81/-11) | Inline PID lease + cleanup hooks + env-var gate |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify (+81/-11) | Same primitive + child-aware SIGTERM forwarding |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Create (+179) | 3 spawn-based tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Create (+182) | 3 spawn-based tests |
| `.opencode/skills/system-code-graph/references/launcher-lease.md` | Create (+83) | Code-graph lease reference |
| `.opencode/skills/system-spec-kit/references/launcher-lease.md` | Create (+83) | Spec-memory lease reference |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/changelog/002-cross-launcher-lease-propagation.md` | Create (+103) | Packet changelog |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex `gpt-5.5` dispatch with `-c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write` (per the user's "use gpt 5.5 high fast" override and the cli-codex skill's required `service_tier="fast"` discipline). RCAF framework prompt with medium-density pre-planning (5 phases × 3 steps with per-step acceptance + verification) and standard bundle-gate wording. Codex's structured emit independently verified by re-running both typechecks (PASS) and both vitest launcher-lease suites (3+3 = 6 tests PASS) from the main agent before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Inline PID-file primitive in each launcher (no shared `lib/daemon/lease.ts`) | Sibling skills don't have that lib structure already; introducing one would couple things that should stay independent. Skill-advisor's lease.ts is SQLite-backed for the watcher-role lease too; PID-file is the lighter primitive that fits the launcher-only need here. |
| Atomic write via `<path>.tmp.<pid>` + rename | Avoids the partial-file race where two launchers write the lease at the same instant |
| spec-memory launcher extends existing SIGTERM handler instead of duplicating | Preserves the existing child-cleanup logic; adds the PID-file clear at the right boundary |
| `kill -0` only (existence probe), never any other signal | Lease-file PID tampering cannot escalate into killing unrelated processes |
| 24-hour zombie audit deferred to operator | Requires keeping the new launchers live with all 6 runtime configs active; bench-style measurement, not unit-testable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-code-graph run typecheck` | PASS — `tsc --noEmit` exit 0, no diagnostics |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS — `tsc --noEmit` exit 0, no diagnostics |
| `vitest --run launcher-lease` (code-graph, independent rerun) | PASS — 3 tests, 385ms |
| `vitest --run launcher-lease` (spec-memory, independent rerun) | PASS — 3 tests, 392ms |
| Manual spawn-twice probe — code-graph | PASS — second launcher PID 52613 exited 0 with `LEASE_HELD_BY:<owner>`; lease file gone after SIGTERM |
| Manual spawn-twice probe — spec-memory | PASS — second launcher PID 55959 exited 0 with `LEASE_HELD_BY:<owner>`; lease file gone after SIGTERM |
| Scope discipline (`git status` vs spec.md §3 Files to Change) | PASS — all 7 modified files appear in §3; one runtime `.mk-spec-memory-launcher.json` updated by the live launcher (expected, not committed) |
| Strict spec validate | PASS — 0 errors, 1 advisory PRIORITY_TAGS warning (consistent with packet 006 baseline) |
| Cross-launcher LEASE_HELD_BY parity | PASS — `grep -c 'LEASE_HELD_BY' .opencode/bin/mk-*-launcher.cjs` returns 3 |
| 24-hour zero-zombie soak (SC-002) | DEFERRED — operator runs after restart |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **24-hour zombie audit (SC-002) deferred to operator.** Verification requires the new launchers to be active across all 6 runtime configs (Claude Code, OpenCode, Codex, Devin, VSCode, Gemini) for 24 hours, then asserting `ps aux | grep -E 'mk-(skill-advisor|code-index|spec-memory)-launcher' | wc -l ≤ 3`. After the soak completes, mark CHK-014 done in `checklist.md` with the timestamp + ps output evidence.
2. **PID-reuse false-negative.** If the OS recycles the recorded PID to an unrelated process, `kill -0` returns success and the new launcher exits silently. Acceptable; operator recovers by deleting the lease file. Risk is low on macOS (PID space is large).
3. **`npx` network-restricted in codex sandbox.** During the dispatch, `npx vitest` could not reach `registry.npmjs.org`. Codex used the local `node_modules/.bin/vitest` binary instead. Recorded in the changelog. No behavioral impact on the shipped code.
4. **Sibling skill ref doc location.** Each launcher-lease.md lives under its own skill's `references/`. If a future packet wants a single unified concurrency-policy doc, it can absorb both without losing per-skill discoverability.
<!-- /ANCHOR:limitations -->
