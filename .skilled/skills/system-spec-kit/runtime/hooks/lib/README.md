---
title: "Lib: Runtime-Neutral Hook Helpers"
description: "Shared, runtime-neutral code every hook adapter imports: the Gate-3 spec-gate policy core, repository-root resolution, and small ESM stdin/JSON helpers."
trigger_phrases:
  - "hooks lib"
  - "runtime neutral hook helpers"
  - "shared hook adapter code"
---

# Lib: Runtime-Neutral Hook Helpers

---

## 1. OVERVIEW

`hooks/lib/` holds the code every per-runtime hook adapter (`claude/`, `codex/`, `cursor/`, `devin/`, `pi/`) imports instead of duplicating. Nothing here knows which runtime called it.

Current state:

- `spec-gate/` is the Gate-3 policy core: `classifyIntent()` and `evaluateMutation()`, plus gate-state persistence, the warning log and the stale-state sweep.
- `workspace/` resolves the repository root that `spec-gate-core.mjs` anchors its state directory to.
- `completion-evidence-sentinel.cjs` is the completion-evidence policy core. When a turn ends with a completion claim it checks recorded artifacts only, through `check-completion.sh --json` or an `implementation-summary.md` stat, and returns an advisory decision. It never runs a test, a build or `validate.sh`, never writes stdout or stderr itself, keeps the dedup state every adapter shares, and fails open.
- `hook-adapter-shared.mjs` is a small stdin-and-JSON helper pair. Its `readStdin()` settles when stdin ends or after 3000 ms, whichever comes first, so a host that never closes stdin cannot hold a hook open. Every plain `.mjs` and `.cjs` adapter in this skill reads stdin through it. The compiled TypeScript adapters use `../shared-stdin.ts`, which keeps the same deadline.
- Everything here is direct-run `.mjs` with no build step; only the `claude/`, `codex/`, `cursor/`, `devin/` and `pi/` adapters that call in are TypeScript compiled to `dist/`.

---

## 2. DIRECTORY TREE

```text
lib/
├── completion-evidence-sentinel.cjs  # Completion-evidence policy core behind every Stop-equivalent adapter
├── hook-adapter-shared.mjs   # Deadline readStdin() + parseJsonFailOpen() for the plain .mjs and .cjs adapters
├── hook-stdin-deadline.test.mjs  # Proves every hook entry gives up at the stdin deadline
├── spec-gate/                # Gate-3 policy core (see spec-gate/README.md)
│   ├── README.md
│   └── spec-gate-core.mjs
└── workspace/                # Repository-root resolution (see workspace/README.md)
    └── repo-root.mjs
```

---

## 3. KEY FILES

| File or directory | Responsibility |
|---|---|
| `completion-evidence-sentinel.cjs` | Exports `detectCompletionClaim`, `evaluateCompletionEvidence`, `resolveSentinelPaths`, `appendAdvisoryLog` and `sweepStaleSentinelState`. Called by the Stop adapters of `claude/`, `codex/` and `devin/`, Cursor's `completion-evidence-response.mjs`, Pi's `completion-evidence.ts` and the OpenCode plugin `.skilled/plugins/system-completion-sentinel.js`. Covered by `tests/completion-evidence-sentinel.vitest.ts` and `tests/hook-completion-evidence-stop.vitest.ts`. |
| `hook-adapter-shared.mjs` | `readStdin({ timeoutMs = 3000 })` collects a hook's stdin payload until the stream ends or the deadline passes, returns what arrived and releases stdin so the process can exit. `parseJsonFailOpen(raw)` parses it and returns `null` on any failure instead of throwing. Imported by the `spec-gate-classify.mjs` and `spec-gate-enforce.mjs` of `claude/`, `codex/`, `cursor/` and `devin/`, by `cursor/post-tool-use.mjs`, `cursor/spec-gate-prebind.mjs`, `cursor/completion-evidence-response.mjs` and `devin/permission-request-policy.mjs`, and loaded with a dynamic import by the three `completion-evidence-stop.cjs` adapters and `devin/post-compaction.cjs`. |
| `hook-stdin-deadline.test.mjs` | Spawns every hook entry with stdin held open and asserts each exits on its own at the deadline with its fail-open result, then pins the payload path of entries no other suite spawns. The compiled entries run from `dist/`, so build first. |
| `spec-gate/` | The runtime-neutral Gate-3 policy core; its test suite is `../../tests/hooks/spec-gate-core.test.mjs`. See [`spec-gate/README.md`](./spec-gate/README.md). |
| `workspace/` | Repository-root resolution used to anchor gate state to the real repo root regardless of the caller's working directory. See [`workspace/README.md`](./workspace/README.md). |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Direction | Runtime adapters (`claude/`, `codex/`, `cursor/`, `devin/`, `pi/`) import from `lib/`; nothing in `lib/` imports a runtime adapter. |
| Runtime neutrality | No file here branches on which runtime is calling it. Runtime-specific payload shapes are translated by the adapter before it reaches this code. |
| Policy ownership | Gate-3 decisions live only in `spec-gate/spec-gate-core.mjs`. An adapter that reimplements a decision here has drifted. |
| Fail-open | `parseJsonFailOpen` returns `null` rather than throwing; every caller treats that as an unreadable payload and approves. |

---

## 5. VALIDATION

Run from `.skilled/skills/system-spec-kit/runtime`.

```bash
node --check hooks/lib/hook-adapter-shared.mjs
node --check hooks/lib/completion-evidence-sentinel.cjs
node --check hooks/lib/workspace/repo-root.mjs
node --test tests/hooks/spec-gate-core.test.mjs
node --test hooks/lib/hook-stdin-deadline.test.mjs
```

Expected result: both files parse with no syntax errors, and the spec-gate core test suite passes under `node --test`. See [`spec-gate/README.md`](./spec-gate/README.md) for the full spec-gate validation matrix.

---

## 6. RELATED

- [`../README.md`](../README.md): the owning `hooks/` tree.
- [`spec-gate/README.md`](./spec-gate/README.md): the Gate-3 policy core in depth.
- [`workspace/README.md`](./workspace/README.md): repository-root resolution.
