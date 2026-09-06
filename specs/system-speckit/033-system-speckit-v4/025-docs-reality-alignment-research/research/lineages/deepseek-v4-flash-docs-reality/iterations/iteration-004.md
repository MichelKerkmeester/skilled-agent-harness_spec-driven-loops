# Iteration 4: Playbook scenarios that cannot run verbatim today (F4)

## Focus

Hold focus F4: find playbook/catalog scenarios whose commands or routes cannot run verbatim today because the underlying subsystem (memory, causal graph, MCP memory) was decommissioned. Cross-check every listed `/doctor <target>` route against the actual route manifest and asset YAMLs.

## Findings

### F4-01 — Feature-catalog `/doctor` docs list decommissioned subsystem routes as shipped (P1 misleading)

**Doc claim (quoted):** `feature-catalog/doctor-commands/category-overview.md:27` — "The shipped surface now includes five subsystem routes under `/doctor <target>` (memory, causal-graph, deep-loop, code_graph, skill-advisor, skill-budget, code-graph)..." And `feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19` — "It dispatches to one of seven subsystem YAML workflows (memory, causal-graph, code-graph, deep-loop, code_graph, skill-advisor, skill-budget) by reading the canonical route manifest `.opencode/commands/doctor/_routes.yaml`."

**Actual behavior:** The canonical route manifest `.opencode/commands/doctor/_routes.yaml` declares targets `speckit-retrieval`, `embeddings`, `deep-loop`, `skill-advisor`, `skill-budget`, `parent-skill`, `skill-graph-freshness`, `fable-mode`, `runtime-mirrors` — **none** of `memory`, `causal-graph`, `code-graph`, or `code_graph`. There are also no `doctor-memory`/`doctor-causal-graph`/`doctor-code-graph` asset YAML files under `.opencode/commands/doctor/assets/`. The sibling `manual-testing-playbook/doctor-commands/README.md:22` confirms the decommission: "The `/doctor memory` and `/doctor causal-graph` scenarios were removed with the memory server they diagnosed." Both catalog docs also miscount (category-overview says "five" then lists seven; dispatch doc says "seven").

- Doc: [SOURCE: feature-catalog/doctor-commands/category-overview.md:27]; [SOURCE: feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19]
- Actual: [SOURCE: .opencode/commands/doctor/_routes.yaml:33-169] (target list); [SOURCE: manual-testing-playbook/doctor-commands/README.md:22]
- Severity: P1
- One-line fix: replace the route lists with the real target set (speckit-retrieval, embeddings, deep-loop, skill-advisor, skill-budget, parent-skill, skill-graph-freshness, fable-mode, runtime-mirrors), drop memory/causal-graph/code-graph, and fix the count.

## Sources Consulted

- feature-catalog/doctor-commands/category-overview.md:27,44
- feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19,56
- manual-testing-playbook/doctor-commands/README.md:20-34
- feature-catalog/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md:23,37
- manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md:14
- manual-testing-playbook/manual-testing-playbook.md:45,51
- .opencode/commands/doctor/_routes.yaml; .opencode/commands/doctor/assets/ (dir listing)

## Assessment

- newInfoRatio: 0.9
- Novelty justification: F4-01 is a new finding (doc-shipped `/doctor` routes that have no manifest/asset backing); it also overlaps F6 (category-overview.md:27 contradicts README.md:22) and F5/F7 (ghost entries), so felt slightly overlapping with prior surfaces.
- Confidence notes: Confirmed by enumerating the actual manifest targets and asset dir; no inference.

## Reflection

- What worked: enumerating `_routes.yaml` targets + the asset dir gave a decisive yes/no for every claimed `/doctor` route without running the router.
- What failed: several playbook/catalog docs ARE already decommission-aware (manual-testing-playbook.md:45, setup-native-module-health:23, cli-hook-transport-down:14, README.md:22), so "cannot run verbatim" hits concentrate in the feature-catalog doctor/maintenance entries that were not re-synced.
- Ruled out: no playbook references `deploy-mcp.sh` or a memory-server install step as live — those references were already removed.

## Recommended Next Focus

[F5] shipped features with no catalog/playbook entry — diff the `runtime/cli/rules/` scripts and cli subcommands (e.g. `backfill-graph-metadata`, `check-canonical-save-helper`) against catalog/playbook coverage.
