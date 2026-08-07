---
title: "Deep Review Report: hyphen naming convention"
description: "Detached sol-high lineage synthesis after twenty review iterations."
verdict: CONDITIONAL
hasAdvisories: false
releaseReadinessState: conditional
stopReason: maxIterationsReached
sessionId: fanout-sol-high-1784307871185-l34e0c
---
# Deep Review Report: Hyphen Naming Convention

## Executive Summary

**Verdict: CONDITIONAL.** Five P1 findings and one P2 advisory remain active after 20 iterations. All four dimensions and both required core traceability protocols received coverage. The finding set stabilized after iteration 4, but the coverage graph remained empty and returned `CONTINUE`; the configured `maxIterationsReached` ceiling therefore ended the loop.

- Active findings: P0=0, P1=5, P2=1
- hasAdvisories: false (the workflow exposes this flag only for a PASS verdict; F006 remains listed as P2)
- Release readiness: `conditional`
- Scope: the phase-parent packet, 176 manifest nodes, 157 leaf packets, and 1,041 inventoried packet artifacts
- Resource-map coverage gate: skipped because no packet resource map existed at initialization; the lineage-local reducer map was still emitted

## Planning Trigger

`/speckit:plan` remediation is required before execution. The P1 findings affect the authoritative topology, current routing prose, mutation safety, command operand safety, and worktree identity.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"findingId":"F001","severity":"P1","title":"Authoritative phase tree is not reproducible from its generator","file":".opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:149","findingClass":"cross-consumer","affectedSurfaceHints":["phase-tree generator","phase-tree manifest","scaffolding","graph refresh"]},
    {"findingId":"F002","severity":"P1","title":"Root execution contract retains superseded phase identities","file":".opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:168","findingClass":"cross-consumer","affectedSurfaceHints":["root success criteria","risk mitigations","resume routing","phase handoffs"]},
    {"findingId":"F003","severity":"P1","title":"Rename apply is not bound to the reviewed repository and map snapshot","file":".opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77","findingClass":"cross-consumer","affectedSurfaceHints":["rename dry-run plan","apply preflight","operation journal","fixture harness"]},
    {"findingId":"F004","severity":"P1","title":"Declared leading-hyphen hazard lacks an executable rejection criterion","file":".opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72","findingClass":"cross-consumer","affectedSurfaceHints":["map validation","git mv argv","fixture corpus","security checklist"]},
    {"findingId":"F005","severity":"P1","title":"Execution identity is split across packet 020, legacy 032, and branch slug 017","file":".opencode/specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census/tasks.md:49","findingClass":"cross-consumer","affectedSurfaceHints":["worktree allocator","branch name","packet metadata","phase titles","verification evidence"]},
    {"findingId":"F006","severity":"P2","title":"Most spec nodes point their HVR marker at a nonexistent path","file":".opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:36","findingClass":"cross-consumer","affectedSurfaceHints":["spec authoring guidance","review standards","template provenance"]}
  ],
  "remediationWorkstreams": [
    "WS1: restore one reproducible phase topology and current operational phase map",
    "WS2: bind rename apply to the reviewed snapshot and make option-like path behavior executable",
    "WS3: choose one packet/worktree identity before phase 000",
    "WS4: normalize the HVR standards pointer"
  ],
  "specSeed": [
    "Require byte-for-byte phase-tree regeneration from the checked-in generator",
    "Require atomic apply-time repository, map, cleanliness, source, target, and operation-order revalidation",
    "Define reject-or-safe-argv behavior for option-like paths",
    "Freeze one current packet and allocator identity before phase 000"
  ],
  "planSeed": [
    "Repair the generator and add a no-diff regeneration gate",
    "Reconcile live root phase references against the 000-011 map",
    "Add immutable plan identity plus stale-plan and dirty-tree fixtures",
    "Add leading-hyphen source and target fixtures",
    "Normalize allocator, branch, directory, title, and parent labels"
  ],
  "findingClasses": ["cross-consumer"],
  "affectedSurfacesSeed": ["phase topology","root routing","rename engine","fixture harness","worktree allocator","spec standards markers"],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

### F001 — Authoritative phase tree is not reproducible from its generator

- Severity / dimension: P1 / correctness
- Evidence: `manifest/build-phase-tree.mjs:149-153`; `manifest/phase-tree.json:104-145`. Replay removes phase 005 child 004 and changes totals from 176/157 to 175/156.
- Impact: scaffolding and graph refresh can silently erase the reference-rewrite executor node.
- Fix: add child 004 to the generator and enforce byte-for-byte no-diff regeneration.
- Disposition / class: active / `cross-consumer`
- Scope proof: direct generator replay plus manifest, parent, and graph comparison.
- Affected surfaces: phase-tree generator, manifest, scaffolding, graph refresh.

