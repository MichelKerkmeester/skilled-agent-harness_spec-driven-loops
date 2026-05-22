---
title: "Deep Review Report — Arc 009 (Memory-Leak Remediation, 13 phases)"
description: "10-iteration deep-review of arc 009 across correctness, security, traceability, and maintainability dimensions. Executor: cli-codex gpt-5.5 xhigh fast. Converged at iter 10 (ratio 0.10)."
trigger_phrases:
  - "arc 009 deep review report"
  - "memory leak remediation review"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/review"
    last_updated_at: "2026-05-22T17:56:07Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-deep-review-synthesis"
    next_safe_action: "plan-remediation-or-merge-as-conditional-pass"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: review-report-core | v1.0 -->
# Deep Review Report — Arc 009 (Memory-Leak Remediation, 13 phases)

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

Arc 009 was reviewed across the 13 memory-leak remediation phase children using 10 deep-review iterations covering correctness, security, traceability, and maintainability. The reducer registry contains 60 active findings: P0=0, P1=40, P2=20. The verdict is **CONDITIONAL** because no P0 blockers remain but 40 P1 required findings still need an explicit remediation plan; the highest-risk themes are non-exclusive ownership primitives, local-service/env trust-boundary gaps, lifecycle cleanup paths that can report success too early, and completion evidence that proves narrower behavior than the phase specs require.
<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:verdict -->
## 2. Verdict

- **Verdict:** CONDITIONAL
  - PASS = 0 P0 + 0 unaddressed P1
  - CONDITIONAL = 0 P0 + has P1 (release acceptable with explicit follow-on plan)
  - FAIL = >=1 P0
- **`hasAdvisories`:** true
- **Severity counts:** P0=0, P1=40, P2=20 (total: 60)
- **Convergence:** converged at iter 10 (ratio 0.10) — final iter signal "converged"
<!-- /ANCHOR:verdict -->

<!-- ANCHOR:methodology -->
## 3. Methodology

The loop used the configured dimension rotation from the review packet: correctness, security, traceability, maintainability, then repeated until the 10-iteration cap. Executor config came from `deep-review-config.json`: `cli-codex`, model `gpt-5.5`, reasoning effort `xhigh`, service tier `fast`, timeout 900 seconds, and convergence threshold 0.10. Each iteration was scoped to the arc 009 phase children and was limited to review-only reads plus writes under `review/`; source, test, and phase-child docs were treated as read-only. The canonical de-dup key is the registry fingerprint, and the reducer-owned `deep-review-findings-registry.json` is the source of truth for final IDs, severities, dimensions, and files. The deep-review protocol caps each leaf iteration at 12 tool calls; synthesis did not add findings and only performed allowed adversarial downgrades, none of which were warranted.
<!-- /ANCHOR:methodology -->

<!-- ANCHOR:findings-by-dimension -->
## 4. Findings by Dimension

### Correctness

Total: 17 (P0=0, P1=13, P2=4).

Top findings:
- **DR009-COR-005** (P1): Cancelled CocoIndex updates still sync FTS and mark initial indexing done.
- **DR009-COR-015** (P1): Child heartbeat silently fails after lease transfer misses.
- **DR009-COR-002** (P1): Code Graph owner lease can be double-acquired.
- **DR009-COR-014** (P1): Concurrent sidecar spawns can lose ledger rows.
- **DR009-COR-007** (P1): Config refresh can close a project while indexing is active.

Themes: atomic acquisition is still weaker than the ownership contracts, cleanup paths can report success before resources are actually closed, and cancellation/refresh paths can transform interrupted work into clean state.

### Security

Total: 17 (P0=0, P1=13, P2=4).

Top findings:
- **DR009-SEC-004** (P1): Cancel stale-identity sets grow without a retention cap.
- **DR009-SEC-007** (P1): Code Graph DB override is not constrained to the workspace.
- **DR009-SEC-010** (P1): Code Graph executes COCOINDEX_BIN_PATH without containment.
- **DR009-SEC-013** (P1): Code Graph launcher lets project dotenv inject Node runtime options.
- **DR009-SEC-001** (P1): Configured rerank API keys are dropped before uvicorn starts.

Themes: local trust boundaries are too broad: env inheritance, dotenv execution, unauthenticated warmup, unbounded payload/state retention, and predictable ownership proofs all widen blast radius.

### Traceability

Total: 12 (P0=0, P1=10, P2=2).

Top findings:
- **DR009-TRC-005** (P1): Adapter RSS benchmark closes without required slope numbers.
- **DR009-TRC-001** (P1): CLI dispatch branches bypass the supervised executor contract.
- **DR009-TRC-007** (P1): Client-facing index_cancel transport is not covered.
- **DR009-TRC-002** (P1): Concurrent lock coverage is only sequential single-process coverage.
- **DR009-TRC-009** (P1): Parent-death polling is asserted by env only.

Themes: several phase completion claims point at helper-level tests, synthetic fixtures, or blocked operator checks while the written criteria require public transport, concurrency, live reconnect, or measured RSS evidence.

### Maintainability

Total: 14 (P0=0, P1=4, P2=10).

Top findings:
- **DR009-MNT-002** (P1): Code Graph owner lease protocol is hand-copied in TS and CJS.
- **DR009-MNT-003** (P1): Daemon task registry silently overwrites duplicate task IDs.
- **DR009-MNT-009** (P1): Deep-review executor config still has type/kind schema drift.
- **DR009-MNT-001** (P1): Rerank sidecar ensure helpers have incompatible ownership contracts.
- **DR009-MNT-004** (P2): ActiveWorkRegistry's retain_stale flag reads backwards.

