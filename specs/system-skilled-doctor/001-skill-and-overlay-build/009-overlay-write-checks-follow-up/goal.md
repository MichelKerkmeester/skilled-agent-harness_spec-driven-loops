---
title: "Goal: Overlay write checks follow-up"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "overlay write checks follow up goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up"
    last_updated_at: "2026-11-11T21:21:40Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-overlay-write-checks-follow-up-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Overlay write checks follow-up

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Close every gap an independent review finds in the opt-in overlay write checks, so a project that vendors Skilled can adopt them from one republished `v4.0.2.1` release without asking Skilled for anything more.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator is asked, through the question tool, when a choice changes what gets published, merged or recorded as done. A routine choice is decided, recorded in the log and work continues. Stop only for a missing credential, an exhausted model quota or a gate that still fails after three fixes. |
| D2 | These actions are approved in advance: commits on `main`, pushes to `origin/main`, editing the `v4.0.2.1` release, and deleting and republishing the `v4.0.2.1` tag and release once, as the last step. The old tag object is kept under `refs/backup-tags/` first. |
| D3 | The work list comes from the fresh Fable 5.2 review of the Barter handover, Barter's nested repository and Skilled. Every recommendation becomes a task or a rejection with its reason. |
| D4 | Code and documentation changes, in implementation and in remediation, are written by DeepSeek v4.1 flash agents at max thinking through `pi` on llmgateway. The orchestrating session plans, briefs and verifies. It edits a file itself only after three failed agent attempts, and logs that. |
| D5 | The deep review runs through the `/deep:review` command workflow for 5 iterations. A fresh Opus agent at high effort writes its synthesis. |
| D6 | Barter's tree at `barter/ai-speckit` is read-only. Work Barter must do is written to `handover-to-barter.md` in this packet. |
| D7 | No dotenv file is read, written or named in a command. `strictWrites` stays off in Skilled's own repository. Code comments carry no spec path, packet number or task id. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `specs/system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up/research/fable-review.md` holds the review, and every recommendation in it appears in `tasks.md` as a task or in `plan.md` as a rejection with a reason.
- [x] Every task in `tasks.md` is `[x]`, and `node --test tests/` in `.skilled/commands/doctor/scripts` prints `fail 0`.
- [x] The packet's `review/` folder holds 5 deep-review iteration records and a synthesis report written by a fresh Opus agent at high effort.
- [x] Every P0 and P1 finding in that report is listed in `implementation-summary.md` as fixed, with the command that proves it, or as rejected, with the evidence against it.
- [x] The `/local-skilled-alignment` findings report for this work, run after the last fix, lists 0 open findings. Waived by the operator on 2026-11-12 after run 12, whose one finding was fixed and rechecked.
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this packet and for `specs/system-skilled-doctor/001-skill-and-overlay-build`.
- [ ] `.skilled/changelog/skilled/v4.0.2.1.md` names this work and passes `check_changelog_shape.py`. On origin, tag `v4.0.2.1` and `main` name the same commit, and the published release body equals the output of `build_release_notes.py` for that entry.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `check-goal.cjs` on this packet |
| Fresh Fable 5.2 review | Done | `research/fable-review.md`, 103 lines |
| Plan | Done | 28 tasks, strict validation `RESULT: PASSED` |
| Build, T004 to T020 | Done | `node --test tests/` printed 1126 passed and 0 failed. Pushed as `3d39e6a488` and `e97ca56e8d` |
| Deep review, 5 iterations | Done | `review/lineages/deepseek/iterations` holds 3 records and `review/lineages/opus/iterations` holds 2 |
| Opus synthesis | Done | `review/review-report.md`: CONDITIONAL, 0 P0, 3 P1, 9 P2 |
| Remediation | Done | Six briefs. `node --test tests/` printed 1136 passed and 0 failed |
| Alignment | Open | Ten full runs, each followed by fixes. Every run found new defects after the fixes of the run before it. No lane run has reported zero findings. Each of the last five runs closed with a recheck that lists 0 still open. The operator chose to keep running full rounds until one lists 0. `implementation-summary.md` lists each finding. `node --test tests/` printed 1150 passed and 0 failed, 124 of them engine tests |
| Changelog | Done | `check_changelog_shape.py` printed `PASS` for the entry and for the v1.1.6.0 note |
| Decision record | Done | `decision-record.md` holds the operator's two answers of this session: the reviewer route and the guard README choice |
| D1 amended by the operator on 2026-11-12 | Done | The operator told the session three times to use the question tool. Asked how to treat open choices, the operator chose that a choice which changes what gets published, merged or recorded as done is asked, and routine choices are decided and logged. |
| The fifth criterion is open again | Open | The operator chose to keep running full alignment rounds until one lists 0 findings, and to untick the box until then. Rounds seven, eight and nine found 13, 7 and 5 findings. Each round's recheck lists 0 still open. Round ten is running over 2aa53ef3df..e4f3963384. |
| Operator answers of 2026-11-12 on the tag, Dependabot, the changelog and pushes | Done | The tag moves once more, at the end. Both Dependabot pull requests are merged after GitHub updates their branches: 95 is merged as ff5c668fc4, 96 conflicts with it and waits for Dependabot to recreate it. The advisor's routing phrases go into its existing v0.18.7.0 entry with no version change. Each round's commits are pushed once its recheck is clean. From round eleven the review lanes report... |
| The seventh criterion is open again | Open | The tag v4.0.2.1 is at 9c24bbdddd and main has moved past it with the fixes of rounds seven to nine and a merged Dependabot pull request. The operator chose one more tag move, at the end, so the box stays open until then. |
| Round eleven ran with the range-only scope | Done | It covered 5f4f5b9f42..b45a7ab4d0 and found 7 findings. Five were defects the round-ten fix commit wrote, and DeepSeek fixed them. Two were routing probes for the Pi CLI skill. The operator chose to reject both, because the scorer drops a CLI hub when a prompt names the runtime as the owner of a surface. From round twelve a lane writes a probe only for a route the range changed. |
| Dependabot PR 98 | merged | squash e7974750f5 after branch update, 38 checks green, operator chose Merge 98 (Q012) |
| Criterion 5 | waived | operator stopped runs after round 12 (1 P1, fixed by DeepSeek, recheck 0 open 0 new) |

