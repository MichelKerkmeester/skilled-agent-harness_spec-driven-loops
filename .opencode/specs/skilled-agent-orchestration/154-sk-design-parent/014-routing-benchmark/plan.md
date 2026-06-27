---
title: "Plan: sk-design routing-efficiency benchmark across the five design modes"
description: "Execution plan for the benchmark-evidence phase: ran the routing-efficiency benchmark of the five sk-design modes two ways, deterministic router-replay (Mode A) and live dispatch via Kimi k2.7 (Mode B), captured the per-mode report pairs, and recorded the combined verdict table. Evidence and verdict only, executed, no sk-design content changed."
trigger_phrases:
  - "sk-design routing benchmark plan"
  - "design mode benchmark execution plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed the two-mode benchmark and captured the five report pairs as evidence"
    next_safe_action: "Benchmark evidence captured pending commit, RESOURCE_MAP trims route to a future phase"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-014-routing-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design routing-efficiency benchmark across the five design modes

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
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
| **Language/Stack** | Benchmark harness producing per-mode JSON and markdown report pairs |
| **Framework** | Two scoring modes: Mode A deterministic router-replay (CI gate), Mode B live dispatch via Kimi k2.7 over opencode |
| **Storage** | `014-routing-benchmark/<mode>/skill-benchmark-report.{json,md}` for the five design modes |
| **Testing** | The report pairs themselves are the evidence, and the combined verdict table is the recorded outcome |

### Overview
This is a benchmark-evidence phase, not a build. The five sk-design mode routers were measured two ways. Mode A replays each router deterministically and scores intent routing, discovery, efficiency, and connectivity. Mode B dispatches a live small model (Kimi k2.7) over opencode to walk the same packets and adds usefulness and the live composite. Each mode produced a `skill-benchmark-report.json` and a rendered `skill-benchmark-report.md`. The phase records the combined two-mode verdict table, explains the live-aggregate gap as the uniform intentRecall artifact, and names the one actionable follow-up: trim the RESOURCE_MAP fan-out for audit and md-generator. No sk-design skill content changes here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The five sk-design mode packets exist and are advisor-routable through the hub
- [x] The benchmark harness supports both Mode A deterministic replay and Mode B live dispatch
- [x] Kimi k2.7 over opencode is reachable for the live run

### Definition of Done
- [x] Each of the five modes has a `skill-benchmark-report.json` and `skill-benchmark-report.md` pair
- [x] The combined two-mode verdict table is recorded in `implementation-summary.md`
- [x] The plain-English findings (resource targeting, the intentRecall artifact, routing-economy variance) are recorded
- [x] The actionable RESOURCE_MAP trim for audit and md-generator is named and routed to a future phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-mode measurement over a fixed set of five packets: deterministic router-replay for the CI verdict, live small-model dispatch for usefulness and the live composite, then a single combined verdict table and one actionable follow-up. Evidence capture only, no packet mutation.

### Key Components
- **Mode A deterministic router-replay**: scores intent routing (D1 intra), discovery (D2), efficiency (D3), and connectivity (D5 hard gate) without a live model. This is the CI gate verdict.
- **Mode B live dispatch via Kimi k2.7**: walks each packet as a real small model, producing the live aggregate, resourceRecall, and the routed-vs-wasted resource counts.
- **Per-mode report pairs**: `skill-benchmark-report.json` (machine fields) and `skill-benchmark-report.md` (rendered narrative) for each of the five modes.
- **The combined verdict table**: the cross-mode summary recorded in `implementation-summary.md`, with the actionable routing-economy follow-up.

### Data Flow
The five sk-design mode packets feed the harness twice (Mode A replay and Mode B live dispatch via Kimi k2.7) -> each run writes the per-mode report pair -> the cross-mode reading is distilled into the combined verdict table and the plain-English findings -> the single actionable follow-up (trim the audit and md-generator RESOURCE_MAP fan-out) is named and routed forward.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase captured five benchmark report pairs and recorded the verdict. It changed no sk-design hub, mode packet, reference, asset, or router. The benchmark runs are read-only measurement over the existing packets.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-interface/skill-benchmark-report.{json,md}` | benchmark evidence | create | report pair present, Mode A 78 CONDITIONAL, live aggregate 70 |
| `design-foundations/skill-benchmark-report.{json,md}` | benchmark evidence | create | report pair present, Mode A 83 PASS, live aggregate 62 |
| `design-motion/skill-benchmark-report.{json,md}` | benchmark evidence | create | report pair present, Mode A 100 PASS, live aggregate 70 |
| `design-audit/skill-benchmark-report.{json,md}` | benchmark evidence | create | report pair present, Mode A 82 PASS, live aggregate 61, heavy fan-out |
| `design-md-generator/skill-benchmark-report.{json,md}` | benchmark evidence | create | report pair present, Mode A 76 CONDITIONAL, live aggregate 61, heaviest fan-out |
| sk-design hub and five mode packets | shipped skills | unchanged | no edit, this phase records evidence only |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the five sk-design mode packets are advisor-routable through the hub
- [x] Confirm the harness supports Mode A deterministic replay and Mode B live dispatch
- [x] Confirm Kimi k2.7 over opencode is reachable for the live run

### Phase 2: Core Implementation
- [x] Run Mode A deterministic router-replay across all five modes and capture the per-mode reports
- [x] Run Mode B live dispatch via Kimi k2.7 across all five modes and capture the per-mode reports
- [x] Record the combined two-mode verdict table in `implementation-summary.md`

### Phase 3: Verification
- [x] Confirm each of the five modes has both `skill-benchmark-report.json` and `skill-benchmark-report.md`
- [x] Record the plain-English findings: strong resource targeting, the intentRecall live artifact, and the routing-economy variance
- [x] Name the actionable RESOURCE_MAP fan-out trim for audit and md-generator and route it to a future phase, noting it matches the GPT-5.5 improvement research
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deterministic | Mode A router-replay across five modes | benchmark harness CI gate (intent routing, discovery, efficiency, connectivity) |
| Live | Mode B dispatch across five modes | Kimi k2.7 over opencode (live aggregate, resourceRecall, routed-vs-wasted) |
| Manual | Combined verdict and findings | cross-mode reading recorded in `implementation-summary.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The five sk-design mode packets | Internal | Green | Nothing to benchmark |
| Kimi k2.7 over opencode | External | Green | Mode B live dispatch cannot run |
| `../015-per-skill-improvement-research` | Internal | Green | The actionable follow-up loses its independent cross-check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A report pair is missing or corrupt, or the verdict table misreads the live aggregate as a quality drop.
- **Procedure**: The report pairs are additive evidence files, so deleting them reverts the capture. No sk-design content was mutated, so there is nothing to revert in the skill tree. If a reading is wrong, correct the verdict table and findings in `implementation-summary.md` without touching the underlying reports.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
