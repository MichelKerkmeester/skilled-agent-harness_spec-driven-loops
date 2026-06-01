---
title: "Implementation Summary: sk-code Routing-Efficiency Remediation (research complete)"
description: "Record for the sk-code D3/D4 remediation research phase. The 3-iteration native-Opus deep-research pass converged on a recommendation; the router change is the follow-on BUILD phase 012."
trigger_phrases:
  - "sk-code remediation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deep research converged (3 native-Opus iters); recommendation recorded in research/research.md"
    next_safe_action: "Implement the surface-nested router in the follow-on BUILD phase 012"
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
# Implementation Summary: sk-code Routing-Efficiency Remediation (research complete)

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 (research-then-remediate) |
| **Status** | Research complete — build deferred to phase 012 |
| **Date** | 2026-06-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No sk-code change — this phase scoped the problem and ran the research. A 3-iteration native-Opus `@deep-research` loop converged on a recommendation: a surface-nested `RESOURCE_MAP` (H1) with a shared `UNIVERSAL` tier, a full unranked cross-surface overlay, intra-surface intent-score ranking (H4, references only), and `assets/*` deferral. H3 folds into H4 (no replay trigger); H2 (phase-gating) is deferred (weak signal, hard implementation-trio contract).

### Files Changed (this build)
Research artifacts only: `research/research.md`, `research/iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`, `research/deltas/iter-00{1,2,3}.jsonl`, `research/deep-research-strategy.md`, `research/deep-research-state.jsonl`. No sk-code or harness file was modified.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three sequential native-Opus `@deep-research` iterations: (1) root cause + structural H1/H2; (2) dynamic H3/H4 + the quantified recall-vs-efficiency frontier; (3) synthesis + ranked recommendation. Each iteration read the prior state and cited every finding. The loop converged (newInfoRatio 0.70 → 0.62 → 0.18).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Root cause = the intent-only cross-surface `RESOURCE_MAP` union; H1 surface-nesting is the primary fix.
- The cross-surface overlay is full + unranked (non-negotiable for CS-001 recall); H4 ranks intra-surface references only (no count cap).
- The D2 regression guard floors at the measured baseline (0.727 / 1.0 / 0.60), not 1.0, because recall was never 1.0.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Evidence |
|-------|----------|
| Deep research converged | 3 native-Opus iterations; newInfoRatio 0.70 → 0.62 → 0.18 |
| Deliverable | `research/research.md` — ranked H1-H4, one recommendation, regression guard, honest limits |
| Build verification | deferred to phase 012: `node scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-code --trace-mode router` + `npx vitest run` against the D2 floors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- D4 signal is n=2, single grader, directional only; a synthetic third routine scenario is a pre-generalization step.
- D2 = 1.0 may be unreachable without a gold↔map reconciliation (the sub-1.0 baselines are genuine misses).
- `assets/*` deferral improves scored D3 partly because assets are never scored gold (a benchmark-fidelity seam, tracked separately).
<!-- /ANCHOR:limitations -->
