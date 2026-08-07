# Iteration 12: Reproducible before/after cost model by runtime and block

## Focus

Built a reproducible scenario model from the measured packet baseline for Claude Code, Codex, Cursor, Devin, OpenCode, and Pi. The model separates first delivery, ordinary repeats, Gate-3-positive and Gate-3-negative turns, lifecycle replay after compaction/resume, provider cache billing, and Cursor configured versus observed delivery. It does not treat repository-native token estimates as exact provider tokens or transform counts as user turns.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority remained `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`; progressive synthesis is false, so `research.md` was not written.

## Measurement Basis and Formulas

Exact metrics are UTF-8 bytes / Unicode characters / UTF-16 units. Token values are repository-native estimates `E(x)=ceil(UTF16(x)/4)`, not tokenizer or billing counts. [SOURCE: iterations/iteration-003.md:9-14]

| Symbol / block | Exact measured value | Repository estimate |
|---|---:|---:|
| `D`, full directives fallback including label/separators | 763 B / 759 chars / 759 units | 190 |
| comment hygiene alone | 205 B / 203 chars / 203 units | 51 |
| governor alone | 290 B / 288 chars / 288 units | 72 |
| proof alone | 254 B / 254 chars / 254 units | 64 |
| `R`, representative route line (`806-D`) | 43 B / 43 chars / 43 units | 11 |
| `A=D+R`, representative advisor payload | 806 B / 802 chars / 802 units | 201 |
| `G`, Gate-3 question | 521 B / 521 chars / 521 units | 131 |
| `P`, Pi full dispatch directive | 554 B / 552 chars / 552 units | 138 |
| `P_c`, proposed compact Pi line | 130 B (candidate) | ~33 |
| `S`, representative SessionStart | 389 B / 383 chars / 383 units | 96 |

[SOURCE: iterations/iteration-003.md:18-32] [SOURCE: iterations/iteration-007.md:13-23]

The measured runtime composites include adapter separators: shared non-Gate `B=806 B/802 chars/E201`; shared Gate `B_G=1,328 B/1,324 chars/E331`; Pi non-Gate `B_P=1,362 B/1,356 chars/E339`; Pi Gate `B_PG=1,885 B/1,879 chars/E470`. Gate addition is 522 B in shared composites and 523 B in Pi because of separators. [SOURCE: iterations/iteration-003.md:34-45]

For `N` user turns, `g` Gate-positive turns in one unresolved epoch, `c` lifecycle replays after the first turn, and `q` OpenCode provider transforms per user turn:

- Baseline shared configured bytes: `N*806 + g*522 + c*389`.
- Baseline Pi implemented bytes: `N*1,362 + g*523 + c*389`.
- OpenCode baseline known component: `q*(N*806 + g*522) + L + C`, where `L` is emitted continuity bytes (`0..2,048 units per transform`) and `C` is the uncapped compiled-route line; no finite whole-total follows from source. [SOURCE: iterations/iteration-003.md:43-49] [SOURCE: iterations/iteration-006.md:19]
- Cursor observed prompt bytes: `0`; configured counterfactual uses the shared formulas. [SOURCE: iterations/iteration-003.md:36-45]

## Scenarios

All scenarios preserve a full first delivery and full replay after a verified resume/compaction boundary. They differ only in eligible ordinary repeats. `r` is the number of full lifecycle refreshes, including first delivery, so `r=1+c`.

1. **Conservative** — leave advisor/directives unchanged; deduplicate only identical Gate questions after the first open-epoch delivery. Pi remains full. Shared bytes: `N*806 + min(g,1)*522 + c*389`; Pi: `N*1,362 + min(g,1)*523 + c*389`. This removes only already-redundant Gate repeats. [SOURCE: iterations/iteration-005.md:3-8] [SOURCE: iterations/iteration-011.md:19]
2. **Recommended** — full advisor/directives at first delivery and each verified lifecycle replay; route-only `R=43 B` on other matched turns; true advisor abstention is zero only after independent guardrail placement exists; Gate emits once per open epoch; Pi uses `P_c=130 B` after its first/full replay. For an all-matched shared session: `r*806 + (N-r)*43 + min(g,r)*522`. Pi uses measured composite on full turns and an additive repeat approximation `R+P_c+4 separator bytes =177 B`, so `r*1,362 + (N-r)*177 + min(g,r)*523`. The 177-byte Pi repeat is a scenario value, not an executed render. [SOURCE: iterations/iteration-006.md:25-45] [SOURCE: iterations/iteration-007.md:17-23]
3. **Aggressive** — full first/replay only; byte-identical route repeats suppressed until route digest changes; directives live in durable/lifecycle and relevance-triggered channels; Gate emits once; Pi arbitration is tool-enforced with no recurring model-visible line. Shared: `r*806 + min(g,r)*522`; Pi: `r*1,362 + min(g,r)*523`. This is a ceiling on potential removal, not a safe implementation claim because behavioral receipts are missing. [SOURCE: iterations/iteration-011.md:11-23]

