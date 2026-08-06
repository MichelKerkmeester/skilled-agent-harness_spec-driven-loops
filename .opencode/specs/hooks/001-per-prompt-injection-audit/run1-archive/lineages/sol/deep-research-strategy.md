# Deep Research Strategy — Per-Prompt Injection Audit

## 1. OVERVIEW

This detached lineage inventories and measures every recurring prompt injection across Claude Code, Codex, Cursor, Devin, OpenCode, and Pi, then derives a cross-runtime reduction plan that preserves guardrail effectiveness.

## 2. TOPIC

Reduce per-prompt injection bloat across all six runtime hook adapters, with exact ownership, measured token costs, evidence-backed best practices, and ranked before/after reductions.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which exact modules and event paths inject each block in each of the six runtime adapters?
- [ ] What is the measured per-turn token cost of every block and the aggregate cost per runtime?
- [ ] Which injections remain valuable every turn, and which are redundant, stale, or better placed once per session?
- [ ] What official or primary-source best practices govern concise, conditional, deduplicated, and prompt-cache-friendly injection?
- [ ] Which ranked cross-runtime changes deliver the largest safe reduction, and what are the measured before/after estimates?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Implementing hook changes.
- Editing runtime adapters, shared hook modules, or the owning spec packet.
- Weakening Gate 3, comment hygiene, governance, or proof requirements without an explicit preservation mechanism.
- Treating convergence before iteration 15 as a stop condition.

## 5. STOP CONDITIONS

- Complete all 15 iterations required by the max-iterations policy.
- Produce exact module ownership, a six-runtime injection matrix, measured token estimates, primary-source practice evidence, and a ranked reduction plan.
- Stop early only for unrecoverable state corruption or a write-boundary failure.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which exact modules and event paths inject each block in each of the six runtime adapters?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- the injection contract located the topology; registrations and source confirmed boundaries. (iteration 1)
- tracing from `.claude/settings.json` into the configured compiled artifacts, then back to canonical sources and tests, exposed both true ordering and stale documentation. (iteration 2)
- tracing repo registration → outbound installed registration → Codex transport → shared owner exposed the drift that source-only inspection misses. (iteration 3)
- registration-to-adapter-to-shared-owner tracing separated executable content from host event delivery and exposed the hard-coded startup-only narrowing. (iteration 4)
- registration → adapter → shared owner → live record tracing separated transport, content, and delivery. (iteration 5)
- tracing every local plugin that implements `experimental.chat.system.transform` separated persistent per-call blocks from session-prepared and drain-once content. (iteration 6)
- tracing from discovery symlinks into each canonical owner separated host transport from content ownership and exposed the additional active-goal transform omitted by the narrow advisor/Gate baseline. (iteration 7)
- Comparing the shared owner against each transport and native lifecycle port separated content ownership from event reachability and exposed OpenCode's preparation-versus-delivery mismatch. (iteration 8)
- tracing canonical renderer outward to each transport separated selection value from invariant policy repetition and exposed that token caps exclude the directive suffix. (iteration 9)
- owner-to-transport tracing separated six adapters from two content owners; comparing prose with executable gates exposed unequal value and CI fail-open drift. (iteration 10)
- classifier → state core → adapters separated policy, cadence, and transport; executable fixtures anchored trigger/payload claims. (iteration 11)
- reconstructing at each content owner before runtime aggregation exposed the one-character prior error and separated fixed from variable cost. (iteration 12)
- Pairing provider token-accounting documentation with Cursor/Devin relevance controls separated three often-confated mechanisms—retrieval gating, prompt omission, and KV caching. (iteration 13)
- reducing six transports to decision, delivery, state, and enforcement layers exposed where omission is safe without weakening classification or mutation controls. (iteration 14)
- preserving cadence categories before arithmetic prevented Gate, advisor-change, lifecycle, and Pi-only costs from being averaged into misleading per-turn totals. (iteration 15)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- broad grep mixed current source with specs, tests, and generated output. (iteration 1)
- README-level inventory could not establish executable behavior or actual host delivery. (iteration 2)
- broad test grep was noisy and did not supply a live transcript; narrow source anchors and installer diagnostics were stronger evidence. (iteration 3)
- broad test grep was noisy and produced no Cursor-specific adapter fixture suite; the manual live-fire record and narrow source anchors were stronger. (iteration 4)
- mirror checking found unrelated Cursor drift and cannot prove host delivery. (iteration 5)
- installed package sources did not expose host transform sequencing, and repository docs explicitly leave exported system-array visibility unverified. (iteration 6)
- broad installed-package grep produced generated dependency noise and did not expose a concise handler-order implementation within budget. (iteration 7)
- Registration and static reachability cannot establish host event frequency or transcript visibility; those require live captures and remain explicitly unclaimed. (iteration 8)
- importing a presumed compiled renderer path failed because that artifact does not exist at the expected location; source-literal measurement provided an independent, non-mutating fallback. (iteration 9)
- static presence tests cannot estimate governor effects. (iteration 10)
- source/config cannot prove host delivery, especially Cursor. (iteration 11)
- `tiktoken` could not load an uncached vocabulary without network access. (iteration 12)
- Source inspection cannot prove a host preserves prefix placement or exposes provider cache controls and usage fields. (iteration 13)
- static source cannot prove cache reuse or Cursor prompt delivery, so neither is included in savings claims. (iteration 14)
- accumulated static evidence cannot establish current host delivery or provider cache hits, so those values remain unclaimed. (iteration 15)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A single identical SessionStart matrix for all six runtimes: Cursor and Pi intentionally narrow shared source reachability, OpenCode has no equivalent model-context envelope, and Devin/Pi have native post-compaction paths. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A single identical SessionStart matrix for all six runtimes: Cursor and Pi intentionally narrow shared source reachability, OpenCode has no equivalent model-context envelope, and Devin/Pi have native post-compaction paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single identical SessionStart matrix for all six runtimes: Cursor and Pi intentionally narrow shared source reachability, OpenCode has no equivalent model-context envelope, and Devin/Pi have native post-compaction paths.

