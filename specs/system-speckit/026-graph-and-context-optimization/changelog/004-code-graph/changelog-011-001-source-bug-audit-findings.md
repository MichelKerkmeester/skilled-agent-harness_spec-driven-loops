---
title: "Changelog: Code Graph Source Bug & Misalignment Audit [011-source-bug-and-misalignment-audit/001-source-bug-audit-findings]"
description: "Chronological changelog for the Code Graph Source Bug & Misalignment Audit phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/001-source-bug-audit-findings` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit`

### Summary

This packet audited the system-code-graph skill, the standalone mk-code-index MCP server of roughly 17,500 lines, and recorded 37 confirmed findings: 10 P1 and 27 P2. You can now open review-report.md and act on each finding from its exact file and line, with a one-line fix already written.

### Added

- Created review-report.md as the full evidence catalog of all 37 confirmed findings (10 P1, 27 P2) with exact file:line citations and one-line fixes.
- Created spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md to frame the audit scope, remediation sequencing, and QA gates.
- Created description.json and graph-metadata.json for mandatory packet metadata.

### Changed

- Dispatched openai/gpt-5.5-fast --variant xhigh read-only via cli-opencode; captured three contract findings (CG-001 through CG-003) and verified each against source.
- Ran a 43-agent completeness-expansion workflow over seven under-covered clusters with adversarial verification, turning 36 candidates into 32 confirmed and 4 refuted.
- Downgraded several P1 candidates to P2 after verifier-corrected severity ratings; each downgrade is documented in the finding's verification note.

### Fixed

- None. This is an audit-only packet; fixes are deferred to scoped follow-on packets.

### Verification

- Evidence integrity (P1 quotes vs source) - PASS. status.ts:200, mcp-types.ts:9-14, code-graph-db.ts:858-870, tree-sitter-parser.ts confirmed
- Adversarial verification - PASS. 32 of 36 workflow candidates confirmed, 4 refuted
- Read-only guarantee - PASS. No source edits in system-code-graph
- validate.sh --strict for this folder - Recorded at packet close (see session output)
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `review-report.md` | Created | Full evidence catalog of all 37 findings |
| `spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md` | Created | Audit framing, remediation sequencing, QA |
| `description.json, graph-metadata.json` | Created | Mandatory packet metadata |

### Follow-Ups

- Remediation regression tests are deferred to fix packets, not in scope for this audit.
- Fixes are deferred by design; each P1 finding has a named remediation task in tasks.md for scoped follow-on packets.
- Wrap removeFile() edge and file delete in a single transaction to prevent partial graph state on mid-call process death (code-graph-db.ts).
- Call tree.delete() in a finally block around parse to prevent WASM linear memory leaks (tree-sitter-parser.ts).
- Gate scan freshness on scanPromotable instead of MAX(indexed_at) so failed or non-promoted scans do not report fresh (scan.ts).
- Feed candidate-manifest drift the on-disk candidate set instead of DB rows so newly added files are detected (ensure-ready.ts).
