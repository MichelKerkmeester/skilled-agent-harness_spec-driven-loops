---
title: "Implementation Summary: Deferred WIP-Overlapping Findings [system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/003-deferred-wip-overlapping-findings/implementation-summary]"
description: "7 audit findings deferred during remediation: each either overlaps the operator's active BUG-04/BUG-06 WIP or needs deeper design than a fast-agent pass produced. Reverted from the branch; remain open as documented findings."
trigger_phrases:
  - "code graph remediation deferred-wip-overlapping-findings"
  - "system-code-graph fix deferred wip-overlapping findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/003-deferred-wip-overlapping-findings"
    last_updated_at: "2026-05-29T08:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded 7 deferred findings with reasons"
    next_safe_action: "Re-implement deferred findings after WIP settles"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `003-deferred-wip-overlapping-findings` |
| **Completed** | 2026-05-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

7 audit findings deferred during remediation: each either overlaps the operator's active BUG-04/BUG-06 WIP or needs deeper design than a fast-agent pass produced. Reverted from the branch; remain open as documented findings.

### Findings

| Finding | Outcome / Reason |
|---------|------------------|
| CG-002 | Only PARTIALLY addressed by in-tree BUG-04 WIP: enum / minLength / additionalProperties are enforced before dispatch, but NUMERIC RANGES (min/max) are still NOT enforced — so CG-002 is not fully closed. Fast-fix only changed the error message and broke a test — reverted. |
| CG-006 | scan freshness gating on scanPromotable: correct in intent but the readiness-mock + status flow rely on the old value; needs reconciliation with BUG-06. |
| CG-007 | Read-path setLastGitHead removal is right in principle but the existing freshness flow RELIES on the read path recording HEAD; removing it makes status report stale. Needs scan-side HEAD recording first. |
| CG-008 | Candidate-manifest source change lives in ensure-ready.ts (active BUG-06 WIP file); deferred to avoid conflicting with in-flight work. |
| CG-009 | Recovery confirm-gate; bundled in apply-orchestrator with CG-010, reverted together. |
| CG-010 | rollback-failed status is OVER-BROAD: recovery-procedures returns status:ok with restored:false for the genuine no-op case (nothing to restore), and status:failed only when a restore was attempted and errored. The original fix's `restored !== true` check was too broad — it flagged the status:ok/restored:false no-op as a failure. Correct fix needs recovery-procedures to distinguish the no-op (status ok, restored false) from an errored rollback (status failed) — which is why it remains deferred. |
| CG-037 | apply dry-run rollback target; bundled with apply-orchestrator revert. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`cli-opencode openai/gpt-5.5-fast --variant high` applied the edits across file-disjoint batches in an isolated worktree seeded with the operator's WIP. Each test delta was re-examined as a possible regression before keeping or reverting.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deliver on branch, not main | The live tree has incomplete overlapping BUG-04/BUG-06 WIP |
| Revert over-broad fixes | Re-examination showed some fixes changed semantics the tests/recovery rely on |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (0 errors) |
| Full vitest suite | Failing set identical to B0 baseline (24 pre-existing WIP failures); zero new |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not merged.** Lives on branch `cg-remediation`; operator merges when BUG-04/BUG-06 WIP settles.
2. **Baseline not green.** The repo's own BUG-06 WIP fails 24 tests independently of this work.
<!-- /ANCHOR:limitations -->
