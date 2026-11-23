---
title: "Decision Record: Phase 4: worktree-isolation-and-delivery"
description: "Decisions for phase 4: first delivery channels, how the runner calls sk-git worktree mechanics, provisioning, mid-edit death, end-of-run removal, the delivery state names and the deviations the build made."
trigger_phrases:
  - "worktree isolation and delivery decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery"
    last_updated_at: "2026-11-23T08:40:00Z"
    last_updated_by: "phase-builder"
    recent_action: "Added ADR-008 for the parked worktree resume and the ignored-path trade-off in ADR-004"
    next_safe_action: "Orchestrator reviews and commits the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-worktree-isolation-and-delivery"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 4: worktree-isolation-and-delivery

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: First delivery channels: local-only and the desktop notice

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, through the frozen decision D1 in `goal.md` |

---

<!-- ANCHOR:adr-001-context -->
### Context

The `BOT.md` delivery fields allow a target list, a failure override and a local-only value (research.md §5). Phase 3 writes only `not-attempted` or local-only. This phase must ship at least one channel that reaches a person, and every channel must fit the at-most-once states in research.md §10.

### Constraints

- A desktop notice through `osascript` has no acknowledgement, so it can claim only `attempted` (research.md §10, `.skilled/hooks/session-handover/lib/hop-history.cjs:134`).
- The webhook adapter is build step 10 and out of this packet (research.md §15). Any chat or email channel needs a secret, which the three secret refusals in research.md §13 make costly.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Ship the local-only value and the macOS desktop notice in this phase, and no network channel.

**How it works**: Local-only writes the delivery record and sends nothing. The desktop channel calls `osascript` once after the terminal record is written and stores `attempted`. Other channel names in a definition fail the checker until a later phase adds them.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Local-only and desktop notice** | Needs no secret or network. Uses a pattern the repository already runs | The notice is never confirmed, so a missed notice looks the same as a shown one | 8/10 |
| Local-only only | Smallest change | A failed unattended run still reaches nobody | 4/10 |
| Add a webhook or chat channel now | Reaches a person off the machine | Needs a secret path and a retry story that step 10 owns | 5/10 |

**Why this one**: It is the smallest set that tells a person a run failed, and it adds no secret to any definition.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A failed run shows a notice on the operator's desktop.
- No channel in this phase needs a credential.

**What it costs**:
- The notice is unconfirmed. Mitigation: status (phase 7) shows the delivery record, so the record is the source of truth.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator wants a channel off the machine before step 10 | M | Record the wanted channel here. Add it as its own later phase |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a channel, failed unattended runs are silent |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | Two channels, both local |
| 4 | **Fits Goal?** | PASS | Delivery is in this phase's scope (research.md §15 step 5) |
| 5 | **Open Horizons?** | PASS | The record shape takes any later channel |

**Checks Summary**: 5/5 PASS, as judged by the spec writer. Accepted through the frozen decisions in `goal.md`.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `delivery.ts` gains the `local` and `desktop` channels.
- The checker refuses unknown channel names.

**How to roll back**: Remove the desktop channel from `delivery.ts`. Records fall back to local-only and nothing else changes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The unattended runner never picks a workspace

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, through the frozen decision D2 in `goal.md` |

---

<!-- ANCHOR:adr-002-context -->
### Context

sk-git forbids an agent from choosing between a worktree and the current branch by itself (`.skilled/skills/sk-git/SKILL.md:58`). An unattended run has nobody to ask. research.md §5 resolves this by making the definition declare `isolation`, with a repository default allowed in `bots/config.json`.

### Constraints

- The runner must not create a branch with git primitives. Branches come only from sk-git's scripts.
- Numbers must come from the locked allocator so concurrent runs cannot collide (`.skilled/skills/sk-git/scripts/worktree-naming.sh:27`).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We propose**: Treat the definition's `isolation` field, or the repository default, as the author's standing answer to the workspace question, and create every tree through `worktree-naming.sh create`.

**How it works**: The runner reads the honored posture from phase 3's posture step. For `worktree` it calls `worktree-naming.sh create <slug> --no-provision`. It never calls `git worktree add` or `git branch` itself. A definition with no answer gets phase 1's missing-posture rule.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Definition declares, sk-git script creates** | Keeps the author's choice explicit and reuses the locked numbering | The runner depends on a script's command-line shape | 9/10 |
| Runner calls `git worktree add` directly | No shell-out | Breaks the sk-git branch rule and the shared numbering | 2/10 |
| Ask at run time | Matches the interactive rule | Impossible with nobody present | 1/10 |