Themes: duplicated cross-runtime protocols, incomplete barrels/READMEs, and stale phase identifiers increase the chance that future fixes land in one surface but miss its mirror.
<!-- /ANCHOR:findings-by-dimension -->

<!-- ANCHOR:findings-by-phase -->
## 5. Findings by Phase

Mapping rule used: phase ownership follows the registry file path when it lands inside a phase child; otherwise it follows the implementation surface rules from the synthesis prompt. That pulls process-harness findings into phase 002 even though the review charter shorthand says 003-013, because the explicit mapping rule names phase 002 for `process-memory-harness`.

| Phase | Finding ID | Severity | Title | File |
|---|---|---|---|---|
| 002 | DR009-COR-006 | P1 | Process inventory failures are reported as an empty clean inventory | `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:181` |
| 002 | DR009-SEC-015 | P1 | Process inventory emits raw owner tokens in command lines | `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:143` |
| 003 | DR009-COR-004 | P1 | Pre-dispatch audit reads can crash on the corrupt JSONL tail they added | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:330` |
| 003 | DR009-SEC-012 | P1 | Deep-loop external executors inherit the full parent environment | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:275` |
| 003 | DR009-TRC-001 | P1 | CLI dispatch branches bypass the supervised executor contract | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards/spec.md:119` |
| 003 | DR009-MNT-009 | P1 | Deep-review executor config still has type/kind schema drift | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21` |
| 004 | DR009-COR-001 | P1 | Deep-loop lock can be double-acquired during concurrent startup | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts:107` |
| 004 | DR009-TRC-002 | P1 | Concurrent lock coverage is only sequential single-process coverage | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/spec.md:126` |
| 004 | DR009-MNT-005 | P2 | Lifecycle READMEs omit the arc 009 helper surfaces | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/README.md:37` |
| 005 | DR009-MNT-007 | P2 | process-sweep apply --confirmed is still a dry-run command | `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:126` |
| 005 | DR009-MNT-014 | P2 | Ops README validation command references a stale verifier path | `.opencode/skills/system-spec-kit/scripts/ops/README.md:63` |
| 006 | DR009-COR-005 | P1 | Cancelled CocoIndex updates still sync FTS and mark initial indexing done | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:61` |
| 006 | DR009-COR-007 | P1 | Config refresh can close a project while indexing is active | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:452` |
| 006 | DR009-COR-010 | P1 | Project.close() marks resources closed before close succeeds | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:38` |
| 006 | DR009-COR-012 | P2 | Task-registry shutdown mutates completed history back to cancelling | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:100` |
| 006 | DR009-COR-013 | P1 | Mismatched cancel identities can cancel the wrong index | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/cancel_protocol.py:33` |
| 006 | DR009-SEC-004 | P1 | Cancel stale-identity sets grow without a retention cap | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:44` |
| 006 | DR009-TRC-003 | P1 | Queued CocoIndex index work has no remove-project fixture | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:118` |
| 006 | DR009-TRC-007 | P1 | Client-facing index_cancel transport is not covered | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:124` |
| 006 | DR009-MNT-003 | P1 | Daemon task registry silently overwrites duplicate task IDs | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py` |
| 006 | DR009-MNT-004 | P2 | ActiveWorkRegistry's retain_stale flag reads backwards | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:104` |
| 006 | DR009-MNT-011 | P2 | CocoIndex lifecycle package omits shipped helper entrypoints | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/__init__.py:3` |
| 007 | DR009-COR-002 | P1 | Code Graph owner lease can be double-acquired | `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:97` |
| 007 | DR009-SEC-007 | P1 | Code Graph DB override is not constrained to the workspace | `.opencode/bin/mk-code-index-launcher.cjs:159` |
| 007 | DR009-SEC-013 | P1 | Code Graph launcher lets project dotenv inject Node runtime options | `.opencode/bin/mk-code-index-launcher.cjs:57` |
| 007 | DR009-TRC-008 | P2 | Phase 007 is complete while every task checkbox is open | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/spec.md:45` |
| 007 | DR009-MNT-002 | P1 | Code Graph owner lease protocol is hand-copied in TS and CJS | `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` |
| 007 | DR009-MNT-010 | P2 | Code Graph lifecycle helpers bypass the documented library barrel | `.opencode/skills/system-code-graph/mcp_server/lib/index.ts:4` |
| 008 | DR009-COR-009 | P1 | Rerank sidecar warmup timeout can leave an unledgered process | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:192` |
| 008 | DR009-COR-014 | P1 | Concurrent sidecar spawns can lose ledger rows | `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:157` |
| 008 | DR009-SEC-001 | P1 | Configured rerank API keys are dropped before uvicorn starts | `.opencode/skills/system-rerank-sidecar/scripts/start.sh:28` |
| 008 | DR009-SEC-002 | P1 | Warmup endpoint bypasses rerank auth and rate limiting | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:209` |
| 008 | DR009-SEC-003 | P1 | Sidecar spawn accepts any localhost health response as ownership proof | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:172` |
| 008 | DR009-SEC-005 | P2 | Optional rerank logging writes raw query text without rotation or redaction | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:46` |
| 008 | DR009-SEC-006 | P2 | Extra allowlisted models can execute local remote-code without revision pins | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:120` |
| 008 | DR009-SEC-008 | P1 | Rerank requests cap item count but not document bytes | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:155` |
| 008 | DR009-SEC-009 | P1 | Model switcher kills sidecars by command substring | `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:139` |
| 008 | DR009-SEC-011 | P2 | Sidecar startup sources dotenv files as shell code | `.opencode/skills/system-rerank-sidecar/scripts/start.sh:14` |
| 008 | DR009-SEC-016 | P1 | Rerank reusable-sidecar ownership token is predictable | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:86` |
| 008 | DR009-MNT-001 | P1 | Rerank sidecar ensure helpers have incompatible ownership contracts | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` |
| 009 | DR009-COR-003 | P1 | Runtime signal hooks run cleanup but do not terminate the process | `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts:119` |
| 009 | DR009-COR-008 | P1 | Embedder sidecar timeout cleanup can detach a live child | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:327` |
| 009 | DR009-COR-011 | P2 | BoundedMap can exceed maxSize when the oldest key is undefined | `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:51` |
| 009 | DR009-COR-017 | P2 | Audit rotation can overwrite a prior rotation in the same millisecond | `.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts:32` |
| 009 | DR009-TRC-004 | P1 | Runtime retention stress coverage uses synthetic maps only | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:133` |
| 009 | DR009-TRC-009 | P1 | Parent-death polling is asserted by env only | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:125` |
| 009 | DR009-TRC-010 | P1 | Timeout-kill fixture is a false positive on macOS | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:135` |
| 009 | DR009-MNT-006 | P2 | TtlMap.has() treats stored undefined as missing | `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:85` |
| 010 | DR009-TRC-011 | P1 | Phase 010 closed with an available memory scan uncompleted | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/spec.md:140` |
| 011 | DR009-COR-016 | P2 | Relationship queries reject the documented file-path subject | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:52` |
| 011 | DR009-SEC-010 | P1 | Code Graph executes COCOINDEX_BIN_PATH without containment | `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:146` |
| 011 | DR009-SEC-014 | P1 | Stored Code Graph metadata is interpolated into a shell command | `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:107` |
| 011 | DR009-SEC-017 | P2 | IPC bridge unlinks any existing daemon-ipc.sock path | `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:58` |
| 011 | DR009-TRC-012 | P2 | Phase 011 evidence uses stale phase identifiers | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/tasks.md:96` |
| 012 | DR009-TRC-005 | P1 | Adapter RSS benchmark closes without required slope numbers | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:122` |
| 012 | DR009-MNT-012 | P2 | Adapter RSS benchmark scripts duplicate the same measurement core | `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py:41` |
| 012 | DR009-MNT-013 | P2 | Phase 012 benchmark docs still point at arc 010 phase 002 | `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/methodology.md:3` |
| 013 | DR009-COR-015 | P1 | Child heartbeat silently fails after lease transfer misses | `.opencode/skills/system-code-graph/mcp_server/index.ts:41` |
| 013 | DR009-TRC-006 | P1 | SC-003 reconnect success is modeled, not manually verified | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/spec.md:153` |
| 013 | DR009-MNT-008 | P2 | Phase 013 summary points at the wrong phase number | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:55` |
<!-- /ANCHOR:findings-by-phase -->

