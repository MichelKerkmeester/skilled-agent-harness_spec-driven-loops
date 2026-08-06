# Iteration 3: Reproducible quantitative payload baseline

## Focus

Established a reproducible byte/character/line/token-estimate baseline for every requested injection block and for each runtime's per-turn composition. The measurement uses the actual compiled advisor renderer, exported Gate-3 constant, exported SessionStart section builder/formatter, and the Pi source constant; it separates representative render, configured ceiling, conditional zero-cost case, and observed delivery.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority was restricted to `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Measurement Method

- Exact UTF-8 bytes use Node `Buffer.byteLength(text, "utf8")`; Unicode characters use `[...text].length`; UTF-16 units use JavaScript `text.length`; logical lines are `text.split("\n").length` (empty/non-triggered is defined as zero lines).
- Token values are **estimates**, not tokenizer counts: `ceil(UTF-16 units / 4)`. This is the repository's own estimator in `truncateToTokenBudget()`, and the advisor cap likewise uses `TOKEN_TO_CHAR_ESTIMATE = 4`. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:111] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:112] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:46] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:82]
- `tiktoken 0.11.0` was present, but neither `o200k_base` nor `cl100k_base` vocabulary was cached and restricted networking prevented retrieval. Therefore no value below is presented as an exact model-token count.
- Reproduction: import `renderAdvisorBrief()`/`renderAdvisorFallbackDirective()` from `dist/mcp-server/lib/render.js`; import `GATE_3_QUESTION`; call `formatHookOutput(handleStartup({session_id:"measurement-iteration-003"}))`; extract the Pi constant; compute the four metrics above. The canonical functions and append points are cited below.

## Findings

1. **The unconditional directive capsule dominates the representative advisor payload.** Exact block measurements are:

   | Block | Case | UTF-8 bytes | Unicode chars | UTF-16 units | Lines | Token estimate |
   |---|---:|---:|---:|---:|---:|---:|
   | `Directives:` label | fixed | 11 | 11 | 11 | 1 | 3 |
   | Comment hygiene | fixed | 205 | 203 | 203 | 1 | 51 |
   | Governor | fixed | 290 | 288 | 288 | 1 | 72 |
   | Proof over appearance | fixed | 254 | 254 | 254 | 1 | 64 |
   | Directives-only fallback | rendered | 763 | 759 | 759 | 4 | 190 |
   | Advisor + directives | representative `sk-code 0.95/0.05` | 806 | 802 | 802 | 5 | 201 |
   | Advisor + directives | configured 120-token ambiguous cap reached | 1,244 | 1,240 | 1,240 | 5 | 310 |

   The representative recommendation adds only 43 bytes and 11 estimated tokens over the 763-byte/190-estimate directives fallback. The apparent 80/120 “token cap” applies only to the advisor prefix; the directives are concatenated after `capText()`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:51] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:196] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:207] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:213]

2. **The other fixed/conditional blocks are independently material.** Gate-3 is exactly 521 bytes/chars, 6 lines, estimate 131; the Pi-only directive is 554 bytes, 552 characters/UTF-16 units, 1 line, estimate 138. A representative no-continuity SessionStart render is 389 bytes, 383 characters/UTF-16 units, 12 lines, estimate 96. Gate-3 has a true zero-cost case on non-mutating turns, satisfied/skipped sessions, and child sessions; the Pi directive has no zero-cost normal parent-input case because the adapter appends it even without advisor context. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:105] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:897] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:901] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:969] [SOURCE: .pi/extensions/prompt-advisor.ts:51] [SOURCE: .pi/extensions/prompt-advisor.ts:103] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:176] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:75]

3. **Representative per-turn totals are 806 bytes for four shared adapters and 1,362 bytes for Pi before Gate-3.** Newline separators are included exactly.

   | Runtime | Representative non-Gate turn | Representative Gate turn | Configured/observed qualification |
   |---|---:|---:|---|
   | Claude Code | 806 B / 802 chars / 5 lines / est. 201 | 1,328 B / 1,324 chars / 11 lines / est. 331 | configured; live receipt not established |
   | Codex | 806 / 802 / 5 / 201 | 1,328 / 1,324 / 11 / 331 | configured; live receipt not established |
   | Cursor | configured 806 / 802 / 5 / 201 | configured 1,328 / 1,324 / 11 / 331 | **observed per-turn cost: zero**, because the tested prompt hook did not fire |
   | Devin | 806 / 802 / 5 / 201 | 1,328 / 1,324 / 11 / 331 | configured; Gate delivery live-observed in prior probe |
   | Pi | 1,362 B / 1,356 chars / 7 lines / est. 339 | 1,885 B / 1,879 chars / 14 lines / est. 470 | implemented composition; combined live receipt/order unproven |
   | OpenCode | advisor component 806 / 802 / 5 / 201 | advisor + Gate component 1,328 / 1,324 / 11 / 331 | continuity and compiled-route additions are dynamic; global order/live receipt unproven |

   Claude/Codex/Devin share advisor-then-Gate configuration; Cursor reverses registration order, which does not alter these additive sizes. Pi uses two blank-line separators around its directive, accounting for its 1,362-byte total. [SOURCE: .claude/settings.json:77] [SOURCE: .codex/hooks.json:33] [SOURCE: .cursor/hooks.json:79] [SOURCE: .devin/hooks.v1.json:34] [SOURCE: .pi/extensions/prompt-advisor.ts:103] [INFERENCE: additive totals from findings 1-2 using the adapter separators]

