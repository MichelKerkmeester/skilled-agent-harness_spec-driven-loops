---
title: "Decision Record: Phase 8: hub-wiring"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "hub wiring decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/008-hub-wiring"
    last_updated_at: "2026-11-22T10:48:35Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-hub-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 8: hub-wiring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Which of the eleven integration surfaces apply

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase owner, settled by the per-hub gate |

---

<!-- ANCHOR:adr-001-context -->
### Context

`parent-skills-nested-packets.md` §7 lists eleven surfaces a mode must land on before it counts as integrated. Some apply only to certain hubs or classes. Skipping one that applies leaves a mode unreachable while every gate stays green (research.md §14).

### Constraints

- All four modes are `metadata`, so they have no advisor entry of their own (`skill-hub-routing.md` §1).
- The per-hub gate covers rows 1 to 3 and 9. Check 6b covers row 7 by name only. The mirror checkers cover row 11. Of the applied rows, 4, 6 and 8 have no gate.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Apply rows 1, 2, 3, 4, 6, 7, 8, 9 and 11, and skip row 5 and row 10.

**How it works**: Row 5 (`FULL_INVENTORY`) applies only to a hub that defines that block, and only `sk-doc` carries it today. Row 10 (projection maps and scorer) applies only to `lexical` and `alias-fold` modes. Each applied row gets its own evidence line in AC-003.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Nine rows, skip 5 and 10** | Matches the class and the hub. Least to maintain | Rows 4, 6 and 8 still need hand checks | 9/10 |
| All eleven rows | Nothing skipped | Row 10 entries for a `metadata` mode are wrong and a drift guard would flag them | 3/10 |
| Gated rows only | Fast | Leaves the advisor vocabulary unchecked, the exact silent failure the rule warns about | 1/10 |

**Why this one**: It is the set the reference requires for this class, no more and no less.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every surface that can break reachability has a named check
- The ungated rows are checked by hand instead of assumed

**What it costs**:
- Three hand checks per release. Mitigation: record the `rg` commands in the doctor playbook so they are repeatable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later hub change adds a `FULL_INVENTORY` block | M | Re-run ADR-001's list whenever `ROUTER.md` gains a new block |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 8 cannot close without this choice |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The chosen option is the smallest that meets the acceptance criteria |
| 4 | **Fits Goal?** | PASS | On the path to AC-001 to AC-010 |
| 5 | **Open Horizons?** | PASS | Reversible by one commit |

