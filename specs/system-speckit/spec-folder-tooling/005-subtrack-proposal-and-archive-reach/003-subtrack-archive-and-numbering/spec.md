---
title: "Feature Specification: Phase 3: subtrack-archive-and-numbering"
description: "archive.sh supports a subtrack's own z_archive, but no code creates that folder, and create.sh ignores archived packets when it picks the next number. This phase seeds z_archive/.gitkeep in every declared subtrack and makes numbering count archived packets."
trigger_phrases:
  - "subtrack archive and numbering"
  - "phase 3 subtrack archive and numbering"
  - "numbering counts archived packets"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: subtrack-archive-and-numbering

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
| **Phase** | 3 of 5 |
| **Predecessor** | 002-subtrack-proposal |
| **Successor** | 004-archive-search-and-json |
| **Handoff Criteria** | Every declared subtrack holds `z_archive/.gitkeep` and `sweep-track-roots.mjs` prints no missing-archive line |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: Archive folder presence on declared subtracks and the next-number rule in `create.sh`. No search change and no validation change.

**Dependencies**:
- `readWorkingTreeTracks` in `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs`, which lists each declared subtrack
- Phase 001 `relocate.mjs --declare-subtrack`, which seeds the folder for a new subtrack

**Deliverables**:
- `refresh-track-roots.mjs --apply` seeds a missing `z_archive/.gitkeep`
- `sweep-track-roots.mjs` reports a declared subtrack without one
- 40 tracked `.gitkeep` files, one per declared subtrack
- An archive-aware highest-number loop in `create.sh` and its test case
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`archive.sh` moves a subtrack's packet into that subtrack's own `z_archive/`, but no script creates the folder, so this worktree holds 40 declared subtracks and no subtrack archive folder. `create.sh` picks the next number from the direct children of the target folder only, so a number freed by archiving a packet is handed out again and a later restore collides.

### Purpose
Every declared subtrack has a `z_archive/` that git tracks, and a new packet never takes a number that an archived packet in the same folder already holds.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -rl --include=description.json '"level": "sub-track"' specs --exclude-dir=z_archive --exclude-dir=scratch -m1
specs/mcp-tooling/clickup-figma/description.json
... 38 more lines, 40 paths in total ...
specs/hooks-plugins-extensions/repo-commit-gates/description.json
$ find specs -mindepth 3 -maxdepth 3 -type d -name z_archive -not -path "specs/*/[0-9][0-9][0-9]-*/*"
$ grep -c "z_archive" .skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts
0
```
The `find` command printed nothing.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Seed a missing `z_archive/.gitkeep` in every declared subtrack from `refresh-track-roots.mjs --apply`.
- Report a declared subtrack without a `z_archive/` from `sweep-track-roots.mjs`.
- Track the 40 subtrack `z_archive/.gitkeep` files in git.
- Read `$SPECS_DIR/z_archive/*` in the highest-number loop of `create.sh` `resolve_branch_name`.
- Add the archive case to `create-root-numbering.vitest.ts` and update the two docs that describe only track and phase archives.

### Out of Scope
- Renumbering existing packets - zero live-versus-archived collisions exist today, and `relocate.mjs --renumber` covers any that is wanted.
- Archive search and archive validation - phase 004 owns them.
- Seeding `z_archive/` at track roots and inside phase parents - the approved plan names subtracks only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Modify | `--apply` seeds `z_archive/.gitkeep` in each declared subtrack |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modify | Reports a declared subtrack without `z_archive/` |
| `specs/<track>/<sub-track>/z_archive/.gitkeep` | Create | 40 files, one per declared subtrack |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | The loop at lines 1605 to 1619 in `resolve_branch_name` also reads `$SPECS_DIR/z_archive/*` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Modify | Adds the archive case |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` | Modify | Line 41 names subtrack archives |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Line 112 names subtrack archives |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `refresh-track-roots.mjs --track <track>/<sub> --apply` creates `specs/<track>/<sub>/z_archive/.gitkeep` when it is missing and changes nothing when it exists. Without `--apply` it writes nothing |
| REQ-002 | `sweep-track-roots.mjs` prints one line that names each declared subtrack without a `z_archive/` |
| REQ-003 | `git ls-files 'specs/*/*/z_archive/.gitkeep'` lists one file for each of the 40 declared subtracks |
| REQ-004 | With `specs/<track>/001-a` live and `specs/<track>/z_archive/007-b` archived, `create.sh --track <track>` creates `008-*` |
| REQ-005 | `create-root-numbering.vitest.ts` holds a case that fails without REQ-004 and passes with it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` and `runtime/cli/spec/README.md` describe the subtrack archive beside the track and phase archives |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `find specs -mindepth 3 -maxdepth 3 -type d -name z_archive -not -path "specs/*/[0-9][0-9][0-9]-*/*"` prints 40 paths.
- **SC-002**: `npx vitest run tests/create-root-numbering.vitest.ts` exits 0 with the archive case included.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `readWorkingTreeTracks` lists declared subtracks | Seeding would need its own subtrack reader | Reuse it, as `refresh-track-roots.mjs` already does |
| Risk | The pre-push `gate:track-roots` starts blocking on a missing archive | High: a push fails on a tree that passed before | Seed and commit the 40 folders in the same change that adds the report |
| Risk | The track reader treats a `z_` folder as content | Low: `track-roots.mjs` never reads `z_*` | `track-roots.vitest.ts` stays green |
| Risk | An archived folder without a numeric prefix breaks the loop | Low: the loop already maps a non-numeric name to 0 | Keep the same `grep -o '^[0-9]\+'` rule for archive entries |
<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The numbering loop adds one directory listing of `$SPECS_DIR/z_archive` per `create.sh` run.

### Security
- **NFR-S01**: Seeding refuses a `z_archive` that is a symlink, as `archive.sh` does.

### Reliability
- **NFR-R01**: A second `refresh-track-roots.mjs --apply` run creates no file.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a track with no declared subtrack seeds nothing and exits 0.
- Maximum input: a `z_archive/` that holds `999-x` makes `create.sh` allocate 1000, the same as a live `999-x` does today.
- Failure path: a `z_archive` that is a symlink is refused with a message that names it, and nothing is written.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three scripts, one test, two docs and 40 empty files |
| Risk | 10/25 | The pre-push gate reads the sweep |
| Research | 4/20 | The loop and the track reader are known |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a missing subtrack `z_archive/` change the `sweep-track-roots.mjs` exit code, or is it an advisory diagnostic like the undeclared-folder line? The approved plan says "reports". This spec plans an advisory line until the operator decides.
- The approved plan says to commit 40 existing untracked folders. They exist only in the operator's main checkout and not in this worktree, so this phase creates them with `refresh-track-roots.mjs --apply`.
<!-- /ANCHOR:questions -->

---
