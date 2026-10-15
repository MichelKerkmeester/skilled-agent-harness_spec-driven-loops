# Iteration 4: hook trust, installation, and preflight advice

## Focus

Complete the hook and advisory portion of Q3: separate repository trust, Git hook installation and persistent gate settings from runtime preflight delivery.

## Actions Taken

- Read the trust block copied into Git hooks, installer status resolution, shared gate-config helper, and `/doctor:git hooks` workflow contract.
- Read the preflight advisory runtime matrix, its rule loading, suppression, and fail-open behavior.
- Rechecked `steer.md`; it is absent in this lineage.

## Findings

1. A clone's own hook scripts run only when its Git common directory matches the installed hook checkout or local config sets `skilled.trustRepoHooks=true`; command-line and environment config do not grant trust, and trust applies to every branch in that checkout and its worktrees, so a setup check should show the local trust value and explain which repository code it authorizes. [SOURCE: .skilled/scripts/git-hooks/pre-commit:28-57]
2. `.skilled/scripts/git-hooks/` is the lifecycle-hook source, while Git resolves installed hooks through the effective `core.hooksPath`; installer `--status` reports the configured scope, resolved target directory, each hook's link/source and shadowing, plus the effective message contract, so a read-only setup path can reuse that status data without reinstalling anything. [SOURCE: .skilled/scripts/install-git-hooks.sh:29-50,96-149; .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-83]
3. Persistent optional gate switches live in local or global `speckit.hooks.<key>` config and the `gates.tsv` registry; `/doctor:git hooks` can change those gates, but intentionally refuses saved per-push approvals, leaves commit-message rules to its `standards` target, and sends whole-hook kill switches to `/doctor:env`, while `core.hooksPath` is outside its mutation boundary. [SOURCE: .skilled/scripts/git-hooks/lib/gate-config.sh:5-16,20-39; .skilled/commands/doctor/assets/doctor-git-hooks.yaml:22-42,63-72; .skilled/commands/doctor/git.md:51-67]
4. The git preflight advisory reads the same `hard-rules.json` used by dispatch checks and is wired through six runtime adapters, but it is warning-only and fails open for missing rules, malformed payloads, unsupported commands, or failed checks; it can be globally, family, or rule suppressed through environment variables, so setup can prove rule/adapter wiring and suppression state but cannot claim command-time warnings are enforced. [SOURCE: .skilled/skills/sk-git/SKILL.md:242-257; .skilled/skills/sk-git/scripts/hooks/README.md:18-35,71-84; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,57-69,76-115]

## Questions Answered

- How do worktree naming/provisioning, Commit-Id allocation, hook trust, global hooks, and preflight advice interact?

## Questions Remaining

- What can a read-only sk-git setup check prove, and how does `/doctor:git` currently route and report?
- Should setup be a new `/doctor:git` action or a separate command, and which proposals should be rejected?

## Dead Ends

- No single “hooks installed” bit covers this system: global Git lifecycle hooks, per-repository trust, persistent gate settings, and runtime preflight adapters have separate resolvers and failure modes. [SOURCE: .skilled/scripts/install-git-hooks.sh:112-149; .skilled/scripts/git-hooks/pre-commit:28-57; .skilled/scripts/git-hooks/lib/gate-config.sh:20-39; .skilled/skills/sk-git/scripts/hooks/README.md:71-84]

## Workflow Conflicts

None identified in this iteration.

## Assessment

- newInfoRatio: 1.0
- Novelty: trust scope, installed-hook resolution, persistent gate ownership, and advisory-only runtime integration are new to this lineage; convergence remains telemetry only.
- Confidence: high for the documented routing and config behavior. A static setup check can inspect wiring and current configuration; actual per-runtime warning delivery is an operational observation rather than something the current read-only files prove.

## Reflection

The existing `/doctor:git hooks` target already reads both gate configuration and hook installation state, but it continues into an interactive mutation workflow. The preflight advisory is a different surface from Git lifecycle enforcement: its warning path may be suppressed or fail open and must be reported as advisory coverage. [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-102; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,76-115]

## Recommended Next Focus

Define the read-only setup proof matrix, inspect `/doctor:git` route constraints, and decide command placement and rejected implementation ideas.
