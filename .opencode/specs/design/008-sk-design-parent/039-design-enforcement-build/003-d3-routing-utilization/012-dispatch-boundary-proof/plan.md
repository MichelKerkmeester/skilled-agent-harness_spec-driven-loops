---
title: "Implementation Plan: D3-R12 — Dispatch-boundary child proof"
description: "Additive plan to add a DESIGN_BOUNDARY_PROOF v1 envelope + requiresDesignBoundaryProof fixture, one shared design_dispatch_boundary.md asset, and a CLI template-parity checker, with the hubRoute 13/5/0 route-gold gate held unchanged."
trigger_phrases:
  - "d3-r12 dispatch boundary proof plan"
  - "design boundary proof build plan"
  - "design dispatch boundary parity checker"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/012-dispatch-boundary-proof"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every plan gate and phase done with one-line delivery evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/shared/design_dispatch_boundary.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D3-R12 — Dispatch-boundary child proof

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) for the checker/validator; Markdown for the shared asset and the SKILL.md edit; JSON for fixtures |
| **Skill surface** | `sk-design` (design-interface mode packet + `shared/` contracts) |
| **Harness** | Lane C skill-benchmark scripts under `deep-loop-workflows/deep-improvement/scripts/skill-benchmark/` |
| **Testing** | Vitest (mirrors `tests/design-token-lint.vitest.ts`) + `node --check` syntax gate + CLI exit-code probes |
| **Enforcement class** | hybrid (envelope presence + asset parity are machine-checkable; applied design quality stays advisory) |

### Overview

Dispatch across the design-interface boundary currently has no machine-checkable proof that a dispatched child honored the design contract, and the shared boundary doc would be duplicated by hand and could drift silently. This phase adds three coupled, strictly-additive pieces:

1. A `DESIGN_BOUNDARY_PROOF v1` envelope contract that binds the routed/observed workflow mode (the `ROUTED:` declaration / `observedIntents` produced by the live executor) plus the carried design-context manifest and proof card to a checkable structure at the point of dispatch.
2. A shared `design_dispatch_boundary.md` asset that defines the envelope, authored once and intentionally duplicated to its boundary consumers.
3. A CLI template-parity checker that fails closed when any copy of `design_dispatch_boundary.md` drifts from the canonical, plus `requiresDesignBoundaryProof` fixtures + a Vitest spec that fail closed on a missing or mismatched envelope.

The work mirrors the two landed precedents in the same harness: `design-token-lint.cjs` (the `DESIGN_PROOF_TOKEN` shape lint consumed by the `tokenLint` dispatch fixtures) and `parent-hub-vocab-sync.cjs` (the design-family drift guard). It must not change routing behavior: the standing route-gold gate result of 13 pass / 5 known-gaps / 0 regressions over 18 route rows stays byte-for-byte unchanged.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec deliverable + target named in `spec.md` (`DESIGN_BOUNDARY_PROOF v1` envelope, `requiresDesignBoundaryProof` fixture, shared asset, CLI parity checker)
- [x] Real targets verified on disk (design-interface SKILL.md dispatch-boundary region; existing `shared/` design contracts; existing `sk-design-dispatch` fixtures + token-lint precedent)
- [x] No-regression baseline captured (the route-gold guard asserts 18 rows / 13 pass / 5 known-gaps / 0 regressions)
- [x] Code-enforced vs advisory residual split agreed

### Definition of Done
- [x] `DESIGN_BOUNDARY_PROOF v1` envelope defined in the shared asset with required bindings — `shared/design_dispatch_boundary.md` §2 schema + §3 JSON shape (version, routedMode, payloadDigests, designProofTokenRef, assetDigest)
- [x] `requiresDesignBoundaryProof` fixtures present: a faithful (present + well-formed) pass case and a missing/mismatched-on-route-gold flagged case — present-001 → `valid`; missing-001 → `rejected`/`missing-boundary-proof`
- [x] CLI template-parity checker fails closed on a drifted/missing copy and passes when copies are identical — parity canonical-only valid (exit 0); drift → `asset-copy-drift`; missing → `missing-copy`
- [x] Envelope validator fails closed on missing/mismatched envelope, consumed by a Vitest spec — `lintDesignBoundaryProof()` rejects absent/version/routed-mode/digest; `design-dispatch-boundary-proof.vitest.ts` exercises it
- [x] Route-gold guard still reports 13/5/0 (unchanged); existing token-lint dispatch tests still pass — `hubRoute` 13/5/0 `failed:false`; vitest 11/11 (boundary-proof + token-lint)
- [x] Every new `.cjs` passes `node --check`; new asset + SKILL.md edit carry no spec/packet/phase IDs or `specs/` paths — `node --check` exit 0; evergreen scan clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive, fail-closed static proof. Two existing harness scripts are the templates: a single-file shape validator (the `design-token-lint.cjs` model) and a multi-source drift guard (the `parent-hub-vocab-sync.cjs` model). Both export a pure function and provide a CLI entrypoint via `_args.cjs` with exit codes 0 (pass) / 1 (fail-closed) / 2 (unparseable input).

