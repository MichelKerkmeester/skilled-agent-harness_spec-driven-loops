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

STEP 1: read delta `finding` records as the third reconstruction source, after markdown and graph
Scope: 2 files. S = .skilled/skills/system-deep-loop/runtime. Edit S/scripts/fanout-merge.cjs (M) and S/tests/unit/fanout-merge.vitest.ts (T) only.
Precondition: `researchCandidatesFromIteration` in M already returns `{ candidates, unmatched }` and T already has a test titled with "no iteration matches".
If either is missing, stop and report BLOCKED. Line numbers below are from before that change; find each anchor by its name.
a. Add `function loadDeltaFindings(root, lineageDir, label)` directly after `loadIterationFindings` (M:216-236), shaped like it:
   - `const deltasDir = path.join(lineageDir, 'deltas')`; return `new Map()` when it does not exist, else `requireRealDirectory(root, deltasDir, \`lineage ${label} deltas directory\`)`.
   - Only entries named `/^iter-(\d+)\.jsonl$/` count. A symlink or non-file entry throws `inputError(\`lineage ${label} delta source must be a real file: ${sourcePath}\`)`.
     Resolve the file with `resolveOptionalRealFile(root, sourcePath, \`lineage ${label} delta source\`)`. `fileRun` is the number in the name.
   - Per non-blank line: a line `JSON.parse` rejects pushes `null` into `fileRun`'s array. A record whose `type !== 'finding'` is skipped.
     `run` is `Math.floor(Number(record.iteration))` when that is finite, else `fileRun`. `text = firstNonEmptyString([record.title, record.label, record.finding, record.text])`.
     Empty `text` pushes `null` into `run`'s array. Otherwise push `{ id: record.id || \`delta-finding-${run}-${position}\`, title: text, text, addedAtIteration: run,
     _iteration_source: <path.relative(root, realFile) with backslashes turned to "/"> }`, where `position` is the 1-based index in that run's array.
   - Return the `Map<number, Array<object|null>>`. A `null` entry exists so one bad line leaves only its iteration unmatched and never throws.
b. `researchCandidatesFromIteration` gains a third parameter `deltaFindingsByRun = new Map()`. In the `expectedCount > 0` branch, after the graph check and
   before the unmatched return, add `const deltaFindings = deltaFindingsByRun.get(run) ?? [];` and, when
   `deltaFindings.length === normalizedExpectedCount && deltaFindings.every(Boolean)`, `return { candidates: deltaFindings, unmatched: 0 };`.
   The no-count tail does not read deltas.
c. `reconstructResearchRegistryFromState` gains a fourth parameter `deltaFindingsByRun = new Map()` and passes it to `researchCandidatesFromIteration`.
d. In `main`, inside the research reconstruction `if` and before `let reconstructed = null;`, add
   `const deltaFindingsByRun = loadDeltaFindings(artifactRoot, lineageDir, label);` outside the try, so a symlinked delta fails the merge closed as an
   iteration file does. Pass it as the fourth argument of `reconstructResearchRegistryFromState`. A lineage that skips reconstruction reads no delta file.
e. Test in T: inside the describe block that opens at T:1067, directly after the "no iteration matches" test, add
   `it('rebuilds a short registry from delta finding records', async () => { ... })`. Fixture in a `makeTempDir('fanout-merge-research-short-registry-')`
   dir, under `lineages/deepseek/`. Copy from specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/lineages/deepseek/ as literals:
   - `findings-registry.json`: `{ keyFindings: [...] }` holding the 8 `{ id, title }` objects of that folder's `findings-registry.json`.
   - `deep-research-state.jsonl`, two lines: `{ type: 'iteration', run: 1, iteration: 1, findingsCount: 6, newInfoRatio: 0.85 }` and
     `{ type: 'iteration', run: 6, iteration: 6, findingsCount: 5, newInfoRatio: 0.68 }`.
   - `deltas/iter-001.jsonl` and `deltas/iter-006.jsonl`: every `"type":"finding"` line of the same-named source file (6 and 5 lines), verbatim. No `iterations/` folder.
   Run the CLI as the neighbouring tests do. Expect: exit code 0; the last stdout JSON line has no `reconstruction_warnings` key;
   `<baseDir>/findings-registry.json` `keyFindings.map((f) => f.title).sort()` equals the 11 copied `label` values sorted;
   `metrics.sourceFindings` 11 and `metrics.reconstructionGaps` 0.
Accept when: 2 files changed; M has one `loadDeltaFindings` definition and one call; T holds exactly one new test; no code comment names a spec path or id.

VERIFY (run from the repo root; paste each command with its result line and exit code)
  node --check .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs          # no output, exit 0
  grep -c "loadDeltaFindings" .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs          # 2
  grep -c "deltaFindingsByRun" .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs         # 5 or more
  grep -c "short registry" .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts    # 1
  grep -c "specs/cli-jev" .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts     # 0 (grep exits 1)

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
