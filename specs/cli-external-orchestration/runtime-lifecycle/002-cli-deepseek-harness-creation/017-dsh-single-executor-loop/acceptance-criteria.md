---
title: "Acceptance Criteria: Phase 17: dsh-single-executor-loop"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh single executor loop acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/017-dsh-single-executor-loop"
    last_updated_at: "2026-11-14T10:25:58Z"
    last_updated_by: "orchestrator-worker"
    recent_action: "Marked AC-009 Met from the live five-iteration review"
    next_safe_action: "Start phase 018"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-dsh-single-executor-loop"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 17: dsh-single-executor-loop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `017-dsh-single-executor-loop`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given edits E4 to E7 and E18 to E19 are applied, When the branch contract test runs, Then it reports no refusal text and no missing `buildLineageCommand`, `DSH_HOME`, `SYSTEM_SPEC_GATE_DISABLED`, `REPOSITORY ROOT` or `validateDshCompletion` in either `:auto` YAML | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/executor-branch-contract.vitest.ts` prints `Tests  6 passed (6)`. Observed: the touched run printed `Tests  13 passed (13)`, this file included. | Met | - |
| AC-002 | REQ-002 | Given a dsh executor with `DSH_SPEC_FOLDER` and `DSH_INHERITED_PROBE` in the parent env, When `runAuditedExecutorCommand` runs with `dispatchEnv` naming `DSH_HOME`, `DSH_SPEC_FOLDER`, `SYSTEM_SPEC_GATE_DISABLED` and `AI_SESSION_CHILD`, Then the child sees the four named values and no probe | receipts test cell `dsh branch style: dispatchEnv reaches the child past the allowlist, an inherited DSH_ key does not` passes. Observed: the cell passed in the touched run. | Met | - |
| AC-003 | REQ-003 | Given a child that exits 0 after printing `did not activate` on stderr, When the runner runs with `completionCheck: validateDshCompletion`, Then the state log ends with a `crash` dispatch failure whose detail is `reported a plugin that did not activate` and the runner returns 0 | receipts test cell `dsh branch style: a completionCheck reason on a clean exit records a crash dispatch_failure` passes, and `scratch/dsh-branch-smoke.py` in `inactive` mode prints that failure for both YAMLs. Observed: the cell passed and the smoke printed the `crash` failure for both YAMLs. | Met | - |
| AC-004 | REQ-004 | Given a stub `dsh` on `PATH`, When the rendered dsh branch of each `:auto` YAML runs, Then it exits 0 from the artifact directory and the temp home no longer exists | `python3 scratch/dsh-branch-smoke.py <repo root> <empty temp folder> ok <yaml>` prints `exit 0`, `cwd_is_artifact_dir True`, `home_removed_after_run True`, `"gateDisabled": "1"` and `"promptStart": "REPOSITORY ROOT:"` for both YAMLs. Observed: all four values printed for both YAMLs, with the temp folder inside the worktree. | Met | - |
| AC-005 | REQ-005 | Given the edited YAMLs, When the branch contract test slices each dsh branch, Then it finds no bare `dsh` word | the same test run as AC-001, with the `bare dsh word` gap absent, and AC-004 printing no `recursion-guard-ancestry` refusal. Observed: no `bare dsh word` gap and no refusal in the smoke. | Met | - |
| AC-006 | REQ-006 | Given E8 to E15 are applied, When the presentation files and `fanout-executor.md` are searched, Then none says fan-out only or that a single run exits 2, and the reference names the single `:auto` path | `rg -n "fan-out only\|exits 2, so give" .skilled/commands/deep/assets/*-presentation.txt` prints nothing and `rg -c "workflows have no dsh branch" <fanout-executor.md>` prints 1. Observed: the search printed nothing and the count printed 1. | Met | - |
| AC-007 | REQ-007 | Given the two `--write` compiles ran, When the drift checker runs per command, Then each prints OK | `check-contract-drift.cjs --command deep/review` and `--command deep/research` each print `[CONTRACT DRIFT] OK commands=1`. Observed: both printed `[CONTRACT DRIFT] OK commands=1`. | Met | - |
| AC-008 | REQ-008 | Given all edits, When typecheck, the YAML loads and the touched and full suites run, Then nothing regresses | `npm run typecheck` exits 0, both YAMLs load, touched tests print `Tests  13 passed (13)` and the full suite prints `Test Files  173 passed (173)` and `Tests  2894 passed \| 8 skipped (2902)`. Observed: all of it, 220.57 s, exit 0. | Met | - |
| AC-009 | REQ-009 | Given dsh 0.2.2-rc.1 and an LLM Gateway key, When `/deep:review <small spec folder> :auto --executor=cli-deepseek-harness --model=deepseek-v4.1-flash-1017 --max-iterations=1` runs, Then the artifact directory holds `iterations/iteration-001.md` and the state log holds a `"type":"iteration"` record written through the append gateway, with no `dispatch_failure` event and no `dsh-home-*` folder left in the system temp folder | `ls <artifact_dir>/iterations/iteration-001.md`, `rg -c '"type":"iteration"' <artifact_dir>/deep-review-state.jsonl` prints 1 or more, `rg -c dispatch_failure` on the same log prints nothing. Observed: In the five-iteration `/deep:review` at `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/review/` (built on `1bedb33577`, recorded in `aab544ae11`), `ls iterations/iteration-001.md` exits 0, `rg -c '"type":"iteration"' deep-review-state.jsonl` prints 5, `rg -c dispatch_failure` on the same log prints nothing with exit 1, no `dsh-home-*` folder newer than 2026-11-14 11:00 is in `os.tmpdir()`, and each `dispatch-receipts/dispatch-review-i{1..5}-g1.completion.json` holds `exitStatus` 0, `signal` null and executor kind `cli-deepseek-harness` with the artifact directory as cwd. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes.
<!-- /ANCHOR:closure -->
