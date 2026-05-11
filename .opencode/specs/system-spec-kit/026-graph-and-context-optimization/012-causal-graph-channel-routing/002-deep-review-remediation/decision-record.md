---
title: "Decision Record: 002 Deep-Review Remediation"
description: "Architecture decisions for closing 3 P1 and 39 P2 findings from the 2026-05-11 deep review."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: 002 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-001: Wire `invalidateEntityDensityCache` into commit hooks

**Status:** Accepted

**Context:** Deep-review finding P1-C-001 (iter 6). `invalidateEntityDensityCache()` is exported but never called from `memory_save.ts` or `memory_bulk_delete.ts`. The 60s TTL is the only invalidation lever, so the entity-density signal can be stale for 60s after row mutations.

**Decision:** Wire `invalidateEntityDensityCache()` into the post-commit branch of both handlers.

**Rationale:**
- The function exists, is exported, and is unit-tested — this is a wiring gap, not a capability gap.
- Per-call overhead is ~µs (in-process Map clear); negligible vs the commit work.
- Implementation-summary already flagged this as "Known Limitation #1" but the spec-coupled correctness gap (REQ-003) makes it a release-blocker.

**Consequences:**
- Burst writes now propagate to the entity-density signal immediately (after commit).
- Cache rebuilds happen on the next `getEntityDensityScore` call after invalidation — lazy, not eager.
- Risk surface: a failed save MUST NOT invalidate the cache (call AFTER commit, not before).

**Alternatives considered:**
- (rejected) Decrease TTL to e.g. 5s — still leaves a stale window, increases rebuild cost.
- (rejected) Subscribe to a write-bus — overkill for a 5-line wiring fix.

---

## ADR-002: Tighten `SPECKIT_GRAPH_CHANNEL_PRESERVATION` env-flag parsing

**Status:** Accepted (BREAKING for users explicitly setting `=0`)

**Context:** Adversarial finding ADV-001 (iter 9). Current `isGraphChannelPreservationEnabled` returns `true` whenever the env var is set to any non-falsy-by-JS string. That includes `"0"`, `"no"`, `"off"`, and `""` — which most operators would reasonably expect to mean "disabled."

**Decision:** Parse as a permissive boolean:
- Enabled (return `true`): unset, `"1"`, `"true"`, `"yes"`, `"on"` (case-insensitive, post-trim).
- Disabled (return `false`): `"0"`, `"no"`, `"off"`, `""`.
- Any other value: log a warning (warn-once) and default to ENABLED.

**Rationale:**
- The existing behavior was a bug, not a documented contract.
- Default-ON is preserved; users who haven't set the var see no change.
- The fix aligns with how every other `SPECKIT_*` flag is parsed in the codebase.

**Consequences:**
- `SPECKIT_GRAPH_CHANNEL_PRESERVATION=0` users — who likely intended "disabled" — now actually get disabled. The changelog must document this.

---

## ADR-003: ChannelName dedup — annotate, do not refactor

**Status:** Accepted

**Context:** P2-001 — `ChannelName` type is declared in both `query-router.ts:35` and `routing-telemetry.ts:14`.

**Decision:** Keep both declarations; add a `// SOURCE OF TRUTH: ../search/query-router.ts:35` comment on the routing-telemetry side.

**Rationale:**
- Re-exporting from `query-router.ts` risks introducing a TypeScript circular import (query-router has indirect deps that may reach back into routing-telemetry).
- The type is a 5-element literal union; the cost of drift is bounded (TS will complain at every call site).
- A single source-of-truth comment is sufficient for human review; a CI test ensures the unions stay equal.

**Consequences:**
- Adding a new channel requires updating both files. Acceptable trade-off vs the refactor risk.

---

## ADR-004: `recordInvocation` — rename docs, do not refactor

**Status:** Accepted

**Context:** P2-002 — `routing-telemetry.recordInvocation` uses `recentDecisions.shift()` on overflow. The implementation doc calls this a "ring buffer," but the impl is an O(n)-per-overflow array-shift FIFO.

**Decision:** Rename module/JSDoc references to "rolling 200-decision window" and leave the impl alone.

**Rationale:**
- WINDOW_SIZE=200 — Array.shift is O(200) per overflow, negligible at our call rates.
- A true ring buffer with write-index modulo requires extra indexing logic; the existing impl is correct and simpler.
- Doc accuracy is the actual fix.

---

## ADR-005: Documentation status fields for completed work

**Status:** Accepted

**Context:** F10-001/F10-002/F10-003 — `spec.md` Status=Draft, `plan.md` DoD unchecked, `handover.md` completion_pct=95 — all stale post-completion.

**Decision:** Establish a convention that on packet completion, the implementing agent (or operator) MUST:
1. Update `spec.md` Status to `Shipped`.
2. Tick all DoD checkboxes in `plan.md`.
3. Set `handover.md` completion_pct to 100 (or document any remaining %).

This is captured here so future packets close the loop without re-discovering the gap.

**Consequences:**
- Adds ~3 minute closing ritual to every Level 2+ packet.
- Catches doc-staleness at the source instead of in deep review.
