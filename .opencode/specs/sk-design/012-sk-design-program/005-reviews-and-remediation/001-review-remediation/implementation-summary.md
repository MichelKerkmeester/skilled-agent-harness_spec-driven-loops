---
title: "Implementation Summary: packet-012 deep-review remediation"
description: "Fixed all deep-review findings (P0=0, P1=9, P2=1); persistent-path hardened, evidence reconciled; adapter stays legacy-default."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/005-reviews-and-remediation/001-review-remediation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "remediation-orchestrator"
    recent_action: "Implemented + independently verified all remediation fixes (31/31 db, 20/20 legacy)"
    next_safe_action: "Persistent-enable go/no-go (separate gate) — includes full-corpus SLO measurement"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "#2: no production query caller passes a generation pin; the contract was enforced (fail-closed), not removed"
      - "#7: SLO reworded as bounded-sample; full-corpus measurement deferred to the persistent-enable go/no-go"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: packet-012 deep-review remediation

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 5 of 5 (remediation) |
| **Status** | Complete |
| **Executor** | GPT-5.6-SOL (high) via cli-opencode in isolated worktree |
| **Verification** | Independent: 31/31 db tests (24 + 7 new), 20/20 legacy (no regression); #1/#3 fixes read against code |
| **Completed** | 2026-07-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 10 deep-review findings closed. Four P0 code hardening fixes + one P2 + one operator surface in `styles/_db/`, plus evidence reconciliation in the 003/parent docs. The `styles/_engine` adapter stays `legacy`-default; nothing changes in production.

### Files Created / Changed

| File Path | Change | Finding |
|-----------|--------|---------|
| `_db/vectors.mjs` | Modify | #1 stale-`running` reconciliation (5-min lease; drain now reclaims orphaned claims) |
| `_db/retrieval.mjs` | Modify | #2 request-generation compared + fail-closed; #4 `queryVector` bounded (1–16,384 finite nums, 256 KiB) |
| `_db/schema.mjs` | Modify | #3 `realpathSync` containment + opened-DB↔pointer generation binding |
| `_db/indexer.mjs` | Modify | #10 aggregate hash uses stable UUID + roles, excludes the mutable slug |
| `_db/operator.mjs` | Create | #9 status/build/cutover/rollback/repair + current-plus-rollback retention |
| `_db/README.md` | Modify | #9 operator surface + retention docs |
| `_db/__tests__/**` (+ `operator.test.mjs`) | Modify/Create | regression tests (31 total) |
| `_engine/persistent-adapter.mjs` | Modify | wiring; default still `legacy` |
| `003-style-database/{spec,checklist,implementation-summary}.md`, parent `spec.md` | Modify | #7 SLO reworded bounded-sample; #8 parent status reconciled |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched a GPT-5.6-SOL implementer via `opencode run` in an isolated worktree off origin `b25ee5c370`, driven by the 005 spec/plan/tasks. Severity order: P0 code hardening first, then P2 + operator surface, then evidence corrections. Verified independently by the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **#2 enforced, not removed:** no production query caller currently supplies a generation pin, so the contract fail-closes on a mismatched pin rather than dropping the pin concept.
- **#7 reworded, not measured:** the 20-style timing is stated as a bounded-sample check; the full-corpus persistent-vs-legacy SLO measurement is explicitly deferred to the persistent-enable go/no-go (avoids a heavy full index in remediation).
- **Legacy stays default:** every fix hardens the off-by-default persistent path; the flat-file engine is untouched (20/20 proves it).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Independent re-run:** `_db/__tests__` → **31/31 pass** (24 baseline + 7 new); `_engine/__tests__` → **20/20 pass** (no regression).
- **Fixes read against code:** #1 `vectors.mjs` reclaims stale `running` via a `runningTimeoutMs` lease + `status IN (pending,running,failed)` recovery; #3 `schema.mjs` uses `realpathSync` containment + generation binding; adapter default confirmed `?? 'legacy'`.
- 005 + 003 `validate.sh --strict` pass; alignment drift 0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Full-corpus SLO still unmeasured** — deferred to the persistent-enable go/no-go (the honest rewording of #7, not a silent skip).
- **Persistent path remains off by default** — this remediation makes it *safe to enable*; enabling it is a separate operator decision.
- Test-suite `index.mjs`/`package.json` entrypoints were added so `node --test <dir>/` works on Node 22.23 (the glob form also passes).
<!-- /ANCHOR:limitations -->
