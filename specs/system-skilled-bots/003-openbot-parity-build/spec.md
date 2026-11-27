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
| **Handoff Criteria** | Each child passes `validate.sh --strict` before any child that depends on it starts, in the waves of BUILD ORCHESTRATION. 014-deep-review closes the program |
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
| 9 | `009-skills/` | A `skills:` list under a byte cap, and `bots skill propose` reviewed through a needs-you item | 001, whose needs-you item reviews the proposal. 005, whose prompt order and review seam it inserts into. 006, whose `grants` field its item fills. 008, whose `collectAllKnownSecrets` map the draft's secret check calls | Pending |
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

**The roster.** Five executors, no sixth. `cli-mistral-vibe` at `deepseek-flash` is the primary for every phase, by the operator's decision of 2026-11-27. It runs at `max` only, because the tier is the roster row's `thinking` field and no flag moves it [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89]. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017` is the first fallback. It takes `--thinking high` or `max`, the one effort lever that is a standalone flag [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101]. `cli-opencode` at `opencode-go/deepseek-v4.1-flash` takes `#high` or `#max` on the model id [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:142]. `cli-devin` at `deepseek-v4-1-flash-max` bakes `max` into the model uid [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156]. `cli-codex` at `gpt-6-luna` takes `xhigh` on the `fast` service tier, and it is the only route to a GPT model [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:28]. Vibe is never the hub's default route, so every brief names `cli-mistral-vibe` and `deepseek-flash` explicitly and the hub default stays DevPass [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:132].

**The tier rule.** Vibe runs every dispatch at `max`, so the tier no longer picks an effort for the primary. It picks the effort a wave takes when it falls back. DeepSeek Flash at `high` carries a small mechanical task: an edit to a settled module, a test that mirrors an existing one, a doc line. DeepSeek Flash at `max` carries a design or tricky task: a new module, a new shared record, a seam between two phases. A phase's wave tables still name that tier as the fallback tier, and it sets `--thinking` on `cli-pi` and the `#` suffix on `cli-opencode`. `gpt-6-luna` at `xhigh` on `fast` carries the hardest task and is the last fallback for every phase.

**The worker rule.** Parallelism follows file overlap: no two workers touch one file, so a phase's worker count is the number of disjoint file groups its tasks fall into. A phase whose tasks all edit one module runs one worker.

