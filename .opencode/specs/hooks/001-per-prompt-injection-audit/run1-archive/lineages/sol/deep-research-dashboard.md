---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Reduce per-prompt injection bloat across all six runtime hook adapters (Claude Code, Codex, Cursor, Devin, OpenCode, Pi). Inventory every block injected on each user turn (skill-advisor brief, the three always-on directives comment-hygiene/governor/proof-over-appearance, the spec-gate Gate-3 question, the Pi-only subagent-dispatch directive, SessionStart context) with exact owning modules; quantify per-turn token cost and value vs redundancy/staleness; research best practices for per-turn injection (concision, conditional/threshold-gated injection, cross-turn deduplication, prompt-cache-friendly placement, one-time-vs-every-turn); propose ranked, cross-runtime-consistent reductions (trim, conditionalize, consolidate, cache, drop) that preserve guardrail effectiveness, with measured before/after token estimates.
- Started: 2026-08-06T06:20:23.920Z
- Status: COMPLETE
- Iteration: 15 of 15
- Session ID: fanout-sol-1785996968864-djujy4
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Shared hook architecture, user-turn/session cadence, six adapter entrypoints, and injected-block ownership boundaries | architecture | 1.00 | 5 | complete |
| 2 | Claude Code SessionStart and per-user-turn injection path, variants, ordering, fallbacks, and configured-versus-live behavior | claude-adapter | 1.00 | 7 | complete |
| 3 | Codex SessionStart and per-user-turn injection ownership, ordering, fallbacks, configured-versus-live drift, and token-measurement variants | codex-adapter | 1.00 | 7 | complete |
| 4 | Cursor SessionStart and per-turn injection ownership, ordering, conditions, fallback variants, configured-versus-dormant behavior, and token-fixture requirements | cursor-adapter | 1.00 | 7 | complete |
| 5 | Devin SessionStart and per-user-turn injection ownership, ordering, conditions, fallbacks, live/configured distinctions, token fixtures, and delivery semantics | devin-adapter | 1.00 | 7 | complete |
| 6 | OpenCode SessionStart preparation and per-turn system-transform injections, ownership, variants, ordering, fallbacks, live/configured distinctions, and cache/dedup semantics | opencode-adapter | 1.00 | 7 | complete |
| 7 | Pi SessionStart, visible input transforms, hidden sendMessage paths, per-turn ownership/conditions/fallbacks, Pi-only dispatch directive, and exact token fixtures | pi-adapter | 1.00 | 7 | complete |
| 8 | Cross-runtime SessionStart ownership, source variants, delivery cadence, stale-context risk, recurring-block overlap, session-only policy, and fixture matrix | cross-runtime-session-lifecycle | 0.74 | 7 | complete |
| 9 | Cross-runtime skill-advisor per-turn producer, rendering, thresholds, variants, duplication, staleness, and minimum useful payload | skill-advisor-payload | 0.92 | 6 | complete |
| 10 | Always-on comment-hygiene, governor, and proof-over-appearance directive ownership, value, drift, and consolidation | directive-policy | 0.93 | 7 | complete |
| 11 | Spec Gate 3 per-turn behavior across all six adapters: ownership, classifications, payloads, silence, repeat suppression, redundancy, risks, and safe dedup fixtures | spec-gate | 1.00 | 8 | complete |
| 12 | Empirical baseline token-cost matrix from exact source-owned fixtures across blocks, runtimes, and cadences | empirical-token-baseline | 0.93 | 7 | complete |
| 13 | Current primary-source best practices for concise, conditional, cross-turn-deduplicated, stable-prefix, lifecycle-scoped repeated injection translated to six hook adapters | primary-source-injection-policy | 0.86 | 7 | complete |
| 14 | Cross-runtime reduction architecture: decision/delivery separation, epoch/hash dedup, lifecycle placement, failure semantics, compatibility, and guardrail efficacy | reduction-architecture | 0.85 | 6 | complete |
| 15 | Final ranked quantitative recommendation set across six runtimes and five cadence cases | final-quantitative-ranking | 0.85 | 6 | complete |

