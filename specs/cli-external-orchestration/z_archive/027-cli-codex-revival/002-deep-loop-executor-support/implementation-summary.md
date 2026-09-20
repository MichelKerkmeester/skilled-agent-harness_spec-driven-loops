---
title: "Implementation Summary: Deep-loop Codex executor support"
description: "The shared runtime accepts and audits cli-codex while refusing unavailable binaries before dispatch."
trigger_phrases: ["Codex executor summary"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/002-deep-loop-executor-support"
    last_updated_at: "2026-07-13T11:23:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented and focused-tested Codex executor support"
    next_safe_action: "Run full verification and await phase 003 dependency"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "134-002", parent_session_id: "134-wave1" }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|---|---|
| **Spec Folder** | 002-deep-loop-executor-support |
| **Completed** | 2026-07-13 |
| **Level** | 2 |
| **Status** | Complete with repository baseline blockers documented |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built
Deep-loop configuration now accepts `cli-codex` with model, reasoning effort, service tier, sandbox, and timeout flags. Fan-out restores the historical `codex exec` adapter, audit guards understand Codex state and environment identity, and an explicit shell availability preflight rejects the route when `command -v codex` fails.

### Files Changed
| File | Action | Purpose |
|---|---|---|
| `executor-config.ts` | Modified | Accepted kind and supported flags. |
| `executor-audit.ts` | Modified | Audit, environment, state, and recursion identity. |
| `fanout-run.cjs` | Modified | Adapter and fail-closed availability gate. |
| Runtime tests | Modified | Acceptance, command, fan-out, and missing-binary coverage. |
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered
The implementation mirrors the previously shipped adapter while preserving current runtime safety and fan-out behavior. Focused tests pass with an external temporary `tsx` dependency because the runtime package lacks local dependency metadata; the complete suite was also executed to expose the repository baseline.
<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions
| Decision | Why |
|---|---|
| Preflight in command construction | Prevent accepted configuration from becoming an unusable spawned route. |
| Keep route advertisement in phase 003 | Runtime support does not prove global availability. |
| Omit absent service tier | Codex should use its account default, not an invalid synthetic value. |
<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## Verification
| Check | Result |
|---|---|
| Focused runtime tests | PASS: 157/157 across config, audit, CLI matrix, and fan-out |
| Changed-module strict typecheck | PASS |
| Full runtime suite | BLOCKED BASELINE: 606/694 pass; 88 failures from missing runtime-local `better-sqlite3`/`tsx`, existing concurrency fallout, and stale AI-council contract digests |
| Exact recursive strict validation | BLOCKED BEFORE RULES: stale `system-spec-kit/mcp_server` compiled orchestrator requires a banned rebuild |
| Recursive strict shell contract | PASS: Errors 0, Warnings 0 for parent and phases 001-006 |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations
1. User-facing availability and route advertisement belong to phase 003 after the external hub rename.
2. The runtime-local test package has no `package.json` and cannot resolve `tsx` without an external dependency path.
<!-- /ANCHOR:limitations -->
