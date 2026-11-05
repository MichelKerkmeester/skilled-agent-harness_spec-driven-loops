TASK: fill the five spec documents in `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/`: spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md. The work they describe is ALREADY DONE and verified. You are documenting it, not doing it.
Phase scope: the sk-design side and every repointed link, mirror and compiled-routing file. See the PHASE 002 block in facts.md.
READ FIRST:
1. specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/scratch/facts.md. This is the only evidence source. Every command, number and result you write must come from it. Do not invent results, and do not run the implementation commands again.
2. Each of the five files in specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/. Each has FILL comments that say what goes in every section. Follow them.
3. One finished example for shape: specs/sk-design/020-chart-and-diagram-review (read any child spec.md, tasks.md and implementation-summary.md there).

RULES:
- Replace every [YOUR_VALUE_HERE: ...] and every "[To be defined during planning]" with real content from facts.md. Delete FILL comments only if the template says to; otherwise leave HTML comments as they are.
- Set Status to Complete in spec.md metadata. Branch is `worktrees/316-deprecate-design-fundamentals`. Priority P1. Created 2026-11-05.
- Mark every task in tasks.md done (`[x]`) with its evidence from facts.md. Mark every acceptance-criteria.md row with its evidence.
- Measured Behavior blocks quote the baseline lines from facts.md verbatim.
- Keep the frontmatter keys. Write a real one-line description and 2 to 4 trigger_phrases about this phase.
- Plain declarative sentences. No em dash, no semicolon, no serial comma.

ALLOWED WRITE PATHS: the files directly inside specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/ (not its scratch/ folder).
BANNED OPERATIONS: any git command that changes state, deleting files, editing anything outside the allowed paths, editing facts.md.

VERIFY BEFORE YOU FINISH, and paste the last 15 lines of the output at the end of your reply:
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals --strict
It must print "RESULT: PASSED" with no PLACEHOLDER_FILLED warning. Fix and rerun until it does.