**Why this one**: It is the only option that obeys the sk-git rule with no human present.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Every bot branch follows `worktrees/NNN-slug` and is visible to the reaper's numbered lane.
- The author's choice is in the checked-in definition.

**What it costs**:
- A change to the script's interface breaks isolation. Mitigation: a test pins the call shape against the usage text.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A repository default silently turns every bot into a worktree bot | M | The run record names where the posture came from: definition or repository default |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The sk-git rule applies to every agent |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Reuses an existing script |
| 4 | **Fits Goal?** | PASS | Isolation is this phase's core |
| 5 | **Open Horizons?** | PASS | A Hermes backend can read the same field |

**Checks Summary**: 5/5 PASS, as judged by the spec writer. Accepted through the frozen decisions in `goal.md`.
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `isolation.ts` calls `worktree-naming.sh create`.
- The run record names the posture source.

**How to roll back**: Revert `isolation.ts`. The runner goes back to refusing `isolation: worktree`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Provision a bot worktree with links, not a full install

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, through the frozen decision D3 in `goal.md` |

---

<!-- ANCHOR:adr-003-context -->
### Context

A fresh worktree has no dependency trees and fails in ways that read as broken code (`.skilled/skills/sk-git/SKILL.md:155`). Two provisioning styles exist. `worktree-naming.sh create` installs the dependency trees. The launcher links a list of shared paths (`.skilled/bin/worktree-session.sh:108`). research.md §13 names the linked style and its removal hazard.

### Constraints

- Removal must not follow a link into the main checkout (research.md §13).
- An unattended run should not depend on a network install succeeding.
- sk-git binds a narrower rule: no path shared into a worktree may resolve a repository-internal reference back to the source checkout (`.skilled/skills/sk-git/SKILL.md:159`). A wholesale `node_modules` link breaks it, because the workspace self-links inside re-anchor into the main checkout (`.skilled/skills/sk-git/SKILL.md:160`). The launcher already avoids this by linking third-party entries one by one and recreating the self-links (`.skilled/bin/worktree-session.sh:348`).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We propose**: Create the tree with `--no-provision` and link the shared path list, with `SPECKIT_WORKTREE_SHARED_PATHS` or a `bots/config.json` entry able to replace the list.

**How it works**: `isolation.ts` reads the default list the launcher uses and links each path that exists in the main checkout the way the launcher does. A dependency root with workspace self-links becomes a real folder, its third-party entries are linked one by one and its self-links are recreated relative to the worktree. Every link made is recorded. Removal unlinks exactly that recorded set first.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Links to shared paths** | Fast, no network, matches research.md §13 | Removal must unlink first or it damages the main checkout | 8/10 |
| Full `provision` install per run | No link hazard at removal | Slow, needs the network, and a failure (exit 3) ends the run | 5/10 |

**Why this one**: Setup stays fast and offline, and the one hazard has a direct test.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Setup needs no network.
- The link set is recorded, so removal knows exactly what to unlink.

**What it costs**:
- Links share the main checkout's build output, so a bot that rebuilds writes into it. Mitigation: the measured setup time and any such write show in the run record, and a bot that builds can declare the full install once a later phase allows it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Removal follows a link into the main checkout | H | Unlink first. Test with a fake `node_modules` entry count before and after |
| A wholesale link makes the bot read the main checkout's code | H | Link the way the launcher does. A test plants a workspace self-link and asserts it resolves inside the worktree |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A tree without dependencies fails |
| 2 | **Beyond Local Maxima?** | PASS | Two styles compared |
| 3 | **Sufficient?** | PASS | Reuses the existing list |
| 4 | **Fits Goal?** | PASS | Provisioning is in scope |
| 5 | **Open Horizons?** | PASS | The list can be replaced per repository |

**Checks Summary**: 5/5 PASS, as judged by the spec writer. Accepted through the frozen decisions in `goal.md`.
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `isolation.ts` links and records the shared paths.

**How to roll back**: Switch the create call to the default provisioning install and drop the link step.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: A run that dies mid-edit keeps its tree and reports it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, through the frozen decision D4 in `goal.md` |

---

<!-- ANCHOR:adr-004-context -->
### Context

