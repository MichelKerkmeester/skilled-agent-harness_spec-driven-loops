# Per-Prompt Injection Audit — Final Research Synthesis

## 1. Executive Summary

The recurring payload is dominated by the three always-on directives, not the skill route. The measured directives-only fallback is 763 UTF-8 bytes (repository estimate 190 tokens); a representative route adds 43 bytes, producing an 806-byte advisor payload. Gate 3 adds 521 bytes when it actually asks, Pi adds a 554-byte runtime-only dispatch directive, and representative SessionStart context is 389 bytes. These are source-executed byte measurements and `ceil(UTF-16/4)` planning estimates, not provider tokenizer or billing receipts. [SOURCE: iterations/iteration-003.md: Measurement Method and Findings 1-3] [SOURCE: iterations/iteration-014.md: Finding 1]

The safest sequence is measurement-first: introduce canonical block identities and shadow receipts across all six runtimes; bound OpenCode's uncapped compiled-route line; then deduplicate only proven duplicate transforms. Route-only repeats, Gate open-epoch suppression, and a shorter Pi rule have large modeled savings but remain activation-gated by delivery, compaction, and behavioral negative controls. Stable-prefix placement is sensible layout hygiene, but this lineage has no evidence of cache hits or billed-input savings. [SOURCE: iterations/iteration-013.md: Findings 2-8] [SOURCE: iterations/iteration-014.md: Go / No-Go Evidence Matrix] [SOURCE: iterations/iteration-015.md: Preliminary Reduction Ranking]

## 2. Scope, Evidence Lanes, and Terminology

The audit covers the advisor route, comment-hygiene directive, efficiency governor, proof-over-appearance directive, Gate-3 question, Pi-only subagent-dispatch directive, SessionStart/continuity, and OpenCode's additive compiled-route summary across Claude Code, Codex, Cursor, Devin, OpenCode, and Pi. “Configured” means a registry or adapter declares the path; “source-proven” means composition is visible in code; “observed” means a live probe or runtime receipt exists. These must not be collapsed: Cursor is configured for prompt delivery but the tested build delivered none, and most other lanes still lack full host/provider receipts. [SOURCE: iterations/iteration-001.md: Findings 1-6] [SOURCE: iterations/iteration-002.md: Finding 7]

Bytes are exact UTF-8 sizes for the captured strings. “E” is `ceil(UTF-16 units/4)`, the repository-native estimate. Model tokens, cached tokens, billed input, dollars, and latency are unknown unless a provider receipt supplies them. [SOURCE: iterations/iteration-003.md: Measurement Method] [SOURCE: iterations/iteration-012.md: Cache-Hit Billed-Input Effects]

## 3. Canonical Block Ownership

| Block | Exact semantic owner | Lifecycle and delivery |
|---|---|---|
| Advisor route | `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts::renderAdvisorBrief`; invoked by `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts::handleClaudeUserPromptSubmit` | Every successful shared prompt hook; OpenCode mirrors/bridges the policy in `mk-skill-advisor.js` |
| Comment hygiene | `render.ts` directive constant; mirrored in `mk-skill-advisor.js` and `mk-skill-advisor-bridge.mjs` fallbacks | Appended after the advisor cap; present in fallback/no-match/failure |
| Efficiency governor | Same renderer/mirrors | Same every-executing-hook behavior |
| Proof over appearance | Same renderer/mirrors | Same every-executing-hook behavior |
| Gate-3 question | `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs::GATE_3_QUESTION` and `classifyIntent` | Conditional on mutation-positive/open state; terminal/read-only/child paths are silent |
| Pi dispatch directive | `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts::PI_SUBAGENT_DISPATCH_DIRECTIVE` | Every non-empty parent input, even advisor failure; omitted from child prompt copying by policy |
| SessionStart | `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts::handleStartup/main` | Startup/resume/clear/compact-aware for Claude-derived adapters; Pi hidden lifecycle message |
| OpenCode continuity | `.opencode/plugins/mk-spec-memory.js::appendContinuityBrief` | Recurring `experimental.chat.system.transform`, not a one-shot SessionStart equivalent |
| OpenCode compiled route | `.opencode/plugins/mk-skill-advisor.js::renderCompiledRouteSummaryLine` | Additive transform block; target list is uncapped in inspected source |

