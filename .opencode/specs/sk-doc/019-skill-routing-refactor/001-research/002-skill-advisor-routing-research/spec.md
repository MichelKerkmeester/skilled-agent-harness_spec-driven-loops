---
title: "Feature Specification: system-skill-advisor Routing Research"
description: "Deep-research packet that establishes how system-skill-advisor works, how useful it is (73.08% holdout accuracy, confidence policy-quantized at the 0.82 floor), and how it integrates into skill routing. Surfaces three P0 correctness defects and an unguarded metadata-hub discovery boundary. Hands a prioritized fix plan to sibling packet 013-skill-advisor-routing-fixes."
trigger_phrases:
  - "skill advisor routing research"
  - "advisor recommend confidence calibration"
  - "5-lane RRF fusion"
  - "shouldFireAdvisor threshold drift"
  - "advisor transport resilience"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/011-skill-advisor-routing-research"
    last_updated_at: "2026-07-16T08:20:00Z"
    last_updated_by: "claude"
    recent_action: "Closed research packet with prioritized fix-plan handoff"
    next_safe_action: "Plan 013-skill-advisor-routing-fixes against research.md Section 8"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-20260716-054704-skill-advisor-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-001: holdout 73.08%, confidence dominated by 0.82 floor"
      - "REQ-002: fallback chain traced, hook tests 4/11 red"
      - "REQ-003: no drift, separate eligibility gate confirmed"
      - "REQ-004: no, guard hard-codes deep-loop registry only"
      - "REQ-005: P0-1 through P2-8 delivered to 013"
