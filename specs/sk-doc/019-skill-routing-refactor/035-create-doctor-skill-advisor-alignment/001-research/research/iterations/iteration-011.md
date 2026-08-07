# Iteration 011 — Create/doctor advisor-index handoff

## Focus

Determine how `/create:skill-parent` and `/doctor:skill-advisor` should expose one canonical-checkout and skill-advisor index handoff while keeping `skill_graph_scan` and `advisor_rebuild` operator-owned.

## Actions Taken

- Read the iteration state, strategy, and prior iterations before selecting this focus. The prior source-selection question is treated as settled for the read-only hook comparison: linked worktrees need an explicit primary-checkout source.
- Re-ran `node .opencode/bin/install-codex-hooks.mjs --check` from the active checkout. It exited 1 at the linked-worktree guard and reported the primary checkout as `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`; the check did not write anything. [SOURCE: `.opencode/bin/install-codex-hooks.mjs:286-317,360-379`; command result]
- Compared the parent-skill command contract and presentation with the unified skill command, the `sk-create-skill` parent templates/references, the `/doctor` route and `doctor-skill-advisor` asset, the doctor validation scripts, and the `system-skill-advisor` metadata/index surfaces. [SOURCE: `.opencode/commands/create/skill-parent.md:19-78`; `.opencode/commands/create/skill.md:1-56`; `.opencode/commands/doctor/_routes.yaml`; `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml`; `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/`; `.opencode/skills/system-skill-advisor/`]

## Findings

