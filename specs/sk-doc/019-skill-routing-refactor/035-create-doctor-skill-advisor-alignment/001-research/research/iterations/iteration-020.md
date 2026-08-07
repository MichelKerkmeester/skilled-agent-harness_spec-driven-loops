# Iteration 020

## Focus

Should parent generation invoke the scoped `generate-leaf-manifest.cjs --write <skillDir>` directly, or rely on `ci-skill-root-metadata.cjs --fix` and select the created hub's result?

## Actions Taken

- Read the parent create workflows, their presentation contracts, the parent-skill doctor route, and the route manifest.
- Read `generate-leaf-manifest.cjs`, `ci-skill-root-metadata.cjs`, `skill-root-metadata-contract.cjs`, and the parent-skill checker/tests.
- Compared the documented `sk-create-skill` lifecycle with the actual workflow assets and the live advisor tool registry.
- Ran the fleet metadata gate read-only: `ci-skill-root-metadata.cjs --format json --skills-dir .opencode/skills` — 11/11 roots passed, including 7 H hubs and 4 S roots.
- Ran `parent-skill-check.cjs .opencode/skills/sk-code` — all hard invariants passed, including leaf-manifest freshness and the H root contract.
- Ran `bash .opencode/commands/doctor/scripts/route-validate.sh` — the route manifest passed structural checks but failed target-set parity because the presentation subsystem table omits all 10 current routes.
- Re-ran `node .opencode/bin/install-codex-hooks.mjs --check` as requested — it refused the linked worktree and identified `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` as the primary checkout; it requires `--allow-worktree` to override.

## Findings

### F1 — Direct manifest generation is the correct create-time owner

`generate-leaf-manifest.cjs` explicitly exposes `--write <skillDir>` and writes only `<skillDir>/leaf-manifest.json` (script lines 12–16 and 254–261). Its input is the finalized registry and packet tree, so parent generation should invoke it after those authored files exist and before the structural gate runs.

`ci-skill-root-metadata.cjs --fix` is a fleet gate: its CLI accepts `--skills-dir`, not a target hub, and its contract says `--fix` regenerates generated files across the scanned roots (script lines 28–42, 176–225). The initializer currently calls it with the new hub's parent directory, which makes a fresh parent pass but can also write unrelated roots (`init_skill.py` lines 238–264). Selecting the new hub's result after a fleet fix hides that blast radius.

Recommendation: use the scoped generator for the create workflow. Keep the class gate as a read-only postcondition, or add an explicitly target-scoped class-gate API before using it in an authoring path. Do not make a fleet-wide `--fix` the implicit create handoff.

### F2 — `/create:skill-parent` and the parent canon currently disagree on manifest ownership

Both parent YAML workflows list authored hub files, packets, `shared/`, and advisor projection work, but neither lists `generate-leaf-manifest.cjs`, `leaf-manifest.json`, or the H root-metadata gate in package generation (auto workflow lines 357–369; validation lines 378–389). The same workflows require `parent-skill-check.cjs` to exit 0. The checker’s H class contract requires `leaf-manifest.json`; the root contract lists it as generated and required for class H (contract lines 69–87 and 136–158). This leaves the workflow internally incomplete unless an agent silently calls the initializer or fleet fixer.

The authoring documentation is ahead of the command asset: `sk-create-skill/SKILL.md` tells authors to run `ci-skill-root-metadata.cjs --fix` and the parent shape includes `leaf-manifest.json`, while the command workflow does not expose that step. This is a lifecycle drift point, not a missing advisor feature.

### F3 — The parent doctor is deliberately read-only and cannot repair the missing generated file

`doctor-parent-skill.yaml` states `read_only: true`, forbids all mutation targets, and only runs the structural checker. The route manifest invokes the fleet class gate without `--fix`, then the target-specific parent checker (`_routes.yaml` lines 141–150). That is the right safety boundary for `/doctor:parent-skill`, but its output must distinguish “missing generated manifest” from “manifest stale” and hand the operator to the scoped generator. It should not be presented as a repair path.

### F4 — Live advisor graph validation is still absent from the skill-advisor doctor route

The live advisor server and CLI both expose `skill_graph_validate` (`skill-graph-tools.ts` lines 60–63; CLI manifest lines 138–140), but `_routes.yaml` declares only `advisor_recommend`, `advisor_status`, `advisor_validate`, `advisor_rebuild`, `skill_graph_scan`, `skill_graph_query`, and `skill_graph_status`. `doctor-skill-advisor.yaml` verifies rebuild/scan totals and advisor tests, but does not run graph validation. A route-contract test should pin the selected required tools against the live registry; a separate output test should cover scan, graph-validation, and advisor-validation result semantics.

### F5 — Existing doctor route drift is observable now

`route-validate.sh` exits 1 in this checkout: all schema, asset, script, tool-subset, and read-only-policy checks pass, but target-set parity fails because the presentation subsystem table does not list the 10 routes declared in `_routes.yaml`. This is independent of the manifest decision, but it confirms that route metadata and presentation are already separate drift surfaces and should not be assumed synchronized.

### F6 — Keep the shared handoff vocabulary, not a shared runtime formatter

No new evidence invalidates the prior conclusion: place the small machine-readable handoff contract and its operator-facing explanation under `sk-doc/sk-create-skill/references/shared/`, beside the existing skill-root metadata contract. Keep create and doctor adapters separate, guarded by separate tests. The full metadata/index handoff belongs on standalone `full-create`/`full-update` and parent `create`/`update`; reference-only and asset-only branches should use only a conditional scoped `generate-leaf-manifest.cjs --check <skillDir>` when a routed leaf changed and a manifest exists.

The handoff must label the owners separately: authored `graph-metadata.json` and hub registry/router, generated `leaf-manifest.json`, optional authored `command-metadata.json` for hubs that own commands, and operator-owned advisor refresh/validation. It must never imply that `skill_graph_scan` or `advisor_rebuild` already ran.

## Questions Answered

- Parent generation should invoke the scoped `generate-leaf-manifest.cjs --write <skillDir>` directly after finalizing the registry and packet resources. The fleet `ci-skill-root-metadata.cjs --fix` path is suitable for explicit maintenance, not implicit create-time mutation.
- The class gate remains useful as a read-only postcondition, but it should not be the create-time generator. A target-scoped gate would be required before using `--fix` in a normal authoring workflow.
- The parent doctor remains read-only; it should report missing/stale generated metadata and point to the scoped generator, while `/doctor:skill-advisor` remains the explicit operator-owned refresh/validation route.
- `description.json` remains descriptive hub metadata. Graph vocabulary and advisor identity stay owned by `graph-metadata.json`/the live graph; no second vocabulary source should be introduced.
- The shared create/doctor vocabulary belongs in the `sk-create-skill` shared references, with separate create and doctor presentation adapters. Full branches receive the complete handoff; doc-only branches receive only the narrow manifest freshness check.

## Questions Remaining

- Implementation must choose whether to add a target-scoped class-gate option or to keep the class gate fleet-wide and run it only read-only after direct manifest generation. The evidence favors the latter for the smallest blast radius.
- The route update still needs an explicit decision on whether `skill_graph_validate` is exposed through `_routes.yaml`/router frontmatter or retained as a CLI-only handoff. The live tool registry proves the current omission is real.

## Next Focus

Research is complete at iteration 20/20. Implementation handoff: align parent create/update with the scoped manifest generator, add the shared handoff vocabulary and branch conditions, then repair the doctor route/tool and presentation parity contracts with separate tests.