| Phase | Primary executor | Model | Effort | Workers in parallel | What sets the row |
|-------|------------------|-------|--------|---------------------|-------------------|
| 001 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 3 | A new `activity.ts` grouping and a new actor record. Three groups: the activity module, the record modules, `bots.cjs` |
| 002 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 3 | A new `routine.ts` and `routine-state.ts`. Three groups: the routine pair, `runner.ts` with the switches, the bot template |
| 003 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 3 | A new Rust crate, so the pane layout is design work. Three groups: the crate, the `ui` verb, the fixtures and suite |
| 004 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 3 | Edits to settled modules only, so its fallback tier is `high`. Three groups: `runner.ts`, `status.ts` with `status-index.ts`, `dispatch.ts` |
| 005 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 4 | A new `memory.ts` plus the prompt order and the review seam. Four groups: memory, runner and dispatch, needs-you, `bots.cjs` |
| 006 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 3 | The precedence ladder is the design case. Three groups: `answer.ts` with `action-kind.ts`, `needs-you.ts`, `bots.cjs` |
| 007 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 4 | Mostly edits to `runner.ts` and the audit gate. Four groups: apps and definition, runner, `executor-audit.ts`, the template and fixtures |
| 008 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 4 | The one slice that can leak, so the store and the injection are design work. Four groups: secrets, the record and dispatch pair, the audit gate, the notices |
| 009 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 3 | A new `skills.ts` and `skill-proposal.ts`. Three groups: skills, the proposal, the definition keys and template |
| 010 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 3 | A new `conversation.ts` and the `@bot` routing. Three groups: the conversation module, `bots.cjs`, the state root and drain |
| 011 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 4 | Four transports over one adapter seam. Four groups: the adapter and queue, the link and roster, approval and delivery, `bots.cjs` |
| 012 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 10 | Its `plan.md` §Waves: waves 0 to 5 ran before 2026-11-27 on their own executors, wave 4's ten distinct files set the bound and Vibe carries the open wave 8 |
| 013 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 4 | Its `tasks.md` §Waves: Vibe carries seven of the nine waves, two of them through the commands' `vibe-deepseek` lane preset, and W1's four read groups set the bound |
| 014 | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)` | 5 | Its `tasks.md` §Waves: wave 1 is a five-lineage fan-out, one per executor, so the Vibe lineage sits beside four other executor groups. Wave 3 fixes with at most 3 workers and wave 4 with at most 4 |

**Fallback order.** When a CLI runs out of usage, the phase moves down this ladder and keeps its task ids, its files and its verify step: `cli-mistral-vibe`, then `cli-pi`, then `cli-opencode`, then `cli-devin`, then `cli-codex`. A Vibe run that fails with `429` or `402 API budget exhausted` counts as a rung out of usage, so the wave drops to `cli-pi` rather than retrying Vibe [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:138]. `cli-devin` is probed with a trivial read-only call before a phase spends it, because a quota banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]. `cli-codex` is last because it is the hardest-task row and the one a build should not spend on a mechanical edit. A phase that reaches the end of the ladder without a working executor stops and reports the phase, its task ids and the last refusal rather than authoring a file by hand outside the dispatch contract.

A phase's own wave table may name a different order for its own waves and says why. 013's two lane waves walk the alignment commands' `--lanes` presets, `vibe-deepseek` first and `deepseek` second, because a lane preset is a flag on the command rather than a dispatch. 014's Wave 1 is a fan-out with one lineage per executor, so its ladder only picks which executor takes a dropped lineage's place, and Vibe never runs there without a second executor group beside it [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:190].
<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:build-orchestration -->
## BUILD ORCHESTRATION

This section turns the phase map and the per-phase table above into one dispatch plan for the whole build. It keeps the roster, the tier rule, the worker rule, the per-phase table and the fallback ladder as they are. It extends the worker rule across phases: no two workers in one wave touch one file, whichever phase they work for. An orchestrator that follows this section makes no scheduling choice, and a build worker meets no design choice that its own phase plan has not already made.

**Units.** A unit is a phase with no children or one child of 003, 010 or 011. There are 27: 001, 002, 004 to 009 and 012 to 014, the six children of 003, the three of 010 and the seven of 011. A child is written as its phase and child numbers, so 011.003 is `011-messaging-channels/003-link-roster-and-answer-gate/`.

**The file view.** A unit's write set is every file its open `tasks.md` task lines name for writing. Read-only tasks (Record, Read, Confirm, Run, Prove, Type-check) are left out. Two false hits were removed by hand: 003.006 T033 writes a `.skilled/bin/bots.cjs` shim inside a temporary tree and never the repository file, and the `tsconfig.json` lines in 010 and 011 are type-check runs. A file two or more units write is a shared file, and the owner table below lists every one. Each unit also writes its own spec folder, which no other unit writes.

**The transition rule.** In the Phase Transition Rules above, the next phase means a unit whose Waits for cell below names the one before it, as goal.md D2 says. A unit that does not wait for a running unit may start before that unit passes.

### Dependency graph

Each row is a unit, the units it waits for and the exact output it needs. Merged means on `main` after the merge gate in Isolation and merge. A **contract** row reads a frozen file under `contracts/` or a design file already written, not built code, so that unit starts in an earlier wave than its phase's map row would allow. An **operator gate** is a step only the operator can take. A late gate holds the unit it gates, and the slip rule under the wave schedule keeps it from holding the runtime lane.

| Unit | Waits for | The output it waits on |
|------|-----------|------------------------|
| 001 | Nothing | The runtime as it stands |
| 003.001 | Nothing. **Contract** | `contracts/cli-json.md` and the payload files in `003-terminal-screen/002-architecture-and-contracts/design/payloads/`. Its own map row says None [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:262] |
| 011.002 | Nothing. **Contract** | The frozen `records.md`, `cli-json.md`, `refusals.md`, `runtime-architecture.md` and `versioning.md` under `contracts/` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/plan.md:99] |
| 002 | 001 | `answerItem` with its actor and scope arguments, which the no-resume option extends. `activityReport`, which takes `describeStart` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:156] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:181] |
| 010.001 | 003.001. **Contract** | The merged design files in `003-terminal-screen/001-ux-and-component-map/design/` and `contracts/` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/plan.md:104] |
| 011.001 | 011.002. **Contract** | `capabilities.md` in 011.002's `design/` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/plan.md:101] |
| 003.002 | 003.001, 001 and 002 | **Operator gate:** the approval row 003.001 T030 records in `design/key-map.md` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:280]. The four `--json` shapes as 001 and 002 document them, which the fixture carries [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/plan.md:203] |
| 003.003 | 003.002 | The crate with `state.rs`, `app.rs` and `cli.rs` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation/plan.md:180] |
| 003.004 | 003.002 and 003.003 | From 003.002: `state.rs` with `Remote<T>`, the frame loader and the fixture. From 003.003: `src/view/mod.rs` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/plan.md:124-127] |
| 003.005 | 003.004 and 001 | The `PaneView<ItemId>` selection [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/plan.md:229]. The argv of `bots answer --scope once\|deny` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/plan.md:230] |
| 003.006 | 003.003, 003.004 and 003.005 | `keys.rs`, `theme.rs`, `view/panes.rs` and `view/overlay.rs` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/plan.md:135-138]. The operator's hand answer from the overlay is the acceptance step after 003.006 merges, so it gates no unit [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md:69] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:285] |
| 004 | 001 | No output. 004 reads `evidence.branch`, which the run record already carries [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:90]. The edge is file order, because both write `runner.ts`, `status.ts` and `status-index.ts` |
| 005 | 001 and 004 | The `'kind'` entry 001 lands in `ITEM_KEYS` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:41]. 004's `workingPlace` input `{ path, branch, runFolder }` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:47] |
| 006 | 001, 002 and 005 | `bots answer --scope once\|deny`, `--as` and `bots inbox --json` from 001. `evaluateFatigue` in `routine-state.ts` and the no-resume answer from 002. The memory-proposal branch in `runner.ts` from 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:152-154] |
| 007 | 001 | The run record's posture block [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:43] |
| 011.003 | 011.001, 011.002, 001 and 006 | The 23 goldens and the five design files [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:279-280]. 001's actor argument to `answerItem` and 006's guarded write [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/plan.md:123-124]. No 008 output, because `link` writes a secret name and never reads a value [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/plan.md:125] |
| 011.004 | 011.003, 006 and 008 | `channel.ts` and `channel-link.ts` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/plan.md:115-116]. 006's `deny` rule [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/plan.md:117]. 008's vault and `collectAllKnownSecrets`, because AC-028 withholds a prompt that holds a stored secret [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/acceptance-criteria.md:61], and a stored secret is a vault entry in 011.005's AC-014 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/acceptance-criteria.md:59]. 011.004's plan does not list 008, so this edge is read from the acceptance row. After 008 its new check call site has one map to call |
| 008 | 005 and 007 | The `postRunCauses` field 005 lands [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:101]. 007's dispatch-env gate and `extraEnv` field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:165] |
| 009 | 001, 005, 006 and 008 | `by` on the answer, the prompt order with the review seam and the `grants` field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:156-158]. 008's `collectAllKnownSecrets`, which the draft's secret check calls [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:152] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:206]. The phase map's 009 row lacked this edge and now names it |
| 010.002 | 010.001, 005 and 008 | The routing grammar, the loop transcript and the prompt boundary [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:206]. 005's request join in `buildBotPrompt` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/plan.md:135]. 008's post-run scan, which redacts stdout before the reply is read [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/plan.md:65] |
| 010.003 | 010.001, 003.006 and 010.002 | **Operator gate:** the approved key map delta [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/003-chat-pane-and-proof/plan.md:108]. The crate [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/003-chat-pane-and-proof/plan.md:109]. `bots chat --transcript --json` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:208] |
| 011.005 | 011.004, 008 and 010.002 | The queue and the index with `BACKOFF_MS` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:282]. 008's `resolveSecret` and 010.002's `conversation.ts` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/plan.md:112-113] |
| 011.006 | 011.005 and 008 | `listen`, the shared transport test file and 008's `resolveSecret` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/plan.md:108-109] |
| 011.007 | 011.005, 011.006 and 001 | The five transports [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:284-285]. `THIRD_PARTY_NOTICES.md`, which 001 creates [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/plan.md:95] |
| 012 | Every unit from 001 to 011 | Every verb a scenario names [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/plan.md:45] |
| 013 | 012 | The packet's whole `.skilled` change set and its docs [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/plan.md:45] |
| 014 | 013 | A clean 013, so the review reads a checked surface [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:134] |

**Critical path.** The edges alone give a longest chain of 12 waves: 001, 004, 005, 006, 011.003, 011.004, 011.005, 011.006, 011.007, 012, 013 and 014. The file rule makes it 16. The runtime lane holds 14 units. Eleven of them write `bots.cjs` and nine write `runner.ts`, so they cannot share a wave. Only 007 can share a wave with another runtime unit, and only with 011.003. Every other file-disjoint pair is joined by a chain of edges, such as 004 and 011.003 through 005 and 006. The runtime lane therefore takes 13 waves, and 012, 013 and 014 add three. The realised path is 001, 002, 004, 005, 006, 007, 008, 011.004, 009, 010.002, 011.005, 011.006, 011.007, 012, 013 and 014, which is 16 waves. 002 takes W2 because it shares `runner.ts` with 004. 008 must merge before 011.004 and 011.005, and 010.002 before 011.005. 009 shares a file with every runtime unit, so it takes a wave of its own.

### Wave schedule

A wave is a round. It lasts as long as its slowest unit, and a unit may open inside an earlier wave once its entry checks in the Orchestrator loop pass. A unit's wave number is therefore the round it opens in at the latest, when every unit before it takes one round. The worker count is each unit's largest internal wave from its own wave table. Units in one row share no file, which the owner table proves.

| Wave | Units and workers | Shared files the wave locks | Entry notes |
|------|-------------------|-----------------------------|-------------|
| W1 | 001 at 3, 003.001 at 1, 011.002 at 5. 9 workers | 001: `bots.cjs`, `runner.ts`, `answer.ts`, `run-record.ts`, `needs-you.ts`, `status.ts`, `status-index.ts`, `installer.ts`, `posture.ts`, `lib/README.md` and `THIRD_PARTY_NOTICES.md`. The other two write only their own folders | 003.001 and 011.002 are **contract** starts. 003.001's eight open tasks are checks and the approval row |
| W2 | 002 at 3, 010.001 at 2, 011.001 at 2. 7 workers | 002: `bots.cjs`, `runner.ts`, `answer.ts`, `run-record.ts`, `dispatch.ts`, `definition.ts`, `state-root.ts`, `status.ts`, `installer.ts`, `routine-state.ts`, `bot-check.cjs` and `contracts/prompt-sections.md` | 010.001 and 011.001 are **contract** starts |
| W3 | 004 at 3, 003.002 at 5. 8 workers | 004: `runner.ts`, `dispatch.ts`, `status.ts`, `status-index.ts`, `lib/README.md` and `contracts/prompt-sections.md`. 003.002: `bots.cjs` and the crate | 004 is the first runtime unit that leaves `bots.cjs` free, so 003.002 lands its `ui` verb here. The slip rule below covers a late approval |
| W4 | 005 at 4, 003.003 at 4. 8 workers | 005: `bots.cjs`, `runner.ts`, `answer.ts`, `run-record.ts`, `dispatch.ts`, `definition.ts`, `needs-you.ts`, `state-root.ts`, `label.ts` and `contracts/records.md`. 003.003: the crate | None |
| W5 | 006 at 3, 003.004 at 3. 6 workers | 006: `bots.cjs`, `runner.ts`, `answer.ts`, `run-record.ts`, `needs-you.ts` and `routine-state.ts`. 003.004: the crate | None |
| W6 | 007 at 4, 011.003 at 4, 003.005 at 2. 10 workers | 007: `runner.ts`, `dispatch.ts`, `definition.ts`, `posture.ts`, `run-record.ts` and `executor-audit.ts`. 011.003: `bots.cjs`, `answer.ts` and `state-root.ts`. 003.005: the crate | The peak, and every one of the 10 workers is a Vibe worker. 011.003 opens before 008 and 010 merge because it reads no output of either |
| W7 | 008 at 4, 003.006 at 2. 6 workers | 008: `bots.cjs`, `runner.ts`, `answer.ts`, `run-record.ts`, `dispatch.ts`, `delivery.ts`, `state-root.ts`, `executor-audit.ts`, `contracts/records.md` and `THIRD_PARTY_NOTICES.md`. 003.006: the hub `SKILL.md` and the crate | 008's T055 moves every call site that exists at build time to `collectAllKnownSecrets` and fails its verify on any it leaves [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:119] |
| W8 | 011.004 at 3 | `bots.cjs` and `delivery.ts` | 011.004 opens after 008 for the reason its Waits for row gives |
| W9 | 009 at 3 | `bots.cjs`, `runner.ts`, `answer.ts`, `run-record.ts`, `dispatch.ts`, `definition.ts`, `state-root.ts`, `label.ts`, `bot-check.cjs` and `contracts/prompt-sections.md` | None |
| W10 | 010.002 at 3 | `bots.cjs`, `runner.ts`, `answer.ts`, `needs-you.ts`, `state-root.ts`, the hub `SKILL.md`, `THIRD_PARTY_NOTICES.md` and `contracts/prompt-sections.md` | None |
| W11 | 011.005 at 3, 010.003 at 3. 6 workers | 011.005: `bots.cjs`. 010.003: the crate | None |
| W12 | 011.006 at 2 | `bots.cjs` | None |
| W13 | 011.007 at 4 | The hub `SKILL.md`, `THIRD_PARTY_NOTICES.md` and `lib/README.md` | None |
| W14 | 012 at 1 | `contracts/cli-json.md`, `contracts/refusals.md` and the playbook | 39 of its 52 tasks are done. Its open waves are the re-check and the recorded run, which the orchestrator and one `cli-mistral-vibe` worker carry |
| W15 | 013 at 4 | Every file a fix touches, the hub `SKILL.md` and `bots.cjs` among them | Runs alone, because a fix can land anywhere |
| W16 | 014 at 5 | Every file a fix touches | Runs alone. Its wave 1 replaces a lineage whose executor is out with `--count=2` on the next one, by its own rule, and stops rather than run Vibe as the only executor group [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/tasks.md:127] |

**The slip rule.** Two crate units own a file in the runtime lane's chain. 003.002 owns `bots.cjs` in W3, ahead of 005. 003.006 owns the hub `SKILL.md` in W7, ahead of 010.002. Neither may stall that lane. When 004 opens, the orchestrator runs `rg -n '^\| \*\*Approved\*\* \| Met \|' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md`. If it prints no line, 003.002 leaves W3 and opens in W13 beside 011.007, the next wave whose units leave `bots.cjs` free. Every later crate unit then moves ten waves: 003.003 to W14, 003.004 to W15, 003.005 to W16, 003.006 to W17 and 010.003 to W18. 012, 013 and 014 take W19, W20 and W21. A held 003.002 or 003.006 is handled the same way. Its branch stays unmerged as evidence, its shared file passes to the next owner and it reopens after the operator's repair from a fresh worktree, in the next wave whose units leave that file free, with its tasks dispatched again. It then edits on top of every owner that went before it.

Three child tables name more workers than their phase row above. 003.002 names 5 and 003.003 names 4 against the 003 row's 3. 011.002 names 5 against the 011 row's 4. The counts here follow the child tables, because goal.md ranks child detail above a summary of it. The phase row still sets each phase's executor, model and effort.

### Shared-file serialisation

The wave order is the owner order. A unit holds every shared file it writes from its first internal wave until it merges. The next owner opens only after that merge, from a worktree cut from the `main` that holds the edit, so each owner edits on top of every earlier owner and no merge ever brings two branches that changed one file. Where several owners add to one list, each adds its own entry and leaves the others alone.

| File | Owners in wave order | Note |
|------|----------------------|------|
| `.skilled/bin/bots.cjs` | 001 (W1) > 002 (W2) > 003.002 (W3) > 005 (W4) > 006 (W5) > 011.003 (W6) > 008 (W7) > 011.004 (W8) > 009 (W9) > 010.002 (W10) > 011.005 (W11) > 011.006 (W12) > 013 (W15) | 004, 007 and 011.007 never write it, so 003.002 shares W3 with 004 and 011.003 shares W6 with 007 |
| `runtime/lib/runner.ts` | 001 (W1) > 002 (W2) > 004 (W3) > 005 (W4) > 006 (W5) > 007 (W6) > 008 (W7) > 009 (W9) > 010.002 (W10) | Nine owners, one per wave |
| `runtime/lib/answer.ts` | 001 (W1) > 002 (W2) > 005 (W4) > 006 (W5) > 011.003 (W6) > 008 (W7) > 009 (W9) > 010.002 (W10) | The review seam is 005's and the guarded write is 006's, per Shared Records |
| `runtime/lib/README.md` | 001 (W1) > 002 (W2) > 004 (W3) > 005 (W4) > 006 (W5) > 008 (W7) > 009 (W9) > 010.002 (W10) > 011.007 (W13) | One module row per owner |
| `runtime/lib/run-record.ts` | 001 (W1) > 002 (W2) > 005 (W4) > 006 (W5) > 007 (W6) > 008 (W7) > 009 (W9) | Every field is additive, per `contracts/records.md` section 4 |
| `runtime/lib/dispatch.ts` | 002 (W2) > 004 (W3) > 005 (W4) > 007 (W6) > 008 (W7) > 009 (W9) | Each block lands in the slot `contracts/prompt-sections.md` section 1 fixes |
| `runtime/lib/state-root.ts` | 002 (W2) > 005 (W4) > 011.003 (W6) > 008 (W7) > 009 (W9) > 010.002 (W10) | One folder per owner |
| `runtime/lib/definition.ts` | 002 (W2) > 005 (W4) > 007 (W6) > 009 (W9) | One frontmatter key per owner |
| `runtime/lib/needs-you.ts` | 001 (W1) > 005 (W4) > 006 (W5) > 010.002 (W10) | 005 owns `kind` and 006 owns `grants` |
| `runtime/lib/status.ts` | 001 (W1) > 002 (W2) > 004 (W3) | None |
| `runtime/lib/status-index.ts` | 001 (W1) > 004 (W3) | `SCHEMA_VERSION` stays `'2'` |
| `runtime/lib/installer.ts` | 001 (W1) > 002 (W2) | None |
| `runtime/lib/posture.ts` | 001 (W1) > 007 (W6) | None |
| `runtime/lib/routine-state.ts` | 002 (W2) > 006 (W5) | 002 creates it |
| `runtime/lib/label.ts` | 005 (W4) > 009 (W9) | One reserved id per owner |
| `runtime/lib/delivery.ts` | 008 (W7) > 011.004 (W8) | 011.004 adds its channel names and choice block under the check 008 moved |
| `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | 007 (W6) > 008 (W7) | 008 passes its key through the gate 007 lands |
| `scripts/bot-check.cjs` | 002 (W2) > 009 (W9) | None |
| `assets/bot-template.txt` and `bots-author/references/bot-definition.md` | 002 (W2) > 005 (W4) > 007 (W6) > 008 (W7) > 009 (W9) | One key per owner |
| `feature-catalog/definition/bot-definition-contract.md` | 007 (W6) > 008 (W7) | None |
| `bots-run/references/run-queue-and-answer.md` | 001 (W1) > 005 (W4) > 006 (W5) > 010.002 (W10) | None |
| `bots-run/SKILL.md` | 005 (W4) > 009 (W9) > 010.002 (W10) > 011.007 (W13) | None |
| `bots-status/references/status-and-inbox.md` | 001 (W1) > 004 (W3) > 006 (W5) | None |
| `bots-status/SKILL.md` | 001 (W1) > 002 (W2) | None |
| The hub `SKILL.md` | 003.006 (W7) > 010.002 (W10) > 011.007 (W13) > 013 (W15) | One line per owner |
| `THIRD_PARTY_NOTICES.md` | 001 (W1) > 008 (W7) > 010.002 (W10) > 011.007 (W13) | 001 creates it and each later owner appends one `## <phase>` section |
| `contracts/prompt-sections.md` | 002 (W2) > 004 (W3) > 009 (W9) > 010.002 (W10) | A shape change edits the contract in the same change, per Shared Records |
| `contracts/records.md` | 005 (W4) > 008 (W7) | Same rule |
| `runtime/tests/runner.vitest.ts` | 002 (W2) > 004 (W3) > 005 (W4) > 006 (W5) > 007 (W6) > 009 (W9) > 010.002 (W10) | None |
| `runtime/tests/answer.vitest.ts` | 001 (W1) > 002 (W2) > 005 (W4) > 006 (W5) > 011.003 (W6) > 009 (W9) | None |
| `runtime/tests/cli-run.vitest.ts` | 001 (W1) > 002 (W2) > 005 (W4) > 006 (W5) > 009 (W9) | None |
| `runtime/tests/dispatch.vitest.ts` | 002 (W2) > 004 (W3) > 005 (W4) > 009 (W9) | None |
| `runtime/tests/definition.vitest.ts` | 002 (W2) > 005 (W4) > 009 (W9) | None |
| `runtime/tests/bot-check.vitest.ts` | 002 (W2) > 007 (W6) > 009 (W9) | None |
| `runtime/tests/needs-you.vitest.ts` | 001 (W1) > 005 (W4) > 006 (W5) | None |
| `runtime/tests/status.vitest.ts` | 001 (W1) > 002 (W2) > 004 (W3) | None |
| `runtime/tests/installer.vitest.ts` and `runtime/tests/run-record.vitest.ts` | 001 (W1) > 002 (W2) | None |
| `runtime/tests/status-index.vitest.ts` | 001 (W1) > 004 (W3) | None |
| `runtime/tests/cli-channel.vitest.ts` | 011.003 (W6) > 011.004 (W8) | None |
| `runtime/tests/channel-support.ts` | 011.003 (W6) > 011.007 (W13) | None |
| `runtime/tests/channel-transports.vitest.ts` | 011.005 (W11) > 011.006 (W12) | None |
| `crates/bots-tui/src/` and `crates/bots-tui/tests/` | 003.002 (W3) > 003.003 (W4) > 003.004 (W5) > 003.005 (W6) > 003.006 (W7) > 010.003 (W11) | One crate unit per wave |
| Any file a fix touches | 013 (W15) > 014 (W16) | Each runs alone |

