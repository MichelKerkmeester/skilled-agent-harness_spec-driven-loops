---
title: "Implementation Plan: 015-Residual Correctness - RRF-scale + maintenance-grace TTL (028/001 impl)"
description: "Approach + sequencing for the two Wave-0 correctness residuals: route resolveSearchScore through the 015-calibrated absolute-relevance scale, and derive the maintenance-grace marker TTL from ownerLease.ttlMs x K with a codified phase-yield invariant. Both additive, reversible, no schema migration, no shared-infra dependency."
trigger_phrases:
  - "015 residual correctness plan"
  - "resolveSearchScore absolute relevance plan"
  - "maintenance marker ttl lease derivation plan"
  - "phase yield refresh invariant plan"
  - "wave-0 memory correctness sequencing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/021-residual-correctness"
    last_updated_at: "2026-07-04T17:51:06.364Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented both residual correctness candidates and reconciled verification evidence"
    next_safe_action: "None, phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-021-residual-correctness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: 015-Residual Correctness, RRF-scale + maintenance-grace TTL

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), Spec-Kit Memory MCP server, CJS launcher (`.opencode/bin`) |
| **Framework** | MCP handler layer (`handlers/`), storage marker (`lib/storage`), owner-lease launcher (CJS) |
| **Storage** | None new, A4 reads existing per-result fields, A7 reads/writes the existing `.maintenance-active.json` marker (no schema, no DB) |
| **Testing** | vitest (handler-scoped + marker-scoped unit tests, the existing `tests/launcher-maintenance-guard.vitest.ts`) |

### Overview

Two independent Wave-0 correctness residuals, shippable in either order.

- **A4-015-residual** routes `resolveSearchScore` / `computeAverageScore` through the absolute-relevance (0–1 cosine) signal the 015 fix already reads in `confidence-scoring.ts`, instead of the RRF ordering magnitude (`result.score` ~0.03 under `DEFAULT_K = 40`) plus the `> 1 ? /100` heuristic. The 015 fix was scoped to `confidence-scoring.ts` and never patched this re-route/average handler path, which closes the scale-mismatch residual.

- **A7-maintenance-grace-ttl** derives the marker TTL from `ownerLease.ttlMs × K (K = 3)` instead of the hardcoded `180_000`, and codifies the two implicit invariants in the module: (1) `marker-TTL > 2×-lease-reclaim` (180s > 120s), so a long blocking phase can't let both the lease heartbeat and the marker lapse together and a competing launcher reap a live mid-scan daemon. (2) "every synchronous phase longer than TTL/2 must call `maintenance.refresh()`," capping zombie reap-latency at one TTL.

Neither touches schema, the fusion math, the lease/launcher reclaim policy or any Wave-1 shared infrastructure. Both are individually reversible. The 028 research effort/leverage tags are structural inference (no benefit number is measured anywhere), so both ship for correctness and reversibility, not a benchmarked delta.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (`spec.md` §5)
- [x] Both seams read directly, the 015 fix is confined to `confidence-scoring.ts`, the marker TTL is hardcoded, the lease `ttlMs` is 60000

### Definition of Done
- [x] A4, `resolveSearchScore`/`computeAverageScore` read the absolute-relevance scale, lexical-only rows degrade gracefully, before/after magnitude captured
- [x] A7, `MAINTENANCE_MARKER_TTL_MS = ownerLease.ttlMs × K (K=3)` byte-identical at 180000, the two invariants documented in the module
- [x] Focused handler + marker tests pass, `launcher-maintenance-guard.vitest.ts` still green
- [x] Typecheck + build green, `validate.sh --strict` on this packet passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two surgical correctness edits at confirmed seams. A4 is a single-function scale correction with a graceful-fallback guard. A7 is a constant-derivation change plus invariant documentation. No new modules, no new state, no schema.

### Key Components
- **`handlers/memory-search.ts:494-508`** (A4): `resolveSearchScore` currently prefers `result.score` (RRF magnitude) and applies `> 1 ? /100`, and `computeAverageScore` averages over it. Reroute to the absolute-relevance signal, ideally via the same `resolveAbsoluteRelevance` helper the 015 fix uses (`pipeline/types.ts:89-95`), so the two paths cannot drift again.
- **`lib/search/confidence-scoring.ts:343,402-403`** (A4 reference, read-only): the 015 fix, "Absolute relevance, not the RRF ordering score … an RRF-magnitude topScore (~0.03)". This is the scale `resolveSearchScore` must match.
- **`lib/storage/maintenance-marker.ts:23-26,44-51`** (A7): owns `MAINTENANCE_MARKER_TTL_MS` (hardcoded `180_000`) and writes `activeUntilMs = Date.now() + TTL`. Derive the TTL from the lease window, document the two invariants in the module comment + `refresh()` doc.
- **`.opencode/bin/mk-spec-memory-launcher.cjs:419,455-456,524-525`** (A7 reference, read-only): the owner-lease `ttlMs:60000`, the `ttlMs * 2 = 120s` stale-reclaim window and the `ttlMs/2 = 30s` heartbeat, the base A7 derives from. The `shouldAdoptDespiteProbe` guard (`:819-823,1687-1689`) is the consumer that the marker protects, unchanged.

