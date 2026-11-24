# Iteration 9: Cross-part coupling — what the apps and computer decisions touch

## Focus

Broadening pass. The frontier is drained, so this iteration asks the question the previous eight imply but never test: if skilled bots adds a secret store, a connector registry and a run-folder working directory, **which other parts of the product have to change**, and which can stay untouched. The angle is coupling, not design — the design is settled, and the risk now is that a store is added in a place the status index, the needs-you path or the run record cannot see.

## Actions Taken

1. Read `NeedsYouItem`'s full field list.
2. Read the status index's schema for every table and column.
3. Read `DELIVERY_CHANNELS` and its acknowledgement map.
4. Grepped the whole skill for memory, and read `FRONTMATTER_KEYS`.

## Findings

1. `NeedsYouItem` has **no field for what a run was granted**: it carries `id`, `runId`, `botId`, `identity`, `question`, `options`, `createdAt`, `expiresAt`, `evidence`, `prompt`, `specFolder`, `answer` and `resumeRequestId`. An approval therefore cannot say "this run wants to use github". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1]
2. The status index has **six tables** — `meta`, `generations`, `runs`, `deliveries`, `items`, `retired` — and **none has a column for a grant, a secret name or an app**. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:165]
3. `runs` carries `summary` as a `NOT NULL` text, so the activity feed's per-run line is **already a single string the runner writes** — a grant summary can ride there without a schema change. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:167]
4. `DELIVERY_CHANNELS` is **`['desktop']`**, and `desktop` is the one channel that does not acknowledge (`CHANNEL_ACKNOWLEDGES: { desktop: false }`). The only delivery channel is the one that cannot confirm. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45]
5. There is **no memory anywhere in the runtime**: a case-insensitive grep for `memory` across the skill matches only `node_modules` and one line of `bots-author/SKILL.md`. Memory today is the agent's context files and the spec-kit, not a store. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/]
6. `RunRecord` has **nine top-level blocks** — `identity`, `request`, `dispatch`, `budget`, `posture`, `exit`, `evidence`, `delivery` — and `posture` is the only one that describes what the run was *allowed* to do, so `apps` and `secretsUsed` belong there and nowhere else. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:1]
7. `FRONTMATTER_KEYS` is a **closed set of twelve keys**, and an unknown key is a hard refusal (`unknown-key`), so `apps` is a deliberate thirteenth entry rather than a free addition. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92]
8. The git-hook trigger is **opt-in and off by default**: "Opt-in for git-hook triggers; off unless the repository says so." A routine that starts on a pull request therefore needs the repository to say so first. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts:50]
9. **Only one of the three stores needs a schema change**: the needs-you item needs a `grants` field so an approval can name what it is approving. The secret store and the connector registry need no index change, because their names can ride in `runs.summary` and `posture`. [INFERENCE: from findings 1, 2, 3 and 6]
10. **Memory is the part with no coupling at all**, because it does not exist: adding it later touches nothing that exists today, which is why it should be last rather than first. [INFERENCE: from finding 5]

## The coupling table

| New store | Approvals | Activity | Routines | Memory |
| --- | --- | --- | --- | --- |
| **Secrets** | needs a `grants` field on the item | rides `posture.secretsUsed` | none | none |
| **Connections** | needs the same `grants` field | rides `posture.apps` | a PR-start routine needs the git hook enabled | none |
| **Run folder as cwd** | none | `runs.summary` already carries the line | none | none |

## Ruled Out

- Adding a `grants` table to the status index: the index is a projection of files, and a grant is already in the run record, so a table would be a second source of truth for the same fact.
- A new delivery channel for approvals: `desktop` is the only channel and it does not acknowledge, so the honest move is to fix the acknowledgement rather than add a channel.
- Building memory now: it couples to nothing, so it can be added at any time and should be added last.

## Dead Ends

- Looking for a memory module under a different name (`context`, `notes`, `knowledge`): the runtime has none. The nearest thing is the spec-kit's own packet documents, which are per-spec rather than per-bot.

## Edge Cases

- Ambiguous input: "coupling" could mean data coupling or scheduling coupling. Selected interpretation: data coupling first (which store is read by which part), with scheduling noted only where it changes a decision.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-40
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:165-200
- .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45-50
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:1-30
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92-107
- .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts:50
- .skilled/skills/system-skilled-bots/ (grep for memory)

## Assessment

- New information ratio: 0.8
- Questions addressed: which other parts the three stores touch, and which need a schema change
- Questions answered: which other parts the three stores touch, and which need a schema change

## Reflection

- What worked and why: reading the *schema* rather than the code. Six `CREATE TABLE` statements answer "what can the product already see" in one screen, and the answer — nothing about grants — is the whole coupling finding.
- What did not work and why: expecting memory to be a module with a different name. It is genuinely absent, and the absence is the finding: memory is the one part of the eight with no coupling, which makes it the safest thing to defer.
- What I would do differently: check `DELIVERY_CHANNELS` before designing any approval flow. A single non-acknowledging channel is a constraint on every design that ends in "tell the operator", and it was invisible until this iteration.

## Recommended Next Focus

The terminal verdict for the apps and computer slice: given a single non-acknowledging delivery channel, no memory store and a run folder that is evidence rather than a workspace, can a CLI give the OpenBot app experience for this slice, and what exactly would a desktop shell add?
