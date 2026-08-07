# Iteration 6: OpenCode Hook/Plugin Adapter Audit

## Focus
Audit the OpenCode adapter end to end: local-plugin discovery, `session.created` preparation, per-model-call `experimental.chat.system.transform` output, content owners and variants, ordering/deduplication, failure behavior, and the fixture set needed for token measurement. “SessionStart” is interpreted as context prepared by `session.created` and delivered on a later system transform; OpenCode has no separate `SessionStart` envelope in this plugin surface.

## Route Proof
- Resolved route: `mode=research target_agent=deep-research`; artifact root `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`; iteration `6`.
- Executor: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`.

## Findings
1. The configured OpenCode surface is the repository-local `.opencode/plugins/` directory, which OpenCode discovers automatically; its directory inventory is authoritative. The installed OpenCode is `1.18.11`, and the global config adds only `@whisperopencode/push`, so the repository plugins are the relevant configured adapters, but this iteration did not capture a live exported model request. [SOURCE: .opencode/plugins/README.md:14-18] [SOURCE: /Users/michelkerkmeester/.config/opencode/opencode.json:1-8] [SOURCE: command `opencode --version` => `1.18.11`]
2. OpenCode has no Claude-style one-shot SessionStart context adapter. `session.created` prepares state: `mk-spec-memory` only marks runtime ready; `mk-goal` restores an active goal; `mk-dist-freshness-guard` refreshes cached diagnostics; `session-cleanup` runs guards and stores warnings. Actual model text is appended on a subsequent system transform: continuity on every transform when available, active goal on every transform while active, stale-dist warning on every transform while diagnostics remain nonempty, and startup-cleanup warning once because it is deleted after delivery. [SOURCE: .opencode/plugins/mk-spec-memory.js:477-505] [SOURCE: .opencode/plugins/mk-goal.js:2818-2834,2927-2931] [SOURCE: .opencode/plugins/mk-dist-freshness-guard.js:201-232] [SOURCE: .opencode/plugins/session-cleanup.js:164-188]
3. Per model call, `mk-skill-advisor::appendAdvisorBrief` best-effort recovers the latest user message because the transform input normally has no prompt. It appends either the bridge-rendered live/stale single or ambiguous advisor brief plus the three fixed directives, or the directives-only fallback for missing prompt, bridge failure, invalid output, or unexpected error. A served compiled route adds a second bounded line. The plugin caches computation by session, prompt, options, source signature, workspace, and compiled-serving signature for five minutes by default, but every transform still appends the cached text, so compute deduplication does not reduce model-context tokens. [SOURCE: .opencode/plugins/mk-skill-advisor.js:30-52,77-114] [SOURCE: .opencode/plugins/mk-skill-advisor.js:700-752,777-866] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-215]
4. `mk-spec-gate` independently fetches that same latest user prompt and appends the shared A/B/C/D/E question only when `classifyIntent()` returns one; disabled, missing-prompt, read-only, already-answered/terminal, and internal-error paths are silent. Its classification state is session keyed and its tool-time enforcement is a separate path, not additional prompt text. [SOURCE: .opencode/plugins/mk-spec-gate.js:34-113,165-218] [SOURCE: .opencode/plugins/mk-spec-gate.js:220-260] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:98-119]
5. Other conditional transforms are part of the real token surface. `mk-spec-memory` appends a bridge-produced, character-clamped continuity brief plus `[mk-spec-memory:<digest>]`, suppressing a duplicate marker already present in the shared array. `mk-goal` appends full or compact `[active_goal:<id>]` text and similarly suppresses an existing marker. Dist freshness has no same-array dedupe and repeats a bounded stale/error brief while cached diagnostics are nonempty. Post-edit quality and Git preflight drain queued findings once; session cleanup drains its startup warning once. [SOURCE: .opencode/plugins/mk-spec-memory.js:215-267,386-486] [SOURCE: .opencode/plugins/mk-goal.js:2493-2542,2579-2600] [SOURCE: .opencode/plugins/mk-dist-freshness-guard.js:110-123,158-176,223-231] [SOURCE: .opencode/plugins/mk-post-edit-quality.js:117-184] [SOURCE: .opencode/plugins/mk-git-preflight-advisory.js:85-122] [SOURCE: .opencode/plugins/session-cleanup.js:145-188]
6. All OpenCode adapters mutate one shared `output.system` array additively with `push`; they do not edit visible user-message parts. Therefore final order is the host's plugin invocation order plus each plugin's internal push order (advisor brief before optional compiled-route line), not a repository-declared cross-plugin priority. Marker dedupe can see earlier entries in that same array, but only continuity and goal implement it; there is no cross-plugin semantic dedupe or consolidation. The source establishes additive behavior but does not establish a stable host load order, so token fixtures must treat inter-plugin order as captured runtime data rather than assume filename order. [SOURCE: .opencode/plugins/mk-skill-advisor.js:849-855] [SOURCE: .opencode/plugins/mk-spec-gate.js:186-214] [SOURCE: .opencode/plugins/mk-spec-memory.js:477-486] [SOURCE: .opencode/plugins/mk-goal.js:2579-2590] [SOURCE: .opencode/hooks/injection-contract.md:30-39,85-91] [INFERENCE: shared-array mutation exposes same-request marker dedupe, while absent priority metadata leaves cross-plugin order host-defined]
7. This merged-system design differs from Claude/Codex/Cursor/Devin adapters that emit separate hook command envelopes: separate adapters preserve hook boundaries and can partially deliver/fail according to registration order, while OpenCode hands the model one assembled system sequence. OpenCode can dedupe exact markers before assembly, but its advisor cache only avoids bridge work and does not avoid repeated tokens. For prompt caching, stable repeated blocks help only to the extent they remain an identical prefix; dynamic advisor/Gate/goal/continuity content or host-order changes can move the cache boundary, so measurement must record exact assembled order as well as per-block tokens. [SOURCE: .opencode/hooks/injection-contract.md:44-91] [SOURCE: .opencode/plugins/mk-skill-advisor.js:700-752,849-855] [SOURCE: .opencode/plugins/mk-spec-memory.js:477-486] [INFERENCE: prefix caching depends on byte-stable ordering, whereas compute-cache hits do not remove repeated prompt content]

## Content Variants Required for Token Measurement
- Advisor: live/stale × single/ambiguous; directives-only fallback; each with/without compiled-route summary; 2,048-character clamp; disabled silence.
- Gate 3: question vs read-only/no-question vs already-answered/terminal vs missing-client/prompt/disabled silence.
- Continuity: no brief; full brief; truncation plus digest marker; identical-marker suppression; bridge timeout/parse/nonzero silence.
- Goal: no active goal; full active block; compact/clamped block; identical-marker suppression; disabled/malformed/missing state silence.
- Dist freshness: clean silence; stale-only; check-error-only; mixed bounded/truncated list; repeated cached turn; mutation-invalidated refresh.
- One-shot queued content: startup-cleanup warning, post-edit-quality findings, and Git preflight advisories, each absent/present, queue-cap aggregation, first-delivery drain, and next-turn silence.
- Aggregate fixtures: exact captured host order for baseline clean turn; mutation turn; active-continuity-goal turn; stale-dist turn; post-edit/git/startup pending turn; and all-applicable worst case.

## Ruled Out
- Treating `session.created` itself as a model-context envelope; it prepares caches/state and later transforms deliver text.
- Treating advisor cache hits as token deduplication; the cached brief is still pushed on every transform.
- Assuming local plugin filename order is a guaranteed model-context order without a live host capture.

## Dead Ends
None. Source inspection cannot prove OpenCode's final host ordering or exported system-array shape; a live request/export capture is the required next evidence.

## Edge Cases
- Ambiguous input: “SessionStart” was narrowed to `session.created` preparation plus first-transform delivery because no separate OpenCode SessionStart envelope exists in the inspected plugins.
- Contradictory evidence: the injection contract describes continuity/goal as `session.created` triggered, while their implementations append on every system transform; resolved as creation-time preparation/state restoration followed by repeated transform-time delivery.
- Missing dependencies: no live OpenCode model-request/export capture, so configured code is confirmed and model visibility is documented, but exact host order remains unverified.
- Partial success: none; the static adapter inventory and measurement matrix are complete for this focus.

## Sources Consulted
- `.opencode/plugins/README.md:14-42`
- `.opencode/hooks/injection-contract.md:24-91,187-247`
- `.opencode/plugins/mk-skill-advisor.js:30-52,700-906`
- `.opencode/plugins/mk-spec-gate.js:34-113,165-260`
- `.opencode/plugins/mk-spec-memory.js:215-267,386-505`
- `.opencode/plugins/mk-goal.js:2493-2600,2818-2931`
- `.opencode/plugins/mk-dist-freshness-guard.js:110-232`
- `.opencode/plugins/session-cleanup.js:145-188`
- `.opencode/plugins/mk-post-edit-quality.js:117-184`
- `.opencode/plugins/mk-git-preflight-advisory.js:85-122`
- `/Users/michelkerkmeester/.config/opencode/opencode.json:1-8`

## Assessment
- New information ratio: 1.00
- Questions addressed: exact OpenCode injection modules, timing, content variants, merge/order, conditions/fallbacks, configured/live status, token fixtures, and cache/dedupe consequences.
- Questions answered: OpenCode's static end-to-end adapter inventory and complete token-fixture matrix; exact live host order and token counts remain open.

## Reflection
- What worked and why: tracing every local plugin that implements `experimental.chat.system.transform` separated persistent per-call blocks from session-prepared and drain-once content.
- What did not work and why: installed package sources did not expose host transform sequencing, and repository docs explicitly leave exported system-array visibility unverified.
- What I would do differently: capture one live clean request and one maximal conditional request early, then use those byte-exact arrays as the measurement fixtures.

## Recommended Next Focus
Audit Pi's input-transform and hidden `sendMessage` paths next, then run a dedicated measurement iteration across the six finalized variant matrices. For OpenCode specifically, capture `opencode export <sessionID>` or debug logs to establish final transform order and whether the assembled system array is observable.
