---
title: "Implementation Summary: Code Graph Source Audit [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/implementation-summary]"
description: "Outcome of the system-code-graph source audit: 37 verified bug and misalignment findings produced by a gpt-5.5 dispatch, Claude direct verification, and a 43-agent adversarial workflow. No source files changed; remediation is scheduled."
trigger_phrases:
  - "code graph audit summary"
  - "system-code-graph findings summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/001-source-bug-audit-findings"
    last_updated_at: "2026-05-29T08:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Audit complete; 37 findings recorded in review-report.md; packet validated"
    next_safe_action: "Schedule P1 remediation as scoped follow-on fix packets"
    blockers: []
    key_files:
      - "review-report.md"
      - "spec.md"
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-source-bug-audit-findings |
| **Completed** | 2026-05-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet audited the `system-code-graph` skill, the standalone `mk-code-index` MCP server of roughly 17,500 lines, and recorded 37 confirmed findings: 10 P1 and 27 P2. You can now open `review-report.md` and act on each finding from its exact file and line, with a one-line fix already written.

### The audit

The headline bug is CG-005: web-tree-sitter `Tree` objects are never freed with `.delete()`, so each parsed file leaks WASM linear memory, and a full scan parses thousands of files through one shared parser. The other correctness P1s are CG-003 (a two-statement `removeFile` delete with no transaction, which leaves partial graph state if the process dies mid-call), CG-006 (a failed or non-promoted scan still reports `freshness: 'fresh'`, so consumers trust stale data), CG-008 (the read-only readiness path writes `last_git_head` and breaks the ADR-003 single-writer contract), and CG-007 (candidate-manifest drift reads DB rows, so it can never see a newly added on-disk file, which is the exact case it exists to catch).

The contract P1s are CG-001 (`code_graph_status` writes the readiness marker on every call although ADR-003 and the feature catalog call it read-only), CG-002 (tool input-schemas are declared but never enforced before handler execution), CG-009 (destructive recovery operations skip the `confirm` gate when the graph is fresh or soft-stale), CG-010 (a failed rollback still reports status `rolled-back`, masking data loss), and CG-004 (the feature catalog claims 11 MCP tools and a removed dispatch path against the real 8-tool surface).

The 27 P2 findings cover concurrency hardening (owner-lease reclaim race, refresh TOCTOU, shutdown re-entrancy, working-set serialize round-trip data loss), diff line-math comment accuracy, parser quarantine and metric labeling, a per-file global orphan sweep that runs on every file write, and a family of documentation drifts: the "8 versus 11 tools" count repeated across five docs, stale file and line references, a group-count off-by-one, and a version-table mismatch.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `review-report.md` | Created | Full evidence catalog of all 37 findings |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Created | Audit framing, remediation sequencing, QA |
| `description.json`, `graph-metadata.json` | Created | Mandatory packet metadata |

No file inside `system-code-graph` was modified. The audit was read-only.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three passes fed the report. The operator pinned the primary finder: `cli-opencode` dispatched `openai/gpt-5.5-fast --variant xhigh` read-only, which returned three contract findings. This session verified each against source and added three database-path findings that came out of tracing why `.opencode/.spec-kit` appeared at the workspace root. A 43-agent completeness workflow then fanned seven finders over the clusters gpt-5.5 under-covered, and an independent skeptic verified every candidate. That pass turned 36 candidates into 32 confirmed and 4 refuted. Every finding in the report cites evidence that a reviewer can re-open at the named line.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Placed the packet at `004-code-graph/011` | 009 is docs-only and 010 is playbook-only; a source-code audit belongs as a new sibling under the code-graph parent |
| Kept the audit read-only, deferred fixes | The operator asked for findings; fixes touch a live MCP server and each deserves its own scoped, verified packet |
| Used gpt-5.5 as primary, Claude workflow as verifier | Honors the operator's executor choice while adding adversarial verification and completeness coverage gpt-5.5 explicitly skipped |
| Downgraded several P1 candidates to P2 | Production guards (launcher lock/lease re-probe) and dead-code paths bound the real impact; each downgrade is justified in the finding's Verification note |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Evidence integrity (P1 quotes vs source) | PASS. status.ts:200, mcp-types.ts:9-14, code-graph-db.ts:858-870, tree-sitter-parser.ts confirmed |
| Adversarial verification | PASS. 32 of 36 workflow candidates confirmed, 4 refuted |
| Read-only guarantee | PASS. No source edits in `system-code-graph` |
| `validate.sh --strict` for this folder | Recorded at packet close (see session output) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Remediation is not applied.** This packet records findings only. Fixes are enumerated in `tasks.md` and must run as scoped follow-on packets with their own tests.
2. **Runtime behavior was not exercised.** No scan, apply, or verify ran. Findings rest on static reading plus the existing test and stress suites.
3. **The launcher was read only where it affects a finding.** `.opencode/bin/mk-code-index-launcher.cjs` carries a parallel copy of the owner-lease shape; the concurrency fixes should harden it too.
4. **Doc-count findings share a root cause.** The "8 versus 11 tools" family is best fixed by one single-source-of-truth pass rather than five separate edits.
<!-- /ANCHOR:limitations -->
