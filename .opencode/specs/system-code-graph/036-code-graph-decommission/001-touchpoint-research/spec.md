---
title: "Feature Specification: Phase 1: touchpoint-research"
description: "Exhaustive, multi-model research pass that inventories every registration, import, shell-out, hook, plugin, CI job, agent tool grant, and doctrine claim that must change before the system-code-graph subsystem can be removed, and establishes the ordering constraints between them."
trigger_phrases:
  - "code graph touchpoint research"
  - "decommission touchpoint inventory"
  - "code graph removal research"
  - "mk_code_index reference sweep"
  - "036 touchpoint research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/001-touchpoint-research"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Launch the three-lane deep-research fan-out bound to this folder"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-001-touchpoint-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: touchpoint-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 15 |
| **Predecessor** | None |
| **Successor** | 002-decommission-decision-record |
| **Handoff Criteria** | `research/research.md` exists with a cited touchpoint inventory and a per-consumer removal-vs-fallback recommendation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the code graph decommission specification.

**Scope Boundary**: Research only. This phase reads and reports; it changes no runtime file, edits no consumer, and deletes nothing.

**Dependencies**:
- A wired `cli-devin` deep-loop executor (`system-deep-loop/041-cli-devin-executor-wiring`) before the GLM lane can dispatch.
- `cli-codex` and `cli-cursor` executors already wired in `runtime/lib/deep-loop/executor-config.ts`.

**Deliverables**:
- A cited touchpoint inventory covering every live reference, bucketed by consumer and mutation class.
- An ordering graph: which decouplings must precede which, and what breaks if the order is violated.
- A per-consumer recommendation of *remove the feature* versus *keep the call site behind a fallback*.
- A negative-knowledge list: places that look like touchpoints but are archival, generated, or simply not there.

**Refuted during verification — do not reinstate without new evidence:**
- *"`.pi/mcp.json` is a fourth MCP registration."* It is not. Its servers are `sequential_thinking`, `mk-spec-memory`, `mk_skill_advisor`, and `code_mode`; it contains zero references to the retiring server. Three physical registrations remain the complete set.
- *"A Pi freshness hook exists at `.pi/extensions/`."* It does not. That directory holds six unrelated extensions; the reported hit resolved to a copy inside `.worktrees/`, not the working tree.

Worktrees under `.worktrees/` carry full copies of the subsystem and will match any sweep. They are neither the working tree nor an edit target, and must be excluded from residual counts.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The subsystem is reached from five runtime registrations, two plugins, three per-runtime freshness hooks, a git post-commit hook, two session reapers, a process-level boundary in `system-spec-kit`, the skill-advisor graph, a CI job, and the `/doctor` surface. A first-pass sweep found 413 live files, but that sweep also proved fragile: a global gitignore silently hid the MCP registration files until `--no-ignore` was added, and `--no-ignore` alone still drops every dot-prefixed control file until `--hidden` joins it. An inventory that misses one hard `require` leaves the repo broken at session start, and an inventory that over-reaches rewrites archived spec history.

### Purpose
Produce an inventory trustworthy enough to drive deletion — complete on the live surface, correctly bounded away from the archival surface, and ordered so that no phase deletes something another phase still imports.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every live reference to `system-code-graph`, `mk_code_index`/`mk-code-index`, the eight `code_graph_*` tool ids, `detect_changes`, and `code-index.cjs`.
- Classification of each hit as blocking runtime break, test, doc/prose, generated artifact, or archival record.
- Ordering constraints and rollback risk per consumer.
- Identification of files that are generated and must be re-rendered rather than hand-edited.

### Out of Scope
- Any mutation of the runtime, consumers, or docs — later phases own that.
- Rewriting archived spec packets under `.opencode/specs/**` — they are the historical record.
- Deciding whether structural search should be replaced by a new engine; this packet retires the existing one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Canonical synthesis across all three lanes |
| `research/lineages/**` | Create | Per-lineage loop state, iterations, and deltas |
| `research/resource-map.md` | Create | Converged pointer map of touchpoints by consumer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every sweep command in the findings uses `--hidden --no-ignore` | No finding cites a sweep that would skip `opencode.json`, `.mcp.json`, `.cursor/mcp.json`, `.claude/settings.local.json`, or any dot-prefixed control file. `--no-ignore` alone is insufficient: without `--hidden` it returns only the visible matches and drops the hidden runtime controls entirely |
| REQ-002 | Symlinked paths are deduplicated before counting | `CLAUDE.md`/`AGENTS.md` and the `.mcp.json` chain each appear once, with the symlink relationship stated |
| REQ-003 | Every blocking runtime break is enumerated with file:line | Each entry names the file, the line, and the failure mode if the target is absent |
| REQ-004 | The archival boundary is explicit | Findings state which paths are historical record and must not be edited |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Ordering constraints are stated as a dependency graph | Each decoupling names what must land before it |
| REQ-006 | Generated artifacts are flagged with their generator | Each generated file names the script that re-renders it |
| REQ-007 | Per-consumer removal-vs-fallback recommendation | Each consumer carries a recommendation and a one-line rationale |
| REQ-008 | All three lanes run to their full iteration count | `--stop-policy=max-iterations`; each lineage reaches its configured depth |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A post-research sweep with `--hidden --no-ignore` finds no live-surface reference absent from the inventory.
- **SC-002**: Every entry in the inventory is assigned to exactly one downstream phase (003–014).
- **SC-003**: The inventory distinguishes confirmed touchpoints (with file:line) from inferred ones.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-devin` executor wiring | GLM lane cannot dispatch | Land `system-deep-loop/041` first; smoke-test one lineage |
| Risk | Global gitignore and dot-prefixed paths hide files | False all-clear on registrations and hidden runtime controls | Both `--hidden` and `--no-ignore` mandated in REQ-001 and every downstream verification |
| Risk | Lanes converge early and under-explore | Shallow inventory | `--stop-policy=max-iterations` forces full depth |
| Risk | Findings treat archived packets as live | Spec history rewritten | Archival boundary is a P0 requirement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should any consumer keep a degraded fallback path rather than dropping the feature outright? Resolved by the recommendation in REQ-007 and ratified in phase 002.
- Does removing the `isolation-check` CI job leave a coupling pattern worth guarding elsewhere?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
