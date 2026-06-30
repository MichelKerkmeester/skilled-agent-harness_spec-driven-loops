---
title: "Implementation Summary: Remediation of the 016 Last-50-Commits Deep Review"
description: "Summary of the 016 remediation: four parallel streams (lifecycle, IPC/socket/launcher, validator/memory-write, contract/config/docs) plus a test round closed every actionable finding; six items accepted with no code change as deliberate decisions. Verified: tsc clean, 1055+154+3 tests pass, byte-identical fork parity, alignment-drift PASS. Deployed 2026-06-05: daemon recycled to the fresh dist, code-graph dist rebuilt, launcher .cjs activates on the next fresh session."
trigger_phrases:
  - "016 remediation summary"
  - "last 50 commits remediation shipped"
  - "ingest worker fence shipped"
  - "socket fresh-bind hardening shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/017-last-50-commits-review-remediation"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Closed actionable 016 findings; verified tsc + suites"
    next_safe_action: "Operator builds + deploys the dist for the running daemon"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/shared/ipc/socket-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "last-50-commits-review-remediation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every actionable 016 finding is fixed and verified; six items are deliberate accept-no-action."
      - "Deployed 2026-06-05: mk-spec-memory daemon recycled to the fresh dist and verified live; code-graph dist rebuilt; launcher .cjs (F-004) activates on the next fresh session."
---
# Implementation Summary: Remediation of the 016 Last-50-Commits Deep Review

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-last-50-commits-review-remediation |
| **Completed** | 2026-06-05 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A remediation of the actionable findings from the sibling `016-last-50-commits-deep-review` packet. The work was partitioned into four parallel streams plus a dedicated test round, with the shutdown keystone (F-X19-02) done first.

### Fixes shipped (finding -> files)

