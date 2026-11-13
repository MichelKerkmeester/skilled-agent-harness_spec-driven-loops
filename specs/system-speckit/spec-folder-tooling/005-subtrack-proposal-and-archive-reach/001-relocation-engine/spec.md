---
title: "Feature Specification: Phase 1: relocation-engine"
description: "Moving or renumbering a spec packet is manual today. repair-derived.cjs heals five documents and leaves the identity fields, three more pointers, phase-parent children and inbound references stale. This phase adds relocate.mjs, one deterministic tool that updates every store."
trigger_phrases:
  - "relocation engine"
  - "phase 1 relocation engine"
  - "relocate.mjs move renumber re-parent"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: relocation-engine

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/364-subtrack-proposal-archive-reach` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-subtrack-proposal |
| **Handoff Criteria** | `relocate.mjs --map <file>` dry run exits 1 on a valid whole-track map and exits 2 on a map that leaves a track mixed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: The relocation engine and the two existing files it needs widened. No proposal logic, no archive seeding sweep and no search change.

**Dependencies**:
- `trackLayout` in `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` for the no-mix rule
- `repair-derived.cjs`, `refresh-track-roots.mjs`, `graph/migrate-generated-json.ts`, `generate-trigger-index.mjs` and `cite-drift-scan.mjs` as the existing writers the engine calls

**Deliverables**:
- `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs`
- A wider `DOCS` list in `repair-derived.cjs` and a wider candidate list in `check-metadata-disk-consistency-helper.cjs`
- A committed relocation ledger beside `cite-drift-redirects.json`
- A restore path in `archive.sh` that takes the next free number when a differently named live packet holds the old one
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A packet that moves or changes number keeps stale records in most of the stores that name it. `repair-derived.cjs` rewrites the pointer in five documents and leaves `specId`, `parentChain`, `folderSlug`, the pointer in `goal.md`, `acceptance-criteria.md` and `resource-map.md`, a phase parent's `children_ids` and every cross-packet reference untouched. The approved plan records the residue as 129 stale `goal.md` pointers, 187 in `acceptance-criteria.md` and 64 in `resource-map.md`. Those three counts were not re-measured for this spec, and task T001 measures them before the first edit.

### Purpose
One command moves, renumbers or re-parents packets and leaves every store correct, so a second run finds nothing to do.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n "^const DOCS" .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs
104:const DOCS = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'handover.md'];
$ ls .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs
ls: .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs: No such file or directory
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `relocate.mjs` with a dry run by default, `--apply` to write, and exit codes 0, 1 and 2 matching `repair-derived.cjs`.
- Accept `--map <file.json>`, `--from` with `--to`, and `--renumber <folder>`.
- Refuse a bad plan before any write, then move, rewrite every store, record the map, refresh the indexes and validate.
- Extend `DOCS` in `repair-derived.cjs` and the candidate list in `check-metadata-disk-consistency-helper.cjs`.
- Add `--declare-subtrack <track>/<name>` and make `archive.sh` restore call the engine when a differently named live packet holds the restored number. A same-named folder at the destination stays refused.

### Out of Scope
- Clustering packets into a proposed map - phase 002 owns it.
- Seeding `z_archive/` in existing subtracks - phase 003 owns it.
- Rewriting hard-coded packet paths in code or CI - the engine reports them and exits 2.
- Unifying the seven subtrack predicate copies - the parent spec excludes it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Create | The engine: inputs, preflight, move, rewrites, record, refresh, close |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modify | `DOCS` at line 104 gains `goal.md`, `acceptance-criteria.md`, `resource-map.md` and `decision-record.md`. `expectedParentId` clears a recorded parent that a packet moved into a track root, or the specs root, no longer has |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs` | Modify | The candidate list at lines 52 to 59 gains `goal.md`, `acceptance-criteria.md` and `resource-map.md`. It already holds `decision-record.md` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | `restore_spec` calls the engine only when a differently named live sibling holds the restored number. A folder or link at the exact destination is still refused |
| `.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json` | Create | Committed ledger of applied maps, beside `cite-drift-redirects.json` |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json` | Modify | Rebuilt by `cite-drift-scan.mjs --rebuild-redirects`, never by hand |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Lists `relocate.mjs` in the tree, the key-files table and the entrypoints |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `relocate.mjs` writes nothing without `--apply`. It exits 0 when nothing is left to do, 1 when a dry run found work and 2 on any failure. A second `--apply` run on the same map exits 0 |
| REQ-002 | `relocate.mjs` accepts `--map <file.json>` holding `[{ "from": "...", "to": "..." }]`, `--from <path> --to <path>` for one packet, and `--renumber <folder>` to close number gaps in one folder. A renumber counts the numbers held in that folder's `z_archive/` as taken |
| REQ-003 | Preflight in `relocate.mjs` refuses, before any write, a destination collision, a number a live or archived sibling already holds, a destination that is another entry's source, a map that leaves a track mixed as judged by `trackLayout` in `runtime/cli/lib/track-roots.mjs`, a destination deeper than one subtrack, a name that is not `NNN-slug` and a dirty tree on an affected path. Each refusal exits 2. A map may name a sub-track that does not exist yet, and the run declares it. The dirty-tree check runs only while moves are pending, so a rerun can finish an applied map |
| REQ-004 | `relocate.mjs` moves a tracked folder with `git mv` and an untracked folder with a plain rename |
| REQ-005 | After a move, `description.json` carries the new `specFolder`, `specId`, `folderSlug` and `parentChain`, written through `graph/migrate-generated-json.ts --only`, and `graph-metadata.json` carries the new identity and a parent the new location accepts, written through `repair-derived.cjs --roots <dest> --apply` |
| REQ-006 | `repair-derived.cjs` rewrites `packet_pointer` in `goal.md`, `acceptance-criteria.md`, `resource-map.md` and `decision-record.md`, and `check-metadata-disk-consistency-helper.cjs` lists the same files. The helper reads the first listed document that carries a pointer, so the added names are read only when the earlier documents carry none |
| REQ-007 | A moved phase child leaves its old phase parent's `children_ids` and appears in the new one, and `refresh-track-roots.mjs --track <t> --apply` runs for every affected track and subtrack |
| REQ-008 | `relocate.mjs` rewrites inbound references across `specs/` by exact old-id to new-id substitution from the map. It replaces every whole old id in every text file under `specs/`, which covers `manual.depends_on`, `manual.supersedes`, `manual.related_to`, prose and full-path link targets, and it recomputes relative markdown links whose file or target moves. The map file itself is never rewritten |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | Each applied map is appended to `.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json`, and `cite-drift-scan.mjs --rebuild-redirects` rebuilds `cite-drift-redirects.json` |
| REQ-010 | `relocate.mjs --apply` refreshes the trigger index through `retrieval/generate-trigger-index.mjs`. The `specs/descriptions.json` rows of moved folders are renamed by the REQ-008 substitution, because no command regenerates the cache |
| REQ-011 | `relocate.mjs` never rewrites code or CI. When a moved path appears in `.skilled/bin/lib/compiled-route-layout.cjs` or `.github/workflows/*`, it reports the file and line and exits 2 |
| REQ-012 | `relocate.mjs --apply` closes by running `validate.sh` on each moved packet and `sweep-track-roots.mjs`. A failure leaves the report and exits 2 |
| REQ-013 | `relocate.mjs --declare-subtrack <track>/<name>` writes the subtrack `description.json` with `"level": "sub-track"`, its `graph-metadata.json` and `z_archive/.gitkeep`. It refuses a track that holds flat packets, which would leave the track mixed |
| REQ-014 | `archive.sh --restore` of a packet whose number a differently named live packet holds calls `relocate.mjs` and lands the packet on the next free number, counting archived packets. A folder or link at the exact destination is refused as before |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In a throwaway copy of the repository, `relocate.mjs --map <sample> --apply` exits 0, `validate.sh <moved packet> --strict` prints `RESULT: PASSED`, and a second run exits 0 with nothing to do.
- **SC-002**: `rg -c '<old packet id>' specs` prints nothing for every id in the applied map, apart from the ledger.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `graph/migrate-generated-json.ts --only` is the one path that recomputes `specId` and `parentChain` | Without it the engine would need a second identity writer | Call it per moved folder and fail with exit 2 when it does not run |
| Risk | `archive.sh` lines 484 to 488 say a phase leaves `children_ids` only through a reviewed prune | Med: the engine removes an id without that review | Remove only ids that the applied map names as `from`, and print each removal in the dry run |
| Risk | Substring substitution rewrites an id that only looks like a moved one, such as `001-a` inside `001-a-b` | High: a wrong reference in an unrelated packet | Match a whole path id bounded by a non-path character, and test the adversarial pair |
| Risk | A half-applied map after a failure | High: stores disagree | Preflight refuses before any write, the run is idempotent, and rerunning the same map completes it |
<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A dry run over a 174-packet map finishes without calling `validate.sh`, so its cost is file reads only.

### Security
- **NFR-S01**: `relocate.mjs` refuses any `from` or `to` that resolves outside `specs/`, and any symlinked folder, with exit 2.

### Reliability
- **NFR-R01**: A second `--apply` run on an applied map writes zero files.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a map of `[]` exits 0 and prints that nothing is to do.
- Maximum input: a whole-track map, such as the 174-packet regroup, runs as one preflight and one apply.
- Failure path: a destination collision exits 2 and names both paths before any file changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | One new script, three modified files, one ledger |
| Risk | 20/25 | Rewrites many stores across `specs/` |
| Research | 8/20 | The existing writers are known. The description cache command is not |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Answered: no command regenerates `specs/descriptions.json`. Its producer is `ensureDescriptionCache` in `runtime/lib/search/folder-discovery.ts`, which nothing outside the tests calls. This phase renames moved rows by substitution, and full regeneration is phase 004.
- The approved plan does not name the ledger file. This spec names it `relocation-ledger.json`. Decision needed only if the operator wants another name.
<!-- /ANCHOR:questions -->

---
