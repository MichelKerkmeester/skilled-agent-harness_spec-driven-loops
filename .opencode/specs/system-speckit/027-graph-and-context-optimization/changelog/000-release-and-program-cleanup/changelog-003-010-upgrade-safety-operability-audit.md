---
title: "Release Readiness: Upgrade Safety Operability Deep Review"
description: "Read-only operability audit of install, upgrade, migration, doctor, environment defaults. CONDITIONAL verdict: 0 P0 blockers, 3 P1 gaps (Node prereq drift, doctor VS Code detection, legacy strict-validation), 2 P2 advisories."
trigger_phrases:
  - "upgrade safety operability audit"
  - "doctor VS Code MCP wiring false warning"
  - "Node prerequisite drift release readiness"
  - "legacy strict validation backwards compatibility"
  - "UPGRADE-SAFETY findings"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/010-upgrade-safety-operability-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits`

### Summary

Recent release-readiness work moved stress tests, extended DB migration coverage, refreshed install docs. Before sign-off, the install, doctor, migration, environment-default, backwards-compatibility surfaces needed a read-only operability audit to surface drift before it reached operators.

The audit inspected install and upgrade documentation, package scripts, DB schema migration and rollback evidence, doctor MCP install and debug workflows, stress-test relocation references, environment variable default-state docs. No P0 release blockers were found. Current package scripts expose `npm test`, `npm run stress`, `npm run hook-tests`. The stress-test relocation has no source references to old paths. The DB schema migration wraps all upgrades in a transaction with rollback. The hydra migration slice passes 14 tests across 4 files.

Three P1 gaps need remediation before the upgrade path is called ready. Node install and doctor documentation still accepts Node 18 even though the packages require Node `>=20.11.0`. Doctor falsely reports four VS Code MCP servers as missing because it checks `mcpServers` while the checked-in config uses the `servers` key shape. An existing older spec folder (`026/005-memory-indexer-invariants`) no longer passes strict validation under the current validator. Two P2 advisories cover stale feature-flag notes in installer config surfaces plus permissive checked-in runtime config posture without explicit security context.

### Added

- None. Review-only phase.

### Changed

- None. Review-only phase.

### Fixed

- None. Review-only phase.

### Verification

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run test:hydra:phase1` | PASS: 4 test files, 14 tests covering migration checkpoint scripts. vector-index schema compatibility confirmed |
| `bash .opencode/commands/doctor/scripts/mcp-doctor.sh --json` | WARN: 33 pass, 6 warn, 0 fail. Four warnings were false `.vscode/mcp.json` wiring reports caused by the `servers` vs `mcpServers` key mismatch |
| Old stress path search under `mcp_server` | PASS: no source matches for `tests/search-quality`, `tests/code-graph-degraded-sweep`, no old import patterns found |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/.../005-memory-indexer-invariants --strict` | FAIL as audit evidence: exit 2 due to template-header warnings in `decision-record.md` |
| Security-sensitive install scan | PASS for install guide: no `--allow-all-tools` guidance found in audited surfaces |
| Strict packet validator for this packet | PASS: exit 0 |
| Review report | `review-report.md` (CONDITIONAL verdict: 0 P0, 3 P1, 2 P2) |

### Files Changed

| File | What changed |
|------|--------------|
| `010-upgrade-safety-operability-audit/review-report.md` (NEW) | CONDITIONAL verdict with 5 severity-classified findings. File:line evidence for each finding |
| `010-upgrade-safety-operability-audit/spec.md` (NEW) | Audit scope, requirements, acceptance criteria |
| `010-upgrade-safety-operability-audit/plan.md` (NEW) | Audit phases. Verification strategy |
| `010-upgrade-safety-operability-audit/tasks.md` (NEW) | Completed audit task ledger |
| `010-upgrade-safety-operability-audit/checklist.md` (NEW) | Verification evidence. Checklist entries |
| `010-upgrade-safety-operability-audit/implementation-summary.md` (NEW) | Completion summary with findings overview |
| `010-upgrade-safety-operability-audit/description.json` (NEW) | Packet metadata for memory search |
| `010-upgrade-safety-operability-audit/graph-metadata.json` (NEW) | Packet metadata for graph traversal |

### Follow-Ups

- Align Node minimum to `>=20.11.0` in install guide, doctor install and debug assets. Make doctor warn or fail for Node versions below that floor.
- Update doctor MCP config detection to handle both `.vscode/mcp.json` key shapes (`servers` vs `mcpServers`), then rerun `mcp-doctor.sh --json` to confirm the false VS Code warnings disappear.
- Decide whether existing packet decision-record template-header deviations are grandfathered or migrated so that `026/005-memory-indexer-invariants` passes strict validation.
- Replace stale feature-flag default notes outside ENV_REFERENCE so they match source-code defaults for `SPECKIT_EXTENDED_TELEMETRY` plus `SPECKIT_ADAPTIVE_FUSION`.
- Add explicit security context clarifying that permissive checked-in runtime configs (e.g. `.codex/config.toml`) are local developer profiles, not general install defaults.
- Obtain or create a named old-DB fixture representing the 026/005-era schema to strengthen upgrade path evidence beyond test-derived migration coverage.
