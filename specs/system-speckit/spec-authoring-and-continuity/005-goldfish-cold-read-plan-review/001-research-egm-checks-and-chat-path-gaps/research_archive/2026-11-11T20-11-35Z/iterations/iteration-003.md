# Iteration 3: Per-turn token cost per mechanism, and the single recommendation

## Focus

Q5 from the strategy `## 11. NEXT FOCUS`: *what is the per-turn token cost of each mechanism measured from file sizes, what should not be built, and which single mechanism is recommended.* Taken because the reducer's next-focus names it, and because it is the only question whose answer is the deliverable of the whole topic (`Rank them and recommend one, with the smallest set of changes to existing files`).

The question has three parts and they resolve in one order: price the five carriers per turn, drop the ones whose price or position disqualifies them, then pick from what is left and state the exact lines that change. Cost alone cannot decide it — iteration 2 established that the cheapest carrier (validator) is cheap precisely because it decides nothing a reader must judge — so the ranking below crosses price with the position in the work where the carrier can act.

This iteration also carried Q4's last outstanding half: does the proposed fix survive a dispatched child with no user present. That turned out to be answerable from the child-dispatch exemption's own wording, and it changes one requirement of the recommendation.

Scope: `AGENTS.md`, `spec-authoring-card.md` §6, `templates/core/plan.md.tmpl` §4, `validator-registry.json` (42 rules), `skill-advisor-hook.md`, `render.ts`, `speckit-implement.yaml`, `speckit-complete.yaml`. Tool-call budget respected: 11 calls (target 8-11).

## Actions Taken

1. Read `deep-research-config.json`, `deep-research-strategy.md`, the state JSONL (2 iteration records) and both prior iteration narratives to inherit findings 1-12 and the BLOCKED list before choosing an angle.
2. `wc -c -l` over the eight candidate carriers plus the two workflow YAMLs already measured, to get a byte/line price list.
3. Located the `AGENTS.md` gate inventory by heading (`GATE 1`..`GATE 6`), confirming six numbered gates and no seventh.
4. Dumped the 42-rule `validator-registry.json` schema (`rule_id`, `aliases`, `script_path`, `severity`, `category`, `description`) and every rule id, to test whether any rule anchors plan phases.
5. Measured the child-dispatch exemption and the "Plan before acting" bullet exactly.
6. Read `spec-authoring-card.md` §5-§6 and `plan.md.tmpl` §4 to compare the card's plan-shape acceptance with the template's existing FILL note.
7. Re-measured the hook brief ceiling (`SYSTEM_SKILL_ADVISOR_MAX_BRIEF_CHARS`, `MAX_TOKENS`) in `skill-advisor-hook.md` and the brief renderer in `render.ts`.
8. Cross-checked the advisor's runtime adapter list against `AGENTS.md` §9's runtime directory list.
9. Converted every measurement to characters (not bytes) so that `chars/4` is a defensible token estimate on files containing em-dashes and arrows.

## Findings

1. **The denominator is already paid, so an `AGENTS.md` mechanism is priced by its *added* text only.** `AGENTS.md` is 300 lines / 27,372 bytes / 27,194 characters — roughly 6,800 tokens resident in the prompt on every turn regardless of the mechanism. Any per-turn cost comparison that quotes the file's total is comparing the wrong thing; the marginal cost of a text mechanism is the delta of the text inserted, which is why finding 3's line-versus-block measurement is the deciding number. [SOURCE: AGENTS.md:1]

2. **The five carriers, priced in characters and tokens, all from `wc`/character counts taken this iteration.**

