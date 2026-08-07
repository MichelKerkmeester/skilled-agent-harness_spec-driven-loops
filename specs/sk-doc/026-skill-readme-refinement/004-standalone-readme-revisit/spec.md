---
title: "Feature Specification: Phase 004 — standalone skill README revisit (per-skill phases)"
description: "Phase parent: one child phase per standalone skill root, each revisiting that skill's README against the refined template from phase 001, purpose-first with HVR enforcement and a per-skill changelog entry."
trigger_phrases:
  - "standalone readme revisit"
  - "standalone fleet rewrite"
  - "readme fleet revisit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Convert phase 004 to a phase parent with one child phase per standalone skill root"
    next_safe_action: "Execute the per-skill child phases once phase 001 template refinement is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-standalone-readme-revisit"
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

# Feature Specification: Phase 004 — standalone skill README revisit (per-skill phases)

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
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `003-creation-workflow-update` |
| **Successor** | `005-mode-child-readme-revisit` |
| **Handoff Criteria** | Every child phase closes with its standalone skill README purpose-first on the refined template, HVR clean, versioned with a changelog entry, validated with zero issues, and phase docs validated with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Root Purpose

The mcp-obsidian pilot set the standard for standalone skill READMEs: narrative, purpose-first documents that state the outcome the skill delivers, written in the Human Voice Rules and validated by the sk-doc README validator. The other standalone roots in the repo still carry the older tabular reference-card style and predate the pilot learnings and the refined template from phase 001.

This parent coordinates one child phase per standalone skill root. Each child owns its own README: inventory, rewrite, version bump, changelog entry and validation. The standalone fleet ends up reading as one standard with the mcp-obsidian exemplar as the reference shape.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:phases -->
## 3. SUB-PHASES

| Phase | Skill README it revisits |
|-------|--------------------------|
| `001-cli-external-orchestration` | `.opencode/skills/cli-external-orchestration/README.md` |
| `002-mcp-code-mode` | `.opencode/skills/mcp-code-mode/README.md` |
| `003-mcp-tooling` | `.opencode/skills/mcp-tooling/README.md` |
| `004-sk-code` | `.opencode/skills/sk-code/README.md` |
| `005-sk-design` | `.opencode/skills/sk-design/README.md` |
| `006-sk-doc` | `.opencode/skills/sk-doc/README.md` |
| `007-sk-git` | `.opencode/skills/sk-git/README.md` |
| `008-sk-prompt` | `.opencode/skills/sk-prompt/README.md` |
| `009-system-deep-loop` | `.opencode/skills/system-deep-loop/README.md` |
| `010-system-skill-advisor` | `.opencode/skills/system-skill-advisor/README.md` |
| `011-system-spec-kit` | `.opencode/skills/system-spec-kit/README.md` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

- **SC-001**: Every child phase reports its README purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: Every rewritten README passes `validate_document.py --type readme` with zero issues, carries a version field and has a changelog entry.
- **SC-003**: The standalone fleet reads as one standard with the mcp-obsidian exemplar as the reference shape.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 5. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 must precede rewrites | Fleet rewritten against a moving template | Child phases gate their start on the refined template being committed |
| Risk | HVR violations accumulate in large rewrites | Voice check fails at closeout | Scripted grep per child phase, HVR checklist in the template |
| Risk | Facts lost during narrative rewrites | Shipped behavior claims disappear | Section-by-section diff per README before each rewrite lands |
| Risk | A standalone root is missed | Fleet incomplete | Child list is the authoritative inventory from the repo-wide SKILL.md walk |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 6. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
