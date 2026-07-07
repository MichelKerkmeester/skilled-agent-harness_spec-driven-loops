---
title: "Implementation Plan: deep-agent-improvement model-benchmark mode (build sequence)"
description: "Build sequence + estimate for adding the model-benchmark mode to deep-agent-improvement: port the 120/003 rig behind a mode selector with three pluggable seams. Plan authored here; build is a follow-on effort."
trigger_phrases:
  - "benchmark mode build plan"
  - "mode selector implementation plan"
  - "port 120/003 rig"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/001-design-model-benchmark-mode-selector"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored build sequence + estimate"
    next_safe_action: "Build per phases in a follow-on effort"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/121-deep-agent-improvement-benchmark-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Design: add a model/prompt-framework benchmark mode to deep-agent-improvement (port the 120/003 rig behind a mode selector)

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.cjs` loop scripts + JSON config + markdown skill docs |
| **Framework** | deep-agent-improvement skill; ports from 120/003 eval-rig/eval-loop |
| **Storage** | packet-local JSONL state + sha256 cache (same as both existing loops) |
| **Testing** | seam unit tests + a regression test of the existing agent-improvement path + one live model-benchmark smoke run |

### Overview
This plan is the BUILD sequence for the design in spec.md + decision-record.md. It adds a `mode` selector to deep-agent-improvement and a `model-benchmark` mode by porting the 120/003 rig behind three pluggable seams (candidate source, dispatcher, scorer), reusing the skill's already-generic loop/state/convergence/mutation scripts. **This packet authors the plan; it does not execute it** — the build is the follow-on effort.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Strategy/factory behind a mode selector — shared loop core, mode-resolved seams.

### Key Components
- **Mode selector** (`loop.cjs` + `improvement_config.json`): reads `mode`, resolves the three seams.
- **Candidate source** (per mode): agent-md parser (today) | prompt-variant renderer (ported `render-variant.cjs`).
- **Dispatcher** (`dispatch-model.cjs`, new): generalized from `dispatch-minimax.cjs` — executor + model + args; noop for agent mode.
- **Scorer** (per mode): agent 5-dim rubric (today) | task-output rubric + grader (ported `eval-rig/` + `score-variant.cjs`).
- **Shared plumbing** (reused as-is): `mutation-coverage.cjs`, `reduce-state.cjs`, `converge.cjs`, `materialize-benchmark-fixtures.cjs`, `improvement-journal.cjs`.

### Data Flow
`loop.cjs` reads mode → candidate source yields next variant → dispatcher runs it (model API for benchmark mode) → scorer produces a multi-dim score → shared reducer/convergence/journal record + decide → synthesis (benchmark) or promotion (agent).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

N/A for this design packet (no code changes here). The follow-on BUILD must complete this section: the load-bearing shared surface is deep-agent-improvement's `loop.cjs` (gains the mode branch) and `improvement_config.json` (gains `mode`); the build must regression-test the existing agent-improvement path (default `mode`) as the primary affected surface, since the goal is non-breaking.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

> Build sequence for the follow-on effort. Estimate: ~3-4k LOC, multi-week, single workstream.

### Phase 1: Seam scaffolding (port-as-is first)
- [ ] Port `eval-rig/` (fixtures + deterministic checks + grader) from 120/003 into deep-agent-improvement.
- [ ] Generalize `dispatch-minimax.cjs` → `dispatch-model.cjs` (executor + model + args; cli-opencode/codex/gemini/devin).
- [ ] Port `render-variant.cjs` + variant templates as the model-benchmark candidate source.

### Phase 2: Mode selector wiring
- [ ] Add `mode` + `modelBenchmarkConfig` to `improvement_config.json`; default `agent-improvement`.
- [ ] Add the seam factory to `loop.cjs` (candidate source / dispatcher / scorer resolved from `mode`).
- [ ] Confirm shared scripts (`mutation-coverage`, `reduce-state`, `converge`, `materialize-benchmark-fixtures`, `improvement-journal`) run unchanged for both modes.
- [ ] Extend `/deep:start-agent-improvement-loop` with `--mode=model-benchmark --executor= --model=` flags.

### Phase 3: Verification
- [ ] Regression-test the existing agent-improvement path (no behavior change with `mode` unset).
- [ ] Seam unit tests + one live model-benchmark smoke run (small fixture subset).
- [ ] Update SKILL.md identity + changelog; strict-validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | [Components/functions] | [Jest/pytest/etc.] |
| Integration | [API endpoints/flows] | [Tools] |
| Manual | [User journeys] | Browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [System/Library] | [Internal/External] | [Green/Yellow/Red] | [Impact] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: [Conditions requiring rollback]
- **Procedure**: [How to revert changes]
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | [Low/Med/High] | [e.g., 1-2 hours] |
| Core Implementation | [Low/Med/High] | [e.g., 4-8 hours] |
| Verification | [Low/Med/High] | [e.g., 1-2 hours] |
| **Total** | | **[e.g., 6-12 hours]** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| [Component A] | None | [Output] | B, C |
| [Component B] | A | [Output] | D |
| [Component C] | A | [Output] | D |
| [Component D] | B, C | [Final] | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **[Phase/Task]** - [Duration estimate] - CRITICAL
2. **[Phase/Task]** - [Duration estimate] - CRITICAL
3. **[Phase/Task]** - [Duration estimate] - CRITICAL

**Total Critical Path**: [Sum of durations]

**Parallel Opportunities**:
- [Task A] and [Task B] can run simultaneously
- [Task C] and [Task D] can run after Phase 1
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | [Setup Complete] | [All dependencies ready] | [Date/Phase] |
| M2 | [Core Done] | [Main features working] | [Date/Phase] |
| M3 | [Release Ready] | [All tests pass] | [Date/Phase] |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: [Decision Title]

**Status**: [Proposed/Accepted/Deprecated]

**Context**: [What problem we're solving]

**Decision**: [What we decided]

**Consequences**:
- [Positive outcome 1]
- [Negative outcome + mitigation]

**Alternatives Rejected**:
- [Option B]: [Why rejected]

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
