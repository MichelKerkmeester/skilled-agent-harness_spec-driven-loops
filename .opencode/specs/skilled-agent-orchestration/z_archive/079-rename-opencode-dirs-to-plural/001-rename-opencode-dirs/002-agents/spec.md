---
title: "Feature Specification: 096/002 - rename .opencode/agent/ to .opencode/agents/"
description: "Phase 2 of 4. Rename .opencode/agent/ to .opencode/agents/; update 1,532 reference-bearing files (~8,686 occurrences). Patch CLAUDE.md §5 routing table + sk-prompt graph-metadata + runtime_capabilities.json + audit_descriptions.py (agent half)."
trigger_phrases:
  - "096/002 agents rename"
  - "opencode agent agents"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents"
    last_updated_at: "2026-05-07T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec docs"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - "CLAUDE.md"
      - ".opencode/skills/sk-prompt/graph-metadata.json"
      - ".opencode/skills/deep-research/assets/runtime_capabilities.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 096/002 - rename .opencode/agent/ to .opencode/agents/

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
opencode docs (`https://opencode.ai/docs/agents`) say project-level agent discovery looks for `.opencode/agents/` (plural). This repo uses `.opencode/agents/` (singular). 1,532 files reference the singular path including the CLAUDE.md §5 routing table and several JSON manifests with mirrorPath fields.

### Purpose
Rename `.opencode/agents/` → `.opencode/agents/` (12 agent files moved). Update all 1,532 reference-bearing files. Patch 4 critical configs (CLAUDE.md §5, sk-prompt graph-metadata mirrorPath, deep-research runtime_capabilities mirrorPath, audit_descriptions.py agent-half validators).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv .opencode/agent .opencode/agents`
- Bulk text replacement across 1,532 files / 8,686 occurrences
- Targeted patches: CLAUDE.md §5, sk-prompt graph-metadata, runtime_capabilities.json, audit_descriptions.py (agent half)
- Per-phase verification

### Out of Scope
- Skills (Phase 001) and Commands (Phase 003) renames
- Symlink redirects (Phase 004)
- Mirror-runtime structure changes — those are file copies (not symlinks); their internal text refs are caught by bulk sed

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/**` → `.opencode/agents/**` | Move | 12 files renamed via `git mv .opencode/agent .opencode/agents` |
| `**/*.{md,json,jsonl,ts,js,sh,yaml,yml}` | Modify | Bulk sed replacement |
| `CLAUDE.md` | Modify | §5 Runtime Agent Directory routing table |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Modify | mirrorPath field |
| `.opencode/skills/deep-research/assets/runtime_capabilities.json` | Modify | mirrorPath field |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | Modify | Update `.opencode/agent/<name>.md` → `.opencode/agents/<name>.md` validator strings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Directory renamed | `.opencode/agents/` gone; `.opencode/agents/` populated with 12 files |
| REQ-002 | Zero residual singular refs | `git grep -E '\.opencode/agents/' \| grep -v '\.opencode/agents/'` returns 0 |
| REQ-003 | CLAUDE.md §5 updated | Routing table shows `.opencode/agents/` for Opencode runtime |
| REQ-004 | JSON configs valid + plural mirrorPath | sk-prompt graph-metadata + runtime_capabilities both load + use plural |
| REQ-005 | audit_descriptions.py compiles | Python syntax check passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Mirror-runtime files updated | `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` internal text refs use plural (caught by bulk sed) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 002 child packet validates strict-clean.
- **SC-002**: Repo grep for `.opencode/agents/` (excluding plural) returns 0 lines.
- **SC-003**: CLAUDE.md §5 + JSON manifests + audit_descriptions.py all consistent with plural.
- **SC-004**: Spec packet 095 still validates (no script regressions from prior phase).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bulk sed misses an edge case | Low | grep audit at end |
| Risk | audit_descriptions.py has both agent and command paths; this phase only updates agent half | Med | Phase 003 handles command half; sequential execution prevents interference |
| Risk | Mirror runtimes (.claude/.codex/.gemini agents/) may have format-specific path syntax (e.g., TOML in codex) | Low | Bulk sed uses simple string match; works across formats |
| Dependency | Phase 001 complete | Required | Verified before dispatch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Bulk sed across 1,532 files <30 seconds.
- **NFR-P02**: cli-codex dispatch <8 minutes.

### Security
- **NFR-S01**: No secret leakage in CLAUDE.md or JSON manifest edits.

### Reliability
- **NFR-R01**: `git mv` preserves history.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- TOML files in `.codex/agents/`: bulk sed string match works regardless of format.
- mirrorPath JSON values: sed catches `.opencode/agents/<name>` → `.opencode/agents/<name>`.

### Error Scenarios
- audit_descriptions.py validator regex breaks: orchestrator fixes manually.
- CLAUDE.md routing table malformed post-edit: orchestrator inspects table syntax.

### State Transitions
- After Phase 002: `.opencode/agents/` gone, `.opencode/agents/` populated; commands and skills already renamed (or skills renamed in Phase 001).
- Mirror-runtime symlinks for skills (Phase 004 work) don't affect this phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 1,532 files, 8,686 occurrences |
| Risk | 10/25 | Reversible; smaller scope than skills |
| Research | 12/20 | Inventory complete |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

(none — all clarifications in approved plan)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Resource Map**: `../resource-map.md`
