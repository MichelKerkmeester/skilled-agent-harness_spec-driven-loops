# Iteration 10: The deliverable — every finding grouped by phase and ranked

## Focus

Frontier node F-1-004 (depth 1), deliverable pass: every finding recorded in iterations 1 through 9, grouped by the phase it belongs to and ranked by severity. This iteration adds no new external evidence; it regroups the packet's own 52 findings into the shape the research topic asks for and checks the grouping for gaps.

## Findings

1. **The packet holds 52 findings: 3 P0, 31 P1, 17 P2, and one ranked list that carries both severities.** The three P0s are phase 004's impossible Definition of Done, the `operators.json` parent/child contradiction, and phase 002's `until` field executed as a shell command. [INFERENCE: from `findings-registry.json`, 52 `keyFindings` entries, severity read from each finding's own text]

2. **The ranked list, worst first.** Each row names the phase, the finding, and what it blocks.

   | Rank | Sev | Phase | Finding | Blocks |
   |---|---|---|---|---|
   | 1 | P0 | 002 | `until` is prose in the reference and a shell command in the plan (`002-routine-layer/spec.md:164`, `plan.md:64`) | The routine layer's central mechanism, and it is an injection surface |
   | 2 | P0 | 004 | DoD requires `SCHEMA_VERSION = '2'` after 001 bumps it to `'3'` (`004-computer-exposure/spec.md:147`) | Phase 004 can never be marked done |
   | 3 | P0 | parent/011 | Parent forbids any child from building `operators.json`; 011 builds it and REQ-005 depends on it (`spec.md:94`, `011-messaging-channels/spec.md:281`) | Phase 011's approval path |
   | 4 | P1 | 006 | Three of the four ladder rungs can never fire (`006-approval-grants/spec.md`) | The approval ladder is one rung |
   | 5 | P1 | 007 | `apps:` is not an allowlist; the child's MCP config pins `UTCP_CONFIG_FILE` (`007-per-bot-apps/spec.md`) | The per-bot app boundary |
   | 6 | P1 | 002 | The fatigue rule counts a parked run as a failure (`002-routine-layer/spec.md:165`) | A bot that asks questions disables itself |
   | 7 | P1 | 001 | `bots answer` never checks who may answer (`001-activity-and-actor/spec.md`) | The small-team authority model |
   | 8 | P1 | 011 | Five transports where two suffice (`011-messaging-channels/plan.md:3`) | The largest single overbuild |
   | 9 | P1 | 011 | No row in the 002 ranked build order (`spec.md:119-131`) | The phase is unsized net-new scope |
   | 10 | P1 | 005/009/010 | No phase addresses prompt injection (`005-memory/spec.md:94`, `009-skills/spec.md:167`, `010-conversations/spec.md:148`) | Every prompt that carries loaded text |
   | 11 | P1 | 003 | `activity.rs` re-derives a status vocabulary 001 already emits (`003-terminal-screen/plan.md:65`) | The activity pane's correctness |
   | 12 | P1 | 003 | The DoR is circular: it requires a build of the crate the phase creates (`003-terminal-screen/plan.md:41`) | Phase 003 cannot start |
   | 13 | P1 | 009 | 009 depends on 005's proposal item but names only 001 (`009-skills/plan.md:67`) | The declared dependency graph |
   | 14 | P1 | 007/008 | Two phases widen the deep-loop's `assertDispatchEnvAllowed` with no refusal test (`executor-audit.ts:1508`) | The environment filter's security |
   | 15 | P1 | 010/011 | The two message shapes disagree on every field (`010-conversations/spec.md:150`, `011-messaging-channels/spec.md:174`) | The terminal transport's reuse |
   | 16 | P1 | 006/011 | A channel approval records no grant scope (`006-approval-grants/spec.md`, `011-messaging-channels/spec.md`) | One item, two records |
   | 17 | P1 | 005/006 | Two phases add a field called `kind` to a closed `ITEM_KEYS` (`needs-you.ts:51-98`) | The needs-you item's shape |
   | 18 | P1 | 005 | A memory proposal shows no provenance (`005-memory/spec.md:96,116`) | The confirmation screen's safety |
   | 19 | P1 | parent | Six phases edit `.skilled/bin/bots.cjs` without its `.opencode` mirror | The mirror's byte-identity gate |
   | 20 | P1 | parent | Three phases assume a two-word verb grammar `VERB_SPECS` lacks | Three verbs' parsing |
   | 21 | P1 | parent | Nine phases modify `runner.ts`, `bots.cjs` and `README.md` with no serial-order rule | Any parallel build |
   | 22 | P1 | parent | `buildBotPrompt` gains a positional input from three phases | Four phases' prompt tests |
   | 23 | P1 | parent | `HonoredPosture` gains fields with no schema bump | A reader cannot tell absent from old |
   | 24 | P1 | parent | The shared-host mode is deferred by every phase | A two-person team's queue |
   | 25 | P1 | 002/007/009 | Three plans have no runnable Definition of Ready | A builder cannot check the pre-state |
   | 26 | P2 | 008 | `secret-matcher.ts` buys one scan per value (`008-vault/plan.md:68`) | Nothing; it is pure cost |
   | 27 | P2 | 008 | Three lifted rakazo files for policy statable in a paragraph (`008-vault/spec.md:99`) | A third-party provenance obligation |
   | 28 | P2 | 009 | Three hard checker invariants for one optional field (`009-skills/spec.md`) | The checker's signal-to-noise |
   | 29 | P2 | 011 | `channel-queue.ts` re-implements the file queue (`011-messaging-channels/plan.md:69`) | A second queue with its own backoff |
   | 30 | P2 | 011 | `channel.ts` owns a second message record (`011-messaging-channels/plan.md:66`) | The translation no phase owns |
   | 31 | P2 | 011 | `seen/` holds an unstated payload (`011-messaging-channels/spec.md:141`) | A message body could land there |
   | 32 | P2 | 003 | The `bots-tui` CI job (`003-terminal-screen/plan.md:89`) | A second toolchain in CI |
   | 33 | P2 | 003 | A second toolchain with no sequencing (`003-terminal-screen/plan.md:31`) | The build's prerequisites |
   | 34 | P2 | 001 | Four `--json` surfaces with no version field | The screen's parsing |
   | 35 | P2 | 001 | The actor has three names: `by`, `actor`, `sender` | One concept, three spellings |
   | 36 | P2 | 002 | The dependency table's impact text contradicts the runtime (`002-routine-layer/plan.md:135`) | A reader's trust in the table |
   | 37 | P2 | 002 | The `[SILENT]` marker collides with the `until` outcome (`runner.ts:153`) | A check that prints it |
   | 38 | P2 | parent | `FRONTMATTER_KEYS` gains five keys with no final list | The parser's allowlist |
   | 39 | P2 | parent | `state-root.ts` gains six folders with no stated mode | Six folders' permissions |
   | 40 | P2 | parent | The parent's audit trail says "ten phases" and omits 003 and 011 from its `bots.cjs` row (`spec.md:100`) | A reader's count |

3. **Grouped by phase, the load is uneven and it points at the phases written last.** Phase 011 carries 9 findings, the parent and cross-phase set carries 12, phase 002 carries 9, phase 003 carries 5, and phases 004 and 010 carry 1 each. The two phases with the most findings are the two that were written against the most other phases: 011 depends on four phases and the parent set is where every shared-record conflict lands. [INFERENCE: from the grouping in finding 2]

4. **Only one phase is clean enough to build as written: phase 010.** Its single finding is the message-shape disagreement with 011, which is 011's defect as much as 010's, and its own requirements — the append-only file, the torn-line skip, the `@bot` parse, the transcript bound — match the runtime's existing shapes. [SOURCE: `010-conversations/spec.md:148-155`]

5. **The P0 count is three, not one, and two of the three are invisible to a single-phase review.** Phase 004's DoD contradiction only appears when 001's bump is read beside 004's requirement; the `operators.json` contradiction only appears when the parent's Out of Scope is read beside 011's Deliverables; and 002's `until` only appears when the OpenBot reference's definition is read beside the plan's use. Each is a cross-document defect, which is why eleven phases written alone each passed their own review. [INFERENCE: from findings 1-3 of this iteration and iterations 1, 9]

## Ruled Out

- **Ranking by phase order instead of severity.** A phase-ordered list would put 001 first and 002's P0 fourth, which buries the one defect that makes a phase's central mechanism unsafe.
- **Counting the corrected finding twice.** Iteration 2 corrected iteration 1's `channel-approval.ts` duplication finding; the registry holds the correction, so the ranking counts it once, at P2.
- **Treating the 17 P2s as one bucket.** They split into three kinds: pure cost (26, 27, 29, 30, 32), unstated contract (31, 34, 38, 39) and stale prose (36, 40). Only the second kind can become a P1 if a builder guesses.

## Dead Ends

- **Looking for a phase with zero findings.** None has zero; 010 has one and 004 has one, and both are cross-phase rather than internal.
- **Looking for a finding that no phase owns.** Every finding names a phase or the parent; none is unassigned.

## Edge Cases

- **Ambiguous input:** "grouped by phase and ranked" could mean two separate lists or one. The iteration gives both: finding 2 is the ranked list with the phase in a column, and finding 3 is the per-phase load.
- **Contradictory evidence:** none new. The registry's correction of iteration 1's finding 5 is applied, not re-litigated.
- **Missing dependencies:** none.
- **Partial success:** the ranking is by severity and then by what the finding blocks; it is not a cost estimate. A P1 that costs an hour and a P1 that costs a week rank together unless the finding's own text distinguishes them.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/research/lineages/vibe-2/findings-registry.json` (52 `keyFindings`)
- `specs/system-skilled-bots/003-openbot-parity-build/research/lineages/vibe-2/iterations/iteration-001.md` through `iteration-009.md`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148-155`
- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:94,100,119-131`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:164-165`
- `specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:281`

## Assessment

- New information ratio: 0.15 (no new external evidence; the grouping, the load distribution and the "only 010 is clean" conclusion are new, the 52 findings are not)
- Questions addressed: F-1-004, deliverable pass
- Questions answered: the deliverable's shape

## Reflection

- **What worked and why:** reading the registry rather than the iteration files gave the severity counts in one pass, because each finding's own text carries its severity. The iteration files would have needed nine reads.
- **What did not work and why:** the first grouping attempt keyed on the phase number in the finding's id, which is the iteration that found it, not the phase it is about. Reading the label text for a phase name was the correct key.
- **What I would do differently:** record the phase in the delta's finding row from iteration 1 onward. A `phase` field would have made this iteration a query instead of a reading pass.

## Recommended Next Focus

The cross-phase conflict list: the findings that name two phases, collected in one place with the resolution each needs.
