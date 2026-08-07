# Iteration 006

## Focus

Whether `description.json` should remain a descriptive parent-hub projection or become a generated/validated projection of registry and graph vocabulary.

## Actions Taken

- Read the skill-root metadata contract, parent-hub registry/router doctrine, description template, live `system-deep-loop` metadata, and the parent-hub doctor checker.
- Ran `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop`; it exited 0 and passed the description, registry/router, graph-identity, and generated-manifest checks.
- Re-ran the requested `node .opencode/bin/install-codex-hooks.mjs --check`; it exited 1 because this linked worktree is not a safe global hook anchor and the installer requires the primary checkout or `--allow-worktree`.
- Did not modify any investigated source, metadata, registry, router, or runtime file.

## Findings

1. **`description.json` is authored hub-doctor metadata, not an advisor input.** The skill-root contract marks it required for packet hubs and authored, while explicitly stating that the advisor ingests `graph-metadata.json` for identity, domains, intent signals, and typed edges. The description template reinforces that boundary: it describes the hub’s packets and says the advisor identity input is `graph-metadata.json`.

2. **The current doctor check intentionally validates shape and source separation, not vocabulary equality.** `parent-skill-check.cjs` requires `name`, `description`, `version`, and an array-valued `keywords` field, then rejects registry-owned duplicate keys `modes` and `backend_kinds`. It does not require `description.keywords` to equal `mode-registry.json` aliases, `hub-router.json` classes, or graph metadata. That is the correct default for free-form descriptive metadata; deriving or exact-mirroring the field would create a second routing source of truth.

3. **Machine-readable parity already has owners elsewhere.** `mode-registry.json` owns packet and mode vocabulary; `hub-router.json` owns signal-key parity, vocabulary classes, and loadable resources; `leaf-manifest.json` is generated from the declared packet corpus. The live parent check confirmed all seven registry modes, all seven router signals, and byte-fresh manifest data. `description.json` may mention those modes in prose or keywords, but changing it does not change routing or graph indexing.

4. **The creation surface is conceptually aligned but still easy to misread.** The description scaffold calls itself “hub-doctor metadata” and the contract is explicit, yet its keyword placeholders include workflow and surface names while the router and graph contracts use similarly named vocabulary fields. A new author can therefore update `description.json` believing the advisor will learn the new mode. The smallest alignment improvement is an explicit create/doctor handoff note that says “description is descriptive; update graph metadata for advisor signals; update registry/router for mode routing,” not automatic description generation.

5. **The requested hook check confirms the existing worktree boundary remains separate.** From this linked worktree, the installer refuses to anchor global hooks and reports the primary checkout path. This is a read-only diagnostic/source-selection issue; it does not change the description/registry decision and should remain a separate runtime-mirror doctor concern.

## Questions Answered

- **Should `description.json` remain descriptive?** Yes. Keep it authored and descriptive, with structural validation and explicit rejection of registry-owned duplicate fields. Do not generate it from registry or graph vocabulary.
- **Should it be validated against registry and graph vocabulary?** Only at the boundary level: validate that it does not re-declare machine-owned structures. Do not demand exact keyword or prose parity. If stronger checking is needed, add an opt-in warning for clearly graph-owned lookalike fields rather than making free-form keywords canonical.
- **Which file should a new-skill author update for advisor routing?** `graph-metadata.json` supplies advisor identity and signals; `mode-registry.json` and `hub-router.json` supply parent-hub mode routing; `description.json` documents the hub for doctor/readability.

## Questions Remaining

- Should `/create:skill-parent` and `/doctor:skill-advisor` emit a single post-create handoff showing the three metadata owners and the operator-owned `skill_graph_scan`/`advisor_rebuild` steps?
- Should the doctor add a non-blocking warning for graph-shaped keys such as `domains` or `intent_signals` appearing in `description.json`, while preserving hub-specific descriptive extensions?
- Whether the runtime-mirror route should propagate the explicit `--repo` source-selection option beyond the Codex-hook checker remains open from iteration 5.

## Next Focus

Trace the complete `/create:skill` and `/create:skill-parent` handoff into `skill_graph_scan` and `advisor_rebuild`, then identify the smallest explicit post-create diagnostic that closes index drift without making the create workflow silently mutate the advisor index.
