# Iteration 1: Baseline code-quality and shared sk-code resource layout

## Focus
This iteration investigated the strategy's next focus: baseline the current `code-quality` sub-skill and `sk-code/shared` resource layout before evaluating integration seams. The narrow interpretation was current contracts, routing metadata, assets, scripts, and shared references that `code-quality` already depends on; deeper spec-kit, deep-loop, benchmark, and hook integration proposals are deferred to later iterations.

## Findings
1. `code-quality` is already framed as the author-side Phase 1.5 quality gate between implementation and verification: it loads surface and target-path checklists, runs comment hygiene, applies P0/P1/P2 checks, may edit only scoped existing files, and hands final evidence to surface verification rather than claiming done. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:15] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:140] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:150] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:185]
2. The parent `sk-code` hub has a clear two-axis model: workflow modes are `quality` and `code-review`, surface packets are `code-webflow` and `code-opencode`, routing is registry-driven, and the parent explicitly forbids per-mode router logic or packet-local `graph-metadata.json`. [SOURCE: .opencode/skills/sk-code/SKILL.md:15] [SOURCE: .opencode/skills/sk-code/SKILL.md:23] [SOURCE: .opencode/skills/sk-code/SKILL.md:30] [SOURCE: .opencode/skills/sk-code/SKILL.md:50] [SOURCE: .opencode/skills/sk-code/SKILL.md:145] [SOURCE: .opencode/skills/sk-code/SKILL.md:157]
3. `code-quality` depends heavily on shared routing and lifecycle references, but `shared/README.md` still says the folder is a placeholder while the actual shared references are substantive. This creates an immediate documentation/navigation gap for agents entering through `shared/README.md`. [SOURCE: .opencode/skills/sk-code/shared/README.md:3] [SOURCE: .opencode/skills/sk-code/shared/README.md:11] [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:17] [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:24]
4. The OpenCode checklist navigation is useful but path wording is inconsistent: `code-quality` names `assets/opencode-checklists/` as a resource domain, while the actual authoring and language checklists are owned by `code-opencode/assets/checklists/`. The markdown links mostly point to `../code-opencode/assets/checklists/`, but the label and resource-domain text can mislead routing or prompt authors. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:89] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:103] [SOURCE: .opencode/skills/sk-code/code-quality/README.md:47] [SOURCE: .opencode/skills/sk-code/code-quality/README.md:102] [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:47]
5. The existing enforcement surface is stronger than the high-level docs imply: `check-comment-hygiene.sh` supports TypeScript/JavaScript, Python, shell, and JSONC comments; blocks ADR/REQ/CHK/task/spec-path and other ephemeral labels; and has a deliberate `hygiene-ok` escape. `check-dist-staleness.sh` delegates to system-spec-kit's dist freshness checker and reports rebuild commands when outputs are stale. [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh:42] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh:145] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh:162] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:30] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:57]
6. Advisor and integration metadata already recognize major integration edges, but only at the parent `sk-code` identity: the hub graph metadata enhances `system-spec-kit` and is prerequisite for `system-skill-advisor` and `deep-loop-workflows`, while `mode-registry.json` carries `quality` aliases such as `alignment verifier` and `stable jsonl keys`. Future improvements should update parent-level metadata/routing rather than adding `code-quality/graph-metadata.json`. [SOURCE: .opencode/skills/sk-code/graph-metadata.json:3] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:9] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:24] [SOURCE: .opencode/skills/sk-code/mode-registry.json:23] [SOURCE: .opencode/skills/sk-code/mode-registry.json:35]

## Ruled Out
- Adding or expecting a packet-local `code-quality/graph-metadata.json`: the parent hub's rules say exactly one graph metadata file belongs at `sk-code` root, and mode packets must not carry their own. [SOURCE: .opencode/skills/sk-code/SKILL.md:145] [SOURCE: .opencode/skills/sk-code/SKILL.md:157] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:192]
- Treating `code-quality` as a formal review mode: its contract is author-side correction, while findings-first review belongs to `code-review`. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:160] [SOURCE: .opencode/skills/sk-code/shared/references/universal/code_quality_standards.md:147]

## Dead Ends
- Directly reading `.opencode/skills/sk-code/code-quality/graph-metadata.json` failed because the file does not exist; this is not an implementation gap by itself because the hub contract centralizes advisor identity at `.opencode/skills/sk-code/graph-metadata.json`.

## Edge Cases
- Ambiguous input: The user requested the full bounded loop, but this leaf execution contract permits exactly one research iteration. I selected the narrow, legal first-iteration baseline and defer loop continuation to the orchestrator.
- Contradictory evidence: None found.
- Missing dependencies: Packet-local `code-quality/graph-metadata.json` was absent, but parent hub evidence shows this absence is intentional rather than missing metadata.
- Partial success: One valid iteration was completed; full loop execution, delta writing, and convergence synthesis are blocked by the leaf-session contract and allowed-write target boundary.

## Sources Consulted
- `.opencode/skills/sk-code/code-quality/SKILL.md`
- `.opencode/skills/sk-code/code-quality/README.md`
- `.opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md`
- `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh`
- `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh`
- `.opencode/skills/sk-code/SKILL.md`
- `.opencode/skills/sk-code/mode-registry.json`
- `.opencode/skills/sk-code/hub-router.json`
- `.opencode/skills/sk-code/graph-metadata.json`
- `.opencode/skills/sk-code/shared/README.md`
- `.opencode/skills/sk-code/shared/references/stack_detection.md`
- `.opencode/skills/sk-code/shared/references/smart_routing.md`
- `.opencode/skills/sk-code/shared/references/phase_detection.md`
- `.opencode/skills/sk-code/shared/references/universal/code_quality_standards.md`
- `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md`

## Assessment
- New information ratio: 1.0
- Questions addressed: q1 current `code-quality` value/friction; q2 shared `sk-code` assets/contracts; initial q3/q4 integration edges.
- Questions answered: Current baseline of `code-quality` workflow, routing, checklists, scripts, shared dependencies, and parent advisor metadata.

## Reflection
- What worked and why: Reading the parent hub, quality packet, registry, shared references, and scripts together exposed contract-vs-navigation gaps without needing broad search.
- What did not work and why: Looking for packet-local graph metadata produced a file-not-found result; the root cause is the intentional single-advisor-identity design, not missing setup.
- What I would do differently: In the next iteration, move from baseline inventory to targeted integration seams: system-spec-kit validation/completion, memory continuity, and concrete checklist handoff evidence.

## Recommended Next Focus
Investigate system-spec-kit integration in depth: how `code-quality` should load or reference spec-folder validation, completion-check, memory/continuity, and dist-freshness evidence without duplicating system-spec-kit rules.
