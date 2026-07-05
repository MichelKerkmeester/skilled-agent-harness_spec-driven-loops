---
title: "Implementation Plan: Convergence Design and Hardening"
description: "Plan for the sliding-window decision-record and 4 hardening implementations."
trigger_phrases:
  - "convergence design hardening plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/009-convergence-design-and-hardening"
    last_updated_at: "2026-07-01T08:20:00Z"
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
# Implementation Plan: Convergence Design and Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Two independent workstreams: (A) a design-only decision-record for sliding-window convergence — read `convergence.md`'s current rolling-average implementation, model the denominator-drag hypothesis mathematically, check the generation-2 forced-depth run's actual data (if it has completed by the time this phase is implemented) for real evidence either way, and write a recommendation. (B) four concrete hardening items in `fanout-run.cjs`/`fanout-merge.cjs`, each independently testable — check `fanout-merge.cjs`'s existing `enableNearDuplicateDedup` option first, since it may already solve item 2 of F-016.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Decision-record cites real data, not just restated hypothesis.
- Each hardening item has its own passing test.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Design, don't build, the sliding-window mode this phase** — the research itself marked this needs-design and unobserved; premature implementation without checking real generation-2 data first would be exactly the kind of over-engineering this project's own quality principles warn against.
- **Check for existing plumbing before building new.** `enableNearDuplicateDedup` may already exist for a reason — verify before assuming it needs new code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Check generation-2 research data (if available) for denominator-drag evidence; write the decision-record.
2. Implement stall-watchdog alerting + test.
3. Verify/enable near-duplicate dedup + test.
4. Implement per-lineage cost budget cap + test.
5. Implement lag-ceiling status mapping + test.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

One test per hardening item (4 total), each independently verifiable. Full suite run at the end.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Ideally sequenced after the generation-2 research re-run completes, so the decision-record has real forced-depth data to cite — not a hard blocker, but the recommendation quality improves with that evidence.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Decision-record removal is trivial; code hardening changes are additive (new checks/caps), reversible by revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `decision-record.md` (new) | Sliding-window proposal |
| `fanout-run.cjs` | Stall alerting, cost cap, lag-ceiling mapping |
| `fanout-merge.cjs` | Near-dup dedup verify/enable |
<!-- /ANCHOR:affected-surfaces -->