[SOURCE: iterations/iteration-001.md: Findings 1-6] [SOURCE: iterations/iteration-002.md: Findings 1,5-6] [SOURCE: iterations/iteration-006.md: Findings and Representative Payload Matrix]

## 4. Six-Runtime Inventory: Configured vs Observed

| Runtime | Session/lifecycle owner | Per-turn owners and configured order | Observed qualification |
|---|---|---|---|
| Claude Code | `hooks/claude/session-prime.ts`, registered by `.claude/settings.json` | canonical advisor/directives, then shared Gate core | Configured/source-proven; combined host receipt not established in lineage |
| Codex | `hooks/codex/session-start.ts` proxies Claude owner | `hooks/codex/user-prompt-submit.ts` proxies advisor; Codex Gate adapter follows | Configured/native-envelope source-proven; pinned host/lifecycle receipt incomplete |
| Cursor | `hooks/cursor/session-start.ts`; Gate prebind at startup | configured Gate then advisor in `beforeSubmitPrompt` | Startup observed; tested prompt hook did not fire, so observed prompt cost is zero |
| Devin | `hooks/devin/session-start.ts` proxies Claude owner | advisor/directives then Gate through Devin envelopes | Startup and Gate have live evidence; full repeated/compact matrix absent |
| OpenCode | no one-shot context emitter; `mk-spec-memory.js` recurring continuity transform | independent `mk-skill-advisor.js`, `mk-spec-gate.js`, and memory transforms; global order unproven | Source-proven mutations; transform count, stable message identity, host receipt, and whole ordering unknown |
| Pi | `session-start-context.ts` plus separate compact adapter | `prompt-advisor.ts` emits advisor/directives then Pi rule; `spec-gate-classify.ts` separately appends Gate | Source-proven local composition; cross-handler order and combined parent/child receipts unproven |

[SOURCE: iterations/iteration-002.md: Findings 2-7] [SOURCE: iterations/iteration-009.md: Runtime Semantics Matrix] [SOURCE: iterations/iteration-015.md: Evidence Coverage Matrix]

## 5. Measured Baseline

| Block / composite | UTF-8 bytes | Characters / UTF-16 units | Repository estimate |
|---|---:|---:|---:|
| Full directives fallback `D` | 763 | 759 / 759 | 190 E |
| Comment hygiene | 205 | 203 / 203 | 51 E |
| Governor | 290 | 288 / 288 | 72 E |
| Proof over appearance | 254 | 254 / 254 | 64 E |
| Representative route `R` | 43 | 43 / 43 | 11 E |
| Representative advisor `A=D+R` | 806 | 802 / 802 | 201 E |
| Gate question `G` | 521 | 521 / 521 | 131 E |
| Pi directive `P` | 554 | 552 / 552 | 138 E |
| Representative SessionStart `S` | 389 | 383 / 383 | 96 E |
| Shared advisor + Gate composite | 1,328 | 1,324 / 1,324 | 331 E |
| Pi non-Gate / Gate composites | 1,362 / 1,885 | 1,356 / 1,879 | 339 / 470 E |

The directive component is 94.7% of the representative 806-byte advisor block. The apparent advisor cap applies to the route prefix; directives are concatenated after the cap. [SOURCE: iterations/iteration-003.md: Findings 1-4] [SOURCE: iterations/iteration-004.md: Finding 3]

## 6. Before/After Cost Model

Let `N` be user turns, `g` mutation-positive Gate emissions in one unresolved epoch, `c` lifecycle replays after the first, `r=1+c` full policy deliveries, and `q` OpenCode provider transforms per user turn. Baseline shared configured bytes are `N*806 + g*522 + c*389`; Pi is `N*1,362 + g*523 + c*389`. OpenCode's known component is `q*(N*806 + g*522) + L + C`, with emitted continuity `L` and compiled-route bytes `C`; source does not provide a finite whole-prompt ceiling. Cursor retains a configured counterfactual and an observed prompt lane of zero. [SOURCE: iterations/iteration-012.md: Measurement Basis and Formulas]