### Key Components

- **`DESIGN_BOUNDARY_PROOF v1` envelope** — a structured block carried in the dispatch payload. Required semantic bindings (exact field names finalized in the asset, grounded in the `DESIGN_PROOF_TOKEN v1` and CLI child-pairing schemas):
  - `version` MUST be `1`.
  - A routed-mode binding tying the envelope to the live `ROUTED:` declaration / `observedIntents` (the routed/observed workflow mode that crossed the boundary).
  - A design-context manifest digest proving the context-loading contract was carried, plus a proof-card digest proving the application proof card was carried.
  - A reference (not a re-mint) to the authorizing `DESIGN_PROOF_TOKEN` run boundary (`nonce` + `runId`).
  - An asset digest binding the proof to the version of `design_dispatch_boundary.md` it was minted against (this is what ties the envelope to the parity checker).
- **Shared asset `design_dispatch_boundary.md`** — canonical home `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` (sibling to `context_loading_contract.md` and `register.md`). Defines the envelope schema, the boundary-side accept/reject rules, and the honest residual. Intentionally duplicated to its boundary consumers; the duplicate set is a declared manifest the parity checker reads.
- **Envelope validator** — a pure function (the `lintDesignToken` model) returning `{ verdict: 'valid' | 'rejected', findings: [...] }`. Fails closed on: absent envelope, `version !== 1`, missing routed-mode binding, malformed/missing digests, or a routed mode that does not match the route-gold `expected.workflowMode` (the "mismatched envelope" case).
- **CLI template-parity checker** — a new `.cjs` under `scripts/skill-benchmark/` (the `parent-hub-vocab-sync.cjs` model). Reads the canonical asset and the declared copy manifest, normalizes content, and reports `driftDetected` with per-copy findings. Exit 1 on drift or a missing copy; exit 2 on unparseable/unreadable input.
- **Fixtures + Vitest** — `requiresDesignBoundaryProof` public/private pairs in the `sk-design-dispatch/` fixtures folder, plus a Vitest spec mirroring `design-token-lint.vitest.ts` that runs the present case to a `valid` verdict and the missing/mismatched case to a fail-closed `rejected` verdict.

### Data Flow
1. A design-affecting dispatch routes to the design-interface boundary and emits a `ROUTED:` declaration (routed/observed workflow mode).
2. The dispatch payload carries a `DESIGN_BOUNDARY_PROOF v1` envelope binding that routed mode plus the carried context-manifest and proof-card digests and the token reference.
3. At fixture replay, the envelope validator recomputes shape + bindings and accepts only when the envelope is present, well-formed, and its routed mode matches the route-gold expected mode; otherwise it rejects (fail closed).
4. Independently, the CLI parity checker compares every declared copy of `design_dispatch_boundary.md` against the canonical and fails closed on any drift or missing copy.
5. Neither path injects routing intents, alters the route-gold corpus, or touches the gated `hubRoute` scorer, so the 13/5/0 result is preserved.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author the contract
- [x] Author `shared/design_dispatch_boundary.md` defining `DESIGN_BOUNDARY_PROOF v1`: field schema, required bindings, boundary accept/reject rules, named residual — asset created with §2 schema, §3 JSON shape, §4 rules, §5 residual
- [x] Resolve and record the copy manifest (which boundary consumers hold a duplicate of the asset) — §1 copy-set decision recorded: canonical-only (no real duplicate consumer; no fake duplicate invented)
- [x] Attach the `DESIGN_BOUNDARY_PROOF v1` requirement at the design-interface dispatch-boundary region of `design-interface/SKILL.md` (the child-agent/small-model dispatch success-criterion), referencing the shared asset by relative path — `SKILL.md:258` references `../shared/design_dispatch_boundary.md`

### Phase 2: Build the enforcement
- [x] Implement the envelope validator (`{verdict, findings}`, fail-closed) following the `design-token-lint.cjs` shape — `lintDesignBoundaryProof()` returns `{verdict, findings}`, fails closed on absent/version/routed-mode/digest/token
- [x] Implement the CLI template-parity checker following the multi-source drift-guard shape (pure function + `_args.cjs` CLI, exit 0/1/2) — `checkDesignDispatchBoundaryParity()` + `_args.cjs` CLI; exit 0 valid / 1 drift-or-missing / 2 unparseable
- [x] Author the `requiresDesignBoundaryProof` fixtures: a faithful present case (`valid`) and a missing/mismatched-on-route-gold case (`rejected`/flagged), embedding the envelope in the public fixture's dispatch payload — present-001 (envelope in `public.dispatchPayload`) → `valid`; missing-001 → `rejected`
- [x] Copy-manifest resolved canonical-only, so no second copy was placed; the parity checker guards the canonical asset's contract markers + the `design-interface/SKILL.md` back-reference, and the vitest exercises drift/missing against a temp clone — no fabricated duplicate

