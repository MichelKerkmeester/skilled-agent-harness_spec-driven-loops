---
title: "system-skilled-bots runtime"
description: "TypeScript runtime that checks, runs, queues, schedules and reports file-defined bots, with its own dependency root and Vitest suite."
trigger_phrases:
  - "system-skilled-bots runtime"
  - "bots runtime package"
  - "bots cli runtime"
---

# system-skilled-bots / runtime

---

## 1. OVERVIEW

The runtime holds every rule the bots hub applies. It parses a repository's BOT.md files and its bots config, runs one bot through a headless executor, queues run requests, installs launchd jobs and builds the status index. The modes under the hub and the front door CLI hold no rules of their own. They call into these modules.

The runtime is a self-contained dependency root. Its `package.json` names it `@skilled-bots/runtime` and declares `better-sqlite3`, `tsx` and `yaml` as dependencies with `vitest` for tests. Callers load the TypeScript modules through this folder's own `tsx`, so the modules run without a build step.

---

## 2. ARCHITECTURE

```text
┌──────────────────────┐      ┌──────────────────────────┐
│ bots CLI (front door)│      │ definition checker       │
│ verbs: run, enqueue, │      │ read-only BOT.md audit   │
│ drain, schedule ...  │      └────────────┬─────────────┘
└──────────┬───────────┘                   │
           │ tsx import of one module      │ tsx import
           ▼                               ▼
┌─────────────────────────────────────────────────────────┐
│ lib modules:   contracts, schedule, runner, queue,      │
│                installer, delivery, status              │
└──────────┬──────────────────────────────┬───────────────┘
           │                              │
           ▼                              ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│ system-deep-loop runtime │   │ user-level state root    │
│ executor audit, loop     │   │ and launchd agents folder│
│ lock, append gateway     │   │                          │
└──────────────────────────┘   └──────────────────────────┘
```

Dependency direction: callers import `lib/`. `lib/` imports the deep-loop runtime and one shared identity resolver. Nothing in `lib/` imports a caller.

---

## 3. DIRECTORY TREE

```text
runtime/
├── lib/                 # Domain modules, one concern per file
├── tests/               # Vitest suites, the post-commit hook harness and fixtures
│   └── fixtures/
├── package.json         # @skilled-bots/runtime manifest and scripts
├── package-lock.json
├── tsconfig.json        # Strict compile of lib/ and tests/
└── vitest.config.ts     # Collects the .vitest.ts files under tests/
```

The `node_modules/` folder is the installed dependency root and is not part of the source surface.

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `package.json` | Declares the dependency root and two scripts: `typecheck` runs the system-spec-kit `tsc` with `--noEmit`, and `test` runs `vitest run --no-coverage`. |
| `tsconfig.json` | Strict ES2022 settings over every TypeScript file in `lib/` and `tests/`. Type roots come from the system-spec-kit dependency root. |
| `vitest.config.ts` | Node environment, a 30 second test timeout and an include pattern that collects only the .vitest.ts files under `tests/`. |
| `package-lock.json` | Locks the dependency tree for reproducible installs. |

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `../../../bin/bots.cjs` | CLI | Front door. Parses one verb and its id, loads the needed `lib/` modules through this folder's `tsx` and maps run outcomes to exit codes 0 to 5. |
| `../scripts/bot-check.cjs` | CLI | Audits a checkout's bots folder with the same predicates the runner and installer use. It only reads. |
| `lib/runner.ts` | Module | `runBot` runs one bot once. Every verb that starts a run ends here. |
| `lib/request-drain.ts` | Module | `drainQueue` claims queued requests and routes each outcome. |
| `lib/installer.ts` | Module | The only module that writes a launchd job file or calls `launchctl`. |
| `lib/status.ts` | Module | `statusReport` joins the status index with install records and `launchctl print`. |

The domain grouping of every module is in [`lib/README.md`](lib/README.md).

---

## 6. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | `lib/` may import `../../system-deep-loop/runtime/lib/` (atomic state, executor config and audit, loop lock, append gateway) and `../../sk-code/shared/scripts/lib/repository-identity.cjs`. It never imports the CLI or the scripts. |
| State | Control state lives under a user-level state root outside every checkout. Only run evidence a child may read lives in the Skilled tree under the `.state` folder. |
| Scheduler | Only `lib/installer.ts` touches launchd. Status reads `launchctl print` through `lib/launchctl-print.ts` and never writes. |
| Tests | Every suite works in temp folders with stub executors and a stand-in for `launchctl`. No test reaches a real model, a real scheduler or the operator's state root. |

---

## 7. VALIDATION

Run from the repository root.

```bash
cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck
```

Expected result: `tsc` prints nothing and exits 0.

```bash
cd .skilled/skills/system-skilled-bots/runtime && npm test
```

Expected result: Vitest reports every .vitest.ts file under `tests/` passed. The suite and the shell harness are described in [`tests/README.md`](tests/README.md).

---

## 8. RELATED

- [Skill README](../README.md)
- [Skill contract](../SKILL.md)
- [Runtime library](lib/README.md)
- [Runtime tests](tests/README.md)
- [Definition checker](../scripts/README.md)
