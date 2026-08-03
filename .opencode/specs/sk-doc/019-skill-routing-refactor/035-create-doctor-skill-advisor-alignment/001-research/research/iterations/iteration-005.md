# Iteration 005

## Focus

Should the Codex-hook checker auto-select the Git primary checkout when `/doctor:runtime-mirrors` runs from a linked worktree, or require the operator to provide `--repo` after showing the detected primary path?

## Actions Taken

- Ran `node .opencode/bin/install-codex-hooks.mjs --check` from the current linked worktree.
- Read the installer CLI and Git anchor-safety implementation.
- Read the runtime-mirrors doctor route, route manifest entry, and sibling source-selection conventions.
- Did not mutate any investigated source or runtime file.

## Findings

1. **The bare doctor invocation is not worktree-safe.** The installer check exited 1 with `Refusing to anchor hooks at linked worktree ... Primary checkout: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Pass --allow-worktree to override.` The route manifest declares no inputs, and `doctor-runtime-mirrors.yaml` instructs the runner to call the installer with bare `--check` (`.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:43-60`). A linked-worktree invocation therefore fails before it can report hook drift.

2. **The installer already exposes the right source-selection primitive.** Its CLI accepts `--repo <path>` and defaults to the repository inferred from the script location (`.opencode/bin/install-codex-hooks.mjs:8-16, 339-343`). `assertSafeRepoAnchor()` compares the selected checkout's Git common directory and refuses linked-worktree anchors unless `--allow-worktree` is supplied (`.opencode/bin/install-codex-hooks.mjs:278-317`). Passing the detected primary checkout as `--repo` preserves that safety guard; passing `--allow-worktree` would weaken it.

3. **`--allow-worktree` is not an appropriate doctor workaround.** It is a general anchor override used by both check and mutation paths, while the route's invariant is that every checker remains read-only (`.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:20-28`). The route should not hide that override behind automatic dispatch or suggest it as the normal repair path.

4. **Recommendation: auto-select the primary checkout for the default read-only check, with an explicit override.** When invoked inside a linked worktree, the route should resolve the Git common directory, display the canonical primary checkout, and invoke the Codex checker as `node .opencode/bin/install-codex-hooks.mjs --repo <primary-checkout> --check`. Add an explicit route-level `--repo <path>` override for operators who need another checkout; keep `--check` mandatory and do not expose `--allow-worktree` on this diagnostic route. If Git resolution fails or the selected path is ambiguous, stop with the detected candidates and require `--repo`.

5. **Repair guidance needs the same source context.** The route currently prints `node .opencode/bin/install-codex-hooks.mjs` as the repair command without a source checkout (`.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:66-77`). The diagnostic can remain read-only, but its repair output should carry the resolved primary path and state that the mutation must be run explicitly from that canonical checkout.

## Questions Answered

- **Auto-select or require `--repo`?** Auto-select the Git primary checkout for the no-argument read-only route, show the selected path, and support `--repo <path>` as an explicit override.
- **Does the installer distinguish source selection from worktree override?** Yes. `--repo` selects the checkout; `--allow-worktree` bypasses the linked-worktree safety refusal. They should not be conflated.
- **Can the current route complete from a linked worktree?** Not with its documented bare installer command. The reproduced check exits before drift reconciliation.

## Questions Remaining

- Whether the same shared `--repo` option should be added to all runtime-mirror checkers or only threaded into the Codex-hook checker first.
- Whether post-create skill workflows should emit the same canonical-checkout/index handoff information when they leave advisor rebuild operator-owned.
- Whether `description.json` should remain a descriptive parent-hub projection or be validated against registry and graph vocabulary.

## Next Focus

Trace the `/create:skill` and `/create:skill-parent` handoff into `skill_graph_scan`/`advisor_rebuild`, and identify the smallest explicit post-create diagnostic that closes the remaining index-drift gap.

