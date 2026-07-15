---
title: "Implementation Plan: Daemon Launcher & Lifecycle Remediation"
description: "Approach for remediating this sub-phase's 15 deep-review findings: confirm-then-fix each cited location, vitest in the isolated fake-root harness; no live recycles. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/002-daemon-launcher-lifecycle"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase plan from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
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
# Implementation Plan: Daemon Launcher & Lifecycle Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Remediate the 15 findings in tasks.md. For each: open the cited `file:line`, confirm the defect, apply the registry recommendation (or record refuted-with-reason), and verify.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Capture the subsystem test baseline BEFORE edits; re-run the whole gate after each fix; report baseline→after delta.
- vitest in the isolated fake-root harness; no live recycles.
- No working-tree change outside the cited files + their tests.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Each fix mirrors an existing correct pattern in a sibling module where one exists (e.g. save-lock liveness in `generate-context.ts`, launcher reclaim in `mk-skill-advisor-launcher.cjs`, causal-generation bump in `causal-generation.ts`) rather than inventing mechanisms.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Confirm**: re-open each cited finding; mark real vs refuted.
- **Fix**: apply recommendations P1-first, then P2; each on its own test-gated commit.
- **Verify**: vitest in the isolated fake-root harness; no live recycles; update the registry finding status.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Vitest regression test per code fix (fails on old code, passes on fix); daemon-lifecycle fixes use the isolated fake-root harness.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Findings source: `../../review/fresh-regression-75/deep-review-findings-registry.json` + `fix-coverage.json`.
- Isolated daemon test harness for lifecycle/write-path fixes.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each fix is an isolated, test-gated commit — revert the specific commit to roll back. No data migrations; lifecycle changes validated in the harness before any deploy, so production daemons are untouched until separately recycled.
<!-- /ANCHOR:rollback -->
