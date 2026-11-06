---
title: "DSH Hooks: Spec-Gate, Completion and Session-Lifecycle Adapters"
description: "DeepSeek Harness adapters for Gate-3 spec-gate enforcement, completion evidence and session-lifecycle context, loaded through relative symlinks in .dsh/plugins/repo-guards/adapters/."
trigger_phrases:
  - "dsh spec gate"
  - "dsh session lifecycle"
  - "dsh completion evidence"
version: 1.0.0.0
---

# DSH Hooks: Spec-Gate, Completion and Session-Lifecycle Adapters

---

## 1. OVERVIEW

`hooks/dsh/` holds the real files behind this skill's links in `.dsh/plugins/repo-guards/adapters/`. The `repo-guards` bundle imports each adapter through its link. Node resolves a link to its real path before it resolves the file's own imports, so every relative import here is written for this folder, not for the bundle. The index links in `.skilled/hooks/spec-gate/dsh/`, `.skilled/hooks/completion/dsh/` and `.skilled/hooks/session-lifecycle/dsh/` point back at these files.

---

## 2. WHAT EACH ONE DOES AND INJECTS

| File | DSH event | Behavior | On error |
|---|---|---|---|
| `spec-gate-classify.mjs` | `agent/pre-step` | Runs the shared Gate-3 classifier on the operator's prompt and adds the deferral notice to the step. | Fails open |
| `spec-gate-enforce.mjs` | `tools/pre-execute` | Runs `evaluateMutation()` on a write, edit, patch or bash call and asks or denies by the shared core's verdict. | Fails closed |
| `completion-evidence.mjs` | `agent/turn-stopping` | Holds a completion claim in the ending reply to its evidence with the shared sentinel. Advisory only. | Fails open |
| `session-start-context.mjs` | `agent/created` | Injects `session-prime.js` output for a startup or resumed session. Exports `runSessionPrime` for the compaction adapter. | Fails open |
| `session-compact-context.mjs` | `session/event` (`compaction/end`) | Re-primes the agent after a completed compaction with session-prime's `compact` source. A failed compaction gets nothing. | Fails open |
| `session-start-advisories.mjs` | `agent/created` (`startup`) | Runs the warn-only session-start guards from this checkout and injects one notice with their warnings. Each guard answers to its own concern switch. | Fails open |
| `session-stop-context.mjs` | `agent/disposed` | Runs `session-stop.js` with the Stop payload Pi sends on quit. Injects nothing. | Fails open |

A fan-out leaf, marked by the lineage patch, skips the session-start guards and the stop autosave. Live follow and primary reconcile start background git work, and the autosave writes packet continuity, and a disposable child must own neither.

Exact injected strings and per-runtime visibility: [`injection-contract.md`](../../../../../hooks/injection-contract.md).

---

## 3. RELATED

- [`../lib/spec-gate/README.md`](../lib/spec-gate/README.md): the shared Gate-3 policy core the spec-gate adapters call.
- [`../pi/README.md`](../pi/README.md): the Pi extensions for the same concerns.
- [`../../../../../../.dsh/plugins/repo-guards/README.md`](../../../../../../.dsh/plugins/repo-guards/README.md): the bundle, its adapter links and its tests.