A run killed while editing leaves a dirty tree. The reaper keeps such a tree on purpose (`.skilled/bin/worktree-reaper.sh:22`) and never forces a removal (`.skilled/bin/worktree-reaper.sh:35`). A first-build invariant says a dirty or unmerged worktree is never reclaimed automatically (research.md §15).

### Constraints

- The run ends as `unknown` only after its owner process is proved gone (research.md §10).
- No scheduled reclaimer exists in this packet.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We propose**: Keep the tree, write it in the run record as kept with the reason `dirty`, `unmerged` or `half-provisioned`, and name it in the delivery message.

**How it works**: On every exit path isolation checks `git status --porcelain --untracked-files=all` and the branch's ancestry before removal. Any non-clean result keeps the tree and writes the reason. The delivery body names the path and branch so the operator can open it. A folder isolation made to hold links is listed too: an entry in it that is neither a recorded link nor a recorded folder keeps the tree as `dirty` with its links intact, because git status cannot see inside those folders (`.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:621`).

**Trade-off, ignored paths**: The inspection does not pass `--ignored`, so content in a gitignored path is not treated as work. A tree whose only changes sit in ignored paths reads as clean and is removed with that content. A bot that must keep output writes it to a tracked path, or puts it in its delivery. Counting ignored content as work would keep nearly every tree, because dependency and build folders are ignored by design.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep and report** | Never loses work. Matches the reaper and the invariant | Trees accumulate until the operator acts | 9/10 |
| Stash and remove | Frees disk | Hides work in a stash nobody watches and breaks the invariant | 2/10 |
| Keep silently | No noise | The operator never learns a run died mid-edit | 3/10 |

**Why this one**: It is the only option that keeps the invariant and tells the operator.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- No bot work is ever lost by the runner.
- The record's worktree path and branch join the tree to its run.

**What it costs**:
- Kept trees use disk. Mitigation: the operator runs `.skilled/bin/worktree-reaper.sh --numbered`, which removes only trees that later become clean and merged.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Many kept trees after a bad night | L | Status (phase 7) can list kept trees from the records |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Mid-edit death is a normal failure for an unattended run |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | No new mechanism |
| 4 | **Fits Goal?** | PASS | Named by the phase advice |
| 5 | **Open Horizons?** | PASS | A later reclaimer reads the same reason field |

**Checks Summary**: 5/5 PASS, as judged by the spec writer. Accepted through the frozen decisions in `goal.md`.
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `isolation.ts` writes the kept reason.
- `delivery.ts` includes kept trees in the message.

**How to roll back**: Not applicable: keeping a tree has nothing to revert. Remove the reporting lines to go silent.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The runner removes only a clean, unchanged tree at the end of a run

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, through the frozen decision D3 in `goal.md` |

---

<!-- ANCHOR:adr-005-context -->
### Context

The scheduled reclaimer is build step 10 and out of this packet (research.md §15). Without some removal, every read-only worktree run leaves a tree behind. The reaper's numbered lane already defines when a tree is safe to remove, and waits 48 idle hours by default (`.skilled/bin/worktree-reaper.sh:31`).

### Constraints

- Removal is plain `git worktree remove` then `git branch -d`, never forced (`.skilled/bin/worktree-reaper.sh:35`).
- Links are unlinked before removal (ADR-003).
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We propose**: At the end of a run, remove the tree only when it is clean, has no commits beyond its base and has no stash. Leave every other tree to the operator and the reaper.

**How it works**: After the result event and before the terminal record, isolation checks the three conditions, unlinks the recorded links and removes the tree and branch without force. A refusal from git keeps the tree and writes the refusal as the kept reason. The first draft placed this step after delivery; ADR-007 moved it so the notice can say whether the tree was kept.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove clean, unchanged trees at run end** | No pile-up from read-only runs. Conservative rules | Duplicates a small part of the reaper's checks | 8/10 |
| Never remove, leave all to the reaper | No removal code in the hub | Every run leaves a tree for at least 48 hours | 5/10 |
| Call `worktree-reaper.sh --numbered` after each run | Reuses the reaper | Its idle threshold keeps the fresh tree, and it sweeps trees that are not the bot's | 4/10 |

**Why this one**: It stops pile-up from runs that changed nothing, and it never removes a tree with work in it.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A read-only worktree run leaves nothing behind.
- A tree with commits is always kept for the operator.

