---
title: "Plan: sk-code Routing-Efficiency and Usefulness Remediation"
description: "Research plan and candidate remediation hypotheses for sk-code over-routing (D3) and task-dependent usefulness (D4), investigated by a 3-iteration native-Opus deep-research pass before any router change."
trigger_phrases:
  - "sk-code remediation plan"
  - "surface-slice research plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research converged; recommendation recorded"
    next_safe_action: "Implement in the follow-on BUILD phase 012"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-routing-efficiency-remediation"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Plan: sk-code Routing-Efficiency and Usefulness Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Research first, change second. A 3-iteration native-Opus deep-research pass investigated how to tighten sk-code's resource loading before any router edit, then recommended one approach with a recall-vs-efficiency frontier and a D1/D2 regression guard. The build is the follow-on phase 012.

### Technical Context
The research consumes the live benchmark evidence (`sk-code/benchmark/live-final/`) and the documented surface-flattening tradeoff in `smart_routing.md` §11. It dispatched native `@deep-research` (Opus) iterations and externalized state under `research/`.

### Overview
Four hypotheses were weighed; the converged recommendation is a surface-nested `RESOURCE_MAP` (H1) with a full unranked cross-surface overlay, intra-surface intent-score ranking (H4), and asset deferral.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
The live benchmark D3/D4 evidence exists and the §11 router + its flattening tradeoff are read.

### Definition of Done
`research/research.md` ranks the approaches, names one recommendation with its tradeoff against the surface-flattening behavior, and states a D1/D2 regression guard + a cross-surface non-starvation safeguard.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evaluator-first research: rank candidate remediations against D3-reduction, D1/D2 preservation, cross-surface non-starvation, and cost/risk.

### Key Components
The four hypotheses — H1 surface×concern slicing, H2 phase-gated loading, H3 lazy/progressive loading, H4 anti-over-routing heuristic — plus the live evidence and the §11 router.

### Data Flow
Read evidence → weigh hypotheses per iteration → synthesize a ranked recommendation + regression guard → hand off to the BUILD phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- Research only — no surface is modified. The eventual change targets the sk-code OpenCode surface (`smart_routing.md` §11) + the skill-benchmark route builder.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Initialize the research state (config, strategy charter, iteration dirs) from the live benchmark evidence.

### Phase 2: Core Implementation
Run the 3 native-Opus deep-research iterations (root cause + structural H1/H2; dynamic H3/H4 + the frontier; synthesis + recommendation).

### Phase 3: Verification
Confirm convergence, the ranked recommendation, and the D1/D2 regression guard in `research/research.md`; hand off to the BUILD phase 012.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The research is validated by convergence (newInfoRatio trend 0.70 → 0.62 → 0.18) and by every finding citing a `file:line` or prior finding. The recommendation is testable: the BUILD phase re-runs the deterministic replay against the D2 baseline floors.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The live benchmark baseline (`sk-code/benchmark/live-final/`) and the §11 router doc.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not applicable — this phase is research only and mutates nothing outside its own `research/` artifacts. The eventual router change carries its own rollback (phase 012).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 → 2 (iterations read the initialized state) → 3 (synthesis reads the iterations). The BUILD phase 012 depends on this phase's recommendation.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Small: 3 native-Opus iterations + a synthesis pass. No code written this phase.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
Not applicable — nothing is deployed; the deliverable is `research/research.md`.

### Rollback Procedure
Delete the `research/` artifacts to discard the research; no other state is touched.

### Data Reversal
None — no persisted state or migration.
<!-- /ANCHOR:enhanced-rollback -->
