# Planning-Depth Review of the OpenBot Parity Build Packet

Lineage `vibe` of the plan-depth research fan-out. Ten iterations, 73 findings (13 P0, 46 P1, 14 P2), five key questions answered, 47 ruled-out directions.

## 1. Executive Summary

The packet `specs/system-skilled-bots/003-openbot-parity-build` is not one-shot ready, but it is closer than its size suggests. Its fourteen phases are individually well written: every phase names its files, its refusal names, its acceptance criteria and a verification command per task. What is missing is almost never design — it is the layer between the phases.

Three findings carry most of the weight:

1. **Only one phase needs to become a parent.** 011-messaging-channels is 29 files and 23 requirements across nine modules and five transports, and it needs six children. Every other phase is one coherent module family plus a seam; splitting them would damage them. 003's six-child shape is the right answer for a screen, not a template for the packet.
2. **One document closes fifteen findings.** The packet already has the vocabulary it needs in code — `REFUSAL_CAUSES` (25 typed entries with an author/operator/environment class), `EXIT_CODES` (six frozen values), and a shared-record table in the parent spec — and no phase cites any of it. A single packet-level contract document carrying the refusal catalogue, the exit-code table, a schema-version rule, a single-writer map, the record-ownership table and the target-state module map would close more findings than any child phase.
3. **The packet cannot prove itself.** 012 records 33 manual scenarios but can close with every one of them recorded FAIL; 013's evidence lives outside the checkout and its handoff to 014 has no receiver; 014 forbids a second review after its own fixes and never reads 012's results. The closing three phases are individually careful and collectively unable to certify the build.

Two P0s break existing operator state on upgrade: 008 changes the meaning of the `secrets:` field with no migration runbook, and no phase owns a schema version, so an old record and a new one are indistinguishable.

## 2. Review Question and Scope

The operator intends to build all fourteen phases in one shot to perfection, so every phase must be planned deeply enough that a builder makes no design decision. Phase 003-terminal-screen was just expanded into a Level 3 parent with six children and is the depth benchmark; its children were not reviewed.

For every other phase this review asked:

- Is it planned deeply enough to one-shot?
- What is missing: module and file design, data contracts and record schemas with every field, state machines and lifecycles, an error and refusal catalogue, concurrency and restart behavior, migration and rollback, test strategy with fixtures, the interfaces it offers to and takes from other phases, security boundaries, operator prerequisites, and design artifacts for anything user-facing?
- Should it become a phase parent with children like 003, and which children?
- Which reference code in `specs/system-skilled-bots/context/` should it study first?

Out of scope: 003's six children, the built runtime's correctness (014 reviews that), and any change to the packet itself. This lineage writes only inside its own directory.

## 3. Method and Evidence Base

Ten iterations, each with three to five research actions, every finding carrying a `[SOURCE: path:line]` or `[INFERENCE: ...]` marker.

| Iteration | Focus | Findings | newInfoRatio |
|---|---|---|---|
| 1 | Data and contracts for 001, 002, 005, 006, 010 | 7 | 0.93 |
| 2 | 011-messaging-channels | 7 | 0.86 |
| 3 | Shared architecture and the small phases | 7 | 0.86 |
| 4 | The `--json` envelope convention | 5 | 0.90 |
| 5 | The needs-you item key set | 7 | 0.86 |
| 6 | 007-per-bot-apps and 008-vault | 8 | 0.93 |
| 7 | 009-skills and 012-manual-testing-scenarios | 8 | 0.88 |
| 8 | 013-skilled-and-doc-alignment and 014-deep-review | 8 | 0.90 |
| 9 | The cross-cutting layer | 8 | 0.92 |
| 10 | The ranked expansion plan | 8 | 0.80 |

Evidence came from the fourteen phase specs, plans, tasks, acceptance criteria and goals; the built runtime under `.skilled/skills/system-skilled-bots/runtime/lib/` and `.skilled/bin/bots.cjs`; the parent spec's Shared Records table; and the earlier research in `specs/system-skilled-bots/002-openbot-parity-research/`. The reference code in `specs/system-skilled-bots/context/` was consulted only where a phase already cites it, because recommending a source the phase does not cite would be a design decision this review cannot authorize.

