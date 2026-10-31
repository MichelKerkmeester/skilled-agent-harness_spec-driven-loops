GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order

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

TASK: create a new eval script with six pure helpers, and its vitest file with their tests.
R = .skilled/skills/system-skill-advisor/runtime. Create R/scripts/routing-accuracy/score-suggested-order.mjs and R/tests/parity/score-suggested-order.vitest.ts. Read R/scripts/routing-accuracy/score-jev-tiebreak.mjs lines 1-35 and 203-220 and R/tests/parity/score-jev-tiebreak.vitest.ts lines 1-12 first: copy their header style, JSDoc style and 2-space ESM style. Never edit score-jev-tiebreak.mjs.

Script, in this order:
1. Line 1 `#!/usr/bin/env node`, then the module banner with title `MODULE: Suggested Cluster Order Eval` and this comment: "Measures, offline, whether a Jev or local Deem answer that orders the advisor's whole near-tie cluster beats the best zero-call order, with each call timed inside a child spawned the way the prompt shim spawns the advisor. The default run makes no model call. The script holds no credential and reads none."
2. `import { reorderSlots } from './score-jev-tiebreak.mjs';`
3. Constants: `export const ALPHA = 0.05;` `export const MARGIN = 0.05;` `export const ADVISOR_BUDGET_MS = 2200;` `export const CHILD_TIMEOUT_MS = 2500;` `export const MIN_MOVABLE = 5;` and plain `const CHOICE_QUESTION = 'Which skill should handle this request?';` `const NONE_DESCRIPTION = 'None of these skills fits the request';` `const PASSES = 3;`
4. Exported functions, each with a JSDoc block:
 a. `nearestRank(values, q)`: null for an empty array; else sort a copy ascending (never mutate the input) and return sorted[Math.ceil(q * n) - 1].
 b. `rotations(keys)`: the three left rotations `[0, 1, 2].map((r) => [...keys.slice(r), ...keys.slice(0, r)])`.
 c. `optionArgs(keys, describe, cluster)`: a flat array with `'-o', '<key>=<text>'` per key in `keys` order. Text for 'none' is NONE_DESCRIPTION. For any other key it is describe(key), plus ` [<key>]` when another key of `cluster` has the same describe() text (a client that maps answers back by description refuses two equal descriptions).
 d. `readProbabilities(stdout, keys)`: returns { raw, full }. raw = JSON.parse(stdout).answers.answer.probabilities when that is a plain object (not null, not an array), else null; unparseable stdout gives { raw: null, full: null }. full = a new object holding exactly `keys` in order when every key maps to a finite number (typeof 'number' and Number.isFinite), else null.
 e. `topKey(map, keys)`: the first key in `keys` order with the highest value (strict greater replaces).
 f. `orderFromMaps(row, maps)`: mean[k] = sum of maps[i][k] / maps.length for each key of row.cluster and for 'none'. When mean.none is strictly greater than every cluster key's mean return { order: row.order.slice(), abstained: true }. Else sort a copy of row.cluster by mean descending with a stable sort, so equal means keep the scorer's cluster order, and return { order: reorderSlots(row.order, row.cluster, sorted), abstained: false }.

Test file: banner `MODULE: Suggested Cluster Order Eval Tests` with the comment "Offline checks with synthetic rows, stub binaries and stub children. No model call."; `import { describe, expect, it } from 'vitest';` and the six functions from '../../scripts/routing-accuracy/score-suggested-order.mjs'. One describe('score-suggested-order pure helpers') with these its:
 1. nearestRank([5, 1, 3], 0.5) is 3 and the input still equals [5, 1, 3]; nearestRank([], 0.95) is null; nearestRank of 1..20 at 0.95 is 19.
 2. rotations(['a', 'b', 'none']) equals [['a','b','none'], ['b','none','a'], ['none','a','b']].
 3. With describe a->'same', b->'same', c->'other', optionArgs(['a','b','c','none'], describe, ['a','b','c']) equals ['-o','a=same [a]','-o','b=same [b]','-o','c=other','-o','none=None of these skills fits the request'].
 4. readProbabilities of JSON {answers:{answer:{choice:'a',probabilities:{a:0.6,b:0.3,none:0.1}}}} with keys ['a','b','none'] gives full {a:0.6,b:0.3,none:0.1} and the same raw.
 5. A map without none gives full null and raw {a:0.6,b:0.4}; stdout 'oops' gives {raw:null, full:null}; a string value '0.6' for a gives full null.
 6. topKey({a:0.2,b:0.5,none:0.3}, ['a','b','none']) is 'b'; topKey({a:0.4,b:0.4,none:0.2}, same keys) is 'a'.
 7. orderFromMaps({order:['a','x','b','c'], cluster:['a','b','c']}, [{a:0.1,b:0.6,c:0.2,none:0.1},{a:0.1,b:0.5,c:0.3,none:0.1},{a:0.2,b:0.4,c:0.3,none:0.1}]) gives order ['b','x','c','a'], abstained false.
 8. Tie: row {order:['a','b'], cluster:['a','b']} with three maps {a:0.4,b:0.4,none:0.2} gives order ['a','b'], abstained false.
 9. None first: the same row with three maps {a:0.2,b:0.3,none:0.5} gives order ['a','b'], abstained true.

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
  node -e "import('./.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs').then((m) => console.log(m.nearestRank([5,1,3],0.5), m.topKey({a:0.4,b:0.4,none:0.2},['a','b','none']), m.CHILD_TIMEOUT_MS))"
Accept when: 2 files created and nothing else changed; node --check exits 0; the node -e line prints `3 a 2500`.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order
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
