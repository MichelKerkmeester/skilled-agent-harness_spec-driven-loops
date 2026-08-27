# Iteration 6: D3 Traceability — checklist_evidence, feature_catalog_code, playbook_capability, packet hygiene

## Focus
Overlay protocols + packet hygiene: feature-catalog claims vs shipped behavior (feature_catalog_code), manual-testing playbook executability (playbook_capability), checklist evidence surface (checklist_evidence — checklist.md presence), 006 spec internal consistency (DECISIONS.md references), goal-file-manifest accuracy, changelog deliverable.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 9
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=1 P2=0 (F007 upgraded P2→P1)
- New findings ratio: 0.4 (includes refinement credit)

## Findings

### P1, Required
- **F008**: Feature catalog carries materially false claims about removed constitutional machinery — 17 `constitutional` references remain in `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md`, including `:1224` ("The constitutional-memory cache key now also includes the includeArchived flag"), `:1248` ("vector_search() now returns constitutional_results.slice(0, limit) when constitutional injection already fills the request"), `:3346-3347` ("Constitutional count passthrough (#15): Stage 1's constitutional injection count flows through..."). These describe cache/injection/count behavior that no longer exists (verified removed in iterations 1-3). Census F5 marked this TODO ("rewrite to post-deprecation behavior"); not executed. feature_catalog_code overlay: FAIL (materially false claims).
  - Dimension: traceability
- **F007** (upgraded P2→P1): 006 spec.md references the reversed DECISIONS.md surface in **6 places** — `:22` (continuity key_files), `:66` (dependencies), `:86` (purpose), `:130` (REQ-005), `:140` (SC-003), `:150` (risk mitigation). Phase 002 recorded the reversal ("no new always-loaded surface") at 2026-08-26T08:10, after 006 was authored (07:35); the spec was never retargeted. The phase's own acceptance criteria are unsatisfiable as written.
  - Dimension: traceability

### P2, Suggestion
- **F009**: Manual-testing playbooks still exercise removed constitutional behavior: `constitutional-memory-as-expert-knowledge-injection-pi-a4.md`, `constitutional-memory-manager-command.md`, plus 6 more playbooks with constitutional mentions (session-boost-graduated, dual-scope-memory-auto-surface-tm-05, memory-manage-command-routing, embedder-list-registry-inventory, memory-maintenance-and-migration-clis, query-decomposition). Census F8 TODO ("re-verify/rewrite scenarios") not executed. playbook_capability overlay: partial (scenarios reference removed capabilities).
  - Dimension: traceability
- **F010**: 006 packet docs are template scaffolds: `tasks.md` still carries template tasks (T001 "Create project structure", T003 "Configure development tools", "Implement core feature 1/2/3", "Add error handling" — 4+ matches), `plan.md` and `implementation-summary.md` are template placeholders (no technical context, no verification table); no `checklist.md` exists; and the spec's in-scope deliverable "changelog/ (packet) Modify — Rollout changelog entry" is absent (no 037 changelog dir under specs/system-speckit/ — sibling packets 026/028/032 have one). checklist_evidence: notApplicable (no checklist.md) but template residue blocks evidence-based close-out.
  - Dimension: maintainability / traceability
- **F011**: `goal-file-manifest.txt` (the review scope manifest) omits files where deprecation findings actually live: `handlers/memory-search.ts`, `lib/search/learned-feedback.ts`, `lib/search/pipeline/stage2-fusion.ts`, `handlers/memory-learned-maintenance.ts`, `handlers/memory-context.ts`, `handlers/memory-crud.ts`, `handlers/memory-ingest.ts` — despite claiming to include the "61-touchpoint audit". The 61-touchpoint research (004/research.md) covers these; the manifest does not.
  - Dimension: traceability

## Confirmed-Good Checks
- All 41 manifest-listed paths exist on disk (spot-verified).
- No 037 changelog exists, but sibling packets' changelog convention confirmed (026/028/032 have changelog dirs).

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F007 upgrade: 6 stale DECISIONS.md refs | F005/F007 |
| checklist_evidence | notApplicable | hard | No checklist.md; tasks.md template | F010 |
| feature_catalog_code | fail | advisory | 17 false/removed-behavior claims | F008 |
| playbook_capability | partial | advisory | 8 playbooks with removed behavior | F009 |

## Assessment
- New findings ratio: 0.4
- Dimensions addressed: traceability (all protocols touched)
- Novelty justification: F008 catalog false claims; F009 stale playbooks; F010 scaffold residue; F011 manifest gap; F007 upgrade via 6-reference evidence.

## Claim Adjudication (F008)
```json
{
  "findingId": "F008",
  "claim": "feature-catalog.md describes removed constitutional cache/injection/count behavior as current, e.g. vector_search returning constitutional_results (catalog:1248) and constitutional count passthrough (catalog:3346).",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:1224",
    ".opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:1248",
    ".opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:3346-3347",
    ".opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-store.ts:1825"
  ],
  "counterevidenceSought": "Grepped lib/search, handlers, hooks for constitutional injection/cache/count machinery (iterations 1-3): zero production references; vector-index-store.ts:1825 comment confirms domain excludes constitutional rows. Census F5 classifies the catalog as TODO rewrite.",
  "alternativeExplanation": "The catalog may be a historical capability ledger rather than a current-state doc; if the catalog's charter is history-preserving, the claims are not false — but its own structure (B5/E4 feature entries) reads as current capability, and the census marked it TODO rewrite, so history-preserving is rejected.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the catalog gains a 'pre-deprecation behavior' marker or is rewritten to post-deprecation state, downgrade to P2.",
  "transitions": [
    { "iteration": 6, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Ruled Out
- "Changelog exists elsewhere for 037": ruled out — no 037 changelog anywhere (find across repo, maxdepth 4).

## Dead Ends
- tasks.md grep for template markers: 4 hits confirmed; plan.md/implementation-summary.md placeholders verified by direct read at recon.

## Recommended Next Focus
Iteration 7 — D4 Maintainability: test-suite quality (manifest test files: vector-index-store-remediation, memory-save-index-scope, vector-index-store, eval-metrics, scoring-gaps, checkpoint-restore, full-spec-doc-indexing, degree-computation, dual-scope-hooks, tiered-injection, scoring, decay), stale includeConstitutional coverage, eval-metrics.ts and remaining lib literals.

Review verdict: CONDITIONAL
