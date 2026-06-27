---
title: "Tasks: sk-design routing-efficiency benchmark across the five design modes"
description: "Task list for the benchmark-evidence phase: ran the routing-efficiency benchmark of the five sk-design modes two ways, captured the per-mode report pairs, and recorded the combined verdict table. All tasks done, evidence captured."
trigger_phrases:
  - "sk-design routing benchmark tasks"
  - "design mode benchmark evidence tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the benchmark runs and recorded the verdict table"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design routing-efficiency benchmark across the five design modes

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the five sk-design mode packets (design-interface, design-foundations, design-motion, design-audit, design-md-generator) are advisor-routable through the hub
- [x] T002 Confirm the benchmark harness supports Mode A deterministic router-replay and Mode B live dispatch
- [x] T003 Confirm Kimi k2.7 over opencode is reachable for the Mode B live run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Ran Mode A deterministic router-replay across all five modes (intent routing, discovery, efficiency, connectivity hard gate) and captured the per-mode reports
- [x] T005 [P] Ran Mode B live dispatch via Kimi k2.7 over opencode across all five modes (live aggregate, resourceRecall, routed-vs-wasted) and captured the per-mode reports (`design-{interface,foundations,motion,audit,md-generator}/skill-benchmark-report.{json,md}`)
- [x] T006 Recorded the combined two-mode verdict table in `implementation-summary.md` (`implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirmed each of the five modes has both `skill-benchmark-report.json` and `skill-benchmark-report.md`, ten report files total
- [x] T008 Recorded the plain-English findings: strong resource targeting across all modes (recall 0.78 to 0.93), the live-aggregate gap explained by the uniform intentRecall measurement artifact, and the sharp routing-economy variance singling out audit and md-generator
- [x] T009 Named the actionable RESOURCE_MAP fan-out trim for audit and md-generator and routed it to a future phase, noting it matches the independent GPT-5.5 improvement research in `../015-per-skill-improvement-research`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The five report pairs are captured and the combined verdict table plus findings are recorded as the acceptance evidence

### Status note

This packet is EXECUTED. The routing-efficiency benchmark ran across all five sk-design modes two ways: Mode A deterministic router-replay (the CI gate) and Mode B live dispatch via Kimi k2.7 over opencode. Each mode produced a `skill-benchmark-report.json` and `skill-benchmark-report.md` pair, ten files total. The combined two-mode verdict table is recorded in `implementation-summary.md`. Resource targeting is strong across every mode (resourceRecall 0.78 to 0.93). The live aggregate sits about 15 to 20 points below the Mode A score because the live composite folds in intentRecall, which reads 0 across all modes as a uniform measurement artifact (the live model loads the right resources directly instead of emitting intent-key labels), so it is not a per-skill quality signal. Routing economy varies sharply: motion is lean and audit and md-generator are heavy. The one actionable follow-up, trim the RESOURCE_MAP fan-out for audit and md-generator, is named and routed to a future phase, and it matches the independent GPT-5.5 improvement research.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verdict**: See `implementation-summary.md`
- **Independent cross-check**: See `../015-per-skill-improvement-research/00N-<mode>/research/lineages/gpt55fast/research.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
