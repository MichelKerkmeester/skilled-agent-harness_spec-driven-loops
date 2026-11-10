---
title: "Deep Research: Runtime Migration / Rollback / Over-Engineering Residue Audit"
trigger_phrases: []
---
# Deep Research: Runtime Migration / Rollback / Over-Engineering Residue Audit

**Packet:** `036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering`
**Scope:** READ-ONLY audit of `.opencode/skills/system-deep-loop/runtime/` (`lib/`, `scripts/`, `tests/`)
**Context:** All 8 deep-loop modes finalized to `new_authoritative_final`; the append-only ledger is the single write authority; legacy files are read-only projections.
**Outcome:** Investigation only. No files were edited or deleted. Actual removal is a separate, gated wave.

---

## 1. Provenance & Confidence

Three independent signals converge on the same 8 findings and the same KEEP list:

| Signal | Executor | Depth | Result |
|---|---|---|---|
| Primary | `cli-devin` · `gemini-3-7-flash-high` | 10/10 iterations (forced-depth PASS) | 8 ranked findings, ~11,282 LOC |
| Cross-check | `cli-pi` · `openrouter/stealth/ox-alpha` @ xhigh | 3 iterations (self-terminated; scope-complete) | identical 8 findings |
| Verification | This session (grep import-graph) | top 5 findings spot-checked | all confirmed within runtime scope |

Convergence of two independent models plus a hand-run import-graph check makes these findings high-confidence **hypotheses** — still to be re-proven repo-wide at deletion time.

---

## 2. Ranked Candidates (deletion-safety × LOC saved)

| Rank | ID | Candidate | Category | Prod LOC | Test LOC | Total | Risk |
|:--:|:--:|---|---|:--:|:--:|:--:|---|
| 1 | F1 | 7 per-mode `legacy-compatibility.ts` (ledger-schema) | Migration | 2,506 | ~1,800 | 4,306 | Low-Med |
| 2 | F2 | `mode-contracts` value layer (conformance/gate/policy/ports) | Over-built | 1,606 | 1,382 | 2,988 | Low-Med |
| 3 | F3 | Fleet-enablement stack (`enable-modes.cjs` + `lib/fleet-enablement/`) | Rollback | 870 | 1,180 | 2,050 | Med |
| 4 | F4 | `flip-authority.cjs` one-time flip runner | Rollback | 665 | 311 | 976 | Med |
| 5 | F5 | `hierarchical-budgets/shadow-adapters.ts` | Rollback | 164 | ~150 | 314 | Low-Med |
| 6 | F6 | `receipts-and-effect-recovery/legacy-compatibility.ts` | Migration | 93 | ~40 | 133 | Low |
| 7 | F7 | `authority-registry.ts` CAS mutators (reduce, not delete) | Rollback | ~300 | ~200 | ~500 | **High-adjacency** |
| 8 | F8 | Dead `AUTHORITY_FLIP_COMMON_*` type constants | Over-built | 15 | 0 | 15 | Very low |
| | | **TOTAL** | | **6,219** | **5,063** | **~11,282** | |

Full per-finding paths, LOC breakdown, and per-symbol import-graph proof: `lineages/gemini-flash/research.md` (10-iter primary) and `lineages/ox-alpha/research.md` (3-iter cross-check).

---

## 3. Independent Import-Graph Verification (this session)

Grep across `runtime/scripts` + `runtime/lib`, excluding each candidate's own module, its barrel, and test files:

- **F1** — `upcastLegacy*Record` / `decide*Compatibility` appear only in each module's own `index.ts` barrel; the sole live caller is `append-mode-event.cjs:233,453`, and it imports **only** the deep-research variant. The other 7 have no live caller. **deep-research's variant is LIVE — KEEP.** ✅
- **F2** — `runModeConformance`, `evaluateModeEventWrite`, `modeWorkstreamsFromManifest`, `resolveModeInterfaceCompatibility`, `matchesArtifactClaimSet` appear only in the barrel + their definitions; no production caller. ✅
- **F3** — `enable-modes` / `fleet-enablement` referenced only by self-internal imports, README, and tests. ✅
- **F4** — `flip-authority` referenced only by a comment in `verify-authority.cjs` ("does not import or reuse"). ✅
- **F7** — `prepareCutover` / `compareAndSwap` callers are exactly `enable-modes.cjs` (F3) and `flip-authority.cjs` (F4); once those are removed, the CAS mutators are dead. ✅

