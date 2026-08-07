# Phase 014 Batch Plan

Source registry: `../review/deep-review-findings-registry.json`

Execution policy: run batches sequentially B1-B6. Each implementation dispatch must read this phase's `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, the review registry, and the relevant source files before editing. Do not modify review artifacts.

## Batch Summary

| Batch | Theme | Findings | P1 | P2 |
|-------|-------|----------|----|----|
| B1 | Lease/ledger race correctness | 6 | 6 | 0 |
| B2 | Cleanup correctness | 8 | 7 | 1 |
| B3 | Sidecar + executor security | 18 | 14 | 4 |
| B4 | Audit/JSONL corruption + data integrity | 5 | 3 | 2 |
| B5 | Test fixture validity restoration | 10 | 10 | 0 |
| B6 | Doc drift + maintainability cleanup | 13 | 0 | 13 |
| **Total** |  | **60** | **40** | **20** |

---

## B1: Lease/Ledger Race Correctness

**Finding IDs**: DR009-COR-001, DR009-COR-002, DR009-COR-013, DR009-COR-014, DR009-COR-015, DR009-MNT-002

**Files to change from registry**:
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts:107`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts:149`
- `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:97`
- `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:208`
- `.opencode/bin/mk-code-index-launcher.cjs:209`
- `.opencode/bin/mk-code-index-launcher.cjs:267`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/cancel_protocol.py:33`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:77`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:421`
- `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:157`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`
- `.opencode/skills/system-code-graph/mcp_server/index.ts:41`
- `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:247`
- `.opencode/bin/mk-code-index-launcher.cjs:525`

**Suggested cli-codex prompt skeleton**:

```text
Implement phase 014 batch B1 only. Read phase 014 docs plus the review registry/resource map. Fix DR009-COR-001, DR009-COR-002, DR009-COR-013, DR009-COR-014, DR009-COR-015, and DR009-MNT-002. Keep edits scoped to lease/ledger/cancel/heartbeat race correctness. Prefer shared helper or parity tests for mirrored TS/CJS owner lease behavior. Update phase 014 checklist evidence for these findings. Do not modify review artifacts or commit.
```

