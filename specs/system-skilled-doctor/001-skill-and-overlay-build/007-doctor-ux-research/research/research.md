---
title: "Research: doctor overlay logic and external-repo UX"
description: "Five cli-devin iterations on how system-skilled-doctor, its overlay engine and the onboarding path for external repositories can improve, ranked by user impact."
trigger_phrases:
  - "doctor ux research"
  - "overlay engine improvements"
  - "external repo onboarding friction"
importance_tier: normal
contextType: research
---

# Research: Doctor Overlay Logic and External-Repo UX

<!-- ANCHOR:deep-research-doctor-ux -->

## 1. Executive Summary

The overlay engine's backup and rollback design is sound. What lets users down is everything around it.

The copy path in `INSTALL-SKILLED.md` produces a tree that cannot run: it exports no builds and skips the finishing steps the link path has. The engine never checks that the vendored tree really is the commit its manifest names, and re-pin trusts that field as its drift base. The guard hook allows every write it cannot judge. Rollback overwrites the live tree without showing what it replaces. Re-pin backups land inside the folder the guide tells you to commit.

Fixing the six Tier 1 items below would remove the failures a new external repository is most likely to hit. Two of the five questions, command messages (Q2) and docs against code (Q5), were answered only in part. `/doctor:helper` was not examined at all.

## 2. Methodology

- Executor: `cli-devin`, model `deepseek-v4-1-flash-max`, one fresh process per iteration, workspace-write, 1800-second ceiling.
- Five iterations under stop policy `max-iterations`. Convergence was telemetry only.
- newInfoRatio by iteration: 0.72, 0.78, 0.74, 0.76, 0.60.
- Every iteration passed `verify-iteration.cjs`: narrative, route proof and delta present. Write containment reported no writes outside `research/`.
- The orchestrator then re-read the code behind every Tier 1 finding. Section 3 records what that check confirmed.

## 3. Evidence Base

| Finding | Orchestrator check | Result |
| --- | --- | --- |
| Copy path exports no builds | `INSTALL-SKILLED.md` §4 has no build, `npm`, `agents-md`, `mcp`, `git` or `setup` step; `git archive` exports tracked files and `.gitignore` excludes `dist/`, `build/`, `node_modules/` | Confirmed |
| Backups inside the committed overlay folder | `overlay-engine.cjs:3097` writes `path.join(ctx.overlayRoot, 'repin-runs', runId)`; `INSTALL-SKILLED.md:251` says commit the overlay folder; no ignore guidance anywhere | Confirmed |
| Pin never checked against the tree | `classifyDestination` (`overlay-engine.cjs:1783`) compares `state.pin` to `manifest.pin.commit`, two recorded strings; with no state file `loadState` seeds the state from the manifest pin and `state.exists` is false, so `upstream-moved` cannot fire | Confirmed |
| Guard fails open | `overlay-guard.cjs` doc comment: "every error, timeout or unreadable setting allows"; the catch returns `allow` with a note | Confirmed |
| Rollback ignores the live tree | `rollbackUnderLock` hashes the backup copies, then removes and rewrites each path; it never reads the current destination | Confirmed |
| `.env` prefix rule | `isEnvName` is `basename.toLowerCase().startsWith('.env')`, so `.env.example` and `.envrc` match | Confirmed |
| `/doctor:setup` checks neither links nor overlays | `setup.md` names five legs: sk-code, sk-git, trigger index, runtime mirrors, advisor | Confirmed |
| `/doctor:mcp install` run from the checkout registers the checkout | The install table says "the checkout"; `mcp.md` does not state which repository it writes to | Unconfirmed: read the mcp install script's target resolution |

## 4. Ranked Recommendations

Ranked by user impact on an external repository. Tier 1 items are confirmed in Section 3.

### Tier 1: fix first