### A universal cache API: provider and host controls differ, and cache reads remain input tokens. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: A universal cache API: provider and host controls differ, and cache reads remain input tokens.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A universal cache API: provider and host controls differ, and cache reads remain input tokens.

### A universal provider-cache implementation across all six adapters. Provider, model, host transport, prefix ordering, breakpoints, and usage visibility differ; the portable contract is stable-first ordering plus semantic dedup, not a single cache API. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: A universal provider-cache implementation across all six adapters. Provider, model, host transport, prefix ordering, breakpoints, and usage visibility differ; the portable contract is stable-first ordering plus semantic dedup, not a single cache API.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A universal provider-cache implementation across all six adapters. Provider, model, host transport, prefix ordering, breakpoints, and usage visibility differ; the portable contract is stable-first ordering plus semantic dedup, not a single cache API.

### Adding Gate deny text to user-turn cost: it is emitted only at a blocked mutation boundary. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:114-119] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Adding Gate deny text to user-turn cost: it is emitted only at a blocked mutation boundary. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:114-119]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding Gate deny text to user-turn cost: it is emitted only at a blocked mutation boundary. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:114-119]

### Assigning exact totals to continuity, goal, compact recovery, or OpenCode compiled-route lines without a captured payload. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Assigning exact totals to continuity, goal, compact recovery, or OpenCode compiled-route lines without a captured payload.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assigning exact totals to continuity, goal, compact recovery, or OpenCode compiled-route lines without a captured payload.

### Assuming local plugin filename order is a guaranteed model-context order without a live host capture. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Assuming local plugin filename order is a guaranteed model-context order without a live host capture.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming local plugin filename order is a guaranteed model-context order without a live host capture.

### Claiming cache hits for any adapter from source ordering alone: host/API cache controls and usage fields are not exposed in the inspected adapter sources. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Claiming cache hits for any adapter from source ordering alone: host/API cache controls and usage fields are not exposed in the inspected adapter sources.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming cache hits for any adapter from source ordering alone: host/API cache controls and usage fields are not exposed in the inspected adapter sources.

