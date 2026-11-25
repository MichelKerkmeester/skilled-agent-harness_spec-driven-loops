# Iteration 12: The spec-edit list — 47 edits, grouped by the document that carries them

## Focus

Frontier node F-2-005 (depth 2), third pass: the spec-edit list. Every recorded finding already names its fix in prose; this iteration turns those into one edit per document so a builder can apply the whole review in a single pass without re-reading nine iteration files.

## Findings

1. **The edit list, grouped by document. Forty-seven edits across twelve documents; three are P0 and must land first.**

   **`spec.md` (parent) — 6 edits**
   - `:94` — amend Out of Scope: name 011 as the owner of `operators.json`, or move it into 001's Deliverables. **P0**
   - `:100` — "ten phases" → "eleven phases", and add 003 and 011 to the `bots.cjs` row.
   - `:127` — 009's Depends on cell: `001` → `001, 005`.
   - `:139` — add three Phase Transition Rules: (a) `runner.ts`, `.skilled/bin/bots.cjs` and `runtime/lib/README.md` are serial merge points; (b) the five shared records (`ITEM_KEYS`, `FRONTMATTER_KEYS`, `state-root.ts` folders, `HonoredPosture`, the actor name) each have one target list in this spec; (c) `executor-audit.ts` is a cross-skill write two phases share.
   - new row — the five `FRONTMATTER_KEYS` and the phase that adds each.
   - new row — the six `state-root.ts` folders and the 0700 mode each is created with.

   **`001-activity-and-actor/spec.md` — 3 edits**
   - add REQ — `bots answer` refuses an actor who is not the item's bot owner or a listed operator, naming the refusal. **P1**
   - add REQ — `activity --json` and `inbox --json` each carry a `schemaVersion`.
   - `:146` — no change; `by` on the answer and `actor` on the run record stay.

   **`002-routine-layer/spec.md` — 5 edits, plus 3 in `plan.md`**
   - `:160` REQ-001 — split the fourth part: `until` stays the prose outcome, a new `until_check` holds the command. **P0**
   - `:164` REQ-004 — run `until_check` in the run's `workDir`; record the helper's `detail`; ignore `[SILENT]`; raise one item after three consecutive non-zero exits.
   - `:165` REQ-006 — exclude `awaiting-decision` from the failure streak; count only `author`, `environment`, `hub` and `budget`.
   - add REQ — `routine-until-check-missing` refuses a routine whose `until` is prose and whose `until_check` is absent.
   - `plan.md:64,71` — pass the run's `workDir`, not `context.checkoutRoot`.
   - `plan.md:135` — correct the impact text: the helper does own a process group.
   - `plan.md:99` — the matrix axis becomes `until_check` (absent, met, not met, timed out, error).

   **`003-terminal-screen/spec.md` — 1 edit, plus 5 in `plan.md`**
   - `:165` REQ-005 — replace the six statuses with 001's seven group ids and one marker each.
   - `plan.md:65` — `activity.rs` becomes a marker table keyed by group id; no exit-code mapping.
   - `plan.md:41` — the DoR builds the empty crate before the phase, not as part of it.
   - `plan.md:89` — drop the `bots-tui` CI job; keep the two path entries.
   - `plan.md:116` — drop the exit-vocabulary test row.
   - `plan.md:31` — state the Rust toolchain as a prerequisite.

   **`004-computer-exposure/spec.md` — 1 edit**
   - `:147` REQ-006 — `SCHEMA_VERSION` stays `'3'`, not `'2'`, and the DoD prints `'3'`. **P0**

   **`005-memory/spec.md` — 3 edits, plus 1 in `plan.md`**
   - `:116` — rename the item's `kind` to `itemKind`; add `source` (run id plus file or URL) to the `proposal` object.
   - `:94` — wrap the memory block in a `<memory>` fence and state that fenced content is data.
   - add REQ — `bots inbox` prints the proposal's `source` on its line.
   - `plan.md:61` — the new `buildBotPrompt` input is optional with a default.

   **`006-approval-grants/spec.md` — 3 edits**
   - add REQ — either supply the store the three unreachable ladder rungs read, or cut the ladder to the one rung that can fire.
   - add REQ — `--scope always` persists beyond the item it answers, or the scope is renamed to say it does not.
   - add REQ — the channel approval path records the same scope the terminal path records.

   **`007-per-bot-apps/spec.md` — 2 edits, plus 1 in `plan.md`**
   - add REQ — the `apps:` allowlist is enforced against the child's own MCP config, not only the inherited environment.
   - add REQ — `assertDispatchEnvAllowed` still refuses an environment key matching neither the new allowance nor an existing one.
   - `plan.md:63` — `HonoredPosture.apps` lands with a schema bump, or with a `null` default that distinguishes absent from old.

   **`008-vault/spec.md` — 4 edits, plus 1 in `plan.md`**
   - `:115` — delete `secret-matcher.ts` from Files to Change.
   - `:164` — delete REQ-013.
   - `:99` — drop the matcher's `THIRD_PARTY_NOTICES.md` entry.
   - `:128` — delete `secret-matcher.vitest.ts`.
   - `plan.md:70` — add the refusal acceptance row for the widened filter.

   **`009-skills/spec.md` — 3 edits, plus 1 in `plan.md`**
   - Dependencies — add "Phase 005-memory, whose proposal item this phase's answer branch reads".
   - `:167` — wrap each skill block in `<skill name="…">` and state that fenced content is data.
   - add REQ — reduce the three hard checker invariants for one optional field to one.
   - `plan.md:65` — the `skills` input is optional with a default.

   **`010-conversations/spec.md` — 2 edits**
   - `:148` — wrap the transcript in `<transcript>` and state that fenced content is data.
   - `:150` — export `toConversationMessage` from `conversation.ts` so 011's sink has one adapter.

   **`011-messaging-channels/spec.md` — 5 edits, plus 3 in `plan.md`**
   - `:174` — the inbound shape becomes a transport envelope; the sink converts it to 010's record.
   - `:141` — `seen/` holds one marker file per message id and never the message text.
   - `:281` — `operators.json` ownership follows the parent's decision.
   - §3 — cut the transports to Telegram and terminal; move Slack, Signal and WhatsApp to Out of Scope.
   - add REQ — the approval path records the grant scope the reply names.
   - `plan.md:66` — `channel.ts` imports `conversation.ts`.
   - `plan.md:69` — fold `channel-queue.ts` into `request-queue.ts`'s seen-key marker.
   - `plan.md:102` — the matrix drops from five transports to two.

   **Every phase that edits `.skilled/bin/bots.cjs` — 1 edit each, 6 phases**
   - 001, 002, 005, 006, 008 and 009 each add a row to their Files to Change table: `.opencode/bin/bots.cjs` — copy the edited file — `diff -q` prints nothing.

