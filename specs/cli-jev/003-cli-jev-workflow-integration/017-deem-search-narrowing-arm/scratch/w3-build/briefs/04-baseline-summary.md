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

TASK: add the option set and the zero-call baseline summary (accuracy, baseline method, the fixed rule lines, headroom) to the track-narrowing script, with two vitest cases.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. Read both first.

In S:
1. Append to section 1, each exported: CHOICE_INSTRUCTION = 'Which spec track is this text about?'; NONE_KEY = 'none'; NONE_DESCRIPTION = 'None of these tracks'; ORDERS = 3; MARGIN_LINE = 'margin: 0.10'; KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M'. A short comment says these fix the call shape and the keep rule before any model call, so a change is an amendment, not a tuning.
2. New section `4. OPTIONS AND SUMMARY` after section 3, exported functions with JSDoc:
 a. buildOptions(tracks) with tracks [{ track, description }]: pairs = each [track, description] in the given order, then [NONE_KEY, NONE_DESCRIPTION]; keys = pairs' first items; sha256 = createHash('sha256').update(JSON.stringify(pairs)).digest('hex'). Returns { pairs, keys, sha256 }.
 b. rotateOptions(pairs, order): [...pairs.slice(order), ...pairs.slice(0, order)].
 c. summarizeBaselines(rows, picks), picks[i] = { lookup, ripgrep } for rows[i], each a track or null: K = rows.length; lookupRight and ripgrepRight count picks equal to rows[i].track; method = ripgrepRight > lookupRight ? 'ripgrep' : 'lookup' (the lookup wins a tie); right = that method's count; headroom = !(10 * right > 9 * K). Returns { K, lookupRight, ripgrepRight, method, right, headroom }.
 d. baselineLines(summary): [`baseline lookup: ${lookupRight}/${K} right (${r})`, `baseline ripgrep: ${ripgrepRight}/${K} right (${r})`, `baseline method: ${method} ${right}/${K} right`], where r is count / K with toFixed(4), or '0.0000' when K is 0.
 e. ruleLines(options): [MARGIN_LINE, KEEP_RULE_LINE, `instruction: -q "${CHOICE_INSTRUCTION}"`, `options: ${options.pairs.length} sha256=${options.sha256} none="${NONE_DESCRIPTION}"`, `orders: ${ORDERS}, name order with none last, then rotated left by 1 and by 2`].
 f. headroomLines(summary, probeCount): without headroom [`no headroom: the baseline method is right on ${right}/${K}, above 0.90`]; with headroom [`headroom: a 10-point gain fits above ${right}/${K}`, `planned calls: ${ORDERS * (K + probeCount)} per arm, ${K} rows and ${probeCount} probes in ${ORDERS} orders each`].

In T, import the new names and add describe('score-track-narrowing options and summary'):
 a. 'builds the option set with none last and rotates it left': o = buildOptions([{ track: 'a', description: 'A' }, { track: 'b', description: 'B' }]); o.pairs equals [['a', 'A'], ['b', 'B'], ['none', 'None of these tracks']]; o.keys equals ['a', 'b', 'none']; o.sha256 equals the hex sha256 of JSON.stringify(o.pairs) and matches /^[0-9a-f]{64}$/; rotateOptions(o.pairs, 1) equals [['b', 'B'], ['none', 'None of these tracks'], ['a', 'A']] and rotateOptions(o.pairs, 2) equals [['none', 'None of these tracks'], ['a', 'A'], ['b', 'B']]; ruleLines(o)[0] is 'margin: 0.10', ruleLines(o)[1] equals KEEP_RULE_LINE and ruleLines(o)[2] is 'instruction: -q "Which spec track is this text about?"'.
 b. 'scores both baselines on the same rows, lets the lookup win a tie and flags no headroom above 0.90': rows with tracks ['a', 'a', 'b', 'b'] and picks [{ lookup: 'a', ripgrep: 'b' }, { lookup: null, ripgrep: 'a' }, { lookup: 'b', ripgrep: 'b' }, { lookup: 'a', ripgrep: null }]: s = summarizeBaselines(rows, picks) equals { K: 4, lookupRight: 2, ripgrepRight: 2, method: 'lookup', right: 2, headroom: true }; baselineLines(s) equals ['baseline lookup: 2/4 right (0.5000)', 'baseline ripgrep: 2/4 right (0.5000)', 'baseline method: lookup 2/4 right']; headroomLines(s, 1) equals ['headroom: a 10-point gain fits above 2/4', 'planned calls: 15 per arm, 4 rows and 1 probes in 3 orders each']. Ten rows of track 'a' with ripgrep 'a' and lookup null give method 'ripgrep', right 10, headroom false and headroomLines [ 'no headroom: the baseline method is right on 10/10, above 0.90' ]; with nine of those ripgrep picks right and one null, headroom is true.

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
