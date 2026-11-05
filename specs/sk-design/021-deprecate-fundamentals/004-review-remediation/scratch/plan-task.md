TASK: write the PLAN for this phase by filling four spec documents in `specs/sk-design/021-deprecate-fundamentals/004-review-remediation/`: spec.md, plan.md, tasks.md and acceptance-criteria.md. The fixes are NOT done yet. You are planning them, not doing them.
READ FIRST:
1. specs/sk-design/021-deprecate-fundamentals/004-review-remediation/scratch/facts.md. It is the only evidence source. It lists nine findings, the fix for each and the check for each.
2. The four files. Each has FILL comments that say what goes in every section. Follow them.
3. One finished sibling for shape: specs/sk-design/021-deprecate-fundamentals/003-chart-research-cleanup/ (spec.md, plan.md, tasks.md, acceptance-criteria.md).

RULES:
- One requirement per finding, REQ-001 to REQ-009, in the facts.md order. One acceptance row per requirement, AC-001 to AC-009, with the facts.md check as its Verification and Status `Pending`.
- tasks.md: one task per fix grouped as WS-1, WS-2 and WS-3, then one task for the gate run. Every task stays unchecked `[ ]` and names its file and its check.
- spec.md metadata: Status In Progress, Priority P1, Level 2, Created 2026-11-05, Branch `worktrees/316-deprecate-design-fundamentals`.
- Replace every [YOUR_VALUE_HERE: ...] and every "[To be defined during planning]". Keep frontmatter keys. Write a real one-line description and 2 to 4 trigger_phrases.
- Plain declarative sentences. No em dash, no semicolon, no serial comma.

ALLOWED WRITE PATHS: spec.md, plan.md, tasks.md and acceptance-criteria.md directly inside specs/sk-design/021-deprecate-fundamentals/004-review-remediation/.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file, making any of the fixes.

VERIFY BEFORE YOU FINISH, and paste the last 15 lines of the output at the end of your reply:
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/004-review-remediation --strict
Fix every error or warning that points at one of your four files. Ignore one that points only at implementation-summary.md, which is written after the fixes.
