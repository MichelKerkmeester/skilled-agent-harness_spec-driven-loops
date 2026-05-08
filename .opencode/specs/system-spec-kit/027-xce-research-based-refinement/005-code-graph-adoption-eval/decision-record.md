---
title: "Decision Record — 027/005 Phase Level Bump (L2→L3)"
description: "Rationale for keeping subprocess/auth/result-schema hardening in-packet (Level 3) rather than splitting it into a separate prerequisite packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: Phase 005 Level Bump (L2 → L3)

**Date**: 2026-05-08
**Status**: Accepted
**Driver**: pt-02 cross-validation amendment (`pt-02/sub-packet-amendments.md` §"Phase 005 amendments")

---

## DR-001: Bump Phase 005 from Level 2 to Level 3

### Context

The pt-02 cross-validation cycle (10 iterations of cli-codex deep-research, 2026-05-08) flagged Phase 005 as `NEEDS_AMENDMENT` with **5 BLOCKING findings** that all converge on operational-complexity gaps:

- **B-iter005-001**: Subprocess lifecycle is under-specified (no SIGTERM-then-SIGKILL escalation, no close-event wait, no stdin handling).
- **B-iter005-002**: No provider auth preflight; auth failures could consume the full 2-hour run budget.
- **B-iter005-003**: Subprocess can survive timeout and keep shared OpenCode state locked.
- **B-iter005-004**: Result row schema is loose; mixed failures corrupt paired statistics.
- **B-iter005-005**: No mocked stress test — only a 1×2 smoke test, which is insufficient reliability coverage for a 12-20 task × 2 condition × N≥20 dispatch loop.

The amendments add 4 new P0 REQs (REQ-011 preflight, REQ-012 lifecycle, REQ-013 result schema, REQ-014 mocked stress) + 1 new P1 REQ (REQ-015 stale-process guard), with an estimated +180-300 LOC delta on top of the original ~500 LOC L2 estimate.

### Decision

**Keep all subprocess/auth/result-schema hardening inside Phase 005 and bump the phase from Level 2 to Level 3.**

### Alternatives considered

| Option | Description | Rejected because |
|--------|-------------|------------------|
| **A. Bump 005 to L3 (chosen)** | Add subprocess hardening REQs (REQ-011..015) to 005 and bump level. | n/a — chosen |
| **B. Split out a "subprocess hardening" prerequisite packet** | Create a new sibling phase (e.g., `006-subprocess-hardening`) that owns the dispatcher helper, preflight, schema. 005 would then depend on 006. | Adds 6th sibling phase to a packet that's already 5-deep; adds dependency edge that ripples through 005's plan; the dispatcher helper has no consumer outside the eval harness, so isolating it doesn't earn reuse leverage; LOC is comparable (~200 LOC dispatcher helper + ~300 LOC 005 vs ~500 LOC integrated 005). |
| **C. Leave 005 at L2 and reject the BLOCKING findings** | Treat the 5 findings as nice-to-haves and ship the harness without the hardening REQs. | Rejected: pt-02 cross-validation specifically caught these; the L2 envelope materially understates complexity; the harness will produce corrupt paired statistics under realistic failure mixes (timeout + retry + DB-readiness lock + auth flake) without REQ-013/014. |

### Trade-off accepted

- **Cost**: A larger single packet (~680-800 LOC vs original ~500 LOC; complexity 42→55/70). Single-packet implementation requires careful sequencing (preflight → dispatcher helper → result schema → mocked stress → integration → smoke → run).
- **Benefit**: Subprocess hardening is local to the only consumer that needs it (the eval harness). No cross-packet dependency edges added. The dispatcher helper can later be extracted into a shared lib if a second consumer emerges, without forcing that abstraction now (per CLAUDE.md "Wrong abstraction" anti-pattern).

### Expected impact

- **LOC**: +180 to +300 LOC over original L2 estimate (per pt-02 LOC-delta estimate).
- **Wall-clock**: implementation rises from 4-6h to ~6-8h; run wall-clock unchanged at ~2h.
- **Required artifacts (per L3 contract)**: `decision-record.md` (this file), full QA `checklist.md`, eventually `implementation-summary.md`. Optional `research.md` and `resource-map.md` not added — research already exists in pt-01/pt-02 deep-research outputs.
- **Sequencing**: REQ-014 mocked stress test MUST pass before any manual full-harness run (Phase 9 Verification gate; checklist C-V02b + C-V04 amended).

### Reference

- `pt-02/sub-packet-amendments.md` §"Phase 005 amendments" (lines 175-217)
- `pt-02/findings.md` §"Phase 005" (B-iter005-001 .. B-iter005-007)
- `cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md` for the `</dev/null` pattern reused by REQ-012
- `amendments-applied.md` (sibling file) for the BLOCKING-ID → REQ map

---

## DR-002: Mocked stress test before live harness run (workflow gate)

### Context

REQ-014 mandates a mocked dispatcher stress test (≥12×2 with 6 outcome classes). The natural temptation is to ship code, run the live 12×2 harness once, and treat the live run as the reliability proof.

### Decision

The mocked stress test (REQ-014) is a **hard prerequisite gate** before any manual full-harness invocation. Captured as `C-V02b` and `C-V04` in `checklist.md`.

### Rationale

- A live harness run is slow (~2h wallclock) and consumes provider quota.
- Subprocess lifecycle bugs surface non-deterministically — sometimes 1×2 smoke passes while 12×2 hangs.
- Mocked stress isolates the dispatcher contract from provider-side flakiness, so failures are attributable.
- Cost of running a mocked stress is seconds; cost of running a broken live harness is hours plus quota.

---

## DR-003: KEEP the 1×2 smoke test but DOWNGRADE its role

### Context

Original spec treats the 1×2 smoke test (Phase 7) as the primary reliability check. pt-02 amendments explicitly downgrade this — the smoke test stays useful as an end-to-end sanity check, but it is **not** the reliability proof.

### Decision

- Keep the 1×2 smoke test in tasks.md (T17-T19 in current numbering).
- Annotate its role in `tasks.md` as `T-keep-but-not-sufficient`: it MUST pass, AND the REQ-014 mocked stress MUST also pass.
- The reliability proof is REQ-014's mocked 12×2 stress, not the smoke test.

### Rationale

The smoke test is still cheap insurance against integration-shape regressions (env var passing, JSONL output path, session-id capture). Removing it would delete a low-cost guard. The fix is to clarify its limited role, not to delete it.
