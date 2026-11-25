# Iteration 10: Secret scans outside the run folder

## Focus
Frontier node F-2-008 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/008-vault, .skilled/skills/system-skilled-bots/runtime/lib): Do the secret scans cover child transcripts and logs written outside the run folder, such as an executor's own session store, or only the run folder the plan scans?

## Actions Taken
1. Read 008's proof claim ("a fixture bot that prints its own environment") against its scan (`rg -c 'skilled-test-value-7f3a' "$RUN"`) and AC-007.
2. Traced where the child's stdout goes (`stdout.log` under the run folder) and where the executor writes its own transcript (outside the run folder).
3. Read `buildReceiptFacts` in the deep-loop audit to see whether a dispatch receipt could carry the environment.

## Findings
1. **P1 — phase 008, `plan.md:31` versus `tasks.md:97` (T032) and `acceptance-criteria.md:64` (AC-007): the fixture that proves injection would fail the scan.** The plan says the proof is "a fixture bot that prints its own environment"; printing the environment writes `SKILLED_BOT_SECRET_DEMO=<value>` into the child's stdout, which the runner captures to `stdout.log` inside the run folder, while T032 asserts `rg -c 'skilled-test-value-7f3a' "$RUN"` prints 0. The fixture must print only the key name (or mask the value), and AC-007's "the child's stdout holds `SKILLED_BOT_SECRET_DEMO=`" must say the value is absent. **Exact edit:** specify the fixture prints `env | sed 's/=.*//'` (names only) and add "and the value is absent" to AC-007. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:31] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:97] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:64]

2. **P1 — phase 008, `plan.md:31` and REQ-007: the scan covers the run folder only, while the child's own transcript and workspace are outside it.** The value reaches the child environment by design; the child (Codex, Claude Code, OpenCode, Devin) writes its own session transcript under its own store, and it can write the value into the checkout or worktree. The scan of `$RUN`, the record and the delivery message cannot see either. The claim "the value reaches exactly one child environment and no other surface" is true of the runtime's writes and false of the child's. **Exact edit:** narrow the claim to "the runtime writes the value to no surface; the child can copy it anywhere it can write", add a scan of the executor's known session store where the executor names one, and document the boundary in §6. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:31] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:96]

3. **P2 — phase 008, `spec.md:96` (REQ-007): the delivery and answer checks run after the transcript is written, so they cannot prevent a transcript leak.** `findSecretLiteral` guards the delivery message and the answer before they are stored or sent, but the child's transcript is written during the run. **Exact edit:** state in §6 that transcript and workspace containment is the executor sandbox's responsibility, not the vault's, and name which executors are expected to confine it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:96] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:291]

## Ruled Out
- Suspected dispatch-receipt leak: ruled out. `buildReceiptFacts` records only command, args, cwd, executor and iteration; the environment is not persisted, and the vault passes the value through `dispatchEnv`, not argv, so the receipt carries no value.
- Suspected run-master-secret leak: ruled out by the module's own containment guarantee (in-memory only, never env/argv/disk).

## Dead Ends
- No dead ends.

## Edge Cases
- Ambiguous input: "prints its own environment" could mean names or values; the scan's assertion decides it must mean names, so the ambiguity is recorded as finding 1.
- Contradictory evidence: the plan's fixture and its scan contradict each other; both are cited.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts
- .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts

## Assessment
- New information ratio: 1.0
- Questions addressed: F-2-008
- Questions answered: the question is answered as a finding — the scan covers only the run folder; the child's transcript and workspace are outside it.

## Reflection
- What worked and why: following the child's stdout to `stdout.log` made the fixture/scan contradiction concrete; without that path the two statements look compatible.
- What did not work and why: nothing failed.
- What I would do differently: for every "prints its environment" fixture, ask which stream it prints to and whether the scan reads that stream.

## Recommended Next Focus
F-2-009: does `bots status --json` keep one key set across phases 003 and 004?
