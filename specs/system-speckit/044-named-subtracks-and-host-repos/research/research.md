---
title: "Deep Research: Named Sub-Tracks and Host-Repository Fixes in Spec-Kit"
description: "Synthesis of a 3-iteration deep-research loop on first-class named sub-tracks (specs/<track>/<sub-track>/<NNN>-<slug>/), a project-owned doctor entry for .env.example, the vendored .skilled/specs link and a host-repository trigger index."
trigger_phrases:
  - "named sub-track research"
  - "spec-kit sub-track design"
  - "host repository trigger index"
  - "project owned doctor entry"
importance_tier: important
contextType: research
---

# Deep Research: Named Sub-Tracks and Host-Repository Fixes in Spec-Kit

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1.0 -->

<!-- ANCHOR:deep-research-named-subtracks -->

## 1. Research Topic

Design first-class named sub-tracks in spec-kit, `specs/<track>/<sub-track>/<NNN>-<slug>/`, and three smaller host-repository fixes, from the Barter handover `barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/005-skilled-harness-support/handover.md`. Item 2 of that handover, writes through a linked specs root, is owned by `specs/system-speckit/037-symlinked-runtime-root` and is out of scope.

Executor: cli-codex, `gpt-6-luna`, reasoning `xhigh`, service tier `fast`. Stop policy: max-iterations (3).

## 2. Executive Summary

A packet inside a named sub-track already works on its own: recursive spec-document and graph-metadata discovery and the trigger-index corpus walk any depth. Every tool that treats a track as a unit stops one level below `specs/`, so a sub-track's packets are skipped by track roots, refresh, the pre-push sweep, recursive validation and archive, and a sub-track folder fails packet validation.

The recommended design makes a sub-track an explicitly declared container: a direct child of a track, with no `spec.md`, carrying its own `description.json` and `graph-metadata.json` with a sub-track level, and registered in its track's `children_ids`. Detection by shape alone cannot tell an intended sub-track from a stray folder.

The three smaller items are concrete: Barter's doctor overlay already shows the project-owned pattern to upstream, the dangling `.skilled/specs` link is a vendoring-only condition that must keep the alias where a host specs root exists, and a host trigger index needs documentation plus an explicit `--index` in the host's Gate 1 command, since the lookup never selects it on its own.

## 3. Key Findings: Where Track Tooling Assumes One Level (Q1)

| Site | Assumption | Effect on a sub-track packet today |
|---|---|---|
| `runtime/cli/lib/track-roots.mjs:38-66`, `:104-130` | Tracks are direct children of `specs/`; only immediate numbered children count | Sub-track and its packets are never discovered as track content |
| `runtime/cli/spec/refresh-track-roots.mjs:72-79` | Accepts only names the reader returned | `--track demo/sub` exits 2 |
| `runtime/cli/spec/sweep-track-roots.mjs:37,69` and `.skilled/scripts/git-hooks/pre-push:576-577` | Delegate to the reader, commit view included | Sub-track drift is never reported or blocked |
| `runtime/cli/spec/create.sh:1012` | Skips the refresh when `--track` holds a `/` | Packet is created, no metadata level is refreshed |
| `runtime/lib/validation/orchestrator.ts:219-223`, `:1340` | Track-root exemption only when the parent folder is named `specs` | Validating a sub-track folder fails packet rules |
| `runtime/cli/spec/validate.sh:186,273,315` | Recursion loops match only `NNN-*` children | `validate.sh specs/<track> --recursive` never reaches sub-track packets |
| `runtime/cli/spec/archive.sh:189-199` (`track_of`), `:207-220` (`is_packet_home`) | One track level; only numbered segments below it | Archive and restore of a sub-track packet fail the home-path check |
| `runtime/lib/graph/graph-metadata-parser.ts:846-856` (`resolveParentId`), `:1734-1740` | Parent derived only from a numbered segment; a null refresh keeps the stored parent with `parent_id_review_required` | A moved packet keeps a stale `parent_id` |
| `runtime/cli/ops/retrofit-convention.mjs:296-298` | `trackOf` groups by two path segments | Sub-track counts fold into the outer track (report only) |
| `hooks/lib/spec-gate/spec-gate-core.mjs:159`, `hooks/pi/spec-gate-enforce.ts:12`, `commands/speckit/search.md:108`, `README.md:227,241`, `commands/speckit/assets/speckit-implement.yaml:116` | Examples and grammar show only `specs/<track>/<NNN>` and numeric phase nesting | Documentation and prompt gap, not a runtime blocker |

