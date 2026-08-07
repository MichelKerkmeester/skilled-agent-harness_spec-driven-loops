# Iteration 4: Marginal value and redundancy of the always-on directive capsule

## Focus

Evaluated the three fixed directives appended to every advisor result and fallback—comment hygiene, governor, and proof over appearance—for marginal guardrail value, overlap with durable instructions, cross-turn staleness, render/build ownership, and runtime receipt. This is risk mapping, not final reduction synthesis: it identifies what must survive any later trim, move, or conditionalization.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority was restricted to `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **One canonical renderer owns the live shared text, with two deliberate mirrors that create drift risk.** `render.ts` defines all three constants and appends the whole capsule after the capped advisor prefix in both normal and ambiguous renders; `renderAdvisorFallbackDirective()` emits it even when no recommendation exists. Claude's handler always uses `brief ?? renderAdvisorFallbackDirective()`, and Codex/Cursor/Devin/Pi consume that compiled handler. OpenCode's source plugin and its bridge carry exact local mirrors because they must fail open, although the bridge delegates to the canonical renderer when available. Any text change therefore has a preservation requirement: update source renderer, bridge/plugin fallbacks, compiled artifacts, and parity/freshness tests together; changing only `render.ts` can leave OpenCode or installed dist behavior stale. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:51-69] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:196-215] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:228-244] [SOURCE: .opencode/plugins/mk-skill-advisor.js:45-52] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:320-374]

2. **The capsule is configured on every user turn for five runtimes, but observed delivery remains qualified.** Claude Code, Codex, Cursor, and Devin register the compiled prompt handler on `UserPromptSubmit`/`beforeSubmitPrompt`; Pi imports that compiled handler on every non-empty `input`; OpenCode appends the brief or fixed fallback on each enabled system transform. Thus the intended every-turn recipients are all six runtimes. Prior live evidence still controls actual-cost claims: Cursor's tested `beforeSubmitPrompt` did not fire, Devin has partial live proof, and combined live receipts remain unproven for Claude, Codex, Pi, and OpenCode. Moving the capsule to startup would therefore need a separate persistence/compaction guarantee per runtime; merely deleting the per-turn append would not prove equivalent delivery. [SOURCE: .claude/settings.json:77-90] [SOURCE: .codex/hooks.json:33-49] [SOURCE: .cursor/hooks.json:79-89] [SOURCE: .devin/hooks.v1.json:34-48] [SOURCE: .pi/extensions/prompt-advisor.ts:64-106] [SOURCE: .opencode/plugins/mk-skill-advisor.js:785-862] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-002.md:13-23]

3. **These directives, not skill routing, dominate the measured payload.** The prior exact-byte baseline measured the label at 11 B, comment hygiene at 205 B, governor at 290 B, and proof at 254 B; with separators the fallback capsule is 763 B. Their shares of that capsule are 1.4%, 26.9%, 38.0%, and 33.3%. Against the representative 806 B advisor render, the whole capsule is 94.7%; comment hygiene is 25.4%, governor 36.0%, and proof 31.5%. Even against the measured 1,244 B ambiguous-cap render, the capsule remains 61.3%. Therefore any later payload reduction that leaves all three untouched can recover at most the small advisor prefix, while changing them affects the actual guardrail surface. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-003.md:21-37] [INFERENCE: percentages are direct division of the cited exact byte counts]

4. **Comment hygiene has the strongest distinct marginal safety value, despite textual redundancy.** The durable framework already states the HARD BLOCK, and the constitutional policy defines forbidden/allowed identifiers. Unlike the other two directives, it also has independent pre-commit, PostToolUse, and CI enforcement. The per-turn reminder therefore duplicates `AGENTS.md`, but it is the only capsule item that points at a narrow, mechanically enforced failure mode and provides coverage when the framework is absent from session context—the renderer's stated reason for always injecting it. Preservation requirement if moved or conditionalized: retain the exact prohibited category semantics, keep deterministic pre-commit/CI enforcement, and verify hook-less or framework-less runtimes still receive an actionable rule before code-comment writes. Risk if merely trimmed: the capsule says ADR/REQ/CHK/task/spec paths but omits packet/phase/finding ids present in the canonical policy, so shortening the wrong source can further diverge the reminder from enforcement. [SOURCE: AGENTS.md:57-58] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:30-38] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:40-52] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:66-74] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:51-53]

5. **The governor is mostly redundant disposition, with context-growth refresh as its only documented marginal role.** `AGENTS.md` already requires clipped, result-first work, batched calls, checkpoint reporting, reasoning about the problem, and dense evidence at boundaries. Four runtime-agent definitions in each of `.opencode/agents`, `.claude/agents`, and `.pi/agents` repeat the efficiency governor because per-turn hooks do not reach subagents. The shared capsule's unique additions are “reason about the person” and `// DECISION:` marking; neither is backed by a machine gate, and the latter can encourage source-comment residue even though the directive is delivered on read-only turns too. Preservation requirement if trimmed: keep result-first/batched/checkpoint behavior in durable framework and leaf agents, and test whether long parent sessions actually regress without refresh. Risk if conditionalized only on advisor success: fallback/error turns currently retain the governor, so that change would couple style behavior to routing health. [SOURCE: AGENTS.md:72-84] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:55-60] [SOURCE: .opencode/agents/deep-research.md:15] [SOURCE: .opencode/agents/deep-review.md:15] [SOURCE: .opencode/agents/deep-alignment.md:15] [SOURCE: .opencode/agents/design.md:22-23] [INFERENCE: the same four mirrored paths were observed under `.claude/agents` and `.pi/agents`]

