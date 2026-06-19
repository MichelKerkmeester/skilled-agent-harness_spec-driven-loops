---
title: "Feature Specification: 015-Residual Correctness — RRF-scale + maintenance-grace TTL (028/001 impl)"
description: "Two always-on Wave-0 correctness residuals on the Spec-Kit Memory MCP: resolveSearchScore still reads the pre-015 RRF-magnitude scale, and the maintenance-grace marker hardcodes a 180s TTL whose load-bearing relationship to the owner-lease reclaim window is implicit. Both are additive, reversible, no schema migration, no shared-infra dependency."
trigger_phrases:
  - "015 residual correctness rrf scale"
  - "resolveSearchScore rrf magnitude residual"
  - "maintenance grace marker ttl lease window"
  - "maintenance marker ttl to ownerLease ttlMs"
  - "phase yield refresh invariant daemon reap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/021-residual-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented both residual correctness candidates and added focused tests"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../research/research.md"
      - "../../research/synthesis/08-retrieval-evaluation-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-021-residual-correctness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: 015-Residual Correctness — RRF-scale + maintenance-grace TTL

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | DONE |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/001-speckit-memory |
| **Subsystem** | Spec-Kit Memory MCP (PRIMARY) |
| **Wave** | Wave-0 (correctness, always-on, no harness/benchmark dependency) |
| **Source research** | `../../research/synthesis/08-retrieval-evaluation-findings.md` (Wave-0 §9-10); `../research/from-008-retrieval-evaluation/research.md`; `../research/from-008-retrieval-evaluation/deltas/iter-002.jsonl` (A4); `../research/from-008-retrieval-evaluation/deltas/iter-007.jsonl` (A7) |
| **Shipped record** | Wave-0 record (unchanged; this phase implements the two residuals without editing the Wave-0 implementation packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This sub-phase closes two **always-on correctness residuals** surfaced by the 008 retrieval-evaluation campaign. Both are Wave-0 — they ship independent of the eval harness, carry no schema migration, and depend on no Wave-1 shared infrastructure [research: `../../research/synthesis/08-retrieval-evaluation-findings.md:14,69-76`].

**Residual A4 — `resolveSearchScore` still reads the pre-015 RRF scale.** The 015 search-intelligence fix corrected a scale-mismatch: ranking confidence must read the **absolute** (0–1 cosine) relevance signal, not the **RRF ordering magnitude** (which lives at ~0.03 for a `DEFAULT_K = 40` fusion and is calibrated for ordering, not for thresholds). The 015 fix was scoped to `confidence-scoring.ts` and never patched the re-route / average-score handler path [CONFIRMED: `lib/search/confidence-scoring.ts:343,402-403` — "Absolute relevance, not the RRF ordering score … an RRF-magnitude topScore (~0.03)"]. The residual lives in `handlers/memory-search.ts:494-499`: `resolveSearchScore` prefers `result.score` (the RRF magnitude) and applies a `> 1 ? /100` heuristic, so `computeAverageScore` (`:502-508`) averages the wrong-scale RRF magnitude rather than the calibrated absolute relevance [CONFIRMED: `handlers/memory-search.ts:494-508`]. The campaign flagged this `[INFERRED]` and asked for independent verification before treating it as confirmed [research: `../research/from-008-retrieval-evaluation/deltas/iter-002.jsonl` — observation `A4-resolveSearchScore-residual`]; the seam read here confirms `resolveSearchScore` is the unpatched path while the 015 fix lives only in `confidence-scoring.ts`.

**Residual A7 — the maintenance-grace marker hardcodes its TTL, hiding a load-bearing relationship.** When a daemon runs a long background phase (index scan / embedding burst), it writes a `.maintenance-active.json` marker so a competing launcher **adopts** it instead of **reaping** it as wedged; the launcher's `shouldAdoptDespiteProbe` guard refuses to reap a live child that holds a fresh marker [CONFIRMED: `lib/storage/maintenance-marker.ts:5-14,44-51`; `.opencode/bin/mk-spec-memory-launcher.cjs:819-823,1687-1689`]. The marker TTL is `MAINTENANCE_MARKER_TTL_MS = 180_000` — **hardcoded**, justified only against an observed ~79s phase [CONFIRMED: `lib/storage/maintenance-marker.ts:23-25`]. The owner-lease timescales are: `ttlMs: 60000`, heartbeat = `ttlMs/2 = 30s`, stale-reclaim = `ttlMs * 2 = 120s` [CONFIRMED: `.opencode/bin/mk-spec-memory-launcher.cjs:419,455-456,524-525`]. The **load-bearing invariant is that the marker TTL (180s) must exceed the 2×-lease reclaim window (120s)** — otherwise both the lease heartbeat AND the marker can lapse together during a long blocking phase (both timers `.unref()` and starve under a blocking span), letting a competing launcher reap a live mid-scan daemon. Today that `180 > 120` ordering with its 60s margin is **implicit** — a future lease-TTL change silently breaks it [research: `../research/from-008-retrieval-evaluation/deltas/iter-007.jsonl` — candidate `A7-4-marker-ttl-to-lease-window`, finding `A7-5-phase-yield-invariant`].

### Purpose

Ship the two correctness residuals as additive, byte-behavior-preserving fixes:
- **A4**: route `resolveSearchScore` through the same absolute-relevance signal the 015 fix uses, so the average/score path reads the calibrated 0–1 scale instead of the RRF magnitude.
- **A7**: replace the hardcoded `MAINTENANCE_MARKER_TTL_MS = 180_000` with `ownerLease.ttlMs × K (K > 2)` so the TTL auto-tracks the reclaim window, and codify the phase-yield invariant — "every synchronous phase longer than TTL/2 must call `maintenance.refresh()`" — so a long phase can never let a competing launcher reap a live mid-scan daemon.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — candidate list

| Candidate | One-line | Seam | Eff | Status |
|-----------|----------|------|-----|--------|
| **A4-015-residual** | Route `resolveSearchScore` through the absolute-relevance signal (the 015-calibrated 0–1 scale) instead of the RRF-magnitude `result.score` + `>1?/100` heuristic, so `computeAverageScore` reads the same scale `confidence-scoring.ts` reads | `handlers/memory-search.ts:494-526` (vs the 015 fix at `lib/search/confidence-scoring.ts:343,402-403`) | S | **DONE** — implemented via `resolveAbsoluteRelevance`; verified by focused vitest and A4 falsifier |
| **A7-maintenance-grace-ttl** | Replace hardcoded `MAINTENANCE_MARKER_TTL_MS = 180_000` with `ownerLease.ttlMs × K (K > 2)` (K=3 keeps the value byte-identical at 180000), making the `marker-TTL > 2×-lease-reclaim` invariant explicit; codify "any synchronous phase > TTL/2 must call `maintenance.refresh()`" | `lib/storage/maintenance-marker.ts:23-36,52` (TTL derivation + `activeUntilMs`); `.opencode/bin/mk-spec-memory-launcher.cjs:419,455-456,524-525` (lease `ttlMs`/reclaim/heartbeat, read-only) | S | **DONE** — implemented with exported derivation constants; launcher policy untouched; verified by focused vitest and A7 falsifier |

> Both candidates are Wave-0 always-on correctness — additive, individually reversible, no schema migration, no eval-harness or Wave-1 shared-infra dependency [research: `../../research/synthesis/08-retrieval-evaluation-findings.md:14,69-76`]. The shipped record in packet 030 was not edited; this phase now carries the implementation record.

### Out of Scope

- The A4 **divergence-gated-reroute** NET-NEW candidate (use gate↔rank divergence *magnitude* as a widen/decompose trigger) — that is a results-affecting intelligence build, not the always-on residual [research: `../research/from-008-retrieval-evaluation/deltas/iter-002.jsonl` — candidate `divergence-gated-reroute`].
- The **divergence-magnitude telemetry** observe-only signal and the **S5-evalMode harness fix** and **cosine-math dedup** — other Wave-0 items belong to their own sub-phases [research: `../../research/synthesis/08-retrieval-evaluation-findings.md:76`].
- Any change to the eval harness, the promotion gate, the RRF fusion math itself, the lease/launcher reclaim policy, or the maintenance refresh *cadence* — A4 changes which scale is read, A7 changes how the TTL is derived and documents the refresh invariant; neither rewrites the underlying mechanism.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | A4 — route `resolveSearchScore` (`:494-499`) / `computeAverageScore` (`:502-508`) through the absolute-relevance signal (the 015-calibrated 0–1 scale), matching `confidence-scoring.ts`, instead of the RRF-magnitude `result.score` + `>1?/100` heuristic |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Modify | A7 — derive `MAINTENANCE_MARKER_TTL_MS` from `ownerLease.ttlMs × K (K=3)` instead of the hardcoded `180_000` (`:23-25`); document the `marker-TTL > 2×-lease-reclaim` invariant and the phase-yield ("`refresh()` before TTL/2") rule in the module comment + `refresh()` doc (`:13-14,29-31`) |
| Test alongside the changed handler / marker | Create/Modify | A4 — assert `computeAverageScore` reads the absolute scale for a fixture row carrying both an RRF magnitude and a cosine similarity. A7 — assert `MAINTENANCE_MARKER_TTL_MS === ownerLease.ttlMs × K`, `K > 2`, and the derived value `> 2× reclaim window`; extend `tests/launcher-maintenance-guard.vitest.ts` coverage if the marker shape changes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A4 — `resolveSearchScore` reads the same scale the 015 fix reads | `computeAverageScore` averages the absolute-relevance (0–1 cosine) signal, not the RRF ordering magnitude; the `>1?/100` magnitude heuristic is removed or made unreachable for the absolute path [CONFIRMED: `confidence-scoring.ts:343,402-403`; residual `handlers/memory-search.ts:494-508`] |
| REQ-002 | A4 — the residual is independently verified before treating it as confirmed | The research flagged A4 `[INFERRED]`; the seam read (015 fix lives only in `confidence-scoring.ts`; `resolveSearchScore` is the unpatched re-route path) is recorded as the confirmation [research: `../research/from-008-retrieval-evaluation/deltas/iter-002.jsonl` — `A4-resolveSearchScore-residual`] |
| REQ-003 | A7 — TTL auto-tracks the lease window | `MAINTENANCE_MARKER_TTL_MS = ownerLease.ttlMs × K`, `K > 2`; with the live `ttlMs = 60000` and `K = 3` the value is byte-identical (180000), so default behavior is unchanged [CONFIRMED: lease `ttlMs:60000` at `mk-spec-memory-launcher.cjs:419`; marker `180_000` at `maintenance-marker.ts:25`] |
| REQ-004 | A7 — the `marker-TTL > 2×-lease-reclaim` invariant is explicit | The derivation makes `marker TTL (180s) > stale-reclaim window (2×60s = 120s)` a stated, test-guarded relationship, not an implicit constant; a future lease-TTL change scales the marker with it [research: `../research/from-008-retrieval-evaluation/deltas/iter-007.jsonl` — `A7-4-marker-ttl-to-lease-window`] |
| REQ-005 | A7 — the phase-yield invariant is codified | The module documents "every synchronous phase longer than TTL/2 must call `maintenance.refresh()`," capping zombie reap-latency at exactly one TTL; the existing 200-row / phase-boundary refresh hooks satisfy it for the current phases [research: `../research/from-008-retrieval-evaluation/deltas/iter-007.jsonl` — `A7-5-phase-yield-invariant`; CONFIRMED refresh seam: `maintenance-marker.ts:29-31,69-71`] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | A4 — degrade gracefully where similarity is absent | The absolute signal is only interpretable where the vector lane fired (`row.similarity` present); lexical-only rows fall back to the effective score (abs-relevance == ranking score by construction) — the new read must not throw or mis-scale when `similarity` is null [CONFIRMED: `../research/from-008-retrieval-evaluation/deltas/iter-002.jsonl` — `A4-similarity-present-gate`; `pipeline/types.ts:89-95`] |
| REQ-007 | A7 — no change to the lease/launcher reclaim policy | A7 only changes how the marker TTL is *derived* and documents the refresh invariant; the lease heartbeat, reclaim window, and `shouldAdoptDespiteProbe` guard are untouched [CONFIRMED: `mk-spec-memory-launcher.cjs:455-456,819-823`] |
| REQ-008 | Both — byte-behavior-preserving by default | A4 changes which scale the average reads (a correctness fix, expected to change magnitudes — capture the before/after); A7 is byte-identical at `K=3` with the current lease TTL. Per the regression-baseline rule, A4's magnitude change is recorded, not silently shipped |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `resolveSearchScore` / `computeAverageScore` read the 015-calibrated absolute-relevance (0–1) scale; a fixture row with RRF magnitude ~0.03 and cosine ~0.8 yields the cosine-scale average, not the RRF magnitude.
- **SC-002**: `MAINTENANCE_MARKER_TTL_MS` is derived as `ownerLease.ttlMs × K (K=3)` = 180000 (byte-identical to the current constant), and a test asserts both `K > 2` and `derived TTL > 2× the lease reclaim window`.
- **SC-003**: The `maintenance-marker.ts` module documents the `marker-TTL > 2×-lease-reclaim` invariant and the "refresh before TTL/2" phase-yield rule; the launcher reclaim policy and `shouldAdoptDespiteProbe` guard are unchanged.
- **SC-004**: Typecheck, build, the focused handler + marker tests, the existing `launcher-maintenance-guard.vitest.ts`, and `validate.sh --strict` on this packet pass; A4's score-magnitude before/after delta is captured.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A4 is `[INFERRED]` in the research | The residual may be intentional or already-neutralized | Verify-first per REQ-002 — the seam read confirms `resolveSearchScore` is unpatched while the 015 fix lives only in `confidence-scoring.ts`; record the confirmation before changing code [research: `../research/from-008-retrieval-evaluation/deltas/iter-002.jsonl`] |
| Risk | A4 changes recall-confidence magnitudes | Downstream callers of `computeAverageScore` see different numbers | Per the regression-baseline rule, capture the before/after average for a fixed query set; the change is a correctness fix (reading the calibrated scale), expected and documented, not a silent regression |
| Risk | A4 lexical-only rows have no `similarity` | The absolute read could mis-scale or throw | Gate the absolute read on `typeof row.similarity === 'number'`; fall back to the effective score (zero divergence by construction) [CONFIRMED: `pipeline/types.ts:89-95`] |
| Dependency | A7 reads the lease `ttlMs` (60000) | A7 needs the lease TTL as its base | Lease `ttlMs:60000` CONFIRMED [`mk-spec-memory-launcher.cjs:419`]; surface it as a shared constant or a documented derivation so the marker module does not duplicate the literal |
| Risk | A7 cross-module coupling (marker reads lease TTL) | Marker module gains a dependency on launcher config | Keep the coupling soft — derive from a shared `LEASE_TTL_MS` constant (or document the `K × 60000` derivation inline) rather than importing launcher internals; `K=3` keeps the on-disk value identical |
| Risk | A future sync phase exceeds TTL without a yield/refresh hook | False reap of a live daemon | REQ-005 codifies the phase-yield invariant; residual risk is a *new* non-yielding phase > 180s — flagged in the module comment as the maintainer's contract [research: `A7-5-phase-yield-invariant`] |
| Risk | Effort/leverage tags are structural inference | "S" could be optimistic | The whole 028 campaign is structural inference, no measured benefit number [CONFIRMED: `../../research/synthesis/08-retrieval-evaluation-findings.md:86`]; ship for correctness/reversibility |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS (summary)

- **A4 helper reuse vs inline** — reuse `resolveAbsoluteRelevance` (`pipeline/types.ts`) or read inline? Lean: reuse, so the two scale paths cannot drift again.
- **A4 magnitude heuristic** — is the `> 1 ? /100` branch dead once the absolute path is wired? Confirm via the `resolveSearchScore` caller inventory.
- **A7 `K` margin** — `K=3` keeps 180s exactly; is "≥ 2× reclaim + one heartbeat" a more self-documenting floor?
- **A7 shared lease-TTL constant home** — a shared `LEASE_TTL_MS` module both import, or a documented inline `K × 60000`?

> Full rationale per question is in the unanchored OPEN QUESTIONS section below.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A4 adds no new query or pass — it changes which field `resolveSearchScore` reads per result; per-result cost is unchanged.
- **NFR-P02**: A7 changes a compile-time constant derivation only; the marker write path (`writeMarker`) and refresh cadence are unchanged.

### Security
- **NFR-S01**: A7 must not weaken the daemon-liveness contract — the derived TTL stays > the 2× lease-reclaim window so a live mid-scan daemon is never reaped by a competing launcher.
- **NFR-S02**: Neither change introduces secrets, network calls, or new external sinks; both are local ranking-scale / lifecycle-constant edits.

### Reliability
- **NFR-R01**: A4 never throws on a null `similarity` — lexical-only rows fall back to the effective score, preserving the existing recall-confidence path.
- **NFR-R02**: A7 keeps the on-disk marker value byte-identical at K=3, so a rollback is behavior-neutral and the launcher guard observes no change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty result set: `computeAverageScore` returns 0 for zero rows (unchanged guard at `memory-search.ts:506`).
- Lexical-only row (no vector lane): A4 reads no absolute signal; falls back to the effective score (abs-relevance == ranking score, zero divergence by construction) [`pipeline/types.ts:89-95`].
- Raw 0–100 cosine input: the `> 1 ? /100` heuristic is retained only if a non-RRF caller still feeds a 0–100 value; otherwise removed as dead (resolved by the caller inventory).

### Error Scenarios
- A4 absolute read on an unexpected row shape: gate on `typeof row.similarity === 'number'`; never throw, fall back to the effective score.
- A7 lease `ttlMs` missing/non-finite: the launcher already defaults `ttlMs` to 60000 (`mk-spec-memory-launcher.cjs:524`); the marker derivation mirrors that default so the TTL never becomes 0/NaN.
- A7 derived TTL drops below the reclaim window: a unit test asserts `derived TTL > 2× reclaim`, failing the build before such a regression can ship.

### State Transitions
- Long blocking phase (> TTL/2): the phase-yield invariant requires `maintenance.refresh()`; with the existing 200-row / phase-boundary hooks the marker is re-stamped, capping zombie reap-latency at one TTL.
- Marker lapse on a genuinely wedged daemon: unchanged — a wedged daemon cannot refresh, so the marker still expires and the daemon becomes reapable (the intended fail-safe) [`maintenance-marker.ts:13-14`].
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 2 candidates; 2 production files + focused tests; both S-effort, both DONE, no schema, no shared-infra dep |
| Risk | 11/25 | A4 changes recall-confidence magnitudes (captured, not silent); A7 touches a daemon-liveness marker — derived value byte-identical at K=3, test-guarded `> 2× reclaim` |
| Research | 10/20 | Research is code-mapped (A4 = 008 iter-002, A7 = 008 iter-007); A4 was `[INFERRED]` and verified by seam read; residual = no benchmarked numbers |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 8. OPEN QUESTIONS

- A4 surface shape: should `resolveSearchScore` reuse the exact `resolveAbsoluteRelevance` helper from the pipeline (`pipeline/types.ts`) the 015 fix uses, or compute the absolute read inline in the handler? (Lean default: reuse the existing helper so the two paths cannot drift again.)
- A4 scope of the magnitude heuristic: is the `> 1 ? candidate / 100` branch (`memory-search.ts:499`) still needed for any non-RRF caller (e.g. a raw 0–100 cosine), or is it dead once the absolute path is wired? (Confirm by enumerating `resolveSearchScore` callers before removing the branch.)
- A7 `K` value: `K=3` keeps 180s exactly; the research says `K > 2`. Is 3 the right margin, or should the margin be expressed as "≥ 2× reclaim + one heartbeat" for a self-documenting floor? (Implementation-time calibration; either preserves the current value.)
- A7 home for the shared lease-TTL constant: should `LEASE_TTL_MS` live in a shared config module both the launcher and the marker import, or should the marker document the derivation and keep `K × 60000` local? (Lean default: a single shared constant if one already exists; otherwise a documented inline derivation to avoid a new import edge.)

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Subsystem research**: `../research/research.md`
- **008 retrieval-evaluation research**: `../research/from-008-retrieval-evaluation/research.md` (A4 = iter-002, A7 = iter-007)
- **Plain-language findings (Wave-0 §9-10)**: `../../research/synthesis/08-retrieval-evaluation-findings.md`
- **Roadmap (authoritative addenda)**: `../../research/roadmap.md`
