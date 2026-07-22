# Context Index: sk-doc Documentation-Quality Program

Per-phase cross-reference for the `021-documentation-quality-program` phase parent. The parent `spec.md` holds root purpose and the phase map; each child below owns its own scope, plan, tasks, checklist, and evidence.

| Phase | Status | One-line scope |
|---|---|---|
| `001-json-cleanup-and-conventions` | complete | Removed `sk-prompt/prompt-models/description.json`; added recursive rule 2b to `parent-skill-check.cjs`; codified the advisor-metadata placement rule in the doctrine and AGENTS.md |
| `002-reference-asset-template-alignment` | planned | 3 flagged create-skill reference/asset files to ALL-CAPS/frontmatter/HVR; `h2UppercaseRequired` config fix |
| `003-doc-tooling-and-template-fixes` | planned | `validate_document.py` path bug; `skill-readme-template.md` clarifications; document `audit_readmes.py` |
| `004-skill-mode-readme-overhaul` | planned | 13 bare READMEs rewritten; 2 structural-drift READMEs restructured |
| `005-code-readmes-infra-and-sk` | planned | Code READMEs: small-infra hubs + sk-doc/sk-code |
| `006-code-readmes-design-prompt-speckit` | planned | Code READMEs: sk-design, sk-prompt, system-spec-kit |
| `007-code-readmes-deep-loop` | planned | Code READMEs: system-deep-loop; stale runtime catalog fixes |
| `008-verification-and-closeout` | planned | Full validation gate; conformance sweeps; optional-extension decisions |

## Discovered pre-existing issues (surfaced, tracked for the relevant phase)

- `parent-skill-check.cjs` rule `10a-manifest-source` fails on every hub even though `create-skill/scripts/generate-leaf-manifest.cjs` and `lib/leaf-resource-contract.cjs` exist. Confirmed pre-existing (fails on the base checker with this program's edits stashed). Path-resolution bug; relevant to the create-skill/scripts work in Phase 005.
- The recursive rules 2a and 2b false-positive if pointed at `system-spec-kit` (its `scripts/**` holds spec-folder-schema test fixtures named `description.json`/`graph-metadata.json`). system-spec-kit is a standalone skill, not one of the 7 checked parent hubs, so the checker is not run against it in practice. A fixture-dir exclusion would fix both rules together if ever needed.