6. **Proof over appearance is heavily redundant and less precise than the durable proof contract.** `AGENTS.md` already requires objective proof plans, observed exit status, final-state proof, artifact shape checks, whole-gate reruns, and scoped-diff cleanup. Eleven agent definitions in each of the OpenCode, Claude, and Pi mirrors independently carry verification-evidence language. The capsule's unconditional “watch it fail before fixing” is broader than the framework's “when practical and non-destructive” safe-negative-control rule, so on greenfield artifacts, destructive failures, or non-reproducible defects it can demand work the canonical rule explicitly makes conditional. Preservation requirement if moved/trimmed: retain observed command output, objective acceptance checks, final rerun, and residue scan; retain negative controls only with the safety/practicality qualifier. Risk if dropped without ensuring the final-state gate remains available after compaction: agents without their own proof contract could lose the concise terminal reminder. [SOURCE: AGENTS.md:86-105] [SOURCE: AGENTS.md:193-211] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:62-65] [SOURCE: .opencode/agents/deep-research.md:492] [SOURCE: .opencode/agents/review.md:336] [SOURCE: .opencode/agents/debug.md:570]

7. **Cross-turn staleness is relevance staleness, not factual churn, and repetition has no session deduplication.** The three strings are static and model-agnostic, so they do not become temporally false across turns. They do become contextually stale: comment hygiene is relevant only when code comments may be written, proof is terminally relevant around machine-state work and completion, and the governor is stylistic across all turns. The render path appends the full capsule after every successful advisor prefix and returns the same full capsule for every null recommendation; OpenCode likewise pushes the fallback on missing prompt, null brief, and error. No consulted path records a session marker or checks prior delivery. Conditionalization therefore risks false negatives in runtimes with unreliable prompt classification, while leaving repetition unchanged pays 763 B even on greetings, read-only questions, and repeated fallback turns. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163-215] [SOURCE: .opencode/plugins/mk-skill-advisor.js:785-862] [SOURCE: .opencode/hooks/injection-contract.md:44-66] [INFERENCE: absence of dedup follows from the cited render/append paths, not from a live context-window trace]

## Preservation Requirements and Risks

| Directive | Preserve | Main move/trim/conditionalization risk |
|---|---|---|
| Comment hygiene | Full forbidden-category semantics plus pre-commit/CI enforcement and coverage before comment writes | Classifier misses or framework-absent sessions can lose the only concise model reminder; mirrors can drift from canonical policy |
| Governor | Result-first, batch-tools, checkpoint reporting in durable framework and subagent definitions | Long parent contexts may lose the desired disposition after compaction; success-only injection couples behavior to advisor health |
| Proof over appearance | Observed command output, objective pass/fail checks, final rerun, clean scoped diff; safe negative control remains conditional | Removing the reminder can weaken terminal discipline, but retaining current wording can over-require destructive or impractical failure reproduction |

