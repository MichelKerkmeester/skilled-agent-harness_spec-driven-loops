---
title: "Feature Specification: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index"
description: "Spec-kit's track tooling stops one level below specs/, so packets filed in a named sub-track are skipped by track roots, refresh, the pre-push sweep, recursive validation and archive. This packet adds declared sub-tracks and three host-repository fixes Barter asked for."
trigger_phrases:
  - "named subtracks and host repos"
  - "named sub track support in spec kit plus"
  - "declared sub-track container"
  - "host repository trigger index mode"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A repository built on Skilled can file packets as `specs/<track>/<sub-track>/<NNN>-<slug>/`, and such a packet works on its own, but every tool that treats a track as a unit looks only one level below `specs/`. Track roots, refresh, the pre-push sweep, `create.sh`'s refresh, recursive validation and archive all skip the sub-track's packets, and validating the sub-track folder itself fails packet rules. Barter's phase 004, which groups tracks of 276 and 282 packets into sub-tracks, is on hold until this works.

### Purpose
A declared sub-track behaves like a track in every track-level tool, while flat tracks behave exactly as before.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ mkdir -p specs/demo/001-flat-probe specs/demo/sub/001-nested-probe   # in a scratch tree, demo/graph-metadata.json present
$ node .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs --specs <scratch>/specs --track demo/sub
refresh-track-roots: not a track root with graph-metadata.json: demo/sub
exit=2
$ node -e "...readWorkingTreeTracks('<scratch>/specs')..."
[{"name":"demo","children":["001-flat-probe"]}]
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recognize a declared sub-track (a direct child of a track whose `description.json` has `level: "sub-track"`) in track-root discovery, refresh, the pre-push sweep, `create.sh`, validation, recursive validation and archive.
- Derive a sub-track packet's `parent_id` from its sub-track, and recompute it when a packet moves.
- Report an undeclared non-numbered folder inside a track instead of skipping it.
- Upstream Barter's project-owned doctor entry for `.env.example`, keep the vendored `.skilled/specs` link working when a host has no `specs/`, and document a host-repository trigger index.