**Tests to run**:
- Targeted deep-loop lock Vitest covering true concurrent acquisition.
- Targeted Code Graph owner-lease/launcher Vitest.
- Targeted CocoIndex cancel protocol pytest.
- Targeted rerank sidecar ledger concurrency pytest.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-014> --strict`

---

## B2: Cleanup Correctness

**Finding IDs**: DR009-COR-003, DR009-COR-005, DR009-COR-007, DR009-COR-008, DR009-COR-009, DR009-COR-010, DR009-COR-012, DR009-MNT-003

**Files to change from registry**:
- `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts:119`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:61`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:491`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:452`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:460`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:773`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:327`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:337`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:372`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:457`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:192`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:195`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:38`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:42`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:44`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:100`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:107`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:151`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:189`

**Suggested cli-codex prompt skeleton**:

```text
Implement phase 014 batch B2 only. Fix cleanup correctness findings DR009-COR-003, DR009-COR-005, DR009-COR-007, DR009-COR-008, DR009-COR-009, DR009-COR-010, DR009-COR-012, and DR009-MNT-003. Ensure cleanup paths wait for real close/exit or report degraded/blocked state before mutating success flags. Update phase 014 checklist evidence. Do not touch unrelated review artifacts or commit.
```

**Tests to run**:
- Runtime shutdown hook Vitest.
- Embedder sidecar hardening Vitest.
- CocoIndex lifecycle pytest for update, close, refresh, registry cancellation.
- Rerank sidecar warmup timeout test.
- Phase 014 strict validation.

---

## B3: Sidecar + Executor Security

**Finding IDs**: DR009-SEC-001, DR009-SEC-002, DR009-SEC-003, DR009-SEC-004, DR009-SEC-005, DR009-SEC-006, DR009-SEC-007, DR009-SEC-008, DR009-SEC-009, DR009-SEC-010, DR009-SEC-011, DR009-SEC-012, DR009-SEC-013, DR009-SEC-014, DR009-SEC-015, DR009-SEC-016, DR009-SEC-017, DR009-MNT-001

**Files to change from registry**:
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh:14`
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh:15`
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh:28`
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh:38`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:46`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:87`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:120`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:125`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:140`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:155`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:157`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:209`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:224`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:242`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:251`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:86`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:158`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:172`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:192`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`
- `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:177`
- `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:123`
- `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:139`
- `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:140`
- `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:145`
- `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:44`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:47`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:213`
- `.opencode/bin/mk-code-index-launcher.cjs:57`
- `.opencode/bin/mk-code-index-launcher.cjs:159`
- `.opencode/bin/mk-code-index-launcher.cjs:378`
- `.opencode/bin/mk-code-index-launcher.cjs:519`
- `.opencode/skills/system-code-graph/mcp_server/core/config.ts:12`
- `.opencode/skills/system-code-graph/INSTALL_GUIDE.md:214`
- `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:146`
- `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:157`
- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:22`
- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:41`
- `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:107`
- `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:109`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:370`
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:58`
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:146`
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:153`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:275`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:454`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:546`
- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:143`
- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:181`
- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:570`
- `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:106`

**Suggested cli-codex prompt skeleton**:

```text
Implement phase 014 batch B3 only. Close the sidecar/executor security findings DR009-SEC-001 through DR009-SEC-017 plus DR009-MNT-001. Focus on API-key propagation, warmup auth, payload limits, owner-token entropy/redaction, env allowlists, dotenv parsing, binary/path containment, shell command removal, and socket unlink ownership. Update phase 014 checklist evidence. Do not modify review artifacts or commit.
```

**Tests to run**:
- Rerank sidecar auth/start/payload/ledger tests.
- Code Graph launcher/readiness/reindex/IPС targeted tests.
- Deep-loop executor env tests.
- Process harness/sweep redaction tests.
- CocoIndex active-work retention pytest.
- Phase 014 strict validation.

---

## B4: Audit/JSONL Corruption + Data Integrity

**Finding IDs**: DR009-COR-004, DR009-COR-006, DR009-COR-016, DR009-COR-017, DR009-MNT-009

**Files to change from registry**:
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:330`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:370`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:404`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts:64`
- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:181`
- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:517`
- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:526`
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:52`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:347`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1387`
- `.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts:32`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:656`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:697`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:937`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:657`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:863`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/review/deep-review-config.json:14`

**Suggested cli-codex prompt skeleton**:

```text
Implement phase 014 batch B4 only. Close audit/data-integrity findings DR009-COR-004, DR009-COR-006, DR009-COR-016, DR009-COR-017, and DR009-MNT-009. Repair corrupt JSONL tail handling, inventory degradation status, relationship query subject acceptance, audit rotation uniqueness, and executor config schema drift. Update phase 014 checklist evidence. Do not modify review artifacts unless the task is explicitly to preserve immutable provenance; prefer runtime/config docs outside review artifacts.
```

**Tests to run**:
- Deep-loop executor audit JSONL repair tests.
- Process memory harness degraded inventory tests.
- Code Graph relationship query schema/handler tests.
- Spec Memory audit rotation tests.
- Deep-review config parser/YAML compatibility tests.
- Phase 014 strict validation.

---

## B5: Test Fixture Validity Restoration

**Finding IDs**: DR009-TRC-001, DR009-TRC-002, DR009-TRC-003, DR009-TRC-004, DR009-TRC-005, DR009-TRC-006, DR009-TRC-007, DR009-TRC-009, DR009-TRC-010, DR009-TRC-011

**Files to change from registry**:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards/spec.md:119`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:704`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:704`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:444`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/spec.md:126`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/tasks.md:98`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts:63`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts:111`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:118`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/tasks.md:107`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:37`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:119`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:133`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/tasks.md:95`
- `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:29`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:134`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:122`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:128`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/implementation-summary.md:105`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/tasks.md:93`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/spec.md:153`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:146`
- `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:265`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:124`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/tasks.md:108`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_cancel_protocol.py:27`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:111`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:206`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:421`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:1173`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:125`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:63`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts:66`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:87`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:135`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts:92`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:371`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/spec.md:140`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/tasks.md:97`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/implementation-summary.md:190`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/implementation-summary.md:205`

