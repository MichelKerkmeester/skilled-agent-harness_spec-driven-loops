# Review Resource Map - gpt-3

Resource-map input was absent at init, so this lineage emitted a compact review-derived map.

## Reviewed Surfaces
| Surface | Files |
|---------|-------|
| Root phase parent | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/spec.md`, `graph-metadata.json` |
| Family parent specs | `001-memory-commands/spec.md`, `002-speckit-commands/spec.md`, `003-create-commands/spec.md`, `004-doctor-commands/spec.md` |
| Memory routers | `.opencode/commands/memory/save.md`, `search.md`, `manage.md`, `learn.md` |
| Speckit routers/presentations | `.opencode/commands/speckit/*.md`, `.opencode/commands/speckit/assets/*_presentation.md` sampled |
| Create routers/presentations | `.opencode/commands/create/*.md`, `.opencode/commands/create/assets/*_presentation.md` sampled |
| Doctor routers/presentations | `.opencode/commands/doctor/*.md`, `_routes.yaml`, doctor presentation assets sampled |

## Novel Logic Gaps
- F001: root aggregate spec/metadata stale after child family completion.

## Empty-Result Areas
- Referenced command presentation/workflow asset existence: no missing paths found.
- Security/mutation-class review: no active P0/P1 security issue found.
