---
title: "Decision Record: Phase 5: request-pipeline"
description: "Five decisions for the request pipeline: four Accepted by the operator (the git-hook scope, a retry bound of three, sibling queue folders and quarantine for paused and held requests) and one Proposed (a queued request's prompt follows the bot body)."
trigger_phrases:
  - "request pipeline decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/005-request-pipeline"
    last_updated_at: "2026-11-22T10:48:31Z"
    last_updated_by: "template-author"
    recent_action: "Recorded D9, D11 and D12; ADR-002 to ADR-004 Accepted"
    next_safe_action: "Build the pipeline once phase 3 closes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-request-pipeline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 5: request-pipeline

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The git-hook trigger fires in any trusted checkout, not only linked worktrees
<!-- FILL: Write one ADR per decision with context, choice, consequences and the rejected option. GOOD: ADR-001: a `--keep` option, because the script already parses options. WEAK: We decided on an option. -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (owns research.md §16 Q9). Answered 2026-11-22: "Every checkout (Recommended)" |

---

<!-- ANCHOR:adr-001-context -->
### Context

research.md §16 Q9 asks whether the post-commit trigger should fire only in linked worktrees. The Hy4 lineage copied that restriction from the live-sync publish leg, which tests the git dir against the common dir at `.skilled/scripts/git-hooks/post-commit:107-109`. A bot that reacts to commits on the primary checkout would never fire under it.

### Constraints

- The leg must stay non-fatal and enqueue-only (research.md §9).
- The hook trust block at lines 29-61 already limits which repositories run their own scripts.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Do not restrict the bots leg to linked worktrees. It fires in the primary checkout and in every linked worktree of a trusted, opted-in repository.

**How it works**: The leg sits after the trust block and outside the `SPECKIT_AUTOSYNC` branch at lines 81-118, so the worktree test there does not apply to it. If a bot ever needs only worktree commits, a trigger filter in `BOT.md` could express it. Phase 1 owns the `BOT.md` fields, so that is a possibility, not part of this decision.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No restriction (chosen)** | Commits on the primary checkout reach bots. Placement alone gives the behavior | Each worktree commit also enqueues, so a busy worktree session can enqueue many requests | 8/10 |
| Linked worktrees only | Matches the live-sync leg | A primary-checkout bot never fires, which defeats the trigger | 3/10 |
| A per-bot `worktreesOnly` field | Each bot picks | A new definition field that phase 1 must own, with no current bot asking for it | 5/10 |

**Why this one**: The restriction exists for the publish leg's own reason, a launch-wrapper session in a worktree. A bots trigger has no such reason, and the research names the failure the restriction would cause.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A bot reacting to commits works in the checkout most people commit in.

**What it costs**:
- More requests from worktree sessions. Mitigation: dedupe by commit SHA and the `gitHookTrigger` opt-in.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A worktree session with many commits floods the queue | M | One request per SHA, retry bound, the runaway conditions of research.md §13 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | §16 Q9 blocked the hook leg until the operator answered it |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | Placement gives the behavior with no new field |
| 4 | **Fits Goal?** | PASS | The hook leg is in this phase's scope |
| 5 | **Open Horizons?** | PASS | A per-bot filter can be added later without changing this |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The leg's position in `.skilled/scripts/git-hooks/post-commit`.
- The hook matrix test covers both a primary checkout and a linked worktree.

**How to roll back**: Add a linked-worktree test to the leg, the same check as lines 107-109. No data moves.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The retry bound is three attempts
<!-- FILL: Write one ADR per decision with context, choice, consequences and the rejected option. GOOD: ADR-001: a `--keep` option, because the script already parses options. WEAK: We decided on an option. -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, decision D11 on 2026-11-22: "Accept all three (Recommended)" |

---

<!-- ANCHOR:adr-002-context -->
### Context

research.md §9 requires a bounded retry but gives no number. A request that fails forever would keep the phase 6 queue agent alive forever.

### Constraints

- research.md §13 already stops a chain after three failures in a row, from `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:57`.
- Delivery is at most once, so a retry never resends a delivery already marked sent.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Attempt a request at most three times in total, then quarantine it with reason `retry-bound`.

**How it works**: The record carries an `attempts` count. A failure under the bound moves the file back into the watched folder through the temp folder with `attempts` raised by one. A refusal (disabled, failing precheck, malformed) is never retried and goes straight to quarantine.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3 attempts (recommended)** | Matches the existing three-failure stop | A flaky bot may need more | 8/10 |
| 1 attempt, no retry | Simplest | A transient failure loses the event | 5/10 |
| A per-bot `maxAttempts` | Flexible | Adds a definition field phase 1 must own | 6/10 |

