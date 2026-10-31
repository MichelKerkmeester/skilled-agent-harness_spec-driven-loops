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

TASK: add the labels parser and a SHA-256 helper to the D4 agreement script, with two tests. 2 files.
S = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
T = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts
Read first: S, T, and section 3 of specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/design.md (implement ONLY section 3).

STEP 1. In S, insert a new section between `// 3. CENSUS` (ends after `matchOutputs`, line 123) and the EXPORTS divider:
- divider `// 4. LABELS` in the same style; renumber the EXPORTS divider from `// 4. EXPORTS` to `// 5. EXPORTS`.
- `function parseLabels(text)` exactly as design section 3: returns `Map<string, 'yes'|'no'>`; split on `\n`; a line that is empty after trim is skipped; row n is the 1-based line number; checks in this order: JSON.parse fails -> `labels row <n>: not JSON`; value not a plain object, or `output` not a non-empty string, or `output` contains `/` -> `labels row <n>: output must be a file name`; `hallucinated` not exactly `'yes'` or `'no'` -> `labels row <n>: hallucinated must be yes or no, got ${JSON.stringify(value)}` (a missing value prints `got undefined`); `output` already in the map -> `labels row <n>: duplicate output <output>`. Each is `throw new Error(message)`.
- `function sha256Hex(input)`: `crypto.createHash('sha256').update(input).digest('hex')`, accepting a string or a Buffer.
- JSDoc on both (@param, @returns, @throws on parseLabels). A one-line comment above parseLabels says why rows are checked strictly: the labels are the operator's gold, so a typo must stop the run rather than drop a row.
- Add `parseLabels, sha256Hex` to the end of the `module.exports` object.

STEP 2. In T, append a new block after the census describe:
```
describe('score-d4-agreement labels', () => {
  it('parses one yes or no label per output and skips blank lines', () => {
    const labels = d4.parseLabels('{"output":"fx-a.md","hallucinated":"yes"}\n\n{"output":"fx-b.run2.md","hallucinated":"no"}\n');
    expect([...labels.entries()]).toEqual([['fx-a.md', 'yes'], ['fx-b.run2.md', 'no']]);
    expect(d4.sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('rejects a bad label value, a non-JSON row and a duplicate output, naming the row', () => {
    expect(() => d4.parseLabels('{"output":"x.md","hallucinated":"no"}\n{"output":"y.md","hallucinated":"maybe"}\n')).toThrow('labels row 2: hallucinated must be yes or no, got "maybe"');
    expect(() => d4.parseLabels('not json\n')).toThrow('labels row 1: not JSON');
    expect(() => d4.parseLabels('{"output":"x.md","hallucinated":"no"}\n{"output":"x.md","hallucinated":"yes"}\n')).toThrow('labels row 2: duplicate output x.md');
  });
});
```
Also add `//   Labels parser (parseLabels, sha256Hex)` as a new line in T's MODULE header list.

VERIFY (repo root; paste each command, its result line and exit code):
  node --check .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
  node -e "const m = require('./.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs'); try { m.parseLabels('{\"output\":\"a/b.md\",\"hallucinated\":\"no\"}'); } catch (e) { console.log(e.message); }"   (expect: labels row 1: output must be a file name)
  grep -c "// 5. EXPORTS" .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs   (expect 1)
Accept when: 2 files changed (S and T) and nothing else; each check prints what it expects.

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
