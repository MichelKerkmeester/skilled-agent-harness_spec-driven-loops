# Changelog — 001: Daemon-lifecycle healing (F1/F2/F3)

**Shipped**: 2026-05-30
**Commit**: 4b2c5de6a3

## What Changed
- Modified `mcp_server/context-server.ts` to add boot FTS auto-heal: when daemon boots and finds .unclean-shutdown marker, runs FTS5 integrity-check and rebuilds shadow on failure, marks health 'repaired'
- Modified `.opencode/bin/mk-spec-memory-launcher.cjs` to add clean-close barrier: reap path computes cleanCloseAfterReap (clean only when child exited on SIGTERM and marker gone) and logs unclean handoffs
- Modified `mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` to separate diagnostic from scenario rows, reject connection FAILs and scenario FAILs, tolerate SKIP/PARTIAL, require memory scenario to run
- Modified `mcp_server/tests/context-server.vitest.ts` to update T56c for auto-heal contract
- Created `mcp_server/tests/launcher-clean-close-barrier.vitest.ts` for F2 unit test

## Why
The recurring SQLITE_CONSTRAINT_PRIMARYKEY write failure was traced to the mk-spec-memory launcher respawning over an unresponsive incumbent daemon without verifying the database closed cleanly, leaving the FTS5 shadow divergent so the next write aborted.

## Verification
- npm run build (shared + mcp-server): PASS (exit 0)
- node --check launcher: PASS
- context-server.vitest.ts: PASS, 378/378 (T56c asserts auto-heal)
- launcher-clean-close-barrier.vitest.ts: PASS, 4/4
- substrate stress (vs real daemon): PASS, 1/1 (410 ran; runner + Code-Graph SKIP tolerated)
- Comment-hygiene audit: PASS, 0 ephemeral-pointer violations
