GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness

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

TASK: add the offline reduction upper bound and kept-token columns to S and pin them inside the existing fit case in T.
R = specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build/briefs/ref/design.md (read only).
S and T are named at the top of R. Read S, T and R sections 5 and 6 first. Never edit the fixtures.

In S:
1. Section 4: export offlineReductionUpperBound(messages, calls, headChars = TRUNCATE_HEAD_CHARS) exactly per R section 6
   bullet 5, using the ported estimateTokens and truncatedResultText. It calls no model and never changes a message's text.
2. parseTranscript: at each boundary, after the fit, compute it over the same segment Messages and calls (computed once for both)
   and add row fields untruncatedTokens, keptTokens, offlineReduction, keptTokensRatio per R section 6 bullet 6.
   It runs whether or not the fit threw.
3. Row line: append ` reduction=<offlineReduction.toFixed(4)> kept=<keptTokens> kept_ratio=<keptTokensRatio.toFixed(2) or n/a>`
   after fit_tokens.
4. stopLine: x is now the share of rows whose fitStage is 'fit_throw' (not the count), and y and z come from these fields
   exactly per R section 5 (median over the other rows; z ignores null ratios); keep the n/a handling for an empty set.
   totals.fit_throws stays a count.

In T, extend the case 'an oversized state records fit_throw and continues' (do not add a case) with:
rows[1].untruncatedTokens >= rows[1].keptTokens; rows[1].keptTokens > 0; rows[1].offlineReduction is >= 0 and < 1;
rows[1].keptTokensRatio toBeCloseTo(rows[1].keptTokens / 300, 6); rows[0].keptTokens > 0 (the reduction runs on a thrown fit too);
the last stdout line starts with 'stop: arm not built (fit_throws=0.50, offline_reduction_upper_bound='.

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs
Accept when: 2 files changed (S and T) and nothing else; node --check exits 0; T still holds exactly 6 `it(` cases.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness
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
- Read ~/.claude, ~/.pi or any transcript or session file. Build and test against the synthetic fixtures only.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