<!-- ANCHOR:adversarial-spot-check -->
## 6. Adversarial Spot-Check

Five P1 findings were re-read against their cited source and nearby tests. No finding was downgraded or withdrawn, so severity totals and verdict are unchanged.

| Finding ID | Result | Re-check |
|---|---|---|
| DR009-COR-001 | Verified | `loop-lock.ts` reads the holder before replacing the lock file, while `loop-lock.vitest.ts` only exercises sequential second-acquire cases. The proposed exclusive-acquire fix is localized to the claim path and should reduce race risk. |
| DR009-SEC-001 | Verified | `start.sh` scrubs the environment without carrying `RERANK_API_KEY`, and `verify_rerank_secret` only enforces auth when that env var is present. Existing sidecar tests start through the script but do not cover auth propagation. |
| DR009-SEC-014 | Verified | `ensure-ready.ts` builds a shell-form `git diff` command with the stored metadata value from `getLastGitHead()`; tests mock command strings but do not prove ref validation or argument-array execution. |
| DR009-TRC-002 | Verified | Phase 004 claims concurrent same-packet coverage, but the cited lock test performs sequential calls in one process. A worker/barrier fixture is the safe fix because it tests the actual race without changing runtime semantics. |
| DR009-MNT-009 | Verified | The schema accepts `executor.kind`, while both YAML workflows branch on `config.executor.type` and the live config stores `type`. A legacy normalizer plus one canonical stored field is the low-regression fix. |

Cumulative downgrade impact: none; verdict remains **CONDITIONAL**.
<!-- /ANCHOR:adversarial-spot-check -->

<!-- ANCHOR:remediation-plan -->
## 7. Remediation Plan

Reference map: [resource-map.md](./resource-map.md).

