# Iteration 1: Cross-phase shared records (frontier node F-1-002)

**Iteration**: 1 of 13
**Focus**: Frontier node F-1-002 (depth 1, scope `specs/system-skilled-bots/003-openbot-parity-build/0*/spec.md`, `0*/plan.md`): do the phases agree on shared records and their exact shape (`by:` actor, needs-you grants, `operators.json` and roles, conversation JSONL, memory files, state-root layout, `HonoredPosture` fields)? List every conflict between two phases.

## Focus

Worked frontier node F-1-002: the shared records that two or more phase plans both read or write. The node's own scope names the record set, so the iteration compared the requirement tables, file tables and plans of all eleven phases against each other and against the current runtime. This is a review of plans, not new design research: every finding names the phase, the doc and line, the evidence, a severity and the exact edit that fixes it.

## Actions Taken

1. Read the phase inventory and per-file line counts for all eleven phases to establish the review surface.
2. Grepped `operators.json`, `HonoredPosture`, `state-root`, and `by:`/`actor` across all `spec.md` and `plan.md` files.
3. Read the requirement tables (`| REQ-` rows) of every phase to compare record shapes in one pass.
4. Read the parent `spec.md` phase map and §3 Out of Scope to test each phase's declared dependency and scope boundary.
5. Read the specific plan sections that own the conflicting records: `001/plan.md` (status-index schema), `004/plan.md` (status-index summary), `003/plan.md` (the screen's one write path), `006/plan.md` and `011/plan.md` (answer and approver paths).
6. Checked the runtime for the claimed pre-state: `SCHEMA_VERSION = '2'` at `status-index.ts:55`, and no `operators` reference anywhere in `runtime/lib/` or `bots.cjs`.

## Findings

1. **P1 — Phase 001 and phase 004 contradict each other on `SCHEMA_VERSION`, and both modify `status-index.ts`.** Phase 001's plan says the index "gains the `actor` column and a `SCHEMA_VERSION` bump" and its verify command expects `SCHEMA_VERSION = '3'` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:76]. Phase 004's plan instead requires that `SCHEMA_VERSION` "stays `'2'`" and its setup and file-table checks both assert `SCHEMA_VERSION = '2'` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:49] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:82] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147]. The runtime today holds `'2'` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55]. Because 001 lands first, 004's setup step and its verify command fail the moment 001 is built. **Exact edit**: in `004-computer-exposure/plan.md` replace both `SCHEMA_VERSION = '2'` assertions with `SCHEMA_VERSION = '3'` and add the sentence "phase 001 already bumped the index to 3; this phase adds JSON summary fields without a second bump"; alternatively, in `001-activity-and-actor/plan.md:60,76` drop the bump and carry `actor` as a JSON column the way 004 carries `RunSummary` fields.
2. **P1 — The terminal screen's "approve always" and "deny" keys cannot express phase 006's scope contract, so both silently record `once`.** Phase 003 binds `a` to answer `always` and `n` to answer `deny` as the answer text [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:166], and its plan says the binary's only write is `bots answer` with no option named [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:87] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:95]. Phase 006 records the grant scope from `--scope once|conversation|always|deny` and states that "an answer with no `--scope` records `once`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:149]. The result: pressing `a` writes answer text `always` but scope `once`; pressing `n` writes answer text `deny` but scope `once`, so a deny from the screen grants once. **Exact edit**: in `003-terminal-screen/spec.md` REQ-006 and REQ-009, and in `003-terminal-screen/plan.md` at the write path, change the write to `bots answer <id> <text> --scope once|always|deny`, and add a dependency row on 006's `--scope` flag to the plan's dependency table.
3. **P1 — The parent scope statement and phase 011 disagree about who builds `operators.json`.** The parent says "The rest of the small-team model (§12): two roles in one `operators.json` and a shared host at mode 0770. No child builds them; 001 lands the actor field alone" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:94]. Phase 011 lists "the `operators.json` roster" as a deliverable, adds it to `channel-link.ts`, and makes REQ-005 depend on `owner` or `members` in it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:59] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:133] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177]. Phase 011 documents the deviation in its own decisions section [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:281], so the two docs knowingly contradict each other. **Exact edit**: replace `spec.md:94` with "No child builds the shared-host 0770 mode; phase 011 lands the minimal two-role `operators.json` roster its channel approver check needs, and 001 lands the actor field alone", and add `operators.json` to the phase-map row 11 cell that currently lists only 001, 006, 008 and 010.
4. **P1 — `operators.json` has no write path in any phase.** Phase 011 lands the roster and makes it the sole authority for channel approvals, but its verb list is `bots channel list|link|unlink|send|listen|drain` — none of them adds or removes a roster member [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:59]. `bots channel link` writes the link record, not the roster, and the spec names no path, format or creation rule for the file. A second operator therefore cannot be added through any documented surface, and REQ-005's `members` list is unreachable for a real team. **Exact edit**: add a `bots channel roster add <actor> [--role owner|member]` and `bots channel roster remove <actor>` pair to phase 011's in-scope list and file table, with the roster at `<stateRoot>/<identity>/operators.json`; or, if the roster is intentionally hand-edited, name the exact path, the JSON shape and the creation rule in REQ-005 and add an acceptance criterion that a hand-written roster admits a second member.
5. **P2 — The bot-message `by` field is unspecified.** Phase 010 requires every message to carry `by` and says "A human message carries the addressed bot's id and the actor; a bot message carries the replying bot's id and the run id" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:150]. For a bot message the sentence names `botId` and `runId` but never says what `by` holds, so two implementers can write `null`, the bot id, or `bot:<id>` and both satisfy the text. Phase 001 defines `by` as the answer's actor and `actor` as the run record's field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:147], which gives no bot-message rule either. **Exact edit**: in `010-conversations/spec.md` REQ-003 add "a bot message carries `by: null` and a human message carries `by: <actor>`", or name `bot:<id>` if that is intended, and mirror the choice in the acceptance criteria.
6. **P2 — Phase numbering metadata stops at ten while an eleventh phase exists.** Phases 001 through 010 all declare `Phase N of 10`, and phase 010 declares `Successor | None` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:28] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:30], while phase 011 declares `11 of 11` and `Predecessor | 010-conversations` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:32] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:33]. The parent phase map already carries eleven rows, the last being `011-messaging-channels` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:131]. A reader who trusts the metadata believes 010 is terminal and never reads 011. **Exact edit**: change `of 10` to `of 11` in the metadata table of 001 through 010, and set 010's `Successor` to `011-messaging-channels`.

