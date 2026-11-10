---
title: "Feature Specification: Archive current-location semantics and ignored files"
description: "Archiving or restoring a packet left its recorded paths naming the folder it left, and the trigger index build read files git ignores. Archived packets now record where they live, and the index build skips ignored files."
trigger_phrases:
  - "archive current location and ignored files"
  - "phase 15 archive current location and ignored files"
  - "archive re-derive recorded paths"
  - "trigger index skips git ignored files"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Archive current-location semantics and ignored files

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 16 |
| **Predecessor** | 014-spec-auto-healing-research |
| **Successor** | 016-research-recommendations |
| **Handoff Criteria** | An archived and a restored packet each pass strict validation with no manual step, and a local index build matches the CI build of the same commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the spec folder tooling parent. Phase 14's research left one decision to the operator: should an archived packet record where it lives now, or keep the path it was archived from? The operator chose the recommendation, current location, and asked for the small fix the CI rebuild exposed: a local index build read files git ignores.

**Scope Boundary**: `archive.sh`, `repair-derived.cjs`, `upgrade-legacy.mjs`, the corpus walk in `lib/corpus.mjs`, their tests and their READMEs.

**Dependencies**:
- Phase 13's repaired corpus, where archived packets already record their current path.
- Phase 14's SH-03 recommendation.

**Deliverables**:
- Archive and restore that re-derive the moved packet's recorded paths.
- A repair tool that walks archives and fixes `description.json` `specFolder` and a stale archived parent.
- An index build that skips what the committed ignore files exclude.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`archive.sh` moved a packet and refreshed only the track root, so `description.json` `specFolder`, the graph metadata ids and each document's packet pointer kept naming the folder the packet left, and the validator failed it. `repair-derived.cjs` skipped every `z_archive` tree, never wrote `specFolder`, and the graph merge kept the pre-move parent of an archived packet. Separately, the trigger index build walked the disk without reading `.gitignore`, so a local build indexed ignored containment copies and CI rewrote the committed index.

### Purpose
A move never leaves a packet failing on its own recorded paths, and a local index build agrees with CI's.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-derive after every archive and restore, for the moved packet and every packet inside it.
- Repair `description.json` `specFolder`, walk archived packets, and clear the parent of a packet sitting directly in an archive.
- `upgrade-legacy --include-archive` repairs archived packets' derived fields only.
- The corpus walk skips untracked paths the committed `.gitignore` files exclude.

### Out of Scope
- What any archived document says. Only derived fields change.
- The validator's rules.
- A phase parent's `children_ids`, which still changes only through a reviewed prune.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | Re-derive after archive and restore |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modify | Walk archives, repair `specFolder` and an archived packet's parent |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Repair archived packets' derived fields |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modify | Skip git-ignored paths |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts` | Modify | Cover each change |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README*.md` | Modify | Describe the new behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A packet archived or restored by `archive.sh` passes strict validation afterwards with no manual step |
| REQ-002 | No change rewrites what an archived document says |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `repair-derived.cjs` repairs an archived packet's `specFolder`, packet pointer and stale parent |
| REQ-004 | `upgrade-legacy --include-archive --apply` runs only `repair-derived` on archived packets |
| REQ-005 | The index build skips untracked paths the committed ignore files exclude, and a tracked file stays in |
| REQ-006 | The spec-kit CLI suite passes with no new failure |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An archive then a restore of a real packet each end with RESULT: PASSED.
- **SC-002**: A local index build drops the ignored containment copies, and the freshness check exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A repair run over the whole tree now visits about 2,200 archived packets | Med | Archived packets already pass, so the run plans nothing for them |
| Risk | A user's global ignore rules hide uncommitted packets from a local build | High | Only the committed `.gitignore` files count |
| Dependency | `repair-derived.cjs` beside `archive.sh` | A missing tool leaves paths stale | `archive.sh` warns and names the command to run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: An archive adds one repair run over the moved folder, a few seconds per packet.

### Security
- **NFR-S01**: The repair stays confined to the specs tree, as `repair-derived.cjs` already enforces.

### Reliability
- **NFR-R01**: A failed re-derive after a move is reported, never undoes the move.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A packet nested inside the moved one derives its parent from its own path, so only the moved packet's parent needs clearing.

### Error Scenarios
- Outside a git checkout, or with git missing, the index build ignores nothing.

### State Transitions
- A restored track packet derives no parent, and a restored phase derives its parent packet again.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four tools, their tests and two READMEs |
| Risk | 12/25 | Archive behavior changes for every later move |
| Research | 4/20 | Phase 14 named the causes |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose current-location semantics on 2026-10-08.
<!-- /ANCHOR:questions -->

---
