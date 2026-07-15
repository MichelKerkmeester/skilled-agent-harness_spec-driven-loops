---
title: "Phase Parent Generator Pointer + Polish"
description: "Generator now writes a last_active_child_id pointer when saving against a phase parent or one of its children. Resume honors a fresh pointer first and falls back to listing. create.sh --phase ships the lean parent template by default. A content-discipline validator warns when a phase-parent spec drifts into merge narrative."
trigger_phrases:
  - "phase parent generator pointer"
  - "last active child id pointer"
  - "lean phase parent create.sh"
  - "phase parent pointer bubble up"
  - "check-phase-parent-content validator"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/002-phase-parent-generator-pointer-polish` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation`

### Summary

Before this phase, `/spec_kit:resume` on a phase parent always walked the filesystem to list children. `create.sh --phase` scaffolded the parent with a full level-N template plus a phase-parent addendum, leaving vestigial heavy docs behind. There was no automated check to warn a reviewer when a phase-parent `spec.md` slipped into merge or migration narrative.

This phase shipped four core deliverables. First, `generate-context.ts` gained an `updatePhaseParentPointersAfterSave` helper that writes `derived.last_active_child_id` and `derived.last_active_at` into the parent's `graph-metadata.json` on every save, whether the target is the parent itself or one of its direct children. Second, `create.sh --phase` now copies `templates/phase_parent/spec.md` for the parent scaffold so new decompositions land with the lean trio by default. Third, `resume.md` and its paired YAML assets gained pointer-first redirect logic with a 24-hour staleness window and a `--no-redirect` bypass. Fourth, `check-phase-parent-content.sh` shipped as a severity-warn validator that scans for forbidden narrative tokens such as `consolidat*`, `merged from`, `renamed from` or `X->Y` arrow patterns.

All 18 tasks passed. Four vitest fixtures cover the pointer-write, child bubble-up, atomic consistency and non-phase no-op cases. A real round-trip trace lives at `scratch/e2e-trace.txt`.

### Added

- `updatePhaseParentPointersAfterSave` helper in `generate-context.ts` that writes pointer fields to the phase parent on every save
- `atomicWriteJson` helper in `generate-context.ts` using same-dir temp file plus `fs.renameSync` to prevent torn writes
- `scripts/spec/is-phase-parent.ts` as the ESM source under the scripts package, paired with the existing mcp_server CJS twin for tsc-rebuildable dist
- `templates/context-index.md` migration-bridge template (optional, never auto-scaffolded) with Author Instructions on when to use it
- `scripts/rules/check-phase-parent-content.sh` token-scan validator with code-fence awareness registered as `PHASE_PARENT_CONTENT` at severity warn
- `scripts/tests/phase-parent-pointer.vitest.ts` with 4 fixtures: parent pointer write, child bubble-up, concurrent atomic consistency, non-phase no-op

### Changed

- `generate-context.ts`: phase-parent save branch writes `derived.last_active_child_id = null` and stamps `derived.last_active_at` with the current ISO-8601 timestamp
- `generate-context.ts`: child-save bubble-up branch reads the child's `packet_id` and writes it to the parent's `derived.last_active_child_id`
- `scripts/spec/create.sh`: `--phase` parent path now copies `templates/phase_parent/spec.md` and fills feature-name and phase-map placeholders instead of scaffolding level-N heavy docs
- `commands/speckit/resume.md` step 3b: pointer-first redirect fires when the pointer is non-null and within 24 hours. Stale or missing pointers fall back to listing. `--no-redirect` bypasses the redirect entirely.
- `commands/speckit/assets/spec_kit_resume_auto.yaml` and `speckit_resume_confirm.yaml`: both mirror the pointer-first and fallback logic from `resume.md`
- `references/hooks/skill-advisor-hook.md`: brief assembler now surfaces the active child when the parent pointer is fresh
- `templates/resource-map.md` Author Instructions: `Scope shape` section sharpened to require picking one mode at phase parents (parent-aggregate OR per-child, not both)
- `scripts/lib/validator-registry.json`: `PHASE_PARENT_CONTENT` rule registered with `severity: warn`

### Fixed

- Phase-parent `graph-metadata.json` had no record of which child was most recently active. The pointer-write and bubble-up logic closes this gap so resume can skip the directory listing on a fresh save.
- `create.sh --phase` left vestigial `plan.md`, `tasks.md` and `checklist.md` at the parent level. The template swap ensures new decompositions land with the lean trio only.
- Torn-write risk on concurrent saves to `graph-metadata.json` is now prevented by the atomic temp-file rename strategy.

