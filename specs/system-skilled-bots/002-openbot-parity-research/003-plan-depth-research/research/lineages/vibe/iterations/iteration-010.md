# Iteration 10: The ranked per-phase expansion plan and the design artifacts the packet still needs

## Focus
The capstone: turn nine iterations of findings into one ranked plan. For each of the fourteen phases, decide whether it becomes a phase parent with children like 003, needs a contract addendum, or is ready; name the exact artifact that closes each gap; and settle which user-facing surfaces still need design artifacts.

## Actions Taken
1. Counted files-to-change and REQ rows per phase, and read each phase's `SPECKIT_LEVEL`, to rank by size rather than by impression.
2. Listed 003's child structure and its `design/` and `context/screenshots/` folders as the depth benchmark.
3. Grepped every phase spec and plan for design-artifact vocabulary (`mermaid`, `mockup`, `wireframe`, `sequence diagram`, `design/`): only 003 matches.
4. Consolidated the findings of iterations 1 to 9 into one ranked plan, checking each claim against the iteration that produced it.

## Findings

1. **P0 — 011-messaging-channels is the only phase that must become a parent, and it needs six children.** It is the packet's largest phase by both measures: 29 files to change and 23 requirements, at Level 2, with nine modules and five transports. The six children are (1) shared adapter and contract, (2) identity link and roster, (3) approval index and queue, (4) Telegram and Slack, (5) Signal and WhatsApp, (6) conformance and hardening. Iteration 2 also found that its `declaredCapabilities` vocabulary is missing, its link record and queue entry are unshaped, REQ-017 promises five conformance rules and enumerates two, and its operator prerequisites are a table rather than a runbook — all four are child-1 and child-6 work. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-002.md]

2. **P0 — one packet-level contract document closes more findings than any child phase.** It would carry six things the packet now scatters: the refusal catalogue (`REFUSAL_CAUSES`'s 25 entries plus each new name's `class` and its pre- or post-dispatch kind), the exit-code table (`EXIT_CODES`'s six values and which refusal takes which), the schema-version rule (a version field on the state root and on each closed-key record), the single-writer map (which files need a lock and which are last-writer-wins), the shared-record ownership table (the parent spec already has an 11-row one at `spec.md:120-140`), and the target-state module map with the state-root tree. That single artifact closes iteration 9's eight findings, iteration 1's three schema findings, iteration 3's two architecture findings and iteration 5's two ownership findings — fifteen findings for one document. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:123] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:120]

3. **P0 — 008-vault needs a contract addendum, not children.** Four artifacts close it: the `secrets` name grammar (referenced six times, defined nowhere), the `SKILLED_BOT_SECRET_<NAME>` mapping table (translation versus grammar restriction, and the collision rule), the store's index schema (`{entries: {<name>: {backend, createdAt, updatedAt}}}`, currently reconstructable only from an acceptance-criteria command), and the migration runbook (populate the store before upgrading, or every bot with a `secrets:` line stops with `secret-unknown` exit 4). Iteration 6 ruled out a parent for it: its 19 files are one store plus one injection path. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:150] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md]

4. **P1 — six phases need exactly one addendum artifact each.** 001: the needs-you item lifecycle transition table and the answer record's `by`/`scope` nullability. 002: the routine state file schema and the `until` observation shape. 005: the memory entry line grammar and the prompt section order promoted from `005/plan.md:71` into a contract. 006: the item and grant key ownership table, which resolves the `kind` versus `grants.kind` collision and gives `RECORD_KEYS` an owner row. 009: the skill-name grammar, the `--name` default, `proposal.json`'s key names and the 005-versus-009 sentinel contradiction. 010: `--json` envelope conformance against the `bots status --json` precedent and a chat-surface mockup set. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:71] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-001.md]

5. **P1 — the three closing phases need one rule each, not an addendum.** 012: a recorded `FAIL` blocks the phase's close, and the corpus is re-executed after 014's fix pass. 013: copy the two alignment reports into the packet so the zero-open-findings close is re-verifiable, and name 014 as the receiver of the runtime findings it hands over. 014: a rule for a host with fewer than five roster executors, and 012's `results.csv` as a review input so a PASS verdict cannot sit beside a recorded FAIL. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-008.md]

