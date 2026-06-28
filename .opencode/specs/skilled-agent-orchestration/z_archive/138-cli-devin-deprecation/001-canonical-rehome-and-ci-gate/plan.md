---
title: "Plan: Phase 1: canonical-rehome-and-ci-gate"
description: "Technical plan for cli-devin deprecation phase 1"
trigger_phrases:
  - "phase 1 plan"
  - "canonical-rehome-and-ci-gate plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-cli-devin-deprecation/001-canonical-rehome-and-ci-gate"
    last_updated_at: "2026-06-08T17:36:07.655Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 1 plan executed"
    next_safe_action: "Proceed to phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 1: canonical-rehome-and-ci-gate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Re-home cli-devin's 5 canonical pattern assets into sk-prompt-models, repoint consumers, and patch the CI gate so deletion is safe. Verified line-resolved edit list: ../context/context-report.md §2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Every edit applied READ-first, scope-locked to named files.
- No dangling references, no broken syntax, no half-removed blocks.
- Verification command (below) passes before phase is marked complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Surgical reference/edit removal across the cli-devin active-wiring surface; no new abstractions. Canonical content that other skills depend on is re-homed rather than deleted (phase 1). Runtime executor union shrinks from 5 to 4 kinds; remaining executors unaffected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Re-home context-budget.md + per-model-budgets.json (swe-1.6 dropped)
2. Re-home output-verification.md, confidence-scoring-rubric.md, quota-fallback.md
3. Repoint cli-opencode sentinel + prompt_templates + sk-prompt-models SKILL.md + pattern-index
4. Remove cli-devin from check-prompt-quality-card-sync.sh arrays
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification command:

```bash
bash .opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh  # exit 0 (GUARD PASS); jq empty sk-prompt-models/assets/per-model-budgets.json
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Predecessor phase complete (see ../spec.md phase map).
- Context Report (../context/context-report.md) as the authoritative edit list.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing is committed during execution; `git restore`/`git checkout` reverts the working-tree changes. Re-homed assets and the deleted skill directory are recoverable from git history until the operator commits.
<!-- /ANCHOR:rollback -->