| Packet | Scope | Priority | Suggested Location |
|---|---|---|---|
| Remediate lifecycle correctness P1s | DR009-COR-001, DR009-COR-002, DR009-COR-003, DR009-COR-004, DR009-COR-005, DR009-COR-006, DR009-COR-007, DR009-COR-008, DR009-COR-009, DR009-COR-010, DR009-COR-013, DR009-COR-014, DR009-COR-015 | P1 (do-now) | `014-arc-009-review-remediation/001-lifecycle-correctness/` |
| Remediate local-service and executor security P1s | DR009-SEC-001, DR009-SEC-002, DR009-SEC-003, DR009-SEC-004, DR009-SEC-007, DR009-SEC-008, DR009-SEC-009, DR009-SEC-010, DR009-SEC-012, DR009-SEC-013, DR009-SEC-014, DR009-SEC-015, DR009-SEC-016 | P1 (do-now) | `014-arc-009-review-remediation/002-security-containment/` |
| Close traceability and release-evidence P1s | DR009-TRC-001, DR009-TRC-002, DR009-TRC-003, DR009-TRC-004, DR009-TRC-005, DR009-TRC-006, DR009-TRC-007, DR009-TRC-009, DR009-TRC-010, DR009-TRC-011 | P1 (do-now) | `014-arc-009-review-remediation/003-traceability-evidence/` |
| Stabilize mirrored contracts and public API P1s | DR009-MNT-001, DR009-MNT-002, DR009-MNT-003, DR009-MNT-009 | P1 (do-now) | `014-arc-009-review-remediation/004-contract-maintenance/` |
| Batch P2 advisories | DR009-COR-011, DR009-COR-012, DR009-COR-016, DR009-COR-017, DR009-SEC-005, DR009-SEC-006, DR009-SEC-011, DR009-SEC-017, DR009-TRC-008, DR009-TRC-012, DR009-MNT-004, DR009-MNT-005, DR009-MNT-006, DR009-MNT-007, DR009-MNT-008, DR009-MNT-010, DR009-MNT-011, DR009-MNT-012, DR009-MNT-013, DR009-MNT-014 | P2 (do-later) | `015-arc-009-review-advisories/` |
<!-- /ANCHOR:remediation-plan -->

<!-- ANCHOR:risks -->
## 8. Risks & Limitations

This review did not cover live workload measurement; phase 012 still needs the operator-runbook RSS benchmark. It did not run mk-spec-memory deep-loop stress tests beyond static reads. It did not perform cross-runtime parity testing beyond the scoped system-spec-kit, system-code-graph, mcp-coco-index, and system-rerank-sidecar surfaces. It deliberately excluded anything outside the arc 009 phases.

Risks of accepting the CONDITIONAL pass without P1 remediation:

- **DR009-COR-001:** Same-packet runners can both enter the critical section and corrupt deep-loop state.
- **DR009-COR-002:** Two launchers can both believe they own the DB and overwrite ownership evidence.
- **DR009-COR-003:** Processes can survive SIGTERM/SIGINT with cleanup run but resident handles still open.
- **DR009-COR-004:** A corrupt tail can prevent the next dispatch from recording recovery or failure state.
- **DR009-COR-005:** Cancelled indexes can be exposed as successfully initialized search state.
- **DR009-COR-006:** Operators can mistake telemetry failure for a clean process table.
- **DR009-COR-007:** A refresh can close resources while active indexing still uses them.
- **DR009-COR-008:** Embedding workers can remain resident while new workers are spawned.
- **DR009-COR-009:** A spawned sidecar can become healthy after fallback without ledger ownership.
- **DR009-COR-010:** Failed DB closes can be hidden behind a permanently closed flag.
- **DR009-COR-013:** A mismatched reqId/indexId pair can cancel the wrong active index.
- **DR009-COR-014:** Concurrent spawns can drop a live sidecar from lifecycle tracking.
- **DR009-COR-015:** A live server can stop refreshing its lease and then be reclaimed by another launcher.
- **DR009-SEC-001:** Configured rerank authentication silently fails open.
- **DR009-SEC-002:** Any local process can force expensive model loading.
- **DR009-SEC-003:** A competing localhost service can be mistaken for the spawned sidecar.
- **DR009-SEC-004:** Unique cancel/index identities can grow unbounded in memory.
- **DR009-SEC-007:** Daemon state can be created outside the workspace boundary.
- **DR009-SEC-008:** A single accepted rerank request can force excessive memory/model work.
- **DR009-SEC-009:** The helper can kill unrelated or other-workspace sidecars.
- **DR009-SEC-010:** A poisoned environment can redirect readiness/reindex to an arbitrary executable.
- **DR009-SEC-012:** Non-native executors inherit every parent environment secret.
- **DR009-SEC-013:** Project dotenv can inject Node runtime preload/options into launcher children.
- **DR009-SEC-014:** Corrupted stored metadata can become shell command text.
- **DR009-SEC-015:** Ownership tokens can leak into inventory, benchmark, or sweep artifacts.
- **DR009-SEC-016:** A forged ledger row can route callers to an attacker-controlled local service.
- **DR009-TRC-001:** The review workflow itself can bypass the supervised spawn contract claimed complete.
- **DR009-TRC-002:** The atomic lock race remains unproven by the completed phase evidence.
- **DR009-TRC-003:** Queued work may still close or start under remove without test coverage.
- **DR009-TRC-004:** Retention caps are proven only on synthetic helper maps.
- **DR009-TRC-005:** The arc can ship without the required resident-memory measurement.
- **DR009-TRC-006:** Heartbeat reclaim is tested, but the named parent-disconnect lifecycle is not.
- **DR009-TRC-007:** Public cancel transport can fail while helper-level cancellation passes.
- **DR009-TRC-009:** Parent-death cleanup is asserted by environment setup only.
- **DR009-TRC-010:** macOS can pass timeout cleanup even if the child remains alive.
- **DR009-TRC-011:** A conditionally required scan was available but did not complete.
- **DR009-MNT-001:** The two public ensure paths can keep drifting on ledger and ownership behavior.
- **DR009-MNT-002:** Lease fixes must be hand-copied across TS and CJS and can diverge again.
- **DR009-MNT-003:** A completion callback can update the wrong lifecycle row.
- **DR009-MNT-009:** Executor config parsing and audit rows can disagree about the active executor.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:appendix -->
## 9. Appendix — Full Finding Registry

