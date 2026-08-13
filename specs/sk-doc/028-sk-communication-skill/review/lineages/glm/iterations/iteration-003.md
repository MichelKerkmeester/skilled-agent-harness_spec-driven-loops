# Iteration 3: D3 Traceability — spec/code, checklist evidence, catalog, playbook

## Focus
Dimension: traceability. Independent cross-reference audit: (1) `spec_code` — REQ-001/002/003 in spec.md vs skill files and package; (2) `checklist_evidence` — tasks.md checked rows T001–T005; (3) `feature_catalog_code` — 11 catalog features vs backing files and package paths; (4) `playbook_capability` — 8 playbook scenarios vs catalog coverage and executable reality.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.41

## Findings

### P0, Blocker
(none)

### P1, Required
- **F004**: T005 completion evidence claims an advisor run that was never persisted. `specs/sk-doc/028-sk-communication-skill/tasks.md:68`, the checked row reads `[x] T005 Confirm advisor routing [evidence: .opencode/skills/sk-communication/graph-metadata.json intent signals; advisor returns sk-communication as the top match]`. The "evidence" is a prose description, not a persisted artifact. The playbook (`manual-testing-playbook.md:11-12,92-102`) requires every scenario run to persist its `PASS/FAIL/SKIP` outcome and reason through `run-manual-playbook-scenario.cjs` into `benchmark/reports/<dated-run-label>/`. `ls .opencode/skills/sk-communication/benchmark/reports/` returns only `README.md` — no dated run directory exists. So the advisor smoke that T005 claims as evidence was either never run or never persisted; either way the checked row is under-evidenced. Dimension: traceability. Recommendation: run COMM-001 via `run-manual-playbook-scenario.cjs` and attach the persisted report path to T005's evidence, or rephrase the evidence to cite a warm advisor recommendation capture (skill id, confidence, exit status) stored in the packet.

  **Claim adjudication packet:**
  ```json
  {
    "findingId": "F004",
    "claim": "tasks.md T005 is checked complete with evidence that the advisor returns sk-communication as the top match, but no persisted advisor-run transcript or benchmark report exists.",
    "evidenceRefs": [
      "specs/sk-doc/028-sk-communication-skill/tasks.md:68",
      ".opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md:11",
      ".opencode/skills/sk-communication/benchmark/reports/README.md:1"
    ],
    "counterevidenceSought": "Listed benchmark/reports/ — only README.md present, no dated-run-label directory. Searched the packet for any persisted advisor recommendation capture (skill id, confidence, exit status) — none found. Checked whether implementation-summary.md:81 'Advisor routing PASS' is backed by an artifact — it cites the same prose claim, not a persisted run.",
    "alternativeExplanation": "The advisor smoke could have been run interactively during authoring without persisting through the canonical wrapper, and the checked row records the interactive result. Rejected: the playbook's MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT (playbook.md:11-12) explicitly states a scenario run is complete only after its outcome is persisted through the wrapper; an interactive-only run does not satisfy the packet's own evidence contract.",
    "finalSeverity": "P1",
    "confidence": 0.85,
    "downgradeTrigger": "If a dated run directory is persisted under benchmark/reports/ with a COMM-001 PASS outcome and reason, or if T005's evidence is rephrased to cite a warm advisor recommendation capture stored in the packet, downgrade to P2 evidence-hygiene.",
    "transitions": [
      { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery: checked row claims evidence that the playbook's own persistence contract requires to be persisted, and it is not" }
    ]
  }
  ```

