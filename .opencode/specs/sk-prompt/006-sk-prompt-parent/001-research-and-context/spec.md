---
title: "Feature Specification: Phase 1: research-and-context"
description: "Research-gate phase for the sk-prompt parent-hub program. This phase scopes read-only verification of the current sk-prompt and sk-prompt-models state plus a fresh referrer inventory before architecture decisions begin."
trigger_phrases:
  - "sk-prompt parent research"
  - "research gate"
  - "referrer inventory"
  - "sk-prompt-models fold-in"
  - "phase 001 research-and-context"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-parent/001-research-and-context"
    last_updated_at: "2026-07-09T13:42:00Z"
    last_updated_by: "opencode"
    recent_action: "Executed the re-verification and referrer sweep; zero drift found"
    next_safe_action: "Proceed to phase 002 decision gate"
    blockers: []
    key_files:
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/spec.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/plan.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-and-context"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does prompt-models need a lexical routing carve-out to preserve advisor accuracy? (empirical, owned by phase 007)"
    answered_questions:
      - "Skill-state snapshot re-verified 2026-07-09: zero drift from planning-time research (versions, tool postures, hardcoded paths, CI gate all unchanged)"
      - "Fresh referrer sweep: 79 active files reference sk-prompt-models (up from the ~53-file estimate once counting the model-benchmark write-target's 20 interpolated lines separately); 2 files reference sk-prompt/SKILL.md (the command's Step-1 Read + footer note)"
      - "121 rename program's key transferable lesson: never blindly flip references inside HISTORICAL changelog prose that documents a past rename event — use a clarifying parenthetical instead; only repoint LIVE functional/routing references"
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
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `scaffold/001-research-and-context` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-architecture-decision |
| **Handoff Criteria** | Verified skill-state snapshot, fresh referrer inventory, and 121 rename prior-art summary are ready for human review before phase 002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models specification.

**Scope Boundary**: Read-only research and inventory planning for phase 001. This phase may document findings inside this phase folder during execution, but it must not move, edit, or scaffold `.opencode/skills/sk-prompt/`, `.opencode/skills/sk-prompt-models/`, commands, CI, advisor code, or any file outside this phase folder.

**Dependencies**:
- None. This is the first phase and has no predecessor beyond the approved parent packet context.

**Deliverables**:
- Verified skill-state snapshot for both source skills, including `SKILL.md`, `README.md`, `graph-metadata.json`, `description.json`, version numbers, and tool postures.
- Fresh referrer inventory from a new grep sweep covering every live file that references `sk-prompt-models` or `sk-prompt/SKILL.md` outside `sk-prompt` itself.
- Prior-art summary of `.opencode/specs/sk-prompt/005-sk-prompt-models-rename/` focused on task shape, referrer handling, and lessons for the fold-in.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### Research Findings (executed 2026-07-09)

**Skill-state snapshot — zero drift.** `sk-prompt/SKILL.md` frontmatter unchanged: `version: 2.3.0.0`, `allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]`, latest changelog `v2.3.0.0.md`. `sk-prompt-models/SKILL.md` unchanged: `version: 0.8.0.0`, `allowed-tools: []`, latest changelog `v0.9.0.0.md`; its `description.json` still carries the disagreeing `"version": "0.2.1"`. Both `graph-metadata.json` files still present (one each, as expected pre-fold-in). The two hardcoded functional path-join call sites are unchanged and confirmed at their planning-time locations: `system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:162` and `system-skill-advisor/mcp_server/scripts/skill_advisor.py:3330`.

**Referrer inventory — re-run and confirmed.** `.github/workflows/prompt-card-sync.yml` exists and still targets this skill pair. `.opencode/commands/deep/model-benchmark.md` + its 2 YAML assets carry 20 interpolated `sk-prompt-models` write-target path lines (more precise than the planning-time ~16-line estimate — re-count, not new material). `.opencode/commands/prompt.md` carries exactly 2 references to `sk-prompt/SKILL.md` (the Step-1 `Read` call and a footer dependency note). A fresh repo-wide grep (excluding `sk-prompt-models/` itself, `z_archive/`, and `/specs/` history) finds 79 active files referencing `sk-prompt-models` — consistent with the planning-time estimate.

