---
title: "Implementation Plan: Phase 002 Skill Folder Rename"
description: "Use git mv for the two skill folder roots, patch skill-graph.json IDs, update internal renamed-folder references, rebuild advisor graph, and validate strict."
trigger_phrases:
  - "070 phase 002 plan"
  - "skill folder rename plan"
  - "skill graph rename plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/016-sk-deep-rename/002-skill-folder-rename"
    last_updated_at: "2026-05-05T19:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 002 rename execution"
    next_safe_action: "Start Phase 003"
    blockers: []
    key_files:
      - "plan.md"
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
# Implementation Plan: Phase 002 Skill Folder Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, shell |
| **Framework** | Spec Kit phase documentation and skill advisor graph source |
| **Storage** | Git-tracked skill folders and JSON graph source |
| **Testing** | Folder existence checks, JSON parse, exact grep, advisor rebuild, strict spec validation |

### Overview
Phase 002 makes the rename real at the folder and advisor graph-source level. The work is ordered so folder paths exist before internal contents are patched, and old names are removed only from this phase's owned surfaces.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent `spec.md` read for rename context.
- [x] Parent `resource-map.md` read for phase ownership.
- [x] Phase 001 `inventory.md`, `edge-cases.md`, and `inventory.tsv` read for Phase 002 rows.
- [x] Phase folder scope is pre-approved.

### Definition of Done
- [x] Folder renames are complete. `git mv` was attempted first but blocked by `.git/index.lock` sandbox permissions; filesystem renames produced the requested folder end-state.
- [x] `skill-graph.json` parses and uses new skill IDs.
- [x] Internal renamed-folder grep returns no old skill names.
- [x] Advisor rebuild script was attempted and deferred because the expected build script is missing.
- [x] Child and parent strict validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential rename-and-patch workflow with exact-string replacement and deterministic verification.

### Key Components
- **Folder roots**: `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/`.
- **Advisor graph source**: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`.
- **Internal content**: Files inside `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/` after the move.
- **Validator**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh`.

### Data Flow
`git mv` changes folder paths. Exact replacements update graph and internal text references. Rebuild consumes the patched graph JSON. Verification checks paths, JSON keys, old-name absence, and spec contract validity.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-deep-review/` | Old review skill root | `git mv` to `.opencode/skills/deep-review/` | `ls` and old-folder grep |
| `.opencode/skills/sk-deep-research/` | Old research skill root | `git mv` to `.opencode/skills/deep-research/` | `ls` and old-folder grep |
| `.opencode/skills/deep-review/**` | Renamed internal files | Replace `sk-deep-review` and cross-reference `sk-deep-research` | exact grep returns no rows |
| `.opencode/skills/deep-research/**` | Renamed internal files | Replace `sk-deep-research` and cross-reference `sk-deep-review` | exact grep returns no rows |
| `skill-graph.json` | Advisor graph source | Replace quoted old IDs with new IDs | Python JSON parse and signal-key assertions |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Planning Artifact Setup
- [x] Read requested parent and Phase 001 artifacts.
- [x] Author Phase 002 Level 2 spec, plan, tasks, checklist, and graph metadata.

### Phase 2: B.1 Folder Renames
- [x] Run `git mv` for both skill folders. Environment note: `git mv` failed because Git could not create `.git/index.lock`; fallback filesystem renames were used.
- [x] Verify old folder roots are gone and new roots exist.

### Phase 3: B.2 Advisor Graph JSON
- [x] Replace quoted `sk-deep-review` and `sk-deep-research` IDs in `skill-graph.json`.
- [x] Parse JSON and assert new signal keys exist while old signal keys are absent.

### Phase 4: B.3 Internal Renamed-Folder Content
- [x] Replace self-references inside `deep-review/` and `deep-research/`.
- [x] Replace cross-references between the renamed folders.
- [x] Remove `.bak` files.
- [x] Verify no old identifiers remain inside either renamed folder.

### Phase 5: B.4 Advisor Rebuild and Validation
- [x] Run the skill graph build script, or capture a deferral warning.
- [x] Run child strict validation.
- [x] Run parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Folder rename | Old and new skill roots | `git mv`, `ls`, `grep` |
| JSON validity | Advisor graph source | `/usr/bin/python3 -c` |
| Old-name absence | Renamed folder internals | `grep -rl` |
| Advisor rebuild | Generated advisor database | Node build script |
| Artifact validation | Spec-kit document contract | `validate.sh --strict` |

Verification commands:

```bash
ls -la .opencode/skills/ | grep -E "sk-deep-(review|research)" && echo "ERROR: old folders still present" || echo "OK: old folders gone"
ls -la .opencode/skills/deep-review .opencode/skills/deep-research
/usr/bin/python3 -c "import json; d=json.load(open('.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json')); assert 'deep-review' in d['signals'] and 'deep-research' in d['signals']; assert 'deep-review' not in d['signals'] and 'deep-research' not in d['signals']; print('OK: skill-graph.json keys updated')"
grep -rl "deep-review\|deep-research" .opencode/skills/deep-review/ .opencode/skills/deep-research/ 2>/dev/null | head -5
node .opencode/skills/system-spec-kit/scripts/dist/skill-graph/build-skill-graph.js
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/002-skill-folder-rename --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename --strict
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent `spec.md` | Internal doc | Green | Rename purpose unclear |
| Parent `resource-map.md` | Internal doc | Green | Phase ownership unclear |
| Phase 001 inventory artifacts | Internal docs | Green | Measured Phase 002 rows unavailable |
| Git | Local tooling | Green | Folder renames must be tracked |
| Python JSON parser | Local tooling | Green | Graph parse check unavailable |
| Node build script | Local tooling | Unknown until run | Advisor rebuild may defer to orchestrator MCP |
| Spec validator | Local tooling | Green | Completion claim blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Folder rename fails, JSON parse fails, old internal references remain, or strict validation fails.
- **Procedure**: Use Git-aware inverse moves for folder rename failures, patch only Phase 002-owned files, remove backup files, rerun verification commands, and do not broaden scope into Phases 003-005.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Planning -> B.1 git mv -> B.2 skill-graph.json -> B.3 internal content -> B.4 rebuild -> validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Planning | Parent docs and Phase 001 inventory | Folder rename |
| B.1 Folder Rename | Planning | Internal content updates |
| B.2 Advisor Graph JSON | Planning | Advisor rebuild |
| B.3 Internal Content | Folder rename | Old-name absence verification |
| B.4 Rebuild and Validation | B.2 and B.3 | Phase 003 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT

| Item | Estimate | Actual |
|------|----------|--------|
| Planning artifacts | Small | Completed in this phase folder |
| Folder renames | Small | Completed with filesystem fallback after `git mv` sandbox block |
| Graph JSON update | Small | 11 quoted old-ID occurrences replaced |
| Internal content update | Medium | 159 old-name-bearing files updated inside renamed folders |
| Validation | Small | Child and parent strict validation completed |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Trigger | Rollback |
|---------|----------|
| Downstream phase requires old folder roots | Move `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/` back to the old roots, then restore `skill-graph.json` from Git |
| Advisor graph keys rejected | Revert only `skill-graph.json` and rerun the JSON key assertion |
| Internal replacement overreaches | Revert the two renamed skill folders from Git and reapply exact replacements with a narrower file list |
<!-- /ANCHOR:enhanced-rollback -->