`runtime/` is `.skilled/skills/system-skilled-bots/runtime/`, and the skill doc paths sit under `.skilled/skills/system-skilled-bots/`. No unit writes a file at the parent level except the `contracts/` files this table names. The parent's generated `description.json` and `graph-metadata.json` are rebuilt on `main` after a merge and never in a worktree.

### Isolation and merge

- **The workspace choice is the operator's.** sk-git forbids an AI from choosing between a worktree and the current branch [SOURCE: .skilled/skills/sk-git/SKILL.md:58], so the orchestrator asks once before W1 and waits. This schedule needs answer A, a worktree. Under answer B one unit runs at a time in wave order, which is the serial build.
- **One numbered worktree per running unit.** `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create openbot-<unit> main` allocates the number and provisions the dependencies, so no number is computed by hand [SOURCE: .skilled/skills/sk-git/SKILL.md:146] [SOURCE: .skilled/skills/sk-git/SKILL.md:156]. `<unit>` is the phase folder name, or for a child the phase number and the child folder name, for example `openbot-011-003-link-roster-and-answer-gate`. Every worker of a unit runs with that worktree as its working directory, and its brief names the path. Each unit's scratch state root is its own `mktemp -d`, so no two units share bot state [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/verification.md:45].
- **The merge gate.** A unit merges only when its own `validate.sh --strict` prints `RESULT: PASSED` for its folder and `rg -c '\| Unmet \|' <unit folder>/acceptance-criteria.md` finds no row, per Phase Handoff Criteria. The orchestrator runs both and reads the output. No worker reports them second-hand.
- **The merge order.** Units merge in the order they pass the gate, and a tie goes in the order the wave row lists them. Units of one wave share no file, so the order changes no file's content.
- **The orchestrator rebases.** It commits the unit's work in the worktree with no autostash [SOURCE: .skilled/skills/sk-git/SKILL.md:179], then runs `git rebase main` there when `main` has moved since the worktree was cut. It rebases only local, unpushed commits [SOURCE: .skilled/skills/sk-git/SKILL.md:343]. While the file view holds, the rebase cannot conflict. A conflict means the view is wrong: the orchestrator runs `git rebase --abort`, holds the unit and reports the file. No worker resolves a conflict.
- **The merge.** sk-git's finish workflow, Option 1 Merge Locally [SOURCE: .skilled/skills/sk-git/references/finish-workflows.md:158], then the worktree is removed before its branch [SOURCE: .skilled/skills/sk-git/SKILL.md:190]. The orchestrator never pushes. A push is the operator's call [SOURCE: .skilled/skills/sk-git/SKILL.md:85].
- **`main` is the authority.** A strict validation run inside a worktree is a pre-check only [SOURCE: .skilled/skills/sk-git/SKILL.md:357]. The regression gate below reruns it on `main` after each merge, and metadata is regenerated there [SOURCE: .skilled/skills/sk-git/SKILL.md:165].
- **Generated metadata.** `validate.sh` on a Draft packet rewrites a stale `graph-metadata.json` on its own. A unit's commit never carries this folder's `graph-metadata.json` or `description.json`: if a worktree run rewrote one, the orchestrator runs `git restore` on that file before the commit. When the regression gate rewrites one on `main`, the orchestrator commits that file on `main` before the next unit opens.

