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
- `hook-adapter-shared.mjs` is a small stdin-and-JSON helper pair used directly by the classify and enforce adapters that do not need the full spec-gate core themselves.
- Everything here is direct-run `.mjs` with no build step; only the `claude/`, `codex/`, `cursor/`, `devin/` and `pi/` adapters that call in are TypeScript compiled to `dist/`.

---

## 2. DIRECTORY TREE

```text
lib/
├── hook-adapter-shared.mjs   # readStdin() + parseJsonFailOpen() for classify/enforce adapters
├── spec-gate/                # Gate-3 policy core (see spec-gate/README.md)
│   ├── README.md
│   ├── spec-gate-core.mjs
│   └── spec-gate-core.test.mjs
└── workspace/                # Repository-root resolution (see workspace/README.md)
    └── repo-root.mjs
```

---

## 3. KEY FILES

| File or directory | Responsibility |
|---|---|
| `hook-adapter-shared.mjs` | `readStdin()` collects and decodes a hook's stdin payload; `parseJsonFailOpen(raw)` parses it and returns `null` on any failure instead of throwing. Imported by `claude/spec-gate-classify.mjs`, `codex/spec-gate-classify.mjs`, and the `spec-gate-enforce.mjs` of `claude/`, `codex/`, `cursor/` and `devin/`. |
| `spec-gate/` | The runtime-neutral Gate-3 policy core plus its co-located test suite. See [`spec-gate/README.md`](./spec-gate/README.md). |
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

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
node --check hooks/lib/hook-adapter-shared.mjs
node --check hooks/lib/workspace/repo-root.mjs
node --test hooks/lib/spec-gate/spec-gate-core.test.mjs
```

Expected result: both files parse with no syntax errors, and the spec-gate core test suite passes under `node --test`. See [`spec-gate/README.md`](./spec-gate/README.md) for the full spec-gate validation matrix.

---

## 6. RELATED

- [`../README.md`](../README.md): the owning `hooks/` tree.
- [`spec-gate/README.md`](./spec-gate/README.md): the Gate-3 policy core in depth.
- [`workspace/README.md`](./workspace/README.md): repository-root resolution.
