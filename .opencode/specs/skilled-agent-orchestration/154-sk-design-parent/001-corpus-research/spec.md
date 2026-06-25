---
title: "Feature Specification: Phase 1 — corpus research"
description: "Run a 50-iteration, 4-model deep-research pass over the external design-skills corpus to produce a decision-ready sk-design sub-skill taxonomy and structural-model evidence."
trigger_phrases:
  - "corpus research"
  - "sk-design taxonomy research"
  - "design skills deep research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/001-corpus-research"
    last_updated_at: "2026-06-25T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Author phase-1 corpus-research spec"
    next_safe_action: "Write the fan-out config and launch the 50-iteration research"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — corpus research

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
| **Created** | 2026-06-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | ../002-architecture-decision/spec.md (planned) |
| **Handoff Criteria** | `research/research.md` produced; each lineage hit its iteration cap; a decision-ready taxonomy + structural-model recommendation exists for human review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-design parent-skill decomposition. It is the research gate: it determines the family's composition before any build phase runs.

**Scope Boundary**: Run and synthesize the deep-research pass only. No skills are built, migrated, or scaffolded in this phase.

**Dependencies**:
- The external corpus at `../external/` (41 design-skill docs + `designer-skills-main` + `apple-bento-grid-main`).
- The deep-research fan-out engine (`/deep:research`, `deep-loop-runtime`).
- CLI executors: `cli-opencode` (GPT-5.5, MiMo, Kimi) and `cli-claude-code` (Opus 4.8 via the second Claude account).

**Deliverables**:
- `research/research.md` — merged, cited synthesis across all four model lineages.
- A decision-ready sub-skill taxonomy (4–7 children) with each child's scope and corpus sources.
- Structural-model evidence (single hub with nested packets vs. umbrella over a sibling family).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-design` family's composition is undecided. We hold a 41-document external design-skills corpus plus two mature skills (`sk-design-interface`, `sk-design-md-generator`), but there is no evidence-based taxonomy for which design sub-skills should exist, nor a defensible structural model for the parent. Building before deciding would lock in an arbitrary shape.

### Purpose
Produce, from a 50-iteration / 4-model deep-research pass over the corpus, a decision-ready sub-skill taxonomy and structural-model recommendation that gates every downstream build phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `research/deep-research-fanout-config.json` with the four lineages and the 20/15/8/7 per-lineage iteration split.
- Run the fan-out deep-research over `../external/`; merge lineages into one `research/research.md` + findings registry.
- Verify each lineage reached its iteration cap; summarize the recommended taxonomy + structural-model evidence.

### Out of Scope
- The architecture decision (owned by `002-architecture-decision`) — this phase recommends, it does not bind.
- Scaffolding, onboarding existing skills, or building sub-skills (phases 003–005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/deep-research-fanout-config.json` | Create | Four-lineage fan-out config (20/15/8/7) |
| `research/research.md` | Create | Merged, cited synthesis (loop-generated) |
| `research/` (state, lineages, findings) | Create | Deep-research loop artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Exactly 50 iterations across four lineages in the split GPT-5.5×20, Opus-4.8×15, MiMo×8, Kimi×7 | Each `research/lineages/{label}/deep-research-state.jsonl` shows its target count with `stopReason: maxIterationsReached` |
| REQ-002 | Merged synthesis produced | `research/research.md` exists with cross-lineage findings and source citations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Decision-ready taxonomy | 4–7 named sub-skills, each with scope + corpus sources, captured for review |
| REQ-004 | Structural-model evidence | Findings address hub-vs-umbrella coupling/shared-runtime signals |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` consolidates all four lineages with citations.
- **SC-002**: The 20/15/8/7 split is verifiable from per-lineage state; the family taxonomy + structural recommendation are ready for the human review gate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fan-out ignores global `--max-iterations` | Split silently breaks | Set per-lineage `iterations`; verify caps post-run |
| Risk | Small-model design lineages (MiMo/Kimi) are new here | Executor wiring may fail | 1-iteration smoke test before the full run |
| Dependency | Second Claude account `~/.claude-account2` | Opus lineage cannot run | Confirm authenticated before launch |
| Risk | 50 iters × 4 CLI subprocesses | Multi-hour, costly | Attended start; concurrency 4; wall-clock gated by slowest lineage |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Final sub-skill count (4 vs 6 vs 7) — the research prunes/merges the candidate seed.
- Whether `sk-design-md-generator` is better as a packet or a sibling — evidence feeds the 002 decision.
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