## 4. Findings by Phase

### 001-activity-and-actor — 24 files, 10 requirements — addendum

The needs-you item has no lifecycle transition table: `open`, `answered` and `expired` exist as a type (`needs-you.ts:47`) with no statement of which transitions are legal, who may make them, or what happens to an item whose run is resumed twice. The answer record's `by` and `scope` nullability is unstated, so a builder cannot tell whether an unanswered item carries `null` or omits the key. 001 also owns the `--json` envelope for `bots inbox --json`, which iteration 4 found inconsistent with the `bots status --json` precedent.

Closing artifact: one addendum with the item lifecycle transition table and the answer record schema.

### 002-routine-layer — 24 files, 11 requirements — addendum

The routine state file is unshaped: the phase names it, names the fields it must carry, and never gives the file a schema. The `until` observation is likewise unshaped — the phase says an `until` outcome sets `completed` and records `untilMetAt` without saying what is observed, how often, or what a partial observation records. 002 is otherwise strong: 26 concurrency mentions, a 900-second floor, a ten-failure disable rule.

Closing artifact: one addendum with the routine state schema and the `until` observation shape.

### 003-terminal-screen — Level 3, six children — the benchmark, not reviewed

003 is the only phase with design artifacts (`001-ux-and-component-map/design/`, `context/screenshots/{products,web,openhuman-demo}`), the only Level 3 phase, and the only one whose children each own a slice of one surface. It is the depth target for the packet and the reason the other thirteen phases can be judged.

### 004-computer-exposure — 12 files, 16 requirements — ready

The best one-shot-ready phase in the packet. Every refusal is named, the working-place contract is pinned, the branch and worktree fields are specified, and no design decision is left open. It needs nothing.

### 005-memory — 22 files, 15 requirements — addendum

The memory entry line format is unspecified: the phase bounds the file at 60 entries and 3,600 bytes and never says what a line looks like, so `bots remember` and the prompt renderer can disagree about the same file. The prompt section order — the contract every later phase inserts into — lives in `005/plan.md:71` rather than in a contract document, and 009 and 010 both cite it as if it were one. 005 also owns the item's `kind` field, which 009 then contradicts.

Closing artifact: one addendum with the memory entry grammar and the prompt section order promoted to a contract.

### 006-approval-grants — 21 files, 14 requirements — addendum

The `kind` collision is the packet's clearest naming defect: the item's own `kind` (005's field, values `decision` and `memory-proposal`) and `grants.kind` (006's field, seven action kinds) share a name and mean different things, and 006's own ownership rule is contradicted by its `kind` row. `RECORD_KEYS` has no owner row in the shared-record table, so no phase is accountable for it.

Closing artifact: one addendum with the item and grant key ownership table.

### 007-per-bot-apps — 13 files, 9 requirements — ready

Only P2 findings. The `apps:` filter, the filtered UTCP config, the `UTCP_CONFIG_FILE` handoff through `dispatchEnvKeys`, the `apps-unknown-server` and `apps-unenforceable` refusals and the worktree-restore-after-exit rule are all pinned. It needs nothing.

### 008-vault — 19 files, 15 requirements — addendum, two P0s

The deepest phase after 014 and still not one-shot ready. The `secrets` name grammar is referenced six times across spec, plan and goal and defined nowhere; the `SKILLED_BOT_SECRET_<NAME>` mapping rule is unstated, and translation versus grammar restriction are not equivalent because translated names can collide; the store's index shape is reconstructable only from an acceptance-criteria command; `secret-too-long` and `secret-store-unreadable` exist only in edge-case prose with no requirement and no acceptance criterion, yet the goal verifies one of them; the index has no concurrency rule; the keychain backend names one of the three commands it needs; and the phase changes the meaning of an existing field with no migration and no rollback.

Closing artifact: one addendum with four parts — the name grammar, the env-key mapping table, the index schema, and the migration runbook.

### 009-skills — 25 files, 12 requirements — addendum

