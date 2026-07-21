---
title: "Implementation Plan: activate the persistent styles database (build, shadow, prove, flip)"
description: "Freeze the facade, build and publish the first full-corpus generation into a git-ignored install-time/prewarm database, wire extraction to authoritative reconciliation, prove shadow parity via the differential oracle plus the §9 perf gate, and flip the default behind a legacy kill switch only after all eight reactivation gates pass."
trigger_phrases:
  - "persistent styles db activation plan"
  - "shadow parity perf gate flip plan"
  - "install-time prewarm generation build plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/006-persistent-db-activation"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 plan for the persistent DB activation build."
    next_safe_action: "Freeze the facade, then run shadow parity before any default flip."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/style-library.mjs"
      - ".opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs"
      - ".opencode/skills/sk-design/styles/_db/generation-manifest.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-dbbuild-plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: activate the persistent styles database (build, shadow, prove, flip)

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node ESM) — sk-design styles database module |
| **Framework** | `node --test`; the `001-foundation` manifest / stage-telemetry / differential-oracle plane |
| **Storage** | SQLite generation published into the git-ignored `database/` dir; flat files remain the content authority |
| **Testing** | Differential oracle parity + the DB test aggregator (incl. the 69/69 Phase-0 set) + a measured perf trace |

### Overview

Activate the already-scaffolded SQLite styles database as forward infrastructure per the operator WIRE override. Freeze the storage-neutral facade `styles/_engine/style-library.mjs` (`runQuery`/`runHydrate`) and the flat files as content authority; build and publish the first full-corpus generation (all 1,290 styles) into a git-ignored, install-time / prewarmed `database/` directory; wire extraction to an authoritative reconciliation workflow; assemble a human-labeled representative request corpus; and run SHADOW mode to prove 100% facade parity via the differential oracle plus the §9 perf gate. The default read path stays `legacy` and only flips to `persistent` — behind a retained kill switch and a bounded observation window — once all eight conjunctive reactivation gates pass. The change is correct iff the differential oracle and the DB test aggregator stay green and the perf gate is confirmed on real shadow data.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- `005-library-restructure` has landed and the restructured corpus is available as the generation input.
- `001-foundation`'s manifest, stage telemetry, differential oracle, fixtures, and relevance seed are present and green (69/69, `validate.sh --strict` Errors:0).
- The distribution decision (install-time / prewarm, no committed binary, git-ignored `database/`) is recorded, and REQ-001–REQ-010 are documented in `spec.md`.

### Definition of Done

- No lazy query-time build path exists; a clean checkout resolves `legacy` until an owned prewarm bootstrap runs.
- The first full-corpus generation of all 1,290 styles is published into `database/` with captured size/build-time/RSS and manifest-recorded status + rollback evidence.
- SHADOW mode reports 100% facade DTO/refusal/generation parity via a green differential oracle; the §9 perf gate is confirmed on a real representative trace.
- All seven failure/repair/rollback scenarios pass; the default stays `legacy` until all eight gates pass; the flip is behind a kill switch + observation window + monitoring.
- `validate.sh --strict` on this phase = 0 errors; the DB test aggregator (incl. the 69/69 Phase-0 set) is green.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shadow-then-flip behind a kill switch, over a frozen facade parity boundary. The database is additive: it is built, published, and proven in `shadow` while `legacy` continues to serve; the default only flips to `persistent` after every gate passes, and the flip is reversible by a mode flip plus a manifest-pointer rollback. Distribution is install-time / prewarm — the DB is bootstrapped, never lazily built at query time.

### Content Ownership (the boundary the activation preserves)

- **Flat files (authority):** the style content source of truth; the generation is derived from them, never the reverse.
- **Facade (`runQuery`/`runHydrate`):** the storage-neutral parity boundary; all four corpus modules call it and none imports the DB.
- **`persistent-adapter.mjs`:** resolves `legacy | shadow | persistent` on `SK_DESIGN_STYLE_DB_MODE`; owns the prewarm bootstrap and the kill switch; default `legacy`.
- **`001-foundation` plane:** the manifest (publish/pointer/rollback), stage telemetry (size/build-time/RSS), and differential oracle (parity proof) — consumed, not rebuilt here.

### Key Components

- **Facade freeze** — pin `runQuery`/`runHydrate` + flat files as content authority.
- **Generation builder** — build + publish all 1,290 styles into `database/`, capturing telemetry, status, and rollback evidence via the manifest.
- **Extraction → reconciliation** — watchers trigger; reconciliation owns correctness.
- **Request corpus + relevance** — a four-mode representative trace with human relevance judgments.
- **Shadow lane** — runs `persistent` beside `legacy` through the facade; the differential oracle proves parity.
- **Kill switch + prewarm bootstrap** — install-time prewarm; a reversible default flip.

### Data Flow

Flat files → generation builder → generation published into the git-ignored `database/` → manifest advances the pointer (only on a complete generation) → install-time prewarm bootstrap warms the DB → SHADOW mode routes queries through the facade to both `legacy` and `persistent`, the differential oracle compares DTO/refusal/generation → the perf trace measures p95 → gates evaluated → default flips to `persistent` behind the kill switch → monitoring runs for the observation window → post-window remove-dual-mode or revert.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Freeze & Confirm Distribution

- [ ] Freeze the facade: pin `runQuery`/`runHydrate` + the flat files as content authority; confirm no corpus module imports the DB.
- [ ] Confirm the install-time / prewarm distribution decision is recorded — no committed binary, DB only under the git-ignored `database/`, clean checkout defaults `legacy` until an owned bootstrap prewarms; confirm the `001-foundation` plane is present and `005-library-restructure` has landed.

