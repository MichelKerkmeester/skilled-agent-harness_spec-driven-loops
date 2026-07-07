---
title: "Implementation Plan: Rename packet doc-quality -> create_quality_control"
description: "Deterministic rename via git mv + a scripted repoint pass (registry first, then hub-router/description/graph-metadata, then SKILL.md and command), never a hand-rolled link-by-link edit."
trigger_phrases:
  - "quality control rename plan"
  - "125 sk-doc phase 012 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/012-quality-control-rename"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-012 plan"
    next_safe_action: "Inventory every doc-quality reference before the git mv"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Rename packet doc-quality -> create_quality_control

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | sk-doc hub JSON configs (`mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`) + markdown (`SKILL.md`, command doc) |
| **Framework** | sk-code/sk-design/deep-loop "registry is source of truth" rename pattern |
| **Storage** | In-place directory rename + config field updates |
| **Testing** | `parent-skill-check.cjs`, repo-wide link checker, manual `/doc:quality` smoke test |

### Overview
A registry-first rename: `mode-registry.json` changes first (it is the declared source of truth for packet identity), then `hub-router.json`/`description.json`/`graph-metadata.json` are updated to match, then the packet's own `SKILL.md` and the bound `/doc:quality` command are repointed. The mechanical parts (directory move, repo-wide reference sweep) run through a deterministic script (`git mv` + a basename-to-canonical repoint pass), never a hand-rolled link-by-link edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet's current behavior and file set are known (`doc-quality/{SKILL.md,README.md,changelog,references}`)
- [x] Every current reference site identified (hub configs + command + repo-wide grep)

### Definition of Done
- [ ] `create_quality_control/` exists with all prior content; `doc-quality/` no longer exists
- [ ] `parent-skill-check.cjs` passes with 0 warnings
- [ ] Link checker reports 0 broken links from this rename
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-first rename: update the declared source of truth (`mode-registry.json`), propagate to dependent configs, then to prose (`SKILL.md`, command doc), then sweep remaining repo references.

### Key Components
- **Deterministic move script**: `git mv doc-quality create_quality_control`, then a repoint pass over `mode-registry.json`/`hub-router.json`/`description.json`/`graph-metadata.json`.
- **Repo-wide reference sweep**: grep for the old packet name/path across the repo (not just the known hub config set) and repoint each hit.
- **Verification pass**: `parent-skill-check.cjs` + link checker + a manual `/doc:quality` invocation.

### Data Flow
1. Inventory every reference to `doc-quality` (hub configs, command, README/skill docs elsewhere).
2. `git mv .opencode/skills/sk-doc/doc-quality .opencode/skills/sk-doc/create_quality_control`.
3. Update `mode-registry.json` fields for the renamed packet.
4. Propagate the rename to `hub-router.json`, `description.json`, `graph-metadata.json`.
5. Update the packet's own `SKILL.md` name/aliases and the `/doc:quality` command's target path.
6. Sweep and repoint any remaining repo-wide reference.
7. Verify: `parent-skill-check.cjs` 0 warnings, link checker 0 broken, `/doc:quality` smoke test.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory every reference to `doc-quality` repo-wide (not just the hub config set)
- [ ] Confirm the exact field list to change in each hub config

### Phase 2: Implementation
- [ ] `git mv` the packet directory
- [ ] Update `mode-registry.json` (source of truth)
- [ ] Update `hub-router.json`, `description.json`, `graph-metadata.json` to match
- [ ] Update the packet's `SKILL.md` name/aliases
- [ ] Repoint `/doc:quality` (`.opencode/commands/doc/quality.md`)
- [ ] Repoint any remaining repo-wide reference found in Setup

### Phase 3: Verification
- [ ] Run `parent-skill-check.cjs`, confirm 0 warnings
- [ ] Run the repo-wide link checker, confirm 0 broken links
- [ ] Manually invoke `/doc:quality` end to end and confirm identical behavior
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Canon check | Hub-level scope + naming invariants | `parent-skill-check.cjs` |
| Link integrity | Repo-wide references to the old packet name/path | Markdown link checker |
| Behavioral smoke test | `/doc:quality` end-to-end flow | Manual invocation against a sample doc |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `parent-skill-check.cjs` | Internal | Green | Cannot confirm 0-warning canon compliance |
| Repo-wide link checker | Internal | Green | Cannot confirm 0 broken links |
| `011-smart-router-alignment/` completion | Internal | Depends | Router-section edits to sk-doc's own `SKILL.md` should land before this rename touches the same file |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the rename breaks `/doc:quality` or leaves the packet unroutable.
- **Procedure**:
  1. `git mv` the directory back to `doc-quality`.
  2. Revert `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, the packet `SKILL.md`, and the command doc to their pre-rename committed versions.
  3. Re-run `parent-skill-check.cjs` and the link checker to confirm the revert is clean.
<!-- /ANCHOR:rollback -->
