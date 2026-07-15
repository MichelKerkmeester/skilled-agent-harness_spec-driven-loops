---
title: "Implementation Summary: CLI Front-Door Safety Remediation"
description: "Planning-only status for this remediation sub-phase: 6 findings carried as tasks; no fixes applied yet."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/004-cli-frontdoor-safety"
    last_updated_at: "2026-06-16T15:20:00Z"
    last_updated_by: "cli-frontdoor-remediation"
    recent_action: "Implemented 6 CLI front-door fixes; all CLI vitest green"
    next_safe_action: "Operator review; run validate.sh --strict on this folder"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CLI Front-Door Safety Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — 5 fixed, 1 refuted-then-hardened |
| **Date** | 2026-06-16 |
| **Findings carried** | 6 |
| **Findings resolved** | 6 (T001/T003/T004/T005/T006 fixed; T002 refuted-Round-2, hardened anyway per directive) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Six CLI front-door safety fixes across the three daemon-backed CLIs and the code-graph plugin bridge:

- **Socket perimeter hardening (T001, T004)** — `spec-memory-cli.ts` and `code-index-cli.ts` each gained an `assertSocketPerimeter()` client-side check (called from `ensureSocketEnvironment()`): lstat the socket dir and reject symlinks, require current-uid ownership when `process.getuid` exists, reject group/world-writable dirs, and lstat the socket node to reject a symlinked or foreign-owned socket. Mirrors the server bind fence in `system-code-graph/.../lib/ipc/socket-server.ts`.
- **Exit-code on error payload (T005)** — `spec-memory-cli.ts` gained an `isErrorPayload()` helper and now exits 1 when a daemon returns a `status:error` payload inside an `isError:false` envelope (code-index style), matching its sibling CLIs.
- **Bridge maintenance-block normalization (T003)** — `mk-code-graph-bridge.mjs` now normalizes the tool name (strip `-`/`_`, lowercase) before the `MAINTENANCE_TOOLS` check, so camelCase aliases (`codeGraphScan` etc.) can no longer bypass the prompt-time no-maintenance block.
- **Inline `--trusted` boolean (T006)** — `skill-advisor-cli.ts` now parses `--trusted=false`/`--trusted=0` correctly (mirroring `--warm-only`), so a serialized false no longer grants mutation authority.
- **Prompt-time mutation block (T002, refuted-then-hardened)** — Round-2 confirmed the existing `assertTrustedForMutation` gate already blocks default prompt-time mutations, so the finding is REFUTED. Per operator directive, added defense-in-depth: a `promptTime` boolean (from prompt-time env markers + a `--prompt-time` flag) now blocks mutation tools at prompt-time regardless of `--trusted`.

Files changed: `spec-memory-cli.ts`, `code-index-cli.ts`, `skill-advisor-cli.ts`, `mk-code-graph-bridge.mjs`, plus 3 new vitest files and edits to `spec-memory-cli.vitest.ts`. Dist rebuilt for all three packages so subprocess-shim tests stay fresh.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

confirm → fix → verify, per finding. Each cited file:line was re-opened and confirmed before editing; fixes mirror the cited sibling/server patterns (socket-server fence, code-index exit-code style, `--warm-only` inline parser, code-index alias fold). New regression tests use the existing harnesses (fake unix-socket daemon for spec-memory; direct `parseCliArgs`/`validateCommand`/`runCli` for parser/policy logic). The exit-code fix also has a shell-level assertion that spawns the real `dist/spec-memory-cli.js` process against a fake daemon and checks the OS exit code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Per operator directive, every finding is carried (refuted as hardening, asserted fix-as-stated).
- Fixes mirror existing correct sibling patterns where available.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Baseline → after (CLI suites per package, all green; deltas are added tests, zero regressions):

| Package | Baseline | After |
|---|---|---|
| spec-memory CLI | 13 (3 files) | 23 (6 files) |
| code-index CLI | 19 (4 files) | 37 (8 files) |
| skill-advisor CLI | 13 (4 files) | 35 (8 files) |

- New vitest: `spec-memory-cli-socket-perimeter` (4), `spec-memory-cli` exit-code (+2), `code-index-cli-socket-perimeter` (4), `mk-code-graph-bridge-maintenance-block` (10), `skill-advisor-cli-trusted-prompt-time` (12).
- Shell exit-code assertion on the real `dist/spec-memory-cli.js` process: `status:error` payload → exit 1, `status:ok` → exit 0 (PASS).
- `tsc` typecheck clean on all three packages; comment-hygiene clean on all 4 source files; `verify_alignment_drift.py` PASS on the bridge scope.
- Subprocess-shim suites (`*-job-semantics`, `*-parity`, `warm-cli-fallback`, `dual-spawn-hardening`, `owner-respawn`, `teardown`) re-run green after rebuilding dist for all three packages.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The socket-owner-mismatch branch (foreign uid) is not exercised by an automated test because forcing a different file owner is not portable in CI; the symlink and group/world-writable branches plus the owned-dir happy path are covered, and the owner check mirrors the already-tested server-side fence.
- T002 was REFUTED by Round-2 (the gate already exists); the added prompt-time block is defense-in-depth only and changes no previously-passing behavior (it only tightens prompt-time + mutation).
- The root `review/fresh-regression-75/` findings registry is outside this sub-phase's scope lock and was left unmodified; per-finding resolution is recorded here and in `tasks.md`.
- Dist was rebuilt for all three packages (build artifact); no live daemons were recycled.
<!-- /ANCHOR:limitations -->
