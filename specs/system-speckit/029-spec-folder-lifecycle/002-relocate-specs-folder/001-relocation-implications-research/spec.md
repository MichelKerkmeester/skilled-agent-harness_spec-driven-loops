---
title: "Feature Specification: Relocation Implications Research"
description: "Dual-executor deep research on the implications of moving the root .opencode/specs folder to a top-level specs/ directory, before any migration is attempted."
trigger_phrases:
  - "relocation implications research"
  - "specs folder research"
  - "glm grok specs relocation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/001-relocation-implications-research"
    last_updated_at: "2026-08-06T13:28:45Z"
    last_updated_by: "claude-code"
    recent_action: "Second round (sol, luna) converged; 4-lineage synthesis complete"
    next_safe_action: "Read research/research.md before scoping phase 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Relocation Implications Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-migration-plan |
| **Handoff Criteria** | Both research lineages converge (or hit the 10-iteration cap) and `research/research.md` carries a ranked implication list with an explicit recommendation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the specs-folder relocation specification — the only phase currently planned. It runs research only; it makes no path or code changes.

**Scope Boundary**: Investigate and report. Do not move, symlink, or reconfigure anything during this phase.

**Dependencies**:
- `devin` CLI authenticated (cli-devin executor, model `glm-5-2` = GLM-5.2 High)
- `cursor-agent` CLI authenticated (cli-cursor executor, model `cursor-grok-4.5-high`)

**Deliverables**:
- `research/research.md` with findings from both lineages
- A ranked list of implications (tooling, cross-runtime, git/gitignore, memory-MCP, migration risk) and an explicit go/no-go-leaning recommendation

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nobody has mapped what actually breaks if `.opencode/specs/` becomes a top-level `specs/` directory. Spec-kit tooling, the memory MCP server, six runtime mirrors, the global `.gitignore_global`, and thousands of in-repo path references all carry assumptions about the current location that no one has enumerated.

### Purpose
Produce a source-cited, ranked list of implications and risks of the relocation, dual-sourced from two independent frontier models running full 10-iteration research loops, so the operator can make an informed go/no-go call before any phase touches a real path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Dispatch `/deep:research:auto` with two independent CLI lineages: `cli-devin` (model `glm-5-2`) and `cli-cursor` (model `cursor-grok-4.5-high`), 10 iterations each.
- Investigate: spec-kit tooling path assumptions (`validate.sh`, `create.sh`, generators), the memory MCP server's path resolution, cross-runtime mirror behavior (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`), the existing `specs -> .opencode/specs` symlink and the `!specs`/`!.opencode/` `.gitignore` negation rules, and the scale of in-repo path references that would need repointing.
- Synthesize both lineages' findings into a single ranked implication list with a recommendation.

### Out of Scope
- Any actual file move, symlink change, or config edit — this phase is research-only.
- Deciding the migration approach itself (literal rename vs. keep `.opencode/specs` as the real tree) — that is a later-phase decision informed by this research.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/*` | Create | Deep-research state and findings, written by the `/deep:research` workflow itself |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dual-executor research dispatched | Both the `cli-devin`/`glm-5-2` and `cli-cursor`/`cursor-grok-4.5-high` lineages run under `/deep:research:auto` with `--concurrency=2` |
| REQ-002 | Each lineage completes its research | Each lineage converges or reaches `--max-iterations=10`; `research/lineages/<label>/` holds a non-empty `iteration-NNN.md` and JSONL delta per completed iteration |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Findings synthesized | `research/research.md` cites findings from both lineages with `[SOURCE: ...]` tags and a ranked implication list |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with findings from both lineages, each finding source-cited.
- **SC-002**: The synthesis names an explicit recommendation (proceed / proceed-with-caveats / do-not-proceed) that a later phase can act on without re-deriving it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `devin`/`cursor-agent` CLI auth | Lineage cannot dispatch if login is missing | Auth pre-flight before dispatch; ask the operator to log in if either check fails |
| Risk | The two lineages disagree on the recommendation | Medium — ambiguous signal for the go/no-go call | Synthesis step compares both lineages explicitly rather than picking one silently |
| Risk | External CLI cost/time for 20 iterations across two paid models | Medium — real API spend and wall-clock time | Iteration count is capped at 10 per lineage; lineages run concurrently, not serially |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Literal directory rename vs. keep `.opencode/specs` as the real tree with `specs/` staying a convenience symlink — deferred to the research findings, not assumed here.
- Whether other runtime mirrors need their own `specs` symlink, or already resolve through `.opencode/specs` — deferred to the research findings.
<!-- /ANCHOR:questions -->
