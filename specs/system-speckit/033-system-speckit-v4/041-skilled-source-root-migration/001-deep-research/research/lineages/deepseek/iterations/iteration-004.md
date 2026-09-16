---
title: "Iteration 4: Repository Gates and External References"
trigger_phrases: []
---
# Iteration 4: Repository Gates and External References

## Focus
Surface 5 (the pre-commit, pre-push and prepare-commit-msg hooks, the validators, the naming guards, and the 20 CI workflows — which would reject the migration commit itself, and what order they must be taught the new path in) plus surface 6 (references from outside the repository that do not move with `git mv`).

## Findings

### F4.1 — The gate stack: seven blocking pre-commit sub-gates, a blocking pre-push, and a stamping prepare-commit-msg — all installed from `.opencode/scripts/git-hooks/`

`pre-commit` runs, in order: comment hygiene (blocking), agent mirror-sync (blocking, no bypass flag), mirror parity (blocking; "runs exactly what CI's mirror job runs"), prompt-knowledge card-sync (blocking), MCP mutation-class (blocking), compiled-routing auto re-mint (blocking only when it cannot fix it), spec derived-metadata auto re-mint (blocking only when it cannot fix it), tool ownership map (blocking) [SOURCE: .opencode/scripts/git-hooks/pre-commit:41,87,108,194,214,236,412,555]. `pre-push` blocks new-branch naming and mass deletions, runs the skill-root metadata gate, and detects skill-tree changes with a pathspec [SOURCE: .opencode/scripts/git-hooks/pre-push:37,50,121,152,209]. `prepare-commit-msg` mints the `Commit-Id:` trailer "through the sk-git ordinal allocator" and "identifies this repository by the allocator's path" [SOURCE: .opencode/scripts/git-hooks/prepare-commit-msg:5,40,47]. `commit-msg`, `post-commit`, `post-merge`, `post-rewrite` complete the set [SOURCE: .opencode/scripts/git-hooks/README.md].

- **Classification**: manual
- **Consequence for the cutover**: every gate reads its checker, allowlist, or allocator from a hardcoded `.opencode/...` path. The migration commit must pass gates that live at the path it is moving — the definition of an ordering constraint.

### F4.2 — Three pre-commit gates would reject the migration commit; two would silently disengage instead

