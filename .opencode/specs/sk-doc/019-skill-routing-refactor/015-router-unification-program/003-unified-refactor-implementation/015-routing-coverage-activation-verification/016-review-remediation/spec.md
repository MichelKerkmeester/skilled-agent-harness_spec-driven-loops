---
title: "Feature Specification: Compiled-Routing Deep-Review Remediation"
description: "Fix all confirmed findings from the two GPT-5.6 deep reviews (LUNA xhigh + SOL high) of the 013 compiled-routing landing: refresh-manifest concurrency race, cutover-parity gate mishandling clarify/reject, sk-doc preview-to-review over-route, authored-closure drift for 4 hubs, cohort duplication plus stale flag telemetry, and packet completion-metadata reconciliation."
trigger_phrases:
  - "compiled routing review remediation"
  - "refresh manifest concurrency fix"
  - "sk-doc preview review over-route"
  - "authored closure unresolved hubs"
  - "cutover gate clarify reject"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/016-review-remediation"
    last_updated_at: "2026-07-22T06:53:44Z"
    last_updated_by: "claude"
    recent_action: "Remediated all 8 findings and re-verified invariants; conformed spec to the Level-2 template."
    next_safe_action: "Operator sign-off; merge to v4 remains operator-gated."
    blockers: []
    key_files:
      - ".opencode/bin/lib/compiled-route-manifest.cjs"
      - ".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs"
---

# Feature Specification: Compiled-Routing Deep-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Branch** | `sk-doc/0089-default-routing-cutover` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two independent GPT-5.6 deep reviews (LUNA xhigh, SOL high; ten non-converging iterations each) audited the v4 compiled-routing landing (packet `013-compiled-coverage-buildout`). Both returned CONDITIONAL with zero P0s. Every finding was extracted and verified against the actual code (finding equals hypothesis) via three Explore agents plus direct reads, and one review claim was re-checked and corrected. The confirmed defects range from two routing-parity bugs and a manifest concurrency race to an authored-closure drift and two documentation-honesty gaps.

### Purpose

Remediate every confirmed finding with a regression test, while holding the release-branch invariants (frozen scorers, compiled-equals-legacy parity, seven-hub serving, no spec reads on the serving path). Source of truth for findings: `013-compiled-coverage-buildout/review/lineages/{luna-xhigh,sol-high}/review-report.md`.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

The eight confirmed findings in section 4 (WS-1 through WS-4 in `plan.md`): F001, F002, F005, F007, F006, DOC-1, DOC-2, DOC-3.

### Out of Scope

- Any change to what legacy routes.
- The three frozen scorer files.
- The two pre-existing strays (`mcp-tooling/008-mcp-aside`, `system-deep-loop/032`).
- The pre-existing v4 `verify-runtime-engine` and Lane-C failures (documented pre-existing on origin/v4, unrelated).
- Expanding F005's word-boundary fix beyond sk-doc (verified unnecessary: no parity divergence in other hubs against the frozen oracle).

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement | Source anchor |
|----|-----|-------------|---------------|
| F001 | P1 | `refreshCanonicalManifest` must not revert a concurrent serving-state flip (mint is protected; refresh was not) | `compiled-route-manifest.cjs:543-596` |
| F002 | P1 | The cutover parity gate must not treat a terminal `clarify`/`reject` as defer-to-legacy; it must compare against legacy | `cutover-playbook-executor.cjs:209` |
| F005 | P1 | The sk-doc compiled matcher must word-boundary-match bare `review` (and the perf acronyms), mirroring legacy | `007-sk-doc/lib/router.cjs:23-29` |
| F007 | P1 | Authored-closure `--check` must resolve all seven hubs; the authored engine must match the promoted bin twins | `compiled-route-sync.cjs:351-357` |
| F006 | P2 | `classifyFlagState` telemetry must reflect the live seven-hub default-on, not the empty pre-cutover cohort | `compiled-routing-parity.cjs:803-805` |
| DOC-1 | P1 | The 013 packet's lifecycle metadata must be consistent and honest across all docs | `013/checklist.md`, planning docs |
| DOC-2 | P2 | The stale SD-015 "no dedicated test yet" note must be reconciled against the tests that exist | `013/implementation-summary.md:204-220` |
| DOC-3 | P2 | The cohort drift-guard must span all four copies, not two | `resolve.cjs:34`, `compiled-routing-foundation.vitest.ts` |