**Checks Summary**: 5/5 PASS (proposed, not yet reviewed)
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json`, `SKILL.md`, `description.json`, `leaf-manifest.json` and four mirror trees

**How to roll back**: Revert the phase commit and rerun the mirror sync scripts.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Aliases per mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase owner, settled by replay |

---

<!-- ANCHOR:adr-002-context -->
### Context

Each mode needs vocabulary so stage two can pick it. Words like `run`, `schedule` and `status` also appear in many unrelated requests, so a loose alias would capture traffic this hub cannot serve (`skill-hub-routing.md` §4).

### Constraints

- Aliases are lowercase and unique across the four modes (`parent-skills-nested-packets.md` §8).
- Each alias is replayed against one out-of-domain phrase before it ships.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We propose**: Anchor every alias on the word `bot` or `BOT.md`, never on a bare verb.

**How it works**: Proposed starting set: author `write a bot`, `new bot.md`, `author a bot`. Run `run the bot`, `run bot now`, `drain the bot queue`. Schedule `schedule a bot`, `install the bot schedule`, `pause the bot`. Status `bot status`, `last bot run`, `which bots are installed`, `bot inbox`, `what do the bots need from me`. Run also takes `answer the bot`. The two new verbs map onto existing modes: `bots inbox` onto status and `bots answer` onto run (operator decision, 2026-11-22). Out-of-domain probes: `run the tests`, `schedule a meeting`, `status of the build`, `author a skill`, `check my email inbox`, `answer this question`. The final list is whatever survives the replay.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bot-anchored phrases** | Narrow, easy to replay | Misses a request that never says bot | 8/10 |
| Bare verbs (`run`, `schedule`, `status`) | Catches more | Captures test runs, calendars and CI status | 2/10 |
| Command names only | No vocabulary drift | Natural prompts never reach the hub | 3/10 |

**Why this one**: The hub serves bot requests only, so the word `bot` is the one signal unrelated work does not share.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Out-of-domain phrases miss the hub
- Each alias has a recorded replay

**What it costs**:
- A request like `run the nightly job` may miss. Mitigation: the command and the `SKILL.md` table stay reachable, and the alias list can grow after a replay.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An alias collides with another hub's vocabulary | M | Replay the out-of-domain set across all hubs, not just this one |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 8 cannot close without this choice |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The chosen option is the smallest that meets the acceptance criteria |
| 4 | **Fits Goal?** | PASS | On the path to AC-001 to AC-010 |
| 5 | **Open Horizons?** | PASS | Reversible by one commit |

**Checks Summary**: 5/5 PASS (proposed, not yet reviewed)
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `hub-router.json` `routerSignals`, `ROUTER.md` `INTENT_SIGNALS`, `graph-metadata.json` vocabulary

**How to roll back**: Remove the alias from all three files in one commit and rerun the replay.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Command shape for the four modes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (public command surface) |

---

<!-- ANCHOR:adr-003-context -->
### Context

Commands are thin routers whose tool grants match their mode (research.md §14). The bots CLI verbs are fixed, but the slash-command surface is not yet named.

### Constraints

- Every runtime mirror must carry every command, so each command adds mirror files in four trees.
- The status mode must grant no write tool.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We propose**: Create one command per mode under `.skilled/commands/bots/`: `/bots:author`, `/bots:run`, `/bots:schedule` and `/bots:status`.

**How it works**: Each is created by `/create:command` and routes to its mode packet. Each carries `allowed-tools` cut to its mode, so status is read-only and only run and schedule grant Bash. The `bots inbox` and `bots answer` verbs get no command of their own: `/bots:status` covers inbox, which is read-only, and `/bots:run` covers answer, which enqueues a run.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One command per mode** | Tool grants per mode, clear names | Four commands to mirror | 8/10 |
| One `/bots` router with four routes | One file | One grant set must cover the widest mode, so status inherits write tools | 4/10 |
| No commands, advisor only | Least to build | Unreachable when the advisor is down | 2/10 |

**Why this one**: Per-mode tool grants are the safety property, and one router cannot carry four grant sets.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Status cannot write
- Each runtime lists the four modes by name

**What it costs**:
- Sixteen mirror files. Mitigation: they are generated and parity-checked.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator prefers another namespace | L | Rename through `/create:command` before mirrors are generated |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 8 cannot close without this choice |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The chosen option is the smallest that meets the acceptance criteria |
| 4 | **Fits Goal?** | PASS | On the path to AC-001 to AC-010 |
| 5 | **Open Horizons?** | PASS | Reversible by one commit |

**Checks Summary**: 5/5 PASS (proposed, not yet reviewed)
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.skilled/commands/bots/` and the four mirror trees

**How to roll back**: Revert the commit and rerun each mirror sync script.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Doctor surface for the definition checker

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (adds a doctor command) |

---

<!-- ANCHOR:adr-004-context -->
### Context

Phase 2 ships the definition checker as a script. Its doctor registration is routing work, so it lands here (research.md §15 step 9). research.md §14 puts it as a YAML asset beside the existing doctor assets.

### Constraints

- The asset runs the checker read-only.
- Every doctor command has a route in `.skilled/commands/doctor/_routes.yaml`.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We propose**: Add `/doctor:bots` with `doctor-bots-check.yaml`, created by `/create:command`.

**How it works**: The asset discovers `bots/` at the repo root, runs the checker over every `BOT.md` and reports each failure by its invariant id. It writes only its own state log.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **New `/doctor:bots`** | One obvious entry point | One more doctor command to mirror | 7/10 |
| A route under `/doctor:sk-skill` | No new command | That command checks skill format, not bot definitions, so the route is hard to find | 4/10 |

**Why this one**: Bot definitions are a separate artifact from skills, so they get their own doctor entry.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Consumers can check `bots/` with one command

**What it costs**:
- One more doctor command. Mitigation: `/doctor:helper` and `/doctor:setup` list it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The checker interface changes after phase 2 | M | The asset calls the checker CLI only, never its internals |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 8 cannot close without this choice |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The chosen option is the smallest that meets the acceptance criteria |
| 4 | **Fits Goal?** | PASS | On the path to AC-001 to AC-010 |
| 5 | **Open Horizons?** | PASS | Reversible by one commit |

