# Iteration 15: Final evidence matrix closure and preliminary reduction ranking

## Focus

Closed the pre-synthesis evidence matrix for every requested injected block and all six runtimes. This pass reconciles iteration 12's quantitative scenarios with iteration 14's corrections, resolves contradictions where static evidence permits, preserves the remaining empirical gaps, and produces a preliminary rank by prompt-byte saving, guardrail risk, runtime coverage, and evidence confidence. “Rank” means implementation/evaluation priority, not authorization to activate suppression without the named receipts. Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority remained `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`; progressive synthesis is false, so no `research.md` was written.

## Findings

1. **The requested evidence matrix is complete at the source/configured-cost level for all named blocks and all six runtimes.** Named blocks are: advisor route, comment-hygiene, governor, proof-over-appearance, Gate-3 question, Pi-only dispatch directive, SessionStart/continuity, and OpenCode's additive compiled-route summary. Claude Code, Codex, Cursor, Devin, OpenCode, and Pi each have an owner/lifecycle/configured-or-observed lane; OpenCode additionally has independent transform producers outside the named audit, so the named inventory is complete but a whole-prompt claim is not. [SOURCE: iterations/iteration-001.md: Findings 1-6] [SOURCE: iterations/iteration-002.md: Findings 1-7] [SOURCE: iterations/iteration-014.md: Findings 6]

2. **The exact fixed-block baseline remains defensible after the skeptical audit.** The measured values are `D=763 B` for the full directive fallback, split as comment hygiene `205 B`, governor `290 B`, and proof `254 B` plus label/separators; representative route `R=43 B`; representative advisor `A=806 B`; Gate question `G=521 B` (`522/523 B` in composites); Pi directive `P=554 B`; representative SessionStart `S=389 B`. These are UTF-8 byte measurements with repository estimates (`ceil(UTF-16/4)`), not exact provider tokens or billing units. [SOURCE: iterations/iteration-012.md: Measurement Basis and Formulas] [SOURCE: iterations/iteration-014.md: Finding 1]

3. **Iteration 12's scenario arithmetic survives, but two policy interpretations are corrected.** For `N=10,g=3,c=0,r=1,q=1,L=C=0`, shared configured baseline/recommended is `9,626→1,715 B` (82.2%), Pi is `15,189→3,478 B` (77.1%), OpenCode known bounded components are `9,626→1,715 B`, and Cursor's observed prompt lane is `0→0`. For `N=100,g=10,c=2,r=3`, shared is `86,598→8,933 B` (89.7%), Pi `142,208→23,602 B` (83.4%), and OpenCode known components `85,820→8,155 B` (90.5%) at the stated bounds. Correction one: Gate savings apply only to repeated mutation-positive questions in an open epoch, not all unresolved turns. Correction two: the Pi recommended row uses an unexecuted `130 B` compact target and `177 B` repeat composite that iteration 14 found semantically incomplete, so it is a savings envelope, not an activation-ready after-state. [SOURCE: iterations/iteration-012.md: Per-Runtime Results: 10-Turn Example] [SOURCE: iterations/iteration-012.md: Per-Runtime Results: 100-Turn Example] [SOURCE: iterations/iteration-014.md: Findings 4-5]

4. **Preliminary rank 1 is shadow instrumentation plus canonical block identity; it has zero direct saving but unlocks every defensible saving with the lowest guardrail risk.** Apply to all six runtimes, recording privacy-safe planned/emitted hashes, bytes, lifecycle epoch, transform identity, and delivery/behavior receipts. Evidence confidence is high because byte-identical shadowing preserves output; rollback triggers and owners are already specified. It ranks first by risk-adjusted enablement, not raw saving. [SOURCE: iterations/iteration-013.md: Findings 2,6-8] [SOURCE: iterations/iteration-014.md: Go / No-Go Evidence Matrix]

