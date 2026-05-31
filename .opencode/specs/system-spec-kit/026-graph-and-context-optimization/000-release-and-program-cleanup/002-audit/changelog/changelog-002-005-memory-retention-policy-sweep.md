---
title: "Changelog: Memory Retention Policy Sweep [002-audit/005-memory-retention-policy-sweep]"
description: "Governed retention enforcement for memory_index.delete_after shipped: sweep core, MCP trigger, scheduled cleanup, audit trail, dry-run preview. Targeted vitest coverage included."
trigger_phrases:
  - "memory retention sweep"
  - "delete_after enforcement"
  - "retention policy sweep"
  - "memory_retention_sweep tool"
  - "governed memory cleanup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/005-memory-retention-policy-sweep` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit`

### Summary

The memory index supported a `delete_after` retention boundary on every governed ingest row, but no code path ever consumed it. Rows past their retention date accumulated indefinitely. Session cleanup targeted session-state tables only. `memory_bulk_delete` filtered by tier, spec folder, date. None of these paths consumed the `delete_after` boundary.

A new retention sweep was built end-to-end. A shared sweep core selects expired rows using `delete_after IS NOT NULL AND delete_after < datetime('now')`. It deletes each expired row through the existing vector and FTS deletion path, then records a governance audit entry with `reason="retention_expired"` plus the original boundary value. A background interval wired into the session-manager runs hourly by default. It is disabled by `SPECKIT_RETENTION_SWEEP=false`. An MCP tool `memory_retention_sweep` exposes both dry-run preview and live deletion to operators. Six targeted vitest cases cover deletion, dry-run, audit integrity, empty-set safety, index integrity and sweep-insert interleaving. The TypeScript build and strict packet validator both passed.

### Added

- Shared retention sweep core at `mcp_server/lib/governance/memory-retention-sweep.ts` with dry-run and live deletion paths
- MCP handler `memory_retention_sweep` registered: handler index, tool dispatch and MCP schema
- Scheduled retention interval in the session-manager, defaulting to hourly and controlled by the `SPECKIT_RETENTION_SWEEP` env flag
- Six targeted vitest cases in `mcp_server/tests/memory-retention-sweep.vitest.ts` covering deletion, dry-run, audit, index integrity, empty-set safety and sweep-insert interleaving
- `memory_retention_sweep` Zod input schema in `mcp_server/schemas/tool-input-schemas.ts`
- Retention sweep args type in `mcp_server/tools/types.ts`

### Changed

- `mcp_server/lib/session/session-manager.ts` now installs a separate retention interval alongside session cleanup on startup
- `mcp_server/README.md` documents retention behavior, env flags and manual trigger usage
- `mcp_server/ENV_REFERENCE.md` updated with `SPECKIT_RETENTION_SWEEP` and interval documentation
- `mcp_server/lib/governance/scope-governance.ts` sweep comment updated to reflect the new active deletion path

### Fixed

- `memory_index.delete_after` rows were never deleted. The sweep closes the gap by enforcing the retention boundary on every periodic and manual run.

### Verification

| Check | Command or Artifact | Result |
|-------|---------------------|--------|
| Targeted retention test | `npx vitest run memory-retention-sweep` | PASS: 1 file, 6 tests |
| TypeScript build | `npm run build` | PASS: exit 0 |
| Strict packet validation | `validate.sh ... --strict` | PASS: exit 0 |
| CHK-001 Requirements in spec.md | `spec.md` requirements table | PASS |
| CHK-002 Technical approach in plan.md | `plan.md` phases and architecture | PASS |
| CHK-003 Source research cited | 013 P1-2 lines cited in spec problem statement | PASS |
| CHK-004 Target files read before editing | Source code read before every edit | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` (NEW) | Created | Shared sweep core. Candidate selection, delete path, audit recording, dry-run mode. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts` (NEW) | Created | MCP handler wrapper delegating to the sweep core |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` (NEW) | Created | Six targeted vitest cases |
| `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` | Modified | Separate hourly retention interval wired into startup |
| `.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts` | Modified | Tool dispatch registration for `memory_retention_sweep` |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | MCP schema registration for `memory_retention_sweep` |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Zod input validation for `dryRun` flag |
| `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts` | Modified | Retention sweep args type added |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/index.ts` | Modified | Lazy handler export added |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Retention behavior, env flags, manual trigger docs |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | `SPECKIT_RETENTION_SWEEP` env flag documented |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Modified | Sweep comment updated for active deletion path |

### Follow-Ups

- Run the full Vitest suite once packet constraints allow to confirm no cross-handler regressions.
- Verify that `SPECKIT_RETENTION_SWEEP` is reflected in the operator runbook for production deployments.