- **Mirror parity — BLOCKS.** Its `MIRROR_SOURCES` array names `.opencode/agents`, `.opencode/commands`, `.opencode/hooks`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors`, `.opencode/skills/system-spec-kit/runtime/cli/codex` [SOURCE: .opencode/scripts/git-hooks/pre-commit:133-138]. A staged rename stages the old paths, so the gate engages, runs six `--check` scripts against sources that have just moved, and exits 1. The only in-commit escape is `SPECKIT_SKIP_MIRROR_PARITY=1` [SOURCE: pre-commit:120]. If instead the six scripts are not found at their hardcoded paths, the gate's `[[ -f "$MIRROR_SCRIPT" ]] || continue` **skips each one silently** [SOURCE: pre-commit:178].
- **Agent mirror-sync — BLOCKS.** The staged-file filter is `grep -E '^\.(opencode|claude)/agents/'` [SOURCE: pre-commit:92]; a rename matches the old side, and `check-agent-mirror-sync.cjs` then compares `.claude/agents` against a moved `.opencode/agents`. This gate has **no bypass flag** [SOURCE: .opencode/scripts/git-hooks/README.md §1].
- **Compiled-routing re-mint — BLOCKS when it cannot fix.** It reads the hub list from `compiled-route-guard.cjs` and re-mints under the compiled-routing runtime root, whose constants name `.opencode` (iteration 3, F3.2) [SOURCE: pre-commit:270,281,320,363].
- **Comment hygiene — SILENTLY DISENGAGES.** The checker path is `.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`; the block condition is "checker missing **and** `${REPO_ROOT}/.opencode/skills/sk-code` still exists" [SOURCE: pre-commit:44,49-51]. If the move deletes `.opencode/skills/sk-code`, the gate concludes the checkout "never carried this toolchain" and skips — inside the repository it was built for.
- **Hook-flags resolver — fail-open.** The shared kill-switch sources `$REPO_ROOT/.opencode/hooks/shared/hook-flags.sh`; when absent, a warning prints and "commit gates remain enabled" [SOURCE: pre-commit:17-28]. Post-move, every per-concern environment kill-switch stops working (gates stay on; the bypass surface is what breaks).

- **Classification**: blocker (mirror parity + agent mirror-sync as written) / manual (ordering)
- **Consequence for the cutover**: the migration cannot land as an ordinary commit while the installed hooks are untouched. Either the hook scripts are taught the new path (and both old and new during the window) before the commit runs, or the commit is made with the documented bypass flags and the gates are re-armed immediately after — an operator step that must be part of the cutover plan, not an accident.

### F4.3 — The hooks are installed from the main checkout through home-level symlinks; the move dangles them before any gate can run

`git config core.hooksPath` resolves to `/Users/…/.config/git/hooks`, and all seven entries there are symlinks into **the main checkout's** `.opencode/scripts/git-hooks/*` (not this worktree's) [SOURCE: `ls -la ~/.config/git/hooks/`; `git config core.hooksPath`]. The installer computes `HOOK_SOURCE_DIR="$REPO_ROOT/.opencode/scripts/git-hooks"` [SOURCE: .opencode/scripts/install-git-hooks.sh:26], and the SessionStart guard `check-git-hooks.sh` reports any hook whose resolved target mismatches the source, treating a dangling link as `(broken)` [SOURCE: .opencode/bin/check-git-hooks.sh (INVALID cases)].

- **Classification**: blocker (ordering), mechanical (fix is a reinstall)
- **Consequence for the cutover**: moving the main checkout's `.opencode` turns all seven installed hooks into dangling symlinks at once. Git resolves a hook by existence/executability (a dangling symlink fails that test, so the hook is skipped rather than fatal — inference from the guard's own broken-link design, not a probe; a one-line probe in a scratch repo would settle it). Either way, the migration's own validation gate disappears at the exact moment it is needed. The reinstall path (`install-git-hooks.sh`) is itself inside the moved directory and must be repointed first.

### F4.4 — CI: 19 workflows keyed to `.opencode/**` path filters; 12 of them skip silently when a guard script is missing

Every workflow file except `README.md` (19 total) references `.opencode`; the reference count ranges from 1 (`agent-mirror-sync.yml`, `prompt-card-sync.yml`, `rule-canary-sync.yml`) to 54 (`routing-registry-drift.yml`) and 33 (`spec-kit-check.yml`) [SOURCE: per-workflow census, 2026-09-16]. Path-filtered examples: `markdown-link-integrity.yml` triggers on `.opencode/skills/**`, `.opencode/commands/**`, `.opencode/agents/**` (plus mirror dirs) and runs a whole-repo guard "because a deleted target breaks unchanged referrers" — with a hardcoded guard path and `::warning::… skipping; exit 0` when it is missing [SOURCE: .github/workflows/markdown-link-integrity.yml:6-11,26-31]; `runtime-no-spec-import.yml` triggers on `.opencode/bin/**` [SOURCE: .github/workflows/runtime-no-spec-import.yml]; `spec-kit-check.yml` triggers on the whole mirror-source set and branches `[main, 'skilled/**']` [SOURCE: .github/workflows/spec-kit-check.yml:5-31]. Twelve of the 19 carry a "skipping"/"not found" pattern [SOURCE: per-workflow census].

- **Classification**: mechanical (filter + path updates) with a silent-failure hazard
- **Consequence for the cutover**: a rename commit still matches the old-path filters (deletions count), so the checks run *during* the move; afterwards, changes under `.skilled/**` trigger nothing unless the filters are updated in the same commit. And because a missing guard exits 0 with a warning, a half-updated filter set produces green CI with no coverage — the failure is invisible on the very commit that needs the coverage most.

### F4.5 — "skilled" is already a namespace in this repo's own grammar: release branches, allowlists, CI triggers

The pre-push naming grammar accepts `<owner>/NNNN-slug`, `skilled/vA.B.C.D` releases, and `main`; wrapper refs (`work/<runtime>/<slug>`) are always rejected [SOURCE: .opencode/scripts/git-hooks/README.md §1]. The remote-branch allowlist contains `skilled/v4.0.0.0` [SOURCE: .opencode/skills/sk-git/scripts/remote-branch-allowlist.txt]. `chart-corpus.yml`, `diagram-corpus.yml`, `spec-kit-check.yml` trigger on `skilled/**` branches; `naming-standard-guard.yml` and `routing-registry-drift.yml` trigger on `skilled/v*` [SOURCE: .github/workflows/chart-corpus.yml:2-4; naming-standard-guard.yml:4-6; routing-registry-drift.yml].

- **Classification**: manual (naming decision)
- **Consequence for the cutover**: the directory name `.skilled/` collides verbally with the existing `skilled/*` branch namespace. There is no functional conflict found, but any future naming guard or release tooling that matches the string `skilled` will now match two different concepts — worth a deliberate decision in the design rather than an accident.

### F4.6 — The ordering answer, stated as constraints (not a sequence)

1. **External before internal.** The installed hooks and the home-level registrations cannot be updated by the migration commit; they must be repointed or reinstalled around it. The reinstall tooling lives inside the moved tree.
2. **Gates that read sources must be updated before they run against moved sources.** Mirror parity, agent mirror-sync, route re-mint, and spec re-mint all re-derive from `.opencode` sources; running them on a commit that stages the new paths requires their constants updated first.
3. **CI filters must change in the same commit as the move** or coverage silently stops on the next commit; the checks that still run during the move read the old paths and fail on a moved tree.
4. **Two escape hatches exist and only two**: `SPECKIT_SKIP_MIRROR_PARITY=1` and `SPECKIT_SKIP_COMMENT_HYGIENE=1` (plus the route/spec remint bypass flags printed on block). Agent mirror-sync has none.

### F4.7 — External reference inventory: four live `.opencode`-naming references outside the repo, plus path-keyed state that survives

Live references that name `.opencode` itself (do not move, fail silently or semi-silently):

| Reference | Shape | Failure mode after a move |
|---|---|---|
| `~/.config/git/hooks/{commit-msg,pre-commit,pre-push,prepare-commit-msg,post-commit,post-merge,post-rewrite}` | 7 absolute symlinks → main checkout `.opencode/scripts/git-hooks/*` | Dangle; hooks stop running until reinstalled |
| `~/.codex/hooks.json` | installed hook copy, 18 `.opencode/...` command strings, 9 event keys | Every Codex hook command fails at exec until the installer re-runs from a repointed source |
| `~/.hermes/config.yaml` | `mcp_servers.code_mode` args `.opencode/bin/mcp-code-mode-launcher.cjs` (relative) | Code Mode MCP fails at first tool call in Hermes sessions |
| `~/.codex/config.toml` | `[projects."…/Public/.opencode"]` trust entry | Orphaned trust entry; the new path starts untrusted |

[SOURCE: `ls -la ~/.config/git/hooks/`; ~/.codex/hooks.json; ~/.hermes/config.yaml:15-17; ~/.codex/config.toml:21-22]

Path-keyed state that **survives** because it keys on the checkout root, not on `.opencode`:

- `~/.codex/config.toml` `[projects."…/Public"]` trust entry and all `[hooks.state."…/.codex/hooks.json:…"]` keys [SOURCE: ~/.codex/config.toml:15,115-417]
- `~/.hermes/config.yaml` `skills.trusted_project_dirs: […/Public]` [SOURCE: ~/.hermes/config.yaml:6-7]
- `~/.claude.json` project registry entries keyed on the repo root (the `.opencode/specs/...` strings inside are session-prompt prose, not live lookups) [SOURCE: ~/.claude.json:1304,1397]
- `~/.pi/agent/{settings.json,models.json,modes.json,statusline.sh,pi-cache-optimizer-config.json,pi-blackhole-config.json}` → symlinks to main checkout `.pi/*` — they never touch `.opencode` [SOURCE: `find ~/.pi -type l`]
- `~/.codex/AGENTS.md` → symlink to main checkout `.codex/AGENTS.md` [SOURCE: `ls -la ~/.codex/AGENTS.md`]

Clean negatives (checked, no repo reference): `~/.claude/settings.json`, `~/.config/devin/config.json`, `~/.config/devin/mcp_config.json`, `~/.claude/CLAUDE.md`, `~/.claude/plugins/*.json`. `~/.zshrc` exports `$HOME/.opencode/bin` on PATH, but `~/.opencode/` **does not exist** — a stale entry, not a live reference [SOURCE: ~/.zshrc:3,32; `ls ~/.opencode/`]. The checked-in launchd template carries absolute paths into `.opencode/scripts/` but is not installed in `~/Library/LaunchAgents` (iteration 3, F3.9).

- **Classification**: manual (external edits are operator steps) / mechanical (reinstall scripts)
- **Consequence for the cutover**: the four live references split by failure timing — the git hooks fail *before* the migration's validation runs, the Hermes/Codex MCP registrations fail *at first use afterwards*, and the trust entry fails as a permission prompt that a human will see. None of them is detectable by any in-repo check, and none moves with `git mv`.

### F4.8 — What no in-repo gate currently checks

No validator, hook, or workflow in the scanned set verifies that an external reference (home config, installed hook, out-of-repo registration) still resolves. The `check-git-hooks.sh` guard covers only the git-hook symlink class, and only when a session runs it [SOURCE: .opencode/bin/check-git-hooks.sh]. The migration's external surface therefore has no automated tripwire; the design must either add one or accept a manual post-cutover checklist.

- **Classification**: manual
- **Consequence for the cutover**: the inventory in F4.7 is the whole safety net. It should be turned into the checklist the design carries.

## Sources Consulted
- `.opencode/scripts/git-hooks/{pre-commit,pre-push,prepare-commit-msg,commit-msg,README.md}`; `.opencode/scripts/install-git-hooks.sh`; `.opencode/bin/check-git-hooks.sh`
- All 19 `.github/workflows/*.yml` (path filters, guard paths, silent-skip patterns); `markdown-link-integrity.yml`, `spec-kit-check.yml`, `naming-standard-guard.yml`, `chart-corpus.yml`, `runtime-no-spec-import.yml` read in full
- `git config core.hooksPath`; `~/.config/git/hooks/`; `~/.codex/config.toml`; `~/.codex/hooks.json`; `~/.codex/AGENTS.md`; `~/.hermes/config.yaml`; `~/.claude.json`; `~/.claude/settings.json`; `~/.config/devin/*`; `~/.pi/agent/`; `~/.zshrc`; `~/Library/LaunchAgents/`

## Assessment
- **newInfoRatio**: 0.9
- **Novelty justification**: first gate-by-gate statement of which checks block, which silently disengage, and why; the installed-hook-from-main-checkout chain; the 12-of-19 silent-skip CI census; the `skilled` namespace collision; the complete external-reference table with failure timing — all new to the packet.
- **Confidence**: High on gate bodies and config contents (read directly). Medium on git's exact behavior with a dangling hook symlink (inference from the guard's design; a scratch-repo probe would settle it). The external sweep covered the named surfaces; a full home-directory sweep for `.opencode` strings was not exhaustive (UNKNOWN: any reference under directories not named in the brief).

## Reflection
- **What worked**: reading the gate bodies instead of their names — the block-vs-skip distinction only exists in the shell conditions.
- **What failed**: `~/.hermes` full-tree grep for the repo path returned only cache/session files (large, slow); narrowed to config.yaml, which is the live surface. Recorded rather than dropped.
- **Ruled out**: `~/.opencode/` as a live reference (directory does not exist; zshrc entry is stale).

## Recommended Next Focus
Iteration 5: migration mechanics (q7) and the documentation surface (q8). Whether `git mv` preserves history at this size, what happens to existing symlinks whose targets traverse the moved directory, whether the change can land as one commit or must be staged, whether any tooling caches an absolute path that survives the move — and the markdown-surface split into load-bearing instructions versus stale prose, with counts.