**What it costs**:
- Some reaper logic is repeated. Mitigation: the check list is the reaper's, named in a code comment that explains why.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A check misses a change and a tree with work is removed | H | `git branch -d` refuses an unmerged branch. A test commits in the tree and asserts it is kept |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it read-only runs pile up trees |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Three checks and no force |
| 4 | **Fits Goal?** | PASS | Removal is in scope (AC-002) |
| 5 | **Open Horizons?** | PASS | The step 10 reclaimer can replace it |

**Checks Summary**: 5/5 PASS, as judged by the spec writer. Accepted through the frozen decisions in `goal.md`.
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `isolation.ts` gains the end-of-run removal.

**How to roll back**: Delete the removal call. Trees then wait for the reaper.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Delivery states are named queued and claimed, not pending and delivering

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-23 |
| **Deciders** | Phase builder, under the orchestrator's instruction to take the spec's names |

---

<!-- ANCHOR:adr-006-context -->
### Context

The delivery model comes from Hermes' cron delivery queue, which claims each row at most once and marks an uncertain send `unknown` (`~/.hermes/hermes-agent/cron/delivery_queue.py:5`). Hermes stores its two in-flight states as `pending` and `delivering`. research.md §10 names them `queued` and `claimed`. A delivery record must use one pair before the first one is written.

### Constraints

- research.md §10 forbids a sixth vocabulary: delivery states already exist in the run record contract.
- Phase 1's run record already validates the states `queued`, `claimed`, `delivered`, `failed`, `unknown`, `not-attempted` and `attempted` (`.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:55`).
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: `queued` and `claimed`, then `delivered`, `failed` or `unknown`, plus `not-attempted` and `attempted`.

**How it works**: The sources agree, so no tie-break was needed. spec.md section 3 names `queued`, `claimed`, `delivered`, `failed` and `unknown`. research.md §10 names the same five. This decision record named no state before this entry, and the phase 1 contract already holds the same list. `delivery.ts` imports the states from the run record type and never restates them. Hermes' `pending` and `delivering` map one to one onto `queued` and `claimed`.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **queued and claimed** | Matches the spec, research.md and the phase 1 contract | Differs from the Hermes source names | 9/10 |
| pending and delivering | Matches Hermes word for word | Needs a contract change and disagrees with the spec | 3/10 |

**Why this one**: Every document in this packet already uses it, and the contract validates it.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- One vocabulary across the spec, the record and the code.

**What it costs**:
- A reader who knows Hermes must map two names. Mitigation: this record names the mapping.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later Hermes backend writes its own names into a record | L | The record validator refuses any state outside the list |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A record cannot be written without a state name |
| 2 | **Beyond Local Maxima?** | PASS | Two naming sets compared |
| 3 | **Sufficient?** | PASS | Uses the existing contract list |
| 4 | **Fits Goal?** | PASS | Delivery records are in scope |
| 5 | **Open Horizons?** | PASS | The mapping lets a Hermes backend translate |

**Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `delivery.ts` writes `queued`, then `claimed`, then the outcome state.

**How to roll back**: Not applicable: no record was ever written with the other names.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Deviations the build made from the plan

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-23 |
| **Deciders** | Phase builder; each item is the most conservative reading of an open point, for the orchestrator's review |

---

<!-- ANCHOR:adr-007-context -->
### Context

Building against the phase 3 code showed five places where the plan and the code did not line up, or where the spec left a choice open.

### Constraints

