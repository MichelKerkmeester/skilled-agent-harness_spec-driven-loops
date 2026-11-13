---
title: "Feature Specification: Phase 4: archive-search-and-json"
description: "Search skips z_archive at every depth, recursive validation never enters it, and archived JSON metadata carries stale records. This phase adds an opt-in archive mode to search and validation and repairs the archived metadata, with the default behavior unchanged."
trigger_phrases:
  - "archive search and json"
  - "phase 4 archive search and json"
  - "include-archive search mode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: archive-search-and-json

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/364-subtrack-proposal-archive-reach` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-subtrack-archive-and-numbering |
| **Successor** | 005-tests-and-closeout |
| **Handoff Criteria** | `--include-archive` returns archived hits in search and descends in recursive validation, and `generate-trigger-index.mjs --check` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: An opt-in archive mode in the ripgrep search lane and in `validate.sh --recursive`, one metadata repair pass over archives and the comments that misdescribe the description cache. The default search, the trigger index and CI do not change.

**Dependencies**:
- Phase 003, so every declared subtrack has a `z_archive/` to search and validate
- `repair-derived.cjs --roots`, which already walks archived packets
- The command that regenerates `specs/descriptions.json`, identified in phase 001 task T002

**Deliverables**:
- `--include-archive` in `rg-wrapper.mjs` and `rg-lane.mjs`, with an `archived` label and a JSON lane
- `validate.sh --recursive --include-archive`
- Archived `parent_id` records repaired and `specs/descriptions.json` regenerated
- Corrected comments and docs about archives in the description cache
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An archived packet cannot be found or checked with the standard tools. Both ripgrep recipe files carry the glob `!**/z_archive/**`, and `validate.sh --recursive` only globs `[0-9][0-9][0-9]-*/`, so it never enters an archive. The approved plan also records 35 archived packets with a stale `parent_id` and 1,334 rows in `specs/descriptions.json` for folders that no longer exist. Those two counts were not re-measured for this spec, and tasks T001 and T002 measure them before the first edit.

### Purpose
An operator can search and validate archives on request at track, subtrack and phase depth, and archived metadata is correct, while every default path behaves as it does today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n "z_archive" .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs
.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:97:  '--glob', '!**/z_archive/**',
.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:54:  '--glob', '!**/z_archive/**',
$ grep -c "include-archive" .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an `--include-archive` mode to `rg-wrapper.mjs` and `rg-lane.mjs` that drops the `!**/z_archive/**` glob and labels each archived hit `archived`.
- Add a JSON lane that searches `description.json` and `graph-metadata.json` under archives.
- Add `--include-archive` to `validate.sh --recursive` so it descends into `z_archive` at track, subtrack and phase depth.
- Run one `repair-derived.cjs --roots` pass over archives, regenerate `specs/descriptions.json` and make `archive.sh` refresh it after each move.
- Document the mode in `/speckit:search` and `retrieval-conventions.md`, and correct the comments that say archives are excluded from the description cache.

### Out of Scope
- A committed archive index - the operator chose live search.
- Any change to the default search, the trigger index walker in `retrieval/lib/corpus.mjs` or CI - the mode is opt-in.
- Archives in resume - resume keeps excluding them.
- Recursive validation reaching phase children from a track root - the parent spec excludes it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Modify | `GLOBS` at lines 95 to 101 loses the archive glob under `--include-archive`. Hits gain the `archived` label. JSON lane |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs` | Modify | `GLOBS` at lines 52 to 58, same mode |
| `.skilled/commands/speckit/search.md` | Modify | Documents the mode and one recipe |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Documents the mode beside the glob rules at lines 83 and 250 and the coverage row at line 315 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | Flag parsing near line 102 and `collect_phase_dirs` at lines 348 to 393 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | `archive_spec` and `restore_spec` refresh `specs/descriptions.json` after the move |
| `specs/**/z_archive/*/graph-metadata.json` | Modify | Written only by `repair-derived.cjs --roots <archive> --apply` |
| `specs/descriptions.json` | Modify | Regenerated by its producer, never by hand |
| `.skilled/skills/system-spec-kit/runtime/lib/search/folder-discovery.ts` | Modify | Doc comment at lines 469 to 475 |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Lines 49 and 206 |
| `.skilled/skills/system-spec-kit/runtime/lib/search/README.md` | Modify | Line 150 |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Comment at lines 1290 to 1292 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `rg-wrapper.mjs` with `--include-archive` returns hits under `z_archive` at any depth, and each such hit carries the label `archived` |
| REQ-002 | Without the flag, `rg-wrapper.mjs` and `rg-lane.mjs` build the same argument vector as before this phase, and `generate-trigger-index.mjs --check` exits 0 |
| REQ-003 | With `--include-archive`, a JSON lane in `rg-wrapper.mjs` searches `description.json` and `graph-metadata.json` under archives |
| REQ-004 | `validate.sh <folder> --recursive --include-archive` validates the packets in `z_archive/` beside a track's packets, a subtrack's packets and a phase parent's phases. Without the flag it visits the same folders as today |
| REQ-005 | After `repair-derived.cjs --roots <archive> --apply` over every archive, no packet that sits directly in a `z_archive/` records a non-null `parent_id` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `specs/descriptions.json` holds no row for a folder that is missing on disk, and `archive.sh` refreshes it after an archive and after a restore |
| REQ-007 | `.skilled/commands/speckit/search.md` and `retrieval-conventions.md` document `--include-archive` with one recipe, and state that resume excludes archives |
| REQ-008 | The comments in `folder-discovery.ts`, `ENV-REFERENCE.md`, `runtime/lib/search/README.md` and `orchestrator.ts` say that `z_archive` stays in the description cache and that an archived packet is re-derived |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A phrase that lives only under `specs/sk-doc/z_archive/` returns at least one hit labeled `archived` with `--include-archive` and no hit without it.
- **SC-002**: `generate-trigger-index.mjs --check` exits 0 after the phase, so the committed index is byte-identical.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The producer of `specs/descriptions.json` | REQ-006 cannot close without the command | Phase 001 task T002 names it. Until then REQ-006 is blocked, not guessed |
| Risk | The default recipe changes by accident | High: every search and Gate 1 lookup shifts | Keep the frozen `GLOBS` constant and build the archive variant from it. Assert the default vector in a test |
| Risk | Recursive archive validation fails on old packets and floods the report | Med: thousands of archived docs predate current rules | The flag is opt-in and its failures never run in CI |
| Risk | The repair pass rewrites more than `parent_id` in archives | Med: a large diff in frozen packets | Run the dry run first and read the planned writes before `--apply` |
<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A default search runs the same ripgrep argument vector as before, so its cost does not change.

### Security
- **NFR-S01**: The archive mode adds no search root. It only removes one exclusion glob inside `specs` and `.skilled`.

### Reliability
- **NFR-R01**: A second `repair-derived.cjs --roots <archive> --apply` run exits 0 and writes nothing.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty `z_archive/` that holds only `.gitkeep` adds no folder to a recursive run and no hit to a search.
- Maximum input: the archives hold about 18,000 markdown files, and `--include-archive` searches them with one ripgrep call.
- Failure path: `--include-archive` without `--recursive` on `validate.sh` exits 2 with usage.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Four scripts, two docs, four comment fixes and two data refreshes |
| Risk | 14/25 | The default search path is shared by Gate 1 |
| Research | 8/20 | The description cache producer is not yet named |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- UNKNOWN: which command regenerates `specs/descriptions.json`. Phase 001 task T002 resolves it, and REQ-006 waits for that answer.
- The findings point at `folder-discovery.ts` lines 470 to 486. The misleading doc comment is at lines 469 to 475, and lines 485 to 487 route through `index-scope.ts`, which keeps `z_archive` on purpose. Only the doc comment is planned to change.
<!-- /ANCHOR:questions -->

---
