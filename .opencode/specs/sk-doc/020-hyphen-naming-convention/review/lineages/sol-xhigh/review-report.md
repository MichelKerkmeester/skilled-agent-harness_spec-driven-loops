---
title: "Deep Review Report — 032 hyphen naming convention"
description: "Ten-iteration detached lineage review synthesized from reducer-owned state."
---

# Deep Review Report

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

- Overall verdict: **CONDITIONAL**
- hasAdvisories: false
- Active findings: P0=0, P1=6, P2=1
- Stop reason: 'maxIterationsReached' after 10/10 iterations
- Scope: the full 1,033-file planning packet (109,996 lines), including 176 specs, 156 plans, 156 task lists, 156 checklists, 30 decision records, 176 descriptions, 176 graph metadata files, and the phase-tree generator/manifest
- Coverage: correctness, security, traceability, and maintainability all reviewed
- Search debt: strict recursive validation is blocked before document checks by unresolved validator package '@spec-kit/shared'

No P0 was found. Six required contract fixes prevent PASS; one P2 portability advisory does not independently affect the verdict.
<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:planning-trigger -->
## 2. Planning Trigger

'/speckit:plan' is required. The six active P1 findings span the phase parent, generated topology, mutation tooling, handoff contracts, and the central frozen-map interface; they need an ordered remediation plan rather than isolated prose edits.

Planning Packet:

~~~json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id":"F001","severity":"P1","title":"The phase parent routes execution through a superseded topology","findingClass":"cross-consumer","affectedSurfaces":["root phase map","policy decision record","phase adjacency","continuity metadata"]},
    {"id":"F002","severity":"P1","title":"The checked-in authoritative phase tree is not reproducible from its generator","findingClass":"cross-consumer","affectedSurfaces":["phase-tree generator","phase-tree manifest","scaffolding","validation"]},
    {"id":"F003","severity":"P1","title":"Apply is not required to revalidate the reviewed dry-run snapshot","findingClass":"cross-consumer","affectedSurfaces":["dry-run plan","apply preflight","operation journal","worktree isolation","harness"]},
    {"id":"F004","severity":"P1","title":"The declared leading-hyphen CLI hazard has no rejecting engine or harness criterion","findingClass":"cross-consumer","affectedSurfaces":["semantic map validator","git mv argv","engine fixtures","harness scenarios"]},
    {"id":"F005","severity":"P1","title":"Current phase-transition gates remain placeholder-only","findingClass":"cross-consumer","affectedSurfaces":["root phase map","component phase map","handoff rows","resume routing"]},
    {"id":"F007","severity":"P1","title":"The frozen-map phase does not define its durable consumer interface","findingClass":"cross-consumer","affectedSurfaces":["phase 006 output","rename engine input","component receipts","whole-repo gate"]},
    {"id":"F006","severity":"P2","title":"The phase-tree generator defaults to a developer-private scratch path","findingClass":"local","affectedSurfaces":["generator CLI","developer workflow","manifest provenance"]}
  ],
  "remediationWorkstreams": [
    {"id":"WS1","title":"Canonical topology and reproducible generation","findings":["F001","F002"]},
    {"id":"WS2","title":"Versioned frozen-map producer/consumer contract","findings":["F007"]},
    {"id":"WS3","title":"Rename apply safety and adversarial fixtures","findings":["F003","F004"],"dependsOn":["WS2"]},
    {"id":"WS4","title":"Concrete parent phase scopes and handoffs","findings":["F005"],"dependsOn":["WS1","WS2"]},
    {"id":"ADV1","title":"Portable generator invocation","findings":["F006"],"advisory":true}
  ],
  "specSeed": [
    "Declare one current 12-top-level/175-node topology and remove superseded operational routing.",
    "Define a versioned byte-level frozen-map and batch artifact contract.",
    "Require apply-time plan, repository, map, and cleanliness revalidation.",
    "Define and test leading-hyphen operand behavior.",
    "Replace parent scope and handoff placeholders with concrete evidence gates."
  ],
  "planSeed": [
    "Fix and no-diff test phase-tree generation before refreshing parent topology.",
    "Author the phase-006 artifact schema and consumer validation rules.",
    "Update rename-engine requirements, tasks, and harness negative cases.",
    "Regenerate parent scope, adjacency, continuity, and handoff tables.",
    "Restore strict validator dependencies and rerun recursive validation."
  ],
  "findingClasses": {
    "cross-consumer": ["F001","F002","F003","F004","F005","F007"],
    "local": ["F006"]
  },
  "affectedSurfacesSeed": [
    "phase-parent routing",
    "phase-tree generation and manifest",
    "phase-006 frozen artifacts",
    "rename apply preflight",
    "engine and harness negative fixtures",
    "parent handoff authorization"
  ],
  "fixCompletenessRequired": true
}
~~~
<!-- /ANCHOR:planning-trigger -->

