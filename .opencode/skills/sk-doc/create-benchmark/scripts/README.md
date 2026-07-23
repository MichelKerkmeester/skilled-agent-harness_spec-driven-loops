---
title: "Create Benchmark Scripts: compiled-routing evidence capture"
description: "Node CLIs that capture a hub's live compiled-routing state and archive a Lane C benchmark report pair to a durable, fail-closed location."
---

# Create Benchmark Scripts

---

## 1. OVERVIEW

`create-benchmark/scripts/` owns the compiled-routing evidence tooling used by the `/create:benchmark` workflow. `render-serving-snapshot.cjs` joins a hub's flag state, activation manifest, fence epoch and parity anchors into one `serving-snapshot.json`. `archive-compiled-routing.cjs` builds on that snapshot to give a Lane C parity run report pair a durable, repo-relative home instead of a caller-supplied temp directory.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `render-serving-snapshot.cjs` | Captures, renders and optionally validates a hub's compiled-routing serving snapshot from the ACTIVE activation manifest. |
| `archive-compiled-routing.cjs` | Archives a compiled-routing Lane C report pair under `<hub>/benchmark/compiled-routing/<run-label>/`. Fails closed on an existing run-label or a shadow-candidate manifest source. |

## 3. VALIDATION

Run from the repository root.

```bash
node .opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs --hub <hubId> [--out <dir>] [--validate] [--pretty]
node .opencode/skills/sk-doc/create-benchmark/scripts/archive-compiled-routing.cjs --hub <hubId> --run-label <label> --report <report.json>
```

Expected result: `render-serving-snapshot.cjs` prints or writes a `serving-snapshot/V1` JSON document. `archive-compiled-routing.cjs` exits nonzero on a duplicate run-label, a stale manifest mid-archive or a shadow-candidate source.

## 4. RELATED

- [`SKILL.md`](../SKILL.md)
- [`README.md`](../README.md)
