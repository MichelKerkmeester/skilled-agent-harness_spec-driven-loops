---
title: "Implementation Plan: Phase 1: touchpoint-research"
description: "Three-lane multi-model deep-research sweep that inventoried every live touchpoint to the code-graph subsystem, established the ordering constraints between them, and produced a refuted-claims ledger that bounded the archival surface away from the live surface."
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/001-touchpoint-research"
    last_updated_at: "2026-07-27T16:33:53Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-001-touchpoint-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: touchpoint-research

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
| **Language/Stack** | Markdown research artifacts |
| **Framework** | system-deep-loop three-lane fan-out |
| **Storage** | None |
| **Testing** | `rg --hidden --no-ignore` post-research sweep |

### Overview
Ran a forced-depth three-lane deep-research pass (20 total iterations across three executors) to inventory every live reference to the code-graph subsystem, classify each hit by consumer and mutation class, and produce a refuted-claims ledger that separated confirmed touchpoints from archival noise. The synthesis landed in `research/research.md` and drove every downstream phase's scope.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three-lane deep-research fan-out with a merged synthesis and a refuted-claims ledger.

### Key Components
- **Lane sol**: `cli-codex` with `gpt-5.6-sol high`, 10 iterations
- **Lane glm**: `cli-devin` with `glm-5-2 free`, 5 iterations
- **Lane grok**: `cli-cursor` with `cursor-grok-4.5-high`, 5 iterations
- **Synthesis**: `research/research.md` merging all three lineages

### Data Flow
Each lane ran to its full iteration count (`--stop-policy=max-iterations`), producing per-lineage state under `research/lineages/**`. The converged synthesis in `research/research.md` carries the cited touchpoint inventory, the ordering graph, and the refuted-claims ledger.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable: this phase is research-only. It reads and reports; it changes no runtime file, edits no consumer, and deletes nothing.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Live touchpoints | Inventoried | Reported only | Post-research `--hidden --no-ignore` sweep found no live hit absent from the inventory |
| Archival paths | Historical record | Bounded away | Refuted-claims ledger distinguishes archival from live |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed `cli-codex` and `cli-cursor` executors wired in `runtime/lib/deep-loop/executor-config.ts`
- [x] Confirmed `cli-devin` executor wiring (`system-deep-loop/041`) landed so the GLM lane could dispatch

### Phase 2: Core Implementation
- [x] Ran lane sol (cli-codex gpt-5.6-sol high, 10 iterations)
- [x] Ran lane glm (cli-devin glm-5-2 free, 5 iterations)
- [x] Ran lane grok (cli-cursor cursor-grok-4.5-high, 5 iterations)
- [x] Merged the three lineages into `research/research.md` with cited touchpoint inventory and ordering graph
- [x] Recorded refuted-claims ledger (`.pi/mcp.json` is not a fourth registration; no Pi freshness hook at `.pi/extensions/`)

### Phase 3: Verification
- [x] Post-research `rg --hidden --no-ignore` sweep found no live-surface reference absent from the inventory (SC-001)
- [x] Every inventory entry assigned to exactly one downstream phase 003-014 (SC-002)
- [x] Confirmed touchpoints distinguished from inferred ones with file:line citations (SC-003)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Live-surface sweep completeness | `rg --hidden --no-ignore` |
| Validation | Archival boundary correctness | Refuted-claims ledger review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-devin` executor wiring | Internal | Green | GLM lane could not dispatch without it |
| `cli-codex` / `cli-cursor` wiring | Internal | Green | Already wired in executor-config.ts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable. This phase produces research artifacts only; no runtime change to revert.
- **Procedure**: The research artifacts under `research/` are the historical record and are not rolled back.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
