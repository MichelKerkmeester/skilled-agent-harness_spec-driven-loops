---
title: "Feature Specification: Phase 5: request-pipeline"
description: "Bots can only be run by hand today, and nothing turns an event into a run request that is claimed once, retried within a bound and quarantined when it cannot run. This phase adds the request queue, bots enqueue, a hand-run bots drain, bots answer and an opt-in git post-commit producer."
trigger_phrases:
  - "request pipeline"
  - "phase 5 request pipeline"
  - "bots answer"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: request-pipeline

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-worktree-isolation-and-delivery |
| **Successor** | 006-launchd-installer |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, and phase 6 can point a `QueueDirectories` agent at the watched folder this phase defines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Build system-skilled-bots: file-defined headless agent bots run on a schedule or event specification.

**Scope Boundary**: The request record, the queue folders under the state root, `bots enqueue`, a hand-run `bots drain`, `bots answer` as a queue producer and one opt-in leg in the git post-commit hook. No launchd agent, no webhook.

**Dependencies**:
- Phase 1 (`001-contracts-and-state-root`): the run record, repository identity, the state-root layout and `bots/config.json` with its commit-trigger opt-in key `gitHookTrigger` (boolean, default `false`, phase 1 ADR-009, Proposed).
- Phase 3 (`003-manual-runner`): `bots run <id>`, the precheck, the disable switch and the request join in the run record. `bots drain` hands each claimed request to this runner. This phase also needs from phase 3: refusal outcome classes that tell disabled, paused, failing precheck and malformed definition apart from a run failure, the run marker `SKILLED_BOT_RUN_ID` the runner exports to its child (phase 3 ADR-005, Accepted by operator decision D7), the refusal cause `awaiting-decision-hold` (operator decision D9), the body-secret predicate, the generation stamp writer, a runner entry that takes a `resume` request and the CLI entry `.skilled/bin/bots.cjs`. REQ-011 depends on the run marker.
- This phase owns `bots answer <item-id> "<text>"` (operator decision D12, Q005 here). It records the answer on the user-level needs-you item through phase 1's item helpers, enqueues one `resume` request and rewrites phase 3's generation stamp. Phase 3 keeps writing items, `bots inbox`, expiry and building the resumed prompt when the runner gets a `resume` request. REQ-014 and REQ-016 depend on this split.
- Phase 1 owns the explicit `identity` key in `bots/config.json` and the rule that a state folder never resolves while identity is unknown (operator decision Q003). REQ-015 depends on it.
- The Predecessor row is folder order. Build dependencies are: phase 3, and phase 1 through it. Phase 4 runs in parallel with this phase and is not a dependency.

**Deliverables**:
- Queue modules under `.skilled/skills/system-skilled-bots/runtime/lib/`.
- The `bots enqueue`, `bots drain` and `bots answer` verbs.
- One opt-in, non-fatal leg in `.skilled/scripts/git-hooks/post-commit`.
- Race, duplicate, quarantine, retry and hook tests.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
After phase 3 a bot runs only when someone types `bots run <id>`. Nothing in the repository claims a queued request atomically or bounds its retries, so an event-driven bot has no safe path to a run (research.md §9). A queue built carelessly is worse than none: under launchd's `QueueDirectories` a request that never leaves the folder respawns the job every 10 seconds, forever (research.md §9).

### Purpose
Any producer can write one run request, and each request ends in exactly one run or in quarantine with a reason.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ ls -A .skilled/skills/system-skilled-bots/ | wc -l
       0
$ grep -c 'bots' .skilled/scripts/git-hooks/post-commit; echo "exit=$?"
0
exit=1
$ wc -l < .skilled/scripts/git-hooks/post-commit
     120
