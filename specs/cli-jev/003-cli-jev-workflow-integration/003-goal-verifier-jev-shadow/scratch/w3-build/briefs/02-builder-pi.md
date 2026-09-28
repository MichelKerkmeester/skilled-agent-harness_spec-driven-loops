GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow

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

TASK: create the verifier row builder (Pi sessions only) and its test. Two new files. CommonJS, 'use strict', Node builtins plus require('./goal-core.cjs'). No em dash anywhere. Layout: box header with COMPONENT and PURPOSE lines as in .skilled/hooks/goal/lib/goal-core.test.cjs:1-9, numbered section dividers as in .skilled/hooks/goal/lib/goal-core.cjs:9-37, JSDoc on exports.

FILE 1 .skilled/hooks/goal/lib/build-verifier-fixture.cjs. Exports collectPiCandidates, selectRows, buildRows, main. Run process.exitCode = main(process.argv.slice(2)) only when require.main === module.
- textOf(content): a string as is; an array joins String(item.text) of items with type "text" by "\n"; else "".
- objectiveFrom(text): null unless text includes "[active_goal:"; else match /\nobjective: ([^\n]*)/ on text.slice(text.lastIndexOf("[active_goal:")) and return group 1, or null.
- collectPiCandidates(dir): walk dir recursively for .jsonl files, sorted by posix path relative to dir. Per file start objective=null, turnText=null, toolTexts=[]. Per non-empty line (skip a line JSON.parse rejects), line numbers from 1:
  type "message": t = textOf(record.message?.content); objectiveFrom(t) replaces objective when not null; role "assistant" sets turnText=t and toolTexts=[]; role "toolResult" pushes t.
  type "custom_message": t = textOf(record.content); objectiveFrom(t) replaces objective when not null. If customType is "goal-verify-nudge": m = t.match(/^\[goal_verify\] verdict=([^;]*); reason=([\s\S]*)$/); raw = [turnText, toolTexts.filter(Boolean).join("\n")].filter(Boolean).join("\n"). turnText null or raw "" counts skippedNoTurn; else objective null counts skippedNoObjective; else push { source: "pi", key: rel + ":" + line, objective, rawText: raw, recordedVerdict: m ? m[1] : "", recordedReason: m ? m[2] : "" }. Then turnText=null, toolTexts=[].
  Returns { candidates, skippedNoTurn, skippedNoObjective }.
- category(reason): "Evidence is too short to prove completion" too_short, "Evidence includes blocking or incomplete-work language" blocking, "Evidence appears truncated before it proves completion" truncated, "Evidence lacks an explicit completion signal" no_completion, "Evidence does not reference the goal objective specifically enough" weak_link, else other. ORDER = [too_short, blocking, truncated, no_completion, weak_link, other].
- selectRows(candidates, limit): quota = min(candidates.length, limit). Group by category(recordedReason), walk order kept. Deal quota slots one at a time round-robin over ORDER, skipping a group whose slots already equal its size. In each group take indices Math.floor(i * size / slots) for i = 0..slots-1. Return the picks, groups in ORDER.
- buildRows({ piDir, limit }): rows from selectRows(collectPiCandidates(piDir).candidates, limit). Row keys in this order: id "pi-" + first 12 hex of sha256(key), source, objective, raw_text, ingested_text = core.redactEvidence(raw_text), raw_length = raw_text.length, heuristic_recorded = recordedVerdict, recorded_reason = recordedReason, prelabel "", label "". Returns { rows, stats: { candidatesPi, skippedPiNoTurn, skippedPiNoObjective, reproducedPi } }, reproducedPi = rows where core.verifyGoalHeuristic({ goal: { objective }, transcriptText: raw_text }) returns verdict === heuristic_recorded and reason === recorded_reason.
- main(argv): flags --pi <dir>, --out <file>, --limit <n> (default 50). Return 2 with one stderr line for: an unknown flag "error: unknown flag <flag>"; no --pi "error: --pi <dir> is required"; no --out "error: --out <file> is required"; --limit not a positive integer "error: --limit must be a positive integer"; out exists "error: OUT_EXISTS <file>". Write every row as JSON.stringify(row) + "\n" with fs.writeFileSync(out, text, { mode: 0o600, flag: "wx" }). Print one stdout line and return 0, never row text:
  built: rows=<n> pi=<n> candidates_pi=<n> skipped_pi_no_turn=<n> skipped_pi_no_objective=<n> pi_recorded_reproduced=<n> out=<file>

FILE 2 .skilled/hooks/goal/lib/build-verifier-fixture.test.cjs (node:test, node:assert/strict, fixtures written into mkdtempSync(join(tmpdir(), 'verifier-fixture-')) dirs, removed in finally).
Fixture: <dir>/proj/s1.jsonl, records in order: a session header; a user message with text "Please continue.\n\n[active_goal:g1]\nstatus: active\nobjective: Ship the widget exporter\ngoal_prompt:\nx\n[/active_goal]"; an assistant message "The widget exporter work is still pending review."; a toolResult message "ok"; a nudge with content "[goal_verify] verdict=not-met; reason=Evidence includes blocking or incomplete-work language"; a second nudge "[goal_verify] verdict=unclear; reason=Evidence is too short to prove completion". Messages look like {"type":"message","id":"m2","parentId":null,"timestamp":"2026-08-01T10:00:00.000Z","message":{"role":"assistant","content":[{"type":"text","text":"..."}]}}. Nudges look like {"type":"custom_message","customType":"goal-verify-nudge","content":"...","display":false,"id":"n1","parentId":null,"timestamp":"2026-08-01T10:01:00.000Z"}.
Test 1: buildRows({ piDir: dir, limit: 50 }) gives 1 row with id matching /^pi-[0-9a-f]{12}$/, objective "Ship the widget exporter", raw_text "The widget exporter work is still pending review.\nok", ingested_text equal to core.redactEvidence(raw_text), raw_length equal to raw_text.length, heuristic_recorded "not-met", prelabel "", label ""; stats.skippedPiNoTurn 1, stats.reproducedPi 1.
Test 2: selectRows over 6 plain candidates (3 with the blocking reason, 3 with the truncated reason) and limit 4 returns 4 picks, 2 of each reason.
Test 3: main(['--pi', dir, '--out', existing]) returns 2 and leaves existing unchanged; main(['--pi', dir, '--out', fresh]) returns 0, fresh has mode 0o600 and one JSONL line whose label is ""; main(['--jev']) returns 2.

Accept when: 2 files changed, both new, and the checks below pass.
CHECKS (run exactly these; do not run node --test):
  node --check .skilled/hooks/goal/lib/build-verifier-fixture.cjs
  node --check .skilled/hooks/goal/lib/build-verifier-fixture.test.cjs
  grep -c "OUT_EXISTS" .skilled/hooks/goal/lib/build-verifier-fixture.cjs     (expect 1 or more)

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow
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
- Read ~/.pi, ~/.claude or any session or transcript file. The tests build their own fixtures.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
