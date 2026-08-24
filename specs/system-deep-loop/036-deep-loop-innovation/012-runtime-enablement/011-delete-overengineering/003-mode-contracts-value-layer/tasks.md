---
title: "Tasks: Phase 003 Mode-Contracts Value Layer"
description: "Ordered removal manifest for F2 — relocate the one live-consumer export, sever barrels, delete, verify."
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering/003-mode-contracts-value-layer"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 003 Mode-Contracts Value Layer

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Order matters: relocate the one live-consumer export **before** severing barrels, and sever every
re-export and reference **before** deleting a target file, so tsc never sees a dangling import. All paths
are under `.opencode/skills/system-deep-loop/runtime/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T1 — Re-confirm zero callers (remover, read-only)
- [ ] `rg -n "runModeConformance|evaluateModeEventWrite|modeWorkstreamsFromManifest"` across `lib/` + `scripts/` — expect only `lib/mode-contracts/` self + `tests/unit/mode-contracts.vitest.ts`.
- [ ] `rg -n "resolveModeInterfaceCompatibility|matchesArtifactClaimSet|hasExactKeys|matchesInstalledVersionBindings|validateRows"` — expect only `lib/mode-contracts/` self + `tests/unit/mode-contracts.vitest.ts`.
- [ ] `rg -n "matchesPreparedAuthorizationDecision"` — expect **one exception**: a hit in `tests/unit/authorized-ledger.vitest.ts` (line ~36 import, plus four call sites) in addition to `lib/mode-contracts/strict-gate-validator.ts` and `tests/unit/mode-contracts.vitest.ts`. This exception is known and resolved by T2 below — do not treat it as a stop condition.
- [ ] `rg -n "\bModeContract\b|\bModeReducerSet\b|\bModeReductionResult\b|ModeConvergenceHookSet|ModeProvidedCapabilities|MODE_CONTRACT_SHAPE|MODE_CONTRACT_INTERFACE_VERSION"` across all 8 reducer packages — confirm every hit is `import type` (or references a type-only import), never a value import. Re-confirms `mode-contract-types.ts` is the one KEEP file.
- [ ] STOP and report if any hit lands outside the expected set above (including the documented `matchesPreparedAuthorizationDecision` exception).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T2 — Relocate the one live-consumer export (before any deletion)
- [ ] Create `lib/authorized-ledger/prepared-authorization-matcher.ts`: move `matchesPreparedAuthorizationDecision` and its three private helpers (`digest`, `isRecord`, `isDigest`) from `lib/mode-contracts/strict-gate-validator.ts`. Import `AuthorizationDecisionRecord` / `TransitionAuthorizationRequest` as `import type` from `./authorized-ledger-types.js` (not from `./index.js`); import `canonicalBytes`/`sha256Bytes` from `../event-envelope/index.js` as today.
- [ ] `lib/authorized-ledger/index.ts`: add `export { matchesPreparedAuthorizationDecision } from './prepared-authorization-matcher.js';`.
- [ ] `tests/unit/authorized-ledger.vitest.ts`: change the `matchesPreparedAuthorizationDecision` import source from `'../../lib/mode-contracts/index.js'` to `'../../lib/authorized-ledger/index.js'` (fold into the existing authorized-ledger import block or keep as its own line — no other change to this file).
- [ ] `lib/mode-contracts/strict-gate-validator.ts`: remove the now-relocated `matchesPreparedAuthorizationDecision` function and its now-unused-here helpers if not shared with the file's other exports (re-check `hasExactKeys`, `matchesArtifactClaimSet`, `matchesInstalledVersionBindings`, `validateRows` still compile standalone before this file is deleted in T4 — they are, since none of them call `matchesPreparedAuthorizationDecision`).

### T3 — Sever barrels & references
- [ ] `lib/mode-contracts/index.ts`: remove every value export (`runModeConformance`, `evaluateModeEventWrite`, `modeWorkstreamsFromManifest`, `resolveModeInterfaceCompatibility`, `matchesArtifactClaimSet`, `hasExactKeys`, `matchesInstalledVersionBindings`, `validateRows`, `matchesPreparedAuthorizationDecision`, `ModeSubstratePortSet`, `REQUIRED_MODE_SUBSTRATE_PORTS`, `MODE_COMPATIBILITY_POLICY_VERSION`). Keep every `export type * from './mode-contract-types.js'` line and the `MODE_CONTRACT_SHAPE` / `MODE_CONTRACT_INTERFACE_VERSION` / `ModeConvergenceHookSet` / `ModeProvidedCapabilities` re-exports (all defined in `mode-contract-types.ts`, all type/const surface the reducers use).
- [ ] Confirm `index.ts`'s final export block reduces to `mode-contract-types.ts` value + type re-exports only, plus the four `export type *` lines for the files being deleted (drop the `export type *` lines for `conformance.ts`, `strict-gate-validator.ts`, `compatibility-policy.ts`, `substrate-ports.ts` too, since those files won't exist).

### T4 — Delete targets
- [ ] Delete `lib/mode-contracts/conformance.ts`.
- [ ] Delete `lib/mode-contracts/strict-gate-validator.ts`.
- [ ] Delete `lib/mode-contracts/compatibility-policy.ts`.
- [ ] Delete `lib/mode-contracts/substrate-ports.ts`.
- [ ] Delete `tests/unit/mode-contracts.vitest.ts`.
- [ ] Re-confirm `lib/mode-contracts/mode-contract-types.ts` is untouched (diff against pre-wave copy).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T5 — Verify (orchestrator runs; devin cannot run vitest)
- [ ] `node .../typescript/bin/tsc -p runtime/tsconfig.json` → no new `TS2307`; error count ≤ 57 baseline; specifically confirm none of the 8 reducer packages regress from `import type` to a broken value import.
- [ ] `node runtime/scripts/verify-authority.cjs` → 8 modes `new_authoritative_final`.
- [ ] Runtime suite (`vitest run --reporter=dot`) → failing set unchanged by name vs baseline; `tests/unit/authorized-ledger.vitest.ts` `prepared authorization identity verification` block (13 cases) passes.
- [ ] `rg` re-scan of every deleted symbol → zero non-deleted references, except `matchesPreparedAuthorizationDecision` resolving only to `lib/authorized-ledger/prepared-authorization-matcher.ts`, `lib/authorized-ledger/index.ts`, and `tests/unit/authorized-ledger.vitest.ts`.

### T6 — Commit
- [ ] One conventional commit, `<100` files, mass-deletion guard respected (not overridden).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All verification gates pass (see `spec.md` SUCCESS CRITERIA / `plan.md` TESTING STRATEGY)
- [ ] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