For any lane, percentage reduction is `100*(baseline-after)/baseline`. Savings for independent blocks are: route-only conversion `763 B/E190` per eligible advisor repeat (94.7% of representative advisor bytes); Gate epoch dedup `522 or 523 B` per eligible positive repeat after the first; Pi compact conversion about `424 B/~105 estimates` before separator effects. [SOURCE: iterations/iteration-010.md:25]

## Per-Runtime Results: 10-Turn Example

Assumptions: ten matched user turns, three Gate-positive turns in one open epoch, no compaction/resume (`N=10,g=3,c=0,r=1`), one provider transform per OpenCode turn (`q=1`), and no OpenCode continuity/compiled-route addition in the bounded row. Exact bytes are arithmetic over measured composites; estimates are arithmetic planning values and may differ by one from estimating the concatenated final string.

| Runtime | Baseline | Conservative | Recommended | Aggressive |
|---|---:|---:|---:|---:|
| Claude Code | 9,626 B / ~2,403 E | 8,582 B / ~2,141 E (10.8%) | 1,715 B / ~429 E (82.2%) | 1,328 B / ~332 E (86.2%) |
| Codex | 9,626 / ~2,403 | 8,582 / ~2,141 (10.8%) | 1,715 / ~429 (82.2%) | 1,328 / ~332 (86.2%) |
| Devin | 9,626 / ~2,403 | 8,582 / ~2,141 (10.8%) | 1,715 / ~429 (82.2%) | 1,328 / ~332 (86.2%) |
| Cursor, configured counterfactual | 9,626 / ~2,403 | 8,582 / ~2,141 (10.8%) | 1,715 / ~429 (82.2%) | 1,328 / ~332 (86.2%) |
| Cursor, observed tested build | 0 prompt bytes | 0 (no claimable saving) | 0 (no claimable saving) | 0 (no claimable saving) |
| Pi | 15,189 B / ~3,800 E | 14,143 B / ~3,538 E (6.9%) | 3,478 B / ~870 E (77.1%) | 1,885 B / ~472 E (87.6%) |
| OpenCode known bounded components, `q=1` | 9,626 / ~2,403 | 8,582 / ~2,141 (10.8%) | 1,715 / ~429 (82.2%) | 1,328 / ~332 (86.2%) |

OpenCode total is `table value + continuity + compiled-route`. With `q=2`, every baseline/after known-component value doubles unless message/transform dedup is implemented. The compiled line was measured at 74 B minimum, 77 B with one target, and 679 B with 20 synthetic targets, but is uncapped; percentage reductions for the whole OpenCode prompt are therefore a range, not a single defensible number. [SOURCE: iterations/iteration-006.md:19,27-37]

## Per-Runtime Results: 100-Turn Example

Assumptions: 100 matched turns, ten Gate-positive turns within one unresolved epoch, two lifecycle refreshes after the first (`N=100,g=10,c=2,r=3`), and the representative `S=389 B` lifecycle payload added to every lane. OpenCode again uses `q=1,L=C=0` for its known-component row.

| Runtime | Baseline incl. 2 lifecycle replays | Conservative | Recommended | Aggressive |
|---|---:|---:|---:|---:|
| Claude/Codex/Devin/configured Cursor | 86,598 B | 81,900 B (5.4%) | 8,933 B (89.7%) | 4,762 B (94.5%) |
| observed Cursor | 778 B lifecycle only; prompt lane 0 | 778 B | 778 B | 778 B |
| Pi | 142,208 B | 137,501 B (3.3%) | 23,602 B (83.4%) | 6,433 B (95.5%) |
| OpenCode known components, `q=1` | 85,820 B prompt-transform components; no one-shot `S` equivalent | 81,122 B (5.5%) | 8,155 B (90.5%) | 3,984 B (95.4%) |

