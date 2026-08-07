---
title: "MCP Tool Schema Governance Release-Readiness Audit"
description: "Release-readiness audit that confirmed the canonical 54-tool spec_kit_memory count. One P0 schema-validation bypass was found in session_health. Four P1 schema and governed-ingest drift findings were filed with file:line evidence."
trigger_phrases:
  - "mcp tool schema governance audit"
  - "session_health schema bypass"
  - "code_graph_verify schema drift"
  - "governed ingest enforcement audit"
  - "tool count canonical spec_kit_memory"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/006-mcp-tool-schema-governance-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits`

### Summary

Before this audit, there was no systematic truth check covering MCP tool schema completeness, strict-mode enforcement consistency, governed-ingest policy scope or canonical tool count alignment. The audit read six target runtime surfaces plus related packets 033, 034 and 042. It produced a severity-classified `review-report.md` with nine sections.

The canonical count is sound: `spec_kit_memory` exposes 54 public tools made of 50 local descriptors plus 4 imported Skill Advisor descriptors, which matches both the root README and the MCP server README. The release-readiness verdict is FAIL because `session_health` has a Zod schema and an allowed-parameter entry but its lifecycle dispatcher never calls `validateToolArgs`, so `SPECKIT_STRICT_SCHEMAS=on` cannot reject hallucinated parameters for that public tool. Four additional P1 findings cover `code_graph_verify` missing from the schema registry, hidden `memory_save` handler inputs not present in the public schema, conditional governed-ingest enforcement across scan and ingest surfaces. A fourth P1 finding covers raw arguments influencing session priming before schema validation runs.

### Added

- None. Review-only phase.

### Changed

- None. Review-only phase.

### Fixed

- None. Review-only phase.

### Verification

- `review-report.md` produced with nine required sections and severity-classified finding registry.
- Verdict: FAIL. Active counts: P0=1, P1=4, P2=2.
- Tool count source check: PASS. 50 local descriptors plus 4 advisor descriptors equals 54 public `spec_kit_memory` tools.
- Strict schema default check: PASS. Strict mode is default because only `SPECKIT_STRICT_SCHEMAS=false` switches schemas to passthrough.
- Governance SQL review: PASS. Audited governance SQL uses fixed clauses and bound parameters.
- Packet strict validation: PASS. `validate.sh --strict` exited 0.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `006-mcp-tool-schema-governance-audit/review-report.md` (NEW) | Created | Nine-section release-readiness report with P0/P1/P2 findings and file:line evidence. |
| `006-mcp-tool-schema-governance-audit/spec.md` (NEW) | Created | Audit scope. Acceptance criteria. Risk table. |
| `006-mcp-tool-schema-governance-audit/plan.md` (NEW) | Created | Audit execution plan and verification strategy. |
| `006-mcp-tool-schema-governance-audit/tasks.md` (NEW) | Created | Completed audit task ledger. |
| `006-mcp-tool-schema-governance-audit/checklist.md` (NEW) | Created | Verification checklist with evidence rows. |
| `006-mcp-tool-schema-governance-audit/implementation-summary.md` (NEW) | Created | Summary of the audit deliverable and known limitations. |
| `006-mcp-tool-schema-governance-audit/description.json` (NEW) | Created | Packet discovery metadata. |
| `006-mcp-tool-schema-governance-audit/graph-metadata.json` (NEW) | Created | Packet graph metadata and dependency links. |

### Follow-Ups

- Plan remediation for P0-001: call `validateToolArgs('session_health', args)` before `handleSessionHealth()` in the lifecycle dispatcher and add a regression test for unknown-field rejection.
- Add `codeGraphVerifySchema` to `TOOL_SCHEMAS` and `ALLOWED_PARAMETERS` with the fields from `VerifyArgs`.
- Decide whether `plannerMode` and `targetAnchorId` are public MCP inputs for `memory_save` and update the public schema accordingly.
- Establish an explicit governed-ingest policy for `memory_index_scan` and `memory_ingest_start`, either adding governance fields or documenting them as operator-maintenance paths.
- Move schema validation to the server boundary before session priming in `context-server.ts`.
- Update the schema README after parity remediation to avoid stale schema-key count claims.
