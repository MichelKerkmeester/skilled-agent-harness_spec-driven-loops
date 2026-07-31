# Iteration 19: Shared handoff contract and create-branch scope

## Focus

Where should the shared vocabulary contract live, and which create branches need the handoff: parent full-create/full-update only, or standalone full-create/full-update as well?

## Actions Taken

- Read the externalized iteration state and prior narrative before selecting this focus.
- Traced the standalone `/create:skill` router, presentation, and both workflow variants across all four operation branches.
- Traced `/create:skill-parent` create/update scopes, parent validation, completion templates, and the class-H metadata rules.
- Compared those command surfaces with `sk-create-skill`'s shared references, root-metadata contract, initializer, class gate, and scaffold-to-doctor tests.
- Checked the `skill-advisor` doctor route and its current tool declaration to keep the shared vocabulary separate from route-specific result handling.
- No researched source file was modified; this iteration writes only the three required research artifacts.

## Findings

### 1. P1 — The canonical vocabulary belongs in `sk-create-skill`'s shared references

The repository already places the cross-variant root contract in `.opencode/skills/sk-doc/sk-create-skill/references/shared/`: the directory contains the root-metadata contract, validation/packaging guidance, and shared authoring guidance. That contract is explicitly the authority for the H/S root-class matrix, including which files are authored, generated, optional, and forbidden. The `sk-create-skill` overview also tells both standalone and parent authors to use the same contract.

Recommendation: add one canonical contract there, for example `references/shared/advisor-index-handoff.md`, defining the shared field vocabulary and status semantics:

- metadata ownership: `description.json` (H descriptive projection only), `graph-metadata.json` (sole advisor identity), `leaf-manifest.json` (generated projection), and `command-metadata.json` (optional H command surface);
- refresh ownership: `skill_graph_scan` and `advisor_rebuild` are explicit operator choices, not create-side effects;
- verification state: manifest freshness, graph validation, advisor status, refresh status, and retryable-unavailable versus failed;
- class applicability: H-only fields render as omitted/N/A on standalone roots.

Keep `system-skill-advisor/references/runtime/freshness-contract.md` authoritative for live advisor trust-state behavior. The create and doctor assets should consume the shared handoff vocabulary and retain separate result adapters; neither command asset should become the canonical contract.

Evidence: `skill-root-metadata-contract.md:23-32,56-83,87-127`; `sk-create-skill/SKILL.md:198-200,228-230`; the shared-reference directory currently has no handoff contract.

### 2. P1 — The full handoff applies to standalone full-create and full-update too

The standalone presentation distinguishes `full-create` and `full-update` from `reference-only` and `asset-only`, and the workflow gives the full branches root-level lifecycle responsibility. However, the current standalone completion template reports only DQI, operation target, spec path, and memory state.

The `full-create` branch calls `init_skill.py`, which runs the class metadata gate while scaffolding. It then writes or edits `SKILL.md` resources and runs package validation. That ordering leaves a freshness window: resources added or removed after initialization can change the generated leaf projection, while the current completion path does not report the class gate or manifest state. `full-update` reads and edits `SKILL.md` and targeted resources but does not invoke the class-metadata gate at all.

Therefore the same full handoff should be emitted by both standalone full branches, after the final root/class validation state is known. It should say `standalone` scope and omit H-only fields rather than pretending a standalone root has `description.json`, `mode-registry.json`, `hub-router.json`, or `command-metadata.json`.

Evidence: `create-skill-presentation.txt:76-80,129-150`; `create-skill-auto.yaml:328-354,385-421`; `init_skill.py:242-264,374-398`; `skill-root-metadata-contract.cjs:73-105`.

### 3. P1 — Parent create and parent update need the same vocabulary, with H-specific fields

The parent router has `create` and `update` operations, and both operation scopes touch the hub's authored root files. Both workflows run the parent structural gate and report identity counts, but the completion assets do not report generated `leaf-manifest.json` freshness, optional `command-metadata.json` state, graph validation, or the explicit advisor refresh choice.

Both parent operations should use the shared handoff with H-specific values:

- `description.json`: present and structurally valid, descriptive only;
- `graph-metadata.json`: exactly one hub identity, zero nested identities;
- `leaf-manifest.json`: generated and fresh/stale/missing;
- `command-metadata.json`: present and validated, or omitted because the hub owns no slash commands;
- refresh and verification status: explicit, operator-owned, and independently reported.

This is the parent equivalent of the standalone full branches; the operation names differ (`create`/`update` versus `full-create`/`full-update`), but the handoff vocabulary should not.

