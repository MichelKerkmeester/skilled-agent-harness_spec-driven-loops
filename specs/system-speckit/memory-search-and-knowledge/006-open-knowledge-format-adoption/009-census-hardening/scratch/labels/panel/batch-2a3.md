
## Row 60 (ambiguous)
- Doc: `specs/system-speckit/027-xce-research-based-refinement/research/005-live-rescope-coco-purge/iterations/iteration-074.md:20`
- Citation: `005-env-tests-integration/spec.md:38`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
[F-074-04] `005-env-tests-integration/description.json` has a real manual dependency edge to deleted `002`; `005` graph metadata has no manual dependency/child edge, but its derived metadata is stale and should regenerate after docs edits. `005-env-tests-integration/description.json:17-23`, `005-env-tests-integration/graph-metadata.json:6-13`, `005-env-tests-integration/graph-metadata.json:141-144`, `005-env-tests-integration/graph-metadata.json:171`

[F-074-05] `005/spec.md` also has structural dependency/handoff refs to deleted `002`: metadata `Depends On`, coco flag scope, consumer count, children `002-004`, open question, and related-doc link. `005-env-tests-integration/spec.md:38`, `005-env-tests-integration/spec.md:48`, `005-env-tests-integration/spec.md:57-64`, `005-env-tests-integration/spec.md:76-79`, `005-env-tests-integration/spec.md:100`, `005-env-tests-integration/spec.md:131`, `005-env-tests-integration/spec.md:147-150`

[F-074-06] No nested `002-coco` edit is required in the 027 parent or `001-aggregator/graph-metadata.json`: 027 lists only `008` as the child phase, and `001` has no downstream/manual edge. `027-xce-research-based-refinement/graph-metadata.json:6-16`, `027-xce-research-based-refinement/description.json:27-36`, `027-xce-research-based-refinement/context-index.md:35-40`, `001-aggregator/graph-metadata.json:6-13`
```

