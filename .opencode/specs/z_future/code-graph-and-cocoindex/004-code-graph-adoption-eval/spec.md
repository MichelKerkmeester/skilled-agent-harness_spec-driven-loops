---
title: "004 — Code Graph Adoption Evaluation Harness"
description: "Phase parent for the code-graph adoption evaluation harness: bootstrap the orchestrator, then deliver token measurement, fixtures, reporting, and stress integration as child packets."
trigger_phrases:
  - "027 phase 006"
  - "code-graph adoption eval"
  - "eval harness"
  - "baseline vs after measurement"
  - "token reduction validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Refactored populated packet into a phase parent with five child packets"
    next_safe_action: "Start 001-harness-skeleton, then run 002/003/004 in parallel"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-phase-parent-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec.md | v2.2 -->

# Feature Specification: 004 — Code Graph Adoption Evaluation Harness

<!-- SPECKIT_LEVEL: phase-parent -->

## 1. Metadata

| Field | Value |
| --- | --- |
| **Status** | phase-parent |
| **Priority** | P2 |
| **Created** | 2026-05-08 |
| **Reshaped** | 2026-05-12 |
| **Phase Count** | 5 |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex` |
| **Depends On** | `028/001-code-graph-hld-lld`, `028/002-code-graph-trace`, `028/003-code-graph-impact-analysis` |
| **Last Active Child** | None |

## 2. Purpose

> **pt-04 audit note (2026-05-11)**: Two updates per user decision.
>
> 1. **Independent variable changed**: the cancelled skill-advisor first-action mandate was folded into 103/003; the "after" condition is now the combined effect of the new code_graph tools (HLD/LLD from 001, trace from 002, impact-analysis from 003) **plus** the 103/003 first-action wording (if shipped before this harness runs). The harness can also run in pure code-graph-tools mode (without 103/003) to isolate tool effect.
> 2. **Dependencies (current 028 numbering)**: 001-code-graph-hld-lld (HLD/LLD), 002-code-graph-trace (trace), 003-code-graph-impact-analysis (impact-analysis), and 103/003 (first-action wording, optional).
>
> The XCE-style productivity-measurement scope is **KEPT** (per pt-04 user decision -- measure file-reads-avoided + token reduction, not just readiness validation). See `../research/027-xce-research-pt-04/research.md` section 5 re-prioritization and section 6 open questions Q4.

This phase coordinates the lightweight local adoption evaluation harness for the code_graph toolchain. The harness compares baseline advisor behavior against the new code_graph-assisted condition and reports productivity-oriented measures: file reads avoided, token reduction, context accuracy, answer completeness, and diagnostics around first-action adherence.

The parent stays lean. Implementation details, checklists, decisions, and continuity live in the child phase folders below.

## 3. Scope

In scope:
- Bootstrap a CLI orchestrator skeleton for the paired baseline-vs-after evaluation.
- Read token usage from session analytics once a task session completes.
- Provide 12-20 labeled local refactoring tasks plus harness fixture scaffolds.
- Generate a markdown report with token-reduction and file-reads-avoided metrics.
- Add stress/integration coverage that proves the harness contract before live evaluation.

Out of scope:
- SWE-bench Verified or any Docker-heavy benchmark path.
- Cross-model comparison.
- Real-time dashboards.
- Implementing code_graph HLD/LLD, trace, or impact-analysis tools; this phase evaluates those earlier packets.

## 4. Phase Documentation Map

| Phase | Folder | Status | Description |
| --- | --- | --- | --- |
| 1 | `001-harness-skeleton/` | Planned | Sequential bootstrap for `code-graph-adoption-eval.js` and module-loader plumbing. |
| 2 | `002-token-measurement/` | Planned | Token measurement helper over session analytics DB. |
| 3 | `003-fixtures/` | Planned | Labeled task JSONL and harness fixture scaffolds. |
| 4 | `004-report-generator/` | Planned | Report generator for token reduction and file-reads-avoided metrics. |
| 5 | `005-stress-tests-integration/` | Planned | Vitest stress/integration coverage and stress config integration. |

## 5. Phase Handoffs

| From | To | Handoff Criteria | Verification |
| --- | --- | --- | --- |
| Parent | `001-harness-skeleton` | Parent lean trio exists and dependencies point at 027/002, 027/003, and 027/004. | Strict validation of parent and child 001 exits 0. |
| `001-harness-skeleton` | `002-token-measurement` | Orchestrator can load harness modules and expose session identifiers for metrics. | Child 001 checklist and strict validation pass. |
| `001-harness-skeleton` | `003-fixtures` | Orchestrator defines task-loading contract and fixture path conventions. | Child 001 checklist and strict validation pass. |
| `001-harness-skeleton` | `004-report-generator` | Orchestrator emits result rows with enough fields for reporting. | Child 001 checklist and strict validation pass. |
| `002-token-measurement`, `003-fixtures`, `004-report-generator` | `005-stress-tests-integration` | Metric helper, task fixtures, and report generator contracts are available. | Children 002, 003, and 004 strict validation pass. |

## 6. Success Criteria

- The eval harness can run paired baseline and after conditions over a labeled task set.
- Token measurement reads `total_tokens`, `prompt_tokens`, and `completion_tokens` from session analytics.
- Reports include file-reads-avoided and token-reduction metrics with skipped/incomplete pair accounting.
- Stress integration validates dispatcher, metrics, fixtures, and reporting together before a full live run.

## Related Documents

- `001-harness-skeleton/spec.md`
- `002-token-measurement/spec.md`
- `003-fixtures/spec.md`
- `004-report-generator/spec.md`
- `005-stress-tests-integration/spec.md`
- `graph-metadata.json`
