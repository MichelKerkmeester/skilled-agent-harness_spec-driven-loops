# Source Evidence Index

<!-- ANCHOR:source-evidence-index -->

## Purpose

This index records where the original research evidence now lives after relocation into `009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/`. Later phases should cite these moved paths rather than the old stack packet locations.

## Packet 020: CLI Process Memory Leak Deep Research

| Evidence Class | Relocated Path | Notes |
| --- | --- | --- |
| Final synthesis | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/research.md` | Nine-class taxonomy and ranked remediation backlog. |
| Iteration narratives | `.../source-research/020-cli-process-memory-leak-deep-research/research/iterations/iteration-001.md` through `iteration-010.md` | Process containment, lock/state, recursion, daemon classification, sidecar, in-process retention, and host-memory evidence. |
| Delta records | `.../source-research/020-cli-process-memory-leak-deep-research/research/deltas/iter-001.jsonl` through `iter-010.jsonl` | JSONL evidence records for the ten-iteration run. |
| Reducer and planning state | `.../source-research/020-cli-process-memory-leak-deep-research/research/deep-research-state.jsonl`, `deep-research-dashboard.md`, `deep-research-strategy.md`, `deep-research-config.json`, `findings-registry.json` | Used to verify run continuity and final synthesis inputs. |
| Original packet docs | `research/source-research/020-cli-process-memory-leak-deep-research/packet-docs/` | Preserved packet root docs before deleting the old packet folder. |

## Packet 024: CLI Deep Research Memory Leak Audit

| Evidence Class | Relocated Path | Notes |
| --- | --- | --- |
| Final synthesis | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/research.md` | Final P1/P2 findings, packet order, continuation readiness matrix, and downgrade notes. |
| Iteration narratives | `.../source-research/024-cli-deep-research-memory-leak-audit/research/iterations/iteration-001.md` through `iteration-015.md` | CocoIndex, Code Graph, rerank sidecar, daemon lifecycle, and measurement-validation passes. |
| Delta records | `.../source-research/024-cli-deep-research-memory-leak-audit/research/deltas/iter-001.jsonl` through `iter-015.jsonl` | JSONL evidence records for the fifteen-iteration run. |
| Logs and measurements | `.../source-research/024-cli-deep-research-memory-leak-audit/research/logs/` | Includes continuation executor logs and `iteration-007-runtime-measurement.json`. |
| Reducer and planning state | `.../source-research/024-cli-deep-research-memory-leak-audit/research/deep-research-state.jsonl`, `deep-research-dashboard.md`, `deep-research-strategy.md`, `deep-research-config.json`, `findings-registry.json`, `resource-map.md` | Used to verify 15-iteration completion and final ordering. |
| Original packet docs | `research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs/` | Preserved packet root docs before deleting the old packet folder. |

## Cross-Packet Overlap

| Overlap | Packet 020 Evidence | Packet 024 Evidence | Remediation Map Result |
| --- | --- | --- | --- |
| Process containment and process sweep | Shared CLI supervisor, recursion guards, expected-daemon classifier | `mcp-host-session-process-sweep`, detached daemons and helper inventory | Split into phases `003` and `005`; inventory precedes termination. |
| Sidecar lifecycle | Rerank/CocoIndex/embedder sidecars with detached ownership | Rerank sidecar lifecycle and adapter/fallback resident process evidence | Phase `008` owns sidecar/adapter lifecycle; destructive sweep waits for sidecar owner metadata. |
| Lock/state recovery | Stale locks, heartbeat/TTL, JSONL append recovery | Background task lifecycle and cancellation visibility | Phase `004` owns deep-loop state; phase `006` owns CocoIndex task/cancel state. |
| Host-memory telemetry | Swap, wired/MPS, Ollama, sidecars, and RSS preflight gap | Sandbox limits, Homebrew `ccc` collision, no successful-search growth proof | Phase `002` owns telemetry harness; memory severity escalation remains benchmark-gated. |
| Runtime retention | Leases, timers, caches, sessions, queues, retries, audit rotations | Registry embedder and adapter retention findings | Phase `009` owns Spec Kit Memory retention; phase `008` owns CocoIndex embedder/adapter retention. |

## Citation Rule For Later Phases

Later phases should cite the relocated source archive path plus the specific artifact name. If a later phase relies on a source packet summary, cite `research/source-research/<packet-slug>/research/research.md`; if it relies on iteration details, cite the specific `iteration-NNN.md` or `iter-NNN.jsonl` artifact.

<!-- /ANCHOR:source-evidence-index -->