2. **Nine of the 47 edits are a one-line change to a requirement row; the other 38 change a plan's module list, a DoD command or a table.** The nine are the cheapest and the highest-value: 004's `'2'`→`'3'`, 002's `until` split, 002's streak exclusion, 003's marker table, 005's `itemKind` rename, 009's dependency cell, the parent's `:94` and `:100`, and 011's `seen/` sentence. A builder with an hour should apply those nine first. [INFERENCE: from the edit list in finding 1]

3. **Three edits are deletions, and they are the only ones that reduce work.** `008-vault/spec.md:115,128,164` remove a module, its test file and its requirement. Every other edit adds a sentence, a row or a requirement. The review's net effect on the packet is growth, which is the honest outcome: the plans were under-specified in the places that matter and over-built in one place that does not. [INFERENCE: from finding 1]

4. **Two edits must land before any other, because the rest are applied against them.** The parent's `:139` Phase Transition Rules define the shared-record target lists that five other edits fill in, and 004's `:147` decides the schema version that 001's bump and 003's index read both depend on. Applying the other 45 first means applying them twice. [INFERENCE: from the dependency between the parent's rules and the per-phase edits]

5. **The edit list is complete for the 52 recorded findings and not for the packet.** A defect no iteration recorded has no edit here, and the review's coverage is bounded by what nine iterations read: every phase's `spec.md` and `plan.md`, the runtime's `lib/`, the parent spec, and the OpenBot reference docs. The `tasks.md` and `acceptance-criteria.md` files of each phase were read only where a finding needed them, so a defect that lives only in a task list would be missing. [INFERENCE: from the iteration record's Sources Consulted sections]

## Ruled Out

- **Grouping the edits by finding instead of by document.** A builder applies edits per file; grouping by finding would make them open twelve files 47 times.
- **Numbering the edits as a sequence.** Only two have an order (finding 4); the rest are independent, and a sequence would imply a dependency that is not there.
- **Proposing the edits as patches.** The review's non-goal is implementation; the list names the document, the line and the change, and stops there.

## Dead Ends

- **Looking for an edit that fixes two findings at once.** Only the parent's `:139` rule does, because it is the target list three other edits fill in.
- **Looking for a finding with no edit.** Every one of the 52 has a fix in its own text; the list is a regrouping, not a new analysis.

## Edge Cases

- **Ambiguous input:** "the exact spec edit" could mean a diff or a description. A description with the document and line is what a builder can apply without the review's context, so that is the form.
- **Contradictory evidence:** none new.
- **Missing dependencies:** none.
- **Partial success:** the list covers `spec.md` and `plan.md` edits. Where a finding's fix is a `tasks.md` or `acceptance-criteria.md` row, the edit names the requirement to add and leaves the row's placement to the builder.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/research/lineages/vibe-2/findings-registry.json` (52 `keyFindings`)
- `specs/system-skilled-bots/003-openbot-parity-build/research/lineages/vibe-2/iterations/iteration-001.md` through `iteration-011.md`
- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:94,100,127,139`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:160,164,165`, `plan.md:64,71,99,135`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:165`, `plan.md:31,41,65,89,116`
- `specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:94,116`, `plan.md:61`
- `specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:63`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:99,115,128,164`, `plan.md:70`
- `specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:167`, `plan.md:65`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148,150`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:141,174,281`, `plan.md:66,69,102`

## Assessment

- New information ratio: 0.35 (the list is a new artifact; the edits are regrouped from the 52 findings, and only the ordering claim and the deletion count are new)
- Questions addressed: F-2-005, third pass
- Questions answered: the spec-edit list

## Reflection

- **What worked and why:** grouping by document rather than by finding turned 52 findings into 47 edits, because several findings share a document and a line. A builder now opens each file once.
- **What did not work and why:** the first pass tried to keep the finding ids beside each edit, which made the list a cross-reference table rather than a work list. Dropping the ids and keeping the severity made it applicable.
- **What I would do differently:** record the target document and line in the delta's finding row from iteration 1. That would have made this iteration a query, the same lesson as iteration 10.

## Recommended Next Focus

The final build-readiness verdict: given the three P0s, the 31 P1s and the 17 P2s, can the eleven phases be built in order, and what must change first.