1. **F11-01 — Parent creation validates the package contract but stops before the advisor-index handoff (P1).** `/create:skill-parent` explicitly owns the one-hub-identity invariant and describes the generated `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, packet layout, and `advisorRouting` blocks. Its completion surface reports structural validation and identity results, but it has no common result fields for selected repository, derived-metadata freshness, graph-scan status, or advisor-rebuild status. That leaves a newly created parent structurally valid but operationally ambiguous to the live advisor index. [SOURCE: `.opencode/commands/create/skill-parent.md:19-23,65-78`; `.opencode/commands/create/assets/create-skill-parent-presentation.txt:138-148`; `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`]

2. **F11-02 — The two create commands expose different indexing contracts.** `/create:skill` declares `memory_index_scan` and `memory_save` in its allowed tools and its presentation has `Memory saved`/`Memory indexed` result fields. `/create:skill-parent` has no equivalent memory/index tool grant or post-create index handoff in its router/presentation. A parent skill can therefore finish with the richer registry/graph structure while giving the operator less information about whether advisor discovery has caught up. [SOURCE: `.opencode/commands/create/skill.md:1-4`; `.opencode/commands/create/assets/create-skill-presentation.txt:140-150`; `.opencode/commands/create/skill-parent.md:1-4`; `.opencode/commands/create/assets/create-skill-parent-presentation.txt:138-154`]

3. **F11-03 — A create-surface cross-reference is stale.** The parent command says its templates live under `sk-create-skill/assets/skill/`, while the checked-in parent templates are under `sk-create-skill/assets/parent-skill/`. The command still names the right template concepts, but the path mismatch makes the authoring guide harder to follow and is exactly the kind of drift that can leave a new parent aligned with an obsolete location. [SOURCE: `.opencode/commands/create/skill-parent.md:65-78`; `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/`]

4. **F11-04 — Doctor already has the right separation point: diagnostics can be shared, rebuilds must remain explicit.** The existing `/doctor` skill-advisor route and its validation scripts are the natural read-only consumer of the parent package’s structural metadata. The route should report the same canonical source and index handoff fields as create, then render explicit next commands for `skill_graph_scan`/`skill_graph_validate` and `advisor_rebuild` with their mutation status marked `NOT RUN`. Silently running either mutation from a doctor or create completion would make a read-only diagnostic mutate the advisor corpus and would blur the authority boundary between generated package files and the derived/indexed advisor state. [SOURCE: `.opencode/commands/doctor/_routes.yaml`; `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml`; `.opencode/commands/doctor/scripts/parent-skill-check.cjs`; `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs`; `.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/advisor-rebuild.md`; `.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/skill-graph-scan.md`]

5. **F11-05 — The handoff needs one source-selection vocabulary, not two independent status formats.** The hook installer proves that a linked worktree cannot be treated as an implicit global source: the bare check fails before comparison, while an explicit primary checkout reaches actionable drift analysis. The create/doctor handoff should therefore expose `current_checkout`, `linked_worktree`, `primary_checkout`, and `selected_repo` even when the advisor operation is repo-local, then expose separate fields for `structural_validation`, `derived_metadata`, `graph_scan`, and `advisor_rebuild`. The selected source describes what will be inspected; it does not authorize any repair or rebuild. [SOURCE: `.opencode/bin/install-codex-hooks.mjs:286-317`; prior command result; `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:20-28,65-77`]

6. **F11-06 — The smallest alignment is a report contract plus explicit handoff commands.** Both surfaces should emit the same compact block: `source` (current/primary/selected checkout), `identity` (hub path and graph id), `generated` (registry/router/description/graph/leaf-manifest validation), and `index` (`graph_scan`, `advisor_rebuild`, freshness). Create can mark the index actions `PENDING`/`NOT RUN` after scaffolding; doctor can consume the block to diagnose drift and print operator-owned commands. This aligns the lifecycle without coupling scaffolding to a daemon mutation or making `description.json` an auto-generated replacement for registry/graph metadata. [INFERENCE: based on `.opencode/commands/create/skill-parent.md:69-78`, `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml`, and `.opencode/skills/system-deep-loop/SKILL.md:84-85`]

## Ruled Out

- Auto-running `skill_graph_scan` or `advisor_rebuild` as part of create or a read-only doctor route. The operations change derived/index state and should remain explicit operator actions.
- Treating `--allow-worktree` as canonical-source selection. It only disables the installer’s safety refusal; it does not identify the authoritative checkout.
- Making `description.json` the sole source of advisor truth. The parent-hub contract still assigns authority to the registry, router, graph metadata, and generated leaf/derived checks.

## Edge Cases

- Ambiguous input: `selected_repo` is a source-selection field, not a repair authorization field; the two must remain separate.
- Contradictory evidence: none found in this pass.
- Missing dependencies: live MCP memory matching was unavailable in this runtime; local packet state and checked-in code/docs were used instead.
- Partial success: the hook check intentionally stopped at the linked-worktree guard, but that failure itself supplied the primary-checkout evidence needed for this focus.

## Questions Answered

- **How should create and doctor expose the handoff?** Use one shared report vocabulary for checkout/source, hub identity, generated metadata, and index freshness; create reports the pending handoff, doctor reports the diagnostic result.
- **Should create or doctor run advisor rebuild/graph scan automatically?** No. Keep both mutations operator-owned and print explicit, source-scoped follow-up commands.
- **What is the smallest current documentation fix?** Correct the parent-template path cross-reference and add the shared handoff fields to the parent completion contract and doctor asset.

## Questions Remaining

- Should the shared handoff be implemented as a reusable doctor/create formatter, or as duplicated presentation fields with a contract test?
- Which exact `skill_graph_validate`/`skill_graph_scan` and `advisor_rebuild` CLI forms should the operator-facing handoff print for a newly created parent?
- Should doctor warn when `description.json` vocabulary diverges from registry/graph vocabulary, or only report the existing structural checks?

## Sources Consulted

- `.opencode/commands/create/skill-parent.md`
- `.opencode/commands/create/assets/create-skill-parent-presentation.txt`
- `.opencode/commands/create/skill.md`
- `.opencode/commands/create/assets/create-skill-presentation.txt`
- `.opencode/commands/doctor/_routes.yaml`
- `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/`
- `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/`
- `.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/`
- `.opencode/bin/install-codex-hooks.mjs`

## Assessment

- New information ratio: 0.78
- Questions addressed: index under-automation; create/doctor alignment opportunities
- Questions answered: shared report contract and operator-owned mutation boundary

## Reflection

- What worked and why: reading the create presentation, router, templates, doctor route, and installer together exposed a lifecycle gap rather than another isolated checker defect.
- What did not work and why: the memory hook was unavailable, so no prior indexed context could be added; the checked-in packet state was sufficient for this iteration.
- What I would do differently: next pass should inspect the exact doctor YAML command invocations and CLI help for the graph/advisor mutations before proposing handoff syntax.

## Next Focus

Trace the exact `/doctor:skill-advisor` command invocations and mutation-class declarations, then verify whether one reusable handoff formatter or a contract test best keeps `/create:skill-parent`, `/create:skill`, and doctor output aligned.