**Prior-art review — `005-sk-prompt-models-rename`.** That 9-phase program's own Open Questions section states the reusable lesson directly: *"For changelogs that document the original `sk-small-model → sk-prompt-small-model` rename event, use a clarifying parenthetical rather than a blind flip (history-care carve-out)."* This transfers directly to phases 004-006 of this program — repoint every LIVE functional/routing reference, but do not rewrite historical changelog prose that documents a past rename/state; add a clarifying note instead if one is needed.

**Conclusion**: no material changed since the planning-time research that produced this program's architecture and phase breakdown. Phase 002's decision-record.md target shape remains valid as drafted. No new open questions were surfaced.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002 architecture decisions depend on current, re-verified facts about two live skills and their referrers. The parent packet records planning-time research, but concurrent repository activity can make those notes stale, especially around hardcoded runtime paths, the live benchmark write target, CI gates, and documentation referrers.

### Purpose
Produce a trustworthy, read-only factual foundation for the sk-prompt parent-hub decision phase before any skill-file moves or hub scaffolding begin.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-verify the current state of `.opencode/skills/sk-prompt/` and `.opencode/skills/sk-prompt-models/` against the shared program context.
- Re-run the referrer sweep for `sk-prompt-models` and `sk-prompt/SKILL.md` outside `sk-prompt` itself, including hardcoded functional path joins, benchmark write-target automation, the prompt-card sync workflow, and documentation/prose referrers.
- Review `.opencode/specs/sk-prompt/005-sk-prompt-models-rename/` as prior art for task shape, path referrers, and rename lessons.

### Out of Scope
- File moves, hub scaffolding, router metadata creation, command renames, and path repoints - these start in later phases after the research gate is reviewed.
- Edits to `.opencode/skills/sk-prompt/`, `.opencode/skills/sk-prompt-models/`, `.opencode/commands/`, `.github/`, advisor code, or documentation outside this phase folder - phase 001 is a read-only research gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/spec.md` | Modify | Define the phase 001 read-only research scope and acceptance criteria |
| `.opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/plan.md` | Modify | Plan the two research passes, prior-art review, and verification path |
| `.opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/tasks.md` | Modify | Track the scoped research-gate tasks pending human review |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Re-verified skill-state snapshot | Snapshot covers both skills' `SKILL.md`, `README.md`, `graph-metadata.json`, `description.json`, version numbers, and tool postures, explicitly marking any drift from the shared context |
| REQ-002 | Complete fresh referrer inventory | Inventory is produced from a new grep sweep and includes file:line evidence for the two hardcoded path-join sites, the CI card-sync workflow, benchmark write-target automation, and documentation/prose referrers |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Prior-art summary from the 121 rename program | Summary identifies reusable task shape, referrer-handling lessons, and any constraints grounded in the 121 spec folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research artifacts are complete, internally consistent, and grounded in fresh reads/grep output rather than planning-time assumptions.
- **SC-002**: Zero files outside `.opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/` are touched during this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None | This is the first phase and has no predecessor phase dependency | Proceed after human review of the scoped research plan |
| Risk | Concurrent-session repository activity causes drift from planning-time research | Medium | Re-read live files and re-run the referrer grep sweep instead of trusting prior notes |
| Risk | Functional path referrers are missed because they fail silently after a move | High | Require file:line evidence for the known path-join sites and benchmark write-target automation before phase 002 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved by phase 002's decision-record.md: `prompt-improve`'s playbook stays packet-local; `sk-prompt-models` version metadata normalizes to `0.9.0.0` (packet) with the new hub releasing at `1.0.0.0`.
- Does the hub's `routingClass` stay `"metadata"` for both modes, or does `prompt-models` need a lexical carve-out to preserve today's advisor routing accuracy for small-model-dispatch queries? (empirical question, owned by phase 007's benchmark, not pre-decided — confirmed still open after re-verification)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
