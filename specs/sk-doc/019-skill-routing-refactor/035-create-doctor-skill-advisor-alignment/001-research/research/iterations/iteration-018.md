# Iteration 18: Post-create index handoff

## Focus

Define the exact post-create handoff that names `description.json`, `graph-metadata.json`, `leaf-manifest.json`, and the operator-owned advisor refresh steps without implying that create or a read-only doctor route mutated derived index state.

## Actions Taken

- Read the prior iteration and the externalized state before selecting this focus.
- Read the standalone and parent create presentations, parent create workflows, and their completion templates.
- Read the root metadata contract, its generated-manifest tooling, the parent-skill doctor, and the skill-advisor doctor route.
- Inspected the live nine-tool skill-advisor CLI registry and CLI help for `skill_graph_scan`, `skill_graph_validate`, and `advisor_rebuild`.
- Ran `parent-skill-check.cjs` against the existing `sk-doc` hub; it exited 0 and reported the leaf-manifest and root-class checks as passing.
- Ran warm-only `advisor_status`, `skill_graph_status`, and `skill_graph_validate`; all returned exit 75 because the local advisor IPC socket was unavailable. No researched source file was modified.

## Findings

### 1. P1 — Parent create reports structural metadata but not the complete root contract

The parent create completion template reports graph-identity counts, hub structure, `description.json`, registry advisor-routing coverage, and the one-identity invariant, but it does not report `leaf-manifest.json` freshness or the optional `command-metadata.json` contract. The parent workflow's generation and validation steps likewise create the hub, registry, router, description, graph metadata, packets, and shared directory, then run `parent-skill-check.cjs`; they do not declare a leaf-manifest generation step. [SOURCE: `.opencode/commands/create/assets/create-skill-parent-presentation.txt:127-154`; `.opencode/commands/create/assets/create-skill-parent-auto.yaml:355-398,426-445`]

The root metadata contract makes `leaf-manifest.json` required and generated for class-H hubs, while `command-metadata.json` is hub-optional and validated when present. The generator documentation is explicit that `--fix` writes generated manifest output only; authored identity and policy files are never invented. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:55-81`; `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:28-42`]

This is a lifecycle/documentation gap, not evidence that `description.json` should absorb graph fields. A new parent flow should generate or check the manifest before the canonical parent gate, and the completion result should expose `command-metadata.json` as `present/validated` or `omitted/no owned commands`.

### 2. P1 — `leaf-manifest.json` has a different owner from the three authored hub files

The metadata contract assigns the files distinct roles:

- `description.json`: authored descriptive hub-doctor metadata; structural checks only, not advisor graph input.
- `graph-metadata.json`: the single authored advisor identity at the hub root; this is what graph indexing consumes.
- `leaf-manifest.json`: generated leaf/resource projection derived from the hub registry and packet files; it must be regenerated or byte-checked, never hand-edited.

The parent doctor’s checks 10a–10d validate a committed manifest’s source shape, byte freshness, target collisions, and registry reachability. The direct generator exposes the scoped commands `generate-leaf-manifest.cjs --write <skillDir>` and `--check <skillDir>`. [SOURCE: `.opencode/commands/doctor/scripts/parent-skill-check.cjs:1065-1083,1139-1166,1228-1235`; `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:8-19,298-306`]

The handoff should therefore say which owner applies to each file instead of presenting all JSON files as equivalent “metadata.”

### 3. P1 — Refresh commands must be shown as an explicit choice, not an implicit sequence

The live CLI exposes both `skill_graph_scan` (“index or re-index all ... graph-metadata.json files”) and `advisor_rebuild` (“rebuild the native advisor skill graph from checked-in skill metadata”). The rebuild handler calls the same metadata indexer before publishing a new advisor generation, so running both as mandatory post-create steps would duplicate the refresh path. Both are trusted mutations; `skill_graph_validate` and `advisor_status` are diagnostic operations. [SOURCE: `node .opencode/bin/skill-advisor.cjs list-tools --format json`; `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-rebuild.ts:88-96,113-130`]

The operator-facing handoff should use this wording:

```text
Advisor/index handoff (operator-owned; create did not mutate advisor state)

Metadata ownership:
- description.json: authored descriptive hub metadata; not advisor graph input.
- graph-metadata.json: sole hub advisor identity; source for graph indexing.
- leaf-manifest.json: generated leaf projection; [fresh|stale|missing]. Do not hand-edit.
- command-metadata.json: [present and validated|omitted; hub owns no slash commands].

