---
title: "Verification Checklist: cli-cursor hook code sk-code/code-opencode alignment"
description: "Verification checklist for the Cursor hook sk-code/code-opencode alignment phase."
trigger_phrases: ["cli-cursor hooks sk-code alignment checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment"
    last_updated_at: "2026-07-24T17:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "All checklist items verified"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-sk-code-alignment", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: cli-cursor hook code sk-code/code-opencode alignment

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
- [x] CHK-003 [P1] Read `sk-code/SKILL.md` and `code-opencode/SKILL.md` fresh, not assumed from prior knowledge of the repo
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [x] CHK-004 [P0] All 5 in-scope `.mjs` files (`spec-gate-enforce.mjs`, `spec-gate-classify.mjs`, `mcp-route-guard.mjs`, `post-tool-use.mjs`, `task-dispatch-guard.mjs`) have the P0 COMPONENT/PURPOSE box header — `grep -c "COMPONENT:"` returns `1` for each
- [x] CHK-005 [P0] None of the 5 files contain `'use strict'` — `grep -c "'use strict'"` returns `0` for each
- [x] CHK-006 [P0] `spec-gate-prebind.mjs` (a concurrent session's file) was NOT touched — confirmed via `git status --porcelain` showing it unchanged from its pre-existing `??` state
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [x] CHK-007 [P0] `node --check` exits `0` for all 5 edited files
- [x] CHK-008 [P0] Each edited file's synthetic-payload smoke test returns the identical response envelope observed before editing — e.g. `spec-gate-classify.mjs` still returns the same `{"permission":"allow","agent_message":"SPEC FOLDER QUESTION..."}` verbatim
- [x] CHK-009 [P0] `python3 verify_alignment_drift.py --root .../runtime/hooks/cursor --root .../mcp-server/hooks/cursor` reports `11 files scanned, Findings: 0, Errors: 0, Warnings: 0, Violations: 0`
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [x] CHK-010 [P1] All 5 `.ts` Cursor hook files independently audited against the TypeScript style guide/checklist and confirmed already compliant (correct header, no `any`, PascalCase types, kebab-case filenames) — no changes needed there
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [x] CHK-011 [P1] `grep -riE "sk-ant|sk-proj|CURSOR_(API_KEY|AUTH_TOKEN)\s*="` across all 5 edited files and `hooks.md` → 0 matches
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [x] CHK-012 [P0] `code-opencode/references/shared/hooks.md` now documents Cursor CLI with a `CURSOR HOOKS` section matching the Claude section's exact column format (Event/Matcher/Command/Timeout/Purpose), listing all `12` live entries from `.cursor/hooks.json`
- [x] CHK-013 [P1] `hooks.md`'s dynamic-load-pattern registration table, Key Sources table, and Cross-Runtime Parity table all updated to include Cursor; frontmatter version bumped to `1.0.0.15`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [x] CHK-014 [P1] Only in-scope files touched: 5 `.mjs` hook files + `hooks.md`; no packet-local `graph-metadata.json`/`description.json` added outside the spec-folder convention
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 9 | 9/9 |
| P1 Items | 5 | 5/5 |

**Verification Date**: 2026-07-24 — all 5 `.mjs` files aligned and independently confirmed clean by `verify_alignment_drift.py`; `hooks.md`'s Cursor documentation gap closed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
