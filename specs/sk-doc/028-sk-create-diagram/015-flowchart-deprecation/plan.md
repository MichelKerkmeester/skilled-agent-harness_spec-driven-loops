---
title: "Implementation Plan: sk-create-flowchart full deprecation"
description: "Delete the superseded skill and purge every live reference to it across hub routing, advisor index, and documentation."
trigger_phrases:
  - "flowchart deprecation plan"
importance_tier: "important"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/015-flowchart-deprecation"
    last_updated_at: "2026-08-13T17:15:00.000Z"
    last_updated_by: "claude"
    recent_action: "Plan executed"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-create-flowchart full deprecation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML, Python, CJS |
| **Framework** | Survey-then-delete: enumerate every reference before removing the skill, so nothing dangles |
| **Storage** | `.opencode/skills/sk-doc/` hub registries, `.opencode/skills/system-skill-advisor/`, cross-runtime command/agent mirrors |
| **Testing** | `advisor_rebuild` + `advisor_validate`, direct JSON parse, repo-wide `grep` sweep, `validate.sh --recursive --strict` |

### Overview

Direct execution, no model dispatch. Survey every reference to `sk-create-flowchart` first (`grep -rl` scoped by file type), classify each hit as live-surface (fix) or historical-spec-doc (leave alone), delete the skill and its command/prompt mirrors, then fix every live-surface hit found in the survey — including 3 genuine pre-existing gaps discovered along the way (sk-doc's own `SKILL.md`/`README.md`/`description.json` never mentioned `sk-create-diagram` at all, independent of the flowchart deletion).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] `AskUserQuestion` resolved both judgment calls (delete-vs-de-index, phase placement) before any file was touched.
- [x] Full repo-wide survey completed before deletion, so the live-surface fix list was known upfront, not discovered reactively.

### Definition of Done

- [x] `sk-create-flowchart/` and all 8 command/prompt mirrors deleted.
- [x] Every live hub/router/advisor/doc reference fixed or repointed.
- [x] `command-bridges.generated.json` regenerated; advisor rebuilt and validated with 0 regressions.
- [x] Packet-wide `validate.sh --recursive --strict` clean.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Survey-classify-delete-fix-verify: grep the whole repo for the dead skill's name and command, classify every hit (live surface vs. historical spec doc), delete the skill and its mirrors, fix every live hit (including gaps the survey surfaced that predate this deletion), regenerate derived artifacts, then verify with the advisor's own regression bundle and the packet's own strict validator.

### Key Components

- **Skill + mirror deletion**: `sk-create-flowchart/` (17 files) plus 8 command/prompt files across `.opencode`, `.codex`, `.pi`, `.cursor`.
- **Hub/router/advisor purge**: `command-metadata.json`, `mode-registry.json`, `hub-router.json` (list entry, skill-mapping block, and the now-redundant standalone aliases class — `create-diagram-aliases` already carried the merged vocabulary since phase 012), `leaf-manifest.json`, `skill_advisor.py`'s hardcoded command-inventory dict.
- **Code-path repointing**: the `sk-doc/scripts/` facade symlink and `post-edit-router.cjs`'s hardcoded checker path + segment-match predicate, both of which pointed directly at the now-deleted skill's files.
- **Doc correction**: ~14 live doc files, several carrying a genuine self-contradiction (`sk-create-diagram/README.md` claimed ASCII flowcharts were "not this skill's scope" two paragraphs after correctly saying the redirect already lived here).
- **Fixture correction**: 5 manual-testing-playbook scenarios whose `expected_workflow_mode: sk-create-flowchart` field would otherwise assert a mode that no longer exists; 2 baseline JSON fixtures with 3 stale path entries each.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Survey

- [x] Repo-wide `grep` for `sk-create-flowchart` and `/create:flowchart`, scoped by extension, classified into live-surface vs. historical-spec-doc buckets.
- [x] Confirm regeneration scripts exist for `command-bridges.generated.json` before touching it by hand.

### Phase 2: Deletion

- [x] Delete `sk-create-flowchart/`, the command + 3 assets, 3 cross-runtime prompt mirrors, and one pre-existing broken changelog symlink.

### Phase 3: Live-Surface Fixes

- [x] Purge/repoint 6 hub-JSON and advisor-Python entries; repoint 2 code paths (facade symlink, post-edit router).
- [x] Fix ~14 live doc files, adding `sk-create-diagram` wherever the survey found it silently absent.
- [x] Mechanically update 5 playbook scenario fixtures + remove 3 stale entries each from 2 baseline JSONs.

### Phase 4: Verification

- [x] Regenerate `command-bridges.generated.json`; rebuild and validate the skill advisor index.
- [x] Repo-wide re-sweep confirms 0 live references remain.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reference sweep | Whole repo, excluding historical `specs/` | `grep -rl` by extension |
| JSON validity | Every touched hub/fixture JSON | `python3 -c "json.load(...)"` |
| Python syntax | `skill_advisor.py` | `python3 -m py_compile` |
| Advisor regression | `sk-doc` slice | `advisor_rebuild` + `advisor_validate` |
| Package/packet gate | `sk-create-diagram` skill + packet | `validate_skill_package.py --strict`, `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 012's already-ported `sk-create-diagram/assets/ascii-patterns/` and `references/ascii-format/` content | Internal | Satisfied | Repointed references would target nonexistent files |
| `derive-command-bridges.cjs` regeneration script | Internal | Satisfied | Would have required hand-editing a generated artifact |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor regression, a broken symlink, or a JSON validity failure surfaces after deletion.
- **Procedure**: `git checkout -- <path>` restores any single file; the deletion itself is `git revert`-able as a whole since it landed as scoped commits, not destructive history rewrites.
<!-- /ANCHOR:rollback -->
