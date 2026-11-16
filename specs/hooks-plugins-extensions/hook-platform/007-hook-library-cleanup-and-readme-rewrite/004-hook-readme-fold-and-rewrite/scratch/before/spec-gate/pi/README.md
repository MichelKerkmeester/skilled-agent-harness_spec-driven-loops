---
title: "Spec Gate Hooks: Pi Adapter Links"
description: "Relative links to the Pi Gate-3 classifier and enforcement extensions in system-spec-kit."
trigger_phrases:
  - "spec gate pi hook"
  - "pi gate 3 classifier"
  - "pi spec gate dialog"
version: 1.0.0.0
---

# Spec Gate Hooks: Pi Adapter Links

---

## 1. OVERVIEW

`pi/` holds the Pi links for the Spec Gate concern. Both files are relative symlinks to the real extensions in `system-spec-kit/runtime/hooks/pi/`, and `.pi/extensions/` holds one-line entry files that re-export those same files. Pi wires classify to `input` and enforce to `tool_call` on `bash`, `write` and `edit`. Pi is the one runtime that can ask the operator directly, so enforce opens a `ctx.ui.select` dialog at the first undelivered write or edit.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `spec-gate-classify.ts` | `input` | Link to `system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts`. Sanitizes the prompt, keys state through `resolveSessionKey` and adds the one-shot deferral only when `ctx.hasUI` is false. | Fails open. A session-file or core failure leaves the turn untouched. |
| `spec-gate-enforce.ts` | `tool_call` on `bash`, `write` and `edit` | Link to `system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts`. Opens the spec-folder dialog at the first in-gate write or edit, binds the answer and blocks that one call for a retry. Deny returns `block: true` with a reason. | Fails open. A cancelled dialog writes nothing and the call proceeds. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Spec Gate concern, its policy core and its delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`](../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs): the shared policy core both extensions call.
- [`../../../../.pi/extensions`](../../../../.pi/extensions): the Pi extension folder that loads them.
- [`../../../skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts`](../../../skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts): the extension suite for both Pi adapters.
