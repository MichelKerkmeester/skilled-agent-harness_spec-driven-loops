# Review Resource Map

`resource-map.md` was not present in the target packet at init, so the deep-review resource-map coverage gate was marked not applicable. This emitted review map captures the files and checks used by this lineage.

## Inputs

| Resource | Purpose |
|---|---|
| `spec.md` | Slice scope and acceptance criteria. |
| `feature_catalog/feature_catalog.md` | Master feature inventory. |
| `feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md` | Code-reference traceability claim. |
| `manual_testing_playbook/manual_testing_playbook.md` | Master playbook, release-readiness rules, cross-reference index. |
| `manual_testing_playbook/16--tooling-and-scripts/231-grep-traceability-for-feature-catalog-code-references.md` | Grep traceability scenario. |
| `manual_testing_playbook/16--tooling-and-scripts/232-feature-catalog-annotation-name-validity.md` | Annotation-name validity scenario. |

## Checks

| Check | Result |
|---|---|
| Annotation names vs H3 headings | 126 annotations, 238 headings, 0 invalid annotations. |
| Feature files with scenario source refs | 276 linked, 48 unlinked from the sampled source-ref extraction. |
| Scenario count by documented rule | 384 current scenario files, while root playbook expects 380. |
| Scenario files linked by root index | 384 scenario files, 325 root links, 90 unlinked by direct path comparison. |
| Root playbook markdown links | 83 broken relative links found. |
| Scenario markdown links | 29 broken relative links found. |
| Feature catalog markdown links | 0 broken relative links found in sampled feature files. |
| Code-reference file coverage | 195 of 990 non-test TypeScript files carry feature-catalog annotations under the audited paths. |

## Phase-5 Augmentation

Novel logic gaps found:

- Release-readiness count drift invalidates the current playbook gate.
- Root index orphan count is not zero.
- Feature-to-scenario coverage is not classified for at least 48 catalog entries.
- Link integrity is not currently enforced across the manual playbook package.
