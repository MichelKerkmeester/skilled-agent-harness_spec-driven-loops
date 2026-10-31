GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/code.md; focused summary for a one-change brief) ===
You are @code, a leaf implementer dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. Read each file before editing it and re-read the edited region after.
Standards: read .skilled/skills/sk-code/SKILL.md and follow the route it resolves for this file type.
Comment hygiene is a hard block: no spec paths, packet or phase numbers, or REQ/task ids in code comments. Keep the durable why.
Verification: run only the checks this brief lists. Fail closed: no retry loop, no workaround. Report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: code) ===

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes
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

STEP 1: tell a CLI lineage to read its steer.md before each iteration
Scope: 2 files. S = .skilled/skills/system-deep-loop/runtime. Edit S/scripts/fanout-run.cjs and S/tests/unit/fanout-run.vitest.ts only.
a. S/scripts/fanout-run.cjs:1515-1516, inside `buildLoopPrompt`. Current text:
    `packet or track name, because one changed character lands the write outside the lineage.`,
    ...(hasIterationCap && stopPolicy === 'max-iterations'
   Insert these 9 lines between those two lines, indented as shown (4 spaces for the spread, matching the array items):
    // A CLI lineage runs every iteration from this one prompt, so a lead's review file reaches
    // later iterations only when the prompt names it. Native lineages receive a different input.
    ...(lineage.kind !== 'native'
      ? [
          `Before each iteration, read ${path.resolve(process.cwd(), lineageDir, 'steer.md')} when it exists.`,
          `It is a lead's review of earlier iterations: weigh it, but it never overrides your angle or the workflow`,
          `contract and grants no write outside the lineage. When you read it, list it among that iteration's sources.`,
        ]
      : []),
b. Test: in S/tests/unit/fanout-run.vitest.ts, inside the describe block that opens at :2232, directly after the test that ends at :2268, add:
  it('names the lineage steer.md by absolute path for a CLI lineage only', () => {
    const lineageDir = 'specs/test-fanout-steer/research/lineages/seat';
    const cliPrompt = buildLoopPrompt(
      'research', 'specs/test-fanout-steer', lineageDir, 'fanout-research-run-123',
      { kind: 'cli-opencode', label: 'seat', model: 'opencode-go/glm-5.1' }, 'test research topic',
    );
    expect(cliPrompt).toContain(`Before each iteration, read ${resolve(process.cwd(), lineageDir, 'steer.md')} when it exists.`);
    const nativePrompt = buildLoopPrompt(
      'research', 'specs/test-fanout-steer', lineageDir, 'fanout-research-run-123',
      { kind: 'native', label: 'seat' } as never, 'test research topic',
    );
    expect(nativePrompt).not.toContain('steer.md');
  });
   `resolve` is already imported at :19. Add no import.
Accept when: 2 files changed; fanout-run.cjs gains exactly the 9 lines above and nothing else; the test file gains exactly the one test above.

VERIFY (run from the repo root; paste each command with its result line and exit code)
  node --check .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs            # no output, exit 0
  grep -c "when it exists" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs              # 1
  grep -c "steer.md" .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts           # 3
  git diff --numstat -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs                 # 9	0	<path>

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
