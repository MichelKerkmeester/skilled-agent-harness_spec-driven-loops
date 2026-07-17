---
title: "Feature Specification: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)"
description: "Retention, recall-diversity and erasure-surface result-shaping for the Spec-Kit Memory MCP: 6-label forget-allowlist, the C7-A session/spec-folder dominance cap, spare-only forget eligibility, constitutional never-truncate-always-surface, trust-gated quarantine, plus the threat-model-gated erasure deferrals (cascade-refuse-whole, namespace-authorize-before-erase, writer-signing). Mined from aionforge-forget + retrieval.md + consolidation.md + provenance-signing.md."
trigger_phrases:
  - "memory retention forgetting impl"
  - "forget allowlist dominance cap"
  - "spare only forget eligibility"
  - "trust gated quarantine"
  - "erasure cascade namespace authorize writer signing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/011-retention-forgetting"
    last_updated_at: "2026-07-04T17:51:08.036Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented retention spare-only eligibility + incoming-edge allowlist"
    next_safe_action: "Run strict validation, then continue semantic edge layer"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-011-retention-forgetting"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
# Feature Specification: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | in_progress |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-speckit/028-memory-search-intelligence/001-speckit-memory |
| **Source research** | `../research/research.md` + `../../research/roadmap.md` + `../../research/synthesis/01-go-candidates.md` + `06` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec-Kit Memory MCP retains and recalls memories with no diversity or eligibility shaping at the result-set boundary. Three concrete gaps were confirmed by the 028/001 deep-research loop: (1) forget eligibility is incomplete, the feedback-retention reducer only spares by tier/pin (`feedback-retention-reducer.ts:153-155`), so a non-`important` row with strong positive feedback is annotated yet still deletes, and there is no live-edge protection against forgetting a still-referenced memory, (2) there is NO session/spec-folder dominance cap anywhere in the search pipeline (`stage4-filter.ts:305-309` truncates with a bare `slice(0, limit)`), so one chatty session or dominant spec-folder can occupy the entire top-k, (3) the constitutional always-surface prefix counts toward the recall limit but is never itself capped (`vector-index-queries.ts:435`), so constitutional rows can silently fill the slice and starve regular results. The erasure surface (hard-purge cascade, per-namespace authorization, signed writes) is partially modelled in aionforge but unbuilt here.

### Purpose
Ship the result-shaping retention/recall-diversity candidates faithful to the 028/001 research: forget-allowlist + spare-only eligibility (forget correctness), C7-A dominance cap + never-truncate-always-surface (recall diversity), trust-gated quarantine (reconsolidation safety), and record the erasure-surface candidates as own-packet / threat-model-gated deferrals so nothing is silently dropped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Forget correctness:** `M-spare-only-eligibility` (strict-AND extendable tiers + finite-guards + trust/unreferenced/age axes) and `forget-allowlist` (6-label live-edge allowlist for the `unreferenced` axis).
- **Recall diversity:** `C7-A` session/spec-folder dominance cap (default 3, spill-if-underfilled) before the stage-4 final slice, and `M-never-truncate-always-surface` (cap the constitutional always-surface prefix so it cannot starve regular results).
- **Reconsolidation safety:** `M-trust-gated-quarantine` (trust gate before `reconsolidate()` routes a merge, quarantine the low-trust side via CONTRADICTS edge-presence read-exclusion, default-OFF flag).
- **Deferrals (record only, do not implement):** `M-erasure-cascade-refuse-whole`, `M-namespace-authorize-before-erase`, `M-writer-signing`, grouped here as the erasure surface, each documented with its gate and seam.