$ grep -n '|| true$' .skilled/scripts/git-hooks/post-commit
69:  autostash_orphan_guard || true
112:        bash "$_as_sync" --auto --quiet || true
```
The skill folder exists and is empty. The post-commit hook has 120 lines and no bots leg. Its two existing calls end in `|| true`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Define the request record with the §9 fields: `id`, `workflowId`, `prompt`, `source`, `origin`, `enqueuedAt`, `target`, `firedSlot`, `idempotencyKey` and `delivery`. `target` carries the repository identity beside the local path (research.md §9).
- Add a `kind` field to the record. It is `run` by default. It is `resume` for a request that `bots answer` writes, with source `answer` and the needs-you item id as its idempotency key. A `resume` request is claimed, retried and quarantined like any other (operator decision Q002).
- Add `bots answer <item-id> "<text>"` as a queue producer. It runs phase 3's body-secret predicate over the answer, records the answer on the open item, enqueues one `resume` request with source `answer` and the item id as idempotency key, then rewrites the generation stamp. The answer is recorded before the enqueue, so the runner's hold check never refuses the resumed run (operator decision D12).
- Quarantine a request the runner refuses with `awaiting-decision-hold` with reason `held-needs-you`, and never replay it, the same rule as `paused` (operator decision D9, ADR-004).
- Refuse to enqueue while the repository identity is unknown. A repository with no remote must set `identity` in `bots/config.json` first (operator decision Q003).
- Derive the idempotency key from the event source and the source's own event id. A caller-supplied key wins. A body hash is never the key, because a changed payload would change it (research.md §9, Eliminated Alternatives).
- Enqueue by writing a temp file and renaming it into the watched folder. Claim by renaming out of the watched folder before dispatch. Quarantine with a reason. Stop retrying at a fixed bound (research.md §9).
- Add `bots enqueue` and a `bots drain` consumer that the operator runs by hand.
- Add one opt-in leg to the git post-commit hook. It only enqueues, never fails a commit, never runs an agent and does nothing in an untrusted repository (research.md §9).

### Out of Scope
- The queue-drain launchd agent with `QueueDirectories` - it is a launchd agent, so it ships with the transactional installer in phase 6 (phase advice §4 item 5).
- The webhook adapter - it depends on the Hermes gateway and is build step 10 (research.md §15).
- Retention of request files and seen-key markers - phase 7 owns retention, and the retention keys accepted by operator decision D5 do not cover them.
- Any `launchctl` call or plist - the scheduling invariant reserves both for phase 6 (phase advice §5).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts` | Create | Build and validate one request record and derive its idempotency key |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | Create | Queue folder layout, atomic enqueue, seen-key marker, atomic claim, retry and quarantine moves |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Create | Claim each request, hand it to the phase 3 runner and route the outcome |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Create | `bots answer`: check the item, run the body-secret predicate, record the answer, enqueue one `resume` request and rewrite the stamp |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify (created in phase 3) | A `queued` request kind, so the runner writes the request join in its one record and dispatches the request prompt after the bot prompt |
| `.skilled/bin/bots.cjs` | Modify (created in phase 3) | Add the `enqueue`, `drain` and `answer` verbs |
| `.skilled/scripts/git-hooks/post-commit` | Modify | One opt-in, non-fatal enqueue leg after the trust block. Shared file: see Shared File below |
| `.skilled/skills/system-skilled-bots/runtime/tests/` | Create | Race, duplicate, quarantine and retry tests as `*.vitest.ts` files run by vitest, plus the hook test script |
| `.skilled/scripts/git-hooks/README.md` | Modify, only with the operator's yes | Name the new leg in the `post-commit` row at line 115 |
| `.skilled/skills/sk-git/references/continuous-integration.md` | Modify, only with the operator's yes | Note beside the post-commit description at lines 104-108 that the hook carries a second, bots leg |

### Shared File: the post-commit hook