<!-- ANCHOR:active-finding-registry -->
## 3. Active Finding Registry

### F001 — P1 — Superseded operational topology

- Dimension: correctness, traceability
- Location: '.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:3'
- Evidence: the parent and policy define a current 16-phase 000-015 program, while graph metadata, the manifest, and filesystem use twelve top-level phases and 175 nested nodes. Phase 006 still points to absent successor '007-migrate-catalog-and-playbook'.
- Impact: operators and resume/adjacency flows can enter absent or renumbered phase paths.
- Recommendation: make the live generated topology the sole current contract and regenerate parent, policy, adjacency, and continuity references.
- Disposition: active
- findingClass: cross-consumer
- scopeProof: exact old-topology sweep, physical inventory, machine graph, and 674-link resolver
- affectedSurfaceHints: root map; policy decision record; phase 006 adjacency; continuity metadata

### F002 — P1 — Authoritative manifest is not reproducible

- Dimension: correctness, maintainability
- Location: '.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:138'
- Evidence: generator replay emits unnumbered descendant slugs and a different phase-006 name from the checked-in authoritative manifest; no documented post-process or no-diff gate exists.
- Impact: regeneration, scaffolding, or validation can target non-existent paths.
- Recommendation: make one documented command reproduce the manifest byte-for-byte and enforce a no-diff gate.
- Disposition: active
- findingClass: cross-consumer
- scopeProof: direct generator replay, semantic diff, and packet-wide invocation search
- affectedSurfaceHints: generator; manifest; scaffolding; graph refresh; validation

### F003 — P1 — Apply is not bound to the reviewed snapshot

- Dimension: security
- Location: '.opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77'
- Evidence: the plan records candidate/worktree and map identities, but no requirement or checklist makes apply revalidate HEAD/worktree identity, clean index/worktree, map hash, closure, and operation order before writes.
- Impact: a reviewed dry-run can be replayed against changed repository or map state.
- Recommendation: require an apply plan identifier and atomic pre-write revalidation; add stale-plan and dirty-tree negative fixtures.
- Disposition: active
- findingClass: cross-consumer
- scopeProof: engine and harness sweep for stale-plan, identity, HEAD/worktree, map, and clean/dirty invariants
- affectedSurfaceHints: dry-run plan; apply preflight; journal; isolation; harness

### F004 — P1 — Known leading-hyphen hazard lacks an executable criterion

- Dimension: security
- Location: '.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72'
- Evidence: policy explicitly names leading-hyphen CLI hazards, while engine and harness acceptance cover leading underscores and collisions but not a leading-hyphen source/target or argv-safety rule.
- Impact: map validation or command construction can reintroduce option-like operands.
- Recommendation: define reject-or-safe-argv behavior, option termination where applicable, and negative source/target fixtures.
- Disposition: active
- findingClass: cross-consumer
- scopeProof: policy-to-engine-to-harness search for leading-hyphen, argv, option termination, and unsafe-target fixtures
- affectedSurfaceHints: map validator; git mv argv; engine corpus; harness matrix

### F005 — P1 — Parent scopes and handoffs are placeholders

- Dimension: traceability, maintainability
- Location: '.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:232'
- Evidence: the root has three and the component parent thirteen mandatory handoffs with '[Criteria TBD]'/'[Verification TBD]'; parent scope tables also use '[Phase N scope]'.
- Impact: parent rollups do not define what authorizes the next phase or what each child contributes.
- Recommendation: bind every scope/handoff row to concrete child outputs, blocking receipts, and an exact verification command or artifact predicate.
- Disposition: active
- findingClass: cross-consumer
- scopeProof: complete placeholder scan plus inventory of all 156 leaf verification protocols
- affectedSurfaceHints: root phase map; component phase map; handoff rows; resume routing

### F007 — P1 — Frozen-map producer lacks a durable interface

