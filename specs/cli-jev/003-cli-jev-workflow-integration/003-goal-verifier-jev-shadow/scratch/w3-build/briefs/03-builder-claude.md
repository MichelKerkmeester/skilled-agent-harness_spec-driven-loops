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

TASK: add Claude transcript rows to the verifier row builder, plus tests. Two existing files. No em dash anywhere. Keep every existing line unless named below.

FILE 1 .skilled/hooks/goal/lib/build-verifier-fixture.cjs
- Lines 4-8 (the PURPOSE box lines) become exactly:
// ║ PURPOSE: Builds the verifier fixture from Pi session logs and from       ║
// ║          Claude transcripts the operator names: one JSONL row per nudge  ║
// ║          or native goal_status record, with the turn text behind it.     ║
// ║          Pi rows are sampled round-robin across reason categories. Every ║
// ║          label stays empty, and the builder never overwrites its output. ║
- New section "CLAUDE TRANSCRIPT COLLECTION" after section 4 (renumber later dividers). collectClaudeCandidates(dir) with JSDoc: walk with collectJsonlPaths(dir); per file turnText = null; per non-empty line (skip lines JSON.parse rejects):
  record.type "assistant": text = textOf(record.message?.content); if text !== '' then turnText = text.
  record.type "attachment" and record.attachment?.type "goal_status": condition = String(record.attachment.condition ?? ''). If turnText is null or condition.trim() is '', skipped += 1; else push { source: 'claude', key: `${relativePath}:${index + 1}`, objective: condition, rawText: turnText, prelabel: record.attachment.met === true ? 'met' : 'not_met' }. Then turnText = null.
  Returns { candidates, skipped }. The native judge is a model, so its verdict is kept as prelabel and never written to label.
- buildRows({ piDir, claudeDir, limit }): collect Pi only when piDir is given and Claude only when claudeDir is given (else empty lists, counters 0). Quotas: claudeQuota = piCount > 0 ? Math.min(claudeCount, Math.floor(limit / 2)) : Math.min(claudeCount, limit); piQuota = Math.min(piCount, limit - claudeQuota); then claudeQuota = Math.min(claudeCount, limit - piQuota). Pi picks = selectRows(pi candidates, piQuota). Claude picks = candidates at Math.floor(i * claudeCount / claudeQuota) for i = 0..claudeQuota-1. rows = Claude rows then Pi rows.
  Row id prefix is the source ("claude-" or "pi-"). A Claude row has heuristic_recorded "", recorded_reason "", prelabel from the candidate, label "". Pi rows are unchanged, and reproducedPi counts Pi rows only. stats gains candidatesClaude and skippedClaude.
- main: add flag --claude <dir>. Replace the "--pi <dir> is required" check with: neither --pi nor --claude given returns 2 with "error: give --pi <dir>, --claude <dir> or both". The stdout line becomes:
  built: rows=<n> pi=<n> claude=<n> candidates_pi=<n> candidates_claude=<n> skipped_pi_no_turn=<n> skipped_pi_no_objective=<n> skipped_claude=<n> pi_recorded_reproduced=<n> out=<file>
- Add collectClaudeCandidates to module.exports.

FILE 2 .skilled/hooks/goal/lib/build-verifier-fixture.test.cjs. Append two tests, keep the existing ones.
Claude fixture <cdir>/p/t1.jsonl, records in order: {"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"All done: the importer shipped and tests passed."}]}}, {"type":"attachment","attachment":{"type":"goal_status","condition":"Ship the importer","met":true}}, {"type":"attachment","attachment":{"type":"goal_status","condition":"Ship the importer","met":false}}.
Test 4: buildRows({ claudeDir: cdir, limit: 50 }) gives 1 row: id matches /^claude-[0-9a-f]{12}$/, source "claude", objective "Ship the importer", raw_text "All done: the importer shipped and tests passed.", prelabel "met", label "", heuristic_recorded ""; stats.skippedClaude 1.
Test 5: a Claude dir with three files, each one assistant record then one goal_status record, plus the existing Pi fixture (1 candidate). buildRows({ piDir, claudeDir, limit: 2 }) gives sources ["claude", "pi"]; with limit 4 it gives 3 "claude" rows then 1 "pi" row.

Accept when: 2 files changed (both existing) and the checks below pass.
CHECKS (run exactly these; do not run node --test):
  node --check .skilled/hooks/goal/lib/build-verifier-fixture.cjs
  node --check .skilled/hooks/goal/lib/build-verifier-fixture.test.cjs
  grep -c "goal_status" .skilled/hooks/goal/lib/build-verifier-fixture.cjs     (expect 2 or more)

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
