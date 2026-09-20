---
title: "Deep Review Strategy - sk-design hallmark-design-system phase parent (minimax-m3 lineage)"
description: "Strategy and routing for the minimax-m3 detached fan-out lineage of the deep-review loop over the hallmark-design-system phase parent."
trigger_phrases:
  - "hallmark phase parent review"
  - "detached fan-out review"
  - "minimax m3 lineage"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - minimax-m3 lineage

## 1. OVERVIEW

This strategy file is the persistent brain for the `minimax-m3` detached fan-out lineage of the deep-review loop. The review target is the phase parent `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/`, which holds five child adoption lanes plus a deep-alignment seed artifact. The lineage writes iteration findings, registry state, and synthesis exclusively under `review/lineages/minimax-m3/` and MUST NOT touch any other path.

## 2. TOPIC

Review of the `sk-design/012-sk-design-program/004-hallmark-design-system` phase parent — a phase parent spec folder that scopes the four hallmark-adoption lanes (001 surgical fixes, 002 evidence envelopes, 003 authored cards, 004 brand-first lane) plus a fifth, separately-classified lane (005 measured composition and retrieval facets). The review focuses on correctness of the spec/code alignment, traceability of the phase-map and handoff criteria, security of the verdict posture, and maintainability of the cross-reference surfaces.

## 3. REVIEW DIMENSIONS (remaining)

<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization [notApplicable for spec-folder review target]
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- The review does NOT modify any path under `004-hallmark-design-system/` itself; review is observation-only.
- The review does NOT touch the sibling lineage folders (`glm-5-2/`, `luna-xhigh/`) — those are independent parallel runs.
- The review does NOT execute the implementation work described in the four adoption lanes; it audits spec/code alignment only.
- The review does NOT arbitrate the parent vs. retrospective status contradiction directly; it records the contradiction as a finding for the synth phase.
- The review does NOT call out external network resources, fetch, or run any non-read-only command.

## 5. STOP CONDITIONS

- All four dimensions examined at least once AND no active P0 remains AND lowest `newFindingsRatio` has been observed at the configured `convergenceThreshold=0.10` (advisory only — `stopPolicy: max-iterations` makes the iteration ceiling authoritative, not the convergence math).
- Iteration count reaches `maxIterations=3` (hard stop).
- A confirmed P0 blocks any earlier termination; the loop continues under the iteration ceiling.

## 6. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D3 Traceability | FAIL | 1 | Parent spec.md Status: Planned contradicts 5 children Status: Complete (P0 F001); 4-lane scope drift (P1 F002); stale open question (P1 F003); stale program retrospective (P1 F004); undeclared 006 worktree (P2 F005). |
| D1 Correctness | CONDITIONAL | 2 | All 5 children ship the code paths their implementation summaries cite (15 verifications pass). 005 impl-summary is self-contradictory about child metadata (P2 F006); 002 spec.md Open Questions cites pre-edit line numbers (P2 F007). F002 rationale refined: 005 is intentionally isolated. |
| D4 Maintainability | CONDITIONAL | 3 | Regeneration scripts do not propagate child status to parent (P2 F008) - F001 cross-reference gap will not be caught by the documented workflow. 005 impl-summary Known Limitations says 'Generated metadata pending' but files are present (P2 F009). 005 verification table row 'graph metadata absent' (P2 F010) is the same contradiction as F006 but expressed as a verification gate. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 1 active
- **P1 (Major):** 3 active
- **P2 (Minor):** 6 active
- **Delta this iteration:** +0 P0, +0 P1, +3 P2 (1 F006 refinement)

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Reading every child spec.md `Status:` and `completion_pct:` against the parent spec.md in a single pass surfaced the cross-reference contradiction in one focused scan (iteration 1)
- Listing the filesystem children and comparing to the parent's Phase Documentation Map row count (4 vs. 5) confirmed the undeclared 005 lane without needing any code reading (iteration 1)
- Reading the program-level retrospective.md before any child audit made F004 (program-level stale summary) obvious from the contradiction alone (iteration 1)
- Grepping the actual code paths for the per-child `composition_dna_json`, `style_composition_facets`, `deriveCompositionDNA`, `MotionSystem`, probe-table rows, and boundary-script exports confirmed each child's claim in 15 verifications (iteration 2)
- Reading the 005 spec.md `Phase | 5` plus the 005 impl-summary's "scope lock" note made the F002 refinement (isolated lane, not missing lane) possible without re-deriving the rationale (iteration 2)
- Reading the `validate.sh --recursive` validator chain plus the `generate-description.js` regenerator, then tracing each validator's input/output to confirm no parent-child status reconciliation, made F008 a single-pass discovery (iteration 3)

