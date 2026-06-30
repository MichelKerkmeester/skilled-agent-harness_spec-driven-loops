---
title: "Feature Specification: sk-code Manual Testing Playbook Motion.dev Refinement"
description: "Extend the existing sk-code manual testing playbook with motion.dev integration scenarios, animation regression coverage, cross-browser checks, and performance gates while preserving the current sk-doc-aligned package shape."
trigger_phrases:
  - "sk-code playbook refinement"
  - "motion.dev manual testing"
  - "animation regression playbook"
  - "cross-browser performance gates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/001-playbook"
    last_updated_at: "2026-05-05T12:00:00Z"
    last_updated_by: "claude-orchestrator-or-cli-codex"
    recent_action: "Implementation complete; verified by opus reviewer + remediation"
    next_safe_action: "Packet ready for parent-level commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-code Manual Testing Playbook Motion.dev Refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | Parent Spec: `../spec.md` |
| **Packet** | `001-playbook` |
| **Implementation Surface** | `.opencode/skills/sk-code/manual_testing_playbook/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code manual testing playbook already follows the sk-doc playbook package contract, but it stops at routing and advisor scenarios. It does not yet cover motion.dev runtime integration, animation regression evidence, cross-browser animation behavior, or Core Web Vitals/performance checks for animation-heavy Webflow work.

### Purpose
Extend the playbook with two additional numbered category folders and seven deterministic scenarios while preserving the current root playbook structure, existing category files, and Packet 2/Packet 3 ownership boundaries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create motion.dev and animation regression scenarios under `05--motion-dev-and-animation-regression/`.
- Create cross-browser and performance-gate scenarios under `06--cross-browser-and-performance-gates/`.
- Update the root playbook overview, table of contents, category summaries, automated-test cross-reference, and feature catalog index.
- Cite official Motion documentation URLs for API, reduced-motion, and performance claims.
- Use real repo anchors from `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` and `a_nobel_en_zn/2_javascript/slider/testimonial.js` to keep scenarios realistic.

### Out of Scope
- Populating `.opencode/skills/sk-code/references/motion_dev/` or `.opencode/skills/sk-code/assets/motion_dev/`; Packet 2 owns that.
- Adding webflow reference "See also" pointers or sk-code metadata synchronization; Packet 3 owns that.
- Modifying `SKILL.md`, README files, sk-code root metadata, or changelog files.
- Reorganizing existing playbook categories or renumbering existing stable scenario IDs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/001-playbook/spec.md` | Create | Packet 1 Level 2 specification |
| `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/001-playbook/plan.md` | Create | Packet 1 implementation plan |
| `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/001-playbook/tasks.md` | Create | Packet 1 task ledger |
| `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/001-playbook/checklist.md` | Create | Packet 1 verification checklist |
| `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add two categories and renumber trailing sections |
| `.opencode/skills/sk-code/manual_testing_playbook/05--motion-dev-and-animation-regression/*.md` | Create | Four MR scenarios |
| `.opencode/skills/sk-code/manual_testing_playbook/06--cross-browser-and-performance-gates/*.md` | Create | Three CB scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the existing sk-doc playbook shape | Root file remains `manual_testing_playbook.md`; new scenarios live in numbered category folders; existing categories are not restructured |
| REQ-002 | Add deterministic motion.dev scenarios | MR-001 through MR-004 include exact prompts, exact command sequences, expected signals, evidence requirements, pass/fail criteria, and failure triage |
| REQ-003 | Add deterministic cross-browser/performance scenarios | CB-001 through CB-003 include browser, CWV, and GPU/compositing evidence requirements |
| REQ-004 | Respect packet boundaries | No edits outside the approved spec child folder and `.opencode/skills/sk-code/manual_testing_playbook/` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Root playbook reflects new coverage | Overview says 17 deterministic scenarios across 6 categories; TOC and section numbering are coherent |
| REQ-006 | Motion.dev claims cite official docs | Scenario files cite `https://motion.dev/docs/quick-start` and relevant subpages for API/performance/reduced-motion claims |
| REQ-007 | Real repo anchors are used | MR-004 and performance scenarios reference `nav_dropdown.js` and `testimonial.js` where relevant |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Seven new per-feature files exist with required frontmatter and the five-section playbook structure.
- **SC-002**: The root playbook indexes sections 11 and 12 for the new categories and renumbers automated-test and feature-catalog sections to 13 and 14.
- **SC-003**: Existing category folders and files remain untouched except for the root playbook update.
- **SC-004**: `validate.sh specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/001-playbook --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Motion.dev official documentation | API or guidance URLs can drift | Cite stable official URLs and keep scenario claims minimal |
| Risk | Existing playbook evidence deletions in working tree | Could be mistaken for Packet 1 edits | Ignore unrelated dirty state and modify only allowed files |
| Risk | Packet boundary drift | Packet 2/3 deliverables could be pulled into Packet 1 | Use placeholder note for `references/motion_dev/` and avoid metadata/cross-reference edits |
| Risk | Overly broad root edits | Existing scenario truth could be accidentally rewritten | Patch only overview, TOC, new sections, and index rows |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Documentation must remain deterministic and operator-friendly.
- Scenario prompts must be copy-paste ready.
- All new Markdown should use ASCII-only punctuation unless quoting an existing path or title that requires otherwise.
- New categories must preserve stable IDs once published.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Motion.dev may be loaded as `window.Motion` via a legacy CDN bundle or as an ES module import; scenarios must cover both patterns without declaring one universal loader.
- Reduced-motion verification differs between plain JavaScript and React/Vue APIs; Packet 1 tests observable behavior and browser settings, not a framework-specific implementation.
- GPU compositing evidence is partly browser-tool dependent; scenarios must define acceptable manual evidence when DevTools labels differ by browser version.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ESTIMATION

| Dimension | Estimate | Rationale |
|-----------|----------|-----------|
| Files touched | Medium | 4 planning docs, 1 root playbook, 7 per-feature files |
| Behavioral risk | Low | Documentation-only playbook extension |
| Coordination risk | Medium | Packet 2 and Packet 3 own adjacent motion_dev references and metadata |
| Verification complexity | Medium | Requires strict spec validation plus manual structural review of scenario files |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for Packet 1. Packet 2 owns the full motion.dev reference depth, and Packet 3 owns metadata and cross-reference propagation.
<!-- /ANCHOR:questions -->
