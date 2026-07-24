---
title: "Implementation Plan: cli-cursor enforced model allowlist"
description: "Plan for restricting cli-cursor dispatch to a 10-id allowlist (Composer 2.5, Grok 4.5, GLM 5.2), enforced at the runtime dispatch layer plus documented across all skill-doc surfaces."
trigger_phrases: ["cli-cursor model allowlist plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/008-cursor-model-allowlist"
    last_updated_at: "2026-07-24T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete; allowlist enforced and live-tested"
    next_safe_action: "Write implementation-summary.md, run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-allowlist-implementation", parent_session_id: null }
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-cursor enforced model allowlist

<!-- ANCHOR:summary -->
## 1. SUMMARY
Replace `executor-config.ts`'s permissive `CURSOR_SUPPORTED_MODELS` reference list with a hard 10-id allowlist (Composer 2.5 x2, Grok 4.5 x6, GLM 5.2 x2), enforce it with a fail-closed check at both runtime dispatch entry points (`fanout-run.cjs`, `dispatch-model.cjs`), change the default model from `auto` to `composer-2.5`, update the affected tests, and rewrite every cli-cursor skill-doc surface that described the old unrestricted roster.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] `CURSOR_SUPPORTED_MODELS` is exactly the 10 confirmed ids; `auto` excluded.
- [x] Both `fanout-run.cjs` and `dispatch-model.cjs` hard-reject a non-allowlisted model before constructing a command.
- [x] All 3 affected test suites pass with zero new regressions.
- [x] Every skill-doc surface describing `auto`-as-default or the unrestricted roster is rewritten.
- [x] Hub compiled-routing manifest is fresh after the `SKILL.md` edit.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Enforcement lives at the dispatch-command-construction layer, not the generic `parseExecutorConfig` schema (which stays a free-form string across all executor kinds, matching every other executor). `executor-config.ts` exports the canonical allowlist (`CURSOR_SUPPORTED_MODELS`), a default (`CURSOR_DEFAULT_MODEL`), and a predicate (`isCursorModelAllowed`) for TypeScript consumers/tests. `fanout-run.cjs` and `dispatch-model.cjs` each duplicate the allowlist as a plain JS `Set` literal (matching this codebase's established pattern of hand-duplicating small per-kind cursor facts across these two `.cjs` files, since threading an async dynamic import into a synchronous, directly-unit-tested builder function would be a larger and riskier change) and reject before constructing any `cursor-agent` args.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `executor-config.ts` | Model reference list | Harden to enforced allowlist + default + predicate | Typecheck + new unit tests |
| `fanout-run.cjs` | Orchestrated dispatch builder | Add fail-closed model check | `fanout-run.vitest.ts` |
| `dispatch-model.cjs` | Model-benchmark dispatch builder | Add fail-closed model check | `remediation.vitest.ts` |
| `cli-cursor/**` skill docs | Model-selection guidance | Rewrite to describe only the allowlist | `validate_document.py` on every file |
| Hub compiled-routing manifest | Routing bookkeeping | Realign pinned hash | `compiled-route-manifest.cjs freshness` |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Live-confirmed exact ids via `cursor-agent --list-models | grep -iE "grok|glm|composer"` (6 Grok + 2 Composer + 2 GLM = 10).
- [x] Traced `CURSOR_SUPPORTED_MODELS`'s only 2 real consumption points (`fanout-run.cjs`, `dispatch-model.cjs`) and confirmed neither is wired into the generic zod schema.

### Phase 2: Core Implementation
- [x] Hardened `executor-config.ts`'s allowlist + added `CURSOR_DEFAULT_MODEL`/`isCursorModelAllowed`.
- [x] Added the fail-closed check + new default to `buildCursorLineageCommand` (fanout-run.cjs) and the cli-cursor case of `buildSpawnSpec` (dispatch-model.cjs).
- [x] Updated 3 test files: `executor-config.vitest.ts` (+3 new tests), `fanout-run.vitest.ts` (2 tests fixed, 2 new tests added), `remediation.vitest.ts` (2 fixture fixes, 1 new rejection test).
- [x] Rewrote all cli-cursor skill-doc model-selection content (`SKILL.md`, `cli-reference.md`, `integration-patterns.md`, `agent-delegation.md`, `README.md`, `assets/prompt-templates.md`, `assets/prompt-quality-card.md`, manual-testing-playbook root + `CU-001`).
- [x] Realigned the hub's compiled-routing manifest hash.

### Phase 3: Verification
- [x] `npm run typecheck` on the runtime package — 0 errors.
- [x] `npx vitest run` on all 3 affected test files — 0 new regressions (1 pre-existing, unrelated `retiredKind` failure confirmed via isolation).
- [x] `validate_document.py` on every modified cli-cursor markdown file — all VALID.
- [x] `validate_skill_package.py` against the hub — 0 fails.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Unit tests at both runtime dispatch entry points assert (a) every allowlisted id is accepted and produces the expected `--model <id>` arg, (b) `auto` and out-of-roster ids throw with a message naming the allowlist, (c) an omitted model defaults to `composer-2.5`. Pre-existing coverage (approval-mode mapping, binary-availability fail-closed, variant/reasoning-effort omission) is preserved by swapping stale `'auto'`/`'m'` fixtures for a real allowlisted id rather than changing assertions. Documentation correctness is checked via `validate_document.py` (structural) and a targeted `grep` sweep for any remaining `auto`-as-default claim (content).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 002 (executor support) | Internal | Green (committed `ecd91d3373`) | `CURSOR_SUPPORTED_MODELS`/`buildCursorLineageCommand` must exist to harden |
| Phase 003 (skill packet) | Internal | Green (committed `11024cc893`) | `SKILL.md`/`cli-reference.md` must exist to rewrite |
| `cursor-agent --list-models` (authenticated) | External | Green — account authenticated this session | Exact id confirmation for the allowlist |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert `CURSOR_SUPPORTED_MODELS` to the phase-002 3-id reference list and remove the fail-closed checks in both dispatch builders via `git checkout` of the 3 runtime files; revert the skill-doc rewrites via `git checkout` of the `cli-cursor/` tree. No data migration; fully reversible.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Extends the completed `030-cli-cursor-creation` packet (phases 001-007); depends on phases 002 and 003 for the surfaces it hardens.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup (live model confirmation) | Low | 15 min |
| Core implementation | Medium | 2-3 hours (3 code files + 3 test files + ~10 doc files) |
| Verification | Low | 30 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Additive gate on an existing dispatch path plus a doc rewrite — low blast radius, fully reversible via `git checkout` of the affected files. No runtime data or persisted state is touched.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `../002-deep-loop-executor-support/plan.md` (original executor-wiring precedent this phase hardens)
