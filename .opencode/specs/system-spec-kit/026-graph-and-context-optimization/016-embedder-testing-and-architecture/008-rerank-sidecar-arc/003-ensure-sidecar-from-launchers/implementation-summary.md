---
title: "Implementation Summary: Ensure rerank sidecar from launchers [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub for the self-electing-primary launcher integration."
trigger_phrases:
  - "003 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Stub authored ahead of implementation"
    next_safe_action: "Begin Phase A audit"
    blockers: []
    completion_state: "pre-implementation"
---
# Implementation Summary: Ensure rerank sidecar from launchers

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: PRE-IMPLEMENTATION.**

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned (pre-implementation) |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 003 of 5 — launcher integration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

(to fill after implementation)

Planned shape:

- Shared `.opencode/bin/lib/ensure-rerank-sidecar.cjs` helper used by `mk-spec-memory-launcher.cjs`
- Python sibling `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` used by cocoindex's `cli.py`
- Both implement the same contract: probe → spawn detached → bounded warmup → degraded fallback
- Both launchers call their respective ensure function during startup, before reporting MCP-ready
- 4 runtime configs gain `RERANK_SIDECAR_PORT=8765` (env-configurable)
- Result: cold start of either MCP spawns the sidecar exactly once; parallel cold starts race-bind cleanly; sidecar survives launcher restarts; sidecar absence degrades gracefully to positional fallback
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

(to fill after implementation)

Planned shape:

- Phase A: audit both launcher chains (Node side + Python side); confirm async-friendliness
- Phase B: dual implementation (Node + Python) following a single documented contract; co-located in `system-rerank-sidecar/scripts/` for discoverability
- Phase C: wire both launchers; update 4 runtime configs; vitest + 5-scenario smoke + strict validate

The work spans two language ecosystems (Node for spec-memory, Python for cocoindex) but is unified by an explicit shared contract documented in `system-rerank-sidecar/SKILL.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (planned): Dual implementation (Node + Python) over a single wrapper script
**Decision:** Maintain two implementations of the ensure logic — `.cjs` for spec-memory, `.py` for cocoindex. Co-located in the sidecar skill's `scripts/` dir.
**Rationale:** Wrapping cocoindex's `ccc` invocation in a shell script breaks the direct binary reference in `opencode.json`. Calling out to a Node helper from Python adds startup latency. Two implementations are small enough (~80 LOC each) that maintaining them in lockstep is cheap; the contract is the spec.

### D-002 (planned): Detached spawn (`unref()`) instead of child-process tracking
**Decision:** Spawn the sidecar with `detached: true` + `child.unref()`. No PID-file tracking.
**Rationale:** The sidecar lifecycle is independent of either launcher. We want it to survive launcher restarts (so the next launcher attaches as client). PID-file ownership semantics introduce a "who owns the kill" coordination problem that we'd rather avoid. Operators can `pkill -f rerank_sidecar` for explicit cleanup.

### D-003 (planned): Port-bind atomicity over file-based lease
**Decision:** Rely on OS-level port-bind EADDRINUSE as the atomicity primitive for the race between two simultaneous spawn attempts.
**Rationale:** Adding a file-based lease (mirroring the launcher-lease pattern from packet 010/012) would duplicate the OS's existing port-uniqueness guarantee. The race window between probe-not-healthy and spawn-success is small enough that the EADDRINUSE retry path is cleaner than a second concurrency primitive.

### D-004 (planned): Opt-out via `SPECKIT_CROSS_ENCODER=false`, not a new flag
**Decision:** Skip the probe-and-spawn dance entirely when `SPECKIT_CROSS_ENCODER` is explicitly disabled.
**Rationale:** Reuses an existing flag that operators already know about. Saves cold-start time for opted-out operators. Defaults to "ensure if possible" so the happy path is reranker-on.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

(to fill with actual command outputs after implementation)

Planned commands listed in `tasks.md` Phase 3 (T013-T024).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

(to refine after implementation)

Planned limitations:

1. **No PID-file tracking.** Operators must `pkill` manually for explicit cleanup of a stale sidecar.
2. **Two implementations of ensure logic.** Drift risk if the contract evolves.
3. **Cocoindex Python startup path must be sync at the ensure call.** If cocoindex's startup is async-only, we adapt with `asyncio.run(ensure_rerank_sidecar())`.
4. **`SPECKIT_CROSS_ENCODER=true` is the opt-in flag.** Without it, no sidecar is spawned. This is the right default (operators must explicitly opt in to the new infrastructure) but means the sidecar stays cold until the operator flips the flag.
5. **Sidecar logs go to `~/.cache/mk-reranker/sidecar.log`** — single file, no rotation. A future cleanup packet could add logrotate or stdlib rotation.
<!-- /ANCHOR:limitations -->
