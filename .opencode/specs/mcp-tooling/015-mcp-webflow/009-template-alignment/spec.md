---
title: "Feature Specification: Phase 9 - Template alignment and standards conformance"
description: "Strictly align every mcp-webflow packet file with the sk-create-skill asset/reference templates, the feature-catalog snippet template, and the manual-testing-playbook snippet template."
trigger_phrases:
  - "mcp-webflow template alignment"
  - "webflow asset template"
  - "webflow playbook naming"
  - "webflow playbook naming"
  - "template conformance"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/009-template-alignment"
    last_updated_at: "2026-08-03T06:13:04Z"
    last_updated_by: "template-author"
    recent_action: "Align the mcp-webflow packet with the canonical skill templates"
    next_safe_action: "Packet complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-mcp-webflow-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9 - Template alignment and standards conformance

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
| **Priority** | P0 |
| **Status** | Complete (2026-08-03) |
| **Created** | 2026-08-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 9 of 9 |
| **Predecessor** | `008-verification-and-closeout` |
| **Successor** | `010-designer-capabilities` |
| **Handoff Criteria** | Every packet file conforms to its canonical template; fresh DeepSeek v4 Flash sub-agents report zero P0/P1 deviations; validators pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
This read-only remediation phase strictly aligns every `mcp-webflow` packet file with the canonical templates:

- `sk-create-skill/assets/skill/skill-asset-template.md` — asset files (frontmatter, 1-2 sentence intro, OVERVIEW with Purpose/Usage, numbered sections, `---` dividers).
- `sk-create-skill/assets/skill/skill-reference-template.md` — reference files (same structural contract).
- `sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` — catalog cards.
- `sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md` — scenario files (no numeric filename prefixes).

**Scope Boundary**: packet-local files only; no hub or runtime changes.

**Deliverables**: aligned assets, examples relocated under `assets/examples/`, playbook scenarios renamed without numeric suffixes, catalog cards with template dividers, references with template structure, and a fresh DeepSeek v4 Flash sub-agent compliance check.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[One-sentence outcome statement. What does success look like?]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Align `assets/` files with the skill-asset-template (incl. canonical `[topic]-[type].md` naming).
- Move `examples/` under `assets/examples/` and align each example with the asset template.
- Rename playbook scenarios without the `-001` suffix; update the root index.
- Add `---` dividers and template sub-structure to feature-catalog cards.
- Align all `references/` files with the skill-reference-template.
- Update packet-internal cross-references after renames.
- Dispatch fresh DeepSeek v4 Flash sub-agents to verify template compliance.

### Out of Scope

- Hub/runtime files; the frozen safety contract; the action inventory content itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-webflow/assets/**` | Modify/rename | Asset-template alignment + canonical naming |
| `mcp-webflow/examples/**` | Move | Relocate to `assets/examples/` with asset-template alignment |
| `mcp-webflow/manual-testing-playbook/**` | Rename/modify | Drop numeric suffixes; snippet-template alignment |
| `mcp-webflow/feature-catalog/**` | Modify | Snippet-template dividers and sub-structure |
| `mcp-webflow/references/**` | Modify | Reference-template structure |
| `mcp-webflow/SKILL.md`, `README.md` | Modify | Update cross-references |
| `mcp-tooling/leaf-manifest.json` | Regenerate | After file moves/renames |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Asset files conform to skill-asset-template | Frontmatter, 1-2 sentence intro, OVERVIEW (Purpose/Usage), numbered sections, `---` dividers |
| REQ-002 | Examples live under `assets/examples/` and conform | Relocated; each example follows the asset template |
| REQ-003 | Playbook scenarios carry no numeric filename suffix | Filenames are descriptive kebab-case; root index updated |
| REQ-004 | Catalog cards conform to the snippet template | OVERVIEW / HOW IT WORKS / SOURCE FILES / SOURCE METADATA with dividers |
| REQ-005 | Reference files conform to skill-reference-template | Short intro, `---`, numbered sections, dividers |
| REQ-006 | Fresh DeepSeek v4 Flash sub-agents verify compliance | Zero P0/P1 deviations reported |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every packet file matches its canonical template structure.
- **SC-002**: No stale cross-reference survives the renames/moves.
- **SC-003**: Validators pass (validate_skill_package, package_skill --check, fleet metadata).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
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
