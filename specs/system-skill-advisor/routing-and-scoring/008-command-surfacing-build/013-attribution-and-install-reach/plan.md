---
title: "Implementation Plan: Phase 13: attribution-and-install-reach"
description: "Return injected context from four session readers, decide brief delivery from it and from the Codex approval, fix the scorer's offer, safety and start counts, move the runner's restore to HEAD in a tested module, refuse an unapproved Codex arm, leave a CLAUDE.md pointer on embed, add a delivery leg to /doctor:setup and keep the command fields the OpenCode plugin drops."
trigger_phrases:
  - "attribution and install reach plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: attribution-and-install-reach

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules for the readers, the offer module, the runner, the restore module and the scorer. CommonJS for the doctor engines. YAML and Markdown for the doctor assets and guides |
| **Framework** | The shared session readers (`SR` is `.skilled/hooks/shared/session-readers`), the routing-accuracy scripts of the advisor runtime (`ADV` is `.skilled/skills/system-skill-advisor/runtime`) and the doctor commands |
| **Storage** | None new. The readers read the runtimes' stores read-only and the backfill writes one new log under this phase's `scratch/` |
| **Testing** | `node --test` for the readers and the doctor scripts, Vitest in `ADV`, the scorer summary on the committed phase 007 logs and a temporary git repository for the restore |

