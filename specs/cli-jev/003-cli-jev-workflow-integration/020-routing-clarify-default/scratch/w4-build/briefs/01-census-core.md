GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default

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

TASK: create a new CommonJS script with one pure function, `runCensus`, and a new node:test file that pins it.
Style: follow .skilled/skills/sk-code/sk-code-opencode/references/javascript/quick-reference.md section 2 (box banner, 'use strict', numbered section dividers, JSDoc on each exported function, camelCase, module.exports). Copy the banner shape from .skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs lines 1-6.

FILE 1 (create): .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
Banner title: `score-clarify-default — clarify census and default-pick scorer`. Then a short doc comment: the script replays committed prompts through each compiled hub engine, read only, and counts clarify outcomes; it never calls a model unless a later switch asks.
Sections: 1. IMPORTS (no require yet; later changes add them here), 2. CONSTANTS, 3. CENSUS, 4. EXPORTS.
Constants: `NONE_KEY = 'none_of_these'`, `SOURCES = Object.freeze(['canary', 'playbook', 'corpus'])`, `ACTIONS = Object.freeze(['route', 'clarify', 'defer', 'reject'])`.
Functions (exact signatures and behavior):
- `emptyCell()` returns `{ prompts: 0, unparsed: 0, route: 0, clarify: 0, defer: 0, reject: 0, clarifyMode: 0, clarifyChecklist: 0, goldInAlternatives: 0 }`.
- `modeAlternatives(alternatives, modes)`: `alternatives` is the engine's clarify list, `modes` a Set of the hub's workflow modes. Drop every `NONE_KEY` entry. Return that array when it is non-empty and every entry is in `modes`, otherwise `null`. A non-array input returns `null`.
- `runCensus(prompts, engineFor, modesFor)`: `prompts` is an array of `{ id, hub, source, prompt, gold }` (`prompt` and `gold` are string or null). `engineFor(hub)` returns `{ snapshot, evaluate }` and may throw. `modesFor(hub)` returns a Set. Returns `{ cells, rows }` where `cells[hub][source]` is an `emptyCell()` created on first use. For each record, in order: `prompts += 1`. If `prompt` is not a non-empty string, `unparsed += 1` and continue. Otherwise call `const { snapshot, evaluate } = engineFor(hub)` and `evaluate(snapshot, { prompt })` inside one try; a throw means `unparsed += 1` and continue. Read `action = result.decision.action`; an action not in ACTIONS means `unparsed += 1`. Otherwise increment that action's counter. For `clarify` only: `alts = modeAlternatives(result.decision.clarify && result.decision.clarify.alternatives, modesFor(hub))`. `alts === null` means `clarifyChecklist += 1` and no row. Otherwise `clarifyMode += 1`; `gold` is the record's gold when `alts` includes it, else null; when gold is kept `goldInAlternatives += 1`; push row `{ id, hub, source, prompt, alternatives: alts, gold }` (keys in that order).
Exports: `NONE_KEY, SOURCES, ACTIONS, emptyCell, modeAlternatives, runCensus`. No `main` yet and no `require.main` block.

FILE 2 (create): .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs
Banner like the script (`score-clarify-default.test — census, gate and verdict coverage`), 'use strict', `const test = require('node:test'); const assert = require('node:assert/strict'); const S = require('../score-clarify-default.cjs');`
Helper: `engineFrom(map)` returns `() => ({ snapshot: {}, evaluate: (snap, input) => { if (input.prompt === 'boom') throw new Error('engine failed'); return map[input.prompt]; } })`. A clarify decision is `{ decision: { action: 'clarify', clarify: { alternatives: [...] } } }`, a route decision `{ decision: { action: 'route' } }`. `modes = () => new Set(['mode-a', 'mode-b'])`.
Three test cases, each `test('<name>', () => {...})`:
1. `census counts a mode clarify and keeps only gold among its alternatives`: prompts c1 (prompt 'tie', gold 'mode-b'), c2 (prompt 'tie2', gold 'mode-z'), r1 (prompt 'go', gold null), all hub 'hub-x' source 'playbook'; map tie and tie2 → clarify ['mode-a','mode-b','none_of_these'], go → route. Expect `cells['hub-x'].playbook` deepEqual `{ prompts: 3, unparsed: 0, route: 1, clarify: 2, defer: 0, reject: 0, clarifyMode: 2, clarifyChecklist: 0, goldInAlternatives: 1 }`; `rows` deepEqual `[{ id: 'c1', hub: 'hub-x', source: 'playbook', prompt: 'tie', alternatives: ['mode-a','mode-b'], gold: 'mode-b' }, { id: 'c2', hub: 'hub-x', source: 'playbook', prompt: 'tie2', alternatives: ['mode-a','mode-b'], gold: null }]`.
2. `census counts a missing prompt, an engine throw and an unknown hub as unparsed`: records u1 (hub-x, canary, prompt null), u2 (hub-x, canary, prompt 'boom'), u3 (hub 'hub-gone', canary, prompt 'go'); engineFor throws `new Error('unknown hub')` for 'hub-gone' and otherwise uses engineFrom. Expect hub-x canary `prompts 2, unparsed 2`, hub-gone canary `prompts 1, unparsed 1`, `rows.length === 0`.
3. `census keeps checklist alternatives apart and writes no row for them`: one record (hub-x, canary, prompt 'ask', gold null) → clarify ['Name the matching command.','Confirm the target.','none_of_these']. Expect `clarify 1, clarifyChecklist 1, clarifyMode 0`, `rows` empty.

Accept when: 2 files changed (both new), `node --check` passes on both, and `grep -c "^test(" <test file>` prints 3.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default
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

Checks to run: `node --check .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`, `node --check .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`, `grep -c "^test(" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