1. **Make the copy path produce a working tree.** Add the two build commands and the finishing sequence (`agents-md embed`, `mcp install`, `git setup`, `setup`) to `INSTALL-SKILLED.md` §4, or ship a built release archive. Also note that the export leaves out the root `AGENTS.md`. [SOURCE: INSTALL-SKILLED.md:184] (iteration 2, F1 and F2)
2. **Move re-pin backups out of the committed folder.** Write runs under an ignored path such as `.skilled/output/`, or have the engine add `repin-runs/` to the project's ignore file. Today the first re-pin commits a full backup, and a backed-up ignored file such as `.env` becomes committable. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3097] (iteration 2, F5)
3. **Verify the pin against the tree.** Give `status` a tree-level verdict ("these bytes are or are not commit X") by hashing the copied roots against `git ls-tree` of the pin. Have `repin` refuse to use an unverified pin as its drift base. A wrong pin today turns into refusals that name files the user never touched. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1799] (iteration 3, 001 to 003)
4. **Make the guard fail closed when overlays exist.** When a manifest or overlay folder is present and the engine cannot judge a write, deny it with "guard unavailable" rather than allow it. Judge all paths of one tool call in a single engine call, so one 3-second timeout cannot let the rest through. [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:41] (iteration 4, 002 and 004)
5. **Show rollback's diff against the live tree.** Hash each current destination and print a per-path diff before restoring. Refuse unexpected content unless `--force` is passed, and offer `--dry-run`. Today a manual repair made after a failed re-pin is silently overwritten. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3242] (iteration 4, 001)
6. **Narrow the `.env` rule.** Exempt `.env.example`, `.env.sample` and `.envrc`, or let an exact manifest path whitelist one. The current remedy, "move it out of the overlay", is impossible when the file belongs to the upstream folder. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1566] (iteration 1, 001)

### Tier 2: high value, smaller blast

7. Add a link-health leg and, when a manifest exists, an overlay-pin leg to `/doctor:setup`. The guide's triage command gives a green report on a drifted tree. (iteration 2, F4)
8. Settle where `/doctor:mcp install` runs. Either give it a `--root` the install checklist prints, or correct the "Run it from" cell. Confirm first, per Section 3. (iteration 2, F3)
9. Give re-pin a run surface: write a run-status file before the backup, add `repin --list-runs` and `--prune`, and show any unfinished run in `status`. An interrupted re-pin today leaves no durable pointer to its rollback id. (iteration 1, 005; iteration 4, 005)
10. Report new upstream top-level files in the not-copied list, and keep the not-copied set in the sync state, so `status` can show it again later. (iteration 1, 003 and 004)
11. Let re-pin delete an upstream-deleted file that is already missing locally, instead of refusing until it is restored. (iteration 1, 002)
12. Add `/doctor:overlay init --pin <commit>` to write a schema-valid empty manifest. The first copy step today is hand-written JSON with no validation until a later `status`. (iteration 2, F7)
13. Let `capture` absorb a new live file in a `directory` or `skill-root` overlay, or say plainly that new files are created in the overlay source. Today it answers "path is not an overlay destination", which contradicts the ownership check. (iteration 5, F2 and F6)
14. Reject `pinnedSha256` on every scope except `file`, and document the field next to `scope: file` with its two refusal messages. Today it is accepted and ignored elsewhere, and no operator doc mentions it. (iteration 5, F1 and F5)
15. Label a stage run "copy and overlays only; generators not rehearsed", or run the generators on a full stage copy. (iteration 4, 003)
16. Put the `whole` link shape's `specs` warning in the guide's shape table, and add `unlink --list` or have `symlink check` print earlier runs. (iteration 2, F6 and F8)

### Tier 3: messages and docs

17. Rewrite the protected-path troubleshooting row in plain words, with the `protectedPaths` shape inline. (iteration 2, F9)
18. Print the AGENTS.md hint in the not-copied summary only when AGENTS.md is in the list. (iteration 1, 006)
19. Report "nothing to capture" before the `json-entry` refusal, and name the JSON key the row owns. (iteration 5, F3)
20. When `apply` exits on a conflict, list the layout links still outstanding. (iteration 5, F4)
21. Cross-link the guard from `/doctor:overlay`: runtime coverage (OpenCode has no adapter), the two kill switches, and the shell-write bypass. (iteration 4, 006)
22. Give `remove-root` a capture route, or a fix hint that is not destructive, for a file the user recreated on purpose. (iteration 3, 004)

