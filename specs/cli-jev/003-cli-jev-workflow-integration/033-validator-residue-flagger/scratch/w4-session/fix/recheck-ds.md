GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are a read-only reviewer (DeepSeek). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: read-only recheck of three fixes made after your review. Edit nothing, create nothing, run no git command that writes.
Your review's findings and the fixes, all by Pi MiMo:
1. P1: a review file in the git index but not at HEAD aborted the run (`git show HEAD:<path>` exited 128). Fix `c8f`: `trackedFiles` in `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` now runs `git ls-tree -r -z --name-only HEAD` in place of `git ls-files -z`, so the census and the draw list HEAD's tree, the tree they read. Fix `c8g`: `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` adds the test `staged review file`, which stages a review file with one finding row, commits nothing, and expects `main([])` to exit 0 with the census at `files=2` and `rows=6`.
2. P2: the catalog leaf said every run prints the margin, the keep rule and the questions, which `--draw` does not. Fix `f1` in `.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/residue-flagger-measurement.md`: "Every run except `--draw`", and "A draw prints only its one `draw:` line."
3. P2: the playbook leaf's `version:` was 1.11.0.37 where `frontmatter-version.mjs` derives 1.11.0.0. Fix `f1` in `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/residue-flagger-measurement.md`.
Also in `f1`, because of fix 1: the catalog leaf and `.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.0.37.md` now say the census walks the markdown in HEAD's tree (committed at HEAD) instead of "tracked" markdown, the catalog leaf says a staged, uncommitted review file is left out, and a cited path outside HEAD's file list is refused.
Check each fix against the code. Weigh whether listing HEAD's tree changes any other caller of `trackedFiles` (`resolveLocation`'s refusal set, the draw) in a way the docs or the spec do not allow. Run `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` from the repo root and paste its `pass` and `fail` lines. The deep-review `SKILL.md` is out of scope for this recheck. Report one line `closed|open - evidence` per finding, then any new P0 or P1 in the five named files. End with exactly one line `VERDICT: PASS` (the P1 closed, nothing new at P0 or P1) or `VERDICT: FAIL`.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.

DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
