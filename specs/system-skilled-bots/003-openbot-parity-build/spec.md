---
title: "Feature Specification: Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat"
description: "Fourteen build phases that close the OpenBot parity gaps the 002 research ranked, from the activity view and actor field through routines, a Rust terminal screen, memory, approvals, apps, vault, skills, conversations and messaging channels, then the operator scenario corpus, the skills and doc alignment, and one deep review."
trigger_phrases:
  - "openbot parity build phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | None |
| **Parent Packet** | system-skilled-bots/003-openbot-parity-build |
| **Predecessor** | `002-openbot-parity-research` |
| **Successor** | None |
| **Handoff Criteria** | Each child passes `validate.sh --strict` before the next starts, and 014-deep-review closes the program |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled bots already holds the hard half of a bot runtime: approved definitions, an atomic file queue, exact cron, worktree isolation, needs-you decisions, run records and a status index. What it lacks is a human surface and a few small records. Nothing draws a run timeline, no record says who answered a needs-you item, a bot cannot keep a fact between runs, a bot reaches every MCP server and every secret in the environment, and there is no conversation verb. The operator reads run folders by hand to answer "what did my bots do, and what needs me".

### Purpose
Close each gap the 002 research ranked, one child phase per gap, so a small team runs its bots from a terminal with OpenBot's before-and-after view and none of OpenBot's server, database, container stack or desktop shell.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The ten ranked slices of `../002-openbot-parity-research/001-openbot-parity-research/research/research.md` §15, one child phase each: activity and actor, routines, terminal screen, computer exposure, memory, approval grants, per-bot apps, vault, skills, conversations, plus the messaging-channels extension.
- The three closing phases the operator added on 2026-11-25: 012 writes and then runs the operator scenario corpus for everything 001 to 011 deliver, 013 aligns the `.skilled` change set and the docs that describe it, and 014 runs one expanded deep review over the built surface and fixes every P0 and P1 it reports.
- The operator decision of 2026-11-24: the terminal screen moves up to third, after activity and routines, and draws its panes over the data those two write, so it needs no backend of its own.
- The operator decision of 2026-11-25: the screen is a new MIT Rust ratatui app that follows openhuman-tui's layout, tabs, approval banner, overlay and command palette, reads and writes through `bots ... --json`, and copies none of its GPL-3.0 code.
- The operator decision of 2026-11-25 on the answer scope: `bots answer` gains `--scope once|deny` in 001, so 003 depends on 001 and 002 only and never waits for 006. 006 keeps `grants` and the ladder and extends that scope with them.
- The actor half of the small-team model (§12): a `by:` field on needs-you answers, secret records and run records, filled from the OS user or `--as`, so a shared host does not erase who answered.
- The reuse rule (§14): MIT lifts keep the copyright and permission notice, Apache-2.0 lifts keep the license, any NOTICE file and a statement of changes, and one `THIRD_PARTY_NOTICES.md` entry per lifted file names its source path.

### Out of Scope
- **The desktop app.** Item 11 of the ranked order, size XL. It earns a place only if an embedded browser with a passkey hand-back or a no-terminal install becomes a must-have. A local web page and a desktop app were offered for the screen and not chosen.
- **The research skip list** (§13), each for the reason it gives:
  - Enterprise roles and SSO: the admin tier governs people, sign-in and policy, and there is no sign-in to govern.
  - Multi-tenant: tenancy lives in the URL space and schema, and one team is one tenant.
  - Kubernetes and Helm: release promotion around a chart, a second deployment shape.
  - Managed upgrades: a vendor management agent tied to the chart, and a checkout updates with `git pull`.
  - Mobile: a separate React Native app, and the terminal is the client.
  - PostgreSQL, Compose, a container computer, a browser farm, gVisor: the runtime is a Node CLI with a SQLite index and worktrees.
  - OAuth server, per-person connections, connector catalogue: a key or a shared account covers the common case, and the UTCP config already names the servers.
