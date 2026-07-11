---
title: "Feature Specification: Phase 1: research-and-context"
description: "Read-only research gate for the deep-alignment mode program. Confirms the deep-review packet and runtime scripts, the three prior-art packets, the four parent skills' standards surfaces, and the 130/131 reference implementation before architecture decisions begin."
status: planned
trigger_phrases:
  - "deep-alignment research gate"
  - "deep-alignment prior art"
  - "deep-review runtime script inventory"
  - "parent-skill standards surface inventory"
  - "phase 001 research-and-context"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/001-research-and-context"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the research-gate scaffold"
    next_safe_action: "Run the skill-state and adapter-source research passes"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-review/SKILL.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs"
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review"
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/002-hub-doc-conformance-fixes"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-001-research-and-context"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does reduce-state.cjs stay mode-local (deep-review/scripts/) or move to the shared runtime for deep-alignment reuse?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: research-and-context

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-11 |
| **Branch** | `system-deep-loop/059-deep-alignment-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 9 |
| **Predecessor** | 000-deep-loop-runtime-refinement (phase-0 runtime prerequisite) |
| **Successor** | 002-architecture-decision |
| **Handoff Criteria** | A verified research/context map covering the deep-review packet, runtime scripts, three prior-art packets, the four parent skills' standards surfaces, and the 130/131 reference packets is ready for human review before phase 002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the deep-alignment mode-packet specification.

**Scope Boundary**: Read-only research and inventory planning for phase 001. This phase documents findings inside this phase folder only. It must not create, move, or edit `.opencode/skills/system-deep-loop/deep-alignment/`, any `mode-registry.json` entry, any command file, or any file outside this phase folder.

**Dependencies**:
- The phase-0 runtime remediation (`000-deep-loop-runtime-refinement`) precedes this phase as a prerequisite, since the mode reuses that runtime. This is the first mode-build phase and has no other predecessor beyond the approved parent packet context and the frozen design brief it was scaffolded from.

**Deliverables**:
- A confirmed inventory of the `deep-review` packet and the shared runtime scripts it reuses, with file:line grounding for what is shared (`runtime/scripts/`) versus mode-local (`deep-review/scripts/`).
- A confirmed summary of the three prior-art packets: `052-deep-loop-unification`, `055-deep-loop-divergent-mode`, and `051-deep-loop-parent-skill-alignment` — including what `051` actually is, since its own title and scope must be read directly rather than assumed from its name.
- A confirmed inventory of each of the four parent skills' standards surfaces: `sk-doc` (`validate_document.py`, `extract_structure.py`, `core_standards.md`), `sk-git` (`SKILL.md` conventional-commit + worktree/branch rules), `sk-design` (DESIGN.md/token structure, audit-mode dimensions), `sk-code` (`SKILL.md` Smart Routing surface-detection markers).
- A confirmed read of the reference implementation packets `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review` and `130-hub-doc-conformance-fixes/002-hub-doc-conformance-fixes`, since the mode's alignment contract productizes exactly this manual pattern.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002's architecture freeze (adapter contract, state machine, reuse boundary) depends on accurate, current facts about the `deep-review` engine's real shape, the standards surfaces of four parent skills, and the one manual precedent (`130`/`131`) the whole mode-packet productizes. Assuming these facts from the design brief alone risks freezing an architecture against a stale or imagined shape of the runtime — for example, the design brief lists `reduce-state.cjs` as a shared runtime script, but a direct read shows it living per-mode at `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs`, not under `.opencode/skills/system-deep-loop/runtime/scripts/`, which changes what "reuse the runtime engine" actually means for phase 008.

### Purpose
Produce a trustworthy, read-only factual foundation — a research/context map with confirmed reuse points — before phase 002 freezes the deep-alignment architecture.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `.opencode/skills/system-deep-loop/deep-review/SKILL.md` and its `runtime/scripts/` + mode-local `scripts/` directories to confirm which loop primitives are shared runtime vs. mode-local, with file:line evidence.
- Read `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md`, `055-deep-loop-divergent-mode/spec.md`, and `051-deep-loop-parent-skill-alignment/spec.md` to confirm what each program actually did, not what its folder name implies.
- Read the four parent skills' standards surfaces named in the design brief: `sk-doc`, `sk-git`, `sk-design`, `sk-code`.
- Read `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-strategy.md` and `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/002-hub-doc-conformance-fixes/spec.md` as the reference implementation this mode-packet generalizes.

### Out of Scope
- Any decision about the final adapter contract shape, state machine, or artifact layout — those are frozen in phase 002, not decided here.
- File moves, mode-packet scaffolding, or command/agent creation — those start no earlier than phase 003.
- Edits to `.opencode/skills/system-deep-loop/`, `.opencode/commands/`, or any file outside this phase folder — phase 001 is a read-only research gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/spec.md` | Modify | Record the confirmed research/context map and reuse points once the research passes run |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/plan.md` | Modify | Plan the four research passes and the verification path |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/tasks.md` | Modify | Track the scoped research-gate tasks pending execution |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirmed inventory of the `deep-review` packet and runtime scripts | Inventory states, with file:line evidence, which loop primitives are shared under `runtime/scripts/` and which are mode-local under `deep-review/scripts/` |
| REQ-002 | Confirmed prior-art summary for 052, 055, and 051 | Summary is grounded in a direct read of each packet's `spec.md`, not inferred from folder names, and states what each program actually delivered |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Confirmed standards-surface inventory for `sk-doc`, `sk-git`, `sk-design`, `sk-code` | Inventory names the concrete files each authority's future adapter would read, with real paths |
| REQ-004 | Confirmed read of the 130/131 reference packets | Summary states the scoping question, ruleset, and verify-first fix pattern those packets used by hand |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research artifacts are grounded in fresh reads with file:line citations, not assumptions carried over from the design brief.
- **SC-002**: Zero files outside `.opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/` are touched during this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None | First phase, no predecessor phase dependency | Proceed once the scoped research plan is reviewed |
| Risk | Design-brief assumptions about the runtime engine's shape are stale or imprecise | Medium | Re-read the actual scripts and packets rather than trusting the brief's bullet list verbatim |
| Risk | 051's actual scope is misread from its folder name alone | Medium | Read `051-deep-loop-parent-skill-alignment/spec.md` directly and record its real delivered scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `reduce-state.cjs` stay mode-local (`deep-review/scripts/reduce-state.cjs`) for deep-alignment's own copy, or does phase 008 need a shared runtime version? Owned by phase 002/008.
- Are there other deep-review mode-local scripts (beyond `reduce-state.cjs`) that phase 008 will need to fork rather than import directly? To be confirmed during this phase's script inventory pass.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
