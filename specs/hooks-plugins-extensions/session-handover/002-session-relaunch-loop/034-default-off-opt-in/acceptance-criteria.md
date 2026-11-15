---
title: "Acceptance Criteria: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "default off opt in acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/034-default-off-opt-in"
    last_updated_at: "2026-10-25T17:48:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
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
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/034-default-off-opt-in
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given no `SYSTEM_SESSION_RELAUNCH_ENABLED` in the environment or the config file and no kill switch, When `isHookEnabled('session-relaunch')` runs, Then it returns false | New test in `hook-flags.test.cjs`, red before, green after. Evidence: test "session-relaunch is off by default while every other concern stays on" (`.skilled/hooks/shared/hook-flags.test.cjs:141`) fails in `scratch/red-flags.txt:13` (exit 1) and passes in `scratch/closeout-flags.txt` (27/27, exit 0); `scratch/closeout-resolver.txt` prints `default off: false` | Met | - |
| AC-002 | REQ-002 | Given `SYSTEM_SESSION_RELAUNCH_ENABLED=1` in the environment only, When the resolver runs, Then it returns true | Test in `hook-flags.test.cjs`, green before and after, kept as a guard that the opt-in path works. Evidence: test "turns on when its enable flag is set in the environment" (`.skilled/hooks/shared/hook-flags.test.cjs:150`) passes in `scratch/closeout-flags.txt` (exit 0); it was red in `scratch/red-flags.txt:14` because its falsy rows expected off; `scratch/closeout-resolver.txt` prints `enabled with flag: true` | Met | - |
| AC-003 | REQ-002 | Given `SYSTEM_SESSION_RELAUNCH_ENABLED=1` in the config file only, When the resolver runs with no explicit env, Then it returns true; and Given `0` in the environment with `1` in the file, Then it returns false | Two tests with `HOOK_FLAGS_CONFIG` pointed at a temp file; the second is red before, green after. Evidence: test "turns on from the config file, and the environment still wins" (`.skilled/hooks/shared/hook-flags.test.cjs:159`) sets `HOOK_FLAGS_CONFIG` to a temp file and calls with no env, red in `scratch/red-flags.txt:15`, green in `scratch/closeout-flags.txt` (exit 0); four-reader matrix rows "enabled in file" on and "env 0 over file 1" off in `scratch/closeout-resolver.txt` | Met | - |
| AC-004 | REQ-003 | Given the enable flag set and `SYSTEM_SESSION_RELAUNCH_DISABLED=1` or `SYSTEM_HOOKS_DISABLED=1`, When the resolver runs, Then it returns false | Table test, one row per kill switch. Evidence: test "a kill switch beats the session-relaunch enable flag" (`.skilled/hooks/shared/hook-flags.test.cjs:190`) covers the concern switch, the master switch, the `MK_HOOKS_DISABLED` alias and a file kill switch, green in `scratch/closeout-flags.txt` (exit 0); `scratch/closeout-resolver.txt` prints `enabled + kill switch: false` and the master row off in all four readers | Met | - |
| AC-005 | REQ-004 | Given no enable flag, When the resolver runs for a default-on concern such as `spec-gate`, Then it returns true, and its kill switch still returns false | Guard test, green before and after. Evidence: `.skilled/hooks/shared/hook-flags.test.cjs:144` asserts `skill-advisor` and `session-cleanup` stay on; the pre-existing "enabled by default when no flag is set" passes in `scratch/baseline-flags.txt` and `scratch/closeout-flags.txt`; `scratch/closeout-resolver.txt` prints `spec-gate default: true` and `spec-gate kill switch: false`, same in all four readers | Met | - |
| AC-006 | REQ-005 | Given one input table of env and file values, When the `.cjs`, `.mjs`, `.ts` and `.sh` readers each resolve session-relaunch and one default-on concern, Then every row gives the same answer in all four | Parity test, red before, green after. Evidence: test "the node and shell resolvers give the same session-relaunch answers" (`.skilled/hooks/shared/hook-flags.test.cjs:208`, six rows, `.cjs` and `.sh`) red in `scratch/red-flags.txt:18`, green in `scratch/closeout-flags.txt`; "the facades carry the session-relaunch default" (`.mjs`, `.ts`) red at `scratch/red-flags.txt:17`, green after; the closeout probe runs one seven-row table through all four readers, `mismatching rows: 0`, exit 0, and shows `.mjs` and `.ts` export the same function as `.cjs` (`scratch/closeout-resolver.txt`) | Met | - |
| AC-007 | REQ-006 | Given the enable flag only in the config file, When the Hermes `armPendingRecord` runs on an armable record, Then it arms the record | Test in `hermes-adapters.test.cjs`, red before, green after. Evidence: test "session end arms from a flags-file opt-in alone and arms nothing without it" (`.skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs:606`) runs the arm in a child process with no env seam, the enable flag only in the `HOOK_FLAGS_CONFIG` file: `SYSTEM_SESSION_RELAUNCH_ENABLED=1` arms with one killer spawn, an empty file returns null and leaves the record pending. Red with the `DEFAULT_OFF` entry removed (`scratch/red-hermes-arm.txt`: actual `armed` vs expected `null`, exit 1), file restored and `cmp` exit 0; green in `scratch/green-hermes-arm.txt` (exit 0) and at `scratch/closeout-node.txt:261`. `hermes/session-end-arm.mjs` needed no change because its entrypoint passes no env (`.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:159`) | Met | - |
| AC-008 | REQ-007 | Given the concern not enabled and a Claude transcript over the threshold, When the context nudge runs, Then it emits no nudge text | Test in the relaunch suite, red before, green after. Evidence: test "context-nudge emits nothing when nothing enables the relaunch concern" (`.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:349`, 950 of 1000 tokens, threshold 0.80, then a file opt-in that does nudge) red in `scratch/red-adapters.txt:1` (exit 1), green at `scratch/closeout-node.txt:133` (exit 0) | Met | - |
| AC-009 | REQ-007 | Given the concern not enabled and `SKILLED_LOOP_ID` set, When the CLI `prepare` command runs, Then no relaunch record is written and the command exits non-zero | Test in the relaunch suite, red before, green after. Evidence: test "prepare arms nothing under the loop when nothing enables the relaunch concern" (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:419`) asserts non-zero status, the disabled message and no relaunch file; red in `scratch/red-adapters.txt:2`, green at `scratch/closeout-node.txt:545`; its file opt-in twin passes at `scratch/closeout-node.txt:546` | Met | - |
| AC-010 | REQ-008 | Given the change is in and the tests opted in, When the two node suites and the Pi vitest suite named in plan.md section 5 run, Then each exits 0 with a pass count no lower than the baseline | Command output, exit status and baseline delta. Evidence: node suites 872/872 pass, exit 0 (`scratch/closeout-node.txt:875`), baseline 868/868 (`scratch/baseline-node.txt`), delta +4 new tests; Pi vitest 54/54, exit 0 (`scratch/closeout-vitest.txt:6`), baseline 54, delta 0; hook-flags 27/27, exit 0, baseline 21, delta +6. The opt-in diffs add only the enable variable to each sandbox (`git diff` of the test files) | Met | - |
| AC-011 | REQ-009 | Given the doc surfaces in scope, When grepped for the session-relaunch default, Then each names `SYSTEM_SESSION_RELAUNCH_ENABLED` as the way on and none says the concern is enabled by default | Grep output over README.md, .env.example, hook-flags.env.example, ENV-REFERENCE.md, doctor-env.yaml and the three hook READMEs. Evidence: `scratch/closeout-docs-grep.txt` counts the flag in all eight files plus the three playbooks (1 to 8 hits each); the default-on residue scan hits only other concerns or lines that exclude session-relaunch (`README.md:1408` is the live-sync loop; the flag is named at `README.md:226` and `.skilled/hooks/README.md:69`) | Met | - |

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

**Closeable:** Yes

All eleven criteria are Met with observed evidence: failing-first resolver, parity, silence and Hermes file opt-in tests, green suites against the baseline, and a doc grep. Left out on purpose: the order of the checks in `prepare` outside the loop, which spec.md section 10 keeps open.
<!-- /ANCHOR:closure -->
