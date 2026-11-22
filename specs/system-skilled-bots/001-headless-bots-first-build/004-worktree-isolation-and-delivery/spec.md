---
title: "Feature Specification: Phase 4: worktree-isolation-and-delivery"
description: "After phase 3 a bot can run only in the shared checkout and its result reaches nobody. This phase adds opt-in worktree runs built on sk-git's numbered worktrees and real at-most-once delivery records with a local-only value and a desktop notice."
trigger_phrases:
  - "worktree isolation and delivery"
  - "phase 4 worktree isolation and delivery"
  - "bots worktree run"
  - "bots delivery channels"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: worktree-isolation-and-delivery

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-manual-runner |
| **Successor** | 005-request-pipeline |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the runner no longer refuses `isolation: worktree` and every run record carries one delivery record per target |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Build system-skilled-bots: file-defined headless agent bots run on a schedule or event specification.

**Scope Boundary**: The rest of build step 5 in research.md §15. Opt-in `isolation: worktree` runs and real delivery channels. No scheduler, no queue claims and no scheduled reclaimer.

**Dependencies**:
- Phase 3 (`003-manual-runner`): the runner, the lease, posture validation and the run record writer. This phase removes phase 3's refusal of `isolation: worktree`.
- Phase 1 (`001-contracts-and-state-root`): the run record's worktree and delivery fields, the `BOT.md` delivery fields and the state-root layout. Phase 3 already depends on it.
- Phase 2 (`002-schedule-predicates-and-checker`): the definition checker that gains the worktree invariant and its fixture. This phase needs 002's checker code merged, not 002 closed. Phase 2 stays open for days on the weekday probe, and this phase does not wait for it.
- The Predecessor row is folder order. Build dependencies are: phase 3, and phase 2's checker code merged. Both match the parent phase map.
- Phase 5 (`005-request-pipeline`) can run in parallel with this phase. Neither depends on the other.

**Deliverables**:
- An isolation module that creates, records and removes a bot worktree through sk-git's scripts.
- A delivery module that resolves targets, writes at-most-once delivery records and sends the first channels.
- The checker's worktree invariant with a negative fixture.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
After phase 3 a bot that edits files must run in the operator's shared checkout, because the runner refuses `isolation: worktree` as a posture it cannot honor yet. Its result also reaches nobody: the delivery record can only say `not-attempted` or local-only, so a failed unattended run is silent until someone reads the state root.

### Purpose
A bot that declares `isolation: worktree` runs in its own numbered worktree outside the checkout, and every run tells each declared target what happened, at most once, with a record of each send.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ ls -A .skilled/skills/system-skilled-bots | wc -l
       0
