# Iteration 002 — linked-worktree hook drift and runtime-mirror boundaries

## Focus

Determine whether the Codex hook warning is expected for this worktree/runtime generation, or whether it identifies a defect in the separate runtime-mirror and doctor maintenance path.

## Actions Taken

- Ran `node .opencode/bin/install-codex-hooks.mjs --check` from the linked worktree. The installer refused the anchor before inspecting the target and instructed the caller to pass `--allow-worktree`.
- Re-ran the same read-only check with `--allow-worktree`. It compared the worktree's `.codex/hooks.json` with `/Users/michelkerkmeester/.codex/hooks.json` and reported `missing=8`, `command=8`, and `orphaned=7`.
- Ran the repository discovery-mirror check. It passed: `130 mirrors across 7 trees are in sync`.
- Ran the Codex generated-surface checks. Prompt stubs passed; the generated agent check separately reported stale `.codex/agents/orchestrate.toml`.
- Read the installer worktree guard, the runtime-mirror doctor route, and the Codex sync manifest to compare the documented route with the actual worktree safety contract.

## Findings

### F-005 — The linked-worktree refusal is an expected safety guard, but the read-only doctor route does not account for it

The installer explicitly rejects a linked worktree unless `allowWorktree` is set (`.opencode/bin/install-codex-hooks.mjs:309-317`). That guard is appropriate for a normal install because the command writes the user-global hook file and a worktree is not automatically the canonical checkout.

The read-only `/doctor:runtime-mirrors` route invokes the installer as `node .opencode/bin/install-codex-hooks.mjs --check` with no override (`.opencode/commands/doctor/_routes.yaml:190-201`; `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:51-60`). In a linked worktree, the route therefore stops at the anchor guard and never emits the actual outbound-config drift report. The route is read-only, so it needs a worktree-aware check policy even if mutation remains primary-checkout-only.

### F-006 — Discovery mirrors can be green while the Codex runtime actually executes a stale global hook set

The repository mirror generator derives `.codex/hooks/*` from the versioned `.codex/hooks.json`; that check passed with 130 links across seven trees. The installer checks a different boundary: the user-global `~/.codex/hooks.json` that Codex actually reads. With the explicit worktree override, that second check found eight expected hook identities missing, eight commands differing, and seven obsolete `.opencode` identities retained as orphans.

The source config uses the portable `${CODEX_PROJECT_DIR:-$PWD}` anchor, while the global file contains hard-coded primary-checkout paths and older hook locations. This is real outbound installation drift, not discovery-mirror drift. The current `/doctor` aggregation does not make that distinction visible when the worktree guard fires first.

### F-007 — The repair guidance is underspecified for worktrees and mixes check scope with install scope

The Codex sync manifest documents the bare `--check` command (`.codex/SYNC.md:106-117`), while the installer usage supports `--allow-worktree`. The doctor output points operators to the mutating installer without explaining that it targets a user-global file or that a linked worktree requires an explicit override for diagnostics. A safe repair flow needs to distinguish: check the selected worktree's source against the global target; install only after the operator chooses which checkout is authoritative.

### O-002 — A separate generated Codex surface is stale, but it is not the hook cause

`sync-runtime-mirrors.cjs --check` passed and `sync-prompts.cjs --check` passed, while `sync-agents.cjs --check` reported stale `.codex/agents/orchestrate.toml`. This confirms that the runtime-mirror family can have independent generated-surface drift; it should be reported separately from outbound hook installation and should not be used as evidence that the hook warning is caused by the advisor index.

## Questions Answered

1. **Whether the hook drift is expected or belongs to a separate workstream:** The linked-worktree refusal is expected behavior from the installer's safety guard. The subsequent `missing=8`, `command=8`, `orphaned=7` result is genuine user-global outbound hook drift. It belongs to the runtime-install/doctor maintenance path, not to the skill-advisor graph or the repository discovery-mirror generator.
2. **Whether the current runtime-mirror check proves live Codex hook parity:** No. It proves the repository's discovery symlinks match the versioned source config, but it does not prove that `~/.codex/hooks.json` matches that source.

## Questions Remaining

- Should `/doctor:runtime-mirrors` invoke the installer with a read-only worktree-aware mode, or should the installer gain a distinct `--check --allow-worktree` policy documented as safe only for comparison?
- Which checkout is the canonical source when a developer has several linked worktrees, and how should the doctor surface that choice before offering a global install?
- Should the create workflows record a runtime-mirror/index handoff result, or should this remain a separate post-create maintenance diagnostic?
- Should `description.json` remain a descriptive parent-hub projection, or become a generated/validated projection of registry and graph vocabulary?
- Should new skill creation auto-run trusted `skill_graph_scan`, or retain operator-owned mutation with an explicit confirmation handoff?

## Next Focus

Return to the create/doctor handoff boundary: compare the standalone `/create:skill` completion path with the parent-hub path, which already emits a registry projection and drift-guard result, and identify the smallest advisor-index postcondition that can be added without silently mutating the trusted graph.
