---
title: "Deep-Research Strategy: goal unification hardening (036 / phase 008)"
trigger_phrases:
  - "goal unification hardening research"
---
# Deep-Research Strategy: goal unification hardening (036 / phase 008)

> One lineage, `deepseek-v4.1-flash` at max via cli-pi, five iterations, stop policy max-iterations. Research only: write nothing outside this folder's `research/` tree.

## Objective

The goal unification build shipped and passed its gates. Find, with `file:line` citations, what would make it more robust, better integrated, easier to use, and smaller. Every recommendation names the file and function it changes, the failure it prevents or the friction it removes, and what it costs.

## Subject

Read first: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/002-decisions-and-contract-freeze/decision-record.md` (eight frozen decisions; do not re-litigate them), then `007-retirement-docs-and-verification/review/lineages/deepseek-review/review-report.md` (fifteen findings, five P1 fixed, six P2 open follow-ups), then the code:

- `.opencode/hooks/goal/lib/goal-slice.cjs`, `goal-core.cjs`, `bin/goal.cjs`
- `.opencode/hooks/goal/pi/goal-context.ts`, `cursor/goal-inject.mjs`, `devin/goal-inject.mjs`
- `.opencode/plugins/opencode-goal.js` (bindGoal, noteResent, resendPending, renderGoalInjection, appendGoalBrief, normalizeStoredGoal)
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` (goal diagnostics), `lib/templates/level-contract-resolver.ts`
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl`, `templates/spec-kit-docs.json`, `references/workflows/goal-set-string-playbook.md`
- `.opencode/commands/speckit/assets/speckit-{plan,implement,complete,resume-auto,resume-confirm}.yaml` (`packet_goal` blocks), `.opencode/commands/goal-opencode.md`, `.cursor/commands/goal-cursor.md`, `.pi/prompts/goal-pi.md`
- `AGENTS.md` GOAL POSTURE RULE block and Quick Reference row

## Angles, one per iteration

| Iteration | Angle | Question the iteration must close |
|---|---|---|
| 1 | Hardening | Where can a bound session still be lied to or left silent: race between two sessions logging one packet, a goal.md rewritten while rendering, a stale `workspace` in the record after a repo move, a packet renamed mid-session, non-UTF8 or CRLF goal files, a binding row with a relative `../` path inside the table. Cite the line that would misbehave and the smallest fix. |
| 2 | Integration | Where do the pieces still not meet: speckit YAML tells an agent to bind but no step calls the CLI; save appends a log row by hand while the core has a locked append; the plugin has no `unbind` or `log`; Claude Code and Codex have no adapter reading `resend_pending`; the trigger index and the advisor vocabulary. Rank by how often an operator would hit the seam. |
| 3 | Operator UX | Walk the operator's day: set a goal, edit a criterion, get reminded, set again, switch packets, finish. Where is a step manual that could be automatic, a message unclear, an envelope field nobody reads, a 4000-character paste that a tool could do. Propose the smallest change per friction point and the message wording. |
| 4 | Overengineering | What shipped that no current caller needs: fields in the record nobody reads, the two-slice projection versus one, the budget block in the contract JSON versus a constant, the `packet` action on three surfaces, envelope lines, the resend reminder text length, doc paragraphs restating each other. For each, name the caller that would justify it or recommend removal. |
| 5 | Synthesis | Rank every recommendation from iterations 1 to 4 by (operator impact x confidence) / cost. Group into: do now (small, certain), do next (needs a decision), do not (rejected with reason). Each row cites file:line. |

## Evidence discipline

- Confirm by reading; mark inferred claims and say what would confirm them.
- Max 12 tool calls per iteration; no sub-dispatch; no writes outside `research/`.
- Do not propose reopening D1 to D8. Propose within them.

## Deliverables in `research.md`

1. Hardening table: defect, line, fix, test.
2. Integration seam table: seam, who hits it, fix.
3. UX friction table: moment, friction, change, wording.
4. Overengineering table: item, caller today, keep or remove.
5. Ranked recommendation list with the three groups above.
