---
title: "Implementation Summary: sk-code Asset-Template Alignment + Smart-Router Conformance"
description: "Five authoring-checklist assets now pass the sk-doc asset template, and the SKILL.md router surfaces the canonical Resource Loading Levels table plus the UNKNOWN_FALLBACK checklist, with every router guard still green."
trigger_phrases:
  - "sk-code asset router summary"
  - "authoring checklist overview done"
  - "loading levels surfaced"
  - "router conformance verified"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/113-sk-code-ponytail-based-refinement/007-sk-code-asset-router-alignment"
    last_updated_at: "2026-06-14T06:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Parts A + B shipped; all guards green; spec docs authored"
    next_safe_action: "Run validate.sh --strict, then commit on branch 028"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "146-007-sk-code-asset-router-alignment"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-sk-code-asset-router-alignment |
| **Completed** | 2026-06-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

sk-code's authoring-checklist assets now pass the sk-doc asset template, and the smart router reads to the canonical loading-levels and fallback skeleton without losing its surface-first design. The change is conformance only: no routing behavior, no STACK_FOLDERS keys, and no Iron Law wording moved.

### Asset-template alignment

The five `*_authoring.md` checklists led with `## 1. PURPOSE`, which failed the asset template's required OVERVIEW section. Each now opens with `## 1. OVERVIEW` carrying a `### Purpose` and a `### Usage` subsection (the old WHEN TO USE bullets), with dividers and renumbered sections. The checklist content is preserved verbatim. All eleven checklists in the folder now validate as assets.

### Router conformance

`SKILL.md §2` now shows two elements the canonical standard makes visible: a Resource Loading Levels table (ALWAYS / CONDITIONAL / ON_DEMAND) and the UNKNOWN_FALLBACK disambiguation checklist. Both mirror `references/smart_routing.md`, which keeps the heavy intent pseudocode factored out. The surface-first two-axis routing is untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/opencode/checklists/agent_authoring.md` | Modified | OVERVIEW restructure (Purpose + Usage), dividers, renumber |
| `assets/opencode/checklists/command_authoring.md` | Modified | OVERVIEW restructure |
| `assets/opencode/checklists/mcp_server_authoring.md` | Modified | OVERVIEW restructure |
| `assets/opencode/checklists/skill_authoring.md` | Modified | OVERVIEW restructure |
| `assets/opencode/checklists/spec_folder_authoring.md` | Modified | OVERVIEW restructure |
| `.opencode/skills/sk-code/SKILL.md` | Modified | Added Resource Loading Levels table + UNKNOWN_FALLBACK checklist to §2 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every change was verified with the deterministic guards rather than a model judgment: the asset validator confirmed all eleven checklists pass, and after the router edit the STACK_FOLDERS validator, the Iron Law canary, and the skill validator all stayed green. The router edits were additive insertions, so a single `git restore` reverts them with no migration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Structural-conform the router, keep the two-axis design | The surface-first model and the factored pseudocode are intentional; full inlining would duplicate `smart_routing.md`. The operator chose this depth. |
| Carve the sk-code-review reclassification into its own packet | Its coupling spans changelogs, playbook anchors, and runtime mirrors; bundling it here would re-touch just-pushed files. |
| Reverted the create.sh parent clobber | The phase-append overwrote the parent description.json and injected a placeholder phase map; the parent identity and lean structure were restored, and only its graph-metadata children list was patched. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type asset` (11 checklists) | PASS, 11/11 VALID |
| `verify_stack_folders.py` | PASS, exit 0, 3 surfaces resolve |
| `check-rule-copies.js` | PASS, exit 0, both Iron Law lines intact |
| `validate_document.py --type skill` (SKILL.md) | PASS, VALID |
| Playbook by-section anchors (sub-detection table, §4 ALWAYS) | PASS, resolve to real sections |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The sk-code-review references-to-assets reclassification is deferred.** It is scoped as a separate dedicated packet because its coupling spans changelogs, playbook source-anchors, and the runtime mirrors. The reclassification table and coupling map are recorded in the approved plan.
<!-- /ANCHOR:limitations -->

---
