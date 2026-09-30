GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader

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

TASK: the benchmark runner refuses an unknown --grader value before any profile loads (today `--grader jev` silently scores with the mock stub). 2 files. M = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark

STEP 1. M/run-benchmark.cjs. Line 579 is `  const allowSameFamily = args['allow-same-family'] === true || args['allow-same-family'] === 'true';` and line 582 is the long `    process.stderr.write('Usage: node run-benchmark.cjs --profile ... [--allow-same-family]\n');`.
a. Insert after line 579 one line: `  const usage = '<the exact string literal content of line 582's write, including the trailing \n>';`
b. Replace line 582 with `    process.stderr.write(usage);`
c. Insert right after the closing `  }` of that `if (!profileArg || !outputsDir || !outputPath)` block (old line 584), one blank line, then exactly:
```
  // The scorer turns any grader kind it does not know into the mock stub, so an
  // unknown value would score with fake D4 numbers and print nothing. Refuse it
  // here, before any profile loads.
  const VALID_GRADERS = new Set(['noop', 'mock', 'llm']);
  if (!VALID_GRADERS.has(graderKind)) {
    process.stderr.write(`run-benchmark: unknown --grader '${graderKind}' (expected noop, mock or llm)\n`);
    process.stderr.write(usage);
    process.exit(2);
  }
```
Change nothing else.

STEP 2. M/tests/run-benchmark-hardening.vitest.ts. Append at the end of the file (after the last `});`, one blank line first), using the file's existing `work`, `runBenchmark`, `path`, `fs`:
```
describe('unknown grader kind', () => {
  it('exits 2 before loading the profile, naming the value and printing the usage line', () => {
    const outDir = path.join(work, 'outputs');
    const report = path.join(outDir, 'report.json');
    const r = runBenchmark(path.join(work, 'no-such-profile.json'), outDir, report, ['--scorer', '5dim', '--grader', 'jev']);
    expect(r.status).toBe(2);
    expect(r.stderr).toContain("unknown --grader 'jev'");
    expect(r.stderr).toContain('Usage: node run-benchmark.cjs --profile');
    expect(fs.existsSync(report)).toBe(false);
  });
});
```
The profile path is missing on purpose: a check that ran after the profile load would exit 1 and write an infra_failure report.

VERIFY (repo root; paste each command, its result line and exit code):
  node --check .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
  grep -c "VALID_GRADERS" .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs   (expect 2)
  grep -c "process.stderr.write(usage)" .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs   (expect 2)
  grep -c "unknown grader kind" .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts   (expect 1)
Accept when: 2 files changed (run-benchmark.cjs, run-benchmark-hardening.vitest.ts) and nothing else; node --check exits 0; each grep prints its expected count.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader
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
