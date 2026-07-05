---
title: "Quality Checklist: Hard-rule enforcement + dispatch-reliability hardening (design-completeness) [template:level_2/checklist.md]"
description: "Verifies the plan-only deliverable is complete and self-contained. Design items are checked with evidence; implementation items are explicitly deferred to the future implementation packet."
trigger_phrases:
  - "hardening plan checklist"
  - "dispatch linter design checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-skill-advisor/009-hard-rule-and-dispatch-preflight-hardening"
    last_updated_at: "2026-07-05T05:56:04.453Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked design-completeness items; deferred impl checks"
    next_safe_action: "Operator resolves 6 open questions in decision-record"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Quality Checklist: Hard-rule enforcement + dispatch reliability hardening

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every item is checkable with evidence and carries a priority tag.
- Remove placeholders and items not backed by a real check.
FAILURE MODES:
- Items without evidence, missing priority tags, or untested completion claims.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-001 [P0] Both threads' findings captured with file:line evidence so the design survives the ephemeral transcript [evidence: plan.md ANCHOR:architecture §Findings].
- [x] CHK-002 [P0] Confirmed-vs-inferred ledger written; every load-bearing claim tagged verified or per-report [evidence: decision-record.md ledger].
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-003 [P1] Investigation outsourced to a two-thread Sonnet-5 (max) workflow + synthesis, 3/3 agents, 0 errors, 604K tokens [evidence: implementation-summary.md ANCHOR:how-delivered].
- [x] CHK-004 [P1] Scope settled: plan only, covering BOTH threads [evidence: spec.md ANCHOR:scope + answered_questions frontmatter].
- [ ] CHK-005 [P0] Operator sign-off on open questions Q2 (defaults) + Q3 (block-response schema) [deferred: GATE T00].
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P1] No production code written this phase — plan only; zero code/config edits [evidence: implementation-summary.md ANCHOR:what-built].
- [x] CHK-007 [P1] Every recommended component names a confirmed mount point; inferred sub-steps flagged for re-confirmation [evidence: plan.md ANCHOR:architecture §Key Components].
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] AC-1 fixture sketch defined and mapped to Option B2 [evidence: plan.md ANCHOR:testing].
- [x] CHK-009 [P0] AC-2 fixture sketch defined and mapped to Option D [evidence: plan.md ANCHOR:testing].
- [ ] CHK-010 [P0] AC-1 + AC-2 fixtures pass, mutation-proved [deferred: implementation packet — tasks.md T06, T13].
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-011 [P0] Design covers BOTH threads — skill-advisor hard-rule surfacing/enforcement AND deep-loop/cli-dispatch reliability [evidence: plan.md ANCHOR:summary §Overview].
- [x] CHK-012 [P1] Recommended set is minimal and passes both acceptance tests (D+B+A′; defer C; reject E) [evidence: decision-record.md Decision 1].
- [ ] CHK-013 [P1] Implementation executed per rollout order [deferred: implementation packet — tasks.md T01-T18].
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P1] No security change this phase (plan only). Design property: the enforcement path reads rules off disk and fails open on its own errors, so it never becomes a new deadlock/deny vector [evidence: plan.md ANCHOR:architecture §Key Components + spec.md ANCHOR:nfr].
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-015 [P1] Spec packet authored (spec, plan, tasks, checklist, decision-record, implementation-summary) plus metadata [evidence: ls of this folder].
- [x] CHK-016 [P2] Six operator open questions enumerated for the T00 gate [evidence: decision-record.md §Open questions].
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-017 [P1] Homed in `003-skill-advisor/009` with a cross-reference to `004-deep-loop` for the D thread [evidence: decision-record.md Decision 2].
- [x] CHK-018 [P2] Metadata prefix `system-speckit` matches disk + the 028 packet root [evidence: validator GENERATED_METADATA_INTEGRITY path-prefix invariant passed].
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Design is complete and self-contained; implementation is deferred to a future packet pending operator
sign-off on the six open questions. Checked items are design deliverables that exist now; unchecked
items (CHK-005, CHK-010, CHK-013) are implementation-packet work, not gaps in this design phase.
<!-- /ANCHOR:summary -->