- **The shared-host 0770 mode** (§12): no child builds it. The state root stays owner-only, so the `operators.json` roster 011 lands is single-operator until a later packet, and 011's channel config rests on the identity rather than on a shared host.
- **The two-role `operators.json` roster** (§12): 001 lands the actor field alone, and 011 lands the minimal `owner`/`members` roster its channel approver check needs.
- **A browser computer per bot** (§10): OpenBot's largest surface, and a small team uses its own logged-in browser for the steps that need one.
- **Per-action policy inside the executor** (§11): executor sandboxes and posture enforce today, and the hook is a later packet.
- **Recording a skill from a demonstration** (§8, open question 6): no counterpart and no design.

### Files to Change
Per-phase detail lives in each child's `plan.md`. This table is the audit trail of the surfaces the fourteen phases touch.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/bin/bots.cjs` | Modify | 001, 002, 003, 005, 006, 008, 009, 010, 011 | New verbs: `activity`, `inbox`, `routines`, `ui`, `remember`, `secret`, `skill propose`, `chat` and the `channel` group. `--scope once\|deny` on `answer` from 001 |
| `.skilled/skills/system-skilled-bots/runtime/lib/` | Create/Modify | 001-011 | Activity grouping, actor field, routine block, memory files, grants ladder, app filter, secret store, skill proposals, conversation JSONL, the channel modules |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | 002, 005, 008, 009, 010, 011 | One folder per phase: `routines`, `memory`, `secrets`, `proposals`, `conversations`, `channels` |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Modify | 008, 011 | The secret-literal check over a delivery message, and the channel names on `DELIVERY_CHANNELS` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | 007, 008 | The per-dispatch environment key list the gate admits, bounded inside the gate, and the stderr capture 008 scans before it is re-emitted |
| `operators.json` | Create | 011 | The `owner`/`members` roster `channel-link.ts` writes. 011 fixes its path under the identity's state root |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | 002, 005, 007, 008, 009 | `routine`, `memory`, `apps` and `skills` keys |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modify | 002, 007, 009 | The nine routine invariants and the floor check, the `apps-unknown-server` invariant failing closed, and the three `skills` invariants |
| New MIT Rust ratatui crate | Create | 003 | Panes over `bots ... --json`. The crate path is fixed in [`003-terminal-screen/goal.md`](003-terminal-screen/goal.md) D1 |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts` | Create | 003 | The `ui` verb's tests: argv, exit passthrough and the three refusals |
| `.github/workflows/bots-runtime.yml` | Modify | 003 | Two path entries and one `bots-tui` job: `--locked`, a release build, the design diff, a named runner, cache and timeout |
| `.gitignore` | Modify | 003 | Ignore `/crates/bots-tui/target/` |
| `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` | Create (001), Modify (008, 010, 011) | 001, 008, 010, 011 | One entry per lifted MIT or Apache-2.0 file, with its source path. 001 creates the file and the rest append a `## <phase>` section |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/` | Create/Modify | 012 | 33 new scenario files in ten category folders, the root index's sections and counts, and one run folder under `benchmark/reports/` |
| `.skilled/skills/system-skilled-bots/SKILL.md` and its catalog, playbook and references | Modify | 013 | The fix for every finding the two alignment reports name |
| `.skilled/commands/assets/local-doc-alignment/topics.json` | Modify | 013 | The `system-skilled-bots` topic: its title, `terms`, three `codeRoots` and the three package checks |
| `specs/system-skilled-bots/003-openbot-parity-build/contracts/` | Create | 001-014 | The shared shapes every phase reads: `records.md`, `cli-json.md`, `versioning.md`, `refusals.md`, `prompt-sections.md`, `answer-seam.md`, `runtime-architecture.md`, `decisions.md` and one golden per record in `fixtures/` |
| `.skilled/bin/bots.cjs`, `runtime/lib/` and the phase docs | Modify | 014 | The fix for every P0 and P1 the review reports, and the re-run of the affected tests |

> **State root:** the state root is the unit of backup, and `bots status --rebuild` is the only repair.

### Shared Records

One owner per record more than one phase writes. The owner fixes the shape and every other phase reads it. The shape itself lives in [`contracts/`](contracts/README.md), one section per record. A phase that changes a shape edits that file in the same change. The eleven packet decisions are [`contracts/decisions.md`](contracts/decisions.md).