### Phase 3: Verification
- [x] `node --check` passes on every new/edited `.cjs` — exit 0 on `design-dispatch-boundary-proof.cjs`
- [x] Vitest: envelope validator accepts the present case and rejects the missing/mismatched case (fail closed) — present → `valid`; absent → `rejected`/`missing-boundary-proof`; version/routed-mode/digest mutations all reject
- [x] CLI parity checker: synthetic drift in one copy yields exit 1; identical copies yield exit 0; missing copy yields fail-closed — canonical-only exit 0; temp-clone drift → `asset-copy-drift`; missing → `missing-copy`
- [x] No-regression: route-gold guard still reports 18 rows / 13 pass / 5 known-gaps / 0 regressions; existing token-lint dispatch tests still pass — `hubRoute` 13/5/0 `failed:false`; vitest 11/11
- [x] Evergreen scan over the diff finds no spec/packet/phase IDs or `specs/` paths in the asset, SKILL.md edit, or scripts — scan clean across all 7 new/edited artifacts
- [x] Honest residual recorded (envelope presence + copy parity enforceable; applied design quality advisory) — asset §5 + `implementation-summary.md` Known Limitations #1

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | New/edited `.cjs` parse clean | `node --check` |
| Unit (validator) | Present envelope → `valid`; missing/mismatched → fail-closed `rejected` with the expected finding code | Vitest (mirrors `design-token-lint.vitest.ts`) |
| Unit (parity) | Identical copies → pass; drifted copy → drift finding; missing copy → fail-closed | Vitest + CLI exit-code probe |
| Regression | Route-gold guard unchanged (18/13/5/0); existing dispatch token-lint cases still pass | Vitest |
| Static | No spec/packet/phase IDs or `specs/` paths in built artifacts | grep over diff |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `design-token-lint.cjs` (validator shape precedent) | Internal | Green | Re-derive validator shape from scratch |
| `parent-hub-vocab-sync.cjs` (parity-checker precedent) | Internal | Green | Re-derive checker scaffold from scratch |
| `tests/design-token-lint.vitest.ts` (route-gold guard + fixture-test precedent) | Internal | Green | Author the Vitest harness without a template |
| `sk-design-dispatch/` fixtures + `_args.cjs` CLI helper | Internal | Green | No fixture folder to extend |
| `DESIGN_PROOF_TOKEN` contract + CLI child-pairing contract (envelope grounding) | Internal | Green | Envelope field semantics under-specified |
| Copy manifest (which consumers hold a duplicate) | Decision | **Amber** | Parity checker has no multi-copy surface; resolve before Phase 2 |

> **Open decision (resolve in Phase 1):** the canonical asset home is fixed at `sk-design/shared/design_dispatch_boundary.md`. The duplicate set is the one unresolved input. The spec mandates "every copy ... identical," so at least one duplicate must exist for the checker to guard. The defensible candidates, grounded in the copied-contract precedent: a mirror travelling with the transport sibling that re-validates the boundary, and/or per-mode-packet copies. Confirm the duplicate locations against the actual boundary consumers before building the checker manifest; do not invent consumers that do not read the asset.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the route-gold guard moves off 13/5/0, an existing dispatch token-lint test breaks, or the parity checker false-fails on identical copies
- **Procedure**: revert the new `.cjs`, fixtures, Vitest spec, the shared asset + its copies, and the `design-interface/SKILL.md` boundary edit. All changes are additive, so removal restores the prior tree with no data migration

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Author contract) ──> Phase 2 (Build enforcement) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author contract | None | Build enforcement |
| Build enforcement | Author contract (envelope schema + copy manifest) | Verify |
| Verify | Build enforcement | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author contract (asset + SKILL.md edit + copy manifest) | Medium | 1.5-2 hours |
| Build enforcement (validator + parity checker + fixtures + copies) | Medium | 2-3 hours |
| Verification (node --check, Vitest, regression, evergreen) | Low-Medium | 1-1.5 hours |
| **Total** | | **4.5-6.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: route-gold guard at 18/13/5/0 before any change — guard confirmed green at 13 pass / 5 known-gap / 0 regression before the change
- [x] Feature flag configured (N/A — additive static checks, no runtime flag) — N/A, the checker is a standalone static surface
- [x] Diff scoped to the named targets only (no adjacent cleanup) — git shows only the 1 SKILL.md edit + the new asset / checker / vitest / 4 fixtures; protected files byte-unchanged

### Rollback Procedure
1. **Immediate**: delete the new `.cjs` (validator + parity checker) and the new Vitest spec
2. **Fixtures**: remove the `requiresDesignBoundaryProof` public/private pairs
3. **Asset**: remove `shared/design_dispatch_boundary.md` and every declared copy
4. **SKILL.md**: revert the design-interface dispatch-boundary edit
5. **Verify**: re-run the route-gold guard and existing dispatch token-lint tests; confirm 13/5/0 and green

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file deletions/reverts only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- PLANNING ONLY: no live edits, no executor dispatch, no strict-validate in this phase
-->
