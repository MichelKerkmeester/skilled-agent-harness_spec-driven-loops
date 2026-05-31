# Changelog — 005: Wire a second live code-graph daemon into the substrate stress harness

**Shipped**: 2026-05-31
**Commit**: 4b2c5de6a3

## What Changed
- Modified `run-substrate-stress-harness.mjs` to add shortSocketDir(slug) helper returning os.tmpdir()/spk-substrate-<slug> for short socket dirs
- Modified memory daemon env to use SPECKIT_IPC_SOCKET_DIR: shortSocketDir('mem')
- Added second connectSharedClient for mk-code-index with shortSocketDir('cg'), bridge disabled, maintainer mode OFF
- Registered new client + tool-name set under clients/toolNameSets and extended selectClientForServer to route mk_code_index
- Modified substrate-runner-harness.vitest.ts to sync stale description/comments to two-daemon reality (assertions unchanged)

## Why
The substrate runner only connected mk-spec-memory daemon, so 403/404/407 scenarios calling code_graph_context SKIPped. Also, daemons used in-database socket paths (~134 chars) which exceeded macOS sun_path limit, causing listen() EINVAL and runner FAIL. The suite was red by default on deep checkouts.

## Verification
- Standalone code-graph probe: PASS — connect ok, code_graph_context isError=false, ~1895-char response
- node --check harness: PASS
- Harness run (4 scenarios): 403=PASS 404=PASS 407=PASS 410=PASS; runner-FAIL=0
- npm run stress:substrate (3x, no env): PASS — Test Files 3 passed, Tests 9 passed, each run
- Stash-compare (HEAD vs change): HEAD = RED (1 failed | 2 passed); with change = GREEN — confirms the fix
- graph-metadata mass-write: NONE — dirty count 0 before and after every run
- vitest assertions: byte-unchanged (diff +8/-8, comments/description only)
- Comment-hygiene (both files): PASS — 0 ephemeral-pointer violations
- Packet strict-validate: PASS
