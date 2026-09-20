---
title: "Tasks: cli-cursor enforced model allowlist"
description: "Task breakdown for the cli-cursor enforced model allowlist phase."
trigger_phrases: ["cli-cursor model allowlist tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/008-cursor-model-allowlist"
    last_updated_at: "2026-07-24T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 13 tasks complete; typecheck + vitest + doc validation clean"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-allowlist-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-cursor enforced model allowlist

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Confirmed exact model ids via `cursor-agent --list-models | grep -iE "grok|glm|composer"` (authenticated account) → 6 Grok 4.5 tiers, 2 Composer variants, 2 GLM 5.2 tiers = 10 total
- [x] T002 Traced `CURSOR_SUPPORTED_MODELS`'s only 2 real consumers (`fanout-run.cjs`'s `buildCursorLineageCommand`, `dispatch-model.cjs`'s cli-cursor case) and confirmed the generic `parseExecutorConfig` schema treats `model` as a free-form string for every executor kind, not a per-kind enum — enforcement belongs at the dispatch-construction layer, not the schema layer
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Replaced `CURSOR_SUPPORTED_MODELS` in `executor-config.ts` with the 10-id allowlist; added `CURSOR_DEFAULT_MODEL = 'composer-2.5'` and `isCursorModelAllowed()`
- [x] T004 Added the fail-closed allowlist check to `buildCursorLineageCommand` (`fanout-run.cjs`), thrown via the existing `inputError()` helper before args construction; changed the default from `'auto'` to `CURSOR_DEFAULT_MODEL`
- [x] T005 Added the identical fail-closed check to the cli-cursor case of `buildSpawnSpec` (`dispatch-model.cjs`); changed the default from `'auto'` to `CURSOR_DEFAULT_MODEL`
- [x] T006 [P] Updated `executor-config.vitest.ts`: swapped 3 `model: 'auto'` fixtures to `composer-2.5`, added a new `describe('CURSOR_SUPPORTED_MODELS / isCursorModelAllowed')` block (3 tests)
- [x] T007 [P] Updated `fanout-run.vitest.ts`: swapped 4 `model: 'auto'` fixtures to `composer-2.5`, added `'accepts every model in the enforced allowlist'` and `'rejects a model outside the enforced allowlist'` tests
- [x] T008 [P] Updated `remediation.vitest.ts`: fixed the shared `resolved`/loop fixtures to use `composer-2.5` for cli-cursor cases, added a new allowlist-rejection test
- [x] T009 Rewrote cli-cursor skill-doc model-selection content across `SKILL.md`, `references/cli-reference.md`, `references/integration-patterns.md`, `references/agent-delegation.md`, `README.md`, `assets/prompt-templates.md`, `assets/prompt-quality-card.md`, and the manual-testing-playbook root + `CU-001` scenario — bulk-replaced 87 literal `--model auto` occurrences across 19 files, then hand-fixed prose-level `auto`-as-default claims the bulk pass could not catch (titles, FAQ answers, decision-matrix tables)
- [x] T010 Realigned the hub's compiled-routing manifest hash (stale after the `SKILL.md` content edit) — same verified-safe pattern as phases 003/007
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T011 `npm run typecheck` (runtime package) → 0 errors. `npx vitest run` on all 3 affected test files → 157/157 + 26/26 (1 pre-existing unrelated `retiredKind` failure isolated via `git stash`, confirmed identical on `HEAD` before this phase) + 25/26 (same pre-existing failure)
- [x] T012 `validate_document.py` on every markdown file under `cli-cursor/` → all VALID; `validate_skill_package.py` against the hub (default invocation) → 3/3 checks PASS
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T013 `validate.sh 008-cursor-model-allowlist --strict` passes 0/0; SC-001..SC-005 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Hardens phase 002's executor wiring and phase 003's skill-doc surface.
- Structural precedent: this packet's own phase 003/007 compiled-routing hash fix pattern.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
