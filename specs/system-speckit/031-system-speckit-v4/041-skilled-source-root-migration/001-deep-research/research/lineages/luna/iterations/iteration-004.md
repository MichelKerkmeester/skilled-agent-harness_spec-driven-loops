# Iteration 4: Derived and generated state

## Focus

Separate authored path references from generated indexes, manifests, compiled command
contracts, build output and runtime databases that must be rebuilt rather than safely
rewritten in place.

## Findings

### Surface: 4, derived and generated state

- **Finding:** The trigger index is a generated artifact whose default output is `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json`; the same generator publishes the corpus manifest, generation diagnostics and phrase variants. The repository's doctor contract names `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` as the generator and checks the four files as a committed pair. **Classification:** `regenerate`. **Consequence for the cutover:** Any path-root change in the indexed corpus invalidates the index and its companion fixtures; editing path strings inside the JSON is insufficient because the manifest hash and diagnostics describe the generator's snapshot.
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:26-31`]
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:61-67`]
  - [SOURCE: `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml:23-33`]
  - [SOURCE: `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml:119-119`]

- **Finding:** Each skill-root `leaf-manifest.json` is derived from on-disk packets; `generate-leaf-manifest.cjs --write <skillDir>` also emits identity projections when present, and the fleet freshness gate byte-compares regenerated output. **Classification:** `regenerate`. **Consequence for the cutover:** A moved source tree needs every manifest-bearing skill to be regenerated from its final filesystem locations, then freshness checked. A path rewrite that leaves a byte-stale manifest is rejected by the repository's own gate.
  - [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:8-23`]
  - [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:7-35`]

- **Finding:** Root metadata has mixed ownership: `ci-skill-root-metadata.cjs --fix` writes only `leaf-manifest.json`; the other root metadata files are treated as authored identity, policy or compatibility data, while `regenerate-skill-derived.cjs` repairs only structural `graph-metadata.json.derived` paths and preserves semantic fields. **Classification:** `manual`. **Consequence for the cutover:** `description.json`, authored graph metadata and similar identity fields cannot be bulk-regenerated without deciding whether each stored path is a source reference, a derived reference or durable historical text. Structural derived references can be repaired with the named regenerator, but the semantic blocks require review.
  - [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:10-18`]
  - [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:40-42`]
  - [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:6-21`]

- **Finding:** Compiled deep-loop command contracts embed `.opencode` source paths and are written under `.opencode/commands/deep/assets/compiled/`; the compiler exposes `--write`, and the drift checker treats the compiled files as outputs of that compiler. **Classification:** `regenerate`. **Consequence for the cutover:** The compiled contract files and their embedded source-path headers must be rebuilt by `node .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command <target> --write` for each supported target, not edited as isolated markdown.
  - [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:13-18`]
  - [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:650-665`]
  - [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:692-706`]
  - [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs:1-14`]

- **Finding:** Runtime `dist/` output is required by doctor checks for generated hooks and graph/description helpers; the bootstrap script installs the runtime workspaces and runs `npm run build --workspace=@spec-kit/runtime` and `npm run build --workspace=@spec-kit/cli`, then asserts the dist files exist. **Classification:** `regenerate`. **Consequence for the cutover:** A source-root move must preserve the workspace package roots and rebuild their `dist/` trees. Stale compiled imports or source maps that retain `.opencode` are build outputs, not safe hand-edit targets.
  - [SOURCE: `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:61-114`]
  - [SOURCE: `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh:44-55`]
  - [SOURCE: `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh:190-209`]

- **Finding:** Deep-loop graph state is runtime-owned SQLite under `.opencode/skills/system-deep-loop/runtime/database`; the database README says research/review/context use `deep-loop-graph.sqlite` and council uses `council-graph.sqlite`, and the lifecycle is lazy creation when absent. The repository's containment code nevertheless has the database path as a fixed special case. **Classification:** `regenerate`. **Consequence for the cutover:** Existing SQLite files are derived runtime state and may contain path-bearing graph data that cannot be corrected by text replacement; fresh databases must initialize at the new runtime location, while any retained database needs a compatibility or migration decision. The runtime path constant and lock handling must be audited together.
  - [SOURCE: `.opencode/skills/system-deep-loop/runtime/database/README.md:10-29`]
  - [SOURCE: `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`]
  - [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:948-963`]

- **Finding:** The trigger index generator resolves the repository root by searching for both `.opencode` and `specs`, rather than using only a fixed hop count. **Classification:** `blocker`. **Consequence for the cutover:** Moving the authored assets to `.skilled` changes a root-marker assumption in a generator that is otherwise path-relative and fail-closed; until its root-detection contract is updated or a compatible marker remains, trigger-index regeneration can select the wrong root or refuse to recognize the checkout.
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:69-88`]

## Sources Consulted

- Trigger-index generator and retrieval doctor contract.
- Skill-root manifest and derived-metadata gates.
- Deep-loop compiled-contract compiler, runtime bootstrap, graph database and containment code.

## Assessment

- `newInfoRatio`: 0.92
- Novelty justification: The generated-state inventory includes multiple independent artifact families with different owners and regeneration commands, plus a root-marker assumption that a symlink-only move does not repair.
- Confidence: high for repository-owned generators and output locations; database contents and external runtime caches remain UNKNOWN without opening each state store.

## Reflection

- Worked: tracing each artifact from its writer or gate exposed which files are machine-owned.
- Ruled out: treating all JSON metadata as equivalent generated output.
- Failed: no safe claim can be made about path-bearing SQLite rows without a read-only schema/content audit.

## Recommended Next Focus

Trace the repository gates, git hooks, validators and CI workflow references that can reject the migration commit or require generated outputs to be fresh.
