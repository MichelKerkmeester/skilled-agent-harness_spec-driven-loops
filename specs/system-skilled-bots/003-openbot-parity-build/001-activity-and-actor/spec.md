---
title: "Feature Specification: Phase 1: activity-and-actor"
description: "Adds a bots activity read over the status index grouped by OpenBot's seven activity ids, a JSON form of the needs-you inbox, and a by: actor on needs-you answers and run records so a shared identity no longer erases who answered."
trigger_phrases:
  - "activity and actor"
  - "phase 1 activity and actor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: activity-and-actor

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 10 |
| **Predecessor** | None |
| **Successor** | 002-routine-layer |
| **Handoff Criteria** | `bots activity`, `bots activity --json`, `bots inbox --json` and the `by:` actor pass every acceptance criterion, and `bots status` still reads an index built before the schema bump |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: The activity read, the JSON form of the inbox, and the actor field on needs-you answers and run records. The approval `grants` field, the precedence ladder, per-action policy inside the executor, the two-role `operators.json` and the shared-host mode are other phases.

**Dependencies**:
- The status index's run, delivery and item rows, which the activity read groups [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:165]
- The needs-you item file and `bots answer`, which the actor field extends [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29]
- The installer's job environment, which carries the operator a scheduled run records [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts:177]

**Deliverables**:
- `bots activity` and `bots activity --json`, grouped under OpenBot's seven ids
- `bots inbox --json`
- `by:` on a needs-you answer and `actor` on a run record, from the OS user or `--as`, and the installing operator for a scheduled run
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The status index already holds a row for every run, delivery and needs-you item, but nothing shows them as a timeline: `bots status` prints one line per bot and one line per open item, so a reader cannot tell what is waiting, what is running and what ended without reading three surfaces [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:470]. The inbox has no machine-readable form, so a terminal client or a script must parse tab-separated prose [SOURCE: .skilled/bin/bots.cjs:458]. And state is keyed by repository identity `owner/name` with no sign-in, so when two people share a checkout the answer on a needs-you item names nobody [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:102].

