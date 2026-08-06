# Iteration 6: Skill-advisor brief as a per-prompt payload

## Focus

Audited the skill-advisor payload from prompt policy and multi-lane scoring through threshold/ambiguity filtering, renderer caps, runtime hook fallbacks, OpenCode compiled-route expansion, and exact-prompt caches. The selected interpretation is model-visible payload cost and repetition across all six configured runtimes; internal scorer cost is discussed only where it changes payload freshness or reuse.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority was restricted to `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **The scorer can inspect the full skill projection, but the shared payload exposes only one skill—or two on an ambiguity path.** Fusion scores every `projection.skills` entry, applies explicit/lexical/derived/semantic and post-fusion overrides, then returns passing recommendations unless an internal caller requests all candidates. Hook and bridge calls request `topK: 3`, but `renderAdvisorBrief()` prints only the first passing label; it prints the second only when the cap exceeds 80 and ambiguity evidence exists. It never injects descriptions, reasons, prompt text, attribution, abstain reasons, or the full skill list. The shared-payload provenance may retain up to eight sorted skill source references internally, but those references are not part of `additionalContext`. This makes “skill-list bloat” a scoring/metadata concern, not ordinary model-visible text bloat. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:650-867] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:157-215] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts:245-287]

2. **Thresholding is dual-gated and repeated at several boundaries; no-match still injects 763 bytes through the hook wrapper.** The default contract requires confidence at least 0.80 and uncertainty at most 0.35 unless `confidenceOnly` is set. Fusion computes `passes_threshold`; producer and renderer defensively re-filter; OpenCode native and CLI bridges reconstruct the same test. Low-information ambiguity and broad/multi-concern prompts can raise uncertainty and convert otherwise passing candidates into abstention. When no recommendation survives, `renderAdvisorBrief()` returns `null`; Claude’s canonical handler—and therefore its Codex/Cursor/Devin/Pi consumers—replaces that null with the fixed directives fallback. OpenCode likewise appends its fallback on missing prompt, skipped/no-brief, or bridge failure. Thus “no match” is not zero bytes on any executing shared advisor path: it is 763 bytes/759 UTF-16 units/estimated 190 tokens, while only disabled/non-delivering hooks are zero. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/compat/contract.ts] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:760-867] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts:145-181] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:203-244] [SOURCE: .opencode/plugins/mk-skill-advisor.js:778-862]

3. **The nominal 80/120-token cap bounds only the advisor prefix, not the per-prompt payload.** The renderer clamps to 1-120 estimated tokens at four UTF-16 units/token, uses at most 80 for the normal prefix and 120 for an ambiguity prefix, then concatenates the uncapped 759-unit directive capsule. Direct execution of the compiled renderer measured: shortest valid synthetic brief 800 B/796 units/est. 199 tokens; representative `sk-code 0.95/0.05` 806 B/802 units/est. 201; an 80-cap long label 1,084 B/1,080 units/est. 270; and a 120-cap two-label ambiguity 1,141 B/1,137 units/est. 285. The theoretical source-renderer ceiling is about 1,243 UTF-16 units before multi-byte variation (`480` capped prefix units plus `763` concatenated payload characters including separators), consistent with iteration 3’s 1,244-byte configured ambiguity measurement. Calling these whole-brief “80/120-token caps” is stale/misleading. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-89] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163-215] [SOURCE: local execution of dist `renderAdvisorBrief()` and repository-native `ceil(UTF-16/4)` measurement, 2026-08-06] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-003.md]

4. **Ambiguity expands the payload only after scoring has preserved at least two passing candidates; abstention and ambiguity are deliberately different.** `isAmbiguousTopTwo()` is computed over ranked candidates, while low-information ambiguity may floor uncertainty above the strict threshold and leave no visible recommendation. Producer cap selection uses ambiguity among filtered recommendations; OpenCode native/CLI bridges instead set 120 from the response-level `data.ambiguous`, then rendering still requires a second passing recommendation. Consequently an ambiguous scorer result may produce either a two-label 120-cap brief or no advisor line plus fallback directives. This is defensible but subtle: response-level ambiguity does not guarantee a model-visible disambiguation. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/ambiguity.ts:17-54] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:771-867] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts:145-213] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:577-643]

5. **Compiled routing and route hints are additive OpenCode-only expansion outside both renderer caps and the plugin’s brief clamp.** The native bridge finds the first recommendation carrying `compiledRoute`, reduces it to outcome, hub, targets, authority, fingerprint, and generation, and returns that summary as metadata. `appendAdvisorBrief()` pushes the clamped advisor brief first, then `renderCompiledRouteSummaryLine()` pushes `Compiled routing ... targets=${targets.join(',')}` as a separate system entry. The summary adds no new target—the bridge says it reports the served decision—but `targets` has no item-count or character cap. Synthetic measurements were 74 B/est. 19 tokens for no targets, 77 B/20 for one short target, and 679 B/170 for twenty 29-character targets; the maximum remains unbounded by inspected code. Shared Claude/Codex/Cursor/Devin/Pi transport does not render this line, and the Python subprocess interface merely preserves an optional summary without appending it. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:531-662] [SOURCE: .opencode/plugins/mk-skill-advisor.js:97-114] [SOURCE: .opencode/plugins/mk-skill-advisor.js:849-855] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/subprocess.ts:13-48] [SOURCE: local compiled-summary string measurement, 2026-08-06]

6. **Warm/cold fallback changes routing work, but normal failures converge on the same large directives-only model payload.** The canonical prompt handler first builds through the local producer/Python subprocess and tries the CLI fallback only for `fail_open`, or degraded+unavailable, with no existing brief. That CLI path is explicitly `--warm-only`, probes a short `/tmp` socket, and returns retryable failure rather than cold-starting a daemon. OpenCode’s bridge prefers colocated native modules, treats a live/stale graph as serveable even when the daemon axis is unavailable, then probes the same warm-only CLI before failing open; its retired legacy local route no longer serves recommendations. In this iteration the repository CLI probe returned exit 75 with `connect EPERM ... daemon-ipc.sock`, confirming the warm daemon was unavailable in this sandbox. The hook-visible consequence remains fallback directives (763 B/190 estimate), not the small 95 B/24-estimate `renderAdvisorTimeoutFallback()`; that timeout renderer exists as a separate companion but is not used by the inspected canonical prompt wrapper. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:203-244] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:135-286] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:500-520] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:748-920] [SOURCE: local `skill-advisor.cjs advisor_recommend --warm-only` exit 75, 2026-08-06]

7. **Cross-turn memoization avoids recomputation, not context duplication.** The shared producer has an in-memory exact-prompt cache with five-minute TTL and 1,000-entry bound. Its opaque key covers canonical prompt, source signature, runtime, max tokens, and full threshold config; graph-generation invalidation clears it, source-signature change invalidates stale entries, and deleted graph-backed skills invalidate hits. OpenCode independently keys by session ID plus prompt hash, confidence threshold, max tokens, source signature, workspace root, and compiled-serving signature; it uses TTL/LRU and in-flight promise dedup. These are sound anti-staleness measures for results. Neither cache stores “already shown to the model,” however: a hit is returned and appended again on the next identical turn/transform. There is no cross-turn emitted-brief hash, first-turn marker, semantic near-duplicate payload suppression, or post-compaction re-injection policy in the inspected path. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/prompt-cache.ts:1-140] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts:43-46] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts:452-548] [SOURCE: .opencode/plugins/mk-skill-advisor.js:340-351] [SOURCE: .opencode/plugins/mk-skill-advisor.js:685-754]

8. **The safest reduction is to separate routing signal from evergreen guardrails, then condition and deduplicate each by its own semantics.** Preserve a compact first delivery whenever a passing route changes; cache the last emitted tuple `(source/compiled signature, top label, confidence/uncertainty bucket, ambiguity/targets digest)` per session and suppress byte-identical repeats until that tuple changes or a compaction/session-reset signal demands refresh. Emit no advisor line on true abstention, because “no route” carries no routing value; preserve required guardrails through their own trigger/startup/terminal mechanisms rather than smuggling 763 bytes through every no-match/error. Cap compiled targets by count and whole-line characters, or replace them with a count+digest unless the decision is `clarify`. A lower-risk first trim is to replace the 43-byte representative advisor line plus 763-byte capsule with a route-only line on matched turns and retain the existing capsule only at first session delivery/explicit refresh: representative recurring cost falls from 806 B/201 estimated tokens to 43 B/11, a 94.7% reduction for that block. This proposal requires controlled compaction and guardrail false-negative tests before implementation. [INFERENCE: based on findings 1-7 and iteration 4’s directive preservation requirements] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-004.md]

## Representative Payload Matrix

| Advisor outcome | Shared hook payload | OpenCode additive payload | Value / staleness |
|---|---:|---:|---|
| Hook disabled or Cursor non-delivery | 0 B | 0 B when plugin disabled | Correct zero-cost path |
| No match / policy skip / failure with executing wrapper | 763 B / est. 190 | 763 B fallback | No routing value; guardrail-only repetition |
| Short valid match | 800 B / est. 199 | same, then optional compiled line | One useful label; capsule dominates |
| Representative `sk-code` match | 806 B / est. 201 | same, then optional compiled line | Route prefix is 43 B / est. 11 |
| Normal prefix at 80-cap ceiling | about 1,084 B / est. 270 observed synthetic | brief clamp up to 2,048 chars | Label-length growth, little added routing value |
| Ambiguous two-label example | 1,141 B / est. 285 observed synthetic | same plus optional compiled line | Useful only if both candidates pass |
| Compiled route line | n/a | 74 B minimum; 77 B one target; 679 B synthetic 20-target example; no finite max | Useful served-route proof, uncapped expansion |

## Safe Trim / Conditional / Cache Options

1. **Route-only recurring line:** keep `Advisor: ... use/ambiguous ...`; move the three directives to their own lifecycle/trigger policy. Largest measured recurring saving, but requires iteration 4’s compaction and enforcement preservation tests.
2. **No-match means no advisor payload:** distinguish advisor abstention/failure from independent guardrail delivery. Avoids paying 763 B when routing contributes nothing.
3. **Per-session emitted-tuple dedup:** reuse existing source and compiled signatures plus a route digest; refresh on changed route, invalidation, session reset, or verified compaction event. Existing caches supply freshness inputs but not delivery state.
4. **Bound compiled summary:** cap whole line and target count; prefer `targets=<count>:<digest>` except when actual target names enable a required clarification.
5. **Correct cap naming/telemetry:** report prefix cap and whole-payload bytes separately. Current 80/120 token terminology obscures the dominant uncapped suffix.

## Ruled Out

- Treating `topK: 3` or the full projection as three/all skills injected: the normal renderer emits one label, ambiguity emits two.
- Treating a no-match or daemon failure as zero model context: executing wrappers inject the 763-byte directives fallback.
- Treating exact-prompt caches as cross-turn payload dedup: cache hits are still appended.
- Treating the 80/120 token cap as a whole-brief cap: directives and OpenCode compiled summary sit outside it.
- Treating compiled-route targets as cross-runtime payload: the separate human-readable line is OpenCode-specific.
- Treating the local warm-CLI failure as proof that production daemons are generally cold: it is one sandbox observation; source behavior, not availability frequency, supports the fallback finding.

## Dead Ends

- The warm daemon could not be queried in this sandbox (`EPERM`, exit 75). Source-level native/CLI normalization and synthetic renderer execution supplied adequate payload evidence; retrying the same socket would add no information.
- Exact model tokenizer vocabularies remain unavailable. Repository-native `ceil(UTF-16/4)` estimates are retained and explicitly labeled.

## Edge Cases

- Ambiguous input: “skill lists” could mean scorer candidates, shared-payload source refs, or model-visible labels; all three are separated.
- Contradictory evidence: the API calls request top three recommendations, but the prompt renderer exposes one or two; this is representation layering, not a runtime contradiction.
- Missing dependencies: no live combined envelope for all six runtimes, no compaction event trace, and no available warm daemon in this sandbox.
- Partial success: exact source/compiled renderer costs and cache/fallback paths are established; production cache-hit rates and behavioral effects of suppression remain unmeasured.

## Negative Knowledge

- No full skill inventory, recommendation reasons, prompt echo, attribution, or abstain-reason list is injected by the canonical renderer.
- No code evidence shows cross-turn model-visible brief deduplication or semantic near-duplicate suppression.
- No inspected path uses cache hit as a reason to omit `additionalContext`.
- No finite maximum exists for OpenCode’s separate compiled targets line in the inspected renderer.
- No evidence shows the 95-byte timeout marker replacing the canonical hook’s 763-byte fallback on ordinary prompt-path failure.
- No evidence supports startup-only guardrail delivery surviving compaction across all six runtimes.
- No production frequency data establishes how often ambiguity, compiled targets, cache hits, or warm fallback occur.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-215`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts:43-548`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/prompt-cache.ts:1-140`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/prompt-policy.ts:65-194`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:650-867`; `scorer/ambiguity.ts:17-54`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/subprocess.ts:13-170`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:150-252`
- `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:135-286`
- `.opencode/plugins/mk-skill-advisor.js:97-114`, `:240-351`, `:685-862`
- `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:320-920`
- Local compiled-renderer and compiled-summary measurements; local warm-only CLI probe, 2026-08-06
- Iterations 003-004 for the prior quantitative baseline and directive preservation requirements

