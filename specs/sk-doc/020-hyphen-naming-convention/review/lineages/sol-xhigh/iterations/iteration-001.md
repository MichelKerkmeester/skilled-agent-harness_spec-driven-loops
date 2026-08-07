# Iteration 1: Correctness - topology coherence

## Dispatcher

- Route: `mode=review target_agent=deep-review`
- Budget profile: `verify`
- Scope: root parent contract, generated phase-tree source/output, filesystem topology, root graph metadata

## Files Reviewed

- `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md`
- `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs`
- `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json`
- `.opencode/specs/sk-doc/020-hyphen-naming-convention/graph-metadata.json`
- Descendant filesystem inventory (176 `spec.md` files including the root)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **F001 - The phase parent routes execution through a superseded topology** -- `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:3` -- The description, continuity, review note, phase map, and sequencing invariant still define a 16-phase `000-015` program, including children `007-migrate-catalog-and-playbook` through `015-integrate-and-closeout` [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:3`; `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:18`; `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:53`; `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:134-153`]. The live graph metadata instead has twelve top-level children `000-011`, with `007-shared-and-cross-cutting-closures` and `008-component-migration` as parents [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/graph-metadata.json:6-18`], and the authoritative phase-tree enumerates 175 nested nodes [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:4-20`]. An operator following the parent source of truth is sent to non-existent or renumbered phase folders, so this is a required contract fix rather than documentation polish.
   - Finding class: cross-consumer
   - Scope proof: Exact searches for `16-phase`, `000-015`, and the old `007-015` slugs show the stale topology is load-bearing in the root map and decision record, while graph metadata and the physical tree use the 12-top-level/175-node decomposition.
   - Affected surface hints: `root phase map`, `continuity next action`, `decision record`, `graph metadata`, `phase-tree manifest`
   - Recommendation: Reconcile the parent spec and decision record to the generated 12-top-level/175-node topology, including the renamed/renumbered phase adjacency and sequencing text.

```json
{"findingId":"F001","type":"contract_safety","claim":"The authoritative phase parent still routes operators through the superseded 16-phase 000-015 topology while the live packet uses twelve top-level phases and 175 nested nodes.","evidenceRefs":[".opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:3",".opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:134-153",".opencode/specs/sk-doc/020-hyphen-naming-convention/graph-metadata.json:6-18",".opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:4-20"],"counterevidenceSought":"Checked the root graph metadata, generated phase-tree totals and top-level nodes, and the physical descendant spec count; all three agree on the newer nested decomposition rather than the root's 16-phase map.","alternativeExplanation":"The root map could be retained as historical context, but it is presented as the current Phase Documentation Map and sequencing contract, so that reading is rejected.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if the root map is explicitly labeled historical and a current executable phase map becomes the authoritative operator entry point."}
```

2. **F002 - The checked-in authoritative phase tree is not reproducible from its generator** -- `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:138` -- The generator emits unnumbered descendant slugs and renames phase 006 to `006-inventory-frozen-map-and-batch-graph` [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:138-165`], while the checked-in manifest contains numbered descendant slugs such as `001-create-skill-and-packaging` and retains `006-inventory-and-frozen-map` [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:53-88`; `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:138-144`]. A fresh generator run produces a broad diff immediately, contradicting the manifest's source-of-truth/generated provenance claim [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:4`]. Scaffolding or verification that regenerates the tree will target paths that do not exist.
   - Finding class: cross-consumer
   - Scope proof: A direct generator replay and manifest diff showed the mismatch begins at the first nested child and repeats across nested subtrees; exact search separately confirmed the phase-006 slug divergence.
   - Affected surface hints: `phase-tree generator`, `phase-tree manifest`, `scaffolded folders`, `graph metadata`, `validation loop`
   - Recommendation: Make `build-phase-tree.mjs` generate the numbered slugs and canonical phase-006 name that exist on disk, then add a no-diff regeneration gate.

```json
{"findingId":"F002","type":"correctness","claim":"The authoritative phase-tree manifest cannot be reproduced by build-phase-tree.mjs because the generator emits different descendant slugs and a different phase-006 path.","evidenceRefs":[".opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:138-165",".opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:4",".opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:53-88",".opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:138-144"],"counterevidenceSought":"Executed the generator against a separate output and diffed it with the checked-in manifest; the differences are systematic rather than formatting-only.","alternativeExplanation":"The checked-in manifest may have been post-processed by a separate numbering step, but no such step is declared by the generator or manifest provenance and the generator calls its output authoritative.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade if a documented deterministic post-processing step reproduces the checked-in manifest exactly and is enforced by validation."}
```

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | fail | hard | `spec.md:3,134-153`; `phase-tree.json:4-20` | Parent topology contradicts the live packet and manifest. |
| `checklist_evidence` | pending | hard | n/a | Scheduled for a dedicated traceability pass. |
| `feature_catalog_code` | notApplicable | advisory | n/a | This pass examined phase topology only. |
| `playbook_capability` | notApplicable | advisory | n/a | This pass examined phase topology only. |

## Integration Evidence

- Exact integration surfaces checked: root phase map, manifest generator, generated manifest, root graph metadata, physical descendant spec inventory.
- Graphless fallback used: direct reads, exact searches, generator replay, and filesystem inventory with cited source anchors.

## Edge Cases

- The physical packet is not incomplete: it contains 176 specs including the root, matching the manifest's 175 node entries plus the phase parent.
- The manifest's `leaf_docs_estimate` is an estimate, not treated as a defect in this pass.

## Confirmed-Clean Surfaces

- Root graph metadata top-level children agree with the physical top-level `000-011` folders.
- Manifest totals agree with the physical count of descendant spec nodes.

## Ruled Out

- **Missing scaffolding as the cause of the root mismatch**: ruled out because the descendant spec count matches the 175-node manifest.
- **Formatting-only generator drift**: ruled out because generated path identifiers and phase 006 differ semantically.

## Next Focus

- Dimension: security
- Focus area: path-boundary, symlink, collision, and command-injection constraints across the policy, baseline, guard, rename engine, and reference checker specs
- Reason: the migration acts on repo-wide filesystem paths and shell/module references; unsafe boundary gaps have the highest remaining blast radius
- Rotation status: correctness topology pass complete; broaden to security as required by max-iterations policy
- Required evidence: direct requirements/checklist citations plus negative-fixture coverage

## Assessment

- New findings: P0=0 P1=2 P2=0
- New findings ratio: 1.0
- Status: complete
- Verdict basis: P1 findings remain active; no P0 found

Review verdict: CONDITIONAL