| Record | Owner | Where the shape is fixed |
|--------|-------|--------------------------|
| Run record `actor` and the status index `schemaVersion` | 001 | [`contracts/records.md`](contracts/records.md) section 4, which keeps `actor` additive and `schemaVersion` at `'2'` |
| `bots activity --json` row | 001 | [`contracts/cli-json.md`](contracts/cli-json.md) section 2, whose row points at the screen contract's section 5 |
| `bots inbox --json` item | 001 | [`contracts/cli-json.md`](contracts/cli-json.md) section 2 for the payload row, and [`contracts/records.md`](contracts/records.md) section 1 for the stored item it prints |
| The item's `kind` field | 005 | [`contracts/records.md`](contracts/records.md) section 1, the `kind` row and its absent-means-`decision` default |
| The item's `grants` field and the answer's scope | 006 | [`contracts/records.md`](contracts/records.md) section 3 for the grant and section 2 for the answer's scope |
| `crates/bots-tui/tests/fixtures/bots` | 003 | [`003-terminal-screen/002-architecture-and-contracts/spec.md`](003-terminal-screen/002-architecture-and-contracts/spec.md) REQ-008, the scenario names and the payload file each one prints |
| `buildBotPrompt` section order | 005 | [`contracts/prompt-sections.md`](contracts/prompt-sections.md) section 1, the nine blocks in order |
| `answerItem` review seam | 005 | [`contracts/answer-seam.md`](contracts/answer-seam.md) section 1, step 10 |
| `answerItem` guarded write | 006 | [`contracts/answer-seam.md`](contracts/answer-seam.md) section 1, step 6, the `needs-you/<item-id>.lock` file taken before the read and released on every exit, with `item-busy` when the wait runs out |
| The secret-literal scan's run-record cause | 008 | [`contracts/records.md`](contracts/records.md) section 4, the `postRunCauses` row |
| `operators.json` roster | 011 | [`contracts/records.md`](contracts/records.md) section 16 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

The packet has fourteen phases. Phases 001 to 011 build the parity slices the 002 research ranked, 012 proves them with an operator scenario corpus, 013 aligns the skills and docs that describe them, and 014 reviews the built surface and fixes what it finds.

| Phase | Folder | Focus | Depends on | Status |
|-------|--------|-------|------------|--------|
| 1 | `001-activity-and-actor/` | `bots activity` grouped by OpenBot's seven ids, `bots inbox --json`, and a `by:` actor on answers and run records | None. The check-after, and the prerequisite for any later shared-host packet | Pending |
| 2 | `002-routine-layer/` | The four-part `routine` block over the existing triggers, the `until` check, the 15-minute floor, the fatigue switch and `bots routines` | 001, whose `activityReport` takes `describeStart` and whose `answerItem` the no-resume option extends | Pending |
| 3 | `003-terminal-screen/` | A new MIT Rust ratatui app with activity, inbox and routine panes over `bots ... --json`, written from openhuman-tui's shape. A phase parent with six children | 001 and 002 only, whose data it draws and whose `--scope` it passes, with no backend of its own | Pending |
| 4 | `004-computer-exposure/` | The worktree or run folder named in the prompt, with its path and branch in run records and `bots status` | 001, whose run records carry the fields | Pending |
| 5 | `005-memory/` | Shared and per-bot memory files prepended to the prompt, `bots remember`, and needs-you confirmation of bot-proposed facts | 001, whose needs-you item carries the confirmation. 004, whose `workingPlace` input the prompt block reads | Pending |
| 6 | `006-approval-grants/` | A `grants` field on needs-you items and the precedence ladder applied at that gate | 001, whose item, inbox and `--scope` it extends with `grants` and the ladder. 005, whose review seam the scope is written before. 002, whose `routine-state.ts` writes the fatigue item it fills | Pending |
| 7 | `007-per-bot-apps/` | The `apps:` key, a filtered UTCP config per run, `HonoredPosture.apps` and the `apps-unknown-server` checker invariant | 001, whose run records carry the posture | Pending |
| 8 | `008-vault/` | `bots secret set` over the keychain or a 0600 store, child-environment injection and `secretsUsed` | 007, which lands the per-run config the secret is injected into. 005, whose `postRunCauses` field it extends. This is the one slice that can leak, so it lands after the first | Pending |
| 9 | `009-skills/` | A `skills:` list under a byte cap, and `bots skill propose` reviewed through a needs-you item | 001, whose needs-you item reviews the proposal. 005, whose prompt order and review seam it inserts into. 006, whose `grants` field its item fills | Pending |
| 10 | `010-conversations/` | `bots chat` with `@bot` routing over an append-only conversation JSONL. A phase parent with three children | 001, whose run records each message writes. 003, whose chat pane this phase fills. 005, whose review seam stamps the conversation id. 008, whose `secret-in-output` cause its scan reuses | Pending |
| 11 | `011-messaging-channels/` | A shared channel adapter, a file-backed identity link and the `operators.json` roster, then Telegram long polling, Slack Socket Mode, Signal through a local `signal-cli` daemon and the WhatsApp Cloud API, with approvals as buttons where the platform has them and numbered or YES/NO replies elsewhere. A phase parent with seven children | 001, whose actor a link names. 005, whose review seam the roster check runs before. 006, whose grant an approval carries. 008, whose vault holds the tokens. 010, whose chat the terminal transport reuses | Pending |
| 12 | `012-manual-testing-scenarios/` | 33 operator scenarios in ten new category folders, `BOT-026` to `BOT-058`, the root index's sections and counts, and one recorded execution of every scenario | 001 to 011, whose verbs and records every scenario asserts. This is the phase that proves an operator can drive them | Pending |
| 13 | `013-skilled-and-doc-alignment/` | The `system-skilled-bots` topic in `topics.json`, one `/local-skilled-alignment` run and one `/local-doc-alignment` run over the packet's change set, and the fix for every finding either report names | 001 to 012, whose `.skilled` change set and docs the two runs read | Pending |
| 14 | `014-deep-review/` | One expanded `/deep:review` run over the code and docs 001 to 013 built, the merged findings registry, and the fix for every P0 and P1 it reports | 013, which must be clean first so the review reads a checked surface rather than an assumed one | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

