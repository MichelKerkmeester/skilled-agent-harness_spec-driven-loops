---
title: "Feature Specification: doc realignment to the parity keystone"
description: "Realign the sk-design-interface feature catalog, manual testing playbook, and README, and the mcp-magicpath README and scripts README, to the new reality shipped in 007 (the Claude Design parity protocol, the previewImageUrl fidelity loop, reuse-before-generate, and the design_fidelity.py helper). Authored by fresh opus markdown agents."
trigger_phrases:
  - "sk-design-interface doc realignment"
  - "parity keystone doc alignment"
  - "feature catalog playbook readme realign"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/008-doc-realignment"
    last_updated_at: "2026-06-14T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Opus agents realigned the skill docs to the parity reality; validated"
    next_safe_action: "Commit when ready"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-008-doc-realignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: doc realignment to the parity keystone

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Method** | Fresh opus markdown agents, scoped per doc surface; orchestrator reconciles + validates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 007 keystone added the Claude Design parity protocol (`claude_design_parity.md`), the `previewImageUrl` fidelity loop, reuse-before-generate, and the `design_fidelity.py` helper. But the feature catalog, manual testing playbook, and README for `sk-design-interface` were authored in 004 (before 007), and `mcp-magicpath`'s README + scripts README predate its new canvas-side parity rule + helper. These docs no longer match reality.

### Purpose
Realign every affected doc surface to the post-007 reality, accurately and without bloat, so the skills' documentation reflects what they actually do.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `sk-design-interface`: `feature_catalog/`, `manual_testing_playbook/`, `README.md` — represent the parity protocol, fidelity loop, reuse-before-generate.
- `mcp-magicpath`: `README.md`, `scripts/README.md` — represent the canvas-side parity rule + the `design_fidelity.py` helper.
- Verify `SKILL.md` and graph-metadata stay consistent (orchestrator-reconciled).

### Out of Scope
- Changing skill behavior or the protocol itself (007 owns that).
- Adding a feature_catalog or playbook to mcp-magicpath (not requested; align existing docs only).
- `design_principles.md` content.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: The sk-design-interface feature catalog represents the parity protocol/fidelity loop as a real feature (or updates the relevant existing entries) accurately.
- R2: The manual testing playbook has a scenario covering the parity loop (reuse-before-generate, the previewImageUrl fidelity check).
- R3: Both READMEs (sk-design-interface, mcp-magicpath) mention the new capability; the mcp-magicpath scripts README documents `design_fidelity.py`.
- R4: All realigned docs pass sk-doc validation; both skills pass `package_skill.py`; counts/claims are accurate to the files.
- R5: No bloat; the protocol content stays single-sourced in `claude_design_parity.md` (docs point to it).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every affected doc accurately reflects the post-007 reality.
- sk-doc validators + `package_skill.py` pass for both skills.
- No duplicated protocol content; docs reference the single source.
- Authored by fresh opus agents; orchestrator reconciled shared files + validated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| Agents over-write / duplicate protocol content | Each agent scoped to a distinct doc surface; docs point to the single-source protocol |
| Concurrent writes to shared files | Agents do not touch SKILL.md/graph-metadata; the orchestrator reconciles those |
| Inaccurate counts/claims | Agents reason from the real files; orchestrator validates |
| Depends on 007 | 007 complete and committed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether mcp-magicpath should gain its own feature_catalog/playbook later; out of scope here (align existing docs only).

<!-- /ANCHOR:questions -->
