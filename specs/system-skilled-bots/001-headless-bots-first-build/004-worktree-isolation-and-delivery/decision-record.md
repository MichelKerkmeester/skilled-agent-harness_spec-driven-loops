---
title: "Decision Record: Phase 4: worktree-isolation-and-delivery"
description: "Proposed decisions for phase 4: first delivery channels, how the runner calls sk-git worktree mechanics, provisioning, mid-edit death and end-of-run removal."
trigger_phrases:
  - "worktree isolation and delivery decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery"
    last_updated_at: "2026-11-22T10:48:30Z"
    last_updated_by: "spec-writer"
    recent_action: "Wrote five proposed decisions for worktree isolation and delivery"
    next_safe_action: "Operator decides ADR-001, then confirm ADR-002 to ADR-005"
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
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (operator-owned decision, recommendation from the phase advice) |

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

**Checks Summary**: 5/5 PASS, as judged by the spec writer. The operator confirms when the status leaves Proposed.
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
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase spec writer, operator to confirm |

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

**Checks Summary**: 5/5 PASS, as judged by the spec writer. The operator confirms when the status leaves Proposed.
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
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase spec writer, operator to confirm |

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

**Checks Summary**: 5/5 PASS, as judged by the spec writer. The operator confirms when the status leaves Proposed.
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
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase spec writer, operator to confirm |

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

**How it works**: On every exit path isolation checks `git status --porcelain --untracked-files=all` and the branch's ancestry before removal. Any non-clean result keeps the tree and writes the reason. The delivery body names the path and branch so the operator can open it.
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

**Checks Summary**: 5/5 PASS, as judged by the spec writer. The operator confirms when the status leaves Proposed.
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
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase spec writer, operator to confirm |

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

**How it works**: After delivery, isolation checks the three conditions, unlinks the recorded links and removes the tree and branch without force. A refusal from git keeps the tree and writes the refusal as the kept reason.
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

**Checks Summary**: 5/5 PASS, as judged by the spec writer. The operator confirms when the status leaves Proposed.
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

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.
<!-- /ANCHOR:operator-answers-verbatim -->

---