- Dimension: traceability, maintainability
- Location: '.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:37'
- Evidence: phase 006 owns the classified inventory, bijective map, SCC batches, BASE binding, and digest but defines no canonical paths, schemas, serialization, ordering, digest framing/algorithm, or version fields. Phase 005 explicitly expects that map schema.
- Impact: mutation and verification phases cannot independently consume or hash the same frozen state.
- Recommendation: define versioned canonical inventory/map/classification/batch artifacts and byte-level consumer validation.
- Disposition: active
- findingClass: cross-consumer
- scopeProof: all phase-006 canonical docs and downstream map references searched for durable interface fields
- affectedSurfaceHints: phase 006 output; rename engine input; component receipts; whole-repo gate

### F006 — P2 — Generator default path is workstation-private

- Dimension: maintainability
- Location: '.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:218'
- Evidence: no-argument output is an absolute private scratchpad path; the positional output argument is undocumented.
- Impact: nominal invocation is non-portable and obscures the intended checked-in destination.
- Recommendation: use a repository-relative default or require/document an explicit output.
- Disposition: active advisory
- findingClass: local
- scopeProof: direct source read and packet-wide invocation search
- affectedSurfaceHints: generator CLI; developer workflow; manifest provenance
<!-- /ANCHOR:active-finding-registry -->

<!-- ANCHOR:remediation-workstreams -->
## 4. Remediation Workstreams

1. **WS1 — Canonical topology and reproducible generation (F001, F002).** Correct the generator first, add byte-for-byte/no-diff verification, then refresh the parent, policy, adjacency, continuity, graph, and manifest surfaces from one topology.
2. **WS2 — Frozen execution artifact contract (F007).** Version canonical inventory, classification, map, batch, BASE, and digest artifacts before tightening consumers.
3. **WS3 — Mutation safety (F003, F004).** Depending on WS2, bind apply to reviewed bytes/state and add stale-plan, dirty-tree, leading-hyphen, argv, and option-like path fixtures.
4. **WS4 — Parent execution authorization (F005).** Depending on WS1 and WS2, replace every scope and handoff placeholder with child outputs and exact gates.
5. **Advisory — Portable generator invocation (F006).** Address alongside WS1 without allowing it to obscure F002's required correctness gate.
<!-- /ANCHOR:remediation-workstreams -->

<!-- ANCHOR:spec-seed -->
## 5. Spec Seed

- The current topology source of truth is the checked-in, reproducible twelve-top-level/175-node manifest; historical 16-phase text is non-operational.
- Phase 006 emits versioned canonical artifacts for inventory, classification, map, SCC batches, BASE binding, and digest metadata.
- Apply accepts only a reviewed plan whose repository state, map bytes, and operation order still match at the first write boundary.
- Path grammar explicitly defines leading-hyphen segments and command-operand safety.
- Each parent phase row names concrete scope, predecessor evidence, successor authorization, and verification.
<!-- /ANCHOR:spec-seed -->

<!-- ANCHOR:plan-seed -->
## 6. Plan Seed

1. Add a generator no-diff test and correct divergent node slugs, including phase 006.
2. Regenerate the manifest and machine topology, then reconcile current parent/policy/adjacency/continuity prose.
3. Design and document the frozen-map artifact schemas, canonical paths, ordering, version, and digest framing.
4. Amend rename-engine spec/plan/tasks/checklist and harness scenarios for snapshot binding and option-like paths.
5. Populate root and component-parent scope/handoff tables from concrete child contracts.
6. Restore '@spec-kit/shared' dependency resolution and run recursive strict validation.
7. Re-run this review or an equivalent focused remediation review; require zero active P0/P1 findings.
<!-- /ANCHOR:plan-seed -->

<!-- ANCHOR:traceability-status -->
## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| 'spec_code' | fail | F001-F005, F007 | Six required contracts disagree with or underspecify execution. |
| 'checklist_evidence' | fail | F003-F005, F007 | Negative fixtures and parent/producer evidence bindings are incomplete. |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| 'feature_catalog_code' | pass | iteration 8 compatibility lifecycle | None in the planned transition state machine. |
| 'playbook_capability' | pass | iteration 8 compatibility lifecycle | None in the planned transition state machine. |
| 'skill_agent' | notApplicable | target is a spec folder | None. |
| 'agent_cross_runtime' | notApplicable | target is a spec folder | None. |

