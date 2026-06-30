---
title: "Implementation Summary: D3-R12 — Dispatch-boundary child proof"
description: "Post-build record for the DESIGN_BOUNDARY_PROOF v1 envelope, the shared design_dispatch_boundary.md asset, the design-dispatch-boundary-proof.cjs lint + asset-parity checker, the requiresDesignBoundaryProof boundary fixtures, and the vitest spec: the fail-closed pass/reject matrix, the asset-copy parity behavior, the presence/shape-enforceable-vs-applied-well-advisory split, the canonical-only copy-set decision, and the additive no-regression (hubRoute 13/5/0, vitest 11/11, protected files byte-unchanged) across the named files. Completes the D3 dimension."
trigger_phrases:
  - "dispatch boundary proof implementation summary"
  - "DESIGN_BOUNDARY_PROOF envelope build record"
  - "design dispatch boundary parity checker summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/012-dispatch-boundary-proof"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the boundary-proof envelope, the lint+parity checker, the fixtures, and the vitest"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-dispatch-boundary-proof |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverables** | `DESIGN_BOUNDARY_PROOF v1` envelope (shared `design_dispatch_boundary.md`), the `design-interface/SKILL.md` child-dispatch requirement, the `design-dispatch-boundary-proof.cjs` envelope-lint + asset-parity checker, the `requiresDesignBoundaryProof` boundary fixtures, and the `design-dispatch-boundary-proof.vitest.ts` spec |
| **Dimension note** | This is the LAST D3 phase — D3 routing-utilization is complete after it |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Design dispatch across the `sk-design` interface boundary now carries a machine-checkable proof that the child honored the design contract, and the checker fails closed when that proof is absent or weakened. You can assert that the envelope crossing the boundary binds the routed workflow mode to the route-gold expectation and carries the loaded-context and proof-card digests, and the checker exits non-zero when it does not. The proof is enforceable on presence and shape; it makes no claim that the design is good. Nothing folds into the weighted gate, so the `hubRoute` headline (13 pass / 5 known-gap / 0 regression) and the protected harness files are untouched.

### The `DESIGN_BOUNDARY_PROOF v1` envelope and its shared asset

`shared/design_dispatch_boundary.md` is the canonical home for the envelope. It defines a structured object the dispatch payload carries: `version` (MUST be `1`), a `routedMode` block binding the `ROUTED` declaration plus `expectedWorkflowMode` / `observedWorkflowMode` / `observedIntents` to the route-gold `expected.workflowMode`, a `payloadDigests` map (context manifest, design dispatch manifest, proof-of-application card), a `designProofTokenRef` carrying the authorizing `DESIGN_PROOF_TOKEN` `nonce` + `runId` (a reference, never a re-mint), and an `assetDigest` binding the proof to this asset's version. The asset also records the §1 copy-set decision (canonical-only), the §4 boundary accept/reject rules, and the §5 residual. The `design-interface/SKILL.md` ready criterion now requires a valid `DESIGN_BOUNDARY_PROOF v1` envelope at the child-agent / small-model dispatch boundary, referencing the asset by relative path (`../shared/design_dispatch_boundary.md`).

### The `design-dispatch-boundary-proof.cjs` checker

One checker carries two pure functions. `lintDesignBoundaryProof(payload, { expectedWorkflowMode, expectedAssetDigest })` extracts the envelope from a fixture or dispatch payload and returns `{ verdict: 'valid' | 'rejected', findings }`. It fails closed on an absent envelope (`missing-boundary-proof`), `version !== 1` (`unsupported-version`), a routed-mode that does not bind to `ROUTED` or does not match the route-gold mode (`missing-routed-mode-binding` / `routed-mode-mismatch`), a missing or malformed digest (`missing-digest` / `malformed-digest`), a missing token reference (`missing-token-ref`), and an asset-digest mismatch (`asset-digest-mismatch`). `checkDesignDispatchBoundaryParity({ skillRoot, canonicalPath, copies })` reads the canonical asset, checks its contract markers and the SKILL.md back-reference, and compares every declared copy against the canonical, reporting `driftDetected` and a `copySetDecision`. The `_args.cjs` CLI runs the envelope lint with `--file` (exit 0 valid / 1 rejected) and otherwise runs parity (exit 0 valid / 1 drift-or-missing-copy / 2 unparseable input).

