# Context Index: sk-doc Documentation-Quality Program

Per-phase cross-reference for the `021-documentation-quality-program` phase parent. The parent `spec.md` holds root purpose and the phase map; each child below owns its own scope, plan, tasks, checklist, and evidence.

| Phase | Status | One-line scope |
|---|---|---|
| `001-json-cleanup-and-conventions` | complete | Removed `sk-prompt/prompt-models/description.json`; added recursive rule 2b to `parent-skill-check.cjs`; codified the advisor-metadata placement rule in the doctrine and AGENTS.md |
| `002-reference-asset-template-alignment` | complete | 3 flagged create-skill reference/asset files conformed to ALL-CAPS headers + frontmatter; all three VALID. `h2UppercaseRequired` flip + deep HVR pass deferred (would fail 41 repo-wide offenders) |
| `003-doc-tooling-and-template-fixes` | complete | Fixed `validate_document.py` symlink path (4 sites, `.resolve()`); added 2 `skill-readme-template.md` clarifications + version bump. `audit_readmes.py` doc deferred to its phase-005 code README |
| `004-skill-mode-readme-overhaul` | complete | 14 READMEs to the 9-section template: 11 sk-doc mode full rewrites, 2 terse sk-code surface additions, `sk-git` AT A GLANCE insert. All VALID, 0 em dashes. Fixed stale asset paths in `create-readme` and `create-command` |
| `005-code-readmes-infra-and-sk` | complete | 33 code READMEs authored (8 sk-doc, 6 sk-code, 6 system-code-graph, 5 skill-advisor, 4 mcp-code-mode, 3 mcp-tooling, 1 cli). All VALID, CONTENTS cross-checked, 0 em dashes |
| `006-code-readmes-design-prompt-speckit` | complete | 38 of 45 code READMEs authored (12 sk-design, 8 sk-prompt harness, 18 system-spec-kit). All VALID, CONTENTS cross-checked, 0 em dashes. 7 excluded: 6 benchmark seed fixtures (README could pollute the eval) + 1 stale `__tests__` duplicate |
| `007-code-readmes-deep-loop` | planned | Code READMEs: system-deep-loop; stale runtime catalog fixes |
| `008-verification-and-closeout` | planned | Full validation gate; conformance sweeps; optional-extension decisions |

## Discovered pre-existing issues (surfaced, tracked for the relevant phase)

- `parent-skill-check.cjs` rule `10a-manifest-source` fails on every hub even though `create-skill/scripts/generate-leaf-manifest.cjs` and `lib/leaf-resource-contract.cjs` exist. Confirmed pre-existing (fails on the base checker with this program's edits stashed). Path-resolution bug; relevant to the create-skill/scripts work in Phase 005.
- The recursive rules 2a and 2b false-positive if pointed at `system-spec-kit` (its `scripts/**` holds spec-folder-schema test fixtures named `description.json`/`graph-metadata.json`). system-spec-kit is a standalone skill, not one of the 7 checked parent hubs, so the checker is not run against it in practice. A fixture-dir exclusion would fix both rules together if ever needed.
- `create-command/references/README.md` still links the stale `assets/command/command-template.md` path (the real file is flat, `assets/command-template.md`). Phase 004 fixed the mode README but left the reference file. Relevant to the phase 008 conformance sweep.
- `sk-design/design-mcp-open-design/__tests__/transport-grounding.test.mjs` is a byte-identical stale duplicate of the sibling `tests/` copy (the `tests/` copy is more recent and matches the repo `tests/` convention; neither is referenced by any config). Phase 006 documented the live `tests/` folder and left `__tests__/` undocumented. OPERATOR DELETE DECISION: remove the stale `__tests__/` folder. Deferred to phase 008.
- Phase 006 author findings (code, not documentation): `sk-prompt/.../001-swe-1.6-eval-loop/scripts/score-variant.cjs` resolves `RIG_ROOT` to a renamed sibling (`002-eval-rig`) that no longer exists under that name; `sk-prompt/.../003-minimax-prompt-framework/eval-loop/scripts/dispatch-swe16.cjs` is an unused byte-identical carryover. Both noted in their folder READMEs; a code fix is out of this program's documentation scope.
