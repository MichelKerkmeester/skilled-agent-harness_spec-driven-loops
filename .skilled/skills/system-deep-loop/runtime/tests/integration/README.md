---
title: "runtime integration tests"
description: "Integration coverage for runtime scripts, graph queries, review depth and pivot recovery."
trigger_phrases:
  - "runtime integration tests"
  - "deep-loop integration suite"
---

# Integration Tests

---

## 1. OVERVIEW

This folder exercises the runtime across process, database and artifact boundaries. The suite invokes CLI scripts, seeds graph fixtures, checks review-depth projections and verifies divergent-pivot transaction recovery.

It also covers how the tsx relaunch forwards stdin, how `convergence.cjs` records a blocked stop through the append gateway, how a deep-research fan-out settles through the gateway after the authority flip and how a review stop path replays end to end.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `bootstrap-stdin.vitest.ts` | Checks that the tsx bootstrap reports a bad loop type without reading an open stdin, while `upsert.cjs` still reads `--events -` from stdin. |
| `cli-stdin-forwarding.vitest.ts` | Checks `readStdinSync` and `upsert.cjs` stdin forwarding, so the relaunch reads stdin only when asked and survives `EAGAIN`. |
| `convergence-blocked-stop.vitest.ts` | Checks that `convergence.cjs --record-blocked-stop` records a research blocked stop once per run and names the iterations without graph findings. |
| `convergence-review-blocked-stop.vitest.ts` | Checks that `convergence.cjs --record-blocked-stop` records a review blocked stop once per run and blocker set, on a full, empty or unreadable graph. |
| `convergence-script.vitest.ts` | Invokes the convergence CLI and checks typed graph decisions. |
| `deep-research-postflip-fanout.vitest.ts` | Checks that a deep-research fan-out settles every leaf through the gateway after the registry flip, and that the guard stays inert while the authority root is unflipped. |
| `divergent-pivot.vitest.ts` | Checks pivot transaction prepare, finalize, quorum and seat-resume recovery. |
| `query-script.vitest.ts` | Invokes the query CLI and checks returned graph data. |
| `review-depth-convergence.vitest.ts` | Checks review convergence signals across graph depth. |
| `review-depth-graph.vitest.ts` | Checks review node-kind and graph projection behavior. |
| `review-depth-validator.vitest.ts` | Checks review-depth validation fixtures and rejection paths. |
| `review-stop-path-replay.vitest.ts` | Replays the review stop path end to end: the stop decision, the terminal gates it records and the reducer that derives the dashboard verdict. |
| `status-script.vitest.ts` | Invokes the status CLI and checks reported graph health. |
| `upsert-script.vitest.ts` | Invokes the upsert CLI and checks durable graph writes. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Script integration | Convergence, query, status and upsert command boundaries |
| Graph integration | Review-depth projections |
| Recovery integration | Divergent-pivot transaction and seat-resume behavior |
| Stdin integration | The tsx relaunch and `upsert.cjs` stdin forwarding |
| Stop integration | Blocked-stop records from `convergence.cjs` and the review stop path replay |
| Fan-out integration | Deep-research post-flip fan-out through the append gateway |

The files are executable integration checks. Their public contract is the runtime command and database boundary they exercise.

---

## 4. SPINE ROLE

Integration tests follow evidence from command input through graph storage, projection and recovery. They verify that process boundaries preserve the same durable contracts as direct module calls.

---

## 5. VALIDATION

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts tests/integration
```

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Runtime scripts](../../scripts/README.md)
- [Runtime database](../../database/README.md)