Refresh choice — run one explicit path when the advisor should include this change:
- Full advisor refresh: node .opencode/bin/skill-advisor.cjs advisor_rebuild --trusted --workspace-root "$PWD" --format json
- Graph-only refresh: node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --skills-root "$PWD/.opencode/skills" --format json

Verification:
- Graph validation: node .opencode/bin/skill-advisor.cjs skill_graph_validate --format json
- Advisor status: node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
- Refresh status: [NOT RUN — operator-owned|PASSED|FAILED]
```

If a warm-only diagnostic is used, exit 75 should render as `UNAVAILABLE (retryable)` rather than `FAILED`; the local run reproduced that distinction for all three read-only checks.

### 4. P1 — The doctor route still lacks native graph validation in its declared tool set

The `skill-advisor` route declares `advisor_status`, `advisor_rebuild`, `skill_graph_scan`, `skill_graph_query`, and `skill_graph_status`, but omits `skill_graph_validate`. The live registry and CLI both expose `skill_graph_validate`, and the doctor workflow currently reports graph status, performs rebuild, and captures scan totals without a separate structural graph-validation result. [SOURCE: `.opencode/commands/doctor/_routes.yaml:99-116`; `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml:218-236,318-331`; live CLI registry/help]

The route contract should require the selected high-value tools (`advisor_status`, `advisor_rebuild`, `skill_graph_scan`, `skill_graph_status`, and `skill_graph_validate`) and verify that every declared name exists in the live registry. It should not require byte equality with all nine live tools, because the route is intentionally a workflow-specific subset.

### 5. P2 — Create and doctor should share vocabulary, not a byte-identical formatter

The two surfaces own different result shapes: parent create reports generated package structure and identity counts, while skill-advisor doctor reports lane proposals, rebuild generations, graph totals, tests, rollback state, and approval gates. A shared formatter would couple unrelated workflows. A small static vocabulary contract is the useful seam: the same labels and status meanings for metadata ownership, refresh ownership, validation state, and retryable availability, with separate adapters for create and doctor results.

## Questions Answered

- **Which exact post-create handoff wording should identify the four metadata files and refresh steps?** Use the quoted `Advisor/index handoff` block above. It names file ownership, reports manifest state, marks refresh as operator-owned, presents `advisor_rebuild` and `skill_graph_scan` as alternatives, and separates graph validation from advisor freshness.
- **Should `description.json` be validated against graph vocabulary?** No. Keep it descriptive and structurally checked; `graph-metadata.json` remains the sole advisor identity source. This confirms iteration 17.
- **Should create or read-only doctor auto-run `skill_graph_scan` or `advisor_rebuild`?** No. Both mutate derived state. Present one explicit operator choice and report `NOT RUN` until it is selected.
- **Should route-contract tests compare the declaration with every live advisor tool?** No. Assert the required workflow subset and live-name validity; full-registry equality would over-constrain intentional route scoping.
- **Should create and doctor share one formatter?** No. Share a small field/status vocabulary and keep result adapters separate.

## Questions Remaining

- Should parent create invoke the scoped `generate-leaf-manifest.cjs --write <skillDir>` directly, or invoke the fleet root-metadata gate with `--fix` and then select the created hub's result?
- Where should the shared vocabulary contract live, and which create branches need the handoff: parent full-create/full-update only, or standalone full-create/full-update as well?
- Should the route update and the handoff presentation be covered by one route-contract test or by separate route-tool and output-semantics tests?

## Next Focus

Trace standalone `/create:skill` full-create/full-update and the final route-contract test surfaces to determine the smallest shared handoff schema that covers both standalone and parent creation without importing parent-only metadata requirements into reference-only or asset-only operations.

## Sources Consulted

- `.opencode/commands/create/assets/create-skill-parent-presentation.txt`
- `.opencode/commands/create/assets/create-skill-parent-auto.yaml`
- `.opencode/commands/create/assets/create-skill-parent-confirm.yaml`
- `.opencode/commands/doctor/_routes.yaml`
- `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-rebuild.ts`
- `node .opencode/bin/skill-advisor.cjs list-tools --format json` and CLI help output
- Read-only `advisor_status`, `skill_graph_status`, and `skill_graph_validate` warm-only probes (exit 75: advisor IPC unavailable)

## Assessment

- New information ratio: **0.92**.
- This iteration resolves the operator-facing handoff vocabulary and refresh-choice semantics. It does not implement the create, doctor, route, or test changes.