**Suggested cli-codex prompt skeleton**:

```text
Implement phase 014 batch B5 only. Close traceability findings DR009-TRC-001, DR009-TRC-002, DR009-TRC-003, DR009-TRC-004, DR009-TRC-005, DR009-TRC-006, DR009-TRC-007, DR009-TRC-009, DR009-TRC-010, and DR009-TRC-011. Replace narrow evidence with the public/concurrent/measured evidence the original phase specs required. Update affected phase docs only as needed for evidence reconciliation, and update phase 014 checklist. Do not modify review artifacts or commit.
```

**Tests to run**:
- Deep-review supervised dispatch coverage.
- True concurrent deep-loop lock test.
- CocoIndex queued remove and public `index_cancel` transport pytest.
- Integrated Spec Memory retention workload.
- Adapter RSS benchmark command producing slope numbers.
- Code Graph reconnect/lease validation.
- Embedder parent-death and timeout-kill liveness fixtures.
- Strict validation for phase 014 and touched phase docs.

---

## B6: Doc Drift + Maintainability Cleanup

**Finding IDs**: DR009-COR-011, DR009-TRC-008, DR009-TRC-012, DR009-MNT-004, DR009-MNT-005, DR009-MNT-006, DR009-MNT-007, DR009-MNT-008, DR009-MNT-010, DR009-MNT-011, DR009-MNT-012, DR009-MNT-013, DR009-MNT-014

**Files to change from registry**:
- `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:51`
- `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:57`
- `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:58`
- `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:85`
- `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:99`
- `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:103`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/spec.md:45`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/tasks.md:56`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/tasks.md:89`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md:45`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/tasks.md:96`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/implementation-summary.md:104`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/implementation-summary.md:183`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:104`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/README.md:37`
- `.opencode/skills/system-code-graph/mcp_server/lib/README.md:81`
- `.opencode/skills/system-code-graph/mcp_server/lib/README.md:247`
- `.opencode/skills/system-spec-kit/scripts/ops/README.md:59`
- `.opencode/skills/system-spec-kit/scripts/ops/README.md:63`
- `.opencode/skills/system-spec-kit/scripts/ops/README.md:70`
- `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:126`
- `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:151`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:55`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:153`
- `.opencode/skills/system-code-graph/mcp_server/lib/index.ts:4`
- `.opencode/skills/system-code-graph/mcp_server/index.ts:21`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:10`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/__init__.py:3`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/__init__.py:12`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:75`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:35`
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py:41`
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py:95`
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_sidecar_5xx_fallback_rss.py:32`
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_sidecar_5xx_fallback_rss.py:85`
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/methodology.md:3`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:60`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/plan.md:162`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/implementation-summary.md:128`
- `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:1`

**Suggested cli-codex prompt skeleton**:

```text
Implement phase 014 batch B6 only. Close or explicitly defer P2 findings DR009-COR-011, DR009-TRC-008, DR009-TRC-012, and DR009-MNT-004 through DR009-MNT-014. Keep changes narrowly scoped to low-risk correctness edge cases, package exports, README/doc drift, benchmark helper duplication, and phase evidence reconciliation. Update phase 014 checklist with closed/deferred status and rationale. Do not modify review artifacts or commit.
```

**Tests to run**:
- Bounded cache Vitest.
- CocoIndex lifecycle package/import pytest.
- Code Graph barrel/import tests.
- Benchmark helper smoke tests where practical.
- Strict validation for any touched phase docs and phase 014.
- Alignment drift command if docs under `.opencode/skills/` change.

## B1 Commit Handoff

Suggested commit: `fix(014/B1): lease/ledger race correctness — DR009-COR-001/002/013/014/015 + DR009-MNT-002`

Findings closed: DR009-COR-001, DR009-COR-002, DR009-COR-013, DR009-COR-014, DR009-COR-015, DR009-MNT-002.

Changed/new files:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-code-index-launcher.cjs`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/cancel_protocol.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_cancel_protocol.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md`