| Carrier | Measured | ~tokens | When it is in the prompt |
|---|---|---|---|
| `AGENTS.md` entire file | 27,194 chars | 6,800 | every turn (already paid) |
| `AGENTS.md:186` "Plan before acting" (whole bullet) | 119 chars | 30 | every turn |
| `AGENTS.md` one Gate-shaped block (Gate 5, 10 lines) | 978 chars | 245 | every turn |
| `AGENTS.md` Gate 3 block (14 lines) | 2,422 chars | 606 | every turn |
| `AGENTS.md` PLAN-WORKFLOW LOCK block (10 lines) | 953 chars | 238 | every turn |
| `spec-authoring-card.md` entire file | 9,699 chars | 2,425 | only when the card is loaded |
| `spec-authoring-card.md` §6 plan shape (111-124) | 803 chars | 200 | only when the card is loaded |
| `spec-authoring-card.md:123-124` acceptance+verify pair | 178 chars | 45 | only when the card is loaded |
| `templates/core/plan.md.tmpl:124` FILL note | 177 chars | 44 | once per packet, copied into `plan.md` |
| advisor brief, observed live in this dispatch | ~91 chars | ~23 | fired prompts only |
| advisor brief, hard ceiling (`MAX_BRIEF_CHARS` default 2 KiB) | 2,048 chars | 512 | fired prompts only |
| `validator-registry.json` (42 rules) | 15,641 bytes | 3,910 | never — CLI-side, 0 prompt tokens |
| `speckit-implement.yaml` | 60,098 bytes | 15,025 | per invocation |
| `speckit-complete.yaml` | 93,496 bytes | 23,374 | per invocation |

[SOURCE: AGENTS.md:186]
[SOURCE: AGENTS.md:91-100]
[SOURCE: AGENTS.md:72-85]
[SOURCE: AGENTS.md:20-29]
[SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:111-124]
[SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:124]
[SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:123]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1]
[INFERENCE: token counts are chars/4, the usual English-prose approximation; the two YAMLs and the registry are machine-formatted, so their tokens-per-byte is higher than prose and those three rows are lower bounds]

3. **Editing an existing line is ~8x cheaper per turn than adding a Gate-shaped block, for the same requirement.** A one-line amendment at `AGENTS.md:186` adds roughly 30-45 tokens every turn; a new numbered gate carrying the same requirement costs 245-606 tokens every turn, because a gate is a trigger line, an ordered procedure and a skip clause by construction. The frozen preference order ("prefer changing an existing line over a new file, hook, command or agent") is therefore also the cheapest instruction here, not merely the most conservative one. [SOURCE: AGENTS.md:186]
   [SOURCE: AGENTS.md:91-100]
   [INFERENCE: based on finding 2's measurements — the 8x multiple is 245/30 for the Gate 5-shaped block against the existing bullet]

4. **The validator mechanism has the only provably zero marginal per-turn cost, and it is the only mechanism that cannot stand before implementation.** Zero: its rules are read by the CLI, never by the model, so a new rule adds no prompt token at all. Disqualified as the primary: all 42 rules are decidable checks, `AC_CLOSURE` gates *closure* rather than the start of work, `FILE_EXISTS`/`LEVEL_MATCH`/`PLACEHOLDER_FILLED` check file shape, and nothing in the registry anchors a plan phase to a path or a proof command — the words plan, phase and task appear in rule descriptions only as file requirements. The validator cannot decide "a plan only its author can follow" and does not run at the moment that plan is acted on. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1]
   [SOURCE: AGENTS.md:138-144]
   [INFERENCE: based on the rule inventory dumped this iteration — 42 ids, none naming phase anchoring, and the chat path runs the validator at completion per the Completion Verification Rule]

5. **The hook's per-turn price is small and bounded, but its coverage is 6 runtimes of 7.** The brief is capped at 2,048 characters by default (`SYSTEM_SKILL_ADVISOR_MAX_BRIEF_CHARS`), the live brief in this dispatch measured ~91 characters, and per-session dedup suppresses re-delivery of an identical directive within its cadence — so the realistic cost is tens of tokens on the prompts where it fires and zero elsewhere. Its ceiling on reach: the maintained adapters are Claude, Codex, Cursor, Devin, Pi and the OpenCode plugin, six, while `AGENTS.md` §9 names seven runtime agent directories including `.dsh`. No `.dsh` advisor adapter is listed, so a hook-carried step does not reach that runtime at all; `AGENTS.md` reaches every runtime that reads an `AGENTS.md`. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:123]
   [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21]
   [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:40]
   [SOURCE: AGENTS.md:281]

