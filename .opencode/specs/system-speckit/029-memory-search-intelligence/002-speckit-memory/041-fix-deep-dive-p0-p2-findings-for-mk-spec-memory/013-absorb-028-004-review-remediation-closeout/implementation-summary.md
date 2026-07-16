---
title: "Implementation Summary: Absorb 028/006 Review-Remediation Closeout"
description: "Closed the 016 program's books: pointed the absorbed 028/006/002, 028/006/004, and ex-031 Group-A trackers at their owning phases as verify-first-then-close, reconstructed the unrecoverable 91-item P2 map from the G1-G15 lens grouping, confirmed the finding-level no-silent-drops table, recorded three scaffolding tooling bugs with repro, and rolled up the 028/006 and 028 parents to the accurate absorbed/complete state."
trigger_phrases:
  - "review remediation closeout"
  - "absorbed tracker pointers"
  - "91 item p2 reconstruction"
  - "findings completeness sweep"
  - "016 program rollup"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/013-absorb-028-004-review-remediation-closeout"
    last_updated_at: "2026-07-06T19:26:05.342Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Absorbed 006/002+006/004+ex-031 trackers, reconstructed the P2 map, rolled up both parents"
    next_safe_action: "Program complete — reconcile 006 + 028 rollup and /memory:save closeout"
    blockers: []
    key_files:
      - "../../../004-review-remediation/002-memory-schema-and-concurrency/tasks.md"
      - "../../../004-review-remediation/004-p2-triage/spec.md"
      - "../../../000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation/tasks.md"
      - "../../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-016-013-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The frozen 91-item P2 source is unrecoverable; the reconstruction from the G1-G15 lens grouping sums to ~86, and the ~5 delta is the review's own approximate count — no items were fabricated to force 91"
      - "The three tooling bugs (TOOL-1/2/3) are routed to a new scripts-tooling packet, not fixed here; TOOL-1/TOOL-3 are cosmetic (spec.md level derivation covers them), TOOL-2 breaks only the unused upgrade-level path"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-absorb-028-004-review-remediation-closeout |
| **Completed** | 2026-07-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase writes no code — it closes the 016 program's books so packet 028's status surfaces are accurate. Three trackers advertised a pre-absorption state and now point at the phases that own their items. The `028/006/002` schema-and-concurrency tracker (rows T005-T011) is marked **verify-first-then-close**: the plan review confirmed all three items (P1-2 derived_id, P1-4 in-lock semantic-edge embedding, P1-5 retention spare-only re-validate) were already correct in live code, so the pointers schedule verification + a test in the owning phase, not a re-fix — P1-2 and P1-4 to phase 008 (where the derived_id backfill ran as a verified no-op and the semantic-edge scan was confirmed outside the `BEGIN IMMEDIATE` lock), P1-5 to phase 009 (where the fresh in-transaction revalidation before DELETE was confirmed and the interleaving test added). The ex-031 Group-A rows (T-0211/T-0212/REQ-214) are reconciled: they were resolved directly in the 014 tracker, and their shared root cause — the per-request flag read that stopped default-on flags from applying — was hardened in phase 007, so the two are complementary; the remaining genuinely-open 014 rows (T003, T900-T902, the deferred T-0240 lint backlog) are dispositioned as staying in 014.

### The reconstructed P2 map and the completeness guarantee

The frozen per-item source for the 91 P2 findings (`028/006/archive/review-report.md`) is unrecoverable — verified absent, with no per-item enumeration surviving anywhere in the packet. The reconstruction is therefore built from the `004-p2-triage` tracker's own G1-G15 lens grouping (items enumerated inline within each family) cross-referenced with the findings-ledger P2 entries, and each of the fifteen families is given a 016 disposition: G3→012, G4→006, G5→004, G9→007, G10→009/010 cover roughly 23 items, G12's doc cluster stays with `006/003`, and the rest are accept-as-is with a reason. The families sum to ~86, and the ~5 delta from the "91" headline is the review's own stated approximation, not missing items — nothing was fabricated to force the count. The no-silent-drops guarantee rests on the finding-level table (one row per finding), which pre-enumerates the 13 findings the section-level sweep let slip; the six assigned to phases shipped this session (008, 009, 012) are confirmed done against their REQ IDs. Finally, the three scaffolding tooling bugs found while building this program (TOOL-1/2/3) are recorded with a script-line anchor and a reproducing command and routed to a follow-on owner, and both the `028/006` and `028` parents are rolled up from pending/planned to the accurate absorbed/complete state.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Authored directly by Opus 4.8 rather than dispatched — this closeout requires whole-program knowledge of what each of phases 001-012 actually shipped (for example, that phase 008's derived_id backfill ran as a verified no-op rather than the migration the stale scaffold predicted), which is more reliable applied first-hand than reconstructed from research docs by a fresh agent. The two large table reconstructions were attempted as parallel GPT jobs for cross-check, but the P2 map was authored in place from the compact G1-G15 lens source when those runs proved slow and kill-prone. Every tracker edit was row-scoped to avoid clobbering the concurrent session's shared docs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Verify-first-then-close pointers, not re-fix instructions | The plan review confirmed P1-2/P1-4/P1-5 are already correct in live code; telling 008/009 to re-implement them would be churn against working code |
| Reconstruct the P2 map from G1-G15, reconcile to ~86 not 91 | The per-item source is gone; the lens grouping is the recoverable granularity, and the honest count beats fabricating five items to hit a headline |
| Record + route the tooling bugs, do not fix them | Fixing spec-kit scripts is outside a code-less closeout phase; the repro + routing gives the owner everything |
| Author the closeout directly instead of dispatching | Accuracy here depends on first-hand knowledge of each phase's actual outcome, and two dispatch attempts were killed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T017 grep audit (`PENDING, scaffold only` / `queued`) | PASS (zero hits — every absorbed row carries a disposition) |
| REQ-001 006/002 verify-first-then-close pointers | PASS (T005-T011 absorbed → 008/009, no re-fix instruction) |
| REQ-002 91-item P2 reconstruction | PASS (G1-G15 → 016 disposition; ~86 reconciled vs 91, no fabrication) |
| REQ-003/007 ex-031 + 014 open rows | PASS (Group-A root-cause note → 007; open rows dispositioned) |
| REQ-004 finding-level no-silent-drops table | PASS (13 pre-enumerated; the 008/009/012 ones confirmed shipped) |
| REQ-005 parent rollups (028/006 + 028) | PASS (pending/planned → absorbed/complete) |
| REQ-008 three tooling bugs recorded + routed | PASS (repro + line anchors + routing decision) |
| REQ-006 recursive `validate.sh --strict` + `/memory:save` | (closeout — see the final validation run) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The P2 reconstruction is lens-level, not per-item.** The frozen per-item review source is unrecoverable, so the finest honest granularity is the G1-G15 families with their items enumerated inline; a true per-item table cannot be rebuilt without the lost source.
2. **"Coverage" means an owning phase task exists, not that every P2 shipped.** The finding-level and P2 tables assign ownership; the accept-as-is families are explicitly deferred as hardening backlog with reasons, not silently dropped.
3. **The three tooling bugs are routed, not fixed.** They live as tracked items with repro for a follow-on scripts-tooling packet.
<!-- /ANCHOR:limitations -->
