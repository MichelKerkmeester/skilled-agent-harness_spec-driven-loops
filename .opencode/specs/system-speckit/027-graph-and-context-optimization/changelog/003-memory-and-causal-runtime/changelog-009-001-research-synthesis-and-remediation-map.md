---
title: "Memory Leak Remediation Phase 001: Research Synthesis and Remediation Map"
description: "Consolidated remediation map and source evidence index produced from two prior research packets. Full 020 and 024 research archives recovered into a phase-local canonical archive. Old source packet folders deleted after validation."
trigger_phrases:
  - "memory leak remediation map"
  - "research synthesis remediation"
  - "source evidence index 020 024"
  - "memory leak phase 001"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Two prior research packets (020 and 024) had identified overlapping process, sidecar, daemon, lock and host-memory hazards in the spec-kit and code-index stacks, but their findings were scattered across two separate locations with no normalized backlog. Without one authoritative remediation map, implementation phases risked duplicating work or fixing symptoms before ownership and telemetry were established.

Phase 001 produced `research/remediation-map.md` and `research/source-evidence-index.md`, recovering the full 020 and 024 research archives into a single phase-local canonical location under `research/source-research/`. The old source packet folders were deleted after validation. All Level 3 docs were created and strict spec validation passed. Phase 002 was named as the required next step before any runtime cleanup begins.

### Added

- `research/remediation-map.md` (NEW): normalized matrix of findings from packets 020 and 024 with work items, severity, target phases, dependencies and verification gates
- `research/source-evidence-index.md` (NEW): cross-packet overlap inventory covering process containment, sidecars, lock/state, host-memory telemetry and retention cleanup with citation rules
- `research/source-research/020-cli-process-memory-leak-deep-research/` (NEW): full original 020 research archive including iteration narratives, JSONL deltas, prompts/logs, reducer state, dashboards, findings registries and packet-level docs
- `research/source-research/024-cli-deep-research-memory-leak-audit/` (NEW): full original 024 research archive with the same artifact set
- `checklist.md` (NEW): Level 3 verification checklist for the archive and synthesis
- `decision-record.md` (NEW): ADRs covering consolidation, archive ownership, deletion and next-phase sequencing
- `resource-map.md` (NEW): file ledger for phase 001 and all recovered source archives

### Changed

- Phase promoted from Level 1 to Level 3 to accommodate the full source archive, checklist, decision record and resource map
- Parent arc graph metadata updated to reflect phase 001 as the canonical evidence location after source packet deletion

### Fixed

- Prior research artifacts were split across two standalone source packets with no normalized backlog. The consolidated remediation map resolves the ordering ambiguity and assigns ownership to phases 002 through 010.
- Old `020-cli-process-memory-leak-deep-research` and `024-cli-deep-research-memory-leak-audit` packet folders left stale evidence surfaces after archive recovery. Both were removed after validation.

### Verification

| Check | Result |
|-------|--------|
| Phase 001 strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` on the phase 001 folder |
| Parent arc strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` on `009-memory-leak-remediation` |
| Affected stack parent validation | Passed for `002-spec-memory-stack`, `004-code-index-stack` and umbrella `013-embedder-testing-and-architecture` |
| Old source packet deletion | Complete: old `020` and `024` packet folders removed after archive recovery |
| Runtime/code changes | Not applicable. Docs-only synthesis phase. |
| Memory/process telemetry | Deferred to phase 002 by design. |

### Files Changed

| File | What changed |
|------|--------------|
| `research/remediation-map.md` (NEW) | Consolidated remediation matrix with work items, dependencies, target phases and verification gates |
| `research/source-evidence-index.md` (NEW) | Cross-packet evidence inventory with citation rules for phase-local archive paths |
| `research/source-research/020-cli-process-memory-leak-deep-research/` (NEW) | Recovered 020 archive: iterations, JSONL deltas, reducer state, dashboards, findings registry, packet docs |
| `research/source-research/024-cli-deep-research-memory-leak-audit/` (NEW) | Recovered 024 archive: same artifact set as 020 |
| `checklist.md` (NEW) | Level 3 verification checklist |
| `decision-record.md` (NEW) | ADRs for consolidation, deletion and sequencing |
| `resource-map.md` (NEW) | File ledger for the full phase 001 artifact set |

### Follow-Ups

- Build the phase 002 telemetry and process verification harness before making any runtime cleanup or memory-relief claims.
- Adapter and sidecar resident-memory severity must not escalate without successful-search or fallback RSS benchmarks from the harness.
