---
title: "Changelog: Spec: 016/002/021 Hardcoded-Default Audit Deep-Research [002-spec-memory-stack/021-hardcoded-default-audit-deep-research]"
description: "Chronological changelog for the Spec: 016/002/021 Hardcoded-Default Audit Deep-Research phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/021-hardcoded-default-audit-deep-research` (Level unknown)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

Packet 020 found a class of bug: ADR-013/014 migrated the canonical spec-memory embedder to nomic-embed-text-v1.5, but 5 inline defaults in TypeScript code stayed pointing at pre-ADR models (4 × BAAI + 1 × jina). When the resolution chain's primary steps (env var → DB → cascade probe) didn't resolve, the runtime fell through to those stale strings and crashed. Triggered the 2026-05-23 production incident.

### Added

- Scaffolded a deep-research audit packet targeting the hardcoded-default anti-pattern across 5 subsystems: spec-memory, CocoIndex, skill-advisor, code-graph, and rerank-sidecar.
- Configured a 10-iteration deep-research loop via cli-opencode + deepseek-v4-pro with convergence threshold 0.05 on newInfoRatio.
- Scoped audit to code surfaces (TypeScript, Python, Rust), config surfaces (JSON, YAML, env vars, manifests), documentation surfaces (READMEs, SKILL.md, INSTALL_GUIDE), doctor command surfaces, and agent definitions.

### Changed

- Defined severity rubric classifying findings as P0 (active incident like the 2026-05-23 embedder crash), P1 (latent drift), or P2 (cosmetic).
- Established remediation roadmap pattern from packet 020 precedent: Shape A (throw-on-unconfigured), Shape B (documented LAST_RESORT), Shape C (registry-derived helper).

### Fixed

- None. This is a research/audit packet; remediation is deferred to a follow-on packet.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
