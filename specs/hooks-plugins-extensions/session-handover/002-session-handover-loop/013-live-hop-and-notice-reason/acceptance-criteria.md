---
title: "Acceptance Criteria: Phase 13: live-hop-and-notice-reason"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "live hop and notice reason acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/013-live-hop-and-notice-reason"
    last_updated_at: "2026-10-20T05:00:00Z"
    last_updated_by: "worker"
    recent_action: "Added the shell shim and outside-loop criteria, Met with evidence"
    next_safe_action: "Merge worktree 158 to main"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/killer.cjs"
      - ".skilled/hooks/session-relaunch/tests/killer.test.cjs"
      - ".skilled/bin/skilled-loop-shell.sh"
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 13: live-hop-and-notice-reason

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/013-live-hop-and-notice-reason
**Level:** 2
**Status:** Complete
**Date:** 2026-10-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a manual template with no note placeholder, When the killer times out, Then its notice carries a subtitle that says the template was ignored and why, and its title names the timeout | Evidence: `.skilled/hooks/session-relaunch/lib/killer.cjs:518`, `:525`; `.skilled/hooks/session-relaunch/tests/killer.test.cjs:2032`. The subtitle parses to `Manual template ignored: SKILLED_LOOP_MANUAL_TEMPLATE holds no @@HANDOFF@@ placeholder where the manual command needs exactly one`. `osacompile` rc 0 on a title and subtitle line | Met | - |
| AC-002 | REQ-001 | Given a usable manual template, When the killer times out, Then its notice has no subtitle | Evidence: `.skilled/hooks/session-relaunch/tests/killer.test.cjs:1986` | Met | - |
| AC-003 | REQ-002, REQ-004 | Given the final tests and docs, When the pre-phase killer is swapped in and the docs are read against the code, Then both notice tests fail, every suite passes on the phase killer and the docs describe the new notice | Evidence: pre-phase killer from `git show HEAD`: 2 tests, 0 pass, 2 fail; restored and `cmp` rc 0. Final gate: 566 tests, 566 pass, 0 fail, rc 0. `.skilled/hooks/session-relaunch/README.md:107`, `:192`; `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:136`, `:148`; the scenario prints PASS; `validate_document.py` rc 0 on both | Met | - |
| AC-004 | REQ-003 | Given a Claude session started by `skilled-loop` in tmux, When it nears its context limit and hands off, Then the wrapper relaunches it and the new session claims the note | Evidence: in this worktree on 2026-10-20, `relaunch.log` shows `prepare loopId=26027` at 04:16:14Z, `killer-signal` SIGTERM at 04:16:20Z and `relaunch reason=ready` at 04:16:20Z. The receiving Claude session started with the claim seed, and the note `20261020T041602Z-b095a61f.md` went open, claimed, done. A forced timeout, keeping the transcript busy after prepare, logged `killer-timeout` 33 s later and left the record `disarmed` | Met | - |
| AC-005 | REQ-005 | Given the shim sourced under bash or zsh in a repository whose `.skilled` is a symlink, When a runtime's interactive form, a subcommand or print form, a directory with no `.skilled` or a set `SKILLED_LOOP_ID` is resolved, Then only the interactive forms print the wrapper path, from the root and a nested directory, and on a terminal the runtime function hands the launch to the wrapper while a piped one runs the binary | Evidence: `.skilled/bin/skilled-loop-shell.sh:28` (`skilled_loop_resolve`), `:54` and `:112` (pass-through lists), `:167` (walk up), `:187` (terminal check), `:204` to `:210` (functions). `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:85`, `:100`, `:109`, `:116`, `:173`: 14 tests, 14 pass. Red on the pre-change tree (shim absent): 14 of 14 fail. `shellcheck .skilled/bin/skilled-loop .skilled/bin/skilled-loop-shell.sh` rc 0, `shellcheck -s bash` rc 0. Sourcing leaves the caller's `nounset` and `pipefail` off in both shells | Met | - |
| AC-006 | REQ-006 | Given a session with no `SKILLED_LOOP_ID` at 90% fill and a 0.80 threshold, When each adapter runs its nudge path, Then none adds handoff text, and the in-loop nudge cases still pass | Evidence: `.skilled/hooks/session-relaunch/lib/nudge.cjs:399`, `:449`. `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:373` for Claude, Codex, Hermes and OpenCode, `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:834` for Pi, `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:1003`, `:1012`. Red with HEAD's `nudge.cjs` and plugin swapped in: 5 of 5 node cases and 1 of 1 Pi case fail. Restored, `cmp` rc 0 on all three sources. Final gate: node 584 tests, 584 pass, 0 fail, rc 0. Pi vitest 40 of 40, rc 0. `tsc -p tsconfig.pi.json --noEmit` rc 0 | Met | - |
| AC-007 | REQ-007 | Given the docs that describe starting the loop or the nudge, When they are read against the code and grepped for the old wording, Then each covers the shim and symlinked repositories and none describes a nudge outside the loop | Evidence: `.skilled/hooks/session-relaunch/README.md:75`, `:112`. `.skilled/bin/README.md:87`, `:161`. `.skilled/commands/speckit/handoff.md:15`, `:107`, `:147`. `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md:43`, `:63`. `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:353`, `:363`, `:373`. `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:99`, `:158`. `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md:88`, `:171`. `validate_document.py` rc 0 on every touched doc. `validate-playbook-package.cjs --package system-spec-kit` PASS with 0 violations. `check_no_hyphenated_catalog_content.py` rc 0. `sync-runtime-mirrors.cjs --check` rc 0. Drift guards 4 of 4 PASS | Met | - |
| AC-008 | REQ-008 | Given the shim sourced in a fresh shell and a repository that links this checkout's `.skilled` and the runtime's config folder, When a plain runtime command starts and the session nears its context limit, Then the session runs with `SKILLED_LOOP_ID` set and the wrapper relaunches it in the same pane | Evidence: on 2026-10-20, the shim was sourced in `zsh -f` and launches were made from `AI Systems`, whose `.skilled` links to this checkout's. Each one printed the AI Systems wrapper path, and `relaunch.log` shows prepare, SIGTERM and `relaunch reason=ready` for Claude (loop 10319), OpenCode (71550), Hermes (27497), Pi (16216) and Codex (27456). Each receiving session's note reached `done`. A plain `claude` outside the loop at threshold 0.05 got no nudge and wrote no nudge state | Met | - |

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

All eight criteria are Met. The notice names the timeout and an ignored template's reason. The shell shim starts interactive launches under the loop, including in a repository that links `.skilled`. The nudge stays quiet outside the loop, the docs match, and live hops passed for Claude, Codex, Pi, OpenCode and Hermes.
<!-- /ANCHOR:closure -->
