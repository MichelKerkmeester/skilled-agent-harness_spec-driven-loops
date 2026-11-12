---
title: "Acceptance Criteria: Phase 3: launch-flag-replay"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "launch flag replay acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-launch-flag-replay"
    last_updated_at: "2026-11-12T08:28:55Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-launch-flag-replay"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: launch-flag-replay

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-launch-flag-replay
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a first launch with `--permission-mode plan` and `--add-dir /tmp`, When the wrapper hops to a new session, Then the hop's arguments hold both flags and the case named `Claude first launch arguments are replayed with --permission-mode and --add-dir` passes | `node --test --test-name-pattern 'replayed with --permission-mode' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with one passing test Observed 2026-11-12: one passing test. The hop holds `--add-dir /tmp` and `--permission-mode plan` after the seed and not the old prompt. It failed before the fix in `scratch/red-2.txt`. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:562`. | Met | - |
| AC-002 | REQ-002 | Given a first launch whose record carries a new model and effort, When the wrapper hops, Then the seed replaces the prompt, each record value replaces its setting, and no setting appears twice | `node --test --test-name-pattern 'replaces the start prompt and the record settings' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with one passing test Observed 2026-11-12: one passing test. `--model`, `--effort` and `--name` each appear once with the record's values. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:668`. | Met | - |
| AC-003 | REQ-003 | Given each of the six runtime arms, When a hop runs, Then that arm has one replay case and all six pass | `node --test --test-name-pattern 'first launch arguments are replayed' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with six passing tests Observed 2026-11-12: six passing tests, one per arm, in `scratch/green.txt`. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:592`. | Met | - |
| AC-004 | REQ-004 | Given a first launch that names a deny-listed flag, When the wrapper hops, Then the flag is absent from the hop's arguments and the deny-list case passes | `node --test --test-name-pattern 'deny list' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with one passing test Observed 2026-11-12: one passing test that loops over six arms, each with a replayed option, a denied flag with a value and one without. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:597` and `.skilled/bin/skilled-loop:573`. | Met | - |
| AC-006 | REQ-006 | Given a first launch with an option the tables do not know followed by a bare word, When the session hands off, Then the wrapper starts no new session and prints the manual claim command | `node --test --test-name-pattern 'unknown option before a bare word' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with one passing test Observed 2026-11-12: one passing test. The runtime starts once, both warnings print and the manual claim command names the note. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:691` and `.skilled/bin/skilled-loop:1173`. | Met | - |
| AC-005 | REQ-005 | Given the carried-arguments paragraph, When a reader looks for the deny list, Then the paragraph states the replay rule and names the list | `rg -c 'deny list' .skilled/hooks/session-relaunch/README.md` prints 1 Observed 2026-11-12: the command prints 1. Source: `.skilled/hooks/session-relaunch/README.md:83`. | Met | - |
| AC-007 | REQ-007 | Given a first launch in each of the four confirmed input classes, When the wrapper hops, Then the hop holds the options the operator gave, no denied or duplicated one, and no false ambiguity warning | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and lists the four cases `a hop keeps a dash-leading value and stops at the separator`, `an unknown option that carries its value is not ambiguous`, `a joined short resume option is not replayed` and `Codex takes its model from a config setting when no model flag is given` as passing Observed 2026-11-12: four passing tests, and the optional-value case beside them. Four of the five failed before the fix in `scratch/red-5.txt`. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:624` and `.skilled/bin/skilled-loop:899`. | Met | - |

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

All seven criteria are Met with observed evidence from `scratch/green.txt` and `scratch/green-full.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree`, because nothing is committed without the operator.
<!-- /ANCHOR:closure -->
