---
title: "Phase 004: Rollout Tooling — Fleet-Enablement Removal"
description: "Wave 4 of the over-engineering removal program: delete the one-time fleet-enablement stack (F3) — enable-modes.cjs plus lib/fleet-enablement/ — and its two tests. It drove modes from legacy to new_authoritative_final; all 8 modes are already there, so it has zero operational callers. F4 (flip-authority.cjs) was resequenced into phase 005 because it shares the authority-finalize.vitest.ts test file with the phase-005 CAS mutators, so the two remove together as one whole-file test deletion."
trigger_phrases:
  - "rollout flip tooling delete"
  - "fleet enablement removal"
  - "enable-modes removal"
importance_tier: "important"
contextType: "implementation"
status: complete
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Phase 004: Rollout Tooling — Fleet-Enablement Removal

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | .../011-delete-overengineering/004-rollout-flip-tooling |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Risk** | Low-Medium — no live-loop adjacency; a self-contained one-time stack |
| **Findings** | F3 (see parent `research/research.md`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The fleet-enablement stack is a one-time tooling stack that drove deep-loop modes from
`legacy_authoritative` to `new_authoritative_final`. All 8 modes are already finalized on the ledger, so
it has no operational caller left — proven by the parent audit's repo-wide zero-caller re-proof and this
wave's own re-scan.

- **F3** — fleet-enablement stack: `scripts/enable-modes.cjs` (550 LOC) is the CLI that enabled the
  remaining modes serially from the frozen order, with a dry run and a resumable state file; it drives
  `lib/fleet-enablement/` (`enablement-driver.ts` 199 LOC, `mode-surface-map.ts` 98 LOC, `index.ts` 22 LOC).
  Referenced only by its own tests, its own README, and internal self-imports.

**Resequencing (deviation from the original F3+F4 plan, recorded during this wave's pre-flight):**
F4 (`scripts/flip-authority.cjs`) was originally planned for this phase. During pre-flight the orchestrator
found that `tests/unit/authority-finalize.vitest.ts` directly exercises `flip-authority.cjs` — it resolves
the CLI path and runs two whole `describe` blocks against it — in addition to exercising the phase-005 CAS
mutator `compareAndSwapFinalize`. Deleting `flip-authority.cjs` in this phase would have required
surgically splitting that live test file across two waves. Instead F4 was moved into phase 005, where
`flip-authority.cjs`, `flip-authority-cli.vitest.ts`, and the whole `authority-finalize.vitest.ts` are
removed together with the CAS mutators — one clean whole-file test deletion. See §8 Sequencing Note.
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
| `runtime/scripts/README.md` | `enable-modes.cjs` FILES row removed |
| `runtime/lib/README.md` | `fleet-enablement/` FILES row removed |
| `runtime/lib/legacy-projections/README.md` | § CONSUMERS bullet for `fleet-enablement/mode-surface-map.ts` removed |

### Out of Scope

- `runtime/scripts/flip-authority.cjs` and `runtime/tests/unit/flip-authority-cli.vitest.ts` — **F4,
  resequenced into phase 005** (see §2 and §8).
- The authority-registry CAS mutators (`prepareCutover`, `compareAndSwap`, `compareAndSwapFinalize`) — they
  keep their `flip-authority.cjs` caller through this phase and are reduced in phase 005.
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
  captured immediately before this wave; the 1 dead `fleet-enablement/enablement-driver.ts` error is
  expected to disappear on deletion (57 → 56).
- **REQ-003**: `verify-authority.cjs` still reports all 8 modes on ledger authority
  (`new_authoritative_final`).
- **REQ-004**: The runtime suite's failing set does not grow by name against the fresh baseline.
- **REQ-005**: `git grep` / `rg` finds no remaining reference to `enable-modes`, `fleet-enablement`, or
  `runFleetEnablement`.
- **REQ-006**: `flip-authority.cjs`, `flip-authority-cli.vitest.ts`, and `authority-finalize.vitest.ts` are
  not touched in this phase — they belong to phase 005's combined F4+F7 removal.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The F3 targets, including `lib/fleet-enablement/README.md`, and both F3 test files are gone;
  `scripts/README.md`, `lib/README.md`, and `lib/legacy-projections/README.md` cross-references fixed.
- **SC-002**: `rg` for `enable-modes|fleet-enablement|runFleetEnablement` returns zero non-deleted
  references.
- **SC-003**: tsc no new errors (57 → 56, 0 `TS2307`); authority 8/8 final; runtime suite failing-set
  unchanged by name.
- **SC-004**: One commit, well under the 100-file mass-deletion ceiling.
- **SC-005**: No capability is lost. The ongoing read-only need this tooling served — confirming all 8
  modes sit on ledger authority — stays fully covered by `scripts/verify-authority.cjs`, which imports
  neither this stack nor F4 and is untouched by this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Low-Medium — a self-contained one-time stack with no live-loop adjacency | A stray external import would break on deletion | tsc + residue backstop; zero-caller re-scan confirmed only self/tests/README |
| Dependency | Phase 005 now carries F4 (`flip-authority.cjs`) alongside F7 | Wrong sequencing breaks phase 005's whole-file test deletion | Program-level ordering (Wave 4 before Wave 5) — see §8 Sequencing Note |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope, sequencing, and verification gates are fully resolved for this wave.
<!-- /ANCHOR:questions -->

---

## 8. SEQUENCING NOTE

`flip-authority.cjs` (F4) and `enable-modes.cjs` (F3) are the **only** callers of the authority-registry
CAS mutators `prepareCutover`, `compareAndSwap`, and `compareAndSwapFinalize`. This phase deletes F3, which
removes one of those two callers; `flip-authority.cjs` keeps them alive until phase 005. Phase 005 then
removes `flip-authority.cjs`, `flip-authority-cli.vitest.ts`, and the whole `authority-finalize.vitest.ts`
together with the now-dead CAS mutators — co-locating F4 with F7 so the shared test file is deleted once,
whole, rather than split across two waves. Phase 004 leaves every phase-005 target byte-for-byte untouched.
