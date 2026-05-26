---
title: "Hook Parity Phase 001: Runtime hook parity remediation"
description: "Closed 10 hook parity defects across OpenCode transport, Codex advisor and pre-tool hooks, Copilot startup routing, and documentation truth-sync. Hook failures no longer silently no-op."
trigger_phrases:
  - "phase 009/001 changelog"
  - "hook parity remediation"
  - "opencode transport diagnostic"
  - "codex advisor hook"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-21

> Spec folder: `026-graph-and-context-optimization/007-hook-parity/001-runtime-hook-parity-findings-remediation` (Level 3)
> Parent packet: `026-graph-and-context-optimization/007-hook-parity`

### Summary

The 2026-04-21 hook parity review found 10 runtime-hook defects. The highest risk was an OpenCode plugin path that could silently deliver no code-graph context, and Codex advisor hook flows that could return no visible advisory on timeout. This phase restored reliable, visible hook behavior across OpenCode, Codex, and Copilot while keeping documentation aligned with actual runtime capabilities.

### Added

- Visible diagnostic emission when OpenCode bridge transport parsing fails (`opencodeTransport` missing or unparsable). The plugin transform no longer silently no-ops.
- Copilot startup routing now uses the repo-local wrapper at `.github/hooks/scripts/session-start.sh`.
- Codex prompt hook surfaces visible advisor context or a stale diagnostic on timeout.
- Codex hook policy detection uses `.codex/settings.json` as the authoritative source.
- PreToolUse denylist alias and casing coverage tests.
- Phase 003 strict validation, evidence, continuity, and metadata repairs.

### Changed

- `session_resume({ minimal: true })` now returns a parseable `opencodeTransport` plan with `transportOnly: true`. The bridge needs the plugin contract. Minimal mode skips heavy memory enrichment only.
- PreToolUse hook runtime is read-only. Missing policy uses in-memory defaults and creates no filesystem writes.
- Runtime documentation splits prompt, lifecycle, compaction, and stop hook capabilities per runtime.
- Phase 003 docs point to `session_bootstrap` for Codex startup recovery. No stale startup-agent acceptance gate remains.

### Fixed

- OpenCode bridge stderr now reports the missing `opencodeTransport` condition instead of silently returning an empty context.
- Codex advisor hook no longer silently fails open on timeout. It emits a stale diagnostic.
- Copilot `sessionStart` no longer routes through an incorrect path.

### Verification

- Phase A vitest: 15 tests passed (`tests/session-resume.vitest.ts`, `tests/opencode-plugin.vitest.ts`).
- Phase B vitest: 29 tests passed (Codex hook policy and prompt hook suites).
- Phase C vitest: 3 tests passed (Copilot hook wiring).
- Phase D vitest: 10 tests passed (Codex PreToolUse).
- Strict validation: passed with zero errors and zero warnings.
- Full Vitest baseline: 578 passed test files, 11114 passed tests, 31 skipped tests.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Emit visible diagnostics when transport parsing fails. |
| `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs` | Emit stderr diagnostics when `opencodeTransport` is missing. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts` | Assert the diagnostic path fires. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-hook-parity/001-runtime-hook-parity-findings-remediation/**` | Validation, evidence, continuity, metadata, and remediation summary repairs. |

### Follow-Ups

- Phase 002 (Copilot hook parity), Phase 003 (Codex native hooks), and Phase 004 (Claude findings) address remaining runtime gaps not covered by this initial remediation.
- Full-suite baseline is green. Deferred Vitest failures from earlier sessions are closed.