---
title: "Implementation Plan: Skill Advisor P1 Routing & Abstention Tuning"
description: "Per-class approach for the residual P1 fixes, each guarded by the regression + parity harnesses and implemented class by class with a verify-after-each loop."
trigger_phrases:
  - "p1 routing tuning plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/006-p1-routing-tuning"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p1-tuning"
    recent_action: "Specced per-class approach + regression guard"
    next_safe_action: "Implement class by class"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Skill Advisor P1 Routing & Abstention Tuning

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (fusion.ts) + Python (skill_advisor.py) |
| **Framework** | system-skill-advisor dual scorer |
| **Storage** | regression fixtures JSONL + labeled corpus JSONL |
| **Testing** | skill_advisor_regression.py + advisor-validate + vitest (parity + scorer) |

### Overview
Five targeted, independent signal changes (one per root-cause class), applied to both scorers where the behavior is shared and to the lagging scorer where the gap is parity-only. Each is implemented and verified in isolation so a regression can be reverted at the class granularity.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Per-case root cause captured with live-vs-intended evidence (spec §3)
- [x] Regression guard identified (regression harnesses + parity tests)

### Definition of Done
- [x] Targeted P1 rows route/abstain as intended in both scorers (0 failures / 50 cases each)
- [x] P0 stays 12/12 in both scorers; parity tests green; no corpus row lost
- [x] Adversarial routable guards added (P2-BREADTH-GUARD-001/002) for the Class C breadth abstention
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scorer-layer behavioral fix; five small, independent class changes behind the existing routing/abstention machinery (primaryIntentBonus / phrase boosters / low-info abstention).

### Key Components
- **Class A** — domain phrase signals: lift mcp-code-mode (webflow/cms/fetch-collection), deep-agent-improvement (5d scoring / dynamic profile / integration scan), system-code-graph (structural search / find code). Port Python's existing phrase boosters to TS for parity; add the genuinely-missing ones to both.
- **Class B** — code-edit context (update/edit + script/file) beats the cli-opencode keyword in Python.
- **Class C** — breadth detector: broad greenfield ("build full stack X service") + multi-concern ("optimize X speed and quality") -> abstain, gated narrowly to avoid over-abstention.
- **Class D** — recognize `:review:auto` / "auto ... review" loop syntax -> deep-review.
- **Class E** — "audit" + review-target tokens -> sk-code-review over system-skill-advisor / deep-review.

### Data Flow
Prompt -> lane/keyword scores -> per-class signal adjusts confidence/ranking or abstention -> threshold filter. Each class touches only its own signal path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fusion.ts` primaryIntentBonus / abstention | TS routing | add Class A/C/D/E signals | regression P1 rows + P0 12/12 |
| `skill_advisor.py` boosters / disambiguation | Python routing | add Class A/B/C/D/E signals | regression P1 rows + P0 12/12 |
| `scoring-constants.ts` | TS calibration | add constants for new signals | tsc + scorer vitest |
| regression fixtures | P1 + adversarial rows | add routable + abstain guards | new fixtures pass |

Required inventories:
- Same-class producers: `rg -n 'primaryIntentBonus|PHRASE_INTENT_BOOSTERS|_apply_.*disambiguation' lib/scorer scripts/skill_advisor.py`.
- Consumers of changed symbols: re-run both regression harnesses + parity vitest after each class.
- Matrix axes: each class x each scorer x (intended row + an adversarial neighbour that must NOT change).
- Algorithm invariant (Class C): breadth-abstention must fire only on genuinely under-specified multi-concern prompts; enumerate routable near-neighbours that must still route.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-confirmed per-class live behavior (cli-codex gpt-5.5 xhigh design review)
- [x] Resolved Class A approach (direct-lane anchors + ranking) and Class D (colon-syntax is distinct)

### Phase 2: Core Implementation (class by class, verify after each)
- [x] Class A: domain anchors (direct lane + ranking), both scorers + parity
- [x] Class B: code-edit beats cli-opencode (Python)
- [x] Class D + E: `:review:auto` deep-loop syntax + review-target disambiguation
- [x] Class C: breadth/multi-concern abstention (narrowly gated, adversarial guards)

### Phase 3: Verification
- [x] Both regression harnesses: 0 failures / 50 cases, P0 12/12, no regression
- [x] Parity + full vitest 66/66; Python unit 57/0; tsc + alignment verifier PASS
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | P1 rows + P0 | skill_advisor_regression.py + advisor-validate |
| Parity | TS<->Python corpus agreement | parity + corpus-parity vitest |
| Adversarial | over-abstention / over-fire neighbours | added fixtures |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Regression + parity harnesses | Internal | Green | The regression guard for every class |
| Phase 002/007 (P0 + alias) | Internal | Complete | This phase builds on the frozen P0 + alias layers |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: P0 regression, parity break, or over-abstention on a routable neighbour.
- **Procedure**: Each class is an independent signal; revert the offending class's edit without disturbing the others.
<!-- /ANCHOR:rollback -->