$ grep -n -- '--numbered         Also sweep' .skilled/bin/worktree-reaper.sh
44:#   --numbered         Also sweep numbered worktrees (rules above).
```
The skill folder holds 0 files, so no isolation or delivery code exists yet. The reaper already ships the numbered lane this phase relies on for reclaim.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Run a bot that declares `isolation: worktree` in a numbered worktree from `worktree-naming.sh`, placed outside the checkout, with its shared paths provisioned (research.md §13 Worktrees). Without it, an editing bot writes into the operator's working tree.
- Record the worktree path and branch in the run record's evidence locations, so a tree left behind joins to its run (research.md §10).
- Remove a clean, unchanged bot worktree by unlinking every provisioned link first, then a plain `git worktree remove` and `git branch -d`, never forced. Keep and report a dirty or unmerged tree (research.md §13, §15 invariants).
- Resolve delivery from the `BOT.md` target list, the failure override and the local-only value, and write one delivery record per target with the states `queued`, `claimed`, `delivered`, `failed` or `unknown`. A desktop notice through `osascript` claims only `attempted` (research.md §5 Delivery fields, §10).
- Add the checker's worktree invariant and a negative fixture.
- Notify once when a needs-you item opens. A run that ends `awaiting-decision` opens one item, and delivery sends one notice for it, keyed by the item id. This follows the operator's decision-queue choice (operator decision, 2026-11-22).

### Out of Scope
- A scheduled worktree reclaimer - build step 10 in research.md §15. The operator runs `.skilled/bin/worktree-reaper.sh --numbered` by hand.
- Webhook, chat or email channels - only the channels the operator names in ADR-001 ship here. The webhook adapter is step 10.
- A launchd agent or any call to `launchctl bootstrap` - phase 6 owns every install (parent scheduling invariant).
- Changes to `worktree-naming.sh` or `worktree-reaper.sh` - this phase calls them and does not edit them. Their owner is sk-git.

### Files to Change

Paths assume the skill layout phase 1 fixes. A path phase 1 moves follows it.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts` | Create | Create, record, unlink and remove a bot worktree through sk-git's scripts |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Create | Resolve targets, write delivery records and send the local-only and desktop channels |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify (created by phase 3) | Drop the worktree refusal, call isolation before dispatch and delivery after the result event |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modify (created by phase 2) | Add the worktree invariant |
| `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts` | Create | Worktree placement, links, removal, dirty tree and concurrency tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts` | Create | Target resolution, state transitions and the no-retry rule |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/` | Create | A worktree bot fixture and a negative fixture for the invariant |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Unchanged | Called for `create`, which allocates the number under the lock |
| `.skilled/bin/worktree-reaper.sh` | Unchanged | Named as the reclaim path for kept trees |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A run of a bot that declares `isolation: worktree` happens in a worktree whose number came from `worktree-naming.sh`, whose folder sits outside the checkout and whose provisioned links exist before dispatch. The run record names the worktree path and branch. |
| REQ-002 | Removal of a bot worktree unlinks every provisioned link before `git worktree remove`. After removal the main checkout's dependency folders still exist and hold the same entry count as before. |
| REQ-003 | A dirty or unmerged bot worktree is never removed by the runner. The run record and the delivery message report it with its path and branch. |
| REQ-004 | Two concurrent worktree runs receive different worktree numbers, and the lease key of either run contains no worktree path. |
| REQ-005 | Delivery is at most once. An uncertain send is stored as `unknown` and is never retried. Run outcome and delivery outcome are separate fields. |
| REQ-006 | The runner never chooses between a worktree and the shared checkout. The choice comes only from the definition's `isolation` field or the repository default in `bots/config.json`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Delivery resolves the success target list, the failure override and the local-only value. An empty target list writes `not-attempted`. A desktop notice writes `attempted` and no stronger state. |
| REQ-008 | Each delivery record names its channel, target, state and evidence. No command line, environment value or secret appears in a delivery body. |
| REQ-009 | The definition checker allows `isolation: worktree` only when the provisioned shared-path list resolves (research.md §6). It imports that list from the isolation module, never a copy. It also fails an `isolation` value that is neither `worktree` nor `shared`. Each failure names the invariant id, and a negative fixture proves it. |
| REQ-010 | No code path added in this phase calls `launchctl bootstrap` or writes a plist. |
| REQ-011 | When a needs-you item opens, delivery sends one notice for it to the bot's resolved targets and writes one delivery record per target, keyed by the item id. A second pass over the same item sends nothing. The notice carries the item id, bot id, run id and question text, and no command line or environment value. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `bots run <id>` on a worktree fixture bot leaves a terminal run record whose evidence locations hold a worktree path outside `git rev-parse --show-toplevel` and a `worktrees/NNN-slug` branch.
- **SC-002**: After a clean worktree run is removed, `ls` of each linked dependency folder in the main checkout prints the same entry count it printed before the run.
- **SC-003**: A run killed mid-edit leaves its worktree on disk, and `git worktree list` still shows it.
- **SC-004**: A delivery test that forces an uncertain send leaves one record with state `unknown` and no second send attempt.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3 runner, lease and record writer | Nothing here can run without them | Start only after phase 3's acceptance criteria are Met. Tests run against a temp repository, never the operator's checkout |
| Dependency | `worktree-naming.sh create` | Number collisions or a changed interface break isolation | Call only the documented `create` command, which allocates under the lock. A separate `allocate` call would burn a number. Pin the call shape in a test that reads the usage text |
| Risk | Removal follows a provisioned link into the main checkout's dependencies (research.md §13) | High | Unlink every link first. Test with a temp main checkout and compare entry counts before and after |
| Risk | A desktop notice reads as delivered when nothing confirms it | Med | The channel can only write `attempted` (research.md §10). A test asserts it |
| Risk | Default worktree base is in-checkout (`.worktrees`), so a run lands inside the checkout | High | Refuse a worktree run when the resolved base is inside the checkout. Allow a state-root base passed through `SPECKIT_WORKTREE_BASE` for the child call |
| Risk | Kept dirty trees pile up with no reclaimer | Low | Report each one in the record and the delivery message. The operator runs the reaper's numbered lane |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Worktree setup time is measured and written to the run record. No limit is set until a baseline exists from a real run on this checkout.
- **NFR-P02**: Delivery adds no wait to the run outcome: the run record's terminal state is written before any send starts.

### Security
- **NFR-S01**: A delivery body carries the bot id, run id, outcome class and evidence pointers only. A test greps every delivery body for the allowlisted environment keys and finds no value.
- **NFR-S02**: The worktree base resolves outside the checkout and outside any vendored tree, or the run is refused before dispatch.

### Reliability
- **NFR-R01**: Each target gets at most one send per run, proved by a counter in the delivery test.
- **NFR-R02**: No removal is ever forced. `rg -n 'worktree remove.*--force|branch -D' runtime/lib/isolation.ts` prints nothing.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a bot with no delivery targets writes one `not-attempted` record and sends nothing. A bot with no `isolation` field and no repository default gets the rule phase 1 fixes for a missing posture. The runner never fills the gap itself.
- Maximum input: two or more concurrent worktree runs of different bots each get their own number from the locked allocator. A second run of the same bot is still refused by the lease.
- Failure path: `worktree-naming.sh create` exits 3 when provisioning fails. The run ends before dispatch with an environment-class failure, the half-made tree is kept and reported, and no send claims success.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two new modules, two modified ones, tests and fixtures. Estimate 800 to 1,200 lines with tests (judgment, not measured) |
| Risk | 18/25 | Removal near the main checkout's dependency folders and unattended sends |
| Research | 8/20 | research.md §5, §10 and §13 cover it. Provisioning style and removal timing still need a decision |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Which delivery channels ship first? Recommended: local-only and the desktop notice. Operator decision, ADR-001.
- Does a bot worktree link the shared paths or run a full `provision` install? Recommended: links, ADR-003.
- Does the runner remove a clean, unchanged worktree at the end of the run, or leave every tree to the reaper? Recommended: remove when clean and unchanged, ADR-005.
- What does the record and the notice say when a run dies mid-edit? Recommended: keep the tree and report it, ADR-004.
<!-- /ANCHOR:questions -->

---
