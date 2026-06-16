---
title: "Implementation Plan: Fresh+Regression Deep-Review Remediation"
description: "Phased remediation of the 5 confirmed code defects, parent-metadata drift, and asserted doc-truth P1s from the 027 fresh+regression deep-review — code fixes first (each test-gated), metadata reconciliation second, doc-truth confirm-then-fix last."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded remediation plan from verified deep-review findings"
    next_safe_action: "Confirm asserted doc P1s, then fix the 5 code defects first"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fresh+Regression Deep-Review Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Remediate the verified findings from `review/fresh-regression-75/` in three phases: (A) the 5 adversarially-confirmed code defects, each with a regression test; (B) parent control-metadata reconciliation; (C) confirm-then-fix the ~19 asserted doc-truth P1s. Fixes are scoped to the cited file:line plus their direct callers; no feature work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Capture the full stack-appropriate test baseline BEFORE any change; re-run the whole gate after each fix; report baseline→after delta.
- Each code defect gets a regression test that fails on the old code and passes on the fix.
- `validate.sh --strict --recursive` clean for the 027 tree after metadata reconciliation.
- No working-tree changes outside the cited files + their tests + this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The defects span three subsystems: mk-spec-memory write-path (`spec-folder-mutex`, `history`, `vector-index-mutations`, `pe-gating`), the daemon launchers (`mk-code-index-launcher`, `mk-spec-memory-launcher`), and spec-folder control metadata (description.json / spec.md / graph-metadata). Each fix mirrors an existing correct pattern in a sibling module (e.g. the `generate-context.ts` save-lock) rather than inventing new mechanisms.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Phase A — code defects (P1):** R1 save-lock liveness → R2 history transaction → R3 causal-generation bump → R4 launcher TTL retune → R5 provenance carry. Each on its own commit with a regression test.
- **Phase B — metadata reconciliation:** R6 add 3 omitted children, refresh pointers, correct tool count; re-run validate --strict --recursive.
- **Phase C — doc-truth confirm-then-fix:** R7 walk the ~19 asserted P1s + the 1 unverified P1; fix confirmed, mark refuted-with-reason.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Vitest regression tests per code defect (lock-liveness under live owner, history rebuild crash-safety, causal-generation bump on delete, launcher reclaim timing, provenance carry on append). Daemon-lifecycle changes use the isolated fake-root test harness, never live recycles. Metadata via `validate.sh --strict`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The 5 code fixes depend on the isolated daemon test harness (no live recycles).
- Metadata reconciliation (R6) depends on `generate-context.js` / `validate.sh --strict --recursive`.
- R7 depends on the findings registry + Round-2 verdicts under `../../review/fresh-regression-75/`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each fix is an isolated, test-gated commit on the 027 branch — revert the specific commit to roll back. Metadata edits are reversible via git. No data migrations; daemon-lifecycle changes are validated in the fake-root harness before any deploy, so production daemons are untouched until separately recycled.
<!-- /ANCHOR:rollback -->
