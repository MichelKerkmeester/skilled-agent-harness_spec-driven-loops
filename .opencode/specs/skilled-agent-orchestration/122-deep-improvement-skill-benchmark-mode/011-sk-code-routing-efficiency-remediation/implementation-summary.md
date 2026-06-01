---
title: "Implementation Summary: sk-code Routing-Efficiency Remediation (planned)"
description: "Progress record for the sk-code D3/D4 remediation phase. Phase created and planned; the 5-iteration MiniMax deep-research pass is the next action and no router change has been made yet."
trigger_phrases:
  - "sk-code remediation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deep research converged (3 native-Opus iters); recommend H1 surface-nested map + full cross-surface overlay + H4 intra-surface ranking + asset deferral"
    next_safe_action: "Open follow-on BUILD phase to implement the surface-nested router behind the baseline-floor D2 guard"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/smart_routing.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-routing-efficiency-remediation"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-code Routing-Efficiency Remediation (planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 (research) |
| **Status** | Planned — deep research pending |
| **Date** | 2026-06-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No sk-code change yet, by design. This phase scoped the problem and ran the research:

- `spec.md` / `plan.md` frame the D3 over-routing + D4 task-dependence problem and the four hypotheses.
- A 3-iteration native-Opus `@deep-research` loop ran to convergence; findings synthesized in `research/research.md`.

**Recommendation (decision-ready):** adopt **H1 (surface-nested `RESOURCE_MAP`)** as the primary fix with a mandatory **full, unranked cross-surface overlay**, plus **H4 intra-surface intent-score ranking** (references only) and **`assets/*` deferral**. H3 folds into H4 (no replay trigger); H2 (phase-gating) is deferred (weak signal, hard implementation-trio contract). Root cause: the `RESOURCE_MAP` unions resources across surfaces under an intent-only key; the cross-surface half is the waste (and is net-negative on routine tasks per D4). The router change is a follow-on BUILD phase, gated on the regression guard below.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep research | 3 native-Opus iterations, converged at the planned stop |
| Deliverable | `research/research.md` — ranked H1-H4, one recommendation, regression guard, honest limits |
| Router change | deferred to a follow-on BUILD phase, gated on the baseline-floor D2 guard + green drift test |
<!-- /ANCHOR:verification -->
