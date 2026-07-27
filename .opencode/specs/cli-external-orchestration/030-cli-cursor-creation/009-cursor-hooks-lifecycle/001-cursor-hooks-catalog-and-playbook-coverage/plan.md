---
title: "Implementation Plan: cli-cursor hooks feature-catalog + playbook coverage"
description: "Plan for adding a feature-catalog entry and playbook coverage for all 5 cli-cursor hook adapters, authored via sk-doc's official sub-skill contracts, executed by dispatched LUNA (gpt-5.6-luna via cli-codex) xhigh-fast agents."
trigger_phrases: ["cli-cursor hooks catalog plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/001-cursor-hooks-catalog-and-playbook-coverage"
    last_updated_at: "2026-07-24T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete; both LUNA dispatches verified"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-catalog-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-cursor hooks feature-catalog + playbook coverage

<!-- ANCHOR:summary -->
## 1. SUMMARY
Add a new hook/spec-gate feature category to the hub-level feature catalog and extend the manual-testing-playbook's `hooks/` category so every cli-cursor hook adapter file (5 total, including the newly-appeared, unreviewed `spec-gate-prebind.mjs`) is named with an accurate delivery/review-status label. Author both per `sk-doc`'s `create-feature-catalog` and `create-manual-testing-playbook` contracts, executed by dispatched `gpt-5.6-luna` (`cli-codex`, `xhigh` effort, `service_tier="fast"`) agents.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] All 5 hook adapter files named with source anchors in the feature catalog.
- [x] All 5 hook adapter files named in the playbook's `hooks/` category.
- [x] `spec-gate-prebind.mjs` explicitly labeled unreviewed/uncommitted, never presented as confirmed-working.
- [x] Both docs authored per their sk-doc sub-skill's exact package contract.
- [x] `validate_document.py` clean on all new/modified files; whole packet `validate.sh --recursive --strict` 0/0.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Two independent doc packages, each following its own sk-doc sub-skill's canonical shape. Feature catalog: a new category folder + per-feature file(s) under `cli-external-orchestration/feature-catalog/`, added as a new root-catalog H2 section pointing to it — mirrors the existing `cli-executor-dispatch-routing/` and `compiled-routing-and-legacy-fallback/` categories exactly. Playbook: extend the existing `hooks/` category (2 files, `CU-013`/`CU-014`) in place where the adapter fits an existing scenario's scope, or add a new `CU-020` file when a hook doesn't fit either existing scenario's contract (decided in Phase 1 below, before authoring). No spec-kit metadata (`graph-metadata.json`) is added to either package — both are sk-doc-owned document types, not spec folders.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `cli-external-orchestration/feature-catalog/feature-catalog.md` | Hub routing-only catalog | Add a new H2 category | `validate_document.py` |
| `cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/` (new) | (new) hook feature detail | Create per-feature file(s) | `validate_document.py` |
| `cli-cursor/manual-testing-playbook/hooks/{confirmed-fires-smoke-test.md,confirmed-non-delivery-documentation.md}` | Existing playbook scenarios | Extend with all-5-adapter mentions | `validate_document.py` + manual review |
| `cli-cursor/manual-testing-playbook/hooks/*.md` (possible new `CU-020`) | — | Create if extension is insufficient | `validate_document.py` |
| `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` | Root playbook index | Update hooks summary + cross-reference index if `CU-020` added | `validate_document.py` |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read `spec-gate-prebind.mjs` fresh — confirmed unchanged (3261 bytes, same timestamp) and still uncommitted.
- [x] Decided: added a new `CU-020` (documentation-only, SKIP-by-default) rather than extending `CU-013`/`CU-014` in place.
- [x] Confirmed feature-catalog placement — hub-level, extending the existing single catalog.

### Phase 2: Core Implementation (dispatched to LUNA)
- [x] Read `cli-codex/SKILL.md` in full (392 lines) before composing either dispatch prompt.
- [x] Dispatched `gpt-5.6-luna` (`cli-codex`, `xhigh` effort, `service_tier="fast"`) to author the feature-catalog category + per-feature file, briefed on all 5 adapters' exact status.
- [x] Dispatched a second `gpt-5.6-luna` (same effort/tier, sequential per single-dispatch discipline) to extend the playbook's `hooks/` category with new `CU-020`.
- [x] Independently re-verified both agents' output by direct file read before accepting either as done.

### Phase 3: Verification
- [x] Ran `validate_document.py` on all 4 new/modified files — all `✅ VALID`.
- [x] Grep sweep: all 5 adapter files named in both docs; `spec-gate-prebind.mjs` hedged 21/21 times, 0 unhedged mentions.
- [x] Ran `validate.sh 030-cli-cursor-creation --recursive --strict` — `10 RESULT: PASSED`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Structural validation via each sk-doc sub-skill's own validator (`validate_document.py`, run from repo root per each contract's documented invocation). Content correctness via a targeted grep sweep for all 5 adapter filenames across both docs, plus manual confirmation that `spec-gate-prebind.mjs` is never described using confirmed-working language (no "wired", "live-verified", "confirmed fires" applied to it — only "built", "uncommitted", "unreviewed", "authored by a concurrent session"). No runtime code is touched, so no vitest coverage applies.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 004 (hook adapter layer) | Internal | Green (committed `5bd90b42c1`) | Source of the 4 confirmed adapters + event-delivery table |
| Phase 006 (manual-testing playbook) | Internal | Green (committed `78ab7a573d`/`4b6bf6fc10`) | The `hooks/` category this phase extends |
| `spec-gate-prebind.mjs` | External (concurrent session) | Yellow — still uncommitted, unreviewed (confirmed unchanged at implementation time) | Documented with explicit hedging; 21 hedged mentions across both new docs |
| `gpt-5.6-luna` via `cli-codex` | External | Green — documented in `cli-codex/SKILL.md`'s model table | Dispatch mechanism for Phase 2 |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert the feature-catalog category folder and the modified playbook files via `git checkout` of the specific paths. Docs-only; no runtime code touched; fully reversible.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Extends the completed `030-cli-cursor-creation` packet (phases 004 and 006 specifically); independent of phase 008 (model allowlist).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup (re-check + decide) | Low | 15 min |
| Core implementation (2 LUNA dispatches) | Medium | 1-2 hours incl. independent re-verification |
| Verification | Low | 20 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Additive, docs-only, low-blast: one new feature-catalog category + edits to 2-3 existing playbook files, all reversible via `git checkout`. No data migration.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `.opencode/skills/sk-doc/create-feature-catalog/SKILL.md`, `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` (authoring contracts)
