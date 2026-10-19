---
title: "tests: Fast Mode extension test suites"
description: "Vitest suites covering the Pi Fast Mode extension, one file per source concern under ../src."
trigger_phrases:
  - "fast mode extension tests"
  - "pi fast mode test suite"
---

# tests: Fast Mode extension test suites

`tests/` holds the Vitest suites for the extension. Each file targets one source concern under `../src`.

---

## 1. OVERVIEW

`tests/` owns the extension's automated coverage. Each file maps to one source module, from pure unit checks such as command parsing and config normalization to runtime behavior of the composed extension.

Current state:

- 7 files, 83 tests.
- Suites run against temporary directories and in-process fakes, so they touch no real Pi state.
- Coverage spans command parsing, config, the payload gate, status, toggle notifications, session-start precedence, handoff propagation, and the duplicate-install guard.

---

## 2. KEY FILES

| File | Covers |
|------|--------|
| `commands.test.ts` | `parseFastCommand` and `getFastCommandCompletions` from `../src/commands.ts`. |
| `config.test.ts` | `DEFAULT_CONFIG`, target and config normalization, scope selection, JSON IO, and one-time legacy migration from `../src/config.ts`. |
| `extension.test.ts` | `piFastModeExtension` registration, the duplicate-install guard, toggle notifications, indicator, and the startup flag from `../src/index.ts`. |
| `handoff.test.ts` | `readHandoff` and `writeHandoff` env-value handling from `../src/handoff.ts`. |
| `payload-status.test.ts` | Model matching, payload mutation (`../src/payload.ts`), and status behavior (`../src/status.ts`). |
| `precedence.test.ts` | The `session_start` resolution order: explicit `--fast`, then inherited env, then persisted config. |
| `propagation.test.ts` | Fast Mode preference propagating from a parent session to child processes. |

---

## 3. VALIDATION

Run from the repo root:

```bash
npm --prefix .pi/extensions/pi-fast-mode-w-subagent-support test
```

Expected output:

```text
Test Files  7 passed (7)
     Tests  83 passed (83)
```

Run a single file with `npx vitest run tests/config.test.ts` from inside the package.

---

## 4. RELATED

- `../src/README.md` for the source layout each suite targets.
- `../README.md` for install, usage, and the handoff contract.
