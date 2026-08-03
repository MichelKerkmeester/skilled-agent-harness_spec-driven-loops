# Iteration 007

## Focus

Whether the `/doctor:runtime-mirrors` route should propagate an explicit `--repo` source-selection option beyond the Codex-hook checker.

## Actions Taken

- Read the runtime-mirrors route registration, its YAML asset, all listed mirror checker entrypoints, and the Codex hook installer argument handling.
- Compared each checker’s repository-root resolution and accepted arguments. The mirror generators derive a root from `__dirname`; the hook installer already accepts `--repo`; the roster checker has no argument parser.
- Ran `node .opencode/bin/install-codex-hooks.mjs --check`; it exited 1 from this linked worktree and reported the primary checkout, confirming the existing anchor-safety behavior.
- Probed `--repo` on the runtime-mirror and Codex-agent checkers; both rejected it with their current usage contracts. Passing `--repo .` to the roster checker was ignored and the checker still passed against the current checkout.
- Did not modify any investigated source, route, checker, or installer files.

## Findings

1. **The checker CLI contract is non-uniform (P1).** `install-codex-hooks.mjs` explicitly parses `--repo <path>` and uses it to select the source checkout before enforcing linked-worktree anchor safety (`.opencode/bin/install-codex-hooks.mjs:8-14,31-53,360-367`). The runtime-mirror, Codex-agent, Codex-prompt, Pi-agent, and Pi-prompt checkers accept only an optional `--check` and hard-code `REPO_ROOT` from their script location (`.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:24,40-47`; `.opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs:10,42-49`; `.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs:10,30-37`). `agent-roster-mirror-check.cjs` computes its root from `__dirname` and does not parse arguments at all (`.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:17-24`). A route-wide blind pass-through would therefore fail on some checkers and be silently ignored by another.

2. **The route currently exposes no source-selection surface (P1).** `_routes.yaml` declares `allowed_flags: []` and invokes five commands without a repository argument (`.opencode/commands/doctor/_routes.yaml:189-201`). The route asset separately declares that the diagnostic takes no arguments (`.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:43-46`). The only checker for which a selected checkout is materially necessary is the global Codex-hook comparison: its source is repo-local, but its target is `~/.codex/hooks.json`; the other checkers compare files within one repo-relative mirror tree.

3. **The route and its asset disagree about the checker inventory (P1).** The asset lists seven upstream assets and seven execution steps, including `pi_agents` and `pi_prompts` (`doctor-runtime-mirrors.yaml:33-40,52-60`), while `_routes.yaml` invokes only runtime mirrors, Codex agents, Codex prompts, the roster check, and Codex hooks (`_routes.yaml:196-201`). It also says “five mirror checkers” while enumerating seven in the asset. Source selection cannot be made a reliable route-wide contract until the route’s actual checker set is normalized.

4. **Recommendation: do not propagate `--repo` by partial forwarding.** Keep the no-argument diagnostic read-only and rooted at the current checkout. Add the route-level explicit selector for the Codex-hook check first, with the already-supported `--repo <path>` and the existing linked-worktree safety guard. Only make `--repo` shared after every invoked checker accepts the same contract, the route invokes the same inventory documented by its asset, unknown arguments are rejected consistently, and the diagnostic reports which checkout supplied both canonical and generated files. If cross-checkout mirror parity is later required, invoking the selected checkout’s own checker scripts is safer than passing a path into older scripts that still hard-code their module root.

## Questions Answered

- **Should the runtime-mirror route propagate `--repo` beyond the Codex-hook checker now?** No—not as a blind shared flag. The current checker APIs are incompatible, and one checker silently ignores the option.
- **What is the smallest safe alignment?** Add explicit route-level source selection for the Codex-hook comparison, preserve check-only behavior, and show the selected/auto-detected primary checkout. Keep other repo-local checks scoped to the checkout whose scripts are being run.
- **What would justify a shared option later?** A common argument contract across the complete checker inventory, route/asset parity, explicit selected-root reporting, and tests that prove every checker checks the same selected repository without mutation.

## Questions Remaining

- Should the route’s `--repo` be named as a hook-source selector or eventually become a shared repository-root selector after the checker APIs are unified?
- Should the missing Pi checker invocations be restored before any route-level source-selection work is implemented?
- Should the default hook check auto-select the Git primary checkout, with an explicit `--repo` override for an operator-selected checkout, while leaving all repair commands operator-owned?

## Next Focus

Reconcile the runtime-mirror route’s actual checker inventory and source-root semantics, then fold the result into the create/doctor/skill-advisor handoff recommendations without changing the read-only boundary.