### Claiming Cursor or provider-cache savings without host delivery/usage evidence. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Claiming Cursor or provider-cache savings without host delivery/usage evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming Cursor or provider-cache savings without host delivery/usage evidence.

### Counting adapter-internal failures as resolver warnings; most adapter failures exit zero silently, so shell `||` is not reached. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Counting adapter-internal failures as resolver warnings; most adapter failures exit zero silently, so shell `||` is not reached.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting adapter-internal failures as resolver warnings; most adapter failures exit zero silently, so shell `||` is not reached.

### Counting Cursor configured prompt hooks as observed CLI traffic, or adding SessionStart maintenance commands without captured model-visible output. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-004.md:7-13] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Counting Cursor configured prompt hooks as observed CLI traffic, or adding SessionStart maintenance commands without captured model-visible output. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-004.md:7-13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting Cursor configured prompt hooks as observed CLI traffic, or adding SessionStart maintenance commands without captured model-visible output. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-004.md:7-13]

### Counting Cursor's configured editor hook as observed savings; only the zero-delivery CLI probes are observed. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Counting Cursor's configured editor hook as observed savings; only the zero-delivery CLI probes are observed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting Cursor's configured editor hook as observed savings; only the zero-delivery CLI probes are observed.

### Counting dispatch raw-input capture as injected text; it always returns `continue`. [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:224-235] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Counting dispatch raw-input capture as injected text; it always returns `continue`. [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:224-235]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting dispatch raw-input capture as injected text; it always returns `continue`. [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:224-235]

### Counting prebind or maintenance checks as intentional model context: their contracts are state mutation or stderr-only advisory output. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Counting prebind or maintenance checks as intentional model context: their contracts are state mutation or stderr-only advisory output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting prebind or maintenance checks as intentional model context: their contracts are state mutation or stderr-only advisory output.

### Counting SessionStart advisories or session shutdown as model context. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts:24-37] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-stop-context.ts:10-27] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Counting SessionStart advisories or session shutdown as model context. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts:24-37] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-stop-context.ts:10-27]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting SessionStart advisories or session shutdown as model context. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts:24-37] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-stop-context.ts:10-27]

### Counting the dormant code-graph merge helper: it has no caller in either current source or configured compiled shim. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Counting the dormant code-graph merge helper: it has no caller in either current source or configured compiled shim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting the dormant code-graph merge helper: it has no caller in either current source or configured compiled shim.

### Counting the registered `beforeSubmitPrompt` entries as current CLI token cost: registration and standalone executability do not establish host delivery. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Counting the registered `beforeSubmitPrompt` entries as current CLI token cost: registration and standalone executability do not establish host delivery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting the registered `beforeSubmitPrompt` entries as current CLI token cost: registration and standalone executability do not establish host delivery.

### Counting the SessionStart maintenance commands as deliberate prompt blocks: their registrations are real, but only `session-prime` uses the repository's context formatter; runtime capture is required to determine whether incidental stdout becomes visible. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Counting the SessionStart maintenance commands as deliberate prompt blocks: their registrations are real, but only `session-prime` uses the repository's context formatter; runtime capture is required to determine whether incidental stdout becomes visible.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting the SessionStart maintenance commands as deliberate prompt blocks: their registrations are real, but only `session-prime` uses the repository's context formatter; runtime capture is required to determine whether incidental stdout becomes visible.

### Deleting all directives merely because root policy overlaps: host loading and compaction retention are not uniformly proven. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Deleting all directives merely because root policy overlaps: host loading and compaction retention are not uniformly proven.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting all directives merely because root policy overlaps: host loading and compaction retention are not uniformly proven.

### Deletion because AGENTS.md overlaps: loses machine-timed relay and open state. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Deletion because AGENTS.md overlaps: loses machine-timed relay and open state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deletion because AGENTS.md overlaps: loses machine-timed relay and open state.

### Exact model-token totals remain blocked on an available tokenizer vocabulary and provider-specific serialization. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Exact model-token totals remain blocked on an available tokenizer vocabulary and provider-specific serialization.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Exact model-token totals remain blocked on an available tokenizer vocabulary and provider-specific serialization.

