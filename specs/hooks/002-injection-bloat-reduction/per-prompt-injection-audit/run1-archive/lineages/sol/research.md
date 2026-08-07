# Final Research Synthesis — Per-Prompt Injection Audit

## 1. Executive Summary

The six runtimes share policy producers but differ materially in transport, lifecycle reachability, and observed delivery. The dominant fixed cost is not prompt-dependent routing: it is the invariant three-directive suffix, reconstructed at **759 characters / 763 UTF-8 bytes / ~190 estimated tokens**. The estimate is explicitly `ceil(chars/4)`, not a tokenizer count. Claude, intended Codex, Devin, and OpenCode repeat that cost on ordinary turns; Pi repeats it plus its independently owned 552-character dispatch guard; Cursor's configured editor hooks remain unobserved in CLI probes. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,163-215] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-012.md:7-31]

The recommended design separates decision cadence from delivery cadence. Continue classifying the current prompt for skill routing and Gate 3, but deliver only changed passing routes; move a consolidated 292-character policy capsule to context-epoch boundaries; edge-trigger repeated Gate questions without changing the open enforcement state; refresh continuity and active goals on lifecycle or mutation; and place stable policy before volatile state. Prompt caching is a latency/cost optimization only: cached reads remain context input and do **not** reduce context occupancy. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-013.md:7-19] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-014.md:11-31]

For ordinary no-Gate/no-route sessions, estimated totals change from `{281,1991,9591}` to `{164,164,164}` at 1/10/50 turns for Claude, intended Codex, and Devin; `{190,1900,9500}` to `{73,73,73}` for OpenCode; and `{420,3381,16541}` to `{302,1544,7064}` for Pi. Cursor CLI remains `{91,91,91}` observed; its configured editor path must not be counted until live delivery is captured. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-015.md:7-31]

## 2. Scope and Method

This detached 15-iteration study audited Claude Code, Codex, Cursor, Devin, OpenCode, and Pi. It traced registrations to adapters, canonical producers, compiled or installed artifacts, tests, and the limited live evidence available. Each block was classified by event, owner, transport, visibility, condition, deduplication, configured state, observed state, characters, UTF-8 bytes, and `ceil(chars/4)` estimate. SessionStart/lifecycle content, conditional Gate output, resolver warnings, and variable continuity/goal/recovery payloads were kept separate from fixed ordinary-turn totals. [SOURCE: .opencode/hooks/injection-contract.md:44-91,187-217] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-001.md:7-26]

Static reachability is not live-delivery proof. Exact model tokenizer vocabularies were unavailable in the sandbox, so this report does not claim exact tokenizer counts. It also does not claim current Cursor editor delivery, installed-current Devin behavior, provider cache hits, host prefix order, or exact variable-payload totals. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-012.md:13-31] [SOURCE: command `python3` tiktoken probe]

## 3. Architecture and Ownership

