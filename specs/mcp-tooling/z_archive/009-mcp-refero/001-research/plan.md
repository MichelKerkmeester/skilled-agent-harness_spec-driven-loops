---
title: "Implementation Plan: Phase 1: research"
description: "Plan for the phase 001 /deep:research fan-out over the Refero MCP surface: initialize the workflow-owned run with the exact 10-iteration executor schedule, monitor lineages to completion, then verify the converged synthesis and findings registry before handing off to packet authoring."
trigger_phrases:
  - "mcp-refero research plan"
  - "refero fan-out plan"
  - "refero deep research plan"
  - "phase 001 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/001-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the deep-research fan-out implementation plan"
    next_safe_action: "Initialize the /deep:research run when the packet is approved"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: research

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
| **Language/Stack** | /deep:research workflow over external CLI executors (cli-codex, cli-opencode) |
| **Framework** | system-deep-loop deep-research mode; state machine owns the `research/` packet |
| **Storage** | Workflow-owned state packet inside `001-research/research/` (state JSONL, deltas, logs, synthesis) |
| **Testing** | Convergence/lineage checks from the run log; synthesis and findings-registry verification; `validate.sh` on this phase folder |

### Overview
Run the phase as a single `/deep:research` loop against the Refero MCP surface, using the exact 10-iteration executor schedule (5× cli-codex gpt-5.6-sol xhigh fast, 2× cli-opencode zai-coding-plan/glm-5.2 max, 3× cli-codex gpt-5.6-luna max fast) under `--stop-policy=max-iterations`. The workflow owns all research state; this plan only initializes, monitors, and verifies. The output that matters downstream is `research/research.md` plus a traceable findings registry.
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
Workflow-owned deep-research loop: init → iterate (fan-out executors) → converge → synthesize → verify.

### Key Components
- **Run initialization**: Configure the `/deep:research` run with the research question (Refero MCP tool surface, auth, limits, gating, skill-repo conventions), the pinned sources from `context/website-link.md`, the 10-iteration executor schedule, and `--stop-policy=max-iterations`; state packet path is `001-research/research/`.
- **Lineage monitoring**: Watch executor lineages across the three lanes; resume (never restart) any externally killed lineage via the workflow's resumable state.
- **Synthesis verification**: After max-iterations stop, confirm `research/research.md` exists, is converged, cites both pinned sources, and that the findings registry backs every load-bearing claim.

### Data Flow
Pinned source links and the live Refero MCP surface feed executor iterations; iteration outputs accumulate in the workflow-owned state packet; convergence produces `research.md`, which becomes the single grounding input for phase 002 packet authoring.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `001-research/research/**` | Workflow-owned deep-research state | Created by the workflow only | Run log shows the state machine wrote state JSONL, deltas, logs — no hand-rolled files |
| `.opencode/skills/**`, `.utcp_config.json`, hub routing files | Downstream phase targets | Unchanged this phase | `git status` scoped to those paths stays clean during the run |

Required inventories:
- Same-class producers: none — the deep-research state machine is the only writer inside `research/`.
- Consumers of changed symbols: phase 002 consumes `research/research.md`; no code symbols change.
- Matrix axes: executor lane × iteration (3 lanes, 10 iterations total) tracked in the run log.
- Algorithm invariant: research state stays workflow-owned and resumable; a killed lineage is resumed, never re-initialized over existing state.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the pinned sources in `context/website-link.md` resolve
- [ ] Compose the research question and iteration budget for the run config
- [ ] Initialize the /deep:research run with the exact executor schedule and stop policy

### Phase 2: Core Implementation
- [ ] Monitor the 5× gpt-5.6-sol xhigh fast lineage batch to completion
- [ ] Monitor the 2× glm-5.2 max and 3× gpt-5.6-luna max fast lineages to completion
- [ ] Resume any externally killed lineage from workflow state

### Phase 3: Verification
- [ ] Verify `research/research.md` synthesis: converged, cited, covers tool surface/auth/limits/gating
- [ ] Verify the findings registry traces every load-bearing synthesis claim
- [ ] Confirm zero writes outside this phase folder; run `validate.sh` on the phase folder and close out
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Run integrity | Executor schedule and stop policy | Deep-research run log vs the schedule in spec.md REQ-001 |
| Synthesis audit | `research/research.md` | Manual cross-check of citations against the findings registry |
| Template validation | Phase 001 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Refero remote (https://api.refero.design/mcp) | External | Yellow (unprobed) | Live-surface findings degrade to repo/docs-only evidence |
| cli-codex and cli-opencode executor availability | Internal | Green | Iterations cannot dispatch; run stalls until executors return |
| /deep:research workflow (system-deep-loop) | Internal | Green | No compliant way to run the fan-out; phase blocks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The run writes outside `001-research/`, or the synthesis fails verification (uncited claims, missing coverage areas).
- **Procedure**: For scope escapes, revert the stray files and re-run the offending step under the workflow. For a failed synthesis, resume the loop for corrective iterations rather than editing research.md by hand; the state packet stays authoritative.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