- **Stream 1 — Shutdown/lifecycle.** F-A4-01 fences the ingest worker (job-queue `stopWorker()`/`shuttingDown` guard + a non-reopen DB accessor, called in `context-server` `fatalShutdown` before `closeDb`). F-X19-02 + F-A4-02 unify the two divergent SIGTERM/SIGINT handler stacks into one ordered path with a deterministic exit. Files: `mcp_server/context-server.ts`, `lib/runtime/shutdown-hooks.ts`, `lib/ops/job-queue.ts`.
- **Stream 2 — IPC/socket + launcher.** F-A5-01 (fresh-bind symlink reject + lstat-guarded `fchmod`), F-A5-03 (fail-closed canonicalize), F-A4-03 (re-entrant `startIpcSocketServer` guard), F-004 (launcher lease fsync parity). Files: `shared/ipc/socket-server.ts` + the system-code-graph fork (kept byte-identical, drift test enforces), `bin/mk-spec-memory-launcher.cjs`.
- **Stream 3 — Validator + memory-write.** F-A5-02 (`collectKnownSessionIds` DFS bounded with dir/depth/time caps), F-A2-01 (enrichment skip-guard also skips `archived`), F-A2-02 (entity-density doc comment), F-A2-03 (E089 `access denied:` tightened). Files: `lib/validation/orchestrator.ts`, `handlers/memory-save.ts`, `lib/search/entity-density.ts`, `handlers/save/response-builder.ts`.
- **Stream 4 — Contract/config/docs.** F-A7-01 (embedder tools added to `TOOL_LAYER_MAP`), F-A8-01 (dangling `.gemini/agents` refs removed from `.claude/agents` + `.codex/agents` mirrors), F-A8-02 (`_NOTE_HF_EMBED_SOCKET`/`_NOTE_TOTAL_MCP_BUDGET` added to `.codex/config.toml` + `.devin/config.json`), F-A9-01 (015 review-report + `changelog-000-015-docs-drift-review.md` P0 miscount 2 -> 1). Files: `lib/architecture/layer-definitions.ts`, the agent mirrors, `.codex/config.toml`, `.devin/config.json`, the 015 review-report and changelog.
- **Test round.** F-X19-01 (processLiveness drift guard — new `tests/lib/process-liveness-drift.vitest.ts`), F-A4-01/F-A5-01 validation (new `tests/ipc-socket-fresh-bind.vitest.ts` + job-queue.vitest.ts cases), F-A6-01 (auto-fix default OR-path integration test), F-A6-02 (3-node contradiction-cycle test), F-A6-03 (de-no-op'd 7 guarded assertions + gitignored fixture dir), F-X19-03 (rollout-bucketing test). Files under `mcp_server/tests/`.

### Accepted, no code change (deliberate)

Six items were accepted with no code change and recorded in `decision-record.md` (ADR-002..005): F-002 (lease EPERM = documented-correct cross-sandbox semantic), F-A3-01/F-A3-02 (reciprocal `contradicts` edges — no consumer assumes mutual exclusivity; trust-tree dormant in prod), F-CC-01 (review coverage gap — the IDOR/scope handlers were read and are sound), F-CC-P2-01/02 (low-risk unreviewed tooling, outside the hotspot set).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/context-server.ts` | Modified | Worker fence + unified ordered shutdown path |
| `lib/runtime/shutdown-hooks.ts` | Modified | Single ordered shutdown, deterministic exit |
| `lib/ops/job-queue.ts` | Modified | `stopWorker()`/`shuttingDown` + non-reopen accessor |
| `shared/ipc/socket-server.ts` (+ code-graph fork) | Modified | Fresh-bind symlink reject, fail-closed canonicalize, re-entrant guard |
| `bin/mk-spec-memory-launcher.cjs` | Modified | Lease fsync parity |
| `lib/validation/orchestrator.ts` | Modified | Bounded DFS caps |
| `handlers/memory-save.ts`, `lib/search/entity-density.ts`, `handlers/save/response-builder.ts` | Modified | `archived` skip, doc comment, E089 substring |
| `lib/architecture/layer-definitions.ts`, agent mirrors, `.codex/config.toml`, `.devin/config.json`, 015 docs | Modified | Layer map, dangling refs, note keys, miscount |
| `mcp_server/tests/**` | Added/Modified | Drift, fresh-bind, job-queue, auto-fix, contradiction, rollout tests; de-no-op + gitignore |
| `017/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md` | Created | This packet's canonical docs |
| `017/{description,graph-metadata}.json` | Created | Generated metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Freeze + classify.** Took the frozen actionable list from `016/review/review-report.md` and split each finding into actionable vs accept-no-action.
2. **Keystone first.** Unified the two divergent shutdown handler stacks into one ordered, deterministic-exit path (F-X19-02/F-A4-02), then fenced the ingest worker before `closeDb` (F-A4-01) — this unblocks the rest of the A4 cluster.
3. **Parallel streams.** Ran Streams 2-4 against independent surfaces: socket fresh-bind hardening on both byte-identical forks + the re-entrant guard + the launcher lease fsync (Stream 2); bounded validator DFS + memory-write guards (Stream 3); contract/config/docs parity + the 015 miscount correction (Stream 4).
4. **Test round.** Added/extended drift, fresh-bind, job-queue, auto-fix OR-path, 3-node contradiction-cycle, and rollout-bucket tests; de-no-op'd 7 guarded assertions; gitignored the test fixture dir.
5. **Verify + record.** Ran `tsc --noEmit`, the affected + new/extended + fork suites, and `verify_alignment_drift.py`; confirmed both socket-server copies are byte-identical; recorded the accept-no-action decisions in `decision-record.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Unify the shutdown path + fence the worker (ADR-001) | Keystone — removes both the non-deterministic exit and the dirty-WAL window the partial options leave intact |
| Apply the socket fix to both forks, keep byte-identical (ADR-006) | A one-fork security fix leaves the other vulnerable; `diff -q` + drift test make parity machine-checkable |
| Accept F-002 with no code change (ADR-002) | EPERM-on-live is the documented-correct cross-sandbox semantic; a "fix" would weaken safety |
| Accept F-A3-01/02 with no code change (ADR-003) | No consumer assumes mutual exclusivity; the trust-tree is dormant in production |
| Record F-CC-01 as honest disclosure (ADR-004) | The IDOR/scope handlers were read and are sound; a closed coverage gap, not a defect |
| Deploy via a reusable helper (scripts/deploy-mcp.sh) | Rebuilds every MCP dist and transparently recycles mk-spec-memory, so a future deploy cannot miss a server's dist or forget a launcher .cjs change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Type check | PASS - `npx tsc --noEmit` exit 0, 0 errors in mcp_server, shared, code-graph |
| Affected suites | PASS - 1055 tests pass, 0 fail |
| New/extended suites | PASS - 154 pass (drift, fresh-bind, job-queue, auto-fix, contradiction, rollout) |
| Fork parity | PASS - both `socket-server.ts` copies byte-identical (`diff -q`); code-graph fork drift+toctou 3 pass |
| Alignment drift | PASS - `verify_alignment_drift.py --root .opencode/skills/system-spec-kit`: 1510 files, 0 findings |
| Packet strict validate | PASS - `validate.sh 017-last-50-commits-review-remediation --strict` RESULT PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deployed (2026-06-05).** mk-spec-memory was rebuilt and its daemon child transparently recycled to the fresh dist, verified live (9400 memories, 14ms). code-graph dist was rebuilt and loads on its next start. The one launcher .cjs change (F-004 lease fsync) activates on the next fresh session because SIGHUP is a shutdown signal not a reload, and scripts/deploy-mcp.sh flags such changes on every run.
2. **Accept-no-action items remain by design.** Six findings (F-002, F-A3-01/02, F-CC-01, F-CC-P2-01/02) are accepted with no code change and recorded as deliberate ADRs; they are not defects to remediate.
3. **Fork parity depends on the drift test.** The two `socket-server.ts` copies are byte-identical now; staying that way relies on the IPC drift test continuing to run.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:architecture-summary -->
## L3: Architecture Summary

The remediation changed runtime behaviour on three architectural seams without touching the DB schema, MCP wire protocol, or lease-file format:

- **Shutdown teardown** moved from two divergent signal-handler stacks to a single ordered path (file-watcher -> ingest-worker fence -> `closeDb`) with a deterministic exit code; the worker uses a non-reopen DB accessor once shutting down, closing the dirty-WAL window.
- **IPC socket bind** became fail-closed on a fresh bind (lstat-reject symlink tail, lstat-guarded `fchmod`, fail-closed canonicalize) across both byte-identical forks, with a drift test as the enforcement seam, and `startIpcSocketServer` is now re-entrant-guarded.
- **Validator session-id traversal** is now bounded (dir/depth/time caps) so `--strict` cannot be turned into a DoS.

The contract/config/docs surface (layer map, agent mirrors, config notes, the 015 miscount) was brought into parity, and the architectural decisions — including the keystone shutdown choice and the six accept-no-action calls — are recorded in `decision-record.md`.
<!-- /ANCHOR:architecture-summary -->
