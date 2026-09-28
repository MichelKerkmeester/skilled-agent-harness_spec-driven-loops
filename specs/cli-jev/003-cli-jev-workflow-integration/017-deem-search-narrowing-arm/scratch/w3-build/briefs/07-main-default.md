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

TASK: add the entry point that prints the zero-call report, with three vitest cases and the fixture helpers later cases reuse.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. Read both first, and lookup-trigger-index.mjs lines 309-340 for its main and isMainModule guard.

In S:
1. Imports: process from 'node:process', { parseArgs } from 'node:util'; extend the lookup import with DEFAULT_INDEX_PATH and loadIndex; add { DEFAULT_REPO_ROOT } from './generate-trigger-index.mjs' and { isMainModule } from '../lib/esm-entry.mjs'.
2. New last section `9. ENTRY POINT` (7 and 8 stay free for the model arms) with `export async function main(argv, deps = {})` and JSDoc naming each deps field: repoRoot (default DEFAULT_REPO_ROOT), indexPath (DEFAULT_INDEX_PATH), probesPath (DEFAULT_PROBES_PATH), hubNames (optional, passed to buildTestSet), out and err (line writers, default process.stdout / process.stderr plus '\n'), env (default process.env), timeoutMs (default 90000), backoffMs (default 2000). Steps:
 a. parseArgs({ args: argv, strict: true, allowPositionals: false, options: { deem: { type: 'boolean' }, jev: { type: 'boolean' }, out: { type: 'string' } } }); a throw writes its message with err and returns 2.
 b. started = Date.now(). In one try: testSet = buildTestSet(repoRoot, hubNames ? { hubNames } : {}); loaded = loadIndex(indexPath, { hashIndex: false }); probes = probeGold(loaded, loadProbes(probesPath)); context = { repoRoot, cache: new Map() }; picks = testSet.rows.map((row) => ({ lookup: lookupPick(loaded, row.question, row.folder), ripgrep: ripgrepPick(row.question, row.folder, context) })); lookupProbe and ripgrepProbe = Maps from probe id to lookupPick(loaded, probe.question, null) and ripgrepPick(probe.question, null, context). A throw writes its message with err and returns 2.
 c. summary = summarizeBaselines(testSet.rows, picks); options = buildOptions(testSet.tracks); probeCount = probes with a non-empty gold; baselinePicks = Map from row id to picks[i][summary.method] (kept for the arms).
 d. out, in this order: `index manifestHash: ${loaded.manifestHash}`, every testSetLines line, every baselineLines line, every ruleLines line, every headroomLines(summary, probeCount) line. Then leave the comment `// Model arms run here, after the zero-call report and before the probe line.` Then out(probeLine(probes, [['lookup', probeHits(probes, lookupProbe)], ['ripgrep', probeHits(probes, ripgrepProbe)]])).
 e. err(`wall time: ${((Date.now() - started) / 1000).toFixed(1)} s`) so stdout stays byte-identical between runs; return 0. The default run writes no file and spawns no model binary.
3. At the end: `if (isMainModule(import.meta.url)) { process.exitCode = await main(process.argv.slice(2)); }`.

In T, import main, KEEP_RULE_LINE and fs listing helpers as needed, and add these helpers after indexFor:
 - smallCorpus(root): tracks 'alpha-track' ('Alpha fixture track for the measurement') and 'beta' ('Beta fixture track for the measurement'); packets specs/alpha-track/001-a 'run the quartz lantern calibration now please', specs/alpha-track/002-b 'check the glowing crystal output again', specs/beta/001-c 'please run the ember harbor sweep today', specs/beta/002-d 'measure the tidal stone drift again'; doc(root, 'specs/alpha-track/100-docs/spec.md', ['quartz lantern calibration']) and doc(root, 'specs/beta/100-docs/spec.md', ['ember harbor sweep']); probes.json at the root as { paraphrase: { rows: [ {caseId:'c1',locale:'latin',variant:'exact',query:'quartz lantern calibration'}, {caseId:'c1',locale:'latin',variant:'paraphrase',query:'tune the glowing crystal lamp'} ] } }. Runs indexFor(root) and returns { indexPath: path.join(root, 'out', 'idx.json'), probesPath }.
 - stubDir(bodies: Record<string, string>): a tempDir holding one executable file (mode 0o755) per name with text `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`.
 - runMain(argv, deps): collects out and err lines into arrays and returns { code, lines, errs }.
 - listFiles(dir): every file path under dir, recursive, sorted.
New describe('score-track-narrowing entry point'):
 1. 'default run prints the zero-call report, spawns no model binary and writes no file': smallCorpus(root); stubs = stubDir({ 'cli-deem': 'exit 0', jev: 'exit 0' }); before = listFiles(root); r = await runMain([], { repoRoot: root, indexPath, probesPath, hubNames: [], env: { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` } }). r.code is 0; r.lines[0] matches /^index manifestHash: [0-9a-f]{64}$/; r.lines includes 'test set: tracks=2 kept=4 usable=4 placeholder=0 leak=0 residual=0', 'baseline lookup: 2/4 right (0.5000)', 'baseline ripgrep: 2/4 right (0.5000)', 'baseline method: lookup 2/4 right', 'margin: 0.10', KEEP_RULE_LINE and 'planned calls: 15 per arm, 4 rows and 1 probes in 3 orders each', with 'margin: 0.10' before the planned-calls line; the last line is 'paraphrase probes: total=1 gold-less=0 lookup=0/1 ripgrep=0/1'; r.errs has one line starting 'wall time: '; listFiles(stubs) holds no '.log' file; listFiles(root) equals before.
 2. 'prints no headroom when the baseline is right on more than 90 percent': tracks 'alpha-track' and 'beta'; five packets specs/alpha-track/00N-p each 'please run the quartz lantern calibration today' and five specs/beta/00N-q each 'please run the ember harbor sweep today' (N = 1..5); the two 100-docs spec.md files of smallCorpus; probes.json { paraphrase: { rows: [] } }; indexFor(root). runMain([], ...) gives code 0, a line 'no headroom: the baseline method is right on 10/10, above 0.90', no line starting 'planned calls:', and the last line 'paraphrase probes: total=0 gold-less=0 lookup=0/0 ripgrep=0/0'.
 3. 'returns 2 on an unknown flag and on an unreadable probe file': runMain(['--bogus'], deps of test 1) gives code 2; runMain([], same deps with probesPath path.join(root, 'missing.json')) gives code 2 and one err line.

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
