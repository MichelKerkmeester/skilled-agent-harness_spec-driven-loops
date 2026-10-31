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

TASK: add one exported pure function, summarizeColumn(backend, rows, recordsByRow, census), that scores one backend column and applies the keep rule, with its tests.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first.

In the script add, after summarizeCensus, `export function summarizeColumn(backend, rows, recordsByRow, census)` with JSDoc. rows are the eligible rows; recordsByRow maps row.id to up to 3 call records { answer: string | null, wallMs: number }. isMatch = census.isMatch. Per row, answers = the records' answers:
- measured when there are exactly 3 answers and all are strings; otherwise count it unmeasured and skip it.
- maxFreq = the highest count of one answer; flips += 3 - maxFreq. pick = the answer named at least twice, else null.
- pick null: unstable += 1, colOrder = row.order. pick 'none': abstentions += 1, colOrder = row.order, and noneOnGoldInCluster += 1 when classifyRow(row, isMatch) is 'movable' or 'gold_first'. Otherwise colOrder = movePickFirst(row.order, row.cluster, pick).
- rc = reciprocalRank(colOrder, row.gold, isMatch), rs = the same for row.order. rc > rs is a win (movableWins += 1 when the row is 'movable'); rc < rs is a loss (goldDemotions += 1 when 'gold_first'); each also adds to tau03 insideWins/insideLosses when row.tau03, else outsideWins/outsideLosses. Equal ranks with a pick that is neither null nor 'none' is a tie.
Keep each measured row with its colOrder as a comparison row. Then:
- metrics: column, scorer, confidence and alwaysSecond = rankMetrics over the comparison rows with colOrder, row.order, confidenceOrder and alwaysSecondOrder. fold = buildFold(census.rows with split 'train', isMatch). held = comparison rows with split 'test'; heldColumn and heldRerank = rankMetrics over held with colOrder and (r) => rerankOrder(r, fold).
- flip = flips / (3 * measured), 0 when measured is 0. decided = wins + losses. pWin = binomTail(decided, wins). pLoss = binomTail(decided, losses).
- latency: over every record's wallMs sorted ascending, p50 and p95 by nearest rank (index Math.ceil(q * n) - 1), null when there is no record.
- conditions = { sign: { value: pWin, held: pWin <= ALPHA }, mrr: { value: column.mrr, held: column.mrr > confidence.mrr && column.mrr > alwaysSecond.mrr && held.length > 0 && heldColumn.mrr > heldRerank.mrr }, right3: { value: column.right3, held: column.right3 >= scorer.right3 }, flip: { value: flip, held: flip <= 0.1 } }.
- verdict, first rule that applies: 'underpowered' when decided < 5; 'kill' when pLoss <= ALPHA; 'keep' when all four conditions hold; else 'inconclusive'.
Return { backend, rows: rows.length, measured, unmeasured, wins, losses, ties, abstentions, unstable, decided, movableWins, goldDemotions, noneOnGoldInCluster, tau03: { insideWins, insideLosses, outsideWins, outsideLosses }, flip, pWin, pLoss, latency: { p50, p95 }, metrics: { column, scorer, confidence, alwaysSecond, heldColumn, heldRerank }, conditions, verdict }.

In the vitest file add summarizeColumn to the import and describe('score-jev-tiebreak column and keep rule'). Helpers: mk(id, gold, order, cluster, split = 'test') returns a row with file 'labeled', prompt id, goldKey gold, tau03 false and confidence = score = Object.fromEntries(order.map((s, i) => [s, 1 - i / 10])); recs(map of id to answers) builds recordsByRow with wallMs 10 each. Cases:
1. Rows m1 mk('m1','b',['a','b','c'],['a','b']) answers [b,b,b]; d1 mk('d1','a',['a','b'],['a','b']) [b,b,a]; o1 mk('o1','z',['a','b'],['a','b']) [b,b,b]; n1 mk('n1','b',['a','b'],['a','b']) ['none','none','a']; x1 mk('x1','b',['a','b'],['a','b']) [b,null,b]. census = { ...synthCensus(), rows }. Expect measured 4, unmeasured 1, wins 1, losses 1, ties 1, abstentions 1, unstable 0, decided 2, movableWins 1, goldDemotions 1, noneOnGoldInCluster 1, flip close to 0.1667 (4 digits), pWin 0.75, latency.p50 10, verdict 'underpowered'.
2. Six rows k1..k6 = mk(id,'b',['a','c','b'],['a','c','b'], odd index 'train' else 'test') with confidence { a: 0.9, c: 0.85, b: 0.8 } and score { a: 0.5, c: 0.45, b: 0.4 }, answers [b,b,b] each, census rows = those six. Expect wins 6, decided 6, pWin 0.015625, every condition held, verdict 'keep'.
3. Same as 2 but confidence { b: 0.95, a: 0.9, c: 0.85 }: conditions.mrr.held false, conditions.sign.held true, verdict 'inconclusive'.
4. Six rows mk(id,'a',['a','b'],['a','b']) answers [b,b,b]: losses 6, goldDemotions 6, verdict 'kill'.

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
