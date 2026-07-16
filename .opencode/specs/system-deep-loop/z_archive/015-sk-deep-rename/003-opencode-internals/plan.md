---
title: "Implementation Plan: Phase 003 OpenCode Internal References"
description: "Fix critical graph metadata edges first, then apply scoped replacements across allowed .opencode internals and verify with grep audits, JSON parsing, and strict spec validation."
trigger_phrases:
  - "070 phase 003 plan"
  - "opencode internal reference plan"
  - "graph metadata edge fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename/003-opencode-internals"
    last_updated_at: "2026-05-05T20:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "completed"
    next_safe_action: "Start Phase 004 handoff"
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/skills/sk-code-review/graph-metadata.json"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 003 OpenCode Internal References

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML, TypeScript, JavaScript, Python, Shell |
| **Framework** | OpenCode skills, agents, commands, Spec Kit MCP server, skill advisor |
| **Storage** | Git-tracked text files; binary SQLite caches excluded |
| **Testing** | Exact grep audits, JSON parse, `validate.sh --strict`, alignment drift verifier where practical |

### Overview
Phase 003 is a scoped mechanical rename pass across approved `.opencode/` internals. It fixes the known graph metadata edge failures before broad replacement, builds the broad file list with explicit exclusions, validates JSON after edits, and records grep evidence for each requested audit bucket.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent `spec.md` read for packet scope.
- [x] Parent `resource-map.md` read for phase ownership.
- [x] Phase 001 inventory and edge-case docs read.
- [x] Phase 003 spec folder pre-approved by user.

### Definition of Done
- [x] Critical graph metadata files contain no old skill IDs.
- [x] Allowed `.opencode/` surfaces have old-name references replaced.
- [x] Edited JSON files parse successfully.
- [x] Requested grep audits return zero residual hits in non-excluded scopes.
- [x] Child and parent strict validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Critical-edge-first replacement followed by broad scoped text normalization and deterministic residual audits.

### Key Components
- **Critical graph metadata**: two files with broken advisor edge targets surfaced by Phase 002.
- **Skill internals**: other skills' docs, references, assets, playbooks, and graph metadata under `.opencode/skill`.
- **Runtime-facing OpenCode surfaces**: `.opencode/agent` and `.opencode/commands/spec_kit`.
- **System code**: Spec Kit MCP server and scripts, including expected-output fixtures.
- **Active spec artifacts**: `.opencode/specs` authored docs, descriptions, graph metadata, research, and review artifacts outside exclusions.

### Data Flow
The replacement changes old skill IDs in source text only. Advisor and memory databases are consumers of the updated text state and are rebuilt in the final packet phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-code-review/graph-metadata.json` | Broken edge target | Replace old deep review edge target with `deep-review` | `grep -c` returns 0 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | Broken edge targets | Replace both old IDs | `grep -c` returns 0 |
| `.opencode/agent` | OpenCode agent definitions | Replace old skill IDs and paths | Recursive grep returns 0 |
| `.opencode/commands/spec_kit` | Command docs and YAML assets | Replace underlying skill references | Recursive grep returns 0 |
| MCP server and scripts | Advisor/scorer/deep-loop implementation and fixtures | Replace literals and expected outputs | Recursive grep returns 0 outside exclusions |
| `.opencode/specs` active artifacts | Spec metadata and active research/review docs | Replace active old-name refs | Excluded recursive grep returns 0 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Planning Artifact Setup
- [x] Read parent and Phase 001 source documents.
- [x] Render Level 2 templates and author Phase 003 artifacts.

### Phase 2: Critical Graph Metadata Fixes
- [x] Patch `.opencode/skills/sk-code-review/graph-metadata.json`.
- [x] Patch `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json`.
- [x] Parse both files as JSON and verify old-name absence.

### Phase 3: Broad Scoped Replacement
- [x] Build a file list from approved `.opencode/` scopes with explicit exclusions.
- [x] Replace the old deep review skill ID with `deep-review`.
- [x] Replace the old deep research skill ID with `deep-research`.
- [x] Parse edited JSON files.

### Phase 4: Audit and Validation
- [x] Run all requested grep audits.
- [x] Run Phase 003 strict validation.
- [x] Run parent strict validation.
- [x] Record evidence in tasks, checklist, and implementation summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Critical edge audit | Two graph metadata files | `grep -c`, Python JSON parse |
| Residual grep | Active specs, agents, commands, MCP server, scripts | `grep -rln` with excludes |
| JSON validity | Edited `*.json` files | `/usr/bin/python3 -m json.tool` equivalent parser |
| Spec validation | Child and parent specs | `validate.sh --strict` |
| OpenCode quality | Changed `.opencode` scope | `verify_alignment_drift.py` where practical |

Verification commands:

```bash
grep -c "<old-review-id>" .opencode/skills/sk-code-review/graph-metadata.json
grep -c "<old-research-id>|<old-review-id>" .opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json
grep -rln "<old-review-id>|<old-research-id>" .opencode/agent .opencode/command 2>/dev/null
grep -rln "<old-review-id>|<old-research-id>" .opencode/skills/system-spec-kit/mcp_server .opencode/skills/system-spec-kit/scripts 2>/dev/null | grep -v "test-fixtures/053-template-compliant\|database/.*\.sqlite"
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename --strict
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 inventory | Internal doc | Green | Scope discovery weaker |
| Phase 002 rename | Prior phase | Green | New names would not be canonical |
| Python JSON parser | Local tooling | Green | JSON validation blocked |
| Spec validator | Local tooling | Green | Completion claim blocked |
| Alignment verifier | Local tooling | Green if runnable | OpenCode quality evidence weaker if skipped |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: JSON parse failure, unexpected residual hits in non-excluded paths, or strict validation failure.
- **Procedure**: Patch the specific failing file, rerun the targeted audit, then rerun the full audit set. If the broad replacement overreaches into an excluded path, restore only that path from Git and rebuild the file list with the missing exclusion.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Read inventory -> planning artifacts -> critical graph metadata -> broad scoped replacement -> audits -> strict validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Planning | Parent docs and Phase 001 inventory | Critical graph fix |
| Critical Graph Metadata | Planning | Advisor edge cleanliness |
| Broad Replacement | Critical graph fix | Residual audits |
| Audit and Validation | Broad replacement | Phase 004 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Planning artifacts | Medium | 20-30 minutes |
| Critical graph metadata | Low | 5-10 minutes |
| Broad scoped replacement | High | 30-60 minutes |
| Verification | Medium | 20-40 minutes |
| **Total** | | **75-140 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No database writes planned.
- [x] Excluded historical path list captured.
- [x] Critical graph metadata files identified.

### Rollback Procedure
1. Use `git diff --name-only` to identify changed paths.
2. Restore only any file outside Phase 003 scope.
3. Reapply targeted replacements to in-scope files.
4. Rerun JSON parse, grep audits, and strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Text-only rollback through Git for specific over-edited paths.
<!-- /ANCHOR:enhanced-rollback -->