### Purpose
Give the operator one grouped read of what the bots are doing, a JSON inbox, and a name on every answer and run, so a shared identity stops erasing who did what.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/bin/bots.cjs activity
bots: unknown verb: activity
exit=2
$ node .skilled/bin/bots.cjs inbox --json
bots: inbox takes no --json
exit=2
$ node .skilled/bin/bots.cjs answer item-1 yes --as michel
bots: unknown option: --as
exit=2
$ node .skilled/bin/bots.cjs status --json | grep -c '"actor"'
0
```

The three refusals are the measured behavior the Problem Statement rests on: the CLI has no `activity` verb, `inbox` accepts no `--json`, and no verb accepts `--as` [SOURCE: .skilled/bin/bots.cjs:64]. The `0` is the fourth: no row `bots status --json` prints carries an actor, so the index has nowhere to put one [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:68].
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `bots activity` and `bots activity --json`, which read the status index and print its rows under OpenBot's seven ids in OpenBot's order, leaving out a group with nothing in it
- Add `bots inbox --json`, which prints the open and expired needs-you items as JSON
- Add `by:` to a needs-you answer and `actor` to a run record, filled from the OS user or `--as <name>`
- Pin the installing operator into a scheduled job's environment, so a scheduled run records that operator rather than the launchd user
- Carry the actor on the status index's run row, so the activity read needs no second pass over run records

### Out of Scope
- The `grants` field on a needs-you item and the approval precedence ladder - phase 006-approval-grants owns both, and the research ranks them item 5 [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:145]
- Per-action policy inside the executor (send, delete, pay) - the research defers it to a later packet with OpenGhost's rules engine as the liftable layer [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:93]
- The two-role `operators.json` and the shared-host 0770 mode - the research lists both under the small-team model, and neither is needed to record an actor [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:103-104]
- A `by:` on secret records - the vault is phase 008, and no secret record exists yet [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:147]
- The terminal screen's activity pane - phase 003-terminal-screen draws it over this verb, and the research moves that screen up to follow items 1 and 2 [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:155]
- The routine layer's `recurring` rows - phase 002-routine-layer writes them; this phase groups whatever the index holds, and an empty `recurring` group is left out

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/activity.ts` | Create | The seven group ids, the group order, and the grouping of index rows into them |
| `.skilled/skills/system-skilled-bots/runtime/lib/actor.ts` | Create | Resolve an actor from `--as`, the OS user, or the operator pinned in a job's environment |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Modify | Add `by` to `NeedsYouAnswer` and to the item's key list, and validate it |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Accept an actor and write it as the answer's `by` |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | Add `actor` to the record, validate it, and read a record written before it as `null` |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Modify | Add the `actor` column, bump `SCHEMA_VERSION`, and carry it on `RunRow` |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Fill the record's actor at dispatch from the resolved actor |
| `.skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts` | Modify | Render and read back the pinned operator in a job's environment |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Modify | Pass the installing operator into the pinned job values |
| `.skilled/bin/bots.cjs` | Modify | Add the `activity` verb, `--json` on `inbox`, and `--as` on `answer` and `run` |
| `.skilled/skills/system-skilled-bots/runtime/tests/activity.vitest.ts` | Create | Group order, empty-group omission, and one row per action |
| `.skilled/skills/system-skilled-bots/runtime/tests/actor.vitest.ts` | Create | `--as` precedence, OS-user fallback, and the pinned operator |
| `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts` | Modify | The answer's `by` field and its validation |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Modify | The actor written by `bots answer` |
| `.skilled/skills/system-skilled-bots/runtime/tests/run-record.vitest.ts` | Modify | The record's `actor` and the pre-phase record that reads as `null` |
| `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts` | Modify | The `actor` column and the schema bump's rebuild |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts` | Modify | The `activity` verb, `inbox --json` and `--as` parsing |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | Add the two new modules to the module table |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | Modify | Name `bots activity` and `bots inbox --json` in the verb table |
| `.skilled/skills/system-skilled-bots/bots-status/SKILL.md` | Modify | Add the activity verb to the mode's allowed Bash |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | Modify | Document `--as` on `bots answer` |
| `THIRD_PARTY_NOTICES.md` | Create | The MIT notice for the two lifted OpenBot files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bots activity` reads the status index and prints its run and item rows under the seven ids `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed` and `recurring`, in that order, leaving out a group with no rows |
| REQ-002 | `bots activity --json` prints the same groups as JSON, each group carrying its id, its title and its rows |
| REQ-003 | `bots inbox --json` prints the open and expired needs-you items as JSON, each item carrying its id, bot, state, question, options, timestamps and answer |
| REQ-004 | `bots answer <item-id> <text>` records `by` on the item's answer, filled from `--as <name>` when given and from the OS user otherwise |
| REQ-005 | Every run record carries `actor`: the OS user for an interactive run, and the operator pinned into the job's environment at install for a scheduled run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The lifted grouping and row rules carry an MIT notice in `THIRD_PARTY_NOTICES.md` naming both source files and OpenBot's copyright line |
| REQ-007 | The status index carries the actor on each run row, so `bots activity` reads it without opening a run record |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a state root holding one open item, one running run and one completed run, `bots activity` prints exactly three groups in the order `needs_you`, `working`, `done`
- **SC-002**: `bots answer <item-id> yes --as ada` writes `"by": "ada"` on the item's answer, and `bots inbox --json` prints that `by`
- **SC-003**: A scheduled run's record names the operator pinned at install, not the launchd user, and `bots activity --json` prints that name on the run's row
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The status index's SQLite schema | The activity read has no rows to group | The read opens the index through `openIndex`, which rebuilds when the schema version differs |
| Dependency | The installer's job environment | A scheduled run records no operator | Pin the operator beside the state root and identity the job already carries, and read it back in `pinnedFromPlist` |
| Risk | The schema bump strands an index built before this phase | `bots status` and `bots activity` fail on an old index | Bump `SCHEMA_VERSION`, rebuild from run records on open, and prove it with a test that opens a version-2 index |
| Risk | A record written before this phase has no `actor` | `bots status --rebuild` refuses every old record | Read a missing `actor` as `null` rather than rejecting the record, and test one |
| Risk | `--as` reaches a path or a shell | A crafted name writes outside the state root | Validate the name against a fixed pattern and use it only as a stored string |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `bots activity` over 1,000 run rows prints in under 500 ms on the reference machine, measured with `time`
- **NFR-P02**: The activity read opens the index once and runs one query per table, so the row count does not multiply the queries

### Security
- **NFR-S01**: `--as` is validated against `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$` and is stored as a string only; it never becomes a path segment or a shell word
- **NFR-S02**: The actor is a name, never a credential; no secret is read to fill it, and no secret value reaches a record

### Reliability
- **NFR-R01**: An index written under the previous schema is rebuilt from run records on open, never misread
- **NFR-R02**: A run record written before this phase reads with `actor: null` and still validates, so `bots status --rebuild` over existing state succeeds
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a state root with no runs and no items prints `bots: no activity` and exits 0, and `bots activity --json` prints `{"groups":[]}`
- Maximum input: 1,000 run rows group in one pass; a group holding more rows than the terminal shows is printed in full, because the verb pages nothing
- Failure path: an index that cannot be opened prints `bots: <reason>` and exits 1, the same code `bots status` uses for an index failure
- Failure path: `bots answer <item-id> yes --as ''` exits 2 with `bots: option --as needs a value`, and `--as 'a/b'` exits 2 with `bots: --as takes a name`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 22 files, about 660 lines, one CLI, one index schema and one record field |
| Risk | 10/25 | An index schema bump and a record field; no auth, no network, no migration of stored files |
| Research | 4/20 | The 002 packet names the lift, the seven ids and the actor's source; no new investigation |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a run record's actor belong on `identity` or in its own field group? Decision: its own `actor` field, because `identity` names the repository and the actor names a person.
- Should `bots activity` show a run whose bot was unregistered? Decision: no, it reads the same rows `bots status` reads, so `--all` stays the one way to see a hidden identity.
- Is the OS user the right actor for a queued run a git hook started? Decision: yes, the hook runs as the OS user, and the record names that user.
<!-- /ANCHOR:questions -->

---
