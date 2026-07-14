---
title: "Feature Specification: 096/001 - rename .opencode/skill/ to .opencode/skills/"
description: "Phase 1 of 4 in packet 096. Rename .opencode/skill/ to .opencode/skills/ and update 7,464 reference-bearing files (~645,862 occurrences). Patch 3 critical configs/scripts (opencode.json, .claude/settings.local.json, skill_advisor.py)."
trigger_phrases:
  - "096/001 skills rename"
  - "opencode skill skills"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills"
    last_updated_at: "2026-05-07T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 spec docs"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - "opencode.json"
      - ".claude/settings.local.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 096/001 - rename .opencode/skill/ to .opencode/skills/

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
opencode's project-level skill discovery looks for `.opencode/skills/` (plural per `https://opencode.ai/docs/skills`). This repo uses `.opencode/skills/` (singular), so opencode's built-in discovery silently fails. Every `opencode run` dispatch prints "Could not find any skills directories" before falling through to the `opencode-skills` plugin's bridging behavior.

### Purpose
Rename `.opencode/skills/` → `.opencode/skills/` and update all 7,464 reference-bearing files in the repo. Patch 3 critical configs/scripts (opencode.json MCP commands, .claude/settings.local.json hooks, skill_advisor.py path lookups) that hard-code the singular path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv .opencode/skill .opencode/skills` (preserves git history per file).
- Bulk text replacement across 7,464 files / 645,862 occurrences.
- Targeted patches: opencode.json (3 MCP refs), .claude/settings.local.json (4 hooks), skill_advisor.py (regex + dict keys + f-strings).
- Per-phase verification: validate.sh strict, grep for residual singular refs, smoke-test opencode discovery.

### Out of Scope
- Renaming agent or command directories (Phases 002, 003).
- Symlink redirects (Phase 004).
- Modifying validate.sh / validate_document.py / generate-context.js (already use relative paths — confirmed safe).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/**` → `.opencode/skills/**` | Move | All 7,464 files renamed via `git mv .opencode/skill .opencode/skills` |
| `**/*.{md,json,jsonl,ts,js,sh,yaml,yml,py,tmpl,jsonc,tsx,mts}` | Modify | Bulk sed replacement of `.opencode/skills/` → `.opencode/skills/` |
| `opencode.json` | Modify | 3 MCP server `command` arrays (lines 23, 44, 57) |
| `.claude/settings.local.json` | Modify | 4 hook commands (lines 37, 49, 61, 73) |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modify | Regex + f-strings + dict keys |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Directory renamed | `.opencode/skills/` no longer exists; `.opencode/skills/` exists with all original content |
| REQ-002 | Zero residual singular refs | `git grep -E '\.opencode/skills/' \| grep -v '\.opencode/skills/'` returns 0 lines |
| REQ-003 | opencode.json valid + MCP refs updated | `python3 -c "import json; json.load(open('opencode.json'))"` succeeds; all 3 command arrays use plural |
| REQ-004 | .claude/settings.local.json valid + hooks updated | JSON parses; 4 hook commands use plural |
| REQ-005 | skill_advisor.py compiles + runs | `python3 -c "import re; re.compile(r'\\.opencode/skills/([^/]+)/')"`; smoke-test invocation returns recommendation |
| REQ-006 | opencode discovery healthy | `opencode run --model deepseek/deepseek-chat "say OK"` does NOT print "Could not find any skills directories" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Existing scripts still work | `validate.sh --strict` on packet 095 still returns exit 0 |
| REQ-011 | All 16 root playbooks still validate | `validate_document.py` on each `manual_testing_playbook.md` returns VALID |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 001 child packet validates strict-clean.
- **SC-002**: Repo grep for `.opencode/skills/` (excluding plural) returns 0 lines.
- **SC-003**: opencode CLI no longer prints "Could not find any skills directories".
- **SC-004**: skill_advisor.py + validate.sh + validate_document.py + generate-context.js all still work.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bulk sed catches false positives (e.g., quoted historic name in docs) | Low | Verification grep at end exposes any remaining singular ref; orchestrator inspects |
| Risk | MCP servers fail to start post-rename | Med | Step 3 patches opencode.json BEFORE smoke test; user restarts MCP if needed |
| Risk | skill_advisor.py regex doesn't compile after edit | Med | cli-codex runs `python3 -c "re.compile(...)"` post-edit |
| Dependency | git working tree functional state | Green | Verified clean except for unrelated parallel-track files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Bulk sed across 7,464 files completes in <60 seconds.
- **NFR-P02**: cli-codex dispatch wall-clock <15 minutes.

### Security
- **NFR-S01**: No secrets exposed in any patched config (verify settings.local.json doesn't gain new auth tokens).
- **NFR-S02**: Sandbox=workspace-write for cli-codex (no network mutations).

### Reliability
- **NFR-R01**: `git mv` preserves history for every renamed file.
- **NFR-R02**: Per-phase verification gates idempotent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: phase has no skip-empty case (all 7,464 files have content).
- Maximum length: largest file (system-spec-kit playbook ~3,800 lines) sed-safe.
- Invalid format: malformed JSON in graph-metadata.json files would fail post-edit; verification step covers.

### Error Scenarios
- Bulk sed fails mid-pass: Bash `set -e` halts; orchestrator inspects diff and re-runs idempotently.
- skill_advisor.py regex fails to compile: orchestrator manual fix.
- opencode CLI still prints warning: investigate plugin opencode-skills caching.

### State Transitions
- After Phase 001: `.opencode/skills/` gone, `.opencode/skills/` populated; `.opencode/agents/`, `.opencode/commands/` still singular (Phases 002, 003 follow).
- Symlinks `.claude/skills` etc. become BROKEN (point to old singular target); Phase 004 fixes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | 7,464 files, 645,862 occurrences — repo-wide |
| Risk | 12/25 | Reversible (git history preserved); per-phase verification |
| Research | 14/20 | Inventory complete, hard-coded paths identified |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

(none — all clarifications in approved plan)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Resource Map**: `../resource-map.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
