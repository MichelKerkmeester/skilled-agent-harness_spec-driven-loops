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

STEP 1: an unmatched iteration becomes a counted gap, and a short research registry is reconstructed
Scope: 2 files. S = .skilled/skills/system-deep-loop/runtime. Edit S/scripts/fanout-merge.cjs (M) and S/tests/unit/fanout-merge.vitest.ts (T) only.
a. M:1040 `researchCandidatesFromIteration(record, iterationFindingsByRun = new Map())` now returns `{ candidates, unmatched }`, never a bare array.
   Non-iteration record: `{ candidates: [], unmatched: 0 }`. The structured branch keeps its throw at M:1047-1049 unchanged and returns `{ candidates: structured, unmatched: 0 }`.
   In the `expectedCount > 0` branch a markdown or graph match returns `{ candidates: <that array>, unmatched: 0 }`.
   Replace both throws at M:1068-1073 with `return { candidates: [], unmatched: normalizedExpectedCount };`.
   The no-count tail at M:1076-1078 returns the same arrays as today, wrapped as `{ candidates: <array>, unmatched: 0 }`.
b. M:1092 `reconstructResearchRegistryFromState`: destructure `{ candidates, unmatched }` per record and add `unmatched` to a `let reconstructionGaps = 0`.
   Return null only when `keyFindings.length === 0 && reconstructionGaps === 0`. Add `sourceFindings: keyFindings.length` and `reconstructionGaps` to the returned `metrics`.
c. Replace `hasUsableResearchFindings` (M:1126-1129) with two helpers in the same place:
   `researchRegistryFindingCount(registry)`: length of the first non-empty array among `registry.keyFindings`, `registry.findings`; 0 for a null registry or none.
   `countOnlyResearchFindings(stateRecords)`: sum of `Math.floor(Number(record.findingsCount))` over `type: 'iteration'` records whose `keyFindings`, `findings` and
   `findingDetails` are each absent or empty, counting only finite values above 0 (the rule `countOnlyFindings` uses at S/scripts/synthesis-closeout.cjs:247-255).
d. In `main`, just before the gate at M:1210 add `const registryCount = researchRegistryFindingCount(registry);` and `const countOnlyTotal = countOnlyResearchFindings(stateRecords);`.
   The gate becomes `if (loopType === 'research' && (registryCount === 0 || registryCount < countOnlyTotal)) {`. Keep the try/catch at M:1215-1227 as is.
   Replace M:1228-1232 with: if `reconstructed` is non-null and (`registryCount === 0` or `reconstructed.keyFindings.length > registryCount`), set
   `registry = mergeReconstructedResearchRegistry(registry, reconstructed);`. Else if `reconstructed` is non-null, keep the registry and set
   `registry = { ...registry, metrics: { ...(registry.metrics && typeof registry.metrics === 'object' ? registry.metrics : {}), reconstructionGaps: Math.max(0, countOnlyTotal - registryCount) } };`.
   The two metric assignments at M:1229-1230 go away, because step b sets them. Extend the comment at M:1211-1214 with the durable reason: a lineage that
   wrote a few summary findings hides its count-only findings unless a short registry is rebuilt too.
e. Test in T: inside the describe block that opens at T:1067, directly after the test that ends at T:1329, add
   `it('keeps a short registry and counts the gap when no iteration matches', async () => { ... })`, modelled on the test at T:1293.
   Fixture in a `makeTempDir('fanout-merge-research-no-match-')` dir, under `lineages/grok/`. Copy from the committed folder
   specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/lineages/grok/ as literals (the test never reads that folder):
   - `findings-registry.json`: `{ keyFindings: [<the first 3 strings of that folder's findings-registry.json keyFindings>] }`.
   - `deep-research-state.jsonl`, three lines: `{ type: 'iteration', iteration: 1, findingsCount: 5, newInfoRatio: 0.9 }`,
     `{ type: 'iteration', iteration: 2, findingsCount: 6, newInfoRatio: 0.95 }`, `{ type: 'iteration', iteration: 3, findingsCount: 4, newInfoRatio: 0.85 }`.
   - `deltas/iter-001.jsonl`, `deltas/iter-002.jsonl`, `deltas/iter-003.jsonl`: the two `"type":"finding"` lines of the same-named source file, verbatim.
   Run `spawnCjs(fanoutMergeScript, ['--loop-type', 'research', '--artifact-dir', baseDir])`. Expect: exit code 0; the last stdout JSON line has no
   `reconstruction_warnings` key; `<baseDir>/findings-registry.json` has `metrics.sourceFindings` 3 and `metrics.reconstructionGaps` 12 (15 counted, 3 kept).
Accept when: 2 files changed; M no longer contains `hasUsableResearchFindings`; T holds exactly one new test; no code comment names a spec path, phase or task id.

VERIFY (run from the repo root; paste each command with its result line and exit code)
  node --check .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs          # no output, exit 0
  grep -c "hasUsableResearchFindings" .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs   # 0 (grep exits 1)
  grep -c "unmatched" .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs  # 4 or more
  grep -c "no iteration matches" .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts   # 1
  grep -c "specs/cli-jev" .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts          # 0 (grep exits 1)

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
