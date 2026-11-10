# Deep Research Strategy, Luna Lineage

## Research Topic

Inventory the checked-in v4.0.0.0 repository state and fact-check the stale changelog draft. The branch is `skilled/v4.0.0.0`. Research is read-only outside this lineage.

## Known Context

- `spec.md` defines ten ordered angles, ten iterations, path:line evidence, and a read-only research boundary.
- `timeline.md` records the v4 chronology through CI dependency hardening and names the memory decommission, runtime rename, simplification and recorded-findings closure.
- `implementation-summary.md` says this is the Luna `cli-codex` lane with model `gpt-5.6-luna` and max-iterations stop policy.
- No packet-level `resource-map.md` was present at initialization.

## Key Questions

- [x] What is the complete hub, mode, command, agent and hook roster? Initial registry inventory complete; exact command reachability remains to verify.
- [x] What does system-spec-kit ship now, including runtime CLI, rules, templates and speckit commands? Runtime/cli, 40-rule registry, four levels, addons, lexical retrieval and six speckit commands confirmed.
- [x] What does system-deep-loop ship now, and which draft claims remain true? Six modes, six command front doors, executor flags/allowlists, fan-out limits, convergence modes and reducer state are confirmed.
- [x] How is system-skill-advisor routed, scored and contained? Standalone daemon-backed MCP package with nine tools, dual thresholds, warm-only CLI fallback and structural containment confirmed.
- [ ] What does sk-doc ship for create modes, templates and quality gates?
- [x] What do the six CLI executor packets support, and can this lane dispatch recursively? Six packet contracts, auth/model/sandbox flags, child preamble, self-invocation guards and fail-closed builders confirmed; this lineage cannot recurse.
- [ ] What do the other hubs ship across design, git, prompt, MCP, code mode, communication and vision?
- [ ] How do runtime mirrors, hooks, CI and goals work today?
- [ ] Which renames, removals, defaults and exit-code changes affect v3.6.0.0 upgrades?
- [ ] Which changelog claims are TRUE, STALE, FALSE or MISSING?

## Non-Goals

- No edits to repository code, docs, commands, hooks, mirrors, CI or spec files.
- No remote fetches, git writes, checkout, validation or continuity generation.
- No writing beyond this lineage directory.

## Stop Conditions

- Continue through all ten angles even if convergence telemetry becomes positive.
- Stop only at the configured hard cap of ten iterations.

## Answered Questions

- Registry-first enumeration worked because the six hub registries expose mode and routing class directly, while standalone leaf manifests expose their single mode. The README count is not authoritative (iteration 1).
- The runtime README and command sources establish `runtime/cli/` as the live package. The retrieval README explicitly rules out a daemon or MCP transport (iteration 2).
- The deep-loop registry distinguishes lexical, alias-fold and command-bridge routing. `executor-config.ts` hard-gates CLI kinds, model allowlists and fan-out caps (iteration 3).
- The advisor is a standalone `system_skill_advisor` MCP package with nine live tool IDs, `0.8/0.35` confidence and uncertainty defaults, warm-only CLI fallback, and structural hoisting above `.opencode` for workspace containment (iteration 4).

## What Worked

- Phase initialization bound the exact lineage directory and recorded the executor contract.

## What Failed

- README-only roster is exhausted as a source of truth. It contradicts the live registry and directory count (iteration 1).

## Exhausted Approaches

- Memory-database retrieval as the live speckit path is exhausted. Current retrieval uses the committed trigger index and ripgrep lanes (iteration 2).
- A generic alignment mode is exhausted as a candidate name. The registry exposes `agent-improvement`, `model-benchmark` and `skill-benchmark` instead (iteration 3).
- Drafted advisor state leakage inside spec folders is exhausted as a current-code claim: the workspace resolver hoists above the outermost `.opencode`, while the package-local SQLite path owns graph state (iteration 4).

## Ruled-Out Directions

- Nested executor dispatch is ruled out by the user’s inline executor contract and the YAML Codex pre-dispatch rule.

## Next Focus

SYNTHESIS COMPLETE: research.md and resource-map.md written after all ten iterations; terminal stop reason is maxIterationsReached.

## Research Boundaries

- Max iterations: 10
- Convergence threshold: 3, telemetry only under `max-iterations`
- Per-iteration budget: 12 tool calls, 10 minutes
- Executor: `cli-codex`, model `gpt-5.6-luna`
- Canonical state: `deep-research-state.jsonl`
- Canonical output: `research.md`
