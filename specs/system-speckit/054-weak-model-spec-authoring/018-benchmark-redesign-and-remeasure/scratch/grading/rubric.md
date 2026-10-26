# Blind grading rubric for the min-percent benchmark packets

Each grader sees one packet under a neutral label, never the variant. It reads the real
`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` before scoring.
The task every packet answers: add `--min-percent <N>` to that script; the script exits 3 when its
Overall Completion is below N and exits 0 otherwise, and its output is unchanged.

The earlier blind rounds kept no written rubric, so their totals are not directly comparable with
these. Compare variants within this round only.

Score each dimension from 0 to 5. The total is out of 30.

| Dimension | 5 means | 0 means |
|-----------|---------|---------|
| Grounding | Every claim about the current script (its options, its `Overall Completion` output, its existing exit codes, the file and line it would change) matches the real script | Claims are invented or contradict the script |
| Requirements | The requirements are testable and cover the feature: exit 3 below N, exit 0 at or above N, output unchanged, and what a missing or non-numeric value does | Requirements are vague, missing or wrong |
| Verification | Every task ends with a `Verify:` clause naming a command and the output that proves it, and the checks would catch a wrong implementation | No verify clauses, or checks that prove nothing |
| Scope | The packet stays on this one option at the level it used, adds no invented subsystems, and leaves no filler section or unfilled token | Large off-task content, filler or tokens left |
| Consistency | `spec.md`, `plan.md` and `tasks.md` agree on ids, file paths, exit codes and numbers | The documents contradict each other |
| Clarity | A developer could implement the option from the packet without asking a question | The packet cannot be acted on |

Write the result as JSON to `scratch/grading/<label>.json`:

```json
{"label": "<label>", "scores": {"grounding": 0, "requirements": 0, "verification": 0, "scope": 0, "consistency": 0, "clarity": 0}, "total": 0, "notes": {"grounding": "", "requirements": "", "verification": "", "scope": "", "consistency": "", "clarity": ""}, "defects": ["file:line: what is wrong"]}
```
