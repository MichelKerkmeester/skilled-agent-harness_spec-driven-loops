---
title: "MCP Daemon Reliability Phase 003: Root-Cause Investigation and Fix Roadmap"
description: "Research packet that root-caused the four independent defects behind recurring mk-spec-memory and mk_code_index daemon failures (OOM, no auto-restart, bridge-to-dead-socket, rebuild crash) and produced a ranked, adversarially hardened fix roadmap. No runtime code changed. Fixes are specified here and land in follow-on phases."
trigger_phrases:
  - "daemon reliability research changelog"
  - "mcp daemon oom root cause"
  - "mk-spec-memory disconnect investigation"
  - "daemon durable fix roadmap"
  - "invalidateProviderSingleton dispose missing"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/003-daemon-reliability-research` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The mk-spec-memory and mk_code_index MCP daemons were dying and disconnecting throughout sessions, forcing constant manual `/mcp` reconnects. The failures were not one bug but four independent defects.

(RC-1) Native ONNX/ORT model memory grows to 1-2 GB RSS in the forked sidecar process and is never released. `invalidateProviderSingleton()` nulls the old provider without calling `.dispose()`, leaving native memory stranded on every provider swap. (RC-2) The launcher clears its lease and exits on daemon death with no auto-restart logic. (RC-3) The IPC bridge reconnects whenever the socket file exists using `existsSync` with no liveness probe, so a SIGKILL or OOM leaves a stale socket and the reconnect "succeeds" into nothing. (RC-4) The build deletes `dist/` in place while the running daemon and forked sidecar still read from it.

A hybrid investigation ran five read-only sub-agents in parallel, one per failure facet, then ran two Opus adversarial convergence iterations. The convergence passes found flaws in the first-pass roadmap: RC-1's memory lives in the sidecar (not the daemon singleton), transparent daemon respawn breaks the MCP `initialize` session. RC-5 (IPC per-connection leak) is refuted and F5 should not be built. The hardened, re-sequenced fix roadmap is in `research/research.md` §6.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

- Top-3 root-cause claims verified by direct file read: PASS. No `.dispose()` call in `invalidateProviderSingleton`. `existsSync`-only bridge with no liveness check. `dist/` deleted in place during build.
- Iter 2-3 adversarial convergence (4 Opus skeptics): PASS. All 4 verdicts `designHoldsUp:false`. Corrected RC-1 scope to sidecar process, refuted RC-5, hardened F1/F2/F3.
- Cross-agent consistency check: PASS. No contradictions across five parallel facet agents. JS-cache-leak hypothesis ruled out by all agents.
- Spec validation (`validate.sh --strict`): PASS
- Synthesis document: `research/research.md` containing full RC-1 through RC-5 analysis with file:line evidence and ranked F1-F6 hardened fix roadmap

### Files Changed

| File | What changed |
|------|--------------|
| `research/research.md` (NEW) | Full root-cause analysis (RC-1 through RC-5) with file:line evidence and ranked durable fixes (F1 through F6), hardened by two Opus adversarial convergence iterations |
| `research/iterations/` (NEW) | Deep-research iteration documents covering parallel fan-out (iter 1) and adversarial convergence (iters 2-3) |
| Packet docs (NEW) | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` framing the investigation scope and roadmap |

### Follow-Ups

- Implement F2: add `.dispose()` call in `invalidateProviderSingleton` to release native ONNX memory on provider swap (`shared/embeddings.ts`, `hf-local.ts`)
- Implement F1: add RSS watchdog with supervised respawn to the launcher, recording child pid in the lease to prevent split-brain with F3 (`mk-spec-memory-launcher.cjs`)
- Implement F3: replace `existsSync` bridge check with a liveness probe that reaps stale sockets and respawns on a dead socket (`launcher-ipc-bridge.cjs`)
- Implement F4: build to a temp directory and use atomic rename to replace `dist/`, eliminating rebuild-while-running crashes
- Confirm RC-5 (IPC per-connection leak) with a reconnect-churn RSS trace before investing in F5. The adversarial pass refuted the original claim but a trace would close the question definitively.