### Exact-string tests as the main guardrail: they prove presence, not behavior. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Exact-string tests as the main guardrail: they prove presence, not behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Exact-string tests as the main guardrail: they prove presence, not behavior.

### Folding variable continuity, goal, compiled-route, recovery, warning, or maintenance output into exact fixed totals. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Folding variable continuity, goal, compiled-route, recovery, warning, or maintenance output into exact fixed totals.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Folding variable continuity, goal, compiled-route, recovery, warning, or maintenance output into exact fixed totals.

### Immediate deletion of legacy string producers: multiple proxies, installed copies, and exact-output tests still consume them. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Immediate deletion of legacy string producers: multiple proxies, installed copies, and exact-output tests still consume them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Immediate deletion of legacy string producers: multiple proxies, installed copies, and exact-output tests still consume them.

### Lifecycle-only advisor or Gate classification: both depend on current prompt semantics. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Lifecycle-only advisor or Gate classification: both depend on current prompt semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lifecycle-only advisor or Gate classification: both depend on current prompt semantics.

### Live provider-cache percentages remain blocked on host traces and cache usage telemetry. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Live provider-cache percentages remain blocked on host traces and cache usage telemetry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live provider-cache percentages remain blocked on host traces and cache usage telemetry.

### Lowering or bypassing confidence/uncertainty thresholds: this increases low-quality routing and does not address the invariant suffix. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Lowering or bypassing confidence/uncertainty thresholds: this increases low-quality routing and does not address the invariant suffix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lowering or bypassing confidence/uncertainty thresholds: this increases low-quality routing and does not address the invariant suffix.

### Measuring Cursor resume/clear/compact SessionStart variants: the Cursor translator hard-codes `source: 'startup'`, making those owner branches unreachable through this adapter today. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Measuring Cursor resume/clear/compact SessionStart variants: the Cursor translator hard-codes `source: 'startup'`, making those owner branches unreachable through this adapter today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring Cursor resume/clear/compact SessionStart variants: the Cursor translator hard-codes `source: 'startup'`, making those owner branches unreachable through this adapter today.

### Moving advisor selection or Gate 3 entirely to SessionStart: both depend on the current prompt, so session-only placement would change behavior rather than remove redundancy. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Moving advisor selection or Gate 3 entirely to SessionStart: both depend on the current prompt, so session-only placement would change behavior rather than remove redundancy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Moving advisor selection or Gate 3 entirely to SessionStart: both depend on the current prompt, so session-only placement would change behavior rather than remove redundancy.

### Moving all current-turn classification to SessionStart: Cursor and Devin first-party designs instead distinguish always-on from relevance-triggered context. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Moving all current-turn classification to SessionStart: Cursor and Devin first-party designs instead distinguish always-on from relevance-triggered context.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Moving all current-turn classification to SessionStart: Cursor and Devin first-party designs instead distinguish always-on from relevance-triggered context.

### Moving prompt-dependent selection wholly to SessionStart: the selected skill depends on current user text. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Moving prompt-dependent selection wholly to SessionStart: the selected skill depends on current user text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Moving prompt-dependent selection wholly to SessionStart: the selected skill depends on current user text.

### No further detached-lineage iteration is recommended: this is the configured maximum iteration, not a convergence stop. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: No further detached-lineage iteration is recommended: this is the configured maximum iteration, not a convergence stop.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No further detached-lineage iteration is recommended: this is the configured maximum iteration, not a convergence stop.

### Prompt-text-keyed or global dedup: it grows with prompt cardinality and can suppress required context across sessions/scopes. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Prompt-text-keyed or global dedup: it grows with prompt cardinality and can suppress required context across sessions/scopes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-text-keyed or global dedup: it grows with prompt cardinality and can suppress required context across sessions/scopes.

### Removing Pi's dispatch guard without equivalent native enforcement. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Removing Pi's dispatch guard without equivalent native enforcement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing Pi's dispatch guard without equivalent native enforcement.