The corrected recommended envelope keeps full policy on first delivery and verified lifecycle replay, uses route-only `43 B` on eligible repeats, and emits Gate only under a receipt-backed policy. Its shared scenario formula is `r*806 + (N-r)*43 + min(g,r)*522`. The Pi scenario used `r*1,362 + (N-r)*177 + min(g,r)*523`, but `177 B` depends on an unexecuted 130-byte reminder and is therefore a modeled ceiling, not an implementation-ready after-state. [SOURCE: iterations/iteration-012.md: Scenarios] [SOURCE: iterations/iteration-014.md: Findings 4-5]

| Scenario | Shared configured baseline → recommended | Pi baseline → modeled recommended | OpenCode known components | Cursor observed prompt lane |
|---|---:|---:|---:|---:|
| `N=10,g=3,c=0,r=1,q=1,L=C=0` | 9,626 → 1,715 B (82.2%) | 15,189 → 3,478 B (77.1%, unsafe compact assumption) | 9,626 → 1,715 B at stated bounds | 0 → 0 |
| `N=100,g=10,c=2,r=3,q=1,L=C=0` | 86,598 → 8,933 B (89.7%) | 142,208 → 23,602 B (83.4%, unsafe compact assumption) | 85,820 → 8,155 B at stated bounds | 0 prompt bytes; 778 lifecycle bytes unchanged |

Gate savings use mutation-positive repeats, not every unresolved turn; read-only cases are already silent. Cache savings are not included. [SOURCE: iterations/iteration-012.md: Per-Runtime Results] [SOURCE: iterations/iteration-014.md: Findings 2,4] [SOURCE: iterations/iteration-015.md: Finding 3]

## 7. Value, Redundancy, and Staleness

Comment hygiene has the clearest distinct safety role because it points to a narrow mechanically checked failure mode and covers contexts where the durable framework may be absent. The governor is mostly durable disposition with a claimed long-context “thermostat” role but no machine gate. Proof-over-appearance restates final-state verification and negative-control expectations, yet its every-turn behavioral benefit is unmeasured. Current comments and tests intentionally require all three on identical, skipped, no-match, and failure paths; they prove the existing resilience contract, not that repetition is behaviorally necessary. [SOURCE: iterations/iteration-004.md: Findings 4-7] [SOURCE: iterations/iteration-014.md: Finding 3]

Gate 3 already has substantial conditionalization: read-only, terminal, self-bound, prebound, disabled, and child cases can emit zero. Its repetition is confined to mutation-positive/re-ask behavior while state is open, so universal first-open-only suppression could weaken advisory/off-mode visibility. [SOURCE: iterations/iteration-005.md: Findings 2-8] [SOURCE: iterations/iteration-014.md: Finding 4]

SessionStart is correctly lifecycle-scoped, not per-turn. It should replay on trustworthy resume/compaction boundaries because startup-only retention is not portable. OpenCode continuity is different: it is transform-scoped and needs identity/cadence telemetry before being called per-turn or deduplicated. [SOURCE: iterations/iteration-007.md: Findings 1-4] [SOURCE: iterations/iteration-009.md: Findings 1-8]

## 8. Official Primary-Source Best Practices

