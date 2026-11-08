---
title: "Feature Specification: Phase 6: review-follow-ups"
description: "The last two review rounds left seven small sub-track gaps: four tools judge the track segment differently from the track reader, archive.sh never creates a missing sub-track metadata file, validate.sh misses two packet-name shapes, and two messages read wrong. This phase closes all seven, each behind a test that fails on the old code."
trigger_phrases:
  - "review follow ups"
  - "phase 6 review follow ups"
  - "sub-track track segment parity"
  - "archive seeds sub-track metadata"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: review-follow-ups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-docs-and-tests |
| **Successor** | None |
| **Handoff Criteria** | Each new test fails on the pre-phase code and passes after, the full cli and core suites show no new failure, and `validate.sh` on the 044 packet with `--strict --recursive` prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the 044 remediation. Review rounds 3 and 4 approved phases 001 to 005 and left the gaps below as follow-ups in `../morning-handoff.md`. The operator then asked for all of them to be done.

**Scope Boundary**: The sub-track rule in the track reader, the parser, `repair-derived.cjs`, `validate.sh`, the validation orchestrator and `archive.sh`; two messages in `create.sh` and `sweep-track-roots.mjs`; and their tests. Flat-track behavior does not change.

**Dependencies**:
- Phases 001 to 005, whose predicate and parity test this phase extends.

**Deliverables**:
- Every consumer judges the track segment the way the reader does.
- `archive.sh` creates a missing sub-track `graph-metadata.json`, as `create.sh` does.
- `validate.sh` finds every sub-track packet name the reader counts.
- The refusal and sweep messages say what happened.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parser and `repair-derived.cjs` check only the sub-track folder's own name, so a declared folder under a numbered, hidden, `node_modules` or packet-shaped track still became a packet's parent, and `validate.sh` and the orchestrator accepted it under a hidden or `node_modules` track. The reader accepted a `z_*` track while its own header, the parser and `archive.sh` treat `z_*` as an archive. `archive.sh` skipped the refresh when a sub-track had no metadata, `track_of` matched any name starting with three digits, `validate.sh` listed only `NNN-*` sub-track packets, the sweep called a missing file "unreadable", and three `create.sh` refusals printed the `--track` value with its trailing slash stripped.

### Purpose
One answer to "is this a sub-track, and what are its packets" from every tool, and messages that name what the operator typed and what is wrong.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# The new tests run against the pre-phase code (code reverse-applied, tests kept), 2026-11-08:
$ npx vitest run --project cli subtrack-predicate-parity validate-subtrack create-track-containment track-roots
     × creates a missing sub-track metadata file when archiving out of it
     × judges the track segment the way the reader does for every consumer
     × shows the original track value when refusing an undeclared sub-track
     × finds every packet name the track reader counts inside a sub-track
     × calls missing sub-track metadata missing, not unreadable
      Tests  5 failed | 49 passed (54)
# The track-segment case alone listed 8 mismatches, among them:
#   001_x: repair planned expected false, received true
#   z_track: graph parent expected z_track/sub, received null
#   .hidden-track: validation expected false, received true
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Check the track segment in the parser, `repair-derived.cjs`, `validate.sh` and the validation orchestrator, the way the reader does.
- Make the reader treat a `z_*` folder at the specs root as an archive, never a track.
- Have `archive.sh` refresh, and so create, a declared sub-track's missing metadata, and anchor its `track_of` name match.
- Have `validate.sh` list every sub-track packet name the reader counts.
- Print the typed `--track` value in `create.sh` refusals, and "missing" for an absent file in the sweep.

### Out of Scope
- `check-comment-hygiene.sh` - the reported syntax error came from running a Python script with `bash`; run directly it exits 0.
- The phase-child globs in `validate.sh` - they predate sub-tracks and belong to phase discovery, not track discovery.
- Unifying the two reader return shapes - D-005c kept both, documented.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modify | One name rule for tracks and sub-tracks, with `z_*` excluded |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` | Modify | `isDeclaredSubtrackFolder` checks its track |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modify | `declaresSubtrack` checks its track |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | `isDeclaredSubTrack` refuses an archive, hidden or `node_modules` track |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | The same track check, and the sub-track packet glob |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | Sub-track refresh guard and `track_of` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Refusal messages show the typed value |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modify | "missing" versus "unreadable" |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts` | Modify | Five new cases across four files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Flat tracks behave as before | The full cli and core suites show no failure the pre-phase run did not |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every consumer judges the track segment like the reader | `judges the track segment the way the reader does for every consumer` passes for `001_x`, `owns-spec-track`, `z_track`, `.hidden-track` and `node_modules`, and failed before |
| REQ-003 | `archive.sh` creates missing sub-track metadata | `creates a missing sub-track metadata file when archiving out of it` passes, and failed before |
| REQ-004 | `validate.sh` lists `NNN` and `NNN_name` sub-track packets and no other name | `finds every packet name the track reader counts inside a sub-track` passes, and failed before |
| REQ-005 | Refusals print the typed `--track` value | `shows the original track value when refusing an undeclared sub-track` passes, and failed before |
| REQ-006 | The sweep calls an absent file missing | `calls missing sub-track metadata missing, not unreadable` passes, and failed before |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five new cases fail on the pre-phase code and pass after.
- **SC-002**: `validate.sh specs/system-speckit/044-named-subtracks-and-host-repos --strict --recursive` prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The reader now skips a `z_*` track | Low: a real `z_*` track would drop out of the pre-push sweep | No `specs/z_*` folder exists, and the reader's header already said an archive is never read |
| Risk | `is_track_root_folder` in `validate.sh` serves flat tracks too | Med: a stricter check there would change flat-track validation | The new check sits in `is_declared_subtrack_folder` only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **D-006a: which side of the `z_*` track split moves.** The reader read a `z_*` track; the parser, `archive.sh` and the reader's own header did not. Taken: the reader moves, because three surfaces and its documented rule agree and no `specs/z_*` folder exists. Status: decided by the orchestrator under the operator's "Do all for me", 2026-11-08.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Evidence**: `../morning-handoff.md`, `../review/review-report.md`