### The `requiresDesignBoundaryProof` boundary fixtures and the vitest

The `fixtures/sk-design-dispatch/` set carries a present pair (`sk-design-dispatch-boundary-present-001`) whose public dispatch payload embeds a faithful envelope and whose private `expected` block sets `requiresDesignBoundaryProof: true` with `boundaryProof.verdict: valid`, and a missing pair (`sk-design-dispatch-boundary-missing-001`) whose payload omits the envelope and whose private block expects `verdict: rejected` with `findingCodes: ["missing-boundary-proof"]`. `tests/design-dispatch-boundary-proof.vitest.ts` confirms each fixture still routes to the `interface` workflow mode, lints the present case to `valid` and the absent case to a fail-closed `rejected`, mutates the present envelope to prove version-mismatch / routed-mode-mismatch / malformed-digest all reject, and exercises the parity canonical-only / identical-copy / drift / missing-copy cases against a temp clone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Modified | Added the `DESIGN_BOUNDARY_PROOF v1` requirement to the child-dispatch ready criterion, referencing `../shared/design_dispatch_boundary.md` (the single edit) |
| `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` | Created | Canonical envelope: schema, JSON shape, §1 copy-set decision, §4 boundary rules, §5 residual |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs` | Created | `lintDesignBoundaryProof()` + `checkDesignDispatchBoundaryParity()` + the `_args.cjs` CLI (exit 0/1/2) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts` | Created | Vitest over the present/absent fixtures + envelope mutations + parity drift/missing cases |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-{present,missing}-001.{public,private}.json` | Created | The `requiresDesignBoundaryProof` boundary-fixture set (4 JSON files): present → `valid`, missing → `rejected`/`missing-boundary-proof` |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) landed the change across the named files, modeling the envelope lint on `design-token-lint.cjs` and the asset-copy parity on the multi-source drift-guard precedent. The single live edit is the `design-interface/SKILL.md` ready-criterion clause; everything else is new (the shared asset, the checker, the vitest, and the four boundary fixtures). The build completed across two runs: a gpt-5.5 quota-exhaustion interruption mid-first-run, then a clean finish after the quota reset (final exit 0). No protected harness file was touched: `router-replay.cjs`, `score-skill-benchmark.cjs`, `live-executor.cjs`, and `fixtures/sk-design/` are byte-unchanged.

The orchestrator verified acceptance independently rather than trusting the claim, and this phase's verification re-ran it: the envelope-lint CLI exits 0 on the faithful present fixture (`verdict: valid`) and exits 1 on the missing fixture (`verdict: rejected`, `missing-boundary-proof`); the vitest mutations confirm `unsupported-version`, `routed-mode-mismatch`, and `malformed-digest` all reject; the parity CLI exits 0 canonical-only (`driftDetected: false`, `copySetDecision: canonical-only`), and the vitest temp-clone case confirms an identical declared copy passes while a drifted copy reports `asset-copy-drift` and a missing copy reports `missing-copy`. No-regression held: the route-gold guard inside `design-token-lint.vitest.ts` still asserts `hubRoute` 13 pass / 5 known-gap / 0 regression with `failed: false`, the combined boundary-proof + token-lint vitest passes 11/11, `node --check` exits 0 on the checker, and the evergreen scan over the asset, the SKILL.md edit, the checker, the vitest, and the fixtures is clean. The phase folder authored docs only.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One checker for both envelope lint and asset parity | The two concerns share the same digest/normalization helpers and the same `_args.cjs` CLI; one file keeps the harness surface small and the `--file` vs default-path split makes the two exit-code contracts explicit |
| Guard the canonical asset only — copy set is canonical-only | No real duplicate consumer carries the asset today, so inventing a duplicate just to give parity something to check would be a fake guard. The checker instead verifies the canonical contract markers plus the `design-interface/SKILL.md` back-reference; a real duplicate, when one exists, is declared and kept byte-identical |
| Keep the proof standalone, never folded into the weighted gate | Folding the boundary proof into `modeAScore` / `dimensionScores` / `verdict` would risk the 13/5/0 `hubRoute` headline; a standalone fail-closed checker enforces presence/shape while the protected harness files stay byte-unchanged |
| Bind the routed mode to the route-gold `expected.workflowMode` | Binding the envelope's observed/expected mode to the route-gold expectation makes the proof checkable against the same source of truth the router is scored on, so a mismatch is a hard `routed-mode-mismatch`, not a judgment call |
| Reference the authorizing token, never re-mint it | The envelope carries `designProofTokenRef.nonce` + `runId` only; re-minting a token inside the envelope would let the boundary forge its own authorization |
| Name the residual instead of overclaiming | Presence + shape + parity are mechanical; whether the loaded judgment was applied well is not provable, so the asset's §5 and this summary state the advisory residual rather than implying the proof certifies taste |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| ACCEPTANCE — faithful envelope | PASS, present fixture → `verdict: valid`, empty findings; envelope-lint CLI exit 0 (orchestrator + phase-verified) |
| ACCEPTANCE — absent envelope | PASS, missing fixture → `verdict: rejected`, `missing-boundary-proof`; CLI exit 1 |
| ACCEPTANCE — version != 1 | PASS, mutated envelope `version: 2` → `rejected`, `unsupported-version` |
| ACCEPTANCE — routed-mode mismatch | PASS, observed mode `motion` ≠ route-gold `interface` → `rejected`, `routed-mode-mismatch` |
| ACCEPTANCE — malformed digest | PASS, `contextManifestDigest: sha256:not-a-digest` → `rejected`, `malformed-digest` |
| ASSET PARITY — canonical-only | PASS, `verdict: valid`, `driftDetected: false`, `copySetDecision: canonical-only`; CLI exit 0 |
| ASSET PARITY — identical copy | PASS, an identical declared copy → `matchesCanonical: true`, `valid` |
| ASSET PARITY — drift / missing | PASS, drifted copy → `asset-copy-drift` (exit 1); missing copy → `missing-copy` (fail closed) |
| NO-REGRESSION — hubRoute headline | PASS, route-gold guard stays 18 rows / 13 pass / 5 known-gap / 0 regression, `gate.hubRoute.failed === false` |
| Vitest (boundary-proof + token-lint) | PASS, 11/11 (2 files), including the existing design-token-lint cases |
| `node --check` on the checker | PASS, exit 0 on `design-dispatch-boundary-proof.cjs` |
| Protected files byte-unchanged | PASS, `router-replay.cjs`, `score-skill-benchmark.cjs`, `live-executor.cjs`, `fixtures/sk-design/` show no diff vs HEAD |
| Evergreen [HARD] | PASS, no spec/packet/phase IDs or `specs/` paths in the asset, the SKILL.md edit, the checker, the vitest, or the fixtures |
| Scope clean (named files only) | PASS, git shows only the 1 SKILL.md edit + the new asset / checker / vitest / 4 fixtures; this phase folder authored docs only |
| GENERATED_METADATA_INTEGRITY | RESIDUAL (expected), `description.json` / `graph-metadata.json` are regenerated by the orchestrator's save path; not hand-written here |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Presence and shape are enforced; applied quality is not.** The checker proves a contract-honoring `DESIGN_BOUNDARY_PROOF v1` envelope crossed the boundary (routed-mode bound to route-gold + valid digests + token reference + asset digest) and that asset copies are identical. Whether the loaded design judgment was actually applied well is not provable and stays advisory, judged by the active design mode and downstream audit evidence.
2. **The copy set is canonical-only today.** No real duplicate consumer carries `design_dispatch_boundary.md`, so parity guards the canonical asset's contract markers plus the `design-interface/SKILL.md` back-reference. When a genuine duplicate consumer is added, declare it in the checker input (`--copies`) and keep it byte-identical; do not invent a duplicate only to satisfy parity.
3. **The boundary proof is a standalone surface, not a scorer gate.** The checker fails closed on its own CLI / vitest, but it is never folded into `score-skill-benchmark.cjs`, the `hubRoute` gate, or any `verdict`. A scorer run will not block on a boundary-proof failure; only the standalone checker does. This split is intentional — it is what keeps the 13/5/0 headline and the protected harness files byte-stable.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for the DESIGN_BOUNDARY_PROOF v1 envelope + shared asset, design-dispatch-boundary-proof.cjs (lint + parity), the requiresDesignBoundaryProof fixtures, and the vitest
- Presence + shape + asset-copy parity code-enforced (fail closed); applied-well advisory; copy set canonical-only (no fake duplicate); hubRoute stays 13/5/0; vitest 11/11; protected files byte-unchanged; LAST D3 phase
-->
