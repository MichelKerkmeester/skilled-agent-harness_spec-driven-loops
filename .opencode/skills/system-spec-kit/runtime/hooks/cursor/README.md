---
title: "Cursor Hooks: Gate-3 spec-gate wiring for Cursor CLI"
description: "Cursor CLI spec-gate adapters for session-start prebinding, pre-tool enforcement, and registered-but-undelivered prompt classification."
---

# Cursor Hooks

---

## 1. OVERVIEW

`runtime/hooks/cursor/` holds Cursor's Gate-3 adapters. The startup prebind establishes state that Cursor's undelivered prompt event cannot create, the pre-tool adapter consumes that state through the shared evaluator, and the prompt classifier remains registered for forward compatibility. Every entrypoint fails open.

Cursor's generic `preToolUse` event covers shell and file-write calls, so `spec-gate-enforce.mjs` is wired there. `beforeSubmitPrompt` remains registered but has not fired under the installed CLI; `spec-gate-prebind.mjs` therefore uses confirmed `sessionStart` delivery to satisfy a validated `MK_SPEC_FOLDER` or open state only when `MK_SPEC_GATE_ENFORCE=1` is explicitly set for an identifiable top-level session.

A dispatched/child session (`AI_SESSION_CHILD=1`) is a complete Gate-3 no-op enforced in the shared core (`spec-gate-core.mjs`): it never opens, reads, or writes gate state, never receives the question, and never denies or advises. Both spec-gate adapters resolve `workspace_roots[0]` only (like every other Cursor hook here), so multi-root Cursor workspaces are not enforced against secondary roots.

## 2. CONTENTS

| File | Purpose | Status |
|------|---------|--------|
| `spec-gate-prebind.mjs` | `sessionStart` hook. Validates an explicit folder or opens opt-in top-level enforcement state. | **Active** - process-tested; disabled, child, malformed, and missing-session cases write no state. |
| `spec-gate-enforce.mjs` | `preToolUse` hook. Maps Cursor's `Shell`/`Write` tool names onto the core's `bash`/`write` vocabulary, then runs `evaluateMutation()`. | **Active** — live-verified: the deny path (`{"permission":"deny"}` + exit 2) was confirmed to actually block a real `cursor-agent` tool call during phase 004's probe. |
| `spec-gate-classify.mjs` | `beforeSubmitPrompt` hook. Runs `classifyIntent()` against each user turn and would surface the bounded Gate-3 question as `agent_message`. | **Registered, delivery unconfirmed** - `beforeSubmitPrompt` did not fire under the tested CLI build. |

## 3. CONSUMERS

- `.cursor/hooks.json` wires `spec-gate-prebind.mjs` on `sessionStart`, `spec-gate-enforce.mjs` on `preToolUse`, and `spec-gate-classify.mjs` on `beforeSubmitPrompt`.
- `.cursor/hooks/` mirrors all three as discovery-only relative symlinks; runtime config continues to invoke their real paths.

## 4. WHY preToolUse INSTEAD OF beforeShellExecution

Codex's enforce hook maps `exec`/`apply_patch`/`edit` onto a single `PreToolUse` event because that is the only pre-mutation gate Codex exposes. Cursor exposes several narrower events (`beforeShellExecution`, `beforeReadFile`) alongside the generic `preToolUse`/`postToolUse` pair. Live probing confirmed `preToolUse` fires before every tool call, including `Write` (file mutations) — which `beforeShellExecution` alone would miss entirely, since that event only covers shell commands. Wiring the generic event gives broader, more Codex-equivalent coverage with one hook instead of stitching together `beforeShellExecution` + a (non-existent) "beforeWriteFile" event.

## 5. RELATED

- [`spec-gate-core.mjs`](../../lib/spec-gate/spec-gate-core.mjs): shared runtime-neutral policy both hooks call.
- [`runtime/hooks/claude`](../claude/README.md), [`runtime/hooks/codex`](../codex/README.md): sibling implementations for the other CLI transports.
- [`.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/decision-record.md`](../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/decision-record.md): ADR-001/ADR-002 and the full live-verification methodology and results.
