---
title: "Feature Specification: sk-vision 002 skill scaffold"
description: "Phase parent for the Class S skill root. Nested children author SKILL.md then identity JSON and generated manifests. No dump copy."
trigger_phrases:
  - "sk-vision skill scaffold"
  - "sk-vision standalone skill"
  - "sk-vision class S"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Rewrote 002-skill-scaffold as lean phase parent over nested children."
    next_safe_action: "Implement 001-skill-md from its spec copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - "001-skill-md/spec.md"
      - "002-metadata-and-manifests/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-002-skill-scaffold-parent-20260816"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-vision 002 skill scaffold

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | 001-research |
| **Successor** | 003-runtime-fork |
| **Handoff Criteria** | Both nested children Complete. Class S skill root exists. Hub JSON absent. vision-runtime empty. Next implementer target is 003-runtime-fork/001-copy-shipped-files. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Text-only models need a legal standalone skill root before any runtime copy. Hub JSON on this root would fail Class S gates.

### Purpose
Deliver an empty legal Class S skill at `.opencode/skills/sk-vision/` so 003 can fill `vision-runtime/`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Nested child `001-skill-md/`: SKILL.md and references stub
- Nested child `002-metadata-and-manifests/`: graph-metadata, leaf config, generated manifests, README, Class S proof
- Reserve `vision-runtime/` in prose; leave it empty

### Out of Scope
- Copying `context/`
- Host adapters under `.opencode/plugins/` or `.pi/extensions/`
- GPU download
- Hub JSON (`description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`)

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's spec.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-vision/SKILL.md` | Create | 001-skill-md | Advisor body |
| `.opencode/skills/sk-vision/references/.gitkeep` | Create | 001-skill-md | Leaf stub |
| `.opencode/skills/sk-vision/graph-metadata.json` | Create | 002-metadata-and-manifests | Class S identity |
| `.opencode/skills/sk-vision/leaf-manifest.config.json` | Create | 002-metadata-and-manifests | Authored config |
| `.opencode/skills/sk-vision/leaf-manifest.json` | Generate | 002-metadata-and-manifests | `--fix` output |
| `.opencode/skills/sk-vision/README.md` | Create | 002-metadata-and-manifests | Operator README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-skill-md/ | SKILL.md, WHEN TO USE, reserved paths | Planned |
| 2 | 002-metadata-and-manifests/ | Class S JSON, `--fix`, empty vision-runtime | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Do not implement from this parent spec. Open the next Planned child's `spec.md` copy pack.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-skill-md | 002-metadata-and-manifests | SKILL.md exists with locked triggers | `test -f .opencode/skills/sk-vision/SKILL.md` |
| 002-metadata-and-manifests | 003-runtime-fork | Class S gate clean; hub JSON absent | `ci-skill-root-metadata.cjs`; `package_skill.py --check` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
