---
title: "Feature Specification: skill README refinement — template, parent template, workflow, and fleet revisit"
description: "Phase parent: revisit every skill README in the repo (standalone and child modes) on the mcp-obsidian standard, after refining the shared README template, adding a parent-skill README template, and updating the creation workflow."
trigger_phrases:
  - "skill readme refinement"
  - "readme fleet revisit"
  - "parent skill readme template"
  - "skill readme template update"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase-parent spec + 6-phase documentation map after the mcp-obsidian README pilot"
    next_safe_action: "Execute 001-readme-template-refinement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: skill README refinement — template, parent template, workflow, and fleet revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (sk-doc track) |
| **Parent Packet** | `sk-doc` |
| **Predecessor** | `025-skill-doc-currency` (sibling under sk-doc) |
| **Successor** | None |
| **Handoff Criteria** | The shared README template and the new parent-skill README template are refined and wired into the creation workflow; every standalone and child-mode skill README in the repo is revisited on the standard; fleet validation passes; the phase docs validate with zero errors. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Root Purpose

The mcp-obsidian README pilot proved the standard: narrative, purpose-first skill READMEs that state what the skill delivers for the reader, with the tooling as the means, written in the Human Voice Rules and validated by the sk-doc README validator. The rest of the repo does not meet that standard yet. Standalone skill READMEs and child (mode) skill READMEs still carry the older tabular reference-card style, and the shared README template itself predates the pilot's learnings. There is no README template at all for parent hubs, and the creation workflow does not yet tell authors how to emit either kind.

This packet fixes the foundation first (template, parent template, workflow), then revisits the fleet: every standalone skill README and every child-mode skill README in the repo, on one standard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:phases -->
## 3. SUB-PHASES

| Phase | What it does |
|-------|--------------|
| `001-readme-template-refinement` | Refine `sk-create-skill/assets/skill/skill-readme-template.md` with the pilot learnings: purpose-first identity, capability sections, HVR enforcement, versioning, validation checklist |
| `002-parent-skill-readme-template` | Create `sk-create-skill/assets/parent-skill/parent-skill-readme-template.md`: hub-level README template covering nested modes/packets, mode-registry, leaf manifest, changelog navigation, per-mode pointers |
| `003-creation-workflow-update` | Update `sk-create-skill/references/skill/creation-workflow.md` (and referenced workflow docs) to wire both templates into the create-skill workflow for standalone and parent-hub paths |
| `004-standalone-readme-revisit` | Phase parent: one child phase per standalone skill root (11 children: cli-external-orchestration, mcp-code-mode, mcp-tooling, sk-code, sk-design, sk-doc, sk-git, sk-prompt, system-deep-loop, system-skill-advisor, system-spec-kit), each revisiting that skill's README against the refined template |
| `005-mode-child-readme-revisit` | Phase parent: one child phase per mode (child) skill (39 children across cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, sk-prompt and system-deep-loop), each revisiting that skill's README against the refined template, using mcp-obsidian as the exemplar |
| `006-validation-and-closeout` | Fleet-wide validation and closeout: README validator across the fleet, link guard, HVR grep, per-release changelog entries, phase-doc validation, metadata regeneration |
| `007-fix-post-closeout-gates-for-readme-fleet` | Restore repository-wide documentation gate health: resolve active link findings, preserve intentional fixtures narrowly, add missing frontmatter versions, and align the six CLI mode READMEs |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

- **SC-001**: Any human reading any skill README understands the skill's outcome, how to start, and where everything lives, within one screen.
- **SC-002**: Standalone and parent-hub authors have a template each, and the creation workflow tells them which to use.
- **SC-003**: Every README in the repo passes `validate_document.py --type readme` with zero issues and carries a version field.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 5. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Template must precede fleet | Fleet rewritten against a moving template | Phase ordering: 001–003 gate 004–005 |
| Risk | Child-mode READMEs vary widely in size and shape | One standard may not fit small modes | Template allows dropping non-earning sections; validator only requires OVERVIEW |
| Risk | HVR violations accumulate in large rewrites | Voice check fails | Scripted grep gates in each phase; HVR checklist in the template |
| Risk | Changelog discipline drifts | Releases without entries | Per-skill changelog entries recorded in each revisit phase |
| Handover | mcp-obsidian pilot is the pattern | 005 may diverge | `handover.md` §2-§4 in this packet documents the pattern and method |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 6. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