`.skilled/scripts/git-hooks/post-commit` runs machine-wide for every repository, so its owner and callers are named here before any edit.
- **Owner:** sk-git documents the hook, in `.skilled/skills/sk-git/references/continuous-integration.md:104-108` and `.skilled/skills/sk-git/SKILL.md:81`. No file names an owner explicitly, so that is an inference from where it is documented.
- **Installer:** `.skilled/scripts/install-git-hooks.sh:195` symlinks it into the hooks folder.
- **Tests:** `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh` holds the source-root and trust blocks identical across six hooks and runs post-commit end to end at lines 149, 152, 166, 189 and 198. `.skilled/scripts/git-hooks/tests/autostash-orphan-guard.test.sh` copies the hook into a fixture at line 47 and commits through it. `.skilled/scripts/git-hooks/tests/gate-config.test.sh:140-142` does not run the hook. It greps it for `SPECKIT_SKIP_*` and `SPECKIT_ALLOW_*` names and fails on any name with no registry row, so the leg must not read a new variable of either form.
- **Sourced library:** `.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh`.
- **Inventory doc:** the `post-commit` row at `.skilled/scripts/git-hooks/README.md:115`.
- **Edit rule:** the leg goes between the end of the `SPECKIT_AUTOSYNC` branch (line 118) and `exit 0` (line 120). That is after the trust block (lines 29-61) and after the autostash guard, so a fault in the leg cannot skip either earlier leg under `set -euo pipefail`. It touches neither of the blocks the test holds identical.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A request file appears in the watched folder only by rename from a temp folder on the same filesystem. No partial file is ever visible there. |
| REQ-002 | Claim is one `rename` from the watched folder to the claimed folder before dispatch. When two consumers race for one request, exactly one rename succeeds and exactly one run starts. |
| REQ-003 | The idempotency key is the event source plus the source's own event id, or a caller-supplied key. Enqueueing the same source event twice, with a changed payload, yields one run. |
| REQ-004 | A malformed request, a malformed definition, a failing precheck, a disabled bot, a paused bot (ADR-004), a held bot (REQ-017) and a request past the retry bound each end in the quarantine folder with a recorded reason. The watched folder is empty afterwards. |
| REQ-005 | A failing request is attempted at most the retry bound times (ADR-002), then quarantined. |
| REQ-006 | The temp, claimed, quarantine and seen-key folders sit outside the watched folder and on the same filesystem as it, under the state root keyed by repository identity (ADR-003). |
| REQ-007 | The post-commit leg exits the hook with status 0 in every case, never starts an agent and does nothing in a repository the hook trust block rejects. It calls the CLI only by a path under `$SOURCE_ROOT`, never by a `bots` found on `PATH`, so the trust block decides whether it runs. |
| REQ-008 | No code path in this phase writes a plist or calls `launchctl`. |
| REQ-015 | `bots enqueue` refuses while the repository identity is unknown. It exits non-zero, writes no file under the state root and names the `identity` key in `bots/config.json` in its message. An explicit `identity` in `bots/config.json` lets a repository with no remote enqueue. The post-commit leg still exits 0 when enqueue refuses. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | The post-commit leg is opt-in. It acts only when `gitHookTrigger` is `true` in `bots/config.json` (phase 1 ADR-009) and a bot declares a commit trigger. The `hook_enabled` resolver is an extra off switch, never the opt-in, because it defaults to on. |
| REQ-010 | The post-commit leg does not restrict itself to linked worktrees (ADR-001). |
| REQ-011 | The post-commit leg skips a commit made inside a bot run, so a bot that commits cannot enqueue itself. It tells a bot run by the run marker `SKILLED_BOT_RUN_ID` (phase 3 ADR-005, Accepted). |
| REQ-012 | `bots drain` prints one line per request with its id and outcome (`ran`, `retry`, `quarantined: <reason>` or `duplicate`) and exits 0 when the watched folder is empty at the end. |
| REQ-013 | Every run record a drained request produces carries the request join of research.md §10: request id, lease nonce, result event id and fired slot. |
| REQ-014 | The request record accepts kind `resume`, with source `answer` and the needs-you item id as its idempotency key. Drain claims it, retries it within the bound and quarantines it like any request. A second `bots answer` to the same item hits the seen-key marker, prints `duplicate` and yields no second run. This kind is not the phase 3 `bots resume` verb, which lifts a pause. |
| REQ-016 | `bots answer <item-id> "<text>"` exits 2 with no text. It refuses an unknown item, an expired item and a different answer to an answered item, each with a non-zero exit. It runs phase 3's body-secret predicate over the answer and refuses a secret by key, never by value. On an open item it records the answer through phase 1's item helpers, enqueues one request of kind `resume`, source `answer` and idempotency key equal to the item id, writes that request id into the item's `resumeRequestId` and then rewrites phase 3's generation stamp. The answer is written before the enqueue. Re-running the same answer re-sends the same request, which is stored once (operator decision D12). |
| REQ-017 | Drain maps the runner refusal `awaiting-decision-hold` to quarantine with reason `held-needs-you`. Answering the item or its expiry never replays the request, the same rule as `paused` (ADR-004, operator decision D9). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: Two `bots drain` processes started together against one request leave exactly one run record that joins that request.
- **SC-002**: `bots enqueue` run twice with the same source and event id but different prompts leaves one run record after `bots drain`.
- **SC-003**: After `bots drain` over a malformed definition, a failing precheck, a disabled bot and a paused bot, `ls -A` of the watched folder prints nothing and the quarantine folder holds four requests with four reasons.
- **SC-004**: A commit in a trusted fixture repository with commit triggers on enqueues one request and exits 0. The same commit in an untrusted clone enqueues nothing.
- **SC-005**: Two `resume` enqueues for one needs-you item leave one run record after `bots drain`, and the second enqueue prints `duplicate`.
- **SC-006**: In a fixture repository with no remote and no `identity` in `bots/config.json`, `bots enqueue` exits non-zero and the state root holds no new file. After `identity` is set, the same enqueue writes one request.
- **SC-007**: `bots answer <item-id> "yes"` run twice on one open item leaves one `resume` request, and the item reads `answered` with that request id.
- **SC-008**: A request for a bot with an open needs-you item ends in quarantine with reason `held-needs-you`, and `ls -A` of the watched folder prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3 runner returns a refusal class for disabled, paused, precheck failure and malformed definition | Without it, drain cannot tell a refusal (quarantine) from a failure (retry) | Agree the outcome classes with phase 3 before T005. Drain treats an unknown outcome as a failure, so the retry bound still stops it |
| Dependency | Phase 3 runner takes a `resume` request and exports the body-secret predicate and the stamp writer | Without them `bots answer` cannot refuse a secret or bump the stamp, and drain cannot start a resumed run | This phase owns `bots answer` and its end-to-end test (operator decision D12). Phase 3 closes before this phase starts |
| Dependency | Phase 1 state-root layout and the `gitHookTrigger` key in `bots/config.json` | The queue path and the hook opt-in have no home | Take both from phase 1's spec. A change goes back through phase 1 |
| Risk | A request that never leaves the watched folder respawns the phase 6 agent forever | High | Claim before dispatch, quarantine outside the watched folder and a retry bound (research.md §9, §13) |
| Risk | `rename` across filesystems fails with EXDEV, which would break the race guarantee | Med | All queue folders are siblings under one state-root directory. A test asserts one device id for all of them |
| Risk | A bot that commits re-enqueues itself on every commit | High | The leg skips when the runner's run marker `SKILLED_BOT_RUN_ID` is set (REQ-011). The retry bound and the §13 runaway conditions still apply |
| Risk | Editing a hook that runs for every repository on the machine | High | Leg after the trust block, cheap file test first, `|| true`, and the existing hook tests rerun unchanged |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: In a repository with no `bots/config.json`, the post-commit leg runs only a shell file test and starts no `node` process.
- **NFR-P02**: In an opted-in repository, the leg adds at most one `bots enqueue` process per commit. It never waits on a run.

