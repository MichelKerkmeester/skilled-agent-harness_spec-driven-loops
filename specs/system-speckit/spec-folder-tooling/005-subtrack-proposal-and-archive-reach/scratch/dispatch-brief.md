REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/364-subtrack-proposal-archive-reach
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

OTHER GATES, ALSO PRE-RESOLVED
- Git workspace: this worktree, branch worktrees/364-subtrack-proposal-archive-reach. Do not create branches or worktrees. Do not commit, push or stage.
- Execution mode: autonomous. Dispatch: you are the single worker; do not dispatch agents.
- Session goal: author the goal files; do not call any goal-setting tool.

ROLE
You are the planning author for one spec packet. You write planning documents only. You write no runtime code.

CONTEXT
The packet is scaffolded (Level 2, phase parent plus five children) and every template still holds placeholders. Read these first, in order:
1. `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` (how to fill spec docs; follow it).
2. `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/scratch/approved-plan.md` (the operator-approved design; it is frozen scope).
3. `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/scratch/exploration-findings.md` (file and line pointers; only items marked "(checked)" were verified, open every other file before you cite it).
4. `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` and the references it routes to, before touching any `goal.md`.

ACTION
1. Fill the parent `spec.md`: root purpose, the five-phase documentation map, the operator decisions, the out-of-scope list. Keep the phase-parent content discipline stated in the file's own comment.
2. For each child (`001-relocation-engine`, `002-subtrack-proposal`, `003-subtrack-archive-and-numbering`, `004-archive-search-and-json`, `005-tests-and-closeout`) fill `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md`. Map each child to the same-numbered phase of the approved plan. Every requirement and task names the real file it touches. Leave `implementation-summary.md` as scaffolded.
3. Author the parent `goal.md` as a phase-parent goal that binds the five child goals, following sk-create-goal. Its durable slice must stay within 4,000 characters; check with `node .skilled/hooks/goal/bin/goal.cjs packet specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach --workspace .` and require `packet_budget=ok`.
4. Replace every `[YOUR_VALUE_HERE: ...]` token and every bracketed placeholder. Status stays Draft. Created date is 2026-11-13.

CONSTRAINTS
- Write only inside `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/`. Touch nothing else in the repository.
- Do not add scope beyond the approved plan. If a pointer in the findings does not match the file, write what the file actually says and list the mismatch in your report.
- No em dashes, no semicolons in prose. Plain sentences.
- Do not hand-edit `description.json` or `graph-metadata.json`.

VERIFICATION (run, read the output, fix, rerun; at most three repair rounds)
`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach --strict --recursive`
The target is an explicit `RESULT: PASSED` for the parent and all five children.

RETURN FORMAT
1. The final validator result line for each of the six folders, quoted.
2. The list of files you wrote.
3. The `packet_budget` and `packet_slice_hash` lines from the goal command.
4. Every findings pointer that did not match the file, as `path:line, expected, actual`.
5. Anything you could not finish, and why.
