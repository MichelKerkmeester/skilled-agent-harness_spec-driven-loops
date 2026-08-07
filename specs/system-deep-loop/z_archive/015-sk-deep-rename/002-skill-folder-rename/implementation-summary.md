---
title: "Implementation Summary: Phase 002 Skill Folder Rename"
description: "Phase 002 renamed the two deep loop skill folders, updated their internal old-name references, and patched skill-graph.json to use deep-review and deep-research."
trigger_phrases:
  - "070 phase 002 summary"
  - "skill folder rename complete"
  - "deep-review deep-research folder rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename/002-skill-folder-rename"
    last_updated_at: "2026-05-05T19:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 002 folder rename and graph source update"
    next_safe_action: "Start Phase 003"
    blockers:
      - "Advisor rebuild script missing at .opencode/skills/system-spec-kit/scripts/dist/skill-graph/build-skill-graph.js; orchestrator should run advisor_rebuild({force: true}) via MCP."
      - "git mv was blocked by sandbox Git index permissions; filesystem rename produced the requested folder end-state."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "graph-metadata.json"
      - "implementation-summary.md"
      - ".opencode/skills/deep-review"
      - ".opencode/skills/deep-research"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-skill-folder-rename |
| **Completed** | 2026-05-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 002 now has the two deep loop skill folders at their new canonical paths and the advisor graph source recognizes the new skill IDs.

### Folder Rename

`.opencode/skills/deep-review/` and `.opencode/skills/deep-research/` now exist. The old `.opencode/skills/sk-deep-review/` and `.opencode/skills/sk-deep-research/` folder roots are absent.

`git mv` was attempted first as requested, but the sandbox blocked Git index writes with `Unable to create ... .git/index.lock: Operation not permitted`. A filesystem rename was used to produce the requested working-tree state, and this limitation is recorded as a blocker for the orchestrator.

### Advisor Graph Source

`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` had 11 quoted old skill ID occurrences replaced:

- `sk-deep-review` -> `deep-review`
- `sk-deep-research` -> `deep-research`

The JSON parser passed and the `signals` key assertion confirmed the new keys exist while the old keys are absent.

### Internal Renamed-Folder Content

Internal files under `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/` were updated so old self-references and cross-references use the new names. The pre-update grep found 159 files with old identifiers under the two renamed folders; the final grep returned no rows.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created/Updated | Phase 002 requirements, scope, and closeout status |
| `plan.md` | Created/Updated | Ordered B.1-B.4 execution plan and rollback |
| `tasks.md` | Created/Updated | Completed task ledger with evidence |
| `checklist.md` | Created/Updated | Level 2 verification checklist with evidence |
| `graph-metadata.json` | Created/Updated | Canonical phase graph metadata |
| `implementation-summary.md` | Created | Closeout summary |
| `.opencode/skills/deep-review/` | Renamed/Updated | Canonical review skill folder and internal references |
| `.opencode/skills/deep-research/` | Renamed/Updated | Canonical research skill folder and internal references |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Updated | Advisor graph source IDs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed the requested order: B.1 folder rename, B.2 graph JSON replacement, B.3 internal content cleanup, and B.4 advisor rebuild attempt. Exact-string replacements were used only in the Phase 002-owned surfaces. Backup files created by `sed -i` were removed after replacement.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use filesystem rename after `git mv` failed | The sandbox blocked `.git/index.lock` creation, but the requested working-tree folder end-state was still achievable. |
| Replace only quoted old IDs in `skill-graph.json` | The Phase 002 scope is graph keys and signal references, not wider scorer code owned by Phase 003. |
| Update both old identifiers in both renamed folders | Phase 001 edge cases showed cross-references between the two skills. |
| Defer advisor rebuild to orchestrator MCP | The expected Node build script was missing, matching the user-provided fallback path. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Folder old roots absent | PASS: `OK: old folders gone` |
| New folders exist | PASS: `ls` showed `.opencode/skills/deep-review` and `.opencode/skills/deep-research` |
| `skill-graph.json` parse | PASS: Python JSON parse printed `valid` |
| Advisor graph signal keys | PASS: keys include `deep-review` and `deep-research`; old signal keys absent |
| Internal old-name grep | PASS: grep returned no rows under both renamed folders |
| Backup files | PASS: `find ... -name "*.bak*"` returned no rows |
| Advisor rebuild | DEFERRED: expected Node script missing with `MODULE_NOT_FOUND` |
| Child strict validation | PASS: strict validation exit 0 |
| Parent strict validation | PASS: strict validation exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Git index tracking could not be updated by `git mv`.** The sandbox blocked `.git/index.lock` creation. The working-tree rename is complete, but a normal Git environment should stage or recognize the rename during commit.
2. **Advisor rebuild is deferred.** The expected Node build script is missing, so the orchestrator needs to run `advisor_rebuild({force: true})` via MCP after this phase.
<!-- /ANCHOR:limitations -->
