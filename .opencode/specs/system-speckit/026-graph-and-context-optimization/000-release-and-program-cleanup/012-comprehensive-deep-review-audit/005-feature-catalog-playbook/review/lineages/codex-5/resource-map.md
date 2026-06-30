# Review Resource Map

`resource-map.md` was absent in the target spec folder at init, so the formal resource-map coverage gate was skipped.

## Evidence Map

| Area | Files |
|---|---|
| Spec seed | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook/spec.md` |
| Feature catalog | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`, `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/feature-catalog-code-references.md` |
| Manual playbook | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`, scenarios 135-138 |
| Implementation samples | `mcp_server/handlers/memory-search.ts`, `mcp_server/handlers/memory-save.ts`, `mcp_server/handlers/memory-crud-delete.ts`, `mcp_server/api/eval.ts`, `mcp_server/handlers/index.ts` |
| Verifier dependency | `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py` |

## Phase-5 Augmentation

Novel logic gaps found:

- F001: root catalog annotation coverage overclaim.
- F002: annotation-name validity scenario uses a wrong-case catalog filename.
- F003: module-header scenario points to stale verifier path.
- F004: root playbook scenario count stale by one file.
- F005: representative implementation row points at an unannotated handler.
