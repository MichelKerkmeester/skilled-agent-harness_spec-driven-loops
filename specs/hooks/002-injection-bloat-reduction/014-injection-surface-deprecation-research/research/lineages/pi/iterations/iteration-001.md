# Iteration 1: Full Inventory of Injection Surfaces

## Focus

Inventory every injection point that appends content into sessions across all six runtimes (Claude Code, Cursor, Devin, Codex, OpenCode, Pi), with file:line citations, per-turn vs per-session classification, and visibility channel ([SYS]/[MSG]/[BLOCK]/[LOG]).

## Findings

### A. Prompt-time per-turn injections (fire every user turn)

1. **Skill-Advisor Brief (advisor route line + three always-on directives).** Rendered by `renderAdvisorBrief` in `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:444-452`: `Advisor: {freshness}; use {skill} {conf}/{unc} pass.` (ambiguous two-skill variant at 443-448) followed by `\nDirectives:` + `HYGIENE_DIRECTIVE` (render.ts:106-108) + `GOVERNOR_DIRECTIVE` (render.ts:113-116) + `TERMINAL_PROOF_DIRECTIVE` (render.ts:121-123). The three directives are CONSTANT per turn; only the advisor head changes. [SOURCE: render.ts:106-123, 444-452]
2. **Directives-only fallback.** `renderAdvisorFallbackDirective` (render.ts:459-464) emits ONLY `Directives:` + the three directives with no advisor head. This is the "directives-only fallback" the task context describes: 013's Pi dedup cannot reduce it because `splitPiDirectiveBrief` requires the `\nDirectives:` separator at index > 0 (a head before the block); a brief starting with `Directives:` yields index -1 → `FULL_PI_DIRECTIVE_DELIVERY`. [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:230-244]
3. **Advisor timeout fallback.** `renderAdvisorTimeoutFallback` (render.ts:466-475): `Advisor: stale (cold-start timeout)` + `Fallback marker: {...}` — no directives block.
4. **Pi subagent-dispatch directive.** `PI_SUBAGENT_DISPATCH_DIRECTIVE` in prompt-advisor.ts:127-133, appended on EVERY Pi turn after the advisor context (`text = effectiveContext ? ... + PI_SUBAGENT_DISPATCH_DIRECTIVE : ...` at prompt-advisor.ts:387-391). Never touched by the 013 dedup ("The Pi dispatch directive is appended separately and is never affected here", prompt-advisor.ts:202-205). ~554 bytes. A compact prototype (`PI_COMPACT_SUBAGENT_DISPATCH_DIRECTIVE`, prompt-advisor.ts:135-137) exists behind `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE` (prompt-advisor.ts:110).
5. **Gate-3 spec-folder question.** Pi adapter `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts:14-59`: on `input`, runs `classifyIntent` from `spec-gate-core.mjs`; when flagged, appends `{event.text}\n\n{result.question}` and returns `{action:"transform"}`. "Once per session until answered" per injection-contract.md §2. Channel: [MSG] on Pi, [SYS] on Claude/Cursor/Devin/Codex, [SYS] via plugin on OpenCode. [SOURCE: injection-contract.md §2, spec-gate-classify.ts:14-59]
6. **Active-goal brief.** Pi adapter `.opencode/hooks/goal/pi/goal-context.ts:55-86`: `pi.on("input")` renders `core.renderGoalBrief({goal, runtimeLabel})` (`renderGoalBrief` in `.opencode/hooks/goal/lib/goal-core.cjs:290`) and appends to the visible prompt every turn; also `session_start` (restore) and `turn_end` (verify + recordTurn). Cursor: sessionStart only ([SYS]). OpenCode: session.created ([SYS]). [SOURCE: goal-context.ts:55-86, goal-core.cjs:290, injection-contract.md §2]

### B. Session-lifecycle injections