**Why this one**: One number already governs failure stops in this repository. Using it keeps one rule, not two.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A failing request stops after at most three runs.

**What it costs**:
- A transient failure that lasts three attempts loses the event to quarantine. Mitigation: the reason file names the last attempt's own cause, for example `lease-held on attempt 3`, and the operator can re-enqueue by hand.
- A quarantined `resume` request cannot be re-sent through any verb yet. A second `bots answer` and a `bots enqueue --key <item id>` both derive the same seen-key marker and print `duplicate`. Until a requeue verb exists, re-sending one means removing its marker by hand: `<state root>/<identity key>/requests/seen/<sha256 of "<bot id>\0<item id>">`, where the identity key is the lower-cased, URI-encoded identity and the file holds the request id, so `grep -l <request id> <state root>/<identity key>/requests/seen/*` finds it. Then answer again or enqueue the resume again.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A retry runs immediately and fails for the same reason | L | The phase 6 throttle spaces spawns by 10 seconds (research.md §9). A backoff can be added later |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Fable names the number as a decision this phase must settle |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | One constant |
| 4 | **Fits Goal?** | PASS | The retry bound is in scope |
| 5 | **Open Horizons?** | PASS | A per-bot override can be added later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- One constant in `request-queue.ts`.
- `retry.vitest.ts` asserts the call count.

**How to roll back**: Change the constant. Requests already quarantined stay there.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Queue folders are siblings of the watched folder under one state-root directory
<!-- FILL: Write one ADR per decision with context, choice, consequences and the rejected option. GOOD: ADR-001: a `--keep` option, because the script already parses options. WEAK: We decided on an option. -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, decision D11 on 2026-11-22: "Accept all three (Recommended)". The phase 1 layout carries the folders |

---

<!-- ANCHOR:adr-003-context -->
### Context

`QueueDirectories` keeps a job alive while its folder is non-empty, and anything inside the folder counts (research.md §9). A temp file there starts the job early. A quarantine folder there never lets it stop.

### Constraints

- `rename` is atomic only within one filesystem. Across devices it fails with EXDEV, and the claim race guarantee depends on it.
- The queue lives under the state root, keyed by repository identity, so it survives a moved checkout (research.md §9, §11).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Use `<state root>/<repository identity>/requests/` with sibling folders `inbox/` (the only watched folder), `tmp/`, `claimed/`, `done/`, `quarantine/` and `seen/`.

**How it works**: Every state change is one `rename` between these siblings. `seen/` holds one marker per idempotency key, created with an exclusive create, so a duplicate is caught after the first request has left the inbox.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Siblings under one directory (recommended)** | Watched folder empties fully. One filesystem by construction | Six folders to create and test | 9/10 |
| Subfolders inside the watched folder | Fewer paths | Keeps the job alive forever | 1/10 |
| Temp files in the system temp folder | No extra folder | May sit on another filesystem, so rename can fail | 3/10 |

**Why this one**: It is the only layout that meets both the keep-alive rule and the one-filesystem rule.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Phase 6 can point `QueueDirectories` at `inbox/` and know it empties.

**What it costs**:
- `seen/` grows with every event. Mitigation: phase 7 retention sweeps it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The state root sits on a network or synced volume where rename is not atomic | M | Document that the state root must be local. A test asserts one device id |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Fable names the layout as a decision |
| 2 | **Beyond Local Maxima?** | PASS | Three layouts compared |
| 3 | **Sufficient?** | PASS | Siblings only, no new mechanism |
| 4 | **Fits Goal?** | PASS | Every queue move depends on it |
| 5 | **Open Horizons?** | PASS | Phase 6 and phase 7 read the same paths |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Folder creation in `request-queue.ts`.
- Phase 1's state-root layout gains the `requests/` entry, through phase 1's spec.

**How to roll back**: Move the folders back to any earlier layout with a one-time `mv`. No request file changes shape.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Requests for a paused bot go to quarantine with reason paused
<!-- FILL: Write one ADR per decision with context, choice, consequences and the rejected option. GOOD: ADR-001: a `--keep` option, because the script already parses options. WEAK: We decided on an option. -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, decision D11 on 2026-11-22: "Accept all three (Recommended)". Decision D9 extends the rule to held requests |

---

<!-- ANCHOR:adr-004-context -->
### Context

