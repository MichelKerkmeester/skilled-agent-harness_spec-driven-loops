# Iteration 001 — Implementer escalation / anti-thrash discipline

**Focus:** peck `implementer` agent's structured escalation gates vs spec-kit sk-code/@debug loop + CLAUDE.md escalation.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.68.

## Findings
- **[F-001-01]** Hard verify-loop ceiling: peck escalates at 3+ verify loops (`external/peck-master/src/assets/agents/implementer.md:40-44`); spec-kit has only "three fixes fail for the SAME symptom" + @debug "3+ hypotheses rejected", not a generic verify-loop budget (`.opencode/skills/sk-code/SKILL.md:247-253`, `.opencode/agents/debug.md:453-468`). GAP partial. **ADAPT** · S · low · blast: sk-code escalation rules, CLAUDE.md §4.
- **[F-001-02]** "Can't state root cause in ONE sentence → escalate" (`implementer.md:42-45`); spec-kit requires root-cause tracing but doesn't make inability-to-state it an explicit escalation gate for normal sk-code loops (`sk-code/SKILL.md:233-235`, `debug.md:483-497`). GAP partial. **ADOPT** · S · low · blast: sk-code verify loop, CLAUDE.md §4.
- **[F-001-03]** "Real codebase contradicts story → escalate for AMENDMENT, not a workaround" (`implementer.md:17-19,45-47`); spec-kit has scope-lock + Logic-Sync halt but lacks the explicit "amend the spec, don't code around it" instruction (`CLAUDE.md:23-26,310-316`). GAP partial. **ADOPT** · S · med · blast: CLAUDE.md Logic-Sync, impl/spec templates.
- **[F-001-04]** Explicit "reviewers contradict each other → escalate" gate (`implementer.md:47-49`); spec-kit has generic contradiction handling but doesn't name contradictory reviewer outputs as a stop condition. GAP partial. **ADAPT** · S · low.
- **[F-001-05]** "Escalating early is cheaper than another verify loop" cost-framing (`implementer.md:16-19`); spec-kit says don't stop early + escalate after two failed attempts, but lacks the cost framing (could reduce thrash if scoped to post-escalation-criteria). GAP partial. **ADAPT** · S · med.

## Ruled out (not net-new)
- "review Fail is blocking / don't relabel Fail as partial" — already covered by spec-kit no-completion-without-verification (`sk-code/SKILL.md:45`, `debug.md:533-539`). [→ revisited deeper in 005]
- "check escalation criteria before retry" overlaps shipped self-check/adversarial discipline (`debug.md:271-303`).
- "work against real codebase not assumptions" — covered by research-first discipline (`CLAUDE.md:59-66`).

## Verdict contribution
Net-new escalation gates worth bundling: **one-sentence-root-cause (ADOPT)** + **story-amendment-not-workaround (ADOPT)** + verify-loop-budget / reviewer-contradiction / cost-framing (ADAPT). Target: a peck-style escalation block in `sk-code` + a CLAUDE.md Logic-Sync amendment clause.