The skill-name grammar is referenced three times and defined nowhere, and it doubles as the loader's path-traversal guard. `bots skill propose` with no `--name` has no stated default, and two artifacts depend on it. 005's decision record says 009 adds no sentinel of its own while 009's REQ-005 uses one and its files table adds it to `RESERVED_BOT_IDS`. `proposal.json`'s five fields are prose rather than keys, and `revisionRead` is ambiguous because REQ-006 compares a digest against a field named revision. The draft `SKILL.md`'s own shape is unstated.

Closing artifact: one addendum with the name grammar, the `--name` default, the `proposal.json` keys and the sentinel resolution.

### 010-conversations — 17 files, 14 requirements — addendum plus design

`bots chat --json` prints a bare array, which violates the packet's own envelope precedent (`bots status --json` prints the whole `StatusReport` object at `bots.cjs:386-388`). The chat surface is user-facing and has no mockup. 010 is otherwise well planned: 25 concurrency mentions, a conversation record, a drain rule and a `conversationId` addition to two closed key lists.

Closing artifact: one addendum with the envelope conformance rule and a chat-surface mockup set.

### 011-messaging-channels — 29 files, 23 requirements — PHASE PARENT, six children

The only phase that must be split. It is the packet's largest by both measures, it carries nine modules and five transports, and it has four unshaped contracts: the `declaredCapabilities` vocabulary, the identity link record, the queue entry, and REQ-017's conformance rules (five promised, two enumerated). Its operator prerequisites are a table rather than a runbook.

The six children:

1. **Shared adapter and contract** — the adapter interface, `declaredCapabilities`, the link record, the queue entry, the conformance rule set. Hard prerequisite for the other five.
2. **Identity link and roster** — the link flow, `operators.json`, `channel-roster-missing`, `channel-roster-owner`.
3. **Approval index and queue** — the numbered-reply index, the send queue, `unknown` and no-retry.
4. **Telegram and Slack** — two transports against child 1's interface.
5. **Signal and WhatsApp** — the remaining two transports.
6. **Conformance and hardening** — the five conformance rules, the operator runbook, the fake-transport test suite.

### 012-manual-testing-scenarios — 13 files, 12 requirements — two rules

The 33-row inventory at `012/spec.md:140-170` is the packet's best traceability artifact: id, category, owning phase and the requirement line each scenario proves. The corpus is real, not prose. Two rules are missing: a recorded `FAIL` only has to be named, so the phase can close with 33 FAILs; and the results go stale because 014 fixes every P0 and P1 after 012 runs and nothing re-executes the corpus.

Closing artifact: two rules — a FAIL blocks close, and the corpus is re-executed after 014's fix pass.

### 013-skilled-and-doc-alignment — 8 files, 8 requirements — two rules

The phase names its two commands, their output paths, the clean criterion (`Open findings: 0`, `still_open` and `new` both 0) and a rebuttal file. Two rules are missing: the evidence lives under the state root outside the checkout, so the close cannot be re-verified; and the runtime findings it hands to 014 have no receiver, because 014's dependency list names only that 013 is clean.

Closing artifact: two rules — copy the reports into the packet, and name 014 as the receiver.

### 014-deep-review — 4 files, 10 requirements — two rules

The deepest plan in the packet: five named dimensions mapped onto four canonical ids, a five-part stop rule with the frontier veto and the strongest-restriction verdict, a roster with per-kind effort and enforced allowlists, a fallback order, a file-partitioned fix pass and a measured test floor. Two rules are missing: nothing says what happens when a host has fewer than five roster executors, and 012's `results.csv` is not a review input, so a PASS verdict can sit beside a recorded FAIL.

Closing artifact: two rules — an absent-executor rule and the corpus as a review input.

## 5. Cross-Phase Conflicts

| Conflict | Phases | Evidence | Resolution |
|---|---|---|---|
| The proposal sentinel | 005 vs 009 | `005/spec.md:265` says 009 adds no id of its own; `009/spec.md:164` uses `skill-proposals` and `:130` adds it to `RESERVED_BOT_IDS` | Pick one; 009's version needs 005's decision record amended |
| `kind` versus `grants.kind` | 005, 006, 009 | `006/spec.md:153` closes `grants.kind` to seven values; 005's `kind` is a different field with different values | The ownership table in the contract document |
| What a P2 is worth | 013 vs 014 | `013/spec.md:110` fixes every finding; `014/spec.md:103` excludes P2 fixes | State the policy once, in the contract document |
| The `--json` envelope | 001, 010 vs the CLI | `bots status --json` prints the whole object (`bots.cjs:386-388`); `chat --json` prints a bare array | One envelope rule in the contract document |
| The handoff with no receiver | 013 vs 014 | `013/spec.md:33` hands the reports to 014; `014/spec.md:44` names only that 013 is clean | Add the reports to 014's inputs |
| The corpus versus the verdict | 012 vs 014 | 012 can close with FAILs; 014's verdict never reads `results.csv` | Make the corpus a review input |

