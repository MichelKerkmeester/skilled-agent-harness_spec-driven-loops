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
| **Status** | Accepted |
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
| **Status** | Accepted |
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

**Outcome (2026-11-23)**: The shipped aliases, in `mode-registry.json`, are author `author a bot`, `write a bot`, `create a bot`, `new bot.md`, `bot definition`, `edit a bot`. Run `run the bot`, `run a bot`, `drain the bot queue`, `enqueue a bot run`, `answer the bot`, `bots answer`. Schedule `schedule a bot`, `pause the bot`, `resume the bot`, `enable the bot`, `disable the bot`. Status `bot status`, `bots status`, `last bot run`, `which bots are installed`, `bot inbox`, `bots inbox`, `what do the bots need from me`. Dropped after replay: `run bot now`, `install the bot schedule` and `uninstall the bot schedule` from the aliases, and `check the bot definition` and `bot now` from the hub vocabulary. Their generic tokens (install, now, check) let the hub top two doctor prompts: before the drop the advisor's doctor routing slice failed with `"is my skilled install healthy": top=system-skilled-bots` and `"check for skilled updates": top=system-skilled-bots`. After the drop that slice passes and both prompts top their doctor command. One probe outside the six still leans this way: `update skilled now` scores the hub 0.111 against system-skilled-doctor 0.109, below any command, because the hub name shares the token `skilled`. The hub name is frozen, so this is recorded, not fixed.

