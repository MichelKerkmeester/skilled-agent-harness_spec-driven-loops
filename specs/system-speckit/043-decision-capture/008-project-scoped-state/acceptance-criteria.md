---
title: "Acceptance Criteria: Phase 8: project-scoped-state"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "project scoped state acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/008-project-scoped-state"
    last_updated_at: "2026-11-03T09:15:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: project-scoped-state

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `008-project-scoped-state`
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given two temp projects whose `.skilled` links to one shared folder, When an answer and its consumed row are written through project A, Then A's rows sit under A's token subfolder and `readConsumedKeys(B)` does not hold A's key | `consumed keys stay isolated between projects` passes in `capture-core.test.mjs` (25 of 25); the linked rerun printed `{"appended":1,"skipped":0}` with the row under `shared/.skilled/skills/.state/decision-capture/9058749d1bcf/` and `readConsumedKeys(app-b) holds app-a key: false` | Met | - |
| AC-002 | REQ-001 | Given the same two linked projects, When `match-decision-table --scan-orphans --project-root B` runs, Then it prints `no session queues with pending records` | `does not list another linked project session in --scan-orphans` passes; the scratch rerun printed `queueDir(app-a) === queueDir(app-b) after realpath: false`, `readConsumedKeys(app-b) holds app-a key: false`, then the built matcher printed `1 session-a` for `app-a` and `no session queues with pending records` for `app-b` | Met | - |
| AC-003 | REQ-002 | Given a temp git root, a subfolder of it, a symlink to it and a non-git temp folder, When `queueDir` from `capture-core.mjs` and `stateDirPath` from the writer run on each, Then both return the same path for every shape | `matches capture-core paths for git roots, subfolders, symlinks and non-git folders` passes in `decision-record-writer.vitest.ts`, inside 52 of 52 | Met | - |
| AC-004 | REQ-002 | Given a temp project root, When `queueDir(root)` runs, Then its last segment is the first 12 hex characters of the SHA-256 of `realpath(root)`, and stays the same with `GIT_DIR` and `GIT_WORK_TREE` set to another repository | `queueDir uses the git root for its token across project paths` asserts the 12-hex token and sets `GIT_DIR` to another repository; a scratch probe with both `GIT_DIR` and `GIT_WORK_TREE` on another repository gave the same folder for every shape | Met | - |
| AC-005 | REQ-003 | Given a seeded root queue file and a root `consumed.jsonl` row, When `readQueue`, `pendingRecords` and `appendRecords` run, Then the legacy row is read, the legacy-consumed key is not pending, and appending a legacy key writes nothing | `legacy queue and consumed rows remain visible without receiving new writes` passes: legacy rows read, legacy-consumed key not pending, append of legacy keys returns `{ appended: 0, skipped: 8 }` | Met | - |
| AC-006 | REQ-003 | Given the same seeded root files, When the matcher's `--session` mode, `readConsumedRows`, `recordConsumedKeys` and `--release <key>` for a key held only in the root log run, Then the legacy rows are read, no key is appended twice, the root log is not written by a save, and the release removes the key from the root log | Matcher cases `reads legacy root queue rows and deduplicates overlapping keys` and `removes a key held only in the legacy root consumed log`, and the writer case `reads legacy consumed rows, skips their keys and leaves the legacy log unchanged`, pass inside 52 of 52 | Met | - |
| AC-007 | REQ-004 | Given the changed code, When the hooks `node --test` over `lib` and `bin`, the claude and devin tests, and the writer, matcher, Pi and `hook-session-stop.vitest.ts` suites run, Then each reports no failure at or above its baseline (99, 8, 27, 10, 19) | Hooks `{lib,bin,claude,devin}` 111 of 111, exit 0; writer, matcher and session-stop 52 of 52; Pi vitest 10 of 10; OpenCode plugin 6 of 6. A later rerun printed 109 of 111 with both failures in chat-question tests that read `chat-questions.mjs`, a file another phase was editing and this phase never touched | Met | - |
| AC-008 | REQ-005 | Given the matcher, When `rg -c 'STATE_DIR_SEGMENTS' .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` runs, Then it prints nothing | `rg -c` printed nothing, exit 1 | Met | - |
| AC-009 | REQ-006 | Given a root queue file with one pending answer, When `--scan-orphans` runs for that project, Then the root file's session is not listed | `does not list a legacy root queue in --scan-orphans` passes inside 52 of 52 | Met | - |
| AC-010 | REQ-007 | Given the docs, When `rg -n 'project-token' .skilled/skills/.state/decision-capture/README.md` and the flat-root check `rg -n 'decision-capture/\*\.jsonl\|decision-capture/consumed\|decision-capture/\.nudge\|maxdepth 1'` over the six `decision-capture-*` playbooks run, Then the first prints the structure row and the second prints nothing | The README `rg` prints line 35, the project-token structure row. The flat-root `rg` prints nothing, exit 1. The save-writer steps 3 to 5 now keep the glob outside the quotes (`"$F"/.skilled/skills/.state/decision-capture/*/consumed.jsonl`); in a scratch folder `wc -l <` on that form printed `1`. The conversation JSON parses and every edited check passes `bash -n` | Met | 2026-11-03 |
| AC-011 | REQ-008 | Given the state README, When it is read, Then it says the token scopes data but does not contain it, and that the state folder may resolve outside the project through the sanctioned `.skilled` link | `rg -n 'sanctioned'` prints README line 25, which says the token scopes data and the folder still resolves outside a linked project through the sanctioned link | Met | - |
| AC-012 | REQ-004 | Given this folder, When `validate.sh specs/system-speckit/043-decision-capture/008-project-scoped-state --strict` runs, Then it prints RESULT: PASSED | `validate.sh --strict` printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` | Met | - |

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

Every row is Met. The six playbooks were not re-run live; that is a recorded limitation, not an acceptance row.
<!-- /ANCHOR:closure -->
