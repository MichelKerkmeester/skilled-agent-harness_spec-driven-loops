---
title: "Implementation Plan: Phase 1: research"
description: "Plan for the 10-iteration /deep:research fan-out verifying the Mobbin MCP server before transport authoring. Covers run initialization with the exact executor schedule, lineage monitoring, and synthesis/findings-registry verification, with all research state owned by the workflow's own packet."
trigger_phrases:
  - "mcp-mobbin research plan"
  - "mobbin fan-out plan"
  - "mobbin deep research iterations"
  - "phase 001 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/001-research"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the research fan-out implementation plan"
    next_safe_action: "Initialize the /deep:research run when the packet is approved"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/spec.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/plan.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/tasks.md"
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
| **Language/Stack** | /deep:research loop (system-deep-loop research mode) dispatching external CLI executors |
| **Framework** | System Spec Kit Level 1 phase documentation; workflow-owned research state packet |
| **Storage** | `001-research/research/` (iteration state, deltas, logs, synthesis) — owned by the workflow |
| **Testing** | Convergence check on the synthesis, findings-registry consistency audit, `validate.sh` on this phase folder |

### Overview
Run one /deep:research loop with a fixed 10-iteration fan-out (5× cli-codex gpt-5.6-sol xhigh fast, 2× cli-opencode zai-coding-plan/glm-5.2 max, 3× cli-codex gpt-5.6-luna max fast; `--stop-policy=max-iterations`) against the official Mobbin MCP server and skills repositories. The workflow owns all research state under `research/`; this phase's job is to initialize the run correctly, keep the lineages healthy, and verify the converged synthesis before handing to phase 002.
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
Skill-owned iterative research loop (/deep:research) with a fixed multi-executor fan-out and a terminal synthesis gate.

### Key Components
- **Run initialization**: Configure the /deep:research loop with the exact executor schedule, `--stop-policy=max-iterations` (10), and the two source URLs from `context/website-link.md` as the research target.
- **Lineage monitoring**: Track the three executor lineages through the workflow's own state (`research/` packet); no manual state files, no direct agent dispatch outside the workflow.
- **Synthesis verification**: Confirm `research/research.md` converged, every load-bearing claim is source-cited, and the findings registry agrees with the synthesis.

### Data Flow
Source repositories (mobbin-mcp-server, mobbin/skills) are investigated by executor iterations; per-iteration deltas accumulate in the workflow-owned `research/` state packet; the loop's convergence step produces `research/research.md`, which becomes the grounding input for phase 002 skill authoring.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `001-research/research/**` | Workflow-owned research state | Create via /deep:research only | State packet structure produced by the workflow, not hand-authored |
| `.opencode/skills/**`, `.utcp_config.json` | Future consumers of the findings | Unchanged this phase | `git status` shows no modifications outside this phase folder |

Required inventories:
- Not a fix phase: no producer/consumer inventory applies; the invariant is the write boundary above.
- Algorithm invariant: research state is created exclusively by the /deep:research workflow inside `research/`; the phase never writes outside `001-research/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm executor availability for cli-codex (gpt-5.6-sol, gpt-5.6-luna) and cli-opencode (zai-coding-plan/glm-5.2)
- [ ] Confirm the source links in `context/website-link.md` resolve
- [ ] Initialize the /deep:research run with the exact 10-iteration schedule and `--stop-policy=max-iterations`

### Phase 2: Core Implementation
- [ ] Execute lineage A: 5 iterations on cli-codex gpt-5.6-sol xhigh fast
- [ ] Execute lineage B: 2 iterations on cli-opencode zai-coding-plan/glm-5.2 max
- [ ] Execute lineage C: 3 iterations on cli-codex gpt-5.6-luna max fast

### Phase 3: Verification
- [ ] Verify `research/research.md` converged with cited findings on tool surface, auth, gating, and transport eligibility
- [ ] Audit the findings registry for consistency with the synthesis; mark residual unknowns explicitly
- [ ] Run phase-folder validation and hand off to 002-skill-authoring
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence check | `research/research.md` | /deep:research convergence gate + human review of the synthesis |
| Consistency audit | Findings registry vs synthesis claims | Manual cross-check; contradictions block handoff |
| Template validation | Phase 001 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex + cli-opencode executors | External | Green | Fan-out cannot run; no fallback executor schedule is pre-approved |
| github.com/mobbin repositories reachable | External | Green | Iterations cannot ground findings in primary sources |
| /deep:research workflow (system-deep-loop) | Internal | Green | No sanctioned way to run the loop; manual substitution is forbidden |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The run is initialized with a wrong schedule/stop policy, or lineage state corrupts, or writes escape `001-research/`.
- **Procedure**: Stop the loop through the workflow's own controls, discard the phase-local `research/` state packet, and re-initialize the run cleanly. No repository rollback is needed because the phase writes nothing outside this folder.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
