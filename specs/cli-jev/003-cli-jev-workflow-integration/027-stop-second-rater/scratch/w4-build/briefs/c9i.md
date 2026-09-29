GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater/scratch/w4-build

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

TASK: add one test that a passed label gate opens no arm when the census prints `no headroom`. One change in T. Change nothing in S.
T = `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts`. Read it first. S = `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` (read only; after a passed label gate, `no headroom` now prints `jev arm skipped: no headroom` then `deem arm skipped: no headroom` and calls neither backend).
WHY: the test `census prints no headroom on a saturated fixture` passes no `--gold-reads`, so the label gate stops the arms first and the headroom rule is never what closes them.
EDIT: in the same `describe` block, right after the whole `it('census prints no headroom on a saturated fixture', ...)` block, add exactly:
  it('no headroom closes both arms after the label gate passes', async () => {
    const repo = gitRepo();
    for (let index = 0; index < 10; index += 1) {
      makeLineage(repo, `lineage-${index}`, {
        config: {},
        records: [iteration(1, 0.04), iteration(2, 0.04), iteration(3, 0.04)],
        deltas: {
          'iter-001.jsonl': [{ type: 'finding', source: `src-${index}-a` }],
          'iter-002.jsonl': [{ type: 'finding', source: `src-${index}-b` }],
          'iter-003.jsonl': [{ type: 'finding', source: `src-${index}-c` }],
        },
      });
    }
    commitAll(repo);
    const { log, env } = stubBackends();
    const rows = Array.from({ length: 10 }, (_, index) => ({
      lineage: `lineage-${index}`,
      gold_iteration: rater.deriveGold(rater.deltaIterationFiles(path.join(repo, `lineage-${index}`))).gold,
      labeler: 'operator',
    }));
    const readsFile = path.join(tempDir('stop-rater-reads-'), 'gold-reads.jsonl');
    fs.writeFileSync(readsFile, rows.map((row) => JSON.stringify(row)).join('\n') + '\n', 'utf8');
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await rater.main(['--jev', '--deem', '--out', tempDir('stop-rater-out-'), '--gold-reads', readsFile], {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      repoRoot: repo,
      env,
    });
    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines.some((entry) => entry.startsWith('stop:'))).toBe(false);
    const headroomIndex = lines.indexOf('no headroom');
    const jevIndex = lines.indexOf('jev arm skipped: no headroom');
    expect(headroomIndex).toBeGreaterThan(-1);
    expect(jevIndex).toBeGreaterThan(headroomIndex);
    expect(lines.indexOf('deem arm skipped: no headroom')).toBeGreaterThan(jevIndex);
    expect(fs.existsSync(log)).toBe(false);
  });
Change nothing else.
VERIFY (repo root), paste the result line:
  grep -c "no headroom closes both arms after the label gate passes" .skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts
Accept when: only T changed and the grep prints 1. The orchestrator runs vitest.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater/scratch/w4-build
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