Verification:
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/loop-lock.vitest.ts --config mcp_server/vitest.config.ts 2>&1 | tail -10` -> 1 file, 7 tests passed.
- `cd .opencode/skills/system-code-graph && node node_modules/vitest/vitest.mjs run mcp_server/tests/lib/owner-lease.vitest.ts mcp_server/tests/launcher-lease.vitest.ts --config vitest.config.ts 2>&1 | tail -10` -> 2 files, 24 tests passed.
- `cd .opencode/skills/mcp-coco-index && python3 -m pytest mcp_server/tests/lifecycle/test_cancel_protocol.py -v 2>&1 | tail -10` -> 7 tests passed.
- `cd .opencode/skills/system-rerank-sidecar && python3 -m pytest tests/test_sidecar_ledger.py -v 2>&1 | tail -10` -> 11 tests passed.
- `cd .opencode/skills/system-code-graph && npm run typecheck` -> passed.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening --strict` -> passed with 0 errors, 0 warnings.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-code-graph` -> passed with non-blocking pre-existing warnings.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/tests/deep-loop` -> passed.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle` -> passed with non-blocking pre-existing warnings.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar/scripts` -> passed.

Broader regression notes:
- `system-spec-kit` deep-loop directory regression is blocked by the current worktree move from `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/*` to `.opencode/skills/deep-loop-runtime/lib/deep-loop/*`; unrelated imports still point at deleted old paths.
- `mcp-coco-index` lifecycle directory regression is blocked by sibling tests missing the same local `mcp_server` import path setup that B1 added only to `test_cancel_protocol.py`.
- `system-rerank-sidecar` full test directory is blocked by missing local dependency `httpx`; the touched ledger test passes.

## B2 Commit Handoff

Suggested commit: `fix(014/B2): cleanup correctness — DR009-COR-003/005/007/008/009/010/012 + DR009-MNT-003`

Findings closed: DR009-COR-003, DR009-COR-005, DR009-COR-007, DR009-COR-008, DR009-COR-009, DR009-COR-010, DR009-COR-012, DR009-MNT-003.

Changed/new files:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/lib/runtime/shutdown-hooks.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_active_work_registry.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md`

Verification:
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/lib/runtime/shutdown-hooks.vitest.ts --config mcp_server/vitest.config.ts 2>&1 | tail -10` -> 1 file, 4 tests passed.
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts 2>&1 | tail -10` -> 2 files, 7 tests passed.
- `cd .opencode/skills/mcp-coco-index && python3 -m pytest mcp_server/tests/lifecycle/ -v 2>&1 | tail -15` -> 22 tests passed.
- `cd .opencode/skills/system-rerank-sidecar && python3 -m pytest tests/test_sidecar_ledger.py -v 2>&1 | tail -10` -> 12 tests passed.
- `cd .opencode/skills/system-spec-kit && npm run typecheck -- --pretty false` -> passed.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening --strict` -> passed with 0 errors, 0 warnings.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/lib/runtime` -> passed.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/lib/embedders` -> passed.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar/scripts` -> passed.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/tests/lib/runtime` -> passed.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/tests/embedders` -> passed.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code` -> passed with non-blocking pre-existing Python shebang/docstring warnings.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle` -> passed with non-blocking Python shebang/docstring warnings.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar/tests` -> passed with non-blocking Python shebang/docstring warnings.

## B3 Commit Handoff

Suggested commit: `fix(014/B3): sidecar + executor security hardening — DR009-SEC-001-017 + DR009-MNT-001`

Findings closed: DR009-SEC-001, DR009-SEC-002, DR009-SEC-003, DR009-SEC-004, DR009-SEC-005, DR009-SEC-006, DR009-SEC-007, DR009-SEC-008, DR009-SEC-009, DR009-SEC-010, DR009-SEC-011, DR009-SEC-012, DR009-SEC-013, DR009-SEC-014, DR009-SEC-015, DR009-SEC-016, DR009-SEC-017, DR009-MNT-001.