## 9. WHAT FAILED

- None logged yet.

## 10. EXHAUSTED APPROACHES (do not retry)

[Populated when a review approach has been tried from multiple angles without yielding new findings]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific review approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful review approaches in this category]
- Prefer for: [related dimensions where this category may help]

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER

<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: D1 Correctness (iteration 2), D3 Traceability (iteration 1), D4 Maintainability (iteration 3)
- Pivot lineage: none yet
- Remaining frontier: D2 Security (notApplicable for spec-folder review target; no executable code, no auth/authz surfaces)
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

## 12. NEXT FOCUS

<!-- MACHINE-OWNED: START -->
[CONSUMED] Phase 3 (synthesis) complete. The pattern across all three iterations is consistent: the parent and program-level documentation is stale against the children, and the documented regeneration workflow does not catch the gap. The synthesis phase has consolidated the findings into a review report, computed the final verdict (FAIL — P0 F001 active), and proposed the remediation plan (8 lanes).
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

This snapshot is the pointer-based baseline for the lineage. No full source bodies are inlined; only path anchors.

- Target pointers:
  - Parent spec: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md`
  - Parent metadata: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/description.json`
  - Parent graph metadata: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/graph-metadata.json`
  - Five child phase folders: `001-surgical-fixes/`, `002-evidence-envelopes/`, `003-authored-cards/`, `004-brand-first-lane/`, `005-measured-composition-and-retrieval-facets/`
  - Adjacent raw alignment execution dir: `006-deep-alignment-and-review/alignment/` (deep-alignment seed with `iterationsRun: 0`, `applicableLaneCount: 0`, `verdict: NOT_APPLICABLE`, sealed-`false`, NOT a completed audit)
  - Program retrospective: `.opencode/specs/sk-design/012-sk-design-program/retrospective.md`
  - Continuation packet: `.opencode/specs/sk-design/012-sk-design-program/005-reviews-and-remediation/`

- Behavior claims to verify:
  - Parent spec.md `Status: Planned` and parent `completion_pct: 0` vs. child completion claims.
  - Parent spec.md phase map lists four lanes but the filesystem shows five.
  - Program retrospective §2 lists four adoption lanes as `Planned` while child packet statuses read `Complete`.
  - Parent `graph-metadata.json` `children_ids` lists five children but the parent `spec.md` §3 Files to Change row references four (`00[1-4]-*/`).

- Reuse and conventions:
  - Spec folder discipline (spec-core, impl-summary-core, plan-core, checklist-core templates) is consistent across all five children.
  - `_memory.continuity` blocks populated consistently on each child spec and implementation summary.
  - All child checklists are written with explicit `[EVIDENCE: ...]` strings and `## Verification Summary` rows.

- Review risks and gaps:
  - The parent spec.md still appears to describe "Planned" state — either the parent is stale or the children over-claim. Either is a real audit finding.
  - The 006-deep-alignment-and-review/alignment/ subtree is a seeded but unrun deep-alignment pass; it is advisory context only, not authoritative review output.
  - Children 001-004 are sequenced 1-of-4, 2-of-4, 3-of-4, 4-of-4 in their own specs; child 005 (measured composition) is unmapped in the parent's phase map — an undeclared fifth lane.
  - The parent spec.md scope statement says `Out of Scope: The hallmark-skill research ...` but does not list the 005 lane or the 006 alignment worktree.

### resource-map.md Presence