### Data Flow
- **A4**: search results → `computeAverageScore` → `resolveSearchScore(result)` per row → (new) absolute-relevance read where `row.similarity` is present, effective-score fallback otherwise → averaged on the 015-calibrated 0–1 scale (was: averaged on the RRF magnitude).
- **A7**: marker `writeMarker()` → `activeUntilMs = now + (ownerLease.ttlMs × K)` (was: `now + 180_000`) → launcher reads the marker → `shouldAdoptDespiteProbe` refuses to reap while fresh. The derived TTL (180s at K=3) stays > the 120s reclaim window by construction, now test-guarded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Two correctness edits touching (A4) a recall-confidence read path and (A7) a daemon-lifecycle marker, inventory the consumers so the scale change and the TTL derivation don't break a downstream contract.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/memory-search.ts:494-499` (`resolveSearchScore`) | Resolves a per-result score, preferring RRF magnitude + `>1?/100` | Update, read the absolute-relevance signal (015 scale) | `rg -n "resolveSearchScore\|computeAverageScore" handlers/` |
| `handlers/memory-search.ts:502-508` (`computeAverageScore`) | Averages `resolveSearchScore` across results | Unchanged structurally, reads the corrected scale | `rg -n "computeAverageScore" .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'` |
| `lib/search/confidence-scoring.ts:343,402-403` (015 fix) | Reads absolute relevance, not RRF score | Reference only, A4 matches this scale | `rg -n "Absolute relevance\|RRF ordering score" lib/search/` |
| `lib/storage/maintenance-marker.ts:23-25` (TTL constant) | Hardcoded `180_000` | Update, derive from `ownerLease.ttlMs × K` | `rg -n "MAINTENANCE_MARKER_TTL_MS" .opencode/skills/system-spec-kit/mcp_server` |
| `.opencode/bin/mk-spec-memory-launcher.cjs` (lease + guard) | Owner lease `ttlMs:60000`, reclaim `×2`, `shouldAdoptDespiteProbe` | Reference only, A7 derives the marker TTL from this, policy unchanged | `rg -n "ttlMs\|shouldAdoptDespiteProbe\|activeUntilMs" .opencode/bin/mk-spec-memory-launcher.cjs` |

Required inventories:
- A4 callers: `rg -n 'resolveSearchScore|computeAverageScore' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'`, confirm whether the `>1?/100` branch has any non-RRF caller before removing it.
- A7 readers: `rg -n 'MAINTENANCE_MARKER_TTL_MS|activeUntilMs|readMaintenanceMarker|shouldAdoptDespiteProbe' .opencode/skills/system-spec-kit/mcp_server .opencode/bin`, confirm the launcher only reads `childPid` + `activeUntilMs` (so a derived-but-identical TTL is transparent).
- A4 matrix axes: result row × (`similarity` present / absent) × (RRF magnitude vs cosine-scale). A7 matrix axes: lease `ttlMs` value × `K` × (derived TTL > 2× reclaim?).
- Invariants: A4, average reads the 0–1 absolute scale where the vector lane fired, effective-score fallback otherwise, never throws on a null `similarity`. A7, `derived TTL = ttlMs × K`, `K > 2`, `derived TTL > 2× reclaim window`, on-disk value byte-identical at K=3.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: A4, 015-residual RRF-scale (DONE)
- [x] Independently verify the residual: confirm the 015 fix lives only in `confidence-scoring.ts` and `resolveSearchScore` is the unpatched re-route path (REQ-002)
- [x] Capture the before baseline: `computeAverageScore` value for a fixed query set
- [x] Route `resolveSearchScore` through the absolute-relevance read (reuse `resolveAbsoluteRelevance` where present), gated on `typeof row.similarity === 'number'`, with effective-score fallback for lexical-only rows
- [x] Resolve the `> 1 ? /100` heuristic per the caller inventory (remove if dead, else keep for the raw-cosine path)
- [x] Capture the after baseline, record the magnitude delta

### Phase 2: A7, maintenance-grace TTL as a relationship (DONE)
- [x] Introduce/locate a shared `LEASE_TTL_MS` (60000) source, derive `MAINTENANCE_MARKER_TTL_MS = LEASE_TTL_MS × K (K=3)`, byte-identical 180000
- [x] Document the `marker-TTL > 2×-lease-reclaim` invariant (180s > 120s, 60s margin) in the module comment
- [x] Document the phase-yield invariant ("any synchronous phase > TTL/2 must call `maintenance.refresh()`") in the `refresh()` doc, confirm the existing 200-row / phase-boundary refresh hooks satisfy it
- [x] Leave the lease heartbeat, reclaim window, and `shouldAdoptDespiteProbe` guard untouched

