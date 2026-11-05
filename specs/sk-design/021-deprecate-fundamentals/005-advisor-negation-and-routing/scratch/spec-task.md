TASK: fill the five spec documents in specs/sk-design/021-deprecate-fundamentals/005-advisor-negation-and-routing/: spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md. Sections 1 and 2 of facts.md are DONE and verified. Section 3 (the release notes and tag) is in progress: plan it, give it its own requirement and acceptance row with Status Pending, and leave its task unchecked.
READ FIRST: scratch/facts.md (the only evidence source), the FILL comments in each file, and specs/sk-design/021-deprecate-fundamentals/004-review-remediation/ as a finished sibling for shape.
RULES: one requirement and one acceptance row per fix (negation fix, design-document route, chart-colour route, release notes). spec.md Status In Progress, Priority P1, Level 2, Created 2026-11-05, Branch `worktrees/316-deprecate-design-fundamentals`. Mark done tasks `[x]` with evidence. Plain declarative sentences. No em dash, no semicolon, no Oxford comma.
ALLOWED WRITE PATHS: the five files directly inside 005-advisor-negation-and-routing/.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file.
VERIFY and paste the last 15 lines:
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/005-advisor-negation-and-routing --strict
If it reports derived metadata drift, run the repair-derived command it prints, then validate again.