5. **Preliminary rank 2 is bounding/digesting OpenCode's compiled-route summary; rank 3 is identity-proven OpenCode same-message dedup.** Rank 2 has scenario-dependent but potentially unbounded savings, low-to-medium guardrail risk if clarification can reveal bounded target names, OpenCode-only coverage, and medium-high source confidence. Rank 3 removes duplicate known components proportional to extra transforms—for example, at `q=2` it can remove one duplicate `806 B` representative advisor payload plus applicable Gate/continuity/compiled additions per user message—but requires a stable last-user-message identity; prompt hash alone is unsafe. Both precede cross-turn suppression because they avoid assumptions about model retention. [SOURCE: iterations/iteration-006.md: Findings 5,8] [SOURCE: iterations/iteration-012.md: Per-Runtime Results: 10-Turn Example] [SOURCE: iterations/iteration-013.md: Findings 3-4] [SOURCE: iterations/iteration-014.md: Go / No-Go Evidence Matrix]

6. **Preliminary rank 4 is route-only repeat evaluation with full policy replay; it offers the largest bounded cross-runtime prompt-byte saving but remains activation-blocked.** A representative repeat changes `806→43 B`, saving `763 B` (94.7%) per eligible matched repeat. Ten all-matched advisor turns with one full delivery change `8,060→1,193 B`, saving `6,867 B` (85.2%); 100 turns with three full deliveries change `80,600→6,589 B`, saving `74,011 B` (91.8%). Coverage is Claude/Codex/Devin and OpenCode known advisor components; Cursor is counterfactual until delivery proof, and Pi needs a separate semantic-preserving arbitration solution. Guardrail risk is high because current comments/tests intentionally repeat directives on abstention/failure/identical turns; confidence is high for bytes, low for behavioral equivalence. [SOURCE: iterations/iteration-012.md: Findings 1] [SOURCE: iterations/iteration-014.md: Findings 3,7]

7. **Preliminary rank 5 is Gate open-epoch dedup only after visible-enforcement receipts; rank 6 is a semantic-preserving Pi prototype.** Gate saves `522 B` (shared) or `523 B` (Pi) only for each later mutation-positive repeat in the same open epoch: the ten-turn scenario saves `1,044 B` shared and `1,046 B` Pi, while read-only turns already cost zero. Risk is medium-high because advisory/off modes may depend on repeated visibility. Pi's current `554 B` block is large, but no exact after-size is defensible until all five semantics—native default, current-turn-only CLI override, CLI skill preload, advisor/model non-authorization, and child exclusion—survive; therefore `554→130 B`, the `424 B` saving, and `1,362→177 B` composite remain modeled upper targets only. [SOURCE: iterations/iteration-012.md: Findings 2-3] [SOURCE: iterations/iteration-014.md: Findings 4-5]

8. **Stable-before-dynamic placement is layout hygiene, not a savings rank, and four questions remain empirically open.** Provider guidance supports stable prefixes, but these capsules are below cache minima alone and the runtimes expose no complete cache-control/billing receipts; billed savings, hit rates, exact token counts, and dollars remain `UNKNOWN`. The remaining open evidence is: pinned host acceptance and compact/resume retention across runtimes; Cursor prompt-hook delivery on a current pinned build; OpenCode transform count plus stable message identity and whole-prompt ordering; and behavioral negative controls for directive drift/failure, Gate advisory visibility, and Pi parent/child dispatch. [SOURCE: iterations/iteration-008.md: Findings 1-5,7] [SOURCE: iterations/iteration-009.md: Findings 1-8] [SOURCE: iterations/iteration-014.md: Findings 2,7]

## Evidence Coverage Matrix

| Runtime | Advisor + three directives | Gate 3 | Session/lifecycle | Runtime-only additions | Quantitative lane | Remaining empirical gap |
|---|---|---|---|---|---|---|
| Claude Code | Canonical owner/configured every prompt | Shared core/configured | SessionStart resume/clear/compact semantics | none named | Exact configured composites | Host receipt, post-compact retention, behavioral suppression eval |
| Codex | Claude owner via native envelope | Shared core/native envelope | SessionStart configured; parity incomplete | none named | Exact configured composites | Pinned host/lifecycle receipts |
| Cursor | Registered, tested build non-delivering | Registered/prebound; prompt delivery absent | SessionStart observed; preCompact incomplete | none named | Configured counterfactual plus observed prompt `0` | Current pinned prompt/preCompact receipt |
| Devin | Claude owner via Devin envelope | Shared core; live evidence exists | SessionStart plus post-compaction adapter | none named | Exact configured composites | Full first/repeat/compact receipt matrix |
| OpenCode | Independent system transform; fallback/compiled summary | Independent transform | Recurring continuity, not one-shot SessionStart | compiled summary and other non-audit transforms | Formula `q*(N*806+g*522)+L+C`; bounded rows only | `q`, stable message ID, `L/C`, global transform order/receipt |
| Pi | Input transform plus full Pi directive | Separate input transform | session_start and session_compact adapters | five-clause Pi arbitration | Exact baseline; compact after-state modeled only | Cross-handler order, parent/child receipt, semantic-preserving compact size |

