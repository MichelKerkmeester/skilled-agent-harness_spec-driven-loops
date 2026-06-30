---
title: "Implementation Plan: Phase 005 Root Docs and Configs"
description: "Plan for checking listed repo-root docs/configs, replacing old deep-skill names where present, validating JSON, and running strict spec validation for Packet 070 Phase 005."
trigger_phrases:
  - "070 phase 005 plan"
  - "root docs config rename plan"
  - "sk-deep root grep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/056-sk-deep-rename/005-root-and-config"
    last_updated_at: "2026-05-05T19:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Planned scoped root reference replacement and validation"
    next_safe_action: "Apply README rename, validate JSON, then strict-validate child and parent"
    blockers: []
    key_files:
      - "plan.md"
      - "README.md"
      - "opencode.json"
      - ".utcp_config.json"
      - ".claude/settings.json"
      - ".claude/settings.local.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 005 Root Docs and Configs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON |
| **Framework** | Spec Kit Level 2 contract |
| **Storage** | Repo files only |
| **Testing** | `grep`, Python JSON parsing, strict spec validation |

### Overview
Phase 005 is a scoped text rename in root docs/configs. Preflight found only `README.md` contains old-name references among the user-listed root targets, while JSON files still need parse validation to prove the config surface stayed valid.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent `spec.md` and `resource-map.md` read.
- [x] Phase 001 `inventory.tsv` filtered for Phase 005/root-doc/config rows.
- [x] Listed root targets existence checked before edits.
- [x] Old-name grep run against the listed root targets.

### Definition of Done
- [x] `README.md` old display names replaced with `deep-research` and `deep-review`.
- [x] Listed JSON files parse successfully.
- [x] Residual grep across listed root docs/configs returns no matches.
- [x] Child strict validation exits 0.
- [x] Parent strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Exact text replacement with explicit file allowlist.

### Key Components
- **Root documentation**: `README.md`, `AGENTS.md`, `AGENTS_Barter.md`, and `CLAUDE.md`.
- **Root configuration**: `opencode.json`, `.utcp_config.json`, `.claude/settings.json`, and `.claude/settings.local.json`.
- **Phase docs**: Level 2 spec artifacts under `005-root-and-config/`.

### Data Flow
Phase 001 inventory identifies Phase 005 candidates. This phase narrows execution to the user-listed files, applies exact string replacement only where old names exist, then proves no listed root file still contains the old names.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `README.md` | Root skill catalog visible to repo readers | Replace old skill names | Residual grep returns no README match |
| `AGENTS.md` / `CLAUDE.md` | Project instruction docs | No-op if no old refs | Preflight grep found no old refs |
| `AGENTS_Barter.md` | Sibling symlinked instruction doc | No-op if no old refs | Preflight grep found no old refs |
| Root JSON configs | Runtime/MCP/tool configuration | Parse-only unless old refs exist | Python JSON parser succeeds |

Required inventory:
- Same-class producer search: old-name grep across the listed Phase 005 root docs and config files.
- Consumers of changed display strings: root README skill list only.
- Matrix axes: root docs vs JSON configs; real file vs missing file; symlink vs regular file.
- Invariant: no listed root target has an active old-name reference after this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Context and Scope
Read parent docs and inventory. Confirm the writable allowlist from the user brief, because Phase 001's root-doc/config bucket is broader than this phase's hard scope.

### Phase B: Root Reference Update
Run exact old-name grep across the listed files. Replace only matching files with the new names.

### Phase C: Config Validation
Validate listed JSON configs with `/usr/bin/python3 -c "import json; json.load(...)"`. Treat parse failure as a hard blocker.

### Phase D: Documentation and Validation
Update Phase 005 artifacts with evidence, then run child and parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Command | Expected |
|------|---------|----------|
| Residual old-name grep | Requested grep across listed Phase 005 root docs and config files | No output |
| JSON validity | Python `json.load()` for each listed JSON file | All parse |
| Child validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/005-root-and-config --strict` | Exit 0 |
| Parent validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename --strict` | Exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 001 inventory exists at `001-discovery-impact-map/inventory.tsv`.
- Parent packet docs exist at `../spec.md` and `../resource-map.md`.
- Python 3 is available at `/usr/bin/python3` for JSON parsing.
- The spec validator exists at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a root doc replacement is wrong, revert only the `README.md` hunk in this phase. If JSON parsing fails after an edit, restore the specific JSON file from the pre-edit state and re-run the parser; no JSON edit is expected unless grep finds an old reference.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Dependency | Notes |
|-------|------------|-------|
| 003 | `.opencode/` internals | Runs in parallel and owns `.opencode/` references, except this phase's spec folder |
| 004 | Runtime mirrors | Runs in parallel and owns runtime mirror docs/agents |
| 006 | Advisor and final validation | Consumes Phase 005 residual grep evidence |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Reason |
|-----------|----------|--------|
| Planning artifacts | Medium | Level 2 contract requires five authored docs plus graph metadata |
| Root reference replacement | Low | Only two README occurrences were found |
| JSON/config validation | Low | Parse-only validation over four JSON files |
| Strict validation | Low | Child and parent validator runs |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Rollback is file-local. The only expected source edit is `README.md`, and the exact replacement can be reversed without touching parallel phase outputs. Phase docs can stay as an audit trail if source rollback is needed.
<!-- /ANCHOR:enhanced-rollback -->