A child hands off when its own `acceptance-criteria.md` rows are Met and `validate.sh --strict` prints `RESULT: PASSED` for its folder. The dependency column above names the one thing the next child reads from the one before. Nothing else passes between them.

The three closing phases hand off through named files. 012 writes every product failure it records to `012-manual-testing-scenarios/scratch/failures.md`, with the scenario id, the phase, the requirement, the observed line and the evidence path, and 014 reads that file as its intake. 013 writes its rebuttals to `013-skilled-and-doc-alignment/scratch/rebuttals.md` and its evidence to `013-skilled-and-doc-alignment/evidence/`, and 014 reads both. 014 then re-runs every 012 scenario whose owning phase one of its fixes touched and records each result beside the finding that caused it. A failure filed by 012 does not block 012 and it does block 014's PASS.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:external-orchestration -->
## EXTERNAL ORCHESTRATION

Every phase's build is dispatched, not hand-run. The hub owns the routing and each mode owns its dispatch contract, so this table names the executor, the model, the effort and the worker count, and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:26]. Two hub rules bind every dispatch: the target mode's `SKILL.md` is read before its prompt is composed [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198], and the executor CLI is the HOW, so it never overrides the phase's own workflow [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

**The roster.** Five executors, no sixth. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017` takes `--thinking high` or `max`, the one effort lever that is a standalone flag [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101]. `cli-opencode` at `opencode-go/deepseek-v4.1-flash` takes `#high` or `#max` on the model id [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:142]. `cli-mistral-vibe` at `deepseek-flash` runs at `max` only, because the tier is the roster row's `thinking` field and no flag moves it [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89]. `cli-devin` at `deepseek-v4-1-flash-max` bakes `max` into the model uid [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156]. `cli-codex` at `gpt-6-luna` takes `xhigh` on the `fast` service tier, and it is the only route to a GPT model [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:28].

**The tier rule.** DeepSeek Flash at `high` carries a small mechanical task: an edit to a settled module, a test that mirrors an existing one, a doc line. DeepSeek Flash at `max` carries a design or tricky task: a new module, a new shared record, a seam between two phases. `gpt-6-luna` at `xhigh` on `fast` carries the hardest task and is the last fallback for every phase.

**The worker rule.** Parallelism follows file overlap: no two workers touch one file, so a phase's worker count is the number of disjoint file groups its tasks fall into. A phase whose tasks all edit one module runs one worker.

