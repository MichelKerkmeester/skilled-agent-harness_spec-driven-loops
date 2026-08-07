---
title: "Phase 013: Launcher lease acquisition-time reclaim scaffold"
description: "Documented the planned acquisition-time stale-lease reclaim packet for skill-advisor daemon leases. The packet identifies the atomic CAS gap, target files and race regression, but no runtime implementation shipped in this phase."
trigger_phrases:
  - "launcher lease acquisition reclaim"
  - "stale skill graph daemon lease"
  - "skill_graph_daemon_lease CAS"
  - "two launcher stale lease race"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

This phase created the Level 1 scaffold for acquisition-time stale-lease reclaim. The artifacts correct the phase 011 framing: the existing read-path dead-PID probe was already present, while the remaining gap is an atomic acquisition-time reclaim when two launchers race on the same stale `skill_graph_daemon_lease` row. No source implementation shipped in this phase.

### Added

- Planned packet documentation for atomic stale-row reclaim in the skill-advisor daemon lease path.
- Targeted scope for a two-contender stale lease regression where exactly one launcher wins and the loser observes a clean contention result.
- Canonical packet metadata files for continuity and graph traversal.

### Changed

- Reframed the launcher-lease follow-up away from another read-path probe and toward acquisition-time compare-and-swap semantics.
- Identified the planned implementation and test anchors in `lease.ts`, `lease-acquisition-reclaim.vitest.ts` and daemon lease fixtures.

### Fixed

- None. This phase is a pre-implementation scaffold and does not change runtime lease behavior.

### Verification

| Check | Result |
|-------|--------|
| `nested-changelog.js --json` draft | Ran and returned a scaffold-only draft with no shipped implementation recorded |
| Packet artifacts | `spec.md`, `tasks.md` and `implementation-summary.md` all mark the work as planned or pre-implementation |
| Runtime verification | No runtime verification recorded because no lease code changed |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim/spec.md` | Added | Defined the stale lease acquisition problem, scope, target files and acceptance scenarios. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim/tasks.md` | Added | Listed open setup, implementation and verification tasks for the future CAS-style reclaim work. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim/implementation-summary.md` | Added | Recorded that the packet is a scaffold and that no runtime source code shipped. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim/description.json` | Added | Added memory-search metadata for the planned packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim/graph-metadata.json` | Added | Added graph metadata for packet traversal. |

### Follow-Ups

- Implement atomic acquisition-time stale lease reclaim in `acquireSkillGraphLease()`.
- Add the two-launcher stale-row regression and preserve the existing live-owner and EPERM protections.