### Out of Scope
- Writes through a linked specs root - packet `system-speckit/037-symlinked-runtime-root` owns them.
- Barter's priority numbering and its sub-track map - Barter phase 004 owns them; spec-kit does not enforce number bands.
- Following a symlinked sub-track - it is skipped with a diagnostic in both views, matching how the commit view treats a symlinked track today.
- Sub-tracks nested inside sub-tracks - one named level is the requested layout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modify | Return declared sub-tracks with their own packets in both views; report undeclared folders |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Modify | Accept `--track <track>/<sub-track>` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modify | Sweep sub-tracks and print undeclared-folder diagnostics |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Refresh the sub-track and its track instead of skipping |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Exempt a declared sub-track folder like a track root |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | Recurse through declared sub-tracks |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | Accept a sub-track as a packet home and refresh both levels |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` | Modify | Derive `parent_id` from a declared sub-track |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modify | Recompute `parent_id` after a move |
| `.skilled/commands/doctor/assets/symlink-manifest.json`, `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Modify | `project_owned` entry and `project-owned` status |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md`, `README.md`, `.skilled/commands/speckit/search.md`, `runtime/data/README.md` | Modify | Document sub-tracks and host index mode |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts`, `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Modify | Failing-first tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Track-root discovery returns a declared sub-track as its own root with its immediate numbered packets, and lists it in its track's children, in the working-tree and commit views | `track-roots.vitest.ts` sub-track cases pass in both views |
| REQ-002 | `refresh-track-roots.mjs --track demo/sub --apply` writes the sub-track's `children_ids` | The scratch reproduction in Measured Behavior exits 0 and the file lists `demo/sub/001-nested-probe` |
| REQ-003 | `create.sh --track demo/sub` numbers inside the sub-track and refreshes the sub-track and the track | A new packet is `demo/sub/002-*`; the sub-track's `children_ids` lists it and the track's lists `demo/sub` once |
| REQ-004 | Validating a declared sub-track folder reports it as a container, and `validate.sh specs/<track> --recursive` reaches its packets | `validate.sh specs/demo/sub --strict` prints `RESULT: PASSED`; the recursive run lists the nested packet |
| REQ-005 | A packet inside a sub-track gets the sub-track as `parent_id`, and a move recomputes it | `repair-derived.vitest.ts` move cases pass with no `parent_id_review_required` |
| REQ-006 | Flat tracks behave exactly as before | Every existing track-roots, refresh, sweep, create, validate, archive and repair-derived test passes unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Archive and restore work for a sub-track packet through the sub-track's own `z_archive/` | `archive-track.vitest.ts` sub-track cases pass |
| REQ-008 | An undeclared non-numbered folder inside a track is reported, and a symlinked sub-track is skipped with a diagnostic in both views | The sweep prints one diagnostic line per such folder; the diagnostics are advisory and leave its exit status unchanged |
| REQ-009 | A `project_owned` manifest entry keeps the host's real `.env.example`, reports `project-owned` and passes the install post-check | `symlink-engine.test.cjs` proves the status and byte-identical file without opening any `.env` |
| REQ-010 | A vendored copy with no host `specs/` leaves no dangling `.skilled/specs` link after setup, and a copy with one keeps it | Two fixture cases in the symlink engine tests |
| REQ-011 | Host trigger-index mode is documented, including the explicit `--index` in the host's Gate 1 command | `runtime/data/README.md` and `folder-structure.md` name the generate and lookup commands |
| REQ-012 | The search guide, README and `folder-structure.md` show the sub-track level | `rg -n 'sub-track' <each file>` prints at least one line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Barter handover reproduction passes: recursive validation of `specs/demo` reaches `demo/sub/001-nested-probe`, `validate.sh specs/demo/sub` passes, and `refresh-track-roots.mjs --track demo/sub` exits 0.
- **SC-002**: The full spec-kit test suites that cover tracks pass with zero failures, against the baseline taken before the first change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 037's uncommitted edits to `graph-metadata-parser.ts` | A parallel edit to the same file could conflict | Edit `resolveParentId` only, rebase onto 037 once it lands, and run both packets' tests |
| Risk | The pre-push gate starts blocking existing repositories | High: a push fails on a tree that passed before | Undeclared-folder diagnostics stay out of the blocking path until a track opts in; flat-track tests guard the rest |
| Risk | Editing spec-kit TypeScript leaves the compiled orchestrator stale | Med: `validate.sh` refuses to run | Run `npm run build` in `runtime/` after each TypeScript change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Track-root discovery on this repository's `specs/` takes no more than 10 percent longer than the baseline measured before the change.

### Security
- **NFR-S01**: No change reads a `.env` file; the project-owned test checks bytes of a fixture `.env.example` only.

### Reliability
- **NFR-R01**: A tree with no sub-tracks produces byte-identical track-root metadata before and after the change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty input: a declared sub-track with no packets has empty `children_ids` and validates.
- Maximum input: a track holding several sub-tracks of 280 packets each lists each sub-track once and each packet only in its own sub-track.
- Failure path: `--track demo/missing` exits 2 naming the path, and a numbered phase parent inside a sub-track stays one entry whose phases remain its own children.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Does any host vendor Skilled without an adjacent `specs/` today? REQ-010 covers the case either way.
- Should undeclared-folder diagnostics ever block a push? This packet keeps them advisory.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md` (3 iterations, 5/5 questions answered):
- Track tooling assumes one level below `specs/` in track roots, refresh, the pre-push sweep, `create.sh` refresh, the validation exemption, recursive validation, archive and parent derivation; recursive discovery and the trigger-index corpus already handle any depth.
- A sub-track should be a declared container: a direct child of a track with no `spec.md`, its own `description.json` and `graph-metadata.json` at a sub-track level, registered in the track's `children_ids`; undeclared folders are reported.
- Open: the graph-metadata container discriminator, the symlinked sub-track policy, and whether any host vendors Skilled without an adjacent `specs/`.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research**: `research/research.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Acceptance criteria**: `acceptance-criteria.md`

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition for the remediation of its deep review. The build above is finished and keeps its own status and documents. Each phase is an independently executable child spec folder, and its plan, tasks and decisions live inside the child. The evidence for every phase is `review/review-report.md` and `review/p2-verification.md`, whose "Work that remains" list is the work list: findings marked no change or dropped there (P2-6, P2-10a, P2-10c and P2-14c) have no phase.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-create-track-fixes/ | `create.sh --track`: normalize a trailing slash, refuse a symlinked, three-segment or undeclared sub-track (F-P1-1, F-P1-2, P2-5) | Complete |
| 2 | 002-subtrack-predicate/ | One declared-sub-track rule across validation, archive, parent derivation and repair, plus symlinked description and packet handling (P2-1, P2-2, P2-8, optional P2-7) | Complete |
| 3 | 003-metadata-write-safety/ | `refresh-track-roots --apply` stops writing through a symlinked metadata file, and the pre-push repair clears a sub-track with no metadata (P2-4, P2-3) | Complete |
| 4 | 004-doctor-symlink-gaps/ | The doctor engine's host-relative alias ignore decision and the whole-link `specs/` limit (P2-10b, P2-10d) | Complete |
| 5 | 005-docs-and-tests/ | Doc drift and weak tests: `specId`, reader docs, three 044 doc lines, two test gaps, optional reader shape (P2-11, P2-12, P2-13a/b/c, P2-14a, P2-14b, optional P2-9) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-create-track-fixes | 002-subtrack-predicate | The three `create.sh` red cases pass and the operator has answered D-001, because phase 002's parity test uses `create.sh`'s check as its reference | `validate.sh` on `001-create-track-fixes` prints `RESULT: PASSED`, and the phase's test command prints zero failures |
| 002-subtrack-predicate | 003-metadata-write-safety | The parity test passes for every consumer, so phase 003 seeds metadata only for a folder every tool agrees is a sub-track | The parity test file passes, and `validate.sh` on `002-subtrack-predicate` prints `RESULT: PASSED` |
| 003-metadata-write-safety | 004-doctor-symlink-gaps | The refresh guard and seed pass their cases and D-003a and D-003b are answered; phase 004 has no code dependency, so it may run earlier | `track-roots.vitest.ts` passes, and `validate.sh` on `003-metadata-write-safety` prints `RESULT: PASSED` |
| 004-doctor-symlink-gaps | 005-docs-and-tests | The doctor decision is pinned by a test and phases 001 to 003 are Complete, because phase 005's docs describe their final behavior | Both doctor node test files pass, and `validate.sh` on `004-doctor-symlink-gaps` prints `RESULT: PASSED` |

### Recorded Operator Decisions

Each decision sits in its child's `spec.md` section 7. The operator answered all decisions on 2026-11-07.

| ID | Phase | Question | Recorded decision | Status |
|----|-------|----------|-------------------|--------|
| D-001 | 001-create-track-fixes | `create-track-refresh.vitest.ts:170` asserts an undeclared slash `--track` value is left alone. Refuse it, or warn and proceed? | Option A: refuse before writing and name the reader's `undeclared folder ignored` diagnostic with declaration guidance. | Answered |
| D-002a | 002-subtrack-predicate | Keep each consumer's predicate and align them under a parity test, or make every consumer ask the reader? | Option A: keep each predicate, align it with the reader, and enforce it with a parity test. | Answered |
| D-002b | 002-subtrack-predicate | Fix the symlinked-packet glob in the sub-track loop only, or in the flat-track loop too? | Option A: fix the sub-track loop only; keep the flat-track loop unchanged. | Answered |
| D-003a | 003-metadata-write-safety | Guard the symlinked metadata write for the top-level track too, or the sub-track only? | Option A: guard both levels. | Answered |
| D-003b | 003-metadata-write-safety | Seed a missing sub-track metadata file on `--apply`, or change the sweep's message? | Option A: seed metadata on `--apply`. | Answered |
| D-004a | 004-doctor-symlink-gaps | Ignore the host-relative alias like other links, or keep it unignored and document why? | Option B: keep it unignored, document why, and pin it with a test. | Answered |
| D-004b | 004-doctor-symlink-gaps | Document the whole-link `specs/` limit, or add an engine note? | Document the limit and change nothing in the engine. | Answered |
| D-005a | 005-docs-and-tests | Correct the doc that says deeper layouts are reported, or add the diagnostic? | Correct the doc to say deeper layouts are not reported. | Answered |
| D-005b | 005-docs-and-tests | Correct the `specId` doc, or generate `specId` for sub-tracks? | Correct the doc: `specFolder` is required and `specId` is not. | Answered |
| D-005c | 005-docs-and-tests | Optional: document the two reader shapes, or unify them? | Document both reader shapes and leave the code unchanged. | Answered |
<!-- /ANCHOR:phase-map -->