## 6. Parity Gaps

The packet's parity claims are sound where they are specific. The gaps are in the vocabulary the parity rests on:

- **`declaredCapabilities`** (011) has no defined value set, so a transport cannot declare what it supports and a conformance rule cannot check it.
- **The refusal vocabulary** is 25 typed entries in code and roughly 36 new names in the phases, with no document joining them.
- **The exit-code vocabulary** is six frozen values in code and fourteen phases restating bare numbers.
- **The schema-version vocabulary** does not exist at all.

## 7. Overbuild

Two places where the packet does more than the requirement earns:

- **014's five-lineage fan-out** is justified by the review contract, but the packet also forbids a second review after the fixes, so the five-lineage cost buys one read of a surface that then changes. Either the fan-out or the no-re-review rule should give.
- **013's unbounded fix pass** ("fix every finding either report names") has no severity filter and no cap, while 014 explicitly declines P2 fixes. 013 may spend effort on findings the packet's own closing phase would leave open.

## 8. Security

The two security-bearing phases are the packet's strongest and its weakest at once.

**Strong:** 007 names its refusals, narrows the dispatch environment to exactly one key through `dispatchEnvKeys`, writes a filtered config and restores the worktree after exit. 008 passes the secret on `security -i`'s stdin so it never enters argv, verifies every write by reading it back, records names and never values, scans `stdout.log` after the child exits, and accepts the same-user residual explicitly with a test that pins it.

**Weak:** 008's name grammar is undefined, so the loader's path join has no traversal guard; the env-key mapping is undefined, so a name can produce a malformed or colliding key; and the phase changes an existing field's meaning with no migration, so an operator upgrading finds every bot with a `secrets:` line refused. The store's boundary is the OS user, which the phase states honestly — but the index has no lock, so two `secret set` processes can lose an entry.

## 9. Failure Modes

| Failure | Where | Consequence |
|---|---|---|
| A builder invents the `secrets` name grammar | 008 | The env key, the path join and the refusal all diverge from the AC |
| A builder invents the skill-name grammar | 009 | The loader's traversal guard is whatever the builder chose |
| A new refusal name is not registered | 007-011 | Typecheck fails, or a cast defeats the class taxonomy |
| An old record meets a new field | all | No version field distinguishes them; only key presence does |
| Two `secret set` processes race | 008 | One entry is lost silently |
| A bot with a `secrets:` line upgrades | 008 | Refused `secret-unknown` exit 4 with no runbook |
| 012 records 33 FAILs | 012 | The phase closes anyway |
| 014 fixes break the reviewed surface | 014 | No re-review, no corpus re-run |
| A host lacks one roster executor | 014 | The fan-out cannot satisfy "no partition gap" |

## 10. Ranked Fix List

The ranked per-phase expansion plan. Rank 1 is the highest-leverage change.