### Overview
The readers keep `records` as they are and add `injected`, the text a hook put into the session. `briefDelivered` reads it for Pi, Devin and DSH and asks the existing Codex approval check before it reads Codex. A `--brief-only` backfill recomputes delivery on the committed after arm without replaying offers. The scorer then counts offers on every row and splits the two unknowns, folds a loop without init into `unsafe`, reads the `COMMAND:` line's three states and counts a Claude host-expanded command as a start. The runner gets a restore that resets to HEAD and checks itself, and a Codex preflight. On the install side `embed` leaves a pointer, A10 reports a missing one and `/doctor:setup` gains a delivery leg. Last, the OpenCode plugin's recommendation mapper keeps the command fields the hook mapper keeps, so an OpenCode brief names the command and policy a hook brief names.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each mechanism is read in code and recorded in `spec.md`, with the stores probed read-only.
- [x] Every reader of `offerUnknown` is listed (section 3, affected surfaces).
- [x] Every design question has an autonomous answer in `spec.md` section 10.
- [x] The coordinator confirms phase 011 is committed and phase 012's diff misses every file in `spec.md` section 3. Phase 011 landed in `99b68d8b3d`, and phase 012's commit `d6b6d3bdea` touches none of the files this phase changed.
- [x] T001 and T002 recorded the before numbers.

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met`.
- [x] T034 prints the SC-001 to SC-003 values and T036 holds every floor against `scratch/before.txt`.
- [x] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive facts, one owner each. A reader owns what a store holds, `briefDelivered` owns the delivery verdict, the scorer owns every count and the restore module owns the worktree.

### Key Components
- **`injected`** (`SR/claude.mjs`, `pi.mjs`, `devin.mjs`, `dsh.mjs`): `[{ source, text }]` from Claude `hook_additional_context` attachments, Pi `custom_message` entries, Devin `system` and unflagged user nodes on the walked chain and transcript steps of another source, and DSH `user/message` events whose source kind is not `user`.
- **`codexHookApproval({ projectDir, configPath })`** (`command-offer.mjs`): runs `codex-hook-approval-check.cjs --json` and maps its code to `approved`, `unapproved`, `absent`, `no-hooks` or `unknown`.
- **`briefDelivered`**: Claude unchanged. Pi, Devin and DSH load the session and test records and injected text. Codex answers `false` on `unapproved`, otherwise loads and answers `true` or `unknown`. OpenCode and Cursor `unknown`.
- **`backfillRunLog({ briefOnly })`**: keeps every offer field and recomputes only `briefDelivered`, with `briefBackfilled: true`.
- **`worktree-restore.mjs`**: `statusSnapshot(cwd)` and `restoreTurn({ cwd, before })`. A changed path absent from the snapshot is reset with `git checkout HEAD --` when HEAD holds it, else unstaged with `git rm -r -q --cached --ignore-unmatch --` and deleted. The final porcelain is compared with the snapshot.
- **Runner**: restores through `restoreTurn`, passes the reader at run time, takes `--brief-only` and refuses an unapproved Codex arm before `runArm`.
- **Scorer**: `offerOf` gives `offered` and `offerFieldAbsent` on every row. `scoreRun` adds `briefDelivered`, `offerSeen`, `commandState` and `unsafe: start.unsafe || loop === false`. `normalize` adds an `expanded` event for a Claude user turn's `<command-name>` tag and `startState` counts it.
- **Install**: `embed` writes `@AGENTS.md` in place of a folded `CLAUDE.md` and when none exists on a run that writes. A10 gives INFO `pointer missing`. `/doctor:setup` runs a `delivery` leg.
- **`cliRecommendations`** (`.opencode/plugins/system-skill-advisor.js`): keeps `command`, `policy`, `ownerSkillId` and `needsMode` from each CLI row under the names `renderAdvisorBrief` reads, as `recommendationFromCli` does for the hooks. The plugin is authored in place, so no mirror is regenerated.

### Data Flow
A finished run log goes through `--backfill --brief-only`. For each line the backfill calls `briefDelivered` with the shared reader. The reader loads the stored session and returns `records` and `injected`. Codex lines first ask the approval check about the arena. The new log goes to the scorer, which reads the offer and delivery fields from each line and the events from the session, and prints the per-arm counts.

### Affected Readers of `offerUnknown`
`ADV/scripts/routing-accuracy/score-command-transcripts.mjs` lines 1083, 1102, 1141, 1173, 1200, 1227, 1228 and 1320, `ADV/tests/command-transcript-score.vitest.ts` line 724 and `ADV/scripts/routing-accuracy/README.md` line 109. Historical spec documents and scratch logs under `specs/` also name it and stay as written records.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Session readers (`SR`) | Return `records` without injected text | Add `injected`, records unchanged | T003 to T006, T013, T020 |
| Reader consumers (`score-command-transcripts.mjs`, `command-offer.mjs`, the launcher proxy, session-lifecycle) | Read `ok`, `source`, `records` or `items` | Unchanged. The key is additive | `VSR`, `VALL` |
| `briefDelivered` | Claude and Pi only | Pi, Devin, DSH and Codex | T007, T014, T033 |
| Behaviour runner | Restores from the index, no preflight, no reader at run time | Restore module, preflight, reader, `--brief-only` | T023, T024, T027, T029 |
| Transcript scorer | Offers on uncapped start rows only | Every row, split unknowns, safety fold, `offerSeen`, host expansion | T008, T015, T022, T025, T028, T030, T034 |
| `agents-md-embed.cjs` | Removes a folded `CLAUDE.md` | Leaves `@AGENTS.md` | T009 |
| `agents-md-check.cjs` A10 | Passes an absent `CLAUDE.md` silently | INFO `pointer missing` | T010 |
| `/doctor:setup` | Six legs | Seven legs | T012, T016, T017 |
| OpenCode plugin mapper (`cliRecommendations`) | Keeps `skill`, `confidence`, `uncertainty`, `passes_threshold` and `ambiguousWith` and drops the command fields | Also keeps `command`, `policy`, `ownerSkillId` and `needsMode` | T039, T040, T035 |
| `AGENTS.md`, `.skilled/commands/create/`, routing inputs | Frozen | Unchanged | T037 |

Matrix axes. Delivery: runtime (six) by store state (loaded with brief, loaded without, not loaded) by Codex approval (approved, unapproved, absent, no hooks). Restore: path state before (clean, dirty) by turn action (new file staged, tracked file staged, untracked file, untracked directory, no change). Host expansion: runtime (Claude, other) by tag command (expected, other). Each axis has one case in T007, T011, T014 or T030.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records every floor, the current summaries of the three committed arms and the delivery state of the after arm in `scratch/` (T001, T002). Implementation runs the waves in `tasks.md`: readers, offer module, restore module, scorer, embed, check and the setup leg first, then the reader pass-through, docs and the next scorer steps, then the runner changes one at a time, then wave 7b, which fixes the OpenCode plugin's recommendation mapper once phase 012 is committed, then the measurement with `--brief-only` and the live checks, which now read an OpenCode brief. Verification reruns every floor, checks the boundaries and writes the summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each reader's `injected`, `codexHookApproval`, `briefDelivered`, the brief-only backfill, `restoreTurn`, each scorer count, `offerSeenIn`, the host-expanded start, the embed pointer, the A10 INFO row and the OpenCode plugin head | `node --test`, Vitest in `ADV` |
| Integration | The brief-only backfill of `runs-post-final.jsonl`, the summaries of the after arm, the before arm and the g2 arm, the declarations check, the doctor suites | The runner, the scorer, `jq` |
| Manual | The two read-only checks the delivery leg runs, on this checkout, with the Codex config digest compared before and after | `hook-wiring-check.cjs`, `codex-hook-approval-check.cjs`, `shasum` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 committed | Internal | Open: in build | T019, T031 and T032 collide on the install guide, the capture and its README |
| Phase 012's file list | Internal | Open: planned | A shared file would collide |
| Phase 012 committed and the advisor runtime rebuilt | Internal | Open: planned | Wave 7b waits, because the T039 `needsMode` case needs phase 012's renderer |
| The phase 007 arenas under the system temp folder | External | Present on 2026-11-13 | Codex stays `unknown` in T033 |
| The TypeScript compiler under the spec-kit runtime | Internal | Green | T020 cannot regenerate the declarations |
| `git` on the path | External | Green | T011's fixture cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a floor drops below its line in `scratch/before.txt`, the declarations check is not `current`, or the restore test fails.
- **Procedure**: revert this phase's commits and run `node .skilled/hooks/shared/session-reader-declarations.mjs` to rewrite the declarations. The new log and summaries live in `scratch/` and are deleted with it. No store, arena or home-folder file was written, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 011 committed, phase 012's file list checked | Implementation |
| Implementation | The before numbers in `scratch/` | Verification |
| Verification | Every implementation task | The next behaviour arm, which should run with the new restore and the preflight |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## DECISIONS ALREADY MADE

The autonomous answers are in `spec.md` section 10. Three change what the brief asked for and are recorded here so a reader sees them first. The measurement uses `--brief-only`, because the plain backfill replays offers in temporary arenas. The measured gain is 95 rows, not 96, because one DSH line has no session id. OpenCode stays `unknown`: no marker exists for the committed arm, and a plugin-side marker proves the plugin ran rather than that the host delivered. Two embed test assertions change because scope item E reverses the behaviour they pin, a logic-sync resolved in favour of the scope the coordinator set.
<!-- /ANCHOR:decisions -->
