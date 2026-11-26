---
title: "Acceptance Criteria: Phase 1: activity-and-actor"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "activity and actor acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/001-activity-and-actor"
    last_updated_at: "2026-11-25T07:13:38Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-activity-and-actor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: activity-and-actor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/001-activity-and-actor
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`SCRATCH` is a fresh `mktemp -d` folder holding the scratch checkout `tasks.md` T000 builds, and every `bots.cjs` command that reads or writes state passes `--repo "$SCRATCH/checkout"`, per `contracts/verification.md` V10. A vitest command runs in a subshell so the next command in the same cell still resolves from the repository root, per V11.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a state root holding one open item, one running run and one completed run, When `bots activity` runs, Then it prints the groups `needs_you`, `working` and `done` in that order and prints no group holding nothing | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts -t "^bots activity order$")` prints `Tests  1 passed` | Unmet | - |
| AC-002 | REQ-002 | Given the one data set in `design/fixtures/one-data-set.json`, When `bots activity --json` runs, Then it prints one JSON object with `"version": 1` whose `groups` array carries each group's `id`, `title` and `rows`, and each row carries `botId`, `identity`, `state`, `at`, `actor`, `runId` and `schedule`, where `state` is one of the seven group ids | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts -t "^bots activity one data set$")` prints `Tests  1 passed`, which deep-equals the payload against the screen's `payloads/activity.json` and so prints the seven row keys on every row | Unmet | - |
| AC-003 | REQ-003 | Given one open needs-you item, When `bots inbox --json` runs, Then it prints one JSON object with `"version": 1` whose `items` array carries that item's `id`, `botId`, `kind`, `question`, `state`, `at`, `options`, `createdAt`, `expiresAt` and `answer`, where `kind` is `null` until 005-memory writes a value | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^the activity and inbox payloads match the screen's types$")` prints `Tests  1 passed`, and `node .skilled/bin/bots.cjs inbox --json --repo "$SCRATCH/checkout" \| jq -c .` prints `{"version":1,"items":[]}` | Unmet | - |
| AC-004 | REQ-004 | Given an open needs-you item, When `bots answer <item-id> yes --as ada` runs from a tty, or `answerItem` is called with `ada` and no tty, Then the item's answer carries `"by": "ada"` and the same answer with no `--as` carries the OS user's name. `Ada` and `ada` are different actors | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer records the actor in by$")` prints `Tests  1 passed` | Unmet | - |
| AC-005 | REQ-005 | Given a bot installed by one operator and fired by launchd, When the run record is written, Then its `actor` is that operator's name and an interactive run's `actor` is the OS user. A run requested by one person and answered by another carries `actor` for the requester and `answeredBy` for the approver | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/actor.vitest.ts -t "^actor pinned$")` prints `Tests  1 passed` | Unmet | - |
| AC-006 | REQ-006 | Given the two lifted OpenBot files, When `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` is read, Then it names both source paths, OpenBot's MIT licence and its copyright line | `rg -n "activity-groups.ts\|activity-rows.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints two lines | Unmet | - |
| AC-007 | REQ-007 | Given a run record carrying an actor, When the status index is built, Then the run row's `summary` JSON carries that actor and `bots activity` prints it without opening the record, and a write into an index built by the old DDL succeeds with no `ALTER TABLE` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/status-index.vitest.ts -t "^building and rebuilding carries the actor in the run summary$")` prints `Tests  1 passed`, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/status-index.vitest.ts -t "^opening the index accepts a write into an index built by the old DDL$")` prints `Tests  1 passed` | Unmet | - |
| AC-008 | REQ-008 | Given a script with stdin not a tty, When `bots answer <item-id> yes --as ada` runs and `ada` is not the OS user, Then it exits 2 with `bots: --as needs a tty` and the item stays open, while `answerItem` called with an explicit actor writes the answer with no tty. `bots schedule install <id> --full-access` from the same script exits 2 with `bots: --full-access needs a tty` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots answer refuses a foreign actor without a tty$")` prints `Tests  1 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots schedule install refuses full access without a tty$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer takes an explicit actor with no tty$")` prints `Tests  1 passed` | Unmet | - |
| AC-009 | REQ-009 | Given a definition declaring `danger-full-access` on a bot installed without `--full-access`, When the run dispatches, Then its `posture.sandbox` is `workspace-write`, and the same definition on a bot installed with `--full-access` dispatches at `danger-full-access`, also when the drain job runs its resume | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/posture.vitest.ts -t "^posture matrix caps a declared danger-full-access without full access$")` prints `Tests  1 passed`, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/resume.vitest.ts -t "^resume requests keeps danger-full-access for a full-access bot the drain resumes$")` prints `Tests  1 passed` | Unmet | - |
| AC-010 | REQ-010 | Given an open needs-you item, When `bots answer <item-id> yes --scope deny` runs, Then the item's answer carries `"scope": "deny"`. The same answer with no `--scope` carries `"scope": "once"`. `--scope always` exits 2 with `bots: grant-scope-unsupported` and `--scope sometimes` exits 2 with `bots: --scope takes once or deny` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer records the scope and refuses another$")` prints `Tests  1 passed`, and `node .skilled/bin/bots.cjs answer item-1 yes --scope always` prints `bots: grant-scope-unsupported` as its first stderr line and exits 2 | Unmet | - |
| AC-011 | REQ-003 | Given one open item and one answered item, When `bots inbox --json --all` runs, Then the answered item appears with `state` `answered` and its `answer.by`, while the default `bots inbox --json` leaves it out, so a reader sees who answered it without opening the item file | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots inbox prints the answered item under --all$")` prints `Tests  1 passed` | Unmet | - |
| AC-012 | REQ-011 | Given an index already built and a run that completes after it, When `bots activity --json` runs with no `--rebuild`, Then that run's row is listed and `bots status --json` prints `"stale": false` and an `updatedAt` no older than the run's record | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts -t "^bots activity refresh on read$")` prints `Tests  1 passed` | Unmet | - |
| AC-013 | REQ-012 | Given a run in flight and an installed cron schedule, When `bots activity --json` runs, Then a `working` row names the run in flight and a `recurring` row carries a future `at` and a non-null `schedule`. Until 002 wires `describeStart`, the non-null `schedule` is proved with the stub `describe` `design/data-model.md` section 4.3 names | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts -t "^bots activity row sources$")` prints `Tests  1 passed` | Unmet | - |
| AC-014 | REQ-004 | Given an item whose answer was stored before this phase with `text` and `answeredAt` only, When the item is read, Then its answer reads `by: null` and `scope: "once"`, the file is not rewritten, re-sending the same text with no `--scope` is a duplicate and re-sending it with `--scope deny` is refused `item-answered-differently` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts -t "^needs-you item reads an old answer as by null and scope once$")` prints `Tests  1 passed` | Unmet | - |
| AC-015 | REQ-013 | Given a bot child's run marker in the environment, When `bots answer <item-id> yes` or `bots enable <bot>` runs, Then it exits 2 with `bots: child-write-refused` as its first stderr line and the item stays open, while the same two verbs with no marker reach the runtime | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots answer refuses a write from a bot child$")` prints `Tests  1 passed` | Unmet | - |
| AC-016 | REQ-009 | Given a bot whose trigger is `manual` and which declares `danger-full-access`, When `bots schedule install <id> --full-access` runs, Then the install record carries `fullAccess: true` and no plist is written, and the same verb without the flag exits 4 with `trigger-not-cron` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots schedule install records full access for a non-cron bot$")` prints `Tests  1 passed` | Unmet | - |

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

**Closeable:** No

AC-001 to AC-016 are unmet. The design is written and no code has been, so every criterion is open.
<!-- /ANCHOR:closure -->