### Vibe dispatch

Every unit's primary is `cli-mistral-vibe` at `deepseek-flash`. The mode's `SKILL.md` owns the dispatch shape and its hard rules, and the orchestrator reads it before the first brief. These are the facts a build worker adds to that shape.

- **Preflight, once before W1.** `command -v vibe` succeeds, `vibe --version </dev/null` prints `vibe 3.1.2` and `MISTRAL_API_KEY` is exported from the Vibe sign-in key in the keychain item `ai.mistral.vibe` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:98]. `VIBE_SESSION` is unset, and neither `vibe-rs` nor `vibe-app-server` is an ancestor of the orchestrator [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16]. If one check fails, every unit starts at `cli-pi` and the orchestrator reports which check failed.
- **One scratch folder per worker, inside the unit's worktree.** A build worker writes the checkout, so it passes `--add-dir "$WT"`, where `$WT` is the unit's worktree. Vibe then loads that tree's hooks, and they find the checkout with `git rev-parse --show-toplevel`, so the run starts from `$WT/.skilled/skills/.state/vibe-runs/<unit>/<worker>/`, which sits below the root and which git ignores [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:94]. `--add-dir`, the `config.toml` copy and `render-home-hooks.cjs` all name that same `$WT` and never the primary checkout.
- **One home per worker, outside the checkout.** `VIBE_HOME` is a fresh `mktemp -d` for each worker. The orchestrator copies `$WT/.vibe/config.toml` into it and renders the hooks into it before the run, so no two workers share logs, history or a trust file [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:90].
- **The run line.** On one command line: `VIBE_HOME` set to the worker's own home, `AI_SESSION_CHILD=1`, `VIBE_SPEC_FOLDER` set to the unit's absolute folder in `$WT` and `SPECKIT_DIST_AUTO_REBUILD=0`, so ten sessions never race one dist build into the checkout [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/cli-reference.md:269]. Then `vibe -p "$PROMPT" --model deepseek-flash --add-dir "$WT" --auto-approve --output-dir "<scratch>/out" </dev/null`. No reasoning flag exists, so none is passed. `--auto-approve` is there because print mode has no human to approve a tool call, and the shared lane runner passes it for every Vibe lane as the deep-loop runner does for an unconfined lineage [SOURCE: .skilled/commands/assets/local-skilled-alignment/run-lanes.cjs:577] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:190]. A tool call can still be denied, by a repository hook for example, and the run can still finish 0. So a wave that names files to write and leaves an empty diff counts as a failed Vibe rung: the wave drops to `cli-pi` and the drop does not spend the one retry.
- **The outcome.** A worker is done only when `<scratch>/out/export.json` records `exit_code` 0 and `outcome` `finished`. Stdout and the exit status prove nothing, because a denied tool call can still end in exit 0 [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:88]. The wave's verify commands then decide whether the work holds.
- **One change per brief.** A worker that holds several task ids runs them as sequential briefs in its own slot, one change each, so the worker counts in the wave tables stand [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:119].
- **Rate limits.** W6 runs 10 Vibe workers at once, and Vibe's rate limit at that concurrency is UNKNOWN. No capture shows how a `429` surfaces in print mode, so the orchestrator reads the `error` record in `export.json` and stderr. On a `429` or a `402 API budget exhausted` the internal wave drops to `cli-pi` at the fallback tier its wave table names. It does not retry Vibe, and the drop does not spend the one retry.

