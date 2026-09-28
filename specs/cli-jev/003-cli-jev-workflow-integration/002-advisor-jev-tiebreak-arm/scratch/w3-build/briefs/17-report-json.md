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

TASK: write report.json to the --out directory of a run with a model switch, holding each column under columns.<backend> with its verdict, verdict line and the four keep conditions. Tests pin it.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read runJevArm's and runDeemArm's verdict lines, compareLine and main first.

In the script:
1. Line 11, the node:fs import: add writeFileSync to the imported names (keep them sorted).
2. Line 1050 (runJevArm) calls out(verdictLine(summary, ...)). Make it two lines with the same template argument: `summary.line = verdictLine(summary, <same template>);` then `out(summary.line);`. Line 1203 (runDeemArm) calls out(verdictLine(column, ...)): the same split with `column.line`.
3. Directly after compareLine, add with a JSDoc block: export function buildReport(censusSummary, jevResult, deemResult, compare).
   Start from { headroom: censusSummary.headroom, census: censusSummary.lines, columns: {}, calibration: {}, stopped: {}, compare: compare ?? null }.
   A column s goes in as: const { decidedRr, conditions, verdict, line, ...rest } = s; then { ...rest, verdict: { outcome: verdict, line, conditions } }.
   jevResult: 'stopped' in it -> stopped.jev = jevResult.stopped; 'decidedRr' in it -> columns.jev = that column; 'calibration' in it -> calibration.jev = jevResult.calibration.
   deemResult: 'stopped' in it -> stopped.deem; deemResult.column set -> columns.deem = that column; 'calibration' in it -> calibration.deem. An undefined result adds nothing. Return the object.
4. main, line 1493. Old:
      if (jevColumn && deemColumn) out(compareLine(compareColumns(jevColumn, deemColumn)));
   New:
      const compare = jevColumn && deemColumn ? compareColumns(jevColumn, deemColumn) : null;
      if (compare) out(compareLine(compare));
      if (typeof values.out === 'string' && values.out !== '' && (values.jev === true || values.deem === true)) {
        mkdirSync(values.out, { recursive: true });
        writeFileSync(join(values.out, 'report.json'), `${JSON.stringify(buildReport(summary, jevResult, deemResult, compare), null, 2)}\n`);
      }

In the vitest file, import buildReport and:
1. Add describe('score-jev-tiebreak report') with it('files columns, calibration, stops and the comparison'):
   buildReport({ headroom: 'ok', lines: ['census line'] }, { stopped: 'jev arm stopped: key rejected' }, { column: { backend: 'deem', wins: 6, decidedRr: { r1: 1 }, conditions: { sign: { value: 0.0156, held: true } }, verdict: 'keep', line: 'verdict: keep backend=deem' }, calibration: { measured: 3 } }, null)
   toEqual { headroom: 'ok', census: ['census line'], columns: { deem: { backend: 'deem', wins: 6, verdict: { outcome: 'keep', line: 'verdict: keep backend=deem', conditions: { sign: { value: 0.0156, held: true } } } } }, calibration: { deem: { measured: 3 } }, stopped: { jev: 'jev arm stopped: key rejected' }, compare: null }.
   And buildReport({ headroom: 'none', lines: [] }, undefined, undefined, null) equals { headroom: 'none', census: [], columns: {}, calibration: {}, stopped: {}, compare: null }.
2. In describe('score-jev-tiebreak deem calibration'), inside run()'s try block, read const report = JSON.parse(readFileSync(join(dir, 'report.json'), 'utf8')); and return { lines, calls, report }. In it('prints the calibration line after a six-row choice arm and records each noul') add:
    const verdict = result.lines.find((line) => line.startsWith('verdict: '));
    expect(result.report.columns.deem.verdict.line).toBe(verdict);
    expect(verdict?.startsWith(`verdict: ${result.report.columns.deem.verdict.outcome} backend=deem `)).toBe(true);
    expect(Object.keys(result.report.columns.deem.verdict.conditions)).toEqual(['sign', 'mrr', 'right3', 'flip']);
    for (const c of Object.values(result.report.columns.deem.verdict.conditions) as Array<{ value: number, held: boolean }>) { expect(typeof c.value).toBe('number'); expect(typeof c.held).toBe('boolean'); }
    expect(result.report.calibration.deem.measured).toBe(3);
    expect(result.report.columns.deem.decidedRr).toBeUndefined();

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
