---
title: "Overlay Guard: DSH tools/pre-execute Adapter"
description: "DSH adapter that denies a write, edit or apply_patch touching a file a vendored tree's overlay owns, loaded through the repo-guards bundle."
trigger_phrases:
  - "dsh overlay guard"
  - "dsh pre execute deny"
  - "overlay owned file dsh"
version: 1.0.0.0
---

# Overlay Guard: DSH tools/pre-execute Adapter

---

## 1. OVERVIEW

`dsh/` holds the DSH adapter for the overlay guard. DSH loads it through `.dsh/plugins/repo-guards/adapters/overlay-guard.mjs`, a relative link to this file. The repo-guards bundle registers it on `tools/pre-execute` when the plugin loads.

The adapter judges `write`, `edit` and `apply_patch` calls and ignores every other tool. It resolves the target paths, then calls `evaluateWrite()` once with all of them. A path the engine owns returns `{kind: 'deny', reason}` with the engine's reason. The session directory comes from `exec.agent.session.header.cwd`, with `process.cwd()` as the fallback.

A core throw logs one warning through the plugin logger and lets the write continue. The adapter therefore fails open, and `ERROR_POLICY = 'fail-open'` states that choice. A logging failure never changes the write decision.

The `overlay-guard` concern gates it, and `SYSTEM_OVERLAY_GUARD_DISABLED=1` turns that concern off. Notes the core returns go to the plugin logger, one line each.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `overlay-guard.mjs` | Registers the `tools/pre-execute` handler and turns the core's answer into a deny or a pass. |

The handler runs only for the `write`, `edit` and `apply_patch` tools. For a file tool it reads the `file_path`, `filePath` or `path` field. For a patch it reads every file header in the body. A call that names no path passes straight through to the tool. The module exports `registerOverlayGuard` for the bundle and `ERROR_POLICY = 'fail-open'` for its policy.

---

## 3. VALIDATION

Run the command below from the repository root so the path resolves.

```bash
node --test .skilled/hooks/overlay-guard/tests/dsh-overlay-guard.test.mjs
```

Expected result: every test passes. The suite covers the deny, the patch path reading and the note logging. It also covers the kill switch and the fail-open throw.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core this adapter calls.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that loads this adapter.
- [`../tests/dsh-overlay-guard.test.mjs`](../tests/dsh-overlay-guard.test.mjs): the suite that exercises this adapter.
