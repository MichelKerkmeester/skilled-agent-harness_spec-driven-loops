---
title: "Implementation Summary: Wire a second live code-graph daemon into the substrate stress harness"
description: "The substrate runner now starts a dedicated mk-code-index daemon alongside mk-spec-memory with short per-daemon socket dirs, so 403/404/407 execute against a real second daemon (PASS) and the suite is green by default — converting a red-at-HEAD test to reliably green, no mass-write."
trigger_phrases:
  - "substrate code-graph 2nd daemon summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/005-substrate-codegraph-2nd-daemon"
    last_updated_at: "2026-05-31T05:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified 3x green + stash-compare + no mass-write; committing"
    next_safe_action: "Commit; update parent pointer; report"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003659"
      session_id: "036-005-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Done by the Opus main loop (heavy infra-code on a shared test); de-risked probe-first + a git-stash baseline comparison proving HEAD was red and the change is what turns it green."
---
# Implementation Summary: Wire a second live code-graph daemon into the substrate stress harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/005-substrate-codegraph-2nd-daemon |
| **Completed** | 2026-05-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The substrate stress runner now starts a **second real daemon** — the code-graph index — alongside `mk-spec-memory`, and gives **both** spawned daemons short IPC socket directories. This fixes two compounding defects: scenarios 403/404/407 (which call `mcp__mk_code_index__code_graph_context`) used to SKIP because only `mk-spec-memory` was connected; and the suite was red-by-default on deep checkouts because the daemons' in-`database/` socket path overflowed the macOS `sun_path` limit, killing the daemon on `listen()`.

### Changes
- **run-substrate-stress-harness.mjs**:
  - `import os`; added `CODE_INDEX_DAEMON_STDERR_LOG` and a `shortSocketDir(slug)` helper that returns and pre-creates `os.tmpdir()/spk-substrate-<slug>` (a short, allowed socket root; created up front because `listen()` on a missing dir also fails with EINVAL).
  - Memory daemon env gains `SPECKIT_IPC_SOCKET_DIR: shortSocketDir('mem')`.
  - Added a second `connectSharedClient('mk-code-index', ...)` spawning `mk-code-index-launcher.cjs` as a dedicated child (`shortSocketDir('cg')`, bridge disabled; maintainer mode deliberately OFF so no `INDEX_*` scan rewrites graph-metadata).
  - Registered the new client + tool-name set under `clients` / `toolNameSets`; extended `selectClientForServer` to route `mk_code_index` / `mk-code-index`.
- **substrate-runner-harness.vitest.ts**: updated the `it(...)` description and two stale comments (which said the runner starts "only the mk-spec-memory daemon" and the scenarios "legitimately SKIP") to the two-daemon reality. All `expect(...)` assertions are byte-unchanged (diff is +8/-8, comments only).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../stress_test/substrate/run-substrate-stress-harness.mjs` | Modified | Short socket dirs for both daemons + connect + route the 2nd (code-graph) daemon |
| `.../stress_test/substrate/substrate-runner-harness.vitest.ts` | Modified | Sync stale description/comments to two daemons |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Done by the Opus main loop (heavy infra-code touching a shared test). De-risked probe-first: a standalone script confirmed a dedicated `mk-code-index` daemon connects and `code_graph_context` returns content (`isError=false`) with a valid short socket dir, BEFORE any harness edit. The red-by-default root cause was read directly from the daemon stderr (sun_path EINVAL on the in-database socket). After wiring, verification was layered: `node --check`; a harness run showing `403/404/407=PASS 410=PASS` with 0 runner-FAIL; `npm run stress:substrate` green **3x consecutive** with NO external env (`Test Files 3 passed, Tests 9 passed`); a **git-stash comparison** proving the suite is RED at HEAD (`1 failed | 2 passed`, the runner-harness file) and GREEN with the change — i.e. the change is precisely what fixes it; and a graph-metadata dirty count of 0 before and after every run (no mass-write). Comment-hygiene is clean on both files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One `shortSocketDir(slug)` helper for both daemons | Centralizes the sun_path mitigation; distinct subdirs prevent the two daemons colliding on the same daemon-ipc.sock filename |
| Pre-create the socket dir in the helper | `listen()` fails with EINVAL on a missing directory too — not just a too-long one |
| os.tmpdir() (not a hand-exported dir) | Short + allowed (code-graph allowlist = cwd / os.tmpdir() / /tmp) + portable to Linux CI; makes the suite green without any caller env var |
| Maintainer mode OFF | A forced INDEX_* scan would rewrite graph-metadata tree-wide (daemon-index-staging-hazard); verified 0 dirtied |
| Keep SKIP tolerated in the vitest | An empty graph or transient code-graph startup degrades to SKIP rather than flaking the shared suite; a true connect failure still surfaces as a runner-FAIL row |
| Probe-first + stash-compare before committing | The test was red-at-HEAD; proving exactly what flips it to green avoids a blind or hollow-green change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Standalone code-graph probe | PASS — connect ok, code_graph_context isError=false, ~1895-char response |
| node --check harness | PASS |
| Harness run (4 scenarios) | 403=PASS 404=PASS 407=PASS 410=PASS; runner-FAIL=0 |
| `npm run stress:substrate` (3x, no env) | PASS — Test Files 3 passed (3), Tests 9 passed (9), each run |
| Stash-compare (HEAD vs change) | HEAD = RED (1 failed | 2 passed); with change = GREEN — confirms the fix |
| graph-metadata mass-write | NONE — dirty count 0 before and 0 after every run |
| vitest assertions | byte-unchanged (diff +8/-8, comments/description only) |
| Comment-hygiene (both files) | PASS — 0 ephemeral-pointer violations |
| Packet strict-validate | PASS (confirmed at commit gate) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SKIP still tolerated for 403/404/407.** The vitest accepts PASS/SKIP/PARTIAL for those scenarios, so an unpopulated code-graph DB or a transient code-graph startup failure degrades to SKIP rather than failing. This is deliberate (anti-flake on a shared suite). A future hardening could require those scenarios to be non-SKIP; not done here to avoid CI flake in environments that do not pre-scan the graph. A genuine connect failure still surfaces as a `runner:mk-code-index FAIL` row that fails the test.
2. **Depends on a populated code-graph DB.** The scenarios resolve real nodes only when `code-graph.sqlite` is populated (it is, locally — 70278 nodes). The DB is a gitignored generated artifact, so CI must run a `code_graph_scan` (or accept the tolerated SKIP) for 403/404/407 to PASS rather than SKIP.
<!-- /ANCHOR:limitations -->
