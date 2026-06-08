# Deep-review shared context

Repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` (run from here).
Review the work in the last ~75 commits (`git diff HEAD~75 HEAD`). Pinned HEAD when this started: see `/tmp/review-head.txt`.

## What recently shipped (the work under review)
- **Daemon re-election** is now default-on in all 3 runtime configs. On owner disposal the launcher RELEASES the detached daemon (keeps the daemon lease + socket, drops only the owner lease) so a live secondary keeps MCP transport, instead of killing it.
- **Reap-before-respawn fix**: a fresh session started AFTER an owner disposed used to reclaim the stale lease and spawn a SECOND daemon on the same WAL DB (double-writer), because lease liveness keyed on the dead owner pid not the live daemon childPid. The launcher now reaps the recorded child on the stale-lease reclaim branch (`main()` `if (leaseResult.staleReclaimable)`) before respawn, under the owner-lease O_EXCL mutex, bailing to a lease-held report on EPERM.
- **Earlier daemon-reliability hardening (017-022)**: disposal flap guard, persistent launcher log, lease-probe reap hardening (N consecutive deep-probe failures), mk-code-index reconnecting proxy, orphan-sweep Stop-hook (default off).
- **Live + hermetic tests**: `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` (two real launchers in an isolated fake-root) + `daemon-reelection-release-integration.vitest.ts`.
- **Hook portability**: Claude/Codex/Devin hook commands rewritten from a hardcoded abs path + `/opt/homebrew/bin/node` to `cd "${<RT>_PROJECT_DIR:-$PWD}" && node <relative>`. Applied in Public + the Barter mirror.
- **Doc alignment**: changelog v3.5.0.4, ENV_REFERENCE, README, feature_catalog, manual_testing_playbook, skill docs and code READMEs updated to re-election default-on + the reap.

## Your job
Review your ASSIGNED ANGLE only (see the angle brief). Find REAL defects, risks, and gaps in the RECENT CHANGES (not pre-existing unrelated code). Be concrete and skeptical. For each finding give an exact `file:line`, a one-line title, a precise detail (what is wrong + why it matters + a concrete scenario), and a severity:
- **P0** = correctness/data-loss/security bug or a broken behavior shipped.
- **P1** = real risk, race, missing guard, or a claim that does not match the code.
- **P2** = quality/maintainability/test-weakness/doc-drift.

Only report findings you can substantiate by reading the actual code. Prefer a few high-confidence findings over many speculative ones. If the angle is genuinely clean, say so with the evidence you checked.

## Output contract (MANDATORY)
After your analysis, end your response with a single fenced ```json block containing ONLY a JSON array of findings, each:
`{"severity":"P0|P1|P2","file":"<path>","line":<int or 0>,"title":"<short>","detail":"<precise>","confidence":"high|med|low"}`
If no findings: output `[]`. Read-only: do NOT edit any file.