## Ruled Out

- Treating textual duplication as proof of zero marginal value: repeated placement can refresh behavior after context growth, but its effect has not been measured.
- Treating all six configured runtimes as six observed receipts: Cursor contradicts configuration, and four runtimes still lack combined live envelopes.
- Recommending removal or a final ranked design in this iteration: the dispatch asks for preservation requirements and risks before synthesis.
- Treating the source renderer as the only artifact that must change: OpenCode/plugin bridge mirrors and compiled consumers make that unsafe.

## Dead Ends

- Broad repository grep was dominated by archived spec research and generated transcripts. Exact-string searches restricted to framework, agent, renderer, bridge, adapter, and policy paths produced the useful overlap evidence; broad historical counts should not be used as policy coverage metrics.

## Edge Cases

- Ambiguous input: “receive every turn” can mean configured hook execution or observed model receipt. Both are reported separately.
- Contradictory evidence: Cursor is configured for the capsule but its live probe observed no prompt-hook delivery; no actual cost is assigned there.
- Missing dependencies: no controlled behavioral experiment measures compliance with versus without repeated directives, and no live context-window receipt covers all runtimes.
- Partial success: source overlap, byte shares, and preservation risks are established; causal guardrail effectiveness remains unmeasured.

## Negative Knowledge

- No code evidence shows session-level deduplication of the capsule.
- No machine enforcement was found for governor wording; its value is behavioral steering.
- No evidence supports unconditional negative-control execution; the durable framework explicitly qualifies it.
- No evidence supports deleting comment hygiene merely because CI exists: CI acts after generation and cannot prevent the model from writing a bad comment.
- No evidence establishes that startup-only placement survives compaction equivalently in all six runtimes.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-215`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:225-244`
- `.opencode/plugins/mk-skill-advisor.js:35-52`, `:775-862`
- `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:320-374`
- `.opencode/hooks/injection-contract.md:44-66`
- `AGENTS.md:57-105`, `:193-211`, `:417-419`
- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:30-74`
- `.claude/settings.json:77-90`; `.codex/hooks.json:33-49`; `.cursor/hooks.json:79-89`; `.devin/hooks.v1.json:34-48`
- `.pi/extensions/prompt-advisor.ts:45-106`
- `.opencode/agents`, `.claude/agents`, `.pi/agents` exact-string overlap scan
- Prior measured and delivery-qualified evidence in iterations 002-003

## Assessment

- New information ratio: 0.86 (`(5 fully new + 0.5 × 2 partially new) / 7 = 0.857`, rounded; no simplicity bonus)
- Novelty justification: Five findings add directive-specific overlap, preservation, and staleness evidence; two refine prior ownership/delivery and byte baselines.
- Questions addressed: Which blocks are valuable every turn, redundant across turns, stale, or better placed once?
- Questions answered: Marginal value and preservation risks are classified for all three directives; causal compliance impact and universal live receipt remain open.

## Reflection

- What worked and why: comparing exact directive clauses against the durable framework, constitutional policy, mirrored agent definitions, and enforcement paths separated textual redundancy from enforcement redundancy.
- What did not work and why: broad grep traversed historical research payloads and could not support meaningful counts; live behavioral A/B evidence is absent.
- What I would do differently: run a controlled long-context/compaction compliance matrix with capsule-on, startup-only, and trigger-conditional variants before ranking changes.

## Recommended Next Focus

Test preservation empirically: for each runtime with working prompt hooks, capture model-visible envelopes across first turn, repeated read-only turn, code-comment mutation, completion claim, advisor failure, and post-compaction turn. Compare capsule-on versus candidate conditional/startup placements, while keeping comment-hygiene machine gates constant. Do not rank final reductions until those false-negative and compaction results exist.
