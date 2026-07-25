---
title: "Devin Hooks: Gate-3 spec-gate wiring for Devin CLI"
description: "Devin CLI UserPromptSubmit and PreToolUse hooks that call the shared spec-gate core, verified live under devin -p with the documented registration schema."
---

# Devin Hooks

---

## 1. OVERVIEW

`runtime/hooks/devin/` holds the Devin CLI side of the Gate-3 spec-folder discipline, mirroring `runtime/hooks/codex/`. `spec-gate-classify.mjs` (phase 004, `UserPromptSubmit`) and `spec-gate-enforce.mjs` (phase 008, `PreToolUse`) both call into `runtime/lib/spec-gate/spec-gate-core.mjs` as a fourth consumer alongside the Claude hook, the OpenCode plugin, and the Codex hook, so the core never changes for a new runtime. Both entrypoints fail open: a missing or invalid stdin payload always resolves to approve.

**`spec-gate-enforce.mjs` was added by phase 008, not phase 004.** Phase 004's own scope explicitly started with `SessionStart`/`UserPromptSubmit` only, deferring `PreToolUse` enforcement to phase 008 alongside the other remaining lifecycle events. Phase 008's original 9-file matrix then itself omitted `spec-gate-enforce.mjs` -- a real gap the research had already scoped (§10, C-02/C-05/G-01) but that never made it into the file list -- caught and closed during phase 008's implementation.

## 2. STATUS: LIVE

Live-probed 2026-07-24 against `devin 3000.2.17`. `spec-gate-classify.mjs` delivered Gate-3 context on `UserPromptSubmit`, and `spec-gate-enforce.mjs` ran on observed `PreToolUse` events. The registration must use top-level event arrays with nested matcher groups; the earlier wrapper shape was silently discarded. Full evidence: [`../../mcp-server/hooks/devin/README.md`](../../mcp-server/hooks/devin/README.md) section 2.

Both adapters are syntax-valid, directly tested and live-fire verified for observed tool paths. The deny branch remains structurally verified because no block-severity fixture exists for an end-to-end denial.

## 3. CONTENTS

| File | Purpose | Status |
|------|---------|--------|
| `spec-gate-classify.mjs` | `UserPromptSubmit` hook. Runs `classifyIntent()` and surfaces the bounded Gate-3 question as `additionalContext`. | **Live** - model-visible context observed. |
| `spec-gate-enforce.mjs` | `PreToolUse(^exec$\|^edit$)` hook. Calls `evaluateMutation()` directly; deny emits `permissionDecision: "deny"`, advise adds context. Confirmed payload fields retain compatibility fallbacks. | **Live for observed tool paths** - deny branch remains unobserved end to end. |

## 4. CONSUMERS

- The project's `.devin/hooks.v1.json` wires `spec-gate-classify.mjs` to `UserPromptSubmit` and `spec-gate-enforce.mjs` to `PreToolUse` (`^exec$`, `^edit$` matchers). Both event categories fired with the corrected schema.

## 5. RELATED

- [`spec-gate-core.mjs`](../../lib/spec-gate/spec-gate-core.mjs): shared runtime-neutral policy both hooks call.
- [`runtime/hooks/claude`](../claude/README.md), [`runtime/hooks/codex`](../codex/README.md), [`runtime/hooks/cursor`](../cursor/README.md): sibling implementations for the other CLI transports.
- [`.opencode/specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md`](../../../../../specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md): ADR-001 and the full live-verification methodology.
- [`.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/decision-record.md`](../../../../../specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/decision-record.md): ADR covering `spec-gate-enforce.mjs`.
