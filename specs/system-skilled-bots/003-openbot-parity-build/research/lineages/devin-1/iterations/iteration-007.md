# Iteration 7: Plan versus runtime — per-bot apps (007) and vault (008)

## Focus
Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/*/plan.md, specs/system-skilled-bots/003-openbot-parity-build/*/tasks.md, specs/system-skilled-bots/003-openbot-parity-build/*/acceptance-criteria.md, .skilled/skills/system-skilled-bots/runtime/lib, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/tests): Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch.

## Actions Taken
1. Read 007 `tasks.md` and checked every setup probe: the 14-server count via python3, the `clean` fixture's `nightly-digest` and its `isolation: shared` line, the absence of `apps` across the lib and checker, the absent allowlist key, and the doctor command path.
2. Read 008's acceptance and checklist rows; re-ran its DoD checker command on the repository root.
3. Confirmed the `secret-unknown` count across 008's four docs.

## Findings
1. **P1 — phase 008, `plan.md:51` and `tasks.md:96` (T031): the "run the checker on this repository" verify cannot pass.** `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .` exits 2 with `FAIL: definitions-missing: .../bots is not a folder`, because the repository root has no `bots/config.json`; the DoD says it exits 0. **Exact edit:** point T031 and the DoD at a fixture (`node $S/scripts/bot-check.cjs $S/scripts/fixtures/clean`, as phase 007 does) or at a scratch repository that holds `bots/config.json`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:51] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:96]

2. **P2 — phase 008, `tasks.md:200` (CHK-040): the expected output is wrong for `rg -c`.** The row says `rg -c 'secret-unknown' <four docs>` "prints one line per document, four in all"; `rg -c` prints `path:count` and the current counts are 3, 2, 5 and 1, so the check passes but the stated expectation invites a false failure. **Exact edit:** say "prints four lines, one per document, each with a non-zero count". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:200]

3. **P2 — phase 007, `tasks.md:167` (CHK-050) and `:168` (CHK-051): `scratch/measured/{clean,with-apps}` is never created.** No task copies the measured fixtures there, and the spec's measured-behavior block names no such path, so CHK-050 cannot pass and CHK-051's "scratch prints nothing" contradicts CHK-050's own requirement. **Exact edit:** add a setup task that copies the two fixture trees under `scratch/measured/`, or drop CHK-050 and keep CHK-051. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/tasks.md:167]

## Ruled Out
- Suspected 007 setup drift: ruled out. python3 3.9.6 is present and prints 14 servers; the `clean` fixture holds `bots/nightly-digest/BOT.md` with `isolation: shared` at line 6; `grep -rc 'apps'` over the lib and checker prints nothing; the executor allowlist has no `UTCP_CONFIG_FILE`; `.opencode/commands/doctor/bots.md` exists.
- Suspected 007 REQ-count drift: ruled out — `grep -c '^| REQ-0'` prints 9.
- Suspected 008 DoR drift: ruled out again — `posture.secrets` and `SKILLED_BOT_SECRET_` both exit 1, and `secret-unknown` appears in all four docs.

## Dead Ends
- No dead ends.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none between sources; the checker's own exit 2 is the evidence against 008's DoD.
- Missing dependencies: none beyond the fixture the 008 check needs.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md
- .skilled/skills/system-skilled-bots/scripts/bot-check.cjs
- .skilled/skills/system-skilled-bots/scripts/fixtures/clean/bots/nightly-digest/BOT.md
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
- .opencode/commands/doctor/bots.md
- Host command output: `python3 --version`, `bot-check.cjs .`

## Assessment
- New information ratio: 1.0
- Questions addressed: F-1-001 for phases 007 and 008
- Questions answered: none fully

## Reflection
- What worked and why: running 008's DoD command instead of reading it found an exit-2 refusal that no amount of prose review would have surfaced; the checker's own message is the evidence.
- What did not work and why: nothing failed; 007's setup probes are exact and cheap to confirm, which is a sign the phase was written against the runtime rather than from memory.
- What I would do differently: execute every DoD command whose target is a directory or repository root, because those are the ones that assume a layout the packet may not have.

## Recommended Next Focus
Continue F-1-001 on skills (009) and conversations (010), then the final 011 pass; the checker-on-repo-root pattern should be checked in 009-011 too.