6. **P1 — only 003 has design artifacts; the two other user-facing surfaces have none.** 003 carries `001-ux-and-component-map/design/` and `context/screenshots/{products,web,openhuman-demo}`, and it is the only phase whose spec or plan matches any design-artifact vocabulary. 010 draws a chat surface and 011 draws channel messages — both are read by a person, both are specified only in prose, and neither has a mockup, a wireframe or a message-shape diagram. The operator asked for mockups for anything user-facing, so these two are the packet's remaining design gap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md]

7. **P2 — 007 and 004 are ready and need nothing.** 004 is the best one-shot-ready small phase in the packet: 12 files, 16 requirements, every refusal named, no open design decision. 007 has only P2 findings: its refusals, its `UTCP_CONFIG_FILE` handoff through `dispatchEnvKeys`, its filtered-config write and its worktree-restore rule are all pinned. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-003.md] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md]

8. **P1 — the ranked order is 011, then the contract document, then 008, then the six addenda, then the three closing rules, then nothing for 007 and 004.** 011 first because it is the largest and its six children can be built in parallel once child 1 lands. The contract document second because it changes what every later addendum says — writing 001's lifecycle table before the version rule exists means writing it twice. 008 third because its P0s are the only ones that break existing operator state on upgrade. The six addenda next, in dependency order 001, 002, 005, 006, 009, 010. The three closing rules last, because they only bind once the build exists. [INFERENCE: based on the file and requirement counts in Actions Taken 1, the P0/P1 distribution across iterations 1 to 9, and the dependency edges in the parent spec's phase table]

## Ruled Out
- Making 003's six-child shape the template for every phase. 003 is a Level 3 phase with a screen to draw; 004, 007, 013 and 014 are smaller than 003's first child and would be damaged by a split.
- Making 008, 009 or 010 a parent. Each is one coherent module plus one seam; their gaps are missing contract text, not missing decomposition.
- Treating the contract document as a fifteenth phase. It is an artifact the existing phases cite, not a build step, and giving it a phase would put a document in the build order.

## Dead Ends
- Looking for design artifacts outside 003: the grep over all 28 spec and plan files returns one match, so there is nothing to consolidate — the gap is total for 010 and 011.
- Looking for a phase whose size alone justifies a split: 009 at 25 files and 001 and 002 at 24 are large but each is one module family, and iteration 7 already ruled out a parent for 009.

## Edge Cases
- Ambiguous input: none. The ranking criteria are stated in finding 8.
- Contradictory evidence: none. Every claim in this iteration traces to an earlier iteration's cited finding.
- Missing dependencies: none.
- Partial success: none. All four research actions returned evidence.

## Questions Answered
- Which phases become parents? Only 011, with six children.
- Which single artifact closes the most findings? The packet-level contract document, at fifteen.
- What design artifacts remain? Chat mockups for 010 and channel-message mockups for 011; 003 already has its set.

## Questions Remaining
- Whether the operator wants the contract document to live in the parent packet or in a new phase folder; the plan recommends the parent packet, beside the existing Shared Records table.
- Whether 011's six children should be built in parallel or in the stated order; child 1 is a hard prerequisite for the other five.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/0*/spec.md and plan.md (all 14 phases, counted and grepped)
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/ (child structure, `design/`, `context/screenshots/`)
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:120-140
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:71
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:150
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:123
- iterations/iteration-001.md through iteration-009.md (this lineage)

## Assessment
- New information ratio: 0.80
- Questions addressed: the per-phase expansion verdict, the highest-leverage artifact, the remaining design gap, and the build order.
- Questions answered: all four.

## Reflection
- What worked and why: counting files and requirements per phase before ranking. The counts put 011 first and 004 last without argument, and they exposed that 003's Level 3 status is about a screen, not about size.
- What did not work and why: expecting the design-artifact gap to be partial. One grep over 28 files returned a single match, so the finding is total rather than a shortfall.
- What I would do differently: build the ranking table in iteration 1 and fill it as findings arrive. Nine iterations of findings had to be re-read to write this one, and a running table would have made the synthesis mechanical.

## Recommended Next Focus
Synthesis: the ranked plan, the eliminated alternatives, and the divergence map between this lineage's findings and the packet's own research.