- The runner's rule that every stop before dispatch is a refusal, never a failure (`.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:7`).
- The phase 3 and phase 2 tests pin exact record and fixture shapes.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**:
1. **Removal before delivery.** The plan's data flow removed the tree after delivery. REQ-003 needs the notice to say whether the tree was kept, which is only known after the check. The runner now finishes the tree after the result event and before the terminal record, and delivery reads the outcome from the record. NFR-P02 still holds: the terminal record is written before any send.
2. **The refusal lived in `posture.ts`.** Phase 3's refusal of `isolation: worktree` sat in `posture.ts`, not `runner.ts`. The build changed `posture.ts` to honor both values and retargeted the two phase 3 tests that asserted the old refusal.
3. **Setup problems are refusals.** A base inside the checkout or an unresolved shared-path list is the refusal `worktree-refused` (class operator). A failed or half-provisioned create is the refusal `worktree-setup-failed` (class environment), and the tree is kept. The spec's "environment-class failure" is kept as the class.
4. **An unconfigured base is refused.** The base is `SPECKIT_WORKTREE_BASE`, else `speckit.worktreeBase` git config, read the way the numbering script reads them. With neither set, the run is refused (`worktree-refused`, detail `worktree-base-unconfigured`) instead of falling back to the script's in-checkout `.worktrees`. A base inside the checkout, the main checkout or the Skilled tree is refused too. A first build used a default under the user-level state root. A dry run of `.skilled/bin/worktree-reaper.sh --numbered` against three such trees printed `reason=not a numbered branch and folder pair` for each one, because the reaper's pair check (`.skilled/skills/sk-git/scripts/worktree-naming.sh:190`) only accepts a tree whose parent is the configured base. Such a tree could never be reclaimed by the path ADR-004 names. With `speckit.worktreeBase` set, the same dry run printed `verdict=would-reap ... reason=idle` for the clean tree and `verdict=keep` for the dirty and unmerged ones. A base taken from the environment can be reaped only from a shell that sets the same variable, so git config is the documented route, and the record's worktree detail names the base source.
5. **"Resolves" for REQ-009.** A shared-path list resolves when every entry is a relative path with no `..` segment. The list comes from `worktreeSharedPaths` in `bots/config.json`, then `SPECKIT_WORKTREE_SHARED_PATHS`, then the launcher's default, read from its text. The checker checks a declared config list even when no bot uses a worktree, and checks the resolved list for every worktree bot. The negative fixtures live beside the checker's other fixtures in `scripts/fixtures/`, because the checker test requires one fixture per hard invariant there.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **The five choices above** | Each keeps an existing invariant or test and errs toward keeping a tree | Touches files outside the Files to Change table | 8/10 |
| Follow the plan literally | No deviation to explain | The notice could not report a kept tree, and the default base would land inside the checkout | 3/10 |

**Why this one**: Each choice is the conservative reading, and each is named here for review.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- The notice names a kept tree with its reason and branch.
- No bot tree can land inside a checkout, and every bot tree sits where the reaper's numbered lane can judge it.

**What it costs**:
- Files outside the table changed: `posture.ts`, `repo-config.ts`, `state-root.ts`, `run-record.ts` and six phase 1 to 3 test files. Each change is additive or retargets an assertion this phase made false.
- A repository must set `speckit.worktreeBase` before its first worktree bot runs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The parallel request-pipeline build edits one of the shared files | M | Every edit is small and additive, and the whole suite passes with both builds present |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Each item resolves a mismatch the build hit |
| 2 | **Beyond Local Maxima?** | PASS | The literal plan was weighed |
| 3 | **Sufficient?** | PASS | No new module beyond the two planned |
| 4 | **Fits Goal?** | PASS | Every item serves a goal criterion |
| 5 | **Open Horizons?** | PASS | The step 10 reclaimer can read the same kept reasons |

**Checks Summary**: 5/5 PASS, as judged by the builder.
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `runner.ts`, `posture.ts`, `isolation.ts`, `bot-check.cjs` and the contract additions named above.

**How to roll back**: Revert the phase's commit. The runner then refuses `isolation: worktree` again.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: A parked worktree run keeps its tree, and its resume works in that tree

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-23 |
| **Deciders** | Orchestrator, option (a) of the phase review's resume finding |

---

<!-- ANCHOR:adr-008-context -->
### Context

A run that asks the operator a question parks as `awaiting-decision`, and the answer comes back as a resume run. The first build finished a parked run's tree like any other: removed when clean, kept when dirty. The resume then made a fresh tree from HEAD and reused the parked prompt. So a resume never continued the parked work, and a Vibe child, which starts outside the checkout, was handed the parked prompt's checkout line naming a tree that was gone or was not its own. A negative control showed it: a worktree bot that edits a file and parks, once answered, resumed in a new tree without the edit and failed (`specs/system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery/scratch/resume-negative-control.txt:12`).

### Constraints

- The run's lease key never holds a tree path, so the parked tree must be found from the parked run, not from the lease.
- A kept tree must stay where the reaper's numbered lane can judge it (ADR-007 item 4).
- Never hand a child a stored absolute path from a different tree.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: A run that parks keeps its tree with the kept reason `awaiting-decision`, and the resume dispatches into that same tree.

