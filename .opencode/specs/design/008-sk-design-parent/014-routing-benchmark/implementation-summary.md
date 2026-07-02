---
title: "Implementation Summary: sk-design routing-efficiency benchmark across the five design modes"
description: "Executed. Ran the routing-efficiency benchmark of the five sk-design modes two ways, deterministic router-replay (Mode A) and live dispatch via Kimi k2.7 (Mode B). Resource targeting is strong across all modes, the live-aggregate gap is the uniform intentRecall artifact, and audit and md-generator carry heavy RESOURCE_MAP fan-out. The actionable follow-up is a fan-out trim for those two modes."
trigger_phrases:
  - "sk-design routing benchmark verdict"
  - "design mode benchmark outcome"
importance_tier: "important"
contextType: "implementation"
status: executed
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/014-routing-benchmark"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the combined two-mode verdict table and the routing-economy finding"
    next_safe_action: "Benchmark evidence captured pending commit, RESOURCE_MAP trims route to a future phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-014-routing-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Two scoring modes reconciled: Mode A deterministic router-replay is the CI gate, Mode B live dispatch via Kimi k2.7 folds in intentRecall which reads 0 across all modes as a measurement artifact"
      - "Routing economy is the actionable signal: audit and md-generator are heavy fan-out and route to a future RESOURCE_MAP trim"
---
# Implementation Summary: sk-design routing-efficiency benchmark across the five design modes

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-routing-benchmark |
| **Completed** | Executed: two-mode benchmark run across five modes, ten report files captured, verdict table recorded |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A routing-efficiency benchmark of the five sk-design modes, run two ways, with the evidence captured as per-mode report pairs and the outcome recorded as the verdict table below.

### The two modes
- **Mode A: deterministic router-replay.** The CI gate. It replays each mode's router and scores intent routing, discovery, efficiency, and connectivity (a hard gate) without a live model. This produces the Mode A score and verdict.
- **Mode B: live dispatch via Kimi k2.7 over opencode.** A live small model walks each packet as a real task would. This produces the live aggregate, resourceRecall, the routing-economy d3 reading, and the routed-vs-wasted resource counts per query.

### Evidence captured (10 files)
Each of the five modes has a `skill-benchmark-report.json` (machine fields) and a `skill-benchmark-report.md` (rendered narrative):
- `design-interface/skill-benchmark-report.{json,md}`
- `design-foundations/skill-benchmark-report.{json,md}`
- `design-motion/skill-benchmark-report.{json,md}`
- `design-audit/skill-benchmark-report.{json,md}`
- `design-md-generator/skill-benchmark-report.{json,md}`

### Verdict table

| Mode | Mode A score | Mode A verdict | Kimi live agg | resourceRecall | routing economy (d3) | routed / wasted per query |
|------|-----|------|-----|------|------|------|
| design-motion | 100 | PASS | 70 | 0.78 | 0.81 | 2.67 / 0.67 |
| design-foundations | 83 | PASS | 62 | 0.83 | 0.42 | 2.50 / 1.50 |
| design-audit | 82 | PASS | 61 | 0.93 | 0.26 | 4.71 / 3.71 |
| design-interface | 78 | CONDITIONAL | 70 | 0.90 | 0.57 | 2.93 / 1.71 |
| design-md-generator | 76 | CONDITIONAL | 61 | 0.88 | 0.32 | 7.00 / 5.31 |

No sk-design skill content was changed by this phase. All docs are HVR-clean (no em dashes, no semicolons, no Oxford commas).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The benchmark harness ran over the five sk-design mode packets twice. Mode A replayed each router deterministically for the CI verdict. Mode B dispatched Kimi k2.7 over opencode to walk the same packets live. Each run wrote a per-mode report pair, and the cross-mode reading was distilled into the verdict table above plus the findings below. The phase records evidence and does not act on it, so the only follow-up is named and routed forward rather than built here. The findings line up with the independent GPT-5.5 deep-research runs in the sibling phase `../015-per-skill-improvement-research`, which separately called for checked-in benchmark fixtures and flagged the same heavy fan-out branches.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run the benchmark two ways | Deterministic router-replay gives a stable CI verdict, and a live small-model walk surfaces usefulness and real resource economy that a replay cannot. The two together separate router correctness from router economy |
| Treat Mode A as the gate verdict | Mode A is reproducible and free of live-model variance, so it is the right pass-fail signal. The live numbers are diagnostic, not the gate |
| Read the live-aggregate gap as a measurement artifact, not a quality drop | The live composite folds in intentRecall, which reads 0 across all five modes because the live model loads the right resources directly instead of emitting intent-key labels. The gap is uniform, so it is not a per-skill quality signal |
| Make routing economy the actionable signal | resourceRecall is strong everywhere, so the real spread is in how many resources each router pulls per query and how many are wasted. That is where the leverage is |
| Name the fan-out trim and route it forward, do not build it here | This is a benchmark-evidence phase. Acting on the evidence (trimming the audit and md-generator RESOURCE_MAP) belongs to a build phase, cross-checked against the GPT-5.5 improvement research |
| Keep the report pairs checked in as the first fixture set | The sibling research found no mode had its claimed score backed by checked-in fixtures. These ten files are that first evidence set |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five `skill-benchmark-report.json` files present | PASS (one per mode) |
| Five `skill-benchmark-report.md` files present | PASS (one per mode) |
| Mode A deterministic router-replay run across five modes | PASS (verdicts: motion 100 PASS, foundations 83 PASS, audit 82 PASS, interface 78 CONDITIONAL, md-generator 76 CONDITIONAL) |
| Mode B live dispatch via Kimi k2.7 run across five modes | PASS (live aggregates 61 to 70, scoringMethod mode-b-live, trace live in each report.json) |
| Resource targeting strong across all modes | PASS (resourceRecall 0.78 to 0.93) |
| Live-aggregate gap explained as the intentRecall artifact | PASS (intentRecall 0 uniform across modes, recorded as a live-mode caveat) |
| Routing-economy variance recorded | PASS (motion lean at d3 0.81, audit and md-generator heavy at 0.26 and 0.32) |
| Actionable follow-up named and routed | PASS (trim the audit and md-generator RESOURCE_MAP fan-out, routed to a future phase, matches the GPT-5.5 research) |
| `validate.sh --strict` on this packet | PASS (0 errors) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live aggregate carries a uniform intentRecall artifact.** Live mode scores intentRecall at 0 across every mode because the model loads the right resources directly rather than emitting intent-key labels. The live aggregate is therefore depressed by a fixed amount and should not be read as a per-skill quality drop. Adding an intent-label probe to live mode is a future benchmark-harness question.
2. **Mode B is live-model dependent.** The Kimi k2.7 numbers reflect one live model over opencode at run time. A different live model or a later run can shift the live aggregate. Mode A is the stable verdict.
3. **The fan-out trim is not built here.** This phase records that audit (about 4.7 routed, 3.7 wasted per query) and md-generator (about 7.0 routed, 5.3 wasted per query) carry heavy RESOURCE_MAP fan-out. Trimming it is the named follow-up and routes to a build phase, not this evidence phase.
4. **These reports are the first fixture set, not a full suite.** They back the current scores per mode, but broader scenario coverage and a standing fixture suite remain future work that the sibling research also flagged.
<!-- /ANCHOR:limitations -->
