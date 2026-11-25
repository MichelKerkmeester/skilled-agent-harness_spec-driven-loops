# Iteration 3: Parity gaps and overbuild — the verdict, and the two dead-rung defects it exposed

## Focus

Frontier node F-1-004 (depth 1), closing pass. Iterations 1 and 2 built the inventory and the overbuild test. This pass answers the node: the ranked list of what a small team still lacks after all eleven phases, the ranked list of what can be cut, and the two defects the verdict exposed in phase 006 and phase 007.

## Actions Taken

1. Read phase 006's ladder requirements and its Out of Scope block against the runtime's needs-you and answer path.
2. Read phase 007's Out of Scope block for the child-side confinement admission.
3. Read `answer.ts` for the concurrent-answer behaviour the approval phases depend on.
4. Read `status-index.ts` retention for the activity view's data lifetime.
5. Cross-checked the eight 002 parts against the eleven phases' In Scope blocks to confirm coverage.

## Findings

1. **Phase 006 builds a four-rung approval ladder in which three rungs can never fire, because no store supplies their inputs.** The phase says `approval-ladder.ts` "walks kinds, then rules, then auto-review, then extra vigilant, and lets the first rung that says ask decide" (`006-approval-grants/spec.md:96`), and then puts the inputs for rungs 2, 3 and 4 out of scope: "A rules store, an auto-review switch and an extra-vigilant switch — the ladder takes all three as inputs and no store supplies them yet" (`006-approval-grants/spec.md:103`). Only rung 1 (action kinds) can ever return `ask`, so three quarters of the ladder is unreachable code with its own tests. **Severity P1.** Fix: in `006-approval-grants/spec.md` §3, replace the four-rung ladder with "rung 1 (kinds) is built; rungs 2-4 are documented in `bots-run/references/approval-ladder.md` as the precedence order a later packet fills", and delete the three unreachable branches from REQ-002 and its acceptance rows.

2. **Phase 006's `--scope always` does not outlive the item it answers, so the scope name promises persistence the phase does not build.** The phase records the scope on the item and says "A saved rule that outlives its item — rung 2 has no store in this phase, so an `always` scope is recorded on the item and read by the resumed prompt, not by a later item" (`006-approval-grants/spec.md:104`). An operator who answers `always` will expect the next item of the same kind to be pre-approved, and it will not be. **Severity P1.** Fix: in `006-approval-grants/spec.md` §4, either rename the scope to `once|conversation|deny` and drop `always`, or add the rule store that makes `always` mean what it says; the rename is the smaller change and matches the phase's own Out of Scope.

3. **Phase 007's `apps:` allowlist is not an allowlist: the child's own MCP config pins `UTCP_CONFIG_FILE` and overrides the inherited value, which the phase admits.** The phase sets `UTCP_CONFIG_FILE` in the child environment to the run's filtered config (`007-per-bot-apps/spec.md:100`), then puts the override out of scope: "`.claude/mcp.json`, `.codex/config.toml`, `opencode.json` and `.cursor/mcp.json` each set `UTCP_CONFIG_FILE` to `.utcp_config.json` explicitly, and an explicit value in an MCP server block overrides the inherited one … this phase records what the runner wrote and honored rather than claiming the child is confined" (`007-per-bot-apps/spec.md:104`). A bot that declares `apps: []` can still reach every server in the repository config. **Severity P1.** Fix: in `007-per-bot-apps/spec.md` §3, either remove the four pins and update `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh:291` in the same phase, or rename the key to `appsAdvisory`, state in `bots-author/references/bot-definition.md` that it is a record and not a boundary, and drop the `apps-unknown-server` hard invariant to advisory because it cannot enforce reach.

