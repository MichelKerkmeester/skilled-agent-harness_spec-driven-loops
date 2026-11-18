# Work record: state-log route proof

Source: item 9 of `scratch/request-from-vendoring-project.md`, reported by a project that vendors Skilled. Items 1 to 8 live in `specs/system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups`. Worktree `worktrees/470-surfacing-scorer-follow-ups`, branched from origin/main `9cda2018330`. Paths below are under `.skilled/skills/system-deep-loop/runtime/`.

## Half 1: route-proof fields dropped from the state log

- Cause, confirmed in code: the gateway rebuilds the state log from the ledger. The legacy-record conversion in `lib/deep-research-ledger-schema/legacy-compatibility.ts` copied only `focus` and `answeredQuestions` as optional data. The projection in `lib/legacy-projections/deep-research-contract.ts` (`deep_research.iteration_completed`) wrote a fixed `mode: 'research'`. So `target_agent`, `agent_definition_loaded` and `resolved_route` never reached the state log, and the command's route-proof check (`lib/deep-loop/post-dispatch-validate.ts`, which reads those fields) failed a correct run.
- Fix:
  - `lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`: optional `iteration_completed` fields `targetAgent` (prose), `agentDefinitionLoaded` (boolean) and `resolvedRoute` (prose).
  - `legacy-compatibility.ts`: copies them from the record when they are well-typed.
  - `deep-research-contract.ts`: writes them back as `target_agent`, `agent_definition_loaded` and `resolved_route` when present. Older ledgers without them project as before.
- Proof: a new test in `tests/unit/deep-research-ledger-schema.vitest.ts`, "keeps the route-proof fields of a completed iteration in the state log". It failed first, and passes now (58 of 58 in that file).

## Half 2: a relative state-log path writes outside the packet

- Cause, confirmed in code: `lib/deep-loop/executor-audit.ts` `appendThroughGateway` spawns the append gateway with `cwd: REPOSITORY_ROOT` and `--run-directory dirname(stateLogPath)`. `REPOSITORY_ROOT` comes from the module's own real file location. Through a symlinked `.skilled`, that is the Skilled checkout, not the caller's project, so a relative path resolves inside Skilled.
- Fix: a new exported `gatewayRunDirectory(stateLogPath)` returns `dirname(resolve(stateLogPath))`, so the path is fixed against the caller's working directory before the spawn. `appendThroughGateway` uses it.
- Proof: `tests/unit/executor-audit-run-directory.vitest.ts`, with 2 tests: relative becomes absolute under the caller's cwd, and absolute stays as given. They failed first, and pass now. The related executor-audit suites pass: 101 tests across 3 files.

## Verification

- Typecheck (`npm run typecheck`): exit 0.
- Whole deep-loop suite after the fixes: 186 files, 3098 passed, 0 failed, 9 skipped. No clean baseline was captured before the change, so this shows zero failures, not a measured delta.
