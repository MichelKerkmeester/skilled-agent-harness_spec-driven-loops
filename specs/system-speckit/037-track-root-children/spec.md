---
title: "Feature Specification: Keep every track root's children_ids equal to its packets on disk, and block a push that breaks it"
description: "Fifteen of eighteen track roots listed children_ids that disagreed with the packets they held, because no tool wrote a track root and the only check compared counts and ran nowhere. A writer now sets each list from disk, create.sh --track lists a new packet as it scaffolds it, and a pre-push gate blocks a commit whose track roots disagree with its packets."
trigger_phrases:
  - "track root children_ids"
  - "refresh-track-roots"
  - "sweep-track-roots"
  - "track-root pre-push gate"
  - "track root drift"
  - "SPECKIT_SKIP_PREPUSH_TRACK_GATE"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Keep every track root's children_ids equal to its packets on disk, and block a push that breaks it

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-09-24 |
| **Branch** | None. Work on `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A track root is a folder directly under `specs/`, such as `specs/sk-doc/`, that holds numbered packets and lists them in the `children_ids` of its `graph-metadata.json`. On 2026-09-24, 15 of the 18 track roots that carry that file listed children that disagreed with the packets on disk. `system-deep-loop` listed 26 and held 2. `ai-systems` listed 11 and held 76. `anobel.com`'s file was empty.

Nothing wrote a track root. `backfill-graph-metadata.ts` refuses one with "target is not a spec folder", `create.sh --track` placed a packet in a track without touching its list, and the validation orchestrator exempts tracks from every packet rule. The one check, `sweep-track-roots.mjs`, compared counts, so a renamed packet left both counts equal and passed, and nothing ran it.

### Purpose
Every track root lists exactly the packets it holds, a new packet is listed the moment it is scaffolded, and a push that would publish a list that disagrees with its packets is blocked.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One module both tools share, so the sweep and the writer judge a track by the same rules
- The sweep compares sets instead of counts, and reads a commit with `--rev <commit>`
- A writer, `refresh-track-roots.mjs`, that sets a track's `children_ids` from disk, dry by default
- `create.sh --track` runs the writer for its track after scaffolding
- A blocking pre-push gate that sweeps each pushed commit
- Refresh the 13 track roots in this repository and the two linked ones, `ai-systems` and `anobel.com`

### Out of Scope
- A stale `last_active_child_id` in some tracks. It names a recent packet, not the list of packets, and nothing here reads it
- Correcting `anobel.com`'s `description.json`, which described a different track. The operator chose to rewrite it, and it is untracked like the rest of that folder
- Gating the linked tracks' own repositories. Neither tracks its spec folder in git, so there is no commit to check
- Packet-level `children_ids`, which `backfill-graph-metadata.ts` already derives

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Create | Reads tracks from the working tree or a commit and compares their lists as sets |
| `skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modify | Set comparison, `--rev <commit>`, symlinked tracks left out of a commit |
| `skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Create | Sets `children_ids` from disk and changes nothing else |
| `skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Runs the writer for `--track` after a normal or phase scaffold |
| `skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts` | Create | Ten cases for the sweep and the writer |
| `skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` | Create | Six cases for the `create.sh` hook-up |
| `scripts/git-hooks/pre-push` | Modify | The track-root gate |
| `scripts/git-hooks/tests/pre-push.test.sh` | Modify | Eleven cases for the gate, two of them real pushes from a linked worktree |
| `skills/system-spec-kit/runtime/cli/spec/README.md`, `runtime/cli/lib/README.md`, `scripts/git-hooks/README.md` | Modify | Describe the writer, the set comparison and the gate |
| `.env.example` (repository root) | Modify | List `SPECKIT_SKIP_PREPUSH_TRACK_GATE` |
| `skills/system-spec-kit/SKILL.md`, `README.md`, `references/workflows/rename-pattern.md` | Modify | Name the writer and the gate where the skill lists its scripts, commands, folder layout and rename steps |
| `skills/system-spec-kit/feature-catalog/` | Modify | A catalogue entry and its index section |
| `.hermes/skills/system-spec-kit/SKILL.md` (repository root) | Modify | Regenerated copy of `SKILL.md` |
| `specs/<track>/graph-metadata.json`, 13 tracks | Modify | `children_ids` set to the packets on disk |

