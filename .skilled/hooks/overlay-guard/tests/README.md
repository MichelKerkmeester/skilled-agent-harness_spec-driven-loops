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

`tests/` holds the checks for the overlay adapters that need more than the core suite in `lib/`. Both suites run under `node --test`.

The DSH suite drives `registerOverlayGuard()` with a fake plugin context and a stubbed core. It asserts the handler result and the arguments the core received.

The OpenCode suite runs the real plugin from a copy inside a vendored fixture tree. That tree carries a real manifest and the real engine. The refusal it matches is the line an agent receives.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-overlay-guard.test.mjs` | Asserts the DSH adapter's decisions against a stubbed core. |
| `opencode-overlay-guard.test.mjs` | Asserts the real OpenCode plugin's refusals inside a vendored fixture tree. |

The DSH suite asserts a deny for an owned path. It also asserts that every `*** Add File:` and `*** Update File:` path in an `apply_patch` body is judged. A non-write tool is ignored and the kill switch registers nothing. A core throw fails open and logs one line. Allowed writes log the core's notes.

The OpenCode suite asserts a refusal for an overlay-owned path. With `strictWrites` on it asserts a refusal for a new unowned file under `.skilled`. An `apply_patch` body naming an overlay-owned file is refused.

The suite allows a path outside every vendored root and a tool that writes no file. A tree with no overlay manifest takes the fast exit. A patch body naming only a path outside every vendored root is allowed. A write whose content merely looks like a patch is allowed. An unreadable manifest allows the write and logs the reason once.

---

## 3. VALIDATION

```bash
node --test .skilled/hooks/overlay-guard/tests/
```

Expected result: both suites pass.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../dsh/overlay-guard.mjs`](../dsh/overlay-guard.mjs): the DSH adapter under test.
- [`../opencode/overlay-guard.js`](../opencode/overlay-guard.js): the link to the OpenCode plugin under test.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core the DSH suite stubs.