---
# Feature Specification: system-skill-advisor Routing Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (research) |
| **Created** | 2026-07-16 |
| **Branch** | `011-skill-advisor-routing-research` |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Type** | Research packet (deep-research loop, 10/10 iterations complete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Tier-2 gpt-5.6-luna skill-benchmark found routing quality is strongly skill-specific, and system-skill-advisor is the front-line router that decides which skill fires. Whether the correct skill is found easily and confidently, at the right moment, depends on the advisor_recommend MCP path's 5-lane RRF fusion confidence pipeline, the 0.05 ambiguity margin, and the compat-contract thresholds that back CLAUDE.md Gate 2 (>=0.8 must-invoke) and Gate 1 (dual-threshold >=0.70 / <=0.35). Going in, it was unestablished whether that confidence was well-calibrated, whether the Claude-side hook brief and its CLI fallback held up when the MCP/daemon transport went unhealthy, whether the hook's shouldFireAdvisor gate and the MCP tool's threshold resolution stayed provably in sync, and whether the advisor's vocabulary stayed aligned with the hubs it routes to.

### Purpose
Establish how system-skill-advisor works today, how genuinely useful it is, and how it integrates into skill routing, then produce concrete, implementable improvements. This was a FOUNDATION phase running parallel to sibling packet `010-sk-doc-routing-research`. Its findings needed to land before the remaining per-skill routing phases could be researched.

### Outcome
Ten iterations answered all five charter questions with file:line evidence. The advisor is genuinely useful: current-source holdout accuracy sits at 73.08% (57/78) with 85.25% selective precision, and 78.21% coverage means its abstention behavior is meaningful rather than noise. But the confidence number CLAUDE.md Gate 2 treats as an >=0.8 must-invoke signal is dominated by categorical policy floors. The `0.82` task-intent floor led 31% of the full corpus and 48% of the frozen ambiguity slice at only 58-65% plateau correctness, so confidence >=0.8 means "policy floors fired," not "80% posterior."

The research surfaced three P0 correctness defects. The Claude hook's no-brief output contract drifted, leaving 4 of 11 targeted hook tests red. The CLI fallback can starve to 1 millisecond because the primary producer claims the full 2500 ms hook budget before the fallback gets whatever remains. Result-level `ambiguous: true` can coexist with an unattributed leader, because the executor-delegation override mutates rankings after `ambiguousWith` attribution but before the final ambiguity boolean, reproducing on 7 of 8 frozen executor routes. A fourth finding is architectural rather than a bug: routing-registry-drift-guard checks only system-deep-loop's projection, so metadata-routed hubs like sk-doc carry zero advisor-discovery coverage even while their hub-internal vocabulary stays perfectly aligned.

A 12-cell grid over confidence {0.78, 0.80, 0.82} and uncertainty {0.30, 0.35, 0.40} produced identical holdout outcomes, and pushing confidence to 0.84 destroyed 24 points of coverage for 2.85 points of precision. Threshold tuning cannot fix any of the four findings above. The prioritized fix plan (P0-1 through P2-8, `research/research.md` Section 8 through Section 10) hands off to sibling packet `013-skill-advisor-routing-fixes` for implementation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The advisor_recommend MCP path (`advisor-server.ts`, `tools/index.ts`) and its 5-lane RRF fusion confidence pipeline (`lib/scorer/fusion.ts`), the 0.05 ambiguity margin (`lib/scorer/ambiguity.ts`), and the compat-contract thresholds (`lib/compat/contract.ts`) backing Gate 2 and Gate 1, confidence calibration and lane-fusion saturation analysis
- The Claude-side user-prompt-submit hook advisor brief (`hooks/claude/user-prompt-submit.ts`, `lib/skill-advisor-brief.ts`) and its documented CLI fallback path for unhealthy MCP/daemon transport
- Provable sync (or drift) between the hook's shouldFireAdvisor gate (`lib/prompt-policy.ts`) and the MCP tool's threshold resolution, two independent call paths converging on the same compat-contract thresholds
- How routing-registry-drift-guard exercises parity against sk-doc's `hub-router.json` / `mode-registry.json` vocabulary, and whether the advisor's vocabulary stays aligned with the hubs it routes to

### Out of Scope
- Applying the fixes. The deliverable here is implementable findings. The build goes to `013-skill-advisor-routing-fixes`
- Per-skill routing research beyond the advisor's integration surface, a follow-on set of phases
- sk-doc hub-internal routing diagnosis, owned by sibling packet `010-sk-doc-routing-research`

### Files to Change
Research packet, no source changes. Deliverables live under `research/`: `research.md`, `deep-research-dashboard.md`, `findings-registry.json`, `iterations/`, `deltas/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Result |
|----|-------------|---------------------|--------|
| REQ-001 | Establish the advisor_recommend end-to-end pipeline and whether its fused confidence is well-calibrated or saturating/misleading | Lane weights, fusion math, and calibration evidence with file:line references | Answered: four-layer path and 5-lane weights traced (iteration 1). Holdout 73.08% (57/78), confidence dominated by the 0.82 task-intent floor at 58-65% plateau correctness (iteration 8) |
| REQ-002 | Establish how the Claude hook advisor brief works and whether the CLI fallback path survives an unhealthy MCP/daemon transport | Documented fallback chain traced in code with failure-mode evidence | Answered: fallback chain traced (iteration 3). Fallback budget starves to 1 ms and the no-brief output contract drifted, leaving 4/11 hook tests red |
| REQ-003 | Prove sync or find drift between shouldFireAdvisor gating and MCP threshold resolution | Both call paths traced to compat-contract sources, any divergence named with file:line | Answered: no drift. shouldFireAdvisor is a separate eligibility gate over the same `contract.ts` resolver (iteration 4) |
| REQ-004 | Assess routing-registry-drift-guard parity coverage against hub vocabulary | Yes/no with the specific missing check named if no | Answered: no. The guard hard-codes system-deep-loop's registry only. Metadata-routed hubs like sk-doc carry zero advisor-discovery coverage (iteration 2) |
| REQ-005 | Deliver prioritized, implementable improvements to usefulness, confidence calibration, transport resilience, and routing integration | Each improvement names target file(s) and concrete change, tied to an evidenced failure mode | Delivered: P0-1 through P2-8 with target files, verification commands and an acceptance matrix, `research.md` Section 8 through Section 10, handed to `013-skill-advisor-routing-fixes` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All key research questions answered with file:line evidence in `research/research.md`. Met, 5/5 across iterations 1-10.
- **SC-002**: Prioritized improvement list exists where every item is implementable without further research. Met, `research.md` Section 8 through Section 10 (plan, verification commands, acceptance matrix).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation / Resolution |
|------|------|--------|------|
| Dependency | Tier-2 gpt-5.6-luna skill-benchmark grounding finding (routing quality is skill-specific) | The charter's premise needs the scored-run grounding to justify researching the advisor at all | Cited directly as the grounding finding. No separate benchmark-artifact lookup was needed |
| Risk | Topic file paths are shorthand and may not match the repo layout | Wasted iterations chasing wrong paths | Iteration 1 verified the actual paths under `.opencode/skills/system-skill-advisor/mcp_server/` and confirmed the four-layer path |
| Risk | `memory_context` timeout at init (exit 75) | Prior packet findings were not auto-loaded | Iterations read sibling packets directly. The daemon outage itself became direct evidence for REQ-002's transport-resilience question |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the shadow `taskIntentFloor` 0.82 -> 0.80 candidate preserve the three empirical gates (holdout >=57/78, coverage >=61/78, ambiguity slice >=16/25) when run inside an authorized implementation packet?
- Can a natural production prompt reach the executor-delegation existing-candidate branch, or must a fixture seed the projection to exercise it?
- Should a retired-executor alias remain part of the supported metadata contract for the replacement abstain fixture?
- What do reliability bins (Brier/ECE) show once the joined calibration evaluator lands (P0-4)?
- Is env-override freezing at module load acceptable for long-lived daemon processes, or should threshold resolution become read-per-call?

### Research Status
Complete: 10 of 10 iterations, 5 of 5 key questions answered, zero remaining research frontier within scope. `research/research.md` is the canonical synthesis. See its Section 8 for the prioritized fix plan handed off to `013-skill-advisor-routing-fixes`.
<!-- /ANCHOR:questions -->