6. **`AGENTS.md` is the only carrier this run can prove is present at the moment of the first edit, because it is present in this very dispatch.** The delivered prefix of this iteration's own prompt contains the full `AGENTS.md` framework text; it does not contain `SKILL.md`, `ROUTER.md` or the card, because those are loaded on demand. Whatever a gate needs to know before the first edit is therefore available without any load, in every runtime that carries the prefix, and the other four carriers each need a load, a fire or an invocation to reach the same position. [INFERENCE: observed in this dispatch's own delivered prefix — the framework block reproduces AGENTS.md including its numbered gates, while SKILL.md and the card arrived only via tool calls I made]
   [SOURCE: AGENTS.md:47]

7. **A child with no user present does *not* inherit sane behaviour from a new gate — the exemption names Gate 3 and an enumerated clause list.** `AI_SESSION_CHILD=1` pre-resolves Gate 3 and converts Law 4, Halt Conditions, Logic-Sync, Escalation and stop-for-yes to record-and-continue, and bars acting outside the lineage directory. That list is closed: a newly added gate that says "get a review verdict" would default to the interactive reading — ask and wait — with no user to answer, which is the exact failure the exemption exists to prevent. So any `AGENTS.md` addition must state its child behaviour in the same line. This closes Q4's last half: the fix is level-qualified (iteration 2) *and* child-qualified (here). [SOURCE: AGENTS.md:84]
   [INFERENCE: based on the exemption's enumeration — it lists the clauses it converts, and a gate added later is not among them]

8. **The smallest change set is two existing lines in two existing files, each carrying the half it owns.** `AGENTS.md:186` ("Plan before acting on multi-step work: name the files, the tools and the observable check before the first edit") is the only always-read line that already states a pre-edit obligation, so the sequencing half extends it: at Level 2+ on a spec-backed change, record a review verdict on the plan before the first implementation edit, and under `AI_SESSION_CHILD=1` record the verdict and continue. The card's acceptance+verify pair at `spec-authoring-card.md:123-124` is where plan *shape* is actually checked, so the anchoring half belongs there: each of the three phase lines names a repo-relative path or symbol and the command that proves it, at Level 2+, with a grep that can fail. Splitting the two halves by owner avoids the drift iteration 2 warned about — one requirement stated twice in two files. [SOURCE: AGENTS.md:186]
   [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:123-124]
   [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:113]
   [INFERENCE: based on iteration 1 finding 10 (the card's acceptance is heading presence plus a heading grep) and iteration 2 finding 12 (that section carries no level qualifier)]

9. **What should not be built, each with its disqualifying measurement.** A new write-gating hook: prompt-time only, six of seven runtimes, and a new hook concern — the frozen order's last resort (and a BLOCKED direction since iteration 2). A shared step reference file: a new file that costs a pointer line every turn plus roughly 256-512 tokens when loaded, and that restates a ladder the scorer already prints. Automatic command invocation when the advisor is confident: 15,025-23,374 tokens per invocation, plus 12 checkpoints in the default `confirm` mode that need a user to answer them — the mechanism cannot run unattended, which is also the case where it is needed. A new numbered Gate block: 8x the per-turn price of the existing-line edit for the same text. Another search for a hidden enforcer of the planning-gate ids: a confirmed absence across 42 validator rules and the whole `.skilled/` tree. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:8]
   [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:20]
   [SOURCE: AGENTS.md:138]

10. **Final ranking, and the recommendation: mechanism 1, carried by an existing line.** On the two axes that survived contact with the evidence — marginal prompt cost per turn, and whether the carrier is present at the moment a plan is acted on — the order is **M1 (`AGENTS.md` line, ~30-45 tok/turn, present everywhere, can carry a reader-decided verdict) > M4 (templates + `validate.sh`, 0 tok/turn but post-implementation and decidable-only) > M3 (hook, 0-512 tok, prompt-time only, 6/7 runtimes) > M2 (shared reference, pointer + 256-512, authority only when loaded) > M5 (invoke the command, 15k-23k per invocation, needs a user)**. Recommended: **M1 as a one-line amendment to `AGENTS.md:186`, with the shape half mirrored on the card's existing acceptance+verify pair at `spec-authoring-card.md:123-124`.** Two lines, two files that both paths already load, no new file, hook, command, agent, or numbered gate. M4 should follow as the decidable backstop, not lead. [SOURCE: AGENTS.md:186]
    [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:123-124]
    [INFERENCE: synthesis of findings 2-9; no new external evidence, and the ordering flips if a later iteration shows the reviewer verdict cannot be produced on the chat path without a load]

## Questions Answered

- **Q4** — *Where does a plan that only its author can follow get through on the chat path today, and what is the smallest change to an existing line that stops it.* Answered by findings 7-8 plus iteration 1 findings 9-10 and iteration 2 finding 12: it gets through at `spec-authoring-card.md:113` because §6's acceptance is "three phases in one line each" verified by a heading grep, and the smallest stopping change is two existing lines — `AGENTS.md:186` carrying the level-qualified, child-qualified pre-implementation verdict, and the card's 123-124 acceptance+verify pair carrying the phase anchoring.
- **Q5** — *What is the per-turn token cost of each mechanism measured from file sizes, what should not be built, and which single mechanism is recommended.* Answered by findings 2-6 and 9-10: the price table in finding 2, the disqualification list in finding 9, and mechanism 1 at ~30-45 tokens per turn with a two-line change set.

## Questions Remaining

- **Q2** — per-mechanism cost, breakage and cross-runtime / child-dispatch behaviour for all five mechanisms. Closer but not closed. This iteration supplies the cost axis for all five (finding 2), the child-dispatch rule that any `AGENTS.md` addition must state (finding 7), and one concrete cross-runtime gap (finding 5: six adapters against seven runtime directories). Still unevidenced: whether the `.dsh` and `.devin` runtimes deliver `AGENTS.md` as a prefix at all, and what each of the six hook adapters does with an injected step that contradicts card text already in context.

## Ruled Out

- **Comparing the mechanisms by total file size.** The denominator is paid before any mechanism is chosen — `AGENTS.md` is 6,800 tokens resident whether or not a gate is added — so a total-size comparison prices the file, not the change. Only the delta is comparable, which is why finding 3's line-versus-block measurement carries the answer.
- **Treating the observed 91-character advisor brief as the mechanism's cost.** It is one sample; the ceiling is 2,048 characters. Used the observed value only for the "what it actually costs when it fires" row and the ceiling for the bound.
- **Assuming a new gate inherits the child-dispatch exemption.** The exemption enumerates the clauses it converts; a later gate is outside that list. Recorded as a requirement of the recommendation rather than an assumption.

## Dead Ends

- **Looking for a validator rule that already anchors plan phases.** All 42 rule ids and descriptions were dumped; `FILE_EXISTS`, `LEVEL_MATCH`, `PLACEHOLDER_FILLED`, `SCAFFOLD_NEVER_TOUCHED`, `COMPLEXITY_MATCH` and `AC_CLOSURE` cover existence, level, placeholders, scaffold markers, content complexity and closure. None reads a phase line for a path or a proof command. Do not re-run this as a way of finding a hidden anchoring check.

## Edge Cases

- **Ambiguous input:** "per-turn token cost" can mean cost on every turn of a session, or cost on the turns where the mechanism actually acts. Chose both, reported as two columns (always-on versus on-use), because a single number would have hidden the whole finding: the cheapest mechanism by always-on cost (validator, 0) is the one that cannot act at the right moment, and the one that acts at the right moment is not the cheapest. Deferred: a whole-session cumulative cost model, which would need an average turn count the packet does not have.
- **Contradictory evidence:** none new. The two open contradictions from earlier iterations stand unresolved and untouched: the `[NEEDS CLARIFICATION]` marker (iteration 1 finding 4) and the three-versus-four Level-1 required-file lists (iteration 2 finding 4, resolved by qualifier). Both are recorded, neither is decided here, and per the run's no-operator instruction neither halts the iteration.
- **Missing dependencies:** `resource-map.md` still absent, so the coverage gate is skipped and source selection remains mine. No tool failures this iteration; every measurement command exited 0 and the two registry dumps that had failed in earlier iterations were fixed by reading the actual schema keys (`rule_id`, not `id`).
- **Partial success:** none. Q2 remains open by design — the cross-runtime delivery question needs evidence from runtime adapter code this iteration did not read, and claiming it closed would have converted an unread path into a finding.

## Sources Consulted

- `AGENTS.md` (1 whole file, 20-29 PLAN-WORKFLOW LOCK, 47 Gate 1, 72-85 Gate 3 + child exemption at 84, 91-100 Gate 5, 138-144 completion verification, 186 "Plan before acting", 281 runtime agent directories)
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` (105-126, notably 113 plan-shape acceptance and 123-124 acceptance+verify pair; whole file 208 lines / 9,699 chars)
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` (122-127, FILL note at 124; whole file 15,050 bytes)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` (all 42 rule ids, severities and categories)
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` (21 adapter inventory, 40 directive-lifecycle dedup, 123 brief ceilings and env overrides; whole file 20,648 bytes)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` (478, 544-601 brief rendering and fallback lines)
- `.skilled/commands/speckit/assets/speckit-implement.yaml` (1-24 modes and checkpoints; 60,098 bytes)
- `.skilled/commands/speckit/assets/speckit-complete.yaml` (93,496 bytes)
- `wc -c -l` over the eight carriers listed in finding 2, plus a per-line character count pass for the 14 rows in that table

## Assessment

- New information ratio: 0.85
- Questions addressed: Q5, Q4, Q2 (partial)
- Questions answered: Q5, Q4

## Reflection

- **What worked and why:** converting every measurement to *characters* rather than bytes before dividing by four. Both prior iterations quoted bytes; `AGENTS.md` contains 178 bytes of multi-byte characters, and the two YAMLs are machine-formatted, so a byte-based token estimate overstates prose and understates YAML. One `python3` pass that summed `len(line)` per range produced all 14 rows of finding 2 in a single call, which is what made the line-versus-block multiple (finding 3) visible at all — it is a ratio between two rows of the same table, and it only exists because both rows were measured the same way.
- **What did not work and why:** the first registry dump in this iteration printed `None` for every rule, because the earlier iterations' schema assumption (`id`) was carried forward instead of re-derived; the key is `rule_id`. Root cause: reusing a prior iteration's shape guess as if it were measured fact, when the registry had already cost two failed calls in iteration 1. Fixed by printing `list(d[0].keys())` first. The lesson is specific: when a file has already been mis-parsed once, print its keys before filtering on them.
- **What I would do differently:** price the *delta* first, not the *files*. Iterations 1 and 2 both produced a carrier price list, and both were close to unusable for the recommendation because they measured whole files; the deciding numbers are 119 characters for the line that exists and ~978 for the block that would have to be created. On a question that ends in "which one change do we make", the measurement to take first is the size of the change, and the file sizes are only its denominator.

## Next Focus (recommended)

**Q2, narrowed to one testable gap:** do the `devin` and `dsh` runtimes deliver `AGENTS.md` as a prompt prefix, and do the six advisor adapters pass an injected step through a message the model can act on mid-turn rather than only at prompt submit. Findings 5-7 make this the last unevidenced input to the ranking: if a runtime does not carry `AGENTS.md`, mechanism 1 silently degrades there and mechanism 3 must be the fallback for that runtime only. Concrete targets: `.skilled/skills/system-spec-kit/runtime/hooks/<runtime>/` (one shim per adapter), and `.dsh`/`.devin` config or docs for prefix delivery.

The `[NEEDS CLARIFICATION]` contradiction from iteration 1 stays open; it needs an operator decision about whether the marker is still live, and no operator is on this run.

## SCOPE VIOLATIONS

None. Two writes (this narrative, and `deltas/iter-003.jsonl`) plus one append-gateway invocation, all inside the resolved packet root. `research/research.md` was again **not** written despite `progressiveSynthesis: true`, because the dispatch's write allowlist enumerates only the iteration narrative and the delta file; progressive synthesis is deferred to the workflow rather than performed out of scope. No reducer-owned file was touched.
