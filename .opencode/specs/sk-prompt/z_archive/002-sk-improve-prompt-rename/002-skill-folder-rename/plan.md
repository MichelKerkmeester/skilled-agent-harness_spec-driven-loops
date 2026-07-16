---
title: "Implementation Plan: Phase 2: skill-folder-rename [template:level_1/plan.md]"
description: "Plan for renaming the prompt skill folder, updating skill-local references and advisor graph keys, rebuilding advisor state, and validating the phase folder."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/002-sk-improve-prompt-rename/002-skill-folder-rename"
    last_updated_at: "2026-05-06T11:00:06Z"
    last_updated_by: "codex"
    recent_action: "Phase 002 complete: folder renamed, 9 files updated, advisor rebuilt"
    next_safe_action: "Phase 003 opencode internals"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/README.md"
      - ".opencode/skills/sk-prompt/graph-metadata.json"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-skill-folder-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: skill-folder-rename

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill markdown, JSON, symlink metadata |
| **Framework** | system-spec-kit advisor graph and spec validation |
| **Storage** | Skill graph SQLite generated state |
| **Testing** | `rg`, `jq`, advisor rebuild/status, alignment drift, strict spec validation |

### Overview
Phase 002 performs the physical prompt skill folder rename and updates only the skill-local self references plus `skill-graph.json`. The advisor graph is rebuilt immediately after JSON edits so downstream phases work against a live `sk-prompt` skill ID.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Verification commands passed or documented with exact failure cause
- [x] Docs updated (spec/plan/tasks/implementation-summary/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical rename with scoped reference replacement.

### Key Components
- **Skill folder**: canonical source for `sk-prompt` skill content.
- **Skill-local metadata**: frontmatter, README, graph metadata, changelog, asset, and reference self refs.
- **Advisor graph JSON**: checked-in graph data that maps signal keys and adjacency IDs.
- **Advisor generated state**: rebuilt SQLite/generation metadata that advisor status reads.

### Data Flow
The folder move creates the new canonical path, scoped replacements align the skill metadata with that path, and advisor rebuild indexes checked-in skill metadata into generated state. Phase 003 then updates the remaining consumers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-prompt/` | Owns prompt skill body and self metadata | Rename and replace local literals | Scoped `rg` returns no old-name matches |
| `skill-graph.json` | Advisor graph fallback and signal map | Rename graph IDs and key values | `jq` passes; scoped `rg` returns no old-name matches |
| `.opencode/changelog/` | Skill changelog symlink catalog | Retarget symlink to new folder | `ls -l` shows `sk-prompt -> ../skill/sk-prompt/changelog` |
| Advisor generated state | Runtime advisor freshness and generation | Rebuild after JSON edits | Generation `1212 -> 1213`, freshness `live` |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read authoritative phase inputs.
- [x] Verify folder pre-state and scoped dirty diffs.
- [x] Confirm current branch is `main`.

### Phase 2: Core Implementation
- [x] Rename `.opencode/skills/sk-improve-prompt/` to `.opencode/skills/sk-prompt/`.
- [x] Replace skill-local `sk-improve-prompt` literals with `sk-prompt`.
- [x] Replace Phase 002 `skill-graph.json` keys and refs.
- [x] Retarget changelog symlink.

### Phase 3: Verification
- [x] Run scoped old-name grep.
- [x] Run `jq` on `skill-graph.json`.
- [x] Rebuild advisor and verify live status.
- [x] Run alignment drift and strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static grep | Skill-local and graph old-name absence | `rg` |
| JSON syntax | Advisor graph JSON | `jq` |
| Advisor integration | Generated advisor state | compiled advisor rebuild/status handlers |
| Spec validation | Phase docs | `validate.sh --strict` |
| OpenCode alignment | Renamed skill folder | `verify_alignment_drift.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor rebuild handler | Internal | Green | Without rebuild, advisor state could stay stale. |
| Phase 003 consumer updates | Internal | Pending | Rebuild diagnostics can mention old out-of-scope refs until Phase 003 completes. |
| Git index write access | Environment | Yellow | `git mv` staging cannot occur inside this sandbox; physical rename is complete. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:phase-deps -->
## 6A. PHASE DEPENDENCIES

| Phase | Dependency | Status |
|-------|------------|--------|
| 001 | Discovery inventory identifies Phase 002 files | Complete |
| 002 | Folder rename and advisor rebuild | Complete |
| 003 | OpenCode consumer refs update after new folder exists | Ready next |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 6B. EFFORT

| Work Item | Effort | Notes |
|-----------|--------|-------|
| Folder and symlink rename | Low | Physical move plus symlink retarget. |
| Scoped replacements | Low | Mechanical literal replacement across known files. |
| Advisor rebuild/status | Medium | MCP path unavailable, local compiled handler used. |
| Spec validation repair | Medium | Phase scaffold needed Level 2 checklist and required anchors. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scoped grep finds old refs in Phase 002 files, JSON becomes invalid, or advisor status cannot return live after rebuild.
- **Procedure**: Move `.opencode/skills/sk-prompt/` back to `.opencode/skills/sk-improve-prompt/`, retarget the changelog symlink, restore the previous `skill-graph.json` refs, then rebuild advisor state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 7A. ENHANCED ROLLBACK

| Scenario | Response |
|----------|----------|
| Advisor rebuild fails after rename | Restore old graph IDs and rerun rebuild before leaving the phase. |
| Symlink points at missing folder | Recreate `.opencode/changelog/sk-prompt` from the sibling symlink convention. |
| Downstream Phase 003 refs fail before update | Continue to Phase 003; this phase only creates the canonical target. |
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