## Assessment

- New information ratio: 0.94 (`(7 fully new + 0.5 × 1 partially new) / 8 = 0.9375`, rounded; no simplicity bonus)
- Novelty justification: Seven findings add scoring-to-payload, ambiguity, compiled-route, fallback, and cache/dedup evidence; one partially refines the prior size baseline into safe conditional/cache options.
- Questions addressed: How does the advisor payload expand, cap, fallback, cache, repeat, and vary across runtime transports?
- Questions answered: Source-level model-visible label count, no-match behavior, min/representative/capped costs, OpenCode-only uncapped expansion, and recomputation-versus-delivery caching are established.

## Reflection

- What worked and why: tracing the typed recommendation through each filtering and rendering boundary prevented internal `topK`/metadata from being mistaken for prompt payload, while compiled renderer execution gave reproducible byte estimates.
- What did not work and why: the warm daemon probe was unavailable under sandbox IPC permissions, so observed live recommendation shape and cache-hit telemetry could not be sampled.
- What I would do differently: instrument one controlled session per working runtime with exact emitted-context hashes, scorer cache-hit flags, route changes, and a compaction boundary.

## Recommended Next Focus

Obtain authoritative prompt-caching and instruction-placement guidance, then test a receipt matrix for route-only recurring lines, no-match silence, emitted-tuple dedup, and bounded compiled summaries. Measure first turn, identical repeat, changed route, advisor failure, source-generation change, and post-compaction refresh before ranking the final cross-runtime reductions.