Arithmetic receipts: shared baseline `100*806 + 10*522 + 2*389=86,598`; recommended `3*806 + 97*43 + 3*522 + 2*389=8,933`; aggressive `3*806+3*522+778=4,762`. Pi recommended is `3*1,362+97*177+3*523+778=23,602`. Full advisor replay and SessionStart are distinct costs, so both appear at lifecycle boundaries. [INFERENCE: direct substitution into the stated formulas]

## Turn-Class Matrix

| Turn class | Baseline | Conservative | Recommended | Aggressive |
|---|---|---|---|---|
| First matched turn | full `A`; Pi full `P`; `G` if triggered | same | same | same |
| Repeated matched, non-Gate | full `A`; Pi full `P` | same | route-only; Pi compact | zero until route/relevance change |
| Repeated true abstention/non-match | `D=763 B`; Pi also `P` | same | zero advisor after independent directive placement; Pi compact | zero |
| First Gate-positive in epoch | add `G` | add `G` | add `G` | add `G` |
| Later identical Gate-positive | add `G` | zero | zero | zero |
| Non-triggered Gate turn | zero Gate bytes | zero | zero | zero |
| After verified compact/resume | lifecycle `S` plus full policy replay as host supports | same | full replay; reset delivery hash | full replay; reset delivery hash |
| Unknown/corrupt delivery state | baseline emit | emit | emit, never suppress | emit, never suppress |

[SOURCE: iterations/iteration-005.md] [SOURCE: iterations/iteration-009.md] [SOURCE: iterations/iteration-011.md]

## Cache-Hit Billed-Input Effects

Provider caching and model-visible dedup are separate axes. If a provider reports cached-input billing multiplier `m` for a stable prefix (`0<=m<=1`), billed-token-equivalent cost is `uncached_tokens + m*cached_tokens`; savings from caching are `(1-m)*cached_tokens`. The packet has no runtime/provider usage receipts, cache-hit rates, or exposed cache-control proof, so no numeric `m`, dollar saving, or hit rate is asserted. The small blocks also do not independently meet documented provider cache minima; a hit is possible only as part of a longer identical prefix. [SOURCE: iterations/iteration-008.md:11-31]

Example, explicitly hypothetical: if the 190-estimate directive capsule is inside an eligible stable prefix and a provider reports `m=0.1`, ten visible repeats still consume semantic context but their billed-input equivalent for that block is `10*190*0.1=190` rather than `1,900`. Model-visible dedup would instead remove repeat context and cost; it must replay after compaction. Do not add cache and dedup savings twice for the same removed tokens. [INFERENCE: formula illustration only; `m=0.1` is not a measured runtime fact]

## Findings

1. **The dominant deterministic saving is the 763-byte directive capsule, not routing.** Route-only recurring delivery reduces the representative 806-byte advisor block by 94.7%, while preserving the 43-byte current route signal. Over ten all-matched turns with one full delivery, advisor bytes fall from 8,060 to 1,193, saving 6,867 B (85.2% across the ten-turn block); over 100 turns with three full lifecycle deliveries, they fall from 80,600 to 6,589, saving 74,011 B (91.8%). [SOURCE: iterations/iteration-003.md:18-30] [INFERENCE: `806+(N-1)*43` and `3*806+97*43`]
2. **Gate savings depend on the unresolved-positive distribution, not total turns.** The exact saving is `G_composite*(g-epochs)`: zero for non-triggered turns and satisfied/skipped sessions, 1,044 B for three positives in one shared-runtime epoch, and 4,698 B for ten positives. This makes conservative percentage savings shrink in long sessions when Gate-positive repeats are rare. [SOURCE: iterations/iteration-005.md:3-8] [INFERENCE: measured composite arithmetic]
3. **Pi has an additional large recurring surface.** Recommended split placement changes the full 554-byte directive to a 130-byte candidate after full delivery; combined with route-only advisor delivery it takes the modeled ordinary matched repeat from 1,362 B to about 177 B. Exact final bytes require executing the new serializer because separator placement is not yet implemented. [SOURCE: iterations/iteration-007.md:17-23] [INFERENCE: `43+130+4` scenario composition]
4. **Cursor must retain two budgets.** Its source-configured counterfactual equals the shared lanes, but the tested build observed zero prompt-hook delivery. Reporting the configured reduction as realized Cursor saving would be false; only lifecycle bytes are observed. [SOURCE: iterations/iteration-003.md:36-45]
5. **OpenCode cannot have one per-turn total without transform telemetry.** Known advisor/Gate components scale by provider transforms `q`, continuity is `0..2,048` units per transform, and compiled routing has no finite maximum. A per-user-turn percentage is valid only after fixing `q,L,C`; otherwise report the formula and bounded component. [SOURCE: iterations/iteration-003.md:43-49] [SOURCE: iterations/iteration-006.md:19]
6. **Compaction/resume is a cost reset, not a free continuation.** Recommended/aggressive delivery state must re-emit a full capsule on each verified lifecycle boundary; if the runtime lacks a trustworthy signal, it must remain on conservative repeat delivery. Claude and Pi expose useful lifecycle events, Codex needs pinned receipts, Cursor/Devin remain incomplete, and OpenCode is transform-based. [SOURCE: iterations/iteration-009.md]
7. **Cache-hit savings cannot replace prompt-size savings.** Caching may reduce billed prefill for a sufficiently long stable prefix but leaves instructions model-visible and does not prove survival after host compaction. The cost model therefore reports prompt bytes/estimates first and parameterizes billed input by observed provider metrics only. [SOURCE: iterations/iteration-008.md]