[SOURCE: iterations/iteration-001.md] [SOURCE: iterations/iteration-002.md] [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-007.md] [SOURCE: iterations/iteration-009.md] [SOURCE: iterations/iteration-012.md] [SOURCE: iterations/iteration-014.md]

## Preliminary Reduction Ranking

| Rank | Reduction | Savings | Guardrail risk | Runtime coverage | Evidence confidence | Current decision |
|---:|---|---|---|---|---|---|
| 1 | Shadow planner, IDs, hashes, receipts | 0 direct | Low | 6/6 | High | Implement/evaluate first |
| 2 | Bound/digest compiled-route summary | Variable; removes uncapped tail | Low-medium | OpenCode | Medium-high | Conditional GO with reveal path |
| 3 | Same-message transform dedup | One or more duplicate transform payloads; `806 B` representative advisor component per duplicate before additions | Medium | OpenCode | Medium | Receipt-gated GO |
| 4 | Full first/replay policy + route-only repeats | `763 B` per eligible repeat; 82.2% shared ten-turn scenario when combined with Gate assumptions | High | 3 proven/configured shared lanes + OpenCode components; Cursor/Pi qualified | Bytes high; behavior low | Shadow/eval only |
| 5 | Gate open-epoch repeat dedup | `522/523 B` per later mutation-positive repeat | Medium-high | 6 configured/implemented, Cursor delivery qualified | Medium | No universal activation |
| 6 | Semantic-preserving compact Pi arbitration | Less than the modeled `424 B` target until executed | High | Pi only | Low-medium | Prototype/eval only |
| — | Stable-before-dynamic provider-cache placement | Billed saving `UNKNOWN` | Low as layout, unknown transport risk | Provider/runtime dependent | Low for realized savings | Hygiene only; do not monetize |
| — | No-match/failure silence or unconditional directive drop | Up to `763 B` per occurrence | Unacceptably high | Broad | Low behavioral confidence | Ruled out |

## Key Questions: Answered vs Open

- **Evidence-backed answered:** exact semantic owners and lifecycle surfaces for every named block across six runtimes; measured fixed-block bytes and configured composites; value/redundancy/staleness classification; authoritative stable-prefix/cache semantics; candidate actions and preservation contracts; reproducible bounded before/after formulas and preliminary risk-adjusted rank. [SOURCE: iterations/iteration-001.md through iterations/iteration-014.md]
- **Open:** realized host delivery/retention and exact tokenizer/provider billing; behavioral effectiveness of repeated versus replayed/conditional directives; current Cursor prompt delivery; OpenCode transform identity/count/full ordering; an executed Pi compact form preserving all clauses. [SOURCE: iterations/iteration-014.md: Negative Knowledge]

## Contradictions Resolved or Preserved

- **Resolved:** Gate repeats are not every unresolved turn; they are mutation-positive/re-ask events. Use `g`, not `N`, in savings. [SOURCE: iterations/iteration-014.md: Finding 4]
- **Resolved:** `130 B` Pi and `177 B` composite are scenario targets, not preservation-equivalent outputs. [SOURCE: iterations/iteration-014.md: Finding 5]
- **Resolved:** stable-prefix placement and prompt-byte suppression are separate; neither proves billed savings, and their savings cannot be double-counted. [SOURCE: iterations/iteration-012.md: Cache-Hit Billed-Input Effects] [SOURCE: iterations/iteration-014.md: Finding 2]
- **Preserved unresolved:** directives are byte-identical/redundant while source comments/tests deliberately require every-turn/failure repetition; only behavioral negative controls can decide necessity. [SOURCE: iterations/iteration-014.md: Finding 3]
- **Preserved unresolved:** Cursor registration conflicts with observed non-delivery; report configured counterfactual and observed zero separately. [SOURCE: iterations/iteration-012.md: Findings 4]