**Repo-wide re-proof (all 8 findings):** a whole-worktree code grep (all `.ts`/`.cjs`/`.js`/`.mjs`, excluding the runtime tree, `node_modules`, `dist`, and `specs/`) for every candidate symbol/path returned **zero external callers**. No consumer outside `runtime/` depends on any of F1–F8.

---

## 4. KEEP — load-bearing live-loop core (do NOT touch)

Authorized-ledger substrate, mode-append gateway (`append-mode-event`), event envelopes / canonical hashing, `legacy-projections/`, replay-fingerprint, the 8 per-mode reducers, sealed-artifacts, blinded-adjudication / provenance, `authority-root/` + `cutover-binding/` + `verify-authority.cjs`, the fail-closed check CLIs, `deep-research-ledger-schema/legacy-compatibility.ts` (live at `append-mode-event.cjs:453`), and `mode-contracts/mode-contract-types.ts` (imported `import type` by all 8 reducers).

The F7 read path — `AuthorityRegistry.read()`, `readDefault()`, `isValidAuthorityRecord()`, `selectAuthorityRoute()` — is load-bearing and stays.

---

## 5. Suggested wave order (for a future gated deletion pass — NOT executed here)

1. **Wave 1** (leaves): F8 dead constants, F6 recovery manifest, F5 shadow-adapters (+ barrel updates).
2. **Wave 2**: F1 seven `legacy-compatibility.ts` (delete as a SET — agent-improvement/model-benchmark/skill-benchmark internally call deep-improvement-common's compat fns) + barrel re-export removal + the legacy-compat *test blocks* within the `*-ledger-schema.vitest.ts` files (the files themselves stay). **KEEP `tests/helpers/legacy-real-log.ts`** — a shared helper imported by 6 kept ledger-schema tests, NOT removable (corrects the earlier draft that listed it for deletion).
3. **Wave 3**: F2 — delete **three** value files (`conformance.ts`, `strict-gate-validator.ts`, `compatibility-policy.ts`) + `tests/unit/mode-contracts.vitest.ts`; retain `mode-contract-types.ts`, make the barrel `index.ts` re-export `mode-contract-types.ts` only. **KEEP correction (found at build time):** `substrate-ports.ts` must ALSO be retained — `mode-contract-types.ts` imports its `ModeSubstratePorts` and `ModeSubstratePortName` types (`import type`), so its type surface is load-bearing even though its value exports (`ModeSubstratePortSet`, `REQUIRED_MODE_SUBSTRATE_PORTS`) are dead. **Pre-step:** relocate `strict-gate-validator.ts`'s `matchesPreparedAuthorizationDecision` (+ its `digest`/`isRecord`/`isDigest` helpers and the `HEX_64` constant) into a new `lib/authorized-ledger/prepared-authorization-matcher.ts` and repoint `tests/unit/authorized-ledger.vitest.ts` — that kept 13-case test calls it, so it cannot be deleted with the file.
4. **Wave 4**: F3 `enable-modes.cjs` + `lib/fleet-enablement/`; F4 `flip-authority.cjs`; their CLI test suites.
5. **Wave 5**: F7 reduce `authority-registry.ts` — remove `prepareCutover`/`compareAndSwap`/`compareAndSwapRollback` (and account for `compareAndSwapFinalize`), keep the read path; gate on the gateway test suite.

Each wave: re-grep repo-wide (not just runtime) to re-prove zero callers, sever imports first, then re-run tsc + authority verify + the runtime suite before committing. Respect the mass-deletion guard; split >100-file removals into dependency-ordered <100-file commits.

---

## 6. Caveats before acting

- Repo-wide zero-caller re-proof is **done and clean** (§3); still re-grep per symbol at deletion time in case new callers land before the wave runs.
- F1/F2 require barrel (`index.ts`) edits, not just file removal.
- F7 carries an extra CAS-family method (`compareAndSwapFinalize`) beyond the three named — handle it in the same reduction.
- The earlier capsule's "3 orphaned modules" (certificate-binding-core, compatibility-shadow, cross-mode-closures) did not surface under these names — likely already removed in the completed deletion mission; this audit found a distinct, larger residue set.
