---
title: "Verification Checklist: Phase 004 Runtime Mirrors"
description: "Verification Date: 2026-05-05"
trigger_phrases:
  - "070 phase 004 checklist"
  - "runtime mirror verification"
  - "claude codex gemini verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/070-sk-deep-rename/004-runtime-mirrors"
    last_updated_at: "2026-05-05T16:20:37Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Phase 004 verification checklist"
    next_safe_action: "Complete verification"
    blockers: []
    key_files:
      - "checklist.md"
      - ".claude"
      - ".codex"
      - ".gemini"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 004 Runtime Mirrors

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` (evidence: `REQ-001` through `REQ-006`)
- [x] CHK-002 [P0] Technical approach defined in `plan.md` (evidence: exact replacement plus residual grep workflow)
- [x] CHK-003 [P1] Dependencies identified and available (evidence: parent docs, Phase 001 inventory, Python, validator)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-CODE-001 [P0] Runtime replacements are exact old-name to new-name substitutions (evidence: `.claude` and `.gemini` complete; `.codex` blocked)
- [x] CHK-CODE-002 [P0] Touched/targeted TOML files parse after replacement (evidence: `/opt/homebrew/bin/python3.11` `tomllib` printed `toml ok`)
- [x] CHK-CODE-003 [P0] No replacement backup files remain (evidence: backup-file find returned no rows)
- [x] CHK-CODE-004 [P1] Edits stay inside Phase 004 ownership (evidence: source edits limited to `.claude` and `.gemini`; `.codex` attempts failed)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-TEST-001 [P0] `.claude` residual grep returns no old skill names (evidence: residual grep only listed `.codex` files)
- [ ] CHK-TEST-002 [P0] `.codex` residual grep returns no old skill names (evidence: residual grep listed 4 `.codex` files)
- [x] CHK-TEST-003 [P0] `.gemini` residual grep returns no old skill names (evidence: residual grep only listed `.codex` files)
- [x] CHK-TEST-004 [P1] README files were checked for stale references (evidence: README read pass found no old-name grep rows)
- [x] CHK-TEST-005 [P1] Phase 001 runtime rows are accounted for (evidence: 10 inventory rows checked; plus extra `.codex/config.toml` residual found)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Claude runtime mirror references use new skill names (evidence: `.claude` residual grep clean)
- [ ] CHK-FIX-002 [P0] Codex runtime mirror references use new skill names (evidence: `.codex` residual count 4)
- [x] CHK-FIX-003 [P0] Gemini runtime mirror references use new skill names (evidence: `.gemini` residual grep clean)
- [x] CHK-FIX-004 [P1] Phase 004-owned `.gemini/commands` references use new skill names (evidence: `.gemini/commands/speckit/deep-research.toml` patched and TOML parse passed)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-SEC-001 [P0] No secrets or binary contents are introduced into docs or runtime files (evidence: text-only docs and runtime mirror replacements)
- [x] CHK-SEC-002 [P1] No permissions, tool lists, model settings, or dispatch behavior are changed (evidence: diffs are old-name string replacements plus phase docs)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-DOC-001 [P1] Spec/plan/tasks/checklist reflect blocked Phase 004 state (evidence: blocker recorded)
- [x] CHK-DOC-002 [P1] Completion evidence is recorded in this checklist (evidence: residual grep and validation evidence recorded)
- [x] CHK-DOC-003 [P1] `implementation-summary.md` captures files changed and verification evidence (evidence: summary updated)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-ORG-001 [P0] Phase 004 artifacts live inside `004-runtime-mirrors/` (evidence: line-count command covers phase folder files)
- [x] CHK-ORG-002 [P0] Runtime source edits are limited to `.claude`, `.codex`, and `.gemini` (evidence: `git diff --name-only` for source mirrors lists `.claude` and `.gemini`; `.codex` unchanged due block)
- [x] CHK-ORG-003 [P1] `.opencode`, root docs, configs, and archives are untouched by this phase (evidence: no edits made there)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 11/13 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-05
<!-- /ANCHOR:summary -->
