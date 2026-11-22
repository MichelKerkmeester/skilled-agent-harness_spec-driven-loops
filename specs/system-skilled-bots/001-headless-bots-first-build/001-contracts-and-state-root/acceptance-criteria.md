---
title: "Acceptance Criteria: Phase 1: contracts-and-state-root"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "contracts and state root acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root"
    last_updated_at: "2026-11-22T10:48:27Z"
    last_updated_by: "scaffold"
    recent_action: "Wrote the Unmet criteria for the contracts phase"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-contracts-and-state-root"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: contracts-and-state-root

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 001-contracts-and-state-root
**Level:** 3
**Status:** Complete
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a run record with every research.md §10 field group filled, including the worktree path, branch and absolute run folder path, and `costUsd` unknown, When it is written and read back, Then the read equals the write, `costUsd` is `null`, never `0`, and the record file sits at `<state root>/<identity key>/records/<run id>.json`, outside the run folder | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- run-record` exits 0. Observed 2026-11-22: `-- run-record` 9 passed, exit 0. The round trip asserts equality and `costUsd` null, and the record path sits under `records/`, not the run folder. Cites `.skilled/skills/system-skilled-bots/runtime/tests/run-record.vitest.ts:73` | Met | - |
| AC-002 | REQ-002 | Given the three worked shapes of research.md §5 and three defective definitions, When each is parsed, Then the three shapes parse and the defects fail with `missing-id`, `missing-trigger` and `empty-body` | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- definition` exits 0. Observed 2026-11-22: `-- definition` 11 passed, exit 0. The three fixtures parse and `missing-id`, `missing-trigger` and `empty-body` are asserted by name. Cites `.skilled/skills/system-skilled-bots/runtime/tests/definition.vitest.ts:53` | Met | - |
| AC-003 | REQ-003 | Given `XDG_STATE_HOME` set, unset or overridden by `bots/config.json`, and a temp Skilled tree, When both roots resolve, Then the user-level root is `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots/` or the override, the run root is `<Skilled tree>/.skilled/skills/.state/system-skilled-bots/` whatever the override says, and every derived file is written by temp file and rename | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- state-root` exits 0, and a grep shows writes go only through the atomic helper. Observed 2026-11-22: `-- state-root` 14 passed, exit 0. `rg -n 'writeFileSync\|renameSync\|appendFileSync' runtime/lib` exit 1, so every write goes through `writeStateAtomic`. Cites `.skilled/skills/system-skilled-bots/runtime/tests/state-root.vitest.ts:32` | Met | - |
| AC-004 | REQ-004 | Given the full suite, When it runs with `XDG_STATE_HOME` and the Skilled tree pointed at temp folders, Then no file inside the checkout or a vendored tree changes, ignored files included | T013: `git status --short` saved right before the suite and run again after it prints the same lines, with no filter, and `ls -d .skilled/skills/.state/system-skilled-bots` fails with no such file before and after. Observed 2026-11-22 (T013): `diff` of `git status --short` before and after the suite printed nothing, exit 0. `ls -d .skilled/skills/.state/system-skilled-bots` failed with no such file before and after. Cites `.skilled/skills/system-skilled-bots/runtime/tests/state-root.vitest.ts:166` | Met | - |
| AC-005 | REQ-005 | Given two temp git repositories with no remote and no declared identity, When each resolves its state folder, Then both are refused with `identity-unknown` and no shared folder exists, and the guard that install and enqueue call refuses both (ADR-002) | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- identity` exits 0. Observed 2026-11-22: `-- identity` 10 passed, exit 0. Two remote-less temp repositories each get `identity-unknown` from `identityGuard`. Cites `.skilled/skills/system-skilled-bots/runtime/tests/identity.vitest.ts:21` | Met | - |
| AC-006 | REQ-006 | Given the operator has answered Q3 and Q5, When the parent decision record is read, Then both decisions appear there as operator decisions | In `specs/system-skilled-bots/001-headless-bots-first-build/decision-record.md`, ADR-002 (Q3) and ADR-003 (Q5) each show a status other than `Proposed`, and the Operator Decisions table holds one row for each. Precondition present on 2026-11-22: both ADRs read Accepted and rows D2 and D3 exist. The row is checked when this phase closes. Observed 2026-11-22 (T016): parent ADR-002 and ADR-003 read Accepted, and the parent Operator Decisions table has rows D2 and D3 at lines 756 and 757. Cites `specs/system-skilled-bots/001-headless-bots-first-build/decision-record.md:756` | Met | - |
| AC-007 | REQ-007 | Given the finished libraries, When the record's status, stop and delivery strings are listed, Then each comes from one of the five existing vocabularies, except the one value `awaiting-decision` that ADR-010 adds | Each other string is found by `rg -n` in a repository file listed in `scratch/vocabularies.md`, or in research.md §10 where that list names research.md §10 as the only source. A test pins `awaiting-decision` to `blockedStop` in `lifecycle-taxonomy.cjs`. Observed 2026-11-22: `exit.reason` stores the raw reason and adds no enum. Failure classes and delivery states follow research.md §10, the source `scratch/vocabularies.md` names, and ADR-005 records the `budget` class and the delivery-state naming. The one added value is `awaiting-decision`. The `run-record` test pins it to `blockedStop` read from `lifecycle-taxonomy.cjs`. Cites `.skilled/skills/system-skilled-bots/runtime/tests/run-record.vitest.ts:155` | Met | - |
| AC-008 | REQ-008 | Given the new skill folder with runtime code and no registered modes, When the existing skill and advisor checks run, Then none fails because of the folder | The check outputs and exit statuses saved in `scratch/skill-checks.txt`. Observed 2026-11-22: `scratch/skill-checks.txt` shows five skill checks and one advisor call each exit 0 before (T003) and after (T015) the code landed. Cites `specs/system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root/scratch/skill-checks.txt:1` | Met | - |
| AC-009 | REQ-009 | Given the finished phase, When the hub runtime is searched, Then no code calls `launchctl` or writes under `LaunchAgents` | `rg -n 'launchctl\|LaunchAgents' .skilled/skills/system-skilled-bots/runtime` prints nothing. Observed 2026-11-22: `rg -n 'launchctl\|LaunchAgents\|\.plist'` over the runtime, excluding node_modules, exit 1 with no output. Cites `specs/system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root/tasks.md:73` | Met | - |
| AC-010 | REQ-010 | Given two temp clones of one origin remote, When each resolves its identity and state folder, Then both get the same identity folder and `registered-roots` lists both checkout paths under it | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- identity` exits 0. Observed 2026-11-22: `-- identity` 10 passed. Two checkouts with one origin share one identity folder, and `registered-roots` lists both paths under one key. Cites `.skilled/skills/system-skilled-bots/runtime/tests/identity.vitest.ts:62` | Met | - |
| AC-011 | REQ-011 | Given a definition with no `isolation` field and a config with no `defaultIsolation`, When its isolation resolves, Then the result is the refusal `isolation-undeclared` and neither `shared` nor `worktree` is returned | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- definition` exits 0. Observed 2026-11-22: `-- definition` 11 passed. With no `isolation` and no `defaultIsolation`, `resolveIsolation` returns `isolation-undeclared`. Cites `.skilled/skills/system-skilled-bots/runtime/tests/definition.vitest.ts:100` | Met | - |
| AC-012 | REQ-012 | Given a repository with no `bots/config.json`, one without `gitHookTrigger` and one with `"gitHookTrigger": "yes"`, When each config is read, Then the first two read `gitHookTrigger` as `false` and the third is rejected by name | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- repo-config` exits 0. Observed 2026-11-22: `-- repo-config` 7 passed. A missing file and an absent key read `false`, and `"yes"` is rejected as `gitHookTrigger-invalid`. Cites `.skilled/skills/system-skilled-bots/runtime/tests/repo-config.vitest.ts:60` | Met | - |
| AC-013 | REQ-009 | Given the finished phase and its full test run, When the code is searched and `~/Library/LaunchAgents` is listed before and after the suite, Then no code path calls `launchctl bootstrap` or writes into `~/Library/LaunchAgents`, and the listing is unchanged | T017: `rg -n 'launchctl bootstrap\|LaunchAgents\|\.plist' .skilled/skills/system-skilled-bots/runtime` prints nothing, and `diff` of the two listings prints nothing. Observed 2026-11-22 (T017): the `rg` printed nothing, and `diff` of the two `~/Library/LaunchAgents` listings printed nothing, exit 0. Cites `specs/system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root/tasks.md:76` | Met | - |
| AC-014 | REQ-013 | Given a config with `"identity": "acme/tool"`, one with `"identity": "not a slug"`, a repository with an origin remote and a repository with no remote whose config sets `"identity": "local/tool"`, When each config is read and identity resolves, Then `acme/tool` wins over the remote, the second is rejected with `identity-invalid` and the no-remote repository resolves to `local/tool` | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- repo-config` and `-- identity` exit 0. Observed 2026-11-22: `-- repo-config` 7 passed and `-- identity` 10 passed. `acme/tool` beats the origin, `not a slug` gives `identity-invalid`, and a remote-less repository resolves `local/tool`. Cites `.skilled/skills/system-skilled-bots/runtime/tests/identity.vitest.ts:39` | Met | - |
| AC-015 | REQ-014 | Given a temp Skilled tree that git ignores, one it does not, and a record whose run folder was deleted, When a run folder resolves and the record is read, Then the first gives `<tree>/.skilled/skills/.state/system-skilled-bots/<identity key>/runs/<run id>/` with mode `0700`, the second gives `run-folder-not-ignored` and creates nothing, and the record reads whole with the folder reported missing | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- state-root` and `-- run-record` exit 0. Observed 2026-11-22: `-- state-root` 14 passed and `-- run-record` 9 passed. The ignored tree gives the path with mode 0700, the unignored tree gives `run-folder-not-ignored` and no run root, and a deleted run folder reads back with `present: false`. Cites `.skilled/skills/system-skilled-bots/runtime/tests/state-root.vitest.ts:91` | Met | - |
| AC-016 | REQ-015 | Given a needs-you item with every field and a record with exit `awaiting-decision`, When each is written and read back at three instants, Then both read equal, the item reads open before expiry, expired after it and answered once `answer` is set, the item file holds no state field, and a record with `awaiting-decision` and no item id is rejected by name | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- needs-you` exits 0. Observed 2026-11-22: `-- needs-you` 5 passed and `-- run-record` 9 passed. The item reads equal, the state reads open, expired and answered at three instants, no `state` key is stored, and a parked exit with no item gives `awaiting-decision-without-item`. Cites `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts:47` | Met | - |
| AC-017 | REQ-016 | Given no `bots/config.json`, a config with four retention values and `needsYou.expiryDays`, and configs with `0`, `-1`, `1.5` and `"200"`, When each is read, Then the first reads 1000, 200, 100 and 200 and an expiry of 7, the second reads its values and the rest are rejected by name | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- repo-config` exits 0. Observed 2026-11-22: `-- repo-config` 7 passed. A missing file reads 1000, 200, 100, 200 and 7, a full file reads its values, and 0, -1, 1.5 and "200" are each rejected by name. Cites `.skilled/skills/system-skilled-bots/runtime/tests/repo-config.vitest.ts:67` | Met | - |
| AC-018 | REQ-017 | Given a staged re-pin of a temp vendored tree that holds a file under `.skilled/skills/.state/system-skilled-bots/`, When the re-pin runs, Then the result is recorded with the overlay-engine lines read and the reinstall and retarget cases | `scratch/overlay-repin-state.md` exists and names the observed result of the staged re-pin, not only the code read. Observed 2026-11-22: `scratch/overlay-repin-state.md` records a staged and a live re-pin that kept the `.state` file byte-identical (`cmp` exit 0), with the overlay-engine lines read. The reinstall and retarget cases are marked as a code read. Cites `specs/system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root/scratch/overlay-repin-state.md:1` | Met | - |

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

**Closeable:** No

Nothing is built yet, so every criterion is Unmet. AC-006's precondition is now present: the parent decision record carries Q3 as ADR-002 and Q5 as ADR-003, both Accepted, with rows D2 and D3 in its Operator Decisions table. AC-006 stays Unmet until this phase closes and the row is checked.
<!-- /ANCHOR:closure -->
