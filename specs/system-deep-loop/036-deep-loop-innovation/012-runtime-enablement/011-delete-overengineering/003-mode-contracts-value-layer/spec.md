---
title: "Phase 003: Mode-Contracts Value Layer — Conformance, Gate Validator, Compatibility Policy, Substrate Ports"
description: "Wave 3 of the over-engineering removal program: delete the F2 mode-contracts VALUE engine (conformance.ts, strict-gate-validator.ts, compatibility-policy.ts, substrate-ports.ts) and its test, sever index.ts to types-only, keep mode-contract-types.ts (imported import type by all 8 reducers). One export — matchesPreparedAuthorizationDecision — has a live consumer outside the deletion set and is relocated, not deleted."
trigger_phrases:
  - "mode contracts value layer delete"
  - "conformance engine removal"
  - "strict gate validator delete"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Phase 003: Mode-Contracts Value Layer

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | .../011-delete-overengineering/003-mode-contracts-value-layer |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Risk** | Low-Medium — no live-loop adjacency, but a barrel with 8 reducer consumers |
| **Findings** | F2 (see parent `research/research.md`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`mode-contracts` bundles a type-definitions file with a conformance/validation VALUE engine. The type
file is load-bearing — `mode-contract-types.ts` (471 LOC) defines `ModeContract`, `ModeReducerSet`,
`ModeReductionResult` and is imported `import type` by all 8 per-mode reducers. The value engine next to
it is not: nothing in production code calls `runModeConformance`, `evaluateModeEventWrite`,
`modeWorkstreamsFromManifest`, `resolveModeInterfaceCompatibility`, or `matchesArtifactClaimSet` — the
research audit's repo-wide re-proof confirms this (`research/research.md` §3, F2 row).

- **F2** — four value files (~1,606 LOC) plus their test (`tests/unit/mode-contracts.vitest.ts`,
  1,382 LOC) implement conformance checking, strict-gate validation, mode-interface compatibility, and
  substrate-port requirements for a migration ceremony that finished when all 8 modes reached
  `new_authoritative_final`. Every one of their exported functions is exercised only by their own test
  file, with one exception (below).

**Ground-truth deviation from the audit (found during this packet's zero-caller re-proof, not in
`research.md`):** `strict-gate-validator.ts` exports five value functions, not the one (`matchesArtifactClaimSet`)
the audit traced. Three of the other four (`hasExactKeys`, `matchesInstalledVersionBindings`, `validateRows`)
are confirmed zero-caller outside `lib/mode-contracts/` and its own test. The fourth,
`matchesPreparedAuthorizationDecision`, is imported and called by `tests/unit/authorized-ledger.vitest.ts`
(line 36, called at lines 765/782/787/789) — a live, 13-case `describe('prepared authorization identity
verification', ...)` block that is **not** part of this deletion's test target and is out of scope to
touch beyond its one import line. `matchesPreparedAuthorizationDecision` is authorized-ledger domain logic
(it imports `AuthorizationDecisionRecord` / `TransitionAuthorizationRequest` from `../authorized-ledger/index.js`)
that was housed in `mode-contracts` rather than in `authorized-ledger`; it has no callers inside
`lib/mode-contracts/` itself. It is not called from any production/runtime code — the exception is scoped
to one test file, not a live-loop regression.

**Resolution:** relocate `matchesPreparedAuthorizationDecision` (plus its three private helpers `digest`,
`isRecord`, `isDigest`) into a new file, `lib/authorized-ledger/prepared-authorization-matcher.ts`
(~90 LOC), export it from `lib/authorized-ledger/index.ts`, and repoint the one import line in
`authorized-ledger.vitest.ts` — all **before** `strict-gate-validator.ts` is deleted. This keeps the
13-case identity-verification suite green without touching its assertions.

**CRITICAL KEEP (do NOT delete):** `lib/mode-contracts/mode-contract-types.ts` (471 LOC) and its
`export type` re-exports in `index.ts`. It defines the contract shapes every reducer package needs at
compile time. This is a hard non-goal, not a soft preference — see Out of Scope below and `tasks.md` T1's
re-confirm step.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Surface | Change |
|---------|--------|
| `runtime/lib/mode-contracts/conformance.ts` | Deleted (F2, 1,120 LOC) |
| `runtime/lib/mode-contracts/strict-gate-validator.ts` | Deleted (F2, 225 LOC) — after `matchesPreparedAuthorizationDecision` + helpers relocate |
| `runtime/lib/mode-contracts/compatibility-policy.ts` | Deleted (F2, 121 LOC) |
| `runtime/lib/mode-contracts/substrate-ports.ts` | Deleted (F2, 140 LOC) |
| `runtime/lib/mode-contracts/index.ts` | Re-exported to TYPES ONLY — every value export removed |
| `runtime/lib/authorized-ledger/prepared-authorization-matcher.ts` | **New** — `matchesPreparedAuthorizationDecision` + `digest`/`isRecord`/`isDigest` relocated here |
| `runtime/lib/authorized-ledger/index.ts` | `matchesPreparedAuthorizationDecision` added to the export list |
| `runtime/tests/unit/mode-contracts.vitest.ts` | Deleted (F2, 1,382 LOC) |
| `runtime/tests/unit/authorized-ledger.vitest.ts` | One import line repointed (`../../lib/mode-contracts/index.js` → `../../lib/authorized-ledger/index.js`); no assertion changes |

### Out of Scope

- **`lib/mode-contracts/mode-contract-types.ts`** — load-bearing, KEEP in full. Its `export type * from
  './mode-contract-types.js'` line in `index.ts` stays untouched.
- All 8 reducer packages (`agent-improvement-reducers`, `deep-ai-council-reducers`,
  `deep-alignment-reducers`, `deep-improvement-common-reducers`, `deep-research-reducers`,
  `deep-review-reducers`, `model-benchmark-reducers`, `skill-benchmark-reducers`) — each imports only
  `ModeContract` / `ModeReducerSet` / `ModeReductionResult` (or similar) via `import type`; none import a
  value symbol from `mode-contracts`. Confirmed by direct read of each reducer's import block.
- `tests/unit/authorized-ledger.vitest.ts`'s test bodies, fixtures, and every assertion other than the
  one import line above.
- The live ledger loop, authorized-ledger's gateway/reducer/replay logic, and every other file under
  `lib/authorized-ledger/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: `matchesPreparedAuthorizationDecision` and its private helpers are relocated to
  `lib/authorized-ledger/prepared-authorization-matcher.ts` and exported from `lib/authorized-ledger/index.ts`
  **before** `strict-gate-validator.ts` is deleted, so `authorized-ledger.vitest.ts` never observes a
  missing import.
- **REQ-002**: `lib/mode-contracts/index.ts` exports types only after the wave — no `runModeConformance`,
  `evaluateModeEventWrite`, `modeWorkstreamsFromManifest`, `resolveModeInterfaceCompatibility`,
  `matchesArtifactClaimSet`, `hasExactKeys`, `matchesInstalledVersionBindings`, `validateRows`, or
  `matchesPreparedAuthorizationDecision` re-export remains.
- **REQ-003**: `mode-contract-types.ts` and its `index.ts` type re-exports are untouched.
- **REQ-004**: After the wave, tsc shows no new `TS2307` (module-not-found) against the 57-error baseline;
  watch specifically for any reducer package that turns out to import a mode-contracts value (not a type)
  — none are expected per the Out-of-Scope confirmation, but tsc is the backstop.
- **REQ-005**: `verify-authority.cjs` still reports all 8 modes `new_authoritative_final` on ledger
  authority.
- **REQ-006**: The runtime suite's failing set does not grow by name against the captured baseline;
  `authorized-ledger.vitest.ts`'s `prepared authorization identity verification` block (13 cases) stays
  green throughout.
- **REQ-007**: `git grep` finds no remaining reference to any deleted symbol or path, except the relocated
  `matchesPreparedAuthorizationDecision` now living under `lib/authorized-ledger/`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four value files and `tests/unit/mode-contracts.vitest.ts` are gone; `index.ts` is
  types-only; `mode-contract-types.ts` is untouched.
- **SC-002**: `lib/authorized-ledger/prepared-authorization-matcher.ts` exists, exports
  `matchesPreparedAuthorizationDecision`, and is re-exported from `lib/authorized-ledger/index.ts`.
- **SC-003**: `rg` for `runModeConformance|evaluateModeEventWrite|modeWorkstreamsFromManifest|resolveModeInterfaceCompatibility|matchesArtifactClaimSet|hasExactKeys|matchesInstalledVersionBindings|validateRows|conformance\.ts|strict-gate-validator\.ts|compatibility-policy\.ts|substrate-ports\.ts` returns zero non-deleted references, and `rg matchesPreparedAuthorizationDecision` resolves only to its new home plus its two consumer test files (`authorized-ledger.vitest.ts`; `mode-contracts.vitest.ts` no longer exists).
- **SC-004**: tsc no new errors; authority 8/8 final; runtime suite failing-set unchanged by name; the 13-case identity-verification block in `authorized-ledger.vitest.ts` passes.
- **SC-005**: One commit, well under the 100-file mass-deletion ceiling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Low-Medium — barrel has 8 reducer consumers, all type-only (see METADATA) | A stray value import would break a reducer | tsc backstop; reducer import blocks re-confirmed type-only in T1 |
| Dependency | `matchesPreparedAuthorizationDecision` has a live test consumer (`authorized-ledger.vitest.ts`) | Deleting `strict-gate-validator.ts` outright would break it | Relocated to `lib/authorized-ledger/` before deletion (§2, `tasks.md` T2) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope, sequencing, and verification gates are fully resolved for this wave.
<!-- /ANCHOR:questions -->