### Orchestrator loop

**Once, before W1:**

1. Ask the workspace question and wait for the answer.
2. Record the baseline on `main`: `(cd .skilled/skills/system-skilled-bots/runtime && npm test)`, `(cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck)` and the Summary line of `validate.sh --strict` for this folder. Every later no-regression claim is a delta against these three.
3. Run the Vibe preflight above. Treat `cli-opencode` as out of usage until the operator says OpenCode Go has reset, because its monthly limit ran out on 2026-11-25. It is the third rung on every ladder, so a wave that falls past `cli-pi` skips it and goes to `cli-devin`.
4. Ask the operator for the two key map approvals. 003.002 needs 003.001's approval before 004 opens, and a later approval moves the build from 16 waves to 21 under the slip rule, so this one is on the critical path. 010.003 needs 010.001's delta approval at W11. After 003.006 merges, ask for the hand answer its acceptance step names.

**Each wave:**

1. **Open.** Check each unit in the row, in row order. It opens when every unit in its Waits for cell has merged, every earlier owner of each file it writes has merged and its operator gate is met. A unit that passes opens at once, even while the wave before is still running. A unit that fails waits, and the rest of its row goes on.
2. **Dispatch.** Run the unit's internal waves exactly as its own wave table names them: the task ids, the executor, the model, the effort and the worker count. Live workers across all units never pass 10, the W6 peak. A unit whose next internal wave would pass 10 waits, and waiting units go in wave order and then row order. A Vibe `429` or `402` drops that internal wave to `cli-pi`, as Vibe dispatch says. A `cli-pi` rate-limit refusal is not a failure: that internal wave reruns in batches of 3, as 012's plan does [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/plan.md:204].
3. **Collect and verify.** After each internal wave, read each worker's outcome record, then run that wave's verify commands in the unit's worktree and read their output and exit status. A worker's done is a claim until those commands pass.
4. **Gate, rebase and merge,** as Isolation and merge says.
5. **Rerun the regression gate on `main`** after every merge: the runtime `npm test` exits 0 with no `failed` line, `npm run typecheck` exits 0, `cargo test --locked --manifest-path crates/bots-tui/Cargo.toml` exits 0 once 003.002 has merged, the merged unit's own Definition of Done commands pass and `validate.sh --strict` prints `RESULT: PASSED` for the merged unit and for this folder. Compare each result with the baseline.
6. **Close** the wave when each of its units has merged or is held.

