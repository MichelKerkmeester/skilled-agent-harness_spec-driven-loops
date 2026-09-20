---
title: "Implementation Plan: Phase 1: research"
description: "Plan for the phase 001 research gate: init a /deep:research fan-out with a fixed 10-iteration executor schedule, monitor the three lineages, verify the workflow-owned state packet and research.md synthesis, then close out for human review before skill authoring."
trigger_phrases:
  - "mcp-aside research plan"
  - "aside deep research plan"
  - "aside fan-out schedule"
  - "phase 001 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/001-research"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the /deep:research fan-out plan for the Aside surface"
    next_safe_action: "Init the research run when the packet is approved"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/tasks.md"
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
| **Language/Stack** | /deep:research workflow (system-deep-loop mode packet) driving external CLI executors |
| **Framework** | Deep-research state machine: state JSONL, deltas, logs, findings registry, convergence detection |
| **Storage** | Workflow-owned state packet in this phase's `research/` folder |
| **Testing** | Convergence/stop-policy evidence in the state packet plus `validate.sh` on this phase folder |

### Overview
Run one /deep:research loop over the Aside developer surface (seed: `context/website-link.md`, https://docs.aside.com/help/developers#use-mcp) with a fixed 10-iteration fan-out — 5× cli-codex gpt-5.6-sol xhigh fast, 2× cli-opencode zai-coding-plan/glm-5.2 max, 3× cli-codex gpt-5.6-luna max fast — under `--stop-policy=max-iterations`. The workflow owns all outputs; this plan only initializes, monitors, verifies, and closes out.
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
Skill-owned iterative research loop (/deep:research) with a fixed executor fan-out; no manual state, no direct agent dispatch.

### Key Components
- **Init**: Start the /deep:research run scoped to this phase folder with the exact 10-iteration executor schedule and `--stop-policy=max-iterations`; state packet root is `research/`.
- **Lineage monitoring**: Track the three executor lineages (sol xhigh fast ×5, glm-5.2 max ×2, luna max fast ×3) for failed or stalled iterations; retry within the workflow's own mechanics.
- **Synthesis verification**: Check `research/research.md` against the findings registry — every load-bearing claim cited, contradictions surfaced, the CLI-vs-MCP question answered.
- **Close-out**: Validate the phase folder and stop for human review before phase 002.

### Data Flow
`context/website-link.md` seeds the loop → iterations write findings/deltas/logs into the workflow-owned `research/` packet → convergence produces `research/research.md` → human review gates the handoff to 002-skill-authoring.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-tooling/**` (hub and its three modes) | Read-only exemplar for capability-parity questions | Unchanged — read-only reference | `git status` shows no modifications under `.opencode/skills/` after the phase |
| This phase folder's `research/` packet | Workflow-owned research output | Created by the /deep:research workflow only | State packet present with 10 attributed iterations; no hand-written state files |

Required inventories:
- Not a bug-fix phase: no producer/consumer inventory applies. The single invariant is write containment — all outputs inside `001-research/`, owned by the workflow.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm scope boundary (writes only inside `001-research/`) and read `context/website-link.md`
- [ ] Confirm the three executors resolve (cli-codex gpt-5.6-sol, cli-opencode zai-coding-plan/glm-5.2, cli-codex gpt-5.6-luna)
- [ ] Init the /deep:research run with the fixed schedule and `--stop-policy=max-iterations`

### Phase 2: Core Implementation
- [ ] Monitor the 5× sol xhigh fast lineage through its iterations
- [ ] Monitor the 2× glm-5.2 max and 3× luna max fast lineages through theirs
- [ ] Confirm the state packet (state JSONL, deltas, logs, findings registry) accumulates in `research/`

### Phase 3: Verification
- [ ] Verify `research/research.md` synthesis: CLI-vs-MCP answer, MCP tool list, auth model, install/launch — each cited
- [ ] Verify the findings registry backs every load-bearing claim; mark unverifiable claims
- [ ] Run phase-folder validation, confirm write containment, and stop for human review before phase 002
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence audit | Deep-research state packet | Workflow's own iteration log and stop-policy record in `research/` |
| Citation audit | `research/research.md` vs findings registry | Manual cross-check: each load-bearing claim maps to a sourced finding |
| Template validation | Phase 001 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| /deep:research workflow (system-deep-loop) | Internal | Green | The loop, its state machine, and convergence detection cannot run manually |
| cli-codex + cli-opencode executors | External | Green | Scheduled lineages cannot execute; retry or escalate for schedule amendment |
| https://docs.aside.com/help/developers#use-mcp reachable | External | Yellow (unverified) | Primary source unavailable; widen to secondary sources with lower confidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The run writes outside `001-research/`, the schedule deviates from the fixed fan-out without approval, or the synthesis carries uncited load-bearing claims.
- **Procedure**: Discard only the affected phase-local `research/` artifacts and re-init or resume the loop through the workflow's own resume mechanics. No repository rollback is needed — this phase writes nowhere else.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
