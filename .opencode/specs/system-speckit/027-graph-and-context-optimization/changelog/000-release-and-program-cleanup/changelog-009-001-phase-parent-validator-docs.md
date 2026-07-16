---
title: "Phase Parent Lean Trio: Validator and Documentation"
description: "Phase-parent spec folders now require only the lean trio. The validator detects phase parents via shell and TypeScript helpers, short-circuits heavy-doc enforcement. A parity-tested cross-implementation detection contract shipped."
trigger_phrases:
  - "phase parent lean trio"
  - "is_phase_parent helper"
  - "phase parent validator branch"
  - "lean trio policy shipped"
  - "phase parent documentation sync"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/001-phase-parent-validator-docs` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation`

### Summary

Phase-parent spec folders accumulated stale `plan.md`, `tasks.md`, `checklist.md` and `implementation-summary.md` files at the parent level. Those files reflected a previous phase's state rather than the current one. AI agents resuming from that surface read hallucinated context as a result. The validator had no mechanism to distinguish a phase parent from a regular spec folder, so it applied level-N enforcement to folders that should only carry a lean trio of `spec.md`, `description.json` and `graph-metadata.json`.

Two detection helpers were shipped: `is_phase_parent()` in `shell-common.sh` and `isPhaseParent()` in `mcp_server/lib/spec/is-phase-parent.ts` with an ESM dist at `scripts/dist/spec/is-phase-parent.js`. Both agree on identical booleans across six test cases. The validator's `check-files.sh` and `check-level-match.sh` now take an early branch when `is_phase_parent()` returns true, removing six baseline error rules from existing phase parents and introducing zero new errors. CLAUDE.md, AGENTS.md and `system-spec-kit/SKILL.md` all document the new Phase Parent mode. Phase 1 shipped via cli-opencode. Phases 2 and 3 (graph-metadata schema additive accept-path and documentation sync) shipped natively.

### Added

- `is_phase_parent()` bash helper in `scripts/lib/shell-common.sh`, bash 3.2 compatible, matching child directories against `^[0-9]{3}-[a-z0-9-]+$` with `spec.md` or `description.json` present
- `isPhaseParent()` TypeScript source in `mcp_server/lib/spec/is-phase-parent.ts` (43 LOC) as the shared detection contract
- ESM dist at `scripts/dist/spec/is-phase-parent.js` with accompanying type declaration `is-phase-parent.d.ts`
- Cross-implementation parity test fixtures under `scripts/tests/fixtures/is-phase-parent/` (populated and mixed cases confirmed on disk. scaffolded-empty and support-folders-only deferred)
- Phase Parent row in the Level Guidelines table in `system-spec-kit/SKILL.md` plus a full Phase Parent Mode paragraph covering detection, content discipline, resume behavior and tolerant migration policy

### Changed

- `scripts/rules/check-files.sh` gains an early phase-parent branch (lines 39-55) that requires only `spec.md` at the parent level and returns pass with a "lean trio policy" message
- `scripts/rules/check-level-match.sh` gains an early phase-parent branch (lines 133-140) that skips level enforcement at phase parents and emits an info line
- `scripts/rules/check-graph-metadata.sh` updated to accept optional `derived.last_active_child_id` (string or null) and `derived.last_active_at` (string or null) without requiring them
- `CLAUDE.md` resume ladder gains a "Phase parent branch" step under the fallback ladder
- `AGENTS.md` Documentation Levels table gains the Phase Parent row and Phase Parent Mode block

### Fixed

- `validate.sh --strict` against `027-graph-and-context-optimization/` previously emitted six false-positive errors at the parent level (FILE_EXISTS, LEVEL_MATCH, ANCHORS_VALID, CANONICAL_SAVE_ROOT_SPEC_REQUIRED, EVIDENCE_MARKER_LINT, TEMPLATE_HEADERS). All six are now suppressed by the phase-parent detection branch with zero new errors introduced.
- AI resume from a phase parent previously read stale heavy-doc content. The lean trio policy removes those files from the required set so the parent surface cannot drift stale.

### Verification

| Check | Result |
|-------|--------|
| Cross-impl parity (shell `is_phase_parent` vs ESM `isPhaseParent`) on 6 cases (real 026, single-packet 010, 4 fixtures) | PASS. 6/6 identical booleans. |
| `validate.sh --strict` regression on `027-graph-and-context-optimization/` before and after patches | PASS. 6 baseline errors removed at parent (FILE_EXISTS, LEVEL_MATCH, ANCHORS_VALID, CANONICAL_SAVE_ROOT_SPEC_REQUIRED, EVIDENCE_MARKER_LINT, TEMPLATE_HEADERS). 0 new errors introduced. |
| `check-graph-metadata.sh` schema check on existing 026 `graph-metadata.json` | PASS. Additive fields do not break existing validation. |
| `check-files.sh` phase-parent fixture detection | PASS. Emits "Phase parent: spec.md present (lean trio policy)" for the populated fixture. |
| AGENTS sync triad invariant (root AGENTS.md carries Phase Parent Mode) | PASS. `grep "Phase Parent Mode"` matches in AGENTS.md. Note: AGENTS_Barter.md and AGENTS_example_fs_enterprises.md are not present on disk at time of changelog authoring. |
| Tasks.md P0 completion (T001-T009, T011, T019, T021-T026 verified with evidence) | PASS. All P0 tasks marked `[x]`. T010/T012-T018/T020/T027-T028 marked `[D]` (deferred) with rationale. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh` | Modified | Added `is_phase_parent()` helper, bash 3.2 compatible |
| `.opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts` | Created (NEW) | TS source for `isPhaseParent()`. Single detection contract for both runtimes. |
| `.opencode/skills/system-spec-kit/scripts/dist/spec/is-phase-parent.js` | Created (NEW) | ESM dist. Rewritten from CJS after `scripts/package.json` `"type": "module"` conflict. |
| `.opencode/skills/system-spec-kit/scripts/dist/spec/is-phase-parent.d.ts` | Created (NEW) | Type declarations for the ESM dist |
| `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh` | Modified | Phase-parent early branch. Requires only `spec.md` at the parent level. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh` | Modified | Phase-parent early branch. Skips level enforcement. Emits info. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh` | Modified | Accepts optional `last_active_child_id` and `last_active_at` fields |
| `.opencode/skills/system-spec-kit/scripts/tests/fixtures/is-phase-parent/` | Created (NEW) | Detection test fixtures. Populated and mixed cases present on disk. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | Phase Parent row in Level Guidelines table. Full Phase Parent Mode paragraph added. |
| `CLAUDE.md` | Modified | Resume fallback ladder gains Phase parent branch step |
| `AGENTS.md` | Modified | Documentation Levels table gains Phase Parent row and Phase Parent Mode block |

### Follow-Ups

- Author `templates/phase_parent/spec.md` with content-discipline comment listing FORBIDDEN merge/migration narrative tokens. The file does not exist on disk at time of changelog authoring despite being listed as Created in the implementation summary.
- Add the scaffolded-empty and support-folders-only test fixtures to complete the four-case fixture set. Only populated and mixed exist on disk.
- Implement pointer-write generator branch to populate `derived.last_active_child_id` in `graph-metadata.json` on save. Schema already accepts the field. Resume already handles phase parents via filesystem listing.
- Sync AGENTS_Barter.md and AGENTS_example_fs_enterprises.md with the Phase Parent Mode block once those files are re-created or confirmed at a new path.
- Add soft-deprecation warning for legacy phase parents that retain heavy docs. Tolerant policy preserves them today. A follow-on `migrate-phase-parent.sh` or validator warning can prompt cleanup.