Compatible already, and to be covered by regression tests rather than changed: `handlers/spec-doc-discovery.ts:161-183,290-312` (recursive to depth 20) and `cli/retrieval/lib/corpus.mjs:257,314` (recursive corpus walk). `create.sh:1302-1306` and `:1460-1474` already number from the chosen folder, so `--track track/sub` numbers within the sub-track.

## 4. Key Findings: The Sub-Track Contract (Q2)

1. **Declared, not inferred.** A sub-track is a direct child of a recognized track with no `spec.md`, a paired `description.json` and `graph-metadata.json`, `description.json` level set to a sub-track value, and an entry in the track's `children_ids`. `description-schema.ts:77` already accepts a string level; `graph-metadata-schema.ts:136-152` has packet-shaped identity and needs a container discriminator.
2. **Identity.** The sub-track's id is `track/sub-track`, used for both metadata files. Its `parent_id` is the track. Packets inside keep their full path identity, and their `parent_id` is the sub-track, which needs `resolveParentId` extended to recognize a declared sub-track parent.
3. **Children.** A track lists its direct packets and declared sub-tracks. A sub-track lists only its immediate numbered packet roots. A numbered phase parent inside a sub-track is one entry; its phases stay owned by that parent.
4. **Archive.** A sub-track has its own `z_archive/`, excluded from discovery.
5. **Numbering.** `NNN-slug` numbering continues per folder, so each sub-track numbers independently. Barter's priority bands can live inside that without spec-kit enforcing them.
6. **Undeclared folders are diagnosed.** A non-numbered folder that lacks the declaration is reported, never promoted or silently skipped.
7. **Symlinks agree in both views.** `readWorkingTreeTracks` follows a symlinked track (`track-roots.mjs:47,65`) while `readCommitTracks` skips mode `120000` (`:111`). A symlinked sub-track needs one explicit policy, the same in both views, because the pre-push gate reads the commit view.

## 5. Key Findings: Failing-First Test Plan (Q3)

One isolated fixture: an outer track, a flat packet, a declared sub-track, a numbered phase parent inside it with one phase child, the sub-track's `z_archive/`, an empty undeclared folder and a symlinked sub-track pointing outside the fixture. Existing seams: `cli/tests/track-roots.vitest.ts:15,103`, `cli/tests/archive-track.vitest.ts:92`, `cli/tests/repair-derived.vitest.ts:334`.

1. **Track roots, refresh, sweep:** the track's metadata lists the sub-track once; the sub-track lists only its immediate packets; `refresh-track-roots.mjs --track track/sub` exits 0; the undeclared folder is reported; working-tree and commit views agree on the symlink.
2. **Create and validate:** `create.sh --track track/sub` numbers inside the sub-track and refreshes both levels; `validate.sh specs/track --recursive` reaches the nested phase; validating the sub-track folder passes; flat-track numbering and validation stay identical.
3. **Archive and repair:** archive and restore a packet and a phase parent through the sub-track's `z_archive/`, refresh the right levels, keep archives out of discovery; moving a packet into or between sub-tracks recomputes `parent_id` or fails closed for review.
4. **Host items:** see sections 6 to 8.

## 6. Key Findings: Project-Owned Doctor Entry (Q4)

Barter's overlay already implements the pattern: `.env.example` carries `project_owned: true` in its manifest (`barter-overlays/doctor/symlink-manifest.json:5`), the engine reports `project-owned` and keeps the host's real file with no link action (`symlink-engine.cjs:662,875`), and a test proves the bytes are unchanged (`tests/symlink-engine.test.cjs:416`). Upstream has no such entry (`.skilled/commands/doctor/assets/symlink-manifest.json:13`), and its engine reports a real file as local and refuses it where a link is required (`symlink-engine.cjs:664,874`).

Upstream the flag, the status and the keep behavior, then make the post-install check accept `project-owned` as success. `/doctor:setup` has no symlink-engine leg (`doctor-setup.yaml:53-60`), while `/doctor:install` runs the symlink check (`install.md:74`), so the acceptance belongs at the symlink validation boundary. The test asserts status and unchanged bytes without opening any `.env` file.

## 7. Key Findings: The Vendored `.skilled/specs` Link (Q5a)

`.skilled/specs` is a tracked link to `../specs`. The no-host-specs failure was not reproduced: both the Skilled checkout and the mounted Barter tree have the adjacent folder. Removing the link from the canonical tree conflicts with the spec-gate root list (`spec-gate-core.mjs:1386`) and repo-root sentinel handling (`shared/workspace/repo-root.mjs:45`), and the graph parser distinguishes `.skilled/specs` from a canonical root (`graph-metadata-parser.ts:929`). Keep the alias where a host specs root exists, and have vendoring or setup omit or tolerate it when none does. Test both fixtures, with and without a host `specs/`, and require no dangling link after setup.

