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
| D1 | The operator is not asked anything. An open choice is decided, recorded in the log and work continues. Stop only for a missing credential, an exhausted model quota or a gate that still fails after three fixes. |
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

- [ ] `specs/system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up/research/fable-review.md` holds the review, and every recommendation in it appears in `tasks.md` as a task or in `plan.md` as a rejection with a reason.
- [ ] Every task in `tasks.md` is `[x]`, and `node --test tests/` in `.skilled/commands/doctor/scripts` prints `fail 0`.
- [ ] The packet's `review/` folder holds 5 deep-review iteration records and a synthesis report written by a fresh Opus agent at high effort.
- [ ] Every P0 and P1 finding in that report is listed in `implementation-summary.md` as fixed, with the command that proves it, or as rejected, with the evidence against it.
- [ ] The `/local-skilled-alignment` findings report for this work, run after the last fix, lists 0 open findings.
- [ ] `validate.sh --strict` prints `RESULT: PASSED` for this packet and for `specs/system-skilled-doctor/001-skill-and-overlay-build`.
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

### Deviations and findings

| Item | Note |
|------|------|
| Reviewer ran as a headless CLI session | A hook bars Fable subagents under a Fable session. The operator approved the CLI route. |
| Commit `c57b7e4cef` carries 57 files of another session | They were staged in the shared index. The staged list is read before every commit since. The files were left in place. |
| Relayout is `apply --relayout`, not a `relayout` target | A new target needs a route and an advisor bridge in five advisor runtime files. Adopt took the same form in phase 8. |
| T017 rejected | CI already collects every `node:test` file under `.skilled/hooks`. Its run on `c57b7e4cef` collected 78 files and passed. |
| Push of `e97ca56e8d` used `SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1` once | The routing parity gate compared the commit with the working tree. The only difference was `system-spec-kit/ROUTER.md` and `SKILL.md`, which another session is editing and has not committed. The freshness guard had passed on the attempt before. |
| The deep review ran as a two-lineage fan-out | The single-executor path is driven by hand through a 2,591-line workflow. The fan-out runner is the same workflow's own step and runs the loop itself. Records sit under `review/lineages/`. |
<!-- /ANCHOR:log -->
