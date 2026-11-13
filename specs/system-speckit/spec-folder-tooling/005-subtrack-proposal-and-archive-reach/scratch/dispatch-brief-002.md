REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/364-subtrack-proposal-archive-reach
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

OTHER GATES, ALSO PRE-RESOLVED
- Git workspace: this worktree, branch worktrees/364-subtrack-proposal-archive-reach. Do not create branches or worktrees. Do not stage, commit or push.
- You are the single worker. Do not dispatch agents.

ROLE
You implement one planned phase of a spec packet: the subtrack proposal tool and the wording that raises a subtrack as a choice.

CONTEXT (P = specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach). Read in this order:
1. `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/goal.md` (frozen decisions D1-D5), then `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal/goal.md`.
2. `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal/spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`. This is your frozen scope.
3. `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine/implementation-summary.md` and `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs`: phase 001 is built. Your map output must be accepted by its `--map` preflight. It refuses a mixed track, a number already used by a live or archived sibling, and it declares a new sub-track named in a map during the same run.
4. `.skilled/skills/sk-code/SKILL.md` and what its router resolves for JavaScript and shell here, before your first code write. For the markdown edits, `.skilled/skills/sk-doc/SKILL.md` and what its router resolves.
5. `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/scratch/exploration-findings.md` for pointers. Open a file before relying on a pointer.

ACTION
Execute every task in `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal/tasks.md` in order. Capture the test baseline the tasks name before the first code edit. Run each task's Verify command and read its output. Mark a task `[x]` only after its Verify produced the stated result, and record evidence in `acceptance-criteria.md` as that file instructs. Append to the phase goal log only with `node .skilled/hooks/goal/bin/goal.cjs packet-log <phase folder> "<item> | <state> | <evidence>" --workspace .`. Fill the phase `implementation-summary.md` following `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`.

One scope decision already made by the orchestrator: `.skilled/commands/speckit/assets/speckit-implement.yaml` carries the same option C wording as the plan and complete presentation assets. Change it too, with the same clause, and record that in the phase spec.md as an answered open question.

CONSTRAINTS
- Write only the files named in the phase spec.md "Files to Change" table, `speckit-implement.yaml` as stated above, the phase folder's own docs and `scratch/`.
- `suggest-subtracks.mjs` is read-only: a run must leave `git status --porcelain` unchanged.
- Never run `relocate.mjs --apply`, `archive.sh` or `create.sh` against this worktree's real `specs/` tree. Dry runs are allowed. If you need an apply or a scaffold, do it in a throwaway `git clone --shared` under `/private/tmp` and delete it before you finish.
- No new npm dependency. No tests beyond what the phase docs name; the vitest suites belong to phase 005.
- Code comments state the durable why. They never contain spec paths, packet or phase numbers, or REQ, task or CHK ids.
- In `AGENTS.md` change only the one clause the spec names. Do not touch any other line of it.
- No em dashes and no semicolons in prose you write.
- If the spec asks for something the code makes impossible or wrong, implement what is sound and report the conflict with file:line evidence. Stop after three failed fixes for the same symptom.

VERIFICATION (run last, read the output)
1. `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` and compare with the baseline in `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine/scratch/baseline.txt` (vitest 2524 passed, 20 skipped, 0 failed).
2. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal --strict` must print `RESULT: PASSED`.
3. `git status --porcelain` must show nothing outside the allowed write set.

RETURN FORMAT
1. Per task: done or not done, the Verify command and its decisive output line.
2. Files created or modified.
3. `npm test` counts against the baseline, and the validator result line.
4. Every deviation from spec.md with the reason and file:line.
5. Anything unfinished or uncertain. Do not claim a result you did not observe.