### Repeating dynamic state inside the cacheable prefix: exact-prefix hashing makes volatile pre-breakpoint content destroy reuse. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Repeating dynamic state inside the cacheable prefix: exact-prefix hashing makes volatile pre-breakpoint content destroy reuse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repeating dynamic state inside the cacheable prefix: exact-prefix hashing makes volatile pre-breakpoint content destroy reuse.

### Repeating the same tested CLI-build probe without a version change adds no evidence; re-probe when Cursor changes or when editor capture is available. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Repeating the same tested CLI-build probe without a version change adds no evidence; re-probe when Cursor changes or when editor capture is available.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repeating the same tested CLI-build probe without a version change adds no evidence; re-probe when Cursor changes or when editor capture is available.

### Reporting `tiktoken` counts: the package was installed but both OpenAI vocabularies required an unavailable network fetch; estimator results are not relabeled as tokenizer output. [SOURCE: command `python3` tiktoken probe] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Reporting `tiktoken` counts: the package was installed but both OpenAI vocabularies required an unavailable network fetch; estimator results are not relabeled as tokenizer output. [SOURCE: command `python3` tiktoken probe]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reporting `tiktoken` counts: the package was installed but both OpenAI vocabularies required an unavailable network fetch; estimator results are not relabeled as tokenizer output. [SOURCE: command `python3` tiktoken probe]

### Reporting provider cache reuse as context-window reduction. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Reporting provider cache reuse as context-window reduction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reporting provider cache reuse as context-window reduction.

### SessionStart-only Gate 3: classification depends on the current turn. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: SessionStart-only Gate 3: classification depends on the current turn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SessionStart-only Gate 3: classification depends on the current turn.

### Source-only inspection cannot resolve editor delivery or prove model visibility of `sessionStart.agent_message`; those require host capture. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Source-only inspection cannot resolve editor delivery or prove model visibility of `sessionStart.agent_message`; those require host capture.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Source-only inspection cannot resolve editor delivery or prove model visibility of `sessionStart.agent_message`; those require host capture.

### Time-only or prompt-only deduplication: can suppress a legitimate scope change. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Time-only or prompt-only deduplication: can suppress a legitimate scope change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Time-only or prompt-only deduplication: can suppress a legitimate scope change.

### Treating `.pi/settings.json` package order or raw directory enumeration as the project-extension handler order; neither is an explicit registration contract. [SOURCE: .pi/settings.json:25-33] [SOURCE: .pi/extensions/README.md:14-28] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating `.pi/settings.json` package order or raw directory enumeration as the project-extension handler order; neither is an explicit registration contract. [SOURCE: .pi/settings.json:25-33] [SOURCE: .pi/extensions/README.md:14-28]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `.pi/settings.json` package order or raw directory enumeration as the project-extension handler order; neither is an explicit registration contract. [SOURCE: .pi/settings.json:25-33] [SOURCE: .pi/extensions/README.md:14-28]

### Treating `renderAdvisorTimeoutFallback()` as a Claude variant: the Claude hook uses CLI fallback followed by the directives-only fallback, with no call to that renderer. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `renderAdvisorTimeoutFallback()` as a Claude variant: the Claude hook uses CLI fallback followed by the directives-only fallback, with no call to that renderer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `renderAdvisorTimeoutFallback()` as a Claude variant: the Claude hook uses CLI fallback followed by the directives-only fallback, with no call to that renderer.

### Treating `session.created` itself as a model-context envelope; it prepares caches/state and later transforms deliver text. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating `session.created` itself as a model-context envelope; it prepares caches/state and later transforms deliver text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `session.created` itself as a model-context envelope; it prepares caches/state and later transforms deliver text.

### Treating adapter files as independent content owners. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating adapter files as independent content owners.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating adapter files as independent content owners.

### Treating adapter registration as proof that a host emits every source variant. Static source proves reachability, while host transcript capture is still required for Codex/Devin source frequencies and Cursor editor delivery. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating adapter registration as proof that a host emits every source variant. Static source proves reachability, while host transcript capture is still required for Codex/Devin source frequencies and Cursor editor delivery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating adapter registration as proof that a host emits every source variant. Static source proves reachability, while host transcript capture is still required for Codex/Devin source frequencies and Cursor editor delivery.