| Phase | Primary executor | Model | Effort | Workers in parallel | What sets the row |
|-------|------------------|-------|--------|---------------------|-------------------|
| 001 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | A new `activity.ts` grouping and a new actor record. Three groups: the activity module, the record modules, `bots.cjs` |
| 002 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | A new `routine.ts` and `routine-state.ts`. Three groups: the routine pair, `runner.ts` with the switches, the bot template |
| 003 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | A new Rust crate, so the pane layout is design work. Three groups: the crate, the `ui` verb, the fixtures and suite |
| 004 | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` | 3 | Edits to settled modules only. Three groups: `runner.ts`, `status.ts` with `status-index.ts`, `dispatch.ts` |
| 005 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 4 | A new `memory.ts` plus the prompt order and the review seam. Four groups: memory, runner and dispatch, needs-you, `bots.cjs` |
| 006 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | The precedence ladder is the design case. Three groups: `answer.ts` with `action-kind.ts`, `needs-you.ts`, `bots.cjs` |
| 007 | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` | 4 | Mostly edits to `runner.ts` and the audit gate. Four groups: apps and definition, runner, `executor-audit.ts`, the template and fixtures |
| 008 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 4 | The one slice that can leak, so the store and the injection are design work. Four groups: secrets, the record and dispatch pair, the audit gate, the notices |
| 009 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | A new `skills.ts` and `skill-proposal.ts`. Three groups: skills, the proposal, the definition keys and template |
| 010 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | A new `conversation.ts` and the `@bot` routing. Three groups: the conversation module, `bots.cjs`, the state root and drain |
| 011 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 4 | Four transports over one adapter seam. Four groups: the adapter and queue, the link and roster, approval and delivery, `bots.cjs` |
| 012 | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` | 10 | Its `plan.md` §Waves: waves 0, 2 and 4 carry 23 of the 49 tasks at `#high`, and wave 4's ten distinct files set the bound |
| 013 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 4 | Its `tasks.md` §Waves: `cli-pi` carries five of the nine waves and sixteen of its twenty-four tasks, and W1's four read groups set the bound |
| 014 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 5 | Its `tasks.md` §Waves: wave 1 is a five-lineage fan-out, one per executor, wave 3 fixes at `max` with at most 3 workers, and wave 4 runs at `high` or `max` with at most 4 |

**Fallback order.** When a CLI runs out of usage, the phase moves down this ladder and keeps its task ids, its files and its verify step: `cli-pi`, then `cli-opencode`, then `cli-mistral-vibe`, then `cli-devin`, then `cli-codex`. `cli-devin` is probed with a trivial read-only call before a phase spends it, because a quota banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]. `cli-codex` is last because it is the hardest-task row and the one a build should not spend on a mechanical edit. A phase that reaches the end of the ladder without a working executor stops and reports the phase, its task ids and the last refusal rather than authoring a file by hand outside the dispatch contract.

A phase's own wave table may name a different order for its own waves and says why. 013's W1 puts `cli-devin` before `cli-mistral-vibe`, because a read wave is the cheapest to re-run and the probe costs one call.
<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Who is the actor for a scheduled run on a shared host?** The proposal is the installing operator, pinned at install time. It is untested, and 001 settles it.
- **Does a routine move to a `starts` list at once, or keep one primary trigger plus extra queue names?** 002 decides. A v1 with one start keeps the slice at size S.
- **How large may a memory file grow before it is rewritten shorter?** OpenGhost's 60-record, 3,600-character bound is a starting point, not a measurement here, and 005 sets the bound.
- **Where does the per-action approval hook sit inside each executor's tool surface?** Out of scope for this program: 006 writes the ladder at the needs-you gate, and the hook is a later packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Contracts**: [`contracts/README.md`](contracts/README.md) indexes the shared shapes. The shapes themselves are in [`contracts/records.md`](contracts/records.md) for the durable records and [`contracts/cli-json.md`](contracts/cli-json.md) for the `--json` rule and one row per verb. The eleven packet decisions D1 to D11 are in [`contracts/decisions.md`](contracts/decisions.md).
- **Research source**: `../002-openbot-parity-research/001-openbot-parity-research/research/research.md` §12-15 for the small-team model, the skip list, reuse and licensing, and the ranked build order
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