**Checks Summary**: 5/5 PASS (proposed, not yet reviewed)
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.skilled/commands/doctor/bots.md`, `assets/doctor-bots-check.yaml`, `_routes.yaml`

**How to roll back**: Revert the commit and rerun the mirror sync scripts.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Purpose-built workflows are the only write path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase owner (PLAN-WORKFLOW LOCK) |

---

<!-- ANCHOR:adr-005-context -->
### Context

The hub and commands could be hand-written by copying another hub. Hand-rolled hubs drift from the canon that `parent-skill-check` and the mirror checkers assume.

### Constraints

- `AGENTS.md` PLAN-WORKFLOW LOCK forbids silently substituting a manual path for a named workflow.
- Mirrors and the leaf manifest are generated, never hand-edited (`parent-skills-nested-packets.md` §7).
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We propose**: Write the hub only with `/create:skill-parent` and the commands only with `/create:command`.

**How it works**: If either workflow blocks the task, the builder states the deviation to the operator and waits. A contract that works but fits poorly is followed and the fix is proposed in the same reply.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Create workflows only** | Canon-shaped output, fewer gate failures | Slower than copying | 9/10 |
| Copy a sibling hub | Fast | Carries the sibling's vocabulary and drift | 2/10 |

**Why this one**: The workflows encode the one-identity invariant and the companion file policy.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The hub starts canon-conformant

**What it costs**:
- Workflow setup questions. Mitigation: use `:auto` once the inputs are settled.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A workflow cannot express a `metadata`-only hub | L | Flag the deviation and wait |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 8 cannot close without this choice |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The chosen option is the smallest that meets the acceptance criteria |
| 4 | **Fits Goal?** | PASS | On the path to AC-001 to AC-010 |
| 5 | **Open Horizons?** | PASS | Reversible by one commit |

**Checks Summary**: 5/5 PASS (proposed, not yet reviewed)
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Every hub and command file in this phase

**How to roll back**: Revert the commit.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Fixture for the staged re-pin proof

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase owner |

---

<!-- ANCHOR:adr-006-context -->
### Context

The consumer regression is a staged re-pin that must leave `bots/` alone (research.md §14). It needs a vendored consumer tree to copy, and it must never touch a live tree.

### Constraints

- `overlay-engine.cjs repin --stage <dir>` works on a copy and leaves the tree alone.
- Nothing in this phase writes into a vendored tree (research.md §15 invariants).
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We propose**: Copy a vendored consumer tree into `scratch/`, add a fixture `bots/` folder with two `BOT.md` files and a `bots/config.json`, and run the staged re-pin there.

**How it works**: Hash every file under the copy's `bots/` with `shasum`. Run `repin --upstream <dir> --to <commit> --root <copy> --stage <empty dir>`, with the stage folder empty and outside the copy, as the engine requires. Hash `bots/` in the copy and in the staged tree, and `diff` each list against the first. The copy also holds a fixture install record and a fixture run folder under `.skilled/skills/.state/system-skilled-bots/`. `bots status` on the staged tree must report the schedule as needing reinstall, and the run records whether the run folder survived. The copy and the stage folder are deleted when the phase closes.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scratch copy with a fixture `bots/`** | Safe, repeatable | Needs a vendored tree to copy | 8/10 |
| Re-pin a live consumer | Real data | Writes into a vendored tree, which the invariants forbid | 1/10 |

**Why this one**: It proves the property without risking a consumer.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Re-pin safety is proven, not assumed

**What it costs**:
- A large copy in scratch. Mitigation: delete it at close.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| No vendored consumer tree is available to copy | M | Build a minimal vendored fixture with an overlay manifest |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 8 cannot close without this choice |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The chosen option is the smallest that meets the acceptance criteria |
| 4 | **Fits Goal?** | PASS | On the path to AC-001 to AC-010 |
| 5 | **Open Horizons?** | PASS | Reversible by one commit |

**Checks Summary**: 5/5 PASS (proposed, not yet reviewed)
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `scratch/` only

**How to roll back**: Delete the scratch copy.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

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