4. **Parity verdict: all eight 002 parts are covered by the eleven phases, and the gaps that remain are inside parts, not missing parts.** Conversations → 010 and 011; Routines → 002; Memory → 005; Skills → 009; Apps → 007; Computer → 004; Approvals → 006; Activity → 001; plus the terminal screen → 003 and the vault → 008 (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:21-95`, `specs/system-skilled-bots/003-openbot-parity-build/spec.md:114-143`). The gaps that survive all eleven phases, ranked: (a) who may approve — no phase adds the `operators.json` check to `bots answer` (iteration 1 finding 4); (b) app reach — the allowlist is advisory (finding 3 above); (c) a shared host — every phase defers the 0770 mode (iteration 1 finding 8); (d) per-action policy inside the executor — deferred by 002 and again by 006 (`006-approval-grants/spec.md:105`); (e) memory provenance beyond the needs-you confirmation — 005 records `type`, `date`, `actor` and `source` but no review state (`005-memory/spec.md:97`); (f) skill recording from a demonstration — deferred by 009 (`009-skills/spec.md:167`); (g) conversation streaming and attachments — deferred by 010. **Severity P1 for (a)-(c), P2 for (d)-(g).** Fix: add (a), (b) and (c) as requirements to phases 006, 007 and 001 respectively; record (d)-(g) in the parent `spec.md` §3 Out of Scope with the phase that defers each, so the packet states its own limits.

5. **Overbuild verdict, ranked by build time saved: phase 011 is the only phase whose scope can be cut by more than a third without losing a 002 item.** The ranked cuts: (1) 011 to Telegram plus terminal, dropping Slack, Signal and WhatsApp (iteration 1 finding 2); (2) 011's `channel-queue.ts` rebuilt on the `request-queue.ts` primitive (iteration 2 finding 1); (3) 011's `channel-approval.ts` replaced by `sentMessageId` on the delivery entry (iteration 2 finding 2); (4) 006's ladder cut to one rung (finding 1 above); (5) 008's two unnecessary lifts (iteration 2 finding 4); (6) 009's third hard invariant (iteration 2 finding 5); (7) 003's ungated Rust CI job (iteration 2 finding 3). Phases 001, 002, 004, 005 and 010 have no cuttable surface: each adds one record field or one file and reuses an existing primitive. **Severity P1 for cuts 1-4, P2 for 5-7.** Fix: apply cuts 1-4 to the phase specs before the build starts; they remove roughly one phase of work and no 002 item.

## Verified Correct

- **Concurrent approvals from terminal and chat are already serialized.** `answer.ts` refuses a second answer that differs from the first with `item-answered-differently` (`answer.ts:84-85`), so a terminal answer and a chat answer cannot both land. Phase 011's channel path reuses that verb (`011-messaging-channels/spec.md:49`), so it inherits the guard. This closes one of the angle-4 questions before it is asked.
- **The activity view has data to read.** The status index keeps run rows and a retention report (`status-index.ts:143-151`), so phase 001's grouping reads a populated index rather than an empty one.

## Questions Answered

- "Parity gaps and overbuild: against OpenBot's eight parts and the 002 synthesis, what does a small team still lack after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime?" — answered. All eight parts are covered; the surviving gaps are the approval authority, app reach, the shared-host mode, and four deferred capabilities; the cuttable overbuild is concentrated in phase 011 and in phase 006's ladder.

## Questions Remaining

- Do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable here? (angle 1, admitted as F-2-005)
- Do the phases agree on the shared records, and is the build order sound? (angle 2, admitted as F-2-006 and F-2-009)
- Security and failure modes. (angle 4, admitted as F-2-007)
- Which planned surfaces duplicate the runtime or another phase, ranked by build time saved? (admitted as F-2-008; answered in substance by finding 5 above)

## Ruled Out

- **Treating the four deferred capabilities (d)-(g) as parity failures.** Each is deferred by name with a reason in its own phase, and 002's skip list already rules out the larger versions. They are limits to state, not gaps to close.
- **Cutting phase 003 entirely.** The operator decision of 2026-11-25 chose the Rust screen over a web page or a desktop app (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:157`), so the crate is authorised scope; only its CI job is cuttable.
- **Cutting phase 005's memory bound.** The 60-entry and 3,600-byte bound is OpenGhost's measured shape (`specs/system-skilled-bots/context/OpenGhost-main/memory.js:11`), not an invented one.

## Dead Ends

- **Looking for a phase that enforces app reach.** None does, and 007's own Out of Scope block is the proof; the gap cannot be closed by reading another phase.
- **Looking for a rule store in the runtime.** `needs-you.ts` holds items and answers, not standing rules, so 006's rung 2 has no substrate to read.

## Edge Cases

- **Ambiguous input:** "what is still missing" could include the deliberately skipped desktop shell and the skip list. This iteration excluded both, because the parent states them as out of scope (`spec.md:85-97`), and recorded the exclusion here.
- **Contradictory evidence:** phase 007 claims an allowlist in its In Scope block and admits it cannot confine the child in its Out of Scope block. Both are cited; finding 3 records the contradiction as a defect in the In Scope wording rather than resolving it in the phase's favour.
- **Missing dependencies:** none.
- **Partial success:** none.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96,103,104,105`
- `specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:100,104`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:97`
- `specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:167`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:49`
- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:85-97,114-143`
- `specs/system-skilled-bots/002-openbot-parity-research/research/research.md:21-95,157`
- `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts:61-93`
- `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:143-151`
- `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh:291`
- `specs/system-skilled-bots/context/OpenGhost-main/memory.js:11`

## Assessment

- New information ratio: 0.90 (4 fully new findings, 1 partially new because it consolidates iterations 1 and 2)
- Questions addressed: F-1-004 in full
- Questions answered: F-1-004

## Reflection

- **What worked and why:** writing the verdict forced the two dead-rung defects into view. Asking "which rung can actually fire" of phase 006 and "what does the child actually read" of phase 007 are questions the inventory and overbuild passes did not ask, because both phases describe their own limits in Out of Scope prose that reads as a design note rather than a defect.
- **What did not work and why:** the first two passes accepted each phase's In Scope wording at face value. Phase 007's "Add an `apps:` frontmatter key … and set `UTCP_CONFIG_FILE`" reads as enforcement until its Out of Scope block admits the override.
- **What I would do differently:** read every phase's Out of Scope block as a list of claims to test against the In Scope block, not as context. Three of this run's P1 findings came from that pairing.

## Recommended Next Focus

F-2-005, plan versus runtime: verify that the files, functions, records, fields and verbs each of the eleven plans names exist with the shapes it assumes, and that its test and verify commands are runnable in this checkout. Start with the Definition of Ready and Definition of Done blocks, because they are the only commands a builder runs before and after the work.
