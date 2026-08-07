# Iteration 003 — canonical checkout selection before global hook install

## Focus

Determine which checkout should be treated as the source for a user-global Codex hook installation when several linked worktrees exist, and define what the doctor must show before offering that installation.

## Actions Taken

- Re-ran `node .opencode/bin/install-codex-hooks.mjs --check` from the current linked worktree. It exited `1` at the repository-anchor guard and reported the primary checkout as `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.
- Ran the read-only check against the primary checkout and against the current worktree with `--allow-worktree`. The primary-source comparison reported `missing=8, orphaned=7`; the current-worktree comparison reported `missing=8, command=8, orphaned=7`.
- Read the installer implementation, the `/doctor:runtime-mirrors` route and YAML, the `/doctor:skill-advisor` route, the parent-skill/create contracts, and the skill-graph scan handler.
- Enumerated the Git worktrees and compared the primary/current identities. This clone has 41 registered worktrees. The primary checkout is on `skilled/v4.0.0.0` at `1ba86161...` and has unrelated deleted files; the current worktree is on `sk-doc/0128-create-doctor-skill-advisor-alignment` at the same commit and is clean. `.codex/hooks.json` and the installer are byte-identical between the two checkouts.

## Findings

### F-008 — The primary checkout is a safety anchor, not a complete content-authority signal

`install-codex-hooks.mjs:286-317` derives the primary checkout from Git's common directory and refuses a linked worktree unless `--allow-worktree` is supplied. That is the right default for a mutating global install because the installer replaces the portable `${CODEX_PROJECT_DIR:-$PWD}` anchor with the selected `repoAbs`; installing from a transient worktree would make `~/.codex/hooks.json` point at that worktree.

The guard does not establish that the primary checkout contains the desired revision. In this clone the primary checkout is dirty while the current worktree is clean, and 41 worktrees are available. The doctor must therefore display the primary path, branch, `HEAD`, dirty/clean state, and the current checkout before treating “primary” as the default source. A dirty primary should require an explicit source choice or a clean/validated revision; silently installing from it is not justified by the Git topology alone.

### F-009 — Advisor indexing is workspace-root-specific, so local creation and global hook installation are separate decisions

The `skill_graph_scan` handler resolves `process.cwd()` as the workspace root, scans `<cwd>/.opencode/skills`, and publishes the generation with that same `workspaceRoot` (`.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/scan.ts:39-58`). The skill-advisor lifecycle guidance likewise says a new skill is watched under the selected skills root and can be manually refreshed with `skill_graph_scan --trusted` (`.opencode/skills/system-skill-advisor/SKILL.md:343`).

That means `/create:skill` or `/create:skill-parent` can validate and index a skill in the worktree where it was created without making that worktree the source for a user-global Codex hook install. The create completion handoff should record the local structural/index result; `/doctor:runtime-mirrors` should handle the separate, explicitly selected global-runtime source.

### F-010 — The runtime-mirrors doctor cannot reach the actual global drift report from a linked worktree

The route manifest marks `runtime-mirrors` as read-only and invokes `node .opencode/bin/install-codex-hooks.mjs --check` with no `--repo`, source-selection, or worktree-aware option (`.opencode/commands/doctor/_routes.yaml:189-201`). The YAML also declares no inputs and says every checker derives its expected state automatically (`.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:29-43`).

Consequently, the current route stops at the expected linked-worktree refusal. The explicit read-only checks prove the missing diagnostic: primary checkout yields `missing=8, orphaned=7`, while checking the current worktree with `--allow-worktree` additionally yields `command=8` because the global target's commands are anchored to the primary path. The doctor currently exposes neither the selected source nor this distinction.

### F-011 — `--allow-worktree` is a broad override, not a check-only policy

`parseArgs` accepts `--allow-worktree` independently of `--check`, and `main` continues into the normal write path whenever `--check` is absent (`.opencode/bin/install-codex-hooks.mjs:31-52`, `:360-425`). The flag is therefore useful for a read-only comparison but is also sufficient to authorize a global mutation from an arbitrary worktree. Documentation that tells operators to “rerun with `--allow-worktree`” without saying “check only” creates an unsafe repair path.

The safer contract is a two-stage doctor flow: identify and show candidate checkouts; run the selected source in check-only mode; only then offer a separate install action that requires an explicit source path/choice. If the installer API is changed, a check-specific worktree policy should be distinct from the mutation override rather than reusing one boolean.

## Questions Answered

1. **Canonical checkout:** Git gives the installer one safe default—the primary checkout inferred from the shared Git common directory—but the repository has no evidence that this checkout is always the content-canonical source. The canonical source must be an explicit, displayed choice with revision and cleanliness evidence.
2. **Doctor presentation before global install:** Show the primary checkout, current worktree, all relevant branch/`HEAD`/dirty states, the global target path, and the source-to-target drift result. From a linked worktree, do not offer an install until the operator selects the source; offer primary-source check, current-worktree check-only comparison, and install-selected-source as distinct outcomes.
3. **Boundary with skill creation:** Keep skill creation and local advisor indexing scoped to the worktree in which the skill is authored. Record that handoff in `/create:*`; keep global Codex hook installation in the runtime-mirror doctor/operator flow.
4. **Meaning of `--allow-worktree`:** It is currently a broad anchor override. It can support a safe comparison only when paired with `--check`; it must not be presented as a general repair command.

## Questions Remaining

- Should the installer add a separate `--check --allow-worktree` policy or should the doctor resolve and pass the primary/selected `--repo` explicitly, leaving `--allow-worktree` unavailable to mutation paths?
- What exact operator-facing source-selection syntax should the runtime-mirror route expose while preserving its current read-only default?
- Should `description.json` remain a descriptive parent-hub projection, or become a generated/validated projection of registry and graph vocabulary?
- Should new skill creation auto-run trusted `skill_graph_scan`, or retain operator-owned mutation with an explicit confirmation handoff?

## Next Focus

Compare the standalone and parent-skill create completion boundaries against this source-selection model, then define the smallest machine-readable handoff for local advisor freshness without coupling it to global runtime installation.