- AC_COVERAGE: exempt. The review target is a lean phase parent; it has no root checklist/implementation-summary lifecycle pair to score.
- Resource Map Coverage Gate: skipped because 'resource_map_present' was false at initialization. The lineage-local generated resource map is synthesis evidence, not an applied-report coverage gate.
<!-- /ANCHOR:traceability-status -->

<!-- ANCHOR:deferred-items -->
## 8. Deferred Items

- F006 is advisory and can ship with WS1, but it does not block remediation sequencing on its own.
- Strict recursive validation must be rerun after the validator runtime resolves '@spec-kit/shared'; current failure occurred before packet document evaluation.
- No implementation fixes were performed in this read-only review lineage.
<!-- /ANCHOR:deferred-items -->

<!-- ANCHOR:dimension-expansion-map -->
## Dimension Expansion Map

- Saturated directions: none recorded
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Council artifacts: none
- Selected directions: topology coherence; mutation safety; cross-link and checklist traceability; metadata integrity; generator provenance; frozen-map interface; compatibility lifecycle; template drift; terminal adversarial replay
- Remaining frontier: no uncovered required dimension; remediation verification remains after fixes
<!-- /ANCHOR:dimension-expansion-map -->

<!-- ANCHOR:search-ledger -->
## 9. Search Ledger

- hasSearchDebt: true
- Coverage mode: graphless fallback, because user-authorized writes were confined to this lineage
- Candidate coverage: 12 bug classes covered, 27 ruled out, 0 deferred, 1 blocked
- Blocked debt: 'strict_validator_runtime' — '@spec-kit/shared' could not be resolved before document checks
- Clean proof: 176 metadata nodes/IDs, 175 reciprocal non-root edges, 674 matching source hashes, 674 Markdown files with zero broken explicit relative links, 175 unique descendant specs/descriptions, and a coherent phase-002/009/010 compatibility lifecycle
- Principal ruled-out candidates: missing repository boundary; post-write collision discovery; widespread broken Markdown links; missing leaf protocols; graph corruption; source-hash drift; legacy writer leakage; early alias removal; both-root ambiguity; duplicate leaf specs; missing review dimension
- Active covered bug classes: phase topology, generated-artifact drift, stale-plan replay, CLI option-like paths, placeholder handoffs, non-portable generator CLI, and missing frozen-artifact schema
<!-- /ANCHOR:search-ledger -->

<!-- ANCHOR:audit-appendix -->
## 10. Audit Appendix

### Convergence

- Ten iterations completed under 'max-iterations'; convergence never shortened the loop.
- Reducer convergence score: 1.00
- Graph convergence telemetry: 0.968, terminal decision STOP for 'maxIterationsReached'
- Latest three new-finding ratios: 0.00, 0.00, 0.00
- State corruption warnings: 0
- Final active registry: P0=0, P1=6, P2=1, resolved=0

### Coverage

- Files in declared packet scope: 1,033
- Lines: 109,996
- Canonical document inventory: 176 specs, 156 plans, 156 tasks, 156 checklists, 30 decision records, 176 descriptions, 176 graph metadata files
- Dimensions: 4/4 covered
- Iteration verification: 10/10 narrative + route-proof + JSONL delta checks passed

### Ruled-Out Claims

- The machine graph is not corrupt or stale relative to its declared sources.
- Explicit Markdown links are not broadly broken.
- Leaf verification protocols are not missing, and no checklist falsely claims completion.
- The dual-name compatibility state machine does not leak legacy writes, permit early alias removal, or tolerate both-root ambiguity.
- Leaf specs are not exact duplicate template copies.

### Sources Reviewed

- Root spec, policy decision record, phase-tree generator/manifest, root and descendant graph metadata
- All 674 packet Markdown documents for explicit-link resolution
- All 156 checklists for protocol and status inventory
- All 175 descendant specs and descriptions for uniqueness/placeholder analysis
- Focused canonical contracts for phases 002, 005, 006, 008, 009, and 010
- Reducer-owned config, state log, registry, strategy, dashboard, deltas, and resource map

### Core Protocols

- 'spec_code': fail — active F001-F005 and F007
- 'checklist_evidence': fail — active F003-F005 and F007

### Overlay Protocols

- 'feature_catalog_code': pass
- 'playbook_capability': pass
- 'skill_agent': notApplicable
- 'agent_cross_runtime': notApplicable
<!-- /ANCHOR:audit-appendix -->

Review verdict: CONDITIONAL