## Ruled Out

- Exact provider-token, dollar, or latency claims from `ceil(UTF16/4)` estimates.
- Charging Cursor's configured prompt payload as observed cost.
- Treating one OpenCode transform as one user turn without telemetry.
- Assigning a finite OpenCode whole-payload ceiling while compiled targets remain uncapped.
- Counting provider cache hits as semantic/model-visible deduplication.
- Suppressing policy across compaction/resume without a verified replay signal.
- Presenting the aggressive scenario as guardrail-safe before behavioral receipts.

## Dead Ends

- More arithmetic cannot resolve missing provider tokenizer/cache receipts, Cursor prompt delivery, OpenCode transform counts, or post-compaction behavioral preservation. Those require instrumented runtime evidence rather than another source-only cost pass.

## Edge Cases

- Ambiguous input: “per turn” differs for OpenCode provider transforms and lifecycle events; formulas retain `q` and `c` rather than hiding them.
- Contradictory evidence: Cursor configuration and observed execution disagree; both lanes are retained.
- Missing dependencies: exact runtime tokenizer counts, billed cache telemetry, OpenCode `q/L/C`, and six-runtime post-compaction receipts.
- Partial success: fixed-block and configured composite arithmetic is reproducible; provider billing and several observed-runtime totals remain ranges or unknowns.

## Negative Knowledge

- No measured cache-hit rate, cache billing multiplier, provider request envelope, or exact tokenizer count exists in this lineage.
- No evidence makes the 130-byte Pi candidate an executed exact composite; 177 B is modeled.
- No evidence supports zero-cost policy after compaction without replay.
- No finite OpenCode whole-turn maximum exists while compiled targets are uncapped.
- No observed Cursor prompt cost supports a realized-savings claim.
- No scenario percentage is a compliance/effectiveness result.

## Sources Consulted

- `iterations/iteration-001.md` through `iterations/iteration-011.md`
- `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-215`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103-119,882-1058`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:176-223,303-364`
- `.pi/extensions/prompt-advisor.ts:49-106`
- `.opencode/plugins/mk-skill-advisor.js:785-855`
- `.opencode/plugins/mk-spec-memory.js:477-505`

## Assessment

- New information ratio: 0.79 (`5 fully new cost-model findings + 0.5*3 scenario refinements = 6.5/8 = 0.8125`, reduced to 0.79 for dependence on prior measurements; no simplicity bonus).
- Novelty justification: The iteration converts prior block measurements into explicit scenario formulas, six-runtime totals, turn-class/lifecycle separation, cumulative examples, and parameterized cache billing while preserving unknown lanes.
- Questions addressed: What is the measured before/after cost by block, runtime, turn class, lifecycle, and cache condition?
- Questions answered: Reproducible configured and known-component cost models are established; exact provider billing and incomplete observed-runtime lanes remain open.

## Reflection

- What worked and why: using measured composites for adapter separators and symbols for unknown transform/lifecycle frequency kept arithmetic reproducible without inventing runtime precision.
- What did not work and why: source evidence cannot supply provider cache receipts, exact tokenizer counts, or behavioral compliance after suppression.
- What I would do differently: implement a packet-approved calculator fixture in the implementation phase so tables are generated and arithmetic corrections cannot drift from formulas.

## Recommended Next Focus

Run instrumented receipts for Claude, Codex, Devin, Pi, and OpenCode across first/repeat/Gate/non-Gate/resume/compact cases, recording exact emitted bytes, provider input/cached-token fields, and OpenCode transforms per user turn. Re-probe Cursor on a pinned current build. Use those receipts to replace configured/parameterized rows before final ranking.
