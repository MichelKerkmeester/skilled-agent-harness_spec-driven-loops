---
title: "Acceptance Criteria: Phase 9: research-fixes-and-core-consolidation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "research fixes and core consolidation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/009-research-fixes-and-core-consolidation"
    last_updated_at: "2026-10-19T19:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked all seven criteria Met with evidence"
    next_safe_action: "Operator decides on merging worktree 148 to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: research-fixes-and-core-consolidation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/009-research-fixes-and-core-consolidation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new and changed tests, When they run against the pre-phase sources swapped in from HEAD, Then each code finding's test fails | Evidence: `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:699`, `:776`; `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1113`, `:1136`; `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1483`, `:1505`, `:1524`; `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs:279`; `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1755`. Eleven HEAD sources swapped in: node 510 tests, 49 fail; Pi 34 tests, 3 fail. The failures are the new and changed tests, one or more per finding. The phase sources were restored and `cmp` matched each file to its backup | Met | - |
| AC-002 | REQ-002 | Given a seed with a relative note path or a spec folder that is not a valid packet path, When any adapter handles it, Then no placeholder claim command reaches the model and no unchecked folder reaches the note | Evidence: `.skilled/hooks/session-relaunch/lib/nudge.cjs:68`, `:225`; `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:934`, `:942`; `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:232`, `:257`. The conformance table returns nothing for the malformed seed and an empty `spec_folder:` for an invalid folder on Claude, Codex, Hermes and OpenCode; the Pi mirror does the same | Met | - |
| AC-003 | REQ-003 | Given an armed record whose note is missing, unparseable or already claimed, or whose consume output cannot be read, When the runtime exits, Then the wrapper prints the manual command and exits 1 without a relaunch | Evidence: `.skilled/bin/skilled-loop:78`, `:479`; `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:564`; `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:511`, `:1755`, `:1769`. The three note-state cases and the unparseable-consume case record one runtime launch, a warning and the manual command; a record without a cwd is declined and keeps exit 5 | Met | - |
| AC-004 | REQ-004 | Given the five nudge adapters, When the code is searched for the decisions they used to repeat, Then each lives once in the core and every adapter calls it | Evidence: `.skilled/hooks/session-relaunch/lib/nudge.cjs:21`, `:77`, `:425`; `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:283`, `:830`. A search for `CLI_COMMAND = ` finds only `nudge.cjs`; Claude, Codex, Hermes and Pi call `nudgeDecision`, `seedInstructions` and `specFolderInput`; OpenCode calls them plus `noteState` for both its note readers; the Claude Stop hook calls `resolveKillerTarget` | Met | - |
| AC-005 | REQ-004 | Given the conformance table, When it runs, Then every case passes on every adapter | Evidence: `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:232`, `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:713`. `node --test tests/adapter-conformance.test.cjs`: 28 tests, 28 pass. Pi vitest: 34 tests, 34 pass, including the seven mirrored cases | Met | - |
| AC-006 | REQ-005 | Given the docs the research named, When they are read against the code, Then none carries the drift it found | Evidence: `.skilled/commands/speckit/handoff.md:27`, `:133`; `.skilled/hooks/session-relaunch/README.md:25`, `:128`, `:141`; `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:113`, `:114`; `.skilled/hooks/session-relaunch/tests/README.md:47`; `specs/hooks/023-session-relaunch-loop/spec.md:34`; `specs/hooks/023-session-relaunch-loop/goal.md:52`. G1 supersede wording, G2 and G3 `CLAUDE_PID`, G4 arm events, G5 save order, G7 the plugin and conformance suites, C3 the env row and L4 the worktree all match the code; G6 is recorded in `../002-pi-opencode-adapters/implementation-summary.md:156`. `validate_document.py` rc 0 on each touched doc | Met | - |
| AC-007 | REQ-001, REQ-005 | Given the final state, When the full gate and recursive strict validation run, Then both pass | Evidence: `specs/hooks/023-session-relaunch-loop/009-research-fixes-and-core-consolidation/implementation-summary.md:107`. Full gate rc 0: node 510/510, pytest 62, Pi vitest 34, tsc, shellcheck, registration 7, verify-iteration 31, adapter parity 128, hook sync 32 hooks, mirrors 192, frontmatter-version 34. Drift guards 4/4 from `sk-code-skilled/scripts/`. Comment hygiene rc 0. Recursive strict validation prints `RESULT: PASSED` for all ten folders | Met | - |

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

All seven criteria are Met. Each code finding has a test that failed on the pre-phase sources, the shared decisions have one owner, and the docs match the code.
<!-- /ANCHOR:closure -->
