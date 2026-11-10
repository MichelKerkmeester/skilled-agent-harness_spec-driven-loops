---
title: "Iteration 4: hooks and runtime safety — global hook install, trust gate, per-gate config, preflight advisory, message gate, doctor backend"
trigger_phrases: []
---
# Iteration 4: sk-git customization surface, part 2 — hooks and runtime safety

## Focus

The global hooks under `.skilled/scripts/git-hooks/`, `install-git-hooks.sh`, the `skilled.trustRepoHooks` trust gate, per-gate `speckit.hooks.<key>` persistence (`gates.tsv`, `gate-config.sh`, `git-hook-gates.cjs`), the preflight advisory and its per-runtime registrations, and `git-message-gate.mjs`.

## Actions Taken

- Read `.skilled/scripts/git-hooks/README.md` (the hook system's own contract, incl. trust semantics).
- Read `.skilled/scripts/install-git-hooks.sh` (install/--status/--uninstall, ownership check, hooksPath scope reporting, linked-worktree warning).
- Read the trust block in `pre-commit`/`pre-push` and confirmed it is held identical across all six lifecycle hooks by `tests/source-root-selection.test.sh`.
- Read `.skilled/scripts/git-hooks/lib/gates.tsv` (full gate registry) and `.skilled/commands/doctor/scripts/git-hook-gates.cjs` (the `/doctor:git hooks` backend).
- Read `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`, `git-message-gate.mjs`, and the `opencode/` + `pi/` adapter headers.
- Read `.skilled/hooks/shared/hook-flags.{mjs,cjs}` for `isHookEnabled` and the `git-preflight` disable key.

## Findings

1. The global hooks are shipped sources under `.skilled/scripts/git-hooks/` symlinked into `git rev-parse --git-path hooks` by `.skilled/scripts/install-git-hooks.sh` — honoring repo-local or global `core.hooksPath` automatically, and usually installed machine-wide. `--status` prints the hooksPath scope, per-hook resolved target, a `SHADOWED` warning when the installed link resolves outside the checkout, and the resolved message contract (`validate-message.mjs --repo --explain`). [SOURCE: .skilled/scripts/install-git-hooks.sh:107-144; .skilled/scripts/git-hooks/README.md:15-18]

2. Install safety is already solved and a setup check should verify rather than redo it: the installer refuses to overwrite a foreign hook (a symlink counts as ours only if it resolves under `.skilled/` or `.opencode/` `scripts/git-hooks`), warns-and-skips, and `--uninstall` removes only own symlinks — coexistence with husky/pre-commit/lefthook is the designed posture, and installing from a linked worktree prints a dangling-symlink warning. [SOURCE: .skilled/scripts/install-git-hooks.sh:72-105,146-177,188-197]

3. `skilled.trustRepoHooks` is the repo-side opt-in that decides whether the globally installed hooks run *this* repository's own gate scripts: an identical block in all six lifecycle hooks keeps the selected source root only when the target shares the hooks' checkout (or a worktree of it) or sets `git config --local skilled.trustRepoHooks true`; a `-c` flag or `GIT_CONFIG_*` never counts, local config is never cloned, and trust covers the repository not a branch. Untrusted → `SOURCE_ROOT=/dev/null/.skilled-untrusted` → treated as a repo without the toolchain, with a NOTICE naming the enable command. [SOURCE: .skilled/scripts/git-hooks/pre-commit:28-56; .skilled/scripts/git-hooks/README.md:34-36]

4. `commit-msg` deliberately sits outside the trust block: it finds `validate-message.mjs` beside the installed hook and enforces *the target repository's own* rules block even in untrusted clones; it has no bypass and `--no-verify` only defers the check to `pre-push` and CI. So the message contract is the one enforcement a repo cannot escape by staying untrusted. [SOURCE: .skilled/scripts/git-hooks/README.md:34-36]

5. Per-gate persistence is data-driven: `lib/gates.tsv` is the single registry (hook, key, env, persistable, description) — 13 persistable gates across pre-commit (9), prepare-commit-msg (1) and pre-push (3 blocking + 1 warn-only), plus `remotePush` and `massDeletion` marked non-persistable so an approval can never be saved. `lib/gate-config.sh` reads `speckit.hooks.<key>` from local/global config only (`off|false|no|0`), and `/doctor:git hooks` is `git-hook-gates.cjs list|set` — dry-run by default, exit 0/2, refusing non-persistable keys and delegating commit-msg rules to `git-standards.cjs`. [SOURCE: .skilled/scripts/git-hooks/lib/gates.tsv:1-16; .skilled/commands/doctor/scripts/git-hook-gates.cjs:7-29,80-83]

6. Kill switches sit at three levels: `SYSTEM_HOOKS_DISABLED`/`SYSTEM_GIT_COMMIT_HOOKS_DISABLED` master flags via `isHookEnabled`, per-concern env (`git-preflight` → `SK_GIT_PREFLIGHT_DISABLED`), and per-gate `SPECKIT_SKIP_*`/config keys — a setup check that only inspected hook files would miss a master-flag silence entirely. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:25-40; .skilled/scripts/git-hooks/README.md:20-28]