### Deviations and findings

| Item | Note |
|------|------|
| Reviewer ran as a headless CLI session | A hook bars Fable subagents under a Fable session. The operator approved the CLI route. |
| Commit `c57b7e4cef` carries 57 files of another session | They were staged in the shared index. The staged list is read before every commit since. The files were left in place. |
| Relayout is `apply --relayout`, not a `relayout` target | A new target needs a route and an advisor bridge in five advisor runtime files. Adopt took the same form in phase 8. |
| T017 rejected | CI already collects every `node:test` file under `.skilled/hooks`. Its run on `c57b7e4cef` collected 78 files and passed. |
| Push of `e97ca56e8d` used `SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1` once | The routing parity gate compared the commit with the working tree. The only difference was `system-spec-kit/ROUTER.md` and `SKILL.md`, which another session is editing and has not committed. The freshness guard had passed on the attempt before. |
| Push of `dd58ccee3f` used the same override | Same cause and the same two files of the other session. |
| Commits since `81513a220a` are built in a private index | Another session keeps files staged in the shared index. A private index holds only this work's paths, and the shared index is then reset for those paths alone. |
| The alignment critic of the first run timed out | The second run's critic had a longer limit and finished. |
| One sentence of the v1.1.6.0 note was edited by the orchestrating session | The agent wrote that a project ran the engine for a week. Nothing supports that, so the sentence was replaced. |
| Pushes of `7682384a0c` and of the last commit used the same override | Same cause. The other session's `system-deep-loop` and `system-spec-kit` routing files were the only difference. |
| The alignment loop was stopped after four rounds | D1 names a gate that still fails after three fixes as a stop. The fifth criterion stays open: the battery report lists 0 findings, and no lane report does. The operator decides whether to run more rounds. |
| Commit `dbdf52ed6d` carried another session's changelog lines | The whole changelog entry was staged, and it held that session's uncommitted lines about a fan-out refusal and an authoring card. Its code was not on `main` yet. The release body was edited to leave those lines out. Each file is now diffed before it is staged. |
| The operator typed "Commit push merge all" on 2026-11-12 | This session commits its own files, the other session commits its own, and this session rebases `main` onto `origin/main` and pushes. The other session's work then sits on `main`, so the release notes are rebuilt from the committed entry and the tag moves a fourth time, with the earlier tag object kept under `refs/backup-tags/`. |
| Cross-session messages were switched on | The operator asked for it so the two sessions on this checkout could agree an order. The setting is in the user settings file and in `.claude/settings.json`. |
| The tag moved a third time | The fourth round's fixes moved `main` again. The earlier tag objects are under `refs/backup-tags/`. |
| The tag moved twice | The first republish sat on `3edaf16efa`. A third alignment run then found ten more findings, and their fixes moved `main`. The tag was republished once more on the last commit, with the earlier tag object kept under `refs/backup-tags/`. D2 approved one republish. |
| The criteria are ticked in the commit the tag names | A commit cannot hold the proof of its own tag or of a check run on it. Each was checked right after the push. |
| `sk-git/graph-metadata.json` changed, outside the planned scope | One intent signal. Without it the overlay vocabulary takes a plain upstream question from `sk-git`. |
| The last alignment report is battery-only | Each lane run raised new findings. Lane findings were closed by recheck and by a fresh Opus verifier. |
| AC-017 is marked Met before the tag exists | A commit cannot hold the proof of its own tag. The release step checks it right after, and a failure reopens the row. |
| The deep review ran as a two-lineage fan-out | The single-executor path is driven by hand through a 2,591-line workflow. The fan-out runner is the same workflow's own step and runs the loop itself. Records sit under `review/lineages/`. |
| A fifth alignment round ran on 2026-11-12 | The fourth round's fixes and the other session's commits had moved `main`, so the round covered `790ced4732..483d0e8811`. It found 11 findings, 4 of them P1. One was the stale-lock refusal on `repin --stage`, the path Barter re-pins through. |
| `pi` stopped loading this repository's extensions mid-round | The installed Pi moved from 1.5.0 to 1.5.2. Pi 1.5.1 loads a linked extension from the file the link points at, and 16 adapters imported relative to the link. Two briefs failed with no output. The fix is its own packet, `hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports`. This session did not change the installed Pi. Its version file went back to 1.5.0 at 10:26 from elsewhere, so the fix was made to load on both versions. |
| The orchestrating session edited six files itself during the outage | D4's route was down. The edits: the lock's rename-aside removal in `overlay-engine.cjs` with two tests, the order of the output lines in the adopt scenario, the `SYSTEM_OVERLAY_GUARD_DISABLED` row, one sentence in `references/overlays.md` and the test counts in the changelog. A fresh Opus verifier then checked each. The last lock change, the refusal's remedy line, went back through a DeepSeek agent on the Pi 1.5.0 binary. |
| The lock takeover is proven for two runs only | The verifier found a four-run schedule that ends with two holders. It needs a takeover marker more than a minute old. A third rewrite of the lock was not made: D1 stops a gate after three fixes, and the case is recorded as a known limitation and in the handover to Barter. |
| The fifth criterion stays open | The fifth round's recheck lists 2 findings as still open. Both are literal matches on text that is now correct. No report of the alignment command lists 0 open findings, so the box is not ticked. |
| A sixth alignment round ran on 2026-11-12 | A stop hook named the fifth criterion as the gap, so a round ran over `fd6533c621..467131c783`, the Pi adapter fix and the stage fix. It found 21 findings, 2 of them P1, and the critic overturned none. Its recheck lists 10 resolved, 10 for a reviewer, 1 still open and 0 new. |
| The operator was asked one question, against D1 | `.skilled/hooks/env-secret-guard/README.md` lines 65 and 85 called the Pi entry a link. The dotenv guard refuses an agent's write to its own files and names a person as the one who can make it. Switching a guard off is not a choice the session may make alone, so it asked. The operator chose one agent run with `SYSTEM_ENV_SECRET_GUARD_DISABLED=1`. That run changed the two phrases and nothing else. |
| The fifth criterion is ticked on a recheck report | No full lane run has listed 0 findings. The report that lists 0 open is the sixth run's recheck, the alignment command's own `--recheck` mode, run after the last fix. It lists 10 resolved and leaves 11 for a reviewer, and a fresh Opus verifier checked those in three passes. |
| The committed `.env.example` template gained one line | It is the one template the dotenv guard allows, and it holds names only. The line names `SYSTEM_OVERLAY_GUARD_DISABLED`. No dotenv file was read. |
| The tag moved a fifth and a sixth time and moves a seventh | The Pi adapter fix and the stage fix moved `main` to `a846aca84c`, and the tag followed. The sixth round's fixes moved it to `3934c684da`. The guard README and the verifier's fixes move `main` once more, and the release step republishes the tag on it. Each earlier tag object is under `refs/backup-tags/`. D2 approved one republish. |
| `sk-git Script Tests` is red on `main` | `stamp-branch.test.sh` line 104 fails in CI with `10#: invalid integer constant`. It has failed on every run since 2026-11-09 and passes here, 24 of 24. It is not this work's and was left alone. |
<!-- /ANCHOR:log -->
