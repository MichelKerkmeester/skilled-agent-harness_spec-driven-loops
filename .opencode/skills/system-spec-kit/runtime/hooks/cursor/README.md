---
title: "Cursor Hooks: Gate-3 spec-gate wiring for Cursor CLI"
description: "Cursor CLI preToolUse hook that calls the shared spec-gate core to enforce the spec-folder gate; the classify hook exists but is dormant pending confirmed beforeSubmitPrompt delivery."
---

# Cursor Hooks

---

## 1. OVERVIEW

`runtime/hooks/cursor/` holds the Cursor CLI side of the Gate-3 spec-folder discipline, mirroring `runtime/hooks/claude/` and `runtime/hooks/codex/` for Cursor's tool vocabulary and event set. Both files call into `runtime/lib/spec-gate/spec-gate-core.mjs` as a fourth consumer alongside the Claude hook, the OpenCode plugin, and the Codex hook, so the core never changes for a new runtime. Every entrypoint fails open: a missing or invalid stdin payload always resolves to approve.

**Cursor's event set differs materially from Codex's**, confirmed by live probing (phase 004): Cursor has no distinct pre-write-file gate the way Codex's `apply_patch`-mapped `PreToolUse` does — the generic `preToolUse` event covers every tool call (`Shell`, `Read`, `Grep`, `Write`), so `spec-gate-enforce.mjs` is wired there instead of a shell-only event. `beforeSubmitPrompt` — the intended attachment point for the classify hook — is confirmed to never fire under the CLI, so `spec-gate-classify.mjs` exists as ready, documented, but dormant code.

## 2. CONTENTS

| File | Purpose | Status |
|------|---------|--------|
| `spec-gate-enforce.mjs` | `preToolUse` hook. Maps Cursor's `Shell`/`Write` tool names onto the core's `bash`/`write` vocabulary, then runs `evaluateMutation()`. | **Active** — live-verified: the deny path (`{"permission":"deny"}` + exit 2) was confirmed to actually block a real `cursor-agent` tool call during phase 004's probe. |
| `spec-gate-classify.mjs` | `beforeSubmitPrompt` hook. Runs `classifyIntent()` against each user turn and would surface the bounded Gate-3 question as `agent_message`. | **Dormant** — `beforeSubmitPrompt` confirmed to never fire under `cursor-agent 2026.07.23-e383d2b` across 3 separate live dispatches (including a `--continue` turn). Not registered in any `.cursor/hooks.json`. Re-verify against a future `cursor-agent` build before wiring. |

## 3. CONSUMERS

- A project `.cursor/hooks.json` would wire `spec-gate-enforce.mjs` to the `preToolUse` event. **This file has not been committed yet** (phase 004 built and live-verified the adapters but deferred the actual registration to a later, explicitly-approved step — see `mcp-server/hooks/cursor/README.md` §4).
- `spec-gate-classify.mjs` has no consumer today; it ships as forward-compatible, honestly-labeled dormant code.

## 4. WHY preToolUse INSTEAD OF beforeShellExecution

Codex's enforce hook maps `exec`/`apply_patch`/`edit` onto a single `PreToolUse` event because that is the only pre-mutation gate Codex exposes. Cursor exposes several narrower events (`beforeShellExecution`, `beforeReadFile`) alongside the generic `preToolUse`/`postToolUse` pair. Live probing confirmed `preToolUse` fires before every tool call, including `Write` (file mutations) — which `beforeShellExecution` alone would miss entirely, since that event only covers shell commands. Wiring the generic event gives broader, more Codex-equivalent coverage with one hook instead of stitching together `beforeShellExecution` + a (non-existent) "beforeWriteFile" event.

## 5. RELATED

- [`spec-gate-core.mjs`](../../lib/spec-gate/spec-gate-core.mjs): shared runtime-neutral policy both hooks call.
- [`runtime/hooks/claude`](../claude/README.md), [`runtime/hooks/codex`](../codex/README.md): sibling implementations for the other CLI transports.
- [`.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/decision-record.md`](../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/decision-record.md): ADR-001/ADR-002 and the full live-verification methodology and results.
