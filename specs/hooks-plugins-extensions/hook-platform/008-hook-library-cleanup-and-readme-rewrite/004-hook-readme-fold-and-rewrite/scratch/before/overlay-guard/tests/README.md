---
title: "Overlay Guard: Adapter Tests"
description: "node --test suites for the DSH and OpenCode overlay adapters, covering the deny path, patch path reading, the kill switch, note logging and the fail-open throw policy."
trigger_phrases:
  - "dsh overlay guard tests"
  - "overlay guard test"
  - "apply patch path test"
version: 1.0.1.0
---

# Overlay Guard: Adapter Tests

---

## 1. OVERVIEW

`tests/` holds the automated checks for the overlay adapters that need more than the core suite beside `lib/`. The DSH suite drives `registerOverlayGuard()` with a fake plugin context and a stubbed core, then asserts the handler result and the arguments the core received. The OpenCode suite runs the real plugin from a copy placed in a vendored fixture tree, with a real manifest and the real engine, so the refusal it matches is the line an agent receives. Both run under `node --test`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`dsh-overlay-guard.test.mjs`](./dsh-overlay-guard.test.mjs) | `node --test` suite | Asserts a deny for an owned path, that every `*** Add File:` and `*** Update File:` path in an `apply_patch` body is judged, that a non-write tool is ignored, that the kill switch registers nothing, that a core throw fails open with one log line, and that allowed writes log the core's notes. | Not applicable, the suite asserts behavior. |
| [`opencode-overlay-guard.test.mjs`](./opencode-overlay-guard.test.mjs) | `node --test` suite | Runs the real plugin in a vendored fixture tree, then asserts a refusal for an overlay-owned path, a strict-writes refusal for a new unowned file under `.skilled`, an allow for a path outside every vendored root, an allow for a tool that writes no file, the fast exit for a tree with no overlay manifest, a refusal when an `apply_patch` body names an overlay-owned file, an allow when a patch body names only a path outside every vendored root, an allow when a write's content merely looks like a patch, and one log line when the manifest cannot be read. | Not applicable, the suite asserts behavior. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../dsh/overlay-guard.mjs`](../dsh/overlay-guard.mjs): the DSH adapter under test.
- [`../opencode/overlay-guard.js`](../opencode/overlay-guard.js): the link to the OpenCode plugin under test.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core the suite stubs.