| Concern | Canonical content/policy owner | Transport ownership | Cadence |
|---|---|---|---|
| Advisor route + three directives | `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Claude owner; Codex/Cursor/Devin proxies; Pi in-process import; OpenCode local mirror | Computed per prompt; currently delivered on nearly every valid turn |
| Gate 3 question/state | `shared/gate-3-classifier.ts` + `spec-gate-core.mjs` | Runtime-specific classifiers / OpenCode transform / Pi input transform | Conditional prompt classification; session-scoped open/satisfied state |
| Session lifecycle context | Claude `session-prime.ts` | Claude direct; Codex/Devin proxy; Cursor startup-only translation; Pi lifecycle messages | Startup/resume/clear/compact where reachable |
| Continuity / active goal | Memory and goal modules | Runtime-specific lifecycle or repeated transforms | Currently mixed; should be lifecycle/mutation-driven |
| Pi dispatch rule | `hooks/pi/prompt-advisor.ts` (`PI_SUBAGENT_DISPATCH_DIRECTIVE`) | Pi visible input rewrite | Every nonblank Pi input |

[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-215] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:98-119,882-989] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:40-102,175-254,303-355] [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:40-106]

Adapters translate envelopes; they are not independent policy owners except where explicitly local. OpenCode owns a byte-mirrored directive fallback plus transform/cache mechanics. Pi uniquely owns the dispatch rule. Installed/configured drift is a separate operational layer and must never be mistaken for canonical ownership. [SOURCE: .opencode/plugins/mk-skill-advisor.js:30-52,527-545,777-865] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/user-prompt-submit.ts:3-20]

## 4. Six-Runtime Injection Inventory

| Runtime | Lifecycle injection | Per-turn configured order | Observed/configured distinction |
|---|---|---|---|
| Claude Code | `session-prime`: startup, resume, clear, compact; maintenance commands are not deliberate context | Advisor/directives → conditional Gate 3 | Source/tests establish configuration; no host transcript was captured |
| Codex | Adapter wraps shared `session-prime` output | Advisor/directives → conditional Gate 3 | Repository intent differs from installed global hooks: Gate path drift can yield a resolver warning; keep intended and installed totals separate |
| Cursor | Shared session adapter reaches startup only; separate active-goal injection | Gate 3 → advisor/directives | Three CLI probes observed no `beforeSubmitPrompt` delivery. Editor delivery remains unknown; configured is not observed |
| Devin | Shared lifecycle sources remain reachable; native post-compaction path also exists | Advisor/directives → conditional Gate 3 | Devin 3000.2.17 live evidence proved startup and Gate delivery; installed 3000.3.27 was not re-probed |
| OpenCode | `session.created` prepares state; later system transforms deliver continuity/goal/advisories | Advisor/directives, conditional Gate, plus dynamic transform blocks; cross-plugin order host-defined | Advisor cache avoids recomputation, not delivery; cached text is still appended |
| Pi | Hidden startup/resume and post-compaction messages; hidden goal restore/nudge | Visible user text → advisor/directives → mandatory Pi dispatch; separate Gate and goal transforms | Cross-extension aggregate order and cache behavior require live Pi capture |

[SOURCE: .claude/settings.json:77-135] [SOURCE: .codex/hooks.json:3-52] [SOURCE: .cursor/hooks.json:4-40,79-90] [SOURCE: .devin/hooks.v1.json:2-50] [SOURCE: .opencode/plugins/mk-spec-memory.js:477-505] [SOURCE: .pi/extensions/README.md:14-28,88-116]

## 5. Block-by-Block Cadence and Value

| Block | Current cadence | Marginal value | Recommended cadence |
|---|---|---|---|
| Advisor route line | Prompt-dependent | High only when a route passes or changes | Compute each prompt; deliver on passing semantic change and after recovery |
| Comment hygiene | Repeated suffix | Durable guardrail, but reinforced by root policy and automated gates | Consolidated lifecycle capsule; conditional fallback until lifecycle retention is proven |
| Governor | Repeated suffix | Mostly duplicates root/agent operating discipline | Consolidated lifecycle capsule |
| Proof-over-appearance | Repeated suffix | High completion integrity; current wording overstates negative-control universality | Consolidated lifecycle capsule plus behavioral completion gates |
| Gate 3 question | Conditional, but repeated on later positive turns while open | First question and open enforcement are essential; unchanged relay repetition is not | Edge-trigger first question; re-ask on invalid answer, scope/task change, or recovery |
| Gate deny detail | Blocked mutation boundary only | Enforcement feedback | Retain; exclude from ordinary-turn baseline |
| Continuity / active goal | Runtime-dependent, sometimes repeated | Valuable after lifecycle/mutation; stale if repeated unchanged | Lifecycle and mutation refresh |
| Pi dispatch directive | Every nonblank Pi input | Pi-specific enforcement with no proven native substitute | Retain until equivalent native enforcement exists |

[SOURCE: AGENTS.md:57-105,193-211] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:66-74] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-989] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-010.md:7-31]

## 6. Baseline Measurement Method

Fixed literals were reconstructed at their content owners and measured as characters and UTF-8 bytes. Estimated tokens are always labeled **`ceil(chars/4)` estimates**. Runtime totals preserve cadence algebra rather than averaging conditional events into every turn. The ordinary-session formulas include one deterministic startup baseline where that runtime has one, exclude Gate 3 unless separately stated, and exclude variable continuity, goal, compact recovery, compiled-route, resolver-warning, and maintenance payloads. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:111-118] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-012.md:7-31]

The preferred tokenizer check failed because installed `tiktoken==0.11.0` required uncached vocabularies and network access was unavailable. Consequently, no estimate below is represented as an exact model token count, and provider-specific message serialization overhead is unknown. [SOURCE: command `python3` tiktoken probe]

## 7. Baseline Token-Cost Matrix

### Exact fixed-text measurements and labeled estimates

| Block/fixture | Characters | UTF-8 bytes | `ceil(chars/4)` estimate |
|---|---:|---:|---:|
| Directive suffix | 759 | 763 | ~190 |
| Hygiene component | 204 | 206 | ~51 |
| Governor component | 289 | 291 | ~73 |
| Proof component | 255 | 255 | ~64 |
| Live advisor + suffix | 802 | 806 | ~201 |
| Stale advisor + suffix | 803 | 807 | ~201 |
| Ambiguous advisor + suffix | 830 | 834 | ~208 |
| Gate 3 A–E question | 521 | 521 | ~131 |
| Gate deny detail | 149 | 149 | ~38 |
| Pi dispatch directive | 552 | 552 | ~138 |
| Proposed lifecycle policy capsule | 292 | 292 | ~73 |
| Changed compact live route | 43 | 43 | ~11 |

[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,163-215] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:98-119] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-012.md:7-20]

Deterministic lifecycle fixtures are startup without continuity `361 chars / 367 bytes / ~91`, resume without spec `135/135/~34`, clear `134/134/~34`, missing/stale compact `129/129/~33`, and quarantined compact `198/198/~50`. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:40-102,124-160,175-254,303-355]

### Per-runtime ordinary-session totals

All figures below are `ceil(chars/4)`-based estimates; `T` is ordinary nonblank turns, with no Gate question and no changed advisor route.

| Runtime | Before formula | After formula | 1 turn before → after | 10 turns before → after | 50 turns before → after |
|---|---:|---:|---:|---:|---:|
| Claude Code | `91 + 190T` | `164` | 281 → 164 | 1,991 → 164 | 9,591 → 164 |
| Codex (intended config) | `91 + 190T` | `164` | 281 → 164 | 1,991 → 164 | 9,591 → 164 |
| Cursor CLI (observed) | `91` | `91` | 91 → 91 | 91 → 91 | 91 → 91 |
| Cursor editor (configured, unobserved) | Would follow shared totals if delivered | Unknown until capture | Not claimed | Not claimed | Not claimed |
| Devin | `91 + 190T` | `164` | 281 → 164 | 1,991 → 164 | 9,591 → 164 |
| OpenCode | `190T` | `73` | 190 → 73 | 1,900 → 73 | 9,500 → 73 |
| Pi | `91 + 329T` | `164 + 138T` | 420 → 302 | 3,381 → 1,544 | 16,541 → 7,064 |

Cadence additions remain explicit: first Gate-positive `+~131`; unchanged repeated Gate-positive `+0` after edge-triggering; changed route `+~11`; a new context epoch `+~73`; Pi nonblank input retains `+~138`. Variable blocks remain excluded. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-015.md:7-45]

## 8. Redundancy and Staleness Assessment

The 759-character directive suffix is invariant and dominates ordinary turns. Advisor scoring already suppresses empty, navigation, casual, and below-threshold prompts, but valid transports substitute the full suffix when no brief renders; compute gating therefore does not currently produce context gating. The advertised advisor caps cover route text before suffix concatenation, not total payload. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/data/prompt-policy.default.json:3-90] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/prompt-policy.ts:99-194] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:174-215]

Gate 3 has real per-prompt value, but its relay cadence is broader than “once per session until answered”: later positive turns can repeat the same question while state remains open. Suppress identical relay delivery, not classification or enforcement. Continuity and goal text can become stale when repeated unchanged; dynamic snapshots need source, time, scope identity, and epoch invalidation. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-989] [SOURCE: .opencode/plugins/mk-goal.js:2560-2590]

OpenCode's advisor cache and similar bridge caches remove computation but not context. A cache hit still appends the text. Likewise provider prompt-cache hits may reduce latency or billed uncached work, but cached tokens remain input/context occupancy and, for OpenAI, retain TPM accounting. [SOURCE: .opencode/plugins/mk-skill-advisor.js:700-752,777-866] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching]

## 9. Primary-Source Best Practices

OpenAI and Anthropic recommend a stable prefix: static tools, policy, and examples before volatile messages/state; cache reuse depends on exact prefix identity. Cursor distinguishes Always, file-attached, agent-requested, and manual context. Devin recommends small, workflow-specific knowledge with relevance triggers and warns that broad or stale items mislead. The portable principle is therefore **compact universal policy per context epoch; relevance-gated current-turn decisions; lifecycle/mutation-driven state; volatile identity, scores, routes, and timestamps after the stable prefix**. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [SOURCE: https://docs.cursor.com/context/rules-for-ai] [SOURCE: https://docs.devin.ai/product-guides/knowledge] [SOURCE: https://docs.devin.ai/product-guides/session-insights]

These sources support placement and retrieval strategy, not a universal cache API. Provider/host capabilities differ, and no adapter gets cache-savings credit without host traces exposing prefix order and usage fields. **Prompt-cache benefits do not reduce context occupancy:** cached reads remain input tokens.

## 10. Proposed Cross-Runtime Delivery Contract

Each producer returns a versioned decision record: `{blockId, semanticHash, contextEpoch, channel, cadence, content, enforcementState}`. Classification and enforcement remain independent of whether content is delivered. Delivery state advances `UNSEEN → DELIVERED(hash, epoch) → SUPPRESSED_SAME`; a semantic content change marks the block dirty, and lifecycle, compaction, scope, policy, or goal changes advance the epoch. Unknown sessions never share dedup state. A block is acknowledged only after the runtime forms a host envelope. [INFERENCE: based on `.opencode/plugins/mk-spec-memory.js:455-505`, `.opencode/plugins/mk-goal.js:2560-2590`, and iteration 14]

Runtime mapping:

- Claude/Codex/Devin: lifecycle capsule at SessionStart and after recovery; current-turn advisor/Gate decisions remain prompt-scoped.
- Cursor: use Always versus scoped rule modes; do not assert prompt-hook delivery until editor capture exists.
- OpenCode: add session/context-epoch delivery markers because `session.created` prepares state rather than emitting context.
- Pi: send stable policy/state through hidden lifecycle messages; retain the Pi dispatch guard in visible rewrites; reset dedup after compaction.

## 11. Ranked Recommendations

| Rank | Class | Recommendation | Expected effect / preservation |
|---:|---|---|---|
| 1 | Conditionalize | Emit nothing for advisor no-match, below-threshold, or error; keep diagnostic outcomes | Removes the recurring ~190 estimate on ordinary no-route turns without weakening thresholds |
| 2 | Consolidate | Replace three repeated directives with the 292-character lifecycle capsule, refreshed after compaction/recovery | 61.6% smaller policy text and once-per-epoch delivery; retain fallback until lifecycle proof exists |
| 3 | Conditionalize | Deliver advisor text only when passing route labels, freshness, or source signature change | Preserves prompt-specific routing; changed route costs ~11 instead of the full suffix payload |
| 4 | Conditionalize | Edge-trigger Gate relay while keeping open-state mutation enforcement | Removes unchanged repeated +~131 questions; preserves first trigger, invalid-answer, scope-change, and recovery re-asks |
| 5 | Consolidate | Refresh continuity and goals only on lifecycle, mutation, or compaction | Reduces stale repeated state; add identity and epoch checks |
| 6 | Cache/place | Put stable policy before volatile state and add provider-specific breakpoints only where supported | May improve latency/cost; **does not reduce context occupancy** |
| 7 | Drop | Remove legacy literal producers only after dual-render parity and installed-consumer migration | Avoids drift without breaking proxies/tests |

[SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-015.md:47-75]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat adapters, registrations, README prose, or successful computation as delivery proof | Ownership, reachability, and host delivery are distinct; Cursor and installed Codex demonstrate drift | Runtime registrations, executable adapters, Cursor probes, Codex installer check | 1–6, 8, 11–15 |
| Count maintenance, prebind, raw dispatch capture, UI advisories, shutdown, dormant code-graph helpers, or Gate deny as ordinary model context | These are state mutation, stderr/UI, no-op, unreachable, or boundary-only paths | Hook contracts and cited source branches | 2–4, 7, 12 |
| Treat shell resolver warnings as every internal adapter failure | Most internal failures fail open with exit zero; shell `||` is not reached | Codex/Devin shared adapter error paths | 3, 5 |
| Measure unreachable lifecycle variants or impose one identical SessionStart matrix | Cursor forces startup, Pi narrows reasons, OpenCode has no equivalent envelope, Devin/Pi have native compact paths | Lifecycle translators and adapters | 4, 8 |
| Assume plugin/extension filename or package order is model-context order | No explicit host ordering contract was found | OpenCode/Pi plugin documentation and source | 6–7 |
| Treat `session.created`, bridge cache hits, or advisor cache hits as one-time delivery/token dedup | Preparation and computation caching still lead to repeated transform insertion | OpenCode memory/advisor transforms | 6, 8–9 |
| Move advisor selection or Gate 3 entirely to SessionStart | Both depend on the current prompt; this changes behavior | Prompt policy, classifier, and shared Gate core | 8–9, 11, 13–14 |
| Lower routing confidence/uncertainty thresholds | Increases weak routing and does not address invariant suffix repetition | Prompt-policy and scoring layers | 9 |
| Treat the 80/120 advisor cap as total payload size | The 759-character suffix is appended after capping | `render.ts` | 9 |
| Delete all directives because root policy overlaps | Lifecycle retention and compaction behavior are not uniformly proven; guardrails need behavioral replacements | Root policy and six runtime transports | 10 |
| Use exact-string tests as the primary guardrail | Presence does not prove behavior | Existing tests and enforcement analysis | 10 |
| Require an unconditional negative control | Root policy limits negative control to safe and practical cases | Root proof policy | 10 |
| Delete Gate 3 because policy prose overlaps | Loses machine-timed relay and session enforcement state | Classifier/core state machine | 11 |
| Use time-only, prompt-text-only, or global dedup; treat suppression as Gate satisfaction | Can suppress legitimate scope changes or cross-session delivery; delivery state is not enforcement state | Gate and reduction-state analysis | 11, 14 |
| Report exact model-token totals | Tokenizer vocabularies and provider serialization were unavailable | Failed `tiktoken` probe; estimator contract | 12, 15 |
| Fold continuity, goal, compact recovery, compiled-route, warnings, or maintenance into fixed totals | Payloads are variable or model visibility is unproven | Fixture inventory | 12, 15 |
| Claim Cursor configured/editor savings from CLI probes | Only zero-delivery CLI behavior was observed; editor behavior is unknown | Cursor live-fire records | 4, 11–12, 14–15 |
| Re-run unchanged Cursor CLI probes | No new version or editor capture means no new evidence | Probe history | 4 |
| Use a universal provider-cache API or place volatile state in the cacheable prefix | Hosts/providers differ; volatile prefixes destroy exact reuse | OpenAI, Anthropic, Cursor, Devin primary sources | 13–14 |
| Treat cache hits as context-window reduction or claim live cache percentages | Cached reads remain input; host usage telemetry is absent | Provider docs and adapter source | 6, 9, 13–15 |
| Delete legacy producers immediately | Proxies, installed copies, and exact-output tests still consume them | Cross-runtime dependency inventory | 14 |
| Remove Pi's dispatch guard | No equivalent native enforcement was established | Pi owner and failure behavior | 7, 14–15 |
| Remove the first Gate trigger | Only unchanged re-delivery is redundant; first relay is required | Gate state/cadence fixtures | 11, 15 |
| Continue detached iterations after 15 | Stop policy is maximum iterations; further work requires new live evidence, not another static pass | Strategy and state log | 15 |

This table consolidates all iteration `Ruled Out` records and `Dead Ends`; repeated formulations are grouped by common failure mode while retaining their iteration coverage.

## Divergence Map

The registry records **0 started pivots, 0 completed pivots, 0 failed pivots, and 0 overrides**. No formal saturated directions or remaining frontier entries were written. In substantive terms, static architecture, fixed-literal measurement, cadence design, and provider-policy comparison are saturated: another source-only pass is unlikely to change them. The remaining frontier is empirical—live Cursor editor capture, current Devin capture, six-host envelope/prefix traces, provider cache-usage fields, and tokenizer-available measurements. Those are evidence gaps, not pivots. [SOURCE: findings-registry.json `divergence`] [SOURCE: deep-research-dashboard.md: Graph/Trend and Divergent Pivots]

## 12. Open Questions

1. Does the current Cursor editor emit the configured `beforeSubmitPrompt` hooks, in what order, and with what model visibility?
2. Do current Codex/Devin/Pi/OpenCode hosts preserve the inferred stable-prefix and cross-extension/plugin order?
3. What are provider-tokenizer counts including host message serialization once vocabularies and exact envelopes are available?
4. What cache hit rates, latency deltas, and billed-token deltas appear in host usage telemetry? These must remain separate from context occupancy.
5. Which variable continuity, goal, recovery, compiled-route, and warning payload distributions occur in representative sessions?

The registry still labels four legacy key questions open despite iterations 12–15 materially answering them with estimator-qualified and configured/observed-qualified results. This synthesis preserves that registry fact without editing registry state.

## 13. Guardrail-Preservation Requirements

- Preserve routing confidence `>=0.8`, uncertainty `<=0.35`, ambiguity handling, stale/fresh status, and fail-open diagnostics.
- Preserve first Gate 3 relay, open/satisfied/skipped enforcement state, invalid-answer re-ask, explicit task/scope-change re-ask, recovery reset, and child/disabled/error silence.
- Never share unknown-session dedup state; key delivery by session, context epoch, block, semantic hash, and scope generation.
- Preserve comment-hygiene enforcement with real forbidden-comment rejection, not only string presence.
- Preserve proof requirements with unsupported-completion blocking; keep negative controls conditional on practicality and safety.
- Preserve Pi's dispatch directive until equivalent native enforcement is observed.
- Treat successful computation, cache lookup, or state transition as insufficient until the host envelope is formed and acknowledged.
- Keep legacy renderers during migration until every adapter, installed copy, and exact-output consumer passes parity.

## 14. Verification Plan

1. **Exact text:** byte/character parity for legacy and compact fixtures; label every token number as `ceil(chars/4)` until exact tokenizer evidence exists.
2. **Six-adapter envelopes:** capture first, same, changed, no-match/error, and context-reset behavior for Claude, Codex, Cursor editor, Devin, OpenCode, and Pi.
3. **Isolation/reset:** test startup, resume, clear, compact, scope change, policy change, missing session ID, parallel sessions, and unknown-session non-sharing.
4. **Advisor matrix:** live/stale single, live/stale ambiguous, below threshold, directives-only legacy, error, changed signature, and unchanged signature.
5. **Gate matrix:** read-only, first positive, repeated unchanged positive, invalid answer, valid A–E answer, new task/scope, recovery, enforcement denial, child bypass, disabled, and error.
6. **Behavioral guardrails:** reject a real forbidden code comment; block an unsupported completion; verify governor behavior with scored scenarios rather than exact strings.
7. **State blocks:** verify goal/continuity mutation refresh, stale/mismatched rejection, OpenCode first/subsequent transforms, and Pi failure with dispatch retained.
8. **Host/cache evidence:** record actual prefix order and provider usage fields; report cache effects only as latency/cost unless context accounting proves otherwise.

## 15. Rollout and Rollback

Roll out per block behind dual-render comparison: (1) decision records and telemetry, (2) advisor fallback conditionalization, (3) lifecycle policy capsule, (4) changed-route delivery, (5) Gate relay edge triggering, (6) continuity/goal epochs, (7) stable-prefix placement, then (8) legacy deletion after all consumers migrate. Start with a runtime whose lifecycle delivery is observed, then expand only after envelope and behavioral parity.

Rollback is block-local: restore the legacy renderer/delivery path if any semantic change is missed, epoch reset fails, unknown sessions share state, envelope acknowledgement is absent, configured/installed parity breaks, or a guardrail regression occurs. Provider-cache tuning can be disabled independently because it is not part of correctness or context reduction.

## 16. References and Resource Map

Canonical repository evidence:

- Advisor owner: `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts`
- Advisor lifecycle/transports: `.opencode/skills/system-skill-advisor/hooks/{claude,pi}/`
- Gate classifier/core: `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`; `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs`
- Lifecycle owner: `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts`
- Registrations: `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`
- OpenCode transforms: `.opencode/plugins/mk-skill-advisor.js`, `mk-spec-gate.js`, `mk-spec-memory.js`, `mk-goal.js`
- Pi discovery/transport: `.pi/extensions/README.md`, Pi advisor/Gate/goal hooks
- Audit evidence: `iterations/iteration-001.md` through `iteration-015.md`, `deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, and `resource-map.md`

Primary external sources: [OpenAI Prompt Caching](https://developers.openai.com/api/docs/guides/prompt-caching), [Anthropic Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), [Cursor Rules](https://docs.cursor.com/context/rules-for-ai), [Devin Knowledge](https://docs.devin.ai/product-guides/knowledge), and [Devin Session Insights](https://docs.devin.ai/product-guides/session-insights). The lineage `resource-map.md` records the consulted source map and iteration coverage.

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Iterations completed: **15**
- Last three new-information ratios: **0.86, 0.85, 0.85**
- Average new-information ratio: **0.9387**
- Convergence threshold: **0.05**
- Policy interpretation: convergence telemetry was observational only because the strategy required the maximum 15 iterations; the run did not stop for convergence.
- Pivots: none started, completed, failed, or overridden.
- Remaining evidence gaps: exact provider tokenizer counts; provider-specific serialization; live Cursor editor delivery; current live Devin behavior; current Codex installed-path remediation outcome; Pi/OpenCode aggregate ordering; host prefix traces; provider cache usage; and representative variable payload distributions.

The static architecture, ownership, fixed literal measurements, cadence algebra, and recommended delivery contract are well supported. Live-host and provider-cache claims remain deliberately unmade.
