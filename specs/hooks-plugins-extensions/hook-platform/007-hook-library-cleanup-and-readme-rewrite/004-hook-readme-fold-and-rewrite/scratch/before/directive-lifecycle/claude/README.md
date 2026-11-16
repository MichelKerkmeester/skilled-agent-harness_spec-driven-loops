---
title: "Claude Directive Lifecycle: Boundary Adapter Links"
description: "Two Claude boundary adapters, the canonical advisor adapter and the Spec-Kit bridge shim that spawns its compiled target."
trigger_phrases:
  - "claude directive lifecycle boundary"
  - "directive lifecycle bridge"
  - "speckit directive boundary"
version: 1.0.0.0
---

# Claude Directive Lifecycle: Boundary Adapter Links

---

## 1. OVERVIEW

`hooks/directive-lifecycle/claude/` holds two browsability symlinks for the directive lifecycle concern. Both advance durable per-session delivery state on a Claude host lifecycle event. Neither emits model-visible output.

The canonical adapter lives in `system-skill-advisor` and calls `advanceDirectiveLifecycleBoundary` against the file-backed store. The Spec-Kit bridge shim resolves that compiled target and spawns it. Edit the targets, not the links.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `directive-lifecycle-boundary.ts` | Symlink to [`../../../skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts`](../../../skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts) | Link only. The target reads bounded stdin JSON with `session_id` and `boundary`, checks the kill switch and advances the store's session epoch, or its generation when identity is missing. | Fails open. A missing identity or a store failure advances nothing and returns false. |
| `speckit-directive-lifecycle-boundary.ts` | Symlink to [`../../../skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts`](../../../skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts) | Link only. The target resolves the compiled canonical target, preferring `SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET`, and spawns it with a 500 ms timeout and `SIGKILL` on timeout. | Fails open. A missing target, a spawn failure, a timeout or a non-zero exit returns false. |

---

## 3. RELATED

- [`../README.md`](../README.md): the directive lifecycle concern, its decision rule and its switches.
- [`../../../skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts`](../../../skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts): the canonical adapter.
- [`../../../skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts`](../../../skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts): the bridge shim.