Changed/new files:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/start.sh`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/use-model.sh`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/lib/ensure-rerank-sidecar.cjs`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_active_work_registry.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/core/config.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/canonical-db-dir.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/shared/cocoindex-path.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/lib/canonical-db-dir.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-code-index-launcher.cjs`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md`

Verification:
- `cd .opencode/skills/system-rerank-sidecar && python3 -m pytest tests/ -v 2>&1 | tail -40` -> blocked during collection by system Python missing `httpx`.
- `cd .opencode/skills/system-rerank-sidecar && .venv/bin/python -m pytest tests/test_sidecar_ledger.py tests/test_rerank_sidecar.py::test_warmup_requires_auth_before_model_load tests/test_rerank_sidecar.py::test_rerank_rejects_oversized_document_payload tests/test_rerank_sidecar.py::test_rerank_log_redacts_query_by_default tests/test_rerank_sidecar.py::test_extra_allowlisted_model_requires_commit_revision -v 2>&1 | tail -80` -> 21 tests passed.
- `cd .opencode/skills/system-rerank-sidecar && bash -n scripts/start.sh && bash -n scripts/use-model.sh && PYTHONPYCACHEPREFIX=/tmp/pycache-b3 python3 -m py_compile scripts/rerank_sidecar.py scripts/ensure_rerank_sidecar.py scripts/sidecar_ledger.py` -> passed.
- `cd .opencode/skills/system-rerank-sidecar && .venv/bin/python -m pytest tests/ -v 2>&1 | tail -80` -> 22 passed, 3 failed because the sandbox denied binding/connecting to `127.0.0.1:8766` with `[Errno 1] Operation not permitted`.
- `cd .opencode/skills/mcp-coco-index && python3 -m pytest mcp_server/tests/lifecycle/test_active_work_registry.py -v 2>&1 | tail -40` -> 5 tests passed.
- `cd .opencode/skills/system-code-graph && node node_modules/vitest/vitest.mjs run mcp_server/tests/lib/ mcp_server/tests/launcher-lease.vitest.ts --config vitest.config.ts 2>&1 | tail -80` -> 5 files, 37 tests passed.
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run ../deep-loop-runtime/tests/unit/executor-audit.vitest.ts --config mcp_server/vitest.config.ts 2>&1 | tail -80` -> 1 file, 22 tests passed.
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/process-memory-harness.vitest.ts scripts/tests/process-sweep.vitest.ts --config mcp_server/vitest.config.ts 2>&1 | tail -80` -> 2 files, 18 tests passed.
- `cd .opencode/skills/system-code-graph && npm run typecheck -- --pretty false 2>&1 | tail -80` -> passed.
- `cd .opencode/skills/system-spec-kit && npm run typecheck -- --pretty false 2>&1 | tail -80` -> passed.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening --strict` -> passed with 0 errors, 0 warnings.

## B4 Commit Handoff

Suggested commit: `fix(014/B4): audit/JSONL data integrity — DR009-COR-004/006/016/017 + DR009-MNT-009`

Findings closed: DR009-COR-004, DR009-COR-006, DR009-COR-016, DR009-COR-017, DR009-MNT-009.

Changed/new files:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/lib/memory/audit-rotation.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_sidecar_5xx_fallback_rss.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md`

Verification:
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run ../deep-loop-runtime/tests/unit/executor-audit.vitest.ts ../deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts ../deep-loop-runtime/tests/unit/executor-config.vitest.ts --config mcp_server/vitest.config.ts` -> 3 files, 57 tests passed.
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/process-memory-harness.vitest.ts scripts/tests/process-sweep.vitest.ts --config mcp_server/vitest.config.ts` -> 2 files, 21 tests passed.
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/lib/memory/audit-rotation.vitest.ts --config mcp_server/vitest.config.ts` -> 1 file, 2 tests passed.
- `cd .opencode/skills/system-code-graph && node node_modules/vitest/vitest.mjs run mcp_server/tests/code-graph-query-handler.vitest.ts mcp_server/tests/code-graph-context-handler.vitest.ts --config vitest.config.ts` -> 2 files, 39 tests passed.
- `cd .opencode/skills/system-code-graph && npm run typecheck -- --pretty false` -> passed.
- `cd .opencode/skills/system-spec-kit && npm run typecheck -- --pretty false` -> passed.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening --strict` -> passed with 0 errors, 0 warnings.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/deep-loop-runtime/lib/deep-loop` -> passed.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-code-graph/mcp_server/handlers` -> passed.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/scripts/ops` -> passed.