Paths are under `.skilled/` unless stated otherwise.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The sweep reports a track whose listed packets differ from its packets on disk, including when the two counts are equal |
| REQ-002 | The writer sets a track's `children_ids` to its packets on disk and leaves every other field, the key order and the two-space format as they were |
| REQ-003 | A push is blocked when a pushed commit carries a track root whose list disagrees with that commit's packets, and the check reads the commit rather than the working tree |
| REQ-004 | Every track root in this repository lists exactly its packets |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `create.sh --track` lists the packet it scaffolds in that track root, in normal and phase mode |
| REQ-006 | A track root whose metadata cannot be read is reported and never overwritten |
| REQ-007 | The gate runs only where the toolchain ships, leaves symlinked tracks out, blocks when its sweep is missing and skips with `SPECKIT_SKIP_PREPUSH_TRACK_GATE=1` |
| REQ-008 | The linked `ai-systems` and `anobel.com` track roots list exactly their packets |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sweep-track-roots.mjs` exits 0 across all 18 track roots
- **SC-002**: A commit that adds a packet without listing it cannot be pushed from this repository without the named bypass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | In the shared checkout, the writer lists a packet another session has not committed yet, and a commit of that file without the packet is blocked | Med | The block names the fix: commit each track file with the packets it lists. The working-tree list is still the true one once both sessions commit |
| Risk | The global pre-push hook is read from the main checkout's working tree, so the gate starts only when that checkout holds the new hook | Med | Named in the rollout notes of `implementation-summary.md` |
| Risk | `z_archive` entries leave three tracks' lists | Low | An archive folder is not a packet, the packet deriver uses the same rule, and the folders themselves are untouched |
| Dependency | `git` and `node` in the hook's environment | Low | The hook already needs both for its routing and skill gates |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The sweep of one pushed commit finishes in under a second on this repository
- **NFR-P02**: `create.sh` starts one extra `node` process, and only when `--track` names a track that has a `graph-metadata.json`

### Security
- **NFR-S01**: The writer writes only `graph-metadata.json` files of track roots under the specs folder it is given
- **NFR-S02**: Neither tool reads the network or changes any git ref

### Reliability
- **NFR-R01**: The gate gives the same verdict for the same commit, whatever the working tree holds
- **NFR-R02**: A commit the sweep cannot read produces a warning, not a guessed verdict
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or invalid metadata: the sweep counts the track as drifted, and the writer reports it and exits 2 without writing
- A file named like a packet, such as `006-draft.md`: not a packet
- `z_archive` and other unnumbered folders: not packets
- Entries under an earlier identity, such as `sk-design`'s `design/...`: the sweep names them and the writer removes them
- Two packets sharing a number, as in `ai-systems`: both are listed

### Error Scenarios
- A symlinked track in a commit: the sweep names it as skipped, because the commit holds only the link
- A branch deletion or a sha git cannot resolve: the gate skips it
- The sweep missing where the toolchain ships: the gate blocks and names its bypass

### State Transitions
- Another session's unfinished packet in the working tree: the working-tree sweep reports it, and the commit sweep does not
- A track with no `graph-metadata.json` yet: `create.sh` leaves it alone and prints nothing
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two new scripts, one shared module, `create.sh`, the pre-push hook, three READMEs, 15 data files |
| Risk | 10/25 | A new blocking gate on every push from this repository |
| Research | 6/20 | How the deriver treats archive folders, and how linked tracks appear in commits |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. `anobel.com`'s `description.json` was rewritten for its own track on the operator's answer.
<!-- /ANCHOR:questions -->

---
