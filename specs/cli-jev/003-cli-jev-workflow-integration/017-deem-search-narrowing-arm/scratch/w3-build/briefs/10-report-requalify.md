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

TASK: write report.json for a model run, print the requalify line when a stored Deem commit pair differs, and add a finished model column's hits to the probe line, with three vitest cases.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. Read both first (main, deemGate and runDeemArm in S; keepCorpus, stubDir, runMain and the DEEM stub body in T).

In S:
1. deemGate's failing result also carries `reason: <the skip line it printed>` (for example 'deem arm skipped: stub backend'). Nothing it prints changes.
2. Section 9 gains two exported functions with JSDoc:
 a. readStoredReport(outDir): the parsed <outDir>/report.json, or null when outDir is empty or the file is missing or does not parse.
 b. buildReport(parts) with parts = { manifestHash, testSet, summary, options, probes, probeHitCounts, deem, jev }, where deem and jev are each undefined or { skipped } or { stopped, partialRows } or { column, requalify }. Returns { manifestHash, testSet: { K: testSet.rows.length, counts: testSet.counts }, baselines: summary, instruction: CHOICE_INSTRUCTION, options: options.pairs.length, optionSetSha256: options.sha256, probes: { total, goldLess, hits: probeHitCounts }, columns: {}, stopped: {}, skipped: {}, requalify: {} }, filling for each backend present: columns[b] = { verdict: column.outcome, reason: column.reason, line: column.line, K, M, A, B, W, L, F, p, unmeasured, unstable, abstained, flipRate, latency, and modelId, modelCommit, sourceCommit for deem }, stopped[b] = { line, partialRows }, skipped[b] = the skip line, requalify[b] = the requalify line.
3. runDeemArm's ctx gains `stored` (a stored report or null). After out(columnLine(...)) and before out(column.line): when stored?.columns?.deem exists and its modelCommit or sourceCommit differs from gate's, out('requalify: model commit changed'). The returned column carries requalify: that line or null.
4. main: when values.out is a non-empty string and --deem or --jev is set, stored = readStoredReport(values.out) right after argument parsing, before anything is written; pass it to runDeemArm. Keep the Deem outcome (skipped reason, stop, or column). The probe line gets ['deem', probeHits(probes, deemResult.probePicks)] after the lookup and ripgrep pairs when the Deem arm finished with a column. After the probe line and before the wall time, when values.out is a non-empty string and --deem or --jev is set, write buildReport(...) as JSON.stringify(report, null, 2) plus '\n' to <out>/report.json (mkdir -p first). probeHitCounts is { lookup, ripgrep } plus deem when it ran.

In T, extend describe('score-track-narrowing deem arm') with:
 1. 'writes report.json whose deem column matches the stdout verdict': keepCorpus(root), then overwrite its probesPath with { paraphrase: { rows: [ {caseId:'c1',locale:'latin',variant:'exact',query:'unrelated phrase words'}, {caseId:'c1',locale:'latin',variant:'paraphrase',query:'ember words drifting away'} ] } }; run --deem --out <out> with the DEEM stub. The last stdout line is 'paraphrase probes: total=1 gold-less=0 lookup=0/1 ripgrep=1/1 deem=1/1'. report = JSON.parse of <out>/report.json: report.columns.deem.line equals the stdout line starting 'verdict deem:'; report.columns.deem includes { verdict: 'keep', reason: null, K: 6, M: 6, A: 6, B: 0, W: 6, L: 0, F: 0, p: 0.015625, modelId: 'deem-0.8-v1', modelCommit: 'm1', sourceCommit: 's1' }; report.options is 3; report.optionSetSha256 is the hex after 'sha256=' in the stdout line starting 'options: '; report.probes.hits equals { lookup: 0, ripgrep: 1, deem: 1 }.
 2. 'prints requalify before the verdict when the stored commit pair differs': keepCorpus(root); write <out>/report.json as { columns: { deem: { modelCommit: 'old', sourceCommit: 's1' } } } first; the run's line directly before the one starting 'verdict deem:' is 'requalify: model commit changed'. A second run into a new out dir whose stored report holds modelCommit 'm1' and sourceCommit 's1' prints no line starting 'requalify:'.
 3. 'records a skipped arm and writes no call log': smallCorpus with a stub backend health (as in the deem gate case 1): report.skipped.deem is 'deem arm skipped: stub backend', report.columns has no deem key, and <out>/calls.jsonl does not exist.

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
