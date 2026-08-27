# Review Iteration 001 — Scope and direct consumer correctness

## Route

Resolved route: mode=review target_agent=deep-review

## Files reviewed

- `specs/system-speckit/036-spec-doc-template-reduction/goal-file-manifest.txt:1-72`
- `.opencode/skills/system-spec-kit/templates/` actual role folders
- `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:126-139`
- `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:201-226`

## Findings

### F001 — P1 — Declared review scope is invalid after the template move

Evidence: `goal-file-manifest.txt:30-39` lists ten files under the removed `templates/manifest/` directory, while the current sources are under `templates/core/`, `templates/addons/`, and `templates/packet-types/`. Lines 71-72 also include files from packet `037-decisions-memory-redesign`, outside this target. A strict manifest existence check therefore cannot resolve the declared scope, and the extra packet broadens the review boundary.

Disposition: active. Finding class: `scope-manifest-integrity`. Scope proof: full manifest read plus actual template inventory.

### F002 — P1 — Debug-delegation scaffold resolves a removed template path

Evidence: `scaffold-debug-delegation.sh:126` resolves the template root, but `:136` constructs `${TEMPLATES_BASE}/manifest/debug-delegation.md.tmpl`; the actual file is `templates/addons/debug-delegation.md.tmpl`. The script reaches this path after resolving the lazy-addon contract, so the direct workflow fails when it attempts to render the template.

Disposition: active. Finding class: `broken-runtime-reference`. Scope proof: direct read of the script and role-folder inventory.

## Claim adjudication

- Claim F001: accepted P1; evidence is direct and reproducible by path existence. Counterevidence sought: current manifest/role-folder resolver. Alternative explanation: a compatibility alias could exist, but no `manifest/` directory exists. Validator fingerprint: `read-only-path-inventory-v1`.
- Claim F002: accepted P1; evidence is a direct runtime path construction to a missing file. Counterevidence sought: `template-utils.sh` role lookup. Alternative explanation: an unshown symlink could bridge the path, but the inventory showed none. Validator fingerprint: `read-only-consumer-trace-v1`.

## Search coverage

`reviewDepthSchemaVersion: 2`; `graphCoverageMode: graphless_fallback`. Search ledger rows: `goal-file-manifest path existence -> finding:F001`; `direct template consumers -> finding:F002`; `role-folder lookup -> finding:F001`.

Review verdict: CONDITIONAL