Evidence: `skill-parent.md:37-44`; `create-skill-parent-auto.yaml:140-166,377-398,426-445,478-507`; `create-skill-parent-presentation.txt:127-154`.

### 4. P2 — Reference-only and asset-only should not render the full handoff by default

The standalone doc-only branches create or update one reference or asset document and use the package validator. They do not own the root-class contract, and their target may be a single leaf under either a standalone root or a parent packet. Rendering the four-file metadata block for these operations would be misleading, especially because `description.json`, `mode-registry.json`, `hub-router.json`, and `command-metadata.json` are forbidden on class-S roots.

There is a conditional edge case: adding or removing a routed document can make `leaf-manifest.json` stale. The doc-only branches should therefore perform a narrow leaf-freshness check or emit a compact conditional warning when the changed path is under a configured leaf root. They should not show the complete H/S handoff unless the operation has explicitly crossed into root-structure maintenance.

Evidence: `create-skill-auto.yaml:356-383`; `skill-root-metadata-contract.md:60-71,91-102`; `skill-leaf-manifest-config-template.json` and the generated-manifest contract.

### 5. P2 — Existing tests close the scaffold-to-gate seam, not the presentation seam

`create-journey-proof.test.cjs` proves that standalone and parent scaffolds reach a clean class gate and that a parent passes `parent-skill-check.cjs`. The Python create contract test covers initializer/package behavior, and the parent leaf-manifest test covers checks 10a–10d. None of the discovered tests asserts the shared post-create field vocabulary across standalone full operations, parent create/update, and doctor output.

Use two test layers:

1. A shared vocabulary/output-semantics test that checks required labels, class-aware omission, operator-owned refresh status, and retryable-unavailable rendering across create and doctor adapters.
2. A separate route-contract test that checks the doctor route's selected tool subset against the live advisor tool registry, including `skill_graph_validate` once the route change is made.

This preserves the known boundary: create and doctor have different result shapes, so they should share field semantics rather than a byte-identical formatter.

Evidence: `create-journey-proof.test.cjs:88-122`; `test_create_skill_contract.py`; `parent-skill-check-leaf-manifest.test.cjs`; `doctor/_routes.yaml:99-116`.

## Questions Answered

- **Where should the shared vocabulary contract live?** In `.opencode/skills/sk-doc/sk-create-skill/references/shared/`, alongside the root metadata contract. A proposed canonical filename is `advisor-index-handoff.md`; the advisor runtime freshness reference remains the source for trust-state semantics.
- **Which create branches need the full handoff?** Standalone `full-create` and `full-update`, plus parent `create` and `update`. Use the same vocabulary with class-aware fields.
- **Should reference-only and asset-only render it?** No, not by default. Add only a conditional leaf-freshness signal when their changed document affects a routed leaf.
- **Should create and doctor share one formatter?** No. Share the vocabulary and status semantics; keep separate result adapters and tests.
- **Should refresh be implicit?** No. Preserve the operator-owned choice between `skill_graph_scan` and `advisor_rebuild`; the handoff reports whether it was run.

## Questions Remaining

- Should the canonical contract be a Markdown reference plus a small machine-readable fixture, or should one machine-readable fixture be the source and the Markdown explain it?
- What exact narrow check should doc-only branches use to detect a routed-leaf change without importing the full H/S handoff?
- Should parent generation invoke the scoped `generate-leaf-manifest.cjs --write <skillDir>` directly or rely on `ci-skill-root-metadata.cjs --fix` and select the created hub's result?
- Should the doctor route/tool-set test and the shared output-semantics test remain separate? The evidence strongly favors separate tests, but the final implementation can still place them in one test file if ownership remains explicit.

## Next Focus

Resolve the final test/fixture shape and the doc-only leaf-freshness conditional, then reconcile the route-tool declaration with the shared handoff wording before the iteration cap.

## Sources Consulted

- `.opencode/commands/create/assets/create-skill-presentation.txt`
- `.opencode/commands/create/assets/create-skill-auto.yaml` and `create-skill-confirm.yaml`
- `.opencode/commands/create/skill-parent.md`
- `.opencode/commands/create/assets/create-skill-parent-auto.yaml` and `create-skill-parent-confirm.yaml`
- `.opencode/commands/create/assets/create-skill-parent-presentation.txt`
- `.opencode/commands/doctor/_routes.yaml` and `doctor-skill-advisor.yaml`
- `.opencode/skills/sk-doc/sk-create-skill/SKILL.md`
- `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs`
- `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs`

## Assessment

New information ratio: **0.95**. This iteration resolves the canonical contract location and the branch scope; implementation and final fixture shape remain open.
