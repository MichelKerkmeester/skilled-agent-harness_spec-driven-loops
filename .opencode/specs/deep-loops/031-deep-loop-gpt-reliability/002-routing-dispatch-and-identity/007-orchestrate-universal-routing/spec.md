---
title: "Feature Specification: Orchestrate NDP-Safe Universal Routing"
description: "Complete orchestrate's existing Agent Selection (Priority Order) table with the two missing deep-mode rows (@deep-context, @deep-review), make its Deep Route field registry-resolved against mode-registry.json instead of free-text, and codify that @deep itself is never Task-dispatched as a depth-1 worker. Operator-expanded scope: because orchestrate already routes ALL primary-agent dispatch (build/@code, @review, @debug, @markdown, @context, plus deep modes) through this one table, completing it for deep modes makes the entire dispatch surface uniformly deterministic without a new mechanism."
trigger_phrases:
  - "orchestrate universal routing"
  - "orchestrate registry delegation"
  - "deep route registry resolved"
  - "ndp safe orchestrate"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../007-gpt-behavioral-hardening-research/research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/007-orchestrate-universal-routing"
    last_updated_at: "2026-07-01T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implementation complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 010"
    blockers: []
    key_files:
      - "../007-gpt-behavioral-hardening-research/research/research.md"
      - ".opencode/agents/orchestrate.md"
      - ".claude/agents/orchestrate.md"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-009-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deep Route resolution mechanism: an explicit prose rule (not a lookup script) added right after the Task Format block, instructing direct mode-registry.json lookup and a stop-before-dispatch clause for unmatched modes."
      - "Does the operator's ask ('orchestrate should route to any primary agent, not just deep sub-agents') require a new mechanism? No — orchestrate's existing Priority Order table (orchestrate.md §2) already routes @code/@review/@markdown/@debug/@context/@ai-council/@deep-research through one deterministic table; the only gap is the 2 missing deep-mode rows and the free-text Deep Route field. Completing that table satisfies both the research's narrower recommendation and the operator's broader ask with the same change."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Orchestrate NDP-Safe Universal Routing

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Packet** | `031-deep-loop-gpt-reliability` |
| **Predecessor** | `../008-mode-d-ai-council-identity-fix/` (must land first) |
| **Successor** | `../010-ai-council-subagent-only/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`orchestrate.md`'s "Agent Selection (Priority Order)" table (`.opencode/agents/orchestrate.md:97-105`) is the single deterministic routing surface for ALL of orchestrate's dispatch decisions — it already lists `@context`, `@deep-research`, `@ai-council`, `@markdown`, `@review`, `@code`, `@debug`. Two of the four deep sub-agents are missing from it: `@deep-context` and `@deep-review` appear nowhere in the Priority table, the Agent Files table (`:180-188`), or the NDP LEAF classification list (`:116`) — only in an already-uncommitted, partial in-flight edit to the Task-format template block (`:206-207`) that added them to the `Agent:` enum and introduced a `Deep Route:` field, without wiring either into the actual routing table or making the field registry-resolved (it is currently free-text template prose, not a lookup against `mode-registry.json`). Research (research.md §1, §3) additionally found that a literal "Task-dispatch `@deep` and STOP" reading of the original recommendation would violate orchestrate's own documented Nesting Depth Protocol — `@deep` is itself `mode: primary`, not a depth-1 leaf, so `Orch(0) → @deep(1) → @leaf(2)` is exactly the illegal chain orchestrate's own NDP section (`:143-149`) already forbids.

### Purpose

Complete the existing Priority table (not build a new mechanism) with the two missing deep-mode rows, resolve orchestrate's Deep Route field against `mode-registry.json` instead of leaving it free-text, and make explicit that orchestrate dispatches the resolved **leaf** agent directly at depth 1 — never `@deep` itself as a worker. Because this table is already how orchestrate routes every other primary-agent dispatch (build/@code, @review, @debug, @markdown, @context), completing it for the 2 missing deep modes satisfies both research's narrower recommendation and the operator's broader request (orchestrate reliably routing to ANY primary agent, not just deep sub-agents) through the same single change — no separate mechanism is needed for "non-deep" routing since it was already table-driven.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `@deep-context` and `@deep-review` rows to the "Agent Selection (Priority Order)" table (`orchestrate.md:97-105`), each citing the correct skill/tier/subagent_type per `mode-registry.json`.
- Add `@deep-context` and `@deep-review` to the NDP LEAF classification list (`:116`) and the Agent Files table (`:180-188`), matching the existing `@deep-research` row's shape.
- Make the `Deep Route:` field (`:207`, currently free-text template prose from the in-flight uncommitted edit) resolve against `mode-registry.json` (`workflowMode`, `agent`, `artifactRoot`) rather than being filled in from judgment — the field's value must be derivable by a table lookup, not model discretion.
- Add explicit prose (or a boundary rule alongside the existing NDP "Illegal Chains" block, `:143-149`) stating: orchestrate dispatches the resolved leaf agent (`@deep-context`, `@deep-research`, `@deep-review`, `@ai-council`) directly at depth 1; it never Task-dispatches `@deep` itself as a worker, since `@deep` is `mode: primary` and dispatching it would create an illegal depth-2 chain.
- Apply the identical set of changes to `.claude/agents/orchestrate.md` (mirror parity, matching phase 003's precedent).
- Reconcile the already-uncommitted partial edit at `orchestrate.md:206-207` (the `Agent:` enum addition and un-wired `Deep Route:` field) into this phase's own, complete change rather than leaving it as disconnected prose.

### Out of Scope

- Mode-D gate fix and ai-council route-identity fix — `../008-mode-d-ai-council-identity-fix/` (predecessor, must land first).
- ai-council `mode: all` → `mode: subagent` conversion — `../010-ai-council-subagent-only/` (separate, explicit operator-override phase; this phase does not touch ai-council's reachability, only its Priority-table row and Deep Route resolution, which apply regardless of its `mode` value).
- The `tool.execute.before` enforcement plugin — `../011-deep-route-guard-plugin/`.
- The GPT-vs-Claude benchmark — `../012-gpt-claude-benchmark/`.
- Any change to `@code`/`@review`/`@markdown`/`@debug`/`@context`'s existing Priority-table rows — they are already correct and are not being re-derived or altered by this phase.

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/agents/orchestrate.md:97-105` | Modify | Add `@deep-context`/`@deep-review` Priority-table rows |
| `.opencode/agents/orchestrate.md:116` | Modify | Add `@deep-context`/`@deep-review` to NDP LEAF list |
| `.opencode/agents/orchestrate.md:180-188` | Modify | Add `@deep-context`/`@deep-review` Agent Files rows |
| `.opencode/agents/orchestrate.md:206-207` | Modify | Complete the Deep Route field wiring (already partially, uncommitted, in-flight) |
| `.opencode/agents/orchestrate.md` (NDP section, near `:143-149`) | Modify | Add explicit "never Task-dispatch @deep as a worker" boundary |
| `.claude/agents/orchestrate.md` (mirrored line ranges) | Modify | Mirror all of the above |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Priority table complete for all 4 deep modes | `@deep-context`, `@deep-research`, `@deep-review`, `@ai-council` all appear as distinct rows in the Priority table with correct tier/skills/subagent_type. |
| REQ-002 | Deep Route field is registry-resolved | The field's value for any deep dispatch is derivable by looking up `mode-registry.json`, not by model judgment; a reviewer can verify correctness by diffing the emitted field against the registry entry. |
| REQ-003 | NDP-safe dispatch, no @deep worker dispatch | Orchestrate's own documentation explicitly states it dispatches the resolved leaf directly at depth 1 and never dispatches `@deep` itself as a Task worker. |
| REQ-004 | Claude mirror parity | `.claude/agents/orchestrate.md` reflects the identical routing completeness (adapted for Claude's tool/agent conventions, no `mode`/registry-file concept required since Claude Code has no primary-agent distinction). |
| REQ-005 | No regression to non-deep routing | `@code`, `@review`, `@markdown`, `@debug`, `@context` Priority-table rows and dispatch behavior are unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 deep modes have complete, consistent rows across the Priority table, NDP LEAF list, and Agent Files table.
- **SC-002**: A manual trace of a `/deep:context` and `/deep:review` request through orchestrate resolves to the correct leaf agent via table lookup alone, with no judgment call required.
- **SC-003**: Orchestrate's own text makes the "never dispatch @deep as a worker" rule explicit and unambiguous, verifiable by re-reading the NDP section.
- **SC-004**: `validate.sh --strict` passes for this phase folder once implementation lands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The existing uncommitted partial edit (`orchestrate.md:206-207`) is incomplete — reconciling it wrong could leave the Deep Route field half-wired | Silent regression that looks fixed but isn't | Treat the existing diff as a starting point to complete, not a finished state to build on top of; re-verify against REQ-002 directly |
| Risk | Adding rows to the Priority table without updating every cross-reference (NDP list, Agent Files table) | Inconsistent routing surface (table says one thing, LEAF classification says another) | Explicit sub-tasks for all 3 locations (Priority table, NDP list, Agent Files table) in plan.md, not just the table |
| Dependency | Phase 008 (Mode-D + ai-council identity fix) | Sequencing per research/research.md §4 | Must land first |
| Dependency | `mode-registry.json` as source of truth | Fix correctness | Already confirmed correct and stable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- See frontmatter `open_questions`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Deep Route resolution must not depend on the model correctly remembering registry values from training/context — it must be checkable by direct table lookup at dispatch time.
- **NFR-R02**: The "never dispatch @deep as a worker" rule must be stated as an explicit boundary, not left implicit in the existing NDP "Illegal Chains" examples.

### Maintainability
- **NFR-M01**: If `mode-registry.json` gains a 5th mode in the future, only the Priority table + Agent Files table need a new row — no other orchestrate logic should need to change.
- **NFR-M02**: OpenCode and Claude mirrors must differ only for runtime path/tool conventions, matching phase 003's established pattern.

### Compatibility
- **NFR-C01**: `ai-council`'s current `mode: all` reachability is unaffected by this phase (see `../010-ai-council-subagent-only/` for that separate change).
- **NFR-C02**: Existing non-deep routing (`@code`/`@review`/`@markdown`/`@debug`/`@context`) must produce byte-identical dispatch decisions before and after this phase.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A request that could plausibly route to either `@deep-context` or `@context` (both handle "gather context") must resolve deterministically — `@deep-context` only when the deep-loop iterative/convergence workflow is explicitly requested, `@context` otherwise. Document this distinction explicitly in the new rows.
- A request naming `/deep:ai-council` must resolve through `@deep` (the primary router) → `@ai-council` (leaf), not through orchestrate directly Task-dispatching `@deep` — orchestrate's role for deep requests is to recognize them and hand off appropriately, not to simulate `@deep`'s own routing logic inline.

### Error Scenarios
- Registry entry missing or malformed for a given mode: orchestrate stops before dispatch (matching `deep.md`'s own `UNKNOWN_DEEP_MODE` behavior) rather than guessing.
- Deep Route field present but disagreeing with the Priority-table row for the same request: treat as a Prompt/Agent Consistency Guard violation (`orchestrate.md:168-176`) and stop before dispatch.

### State Transitions
- This phase can begin only after phase 008 lands (ai-council identity + Mode-D fix); phase 010 (ai-council subagent-only) can begin only after this phase's Deep Route resolution no longer assumes `ai-council` is reachable via `mode: all`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple coordinated edits across 2 files (OpenCode + Claude mirror), 3+ cross-referenced tables each |
| Risk | 16/25 | Touches the primary dispatch surface for every agent, not just deep modes; must not regress non-deep routing |
| Research | 16/20 | Directly grounded in research.md §1/§3/§4 plus a confirmed live read of the current file state (existing uncommitted partial edit) |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Research**: `../007-gpt-behavioral-hardening-research/research/research.md` §1 (NDP-safe registry delegation), §3 (KQ table), §4 item 2
- **Predecessor**: `../008-mode-d-ai-council-identity-fix/`
- **Parent Spec**: `../spec.md`