### F002 — Root execution contract retains superseded phase identities

- Severity / dimension: P1 / correctness
- Evidence: `spec.md:134-149,168-197`. Current success and risk prose refers to phases 014/015 and obsolete meanings for 007/009/011 despite the current 000-011 map.
- Impact: an executor or resume flow can route work to the wrong phase contract.
- Fix: reconcile operational references to the current map and label historical numbers explicitly.
- Disposition / class: active / `cross-consumer`
- Scope proof: stale-number sweep compared with root map and graph metadata.
- Affected surfaces: success criteria, risk mitigations, resume routing, handoffs.

### F003 — Rename apply is not bound to the reviewed repository and map snapshot

- Severity / dimension: P1 / security
- Evidence: `005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77-100`; its checklist at lines 57-75. Apply lacks a blocking revalidation of repository/map identity, cleanliness, sources, targets, and operation order immediately before the first write.
- Impact: a reviewed plan can be applied to changed repository state.
- Fix: require an immutable plan identifier and atomic apply-time revalidation; add stale-plan and dirty-tree negative fixtures.
- Disposition / class: active / `cross-consumer`
- Scope proof: engine, checklist, harness, and the separate reference-rewrite CAS contract were compared.
- Affected surfaces: dry-run plan, preflight, journal, fixture harness.

### F004 — Declared leading-hyphen hazard lacks an executable rejection criterion

- Severity / dimension: P1 / security
- Evidence: `001-convention-policy-and-scope/decision-record.md:72-77`; rename-engine spec lines 84-91; harness checklist lines 53-61.
- Impact: option-like path operands have no observable reject-or-safe-argv contract.
- Fix: specify safe argv construction or rejection and add leading-hyphen source/target fixtures.
- Disposition / class: active / `cross-consumer`
- Scope proof: policy-to-engine-to-harness search for leading hyphens, argv, option termination, and option-like operands.
- Affected surfaces: validation, `git mv` argv, fixtures, security checklist.

### F005 — Execution identity is split across packet 020, legacy 032, and branch slug 017

- Severity / dimension: P1 / traceability
- Evidence: root `spec.md:15-53`; phase 000 `tasks.md:48-50`; phase 001 `checklist.md:53-56`.
- Impact: the first executable phase cannot derive one canonical packet, branch, and worktree identity.
- Fix: decide the current identity before phase 000 and derive allocator input, expected outputs, titles, and parent labels from it.
- Disposition / class: active / `cross-consumer`
- Scope proof: exact packet-number and worktree-grammar sweep.
- Affected surfaces: allocator, branch and directory names, metadata, titles, evidence.

### F006 — Most spec nodes point their HVR marker at a nonexistent path

- Severity / dimension: P2 / maintainability
- Evidence: `spec.md:36`; 116 packet Markdown files use `.opencode/skills/sk-doc/references/hvr_rules.md`, while the live file is `.opencode/skills/sk-doc/shared/references/hvr_rules.md` and 17 files already use it.
- Impact: reviewers cannot follow the declared standards source from most packet nodes.
- Fix: normalize markers to the shared path or add an intentional compatibility alias.
- Disposition / class: active / `cross-consumer`
- Scope proof: corpus count excluding review artifacts plus filesystem existence checks.
- Affected surfaces: authoring guidance, review standards, template provenance.

## Remediation Workstreams

1. **WS1, required topology repair:** fix F001 and F002 together, regenerate the phase tree, refresh dependent graph state, and prove all operational phase references use the current map.
2. **WS2, required mutation-safety contract:** fix F003 and F004 in the rename engine, harness, and checklists; replay stale-plan, dirty-tree, and option-like operand cases.
3. **WS3, required identity reconciliation:** fix F005 before phase 000 so allocator inputs and expected outputs are deterministic.
4. **WS4, advisory documentation hygiene:** fix F006 mechanically and rerun standards-pointer checks.

## Spec Seed

- Make the checked-in generator the sole reproducible source of phase topology.
- Replace superseded operational phase references while preserving explicitly historical labels.
- Add a pre-write rename invariant tying the approved plan to HEAD, map hash, clean state, complete source/target set, and operation order.
- Define path operands beginning with `-` as rejected or prove option-safe argv construction.
- Establish one current packet/worktree identity before baseline capture.

## Plan Seed

