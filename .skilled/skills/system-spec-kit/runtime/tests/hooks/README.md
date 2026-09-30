---
title: "Hook Suites: Gate-3 and Permission Coverage"
description: "node:test suites for the per-runtime Gate-3 hook adapters and the shared policy core they call."
trigger_phrases:
  - "hook suites"
  - "spec gate tests"
  - "gate 3 hook coverage"
---

# Hook Suites: Gate-3 and Permission Coverage

---

## 1. OVERVIEW

`tests/hooks/` holds the `node:test` suites that exercise the Gate-3 hook adapters and the runtime-neutral policy core they call. Each suite is a standalone `.mjs` file that builds an isolated temp root, runs the code under test, and asserts the reply or the state file it wrote.

Current state:

- One suite imports the shared core directly. The others spawn a per-runtime hook as a child process and read its JSON stdout.
- Every suite creates its own temp root and its own environment, so no suite reads state written by another.
- Decisions are asserted through observable output only: the process exit status, the JSON envelope, and the gate state file under the temp root.
- Malformed input, missing session identity, disabled mode and child-session mode are covered as fail-open rows rather than as exceptions.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         tests/hooks SUITES                       │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────┐      ┌──────────────────────────┐
│ core suite         │ ───▶ │ imports the core module  │
│                    │      │ in process               │
└────────────────────┘      └──────────────────────────┘

┌────────────────────┐      ┌──────────────────────────┐
│ adapter suites     │ ───▶ │ spawn the hook and read  │
│                    │      │ its JSON stdout          │
└────────────────────┘      └──────────────────────────┘

Dependency direction: suite ───▶ hook adapter ───▶ lib/spec-gate ───▶ gate state file
```

---

## 3. FILES

The four adapter suites share the same row shape: fail-open input, disabled and child sessions, gate open, one advise at the first mutation, deny while the gate is open, allow once the gate is satisfied, and path field precedence.

| File | Responsibility |
|---|---|
| `spec-gate-core.test.mjs` | In-process coverage of the shared core: `classifyIntent()`, `evaluateMutation()`, `answerParse()`, `runEnforceGate()`, path and symlink resolution, the delivery suppression flag, and the once-per-session notice state. |
| `spec-gate-claude.test.mjs` | Spawns the Claude classify and enforce pair, and adds the `CLAUDE_PROJECT_DIR` fallback for a payload with no `cwd`. |
| `spec-gate-codex.test.mjs` | Same matrix for the Codex pair, and adds `apply_patch` patch-header resolution plus the `CODEX_PROJECT_DIR` fallback. |
| `spec-gate-devin.test.mjs` | Same matrix for the Devin pair, and adds whitespace-only `cwd` handling plus the `DEVIN_PROJECT_DIR` fallback. |
| `spec-gate-prebind.test.mjs` | Cursor `SessionStart` prebind rows: a declared folder satisfies the gate, a declaration outside the tree never does, terminal state survives repeated startup, a padded session id is kept verbatim, and the consumer reads the same state key. |
| `permission-request-policy.test.mjs` | Devin `PermissionRequest` decision matrix: allow and deny rows for write and exec, unclassifiable tools, malformed input, and missing identity. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | A suite imports `../../hooks/lib/spec-gate/spec-gate-core.mjs` and the Node standard library. It reaches no production module outside the hook tree. |
| Fixtures | Each suite builds its own temp root with `mkdtempSync` and removes it in a `finally` block. There is no shared fixture folder. |
| Process boundary | Adapter rows spawn the real hook script with `spawnSync(process.execPath, ...)` and a JSON payload on stdin, then assert the exit status and the stdout envelope. |
| Environment | `isolatedEnv()` deletes `SYSTEM_SPEC_FOLDER` and the gate flags before each spawn, so the host environment cannot change a result. |
| Fail-open | A missing or malformed payload resolves to allow, and a session that never opens a gate writes no state. Both are asserted, not assumed. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ node --test tests/hooks/*.test.mjs       │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Suite builds an isolated temp root and   │
│ writes a bindable folder fixture         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Suite calls the core directly, or spawns │
│ the hook with a JSON payload on stdin    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Hook adapter parses the payload and      │
│ calls lib/spec-gate/spec-gate-core.mjs   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Gate state is read and written under the │
│ temp root. The suite asserts the reply   │
└──────────────────────────────────────────┘
```

---

## 5. VALIDATION

Run from `.skilled/skills/system-spec-kit/runtime`.

```bash
node --test tests/hooks/*.test.mjs
node --experimental-test-module-mocks --test tests/hooks/spec-gate-core.test.mjs
```

The core suite holds a handful of rows that mock an ESM module through `t.mock.module()`. Those rows self-skip unless the process started with `--experimental-test-module-mocks`, so the second command is what covers them. The same suite imports the compiled Gate-3 classifier at `shared/dist/gate-3-classifier.js`, which needs the shared build in place.

Expected result: every suite exits 0 with no assertion failures.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../../hooks/README.md`](../../hooks/README.md)
- [`../../hooks/lib/spec-gate/README.md`](../../hooks/lib/spec-gate/README.md)
- [`../../hooks/devin/README.md`](../../hooks/devin/README.md)
