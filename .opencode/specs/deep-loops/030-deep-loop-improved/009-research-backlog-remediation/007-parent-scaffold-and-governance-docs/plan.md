---
title: "Implementation Plan: Parent Scaffold and Governance Docs"
description: "Plan for authoring real 008-parent docs and the 2 missing ADR decision-records."
trigger_phrases:
  - "parent scaffold governance docs plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/009-research-backlog-remediation/007-parent-scaffold-and-governance-docs"
    last_updated_at: "2026-07-01T08:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Parent Scaffold and Governance Docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Read all 7 of `008-loop-systems-remediation`'s children's `implementation-summary.md` files first, then write the parent's own `tasks.md` (one task-group per child, referencing its own tasks.md rather than duplicating) and `implementation-summary.md` (aggregate what-was-built + verification evidence) from that real material. For the ADRs, read `003-cross-mode-anti-convergence-adr/spec.md` and `005-anchor-ownership-conflict-adr/spec.md` (plus their implementation-summary.md) to extract the actual decision made, then write `decision-record.md` using the same structure as the sibling `002-convergence-profile-unification-adr/decision-record.md` (read it first as the format reference).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Zero template-placeholder strings remain in any touched file.
- Decision records reflect the REAL decision each phase shipped, verified against that phase's own spec/implementation-summary, not invented.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Aggregate, don't duplicate.** The parent tasks.md/implementation-summary.md should summarize and point at each child's own detailed docs, not copy them verbatim.
- **Mirror the one working example.** `002-convergence-profile-unification-adr/decision-record.md` is the only correctly-authored ADR sibling — use its structure as the template for the 2 missing ones rather than inventing a new format.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Read all 7 children's implementation summaries; read the reference ADR decision-record.
2. Write the 008-parent tasks.md and implementation-summary.md.
3. Write both missing decision-records; add checklist.md if the phase's Level requires it.
4. Fix the non-standard Level annotation on 008's spec.md.
5. Validate all touched folders.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. `grep -i "template-author\|\[template:"` on the two rewritten 008-parent files returns nothing.
2. `validate.sh` on `008-loop-systems-remediation` and both ADR folders.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None — pure documentation authoring.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Pure doc changes, no code/state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `008-loop-systems-remediation/{tasks,implementation-summary,spec}.md` | Real content + Level fix |
| `003-deep-loop-workflows/{003,005}-*-adr/decision-record.md` (new) | Decision records |
| `003-deep-loop-workflows/{003,005}-*-adr/checklist.md` (new, if needed) | Checklists |
<!-- /ANCHOR:affected-surfaces -->
