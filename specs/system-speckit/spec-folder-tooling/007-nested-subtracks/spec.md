---
title: "Feature Specification: Allow a declared sub-track to hold declared sub-tracks (max two sub-track levels under a track)"
description: "Spec-kit accepts one level of declared sub-tracks under a track and refuses a second, so a track like specs/mcp/ cannot group its tooling packets as mcp-tooling/clickup-figma/. This packet lets a level-1 sub-track hold declared sub-tracks, caps the depth at two and keeps every one-level tree byte-identical."
trigger_phrases:
  - "nested subtracks"
  - "two level sub-tracks"
  - "sub-track inside a sub-track"
  - "allow a declared sub track to hold declared"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Allow a declared sub-track to hold declared sub-tracks (max two sub-track levels under a track)

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/505-mcp-browser-use-hub` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec-kit supports exactly one level of declared sub-tracks: `create.sh` refuses a `--track` value with three segments, and the track reader, validator, graph parser, repair writer, relocation engine and archive tool never look below a level-1 sub-track. An operator who wants `specs/mcp/mcp-tooling/clickup-figma/001-*` cannot file packets there.

### Purpose
A level-1 sub-track can hold declared sub-tracks, every tool treats a level-2 sub-track like a level-1 one, depth three is refused with a diagnostic, and a one-level tree produces the same output as before.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --track mcp/mcp-tooling/clickup-figma --short-name probe "Probe"
Error: --track 'mcp/mcp-tooling/clickup-figma' has more than two path segments; use a track or one declared sub-track such as 'demo/sub'.
exit=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Discover level-2 declared sub-tracks in both track-reader views (working tree and commit) and list them in their level-1 parent's children.
- Accept a level-2 sub-track in `create.sh --track`, `validate.sh`, the validation orchestrator, the graph parent resolver, `repair-derived.cjs`, `relocate.mjs` and `archive.sh`.
- Refuse a declared sub-track nested past two levels with a diagnostic in the reader and a refusal in `create.sh` and `relocate.mjs`.
- Apply the packets-or-sub-tracks rule to a level-1 sub-track as it applies to a track.
- Update the sub-track docs that state the one-level rule.

### Out of Scope
- `suggest-subtracks.mjs` proposing level-2 sub-tracks - its proposal works on one container at a time and the contract does not ask for nested proposals.
- A new config option or abstraction layer - the contract freezes the change to the existing modules.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modify | Recurse one more declared level in both views; depth-3 diagnostic |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modify | Mixed check covers a level-1 sub-track |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Three-segment `--track`, refusal at four, refresh every level |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | Recognise and recurse into level-2 sub-tracks |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Exempt a level-2 sub-track |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` | Modify | Parent of a packet in a level-2 sub-track |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modify | Same parent rule as the parser |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Modify | Moves into and declarations of level-2 sub-tracks |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | Archive and restore inside a level-2 sub-track |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` | Create | Two-level tree coverage |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` and sub-track catalog pages | Modify | State the two-level rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `readWorkingTreeTracks` and `readCommitTracks` list a declared `<track>/<sub1>/<sub2>` as a track entry and list `<sub2>` in `<track>/<sub1>`'s children. |
| REQ-002 | `create.sh --track <track>/<sub1>/<sub2>` creates `001-*` inside the level-2 sub-track and refreshes the level-2 and level-1 records; a four-segment value exits 1 with a diagnostic. |
| REQ-003 | `validate.sh` classifies a level-2 sub-track as a sub-track (`TRACK_ROOT` entry) and a recursive run on the track validates its packets. |
| REQ-004 | A declared sub-track inside a level-2 sub-track is not a track entry and gets the diagnostic `nested past two sub-track levels`. |
| REQ-005 | The existing sub-track test files pass, with only their depth-limit cases moved one level deeper, and the sweep on this repository prints no new diagnostic. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A refreshed level-2 sub-track's `graph-metadata.json` has `parent_id` `<track>/<sub1>`, and the packet inside it derives `parent_id` `<track>/<sub1>/<sub2>` in both the graph parser and `repair-derived.cjs`. |
| REQ-007 | `relocate.mjs --from <track>/<sub1>/001-x --to <track>/<sub1>/<sub2>/001-x --apply` moves a packet into an existing level-2 sub-track, and a destination three sub-tracks deep is refused. |
| REQ-008 | A level-1 sub-track holding packets beside declared sub-tracks is reported as mixed by the sweep. |
| REQ-009 | `archive.sh` archives a packet in a level-2 sub-track into that sub-track's own `z_archive/`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run --project cli` passes every test that passed at baseline, plus the new two-level tests.
- **SC-002**: `node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` prints the same diagnostic lines as the baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Compiled `dist/` of the runtime package | `validate.sh` and the graph tests run old code without a rebuild | Rebuild with `npm run build` in the skill root before verification |
| Risk | The level-2 scan reports folders inside a level-1 sub-track that were silent before | Med | Act only on folders that declare `level: "sub-track"`; skip everything else silently |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The reader adds one directory listing per declared level-1 sub-track and nothing for a one-level tree beyond that listing.

### Security
- **NFR-S01**: A symlinked level-2 sub-track is never followed, the same rule as level 1.

### Reliability
- **NFR-R01**: A one-level tree produces byte-identical reader, sweep and refresh output.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a level-1 sub-track with no folders other than its packets yields the same reader entry as before.
- Maximum input: a declared sub-track three levels deep is refused with one diagnostic and never listed.
- Failure path: `create.sh --track a/b/c/d` exits 1 with a message naming the two-level limit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Nine source files, one new test file, four docs |
| Risk | 12/25 | Shared reader used by the pre-push gate; one-level output must not change |
| Research | 6/20 | Every sub-track predicate is already in the files read |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