| Rank | Target | Verdict | Closing artifact | Findings closed |
|---|---|---|---|---|
| 1 | 011-messaging-channels | **Phase parent, six children** | Child 1 (shared adapter and contract) first, then 2-5 in parallel, then 6 | 7 |
| 2 | Packet-level contract document | **New artifact** | Refusal catalogue with class and pre/post-dispatch kind, exit-code table, schema-version rule, single-writer map, record-ownership table, target-state module map and state-root tree | 15 |
| 3 | 008-vault | Addendum | Name grammar, env-key mapping table, index schema, migration runbook | 8 |
| 4 | 001-activity-and-actor | Addendum | Item lifecycle transition table, answer record schema | 3 |
| 5 | 002-routine-layer | Addendum | Routine state schema, `until` observation shape | 2 |
| 6 | 005-memory | Addendum | Memory entry grammar, prompt section order as a contract | 3 |
| 7 | 006-approval-grants | Addendum | Item and grant key ownership table | 3 |
| 8 | 009-skills | Addendum | Skill-name grammar, `--name` default, `proposal.json` keys, sentinel resolution | 5 |
| 9 | 010-conversations | Addendum plus design | Envelope conformance rule, chat-surface mockups | 3 |
| 10 | 012-manual-testing-scenarios | Two rules | FAIL blocks close, corpus re-run after 014 | 2 |
| 11 | 013-skilled-and-doc-alignment | Two rules | Reports copied into the packet, 014 named as receiver | 2 |
| 12 | 014-deep-review | Two rules | Absent-executor rule, corpus as review input | 2 |
| 13 | 007-per-bot-apps | Ready | None | 0 |
| 14 | 004-computer-exposure | Ready | None | 0 |

**Why this order.** 011 first because it is the largest and its children can be built in parallel once child 1 lands. The contract document second because it changes what every later addendum says — writing 001's lifecycle table before the version rule exists means writing it twice. 008 third because its P0s are the only ones that break existing operator state on upgrade. The six addenda next in dependency order. The three closing rules last, because they only bind once the build exists.

**Design artifacts.** Only 003 has them. 010 needs a chat-surface mockup set (message list, composer, bot message, parked-run indicator) and 011 needs a channel-message mockup set (approval card, numbered reply, link confirmation). The contract document should carry the target-state module map and the state-root tree, which the packet has nowhere.

**Reference code to study first.** 011: `tinychannels-main` for the transport adapter shape and `buzz-main` for the queue. 008: `rakazo-main` (`secret-matcher.ts`, `secrets-guard.ts`, `bot-secrets.md`) and `turnstone-main` (`oauth-storage.md`) for the store. 009: `OpenGhost-main` (`skills.js`) for the skill wrapper and `hermes-muse-main` (`skills/companion/references/memory.md`) for the proposal pin. 010: `openhuman-main` for the conversation surface. 001 and 006: `OpenBot-main` (`docs/approvals.md`) for the precedence ladder. 002: `OpenMausBot-main` for the routine layer.

## 11. Dropped or Downgraded

- **A child phase for 008, 009 or 010** — dropped. Each is one coherent module plus a seam; their gaps are missing contract text, not missing decomposition.
- **003's six-child shape as a packet-wide template** — dropped. 004, 007, 013 and 014 are smaller than 003's first child.
- **A fifteenth phase for the contract document** — dropped. It is an artifact the existing phases cite, not a build step.
- **014's "at least 381 tests" as a gap** — downgraded to nothing. It is a floor measured before the build.
- **The `--json` envelope as a per-phase problem** — downgraded to one contract rule after iteration 4 found the precedent is consistent and only `chat --json` departs from it.

## Eliminated Alternatives

| Alternative | Why it was eliminated | Evidence |
|---|---|---|
| Make every large phase a parent | Size alone does not justify a split; 009 at 25 files is one module family | iteration 7 |
| Make 008 a parent | 19 files are one store plus one injection path | iteration 6 |
| Make 012 a parent | One corpus, ten folders, one execution; it needs two rules, not children | iteration 7 |
| Make 013 a parent | Two command runs plus a fix pass | iteration 8 |
| Adopt a name grammar from reference code by citation | The phase cites rakazo for a length bound only, never for the grammar | iteration 6 |
| Cite an existing lock helper | The runtime has the atomic-rename convention but no exported lock | iteration 6 |
| Treat the packet as having no refusal discipline | It has a typed registry, a frozen exit-code object and a documented table | iteration 9 |
| Treat concurrency as unowned | 002, 005, 006, 010 and 011 each state their queue and lease rules | iteration 9 |
| Treat migration as entirely absent | 006's risk row and 008's default rule are real compatibility rules | iteration 9 |
| Read 014 as under-planned | It is the deepest plan in the packet | iteration 8 |
| Read 007 as under-planned | It names its refusals, its env key and its restore rule | iteration 6 |
| Read 012 as under-planned | It has a 33-row inventory with a requirement citation per row | iteration 7 |
| Treat the 381-test floor as a gap | It is a floor, so a larger suite still passes | iteration 8 |
| Look for a packet-level catalogue file | No file matches; the vocabulary lives in `runner.ts` and in prose | iteration 9 |
| Look for a state-root or record version field | Neither exists | iteration 9 |
| Look for design artifacts outside 003 | One match across 28 spec and plan files | iteration 10 |
| Look for a `kind` field on `NeedsYouItem` today | 005's REQ-009 introduces it | iteration 7 |
| Look for a skill-name grammar in `bot-check.cjs` | The checker has no name-grammar helper | iteration 7 |
| Look for 013's report folders in 014's inputs | 014's dependency list is five bullets and none names them | iteration 8 |
| Look for a host-capacity rule in the fan-out contract | The plan's fallback order covers preference, not absence | iteration 8 |

