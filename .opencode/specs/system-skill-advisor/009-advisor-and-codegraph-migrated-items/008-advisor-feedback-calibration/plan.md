---
title: "Implementation Plan: Phase 5: advisor-feedback-calibration"
description: "Implementation plan for the default-off advisor feedback calibration reducer and no-live-drift verification."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-advisor-and-codegraph-migrated-items/008-advisor-feedback-calibration"
    last_updated_at: "2026-06-10T23:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed shadow feedback calibration reducer"
    next_safe_action: "Review persisted calibration reports manually"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-advisor-feedback-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Future promotion needs separately approved held-out validation criteria."
    answered_questions:
      - "The reducer remains default-off and shadow-only; live recommendation weights are not read from calibration reports."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: advisor-feedback-calibration

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
| **Language/Stack** | TypeScript (Node) |
| **Framework** | mk_skill_advisor MCP daemon |
| **Storage** | skill-graph.sqlite |
| **Testing** | vitest |

### Overview
The advisor now has a default-off shadow reducer that turns retained `advisor_validate` outcomes into advisory calibration records. The live scorer and recommendation handler do not consume those records, so recommendation ordering, scores, and lane weights remain unchanged.
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
- [x] Tests passing for reducer, validate integration, typecheck, and build
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shadow reducer with persisted advisory reports.

### Key Components
- **Feedback calibration reducer**: Aggregates outcome records into sample counts, candidate lane deltas, threshold deltas, and guardrail metadata.
- **Weights proposal surface**: Builds proposed-vs-current weights and thresholds without mutating scorer defaults.
- **Validate integration**: Invokes report recording only when the shadow flag is explicitly enabled.

### Data Flow
`advisor_validate` accepts outcome events, records them through the existing telemetry path, and, only when the shadow flag is enabled, passes retained/current-run records to the reducer. The reducer writes a bounded JSONL report for inspection and does not feed any data back into `advisor_recommend` or `scoreAdvisorPrompt`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `advisor-validate.ts` | Records validate outcomes and builds validation telemetry | Added default-off shadow report recording | Targeted validate handler test writes one advisory report only when enabled |
| `weights-config.ts` | Owns live scorer weights | Added read-only proposal builder; live defaults unchanged | Reducer tests assert `DEFAULT_SCORER_WEIGHTS` remains unchanged |
| `feedback-calibration.ts` | New reducer surface | Created advisory reducer, sample guards, and bounded JSONL record path | Reducer tests cover default-off, low sample, concentration, and proposed deltas |
| `scoreAdvisorPrompt` | Live recommendation scorer | Unchanged/not a consumer | No-live-drift test asserts byte-identical order, scores, and weights with flag off vs on |

Required inventories:
- Same-class producers: inspected `advisor-validate.ts`, `metrics.ts`, and `weights-config.ts` outcome/weight ownership.
- Consumers of changed symbols: new reducer is consumed by `advisor-validate.ts` and targeted tests only.
- Matrix axes: flag off/on, sample support, lane attribution availability, concentrated samples, and live scorer drift.
- Algorithm invariant: calibration reports are never consumed by `advisor_recommend` or `scoreAdvisorPrompt`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Existing validate handler, metrics shape, weights config, and scorer tests reviewed
- [x] No dependency or package changes required
- [x] Scope locked to the approved advisor files, tests, and phase docs

### Phase 2: Core Implementation
- [x] Added `feedback-calibration.ts` with default-off shadow gating, sample guards, report persistence, and no-auto-promotion metadata
- [x] Added read-only proposed-vs-current weights and threshold proposal builder in `weights-config.ts`
- [x] Wired `advisor_validate` to record calibration reports only when explicitly enabled

### Phase 3: Verification
- [x] Reducer, validate integration, and no-live-drift tests pass
- [x] Typecheck and build pass for the advisor MCP server
- [x] Phase documentation reconciled with implementation evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reducer gating, low-sample exclusion, concentration guard, proposal immutability | vitest |
| Integration | `advisor_validate` writes advisory calibration report only under explicit flag | vitest |
| Regression | Live recommendation snapshot with shadow flag off vs on | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing outcome telemetry records | Internal | Green | Reducer has no input without accepted/corrected/ignored records |
| Held-out validation corpus | Future governance | Not required for this phase | Required only for any future promotion decision |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Calibration recording causes validation failures, unsafe report contents, or any observed live scoring drift.
- **Procedure**: Leave the shadow flag unset to disable the path immediately; revert the reducer module and validate-handler hook if code rollback is required. No live scorer weights or ranking state are mutated by this phase.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
