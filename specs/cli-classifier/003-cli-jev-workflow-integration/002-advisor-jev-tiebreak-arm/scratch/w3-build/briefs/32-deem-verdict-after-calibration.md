GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm

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

TASK: a stopped arm prints no verdict line. runDeemArm prints the Deem column and verdict before its noul calibration pass, so a stop in that pass leaves a printed verdict beside `deem arm stopped: ...`. Print the column lines and the verdict only after the calibration pass completes. Tests pin it.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read runDeemArm to its end first.

In the script, inside runDeemArm only:
1. Old (end of the `if (headroom === 'ok')` block):
    column = summarizeColumn('deem', rows, records, census);
    for (const line of columnLines(column)) out(line);
    column.line = verdictLine(column, `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`);
    out(column.line);
  }
   New:
    column = summarizeColumn('deem', rows, records, census);
  }
2. After the noul loop (after its closing `}` and before `const m = calibrationMetrics(pairs);`), add:
  // A stop anywhere in the arm returns above, so a verdict prints only for a finished arm.
  if (column) {
    for (const line of columnLines(column)) out(line);
    column.line = verdictLine(column, `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`);
    out(column.line);
  }
3. Update runDeemArm's JSDoc sentence about stops if it says otherwise. Nothing else changes.

In the vitest file, in describe('score-jev-tiebreak deem calibration'), add at its end:
  it('prints no verdict when the noul pass stops', async () => {
    const stub = makeStub('cli-deem', [
      `if [ "$1" = health ]; then echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0; fi`,
      `cat > /dev/null; if [ "$1" = noul ]; then exit 3; fi`,
      `echo '{"model":"deem-0.8-v1","answers":{"answer":{"choice":"b","probabilities":{"b":0.8,"none":0.05}}}}'`,
    ].join('\n'));
    const dir = mkdtempSync(join(tmpdir(), 'jev-tiebreak-deem-stop-'));
    const lines: string[] = [];
    try {
      await main(['--deem', '--out', dir], {
        census: { ...synthCensus(), rows: movableRows(), labels },
        out: (line: string) => lines.push(line),
        env: { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` },
        timeoutMs: 5000,
      });
      const report = JSON.parse(readFileSync(join(dir, 'report.json'), 'utf8'));
      expect(lines).toContain('deem arm stopped: backend refused');
      expect(lines.some((line) => line.startsWith('verdict: '))).toBe(false);
      expect(lines.some((line) => line.startsWith('column: '))).toBe(false);
      expect(report.columns).toEqual({});
      expect(report.stopped.deem).toBe('deem arm stopped: backend refused');
    } finally {
      rmSync(stub, { recursive: true, force: true });
      rmSync(dir, { recursive: true, force: true });
    }
  }, 60_000);

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
Accept when: 2 files changed and nothing else; node --check exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm
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