**Amendment after review 2 (2026-11-23, operator answer Q008)**: The stage-two run keyword `needs-you question` let stage one rank the hub first for the out-of-domain probe `answer this question` (0.82, ahead of system-spec-kit at 0.59). A strip-and-replay confirmed the cause: with only that keyword removed, the probe returns no skill. The replacement is `answer the open needs-you`. It is not anchored on the word `bot`. Stage two matches a keyword as a substring of the prompt, so a run keyword must occur verbatim in the gate prompt `answer the open needs-you question for the release bot`. A first try with `bot needs-you item` sent that prompt to defer and failed the canary build. The term `needs-you` belongs only to this skill, and the existing keyword `answer a needs-you` already follows that pattern. After the change, all six out-of-domain probes miss the hub at both stages: stage one ranks it first for none of them, and stage two defers on all six (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/fix3-log.txt:148`, `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/fix3-log.txt:237`).

**Outcome of review 3 (2026-11-23, operator answer Q009)**: Review 3 found that stage one ranks the hub first at 0.82 for `answer the open question`, `answer the open ticket`, `answer the open` and `answer my open questions`. Stage two defers on all of them. A strip-and-replay traced it to the token `open`, which two keywords carry: the run keyword `answer the open needs-you` and the status keyword `open needs-you items`. Either one alone, combined with the `answer` aliases, is enough. Removing both clears every one of 17 out-of-domain probes. No replacement run keyword passed, because stage two needs one that occurs in the gold prompt `answer the open needs-you question for the release bot`: a phrase with `open` or `question` captures generic prompts, and a bare `needs-you` captured `my manager needs you to sign this`. The keywords were first restored to the review-3 state (policy hash `438c99301304` again).

**Outcome of the gold change (2026-11-23, operator answer Q010)**: Both keywords that carry `open` are gone. The run keyword is now `bot's needs-you`, and the run gold and canary prompt is now `answer the release bot's needs-you question`, which names the bot before the needs-you term. Stage one ranks the hub first for none of the six ADR-002 probes and none of the eleven paraphrase probes, and still first for the new gold prompt (0.877), the old one, the inbox prompt, both `answer` aliases and the BOT-006 prompt `answer the bot's open question with yes`. Stage two matches all 24 replay rows, including defer on all six ADR-002 probes and three `answer the open` paraphrases (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-fix4.txt:7`, `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-fix4.jsonl:1`). The only run phrase without the word `bot` is `answer a needs-you`. A separate capture predates this phase's fixes: prompts such as `the team needs you` rank the hub first through the explicit lane's `needs you` match. It does not depend on any keyword changed here. The cost of the reword: the old gold prompt now defers at stage two, and stage two passes the new one through the keyword it contains word for word.

**Outcome of the fix after review 4 (2026-11-23, operator answers Q011 to Q013)**: Review 4 found the schedule keyword `launchd schedule`, added during activation, sending `set up a launchd schedule` to the hub at stage one and to schedule at stage two. It is dropped, and the schedule gold and canary prompt is now `install the launchd schedule for the nightly-digest bot`, which the existing keyword `schedule for the nightly-digest bot` matches. Stage two defers on every non-bot launchd and cron prompt and on both old gold prompts (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-fix6.jsonl:25`, `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-fix6.jsonl:30`). A strip-and-replay then showed that the bare keywords `launchd` and `needs-you` in the hub `SKILL.md` Keywords comment drove the remaining stage-one captures, including the `needs you` one (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/fix5-log.txt:110`). `needs-you` is removed, and `needs you` prompts now return no skill. `launchd` stays (operator answer Q013): removing it dropped the in-domain blind corpus row `Set up the launchd timer so the nightly cleanup bot fires on its cron` below the 0.8 bar and failed the advisor routing slice. So non-bot launchd prompts such as `set up a launchd schedule` and `pause the launchd agent` still rank the hub first at stage one, at 0.82 to 0.85. Stage two defers on all of them, and no other skill owns launchd, so this is the one recorded limitation. Every `hub-router.json` keyword now contains `bot` except `answer a needs-you`. The bare `SKILL.md` keyword `launchd` is not a hub-router keyword. Review 5 approved this state and its remaining limitations are recorded in the implementation summary.
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
| **Status** | Proposed (built as proposed; operator confirmation pending) |
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

**How it works**: Each is created by `/create:command` and routes to its mode packet. Each carries `allowed-tools` cut to its mode. Run and schedule grant Bash for their mutating verbs. Status grants Bash too, because it calls the CLI, but no Write or Edit tool, and its command body limits Bash to the two read verbs `bots status` and `bots inbox`. Author grants no Bash, and hands the definition check to `/doctor:bots`. The `bots inbox` and `bots answer` verbs get no command of their own: `/bots:status` covers inbox, which is read-only, and `/bots:run` covers answer, which enqueues a run.
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
- Status grants no Write or Edit tool, and its body allows only the two read verbs
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
| **Status** | Proposed (built as proposed; operator confirmation pending) |
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

**We propose**: Add `/doctor:bots`, created by `/create:command`. The workflow produced its split set: `doctor-bots-auto.yaml`, `doctor-bots-confirm.yaml` and `doctor-bots-presentation.txt`.

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
- `.skilled/commands/doctor/bots.md`, `assets/doctor-bots-auto.yaml`, `assets/doctor-bots-confirm.yaml`, `assets/doctor-bots-presentation.txt`, `_routes.yaml`

**How to roll back**: Revert the commit and rerun the mirror sync scripts.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Purpose-built workflows are the only write path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. The first build broke it by hand-writing the files; the redo ran `/create:skill-parent` and `/create:command` step by step as @markdown (operator decision Q001, `scratch/workflow-run-log.txt`) |
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
| **Status** | Accepted |
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
**Outcome (2026-11-23)**: Built as the overlay engine's own repin test builds its fixture: a two-commit upstream git repository and a consumer extracted at the first commit, with one file overlay, a `bots/` folder holding two `BOT.md` files and `bots/config.json`, and a `.gitignore` that ignores the run root. Two deviations. The copy and stage lived in the session scratchpad outside the worktree, as the dispatch asked for a temp folder, and only the evidence went to `scratch/`. The install record and run were written through the runtime's own writers in the shape the status test support uses, because the real installer refuses a tree whose runtime has no installed dependencies. `bots/` stayed byte-identical in the copy and the staged tree, and the run folder survived in both. `bots status` reports `ok` on the staged tree in place and `needs-reinstall (pin-changed)` once the staged tree takes the copy's path. Every launchctl call went to the runtime's test intercept, and the real `~/Library/LaunchAgents` hashed the same before and after.
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
| Q001 | Redo the hub, mode packets, commands and doctor command by running `/create:skill-parent` and `/create:command` for real in `:auto` mode, diff against the hand-written build, keep the workflow output. D1 stays frozen | Operator answer, 2026-11-23. The first build read the workflows but never ran them, which broke D1 and ADR-005. The operator picked the recommended option | The hand-written first build | ADR-005, REQ-001, REQ-005, AC-001, AC-004 |
| Q002 | Build a compiled engine, canary cases and an activation fence for `system-skilled-bots` in this phase, following commit `6a5e1048ea5`, so stage two serves from the compiled router | Operator answer to the LOGIC-SYNC on AC-002 and AC-012, 2026-11-23. The operator picked the recommended option | The Out of Scope reading that left the compiled engine out of this phase | REQ-003, REQ-014, AC-002, AC-012 |
| Q003 | A separate agent that has not seen the bots vocabulary writes held-out `command-routing-slice` rows from the five command descriptions only, then the baseline is recaptured once and the advisor suite runs to 0 failures | Operator answer, 2026-11-23. Writing held-out rows from vocabulary authored in the same change would contaminate the blind set. The operator picked the recommended option | - | REQ-011, AC-003 |
| Q004 | AC-011 reads: after the staged tree replaces the copy at its path, `bots status` reports needs-reinstall | Operator answer, 2026-11-23. The install record names the live copy's path, so a status read on the staged tree in place reports `ok`; a real re-pin promotes the staged tree to that path. Flagging in place would need runtime changes that D4 forbids. The operator picked the recommended option | AC-011's in-place Then clause | REQ-013, AC-011 |
| Q005 | Review budget: one review over everything this phase changed, and one fix plus one more review if it returns REQUESTED_CHANGES. If the second review also fails, stop and bring the findings to the operator | Operator answer, 2026-11-23. The operator picked the recommended option | - | tasks.md review step |
| Q006 | Re-freeze the advisor scorer with `frozen-scorer-contract.cjs --refreeze` in the worktree and commit the new pins with this phase, so the hub's activation and flip can run | Operator answer, 2026-11-23. The pins were last committed 2026-09-20 and every scorer file had drifted since, so the check failed on main too; this phase's bridge regeneration also changes `scorer/projection.ts`. The operator picked the recommended option | The stale 2026-09-20 freeze pins | REQ-003, REQ-014, AC-002, AC-012 |
| Q007 | Copy the runtime `009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs` over its authored copy, a one-line out-of-scope repair recorded in this phase, so `compiled-route-sync.cjs` builds and checks clean | Operator answer, 2026-11-23. A runtime-only wording change left the two copies apart, so the sync check failed on main and a sync build would have reverted the runtime wording. The operator picked the recommended option | - | REQ-003, AC-002 |
| Q008 | Allow one more narrow fix after review 2: confirm the cause of the `answer this question` capture, replace the `needs-you question` keyword with a bot-anchored phrase, replay all six ADR-002 probes through both stages, fix the two P2 citations, then run review 3 | Operator answer, 2026-11-23. Review 2 returned REQUESTED_CHANGES with one P1 that a stage-one replay reproduced, so the Q005 budget was spent. The operator picked the recommended option | - | REQ-009, REQ-014, AC-008, AC-012 |
| Q009 | Allow one more fix after review 3: confirm the cause of the `answer the open ...` capture, choose the run keyword by replay against the six ADR-002 probes plus about ten `answer the open X` and `answer the X` paraphrases, keep the gold prompt, fix the doc citations, rerun every gate, then run review 4. Stop and return if no keyword passes | Operator answer, 2026-11-23. Review 3 returned REQUESTED_CHANGES with one P1 that a stage-one replay reproduced: `answer the open question` ranked the hub first at 0.82. The operator picked the recommended option | - | REQ-009, REQ-014, AC-008, AC-012 |
| Q010 | Bot-anchor the gold prompt: drop both keywords that carry `open` (run `answer the open needs-you`, status `open needs-you items`), change the gold and canary prompt to name the bot before the needs-you term, give run a bot-anchored keyword, trial it with the same probe script, rerun every gate, then run review 4, stopping again if it fails | Operator answer, 2026-11-23. A strip-and-replay traced review 3's capture to the token `open` in those two keywords, and no run keyword kept the old gold prompt routing while clearing the widened probes. The operator picked the recommended option | The gold prompt `answer the open needs-you question for the release bot` | REQ-009, REQ-014, AC-008, AC-012 |
| Q011 | Allow one more fix after review 4: drop the schedule keyword `launchd schedule`, reword the schedule gate prompt to `install the launchd schedule for the nightly-digest bot` if it then defers, replay non-bot launchd and cron prompts at both stages, fix the four doc items review 4 named, rerun every gate, then run review 5, stopping again if it fails | Operator answer, 2026-11-23. Review 4 confirmed the Q010 fix and found one older P1: `launchd schedule` sends `set up a launchd schedule` to the hub at stage one and to schedule at stage two. The operator picked the recommended option | The schedule keyword `launchd schedule` | REQ-009, REQ-014, AC-008, AC-012 |
| Q012 | Remove the bare keywords `launchd` and `needs-you` from the hub `SKILL.md` Keywords comment, record `pause the launchd agent` as the one remaining stage-one limitation, fix review 4's doc items, rerun every gate, then run review 5 | Operator answer, 2026-11-23. After the Q011 fix, stage two deferred on every non-bot launchd prompt, but stage one still ranked the hub first for them. A strip-and-replay showed those two bare keywords drive the stage-one `launchd` and `needs you` captures. The operator picked the recommended option | The two bare keywords in the hub `SKILL.md` Keywords comment | REQ-009, AC-008 |
| Q013 | Keep the bare keyword `launchd` in the hub `SKILL.md` Keywords comment and remove only `needs-you`, amending Q012, then run the full gates and review 5 | Operator answer, 2026-11-23. Removing `launchd` as Q012 planned made the in-domain blind corpus row `Set up the launchd timer so the nightly cleanup bot fires on its cron` fall below the 0.8 bar, and the advisor routing slice failed. Keeping it passes the slice 12/12 and all 31 stage-two rows. The operator picked the recommended option | Q012's removal of `launchd` | REQ-009, AC-008 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **Q001** (asked as "Phase 008 broke frozen decision D1. The builder read /create:skill-parent and /create:command but never ran them: it hand-wrote the hub, the four mode packets, the commands and /doctor:bots. Nothing blocked the workflows. The result passes the per-hub gate, mirror parity and validate --strict. What should I do?"): "Redo via workflows (Recommended)". The other option offered was "Accept, amend D1".
- **Q002** (asked as "Stage-two routing: `compiled-route.cjs --hub system-skilled-bots` returns `servingAuthority: legacy` for every prompt, because the hub has no compiled engine or activation. Commit 6a5e1048ea5 built one for mcp-browser-use: engine, canary cases and an activation fence, about 1,000 lines. 008's goal and the parent goal's last criterion need compiled-route to return each mode. Which way?"): "Build the activation (Recommended)". The other option offered was "Amend to ROUTER.md replay".
- **Q003** (asked as "The advisor suite now has 2 failures in `command-routing-slice`. The five new commands (four /bots:* and /doctor:bots) have no held-out corpus rows, and the totals moved. The builder didn't write held-out prompts for vocabulary authored in the same change, because that would contaminate the blind set. How should I fix it?"): "Blind rows + recapture (Recommended)". The other option offered was "Recapture baseline only".
- **Q004** (asked as "AC-011 (staged overlay re-pin): bots/ stays byte-identical, but `bots status` on the staged tree reports `ok` in place, because the install record names the live copy's path. Once the staged tree takes the copy's path it reports `needs-reinstall (pin-changed)`. Amend AC-011 to that reading?"): "Amend to that reading (Recommended)". The other option offered was "Keep as written".
- **Q005** (asked as "008's remaining work runs in order: the redo through the workflows, the compiled-route activation, the blind corpus rows, one baseline recapture, then one review over everything. In 006 it took five review rounds before the class of bug closed. How many review rounds should 008 get before I come back to you?"): "One review + one fix (Recommended)". The other option offered was "One review, then ask".
- **Q006** (asked as "Phase 008's compiled-route activation (your Q002 answer) is blocked by a stale scorer freeze. The pins in frozen-scorer-pins.json were last committed 2026-09-20. Since then all 21 scorer files have drifted, and the same check already fails on main. This branch's bridge regeneration also changes scorer/projection.ts. The activate and flip tools refuse to run until you re-freeze. May I run `frozen-scorer-contract.cjs --refreeze` in the worktree and commit the new pins with 008?"): "Re-freeze now (Recommended)". The other option offered was "Don't re-freeze".
- **Q007** (asked as "`compiled-route-sync.cjs --check` already fails on main. Commit e036417256e changed one string in the runtime copy of 009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs ("OpenCode" to "Skilled") but not in its authored copy under specs/sk-doc/z_archive/.../007-sk-doc/lib/. Registering the bots hub needs the sync build, and that build would put the old "OpenCode" wording back into the runtime file. May I copy the runtime file over the authored one (a one-line change in the sk-doc engine) in this phase?"): "Copy runtime to authored (Recommended)". The other option offered was "Leave it, accept a red sync check".
- **Q008** (asked as "Review 2 of system-skilled-bots phase 008 found a P1, and I reproduced it: stage one ranks system-skilled-bots first for the out-of-domain probe \"answer this question\" (0.82, ahead of system-spec-kit at 0.59). That fails AC-008 and AC-012, which I set back to Unmet. The suspected cause, not yet confirmed, is the `needs-you question` keyword in hub-router.json and ROUTER.md. Your Q005 answer allowed one review plus one fix, and both are used. How should I proceed?"): "One narrow fix (Recommended)". The other options offered were "Fix, skip review 3", "Waive via ADR" and "Stop here".
- **Q009** (asked as "Review 3 of system-skilled-bots phase 008 returned REQUESTED_CHANGES, and I reproduced its P1. The new run keyword `answer the open needs-you` makes stage one rank the hub first (0.82) for paraphrases like \"answer the open question\" and \"answer the open ticket\". Gate 2 forces any skill at 0.8 or above, so those prompts would misroute. The six ADR-002 probes still all miss the hub, so AC-008 holds by its letter. Review 3 also found doc problems: citations point at the pre-fix lines of fix3-log.txt, goal.md still cites suites-final.txt, and the summary still calls the keyword bot-anchored. Q008 allowed one fix round, now used. How should I proceed?"): "One more fix, wider probes (Recommended)". The other options offered were "Bot-anchor the gold prompt", "Waive via ADR" and "Stop here".
- **Q010** (asked as "No run keyword passed the wider probe set, so per your Q009 answer I stopped and restored the state review 3 assessed (all gates green, 008 validates). The real cause differs from review 3's guess. Stage one ranks system-skilled-bots first (0.82) for 'answer the open question', 'answer the open ticket', 'answer the open' and 'answer my open questions', because two keywords carry the token 'open': run's 'answer the open needs-you' and status's 'open needs-you items'. Either one plus the 'answer' aliases is enough. Removing both clears all 17 out-of-domain probes. But stage two then needs a run keyword that occurs in the gold prompt 'answer the open needs-you question for the release bot', and every fragment fails: 'open' and 'question' capture generic prompts, and bare 'needs-you' captured 'my manager needs you to sign this'. Stage two defers on all of these prompts. How do you want to close this?"): "Bot-anchor the gold prompt (Recommended)". The other options offered were "Accept as a limitation", "Drop keywords, defer gold" and "Stop here".
- **Q011** (asked as "Review 4 of system-skilled-bots phase 008 confirms the Q010 fix works: the 'answer the open' capture is gone at both stages and all gates pass. It returned REQUESTED_CHANGES for a different, older keyword. The schedule keyword 'launchd schedule' has no 'bot' anchor, so 'set up a launchd schedule' and 'install a launchd schedule for my backup script' rank the hub first (about 0.89) and stage two routes them to schedule. I reproduced both. It also found doc problems: limitation 5 misses this keyword, three citations point at line 1 instead of the evidence lines, the old gold prompt now defers at stage two without the docs saying so, and one claim in limitation 6 is an unlabeled inference. Q010's review budget is spent. How should I proceed?"): "One more fix + review 5 (Recommended)". The other options offered were "Accept, fix docs, commit" and "Stop here".
- **Q012** (asked as "The Q011 fix works at stage two for system-skilled-bots phase 008. 'launchd schedule' is dropped and the schedule gate prompt is reworded, and all 31 stage-two rows match: every non-bot launchd and cron prompt defers, and both old gold prompts now defer, which I recorded. Stage one still puts the hub first for non-bot launchd prompts like 'set up a launchd schedule' and 'pause the launchd agent'. A strip-and-replay showed the main source is the hub SKILL.md Keywords comment, which lists bare 'launchd' and 'needs-you'. Stripping those two words clears the 'needs you' capture entirely (limitation 6). It drops 'set up a launchd schedule' to 0.66, below the 0.8 forced-load bar, and leaves 'pause the launchd agent' at 0.82. In-domain prompts are unchanged. I restored the file after the test. Per Q011 I stopped. How should I proceed?"): "Drop both keywords, review 5 (Recommended)". The other options offered were "Keep keywords, review 5" and "Stop here".
- **Q013** (asked as "Q012's plan broke a gate for system-skilled-bots phase 008, so I stopped. Dropping the bare SKILL.md keyword 'launchd' cost a real in-domain blind corpus row: 'Set up the launchd timer so the nightly cleanup bot fires on its cron' fell from the hub at 0.82 to 0.597, and the advisor routing slice and suite failed (2 failed, 2472 passed). I did not recapture the baseline. I measured the alternative cleanly: keep 'launchd' and drop only 'needs-you', with 'launchd schedule' still dropped. That passes the slice 12/12 and all 31 stage-two rows, policy c5a60821fe8d. The 'needs you' capture is gone and the launchd-timer row is back at 0.82. Non-bot launchd prompts ('set up a launchd schedule', 'pause the launchd agent') rank the hub first at stage one again, at 0.82 to 0.85, but stage two defers on all of them. The tree is in that state now. Which do you want before the full gates and review 5?"): "Keep launchd, drop needs-you (Recommended)". The other options offered were "Drop both, recapture baseline" and "Stop here".
<!-- /ANCHOR:operator-answers-verbatim -->

---