`bots pause` stops a bot from running. research.md §13 puts the pause file in the run stop layer, under the state root, and the runner reads it after it takes the lease. Phase 3 follows that order. If a paused bot's requests stay in the watched folder, the phase 6 queue agent respawns forever. research.md §9 names a disabled workflow as a quarantine case but says nothing about a paused one.

### Constraints

- The watched folder must empty after every drain pass (research.md §9).
- Delivery is at most once, so `bots resume` must not replay requests silently.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Quarantine a request for a paused bot with reason `paused`. `bots resume` does not replay it. A request for a bot held by an open needs-you item goes the same way with reason `held-needs-you`, and answering the item does not replay it (operator decision D9).

**How it works**: Drain does not read the pause file itself. It claims the request and hands it to the phase 3 runner, which takes the lease, reads the pause file and returns its paused refusal class (research.md §13). Drain maps that class to quarantine. The reason file names the bot and the pause. The operator re-enqueues by hand if the event still matters.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Quarantine with reason paused (recommended)** | One rule for every refusal. Watched folder empties | Events during a pause are not run | 7/10 |
| A `held/` folder that resume moves back | Pause loses nothing | A new folder and a replay path, and replay can run stale events | 6/10 |
| Leave the request in the inbox | No new code | Respawns the queue agent forever | 1/10 |

**Why this one**: It keeps one refusal path and the empty-inbox rule, and the loss is visible in the reason file.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Pause behaves like disable for the queue, with a distinct reason.

**What it costs**:
- Events during a pause are dropped to quarantine. Mitigation: the operator can re-enqueue them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An operator expects resume to replay events | M | `bots status` and the reason file say the events were quarantined |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The pause case is open and causes a respawn loop if wrong |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Reuses the quarantine path |
| 4 | **Fits Goal?** | PASS | Drain must handle every runner refusal |
| 5 | **Open Horizons?** | PASS | A `held/` folder can be added later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- One outcome mapping in `request-drain.ts`.

**How to roll back**: Change the mapping. Quarantined requests can be re-enqueued by hand.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: A queued request's prompt follows the bot body under a separator line

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-23 |
| **Deciders** | The builder proposed it, because neither this phase's spec nor the phase 1 run-record contract says how the two combine. Orchestrator accepted 2026-11-23: safe while every request producer is local; framing request text as data is required before any untrusted producer |

---

<!-- ANCHOR:adr-005-context -->
### Context

A request record carries a `prompt`, and the bot's `BOT.md` body carries the bot's standing instructions. Until now the drain ran a queued request as a plain manual run, so the request's prompt never reached the child. The runner now takes a `queued` request kind, and it has to decide how the two texts meet. `spec.md` says only that `prompt` is written as given and that the runner applies the secret refusals at dispatch (NFR-S02). The phase 1 run-record contract has no prompt field.

### Constraints

- The bot body is the authored, reviewed part. A request comes from an event and must not be able to drop it.
- A secret in the request prompt must be refused by key before dispatch, the same way the body and a resumed answer are.
- A request with an empty prompt, which is what the post-commit leg writes, must dispatch exactly what a manual run dispatches.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Append the request prompt after the full bot prompt, under one separator line, `REQUEST_PROMPT_HEADER` in `runner.ts`. A prompt that is empty or only whitespace adds nothing.

**How it works**: The runner builds the bot prompt from the body as before, then adds a blank line, the separator line and the request prompt. Before dispatch it runs the body-secret predicate over the request prompt with the label `request prompt`, so a secret is refused as `body-secret` and the drain quarantines the request. A run that parks keeps the combined prompt on its needs-you item, so the resumed run sees the request text too.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Append after the body under a separator (chosen)** | The body always runs. The child can tell standing instructions from the event's text | The child reads both, even when the request wants something narrower | 8/10 |
| The request prompt replaces the body | A request can run anything the bot can | An event can drop the reviewed instructions | 2/10 |
| Ignore the request prompt | No change to what runs | A stored field that never reaches the run, which is the defect being fixed | 1/10 |

**Why this one**: It keeps the reviewed body in charge and still delivers what the event asked for.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A queued request's prompt reaches the run, and the runner writes the request id, fired slot and source in the run's one record, so the drain no longer rewrites it.