**On a failed worker:**

- A failed verify gets one retry: the same task ids, files and verify step, dispatched on the next rung of the unit's own ladder, `cli-pi` after a Vibe failure. A rung skipped for exhausted usage, a Vibe `429` or `402` or a self-invocation guard does not spend the retry.
- A second failure holds the unit. The orchestrator stops dispatching it, keeps its worktree and its files and reports the unit, the internal wave, the task ids, the verify output and the last executor. The operator decides the repair.
- A red regression gate reverts that merge with `git revert -m 1 <merge commit>` and holds the unit. The unit lands later by reverting that revert after its repair, never by a second merge of the same branch.
- A held unit holds its dependents and every later owner of a file it writes, because its files never pass on. The one exception is a held 003.002 or 003.006, which follows the slip rule and passes its file on. In this schedule a held runtime unit holds every runtime unit in a later wave. Every unit with no edge and no shared file on the held one continues, which means the crate lane and the design units up to their first edge on it. A held crate unit holds every crate unit after it, 010.003 among them. It also holds 012, 013 and 014.

### Concurrency and length

| Measure | One unit after another | This schedule |
|---------|------------------------|---------------|
| Rounds | 27, one per unit | 16 waves |
| Units at once | 1 | 3 by the table, in W1, W2 and W6 |
| Workers at once | 5, in 003.002, 011.002 or 014 | 10, in W6 |
| Critical path | 27 units | 16 waves. The edges alone would allow 12, and a late 003.001 approval makes it 21 |

The four waves between 12 and 16 are the price of the file rule, not of the schedule. Only a change to the phase plans could buy them back, for example by moving each phase's `bots.cjs` verb entry and `runner.ts` hook into one integration unit per file. That is a plan amendment for the operator, and nothing in this section assumes it.
<!-- /ANCHOR:build-orchestration -->

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
