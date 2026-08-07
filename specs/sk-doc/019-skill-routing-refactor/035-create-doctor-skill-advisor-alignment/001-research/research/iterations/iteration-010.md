# Iteration 010 — Default primary source for the read-only hook check

## Focus

Should the read-only `/doctor:runtime-mirrors` route automatically select the Git primary checkout for the Codex hook check, or show it and require explicit `--repo` confirmation?

## Actions Taken

- Read the prior iteration, strategy, and registry state so this pass did not repeat the iteration-9 question without new evidence.
- Inspected the linked-worktree topology with `git worktree list --porcelain`, `git rev-parse --show-toplevel --git-common-dir --git-path hooks`, and `git config --get core.hooksPath`. The active checkout is linked; the primary checkout is the enclosing repository at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.
- Ran `node .opencode/bin/install-codex-hooks.mjs --check` from the active worktree. It stopped at the installer’s anchor guard before reading the global target.
- Ran the same check with `--repo /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`. It reached drift analysis and reported 8 missing managed hook identities and 7 orphaned managed entries.
- Ran `node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check`; discovery mirrors passed with 130 mirrors across 7 trees.
- Re-read the `/doctor` router, route manifest, runtime-mirrors asset, installer CLI, and Codex sync manifest to compare the diagnostic contract with the observed behavior.

## Findings

### F-010-01 — The primary override changes a hard failure into an actionable read-only result

The bare installer check from this linked worktree refuses the worktree anchor and reports the primary checkout, but it never reaches global-hook comparison. Supplying the detected primary checkout through the already-supported `--repo` option reaches the comparison and reports concrete drift: 8 expected identities are missing and 7 stale `.opencode/` identities are orphaned. This is new operational evidence that requiring manual confirmation before every read-only check withholds useful diagnostics. [SOURCE: `.opencode/bin/install-codex-hooks.mjs:286-317,360-379`; command: `node .opencode/bin/install-codex-hooks.mjs --check`; command: `node .opencode/bin/install-codex-hooks.mjs --check --repo /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`]

### F-010-02 — Git already supplies a deterministic primary-checkout source

The installer derives the linked-worktree relationship from `git rev-parse --git-common-dir` and `git rev-parse --show-toplevel`; the primary checkout is the parent of the canonical common Git directory. In this repository, `git worktree list --porcelain` shows one primary checkout and the active linked worktree sharing that common directory. The route can therefore auto-select one primary source without guessing among multiple sibling worktrees. [SOURCE: `.opencode/bin/install-codex-hooks.mjs:286-317`; command: `git worktree list --porcelain`; command: `git rev-parse --show-toplevel --git-common-dir --git-path hooks`]

### F-010-03 — The route currently hides source selection behind a no-argument contract

`runtime-mirrors` declares `allowed_flags: []`, the asset says it takes no inputs, and the hook invocation is the bare `install-codex-hooks.mjs --check`. The router requires flags to be declared in the resolved route, so there is no route-level way to select the primary checkout or an operator-chosen alternate source today. [SOURCE: `.opencode/commands/doctor/_routes.yaml:189-201`; `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:23-28,43-60`; `.opencode/commands/doctor/speckit.md:25-35,53-62]

### F-010-04 — Recommendation: auto-select primary for the default read-only check, with an explicit override

The route should resolve and display `current checkout`, `linked-worktree`, and `primary checkout`, then invoke the hook checker as `install-codex-hooks.mjs --repo <primary-checkout> --check` by default. Expose an explicit route-level `--repo <path>` override for an operator-selected checkout, but keep `--allow-worktree` unavailable through the doctor route: it is a broad anchor override shared by check and mutation paths, not a read-only source selector. If Git resolution fails or does not yield one primary checkout, fail closed and require `--repo` rather than silently checking the current worktree. [SOURCE: `.opencode/bin/install-codex-hooks.mjs:31-53,286-317`; `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:20-28`]

### F-010-05 — Source selection and repair authorization remain separate contracts

Auto-selecting the primary checkout only determines which repository supplies the read-only comparison. It does not authorize installation. The route remains read-only, and any repair handoff should carry the selected `--repo` explicitly instead of printing the current bare installer command, so a later operator-triggered repair cannot silently switch source when run from a linked worktree. [SOURCE: `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:20-28,65-77`; `.codex/SYNC.md:18,69,112-117`]

### F-010-06 — Discovery-mirror parity does not validate the outbound global hook file

The runtime mirror checker passes 130 discovery mirrors across 7 trees, while the primary-anchored Codex check reports missing and orphaned entries in the user-global hook file. The two checks cover different authorities; a route that stops at the linked-worktree anchor failure cannot distinguish “discovery mirrors pass” from “outbound hooks drift.” [SOURCE: `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:33-37,199-216`; command: `node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check`; command: `node .opencode/bin/install-codex-hooks.mjs --check --repo /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`]

## Questions Answered

- **Default source:** auto-select the Git primary checkout for the read-only Codex hook comparison, and show the selected path before the result.
- **Operator override:** support an explicit `--repo <path>` override for a deliberately selected checkout; scope it to the hook comparison until the other mirror checkers share a compatible root-selection contract.
- **Failure behavior:** if Git cannot resolve a unique primary checkout, require explicit `--repo`; do not fall back to `--allow-worktree`.
- **Repair boundary:** keep repair operator-owned and pass the selected source explicitly in any repair handoff.

## Questions Remaining

- Whether the route-level selector should be named `--repo` or a more narrowly scoped `--hook-source` before it is eventually generalized.
- Whether the route/asset checker-set mismatch, including the Pi invocations, should be repaired before the source-selection change is implemented; iteration 8 already identified this as an ordering constraint.
- How `/create:skill-parent` and `/doctor:skill-advisor` should expose the same canonical-checkout/index handoff while leaving advisor rebuild and graph scan mutations operator-owned.

## Next Focus

Return to the create/doctor/skill-advisor lifecycle: trace the post-create metadata and index handoff, then identify the smallest automation that keeps the skill-authoring guides aligned with the live advisor registry and graph contracts.
