---
title: "Continuity Memory Runtime Phase 001: Cache-Warning Hook System"
description: "Bounded Stop-path producer metadata handoff shipped. HookState gained additive producer fields. An isolated replay harness with sandbox enforcement and double-replay idempotency validation replaced the speculative six-phase warning prototype."
trigger_phrases:
  - "cache warning hook system"
  - "stop hook producer metadata"
  - "replay harness isolation"
  - "hook-state producer patch"
  - "continuity producer boundary"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-08

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/001-cache-warning-hooks` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

The original packet framing promised a six-phase cache-warning rollout including `UserPromptSubmit` behavior and a `SessionStart` estimator. Canonical research dated 2026-04-08 narrowed the safe early work to a bounded producer-side metadata patch in `session-stop.ts` and `hook-state.ts` after FTS helper and forced-degrade tests existed. The packet was re-scoped accordingly and all active scope was realigned to that boundary.

`HookState` now carries additive `producerMetadata` that persists `lastClaudeTurnAt` plus a bounded transcript reference with fingerprint and file stats plus cache-token carry-forward values while keeping `claudeSessionId` primary and `speckitSessionId` nullable. The Stop hook runs `processStopHook()`, which invokes `runContextAutosave()` by default when session state is populated. An isolated replay harness provisions a sandboxed `TMPDIR`, disables autosave side effects. Out-of-bound writes are reported as hard failures. Double-replay idempotency proved stable session totals with no duplicate turn ingestion across back-to-back transcript replays.

### Added

- Additive `producerMetadata` block in `HookState` carrying `lastClaudeTurnAt`, bounded transcript identity reference plus cache-token carry-forward fields
- Isolated replay harness via `createStopReplaySandbox()` with sandboxed `TMPDIR`, autosave fence, out-of-bound write detection
- Stop-path replay test suite in `hook-session-stop-replay.vitest.ts` covering one-pass and double-replay idempotency scenarios
- Token-tracking test coverage in `hook-stop-token-tracking.vitest.ts`
- Stop-path fixture `tests/fixtures/hooks/session-stop-replay.jsonl` (NEW)

### Changed

- `hook-state.ts`: `HookState` extended with bounded producer fields without altering existing session metrics or continuity field contracts
- `session-stop.ts`: Stop hook persists producer metadata after transcript parsing without adding an analytics reader or second narrative owner
- Packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `research.md`) re-scoped from six-phase warning rollout to producer-first prerequisite lane

### Fixed

- Packet docs previously claimed active `UserPromptSubmit` and `.claude/settings.local.json` rollout scope. All claims were removed and deferred to follow-on packets.
- Replay validation lacked sandbox isolation. The new harness enforces `TMPDIR` isolation and treats out-of-bound writes as failures.

### Verification

| Check | Result |
|-------|--------|
| `TMPDIR=$PWD/.tmp/tsc-tmp npm run typecheck` | PASS |
| `TMPDIR=$PWD/.tmp/vitest-tmp npx vitest run tests/sqlite-fts.vitest.ts tests/hook-state.vitest.ts tests/session-token-resume.vitest.ts tests/hook-session-start.vitest.ts tests/hook-session-stop.vitest.ts tests/hook-session-stop-replay.vitest.ts tests/hook-stop-token-tracking.vitest.ts` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/001-cache-warning-hooks" --strict` | PASS |
| CHK-011: Producer metadata remains additive in `HookState` | PASS |
| CHK-020: Replay harness isolates temp state and fails on out-of-bound writes | PASS |
| CHK-022: Double-replay idempotency validation | PASS |
| CHK-023: Double replay proves stable session totals | PASS |
| CHK-024: Double replay proves no duplicate turn ingestion | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | Additive `producerMetadata` block with `lastClaudeTurnAt`, transcript reference plus cache-token carry-forward fields. `claudeSessionId` remains primary. `speckitSessionId` remains nullable. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Persists bounded producer metadata after transcript parsing. Autosave remains the primary continuity mechanism via `runContextAutosave()`. No analytics reader or publication logic added. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts` | One-pass and double-replay Stop-path validation with idempotency assertions. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts` | Token-tracking coverage for the producer patch. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl` (NEW) | Stop-path fixture for replay harness. |

### Follow-Ups

- Add a `SessionStart` cached-summary fast path once the producer boundary proves stable across at least one consumer packet.
- Implement `UserPromptSubmit` warning behavior as a separate follow-on packet after the analytics reader gate is satisfied.
- Introduce `.claude/settings.local.json` runtime enablement only after cached-summary consumer and warning consumer packets land.
- Add normalized analytics reader, dashboard contract, token-observability publication as later follow-on packets.