1. Repair `build-phase-tree.mjs`, regenerate to a temporary output, and assert zero diff against the authoritative manifest.
2. Sweep current operational prose for stale phase numbers and verify destinations against graph metadata.
3. Extend the rename-plan schema with immutable repository/map identity and add atomic preflight validation.
4. Add stale-plan, dirty-tree, source drift, target drift, reordered-operation, and leading-hyphen fixtures.
5. Resolve the 020/032/017 identity before invoking the allocator and update derived labels.
6. Normalize HVR markers and rerun link, metadata, generator, and strict packet validation.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | fail | F001-F005 source comparisons and generator replay | Topology, operational routing, mutation preconditions, operand safety, and live identity are inconsistent. |
| `checklist_evidence` | partial | F003/F004 harness and checklist comparison; F005 phase-000/001 evidence | Required negative cases and a pre-phase-000 identity gate are missing. |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `skill_agent` | notApplicable | Review target is a spec-folder packet, not a skill/agent implementation pair. | None. |
| `agent_cross_runtime` | notApplicable | No runtime-agent implementation is in the target. | None. |
| `feature_catalog_code` | notApplicable | No implementation/catalog claim is being validated in this pre-execution packet. | None. |
| `playbook_capability` | notApplicable | No shipped capability/playbook pair is in scope. | None. |

- `AC_COVERAGE`: exempt. The review target is a lean phase parent; executable acceptance evidence lives in its children and implementation has not started.
- Resource Map Coverage Gate: not applicable because `resource_map_present=false` at initialization.

## Deferred Items

- F006 is advisory and can be bundled with the topology documentation repair.
- The lineage-local resource map contains no implementation references because the review deltas describe a documentation packet, not applied implementation reports.
- Coverage-graph population is an infrastructure follow-up; the mandated evaluator returned an empty graph under this detached session.

## Dimension Expansion Map

- Saturated directions: topology regeneration, operational phase identity, rename mutation boundaries, option-like operands, worktree identity, metadata integrity, symlink containment, rollback, whole-repository gates, and final integration.
- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Council artifacts: none.
- Selected directions: 20 focused passes across correctness, security, traceability, and maintainability.
- Remaining frontier: remediation verification after fixes; no unreviewed high-risk packet surface remained at the hard ceiling.

## Search Ledger

- `hasSearchDebt: false`
- Graph coverage mode: `graphless_fallback`; the runtime graph evaluator returned zero nodes and zero edges for this session.
- Candidate coverage: 24 covered bug classes and 76 ruled-out candidates; none deferred or blocked.
- Search debt: none.
- Ruled out: additional topology orphans, mixed whole-gate candidate identity, dangling symlink acceptance, ownerless component handoffs, stale metadata hashes, pre-rebase evidence reuse, forced stale rewrites, missing rollback journals, requirement/evidence gaps beyond active findings, additional standards-pointer targets, and additional option-like operand classes.
- Clean-search proof: iterations 5-20 produced zero new findings while directly replaying all active P1 claims and the highest-risk adjacent variants.

## Audit Appendix

### Convergence

- Stop reason: `maxIterationsReached`
- Iterations: 20/20
- Final three new-finding ratios: 0.00, 0.00, 0.00
- Reducer convergence score: 1.00
- Graph decision: `CONTINUE` with an empty session graph; terminal hard stop preserved that evidence.
- Dimension coverage: 4/4
- Active severities: P0=0, P1=5, P2=1

### Coverage

| Dimension | First pass | Expansion / stabilization passes | Active findings |
|-----------|-----------:|----------------------------------|-----------------|
| Correctness | 1 | 5, 7, 10, 14, 18 | F001, F002 |
| Security | 2 | 6, 11, 15, 19 | F003, F004 |
| Traceability | 3 | 8, 12, 16 | F005 |
| Maintainability | 4 | 9, 13, 17, 20 | F006 |

### Core Protocols

- `spec_code`: executed; fail due to F001-F005.
- `checklist_evidence`: executed; partial due to missing negative fixtures and unresolved execution identity.

### Overlay Protocols

- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not applicable to this pre-execution spec-folder target.

### Ruled-Out Claims and Sources

- All 177 graph metadata and description records parsed; graph reciprocity, folder slugs, and stored spec hashes were current.
- All 177 specs retained template provenance markers; 680 Markdown files had no broken explicit relative links.
- Reviewed sources include the root contract, manifest generator and output, phases 000-011, all phase metadata/description/spec records, and focused rename, symlink, gate, and closeout children.
- Artifact set: config, append-only state, reducer registry, dashboard, strategy, 20 prompts, 20 narratives, 20 delta streams, resource map, and this report.
- JSONL corruption warnings: 0.
- Strict packet validation was attempted under Node 25 and Node 22. Both returned warning exit 1 because the TypeScript fallback could not resolve the local `@spec-kit/shared` workspace package; no exit-2 packet error was reported. The lineage-specific verification gates all passed.
