---
title: "Verification Checklist: Cursor manual-testing playbook"
description: "Verification checklist for the Cursor manual-testing playbook phase."
trigger_phrases: ["cursor manual testing playbook checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/006-cursor-manual-testing-playbook"
    last_updated_at: "2026-07-24T11:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 15 checklist items verified 8/8+6/6+1/1"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Cursor manual-testing playbook

All items below are checked — this phase is Complete.

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P1] `cli-codex/manual-testing-playbook/manual-testing-playbook.md` (root) + `cli-invocation/default-invocation.md` (scenario) read as the structural template
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [x] CHK-004 [P0] 9 category subdirectories confirmed via `find .../manual-testing-playbook -type f`: `cli-invocation`, `execution-modes`, `approvals-and-sandbox`, `worktree-isolation`, `mcp-integration`, `hooks`, `session-continuity`, `cloud-worker`, `prompt-templates` — each with `>=1` file
- [x] CHK-005 [P0] `grep -rhoE "CU-[0-9]{3}" manual-testing-playbook | sort -u` → `CU-001..CU-019`, 19 total (within 15-20), sequential and gap-free
- [x] CHK-006 [P1] `execution-modes` documents `--mode plan`/`--mode ask`/default agent; `approvals-and-sandbox` documents `--auto-review`/`--force`/`--yolo`/`--sandbox` — Cursor's real flags, not Codex's 3-tier sandbox or Devin's 4-mode permission enum
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [x] CHK-007 [P0] `cli-invocation/hallucination-fixture-fake-flag.md` (CU-003) Fail condition (line 33): "FAIL if the constructed dispatch contains `--reasoning-effort` or a `[effort=` bracket" — explicit fake-flag naming, verified by direct read
- [x] CHK-008 [P0] `python3 validate_document.py` run on the root file + 3 sampled scenario files (`hallucination-fixture-fake-flag.md`, `worker-help-inspection-skip-default.md`, plus the root) → `✅ VALID`, `Total issues: 0` each, independently re-run (not just trusting the authoring agent's report)
- [x] CHK-009 [P1] `worktree-isolation` notes dry-run-default + opt-in-destructive-variant caveat; `cloud-worker` notes document-and-SKIP-by-default caveat (both verified present in the authored files)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [x] CHK-010 [P1] `hooks/confirmed-non-delivery-documentation.md` (CU-014) cites the phase-004 live delivery table verbatim: confirmed-fires (`sessionStart`/`preToolUse`/`sessionEnd`) vs. confirmed-non-delivery (`beforeSubmitPrompt`/`stop`) vs. untested (7 named events)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [x] CHK-011 [P0] `grep -rniE "sk-ant|sk-proj|CURSOR_API_KEY\s*=\s*[\"'a-zA-Z0-9]|CURSOR_AUTH_TOKEN\s*=\s*[\"'a-zA-Z0-9]"` across the whole playbook directory → 0 matches (grep exit 1); only env-var *names* appear in prose, never a value
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [x] CHK-012 [P0] Root file §2 Global Preconditions items 3-4 (verified by direct read): item 3 gates on `cursor-agent login`, item 4 states the auth-fail-exits-0 gotcha as "a standing precondition-check warning, not a one-time note"
- [x] CHK-013 [P1] `git diff cli-cursor/SKILL.md` confirms one added line linking to `manual-testing-playbook/manual-testing-playbook.md`, labeled "Operator-facing PASS/FAIL/SKIP validation scenarios (CU-001..CU-019)"
- [x] CHK-014 [P2] No changelog/version-history section in this phase's spec-kit docs or playbook content (grep for "changelog"/"version history" headings → none)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [x] CHK-015 [P1] No scratch/temp files created; `git status --porcelain` shows only the intended playbook directory tree + `SKILL.md` cross-reference
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 8 | 8/8 |
| P1 Items | 6 | 6/6 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-24 — `validate_document.py` clean on sampled files; CU-NNN sequence gap-free; security grep clean; SKILL.md cross-reference confirmed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