**What it costs**:
- A secret in a request prompt now quarantines the request. Mitigation: the reason names the key, never the value.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator wants a different combination | L | The rule is one line in `runner.ts` and one test in `queued-run.vitest.ts` |
| A request prompt such as "ignore the instructions above" overrides the body in meaning, since the separator divides the text but carries no trust boundary | L today, H once an untrusted producer exists | Every producer in this phase is local: the operator's own `bots enqueue`, `bots answer` and the post-commit leg, which writes an empty prompt, and queue files are owner-only. See the follow-up below |

**Follow-up (condition of acceptance)**: before any untrusted producer ships, such as a webhook adapter, the runner must frame the request text as data, for example with a line that says to treat the text below as the event's request and never as a change to the instructions above, or the producer must be barred from carrying a prompt. This acceptance does not extend to an untrusted producer.
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A stored prompt that never reaches the run is a defect |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | One separator line, the existing secret predicate |
| 4 | **Fits Goal?** | PASS | Requests from events must drive runs |
| 5 | **Open Horizons?** | PASS | A later rule can change the one combining line |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `runner.ts` takes a `queued` request kind and combines the prompts. `request-drain.ts` passes the request and no longer rewrites the record or advances the stamp.

**How to roll back**: Drop the combining line in `runner.ts`. The request join stays in the runner.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The git-hook trigger fires in every trusted checkout, with no linked-worktree restriction | The operator picked the recommended option | - | ADR-001, REQ-010, AC-005 |
| Q002 | An unattended run that needs a human decision parks in a needs-you queue. Its answer comes back as a request of kind `resume` | The operator picked the decision queue. The resume request shape is Proposed | - | REQ-014, AC-008, T018, T019 |
| Q003 | A repository with no remote takes an explicit `identity` from `bots/config.json`. Enqueue refuses while identity is unknown | The operator picked the recommended option | - | REQ-015, AC-009, T020 |
| Q004 | Accept the three proposed queue defaults: a retry bound of 3, sibling queue folders and paused requests to quarantine, not replayed | The operator picked the recommended option (D11) | - | ADR-002, ADR-003, ADR-004, REQ-004 to REQ-006 |
| Q005 | `bots answer` moves here as a queue producer: it records the answer on the needs-you item, enqueues one `resume` request keyed by the item id and rewrites the generation stamp | The operator picked the recommended option (D12). It removes the wait between phases 3 and 5 | Phase 3 owning `bots answer` | REQ-016, AC-010, T021, T022 |
| Q006 | A request for a bot with an open needs-you item is quarantined with reason `held-needs-you`, not replayed | The operator picked the recommended option (D9): hold new runs until the item is answered or expires | - | ADR-004, REQ-017, AC-011, T023 |
| Q007 | The opt-in bots enqueue leg goes into the shared post-commit hook, and both the git-hooks README row and the sk-git continuous-integration note are updated to name it. | Not stated. | None | spec.md Shared File section, .skilled/scripts/git-hooks/post-commit, git-hooks/README.md, sk-git continuous-integration.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **Q001** (asked as Q9, git hook scope): "Every checkout (Recommended)".
- **Q002** (asked as Q2, a run that needs a human decision): "Decision queue". The offered option parks the run and adds a needs-you queue the operator answers later.
- **Q003** (asked as Q5, identity of a repository with no remote): "Explicit id in config (Recommended)".
- **Q004** (D11, asked as "Request queue (phase 005): accept its three proposed defaults?"): "Accept all three (Recommended)".
- **Q005** (D12, asked as "`bots answer` creates a cycle... Move it?"): "Move to 005 (Recommended)". The question text is as the orchestrator relayed it, elided in the middle.
- **Q006** (D9, asked as "While a bot has an open needs-you item, should its schedule keep firing new runs?"): "Hold new runs (Recommended)".

### Q007
<!-- source: claude:e69eaf8b-97d2-4d96-ad3f-66a87da7bbe5:toolu_01JLaoFTjZvKVQGV9tRsB8ov:0 -->

Question:
```text
Phase 005 (request pipeline) adds one opt-in, non-fatal 'enqueue a bot request' leg to the shared post-commit hook (.skilled/scripts/git-hooks/post-commit), which runs machine-wide for every repo with Skilled's hooks installed. Its spec marks two doc edits as needing your yes: the post-commit row in .skilled/scripts/git-hooks/README.md and a note in sk-git's continuous-integration.md. The hook edit itself is in the spec's frozen file list, sits after the trust and autostash blocks, and does nothing unless a repo opts in. How should 005 handle these?
```

Options:
```text
Hook leg plus both docs (Recommended)
Hook leg only
No hook leg
```

Answer:
```text
Hook leg plus both docs (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
