# Deep Research Strategy: Plugin and Hook Opportunities

## 2. TOPIC

Identify additional OpenCode plugins and Claude hooks grounded in existing `.opencode/skills/` contracts, and map every candidate to a concrete supported runtime hook surface.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Which existing skills contain repeatable enforcement, routing, recovery, or quality logic that is currently manual or prompt-dependent?
- [x] Which additional OpenCode plugins are justified, and which exact `tool.execute.before/after`, `session.*`, or `experimental.*` surfaces should host them?
- [x] Which additional Claude hooks are justified, and which exact `PreToolUse`, `PostToolUse`, `SessionStart`, `UserPromptSubmit`, `Stop`, or `SessionEnd` surfaces should host them?
- [x] How should candidates be prioritized by value, feasibility, overlap, false-positive risk, and blast radius?
- [x] Which attractive ideas should be ruled out because the runtime surface is unsuitable or existing infrastructure already owns the behavior?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement plugins or hooks.
- Do not propose candidates without a real skill source and concrete runtime surface.
- Do not treat undocumented runtime events as available.
- Do not modify files outside this detached lineage directory.

## 5. STOP CONDITIONS

- At least three evidence iterations have completed.
- Every candidate is grounded in a cited skill and mapped to an allowed runtime surface.
- OpenCode and Claude opportunities, prioritization, and eliminated alternatives are covered.
- Convergence is legal under the configured policy, or five iterations have completed.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Which skill contracts are plausible automation candidates? Candidate families are mutation intake (`system-spec-kit`), destructive command safety (`sk-git`), post-edit quality (`code-quality`), and route/lifecycle validation (`system-skill-advisor`, `system-deep-loop`).
- Which OpenCode plugins are justified? Six candidates now have exact surfaces: two pre-execution guards, one post-edit router, one MCP route guard, and two session-lifecycle sentinels.
- Which Claude hooks are justified? Six mappings use `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, and `Stop`; duplicate `SessionStart`/`SessionEnd` work is deliberately avoided.
- How should candidates be prioritized? Git safety and spec mutation lead, followed by post-edit quality and graph freshness; semantic sentinels remain advisory-first.
- Which ideas should be eliminated? Duplicate hook registrations, broad per-edit suites, evidence-free design scoring, blanket MCP blocking, Stop-time tests, and shared transport adapters are unsuitable.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Current plugin inventory plus source-skill contract reads efficiently separated gaps from already-shipped behavior. (iteration 1)
- Existing plugin implementations supplied reusable command extraction, fail-open behavior, cache, session cleanup, and context-injection patterns. (iteration 2)
- Live Claude settings and source hooks exposed actual matcher, timeout, ownership, and deny/advisory contracts. (iteration 3)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- The initial memory-context lookup timed out; repository evidence is the fallback.
- Broad hook-term search was noisy because generated and archived artifacts dominated results. (iteration 1)
- Repository-wide `tool.execute.after` search included archived and sibling-lineage artifacts; current source and tests were required to resolve drift. (iteration 2)
- A settings glob missed `.claude/settings.json`; exact search and read recovered the live wiring. (iteration 3)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- Generic prompt-context plugin: overlaps advisor, memory, code-graph, and goal entrypoints. (iteration 1)
- Hook-owned deep-loop convergence: violates mode-packet and runtime ownership. (iteration 1)
- Full quality suites after every mutation: too expensive for `tool.execute.after`. (iteration 2)
- Design-audit auto-scoring: lacks rendered and register evidence. (iteration 2)
- Blanket `mcp__*` blocking: breaks native MCP exemptions. (iteration 2)
- Duplicate Claude hook entries: extend existing owners to avoid duplicate execution and ordering ambiguity. (iteration 3)
- SessionEnd completion verification and Stop-time tests: wrong lifecycle timing or unbounded cost. (iteration 3)
- Shared transport adapter across runtimes: parity belongs in shared policy cores, not event adapters. (iteration 3)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Automatic full quality suites after every edit: path-specific lightweight checks are the viable form. (iteration 2)
- Automatic design-audit scores from file edits: a write hook cannot establish visual evidence. (iteration 2)
- Duplicate PostToolUse/UserPromptSubmit registrations: extend the existing source-skill owner. (iteration 3)
- SessionEnd completion checks and Stop-time test execution: too late or too expensive. (iteration 3)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Saturated: none yet
- Remaining frontier: implementation smoke tests only; research questions are saturated
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

None. Implementation validation gaps are retained in the synthesis.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Converged after iteration 3: synthesize the ranked cross-runtime roadmap and implementation validation gaps.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- The requested runtime surface set is closed: OpenCode `tool.execute.before/after`, `session.*`, `experimental.*`; Claude `PreToolUse`, `PostToolUse`, `SessionStart`, `UserPromptSubmit`, `Stop`, `SessionEnd`.
- Every candidate must cite a real skill under `.opencode/skills/`.
- Memory context was unavailable after timeout; direct repository evidence is authoritative for this lineage.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Minimum iterations: 3
- Convergence threshold: 0.05
- Stop policy: convergence
- Per-iteration budget: 12 tool calls, 10 minutes
- Allowed write root: `.opencode/specs/skilled-agent-orchestration/133-plugin-hook-opportunities/research/lineages/gptsol`
- Executor: `cli-opencode`, model `openai/gpt-5.6-sol-fast`
- Session: `fanout-gptsol-1783743995827-g7k8yl`