### Phase 3: Verification
- [x] A4 unit test: fixture row (RRF ~0.03 + cosine ~0.8) → average on cosine scale, lexical-only row → effective-score fallback, no throw
- [x] A7 unit test: `MAINTENANCE_MARKER_TTL_MS === ttlMs × K`, `K > 2`, derived `> 2× reclaim`, `launcher-maintenance-guard.vitest.ts` still green
- [x] Typecheck + build, A4 before/after magnitude recorded
- [x] `validate.sh --strict` on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (A4) | `resolveSearchScore`/`computeAverageScore`: similarity-present → absolute scale, similarity-absent → effective-score fallback, no throw on null | vitest |
| Unit (A7) | Marker TTL derivation: `=== ttlMs × K`, `K > 2`, `> 2× reclaim`, `activeUntilMs` still `now + TTL` | vitest |
| Regression | `launcher-maintenance-guard.vitest.ts` adopt/reap cases unchanged, A4 magnitude delta captured (baseline rule) | vitest |
| Build | typecheck + dist build of the MCP server | `tsc` / package build |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 015 fix in `confidence-scoring.ts` | Internal (reference) | Green, shipped, defines the absolute scale A4 matches (`:343,402-403`) | A4 has no calibration target |
| `resolveAbsoluteRelevance` helper (`pipeline/types.ts:89-95`) | Internal | Green, present | A4 must inline the absolute read instead of reusing the helper |
| Owner-lease `ttlMs` (60000) | Internal (launcher) | Green, CONFIRMED (`mk-spec-memory-launcher.cjs:419`) | A7 has no base for its derivation |
| `shouldAdoptDespiteProbe` guard + marker reader | Internal (launcher) | Green, present, unchanged | A7 protects this consumer, no change needed |
| Eval harness / Wave-1 shared infra | Internal | N/A, **decoupled** | Both candidates are Wave-0 always-on, no harness or shared-infra dependency [`../../research/synthesis/08-retrieval-evaluation-findings.md:14,69-76`] |

**Sequencing**: A4 and A7 are independent, ship in either order. **Gate**: always-on Wave-0 correctness, A4 verify-independently-first (`[INFERRED]`), both NOT schema-migration, NOT shared-infra-dep. A7 carries one soft cross-module read (the lease `ttlMs`), keep it a shared constant or a documented inline derivation, not an import of launcher internals.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A4's scale change breaks a downstream consumer of `computeAverageScore`, or the absolute read throws on an unexpected row shape. A7's derived TTL diverges from 180000, or the marker shape breaks the launcher guard.
- **Procedure**: branch-only, two independent hunks.
  - A4, revert the single `memory-search.ts` `resolveSearchScore` hunk, the RRF-magnitude read returns. No state to undo.
  - A7, revert the `maintenance-marker.ts` derivation back to the literal `180_000`, the on-disk value is unchanged either way (K=3), so a revert is behavior-neutral. The lease/launcher policy was never touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Seam reads (A4 + A7) -> A4 015-residual RRF-scale  -> Verification
                     -> A7 maintenance-grace TTL    -> Verification
```

A4 and A7 are independent, neither blocks the other, so the two implementation phases run in parallel and converge at verification.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Seam reads (A4 + A7) | 015 fix shipped in `confidence-scoring.ts`, live lease `ttlMs` 60000 | A4, A7 |
| A4, 015-residual RRF-scale | Seam reads, `resolveAbsoluteRelevance` helper present | Verification |
| A7, maintenance-grace TTL | Seam reads, lease `ttlMs` as derivation base | Verification |
| Verification | A4 + A7 | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimate |
|-------|------------|----------|
| Seam reads + A4 independent verification | Low | In-session (the `[INFERRED]` confirmation crux) |
| A4, reroute `resolveSearchScore` + fallback + heuristic disposition | Low | In-session (single-function scale correction) |
| A7, TTL derivation + two invariant comments | Low | In-session (constant-derivation edit) |
| Verification (unit + regression + before/after magnitude) | Medium | In-session (no benchmark, baseline-delta capture) |

> The "S" effort tags are structural inference, not a build measurement. The whole 028 campaign carries no measured benefit number. Both ship for correctness and reversibility.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist
- [x] No live database shard modified (A4 is a per-result read, A7 is a constant derivation).
- [x] No host daemon touched, A7 leaves the lease heartbeat, reclaim window and `shouldAdoptDespiteProbe` guard unchanged.
- [x] A7 on-disk marker value verified byte-identical at K=3 (180000), A4 score-magnitude before/after captured.

### Rollback Procedure
1. A4, revert the single `memory-search.ts` `resolveSearchScore` hunk, the RRF-magnitude read returns. No state to undo.
2. A7, revert the `maintenance-marker.ts` derivation to the literal `180_000`, the on-disk value is unchanged either way (K=3), so the revert is behavior-neutral.
3. Re-run typecheck, build, the focused handler + marker tests, `launcher-maintenance-guard.vitest.ts` and strict spec validation.

### Data Reversal
- **Has data migrations?** No, neither candidate touches schema or the DB. A7 reads/writes only the existing `.maintenance-active.json` marker with an identical value.
- **Reversal procedure**: Not needed, tests use in-memory fixtures, and the marker value is byte-identical across the change.
<!-- /ANCHOR:enhanced-rollback -->
