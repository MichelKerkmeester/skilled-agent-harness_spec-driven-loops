---
title: "Implementation Summary: Deep-loop fan-out remediation (009)"
description: "Scaffold status — design + planned fixes recorded, not yet implemented. Captures the 14 findings, the reuse targets, and the verification the build must satisfy."
trigger_phrases:
  - "123 phase 009 implementation summary"
  - "fanout remediation status"
  - "fanout fix summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/009-deep-loop-parallel-fanout/009-fanout-remediation"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded design-phase docs; no code written yet"
    next_safe_action: "Start T101 C-02 fail-closed; then T110 C-01 async spawn"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Deep-loop fan-out remediation (009)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

> Status: PLANNED — spec/design only. No code has been written or changed. This file records the
> planned fixes and the verification the future build must satisfy; it makes NO completion or
> test-pass claims because nothing has been implemented.

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-fanout-remediation |
| **Status** | Planned (not implemented) |
| **Level** | 3 |
| **Estimated Effort** | ~26 hours |
| **Estimated LOC** | ~400 code + tests |
| **Source review** | `../008-deep-review/review/review-report.md` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:exec-summary -->
## EXECUTIVE SUMMARY

This phase will fix the 14 verified findings from the packet-123 deep review (2 P0, 1 latent-P0, 8 P1, 3 P2). The headline fixes make CLI fan-out genuinely concurrent (C-01) and the review gate fail-closed (C-02), backed by the two tests the original 72-test suite lacked. No code is written yet — this scaffold records the design and the verification gates the future build must satisfy.

<!-- /ANCHOR:exec-summary -->
---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

NOTHING YET — documentation scaffold only. Six Level-3 docs + `description.json` + `graph-metadata.json` + `resource-map.md` authored under this folder; parent wiring updated. No source/YAML/test files modified.

### Files Planned to Change (the implement-time edit set)

| File | Action | Finding(s) |
|------|--------|------------|
| `scripts/fanout-run.cjs` | Modify | C-01, C-02, C-03, ENV-LEAK, N-02 |
| `scripts/fanout-merge.cjs` | Modify | C-02, MERGE-DROP, MERGE-DEDUP, N-04 |
| `scripts/fanout-salvage.cjs` | Modify | C-04, N-01 |
| `lib/deep-loop/executor-config.ts` | Modify | BOUNDS, XOR |
| `lib/council/session-state-hierarchy.cjs` | Modify | export `pad3` (C-04 reuse) |
| command YAMLs + docs (×6) | Modify | U-01 |
| `tests/unit/fanout-*.vitest.ts` | Modify | new real-spawn + fail-closed + hardening tests |
| `123/00{3,4,5,6}` docs + parent | Modify | DOC-STALENESS |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

NOT YET DELIVERED. The planned delivery sequence is gate-honest-before-concurrent: C-02 (failed lineage = failure; merge fails closed) lands before C-01 (async spawn) so the test harness reports failures truthfully before concurrency can mask them. P1 hardening (BOUNDS, XOR, ENV-LEAK, MERGE-DEDUP, salvage) follows, then the L/High verbatim change (C-03) and doc cleanup last. Delivery reuses three existing runtime helpers — `runAuditedExecutorCommandAsync` (async spawn + detached process-group kill), `buildExecutorDispatchEnv` (env allowlist), `pad3` (filename padding) — rather than hand-rolling concurrency or env filtering. Every change holds the single-executor byte-identical parity gate (ADR-005); the C-01 rewrite touches the inner fan-out worker only, leaving the TSX self-respawn synchronous.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | C-03 true verbatim CLI-lineage execution | Accepted |
| ADR-002 | Standardize executor field on `.kind` | Accepted |
| ADR-003 | Reuse `buildExecutorDispatchEnv` allowlist | Accepted |
| ADR-004 | Full-anchor Level-3 docs | Accepted |
| ADR-005 | Single-executor byte-identical parity gate | Accepted |

Implementation ordering: C-02 before C-01 (honest gate first); inner-worker-only spawn change (protect parity); `content_hash` dedup key (matches the reducer contract). See `decision-record.md` for full ADRs.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## VERIFICATION

NOT YET PERFORMED — planned gates:

| Gate | Target | Status |
|------|--------|--------|
| Real-spawn concurrency test | ≥2 alive at cap 2 (catches C-01) | Planned |
| All-fail merge test | non-PASS + failed>0 (catches C-02) | Planned |
| Full fanout suite | green (≥72 + new) from `system-spec-kit/mcp_server` | Planned |
| Parity gate | single-executor byte-identical to `main` | Planned |
| `validate.sh --strict` | green on 009 | Planned |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. Not implemented — this is a design/spec scaffold; no completion or test-pass claims.
2. U-01's P0-vs-P1 hinge (runner write-back of the normalized config) is sidestepped by standardizing on `.kind`; the runtime write-back behavior itself is not separately characterized.
3. C-03 verbatim is L/High and may surface per-CLI-kind edge cases not enumerable until implementation.
4. MERGE-DEDUP assumes the reducer emits a `content_hash`; if absent, a small `computeFindingHash` must be added (tracked in the plan dependencies).

<!-- /ANCHOR:limitations -->
