---
title: "Implementation Summary: Rerank-Sidecar Reaper Investigation and Architecture"
description: "Completed investigation deliverable for rerank_sidecar accumulation root cause, three-layer reaper design, ADRs, and follow-on Files-to-Change handoff."
trigger_phrases:
  - "arc 010 004 001 implementation summary"
  - "rerank sidecar reaper investigation completed"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-rerank-sidecar-reaper-investigation"
    next_safe_action: "scaffold and implement 010/005-fix-rerank-sidecar-accumulation-with-three-layer-reaper"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "decision-record.md"
      - "research/research.md"
      - "research/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0100040010100040010100040010100040010100040010100040010100040010"
      session_id: "010-004-001-rerank-reaper-design"
      parent_session_id: null
    completion_pct: 100
    status: "completed"
---
# Implementation Summary: Rerank-Sidecar Reaper Investigation and Architecture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Completed |
| **completion_pct** | 100 |
| **Completed** | 2026-05-23 |
| **Branch** | `main` |
| **Commit** | Not committed by this packet |
| **Findings** | 12 lifecycle findings |
| **ADRs** | 7 Proposed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet built a research deliverable, not runtime code:

- `research/iter-001.md` maps the current lifecycle with file:line citations.
- `research/research.md` evaluates Layer B owner-liveness self-check, Layer D launcher pre-flight reap, and Layer A idle backstop, including marginal coverage.
- `research/findings-registry.json` records 12 lifecycle findings.
- `decision-record.md` records 7 Proposed ADRs.
- `plan.md`, `tasks.md`, and `checklist.md` use the canonical arc `010/003/001` anchors.

Key correction: the stale memory pointer to `client.py:325` is now `mcp-coco-index/.../core/client.py:327`, and the rerank sidecar also detaches directly in `ensure_rerank_sidecar.py:269` and `ensure-rerank-sidecar.cjs:392-400`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was delivered as a read-only investigation against runtime source and a write-only documentation pass inside the approved child spec folder. No source files, git state, or predecessor arc artifacts were modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:files-to-change -->
## Files-to-Change for Follow-On Packet 010/005

Follow-on packet: `010/005-fix-rerank-sidecar-accumulation-with-three-layer-reaper/`.

| Absolute Path | Change Type | Per-File Invariant | Parity/Test Requirement |
|---------------|-------------|--------------------|-------------------------|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modify | Run pre-flight reap before reuse/spawn; register current owner identity; preserve `detached: true` and `child.unref()`. | JS fixture matrix must match Python for owner identity and reap decisions. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modify | Cover JS identity-check reasons, legacy row migration, health-unreachable owners-dead reap, and no-kill live-owner cases. | Must consume shared JSON fixtures used by Python tests. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Modify | Mirror JS pre-flight reap before reuse/spawn; register current owner identity; preserve `start_new_session=True`. | Python fixture matrix must match JS for owner identity and reap decisions. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` | Modify | Add version 2 owner identity schema, locked owner prune/register helpers, identity-verified liveness reasons, and import/logging fix for unknown liveness. | Unit tests must cover v1 compatibility, v2 read/write, PID recycled, EPERM, ESRCH, unknown. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | Modify | Add lifespan-managed background reaper, idle timeout, in-flight request gate, telemetry JSONL, and graceful self-SIGTERM. | Async tests must prove no mid-request exit and `/health` does not refresh idle. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/scripts/start.sh` | Modify | Pass only approved `RERANK_SIDECAR_REAPER_*`, `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS`, and telemetry env knobs through existing allowlist. | Shell/env test must prove unrelated env does not leak. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` | Modify/Add | Cover app-level reaper, idle, telemetry, and in-flight gate behavior with model loading mocked. | Must not load real sentence-transformers model. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py` | Add | Cover v2 schema, identity parser, process liveness reason mapping, stale owner pruning, and legacy v1 compatibility. | Must share fixture semantics with JS tests. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/tests/fixtures/reaper-ledger-cases.json` | Add | Canonical cross-runtime fixture matrix for owner liveness and reaper predicates. | JS and Python tests both read this file. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/SKILL.md` | Modify | Document reaper lifecycle, env knobs, telemetry, and manual debug opt-out. | Docs must match ADR defaults. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-rerank-sidecar/README.md` | Modify | Document operator behavior: owner death, idle timeout, pre-flight reap, and telemetry path. | Docs must include no manual SIGKILL normal path. |

<!-- /ANCHOR:files-to-change -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep three layers B+D+A | Each layer has non-zero marginal coverage: B handles all-owners-dead without future launches, D handles stopped/hung and pre-spawn cleanup, A handles owner-alive inactivity. |
| Keep detach semantics | `start_new_session=True` / detached spawn is intentional warm-model reuse. The leak is missing ownership/idle reaping, not detach itself. |
| Use identity-verified PID checks | `kill(0)` alone cannot defend against PID reuse. |
| Add owner identities to ledger | Current `ownerToken` proves reuse identity, not live process ownership. |
| Require parity fixtures | The surface already has JS and Python twins and prior parity hardening. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Source lifecycle reads | PASS - mandated files read with line-number evidence |
| Findings count | PASS - 12 findings |
| ADR count | PASS - 7 ADRs |
| Marginal layer coverage | PASS - B, D, and A each have non-zero marginal coverage |
| Strict validation | PASS - `validate.sh <packet> --strict` exited 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Memory trigger retrieval was unavailable after the MCP call was cancelled, so this packet used the provided startup context and local packet/source evidence.
2. No runtime code was modified or tested beyond spec validation. Implementation and unit/integration tests belong to follow-on packet 010/005.
3. The empirical 25-process cleanup data came from the user prompt; this packet verifies code lifecycle causes, not the historical process list.
<!-- /ANCHOR:limitations -->

---

## Commit Handoff

**Suggested commit message:**

```text
research(010/004/001): rerank-sidecar reaper investigation - three-layer design + 7 ADRs
```

**Changed or created files (absolute paths):**

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/research/iter-001.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/research/research.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/research/findings-registry.json`

**Stdout summary target:**

```text
PACKET-010-004-001 DONE: 12 findings, 7 ADRs, strict-validate PASS, EXIT=0
```