7. **Session Start Context / continuity brief.** `session-prime.ts` (system-spec-kit/mcp-server/hooks/claude/session-prime.ts) emits plain text on session start (startup or resume); Pi's `session-start-context.ts:33` bridges it via `pi.sendMessage({customType:"session-start-context", content, display:false})` — model-visible, human-invisible. [SOURCE: session-start-context.ts:11-33, injection-contract.md §4]
8. **Post-Compaction Recovery / continuity brief.** Pi `session-compact-context.ts` (native port of Devin's post-compaction.cjs): composed recovery block on `session_compact`, via `pi.sendMessage({display:false})`. [SOURCE: injection-contract.md §4]
9. **Dist-warning brief (dist-freshness).** OpenCode only: `mk-dist-freshness-guard.js` appends a stale-dist warning before a risky Bash command via `experimental.chat.system.transform` ([SYS]). [SOURCE: injection-contract.md §2, .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs]
10. **Session-start advisories** (worktree/git-hooks/dist-staleness/codex-hooks): stderr-only warnings, never reach the model ([LOG]-equivalent). Pi's bridge uses `ctx.ui.notify()` (no-op in headless). [SOURCE: injection-contract.md §4]

### C. Tool-time injections (event-triggered, not per-turn)

11. Spec-gate enforcement denial [BLOCK] — spec-gate-core.mjs `evaluateMutation`.
12. Dispatch preflight lint [BLOCK]/[SYS] — dispatch-rule-checks.mjs.
13. MCP route guard [SYS] (OpenCode [LOG]-only).
14. Post-edit quality [SYS on Pi/OpenCode; plain-stdout on Claude/Devin where it "likely never reaches the assistant's context"] — post-edit-router.cjs.
15. Task dispatch guard [BLOCK], not wired for Pi.
16. Completion evidence sentinel [LOG] — advisory only.

### D. Inventory accounting vs the research topic

The topic's candidate list maps 1:1 onto: three always-on directives (finding 1's constant tail, and finding 2 when the advisor head is absent), Pi subagent-dispatch directive (finding 4), active-goal briefs (finding 6), continuity briefs (findings 7-8), dist-warning briefs (finding 9), Gate-3 question (finding 5), skill-advisor line (finding 1's head). Tool-time [BLOCK]/[LOG] injections are event-driven and were NOT proposed for deprecation by the topic — they stay out of scope except as context.

## Sources Consulted

- .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts (lines 106-123, 443-475)
- .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts (lines 127-137, 200-244, 380-395)
- .opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts (lines 14-59)
- .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-context.ts (lines 11-33)
- .opencode/hooks/goal/pi/goal-context.ts (lines 55-86), .opencode/hooks/goal/lib/goal-core.cjs (line 290)
- .opencode/hooks/injection-contract.md (§2, §3, §4, §5)
- specs/hooks/002-injection-bloat-reduction/spec.md; 004/013 child specs

## Assessment

- **newInfoRatio: 1.0** — First inventory pass; all nine candidate surfaces located with citations. No prior iteration exists.
- **Confidence:** high for the inventory itself (injection-contract.md cross-verifies code); medium for the OpenCode visibility claims (contract doc flags unverified export shape).
- **Open questions this iteration:** which surfaces are *proven* (evidence of behavioral value), actual byte/token costs per surface, and the advisor fallback emission frequency.

## Reflection

- What worked: injection-contract.md is a purpose-built inventory — grep → code verification was fast and confirmed its §2 content matches render.ts/prompt-advisor.ts/spec-gate-classify.ts.
- What failed: nothing material.
- Ruled out: tool-time [BLOCK]/[LOG] injections (post-edit quality, dispatch guards, route guard, sentinels) are event-driven and not per-turn bloat; excluding them from the deprecation candidate set.

## Recommended Next Focus

Iteration 2: Per-surface activation evidence — the hooks/002 activation matrix (007 spec), shadow receipts for the dedup machine (004), and the hooks/001 measurement receipts — to separate proven from unproven surfaces (q2 + q4).
