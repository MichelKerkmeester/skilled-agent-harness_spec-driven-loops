---
title: "Implementation Plan: sk-interface-design doc alignment, catalog, playbook"
description: "Plan to bring sk-interface-design to full sk-doc template alignment via fresh markdown agents: a feature catalog, a manual testing playbook, aligned references, documented assets, and accurate graph-metadata."
trigger_phrases:
  - "sk-interface-design doc alignment plan"
  - "feature catalog and playbook plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/004-doc-alignment-catalog-playbook"
    last_updated_at: "2026-06-13T19:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the doc-alignment plan"
    next_safe_action: "Execute via fresh markdown agents"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-004-doc-alignment-catalog-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-interface-design doc alignment, catalog, playbook

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + JSON graph metadata |
| **Framework** | sk-doc templates, /create command workflows, skill-advisor graph |
| **Storage** | `.opencode/skills/sk-interface-design/` (feature_catalog/, manual_testing_playbook/, references/, assets/) |
| **Testing** | sk-doc `validate_document.py`, `package_skill.py`, `validate.sh --strict` |

### Overview
Bring `sk-interface-design` to full sk-doc template alignment via fresh markdown agents using the /create workflows: a feature catalog, a manual testing playbook, template-aligned references, a self-documenting assets dir, and accurate graph-metadata.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] sk-doc templates + /create command contracts identified
- [x] Exemplar skills (deep-review FC, sk-code-review PB) reviewed
- [x] Spec folder established as the Gate-3 home

### Definition of Done
- [x] Feature catalog + manual testing playbook present and sk-doc valid
- [x] All references aligned; assets documented; graph-metadata accurate
- [x] `package_skill.py` valid; `validate.sh --strict` green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel fresh markdown agents, each scoped to a disjoint directory; the orchestrator reconciles the shared files (SKILL.md, graph-metadata.json) centrally to avoid write races.

### Key Components
- **Feature catalog agent**: `feature_catalog/` index + numbered sections.
- **Playbook agent**: `manual_testing_playbook/` index + numbered scenarios.
- **Reference agent**: aligns the three references to the sk-doc reference template.
- **Orchestrator**: SKILL.md pointers, graph-metadata key_files/summary, assets README.

### Data Flow
Agents author their dirs → orchestrator reconciles SKILL.md + graph-metadata → validators confirm.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-interface-design/feature_catalog/` | New | create (agent) | validate_document + package_skill |
| `sk-interface-design/manual_testing_playbook/` | New | create (agent) | validate_document + package_skill |
| `sk-interface-design/references/*.md` | Existing | align (agent) | validate_document --type reference |
| `sk-interface-design/{SKILL.md,graph-metadata.json}` | Existing | reconcile (orchestrator) | package_skill, JSON parse |
| `sk-interface-design/assets/data/README.md` | New | add (orchestrator) | present + links resolve |
| `sk-interface-design/{LICENSE*,THIRD-PARTY-NOTICES}.{txt,md}` | Existing | restored from HEAD after a concurrent worktree deletion | on-disk present |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Map /create commands + sk-doc templates + exemplars
- [x] Scaffold the 004 spec folder (Gate-3 home)

### Phase 2: Core Implementation
- [x] Dispatch three fresh markdown agents (feature catalog, playbook, reference alignment)
- [x] Reconcile SKILL.md (FC + PB pointers) and graph-metadata (key_files, summary, count fix)
- [x] Add the assets data README; restore the license/notice files removed from the worktree

### Phase 3: Verification
- [x] sk-doc validators on the new docs; `package_skill.py` valid
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document | FC, PB, references structure | `validate_document.py` |
| Skill | Whole-skill validity | `package_skill.py` |
| Packet | Spec-folder docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../003-ui-ux-pro-max-merge` | Internal | Green (complete) | No merged skill to align |
| sk-doc templates + /create commands | Internal | Green | No template to align to |
| @markdown agent | Internal | Green | No authoring agent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc fails sk-doc validation or breaks the skill.
- **Procedure**: Revert the skill-dir doc changes (git); the feature_catalog/ and manual_testing_playbook/ are additive and can be removed without affecting behavior.
<!-- /ANCHOR:rollback -->
