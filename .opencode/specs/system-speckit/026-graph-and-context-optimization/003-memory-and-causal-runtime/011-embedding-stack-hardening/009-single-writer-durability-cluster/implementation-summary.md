---
title: "Implementation Summary: Single-writer / durability cluster (implemented + tested)"
description: "The coordinated single-writer/durability cluster is implemented and tested (this session): all 5 families landed with deterministic regression suites; builds + node --check + 26 new + 29 regression + 9 leases tests pass."
trigger_phrases:
  - "single writer durability cluster status"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/009-single-writer-durability-cluster"
    last_updated_at: "2026-05-29T23:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Design + concurrency-test design committed; implementation deliberately deferred"
    next_safe_action: "Execute Phase 1 (gate + re-validation), then implement per family with Harness A/B"
    blockers: ["Precondition gate on adjacent launcher WIP for Family-3"]
    key_files: [".opencode/bin/lib/model-server-supervision.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003194"
      session_id: "031-009-impl"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Single-writer / durability cluster (implemented + tested)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-embedding-stack-hardening/009-single-writer-durability-cluster |
| **Completed** | 2026-05-30 (implemented + tested) |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**Implemented + tested (2026-05-30).** All five families of the single-writer/durability cluster landed as one coordinated change set, each finding re-validated at HEAD by symbol and covered by a deterministic regression test:

- **Family 1+2 — `model-server-supervision.cjs`**: respawn-lock staleness now bounded by listener liveness (DR-005); the lazy demand listener re-arms on a failed spawn (DR-006); idle eviction reaps the root process, not just descendants (DR-012).
- **Family 4 durability — `vector-index-store.ts`**: the clean-shutdown marker is deleted only after a confirmed-successful close (DR-011).
- **Family 4 durability — `reindex.ts`**: same-dimension reindex writes a staging shard and atomic-swaps on success; the worker re-reads the cancel flag mid-run (DR-020 + DR-001-P1-002).
- **Family 4 perimeter — `hf-model-server.cjs`**: the direct-startup unlink path applies the ownership/live-resident perimeter guard, and tcp targets enforce loopback/auth (DR-001-P2-001 + DR-002-P1-001).
- **Family 3 leases — `daemon-detect.ts`**: a stale-looking launcher lease with a live recorded `childPid` is no longer treated as reclaimable (DR-016). OR-R-01 was re-validated as already O_EXCL-remediated at HEAD — no change.

Verification: mcp + shared + scripts builds exit 0; `node --check` on both `.cjs`; 4 new deterministic suites (26 tests) + 3 regression suites (29 tests) + the leases suite (9 tests) all pass. The original plan's design content (four-family shared-resource map, Harness A/B, apply ordering with precondition gate) drove this implementation and lives in `plan.md`.

Re-validation already corrected two first-pass items: **OR-R-01 is already O_EXCL-remediated** at HEAD (re-validate only), and **DR-012's mechanism is root-EXCLUSION** in `reapProcessTreeGroups` (`pid !== childPid`), not a missing reap call. The other findings (DR-005/006/016/011/020/001-P2-001 + the folded DR-001-P1-002/DR-002-P1-001) are confirmed-open.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `009-…/spec.md`, `plan.md`, `tasks.md` | Created | The coordinated design, concurrency-test design, apply ordering, per-family task list |

(No source files changed in this packet — that is the implementation phase, deliberately not run yet.)

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A multi-agent design pass produced the coordinated plan; it was then re-validated against HEAD-read source (correcting the OR-R-01 already-done and DR-012 mechanism items) and cross-checked against `031/review/review-report.md`. The plan was captured as this committed packet so the work is durable and ready to execute as one careful effort — exactly as the handover mandates (one coordinated packet, after the launcher-WIP precondition gate, with a deterministic two-launcher concurrency test). Implementation was intentionally NOT attempted at the tail of a long session because this is the highest-blast-radius surface in the repo (the program exists because of a DB-corruption incident here) and the design itself requires per-finding HEAD re-validation plus a gate.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Design first as a committed packet, then implement | The ready plan was captured durably so the implementation could be re-validated against it per family rather than rushed |
| Implement as one coordinated change set per family | The findings share a respawn lock / root-liveness authority / leases / marker; piecemeal fixes re-collide (handover mandate) |
| Honor the precondition gate before Family-3 | The code-graph launcher is adjacent-session territory; OR-R-01 is already remediated |
| Deterministic Harness A/B, no real sleeps | Concurrency bugs need reproducible RED-before / GREEN-after evidence via injected time/liveness/spawn |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Finding-state re-validation at HEAD | DONE — OR-R-01 already O_EXCL; DR-012 = root-exclusion; rest were confirmed-open |
| Code implementation (5 families) | DONE — this session |
| Builds (mcp + shared + scripts) | PASS — exit 0 |
| `node --check` (2 `.cjs`) | PASS |
| New deterministic suites | PASS — 4 suites, 26 tests |
| Regression suites (execution-router / reindex / auto-selection) | PASS — 29 tests |
| Leases suite (daemon-detect) | PASS — 9 tests |
| `validate.sh --strict` (this packet) | PASS |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Concurrency tests are deterministic, not live.** Harness A/B inject `nowMs`/`liveness`/`spawnFn`/`signal` to force races without real sleeps. A live two-launcher integration run (real processes) remains gated on a working `onnxruntime` tree, as documented in packet 005 — these unit-level suites assert the corrected logic, not end-to-end residency.
2. **Family-3 scope.** DR-016 was fixed in `daemon-detect.ts` (this skill's territory); OR-R-01 was only re-validated (already O_EXCL in the code-graph launcher, adjacent-session territory — untouched).
3. **`reindex.ts` cluster fix sits alongside the C2 cancel edit** (packet 008); both were re-validated together so the staging-swap and cancel-re-read are consistent.

<!-- /ANCHOR:limitations -->
