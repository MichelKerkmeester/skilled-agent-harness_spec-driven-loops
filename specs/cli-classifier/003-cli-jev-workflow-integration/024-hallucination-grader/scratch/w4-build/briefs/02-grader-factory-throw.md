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

TASK: the scorer's D4 grader factory throws for a grader kind it does not know, instead of silently returning the mock stub. 2 files. M = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark

STEP 1. M/scorer/score-model-variant.cjs, function buildGraderFn (lines 197-226).
a. In its JSDoc, line 205 reads ` * @returns {Function} Async grader function (virtualFixture, outputText, opts)`. Insert after it one line:
` * @throws {Error} When graderKind is not 'llm', 'mock' or 'noop'`
b. Lines 208-211 read exactly:
```
  if (graderKind === 'noop') {
    return async () => ({ score: 1.0, confidence: 1.0, parse_status: 'noop', dim_id: 'D4', rationale: 'grader disabled (noop)', evidence: [] });
  }
  const mode = graderKind === 'llm' ? 'real' : 'mock';
```
Insert between the closing `  }` and the `const mode` line exactly:
```
  // An unknown kind used to fall through to the mock stub, which scores D4
  // with fake numbers; fail loudly so the caller sees the typo.
  if (graderKind !== 'llm' && graderKind !== 'mock') {
    throw new Error(`buildGraderFn: unknown grader kind '${graderKind}' (expected noop, mock or llm)`);
  }
```
Do not change the `graderKind = 'mock'` default in `score()` (line 253) or the CLI default (line 354). Change nothing else.

STEP 2. M/tests/scorer.vitest.ts. Inside `describe('buildGraderFn factory', ...)` (starts line 147), after the `it('mock grader returns a parseable deterministic score (no LLM)', ...)` block and before the describe's closing `});`, add:
```
  it('throws for a grader kind outside noop, mock and llm', () => {
    expect(() => scorer.buildGraderFn('jev')).toThrow(/unknown grader kind 'jev'/);
  });
```

VERIFY (repo root; paste each command, its result line and exit code):
  node --check .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs
  node -e "try { require('./.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs').buildGraderFn('jev'); console.log('no throw'); } catch (e) { console.log(e.message); }"   (expect: buildGraderFn: unknown grader kind 'jev' (expected noop, mock or llm))
  node -e "const m = require('./.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs'); for (const k of ['noop','mock','llm']) console.log(k, typeof m.buildGraderFn(k));"   (expect three lines ending in function)
  grep -c "throws for a grader kind outside" .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts   (expect 1)
Accept when: 2 files changed (score-model-variant.cjs, scorer.vitest.ts) and nothing else; each check prints what it expects.

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
