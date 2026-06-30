---
title: "Feature Specification: Phase 1: Frontmatter Benefit Investigation"
description: "Investigate who consumes detailed memory-style frontmatter on skill references/assets, why 103 of 369 docs carry it while the rest do not, and what sk-doc skill creation prescribes."
trigger_phrases:
  - "frontmatter benefit investigation"
  - "who consumes trigger_phrases"
  - "skill reference frontmatter audit"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation"
    last_updated_at: "2026-06-11T06:10:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Completed consumer audit and frontmatter inventory; findings in research.md"
    next_safe_action: "Build advisor doc-harvest consumer packet; pilot deep-loop-runtime"
    blockers: []
    key_files:
      - "research.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-frontmatter-benefit-investigation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No runtime system consumes trigger_phrases/importance_tier/contextType on references/assets today."
      - "Operator picked Option B with the skill advisor as sole consumer; spec memory never indexes skill docs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: Frontmatter Benefit Investigation

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
| **Created** | 2026-06-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 22 |
| **Predecessor** | None |
| **Successor** | 002-cli-claude-code |
| **Handoff Criteria** | Canonical contract decided by operator and recorded in implementation-summary.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Skill reference and asset frontmatter alignment across all public-repo skills specification.

**Scope Boundary**: Read-only investigation plus packet-local documentation. No skill files are modified by this phase.

**Dependencies**:
- None. This phase gates all 21 skill alignment children (002-022).

**Deliverables**:
- research.md with the frontmatter inventory, runtime consumer audit, sk-doc contract analysis, and a recommendation.
- implementation-summary.md recording the findings and the decision the operator must make.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Some skill reference and asset docs carry a detailed memory-style frontmatter block (`trigger_phrases`, `importance_tier`, `contextType`) while most carry only `title` + `description`, and nobody has established whether the detailed block does anything. Without knowing who consumes these fields, the 21 per-skill alignment phases cannot pick a direction: stripping the block could destroy value, and standardizing it everywhere could institutionalize dead metadata.

### Purpose
Produce an evidence-based answer to three questions: (1) what does the detailed block buy at runtime, (2) why do 103 of 369 docs have it while the rest do not, and (3) what does sk-doc skill-creation guidance actually prescribe — then recommend one canonical contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory of frontmatter practice across `.opencode/skills/*/references/**/*.md` and `.opencode/skills/*/assets/**/*.md` (all 21 skills)
- Code-level audit of every plausible consumer: Spec Kit Memory indexing, Skill Advisor graph compilation, Code Graph scope policy
- Reading of sk-doc skill-creation guidance (`skill_creation.md`, `frontmatter_templates.md`, document templates) for the prescribed contract
- A written recommendation with options and trade-offs for the operator

### Out of Scope
- Modifying any skill doc - that is the job of children 002-022
- Modifying sk-doc guidance - owned by 016-sk-doc once the contract is decided
- Building a new runtime consumer for per-doc frontmatter - separate packet if the operator picks that option

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research.md` (this packet) | Create | Full investigation findings with evidence |
| `implementation-summary.md` (this packet) | Create | Findings summary and pending operator decision |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Quantify the frontmatter split across all 21 skills' references/ and assets/ | Per-skill counts of detailed-block vs title+description vs no-frontmatter docs recorded in research.md |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Identify every runtime consumer of `trigger_phrases` / `importance_tier` / `contextType` on skill reference/asset docs, with file:line evidence | research.md cites the indexing gate, advisor compiler input, and code-graph scope policy source locations |
| REQ-003 | Document what sk-doc skill creation prescribes for reference/asset frontmatter, including internal contradictions | research.md quotes the knowledge-file rule and the conflicting template requirements |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The benefit question is answered with code evidence, not inference: each claimed consumer or non-consumer cites the gating function or schema
- **SC-002**: A recommendation with at least two options and their trade-offs is recorded, leaving the operator a single decision to unblock phases 002-022
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A consumer exists outside the audited surfaces (e.g., an ad-hoc script) | Low | Audit covered memory parser, advisor compiler+scorer, code-graph scope, and repo-wide greps for the field names in executable code |
| Dependency | Operator decision on the canonical contract | Blocks 002-022 | Recommendation defaults to Option A so children can proceed unless overridden |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Decided 2026-06-11: the operator picked **Option B** with a corrected consumer — the **skill advisor** harvests per-doc frontmatter (doc-level rows in skill-graph.sqlite, dampened routing signal, `matched_docs` pointers in recommendations). Spec Kit Memory will NEVER index skill docs (explicit operator directive). Full block authored on all references/assets in phases 002-022; consumer built in a dedicated skilled-agent-orchestration packet.
<!-- /ANCHOR:questions -->
