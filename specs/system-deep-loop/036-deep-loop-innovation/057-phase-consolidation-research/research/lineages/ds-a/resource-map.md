# Resource Map — ds-a (fanout lineage)

Derived from the evidence sources actually consumed by this research lineage.

| Section | Entry count | Theme |
|---------|-------------|-------|
| Parent packet metadata | 4 | spec.md, graph-metadata.json, description.json, manifest/phase-tree.json |
| Child packet metadata | ~167 | graph-metadata.json files across the 036 tree (44 children + inner) |
| Spec-kit validation | 2 | validate.sh (hardcoded 036 manifest), recursive-child-manifest.vitest.ts |
| Repo index | 1 | specs/descriptions.json (133 entries reference 036) |
| Runtime code | ~6 | write-set-conflict-graph/graph.ts, shipped-census.ts, runtime tests (legacy-real-log.ts, cutover-certificate.vitest.ts, rollback-gate tests) |
| Cross-repo references | 98 | non-036 files referencing 036-deep-loop-innovation |
| Lineage artifacts | 5 | iterations/iteration-001..005.md |

Note: `resource-map.md` was not present in the host packet at init (`resource_map_present` derived false); this map is emitted from converged research deltas.
