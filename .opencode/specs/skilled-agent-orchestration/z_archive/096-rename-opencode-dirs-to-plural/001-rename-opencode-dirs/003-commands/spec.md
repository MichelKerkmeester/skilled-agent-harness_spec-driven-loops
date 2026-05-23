---
title: "Feature Specification: 096/003 - rename .opencode/command/ to .opencode/commands/"
description: "Phase 3 of 4. Rename .opencode/command/ to .opencode/commands/; update 1,811 reference-bearing files (~16,128 occurrences). Patch audit_descriptions.py (command half) + target_manifest.jsonc + mcp-doctor.sh."
trigger_phrases:
  - "096/003 commands rename"
  - "opencode command commands"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands"
    last_updated_at: "2026-05-07T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec docs"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/audit_descriptions.py"
      - ".opencode/skills/deep-agent-improvement/assets/target_manifest.jsonc"
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 096/003 - rename .opencode/command/ to .opencode/commands/

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
opencode docs (`https://opencode.ai/docs/commands`) say project-level command discovery looks for `.opencode/commands/` (plural). Repo uses singular. 1,811 files reference the singular path; `audit_descriptions.py` validates `.opencode/commands/**` paths; `target_manifest.jsonc` and `mcp-doctor.sh` have hardcoded paths.

### Purpose
Rename `.opencode/commands/` → `.opencode/commands/` (69 files across 6 subdirs moved). Update 1,811 reference-bearing files. Patch 3 critical files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv .opencode/command .opencode/commands`
- Bulk text replacement across 1,811 files / 16,128 occurrences
- Targeted patches: audit_descriptions.py (command half), target_manifest.jsonc, mcp-doctor.sh
- Per-phase verification

### Out of Scope
- Skills (Phase 001), Agents (Phase 002), Symlinks (Phase 004)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/**` → `.opencode/commands/**` | Move | 69 files renamed via `git mv .opencode/command .opencode/commands` |
| `**/*.{md,json,jsonl,ts,js,sh,yaml,yml,jsonc}` | Modify | Bulk sed |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | Modify | Command path validators |
| `.opencode/skills/deep-agent-improvement/assets/target_manifest.jsonc` | Modify | `.opencode/commands/speckit/handover.md` |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modify | Hardcoded path strings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Directory renamed | `.opencode/commands/` gone; `.opencode/commands/` populated with 69 files across 6 subdirs |
| REQ-002 | Zero residual singular refs | `git grep -E '\.opencode/commands/' \| grep -v '\.opencode/commands/'` returns 0 |
| REQ-003 | audit_descriptions.py compiles | Python syntax check passes |
| REQ-004 | target_manifest.jsonc valid | JSON-with-comments parses |
| REQ-005 | mcp-doctor.sh runs without path errors | Bash syntax check + dry-run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Spec packets in 096 still reference correct paths | Phase 002 + 003 spec docs use plural where they were re-generated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 003 child packet validates strict-clean.
- **SC-002**: Repo grep for `.opencode/commands/` (excluding plural) returns 0 lines.
- **SC-003**: All 3 critical patched files compile / validate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | audit_descriptions.py touched in both Phase 002 (agent half) and 003 (command half) | Low | Sequential; Phase 002 already complete; Phase 003 only touches remaining `.opencode/commands/` strings |
| Risk | target_manifest.jsonc has YAML/JSON-with-comments syntax | Low | jsonc parser handles comments; bulk sed string-only |
| Risk | mcp-doctor.sh shell script with $-vars | Low | Sed substitutes literal pattern; vars unaffected |
| Dependency | Phases 001 + 002 complete | Required | Verified before dispatch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Bulk sed across 1,811 files <30 seconds.
- **NFR-P02**: cli-codex dispatch <8 minutes.

### Security
- **NFR-S01**: No secret leakage.

### Reliability
- **NFR-R01**: `git mv` preserves history.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- 6 subdirs under `.opencode/commands/` (agent_router.md, create/, doctor/, improve/, memory/, spec_kit/) all moved atomically.
- mcp-doctor.sh: BASH variable expansion vs sed pattern — sed pattern is literal `\.opencode/commands/` so BASH expansion doesn't interfere.

### Error Scenarios
- audit_descriptions.py syntax error: orchestrator inspects Python diff manually.
- target_manifest.jsonc parse error: orchestrator inspects JSONC syntax.

### State Transitions
- After Phase 003: all 3 directories renamed (skills, agents, commands now plural).
- Symlinks (Phase 004) still broken — pointing at old singular targets — until Phase 004 redirects them.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 1,811 files, 16,128 occurrences |
| Risk | 10/25 | Reversible |
| Research | 12/20 | Inventory complete |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Resource Map**: `../resource-map.md`
