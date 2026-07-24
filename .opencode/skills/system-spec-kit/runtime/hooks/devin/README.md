---
title: "Devin Hooks: Gate-3 spec-gate wiring for Devin CLI"
description: "Devin CLI UserPromptSubmit hook that calls the shared spec-gate core to advise Gate-3 -- built, typechecked, and dormant pending a devin build that fires hooks under -p dispatch."
---

# Devin Hooks

---

## 1. OVERVIEW

`runtime/hooks/devin/` holds the Devin CLI side of the Gate-3 spec-folder discipline, mirroring `runtime/hooks/codex/`. `spec-gate-classify.mjs` (phase 004, `UserPromptSubmit`) and `spec-gate-enforce.mjs` (phase 008, `PreToolUse`) both call into `runtime/lib/spec-gate/spec-gate-core.mjs` as a fourth consumer alongside the Claude hook, the OpenCode plugin, and the Codex hook, so the core never changes for a new runtime. Both entrypoints fail open: a missing or invalid stdin payload always resolves to approve.

**`spec-gate-enforce.mjs` was added by phase 008, not phase 004.** Phase 004's own scope explicitly started with `SessionStart`/`UserPromptSubmit` only, deferring `PreToolUse` enforcement to phase 008 alongside the other remaining lifecycle events. Phase 008's original 9-file matrix then itself omitted `spec-gate-enforce.mjs` -- a real gap the research had already scoped (§10, C-02/C-05/G-01) but that never made it into the file list -- caught and closed during phase 008's implementation.

## 2. STATUS: DORMANT -- LIVE-VERIFIED, NOT ASSUMED

Live-probed 2026-07-24 against the installed `devin 3000.2.17` binary: neither `.devin/hooks.v1.json` (standalone, with and without a `"version": 1` field) nor `.devin/config.json`'s `"hooks"` key is consulted under `devin -p`, confirmed via a real dispatched tool call producing zero probe firings and via deliberately malformed hook JSON producing zero parse errors. `--agent-config`'s own strict parser separately rejects `hooks` as an unknown field, ruling out that path too. No headless attachment point exists in this build; interactive mode was not testable from this environment. Full evidence table: [`../../mcp-server/hooks/devin/README.md`](../../mcp-server/hooks/devin/README.md) §2.

`spec-gate-classify.mjs` is built, syntax-valid, and directly-invocation-tested with realistic payloads -- never claimed as live-fire-verified. Re-run the probe methodology before registering it against a future `devin` build.

## 3. CONTENTS

| File | Purpose | Status |
|------|---------|--------|
| `spec-gate-classify.mjs` | `UserPromptSubmit` hook. Runs `classifyIntent()` against each user turn and would surface the bounded Gate-3 question as `additionalContext`. | **Dormant** -- confirmed no `-p`-mode attachment point exists (see §2). |
| `spec-gate-enforce.mjs` | `PreToolUse(^exec$\|^edit$)` hook (phase 008). Calls `spec-gate-core.mjs`'s `evaluateMutation()` directly -- the actual gate-3 BLOCK, distinct from `spec-gate-classify.mjs`'s advisory classify step. A `deny` decision emits `permissionDecision: "deny"`; an `advise` decision surfaces `additionalContext` without blocking. Devin's `exec`/`edit` `tool_input` field names are unconfirmed -- tolerates the same file_path candidate fallbacks the Claude/Codex siblings use. | **Dormant** -- confirmed no `-p`-mode attachment point exists (see §2). |

## 4. CONSUMERS

- The project's `.devin/hooks.v1.json` wires `spec-gate-classify.mjs` to `UserPromptSubmit` and `spec-gate-enforce.mjs` to `PreToolUse` (`^exec$`, `^edit$` matchers). **Committed per operator direction** despite the confirmed dormancy above -- re-tested live after the phase 008 extension and still confirmed dormant, no different from before the files existed.

## 5. RELATED

- [`spec-gate-core.mjs`](../../lib/spec-gate/spec-gate-core.mjs): shared runtime-neutral policy both hooks call.
- [`runtime/hooks/claude`](../claude/README.md), [`runtime/hooks/codex`](../codex/README.md), [`runtime/hooks/cursor`](../cursor/README.md): sibling implementations for the other CLI transports.
- [`.opencode/specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md`](../../../../../specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md): ADR-001 and the full live-verification methodology.
- [`.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/decision-record.md`](../../../../../specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/decision-record.md): ADR covering `spec-gate-enforce.mjs`.