## B5 Commit Handoff

Suggested commit:
`fix(014/B5): test fixture validity restoration -- DR009-TRC-001/002/003/004/005/006/007/009/010/011`

Closed/deferred findings:
- DR009-TRC-001 closed: deep-review Codex auto/confirm dispatch branches route through `runAuditedExecutorCommandAsync`.
- DR009-TRC-002 closed: loop-lock concurrent fixture now races two child Node processes.
- DR009-TRC-003 closed: queued CocoIndex daemon index work is cancelled before project close.
- DR009-TRC-004 closed: memory runtime retention stress drives save/search/index workload calls and asserts caps.
- DR009-TRC-005 deferred: phase 012 accepts operator-runbook RSS deferral with sandbox-blocker evidence.
- DR009-TRC-006 closed: phase 013 SC-003 reconciled with temp-workspace launcher reconnect/reclaim harness and manual operator follow-up command.
- DR009-TRC-007 closed: typed `DaemonClient.index_cancel()` transport round trip covered.
- DR009-TRC-009 closed: parent-death polling uses real parent + detached child exit evidence on polling platforms.
- DR009-TRC-010 closed: timeout-kill assertions use portable process liveness and SIGTERM-resistant child.
- DR009-TRC-011 closed: phase 010 records the memory scan gap honestly and cites B5 runtime-retention replay as substitute closure evidence.

Changed paths:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards/`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/`

Verification:
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run ../deep-loop-runtime/tests/unit/loop-lock.vitest.ts --config mcp_server/vitest.config.ts` -> passed, 7 tests.
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/memory-runtime-retention.vitest.ts --config mcp_server/vitest.config.ts` -> passed, 4 tests.
- `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/sidecar-hardening.vitest.ts --config mcp_server/vitest.config.ts` -> passed, 5 tests.
- `cd .opencode/skills/system-code-graph && node node_modules/vitest/vitest.mjs run mcp_server/tests/launcher-lease.vitest.ts --config vitest.config.ts` -> passed, 13 tests.
- `cd .opencode/skills/mcp-coco-index && python3 -m pytest mcp_server/tests/lifecycle/ -q` -> passed, 25 tests.

## B6 Commit Handoff

Suggested commit: `fix(014/B6): doc drift + maintainability cleanup — DR009-COR-011 + DR009-TRC-008/012 + DR009-MNT-004/005/006/007/008/010/011/012/013/014`

Findings closed: DR009-COR-011, DR009-TRC-008, DR009-TRC-012, DR009-MNT-004, DR009-MNT-005, DR009-MNT-006, DR009-MNT-007, DR009-MNT-008, DR009-MNT-010, DR009-MNT-011, DR009-MNT-012, DR009-MNT-013, DR009-MNT-014.

Verification:
- `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/lib/memory/bounded-cache.vitest.ts --config mcp_server/vitest.config.ts` -> PASSED, 1 file / 5 tests.
- `python3 -m pytest mcp_server/tests/lifecycle/ -v` -> PASSED, 27 tests.
- `node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/process-sweep.vitest.ts --config mcp_server/vitest.config.ts` -> PASSED, 1 file / 11 tests.
- `PYTHONPYCACHEPREFIX=/private/tmp/codex-pycache python3 -m py_compile mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/*.py` -> PASSED. The exact command without `PYTHONPYCACHEPREFIX` was blocked by macOS Python cache permissions under the sandbox.
- `npm run typecheck` from `.opencode/skills/system-code-graph` -> PASSED.

Changed/new files:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/lib/memory/bounded-cache.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/__init__.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_active_work_registry.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_cancel_protocol.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/ops/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_rss_core.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_sidecar_5xx_fallback_rss.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/methodology.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/operator-runbook.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/remediation-map.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md`
