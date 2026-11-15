---
title: "Goal: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets."
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "feature subtrack restructure goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure"
    last_updated_at: "2026-11-15T06:21:47Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets.

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** File every hook, plugin and extension feature under its own sub-track, with one overview that names each feature and the packets that own it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One sub-track per feature, named after the feature's folder under `.skilled/hooks/`. Every sub-track carries its own `z_archive/`, including a feature that has no packet yet. |
| D2 | `hook-platform/` holds cross-cutting packets, and `retrieval-integrations/` stays as it is. |
| D3 | A whole top-level packet in another track whose main subject is a hook feature moves in. A child phase inside another track's phase parent does not move; the overview points to it. |
| D4 | Two packets are held until their worktrees merge: `session-turn-boundaries/002-session-relaunch-loop` to `session-handover/`, and `pi-extensions/012-file-relative-adapter-imports` to `hook-platform/`. |
| D5 | The session history lookup gets no sub-track of its own. Its packet lives in `session-handover/` because the lookup is being folded into the handover. |
| D6 | Moves run only through `relocate.mjs`, in the worktree, after a local commit. Nothing is pushed. |
| D7 | `feature-overview.md` is the single card-per-feature inventory: one card per feature, including a feature with no packet, and each card names its owning and mentioning packets. |
| D8 | The source sub-tracks that empty out are retired; the two that keep a held packet are reported instead. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every row of the approved map moved: `while read -r from arrow to; do test -e "specs/$from" && echo "OLD $from"; test -e "specs/$to" || echo "MISSING $to"; done < specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/scratch/move-map/map.txt | wc -l` prints 0.
- [ ] The track validates: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions --strict --recursive --quiet | grep '^RESULT:' | grep -vc '^RESULT: PASSED'` prints 0.
- [ ] The track root metadata names `hooks-plugins-extensions`: `rg -n '"specFolder": "hooks"|"specId": "hooks"|"folderSlug": "hooks"|"packet_id": "hooks"|"spec_folder": "hooks"' specs/hooks-plugins-extensions/description.json specs/hooks-plugins-extensions/graph-metadata.json | wc -l` prints 0.
- [ ] The overview covers every feature: the three loops in `acceptance-criteria.md` AC-008, AC-009 and AC-010 print 0, 0 and 0.
- [ ] The two held packets are untouched and named with their destinations: `ls -d specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports | wc -l` prints 2, and `rg -c '^- 002-session-relaunch-loop|^- 012-file-relative-adapter-imports' specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md` prints 2.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` filled; the token count is 0. |
| Pre-move validation baseline | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions --strict --recursive --quiet` printed 70 `RESULT: PASSED` lines and 1 `RESULT: FAILED` line, the failure being this packet. |
| Move map | Done | `scratch/move-map/map.txt` holds 40 rows: 29 in-track and 11 from other tracks. |
| Held packets | Done | 2, both absent from the map: `002-session-relaunch-loop` and `012-file-relative-adapter-imports`. |
| Feature overview | Done | `feature-overview.md` holds 31 cards and 31 `- Packets:` lines. |
| Moves | Pending | Not run. `relocate.mjs --map` refuses over the uncommitted scaffolding, so the local commit comes first. |

### Deviations and findings

| Item | Note |
|------|------|
| The brief's baseline of 39 passed and 0 failed | That count predates the 31 feature sub-track declarations, so it is not the count of the tree as handed over. The tree as handed over validates 71 folders: 70 passed and this packet failed. The brief does not itemise which folders its 39 counted. |
| `feature-overview.md` has no frontmatter block | `GREP_CONVENTION` fails this packet on that file alone. The file is outside this packet's write scope, so it is recorded as an open question rather than edited. |
| The derived metadata cannot repair itself | `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` stay stale because the Draft auto-repair refuses while an authored error exists. Once `feature-overview.md` carries frontmatter, the next `--strict` run sees derived errors only, repairs `description.json` and `graph-metadata.json`, and revalidates. |
| `spec.md` branch field | The scaffold named `scaffold/001-feature-subtrack-restructure`; the real branch is `worktrees/399-hook-feature-subtracks`. |

### Open questions

- Answered: `feature-overview.md` now carries a frontmatter block with trigger phrases, added by the orchestrating session on 2026-11-15, and the packet validates strict.
<!-- /ANCHOR:log -->