## 5. Verified Strengths

- Rollback restores the pin: `writeBackup` backs up the manifest and the state before `writePin` runs. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2820]
- One touched set drives both the backup and the copy.
- Rollback is fail-closed: any backup byte that fails its sha256 aborts before anything is restored.
- `apply` repairs missing layout links and re-checks a link before replacing it. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2136]

## 6. What This Means for an External Repository

A team that links Skilled gets a coherent path. Its sharp edges are the five-command checklist across two directories and a triage command that does not look at links. A team that copies Skilled gets a tree with no builds, a hand-written manifest, backups that end up in its commits, and no way to ask whether its tree matches its pin. Until Tier 1 lands, the link path is the one to recommend.

## 7. Risks

- Fail-closed guarding (item 4) can block legitimate writes when the engine breaks. It needs a clear message and the existing kill switch.
- A tree-level pin check (item 3) costs a `git ls-tree` and hashing on every `status`. Measure it on a full tree before shipping.
- Moving backups (item 2) changes a documented path in `overlays.md` and `INSTALL-SKILLED.md`. Both must change in the same commit.

## 8. Non-Goals

- No fixes were made. This packet only researches and ranks.
- Barter files were not read.
- Doctor targets outside overlays and onboarding were not examined.

## 9. Scope Notes

- `release-update.cjs` (`/doctor:update`) was not examined. "Upgrade" here means `repin`.
- Whether each guard adapter resolves relative paths against the tree root is unverified.
- Guard spawn cost on large manifests was not measured.

## 10. Methodology Notes

The flash model cited lines precisely and refuted one of its own hypotheses. It marked unverified claims as unverified, as with the `mcp install` target and the `loadManifest` body. Its Q1 and Q3 iterations were the strongest. It spent iterations 3 and 5 on carried residuals rather than on Q2 and Q5.

## 11. Recommendations Summary

Plan a build phase from Tier 1, items 1 to 6. Items 1 and 2 are doc and path changes with low blast radius. Items 3 to 5 change engine and guard behavior and need new tests. Item 6 is a one-function change with a test.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Rollback leaves `pin.commit` advanced | The manifest is backed up before the pin is written and restored with everything else | `overlay-engine.cjs:2820`, repin rollback test | 1 |
| `apply` cannot recreate missing layout links | It partitions layout records and repairs each before regeneration | `overlay-engine.cjs:2128`, `:2136` | 5 |
| Backup coverage gaps on re-pin | Manifest, state, layout links and regenerate outputs are all in the touched set | `overlay-engine.cjs:2484` | 1, 4 |

## Divergence Map

- Saturated directions: none recorded.
- Pivots taken: none. Convergence mode `default`, stop policy `max-iterations`.
- Remaining frontier: Q2 command messages across install, symlink, setup and helper; Q5 doc-against-code diff; `/doctor:helper`; `/doctor:update`.

## 12. Open Questions

- Q2 (partial): a full survey of the operator-visible text of `/doctor:install`, `/doctor:symlink`, `/doctor:setup` and `/doctor:helper`.
- Q5 (partial): a systematic diff of `overlays.md` and `INSTALL-SKILLED.md` against the engine's refusal messages.
- Does `loadManifest` reject unknown keys at all?
- Which repository does `/doctor:mcp install` write to when run from the checkout?

## 13. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: Q1, Q3, Q4 answered; Q2 and Q5 partial
- Last 3 iteration summaries: run 3 pin drift (0.74); run 4 re-pin, guard and rollback (0.76); run 5 pinnedSha256, layout links, capture (0.60)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

## 14. References

- Iterations: `research/iterations/iteration-001.md` to `iteration-005.md`
- Resource map: `research/resource-map.md`
- Code: `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs`
- Docs: `INSTALL-SKILLED.md`, `.skilled/skills/system-skilled-doctor/references/overlays.md`, `.skilled/commands/doctor/{install,symlink,setup,overlay,mcp}.md`

<!-- /ANCHOR:deep-research-doctor-ux -->
