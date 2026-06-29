---
title: "D3-R12 — Dispatch-boundary child proof"
description: "Add a DESIGN_BOUNDARY_PROOF v1 envelope + requiresDesignBoundaryProof fixtures, one shared design_dispatch_boundary.md asset, and a CLI parity/envelope checker (design-dispatch-boundary-proof.cjs) that fails closed on an absent/version-mismatched/routed-mode-mismatched/malformed envelope and on asset-copy drift; the scorer surfaces nothing weighted so hubRoute stays 13/5/0. Proves the envelope crossed the boundary, not that the design is good. Last D3 phase."
trigger_phrases:
  - "d3-r12 dispatch boundary proof"
  - "design boundary proof design build"
  - "DESIGN_BOUNDARY_PROOF envelope parity checker"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/012-dispatch-boundary-proof"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the spec to the Level 2 contract and mark the dispatch-boundary proof build complete"
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
# D3-R12 — Dispatch-boundary child proof

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Enforcement class** | hybrid (envelope presence + shape + asset-copy parity enforceable at the boundary; applied design quality advisory) |
| **Dimension** | D3 — Routing & Utilization (LAST D3 phase — D3 routing-utilization is complete after this) |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Dispatch across the design-interface boundary had no machine-checkable proof that a dispatched child honored the design contract: nothing forced the dispatch payload to carry the loaded-context manifest, the proof-of-application demand, and the routed-mode declaration in a checkable structure, and a hand-duplicated boundary asset could drift silently. Absence was indistinguishable from compliance.

### Purpose
Make the boundary carry checkable and fail-closed. A `DESIGN_BOUNDARY_PROOF v1` envelope binds the routed/observed workflow mode to the route-gold `expected.workflowMode`, plus the carried payload digests (context manifest, design dispatch manifest, proof-of-application card), the authorizing `DESIGN_PROOF_TOKEN` `nonce`/`runId` reference, and an `assetDigest` of the canonical asset. One shared `design_dispatch_boundary.md` asset defines the envelope, and a single CLI checker (`design-dispatch-boundary-proof.cjs`) both lints an envelope and guards asset-copy parity. The checker fails closed on an absent envelope, `version !== 1`, a routed-mode mismatch, a malformed/missing digest, and on asset-copy drift or a missing declared copy. None of it touches the weighted gate, so the `hubRoute` headline (13 pass / 5 known-gap / 0 regression) stays byte-stable. The proof shows a contract-honoring envelope crossed the boundary; it never claims the result is tasteful.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One shared canonical asset `sk-design/shared/design_dispatch_boundary.md` defining `DESIGN_BOUNDARY_PROOF v1`: field schema, the copy-set decision, boundary accept/reject rules, and the named residual.
- A `DESIGN_BOUNDARY_PROOF v1` requirement attached to the `design-interface/SKILL.md` child-agent / small-model dispatch success-criterion, referencing the shared asset by relative path.
- One CLI checker `design-dispatch-boundary-proof.cjs` exporting `lintDesignBoundaryProof()` (envelope lint) and `checkDesignDispatchBoundaryParity()` (asset-copy parity), with the `_args.cjs` CLI: `--file` lints an envelope (exit 0 valid / 1 rejected); the default path runs parity (exit 0 valid / 1 drift-or-missing / 2 unparseable).
- A `requiresDesignBoundaryProof` boundary-fixture set in `fixtures/sk-design-dispatch/`: a faithful present pair (envelope present + bound → `valid`) and a missing pair (envelope absent on a route-gold dispatch → `rejected` / `missing-boundary-proof`).
- A Vitest spec `tests/design-dispatch-boundary-proof.vitest.ts` exercising the present/absent fixtures plus version-mismatch, routed-mode-mismatch, and malformed-digest mutations, and the parity canonical-only / drift / missing-copy cases.