### Verification

| Check | Result |
|-------|--------|
| `cd scripts && npx tsc --build` | PASS. TypeScript build clean, dist regenerated. |
| `vitest run scripts/tests/phase-parent-pointer.vitest.ts` | PASS. 4/4 tests: parent pointer write, child bubble-up, concurrent atomic consistency, non-phase no-op. |
| `bash -n create.sh && bash -n check-phase-parent-content.sh` | PASS. Shell syntax checks clean. |
| `create.sh --phase --phases 2 --level 2 --skip-branch` (tmp fixture) | PASS. Parent contains only `{spec.md, description.json, graph-metadata.json}` plus child folders. Children retain Level 1 docs. |
| Manual E2E generator save + pointer resume | PASS. Saved against child, parent pointer populated with child packet_id and fresh timestamp, resume simulation returned `{redirected: true, fresh: true}`. Trace at `scratch/e2e-trace.txt`. |
| `validate.sh --strict` against `002-phase-parent-generator-pointer-polish/` | 2 errors, 1 warning (same baseline residuals as 001: SPEC_DOC_INTEGRITY 25 forward refs, TEMPLATE_HEADERS 1 non-blocking). All other rules PASS including ANCHORS_VALID, EVIDENCE_CITED, GRAPH_METADATA_PRESENT, PHASE_PARENT_CONTENT correctly skipped at child level. |
| `validate.sh --strict` regression on `002-graph-and-context-optimization/` | PASS. No new error class introduced. Only legacy baseline errors and new advisory PHASE_PARENT_CONTENT warns appear. |
| Codex stdout JSON summary | `ready_for_summary: true`, `tasks_completed: [T001..T018]`, `tasks_blocked: []`, `blocking_issues: []` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modified | `isPhaseParent` import. `updatePhaseParentPointersAfterSave` and `atomicWriteJson` helpers added. Pointer-write at parent saves and bubble-up at child saves. |
| `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts` (NEW) | Created | ESM source under the `"type":"module"` scripts package. Pairs with the existing mcp_server CJS twin so `tsc --build` produces a rebuildable dist. |
| `.opencode/skills/system-spec-kit/scripts/dist/spec/is-phase-parent.js` | Rebuilt | tsc-emitted ESM dist with source map. Replaces the hand-rolled fallback from phase 001. |
| `.opencode/skills/system-spec-kit/scripts/tsconfig.json` | Modified | Added `scripts/spec` to includes so the new ESM source is compiled. |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modified | `--phase` parent path copies `templates/phase_parent/spec.md` and fills placeholders. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-phase-parent-content.sh` (NEW) | Created | P2 token-scan validator with code-fence awareness. |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | Registered `PHASE_PARENT_CONTENT` rule at severity warn. |
| `.opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts` (NEW) | Created | 4 vitest fixtures: parent pointer write, child bubble-up, concurrent atomic, non-phase no-op. |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modified | Brief assembler honors phase-parent redirect when the pointer is fresh. |
| `.opencode/commands/speckit/resume.md` | Modified | Pointer-first redirect with stale-pointer fallback and `--no-redirect` bypass at step 3b. |
| `.opencode/commands/speckit/assets/speckit_resume_auto.yaml` | Modified | Mirrors `resume.md` pointer-first and fallback logic. |
| `.opencode/commands/speckit/assets/speckit_resume_confirm.yaml` | Modified | Mirrors `resume.md` pointer-first and fallback logic. |

### Follow-Ups

- Voyage embedding network failures during the e2e test were transient Voyage API glitches, not a generator regression. Saves succeeded with deferred indexing. BM25/FTS5 search remains available and embeddings hydrate on the next online save.
- Concurrent-save guarantee is eventual consistency, not linearizable. Two children saving simultaneously produce a parent pointer reflecting whichever rename completed last. The 24-hour staleness window and list-fallback in resume absorb this edge case.
- `PHASE_PARENT_CONTENT` validator is heuristic. Token scan catches common drift but will not flag novel narrative phrasings that fall outside the literal token list. Reviewer judgment remains the primary line of defense.
- `check-anchors.sh`, `check-section-counts.sh` and `check-template-headers.sh` still expect the full Level-2 anchor set on a lean parent. This produces non-blocking errors. A follow-on should extend the phase-parent branch to those three rules.
- No follow-on packet yet for soft deprecation of legacy heavy docs at phase parents. Tolerant policy preserves them. A future packet could introduce an opt-in `migrate-phase-parent.sh` once the lean policy stabilizes.
