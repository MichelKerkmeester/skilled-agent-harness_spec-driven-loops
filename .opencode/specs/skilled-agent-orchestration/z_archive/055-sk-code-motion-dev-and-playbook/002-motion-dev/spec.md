---
title: "Feature Specification: sk-code Motion.dev Assets and References"
description: "Populate sk-code's empty cross-stack motion_dev reference and asset folders with cited Motion documentation, in-repo usage anchors, and ready-to-paste snippets that can be consumed by Webflow and future non-Webflow stacks."
trigger_phrases:
  - "sk-code motion.dev references"
  - "motion.dev assets"
  - "motion_dev cross-stack"
  - "002-motion-dev"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/002-motion-dev"
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
      - ".opencode/skills/sk-code/references/motion_dev/"
      - ".opencode/skills/sk-code/assets/motion_dev/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 skipped: packet spec folder pre-approved by dispatch"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-code Motion.dev Assets and References

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Packet** | `002-motion-dev` |
| **Implementation Surface** | `.opencode/skills/sk-code/references/motion_dev/`, `.opencode/skills/sk-code/assets/motion_dev/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code skill has empty peer folders for cross-stack motion.dev guidance. Existing animation guidance lives under `references/webflow/`, which correctly covers Webflow-specific loading and runtime behavior but leaves future non-Webflow stacks without a canonical Motion reference.

### Purpose
Create a cited, cross-stack motion.dev reference and asset package that documents official Motion APIs, distinguishes generic Motion guidance from Webflow CDN patterns, and provides runnable snippets grounded in both official docs and in-repo examples.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create six Markdown references under `.opencode/skills/sk-code/references/motion_dev/`.
- Create `install_card.md`, `playbook_entries.md`, and eight runnable JavaScript snippets under `.opencode/skills/sk-code/assets/motion_dev/`.
- Cite official Motion docs for every Motion API claim.
- Cite representative in-repo paths for real local usage patterns, especially `window.Motion` and ES module loading.
- Preserve cross-stack boundaries by linking to Webflow guidance rather than editing it.

### Out of Scope
- Editing `.opencode/skills/sk-code/references/webflow/*` or `.opencode/skills/sk-code/assets/webflow/*`; Packet 3 owns Webflow "See also" pointers.
- Editing the sk-code root `SKILL.md`, README, metadata, or changelog; Packet 3 owns metadata synchronization.
- Implementing Motion animations in production UI files.
- Rewriting or relocating existing Webflow animation guidance.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/002-motion-dev/spec.md` | Create | Packet 2 Level 2 specification |
| `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/002-motion-dev/plan.md` | Create | Packet 2 implementation plan |
| `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/002-motion-dev/tasks.md` | Create | Packet 2 task ledger |
| `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/002-motion-dev/checklist.md` | Create | Packet 2 verification checklist |
| `.opencode/skills/sk-code/references/motion_dev/*.md` | Create | Six canonical Motion reference docs |
| `.opencode/skills/sk-code/assets/motion_dev/install_card.md` | Create | Quick install/reference card |
| `.opencode/skills/sk-code/assets/motion_dev/snippets/*.js` | Create | Eight runnable Motion snippets |
| `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md` | Create | Packet 1 playbook hook entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep `motion_dev/` as a peer category | New docs live under `references/motion_dev/` and `assets/motion_dev/`, not under `webflow/` |
| REQ-002 | Cite every Motion API claim | No uncited API behavior claims and no `[VERIFY:]` placeholders remain |
| REQ-003 | Use real repo examples | Reference docs cite representative files from `a_nobel_en_zn/2_javascript/` |
| REQ-004 | Respect packet boundaries | No edits outside the approved child spec folder and two motion_dev folders |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Populate all required reference docs | Six named reference Markdown files exist |
| REQ-006 | Populate all required assets | `install_card.md`, `playbook_entries.md`, and eight snippets exist |
| REQ-007 | Snippets are runnable | Snippets are self-contained, guard missing APIs, and document loading assumptions |
| REQ-008 | Strict spec validation passes | `validate.sh .../002-motion-dev --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `references/motion_dev/` contains exactly the six requested Markdown files.
- **SC-002**: `assets/motion_dev/` contains the requested install card, playbook entries, and `snippets/` directory.
- **SC-003**: `assets/motion_dev/snippets/` contains exactly eight requested JavaScript snippets.
- **SC-004**: `rg "\\[VERIFY:"` returns no matches inside the new motion_dev docs/assets.
- **SC-005**: strict validation exits 0 for the child packet spec folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Official Motion docs | URLs and package version can drift | Cite official URLs and state authoring-date version guidance |
| Risk | API fabrication | Incorrect snippets could teach broken Motion usage | Keep claims narrow and cite each API surface |
| Risk | Cross-stack vs Webflow boundary | Guidance could become Webflow-only again | Keep Webflow notes in integration doc and link to existing webflow references |
| Risk | Motion+ layout API availability | Layout animation API is early-access/Motion+ | Mark layout snippet as Motion+ early access and guard the API |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Documentation must be operator-ready and copy-paste friendly.
- Citations must prefer official Motion documentation for Motion API behavior.
- In-repo examples must cite file paths, not vague module descriptions.
- Snippets use `snake_case` to match the current Webflow convention, while documenting that other stacks may use local naming conventions.
- New files use ASCII punctuation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Motion docs currently use `inview`, `hover`, `press`, and `layout-animations` URLs for topics that were described generically in the dispatch; the created docs cite the working official URLs.
- `animateLayout` is Motion+ early access and should not be documented as a default `motion` package export.
- Legacy Webflow code can use `window.Motion`, while bundled apps should prefer ESM imports; both patterns need examples.
- Reduced-motion handling differs across plain JavaScript, React, and Vue; the cross-stack docs should provide a plain JS media-query pattern and cite framework docs for framework-specific APIs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ESTIMATION

| Dimension | Estimate | Rationale |
|-----------|----------|-----------|
| Files touched | Medium | 4 packet docs, 6 references, 2 asset docs, 8 snippets, validation summary |
| Behavioral risk | Low | Documentation and snippet assets only |
| Citation risk | Medium | Several Motion pages have current URL names that differ from the dispatch wording |
| Verification complexity | Medium | Requires strict spec validation plus inventory and citation scans |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Future Packet 3 should decide how sk-code metadata exposes `motion_dev/` as a discoverable category.
<!-- /ANCHOR:questions -->
