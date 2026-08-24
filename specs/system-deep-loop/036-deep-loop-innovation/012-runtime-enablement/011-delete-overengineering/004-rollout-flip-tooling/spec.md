---
title: "Phase 004: Rollout & Flip Tooling — Fleet-Enablement + flip-authority.cjs Removal"
description: "Wave 4 of the over-engineering removal program: delete the one-time fleet-enablement stack (F3) and the one-time flip-authority.cjs runner (F4) and their tests. Both drove modes from legacy to new_authoritative_final; all 8 modes are already there, so both have zero operational callers. Removing them makes the authority-registry CAS mutators dead (deferred to phase 005) but does not touch authority-registry.ts."
trigger_phrases:
  - "rollout flip tooling delete"
  - "fleet enablement removal"
  - "flip-authority removal"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Phase 004: Rollout & Flip Tooling

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | .../011-delete-overengineering/004-rollout-flip-tooling |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Risk** | Medium — CAS-adjacent (see §8 Sequencing Note); no live-loop adjacency otherwise |
| **Findings** | F3, F4 (see parent `research/research.md`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Two independent one-time tooling stacks exist to drive deep-loop modes from `legacy_authoritative` to
`new_authoritative_final`. All 8 modes are already finalized on the ledger, so neither has an operational
caller left — proven by the parent audit's repo-wide zero-caller re-proof.

- **F3** — fleet-enablement stack: `scripts/enable-modes.cjs` (550 LOC) is the CLI that enabled the
  remaining modes serially from the frozen order, with a dry run and a resumable state file; it drives
  `lib/fleet-enablement/` (`enablement-driver.ts` 199 LOC, `mode-surface-map.ts` 98 LOC, `index.ts` 22 LOC).
  Referenced only by its own tests, its own README, and internal self-imports.
- **F4** — `scripts/flip-authority.cjs` (665 LOC): a one-time per-mode authority-flip runner. Referenced
  only by a comment in `verify-authority.cjs` noting it does *not* import or reuse it — i.e. zero live
  dependency.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Surface | Change |
|---------|--------|
| `runtime/scripts/enable-modes.cjs` | Deleted (F3) |
| `runtime/lib/fleet-enablement/` (`enablement-driver.ts`, `mode-surface-map.ts`, `index.ts`, `README.md`) | Deleted (F3) — whole directory removed |
| `runtime/tests/unit/enable-modes-cli.vitest.ts` | Deleted (F3) |
| `runtime/tests/unit/fleet-enablement.vitest.ts` | Deleted (F3) |
| `runtime/scripts/flip-authority.cjs` | Deleted (F4) |
| `runtime/tests/unit/flip-authority-cli.vitest.ts` | Deleted (F4) |
| `runtime/scripts/README.md` | `enable-modes.cjs` FILES row removed |
| `runtime/lib/README.md` | `fleet-enablement/` FILES row removed |
| `runtime/lib/legacy-projections/README.md` | § CONSUMERS bullet for `fleet-enablement/mode-surface-map.ts` removed |

**Note:** `runtime/scripts/README.md` has no existing row for `flip-authority.cjs` (a pre-existing README
gap, confirmed by table audit) — there is nothing to remove there, and adding the missing row is out of
scope for this deletion wave.

### Out of Scope

- `runtime/lib/per-mode-authority-flip/authority-registry.ts` — its CAS mutators (`prepareCutover`,
  `compareAndSwap`, `compareAndSwapFinalize`) become dead once F3/F4 are gone, but the reduction is
  **phase 005**, not this phase. See §8 Sequencing Note.
- `runtime/scripts/verify-authority.cjs` — unaffected; it already covers the read-only need this tooling
  once served.
- The live ledger loop: append gateway, authorized-ledger, event envelopes, projections, replay-fingerprint,
  the 8 reducers, sealed artifacts, receipts, and the authority-registry read path.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Every cross-reference (README rows, consumer lists) is severed before the target files are
  deleted (no dangling doc link or barrel re-export).
- **REQ-002**: After the wave, tsc shows no new `TS2307` (module-not-found) against a fresh baseline
  captured immediately before this wave.
- **REQ-003**: `verify-authority.cjs` still reports all 8 modes on ledger authority
  (`new_authoritative_final`).
- **REQ-004**: The runtime suite's failing set does not grow by name against the fresh baseline.
- **REQ-005**: `git grep` / `rg` finds no remaining reference to any deleted symbol or path.
- **REQ-006**: `runtime/lib/per-mode-authority-flip/authority-registry.ts` is not edited in this phase,
  even though its CAS mutators lose their only callers here. That reduction is phase 005's scope.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The F3 and F4 targets, `lib/fleet-enablement/README.md`, and their test files are gone;
  `scripts/README.md`, `lib/README.md`, and `lib/legacy-projections/README.md` cross-references fixed.
- **SC-002**: `rg` for `enable-modes|fleet-enablement|runFleetEnablement|flip-authority` returns zero
  non-deleted references.
- **SC-003**: tsc no new errors; authority 8/8 final; runtime suite failing-set unchanged by name.
- **SC-004**: One commit, well under the 100-file mass-deletion ceiling.
- **SC-005**: No capability is lost. The ongoing read-only need this tooling served — confirming all 8
  modes sit on ledger authority — stays fully covered by `scripts/verify-authority.cjs`, which imports
  neither F3 nor F4 and is untouched by this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Medium — CAS-adjacent: removing F3/F4 makes `authority-registry.ts`'s CAS mutators dead code | Could look like scope creep into `authority-registry.ts` | `authority-registry.ts` explicitly out of scope here — REQ-006; reduction deferred to phase 005 |
| Dependency | Phase 005 is blocked on this phase landing first | Wrong sequencing breaks phase 005's precondition | Program-level ordering (Wave 4 before Wave 5) — see §8 Sequencing Note |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope, sequencing, and verification gates are fully resolved for this wave.
<!-- /ANCHOR:questions -->

---

## 8. SEQUENCING NOTE

`flip-authority.cjs` (F4) and `enable-modes.cjs` (F3) are the **only** callers of the authority-registry
CAS mutators `prepareCutover`, `compareAndSwap`, and `compareAndSwapFinalize`
(`lib/per-mode-authority-flip/authority-registry.ts`). Deleting F3/F4 here makes those three methods dead
code, but reducing `authority-registry.ts` is **phase 005**'s job, not this phase's — it must run *after*
this phase lands, once the CAS mutators have no callers left to re-prove against. Phase 004 leaves
`authority-registry.ts` byte-for-byte untouched.