### Functional Requirements

- **REQ-001** (F001) Manifest refresh preserves a concurrent serving flip.
- **REQ-002** (F002) The cutover gate compares terminal `clarify`/`reject` against legacy.
- **REQ-003** (F005) The sk-doc matcher word-boundary-matches bare `review`.
- **REQ-004** (F007) The authored closure resolves all seven hubs.
- **REQ-005** (F006) Flag telemetry reflects the live seven-hub default-on.
- **REQ-006** (DOC-1) The 013 lifecycle metadata is consistent and honest.
- **REQ-007** (DOC-2) The SD-015 note matches the tests that exist.
- **REQ-008** (DOC-3) The cohort drift-guard spans all four copies.

Refuted (not fixed): SOL's original framing of F002 against the flip gate (`assertEngineRoutes`, strict `=== 'route'`). That gate is correct; the real defect is the cutover-playbook gate, captured as F002 above.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every finding fixed with a regression test that fails before and passes after.
- The full verification gate (`checklist.md`) passes.
- Frozen scorer SHA-256 digests unchanged.
- Parity 49/49 (plus the new F002/F005 cases), zero drift, all seven hubs.
- Manifest suite green; `--check` resolves all seven hubs; `--verify` reports zero reads under `.opencode/specs`.
- The 013 docs are reconciled; operator sign-off is surfaced, not self-granted.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Frozen-scorer contamination.** Mitigated by re-hashing the three digests after every fix.
- **F007 touches the authored engine and re-mint path**, the same class of change as the original merge reconcile. Mitigated by reconciling bin into authored only (the runtime bin is untouched) and re-running `--check` and `--verify`.
- **Continuity freshness on the doc set.** Mitigated by regenerating description and graph metadata at close.
- Depends on the verified v4 landing (`ed8f3e20d0`) not regressing.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

These release-branch invariants must hold throughout:

- The three frozen scorer SHA-256 digests never change (`d5e13daf / d5a9cc72 / 5029f22d`).
- Compiled routing stays byte-identical to legacy: parity 49/49 plus the new cases, zero drift, all seven hubs.
- No runtime path reads under `.opencode/specs`; `DEFAULT_ON_HUBS` stays seven; all seven hubs compiled-serving and fresh; the `SPECKIT_COMPILED_ROUTING=0` kill-switch falls back to legacy fleet-wide.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- `preview the latest changes` (which contains `review`) must defer, while a real `review` prompt and `/doc:quality` still route.
- A compiled `clarify`/`reject` that matches a legacy no-route (both empty intents) is parity; the same against a real legacy route is drift.
- A concurrent serving flip landing during a refresh's compile window must survive; a vanished or corrupt manifest at re-read must fail closed.
- The two cohort families (resolver, advisor) order the set differently by design: order-identity within each family, membership-identity across families.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- F005 fleet-wide expansion: verified unnecessary. The substring pattern exists in other hubs' routers but produces no parity divergence against the frozen oracle (`lcp`/`inp`/`cls` are keywords nowhere; sk-code, the only other hub with `review`, defers on substring-only `review`, matching legacy). Only sk-doc diverged, and it is fixed.
- Formal operator sign-off on the 013 reconciliation and the remaining P1 follow-up (CHK-025 LUNA sweep) is the operator's to grant.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this packet).
- `013-compiled-coverage-buildout/` (the reviewed packet) and its `review/lineages/{luna-xhigh,sol-high}/review-report.md`.

<!-- /ANCHOR:related-docs -->
