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

TASK: add the three zero-call comparators and print them in the census summary.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first.

In the script, add these exported pure functions directly above summarizeCensus, each with a JSDoc block:
a. confidenceOrder(row): newCluster = a copy of row.cluster stably sorted by row.confidence[skill] descending (ties keep cluster order); return reorderSlots(row.order, row.cluster, newCluster).
b. alwaysSecondOrder(row): movePickFirst(row.order, row.cluster, row.cluster[1]).
c. buildFold(rows, isMatch): a Map keyed by row.goldKey holding { success, failure } counts. A row adds a success when isMatch(row.order[0] ?? null, row.gold), otherwise a failure.
d. rerankOrder(row, fold): a copy of row.order sorted by shadow descending, ties by skill id with localeCompare, where shadow(s) = Math.round(row.score[s] * reliability(s) * 1e6) / 1e6 and reliability(s) = (1 + success) / (2 + success + failure) when fold holds s with success + failure > 0, else 0.5. Put this comment above it:
   // The scorer no longer ships the outcome-weighted rerank, so its blend lives
   // here: fused score times a Beta(1, 1) posterior over train-half outcomes.
In summarizeCensus, right after the `comparator: name=scorer` line, push three lines in the same format:
- `comparator: name=confidence rows=<eligible> mrr=... right1=... right3=...` from rankMetrics(eligibleRows, confidenceOrder, isMatch)
- `comparator: name=always_second rows=<eligible> ...` from rankMetrics(eligibleRows, alwaysSecondOrder, isMatch)
- `comparator: name=rerank rows=<k> ...` with fold = buildFold(census.rows filtered to split 'train', isMatch), scored by rankMetrics over the eligible rows with split 'test' and (row) => rerankOrder(row, fold); k is that row count.

In the vitest file add the four functions to the import. In case A of describe('score-jev-tiebreak census summary'), insert these three expected lines right after 'comparator: name=scorer rows=3 mrr=0.5000 right1=1 right3=2':
  'comparator: name=confidence rows=3 mrr=0.3333 right1=0 right3=2'
  'comparator: name=always_second rows=3 mrr=0.5000 right1=1 right3=2'
  'comparator: name=rerank rows=1 mrr=0.5000 right1=0 right3=1'
Add one it() to the same describe:
- buildFold over rows r1 and r3 of synthCensus() equals new Map([['a', { success: 1, failure: 0 }], ['z', { success: 0, failure: 1 }]])
- rerankOrder(row r2, that fold) equals ['a', 'b', 'c']
- rerankOrder({ order: ['a', 'b'], score: { a: 0.5, b: 0.49 } }, new Map([['b', { success: 5, failure: 0 }]])) equals ['b', 'a']
- confidenceOrder(row r1) equals ['b', 'a', 'c'] and alwaysSecondOrder(row r2) equals ['b', 'a', 'c']

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
