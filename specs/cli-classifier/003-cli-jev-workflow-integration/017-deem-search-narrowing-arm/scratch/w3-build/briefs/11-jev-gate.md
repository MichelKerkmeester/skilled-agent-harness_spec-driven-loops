GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm

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

TASK: add the Jev gate behind --jev (identity line first, three checks, --out refusal after a passing gate) and record its skip in report.json, with three vitest cases.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. R = specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/briefs/ref-gates.mjs (read only). Read S, T and R's jevGate first.

In S:
1. New section `8. JEV ARM` between sections 7 and 9: exported JEV_VERSION = 'jev 0.6.2' and a port of R's jevGate(ctx), ctx = { out, env, timeoutMs }, reusing the module's which(). Same printed lines: first `jev: path=<path or none> provider=<P>` where P = ctx.env.JEV_PROVIDER || 'official'; then 'jev arm skipped: jev not on PATH'; or 'jev arm skipped: version' followed by `jev: found=<JSON.stringify(found)> path=<path>` when `jev --version`'s first stdout line is not exactly JEV_VERSION; or 'jev arm skipped: no credential' when `jev auth status --provider P` exits non-zero. Returns { passed, path, provider }, and a failing result also carries reason: the skip line. The gate reads no key and passes none; jev resolves its own.
2. main, after the Deem block: if (values.jev === true) { if (!summary.headroom) out('jev arm skipped: no headroom'); else { const jevCheck = jevGate({ out, env, timeoutMs }); if (jevCheck.passed && (typeof values.out !== 'string' || values.out === '')) { err('--jev needs --out <dir> so every call is recorded'); return 2; } keep jevCheck's skip reason for the report } }. buildReport's skipped.jev gets that reason. A failed gate leaves every other line exactly as the default run prints it and the run returns 0. Leave the comment `// The Jev arm runs here after a passing gate.` where a passing gate continues.

In T add describe('score-track-narrowing jev gate'). Each case: root = tempDir, ({ indexPath, probesPath } = smallCorpus(root)), base = await runMain([], deps) for the same deps, env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` } with env.JEV_PROVIDER deleted unless named, and the jev log read from path.join(stubs, 'jev.log') split on '\n' with empty lines dropped.
 1. 'prints the jev path and provider official first, then skips with no credential': stubs = stubDir({ jev: `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 3;; esac` }); run = runMain(['--jev', '--out', tempDir('stn-out-')], deps): code 0; run.lines.filter((line) => !base.lines.includes(line)) equals [`jev: path=${path.join(stubs, 'jev')} provider=official`, 'jev arm skipped: no credential']; the jev log equals ['--version', 'auth status --provider official']; the out dir's report.json has skipped.jev 'jev arm skipped: no credential'.
 2. 'skips a jev that is missing or reports another version': with env PATH '/usr/bin:/bin' the added lines are ['jev: path=none provider=official', 'jev arm skipped: jev not on PATH']; with stubDir({ jev: `case "$1" in --version) echo '0.2.3';; esac` }) they are [`jev: path=${path.join(stubs, 'jev')} provider=official`, 'jev arm skipped: version', `jev: found="0.2.3" path=${path.join(stubs, 'jev')}`] and the jev log equals ['--version']. Both return 0.
 3. 'refuses a passing jev gate without --out before any call': stubs = stubDir({ jev: `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 0;; esac` }), env.JEV_PROVIDER = 'openrouter'; runMain(['--jev'], deps) gives code 2, an err line '--jev needs --out <dir> so every call is recorded', and the jev log equals ['--version', 'auth status --provider openrouter'].

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs
Accept when: 2 files changed and nothing else; node --check exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm
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