**How it works**:
- **Park.** When the run's exit names a needs-you item, the tree is not inspected or removed. The record keeps it with reason `awaiting-decision`, and the record's evidence carries the path, branch, base commit, links and the folders made for them (`.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1004`). This holds when the result event fails to record too, because that exit still names the item. A run whose item could not be written finishes its tree by the normal rules.
- **Resume.** The resume reads the parked run's record through the item's run id and takes the tree from there (`.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:525`). It checks that the path still exists and is still a worktree of the checkout on the same branch (`.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:576`), then dispatches into it without making a new one, and rewrites the lease side file so a killed resume still keeps the tree.
- **Checkout line.** For a child that starts outside the checkout, the parked prompt must hold the line that `checkoutLine` builds for the tree the resume works in (`.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:306`, `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:854`). The resume works in the parked tree, so that is the parked line. A prompt that names another folder, or none, is refused as `resume-item-invalid`. The check runs before the resume's record takes the tree, so a refused resume leaves the tree kept as `awaiting-decision`.
- **End.** The resume finishes the tree at its end with the normal clean, dirty and unmerged rules. Its base commit is the parked run's, so the parked edits keep it as `dirty`. A resume that parks again keeps the same tree as `awaiting-decision` again.

**Edge cases**:
- **The kept tree is gone**, or is no longer a worktree of the checkout on its branch: the resume is refused as `parked-worktree-missing` (class operator), and no fresh tree is made.
- **The parked run's record does not read**: a worktree bot's resume is refused as `parked-worktree-missing`. A shared bot's resume goes on in the checkout, as before.
- **The posture changed between park and answer**: a worktree bot whose parked run used no tree, or a shared bot whose parked run kept one, is refused as `resume-posture-changed` (class author). Either way the resume would work where the parked work is not.
- **The item expires unanswered**: nothing resumes, and the tree stays kept under `awaiting-decision` for the reaper and the operator.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **(a) Keep the parked tree and resume in it** | The resume continues the parked work, and the child's checkout line names the tree it runs in | A tree waits on disk until the answer, or until the reaper after expiry | 9/10 |
| (b) Refuse every resume of a worktree bot | No new state to carry | An answered question can never continue, which defeats the needs-you queue for worktree bots | 3/10 |
| Resume in a fresh tree from HEAD | No waiting tree | Loses the parked edits, the defect this record fixes | 1/10 |

**Why this one**: It is the only option where "continue the work from where that run stopped" is true.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- A resumed worktree run sees the parked edits and works in the tree its record names.
- A Vibe child's checkout line always names the tree it works in.

**What it costs**:
- A parked tree stays on disk until its answer is resumed, or until the reaper takes it after expiry. Mitigation: the record and the notice name it as kept with reason `awaiting-decision`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator removes a parked tree before answering | L | The resume is refused as `parked-worktree-missing`, never run in a fresh tree |
| The reaper's numbered lane takes a clean parked tree, one where the bot asked before editing, once it has been idle 48 hours, which is before a default 7-day item expires | L | The resume is refused as `parked-worktree-missing`, never run in a fresh tree. The operator who wants a slow answer keeps the reaper off that tree or answers within two days |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The negative control failed on the first build |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | No new item field: the parked run's record already holds the tree |
| 4 | **Fits Goal?** | PASS | Needs-you items open for worktree bots in this phase |
| 5 | **Open Horizons?** | PASS | A later reclaimer reads the same kept reason |

**Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `runner.ts` keeps a parked run's tree and resumes in it, with two new refusal causes. `isolation.ts` gains the check that a parked tree is still a worktree. `dispatch.ts` builds the checkout line in one function.

**How to roll back**: Revert the change. A parked run's tree is then finished at once again, and a resume makes a fresh tree.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | One real macOS desktop notice through the bots desktop channel is approved to close AC-012. | Not stated. | None | AC-012, T022, scratch/live-desktop-notice-result.txt |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:e69eaf8b-97d2-4d96-ad3f-66a87da7bbe5:toolu_01EXfqZjJ9CctLiGR1hpYbo8:0 -->

Question:
```text
Phase 004 (worktree isolation and delivery) needs one live check to close AC-012. It shows a single real macOS notification titled 'Skilled bot live-check' through the bots desktop channel (osascript) and prints the recorded state. No bot runs, no model is called and nothing leaves this machine. May I run it once?
```

Options:
```text
Run it once (Recommended)
Not now
```

Answer:
```text
Run it once (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