- **DR009-COR-001 (P1) — Deep-loop lock can be double-acquired during concurrent startup.** Fingerprint: `correctness:deep-loop-lock:read-then-rename-double-acquire`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts:107`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts:149`. Suggested fix: Make acquisition exclusive and add real concurrent acquire coverage.
- **DR009-COR-002 (P1) — Code Graph owner lease can be double-acquired.** Fingerprint: `correctness:code-graph-owner-lease:read-then-rename-double-acquire`. Files: `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:97`, `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:208`, `.opencode/bin/mk-code-index-launcher.cjs:209`, `.opencode/bin/mk-code-index-launcher.cjs:267`. Suggested fix: Make lease acquisition exclusive in both implementations and add parity coverage.
- **DR009-COR-003 (P1) — Runtime signal hooks run cleanup but do not terminate the process.** Fingerprint: `correctness:shutdown-hooks:signals-run-hooks-without-exit`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts:119`. Suggested fix: Make signal-triggered shutdown terminal after cleanup settles.
- **DR009-COR-004 (P1) — Pre-dispatch audit reads can crash on the corrupt JSONL tail they added.** Fingerprint: `correctness:deep-loop-jsonl:pre-dispatch-audit-crashes-on-corrupt-tail`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:330`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:370`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:404`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts:64`. Suggested fix: Repair or skip corrupt JSONL tails before pre-dispatch state-log reads.
- **DR009-COR-005 (P1) — Cancelled CocoIndex updates still sync FTS and mark initial indexing done.** Fingerprint: `correctness:cocoindex-project-update:cancelled-index-marked-initial-done`. Files: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:61`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:491`. Suggested fix: Run FTS sync and mark initial indexing done only after normal completion.
- **DR009-COR-006 (P1) — Process inventory failures are reported as an empty clean inventory.** Fingerprint: `correctness:process-memory-harness:ps-failure-reported-as-empty-inventory`. Files: `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:181`, `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:517`, `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:526`. Suggested fix: Propagate ps failures as blocked/degraded inventory, not empty inventory.
- **DR009-COR-007 (P1) — Config refresh can close a project while indexing is active.** Fingerprint: `correctness:cocoindex-project-refresh:closes-project-during-active-index`. Files: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:452`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:460`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:491`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:773`. Suggested fix: Route refresh through active-work drain or the per-project index lock.
- **DR009-COR-008 (P1) — Embedder sidecar timeout cleanup can detach a live child.** Fingerprint: `correctness:embedder-sidecar-client:sigterm-without-exit-wait-leaks-worker`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:327`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:337`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:372`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:457`. Suggested fix: Wait for child exit with escalation before dropping listeners and references.
- **DR009-COR-009 (P1) — Rerank sidecar warmup timeout can leave an unledgered process.** Fingerprint: `correctness:rerank-sidecar:warmup-timeout-no-wait-or-ledger-cleanup`. Files: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:192`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:195`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`. Suggested fix: Wait for exit, escalate if needed, and ledger any process that survives.
- **DR009-COR-010 (P1) — Project.close() marks resources closed before close succeeds.** Fingerprint: `correctness:cocoindex-project-close:marks-closed-before-db-close-succeeds`. Files: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:38`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:42`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:44`. Suggested fix: Set closed only after successful close and keep failures retryable/visible.
- **DR009-COR-011 (P2) — BoundedMap can exceed maxSize when the oldest key is undefined.** Fingerprint: `correctness:bounded-map:undefined-key-blocks-eviction`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:51`, `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:57`, `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:58`. Suggested fix: Use iterator done state instead of undefined key sentinel.
- **DR009-COR-012 (P2) — Task-registry shutdown mutates completed history back to cancelling.** Fingerprint: `correctness:cocoindex-daemon-task-registry:shutdown-mutates-completed-history`. Files: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:100`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:107`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:151`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:189`. Suggested fix: Skip completed-history rows when cancelling live tasks.
- **DR009-COR-013 (P1) — Mismatched cancel identities can cancel the wrong index.** Fingerprint: `correctness:cocoindex-cancel:mismatched-dual-identity-matches-any`. Files: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/cancel_protocol.py:33`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:77`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:421`. Suggested fix: Require dual identities to match the same row; keep OR only for single-identity requests.
- **DR009-COR-014 (P1) — Concurrent sidecar spawns can lose ledger rows.** Fingerprint: `correctness:rerank-sidecar-ledger:read-append-replace-loses-concurrent-row`. Files: `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:157`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`. Suggested fix: Serialize ledger writes or use per-PID rows with merge/retry.
- **DR009-COR-015 (P1) — Child heartbeat silently fails after lease transfer misses.** Fingerprint: `correctness:code-graph-owner-lease:child-heartbeat-ignores-refresh-false`. Files: `.opencode/skills/system-code-graph/mcp_server/index.ts:41`, `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:247`, `.opencode/bin/mk-code-index-launcher.cjs:525`. Suggested fix: Check refreshOwnerLease results and repair, fail health, or exit on missed transfers.
- **DR009-COR-016 (P2) — Relationship queries reject the documented file-path subject.** Fingerprint: `correctness:code-graph-query:relationship-file-path-subject-unresolved`. Files: `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:52`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:347`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1387`. Suggested fix: Resolve file-path subjects for supported relationship operations or narrow the public schema.
- **DR009-COR-017 (P2) — Audit rotation can overwrite a prior rotation in the same millisecond.** Fingerprint: `correctness:audit-rotation:timestamp-suffix-can-overwrite-rotation`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts:32`. Suggested fix: Use collision-resistant rotated filenames with exclusive-create retry.
- **DR009-SEC-001 (P1) — Configured rerank API keys are dropped before uvicorn starts.** Fingerprint: `security:rerank-sidecar:start-drops-api-key`. Files: `.opencode/skills/system-rerank-sidecar/scripts/start.sh:28`, `.opencode/skills/system-rerank-sidecar/scripts/start.sh:38`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:87`. Suggested fix: Pass RERANK_API_KEY through the scrubbed env and test unauthenticated /rerank denial.
- **DR009-SEC-002 (P1) — Warmup endpoint bypasses rerank auth and rate limiting.** Fingerprint: `security:rerank-sidecar:warmup-unauthenticated-model-load`. Files: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:209`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:224`. Suggested fix: Apply the same auth dependency and rate limit used by /rerank.
- **DR009-SEC-003 (P1) — Sidecar spawn accepts any localhost health response as ownership proof.** Fingerprint: `security:rerank-sidecar:spawn-health-port-race`. Files: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:172`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:192`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`. Suggested fix: Verify owner token/config hash and child liveness before ledgering success.
- **DR009-SEC-004 (P1) — Cancel stale-identity sets grow without a retention cap.** Fingerprint: `security:cocoindex-active-work:unbounded-stale-cancel-identities`. Files: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:44`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:47`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:213`. Suggested fix: Store stale identities in bounded LRU/TTL structures.
- **DR009-SEC-005 (P2) — Optional rerank logging writes raw query text without rotation or redaction.** Fingerprint: `security:rerank-sidecar:raw-query-log-retention`. Files: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:46`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:251`. Suggested fix: Redact query text by default and add rotation/caps for raw debug logging.
- **DR009-SEC-006 (P2) — Extra allowlisted models can execute local remote-code without revision pins.** Fingerprint: `security:rerank-sidecar:trust-remote-code-unpinned-extra-models`. Files: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:120`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:125`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:140`. Suggested fix: Require revisions for remote-code models or disable trust_remote_code by default.
- **DR009-SEC-007 (P1) — Code Graph DB override is not constrained to the workspace.** Fingerprint: `security:code-graph-db-dir:workspace-guard-missing`. Files: `.opencode/bin/mk-code-index-launcher.cjs:159`, `.opencode/skills/system-code-graph/mcp_server/core/config.ts:12`, `.opencode/skills/system-code-graph/INSTALL_GUIDE.md:214`. Suggested fix: Realpath and reject SPECKIT_CODE_GRAPH_DB_DIR outside the workspace before mkdir/spawn.
- **DR009-SEC-008 (P1) — Rerank requests cap item count but not document bytes.** Fingerprint: `security:rerank-sidecar:unbounded-document-payload`. Files: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:155`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:157`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:242`. Suggested fix: Add per-document, total-character, and body-size limits.
- **DR009-SEC-009 (P1) — Model switcher kills sidecars by command substring.** Fingerprint: `security:rerank-sidecar:use-model-broad-pkill`. Files: `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:139`, `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:140`, `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:145`. Suggested fix: Replace broad pkill with ledger-backed exact-PID/process-group shutdown.
- **DR009-SEC-010 (P1) — Code Graph executes COCOINDEX_BIN_PATH without containment.** Fingerprint: `security:code-graph-ccc-bin:env-path-exec-without-containment`. Files: `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:146`, `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:157`, `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:22`, `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:41`. Suggested fix: Contain COCOINDEX_BIN_PATH to the expected workspace venv unless explicitly unsafe.
- **DR009-SEC-011 (P2) — Sidecar startup sources dotenv files as shell code.** Fingerprint: `security:rerank-sidecar:env-file-shell-source-before-scrub`. Files: `.opencode/skills/system-rerank-sidecar/scripts/start.sh:14`, `.opencode/skills/system-rerank-sidecar/scripts/start.sh:15`, `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:123`. Suggested fix: Parse dotenv files as data and validate generated fields before startup.
- **DR009-SEC-012 (P1) — Deep-loop external executors inherit the full parent environment.** Fingerprint: `security:deep-loop-executor:parent-env-secret-leak`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:275`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:454`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:546`. Suggested fix: Build executor-specific env allowlists and drop unrelated secrets.
- **DR009-SEC-013 (P1) — Code Graph launcher lets project dotenv inject Node runtime options.** Fingerprint: `security:code-graph-launcher:dotenv-node-options-injection`. Files: `.opencode/bin/mk-code-index-launcher.cjs:57`, `.opencode/bin/mk-code-index-launcher.cjs:378`, `.opencode/bin/mk-code-index-launcher.cjs:519`. Suggested fix: Allowlist Code Graph config keys and strip Node execution-control variables before spawn.
- **DR009-SEC-014 (P1) — Stored Code Graph metadata is interpolated into a shell command.** Fingerprint: `security:code-graph-ensure-ready:git-diff-shell-interpolation`. Files: `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:107`, `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:109`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:370`. Suggested fix: Validate refs and use execFileSync with argument arrays.
- **DR009-SEC-015 (P1) — Process inventory emits raw owner tokens in command lines.** Fingerprint: `security:process-memory-harness:owner-token-command-leak`. Files: `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:143`, `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:181`, `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:570`, `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:106`. Suggested fix: Redact owner tokens and common secret argv/env fragments before storing or printing command lines.
- **DR009-SEC-016 (P1) — Rerank reusable-sidecar ownership token is predictable.** Fingerprint: `security:rerank-sidecar:predictable-ledger-owner-token`. Files: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:86`, `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:177`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:158`. Suggested fix: Use a random state-dir token and require unguessable health/ledger owner proof.
- **DR009-SEC-017 (P2) — IPC bridge unlinks any existing daemon-ipc.sock path.** Fingerprint: `security:code-graph-ipc:unlink-existing-socket-path`. Files: `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:58`, `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:146`, `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:153`. Suggested fix: Constrain socket dir and unlink only owned socket files with expected permissions.
- **DR009-TRC-001 (P1) — CLI dispatch branches bypass the supervised executor contract.** Fingerprint: `traceability:cli-dispatch:deep-review-branches-bypass-supervisor`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards/spec.md:119`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:704`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:704`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:444`. Suggested fix: Route CLI executor branches through the audited supervisor or narrow the phase requirement.
- **DR009-TRC-002 (P1) — Concurrent lock coverage is only sequential single-process coverage.** Fingerprint: `traceability:deep-loop-lock:concurrent-fixture-is-sequential`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/spec.md:126`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/tasks.md:98`, `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts:63`, `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts:111`. Suggested fix: Add true multi-worker/child-process concurrent acquisition coverage.
- **DR009-TRC-003 (P1) — Queued CocoIndex index work has no remove-project fixture.** Fingerprint: `traceability:cocoindex-remove:queued-index-work-untested`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:118`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/tasks.md:107`, `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:37`, `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:119`. Suggested fix: Add a queued-index remove fixture with worker occupancy and explicit drain/cancel assertions.
- **DR009-TRC-004 (P1) — Runtime retention stress coverage uses synthetic maps only.** Fingerprint: `traceability:spec-memory-runtime:sc001-synthetic-workload-only`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:133`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/tasks.md:95`, `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:29`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:134`. Suggested fix: Drive actual runtime handlers/queues under load and assert caps through observable state.
- **DR009-TRC-005 (P1) — Adapter RSS benchmark closes without required slope numbers.** Fingerprint: `traceability:adapter-rss-benchmark:required-numbers-deferred`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:122`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:128`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/implementation-summary.md:105`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/tasks.md:93`. Suggested fix: Record operator-run slope numbers or make deferral an explicit terminal state.
- **DR009-TRC-006 (P1) — SC-003 reconnect success is modeled, not manually verified.** Fingerprint: `traceability:owner-lease:sc003-parent-disconnect-not-verified`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/spec.md:153`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:146`, `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:265`. Suggested fix: Add a temp-DB reconnect harness and record repeated reconnect output.
- **DR009-TRC-007 (P1) — Client-facing index_cancel transport is not covered.** Fingerprint: `traceability:cocoindex-cancel:index-cancel-client-transport-untested`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:124`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/tasks.md:108`, `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_cancel_protocol.py:27`, `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:111`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:206`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:421`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:1173`. Suggested fix: Add protocol-level tests through daemon and MCP/server paths.
- **DR009-TRC-008 (P2) — Phase 007 is complete while every task checkbox is open.** Fingerprint: `traceability:code-graph-phase007:unchecked-tasks-after-completion`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/spec.md:45`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/tasks.md:56`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/tasks.md:89`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md:45`. Suggested fix: Check off tasks with evidence or reopen the phase status.
- **DR009-TRC-009 (P1) — Parent-death polling is asserted by env only.** Fingerprint: `traceability:embedder-sidecar:parent-death-polling-untested`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:125`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:63`, `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts:66`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:87`. Suggested fix: Test worker exit after a parent liveness failure with injected or real parent death.
- **DR009-TRC-010 (P1) — Timeout-kill fixture is a false positive on macOS.** Fingerprint: `traceability:embedder-sidecar:timeout-fixture-procfs-false-positive`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:135`, `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts:92`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:371`. Suggested fix: Use cross-platform liveness/exit-event assertions instead of /proc-only checks.
- **DR009-TRC-011 (P1) — Phase 010 closed with an available memory scan uncompleted.** Fingerprint: `traceability:phase010:memory-index-scan-available-not-completed`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/spec.md:140`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/tasks.md:97`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/implementation-summary.md:190`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/implementation-summary.md:205`. Suggested fix: Run and record a successful scan or amend the acceptance state with owner/follow-up.
- **DR009-TRC-012 (P2) — Phase 011 evidence uses stale phase identifiers.** Fingerprint: `traceability:code-graph-phase011:stale-phase-identifiers`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/tasks.md:96`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/implementation-summary.md:104`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/implementation-summary.md:183`. Suggested fix: Normalize stale phase identifiers to 011 and refresh metadata if derived text changed.
- **DR009-MNT-001 (P1) — Rerank sidecar ensure helpers have incompatible ownership contracts.** Fingerprint: `maintainability:rerank-sidecar:ensure-helper-contract-drift`. Files: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`, `.opencode/bin/lib/ensure-rerank-sidecar.cjs`. Suggested fix: Unify ownership semantics or add cross-runtime parity fixtures.
- **DR009-MNT-002 (P1) — Code Graph owner lease protocol is hand-copied in TS and CJS.** Fingerprint: `maintainability:code-graph-owner-lease:mirrored-ts-cjs-protocol`. Files: `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`, `.opencode/bin/mk-code-index-launcher.cjs`. Suggested fix: Move lease protocol to a shared bootstrap-safe contract or add golden parity tests.
- **DR009-MNT-003 (P1) — Daemon task registry silently overwrites duplicate task IDs.** Fingerprint: `maintainability:cocoindex-daemon-task-registry:silent-task-id-overwrite`. Files: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py`. Suggested fix: Reject duplicate live task IDs or use opaque registration handles for callbacks.
- **DR009-MNT-004 (P2) — ActiveWorkRegistry's retain_stale flag reads backwards.** Fingerprint: `maintainability:cocoindex-active-work:retain-stale-flag-inverted`. Files: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:104`. Suggested fix: Rename retain_stale or document the completed-row versus stale-identity distinction.
- **DR009-MNT-005 (P2) — Lifecycle READMEs omit the arc 009 helper surfaces.** Fingerprint: `maintainability:lifecycle-docs:readmes-omit-arc009-surfaces`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/README.md:37`, `.opencode/skills/system-code-graph/mcp_server/lib/README.md:81`, `.opencode/skills/system-spec-kit/scripts/ops/README.md:59`, `.opencode/skills/system-spec-kit/scripts/ops/README.md:70`. Suggested fix: Update local READMEs with arc 009 lifecycle modules and real verifier paths.
- **DR009-MNT-006 (P2) — TtlMap.has() treats stored undefined as missing.** Fingerprint: `maintainability:memory-ttl-map:has-treats-undefined-as-missing`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:85`, `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:99`, `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:103`. Suggested fix: Implement TtlMap.has through internal entry/expiry lookup or constrain value type.
- **DR009-MNT-007 (P2) — process-sweep apply --confirmed is still a dry-run command.** Fingerprint: `maintainability:process-sweep:apply-command-is-dry-run`. Files: `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:126`, `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:151`. Suggested fix: Rename dry-run apply or make unsupported live apply fail clearly.
- **DR009-MNT-008 (P2) — Phase 013 summary points at the wrong phase number.** Fingerprint: `maintainability:owner-lease-summary:phase-number-drift`. Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:55`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:153`. Suggested fix: Correct phase number and suggested commit prefix to 013.
- **DR009-MNT-009 (P1) — Deep-review executor config still has type/kind schema drift.** Fingerprint: `maintainability:deep-review-executor-config:type-kind-schema-drift`. Files: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:656`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:697`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:937`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:657`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:863`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/review/deep-review-config.json:14`. Suggested fix: Canonicalize on executor.kind, normalize legacy type, and align audit rows/tests.
- **DR009-MNT-010 (P2) — Code Graph lifecycle helpers bypass the documented library barrel.** Fingerprint: `maintainability:code-graph-lib-barrel:lifecycle-helpers-not-exported`. Files: `.opencode/skills/system-code-graph/mcp_server/lib/index.ts:4`, `.opencode/skills/system-code-graph/mcp_server/index.ts:21`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:10`, `.opencode/skills/system-code-graph/mcp_server/lib/README.md:247`. Suggested fix: Export lifecycle helpers or explicitly mark the deep-import boundary internal.
- **DR009-MNT-011 (P2) — CocoIndex lifecycle package omits shipped helper entrypoints.** Fingerprint: `maintainability:cocoindex-lifecycle-barrel:missing-helper-entrypoints`. Files: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/__init__.py:3`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/__init__.py:12`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:75`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:35`. Suggested fix: Export shipped lifecycle helpers or document submodule-only access.
- **DR009-MNT-012 (P2) — Adapter RSS benchmark scripts duplicate the same measurement core.** Fingerprint: `maintainability:adapter-rss-benchmarks:duplicated-stats-and-snapshot-code`. Files: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py:41`, `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py:95`, `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_sidecar_5xx_fallback_rss.py:32`, `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_sidecar_5xx_fallback_rss.py:85`. Suggested fix: Extract shared snapshot/statistics/output helpers into benchmark_utils.py.
- **DR009-MNT-013 (P2) — Phase 012 benchmark docs still point at arc 010 phase 002.** Fingerprint: `maintainability:adapter-rss-benchmark:stale-arc010-identifiers`. Files: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/methodology.md:3`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:60`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/plan.md:162`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/implementation-summary.md:128`. Suggested fix: Normalize benchmark docs, plan, spec, and commit text to 009/012.
- **DR009-MNT-014 (P2) — Ops README validation command references a stale verifier path.** Fingerprint: `maintainability:ops-readme:stale-alignment-verifier-path`. Files: `.opencode/skills/system-spec-kit/scripts/ops/README.md:63`, `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:1`. Suggested fix: Update the verifier path to sk-code/assets/scripts/verify_alignment_drift.py.
<!-- /ANCHOR:appendix -->

## Commit Handoff

Changed files under `review/`:
- `deep-review-config.json`
- `deep-review-dashboard.md`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-strategy.md`
- `deltas/iter-001.jsonl`
- `deltas/iter-002.jsonl`
- `deltas/iter-003.jsonl`
- `deltas/iter-004.jsonl`
- `deltas/iter-005.jsonl`
- `deltas/iter-006.jsonl`
- `deltas/iter-007.jsonl`
- `deltas/iter-008.jsonl`
- `deltas/iter-009.jsonl`
- `deltas/iter-010.jsonl`
- `iterations/iteration-001.md`
- `iterations/iteration-002.md`
- `iterations/iteration-003.md`
- `iterations/iteration-004.md`
- `iterations/iteration-005.md`
- `iterations/iteration-006.md`
- `iterations/iteration-007.md`
- `iterations/iteration-008.md`
- `iterations/iteration-009.md`
- `iterations/iteration-010.md`
- `resource-map.md`
- `review-report.md`

Suggested commit: `review(009): deep-review 10-iter — CONDITIONAL (P0=0 P1=40 P2=20)`