- iterationsCompleted: 15
- keyFindings: 101
- openQuestions: 4
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/5
- [x] Which exact modules and event paths inject each block in each of the six runtime adapters?
- [ ] What is the measured per-turn token cost of every block and the aggregate cost per runtime? [legacy-import]
- [ ] Which injections remain valuable every turn, and which are redundant, stale, or better placed once per session? [legacy-import]
- [ ] What official or primary-source best practices govern concise, conditional, deduplicated, and prompt-cache-friendly injection? [legacy-import]
- [ ] Which ranked cross-runtime changes deliver the largest safe reduction, and what are the measured before/after estimates? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] What is the measured per-turn token cost of every block and the aggregate cost per runtime?
- [ ] Which injections remain valuable every turn, and which are redundant, stale, or better placed once per session?
- [ ] What official or primary-source best practices govern concise, conditional, deduplicated, and prompt-cache-friendly injection?
- [ ] Which ranked cross-runtime changes deliver the largest safe reduction, and what are the measured before/after estimates?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █████████▄▃▆▆▇▇▆▅▄▄▄
- score sparkline: █████████▄▃▆▆▇▇▆▅▄▄▄
- Last 3 ratios: 0.86 -> 0.85 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":285,"developers.openai.com":1,"docs.cursor.com":1,"docs.devin.ai":2,"other":4,"platform.claude.com":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Treating adapter files as independent content owners. (iteration 1)
- Treating registration as proof of delivery. (iteration 1)
- Counting the dormant code-graph merge helper: it has no caller in either current source or configured compiled shim. (iteration 2)
- Counting the SessionStart maintenance commands as deliberate prompt blocks: their registrations are real, but only `session-prime` uses the repository's context formatter; runtime capture is required to determine whether incidental stdout becomes visible. (iteration 2)
- Treating `renderAdvisorTimeoutFallback()` as a Claude variant: the Claude hook uses CLI fallback followed by the directives-only fallback, with no call to that renderer. (iteration 2)
- Counting adapter-internal failures as resolver warnings; most adapter failures exit zero silently, so shell `||` is not reached. (iteration 3)
- Treating repository `.codex/hooks.json` as proof of currently installed behavior; the outbound global file is authoritative and is drifted. (iteration 3)
- Treating the SessionStart maintenance commands or third-party installed hooks as deliberate Spec Kit context without captured output. (iteration 3)
- Counting prebind or maintenance checks as intentional model context: their contracts are state mutation or stderr-only advisory output. (iteration 4)
- Counting the registered `beforeSubmitPrompt` entries as current CLI token cost: registration and standalone executability do not establish host delivery. (iteration 4)
- Measuring Cursor resume/clear/compact SessionStart variants: the Cursor translator hard-codes `source: 'startup'`, making those owner branches unreachable through this adapter today. (iteration 4)
- Repeating the same tested CLI-build probe without a version change adds no evidence; re-probe when Cursor changes or when editor capture is available. (iteration 4)
- Source-only inspection cannot resolve editor delivery or prove model visibility of `sessionStart.agent_message`; those require host capture. (iteration 4)
- Assuming local plugin filename order is a guaranteed model-context order without a live host capture. (iteration 6)
- Treating `session.created` itself as a model-context envelope; it prepares caches/state and later transforms deliver text. (iteration 6)
- Treating advisor cache hits as token deduplication; the cached brief is still pushed on every transform. (iteration 6)
- Counting dispatch raw-input capture as injected text; it always returns `continue`. [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:224-235] (iteration 7)
- Counting SessionStart advisories or session shutdown as model context. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts:24-37] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-stop-context.ts:10-27] (iteration 7)
- Treating `.pi/settings.json` package order or raw directory enumeration as the project-extension handler order; neither is an explicit registration contract. [SOURCE: .pi/settings.json:25-33] [SOURCE: .pi/extensions/README.md:14-28] (iteration 7)
- A single identical SessionStart matrix for all six runtimes: Cursor and Pi intentionally narrow shared source reachability, OpenCode has no equivalent model-context envelope, and Devin/Pi have native post-compaction paths. (iteration 8)
- Moving advisor selection or Gate 3 entirely to SessionStart: both depend on the current prompt, so session-only placement would change behavior rather than remove redundancy. (iteration 8)
- Treating adapter registration as proof that a host emits every source variant. Static source proves reachability, while host transcript capture is still required for Codex/Devin source frequencies and Cursor editor delivery. (iteration 8)
- Treating OpenCode `session.created` as proof that continuity is delivered once. It only prepares runtime state; delivery remains in the repeated system transform. (iteration 8)
- Lowering or bypassing confidence/uncertainty thresholds: this increases low-quality routing and does not address the invariant suffix. (iteration 9)
- Moving prompt-dependent selection wholly to SessionStart: the selected skill depends on current user text. (iteration 9)
- Treating prompt-result or bridge caching as context deduplication: cached text is still appended. (iteration 9)
- Using the 80/120 caps as total payload caps: `capText()` applies before directives are concatenated, so the 760-character suffix sits outside that cap. (iteration 9)
- Deleting all directives merely because root policy overlaps: host loading and compaction retention are not uniformly proven. (iteration 10)
- Exact-string tests as the main guardrail: they prove presence, not behavior. (iteration 10)
- Unconditional “watch it fail”: root policy explicitly limits negative controls to practical, safe cases. (iteration 10)
- Deletion because AGENTS.md overlaps: loses machine-timed relay and open state. (iteration 11)
- SessionStart-only Gate 3: classification depends on the current turn. (iteration 11)
- Time-only or prompt-only deduplication: can suppress a legitimate scope change. (iteration 11)
- Treating Cursor registration as observed delivery. (iteration 11)
- Adding Gate deny text to user-turn cost: it is emitted only at a blocked mutation boundary. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:114-119] (iteration 12)
- Assigning exact totals to continuity, goal, compact recovery, or OpenCode compiled-route lines without a captured payload. (iteration 12)
- Counting Cursor configured prompt hooks as observed CLI traffic, or adding SessionStart maintenance commands without captured model-visible output. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-004.md:7-13] (iteration 12)
- Reporting `tiktoken` counts: the package was installed but both OpenAI vocabularies required an unavailable network fetch; estimator results are not relabeled as tokenizer output. [SOURCE: command `python3` tiktoken probe] (iteration 12)
- A universal provider-cache implementation across all six adapters. Provider, model, host transport, prefix ordering, breakpoints, and usage visibility differ; the portable contract is stable-first ordering plus semantic dedup, not a single cache API. (iteration 13)
- Claiming cache hits for any adapter from source ordering alone: host/API cache controls and usage fields are not exposed in the inspected adapter sources. (iteration 13)
- Moving all current-turn classification to SessionStart: Cursor and Devin first-party designs instead distinguish always-on from relevance-triggered context. (iteration 13)
- Repeating dynamic state inside the cacheable prefix: exact-prefix hashing makes volatile pre-breakpoint content destroy reuse. (iteration 13)
- Treating provider prompt caching as removal from the context window: both providers count cached reads in total input accounting, and OpenAI retains TPM impact. (iteration 13)
- A universal cache API: provider and host controls differ, and cache reads remain input tokens. (iteration 14)
- Claiming Cursor or provider-cache savings without host delivery/usage evidence. (iteration 14)
- Immediate deletion of legacy string producers: multiple proxies, installed copies, and exact-output tests still consume them. (iteration 14)
- Lifecycle-only advisor or Gate classification: both depend on current prompt semantics. (iteration 14)
- Prompt-text-keyed or global dedup: it grows with prompt cardinality and can suppress required context across sessions/scopes. (iteration 14)
- Treating duplicate-question suppression as Gate satisfaction. (iteration 14)
- Treating successful computation/cache lookup as proof that content reached the model. (iteration 14)
- Counting Cursor's configured editor hook as observed savings; only the zero-delivery CLI probes are observed. (iteration 15)
- Exact model-token totals remain blocked on an available tokenizer vocabulary and provider-specific serialization. (iteration 15)
- Folding variable continuity, goal, compiled-route, recovery, warning, or maintenance output into exact fixed totals. (iteration 15)
- Live provider-cache percentages remain blocked on host traces and cache usage telemetry. (iteration 15)
- No further detached-lineage iteration is recommended: this is the configured maximum iteration, not a convergence stop. (iteration 15)
- Removing Pi's dispatch guard without equivalent native enforcement. (iteration 15)
- Reporting provider cache reuse as context-window reduction. (iteration 15)
- Treating one first Gate trigger as removable; only unchanged re-delivery is suppressed. (iteration 15)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Follow up on: **Provider cache savings are explicitly outside the context-window totals.** Stable-prefix ordering may reduce billed uncached work and latency, but cached reads remain input tokens and OpenAI retains TPM accounting....

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
