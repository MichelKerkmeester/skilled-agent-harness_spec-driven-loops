---
title: "Devin Hooks: Gate-3 spec-gate wiring for Devin CLI"
description: "Devin CLI UserPromptSubmit hook that calls the shared spec-gate core to advise Gate-3 -- built, typechecked, and dormant pending a devin build that fires hooks under -p dispatch."
---

# Devin Hooks

---

## 1. OVERVIEW

`runtime/hooks/devin/` holds the Devin CLI side of the Gate-3 spec-folder discipline for the two events phase 004 scopes (`SessionStart`, `UserPromptSubmit`), mirroring `runtime/hooks/codex/`. `spec-gate-classify.mjs` calls into `runtime/lib/spec-gate/spec-gate-core.mjs` as a fourth consumer alongside the Claude hook, the OpenCode plugin, and the Codex hook, so the core never changes for a new runtime. The entrypoint fails open: a missing or invalid stdin payload always resolves to approve.

**`PreToolUse` enforcement (`spec-gate-enforce.mjs`) is deliberately NOT built here.** Phase 004's own scope explicitly starts with `SessionStart`/`UserPromptSubmit` only; `PreToolUse` belongs to phase 008 (`devin-hook-parity`) alongside the other 5 remaining lifecycle events. The parent packet's Files-to-Change table listed `spec-gate-enforce.mjs` under this phase, which conflicted with phase 004's own stated 2-event scope -- resolved in favor of the explicit scope statement, not the table.

## 2. STATUS: DORMANT -- LIVE-VERIFIED, NOT ASSUMED

Live-probed 2026-07-24 against the installed `devin 3000.2.17` binary: neither `.devin/hooks.v1.json` (standalone, with and without a `"version": 1` field) nor `.devin/config.json`'s `"hooks"` key is consulted under `devin -p`, confirmed via a real dispatched tool call producing zero probe firings and via deliberately malformed hook JSON producing zero parse errors. `--agent-config`'s own strict parser separately rejects `hooks` as an unknown field, ruling out that path too. No headless attachment point exists in this build; interactive mode was not testable from this environment. Full evidence table: [`../../mcp-server/hooks/devin/README.md`](../../mcp-server/hooks/devin/README.md) §2.

`spec-gate-classify.mjs` is built, syntax-valid, and directly-invocation-tested with realistic payloads -- never claimed as live-fire-verified. Re-run the probe methodology before registering it against a future `devin` build.

## 3. CONTENTS

| File | Purpose | Status |
|------|---------|--------|
| `spec-gate-classify.mjs` | `UserPromptSubmit` hook. Runs `classifyIntent()` against each user turn and would surface the bounded Gate-3 question as `additionalContext`. | **Dormant** -- confirmed no `-p`-mode attachment point exists (see §2). |

## 4. CONSUMERS

- The project's `.devin/hooks.v1.json` wires `spec-gate-classify.mjs` to the `UserPromptSubmit` event. **Committed per operator direction** despite the confirmed dormancy above -- re-tested live after committing and still confirmed dormant, no different from before the file existed.

## 5. RELATED

- [`spec-gate-core.mjs`](../../lib/spec-gate/spec-gate-core.mjs): shared runtime-neutral policy this hook calls.
- [`runtime/hooks/claude`](../claude/README.md), [`runtime/hooks/codex`](../codex/README.md), [`runtime/hooks/cursor`](../cursor/README.md): sibling implementations for the other CLI transports.
- [`.opencode/specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md`](../../../../../specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md): ADR-001 and the full live-verification methodology.
