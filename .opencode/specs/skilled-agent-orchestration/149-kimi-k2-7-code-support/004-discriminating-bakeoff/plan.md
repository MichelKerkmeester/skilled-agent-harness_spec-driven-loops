---
title: "Implementation Plan: Phase 4: discriminating-bakeoff [template:level_1/plan.md]"
description: "Clone the framework-bakeoff profile onto invalid-dominant strict validators with a 0.0 correctness gate, run it as 007 through the sweep engine with throttled serial real Kimi dispatches, then promote the separating result into the registry and reference docs."
trigger_phrases:
  - "kimi bakeoff plan"
  - "strict validator profile"
  - "sweep engine throttled serial"
  - "promote run 007"
  - "phase 004 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/004-discriminating-bakeoff"
    last_updated_at: "2026-06-15T16:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Ran bakeoff 007; costar promoted, rcaf retired"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-discriminating.json"
      - ".opencode/skills/sk-prompt-models/benchmarks/007-kimi-k2.7-discriminating/aggregate.json"
      - ".opencode/skills/sk-prompt-models/references/models/kimi-k2.7-code.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-004-discriminating-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: discriminating-bakeoff

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (deep-loop sweep engine), JSON profiles |
| **Framework** | deep-loop-workflows `sweep-benchmark.cjs` (framework-bakeoff mode) |
| **Storage** | JSON run outputs under `sk-prompt-models/benchmarks/` |
| **Testing** | Deterministic code oracle (5dim scorer) plus the spec-kit strict validator |

### Overview
Clone the framework-bakeoff profile, retarget it to invalid-dominant strict validators, and drop the correctness gate to 0.0 so frameworks rank on graded correctness instead of getting filtered. Run it through the sweep engine with throttled serial real `kimi-for-coding/k2p7` dispatches, then promote the separating result into the registry and the kimi reference docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Profile-driven benchmark sweep. The profile is data; the sweep engine is unchanged.

### Key Components
- **Discriminating profile**: 5 frameworks x 3 strict-validator fixtures x 6 samples, `correctnessGate.threshold 0.0`, 5dim scorer
- **Sweep engine**: `sweep-benchmark.cjs` in framework-bakeoff mode, grouping by framework, emitting a leaderboard and trust verdict
- **Deterministic oracle**: scores each generated solution against the validator fixtures so correctness is objective, not judged
- **Promotion target**: `kimi-k2.7-code` block in `model-profiles.json`, mirrored in the reference doc and index

### Data Flow
The profile selects the fixtures and frameworks, the sweep engine dispatches real Kimi generations per cell, the oracle scores each cell, and the aggregator produces the per-framework correctness leaderboard and TIE/separation verdict. The orchestrator then reads the leaderboard and edits the registry data, then mirrors it into the reference doc and index.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase corrects a saturated benchmark result and changes a shared prompt-framework default, so the registry, reference doc, and index all observe the change and must stay in parity.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `model-profiles.json` `kimi-k2.7-code.recommended_frameworks` | Source of truth for the dispatch default | update to costar/tidd-ec/avoid-rcaf, status empirical | `rg -n 'kimi-k2.7-code|"primary": "costar"|"status": "empirical"' model-profiles.json` |
| `references/models/kimi-k2.7-code.md` | Human-facing framework guidance | update §1/§3/§4/§5 to costar + run 007 | `rg -n 'COSTAR|benchmark 007|leaderboard' kimi-k2.7-code.md` |
| `references/models/_index.md` | Model status index | update Kimi row to empirical (benchmark 007) | `rg -n 'kimi-k2.7-code.*empirical.*007' _index.md` |
| `sweep-benchmark.cjs` | Bakeoff engine | unchanged (scope lock) | no diff against engine |

Required inventories:
- Same-class producers: `rg -n 'recommended_frameworks' .opencode/skills/sk-prompt-models/assets/model-profiles.json`.
- Consumers of the changed default: `rg -n 'kimi-k2.7-code' .opencode/skills/sk-prompt-models --glob '*.md' --glob '*.json'`.
- Card-sync guard: `check-prompt-quality-card-sync.sh` proves registry/reference parity for prompt-framework choices.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Profile
- [x] Clone `framework-bakeoff.json` to `kimi-k2.7-discriminating.json`
- [x] Retarget fixtures to the invalid-dominant strict validators (T4 selection)
- [x] Drop `correctnessGate.threshold` to 0.0 and raise samples/cell to 6

### Phase 2: Run
- [x] Run `007-kimi-k2.7-discriminating` through the sweep engine
- [x] Throttle to serial real `kimi-for-coding/k2p7` dispatches with per-fixture persistence
- [x] Recover resiliently from an external kill and a mid-flight throttle-bug fix

### Phase 3: Promote and verify
- [x] Edit the registry `kimi-k2.7-code` block to the separating result
- [x] Mirror §1/§3/§4/§5 of the reference doc and the `_index.md` row
- [x] Strict-validate this phase and the parent
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Correctness | Each framework x fixture cell | Deterministic 5dim code oracle behind a 0.0 gate |
| Separation | Per-framework leaderboard and trust verdict | Sweep aggregator (margin, noise floor, 90% CI) |
| Doc parity | Registry vs reference doc vs index | `check-prompt-quality-card-sync.sh`; strict `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sweep-benchmark.cjs` (framework-bakeoff mode) | Internal | Green | No bakeoff run possible |
| Strict-validator fixtures | Internal | Green | Cannot discriminate frameworks |
| `kimi-for-coding/k2p7` live dispatch | External | Green | No real generations to score |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The promoted default proves wrong, or the run is found unsound.
- **Procedure**: Revert the `kimi-k2.7-code` block in `model-profiles.json` and the matching reference-doc and index edits to the prior `rcaf` / `default-unverified` state; the profile and run outputs are additive and can stay as evidence.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
