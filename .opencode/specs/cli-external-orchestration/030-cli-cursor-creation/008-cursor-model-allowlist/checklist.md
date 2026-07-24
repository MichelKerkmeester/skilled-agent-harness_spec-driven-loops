---
title: "Verification Checklist: cli-cursor enforced model allowlist"
description: "Verification checklist for the cli-cursor enforced model allowlist phase."
trigger_phrases: ["cli-cursor model allowlist checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/008-cursor-model-allowlist"
    last_updated_at: "2026-07-24T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 15 checklist items verified 8/8+7/7+0/0"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-allowlist-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: cli-cursor enforced model allowlist

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
- [x] CHK-003 [P1] Exact model ids live-confirmed via `cursor-agent --list-models` before allowlist authoring, not guessed
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [x] CHK-004 [P0] `CURSOR_SUPPORTED_MODELS` (executor-config.ts) is exactly `['cursor-grok-4.5-low', 'cursor-grok-4.5-low-fast', 'cursor-grok-4.5-medium', 'cursor-grok-4.5-medium-fast', 'cursor-grok-4.5-high', 'cursor-grok-4.5-high-fast', 'composer-2.5', 'composer-2.5-fast', 'glm-5.2-high', 'glm-5.2-max']` — verified via the new `executor-config.vitest.ts` sorted-array assertion
- [x] CHK-005 [P0] `auto` is excluded from the allowlist and rejected by `isCursorModelAllowed('auto')` → `false`
- [x] CHK-006 [P1] `npm run typecheck` (system-deep-loop/runtime) → 0 errors
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [x] CHK-007 [P0] `buildCursorLineageCommand` (fanout-run.cjs) throws `/not in the enforced allowlist/` for `auto`, `gpt-5.6-sol-high-fast`, and `claude-opus-4-8-xhigh` — verified by direct test run
- [x] CHK-008 [P0] The cli-cursor case of `buildSpawnSpec` (dispatch-model.cjs) throws the same class of error for `auto` and an out-of-roster id — verified by direct test run
- [x] CHK-009 [P0] `npx vitest run` on `executor-config.vitest.ts` + `fanout-run.vitest.ts` → 157/157 passed; on `remediation.vitest.ts` → 25/26 passed (1 pre-existing, unrelated failure, isolated via `git stash` against `HEAD` before this phase's changes — confirmed identical)
- [x] CHK-010 [P1] An omitted model defaults to `composer-2.5` at both dispatch entry points, confirmed by `'defaults an omitted model to composer-2.5'` (fanout-run.vitest.ts) and the cli-cursor cwd-propagation test (remediation.vitest.ts)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [x] CHK-011 [P1] `grep -rn "auto model\|(auto)\|is Cursor's own router\|Cursor's intelligent router"` across the whole `cli-cursor/` skill tree → 0 matches after the doc rewrite (19 files bulk-fixed + 6 files hand-fixed for prose-level claims the bulk pass missed)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [x] CHK-012 [P1] No credential/token introduced in any code or doc edit — `grep -riE "sk-ant|sk-proj|CURSOR_(API_KEY|AUTH_TOKEN)\s*="` across all changed files → 0 matches
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [x] CHK-013 [P1] `python3 validate_document.py` on every markdown file under `cli-cursor/` → all report `✅ VALID`
- [x] CHK-014 [P0] `validate_skill_package.py` against the hub (default invocation) → `package_skill.py --check: PASS`, `compiled routing readiness: PASS` (fixed a stale bookkeeping hash after the `SKILL.md` content edit), `parent-skill-check.cjs: PASS`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [x] CHK-015 [P1] No scratch/temp files created; `git status --porcelain` shows only the intended runtime/test/skill-doc/spec-folder file set for this phase
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 8 | 8/8 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-24 — typecheck clean, 208/209 tests passing (1 pre-existing unrelated failure), all docs VALID, hub validators 0 fails.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