## Ruled Out

- **Treating `by` and `actor` as a naming conflict.** Phase 001 deliberately splits them: `by` on a needs-you answer, `actor` on a run record [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146-147]. That is two records with two fields, not one record with two names, so it was ruled out as a conflict. The bot-message gap in Finding 5 is the real residue.
- **Treating `HonoredPosture.apps` and `HonoredPosture.secretsUsed` as a conflict.** Phase 007 adds `apps` and explicitly leaves the validator unchanged [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:63]; phase 008 adds `secretsUsed` read as `[]` when absent [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:154]. Both edit the same interface but they are additive and ordered (007 before 008), so no conflict.
- **Treating the memory and vault state-root folders as a collision.** Phase 005 uses `memory/shared.md` and `memory/<bot-id>.md` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:49]; phase 008 uses the identity's `secrets` folder [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:84]. Different folders under the same root, both through `state-root.ts`, so no collision.

## Dead Ends

- Reading only `spec.md` files hides the `SCHEMA_VERSION` contradiction: 001's bump lives in `plan.md:60,76` and its spec never names the constant. A spec-only pass would have missed it. Not a dead end for the node, but a method note: plan file tables carry the verify commands that actually break.

## Edge Cases

- **Ambiguous input**: The node asks for "every conflict between two phases". The iteration interpreted that as every shared record named in the node's own scope list, and covered `by:`/actor, grants, `operators.json`, conversation JSONL and `HonoredPosture`. Memory files and state-root layout were checked only for collisions, not for full field-shape agreement. The node is therefore not answered yet, and no key question was ticked.
- **Contradictory evidence**: Finding 1 is a direct contradiction between two plans, both quoted with line numbers; the runtime confirms the pre-state (`'2'`) but cannot decide which phase's post-state is intended. Both claims are preserved; the fix is a documentation decision for the lead.
- **Missing dependencies**: `operators.json` has no runtime reference today (`rg -n "operators" runtime/lib/ bots.cjs` returned nothing), so phase 011's approver check has no pre-state to build on; recorded as Finding 4 rather than treated as a blocker.
- **Partial success**: All eleven requirement tables were read, but acceptance-criteria files were not cross-compared. That is deferred to a later iteration and named in Recommended Next Focus.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/spec.md:94, :131
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146-147
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60, :76
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:166
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:87, :95
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:49, :82
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:49
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:145, :149
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:63
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:154
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:84
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:28, :30, :150
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:32-33, :59, :133, :177, :281
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55
- `rg -n "operators" .skilled/skills/system-skilled-bots/runtime/lib/ .skilled/bin/bots.cjs` (no matches)
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: F-1-002 (cross-phase shared records)
- Questions answered: none fully — the conflict list is partial (memory-file and state-root field shapes and the acceptance-criteria comparison remain)

## Reflection

- **What worked and why**: Reading the `| REQ-` tables of all eleven phases in one pass, then following each shared record into its owning `plan.md`, found contradictions that neither spec alone exposes. The plan file tables are where the verify commands live, so that is where an order-dependent break becomes visible.
- **What did not work and why**: The first `by:` grep used an unquoted backtick pattern and the shell tried to execute it, which wasted a call and returned noise. Quoting the pattern and searching `by` with `actor` separately would have avoided it.
- **What I would do differently**: Check the acceptance-criteria files in the same pass as the specs, because a conflict that survives into an acceptance row is a build gate, not just prose.

## Recommended Next Focus

Work frontier node F-1-006 (failure modes) next, then return to F-1-002 for the records this iteration did not finish: the memory-file entry grammar against the run prompt, the state-root folder layout against every phase's file table, and whether each phase's `acceptance-criteria.md` encodes the same record contracts as its `spec.md`. Do not open with `Close F-1-002`: the node stays open until those are checked.
