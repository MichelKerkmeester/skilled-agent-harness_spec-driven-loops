---
title: "Continuity Memory Runtime Phase 001: Cache-warning hooks"
description: "Narrowed a six-phase warning prototype to a bounded producer-side continuity prerequisite. Added replay-safe Stop-path verification and producer metadata in hook-state.ts and session-stop.ts."
trigger_phrases:
  - "phase 001 changelog"
  - "cache warning hooks"
  - "producer metadata patch"
  - "replay isolation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-08

> Spec folder: `027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/001-cache-warning-hooks` (Level 3)
> Parent packet: `027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

Packet 002 was originally framed as a six-phase cache-warning rollout with SessionStart estimator and UserPromptSubmit behavior. Canonical research proved that framing was too aggressive. Warning consumers are later in the continuity lane. The defensible near-term work is a bounded producer-side metadata patch plus replay-safe verification.

This phase re-scoped the packet in place. It now records the FTS-predecessor dependency honestly, limits active implementation scope to hook-state.ts and session-stop.ts, and defers any startup or consumer work to later packets.

### Added

- Replay harness in `mcp_server/test/hooks/replay-harness.ts` with isolated TMPDIR, autosave fencing, and out-of-bound write detection.
- Producer metadata fields in `HookState`: lastClaudeTurnAt, transcript fingerprint, and cache-token carry-forward values.
- Stop-path fixture at `tests/fixtures/hooks/session-stop-replay.jsonl` for producer verification.
- Double-replay test proving stable session totals and no duplicate producer markers.

### Changed

- `hook-state.ts` now carries additive `producerMetadata` instead of overloading existing session fields. claudeSessionId stays primary. SpeckitSessionId is nullable.
- `session-stop.ts` persists bounded transcript identity and cache-token carry-forward after parsing, staying a producer boundary rather than an analytics reader.
- Packet docs (spec.md, plan.md, tasks.md) aligned away from the old six-phase warning rollout toward the producer-first continuity lane.

### Fixed

- Producer-path idempotency gap: replaying the same transcript twice no longer creates duplicate turn ingestion or duplicate producer state rows.
- Out-of-bounds write detection: replay harness fails on paths touched outside the sandbox.

### Verification

- `TMPDIR=$PWD/.tmp/tsc-tmp npm run typecheck`: PASS
- Vitest suite (hook-state, session-stop, replay): PASS
- `validate.sh --strict`: PASS with zero errors and zero warnings.

### Files Changed

| File | What changed |
|------|--------------|
| `spec.md` | Re-scoped from six-phase warning rollout to producer-first continuity prerequisite. |
| `plan.md` | Aligned to predecessor-first, producer-only boundary. |
| `tasks.md` | Updated task matrix with replay isolation, producer metadata, and idempotent verification. |
| `checklist.md` | Synchronized with the re-scoped packet scope. |
| `decision-record.md` | Recorded the producer-first ADR. |
| `implementation-summary.md` | Authored post-implementation with verification evidence. |
| `mcp_server/hooks/claude/hook-state.ts` | Added additive producer metadata fields. |
| `mcp_server/hooks/claude/session-stop.ts` | Persists bounded transcript identity and cache-token carry-forward. |
| `mcp_server/test/hooks/replay-harness.ts` (NEW) | Isolated replay harness with side-effect detection. |
| `mcp_server/tests/hook-session-stop-replay.vitest.ts` (NEW) | Double-replay idempotency tests. |
| `mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl` (NEW) | Stop-path fixture for producer verification. |

Commits outside the spec-folder path range (under `mcp_server/`). Packet-level reference: `7a987e8827`.

### Follow-Ups

- **Analytics reader packet.** The normalized reader for hook metadata remains deferred. This phase intentionally stops at the producer boundary.
- **Cached-summary consumer.** SessionStart cached-summary fast path is deferred. Startup authority stays with session_bootstrap() and memory resume.
- **Direct warning surface.** UserPromptSubmit and .claude/settings.local.json mutations remain follow-on work.