`resource-map.md` not present at init. Skipping the conditional coverage gate. No `## Resource Map Coverage Gate` section will be emitted in `review-report.md`.

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 1 | Parent spec.md:45 Status: Planned vs. 5 child spec.md metadata Status: Complete. Hard-gate fail. Per-child code paths verified in iteration 2 (15 verifications pass). Per-child metadata verified in iteration 3 (F006, F009, F010 surface 005 impl-summary drift). |
| `checklist_evidence` | core | partial | 1 | All 5 children have checklist.md with [EVIDENCE: ...] rows. Parent has no checklist.md (phase parent, lean trio); cross-reference cannot resolve parent status. |
| `skill_agent` | overlay | notApplicable | - | Target is a spec folder, not a skill. |
| `agent_cross_runtime` | overlay | notApplicable | - | Target is a spec folder, not an agent. |
| `feature_catalog_code` | overlay | partial | 1 | Stale against child evidence; retrospective.md:62-66 still claims 4 lanes Planned. |
| `playbook_capability` | overlay | notApplicable | - | Target is a spec folder, not a playbook. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md` | D3, D4 | 3 | F001 P0, F002 P1, F003 P1 | partial (D1 not reviewed; D2 notApplicable) |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/graph-metadata.json` | D3 | 1 | (parent of F002) | partial |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/spec.md` | D3 | 1 | (child evidence for F001) | partial |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/implementation-summary.md` | D3 | 1 | (child evidence for F001) | partial |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/checklist.md` | D3 | 1 | (child evidence for F001) | partial |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes/spec.md` | D3, D1 | 3 | (child evidence for F001), F007 P2 | partial (F007 in spec.md §7) |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards/spec.md` | D3 | 1 | (child evidence for F001) | partial |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/spec.md` | D3 | 1 | (child evidence for F001) | partial |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md` | D3, D1 | 3 | (child evidence for F001, F002) | partial |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md` | D3, D1, D4 | 3 | F006 P2, F009 P2, F010 P2 | partial |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/description.json` | D1 | 2 | (lastUpdated confirms F006) | complete |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/graph-metadata.json` | D1 | 2 | (last_save_at confirms F006) | complete |
| `.opencode/specs/sk-design/012-sk-design-program/retrospective.md` | D3 | 1 | F004 P1 | partial |
| `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/006-deep-alignment-and-review/alignment/deep-alignment-findings-registry.json` | D3 | 1 | F005 P2 | partial |
| `.opencode/skills/sk-design/styles/lib/database/schema.mjs` | D1 | 2 | (005 verifications pass) | complete |
| `.opencode/skills/sk-design/styles/lib/database/indexer.mjs` | D1 | 2 | (005 verifications pass) | complete |
| `.opencode/skills/sk-design/styles/lib/database/retrieval.mjs` | D1 | 2 | (005 verifications pass) | complete |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts` | D1 | 2 | (002 verifications pass) | complete |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts` | D1 | 2 | (002 verifications pass) | complete |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts` | D1 | 2 | (002 verifications pass) | complete |
| `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md` | D1 | 2 | (002 verifications pass) | complete |
| `.opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md` | D1 | 2 | (002 Create row verified) | complete |
| `.opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md` | D1 | 2 | (002 Create row verified) | complete |
| `.opencode/skills/sk-design/design-audit/references/anti-patterns-production.md` | D1 | 2 | (001 probe count verified) | complete |
| `.opencode/skills/sk-design/design-audit/references/ai-fingerprint-tells.md` | D1 | 2 | (001 subprobes verified) | complete |
| `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs` | D1 | 2 | (004 exports verified) | complete |
| `.opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs` | D1 | 2 | (004 test suite verified) | complete |
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/index.md` | D1 | 2 | (003 load-on-demand verified) | complete |
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/*.md` | D1 | 2 | (003 7 cards verified) | complete |
| `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js` | D4 | 3 | F008 P2 root cause | partial |
| `.opencode/skills/system-spec-kit/scripts/dist/validation/generated-metadata-integrity.js` | D4 | 3 | (F008 confirm) | partial |
| `.opencode/skills/system-spec-kit/scripts/dist/validation/continuity-freshness.js` | D4 | 3 | (F008 confirm) | partial |
| `.opencode/skills/system-spec-kit/scripts/dist/validation/evidence-marker-lint.js` | D4 | 3 | (F008 confirm) | partial |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | D4 | 3 | (F008 confirm) | partial |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-minimax-m3-1784786065794-6evsk5, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-07-23T07:56:00Z
- Stop policy: max-iterations (iteration ceiling is authoritative; convergence math is advisory only)
- Stop reason: maxIterationsReached (3 of 3 iterations consumed)
- Final verdict: FAIL
- Release-readiness: release-blocking (P0 F001 active)
- Ended: 2026-07-23T07:57:50Z
<!-- MACHINE-OWNED: END -->
