---
title: "Feature Specification: activate the persistent styles database (build, shadow, prove, flip)"
description: "Wire and build the SQLite styles database as forward infrastructure per the operator WIRE override: freeze the facade, publish the first full-corpus generation into a git-ignored install-time/prewarm database, prove shadow parity and the perf gate, then flip the default behind a legacy kill switch only after all eight reactivation gates pass."
trigger_phrases:
  - "activate persistent styles database wire build"
  - "styles db 006 shadow parity perf gate flip"
  - "install-time prewarm distribution legacy kill switch"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/006-persistent-db-activation"
    last_updated_at: "2026-07-21T14:07:56Z"
    last_updated_by: "implementer"
    recent_action: "Built + published the first generation; shadow parity 10/10."
    next_safe_action: "Wire install-time prewarm; operator decides the default flip."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/style-library.mjs"
      - ".opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs"
      - ".opencode/skills/sk-design/styles/_db/oracle/differential-oracle.mjs"
      - ".opencode/skills/sk-design/styles/_db/generation-manifest.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-dbbuild-plan-session"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: activate the persistent styles database (build, shadow, prove, flip)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | IMPLEMENTED — build + parity + perf proven; cutover human-gated |
| **Created** | 2026-07-21 |
| **Track** | sk-design |
| **Packet** | `015-styles-database-evolution / 006-persistent-db-activation` |
| **Parent** | `015-styles-database-evolution` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `005-library-restructure` (builds on `001-foundation`'s measurement plane) |
| **Successor** | none — final phase (feature phases `002`–`004` build on the activated DB) |
| **Source** | operator WIRE override + `007-gap-remediation-research/003-db-fate` research §9/§10 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `003-db-fate` gap research recommended shelving the SQLite styles database: the JS math is tiny and parity-sensitive over 1,290 style bundles, and no measured SLO breach justified a storage swap. The operator **overrode that verdict** and decided to WIRE and BUILD the database as **forward infrastructure** — build it so later feature phases can use retrieval, vector, and multimodal capabilities the flat-file corpus cannot serve. The scaffolding for this exists but the generation does not: `001-foundation` shipped the measurement, contract, and rollback plane (69/69 tests, `validate.sh --strict` Errors:0) into the current `_db/` path, and `_engine/persistent-adapter.mjs` supports `legacy | shadow | persistent` modes (default `legacy`) — but **no SQLite generation is published on disk yet** [SOURCE: research §10 step 3 genuinely undone]. The database cannot be activated without first building the first real full-corpus generation, proving it matches the flat-file authority, and clearing the reactivation gates.

### Purpose

Execute the research §10 "Wiring Plan If Kept" as the **build roadmap** and treat the research §9 reactivation gates as the **cutover acceptance criteria**. Freeze the storage-neutral facade `styles/_engine/style-library.mjs` (`runQuery`/`runHydrate`) and the flat files as content authority; build and publish the first full-corpus generation (all 1,290 styles) into a git-ignored, install-time / prewarmed `database/` directory; wire extraction to an authoritative rebuild/reconciliation workflow; assemble a representative request corpus with human relevance judgments; run SHADOW mode to prove contract/oracle parity plus the perf gate; and flip the default to persistent **only after all eight conjunctive gates pass**, behind a retained legacy kill switch and a bounded observation window. The parity boundary is the facade — all four corpus modules call it, none imports the DB — and the proof mechanism is the differential oracle (`_db/oracle/differential-oracle.mjs`).

### Decision (FROZEN)

WIRE and BUILD — not shelve. `persistent-adapter.mjs` and the `SK_DESIGN_STYLE_DB_MODE` mode switch **stay and get built out**. Distribution is **install-time / prewarm**: no committed binary, the DB lives entirely in the git-ignored `database/` directory, and a clean checkout stays on `legacy` until an owned bootstrap runs the prewarm — **never** a lazy query-time build. The default read path stays `legacy` until every reactivation gate passes; the flip is reversible via the kill switch and a manifest-pointer rollback.

- **Overridden branch:** the research's §1/§8/§11 "shelve" verdict is not in force; only §9 (gates) and §10 (wiring plan) govern this packet.
- **Predecessor ordering:** `005-library-restructure` lands first (restructure the library), then this packet builds the first generation on top of the restructured corpus and the `001-foundation` measurement plane.
- **Parent status (given, do not re-explore):** `015-styles-database-evolution` is a phase-parent, in_progress, NOT superseded; `001-foundation`'s stale/PLANNED spec metadata is reconciled by the parent session, not this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Facade freeze** — pin `runQuery`/`runHydrate` and the flat files as the storage-neutral content authority; keep every corpus module DB-agnostic.
- **First full-corpus generation** — build and publish all 1,290 styles into the git-ignored `database/` directory, capturing size, build-time, and RSS plus publication status and rollback evidence through the `001-foundation` manifest/telemetry plane.
- **Extraction → reconciliation wiring** — connect corpus extraction to an authoritative rebuild/reconciliation workflow where watchers trigger and reconciliation owns correctness.
- **Request corpus + relevance** — assemble a representative request corpus across all four design modes and add human relevance judgments (the Phase-0 seed is explicitly not human gold).
- **Shadow + gates** — run SHADOW mode, prove 100% facade DTO/refusal/generation parity via the differential oracle, measure the §9 perf gate, exercise the failure/repair/rollback scenarios, and flip only behind the legacy kill switch after all eight gates pass.
- **Distribution + lifecycle** — install-time / prewarm bootstrap, kill-switch wiring on `SK_DESIGN_STYLE_DB_MODE`, and post-flip monitoring.

### Out of Scope

- **`005-library-restructure`** — the predecessor restructure is its own packet; this packet consumes its output, it does not perform it.
- **JS capability features** (`002-js-capabilities`) and later native/growth phases (`003-measured-native`, `004-growth`) — they build on the activated DB but are not this packet.
- **Reconciling `001-foundation`'s stale spec metadata** — owned by the parent session.
- **Committing any binary or query-time lazy build** — explicitly forbidden by the distribution decision.
- **Content authoring** — the flat files remain the content authority; this packet changes storage/retrieval activation, not style content.

### Files to Change

**Reference-only measurement plane (already shipped by `001-foundation`, not modified here):**

| File / Path | Role |
|-----------|------|
| `styles/_db/generation-manifest.mjs` | Versioned generation manifest + pointer used to publish and roll back generations |
| `styles/_db/stage-telemetry.mjs` | Stage telemetry the build must capture (size/build-time/RSS) |
| `styles/_db/canonical.mjs` | Canonicalization used for parity comparison |
| `styles/_db/oracle/differential-oracle.mjs` | The parity proof mechanism for shadow mode |
| `styles/_db/oracle/{query-set,replay-fixtures,relevance-judgments}.mjs` | Query set, replay fixtures, and the (non-human) relevance seed |
| `styles/_db/oracle/golden/` | Golden fixtures |

**Surfaces the build WILL change (during implementation, not in this planning packet):**

| File / Path | Change Type | Description |
|-----------|-------------|-------------|
| `styles/_engine/style-library.mjs` | Freeze | Pin `runQuery`/`runHydrate` + flat files as content authority |
| `styles/_engine/persistent-adapter.mjs` | Build out | Wire `legacy`/`shadow`/`persistent` behavior + the install-time prewarm bootstrap + kill switch |
| `database/` (git-ignored) | Create | Publish the first full-corpus generation; never committed |
| Extraction → reconciliation workflow | Wire | Watchers trigger; reconciliation owns correctness |
| Request corpus + relevance judgments | Author | Representative trace across four modes + human labels |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Install-time / prewarm distribution | No committed binary; the DB lives only in the git-ignored `database/` dir; a clean checkout stays on `legacy` until an owned bootstrap runs the prewarm; **no** lazy query-time build path exists anywhere |
| REQ-002 | Facade frozen as content authority | `runQuery`/`runHydrate` + the flat files are the storage-neutral content authority; all four corpus modules call the facade and none imports the DB |
| REQ-003 | First full-corpus generation published | The first real generation of all 1,290 styles is built and published into `database/` with captured size, build-time, and RSS plus publication status and rollback evidence through the `001-foundation` manifest/telemetry plane |
| REQ-004 | Shadow-mode contract parity | SHADOW mode proves 100% facade DTO / refusal / generation parity against the flat-file authority via a green differential oracle before any default flip |
| REQ-005 | Perf gate measured before flip | The §9 perf gate — persistent shows ≥30% **and** ≥25 ms absolute p95 improvement over legacy on a real representative trace, or legacy breaches an approved SLO — is measured on real shadow data before any default flip; both thresholds are proposed, confirmed on measurement |
| REQ-006 | Default legacy until all eight gates pass | The default read path stays `legacy` until all eight conjunctive reactivation gates pass; the flip is behind a retained legacy kill switch + a bounded observation window + monitoring |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Extraction → reconciliation wiring | Corpus extraction connects to an authoritative rebuild/reconciliation workflow; watchers only trigger and reconciliation owns correctness |
| REQ-008 | Representative request corpus + human relevance | A representative request corpus spans all four design modes and carries human relevance judgments; the Phase-0 seed is not treated as human gold |
| REQ-009 | Scenario coverage | Clean-checkout, stale-corpus, interrupted-build, pointer-mismatch, missing-artifact, repair, and rollback scenarios are all exercised and pass |
| REQ-010 | Monitoring + post-window decision | Post-flip monitoring covers latency, publication failures, pointer/generation mismatch, vector-queue health, and fallback use; after the window either persistent is confirmed and dual-mode complexity removed, or the kill switch + manifest-pointer rollback reverts to legacy |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No lazy query-time build path exists; a clean checkout resolves `legacy` until the owned prewarm bootstrap runs, and no binary is committed (the DB is present only under the git-ignored `database/`) (REQ-001).
- **SC-002**: The facade is frozen — a scan confirms all four corpus modules call `runQuery`/`runHydrate` and none imports the DB directly (REQ-002).
- **SC-003**: The first full-corpus generation of all 1,290 styles is published under `database/` with captured size/build-time/RSS and manifest-recorded status + rollback evidence (REQ-003).
- **SC-004**: SHADOW mode reports 100% facade DTO/refusal/generation parity with a green differential oracle before any flip (REQ-004).
- **SC-005**: The §9 perf gate is measured on a real representative trace and both proposed thresholds (≥30% and ≥25 ms p95) are confirmed on shadow data, or an approved-SLO breach is recorded, before the flip (REQ-005).
- **SC-006**: The default read path is `legacy` until all eight conjunctive gates pass; the flip is reversible via the retained kill switch + manifest-pointer rollback, and monitoring is live for the observation window (REQ-006, REQ-009, REQ-010).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Perf thresholds (≥30% / ≥25 ms p95) are proposed, not observed | High | Treat both as hypotheses; confirm on a real representative trace in shadow before any flip (REQ-005); no flip on unmeasured numbers |
| Risk | A lazy query-time build slips in and blocks clean checkouts | High | Install-time / prewarm only; a clean checkout stays `legacy` until an owned bootstrap prewarms (REQ-001) |
| Risk | Relevance seed mistaken for human gold | Med | Author a human-labeled request corpus across four modes; the Phase-0 seed is a starting fixture only (REQ-008) |
| Risk | Watcher-only reindexing misses events → silent staleness | Med | Reconciliation owns correctness; watchers only trigger (REQ-007) |
| Risk | Pointer / generation mismatch after publish | Med | Manifest-recorded pointer + rollback evidence; mismatch is a monitored, revertible scenario (REQ-009, REQ-010) |
| Risk | Dual-mode complexity persists indefinitely | Low | Post-window decision either removes dual-mode or reverts via the kill switch (REQ-010) |
| Dependency | `001-foundation` measurement/contract/rollback plane | Cannot measure parity, telemetry, or rollback without it | Built + verified (69/69 tests, `validate.sh --strict` Errors:0); consumed as-is |
| Dependency | `005-library-restructure` predecessor | The first generation builds on the restructured corpus | Lands first; this packet consumes its output |
| Dependency | Facade `styles/_engine/style-library.mjs` + differential oracle | Parity boundary + proof mechanism | Present; facade frozen (REQ-002), oracle drives shadow parity (REQ-004) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- The perf gate is the §9 materiality bar: persistent must show ≥30% **and** ≥25 ms absolute p95 improvement over legacy on the representative trace, or legacy must breach an approved SLO. Both numbers are proposed and unconfirmed; no latency claim is made without a measured shadow trace. Build economics — generation size, build-time, and RSS — are captured through the Phase-0 stage telemetry and are part of the gate, not an afterthought.

### Reliability

- The executable contract is the differential oracle plus the DB test aggregator (including the 69/69 Phase-0 set). No parity, generation, or rollback claim is made without those checks green. Clean-checkout, stale-corpus, interrupted-build, pointer-mismatch, missing-artifact, repair, and rollback scenarios are required reliability gates, not optional cases.

### Security

- Comment hygiene [HARD BLOCK]: no spec/packet/phase/REQ ids in any build script, adapter, or test comment — edits carry durable intent, not annotations.
- The git-ignored `database/` directory never enters version control; no binary artifact is committed; distribution is bootstrap-driven at install time.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Clean checkout** — with no prewarm run yet, the adapter resolves `legacy`; the persistent path is never lazily built on first query.
- **Stale corpus** — a generation older than the flat-file authority is detected by reconciliation and rebuilt; the stale generation never serves the default path.
- **Interrupted build** — a partial generation is not published; the manifest pointer only advances on a complete, verified generation, and the prior generation remains servable.
- **Pointer / generation mismatch** — a manifest pointer that does not resolve to a present generation triggers fallback to `legacy` and a monitored alert, not a hard failure.
- **Missing artifact / repair** — a missing generation artifact is repairable via rebuild; until repaired, `legacy` serves.
- **Rollback** — the kill switch plus a manifest-pointer rollback returns the default to `legacy` without a data migration, because the flat files remain the content authority.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Level 2** — a bounded activation of an already-scaffolded database: freeze one facade, build one generation, wire one reconciliation workflow, author one request corpus, and run one shadow-then-flip sequence behind a kill switch. The complexity sits in **cutover discipline** (eight conjunctive gates, all measured before a reversible flip) and in **parity fidelity** (the flat files stay the content authority throughout), not in code volume. Blast radius is bounded and reversible: the default stays `legacy` until every gate passes, the DB lives only in a git-ignored directory, and rollback is a mode flip plus a pointer rollback, not a data migration.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The §9 perf thresholds (≥30% and ≥25 ms p95) are proposed; the real representative-trace numbers are unknown until shadow runs. **Deferred to measured shadow data before any flip.**
- The demand gate requires ≥2 consumers that need persistent-only, or latency alone clearing materiality; which consumers satisfy this is unresolved until the feature phases (`002-js-capabilities`) define their needs.
- The bounded observation-window length before the post-window remove-or-revert decision is not yet fixed and is set at cutover time.
<!-- /ANCHOR:questions -->
