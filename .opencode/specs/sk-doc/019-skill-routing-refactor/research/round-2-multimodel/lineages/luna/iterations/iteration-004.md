# Iteration 4: Nested topology, lifecycle metadata, and resume safety

## Focus
Parent and nested graph metadata, active-child pointers, status truthfulness, duplicate numeric prefixes, and the 14-child `015` sub-parent.

## Actions Taken
- Compared every nested parent's `children_ids` against its on-disk direct packet directories. The parent has 21 children; `020` has 7; `020/007` has 17; and `020/007/015` has 14, with no missing or extra IDs.
- Read the actual resume redirect implementation and executed it read-only from the root parent, `020`, `020/007`, and `020/007/015`.
- Compared each active-child pointer and timestamp with child `last_save_at` values and checked the parent graph status against child packet statuses and checklists.
- Verified that the two `012` names are stored as distinct full packet IDs and that the resume resolver rejects ambiguous bare non-phase pointers.

## Findings

### P1: NEW — the commit's new root pointer leaves the nested resume chain stranded at 020
Evidence: `019/graph-metadata.json:122` now points the parent to `020-router-unification-program`, a line changed by `140266be3e`. The resume contract says parent pointers must redirect through nested parents (`system-spec-kit/README.md:198`), and the real resolver follows the root pointer to `020` but stops there because `020/graph-metadata.json:109` is `null`; `020` has active children including `007` (`020/graph-metadata.json:6-13`, with `007/graph-metadata.json:51` still `planned` despite active descendants). The next nested parent, `020/007/graph-metadata.json:111`, is also `null`. Thus a root resume reaches the new pointer target but not the active implementation descendants; the pointer chain is incomplete. The null nested fields predate the commit, but the new root pointer exposes the incomplete chain as a new resume behavior.

### P1: PRE-EXISTING — the 14-child 015 parent points resume at an older child than later saved work
Evidence: `020/007/.../015/graph-metadata.json:168-169` points to `011-activation-cutover-p4` with `last_active_at` `2026-07-21T02:24:55.215Z`. Child `013-compiled-coverage-buildout/graph-metadata.json:42,210` is still `in_progress` and has a later `last_save_at` of `2026-07-23T12:42:32.775Z`; several other 015 children also have later saves. Running the real resolver from the 015 parent follows the stale pointer to 011, not the latest active child. `015` nevertheless has exactly 14 declared and on-disk children (`graph-metadata.json:6-20`), so the defect is pointer freshness, not child enumeration. No file in this nested subtree was touched by `140266be3e`.

### P2: PRE-EXISTING — nested children expose completion claims while graph/checklist state remains in progress
Evidence: `015/009-sk-doc-template-alignment/spec.md:40` and `implementation-summary.md:22` say Complete, while its `graph-metadata.json:42` says `in_progress` and `checklist.md:67,109` retains unchecked acceptance items. Similarly, `015/013-compiled-coverage-buildout/spec.md:64` and `implementation-summary.md:48` say Complete, while `graph-metadata.json:42` says `in_progress` and `checklist.md:92,124,159` retains open follow-ups. These packets disclose the deferrals, so the graph's conservative status is understandable, but the status surfaces are not synchronized under the parent lifecycle rule (`context-index.md:113-118`).

## Questions Answered
- All nested `children_ids` arrays match the filesystem, including both distinct `012-*` names and all 14 children under 015.
- The duplicate numeric prefix is not itself an active resolver collision: full packet IDs are distinct and the resolver requires a full track-relative path or a complete `NNN-name` segment.
- Resume safety is not complete: the root pointer reaches 020 but cannot descend, and 015's pointer is stale relative to later child saves.
- Similar nested status drift exists in 009 and 013 beyond the direct-child defects found in iteration 1.

## Questions Remaining
- Do the seven live hub manifests, compiled snapshots, and authored registries agree byte-for-byte on identity and mode counts?
- Are there stale cross-document path references outside Markdown link syntax in the nested tree?
- Does a full validator/status pass reveal additional completion-truthfulness defects in children not yet sampled?

## Sources Consulted
- `.opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:112,122`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:6-13,41,109`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/graph-metadata.json:6-23,51,111`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:6-20,48,168-169`
- `.opencode/skills/system-spec-kit/README.md:198`
- `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:195-225`

## Recommended Next Focus
Run an exhaustive status matrix and manifest/registry identity audit across all non-excluded descendants, then re-read every candidate finding before synthesis.

## Ruled Out
- A missing-child or duplicate-`children_ids` defect was ruled out for the parent, 020, 020/007, and 015 nested parents.
- The duplicate `012` numeric prefix causing an actual resolver collision was ruled out; the full packet IDs preserve disambiguation.