OpenAI documents automatic prompt caching for exact shared prefixes and recommends putting static content first and variable content later. Anthropic likewise requires exact prefixes, exposes cache breakpoints/retention semantics, and recommends stable content before dynamic material. Gemini distinguishes implicit and explicit caching and does not make caching equivalent to conversational memory. Amazon Bedrock prompt caching has provider/model-specific checkpoints and constraints. Across providers, sufficiently long exact prefixes, provider support, retention, and usage telemetry matter; small capsules do not independently guarantee eligibility. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices] [SOURCE: https://ai.google.dev/gemini-api/docs/caching] [SOURCE: https://ai.google.dev/gemini-api/docs/generate-content/caching] [SOURCE: https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html] [SOURCE: iterations/iteration-008.md]

The actionable common denominator is concise instructions, stable-before-dynamic ordering where the host permits it, threshold/intent gating for dynamic guidance, and explicit lifecycle replay rather than assuming provider cache state is semantic memory. No source supports treating cache eligibility as proof of cache hits, billing savings, retention after compaction, or safe removal of visible guardrails. [SOURCE: iterations/iteration-008.md: Findings 1-7] [SOURCE: iterations/iteration-014.md: Finding 2]

## 9. Ranked Reductions

| Rank | Reduction | Savings | Guardrail risk | Coverage | Confidence / decision |
|---:|---|---|---|---|---|
| 1 | Shadow planner, canonical IDs/hashes, delivery receipts | 0 direct | Low | 6/6 | High; implement first |
| 2 | Bound/digest OpenCode compiled-route targets with reveal path | Variable; removes uncapped tail | Low-medium | OpenCode | Medium-high; conditional GO |
| 3 | Stable-message-identity OpenCode same-message transform dedup | At least representative 806 B per duplicate, plus conditional additions | Medium | OpenCode | Medium; receipt-gated GO |
| 4 | Full first/replay policy plus route-only repeats | 763 B per eligible repeat; 806→43 B | High | Claude/Codex/Devin and OpenCode component; Cursor/Pi qualified | Bytes high, behavior low; shadow/eval only |
| 5 | Gate open-epoch repeat reduction | 522/523 B per later mutation-positive repeat | Medium-high | Six configured/implemented, Cursor qualified | Medium; no universal activation |
| 6 | Semantic-preserving compact Pi arbitration | Less than modeled 424 B until executed | High | Pi | Low-medium; prototype only |
| — | Stable-before-dynamic layout | Billed saving unknown | Low layout risk, unknown transport risk | Provider/runtime dependent | Hygiene only; do not monetize |
| — | Unconditional directive drop or no-match/failure silence | Up to 763 B/occurrence | Unacceptably high | Broad | Ruled out |

[SOURCE: iterations/iteration-015.md: Preliminary Reduction Ranking]

## 10. Target Architecture

Add a runtime-neutral planner beside `render.ts`, returning ordered stable and dynamic blocks plus immutable identities such as `policy.comment-hygiene.v1`, `route.advisor.v1`, `gate.spec-folder-question.v1`, and `runtime.pi-dispatch.v1`. Compute content and ordered policy-set hashes without raw prompts, paths, or session data. Keep native serializers: Claude-derived envelopes, OpenCode `output.system`, and Pi input transforms are not interchangeable. [SOURCE: iterations/iteration-013.md: Findings 1-3]

State must be scoped by session, lifecycle epoch, turn/message identity, block ID, content hash, and confirmed delivery outcome. Commit “delivered” only after a host receipt or pinned behavioral probe proves acceptance. The suppression predicate is `hostReceiptOrPinnedBehavioralProbe && provenIdentity && validEpochState && hashAlreadyDelivered`; missing, corrupt, stale, or ambiguous state emits rather than suppresses. Compaction/resume resets delivery state and triggers full replay. [SOURCE: iterations/iteration-013.md: Findings 2-4] [SOURCE: iterations/iteration-014.md: Finding 7]

The shared planner cannot claim ownership of every OpenCode transform. Cleanup warnings, git preflight advisories, active-goal, post-edit, and other independent plugins also mutate system context and can affect global ordering/cache identity. [SOURCE: iterations/iteration-014.md: Finding 6]

## 11. Rollout, Verification, Risks, and Rollback

1. Ship privacy-safe shadow IDs, planned/emitted hashes, exact bytes, lifecycle epoch, transform/message identity, and host receipt fields with no prompt change. Roll back on any output diff, raw-data logging, latency/error regression, or state leakage.
2. Add byte-stable parity fixtures for all native serializers and first/repeat/Gate/read-only/failure cases. Record configured and observed lanes separately.
3. Bound OpenCode compiled summaries behind an independent flag and provide an explicit reveal/clarification path. Roll back if route choice or clarification loses required target names.
4. Enable OpenCode same-message dedup only after stable message identity and multi-transform receipts. Roll back on missed distinct repeated user messages or ordering changes.
5. Shadow route-only/full-replay, Gate, and Pi candidates independently. Do not combine flags; attribution and rollback must remain local.
6. Run long-context, advisor failure, no-match, comment-writing, completion-proof, advisory Gate, invalid-answer, child-session, resume, and compaction negative controls. Any false negative, missing replay, or host-receipt ambiguity restores baseline emit behavior.
7. Activate only runtime/candidate cells whose behavioral and delivery evidence passes; unknown state always emits.

The central risks are long-context drift, compaction loss, false-negative relevance classifiers, advisory Gate invisibility, Pi override/preload semantics loss, Cursor version drift, and OpenCode transform aliasing. Rollback is per block and runtime: disable the candidate flag, clear delivery state, and return to full baseline emission. [SOURCE: iterations/iteration-011.md: Candidate Reduction Matrix and Adversarial Stress Cases] [SOURCE: iterations/iteration-013.md: Findings 6-8] [SOURCE: iterations/iteration-014.md: Go / No-Go Evidence Matrix]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Count provider-cache placement as measured savings | No cache-control, hit-rate, usage, or billing receipts; capsule is below minima alone | Official cache sources; skeptical audit | 8, 12, 14, 15 |
| Drop full directive fallback on no-match/failure | Removes the intentional fail-open guardrail contract asserted by code/tests | Renderer comments and fallback tests | 4, 6, 11, 14 |
| Put all directives at startup and suppress forever | Cross-runtime compaction/retention parity is unproven | Lifecycle audit | 7, 9, 13, 14 |
| Suppress Gate after first open question universally | Read-only is already silent; mutation-positive reminders matter in advisory/off modes | Gate state machine/tests | 5, 11, 14, 15 |
| Treat Pi 130-byte reminder as equivalent | Candidate omits/unproves native default, explicit current-turn override, preload, anti-signal, and child exclusion semantics | Pi source audit | 7, 12, 14, 15 |
| Charge Cursor configured prompt bytes as observed | Tested `beforeSubmitPrompt` did not fire | Cursor probe and adapter docs | 1-3, 9, 12, 15 |
| Assume one OpenCode transform per turn or finite whole prompt | `q` is unmeasured; continuity/dynamic compiled line and independent transforms remain | OpenCode source inventory | 2, 3, 6, 9, 12, 14 |
| Use prompt hash alone for OpenCode dedup | Identical text can be distinct user messages; needs stable message identity | Architecture and skeptical audit | 10, 13, 14 |
| Use one universal serializer/storage implementation | Native channels, lifecycle signals, and subprocess/in-process state differ | Cross-runtime seam analysis | 9, 10, 13 |
| Treat serializer completion as delivery acknowledgement | Writing an envelope does not prove host/provider acceptance or retention | Lifecycle/receipt audit | 9, 13, 14 |

## Divergence Map

The research deliberately widened from ownership to payload composition, executed measurement, directive value, Gate state, advisor expansion/caching, lifecycle/Pi semantics, official provider guidance, runtime event semantics, implementation seams, adversarial candidate stress, quantitative scenarios, target architecture, skeptical correction, and final risk-adjusted ranking. No AI Council pivot artifacts were produced and no divergent pivot events appear in state. Saturated directions are static ownership, fixed-byte arithmetic, cache documentation, and source-level architecture. Failed approaches include broad repository grep (history/generated noise), exact tokenizer measurement (vocabulary unavailable), warm daemon probing (sandbox IPC denied), and further static reading for host/billing/behavior questions. The remaining frontier is empirical: pinned delivery/compaction receipts, provider usage fields, behavioral negative controls, Cursor current-version delivery, OpenCode identity/cadence/order, and an executed semantic-preserving Pi serializer. [SOURCE: iterations/iteration-003.md: Dead Ends] [SOURCE: iterations/iteration-006.md: Dead Ends] [SOURCE: iterations/iteration-014.md: Dead Ends] [SOURCE: deep-research-state.jsonl]

## 12. Open Questions

- Do pinned Claude, Codex, Devin, Pi, and OpenCode hosts accept and retain each emitted block across first turn, repetition, resume, and compaction?
- Does current pinned Cursor deliver `beforeSubmitPrompt` and `preCompact`, or should it remain startup/prebind-only?
- What are OpenCode's transforms-per-user-message, stable message identity, independent-transform order, continuity size, and compiled-route distribution in production?
- Do repeated directives materially improve long-context, failure, comment-hygiene, or final-verification compliance compared with full lifecycle replay plus route-only repeats?
- Can a Pi compact serializer preserve all five current dispatch semantics, with parent/child and explicit-user-override receipts, and what is its executed exact size?
- What do provider usage fields report for exact tokenizer counts, cache hits, billed input, latency, and costs? Until measured, all such savings remain unknown.

## 13. References

- Iteration narratives: `iterations/iteration-001.md` through `iterations/iteration-015.md`.
- Structured evidence: `deltas/iter-001.jsonl` through `deltas/iter-015.jsonl` and `deep-research-state.jsonl`.
- Canonical advisor renderer: `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-225`.
- Canonical advisor hook: `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:154-254`.
- Canonical Gate core: `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:62-119,882-1058`.
- Canonical SessionStart: `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:32-243,303-364`.
- Pi policy owner: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:7-106`.
- OpenCode owners: `.opencode/plugins/mk-skill-advisor.js:785-906`, `.opencode/plugins/mk-spec-gate.js:160-258`, `.opencode/plugins/mk-spec-memory.js:477-505`.
- Official prompt-caching sources: OpenAI, Anthropic, Google Gemini, and Amazon Bedrock links cited in Section 8.

## 14. Answered Questions

All five original questions are answered at the source/configuration and bounded cost-model level: exact owners and lifecycle surfaces are mapped; fixed bytes and repository estimates are measured; redundancy/staleness and guardrail value are classified; official provider guidance is summarized; and reductions are ranked with preservation and evidence gates. Realized host delivery, exact provider tokens/billing, and behavioral equivalence remain open empirical subquestions, not missing inventory work. [SOURCE: iterations/iteration-015.md: Key Questions: Answered vs Open]

## 15. Limitations and Confidence

Confidence is high for source ownership, fixed UTF-8 measurements, configured composition, and arithmetic. It is medium for cross-runtime lifecycle design and OpenCode bounded candidates. It is low for realized provider savings and behavioral equivalence because the necessary receipts and negative controls do not exist. Cursor's configured and observed lanes remain contradictory by design; OpenCode whole-prompt totals remain parameterized; Pi compact values remain targets. [SOURCE: iterations/iteration-012.md: Edge Cases and Negative Knowledge] [SOURCE: iterations/iteration-014.md: Negative Knowledge]

## 16. Implementation Decision

Proceed with shadow instrumentation and canonical identity first. Conditionally implement bounded OpenCode compiled summaries and, after stable-message receipts, same-message transform dedup. Keep route-only repeats, Gate suppression, Pi compaction, and global cross-turn suppression in evaluation-only mode until their named negative controls pass. Do not claim cache-billing savings or realized Cursor savings.

## 17. Convergence Report

- Stop reason: `maxIterationsReached` (configured maximum, not evidence of full empirical convergence).
- Total iterations: 15.
- Original questions answered at source/configured-cost level: 5 / 5.
- Empirical open questions: 6 groups listed above.
- Novelty trend: `1.00, 0.86, 0.92, 0.86, 0.94, 0.94, 0.88, 0.86, 0.89, 0.81, 0.72, 0.79, 0.69, 0.64, 0.48`; the final decline indicates synthesis saturation, while the configured max-iterations policy determined termination.
- Last three iterations: target architecture (0.69), skeptical evidence audit (0.64), final evidence matrix/ranking (0.48).
- Convergence threshold: 0.05; not reached numerically and not used as stop authority.
- Divergence: no pivots or Council artifacts; breadth came from sequential focus changes. Empirical delivery, billing, and behavioral questions remain unresolved.