## 8. Key Findings: Host-Repository Trigger Index (Q5b)

The generator already takes `--repo-root` and `--out` (`generate-trigger-index.mjs:30-33`) and the lookup takes `--index` (`lookup-trigger-index.mjs:18,267`), but the lookup's default path is anchored to its own script (`:51`) and the Gate 1 instruction passes no `--index` (`AGENTS.md:51`). A host index is therefore never selected on its own. Document a host mode: generate into the host's `.speckit-index/trigger-index.json`, pass that path explicitly in the host's Gate 1 command, and point the freshness check at the same file. Keep the packaged index as the default. Test with a phrase present only in host content.

## 9. What Worked

- Reading the shared reader first, then every caller, gave a complete map of the one-level family in iteration 1.
- Comparing Barter's overlay with upstream line by line made the project-owned design concrete.
- The adversarial third pass tightened the detection rule from shape-based to declared and surfaced the symlink and parent-repair gaps.

## 10. What Failed / Limitations

- Iteration 1 reported the two Barter reference files as not found; iteration 2 read and cited them, so the gap closed within the run.
- No test was run and no code changed; every claim is a code reading. The orchestrator re-checked the parent derivation, create numbering, description level schema and upstream manifest against current code.
- The vendored no-specs case was not reproduced.

## 11. Recommendations

1. Implement sub-tracks as the declared container in section 4, starting from the red tests in section 5, in the order: metadata schema and `resolveParentId`, track roots and commit view, refresh and create, validation exemption and recursion, archive, repair-derived move.
2. Upstream Barter's project-owned doctor entry with its test, then remove Barter's overlay.
3. Make vendoring or setup tolerate a missing host `specs/` instead of removing the canonical link.
4. Document host index mode and the explicit Gate 1 `--index`.
5. Update the search guide, README, spec-gate examples and phase grammar to show the sub-track level.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Detect a sub-track by shape alone (named folder holding numbered packets) | Cannot tell an intended sub-track from a stray folder, which must stay reported | `track-roots.mjs:56`, handover test list | 2, 3 |
| Treat recursive document discovery as a blocker | It already walks to depth 20 | `spec-doc-discovery.ts:161-183` | 1, 2, 3 |
| Remove `.skilled/specs` from the tracked tree | Breaks the spec-gate root list and repo-root sentinel handling | `spec-gate-core.mjs:1386`, `repo-root.mjs:45` | 3 |
| Rely on `repair-derived` to fix a moved packet's parent | It keeps the stored parent and only clears it on archive | `graph-metadata-parser.ts:1734-1740`, `repair-derived.cjs:452-459` | 3 |
| Have the lookup find a host index automatically | Its default path is anchored to the vendored script | `lookup-trigger-index.mjs:51` | 2, 3 |

## Divergence Map

No divergent pivots were taken; the run used default convergence mode with a max-iterations stop policy. Saturated directions: none. Remaining frontier: the vendored no-specs reproduction, and the exact graph-metadata container discriminator.

## 12. Open Questions

- What field and value mark a sub-track container in `graph-metadata.json`, and does the schema change need a migration for existing track roots?
- Should a symlinked sub-track be skipped with a diagnostic in both views, or followed in both?
- Does any host vendor Skilled without an adjacent `specs/` today, or is the dangling link only a theoretical case?

## 13. Configuration

- Iterations: 3 of 3 (stop policy max-iterations)
- Executor: cli-codex `gpt-6-luna`, `xhigh`, `fast`, workspace-write sandbox, 2400 s timeout
- Convergence threshold: 0.05; mode default
- New-info ratios: 0.62, 0.74, 0.55

## 14. Scope Notes

Read-only outside this spec folder. No `.env` file was opened. Item 2 of the handover belongs to packet 037.

## 15. Sources Referenced

- `research/iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`
- Barter handover and research note, both read-only (paths in section 1)
- `research/resource-map.md`

## 16. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1: inventory of one-level assumptions (0.62); run 2: sub-track contract, test plan and host items (0.74); run 3: adversarial verification (0.55)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

## 17. Next Steps

Run `/speckit:plan` on `specs/system-speckit/044-named-subtracks-and-host-repos` to turn sections 4 to 8 into a plan, starting with the red tests in section 5.

<!-- /ANCHOR:deep-research-named-subtracks -->
