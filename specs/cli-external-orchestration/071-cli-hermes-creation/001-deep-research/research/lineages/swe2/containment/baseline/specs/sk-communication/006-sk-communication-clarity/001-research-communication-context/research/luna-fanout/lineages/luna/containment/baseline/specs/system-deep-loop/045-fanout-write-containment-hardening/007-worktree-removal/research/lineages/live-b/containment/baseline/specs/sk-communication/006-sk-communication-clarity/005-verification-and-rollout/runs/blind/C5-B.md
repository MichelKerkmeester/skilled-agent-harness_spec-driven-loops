Case: C5

a task where a tempting but irrelevant tangent surfaces, for example a stale TODO

Reply B:

Advisor-routing accuracy. The benchmark measures whether a prompt written as a projection intent, for example "make CLI output readable", routes to `sk-communication` as the skill advisor's top match. The scorer is the advisor's own, at `.opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, and each capture run lands in a dated folder under `reports/`.

The README is explicit that this harness does not verify the underlying `cli-communication-projection` package. That package has its own gate, `npm run check` in its directory.

Reply quality is measured by a second, separate thing in the same folder. The `reply-harness/` compares replies produced before and after a rule-set change: a frozen case set, a seven-dimension weighted rubric with one blocking class, blinded replies so a judge cannot tell which condition it reads, and a comparison that exits non-zero when the no-op control moved or a blocking finding fired on the after side.

Nothing here needs your action.
