GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint

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

TASK: create the goal-lint scorer's pure core (labels joined to lint records, per-rule numbers, the rate with a Wilson interval, the stop line) and its node:test file.
G = .skilled/skills/sk-doc/sk-create-goal/scripts. Style models: G/lint-goal-criteria.cjs (header, sections, JSDoc) and G/tests/lint-goal-criteria.test.cjs.

FILE 1, create G/score-goal-lint.cjs, CommonJS, 'use strict', the lint's box header style with the title `score-goal-lint: scores the goal-criteria lint against labels`, sections 2 CONSTANTS, 3 HELPERS, 4 CORE LOGIC, 5 EXPORTS (no imports yet). No top-level side effect, no output, no process spawn.
- CONSTANTS: TAG = '[score-goal-lint]', STOP_RATE = 0.05, WILSON_Z = 1.96, STOP_LINE = 'r20 model arm not built: labeled_violation_rate<0.05'. Comment the why: under 5% labeled violations a model arm cannot earn its calls, on either backend.
- HELPERS: `isLabeled(row)`: typeof row.rule4_ok and typeof row.rule5_ok are both 'boolean'. `formatNumber(value)`: 'n/a' for null, else value.toFixed(4).
- CORE LOGIC, each with a JSDoc block:
  a. `wilsonInterval(k, n)`: null when n <= 0. Else p = k / n, z = WILSON_Z, d = 1 + z*z/n, c = (p + z*z/(2*n)) / d, h = z * Math.sqrt(p*(1-p)/n + z*z/(4*n*n)) / d; return [Math.max(0, c - h), Math.min(1, c + h)].
  b. `ruleMetrics(pairs)`: pairs are { predicted, actual } booleans. Count tp, fp, fn, tn. precision = tp/(tp+fp), recall = tp/(tp+fn), each null when its denominator is 0. f1 is null when either is null, 0 when both are 0, else 2PR/(P+R). Return { tp, fp, fn, tn, precision, recall, f1 }.
  c. `scoreLabels(rows, lintRecords)`: byHash maps text_sha12 to the first lint record with it. labeled = rows.filter(isLabeled); unlabeled = rows.length - labeled.length. rubrics = sorted distinct labeled rubric values, a null or missing rubric counted as 'null'. With more than one, return { rows: rows.length, unlabeled, mismatch: rubrics }. Otherwise walk labeled rows: no record for its hash adds 1 to stale; a record whose class is not 'scored' adds 1 to notScored; the rest are joined { row, record }. rule4 = ruleMetrics of { predicted: record.rule4.length > 0, actual: row.rule4_ok === false } per joined pair; rule5 the same with rule5 fields. violations = joined pairs with rule4_ok === false or rule5_ok === false; labeled count n = joined.length; rate = n > 0 ? violations / n : null. Return { rows: rows.length, mismatch: null, rubric: rubrics[0] ?? null, unlabeled, stale, notScored, labeled: n, rule4, rule5, violations, rate, interval: wilsonInterval(violations, n), stop: rate !== null && rate < STOP_RATE }. Comment the why: stale and unscored labels leave every rate, so an edited goal cannot skew the numbers.
  d. `formatScore(result)` returns lines: 'rows=<rows>'. On mismatch add 'rubric mismatch: ' + ids joined by ',' and stop. Else add 'rubric=<rubric or none>', 'unlabeled=<n>', 'stale=<n>', 'not_scored=<n>', 'labeled=<n>'. When labeled is 0 add 'no labeled rows' and stop. Else for rule4 then rule5 add '<rule> tp=<n> fp=<n> fn=<n> tn=<n> precision=<f> recall=<f> f1=<f>' (f = formatNumber), then 'labeled_violation_rate=<violations>/<labeled>=<f rate> wilson95=[<f low>,<f high>]', then STOP_LINE when result.stop.
- EXPORTS: STOP_LINE, wilsonInterval, ruleMetrics, scoreLabels, formatScore.

FILE 2, create G/tests/score-goal-lint.test.cjs (box title `score-goal-lint tests: synthetic fixture labels`). Fixtures, all synthetic: rec(hash, cls, rule4, rule5) builds { id: 'specs/a/goal.md:' + hash, text_sha12: hash, class: cls, rule4, rule5 }; lab(hash, r4, r5) builds { id: 'x', text_sha12: hash, rubric: 'mimo-02-strict-v1', rule4_ok: r4, rule5_ok: r5, labeler: 'fixture' }. RECORDS = [rec('a1','scored',['The report'],[]), rec('a2','scored',['the rows'],['as described in']), rec('a3','scored',[],[]), rec('a4','scored',[],[])]; LABELS = [lab('a1',false,true), lab('a2',true,false), lab('a3',false,false), lab('a4',true,true)]. Let L(rows, recs) = formatScore(scoreLabels(rows, recs)). Six tests:
  1. 'per-rule precision, recall and F1': L(LABELS, RECORDS) includes 'rule4 tp=1 fp=1 fn=1 tn=1 precision=0.5000 recall=0.5000 f1=0.5000' and 'rule5 tp=1 fp=0 fn=1 tn=2 precision=1.0000 recall=0.5000 f1=0.6667'.
  2. 'the labeled violation rate carries a Wilson 95% interval': L(LABELS, RECORDS) includes 'labeled_violation_rate=3/4=0.7500 wilson95=[0.3006,0.9544]' and not STOP_LINE; wilsonInterval(0, 0) is null; wilsonInterval(0, 20)[0] is 0.
  3. 'a rate under 0.05 prints the stop line': 25 hashes 'c' + String(i).padStart(11, '0') for i 0..24, each rec(h,'scored',[],[]); labels lab(h, i !== 0, true). The lines include 'labeled_violation_rate=1/25=0.0400 wilson95=[0.0071,0.1954]' and the last line equals STOP_LINE, which equals 'r20 model arm not built: labeled_violation_rate<0.05'.
  4. 'stale labels and unscored lines leave every rate': rows = [...LABELS, lab('ffffffffffff',false,false), lab('a5',false,false)], records = [...RECORDS, rec('a5','placeholder',[],[])]. Lines include 'stale=1', 'not_scored=1', 'labeled=4' and 'labeled_violation_rate=3/4=0.7500 wilson95=[0.3006,0.9544]'.
  5. 'unlabeled rows print no rate': three rows { id: 'x', text_sha12: 'a1'|'a2'|'a3', rubric: null, rule4_ok: null, rule5_ok: null, labeler: null }. L(rows, RECORDS) deepEquals ['rows=3', 'rubric=none', 'unlabeled=3', 'stale=0', 'not_scored=0', 'labeled=0', 'no labeled rows'].
  6. 'mixed rubrics print a mismatch and no rate': rows [lab('a1',true,true), { ...lab('a2',true,true), rubric: 'c' }]. L(rows, RECORDS) deepEquals ['rows=2', 'rubric mismatch: c,mimo-02-strict-v1'].

VERIFY (repo root):
  node --check .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs
  node -e "const m=require('./.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs');console.log(m.wilsonInterval(3,4).map((x)=>x.toFixed(4)).join(','))"
Accept when: 2 files created and nothing else changed; node --check exits 0; the node -e line prints 0.3006,0.9544.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint
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