4. **Configured ceilings are not the same as representative renders, and OpenCode has no finite whole-payload ceiling in the inspected code.** SessionStart has a 2,000-estimated-token/8,000-UTF-16-unit truncation budget; representative startup is 383 units/estimate 96, while optional continuity and warm fallback make it dynamic. OpenCode clamps advisor brief to 2,048 characters and continuity (including its marker) to 2,048 characters by default; with Gate-3 those bounded components total at most 4,617 UTF-16 units (estimate 1,155) before separators. However, `renderCompiledRouteSummaryLine()` joins an unbounded `targets` array and is appended as a separate uncapped system entry, so a finite configured maximum for the **whole** OpenCode turn cannot be claimed from these guards. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:14] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:16] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:112] [SOURCE: .opencode/plugins/mk-skill-advisor.js:37] [SOURCE: .opencode/plugins/mk-skill-advisor.js:102] [SOURCE: .opencode/plugins/mk-skill-advisor.js:110] [SOURCE: .opencode/plugins/mk-skill-advisor.js:274] [SOURCE: .opencode/plugins/mk-skill-advisor.js:849] [SOURCE: .opencode/plugins/mk-spec-memory.js:110] [SOURCE: .opencode/plugins/mk-spec-memory.js:243] [SOURCE: .opencode/plugins/mk-spec-memory.js:484]

5. **Dynamic ranges and zero cases are now explicit.** Advisor: zero only when the runtime omits the hook or plugin is disabled; otherwise the failed/no-recommendation path still pays 763 bytes via the fallback, representative is 806, ambiguous capped render measured 1,244, and OpenCode may clamp an upstream brief at 2,048 chars. Gate-3: 0 or 521 bytes. Pi directive: 554 bytes on every normal parent input, zero only when that extension/input path does not execute. SessionStart: zero on OpenCode and non-start turns; representative 389 bytes; configured truncation ceiling 8,000 UTF-16 units. OpenCode continuity: zero without a returned brief, up to 2,048 units with marker; duplicates are suppressed only within the current output array. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:167] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:213] [SOURCE: .opencode/plugins/mk-skill-advisor.js:836] [SOURCE: .opencode/plugins/mk-spec-memory.js:477] [SOURCE: .opencode/plugins/mk-spec-memory.js:483] [SOURCE: .opencode/plugins/mk-spec-memory.js:485] [SOURCE: .pi/extensions/prompt-advisor.ts:103]

6. **Exact-token portability remains intentionally unresolved.** Different runtime models may use different tokenizers, and no vocabulary was locally available. The estimator is reproducible and matches the repository's budget logic, but its 4-units/token assumption is visibly lossy for punctuation-heavy policy prose and must not be used as a billing or context-window fact. A later iteration should run the same captured strings through each target model's authoritative tokenizer or usage telemetry. [INFERENCE: based on the unavailable tokenizer vocabulary and the estimator implementation cited in Measurement Method]

## Ruled Out

- Reporting `tiktoken` numbers as exact was ruled out because the encoding vocabulary was not cached and could not be fetched under restricted networking.
- Treating the advisor's 80/120 cap as the whole advisor payload ceiling was ruled out by the renderer's post-cap directive concatenation.
- Treating OpenCode's two 2,048-character clamps as a whole-turn ceiling was ruled out because the compiled-route summary is separately appended and its targets join is uncapped.
- Charging Cursor for configured blocks as observed cost was ruled out by iteration 2's live probe.

## Dead Ends

- No further attempt should silently substitute `chars/4` for exact model tokens. Until tokenizer vocabularies or runtime usage receipts are available, the values must remain labeled estimates.

## Edge Cases

- Ambiguous input: “configured maximum” could mean cap on one component or on the complete runtime envelope. Both are separated; OpenCode complete maximum is unbounded in inspected code.
- Contradictory evidence: Cursor is configured for per-turn hooks but observed not to deliver them; both totals are retained.
- Missing dependencies: authoritative model tokenizer vocabularies/usage telemetry were unavailable; repository-native estimation was used.
- Partial success: byte/character/line counts and estimator values are exact/reproducible, while exact model-token counts remain unavailable.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-89`, `:163-215`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:105-112`, `:882-977`
- `.pi/extensions/prompt-advisor.ts:51-56`, `:103-106`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:176-223`, `:303-364`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:14-16`, `:75-79`, `:111-118`
- `.opencode/plugins/mk-skill-advisor.js:37`, `:102-114`, `:274`, `:785-855`
- `.opencode/plugins/mk-spec-memory.js:35-37`, `:110-113`, `:237-254`, `:477-486`
- Runtime registration/probe evidence carried forward with citations from iterations 1-2.

## Assessment

- New information ratio: 0.92 (`(5 fully new + 0.5 × 1 partially new) / 6 = 0.917`, rounded; no simplicity bonus)
- Novelty justification: Five findings add measured block/runtime baselines and boundedness facts; one partially refines the prior dynamic-delivery inventory with explicit zero/range cases.
- Questions addressed: What is the measured byte/token cost of each block and runtime total? What are the configured, representative, and non-triggered ranges?
- Questions answered: Exact UTF-8/character/line baselines and repository-native token estimates are established for all fixed blocks and representative runtime compositions; exact model tokens remain open.

## Reflection

- What worked and why: executing exported renderers and formatters eliminated transcription drift, while measuring UTF-8 and UTF-16 separately exposed the effect of em-dash characters.
- What did not work and why: `tiktoken` could import but could not load an encoding without a cached vocabulary or network access.
- What I would do differently: persist a packet-local measurement fixture only if a later implementation phase explicitly authorizes it; this research leaf correctly avoided writing helper code outside its three outputs.

## Recommended Next Focus

Obtain exact tokenizer or runtime usage counts for the captured strings, then measure live model-visible envelopes for Claude Code, Codex, Pi, and OpenCode. In parallel, bound or inventory OpenCode compiled-route target lengths before using any “configured maximum” in a before/after claim.