### Treating advisor cache hits as token deduplication; the cached brief is still pushed on every transform. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating advisor cache hits as token deduplication; the cached brief is still pushed on every transform.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating advisor cache hits as token deduplication; the cached brief is still pushed on every transform.

### Treating Cursor registration as observed delivery. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating Cursor registration as observed delivery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Cursor registration as observed delivery.

### Treating duplicate-question suppression as Gate satisfaction. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating duplicate-question suppression as Gate satisfaction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating duplicate-question suppression as Gate satisfaction.

### Treating one first Gate trigger as removable; only unchanged re-delivery is suppressed. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating one first Gate trigger as removable; only unchanged re-delivery is suppressed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating one first Gate trigger as removable; only unchanged re-delivery is suppressed.

### Treating OpenCode `session.created` as proof that continuity is delivered once. It only prepares runtime state; delivery remains in the repeated system transform. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating OpenCode `session.created` as proof that continuity is delivered once. It only prepares runtime state; delivery remains in the repeated system transform.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating OpenCode `session.created` as proof that continuity is delivered once. It only prepares runtime state; delivery remains in the repeated system transform.

### Treating prompt-result or bridge caching as context deduplication: cached text is still appended. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating prompt-result or bridge caching as context deduplication: cached text is still appended.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating prompt-result or bridge caching as context deduplication: cached text is still appended.

### Treating provider prompt caching as removal from the context window: both providers count cached reads in total input accounting, and OpenAI retains TPM impact. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating provider prompt caching as removal from the context window: both providers count cached reads in total input accounting, and OpenAI retains TPM impact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating provider prompt caching as removal from the context window: both providers count cached reads in total input accounting, and OpenAI retains TPM impact.

### Treating registration as proof of delivery. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating registration as proof of delivery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating registration as proof of delivery.

### Treating repository `.codex/hooks.json` as proof of currently installed behavior; the outbound global file is authoritative and is drifted. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating repository `.codex/hooks.json` as proof of currently installed behavior; the outbound global file is authoritative and is drifted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating repository `.codex/hooks.json` as proof of currently installed behavior; the outbound global file is authoritative and is drifted.

### Treating successful computation/cache lookup as proof that content reached the model. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating successful computation/cache lookup as proof that content reached the model.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating successful computation/cache lookup as proof that content reached the model.

### Treating the SessionStart maintenance commands or third-party installed hooks as deliberate Spec Kit context without captured output. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the SessionStart maintenance commands or third-party installed hooks as deliberate Spec Kit context without captured output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the SessionStart maintenance commands or third-party installed hooks as deliberate Spec Kit context without captured output.

### Unconditional “watch it fail”: root policy explicitly limits negative controls to practical, safe cases. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Unconditional “watch it fail”: root policy explicitly limits negative controls to practical, safe cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unconditional “watch it fail”: root policy explicitly limits negative controls to practical, safe cases.

### Using the 80/120 caps as total payload caps: `capText()` applies before directives are concatenated, so the 760-character suffix sits outside that cap. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Using the 80/120 caps as total payload caps: `capText()` applies before directives are concatenated, so the 760-character suffix sits outside that cap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the 80/120 caps as total payload caps: `capText()` applies before directives are concatenated, so the 760-character suffix sits outside that cap.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: **Provider cache savings are explicitly outside the context-window totals.** Stable-prefix ordering may reduce billed uncached work and latency, but cached reads remain input tokens and OpenAI retains TPM accounting....

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- The artifact root is pre-bound to this lineage directory; the canonical resolver must not run.
- Spec Kit Memory trigger retrieval was unavailable at startup, so the loop begins from checked-in source evidence.
- No resource-map.md exists in the owning spec packet; coverage must come from direct repository inventory.
- SessionStart context is in scope only as a comparison surface; all writes remain lineage-local.

## 13. RESEARCH BOUNDARIES

- Max iterations: 15
- Convergence threshold: 0.05 (telemetry only before the hard cap)
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current generation: 1
- Session: fanout-sol-1785996968864-djujy4
- Allowed write root: `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`
