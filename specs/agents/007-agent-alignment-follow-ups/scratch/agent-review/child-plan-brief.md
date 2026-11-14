# Brief: plan one child phase of packet 007 (shared part)

You are a leaf worker. Pre-resolved gates, decided by the operator and the orchestrator, do not ask about them:
- Gate 3: the spec folder is answered. You write ONLY inside your own child folder, named in your per-child block below. Nothing else in the repository changes: no agent file, no parent spec, no sibling child, no git command that writes (no add, commit, merge, stash, checkout).
- Workspace: worktree `/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups`, at commit `c1dbb1bcc4` (origin/main). Run every command from that directory. Never touch `/Users/michelkerkmeester/MEGA/Development/Skilled` (another session's dirty checkout).
- Mode: this is the planning pass of `/speckit:plan :auto` for one child. Planning only. Build nothing.
- Continuity save: do NOT run `generate-context.js`. The orchestrator runs saves one at a time afterwards, because concurrent saves touch the parent's metadata.
- Step 5's four `@context` explorers: you cannot dispatch agents, so take the workflow's own fallback ("Use inline planning activities") and do the exploration yourself with Grep, Read and Bash, scoped to your phase's files.

## What the packet is

Packet `specs/agents/007-agent-alignment-follow-ups` already holds phases 001 to 005 (Complete). A fresh read-only review of the eleven agent files in `.skilled/agents/` produced 62 findings. The orchestrator scaffolded children 006 to 014 and gave every finding exactly one owning phase.

Read these first:
1. The review report: `specs/agents/007-agent-alignment-follow-ups/scratch/agent-review/agents-review.out.md`. Each finding has file:line, a quote and the reviewer's proposed fix. The reviewer is ONE model's reading. Its tool-call minimums were never recounted, and nothing was run.
2. The ownership map: `.../scratch/agent-review/finding-to-phase.tsv`. Finding ids are `<section>-<n>` in report order within each `## <agent>` section (for example `code-2` is the second bullet under `## code`), and `across-<n>` for the six bullets under `## Across agents`.
3. The filled model to imitate for voice and shape: `specs/agents/007-agent-alignment-follow-ups/005-alignment-report-fixes/spec.md`, `plan.md` and `tasks.md`. Also the filled examples under `.skilled/skills/system-spec-kit/templates/examples/level-1/` (or `level-2/` for a Level 2 child).
4. The authoring rules: `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` (read in full). Prose follows its voice rules: no em dash, no semicolon, no serial comma, plain sentences.
5. The workflow you are executing: `.skilled/commands/speckit/assets/speckit-plan.yaml`, steps 3, 4, 5 and 5.5.

## What to do

1. Reproduce every finding your phase owns BEFORE you plan any edit. For each one, run a command at the current base (`rg -n`, `sed -n`, `wc -l`, `grep -c` and the like) and keep its verbatim output. Line numbers in the report were taken at `09f1d6499a`. The agent files did not change since, but confirm. Where a finding rests on a count (a tool-call minimum, a line count, a number of citations), recount it yourself from the written steps and show the count.
2. Classify each owned finding as one of: `reproduced` (plan a fix), `partly reproduced` (plan the part that holds, state what did not), `not reproduced` (record the evidence, plan no edit; this is a valid close because the parent purpose allows "a recorded decision that no fix is needed"), or `blocked on operator` (name the question).
3. Write `spec.md`: fill every `[YOUR_VALUE_HERE: ...]` token. Status `Planned`. Priority from the highest reproduced severity (High = P1, Medium only = P2). The `measured-behavior` anchor holds the commands and their verbatim output from step 1. Requirements: one REQ per planned fix, each with an acceptance line a command can check. Scope names every file the build will touch, including the runtime mirror steps below. Open questions name the operator questions your per-child block lists. The Phase Context section names this phase's predecessor and successor as given in your block.
4. Write `plan.md`: the fix approach per REQ, the affected-surfaces table (producers and consumers of the text you change, found with `rg`), dependencies on other phases from your block, the testing strategy (the exact verification commands), and a rollback. Record under Technical Context that the four step-5 explorers ran inline as the workflow's fallback because a leaf cannot dispatch.
5. Write `tasks.md`: ordered task rows with ids, a Phase 1 that re-runs the Measured Behavior commands before any edit, the edits, the mirror routine, and verification.
6. Level 2 children only: fill `acceptance-criteria.md`, one row per REQ with its check command. Rows stay unmarked (planning, nothing built).
7. `implementation-summary.md`: leave the build sections for the build, but replace every `[YOUR_VALUE_HERE: ...]` token with a short honest line such as "Not started. Planning only, the build waits for the operator." so no placeholder remains.
8. Validate your folder: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <your-child-folder> --strict`. Repeat until it prints `RESULT: PASSED`. Read the whole output, not the exit status. Fix only files inside your folder.

## The mirror routine every agent edit needs (put it in plan and tasks, do not run it)

After editing `.skilled/agents/<name>.md`: hand-edit the `.claude/agents/<name>.md` fork to match, then run `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs`, then `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs`. Verify those script paths exist before you cite them. The commit gate blocks a commit with an unstaged mirror. Agent files stay at or below 600 lines (`.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md:62`).

## Return (short, under 40 lines)

- The child folder path and the final validate line, quoted verbatim.
- One line per owned finding: `<id>: <reproduced|partly|not reproduced|blocked> - <one-clause evidence with file:line>`.
- REQ count, and the files the build would touch.
- Any operator question, and anything outside your folder you noticed but did not change.
- Every file you wrote.
