---
title: "Feature Specification: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets."
description: "The hooks track files its packets under broad sub-tracks named after a bundle of work rather than after a feature, so finding one feature's history means knowing which bundle it landed in. Whole packets whose main subject is a hook feature still sit in other tracks. This packet gives each hook, plugin and extension feature its own sub-track, moves every packet to the feature it belongs to, and keeps one overview that names every feature and its owning packets."
trigger_phrases:
  - "feature subtrack restructure"
  - "give every hook plugin and extension feature"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets.

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/399-hook-feature-subtracks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The track files its packets under broad sub-tracks named after a bundle of work (`goal-and-directive-hooks`, `hook-injection-pipeline`, `pi-extensions`, `repo-commit-gates`, `session-turn-boundaries`), not after the feature a reader is looking for. A reader who wants one feature's history must already know which bundle it landed in, and whole packets whose main subject is a hook feature still live in other tracks, so the track is neither complete nor navigable by feature.

### Purpose
One sub-track per feature, one overview that names every feature and the packets that own it, and no packet filed under a bundle name.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ ls -d specs/hooks-plugins-extensions/*/ | wc -l
36
```

The listing holds the feature sub-tracks this packet keeps, the broad sub-tracks it retires, and `hook-platform/` and `retrieval-integrations/`, which stay. `feature-overview.md` is the card-per-feature inventory that the restructure is checked against.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Declare one sub-track per hook, plugin and extension feature, named after the feature, each with its own `z_archive/`.
- Apply the approved move map through `relocate.mjs`: the in-track rows and the whole-packet rows that enter from other tracks.
- Retire the source sub-tracks that empty out, and report the two that keep a held packet.
- Keep `feature-overview.md` as the single card-per-feature overview, with each feature's owning and mentioning packets.
- Repoint the track root metadata at `hooks-plugins-extensions`.

### Out of Scope
- The two held packets - their worktrees hold unmerged or uncommitted work, so they move after those worktrees merge.
- A child phase inside another track's phase parent - a phase cannot leave its parent, so the overview points to it instead.
- A sub-track for the session history lookup - its packet lives in `session-handover/` because the lookup is being folded into the handover.
- Editing packet prose or code - this is a filing change, so every packet moves as it is.
- Pushing - the moves stay in the worktree.

### Held Packets

- 002-session-relaunch-loop (currently `specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop`) moves to `specs/hooks-plugins-extensions/session-handover/` after that worktree merges.
- 012-file-relative-adapter-imports (currently `specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports`) moves to `specs/hooks-plugins-extensions/hook-platform/` after that worktree merges.

`relocate.mjs` assigns the destination number when the move runs, so neither destination number is fixed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/hooks-plugins-extensions/<sub-track>/NNN-*/` | Modify | The in-track map rows change sub-track; `relocate.mjs` renumbers where the map says so. |
| `specs/<other-track>/<sub-track>/NNN-*/` | Modify | The whole-packet rows leave their track and enter `hooks-plugins-extensions/`. |
| `specs/hooks-plugins-extensions/graph-metadata.json` | Modify | `children_ids` is rebuilt from disk and the track identity is renamed. |
| `specs/hooks-plugins-extensions/description.json` | Modify | `specFolder`, `specId` and `folderSlug` name the track. |
| `.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json` | Modify | One ledger batch records each map run. |
| `specs/hooks-plugins-extensions/goal-and-directive-hooks/`, `hook-injection-pipeline/`, `repo-commit-gates/` | Delete | Emptied source sub-tracks are retired once their packets have moved. |

### Move Summary by Sub-Track

The approved pairs live in `scratch/move-map/map.txt`; this is the roll-up by destination. Each count is the expected output of `ls -d specs/hooks-plugins-extensions/<sub-track>/[0-9]*/ | wc -l` once the map is applied, and the two held packets are not counted.

- Packets each sub-track holds once the map is applied: `ask-surface-guard` 1, `decision-capture` 1, `directive-lifecycle` 3, `dispatch` 1, `dist-freshness` 2, `env-secret-guard` 1, `git-hooks` 4, `git-live-follow` 2, `git-preflight-and-message-gate` 2, `git-primary-reconcile` 2, `goal` 3, `hook-platform` 5, `pi-cache-optimizer` 9, `pi-fast-mode` 2, `retrieval-integrations` 1, `session-handover` 1, `skill-advisor` 2, `spec-gate` 1.
- Sub-tracks that hold no packet yet: `classifier-injection-screen`, `codex-watchdog`, `completion`, `git-hooks-check`, `git-worktree-guard`, `hook-install`, `mcp-route-guard`, `overlay-guard`, `permission-policy`, `post-edit-quality`, `session-cleanup`, `session-lifecycle`, `task-dispatch`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every row of the approved map is applied: each `from` path in `scratch/move-map/map.txt` is gone and each `to` path exists. Verify: `while read -r from arrow to; do test -e "specs/$from" && echo "OLD $from"; test -e "specs/$to" \|\| echo "MISSING $to"; done < specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/scratch/move-map/map.txt \| wc -l` prints 0. |
| REQ-002 | The two held packets stay where they are and `spec.md` names each one with its destination: `002-session-relaunch-loop` to `session-handover/` and `012-file-relative-adapter-imports` to `hook-platform/`. Verify: `ls -d specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports \| wc -l` prints 2, and `rg -c '^- 002-session-relaunch-loop\|^- 012-file-relative-adapter-imports' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md` prints 2. |
| REQ-003 | The three source sub-tracks that empty out are retired and the two that keep a held packet remain. Verify: `ls -d specs/hooks-plugins-extensions/goal-and-directive-hooks specs/hooks-plugins-extensions/hook-injection-pipeline specs/hooks-plugins-extensions/repo-commit-gates 2>/dev/null \| wc -l` prints 0, and `ls -d specs/hooks-plugins-extensions/pi-extensions specs/hooks-plugins-extensions/session-turn-boundaries \| wc -l` prints 2. |
| REQ-004 | Every packet in the track passes strict validation. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions --strict --recursive --quiet \| grep '^RESULT:' \| grep -vc '^RESULT: PASSED'` prints 0. |
| REQ-005 | The track root metadata names `hooks-plugins-extensions` in `description.json` and `graph-metadata.json`. Verify: `rg -n '"specFolder": "hooks"\|"specId": "hooks"\|"folderSlug": "hooks"\|"packet_id": "hooks"\|"spec_folder": "hooks"' specs/hooks-plugins-extensions/description.json specs/hooks-plugins-extensions/graph-metadata.json \| wc -l` prints 0. |
| REQ-006 | No metadata store still points at a retired sub-track path. Verify: `rg -l 'hooks-plugins-extensions/(goal-and-directive-hooks\|hook-injection-pipeline\|repo-commit-gates)/' specs --glob 'description.json' --glob 'graph-metadata.json' \| wc -l` prints 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The overview has one card per feature, and every card names its packets. Verify: `grep -c '^## ' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md` prints 31, and `grep -c '^- Packets:' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md` prints 31. |
| REQ-008 | The overview covers every folder under `.skilled/hooks/`. Verify: `for d in .skilled/hooks/*/; do b=$(basename "$d"); grep -q "$b" specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md \|\| echo "$b"; done \| wc -l` prints 0. |
| REQ-009 | The overview covers every `.js` file in `.opencode/plugins/`. Verify: `for f in .opencode/plugins/*.js; do b=$(basename "$f" .js); grep -q "$b" specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md \|\| echo "$b"; done \| wc -l` prints 0. |
| REQ-010 | The overview covers every entry in `.pi/extensions/`. Verify: `for f in .pi/extensions/*; do b=$(basename "$f"); b=${b%.ts}; grep -q "$b" specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/feature-overview.md \|\| echo "$b"; done \| wc -l` prints 0. |
| REQ-011 | Every remaining sub-track directory is declared (`"level": "sub-track"`) and holds a `z_archive/`. Verify: `for d in specs/hooks-plugins-extensions/*/; do test -f "$d/z_archive/.gitkeep" \|\| echo "$d"; grep -q '"level": "sub-track"' "$d/description.json" \|\| echo "$d"; done \| wc -l` prints 0. |
| REQ-012 | `spec.md` points at the approved map and summarises it by sub-track instead of reproducing it. Verify: `rg -c '^### Move Summary by Sub-Track' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md` prints 1, and `rg -c 'move-map/map[.]txt'` on the same file prints 3. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every row of `scratch/move-map/map.txt` has moved: the coverage loop prints 0.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions --strict --recursive --quiet` prints no `RESULT:` line other than `PASSED`.
- **SC-003**: The track root metadata names `hooks-plugins-extensions`, and no metadata store points at a retired sub-track.
- **SC-004**: The overview holds one card per feature and names every folder under `.skilled/hooks/`, every `.js` file in `.opencode/plugins/` and every entry in `.pi/extensions/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `relocate.mjs` refuses to run over uncommitted changes | The moves cannot start | Commit the scaffolding and this packet's docs locally first, then dry-run the map. |
| Dependency | The two held packets sit in worktrees with unmerged or uncommitted work | Their moves would collide with that work | Keep them out of the map, name them in this spec with their destinations, and move them after those worktrees merge. |
| Risk | A packet lands in the wrong sub-track | The track stays misleading | Read every dry-run line against `map.txt` before `--apply`; the move is one local commit, so a reset restores it. |
| Risk | A source track's `children_ids` keeps a moved packet | That track reports drift | `relocate.mjs` refreshes the source track roots in the same run; validate each source track afterwards. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - a filing change runs no service; the only timed step is the recursive validator.
- **NFR-P02**: N/A - no throughput path exists.

### Security
- **NFR-S01**: N/A - no authentication surface; the work is local filesystem and git operations.
- **NFR-S02**: N/A - no user data is read, copied or transmitted.

### Reliability
- **NFR-R01**: N/A - no uptime target; the gate is REQ-004.
- **NFR-R02**: N/A - no request path; a refused run writes nothing and exits non-zero.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a map row whose destination sub-track does not exist yet is not an error, because `relocate.mjs` declares the sub-track in the same run.
- Maximum input: the whole map in one run - `relocate.mjs` moves every pending row and records one ledger batch.
- Failure path: uncommitted changes under a path the run would rewrite make `relocate.mjs` refuse, name each file and write nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 40 packet paths, five source tracks, the track root metadata and the relocation ledger. |
| Risk | 10/25 | No code change; a wrong move is one local commit away from being reverted. |
| Research | 12/20 | The move map and the feature overview were produced and checked before this packet was written. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- `feature-overview.md` has no frontmatter block, so `GREP_CONVENTION` fails the packet while that file is outside this packet's write scope. Decision needed: add a frontmatter block to `feature-overview.md`, or exempt it.
<!-- /ANCHOR:questions -->

---
