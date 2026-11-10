---
title: "Tasks: Phase 8: track-subtrack-regrouping"
description: "Ordered per-track regrouping tasks for the ten approved maps, with metadata refresh, three pre-commit gates, one commit per track, and a final trigger-index rebuild."
trigger_phrases:
  - "track subtrack regrouping tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: track-subtrack-regrouping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

Before running each task, set `C=.skilled/skills/system-spec-kit/runtime/cli` and `T=specs/<track>` for the current track.
Use the approved map for each track. `T` changes between track tasks.

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Record the operator-provided 2026-11-10 validation and link baseline in `spec.md`. Verify: `rg -n 'Baseline captured 2026-11-10|14509 links|2 failed folders' spec.md` prints the baseline details.
- [ ] T002 Record the ten approved tracks, 40 subtracks, about 175 packet moves, pinned paths, and seven flat tracks in `spec.md`. Verify: `rg -n '10 qualifying tracks|40 subtracks|about 175|028-sweet-search-integration|019-surface-consistency-research' spec.md` prints the approved scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T003 Apply the approved map to `hooks-plugins-extensions`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep `028-sweet-search-integration` pinned. (`specs/hooks-plugins-extensions/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/hooks-plugins-extensions --apply` complete for this track.
- [ ] T004 Apply the approved map to `system-speckit`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep all `z_archive/` contents in place. (`specs/system-speckit/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/system-speckit --apply` complete for this track.
- [ ] T005 Apply the approved map to `sk-code`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep `019-surface-consistency-research` pinned. (`specs/sk-code/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/sk-code --apply` complete for this track.
- [ ] T006 Apply the approved map to `sk-doc`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep all `z_archive/` contents in place. (`specs/sk-doc/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/sk-doc --apply` complete for this track.
- [ ] T007 Apply the approved map to `sk-git`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep all `z_archive/` contents in place. (`specs/sk-git/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/sk-git --apply` complete for this track.
- [ ] T008 Apply the approved map to `system-skill-advisor`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep all `z_archive/` contents in place. (`specs/system-skill-advisor/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/system-skill-advisor --apply` complete for this track.
- [ ] T009 Apply the approved map to `agents-md`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep all `z_archive/` contents in place. (`specs/agents-md/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/agents-md --apply` complete for this track.
- [ ] T010 Apply the approved map to `cli-external-orchestration`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep all `z_archive/` contents in place. (`specs/cli-external-orchestration/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/cli-external-orchestration --apply` complete for this track.
- [ ] T011 Apply the approved map to `system-deep-loop`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep all `z_archive/` contents in place. (`specs/system-deep-loop/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/system-deep-loop --apply` complete for this track.
- [ ] T012 Apply the approved map to `mcp-tooling`. Move each assigned active packet to its one-level named subtrack using numbering from 001 in original order and preserving its slug, create each mapped `description.json`, update live locators and track-root metadata, and leave the specified exceptions in place. Keep all `z_archive/` contents in place. (`specs/mcp-tooling/`). Verify: `node $C/spec/refresh-track-roots.mjs --apply` and `node $C/spec/repair-derived.cjs --roots specs/mcp-tooling --apply` complete for this track.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T013 Run the three pre-commit gates for `hooks-plugins-extensions` and create its one commit only after all three pass (`specs/hooks-plugins-extensions/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T014 Run the three pre-commit gates for `system-speckit` and create its one commit only after all three pass (`specs/system-speckit/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T015 Run the three pre-commit gates for `sk-code` and create its one commit only after all three pass (`specs/sk-code/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T016 Run the three pre-commit gates for `sk-doc` and create its one commit only after all three pass (`specs/sk-doc/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T017 Run the three pre-commit gates for `sk-git` and create its one commit only after all three pass (`specs/sk-git/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T018 Run the three pre-commit gates for `system-skill-advisor` and create its one commit only after all three pass (`specs/system-skill-advisor/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T019 Run the three pre-commit gates for `agents-md` and create its one commit only after all three pass (`specs/agents-md/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T020 Run the three pre-commit gates for `cli-external-orchestration` and create its one commit only after all three pass (`specs/cli-external-orchestration/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T021 Run the three pre-commit gates for `system-deep-loop` and create its one commit only after all three pass (`specs/system-deep-loop/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T022 Run the three pre-commit gates for `mcp-tooling` and create its one commit only after all three pass (`specs/mcp-tooling/`). Verify: `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`, `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than this track's baseline, and `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] T023 Rebuild the generated trigger index after all ten track changes (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` runs after all ten tracks. Record its actual output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] Every planned task has recorded verification evidence.
- [ ] No `[B]` blocked tasks remain.
- [ ] Manual comparison confirms each track tree against its approved map and all per-track gates pass.
- [ ] The trigger index is rebuilt after all ten track commits.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot create that track commit until complete |
| **[P1]** | Required | Must complete before commit or receive operator-approved deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] `rg -n 'REQ-00[1-5]' spec.md` prints the five requirements.
- [ ] CHK-002 [P0] `rg -n 'sweep-track-roots|validate.sh|check-markdown-links' plan.md` prints the three required gates.
- [ ] CHK-003 [P1] `rg -n 'Baseline captured 2026-11-10|40 subtracks|14509 links' spec.md` prints the approved baseline and map scope.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] Compare `rg --files $T` with the approved map and confirm each movable packet appears once at the mapped number and slug.
- [ ] CHK-011 [P0] Inspect every new `description.json` and confirm its `level` value is `sub-track`.
- [ ] CHK-012 [P1] `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match`.
- [ ] CHK-013 [P1] `node $C/check-markdown-links.cjs` reports 0 broken links after live locators are rewritten.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] `node $C/spec/sweep-track-roots.mjs --specs $T` prints `all track roots match` for each track before its commit.
- [ ] CHK-021 [P0] `bash $C/spec/validate.sh $T --recursive --strict` shows no more failed folders than that track's baseline.
- [ ] CHK-022 [P1] `node $C/check-markdown-links.cjs` reports 0 broken links.
- [ ] CHK-023 [P1] `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` runs after all ten tracks. Record its actual output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

N/A: This packet regroups approved layouts and does not fix a reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

N/A: The approved change adds no authentication, authorization, credential, or service-data surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `rg -n '10 qualifying tracks|40 subtracks|per-track gates' spec.md plan.md tasks.md acceptance-criteria.md` finds the same scope and gate terms in all four documents.
- [ ] CHK-041 [P1] `rg -n 'historical spec docs|changelogs|event streams' spec.md plan.md tasks.md acceptance-criteria.md` finds the same locator exception and historical-record exclusions.
- N/A: No README change is part of the approved file scope.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Compare `rg --files $T` with the approved map and confirm the new subtracks are one level below the track root with a `description.json`.
- [ ] CHK-051 [P1] Inspect the track tree against the map and confirm pinned packets and `z_archive/` remain outside the moves.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 0/6 |
| P1 Items | 9 | 0/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---



