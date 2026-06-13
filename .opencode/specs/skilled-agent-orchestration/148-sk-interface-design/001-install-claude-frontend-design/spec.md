---
title: "Feature Specification: install-claude-frontend-design"
description: "Vendor Anthropic's frontend-design skill into the framework as sk-interface-design (sk-code family) with a lean house-template SKILL.md, a reference-template principles doc, README, schema-2 graph metadata, catalog registration, and advisor-graph indexing."
trigger_phrases:
  - "interface design skill"
  - "frontend design skill"
  - "sk-interface-design"
  - "vendor anthropic skill"
  - "skill registration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design/001-install-claude-frontend-design"
    last_updated_at: "2026-06-13T13:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored spec for sk-interface-design framework install"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/SKILL.md"
      - ".opencode/skills/sk-interface-design/references/design_principles.md"
      - ".opencode/skills/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-001-install-claude-frontend-design"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Skill name: sk-interface-design (sk-code family)"
      - "Install target: framework .opencode/skills"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: install-claude-frontend-design

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-13 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The framework produced templated, generic UI when asked for design work (a MagicPath sector variation that did not read as on-brand). There was no reusable, advisor-routable guidance for distinctive visual design. Anthropic publishes a strong `frontend-design` skill, but it is shaped for its own plugin ecosystem, not this repository's curated `.opencode/skills` conventions (family prefixes, house SKILL/README/reference templates, schema-2 graph metadata, catalog index, advisor SQLite graph).

### Purpose
Vendor that skill into `.opencode/skills/sk-interface-design/` so the advisor surfaces it whenever UI work is detected, giving every future design task a deliberate, non-templated point of view.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Vendor Anthropic's `frontend-design` SKILL.md content and preserve its LICENSE (Apache-2.0).
- Author a lean house-template `SKILL.md` and relocate the guidance into a reference-template `references/design_principles.md`.
- Author a house-voice `README.md` and a schema-2 `graph-metadata.json` (sk-code family).
- Register in the skills catalog, the root README, and the advisor SQLite graph.

### Out of Scope
- Modifying `sk-code` beyond a single reciprocal sibling edge needed for graph symmetry.
- A repo-wide `sanitizer_version` derived-block backfill (pre-existing across all skills).
- Re-doing the MagicPath component; this packet only installs the design-guidance skill.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-interface-design/SKILL.md` | Create | Lean house-template runtime instructions (WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / REFERENCES) |
| `.opencode/skills/sk-interface-design/references/design_principles.md` | Create | Full upstream guidance, conformed to the reference template (verbatim prose) |
| `.opencode/skills/sk-interface-design/LICENSE.txt` | Create | Anthropic Apache-2.0 license, preserved verbatim |
| `.opencode/skills/sk-interface-design/README.md` | Create | House-voice 9-section README |
| `.opencode/skills/sk-interface-design/graph-metadata.json` | Create | Schema-2 advisor graph node |
| `.opencode/skills/sk-code/graph-metadata.json` | Modify | Add reciprocal sibling edge to sk-interface-design |
| `.opencode/skills/README.md` | Modify | Catalog row + counts (sk-* 6->7, total 22->23) |
| `README.md` (repo root) | Modify | Skill listing + skills table row + count 22->23 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Conformant skill folder exists | **Given** the framework, **When** listing `.opencode/skills/sk-interface-design/`, **Then** SKILL.md, README.md, graph-metadata.json, references/design_principles.md and LICENSE.txt are present |
| REQ-002 | Skill passes sk-doc standards | **Given** the skill, **When** running `package_skill.py`, **Then** it reports valid with zero warnings, and `validate_document.py` passes for SKILL/README/reference |
| REQ-003 | Advisor routes to it | **Given** a scanned graph, **When** running `advisor_recommend` on a design prompt, **Then** `sk-interface-design` is the top match and `skill_graph_validate` reports errorCount 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Upstream content preserved | **Given** the reference, **When** comparing to upstream, **Then** the guidance prose is intact and the Apache-2.0 LICENSE + attribution are retained |
| REQ-005 | Catalog + root README updated | **Given** both READMEs, **When** reading them, **Then** sk-interface-design appears and the skill count is a consistent 23 |
| REQ-006 | Graph symmetry clean | **Given** the sibling edge, **When** validating the graph, **Then** no sibling-symmetry warning remains |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The advisor routes a UI/design prompt to `sk-interface-design` with confidence >= 0.8 and uncertainty <= 0.35 (Gate 2).
- **SC-002**: `package_skill.py` valid with zero warnings; `validate.sh <spec-folder> --strict` exits clean.
- **SC-003**: Skill count reads a consistent 23 across the catalog and the root README.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Anthropic upstream skill | Source could change | Vendored verbatim with LICENSE + attribution; pinned at install time |
| Risk | Editing sk-code metadata | Could disturb a core skill | Single additive sibling edge only; re-scanned and validated (errorCount 0) |
| Risk | License compliance | Apache-2.0 requires attribution | LICENSE.txt preserved; SKILL/README/reference cite the source |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skill loads on demand; SKILL.md stays well under the 5k-word cap.
- **NFR-P02**: Advisor scan indexes the new node in a single pass.

### Security
- **NFR-S01**: No secrets or executable payloads; guidance content only.
- **NFR-S02**: License terms preserved; attribution intact.

### Reliability
- **NFR-R01**: Graph validates with zero errors after registration.
- **NFR-R02**: Skill count stays consistent across both READMEs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty brief: the skill instructs to pin the subject, audience, and page job before designing.
- Brief that fixes the direction: the brief wins verbatim; default-avoidance applies only to free axes.
- Non-visual task: routing should prefer sk-code; this skill abstains.

### Error Scenarios
- Upstream unavailable: the vendored copy is self-contained; no live dependency.
- Advisor stale: a re-scan re-indexes the node.

### State Transitions
- Skill renamed or removed: a re-scan reconciles the graph node.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 5 new files + 3 edits; mostly vendored content |
| Risk | 7/25 | Additive; one core-skill metadata edit, validated |
| Research | 9/20 | Located upstream, extracted anobel design tokens earlier in session |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Skill name (`sk-interface-design`) and framework install target were resolved with the operator.
<!-- /ANCHOR:questions -->