### Security
- **NFR-S01**: The leg runs only from the trusted source root the hook's trust block selects. An untrusted repository resolves to `/dev/null/.skilled-untrusted` and finds no CLI, even when a `bots` command is on `PATH`.
- **NFR-S02**: A request record holds no secret. `prompt` and `origin` are written as given, and the runner applies the §13 secret refusals at dispatch.

### Reliability
- **NFR-R01**: Queued requests survive a restart, because they are files under the state root.
- **NFR-R02**: A crash between claim and dispatch leaves the request in the claimed folder, never in the watched folder. `bots drain` reports such stale claims rather than redispatching them silently.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: `bots drain` on an empty watched folder prints nothing and exits 0.
- Maximum input: one drain pass handles every request present when it starts. A request that arrives during the pass is left for the next pass.
- Failure path: a request file that does not parse is quarantined with reason `malformed-request` and never retried.
- Amend and rebase: each makes a new commit SHA, so each is a new source event and a new request. That is the intended reading of a source-derived key.
- Second answer: a second `bots answer` to one needs-you item derives the same key, so enqueue reports `duplicate` and no second run starts.
- Held bot: a request for a bot with an open needs-you item is quarantined with reason `held-needs-you`, never left in the watched folder.
- Unknown identity: a repository with no remote and no `identity` in `bots/config.json` cannot enqueue. The hook leg swallows the refusal and the commit still succeeds.
- Crash after the seen-key marker and before the rename: the event is lost, not duplicated. That is this phase's own at-most-once choice for requests, made by analogy with the §15 rule that delivery is at most once. §15 itself covers delivery sends, not requests.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four new modules, three CLI verbs, one leg in a shared hook, one test folder |
| Risk | 16/25 | Concurrency on rename, a machine-wide hook, a respawn loop if quarantine fails |
| Research | 6/20 | §9 sets the design. Q9, the retry bound and the layout remain. The opt-in key is phase 1's `gitHookTrigger` |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should the git-hook trigger fire only in linked worktrees (research.md §16 Q9)? Answered by the operator: no, every checkout. See ADR-001, Accepted.
- What is the retry bound? Answered by the operator: 3 attempts. See ADR-002, Accepted (operator decision D11).
- How does the post-commit leg find the `bots` CLI in a consumer repository that trusts its hooks with `skilled.trustRepoHooks=true` and carries a vendored tree? Not settled by the research. Phase 1's packaging layout and phase 8's re-pin test must answer it.
- Where do requests for a paused bot go? Holding them in the watched folder would respawn the phase 6 agent. Answered by the operator: quarantine with reason `paused`, never replayed. See ADR-004, Accepted (operator decision D11). A held bot follows the same rule with reason `held-needs-you` (D9).
- Should the runner take a queued request kind? Answered in a follow-up fix: yes. The runner takes a `queued` request kind carrying the request id, source, fired slot and prompt, and writes `request.requestId`, `request.firedSlot` and `dispatch.source` in the run's one record. The drain no longer rewrites the record or advances the stamp.
- How does a queued request's prompt combine with the bot body? Neither this spec nor the phase 1 run-record contract says. Built the conservative way: the request prompt follows the bot prompt under one separator line, an empty prompt adds nothing, and the body-secret predicate runs over it before dispatch. Decision: ADR-005, Accepted by the orchestrator on 2026-11-23 while every request producer is local; framing request text as data is required before any untrusted producer ships.
- Should two runner refusals depart from ADR-002's rule that a refusal is never retried? Open, raised in the build, built the conservative way pending an answer. `lease-held` is retried and counts toward the bound, because a held lease means another run of the bot is in progress. `identity-unknown` and `run-folder-refused` before a run id stop the drain pass and put the request back unchanged, because they would refuse every request alike and quarantining them would empty the queue for a setup fault. Quarantining both, as ADR-002 reads, is a change of two lines in `request-drain.ts`.
- What do the §9 fields `origin` and `delivery` hold? Open. research.md is not in this checkout, so the build stores both as an optional string, written as given, and `workflowId` as the bot id.
<!-- /ANCHOR:questions -->

---