### Out of Scope
- Any edit to `router-replay.cjs`, `score-skill-benchmark.cjs`, `live-executor.cjs`, or the route-gold corpus — these are the no-regression baseline, verified byte-unchanged.
- Folding the boundary proof into `modeAScore`, `dimensionScores`, `aggregateScore`, the `hubRoute` gate, or any `verdict`.
- Inventing a duplicate consumer only to satisfy parity (copy set is canonical-only today — see RISKS and OPEN QUESTIONS).
- Certifying design quality (the proof shows envelope carry, not taste — see RISKS and OPEN QUESTIONS).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Modify | Add the `DESIGN_BOUNDARY_PROOF v1` requirement to the child-dispatch success-criterion, referencing `../shared/design_dispatch_boundary.md` |
| `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` | Create | Canonical `DESIGN_BOUNDARY_PROOF v1` envelope: schema, JSON shape, copy-set decision, boundary rules, named residual |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-dispatch-boundary-proof.cjs` | Create | Envelope lint + asset-copy parity checker (pure functions + `_args.cjs` CLI, exit 0/1/2) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts` | Create | Vitest spec over the present/absent fixtures + envelope mutations + parity drift/missing cases |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-{present,missing}-001.{public,private}.json` | Create | `requiresDesignBoundaryProof` fixture set: present → `valid`, missing → `rejected`/`missing-boundary-proof` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The envelope contract exists and is referenced | `shared/design_dispatch_boundary.md` defines `DESIGN_BOUNDARY_PROOF v1` (schema + rules + residual); `design-interface/SKILL.md` references it at the child-dispatch success-criterion |
| REQ-002 | A faithful envelope passes | Present envelope with routed-mode == route-gold `expected.workflowMode` + valid digests → `verdict: valid`, empty findings |
| REQ-003 | The checker fails closed on the negative cases | Absent envelope, `version !== 1`, routed-mode mismatch, and malformed digest each → `verdict: rejected` with the expected finding code; envelope-lint CLI exits non-zero |
| REQ-004 | Asset-copy parity is enforced | Parity passes canonical-only + an identical declared copy; fails closed on a drifted copy (`asset-copy-drift`) and a missing copy (`missing-copy`) |
| REQ-005 | No regression to the weighted gate / headline | `hubRoute` stays 18 rows / 13 pass / 5 known-gap / 0 regression, `failed: false`; `node --check` exits 0 on the checker; protected files byte-unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Absence is never proof | A missing envelope and a missing declared copy both deny (fail closed), never pass-by-default |
| REQ-007 | The envelope references the token, never re-mints it | The envelope carries `designProofTokenRef.nonce` + `runId` only; no embedded token re-mint |
| REQ-008 | Evergreen body | The asset, the SKILL.md edit, the checker, the vitest, and the fixtures carry no spec/packet/phase IDs or `specs/` paths |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `design-dispatch-boundary-proof.cjs` exports `lintDesignBoundaryProof()` and `checkDesignDispatchBoundaryParity()`, both pure; `lintDesignBoundaryProof` returns `{ verdict, findings }`.
- **SC-002**: A faithful present envelope bound to the route-gold workflow mode → `verdict: valid`, empty findings; the envelope-lint CLI exits 0.
- **SC-003**: Absent envelope → `missing-boundary-proof`; `version !== 1` → `unsupported-version`; routed-mode mismatch → `routed-mode-mismatch`; malformed digest → `malformed-digest`; each → `rejected` and CLI exit 1.
- **SC-004**: Parity passes canonical-only and an identical declared copy; a drifted copy → `asset-copy-drift` (exit 1); a missing copy → `missing-copy` (fail closed); unparseable input → exit 2.
- **SC-005**: `hubRoute` stays 13 / 5 / 0 (`failed: false`), `node --check` exits 0 on the checker, vitest passes 11/11, the protected files are byte-unchanged, and the evergreen scan is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A weighted boundary signal could shift the headline | Folding the proof into `modeAScore` / `verdict` would risk the 13/5/0 `hubRoute` headline | The checker is a standalone fail-closed surface; it is never folded into the weighted aggregate or the `hubRoute` gate. Verified: `hubRoute` 13/5/0, `failed: false`; `score-skill-benchmark.cjs` / `router-replay.cjs` / `live-executor.cjs` byte-unchanged |
| Risk | The proof could be read as a quality certificate | A reader might treat a `valid` envelope as "the design is good" | HONEST framing recorded: presence + shape + parity are code-enforced; whether the loaded judgment was APPLIED WELL is NOT provable. A `valid` envelope means a contract-honoring envelope crossed the boundary — never that the result is tasteful |
| Risk | A duplicate asset could drift, or a fake duplicate could be invented to satisfy parity | A hand-copied asset drifts silently; inventing a duplicate consumer fakes the guard | Copy-set decision recorded: **canonical-only** today. The checker guards the canonical asset's contract markers + the SKILL.md back-reference. No fake duplicate was invented; a real duplicate, when one exists, is declared in the checker input and kept identical |
| Risk | Absence treated as proof | A missing envelope or missing copy passing by default would defeat the gate | The checker fails closed: `missing-boundary-proof` on an absent envelope, `missing-copy` on a missing declared copy — never pass-by-default |
| Dependency | `design-token-lint.cjs` (validator shape precedent) + `tests/design-token-lint.vitest.ts` (route-gold guard host) | The validator shape to mirror and the 13/5/0 no-regression assertion | Internal, green |
| Dependency | `router-replay.cjs` (`routeSkillResources`) + `sk-design-dispatch/` fixtures + `_args.cjs` CLI helper | Route confirmation in the vitest + the fixture folder + the CLI scaffold | Internal, green |
| Dependency | `DESIGN_PROOF_TOKEN v1` + the context-loading contract | Grounds the envelope's token reference and the carried payload digests | Internal, green |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Additivity
- **NFR-A01**: The asset, the checker, the vitest, and the fixtures are all new; the SKILL.md change adds one clause to an existing success-criterion. No existing checker, scorer, router, fixture, or route-gold row is altered. The protected files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `live-executor.cjs`, `fixtures/sk-design/`) are byte-unchanged.

### Backward Compatibility
- **NFR-B01**: The checker is a standalone surface; it never folds into `modeAScore`, `dimensionScores`, `aggregateScore`, the `hubRoute` gate, `verdict`, or `routeTelemetry`. The route-gold guard stays 18 rows / 13 pass / 5 known-gap / 0 regression with `failed: false`.

### Honesty
- **NFR-H01**: The code-enforced floor is the envelope's PRESENCE + SHAPE at the boundary (fail-closed on absent / malformed / version-mismatch / routed-mode ≠ route-gold) plus asset-copy parity. The remaining design-quality claim — whether the loaded judgment was APPLIED WELL — stays advisory and is judged by the active design mode and downstream audit evidence.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Envelope Boundaries
- **Absent envelope**: `extractBoundaryProof()` returns null → `missing-boundary-proof`, `verdict: rejected` (absence is never proof).
- **Wrong version**: `version !== 1` → `unsupported-version`, `rejected`.
- **Routed-mode mismatch**: `observedWorkflowMode` / `expectedWorkflowMode` ≠ the route-gold `expected.workflowMode` (or `observedIntents` omits the observed mode) → `routed-mode-mismatch`, `rejected`.
- **Malformed / missing digest**: any required payload digest or the `assetDigest` not matching `sha256:<64 lowercase hex>` → `malformed-digest` / `missing-digest`, `rejected`.

### Parity Boundaries
- **Canonical-only**: no declared copies → `copySetDecision: canonical-only`, `valid` when the canonical contract markers + the SKILL.md back-reference hold.
- **Identical declared copy**: a byte-identical copy → `matchesCanonical: true`, `valid`.
- **Drifted copy**: a declared copy differing from canonical → `asset-copy-drift`, `rejected` (exit 1).
- **Missing declared copy**: a declared copy that does not exist → `missing-copy`, `rejected` (fail closed).
- **Unparseable / unreadable input**: an unreadable canonical or input → `unparseable-input` / `invalid-input` → CLI exit 2.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One shared asset + one SKILL.md clause + one checker (two pure functions + a CLI) + one vitest + one four-file boundary-fixture set — five logical artifacts (1 edit + 4 new), all scope-locked inside `sk-design` and the skill-benchmark harness.
- **Risk concentration**: The load-bearing piece is the code-enforced-vs-advisory split. The checker must fail closed on the negative envelope and parity cases while never touching the weighted gate, so `hubRoute`, the weighted aggregate, and the protected files stay byte-stable. The canonical-only copy-set decision contains the parity risk: the guard is real (canonical markers + SKILL.md back-reference) without a fabricated duplicate.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does a `valid` envelope mean the design is good? **RESOLVED: No. Presence + shape + asset-copy parity are code-enforced (fail-closed on absent / malformed / version-mismatch / routed-mode ≠ route-gold, and on copy drift / missing copy). Whether the loaded judgment was APPLIED WELL is NOT provable — a `valid` envelope only shows a contract-honoring envelope crossed the boundary. Taste stays advisory, judged by the active mode and downstream audit.**
- How many copies should the parity checker guard? **RESOLVED: Canonical-only. No real duplicate consumer carries the asset today, so the checker guards the canonical file's contract markers plus the `design-interface/SKILL.md` back-reference. No fake duplicate was invented to satisfy parity; when a real duplicate consumer is added it is declared in the checker input and kept byte-identical.**
- Is `router-replay.cjs` / `score-skill-benchmark.cjs` a target for this build? **RESOLVED: No. They are the no-regression baseline, verified byte-unchanged. The enforceable surface is the standalone checker; the route-gold guard stays 13/5/0.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: DESIGN_BOUNDARY_PROOF v1 envelope + shared design_dispatch_boundary.md asset; design-dispatch-boundary-proof.cjs (lint + parity); requiresDesignBoundaryProof boundary fixtures; design-dispatch-boundary-proof.vitest.ts
- Findings: presence/shape/parity code-enforced, applied-well advisory; copy-set canonical-only (no fake duplicate); hubRoute stays 13/5/0; LAST D3 phase
-->