### Phase 2: Build, Wire & Assemble

- [ ] Build + publish the first full-corpus generation (all 1,290 styles) into `database/`, capturing size/build-time/RSS + status + rollback evidence through the manifest/telemetry plane.
- [ ] Wire corpus extraction to an authoritative rebuild/reconciliation workflow (watchers trigger, reconciliation owns correctness).
- [ ] Assemble a representative request corpus across all four design modes + author human relevance judgments; build out the prewarm bootstrap + kill switch on `SK_DESIGN_STYLE_DB_MODE` (default `legacy`).

### Phase 3: Prove, Gate & Flip

- [ ] Run SHADOW mode; prove 100% facade DTO/refusal/generation parity via a green differential oracle + relevance acceptance.
- [ ] Measure the §9 perf gate on a real representative trace (≥30% and ≥25 ms p95, or approved-SLO breach); confirm both proposed thresholds.
- [ ] Exercise clean-checkout / stale-corpus / interrupted-build / pointer-mismatch / missing-artifact / repair / rollback scenarios.
- [ ] Flip the default to `persistent` only after all eight gates pass, behind the retained kill switch + observation window + monitoring; run `validate.sh --strict` = 0 errors and the DB test aggregator green. On any gate failure, revert via the kill switch + manifest-pointer rollback.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parity | 100% facade DTO/refusal/generation parity, persistent vs legacy | `_db/oracle/differential-oracle.mjs` |
| Aggregator | Full DB suite incl. the 69/69 Phase-0 set | DB test aggregator (`node --test`) |
| Perf | §9 p95 gate on a real representative trace | Phase-0 stage telemetry + the request corpus |
| Relevance | No material regression vs human labels | Human relevance judgments over four modes |
| Scenario | Clean-checkout, stale, interrupted-build, pointer-mismatch, missing-artifact, repair, rollback | Deterministic fixtures |
| Spec | Packet doc integrity | `validate.sh --strict` |

The differential oracle plus the DB aggregator and the measured perf trace are the executable contract; scenario and relevance evidence corroborate before the flip.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-foundation` measurement/contract/rollback plane | Internal | Green (69/69, Errors:0) | No parity/telemetry/rollback measurement; cannot gate a flip |
| `005-library-restructure` predecessor | Internal | Planned/first | The generation builds on the restructured corpus; blocks the build if not landed |
| Facade `styles/_engine/style-library.mjs` | Internal | Present | The parity boundary; freeze required before build |
| `styles/_engine/persistent-adapter.mjs` + `SK_DESIGN_STYLE_DB_MODE` | Internal | Present (default legacy) | The mode switch + kill switch; blocks shadow/flip if not built out |
| Git-ignored `database/` directory | Internal | To create | The only publish target; a committed binary or lazy build is forbidden |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 1 (freeze + distribution confirm) **gates** Phase 2: no generation is built until the facade is frozen and the install-time/prewarm decision is confirmed against a landed `005-library-restructure` and a present `001-foundation` plane.
- Phase 2 (build + wire + assemble) **gates** Phase 3: shadow parity and the perf gate cannot run without a published generation, a reconciliation workflow, and a human-labeled request corpus.
- Phase 3 is **conjunctive**: the flip happens only after all eight reactivation gates pass; the default stays `legacy` throughout, and a failed gate triggers a kill-switch + manifest-pointer revert rather than a partial flip.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

- **Phase 1** — freeze + distribution confirm; low, gated on the predecessor and the Phase-0 plane.
- **Phase 2** — first full-corpus generation build + reconciliation wiring + human-labeled request corpus + bootstrap/kill switch; the heaviest phase.
- **Phase 3** — shadow parity + perf trace + scenario matrix + the reversible flip; medium, concentrated in cutover discipline.
- **Total** — not estimated in day units; planning packet, Status: PLANNED. Risk is concentrated in cutover discipline and parity fidelity, not code volume.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any of the eight gates fails, the differential oracle goes non-parity, the perf gate is unmet, a scenario fails, or a pointer/generation mismatch is detected.
- **Procedure**: the default read path is `legacy` throughout, so reverting is a kill-switch mode flip plus a manifest-pointer rollback to the prior (or no) generation — not a data migration, because the flat files remain the content authority. The git-ignored `database/` is rebuildable and never committed.
- **Blast radius**: Low and reversible. Nothing is committed as a binary; the default surface is unchanged until the flip; the flip is guarded and revertible for the whole observation window.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-flip Checklist

- [ ] The differential oracle is green and the perf gate is confirmed on a real representative trace before any flip.
- [ ] The kill switch defaults `legacy`, and the manifest pointer + rollback evidence are recorded for the published generation.
- [ ] Reconciliation is verified authoritative before watchers are trusted.

### Rollback Procedure

1. **Immediate**: flip the kill switch to `legacy`.
2. **Pointer**: roll the manifest pointer back to the prior verified generation (or to none).
3. **Data**: none — the flat files are unchanged; the git-ignored `database/` is rebuildable.
4. **Verify**: confirm the default read path serves `legacy` and the differential oracle / aggregator return to the pre-flip baseline.

### Data Reversal

- **Has data migrations?** No — the generation is derived from the flat-file authority and never replaces it; rollback is a mode flip plus a pointer rollback.
- **Reversal procedure**: kill switch → pointer rollback → verify legacy serves.
<!-- /ANCHOR:enhanced-rollback -->