7. The preflight advisory (`scripts/hooks/git-preflight-advisory.mjs`) is a PreToolUse hook reading the same `hard-rules.json` through `dispatch-rule-checks.mjs` + `git-context.mjs`/`git-rule-checks.mjs`, capped at `MAX_ADVISORIES=3`, failing open on every path, suppressed by `SKGIT_ADVISORY=0` or `SKGIT_ADVISORY_SKIP=<id|prefix>` — and it exists as three runtime adapters (Claude `.mjs`, `opencode/sk-git-preflight-advisory.js`, `pi/git-preflight-advisory.ts`), so presence in git config or hook dir does not prove it is wired; each runtime's hook/plugin registration is the real state to check. [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:1-66; .skilled/skills/sk-git/scripts/hooks/opencode/sk-git-preflight-advisory.js:1-30]

8. `git-message-gate.mjs` is the agent-side mirror of `commit-msg`: a PreToolUse gate that parses the command line (`git commit -m/-F`, `gh pr create/edit --body`, branch-creating commands) and blocks only violations it can see, with no suppression switch, one file serving Claude/Codex `Bash`, older Codex/Devin `exec` and Cursor `Shell` deny envelopes. A setup check for agent-side coverage must therefore detect registration per runtime event, not a git config key. [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:1-40]

9. The honest failure-mode list for a hooks setup check: (a) hook absent or resolved target SHADOWED by another checkout; (b) foreign hook occupying the path so ours was skipped; (c) `core.hooksPath` scope mismatch (local vs global vs unset); (d) linked-worktree dangling symlinks; (e) repo untrusted → all repo-owned gates silently skipped except commit-msg/Commit-Id; (f) master/per-gate disable flags muting gates that appear installed; (g) advisory/message-gate not registered in the user's runtime; (h) missing gate script inside a toolchain repo → blocking gate exits 1 naming path + bypass (loud, by design). [SOURCE: .skilled/scripts/install-git-hooks.sh:107-144,188-197; .skilled/scripts/git-hooks/README.md:20-36; .skilled/scripts/git-hooks/pre-commit:51-56]

10. `/doctor:git` is already a thin router in exactly the sk-code shape: target + setup values resolved from `_routes.yaml`, presentation contract loaded, workflow YAML executed from `.skilled/commands/doctor/assets/` — so a `setup` target is one route row + one workflow YAML + one read-only check script, and the existing `hooks`/`standards` targets already own mutation (`git-hook-gates.cjs`, `git-standards.cjs`), which a setup check would read-only invoke (`status`/`list`) rather than duplicate. [SOURCE: .skilled/commands/doctor/git.md:3-10,22-67]

## Questions Answered

- How do hooks get customized per repo? Toggles via `speckit.hooks.<key>` (gates.tsv registry), trust via `skilled.trustRepoHooks`, Commit-Id via `skilled.commitId`, advisory suppression via env; hook scripts themselves stay shipped — per-repo hooks coexist in `.git/hooks` under the foreign-hook protection rather than replacing the global set.
- What breaks worst? Untrusted repo: all repo-owned gates silently skipped (NOTICE only) while commit-msg still blocks on the template — a repo can look ungated yet still fail at commit-msg. SHADOWED/stale symlinks: hooks run a different checkout's scripts or none.

## Questions Remaining

- Exact `/doctor:git` route table rows (targets, setup variables, workflow assets) and whether the command's presentation contract already constrains output shape — iteration 5 reads `_routes.yaml` + `git.md` in full.
- Whether any check script (`git-doctor-*.cjs` style) already exists that a setup battery could reuse beyond `git-standards.cjs status`/`git-hook-gates.cjs list`/`install-git-hooks.sh --status` — iteration 5 inventories doctor scripts.

## Ruled Out

- None.

## Dead Ends

- `trustRepoHooks` does not appear under `.opencode/` or as a standalone file — it lives in the identical trust block inside each lifecycle hook and in README/changelog docs. Resolved by reading `pre-commit:28-56` directly.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; README prose matched the hook code exactly.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/scripts/git-hooks/README.md:1-60
- .skilled/scripts/install-git-hooks.sh:1-197
- .skilled/scripts/git-hooks/pre-commit:28-82
- .skilled/scripts/git-hooks/pre-push:35-83
- .skilled/scripts/git-hooks/lib/gates.tsv:1-16
- .skilled/commands/doctor/scripts/git-hook-gates.cjs:1-80
- .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:1-70
- .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:1-40
- .skilled/skills/sk-git/scripts/hooks/opencode/sk-git-preflight-advisory.js:1-30
- .skilled/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts:1-25
- .skilled/hooks/shared/hook-flags.mjs:1-10; .skilled/hooks/shared/hook-flags.cjs:25-68
- .skilled/commands/doctor/git.md:1-82

## Assessment

- `newInfoRatio`: `0.90`
- Novelty justification: all findings new to this lineage; the trust-block mechanics, gates.tsv registry, and foreign-hook coexistence were previously only name-dropped.
- Confidence: high — README claims were cross-checked against hook source and installer code.

## Reflection

- Worked: reading the hooks README first gave the whole trust/gate model, then targeted greps confirmed it in code — cheapest path to accurate citations.
- Did not work: the initial `.opencode` grep was slow and unproductive.
- Would do differently: keep scoped greps to `.skilled/` subtrees.

## Recommended Next Focus

Iteration 5: `/doctor:git`'s full router (`git.md`, `_routes.yaml` rows, workflow assets), inventory of existing doctor check scripts for reuse, then reconcile the complete customization matrix, decide placement (new `setup` target vs separate command), name rejections, and draft implementation phases.