## Divergence Map

Where this lineage agrees with, extends, or corrects the packet's own research.

| Topic | Packet research says | This lineage says | Status |
|---|---|---|---|
| Shared records | The parent spec has an 11-row Shared Records table (`spec.md:120-140`) | The table exists and is the packet's best cross-phase artifact, but `RECORD_KEYS` has no owner row and the `kind` row contradicts its own rule | **Corrects** iteration 3's claim that no shared-record table exists |
| Fixture contract | The earlier research records a fixture-contract gap (`research/research.md:114-115`) | Confirmed and extended: 012's corpus is real but its results can be recorded as FAIL without blocking close | **Extends** |
| The `kind` collision | The earlier research records it (`research.md:577,589`) | Confirmed, and traced to a second conflict: 005's decision record versus 009's REQ-005 on the sentinel | **Extends** |
| 011's size | The packet plans 011 as one phase | 011 must become a parent with six children | **New** |
| The refusal catalogue | Not addressed | `REFUSAL_CAUSES` exists with 25 typed entries and no phase cites it | **New** |
| Schema versioning | Not addressed | No version field anywhere, while five phases edit closed key lists | **New** |
| Design artifacts | 003 has them | 010 and 011 have none, and they are user-facing | **New** |
| The closing phases | 012, 013 and 014 each planned as proof | None of the three can certify the build as specified | **New** |

## Open Questions

1. Whether the contract document lives in the parent packet beside the Shared Records table or in a new folder. This review recommends the parent packet.
2. Whether 011's six children are built in parallel or in order. Child 1 is a hard prerequisite for the other five.
3. Whether the operator accepts 008's same-user residual, which the phase states honestly and pins with a test.
4. Whether 014's five-lineage fan-out is worth its cost given that no second review follows the fixes.

## Convergence Report

- **Iterations:** 10 of 10 (`stopReason: maxIterationsReached`).
- **Key questions:** 5 asked, 5 answered, 0 open.
- **Findings:** 73 (13 P0, 46 P1, 14 P2).
- **Ruled-out directions:** 47.
- **Convergence score:** 0.80. The run reached the iteration cap rather than converging early, which was the configured stop policy; the last three iterations broadened the angle from per-phase review to the cross-cutting layer and then to the ranked plan, and each still produced new findings.
- **Frontier:** five nodes seeded, all answered, run-wide node cap reached, no proposals admitted after iteration 1.
- **Corruption:** 0 across all ten reducer passes.

## References

- `specs/system-skilled-bots/003-openbot-parity-build/spec.md` — the parent spec, its phase table and its Shared Records table
- `specs/system-skilled-bots/003-openbot-parity-build/0[01][0-9]-*/{spec,plan,tasks,acceptance-criteria,goal}.md` — the fourteen phases
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/` — the depth benchmark, its six children and its design folder
- `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:113-151` — `EXIT_CODES` and `REFUSAL_CAUSES`
- `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-143` — `HonoredPosture`, `RunExit`, `RefusalDetail`
- `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29-97` — the item shape and `ITEM_KEYS`
- `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` — the state root, with no version marker
- `.skilled/bin/bots.cjs:386-388` — the `bots status --json` envelope precedent
- `specs/system-skilled-bots/002-openbot-parity-research/research/` — the earlier research this review extends
- `iterations/iteration-001.md` … `iteration-010.md` — this lineage's evidence
