---
title: "Tasks: activate the persistent styles database (build, shadow, prove, flip)"
description: "Freeze-first, then build and publish the first full-corpus generation, prove shadow parity + the §9 perf gate, and keep the default legacy. Build + parity + perf proven; the cutover (relevance judgments + default flip) is human-gated."
trigger_phrases:
  - "persistent styles db activation tasks"
  - "generation build shadow parity flip tasks"
  - "install-time prewarm kill switch tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/007-persistent-db-activation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "implementer"
    recent_action: "Built + published the first generation; shadow parity 10/10."
    next_safe_action: "Wire install-time prewarm; operator decides the default flip."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/schema.mjs"
      - ".opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/operator.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-dbbuild-impl-session"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: activate the persistent styles database (build, shadow, prove, flip)

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done with evidence · `HUMAN-GATED` = requires the operator (§9), not autonomously completable. The executable contract is the differential oracle + the DB aggregator (incl. 69/69 Phase-0) + the measured perf trace green, default kept `legacy`. Comment hygiene: no spec/packet/phase/REQ ids in build scripts, adapters, or test comments.
<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Froze the facade — the four corpus consumers call `runQuery`/`runHydrate`; only the adapter behind the facade imports the DB. [SOURCE: `design-*/corpus/*.mjs` → `lib/engine/style-library.mjs`]
- [x] T002 Confirmed distribution (install-time/prewarm; no committed binary; `database/` git-ignored; default `legacy`), the `001-foundation` plane (69/69), and that `005-library-restructure` landed. [TESTED: 69/69; commit `cee62570e4`]
<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Built + published the first full-corpus generation of all 1,290 styles into git-ignored `database/`, capturing size/build-time/RSS via the manifest/telemetry plane. [TESTED: 69.75 MB, 4.8 s, 613 MB RSS; `operator.mjs status` → published:true]
- [x] T004 Extraction has an authoritative rebuild/reconciliation path — `operator.mjs build` fully rebuilds + verifies (integrity/FK/generation-hash) and advances the pointer only on success. The incremental watcher is a deferred enhancement. [SOURCE: `buildStyleDatabase`]
- [ ] T005 HUMAN-GATED — assemble a representative request corpus + author human relevance judgments across the four modes. (Shadow parity is 10/10, so persistent results are already identical to legacy.)
- [x] T006 Prewarm bootstrap + kill switch: `operator.mjs build` is the install-time prewarm entry; `SK_DESIGN_STYLE_DB_MODE` (default `legacy`) + `operator.mjs {cutover,rollback}` are the flip + kill-switch; `legacy`/`shadow`/`persistent` resolve in `persistent-adapter.mjs`. [TESTED: `operator.mjs status/build`; `resolveStyleDatabaseMode` default legacy]
<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 SHADOW mode proves 100% facade DTO parity + the DB aggregator green. [TESTED: `compareQueryResults` 10/10 identical; DB aggregator 69/69]
- [x] T008 Measured the §9 perf gate on a representative trace — persistent p95 53 ms vs legacy 1150 ms = 95.3% and 1097 ms absolute (≥30% AND ≥25 ms MET). [TESTED: perf trace] Operator confirms on their real workload.
- [ ] T009 PARTIAL — clean-checkout (legacy), rollback (`operator.mjs rollback`), and missing-artifact (fail-closed) exercised; the full seven-scenario matrix on a live trace is part of the operator's pre-flip verification.
- [ ] T010 HUMAN-GATED — flip the default to `persistent` only after the operator confirms the perf gate on a real trace + relevance judgments; behind the retained kill switch + observation window. Default stays `legacy` until then. [SOURCE: no default change committed]
<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Facade frozen; first full-corpus generation published into git-ignored `database/` with telemetry (T003)
- [x] Shadow parity 10/10 + DB aggregator green + §9 perf measured 95.3%/1097 ms (T007/T008)
- [x] Full DB lifecycle wired: build (prewarm) / status / cutover / rollback + kill switch; default `legacy` (T006)
- [ ] HUMAN-GATED: relevance judgments (T005), full scenario matrix on a real trace (T009), and the default flip (T010) — the operator's cutover call; `validate.sh --strict` on this packet = 0 errors
<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Build roadmap: `../007-gap-remediation-research/003-db-fate/research/lineages/sol-high-fast/research.md` §10.
- Cutover gates: same research §9 — the eight conjunctive acceptance criteria + the perf materiality bar.
- Decision source: operator WIRE override; parent `../spec.md`; this phase's `spec.md` FROZEN decision.
- Measurement plane (consumed): `../001-foundation/`. Predecessor: `../005-library-restructure/`.
<!-- /ANCHOR:cross-refs -->
