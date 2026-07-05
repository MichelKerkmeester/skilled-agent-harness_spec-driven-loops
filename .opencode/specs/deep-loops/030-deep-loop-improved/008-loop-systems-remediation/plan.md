---
title: "Implementation Plan: Loop Systems Remediation Parent Aggregate"
description: "Aggregate implementation plan for the seven completed loop-systems remediation children."
trigger_phrases:
  - "loop systems remediation plan"
  - "008 parent aggregate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/008-loop-systems-remediation"
    last_updated_at: "2026-07-01T16:35:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Wrote real parent aggregate plan from seven completed children"
    next_safe_action: "Use child plan.md files for implementation-level detail"
    blockers: []
    key_files:
      - "001-deep-improvement-rollback-hash-guard/plan.md"
      - "002-deep-improvement-promotion-safety/plan.md"
      - "003-model-benchmark-reducer-ledger/plan.md"
      - "004-adversarial-playbook-scenarios/plan.md"
      - "005-tighten-playbook-pass-criteria/plan.md"
      - "006-p2-test-adequacy-and-source-only-audit/plan.md"
      - "007-fan-out-hardening/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Loop Systems Remediation Parent Aggregate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

This parent aggregates seven independently-planned, independently-shipped remediation children. Each child owns its own detailed technical approach in its own `plan.md`; this parent-level plan records only the aggregate scope and points readers to child-owned detail, mirroring the pattern already established in this folder's own `tasks.md` and `implementation-summary.md`.

| Child | Technical Approach (see child's own plan.md for detail) |
|-------|-----------------------------------------------------------|
| `001-deep-improvement-rollback-hash-guard` | Verify accepted-state SHA-256 hashes before restoring backups; allow legitimate pre-/post-ship states while refusing unrelated drift |
| `002-deep-improvement-promotion-safety` | Pre-mutation mirror-sync gate compares runtime mirrors against the current canonical body, with a missing-target fallback |
| `003-model-benchmark-reducer-ledger` | Autonomous model-benchmark command passes the improvement state log so benchmark runs append reducer-visible `benchmark_run` rows |
| `004-adversarial-playbook-scenarios` | Eight adversarial regression scenarios added to runtime and goal-plugin manual playbooks, each naming the regression test that must stay green |
| `005-tighten-playbook-pass-criteria` | High-risk manual testing pass criteria require EXIT 0 test evidence plus source confirmation, closing the inspection-only loophole |
| `006-p2-test-adequacy-and-source-only-audit` | JSONL append concurrency test races two child processes through the production append path behind a barrier |
| `007-fan-out-hardening` | Detached CLI fan-out gets review setup bindings, partial-output salvage retry, opt-in dangerous-sandbox bypass, leaf-only merge reconstruction, typed lag statuses, and regression/playbook coverage |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Each child validates independently via `validate.sh --strict` before being marked Complete.
- Each child names a runnable regression guard that fails when its fixed bug returns (adversarial-playbook contract, per this parent's own SC-002).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Aggregate, don't duplicate.** This parent plan references each child's own architecture decisions rather than re-deriving them.
- **Independent shipping.** Each child is scoped, tested, and validated on its own; the parent's role is sequencing and aggregate verification, not shared implementation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. `001-deep-improvement-rollback-hash-guard` — rollback hash-guard integrity.
2. `002-deep-improvement-promotion-safety` — promotion safety gate.
3. `003-model-benchmark-reducer-ledger` — benchmark reducer ledger.
4. `004-adversarial-playbook-scenarios` — adversarial playbook scenarios.
5. `005-tighten-playbook-pass-criteria` — tightened playbook pass-criteria.
6. `006-p2-test-adequacy-and-source-only-audit` — P2 test-adequacy and source-only audit.
7. `007-fan-out-hardening` — detached CLI fan-out hardening.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each child owns its own test suite and regression guard (see each child's own `plan.md` §5 for detail). Parent-level verification is `validate.sh --strict` on all 7 children independently, confirmed in this folder's own `implementation-summary.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phases 002-007 (loop-system improvements) must ship before this remediation phase, per this folder's own `spec.md` Dependencies note.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each child has its own rollback plan (revert its own commit; no shared state migration across children). This parent aggregate has no rollback of its own beyond reverting this documentation update.
<!-- /ANCHOR:rollback -->
