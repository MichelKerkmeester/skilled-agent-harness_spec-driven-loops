---
title: "Implementation Summary: Phase 1: canonical-rehome-and-ci-gate"
description: "Completed-work record for cli-devin deprecation phase 1"
trigger_phrases:
  - "phase 1 implementation"
  - "canonical-rehome-and-ci-gate summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/111-cli-devin-deprecation/001-canonical-rehome-and-ci-gate"
    last_updated_at: "2026-06-08T17:38:17.105Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 1 implementation complete"
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
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Phase 1: canonical-rehome-and-ci-gate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 1 of 6 |
| **Status** | Complete |
| **Completed** | 2026-06-08 |
| **Parent** | 138-cli-devin-deprecation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- context-budget.md + per-model-budgets.json re-homed to sk-prompt-models (swe-1.6 dropped)
- output-verification.md + confidence-scoring-rubric.md + quota-fallback.md re-homed + de-cli-devin'd
- cli-opencode sentinel + prompt_templates + SKILL.md + pattern-index repointed
- check-prompt-quality-card-sync.sh cli_cards + cli_skills cleaned
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Executed in a dependency-ordered wave of parallel file-cluster seats (by file ownership, no write conflicts), then host-verified. Edits were READ-first and scope-locked to the named files per the Context Report (`../context/context-report.md` §2). Phase boundaries map to the Context Report clusters.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Re-home (not delete) the 5 canonical assets because sk-prompt-models + cli-opencode reference them as source-of-truth; target = sk-prompt-models/references|assets (D3).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

check-prompt-quality-card-sync.sh exit 0 (GUARD PASS); jq empty per-model-budgets.json; grep 0 dead cli-devin canonical links
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- sqlite advisor graph rebuild deferred to next daemon start.
<!-- /ANCHOR:limitations -->
