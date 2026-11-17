---
title: "DSH Overlay Guard: tools/pre-execute Adapter"
description: "DSH adapter that denies a write, edit or apply_patch touching a file a vendored tree's overlay owns, loaded through the repo-guards bundle."
trigger_phrases:
  - "dsh overlay guard"
  - "dsh pre execute deny"
  - "overlay owned file dsh"
version: 1.0.0.0
---

# DSH Overlay Guard: tools/pre-execute Adapter

---

## 1. OVERVIEW

`.skilled/hooks/overlay-guard/dsh/` holds the DSH adapter for the overlay guard. It runs at `tools/pre-execute`. A `write` or `edit` call is judged by the file it names. An `apply_patch` body is judged by every path in its headers. A file an overlay owns returns `{ kind: 'deny', reason }`. The reason is the engine's refusal text. Every other call passes to the next handler. The adapter prints nothing itself.

DSH loads the adapter through the `repo-guards` bundle. `.dsh/patches/guards.patch.yml` inserts the plugin from `.dsh/plugins/repo-guards/index.mjs`. That file calls `registerOverlayGuard`. The bundle reaches this folder through `.dsh/plugins/repo-guards/adapters/overlay-guard.mjs`, a relative link to `overlay-guard.mjs`. The adapter registers itself with `ctx.on('tools/pre-execute', ...)`. The registration carries no matcher and no timeout. It adds no fallback around the call. Every other runtime folder beside this one holds its own adapter.

The adapter checks `isHookEnabled('overlay-guard')` before it registers a handler. A disabled concern returns with nothing on the event, so the adapter never sees a call. When the concern is on, it reads `exec.name` and then `exec.arguments`. A tool it does not judge and a call that names no path both pass to the next handler at once. The session directory comes from `exec.agent.session.header.cwd`, with `process.cwd()` as the fallback.

The concern key is `overlay-guard`. Its switch is `SYSTEM_OVERLAY_GUARD_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch, because both resolve through `.skilled/hooks/shared/hook-flags.mjs`. Every failure allows the write. A core throw logs one `repo-guards overlay-guard:` warning through the plugin logger and then calls `next()`. A logger that throws is swallowed, so logging never changes the decision. Notes the core attaches to an allowed write reach the same logger, one line each.

---

## 2. DIRECTORY TREE

```text
dsh/
+-- README.md
`-- overlay-guard.mjs
```

| File | Responsibility |
|---|---|
| `overlay-guard.mjs` | The adapter. It checks the concern switch, then judges the file a `write` or `edit` names and every path in an `apply_patch` body. A patch body comes from `arguments.patch`, falling back to `arguments.input`. |

The folder is flat and holds no test of its own. The module exports `registerOverlayGuard` for the bundle and `ERROR_POLICY` set to `fail-open`. The suite that drives the adapter lives in `.skilled/hooks/overlay-guard/tests/dsh-overlay-guard.test.mjs`.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/tests/dsh-overlay-guard.test.mjs
```

Expected result: every test passes and the command exits 0. The cases assert the deny reason and the session directory. Another reads every path an `apply_patch` body names. The rest cover a tool the adapter does not judge and a disabled concern with no handler. The last two cover the fail-open throw with its single log line and the notes on an allowed write.

---

## 4. RELATED

- [the overlay guard concern](../README.md): its switch table and runtime coverage.
- [the shared core](../lib/overlay-guard.cjs): the policy that judges each path.
- [the switch resolver facade](../../shared/hook-flags.mjs): the module behind `isHookEnabled`.
- [the adapter suite](../tests/dsh-overlay-guard.test.mjs): the cases that drive this file.
- [the repo-guards bundle](../../../../.dsh/plugins/repo-guards/index.mjs): the file that calls `registerOverlayGuard`.
- [the bundle's adapter link](../../../../.dsh/plugins/repo-guards/adapters/overlay-guard.mjs): the relative link to this folder's adapter.
- [the guards patch](../../../../.dsh/patches/guards.patch.yml): the patch that inserts the bundle.