### Out of Scope
- The erasure-surface candidates themselves (cascade / namespace-authorize / writer-signing), own-packet / threat-model-gated, this spec records them, it does not build them.
- Physical deletion / retention-TTL mechanics (027 already owns TTL sweeping, edge-presence currentness is a separate sibling concern, bi-temporal C3-* is in a different sub-phase).
- The other three subsystems (code-graph, skill-advisor, deep-loop), covered by sibling 028 phases.
- Benchmark calibration of cap thresholds and the never-truncate result-set change (owned by the implementation packet, gated, see §6).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback-retention-reducer.ts` | Modify | Spare-only: extend `EXTENDABLE_TIERS`, full AND-conjunction, finite-guards, trust/age axes (`:15,:101-114,:153-162`) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts` | Modify | `unreferenced` axis reads live incoming edges from the 6-label allowlist (`:142-262`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts` | Modify | Insert C7-A dominance-cap partition before the final `slice(0, config.limit)` (`:305-309`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modify | Cap the constitutional always-surface prefix so it does not consume the whole limit (`:435`) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | Modify | Trust gate before merge routing, quarantine low-trust side, default-OFF flag (`:114-163`, `:121`) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Register the new default-OFF flags (forget-learning gate already present, add quarantine flag) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0: Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **M-spare-only-eligibility**, forget eligibility is a strict AND over independent axes where any single axis can only SPARE, never doom, extend the single-tier gate, non-finite importance/trust SPARE (`is_finite` checked BEFORE the comparison), refuse both-floors-at-ceiling at config-validate. | `evaluateFeedbackRetention` spares a non-`important` row with strong positive feedback (today it annotates-but-deletes), a `-inf`/`NaN` decayed importance never dooms a row, ships double-gated OFF (`SPECKIT_FEEDBACK_RETENTION_LEARNING` + `mode=shadow`) so it is dark + audit-observable. [research: deltas/iter-016 `M-spare-only-feasibility`, deltas/iter-032 `H32-01`, `feedback-retention-reducer.ts:15,101-114,153-162`] |
| REQ-002 | **C7-A dominance cap**, admit at most N (default 3) rows per `spec_folder`/`sessionId` before the stage-4 final slice, overflow to a spill list, append spill only if the primary set is under `config.limit` (spill-if-underfilled). | A score-ordered result set dominated by one spec-folder is reordered so no single folder exceeds N until the limit can't otherwise be filled, in-place partition before the existing slice, no scoring change, cap key configurable (`spec_folder` primary, `sessionId` secondary). [research: deltas/iter-004 `c7-a`, `stage4-filter.ts:305-309`, aionforge `retrieval.md:289-293`] |

### P1: Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | **forget-allowlist**, the `unreferenced` forget axis reads LIVE incoming edges from an explicit 6-label allowlist (`DERIVED_FROM`/`SUPPORTS`/`DEPENDS_ON`/`RELATES_TO`/`HAS_FAILURE`/`MENTIONS`), NOT the loss-tolerant `referenced_count` cache, AUDIT/provenance/scope edges deliberately excluded. | A memory with a live `DERIVED_FROM`/`SUPPORTS` incoming edge is spared, an ambient-bookkeeping (audit/scope) edge does NOT spare, needs a label column / live-edge read, design rule honored ("an allowlist matching everything forgets nothing"). [research: deltas/iter-012 `M-edge-allowlist-unreferenced`, deltas/iter-032 `H32-02`, `memory-retention-sweep.ts:142-262`] |
| REQ-004 | **M-never-truncate-always-surface**, the constitutional always-surface prefix is itself capped so it cannot fill the slice and starve regular results. | Constitutional rows are surfaced but bounded, a large constitutional set no longer evicts all regular results, benchmark-gated (result-set change, see §6). Distinct from C7-A. [research: synthesis/01 `M-never-truncate-always-surface` (GO benchmark-gated), `vector-index-queries.ts:435`] |
| REQ-005 | **M-trust-gated-quarantine**, a contradiction is quarantined only when either side ≥ `high_trust_threshold` (0.7), recall excludes the low-trust victim by CONTRADICTS edge-presence (nothing destroyed), a surfaced reconcile signal names victim/trust/survivor, gated before `reconsolidate()` behind a default-OFF flag. | Today `reconsolidation-bridge` is advisory-only (no trust gate, no recall-exclusion, no signal), after, a low-trust contradiction is excluded-by-edge-presence and a reconcile signal is emitted, flag default-OFF (e.g. `SPECKIT_RECONSOLIDATION`). [research: deltas/iter-013 `M-trust-gated-quarantine`, deltas/iter-018 `M-trust-quarantine-feasibility`, `reconsolidation-bridge.ts:114-163`] |
| REQ-006 | **Erasure-surface deferrals recorded**, `M-erasure-cascade-refuse-whole`, `M-namespace-authorize-before-erase`, `M-writer-signing` documented with gate + seam, NOT implemented. | §6 + tasks.md carry each deferral with its disposition (own-packet / single-tenant-N/A) and seam, no code touched. [research: synthesis/01 §200-iter recovery, deltas/iter-012, iter-014, iter-019] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two P0 candidates (spare-only eligibility, C7-A dominance cap) are implemented with the research-cited acceptance criteria, default-OFF/reversible and primary score order unchanged where the candidate is order-preserving.
- **SC-002**: Each of the 8 candidates carries an explicit per-candidate STATUS in §6 (PENDING with its gate, or DONE with the 030 §14 commit hash), faithful to the 028/001 research and the 030 Wave-0 shipped record.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Per-Candidate STATUS (8 candidates, none shipped in Wave-0)

> Confirmed against the Wave-0 record + `git log 1ecc531431..HEAD`: NONE of these 8 candidates appeared in the Wave-0 shipped record (candidates 1-13 there are Q6-anchor / C9 / ANN-tiebreak / C5-B / C-X1+C6-A / two-primitive-id / gauges / skip-closed / CAS-guard / Deep-Loop-trio / Q4-C1, plus deferred C4-A and M-system-kind-exclusion). Current implementation status is tracked below.

| Candidate | STATUS | Gate | Seam (file:line) | Evidence |
|-----------|--------|------|------------------|----------|
| `M-spare-only-eligibility` | **DONE** | `SPECKIT_RETENTION_FORGETTING_V1` default-OFF, existing feedback-retention learning/mode gate still controls sweep enforcement | `feedback-retention-reducer.ts`, `search-flags.ts`, `flag-ceiling.vitest.ts` | Implemented strict spare axes, finite-guards, trust/age thresholds and both-floors-at-ceiling refusal. Verification: `feedback-retention-reducer.vitest.ts`, new flag registered in flag ceiling known-list. |
| `forget-allowlist` | **DONE** | `SPECKIT_RETENTION_FORGETTING_V1` default-OFF, uses `causal_edges.relation` as the live label surface | `memory-retention-sweep.ts`, `vector-index-schema.ts`, `vector-index-schema-migration-refinements.vitest.ts` | Implemented live incoming-edge protection for `derived_from`/`supports`/`depends_on`/`relates_to`/`has_failure`/`mentions`, excluding ambient bookkeeping relations. Added `retention_trust_score` backfill and `idx_causal_edges_retention_incoming`, verified UP/DOWN/BACKFILL idempotency. |
| `C7-A` | **PENDING** | needs-benchmark (cap-threshold tuning), code path itself is S/clean-GAP | `stage4-filter.ts:305-309` | [CONFIRMED] deltas/iter-004 `c7-a` (S, clean GAP, no equiv), iter-006 rank 7, iter-007 Wave-4 leaf build, aionforge `retrieval.md:289-293` |
| `M-never-truncate-always-surface` | **PENDING** | needs-benchmark (result-set change, explicitly excluded from immediate ship in iter-037 J37-02) | `vector-index-queries.ts:435` | [CONFIRMED] synthesis/01 "200-iter additions" GO (benchmark-gated, distinct from C7-A), 001 iter-15 cluster |
| `M-trust-gated-quarantine` | **PENDING** | shared-infra-dep, not implemented in this schema-focused pass because it changes reconsolidation merge policy and read-time contradiction exclusion | `reconsolidation-bridge.ts:121` | [CONFIRMED] deltas/iter-013 `M-trust-gated-quarantine` (M/BUILD), deltas/iter-018 `M-trust-quarantine-feasibility` (GO best-fit graft), survived the iter-021 procedural-cluster refutation |
| `M-erasure-cascade-refuse-whole` | **PENDING (DEFER → own packet)** | own-packet (GDPR erasure surface, only in aionforge `purge_write.rs`, not the TS server) | `tools/memory-tools.ts` (GAP) | [CONFIRMED] synthesis/01 recovery table (L, DEFER → own packet), deltas/iter-016 `O16-01` (erasure is its own GDPR packet), deltas/iter-032 reference-backed |
| `M-namespace-authorize-before-erase` | **PENDING (DEFER → threat-model-gated)** | threat-model-gated (no multi-principal boundary in this single-trusted-host stdio MCP, mostly N/A) | `scope-governance.ts:289` | [CONFIRMED-seam] deltas/iter-012 `M-namespace-authorize-before-erase` (M/BUILD), deltas/iter-019 `O19-01` (namespace Authorizer correctly N/A single-tenant) |
| `M-writer-signing` | **PENDING (DEFER → threat-model-gated)** | threat-model-gated (single-trusted-host: likely out-of-scope, lineage is unsigned today, the S-effort transport hardening is the real value, recorded separately) | GAP (no sign/verify) | [CONFIRMED] deltas/iter-014 `M-writer-signing` (L/BUILD, scope-flag), deltas/iter-014 `O14-01` (record, don't promote ahead of hardening) |

### Dependencies & Risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing forget-learning double-gate (`SPECKIT_FEEDBACK_RETENTION_LEARNING` + `mode=shadow`) | spare-only must ship dark + audit-observable, not flip live | Reuse the existing gate, no new always-on behavior |
| Dependency | A live-edge label column for `forget-allowlist` | the 6-label allowlist read needs a schema/label surface, symbol not yet located | Locate the symbol first, treat as schema-migration-gated, do not ship ahead of it |
| Dependency | A no-benchmark guarantee for cap/truncate thresholds | C7-A default N and never-truncate cap are unmeasured, no candidate has a measured before/after number | Ship behind config with conservative defaults, threshold tuning is an explicit follow-up (roadmap §6) |
| Risk | C7-A reorders dominated result sets (callers expecting today's unmixed ordering) | Med | spill-if-underfilled preserves the limit, order-preserving when no folder dominates, document the contract change |
| Risk | A too-broad forget-allowlist silently disables forgetting | Med | Exclude AUDIT/provenance/scope edges deliberately (the key design rule from `forgetter.rs:41-48`) |
| Risk | Trust-gated quarantine excludes the wrong side | Med | Gate only when either side ≥ 0.7, emit a surfaced reconcile signal, nothing destroyed (edge-presence exclusion is reversible), default-OFF |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The C7-A cap is a single in-place partition over the already-sorted result list before the existing slice, O(n) over the candidate set, no additional sort, no extra query.
- **NFR-P02**: The `unreferenced` live-edge allowlist read must not regress sweep latency materially, it replaces a `referenced_count` cache read with a bounded live-edge lookup per candidate.

### Security
- **NFR-S01**: Trust-gated quarantine and all erasure-surface deferrals are default-OFF, no new always-on destructive or recall-exclusion path ships enabled.
- **NFR-S02**: The erasure deferrals must NOT introduce a persistent deny-list of erased ids (the GDPR `erasure.md` "no deny-list registry" invariant), recorded here so a future erasure packet honors it.

### Reliability
- **NFR-R01**: Spare-only eligibility is fail-safe-toward-retention: a non-finite or unvouchable value SPARES rather than doom-deletes (never destroy on a value arithmetic can't vouch for).
- **NFR-R02**: Quarantine is reversible, exclusion is by CONTRADICTS edge-presence, both nodes retained, removing the edge restores the victim.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty result set passes the C7-A cap unchanged (no spill, no reorder).
- Maximum length: when one spec-folder supplies more than N rows AND no other source can fill the limit, spill-if-underfilled re-admits the overflow to reach `config.limit`.
- Invalid format: a `NaN`/`-inf` decayed importance or trust value SPARES the row (finite-guard runs before the floor comparison).

### Error Scenarios
- A both-floors-at-ceiling forget policy is refused at config-validate as a misconfigured mass-delete.
- A missing forget-allowlist label column blocks `forget-allowlist` (PENDING gate) rather than silently forgetting referenced memories.
- A contradiction where neither side reaches the 0.7 trust threshold is NOT quarantined (advisory-only, as today).

### State Transitions
- Partial completion: spare-only ships shadow-mode first (annotated, not enforced), the audit trail is observable before enforcement.
- Session expiry: the dominance cap keys on `spec_folder` primarily and `sessionId` secondarily, so a stale/expired session id falls back to folder-grain capping.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 5-6 files, 4 implement candidates (2 P0, 2 P1) + 1 reconsolidation flag, 3 deferrals are doc-only |
| Risk | 13/25 | Result-set ordering change (C7-A), forget-eligibility correctness, default-OFF destructive-adjacent paths, reversible |
| Research | 8/20 | Research complete (028/001 7-iter + 100-iter broadening + memory-systems), seams confirmed, only empirical calibration open |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- C7-A cap key: confirm `spec_folder` is the right primary grain vs `sessionId` (the natural "one conversation dominates" unit here is a spec-folder, aionforge caps episodes, which internal lacks).
- C7-A memory-type exemption: aionforge caps only episodes and lets facts bypass, internal has no episode/fact split, so should the cap apply uniformly or carve out a memory-type exemption?
- forget-allowlist symbol: locate the exact unreferenced-allowlist symbol (NEEDS-BENCHMARK in deltas/iter-016) and confirm whether a label column or a live-edge join is the lower-blast implementation.
- never-truncate cap value: what constitutional-prefix cap preserves always-surface guarantees without starving regular results (benchmark-gated, result-set change)?
- erasure surface: is the threat model strong enough to ever justify namespace-authorize / writer-signing on a single-trusted-host stdio MCP, or do these stay permanently N/A?
<!-- /ANCHOR:questions -->
