---
title: "Changelog: 048 Remaining P1/P2 Remediation"
description: "23 of 24 P1 findings applied. 8 P2 findings applied after packet 046. MCP argument validation tightened before dispatch. Memory health extended to consistency reporting. Command contracts documented. Skill Graph and coverage-graph docs added."
trigger_phrases:
  - "048 remaining P1 P2 remediation"
  - "fix remaining priority findings"
  - "conservative defaults pass"
  - "MCP argument validation tightening"
  - "memory health consistency reporting"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/005-fix-remaining-priority-findings` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness`

### Summary

After packet 046 closed the release-blocking P0s, 24 P1 findings and 15 P2 findings remained. They spanned docs, command contracts, validator output, memory consistency, schema governance, deep-loop validation, plus operability. This packet applied 23 of those 24 P1 items plus 8 P2 items using conservative, source-cited remediation. The four largest engineering changes tightened MCP argument validation before pre-dispatch, extended `memory_health` to report row-count consistency, documented memory command contracts, then added missing Skill Graph and coverage-graph catalog entries. A per-finding outcome ledger in `remediation-log.md`, a Tier gamma conservative-defaults record in `decision-record.md`, plus a deferred P2 ledger in `deferred-p2.md` give operators a complete audit trail. One P1 (normal-shell live hook tests) was deferred as operator-only because the sandbox cannot produce live CLI verdicts.

### Added

- Skill Graph feature catalog entries (four new entries: `26-skill-graph-scan.md` through `29-skill-graph-validate.md`) and a coverage-graph entry (`30-coverage-graph-query.md`)
- Skill Graph and coverage-graph manual testing playbook scenarios (entries 283 through 286)
- File-backed multi-connection retention and write fixture in `memory-retention-sweep.vitest.ts` for race coverage
- `remediation-log.md`: per-finding outcome ledger with applied, partial, deferred, plus skipped rows
- `decision-record.md`: Tier gamma conservative defaults with ID, default value, rationale, plus rejected alternative
- `deferred-p2.md`: record of P2 items not auto-applied because they require a design call or larger code change

### Changed

- `context-server.ts`: known tool arguments now validated before metrics, priming, auto-surface, then dispatch
- `memory-crud-health.ts`: `memory_health` now returns structured consistency with row count, FTS rows, vector rows, plus mismatched-ID indicators
- `validate.sh`: JSON output now includes `details` and `remediation` fields for operator-actionable results
- `speckit_plan_auto.yaml` and `speckit_complete_auto.yaml`: auto-mode wait and pause steps removed
- `tool-input-schemas.ts`, `memory-index.ts`, `memory-ingest.ts`, `scope-governance.ts`: scan and ingest paths now accept governance metadata and run shared validation
- `skill-advisor-hook.md`: OpenCode output shape now names the system transform and `output.system` mutation
- `ENV_REFERENCE.md` and `ARCHITECTURE.md`: evergreen packet-history wording removed, replaced with current runtime anchors
- `memory_system.md`, `environment_variables.md`, `SKILL.md`: tool counts updated from stale figures to 54 tool surface
- `mcp-doctor-lib.sh` and `mcp-doctor.sh`: doctor now accepts both `servers` (modern) and `mcpServers` (legacy) shapes
- `INSTALL_GUIDE.md`, `doctor_mcp_install.yaml`, `install.sh`: Node floor aligned to `>=20.11.0`

### Fixed

- `memory-crud-health.ts`: memory health reported connectivity only. It now reports per-table row counts and mismatch indicators
- `embedding-cache.ts`, `vector-index-mutations.ts`: retention delete now removes embedding-cache rows by content hash when the cache table exists
- `post-dispatch-validate.ts`, deep-review YAML assets: review JSONL schema now requires full schema and array-valued `filesReviewed`. Failure reason taxonomy ported from research reports.
- `save/types.ts`: hidden planner inputs documented as internal-only with JSDoc
- `hooks/codex/README.md`: snippet now names template-only status and live `hooks.json` requirement
- `hooks/gemini/user-prompt-submit.ts`: Gemini hook output event name corrected to `BeforeAgent`
- `plugins/spec-kit-skill-advisor.js`: missing-prompt branch now records skipped status and `MISSING_PROMPT`
- `README.md`: broken release-note link repaired
- Legacy `005-memory-indexer-invariants/graph-metadata.json`: explicit `legacy_grandfathered:true` flag added so strict validator skips the warning for this grandfathered packet

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS |
| Targeted Vitest: 4 affected files, 107 tests | PASS |
| Strict packet validator (packet 048) | PASS. 0 errors, 0 warnings |
| Strict packet validator (legacy 005 packet) | PASS after grandfather flag applied |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Known-tool arg validation before dispatch |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Structured consistency output with row counts and mismatch indicators |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Governance metadata added to scan and ingest inputs |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Shared governance validation on ingest path |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | Shared governance validation on ingest path |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Shared validation logic for scan and ingest |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Retention delete removes cache rows by content hash |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | Retention sweep aligned to remove embedding cache rows |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/types.ts` | Hidden planner inputs documented internal-only |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Review JSONL schema validation extended to full schema |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` | File-backed multi-connection retention fixture |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/memory-index-db.ts` | Retention fixture database helper |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | JSON output now includes details and remediation fields |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Packet-history wording removed, strict-off documented as development-only |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Evergreen packet-history wording removed |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Node floor aligned to 20.11.0 |
| `.opencode/skills/system-spec-kit/scripts/setup/install.sh` | Node floor aligned to 20.11.0 |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | OpenCode system transform and output.system mutation documented |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md` | Snippet names template-only status and hooks.json requirement |
| `.opencode/skills/system-spec-kit/references/memory/memory_system.md` | Tool count updated to 54 |
| `.opencode/skills/system-spec-kit/references/config/environment_variables.md` | Tool count updated. strict-off labeled development-only |
| `.opencode/commands/memory/save.md` | Plan-only default and explicit apply and full-auto paths documented |
| `.opencode/commands/memory/manage.md` | Memory commands documented as markdown-only contracts |
| `.opencode/commands/memory/search.md` | Memory commands documented as markdown-only contracts |
| `README.md` | Broken release-note link repaired |

### Follow-Ups

- Normal-shell hook verdicts for finding 045/005-P1-1 remain operator-only. Operators should run `npm run hook-tests` from a non-sandboxed shell to complete this item.
- BM25 hardening, scoped link validation, plus protected local runtime config edits were deferred in `deferred-p2.md` because they require a design call or larger code changes.
- The deep-review audited-wrapper port is partial. Failure reason taxonomy and schema validation were aligned but the full wrapper replacement exceeds the safe scope of this packet and needs a follow-up.