### P2, Suggestion
- **F005**: Placeholder session_dedup fingerprints in packet docs. `specs/sk-doc/028-sk-communication-skill/spec.md:23` (and identically in `plan.md:20`, `tasks.md:20`, `implementation-summary.md:21`) carry `fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"`. The all-zero hash is a scaffold placeholder, not a real content fingerprint. Under `SPECKIT_COMPLETION_FRESHNESS=true` the completion-verification rule compares the stored fingerprint against recomputed content; an all-zero fingerprint cannot match any real content, so a freshness check would block completion for non-grandfathered packets. Dimension: traceability. Recommendation: recompute the continuity fingerprint via `generate-context.js` (outside this lineage's write fence) so the stored value reflects actual packet content.

- **F006**: COMM-001 catalog cross-reference maps to a privacy feature, not an advisor-routing feature. `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md:130`, COMM-001 ("Advisor routes a projection request") maps to the catalog entry "Privacy-first provider routing" (`feature-catalog/provider-and-privacy/privacy-first-provider-routing.md`). COMM-001 verifies advisor routing, not privacy routing. The catalog has no advisor-routing/skill-discoverability feature (it is package-capability-focused), so the scenario maps to the nearest available feature rather than a true match. Soft mapping miss. Dimension: traceability. Recommendation: add a catalog feature for advisor discoverability, or note in the playbook that COMM-001's catalog mapping is indirect (advisor routing is the skill-level entry point, not a package capability).

- **F008**: Five of eleven catalog features lack playbook scenario coverage. `.opencode/skills/sk-communication/feature-catalog/feature-catalog.md` lists 11 features. `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md:228-237` (section 12 cross-reference index) maps 8 scenarios (COMM-001..COMM-008) to 6 distinct catalog features: Privacy-first provider routing, Protected-span fidelity validation, Capability-aware presentation, Blind non-inferiority evaluation, Compatibility doctor, Release readiness and rollback. Five catalog features have no playbook scenario: Generation-keyed message assembly, Bounded context selection, Provider adapters and execution, Six-runtime adapter matrix, Content-free observability. The playbook's coverage note (playbook.md:20) says automated tests remain authoritative, so this is advisory, but the release-review rule (playbook.md:84) says every root-indexed scenario maps to exactly one catalog entry — the inverse (every catalog entry maps to a scenario) is not required, yet five features have no operator-visible validation path. Dimension: traceability. Recommendation: either add scenarios for the five uncovered features, or document in the playbook that those five are validated only by the automated suite and intentionally have no manual scenario.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md REQ-001/002/003 vs SKILL.md/SKILL.md:130/tasks.md:68 | REQ-001/002/003 structurally satisfied; F001 export drift; F004 evidence gap |
| checklist_evidence | fail | hard | tasks.md:50-78 | Level 1 (no checklist.md); T005 under-evidenced (F004); zero fingerprints (F005) |
| skill_agent | notApplicable | advisory | — | no runtime agent definitions for this skill |
| agent_cross_runtime | notApplicable | advisory | — | not an agent target |
| feature_catalog_code | pass | advisory | feature-catalog.md vs leaf-manifest.json leaves | 11 catalog features all have backing files; catalog claims match package paths |
| playbook_capability | partial | advisory | playbook.md:228-237 vs feature-catalog.md | 8 scenarios present; F006 mapping soft miss; F008 coverage gaps for 5 features |

## Assessment
- New findings ratio: 0.41
- Dimensions addressed: traceability
- Novelty justification: Traceability dimension surfaces the evidence-gap and coverage findings. Verified:
  - REQ-001 (class-S skill root): skill root exists with SKILL.md, graph-metadata.json, leaf-manifest.config.json; `ci-skill-root-metadata` reported clean (implementation-summary.md:79). Satisfied.
  - REQ-002 (route to package invariants): SKILL.md §3 states the pipeline; §3 states both tiers; §4 ALWAYS states privacy-before-ranking, exact-original, content-free telemetry. All present. Satisfied (F001 is a doc/code drift, not a missing invariant).
  - REQ-003 (advisor-discoverable): graph-metadata.json carries domains and intent_signals with real projection phrasing; sibling edges to sk-code/sk-design/sk-doc. Structurally satisfied; the advisor-smoke evidence is the F004 gap.
  - feature_catalog_code: all 11 catalog features resolve to per-feature files on disk (leaf-manifest.json lists 11 feature-catalog leaves; `ls feature-catalog/` confirms the category subdirs and files). Catalog claims cite real package paths. Pass.
  - playbook_capability: 8 scenarios present, each with a per-feature file (leaf-manifest.json lists 8 playbook leaves). F006 and F008 are coverage/mapping gaps, not missing files.

## Ruled Out
- Missing catalog feature files: all 11 feature-catalog leaves resolve on disk (evidence: leaf-manifest.json feature-catalog/* entries, ls feature-catalog/).
- Missing playbook scenario files: all 8 playbook leaves resolve on disk (evidence: leaf-manifest.json manual-testing-playbook/* entries).
- Missing REQ-002 invariant statements in SKILL.md: pipeline, both tiers, privacy-before-ranking, exact-original, content-free all present (SKILL.md §3, §4).

## Dead Ends
- None this iteration.

## Recommended Next Focus
D4 Maintainability — doc hygiene, scaffold residue (benchmark README TODO), naming, catalog coverage note, leaf-aliases parity, graph-metadata sibling edges, follow-on change cost.

Review verdict: CONDITIONAL