## Ruled Out

- Numeric provider-token, cache-hit, dollar, latency, or billed-saving claims without runtime/provider receipts.
- Treating stable-first placement as a measured reduction or adding cache savings to bytes already removed by deduplication.
- Universal no-match/failure silence, unconditional directive drop, or startup-only guardrails.
- Universal Gate first-open-only suppression while advisory/off delivery still depends on visible repeats.
- The `130 B` Pi target as semantically equivalent or implementation-ready.
- Cursor realized prompt savings from configuration alone; OpenCode one-transform-per-turn or finite whole-prompt totals without telemetry.
- A shared planner claiming ownership/order over every OpenCode system transform.

## Dead Ends

Further static reading or arithmetic cannot resolve host acknowledgement, compaction retention, provider billing, Cursor delivery, OpenCode cadence/identity, or behavioral guardrail effectiveness. Synthesis should preserve these as explicit evidence gaps, not convert them into recommendations.

## Edge Cases

- Ambiguous input: “rank by savings” conflicts with missing behavioral receipts; the selected interpretation is a preliminary risk-adjusted implementation/evaluation order with raw savings shown separately.
- Contradictory evidence: repeated-directive redundancy versus intentional resilience remains unresolved; Cursor configured versus observed lanes remain separate.
- Missing dependencies: pinned runtime receipts, provider usage/tokenizer fields, guardrail A/B negative controls, OpenCode message identity/count, and an executed Pi compact serializer.
- Partial success: all requested source/configuration/cost questions are covered and ranked preliminarily; realized savings and behavioral safety remain empirical open questions.

## Sources Consulted

- `.opencode/agents/deep-research.md`
- `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`
- `iterations/iteration-001.md` through `iterations/iteration-014.md`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-225`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:95-119,930-1057`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-106`
- `.opencode/plugins/mk-skill-advisor.js:785-906`
- `.opencode/plugins/mk-spec-memory.js:477-505`
- `.opencode/plugins/session-cleanup.js:173-187`
- `.opencode/plugins/mk-git-preflight-advisory.js:108-125`

## Assessment

- New information ratio: 0.48 (`6 partially new matrix/ranking reconciliations over 8 findings = 0.375`, plus `0.10` contradiction-reduction bonus, rounded to `0.48`; two findings confirm prior evidence).
- Novelty justification: This pass adds the first defensible risk-adjusted rank and closes the all-block/all-runtime matrix while downgrading Gate, Pi, and cache claims per iteration 14 rather than adding new external evidence.
- Questions addressed: all five packet key questions, every requested block, all six runtimes, quantitative scenarios, contradiction status, and synthesis preservation requirements.
- Questions answered: all five are answered at source/configured-cost and preliminary-design level; realized delivery, billing, and behavioral equivalence remain explicitly open rather than treated as unanswered inventory work.

## Reflection

- What worked and why: reconciling the cost formulas against the skeptical evidence matrix separated reproducible bytes from unsafe activation and put zero-saving instrumentation first on risk-adjusted value.
- What did not work and why: no additional static source can convert configured delivery into host receipts or a byte model into billing/compliance evidence.
- What I would do differently: synthesis should lead with evidence lanes and the correction ledger before recommendations, so scenario percentages cannot outrun their assumptions.

## Recommended Next Focus

No further leaf iteration: the configured maximum of 15 is reached. Orchestrator synthesis should preserve this structure: (1) scope and terminology—configured, observed, model-visible bytes, repository estimates, billed input; (2) named-block ownership/lifecycle matrix for six runtimes; (3) exact measurement basis and formulas; (4) corrected 10-turn and 100-turn scenarios with Cursor and OpenCode qualifications; (5) authoritative cache/placement guidance without billing claims; (6) preliminary rank with savings/risk/coverage/confidence; (7) target architecture and reversible rollout slices; (8) contradictions/negative knowledge; (9) answered/open questions and receipt plan. Preserve the exact fixed-block measurements, iteration-12 formulas/tables, iteration-14 go/no-go corrections, official provider sources from iteration 8, runtime lifecycle sources from iteration 9, and architecture/rollback contract from iteration 13.
