GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/006-runtime-libraries-and-tests
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You update the remaining tests for a retired lane family that is already gone from the runtime code. Nothing else.

Removed lanes: `agent-improvement`, `model-benchmark`, `skill-benchmark` and their shared base `deep-improvement-common` (also spelled `deep-improvement` or `improvement` as a mode alias), plus the packet `.skilled/skills/system-deep-loop/deep-improvement/` and its loop host. They are the "improvement family". Remaining deep-loop modes: research, review and ai-council (decision kinds `deep-review`, `deep-ai-council`, research where present).
Their libraries, lane tests and `lib/legacy-projections/deep-improvement-ledgers-contract.ts` are already deleted in this tree.

RULE: delete test cases, fixture rows, imports and expected-list entries that exist only for the improvement family. Where a test checks a general behaviour and merely USES an improvement name as its example, keep the test and switch the example to a remaining mode (research, review or ai-council; agent `deep-research`, `deep-review` or `ai-council`). Never weaken an assertion to make it pass.

FILES (the lines are where the mentions are today)
  .skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts: 497,510
  .skilled/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts: 802
  .skilled/skills/system-deep-loop/runtime/tests/unit/blinded-adjudication.vitest.ts: 32,39,40,44,1119,1120,1124,1125,1126,1136,1140,1141,1142
  .skilled/skills/system-deep-loop/runtime/tests/unit/check-projection-coverage.vitest.ts: 25
  .skilled/skills/system-deep-loop/runtime/tests/unit/lifecycle-taxonomy.vitest.ts: 12
  .skilled/skills/system-deep-loop/runtime/tests/unit/verify-authority-cli.vitest.ts: 35,36,37,169,173
  .skilled/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts: 724,727,728,729,733,734,737
  .opencode/plugins/tests/system-deep-loop-guard.test.cjs: 35,36,37,111,115,117,123,125,344
  .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs: 47,48,49,168,172,175,182,185,378

SPECIAL CASES
- Both plugin guard tests: delete the three fixture registry rows with `agent: 'deep-improvement'` (they include the long-retired `skill-benchmark`). The loop over those three modes is deleted. The "mode=nonsense" mismatch test stays: point it at `target_agent=@deep-research` and expect the `registry modes="..."` string the fixture registry gives that agent (read the fixture to get it). The fail-open test near the end that uses `@deep-improvement` switches to `@deep-research` with `mode=research`; keep what it asserts.
- lifecycle-taxonomy.vitest.ts line ~12 imports a journal script from the deleted packet: delete the cases that depend on it, keep the rest of the file.
- fanout-merge.vitest.ts lines ~1477-1479 hold fixture strings that merely mention benchmark words: leave that file alone.
- tests/unit/README.md: drop the rows for the deleted test files.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the files above plus .skilled/skills/system-deep-loop/runtime/tests/unit/README.md.
- Do not edit lib/ or scripts/.

VERIFY (report each exit status)
  (cd .skilled/skills/system-deep-loop/runtime && npm run typecheck 2>&1 | tail -15)
  (cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/append-mode-event-cli.vitest.ts tests/unit/authorized-ledger.vitest.ts tests/unit/blinded-adjudication.vitest.ts tests/unit/check-projection-coverage.vitest.ts tests/unit/lifecycle-taxonomy.vitest.ts tests/unit/verify-authority-cli.vitest.ts tests/unit/write-set-conflict-graph.vitest.ts 2>&1 | tail -15)
  (The full suite takes about 25 minutes; the orchestrator runs it, you run only the files you touched.)
  for t in .opencode/plugins/tests/system-deep-loop-guard.test.cjs .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs; do node --test "$t" 2>&1 | tail -4; done

HANDBACK: list every file you changed, then each VERIFY command with its exit status and the last lines of any failure.
