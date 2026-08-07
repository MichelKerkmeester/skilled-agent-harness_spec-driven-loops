---
title: "013/001 Deep Loop Fanout Reliability"
description: "Fan-out CLI lineages now fail when subprocesses fail, run concurrently up to the cap, honor per-lineage iteration caps, omit out-of-enum Codex service_tier defaults and carry regression coverage."
trigger_phrases:
  - "013/001 deep loop fanout reliability"
  - "fanout reliability changelog"
  - "deep loop fanout outcome"
  - "fanout-run failure propagation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/001-deep-loop-fanout-reliability`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation`

### Summary

The deep-loop fan-out runner now reports lineage failures truthfully. CLI non-zero exits and timeouts throw from the worker after salvage, so the pool records rejected lineages and the process exits non-zero. Lineages run with real async concurrency, per-lineage iteration caps reach the loop prompt, Codex dispatch no longer emits the out-of-enum `service_tier=default` and documentation plus comment hygiene were brought back in line with the shipped runtime.

### Added

- 12 regression cases for fanout-run behavior, covering failure propagation, timeout kill handling, async overlap, iteration-cap prompt threading, service_tier omission and review sandbox defaults

### Changed

- `fanout-run.cjs` now uses an async spawn helper instead of `spawnSync`, preserving stdin, environment, timeout kill behavior, working directory and stdout bounds while allowing the pool concurrency cap to overlap lineages
- Positive per-lineage `iterations` now threads `config.maxIterations` into the loop prompt and null iterations preserve the plain convergence instruction
- cli-codex dispatch omits `service_tier` when no validated tier is set, leaving the CLI default to the CLI instead of sending `default`
- `deep-loop-runtime/SKILL.md` now reports the actual 8 `.cjs` scripts and names the fan-out entry points

### Fixed

- Lineages whose CLI exits non-zero or times out are now counted as failures, with process exit 2 for some failures or 3 for all failures
- Perishable phase, packet and ADR labels were removed from comments in `fanout-pool.cjs`, `code-graph-tools.ts` and `core/config.ts` while keeping durable rationale and placeholder anchors

### Verification

- `node --check` on `fanout-run.cjs` and `fanout-pool.cjs`: PASS
- Vitest fanout-run, fanout-pool and cli-matrix suites: PASS, 29 tests across 3 suites with 12 new cases
- `tsc --noEmit` for `system-code-graph/mcp_server`: PASS, exit 0
- Grep for the removed perishable labels on the three comment-hygiene files: PASS, zero hits
- `ls scripts/*.cjs | wc -l` matched the SKILL.md script count: PASS, 8 files

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Failure throw, async spawn helper, iteration cap, service_tier omission, review sandbox note |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified | Comment hygiene cleanup |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Modified | Script count and fan-out entry point inventory |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | 12 regression cases and one hardened assertion |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts` | Modified | Comment hygiene cleanup |
| `.opencode/skills/system-code-graph/mcp_server/core/config.ts` | Modified | Comment hygiene cleanup |

### Follow-Ups

- A path-scoped workspace-write sandbox for review lineages would be stronger than prompt-enforced write boundaries, but the CLIs do not expose that boundary today.
