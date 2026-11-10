---
title: "Implementation Plan: Phase 10: machine-and-consumer-cutover"
description: "Relink the global git hooks through an out-of-tree bridge around the main checkout's landing, reinstall Codex hooks with their own installer, change three home configs by one line each and give consumer projects the links their contract needs. Every item backs up first and restores with one command."
trigger_phrases:
  - "skilled machine cutover plan"
  - "hook bridge landing bracket"
  - "codex hooks reinstall duplicates"
  - "consumer skilled link plan"
  - "other machine cutover checklist"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: machine-and-consumer-cutover

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and Node.js installers, git 2.50.1 hooks, TOML, YAML and JSON runtime configs |
| **Framework** | None. The tools are `install-git-hooks.sh`, `install-codex-hooks.mjs` and `git config` |
| **Storage** | Home-level files outside Git, backed up under `~/.skilled-cutover-backup/` |
| **Testing** | Scratch-repository commits traced with `GIT_TRACE2_EVENT`. Installer `--status`, `--check` and `--dry-run` modes. Diffs against backups |

### Overview

This phase changes nothing in the repository. It moves the machine's out-of-Git references from `MAIN/.opencode/` to `MAIN/.skilled/` in a fixed order: a pure-read census, backups, a bracket around the landing, then one home config at a time and the consumer links. The bracket carries the design. While the landing rewrites `MAIN`, every repository runs copies of the hooks from a bridge directory, and the real hook directory is relinked while nothing reads it.

### Shell Variables

Every command in this plan uses these names.

```bash
MAIN=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
B="$HOME/.skilled-cutover-backup/$STAMP"
HOOKS="$HOME/.config/git/hooks"
BRIDGE="$HOME/.config/git/hooks-bridge"
A="$HOME/MEGA/Development/Websites/anobel.com"
```

`PRE` is the commit `MAIN` holds just before the landing. T012 records it.

### Evidence Ledger

Every row was read on 2026-09-16 with a read-only command. Commands that touch a home file print paths, key names, line numbers and counts, never a value.

| ID | Command | Observed |
|----|---------|----------|
| E1 | `git config --show-origin --global --get core.hooksPath` | `/Users/michelkerkmeester/.config/git/hooks`, set in `~/.gitconfig` |
| E2 | `ls -la ~/.config/git/hooks/` and `readlink` per entry | Seven absolute links (`commit-msg`, `post-commit`, `post-merge`, `post-rewrite`, `pre-commit`, `pre-push`, `prepare-commit-msg`) into `MAIN/.opencode/scripts/git-hooks/`, all resolving, dated Sep 11 15:13 |
| E3 | `git rev-parse --git-path hooks` in `MAIN` and in worktree 055 | Both print `/Users/michelkerkmeester/.config/git/hooks` |
| E4 | `bash .opencode/scripts/install-git-hooks.sh --status` in `MAIN` | Scope `global`, sources in `MAIN/.opencode/scripts/git-hooks`, seven hooks installed equal to their sources, no `SHADOWED` line, exit 0 |
| E5 | `git worktree list` in `MAIN` | 29 checkouts: `MAIN` on `skilled/v4.0.0.0` at `728c4f3efc`, plus 28 linked worktrees. One sits inside `MAIN` at `.worktrees/022-012-runtime-enablement-build`, and the other 27 under `~/worktrees/public/` |
| E6 | Node census of `~/.codex/hooks.json` with the installer's identity regex (`install-codex-hooks.mjs:65-70`) | 33 entries: 18 identities under `.opencode/`, 0 under `.skilled/`, 15 with no runner match. The repository commands change directory into `MAIN` first. 15 `hooks.json.bak-*` files already sit beside the file |
| E7 | `node .opencode/bin/install-codex-hooks.mjs --check` in `MAIN` | `install-codex-hooks: OK /Users/michelkerkmeester/.codex/hooks.json`, exit 0 |
| E8 | `grep -n` for `.opencode` and `^\[projects\.` in `~/.codex/config.toml`, values masked | Line 21 is the header for `MAIN/.opencode`, line 22 its `trust_level`. `MAIN` has its own header at line 15. 26 project headers in total |
| E9 | Key-only skeleton of `~/.hermes/config.yaml` lines 1 to 30 | Line 17 is `mcp_servers.code_mode.args[0]` with the relative value `.opencode/bin/mcp-code-mode-launcher.cjs`, the file's only `.opencode` line |
| E10 | Node key-path walk of `~/.claude.json`, printing key paths and the matched path token only | One hit, at `projects["MAIN"].lastSessionFirstPrompt`, a recorded prompt string |
| E11 | `grep -n` on `~/.zshrc` with comment lines shown, `test -e ~/.opencode`, `command -v opencode` | Lines 3 and 32 add `$HOME/.opencode/bin` and `/Users/michelkerkmeester/.opencode/bin` to PATH, under the comments `# opencode CLI` (line 2) and `# opencode` (line 31). `~/.opencode` does not exist. `opencode` resolves to `~/.local/bin/opencode` |
| E12 | `grep -n '\.opencode' ~/.pi/agent/SYNC.md`, `test -e` on both paths | Lines 73 and 75. Line 75's `.opencode/skills/system-spec-kit/scripts/pi/README.md` does not exist today, and `.opencode/skills/system-spec-kit/runtime/cli/pi/README.md` does |
| E13 | Count and key check on `~/.pi/agent/trust.json` | 0 `.opencode` mentions. Its only key is `MAIN` |
| E14 | File counts in `~/.codex/prompts/`, `cmp` against `MAIN/.codex/prompts/`, `rg` for a writer in the tree | 38 regular files with two `.opencode/commands/` mentions each, newest Jul 16. 22 match the repository's prompts, 1 differs, 15 exist only at home and 10 only in the repository. Nothing in the tree writes `~/.codex/prompts` |
| E15 | `find -maxdepth 4 -type l` and `readlink` over `~/.claude`, `~/.codex`, `~/.hermes`, `~/.pi`, `~/.config`, `~/.cursor`, `~/.devin`, `~/.gemini`, `~/.local/bin`, `/opt/homebrew/bin` and `/usr/local/bin` | Only the seven hooks resolve into this checkout. Six relative links under `~/.codex/prompts.bak-pre138/` and `~/.codex/prompts.backup.20260403091105/` and one under `~/.codex/memories/spec_kit_memory/` dangle, and none names this checkout |
| E16 | `grep -c '\.opencode'` over config-shaped files at depth 2 in the runtime home directories | Beyond the items above, only records: `~/.codex/memories/` (357 lines in 3 files), `~/.codex/shell_snapshots/` (3 files), `~/.codex/process_manager/chat_processes.json`, `~/.hermes/spawn-ledger.json` and 5 files in `~/.claude/plans/`. `~/.config/opencode`, `~/.cursor`, `~/.devin` and `~/.gemini` hold none |
| E17 | `grep -l` over `~/Library/LaunchAgents/*.plist`, `crontab -l`, shell profiles | 10 plists, none names `.opencode`. Crontab 0. `~/.zshenv`, `~/.bashrc` and `~/.profile` 0 |
| E18 | `find ~/MEGA/Development ~/worktrees -maxdepth 6 -name .opencode -type l`, `git check-ignore -v .opencode` | 10 absolute links to `MAIN/.opencode`: `Obsidian Plugin`, `AI Systems`, `Mobile CLI`, `Websites/anobel.com` and 6 worktrees under `Obsidian Plugin/.worktrees/`. None is tracked, and each repository's `.gitignore` ignores it |
| E19 | `git worktree list --porcelain` in `AI Systems`, `test -L` per worktree | 31 `.opencode` links: the root plus 30 temporary worktrees under `/private/tmp/claude-501/`, 20 of them pointing at `MAIN/.opencode` and 10 at `AI Systems/.opencode` |
| E20 | `readlink` on the root files of each consumer | `Obsidian Plugin` and `Mobile CLI` link `AGENTS.md` and `CLAUDE.md` to `MAIN/AGENTS.md`. `AI Systems` links `.utcp_config.json` to `MAIN`. `anobel.com` links `AGENTS.md`, `CLAUDE.md`, `opencode.json`, `.utcp_config.json` and `.mcp.json` to `MAIN` |
| E21 | `.opencode` path tokens in consumer-owned configs, `test -e` each from its root | `AI Systems/opencode.json`: 10 paths, 2 resolve (`.opencode/scripts/git-hooks/post-commit`, `.opencode/skills`). `Mobile CLI/.mcp.json`: 5 paths, 2 resolve (`.opencode/bin/system-skill-advisor-launcher.cjs`, `.opencode/skills/mcp-code-mode/mcp-server/dist/index.js`) |
| E22 | `find ~/MEGA/Development -maxdepth 5 -path '*/.git/hooks/*' -type l`, local `core.hooksPath` per repository | `MAIN/.git/hooks/` holds 6 links into `MAIN/.opencode/scripts/git-hooks/`, shadowed by E1. `anobel.com` sets `core.hooksPath` to its own `.git/hooks`, whose 6 links point into `anobel.com/.opencode/scripts/git-hooks/`. 15 repositories sit under `~/MEGA/Development` at depth 4 or less |
| E23 | `git -C MAIN status --porcelain -- .opencode` | One entry: `.opencode/skills/system-deep-loop/runtime/database/council-graph.sqlite` modified |
| E24 | `git --version`, `codex --version`, `hermes --version`, `python3 --version` | git 2.50.1 (Apple Git-155), codex-cli 0.154.0, Hermes Agent v0.21.1, Python 3.9.6 |
| E25 | `cmp` between `MAIN` and worktree 055 | `install-git-hooks.sh`, `install-codex-hooks.mjs`, the seven hook bodies and `.codex/hooks.json` are identical in both |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 009 validates PASSED, and its rescan finds no unkept `.opencode` path in tracked files
- [ ] Phase 004's record names the `.opencode/` shape, the consumer contract and the landing step (T001)
- [ ] Phase 006's installers source `.skilled/` and handle the legacy links and Codex entries this plan describes (T001)
- [ ] The census (T003 to T007) is recorded and verified, and nothing on the machine has changed yet

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] The bridge directory is gone and `core.hooksPath` is `~/.config/git/hooks` again
- [ ] `B/manifest.tsv` lists every changed item with its restore command, and the restorability check passed
- [ ] The parent goal log names the other-machine checklist as the operator's item
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A bracketed cutover. Reads and backups come first. The landing sits inside a bracket that points `core.hooksPath` at out-of-tree copies. Everything after the landing changes one item at a time, each behind its own backup and followed by its own check.

### Key Components

- **Bridge directory** `~/.config/git/hooks-bridge/`: regular-file copies of the hook bodies the global links resolve to just before the landing. Every repository on the global path runs these copies while the landing rewrites `MAIN`.
- **Global hook directory** `~/.config/git/hooks/`: relinked while inactive, by `install-git-hooks.sh` run from `MAIN` with a command-scope `core.hooksPath` that points at it.
- **Codex hook installer** `MAIN/.skilled/bin/install-codex-hooks.mjs`: reconciles `MAIN/.codex/hooks.json` into `~/.codex/hooks.json` and writes its own `.bak-` copy (`install-codex-hooks.mjs:414-422`).
- **Backup root** `B`: copies, link manifests, checksums and one restore command per item, indexed in `B/manifest.tsv`.
- **Census files** in this phase's `scratch/`: raw rows from the orchestrator, classified rows from the delegate.

### Data Flow

```text
census (read only) -> backups -> bridge copies -> core.hooksPath to bridge
  -> landing in MAIN (phase 004's step) -> relink ~/.config/git/hooks offline
  -> check links -> core.hooksPath back -> Codex hooks -> Codex trust
  -> consumer links -> anobel.com hooks -> Hermes argument -> Pi manifest
  -> Codex prompts -> probes -> delete bridge -> residue census
```

### Why A Bridge

Relinking the seven hooks in place after the landing fails, because the landing replaces about 17,767 tracked files one at a time (`001-deep-research/research/research.md:71`). For part of that rewrite every link in `~/.config/git/hooks/` names a missing file, and every repository on the global path commits and pushes without hooks: 14 of the 15 repositories under `~/MEGA/Development` and all 29 checkouts of this one (E5, E22). Relinking before the landing fails the other way, since `MAIN/.skilled/scripts/git-hooks/` does not exist until the landing. The bridge closes both gaps with one directory of copies and two `git config --global` writes. At each write, both the old and the new directory hold seven resolving entries, so a git process that reads either value finds its hooks.

The bridge holds regular files, not links, for two reasons. A link into `MAIN` would dangle during the landing exactly like the originals. And a session starting in `MAIN` during the bracket runs `check-git-hooks.sh`, which reports a non-link as missing (`check-git-hooks.sh:96-97`) and runs the installer (`:130-133`). The installer skips every file it did not install (`install-git-hooks.sh:138-142`), so the copies survive untouched.

Copies behave like the originals. Each hook finds its root with `git rev-parse --show-toplevel` in the committing repository (`commit-msg:26`, `post-commit:12`, `post-merge:13`, `post-rewrite:14`, `pre-commit:14`, `pre-push:29`, `prepare-commit-msg:42`) and loads helpers from there. A grep for `$0`, `BASH_SOURCE` and `readlink` in the seven bodies finds no self-location.

### Timing Against The Landing

Phase 007 produces the move in the worktree. The landing is phase 004's step that first puts it into `MAIN`'s working tree. T011 and T013 run immediately before the landing, and T015 and T016 immediately after it, in one session with no other task between them. If phase 004 schedules the landing outside this phase, these four tasks travel with it and the parent goal log records the move.

| Window | Every repository's hooks come from | What happens |
|--------|-------------------------------------|--------------|
| Before T013 | `~/.config/git/hooks/` into `MAIN/.opencode/scripts/git-hooks/` | Census, backups, bridge copies |
| T013 to T016 | `~/.config/git/hooks-bridge/` copies | The landing, the offline relink, checkpoint 4 |
| After T016 | `~/.config/git/hooks/` into `MAIN/.skilled/scripts/git-hooks/` | Home configs, consumer links, probes |

Checkpoints 1 to 5 run this function on the directory `core.hooksPath` names, or is about to name. A pass prints no `FAIL` line and `entries=7`, or the count T015's installer reports.

```bash
checkpoint() {
  n=0
  for h in "$1"/*; do
    n=$((n+1))
    [ -e "$h" ] && [ -x "$h" ] || echo "FAIL $h"
  done
  echo "entries=$n at $(date -u +%H:%M:%SZ)"
}
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Every item this phase changes, or proves unchanged, with the evidence behind its current state. Items change in the Data Flow order.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| H1 `~/.config/git/hooks/` and `core.hooksPath` | Hooks for every repository without its own `core.hooksPath` (E1 to E4, E22) | Bridge, relink, flip back | V1, V2, V3 |
| C1 `~/.codex/hooks.json` | 18 repository entries among 33 (E6, E7) | Reinstall with the installer | V5 |
| C2 `~/.codex/config.toml:21` | Trust entry keyed to `MAIN/.opencode` (E8) | Header names `.skilled` | V6 |
| K consumer roots and worktrees | 10 links, 4 live consumer-owned paths (E18 to E21) | Keep `.opencode`, add `.skilled` where the contract needs it | V4 |
| A1 `anobel.com/.git/hooks/` | Local hooks chained through its `.opencode` link (E22) | Reinstall only if broken | V4 |
| R1 `~/.hermes/config.yaml:17` | Relative launcher argument (E9) | Follows the consumer contract | V7 |
| P1 `~/.pi/agent/SYNC.md:73,75` | Prose paths, one already stale (E12) | Rewrite both lines | V8 |
| C3 `~/.codex/prompts/` | 38 stubs with no writer in the tree (E14) | Decided by T008 | V9 |
| N1 `~/.pi/agent/trust.json`, `~/.zshrc` | Keyed to `MAIN`, or PATH lines for `~/.opencode/bin` (E11, E13) | None | V10 checksums |
| N2 `~/.claude.json`, history records, `MAIN/.git/hooks/` | Records, or links shadowed by E1 (E10, E16, E22) | None | V10 residue census |

Required inventories:
- **Same-class producers.** The evidence ledger rows E6 to E22 are the inventory of home-level places that name an `.opencode` path. T003 reruns them before any change, and T030 reruns them after.
- **Consumers of the changed paths.** Every repository on the global hooks (E5, E22), every Codex, Hermes and Pi session (E6, E9, E12) and every consumer project (E18 to E21).
- **Matrix axes.** Phase 004's shape (whole-directory link, link farm or entry points only) crossed with each item. The consumer section holds the rows that differ.
- **Invariant.** The directory `core.hooksPath` names always holds entries that pass `test -e`. Adversarial cases: a relink from a worktree, a session self-heal during the bracket, an installer that skips legacy links and a Codex reinstall that keeps legacy entries.

### H1. Global Git Hooks

**Current state.** `core.hooksPath` is `~/.config/git/hooks`, set in `~/.gitconfig` (E1). It holds seven absolute links into `MAIN/.opencode/scripts/git-hooks/`, all resolving (E2, E4). A linked worktree resolves the same directory (E3), and `install-git-hooks.sh` takes its sources from whichever checkout runs it (`install-git-hooks.sh:24`, `:30-31`). A run from worktree 055 would therefore bind every repository on the machine to that branch, and the links would dangle once the worktree is removed.

**Change.** In this order, with `checkpoint` from section 3:

```bash
checkpoint "$HOOKS"                                   # checkpoint 1
mkdir -m 755 "$BRIDGE"
for l in "$HOOKS"/*; do cp -p "$(readlink "$l")" "$BRIDGE/$(basename "$l")"; done
for l in "$HOOKS"/*; do cmp "$(readlink "$l")" "$BRIDGE/$(basename "$l")"; done
git config --global core.hooksPath "$BRIDGE"          # T013
checkpoint "$BRIDGE"                                  # checkpoint 2
# T014: the landing, exactly as phase 004 writes it
checkpoint "$BRIDGE"                                  # checkpoint 3
[ "$(git -C "$MAIN" rev-parse --absolute-git-dir)" = "$MAIN/.git" ] && echo "main checkout confirmed"
mkdir "$B/replaced-links" && mv "$HOOKS"/* "$B/replaced-links/"
( cd "$MAIN" && GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.hooksPath GIT_CONFIG_VALUE_0="$HOOKS" \
  bash .skilled/scripts/install-git-hooks.sh )
checkpoint "$HOOKS"                                   # checkpoint 4
git config --global core.hooksPath "$HOOKS"           # T016
checkpoint "$HOOKS"                                   # checkpoint 5
```

Stop before moving any link unless the check prints `main checkout confirmed`. The installer takes its sources from the checkout it runs in (`install-git-hooks.sh:24`, `:30`), which is why the subshell changes into `MAIN` first. It picks its target with `git rev-parse --git-path hooks` (`install-git-hooks.sh:31`), so the command-scope `GIT_CONFIG_COUNT` value sends it into `$HOOKS` while every other process still reads the bridge. Its output must hold one `installed:` line per hook, each naming `$HOOKS/<hook>` and a source under `$MAIN/.skilled/scripts/git-hooks/`. That output is the proof the override took effect. Moving the old links aside first matters: the installer treats a link as its own only when the link's text starts with its current source directory (`install-git-hooks.sh:58-67`), so it would skip every legacy `.opencode` link with a warning (`:138-142`).

**Timing.** T011 and T013 immediately before the landing. T015 and T016 immediately after it. Checkpoint timestamps go into the goal log, which is what NFR-P01 measures.

**Rollback.** T010 backs up first:

```bash
cp -a "$HOOKS" "$B/git-hooks"
for l in "$HOOKS"/*; do printf '%s\t%s\n' "$(basename "$l")" "$(readlink "$l")"; done > "$B/git-hooks-links.tsv"
git config --global --get core.hooksPath > "$B/core-hooks-path.txt"
cp -p ~/.gitconfig "$B/gitconfig"
```

Restore by stage:
- Bridge active, landing not started: `git config --global core.hooksPath "$(cat "$B/core-hooks-path.txt")" && rm -r "$BRIDGE"`.
- Landing done, relink broken: keep the bridge active, repair the relink and rerun checkpoint 4.
- `MAIN` returned to the pre-landing tree, with the bridge active: `rm -f "$HOOKS"/* && cp -a "$B/git-hooks/." "$HOOKS/"`, then checkpoint `$HOOKS`, then `git config --global core.hooksPath "$HOOKS"` and `rm -r "$BRIDGE"`.

Never point `core.hooksPath` at a directory whose entries fail `test -e`. If the bridge is already deleted when `MAIN` must go back, rebuild it from the current hook bodies before phase 004's rollback runs.

**Verification.** V1 after T016:

```bash
for l in "$HOOKS"/*; do
  t="$(readlink "$l")"
  [ -e "$l" ] && [ "$t" = "$MAIN/.skilled/scripts/git-hooks/$(basename "$l")" ] || echo "FAIL $l -> $t"
done
git config --global --get core.hooksPath
( cd "$MAIN" && bash .skilled/scripts/install-git-hooks.sh --status | grep -c SHADOWED )
```

Pass: no `FAIL` line, the second command prints `/Users/michelkerkmeester/.config/git/hooks` and the count is 0. The exact-target test also rules out a worktree target, because `MAIN/.skilled/scripts/git-hooks/` lies inside no linked worktree: the only one under `MAIN` is `MAIN/.worktrees/022-012-runtime-enablement-build` (E5). V2 and V3 in section 5 prove the hooks run.

### C1. Codex User Hooks

**Current state.** `~/.codex/hooks.json` holds 33 entries: 18 repository identities under `.opencode/` and 15 third-party entries (E6). It matches `MAIN/.codex/hooks.json` today (E7). The installer owns an entry by its adapter path, and it prunes an old `.opencode/` identity only when that path is missing on disk (`install-codex-hooks.mjs:102-109`, `.codex/SYNC.md:117`). Under a shape that keeps `.opencode/` resolvable, a plain reinstall would keep the 18 old entries beside the 18 new ones, and every Codex hook would run twice.

**Change.** After T016, and after phase 008 has regenerated `MAIN/.codex/hooks.json` with `.skilled/` adapters:

```bash
cd "$MAIN"
cp -p ~/.codex/hooks.json "$B/codex-hooks.json"
node .skilled/bin/install-codex-hooks.mjs --dry-run > "$B/codex-hooks-dry-run.json"
node -e 'const r=require(process.argv[1]); console.log("added",r.added.length,"removed",r.removed.length,"orphaned",r.orphaned.length,"kept",r.kept.length)' "$B/codex-hooks-dry-run.json"
node .skilled/bin/install-codex-hooks.mjs
node .skilled/bin/install-codex-hooks.mjs --check
```

Install only when the dry-run prints added 18, removed plus orphaned 18 and kept 15. Kept at 33 is the duplicate case: stop and route it back to phase 006, and never hand-edit the file. A run that prints nothing is a failure too, since `SYSTEM_HOOKS_DISABLED` or `MK_HOOKS_DISABLED` makes the installer return silently (`install-codex-hooks.mjs:365`, `hook-flags.cjs:25-28`).

**Timing.** The first home config after T016. Between the landing and this task, a Codex hook whose adapter no longer resolves prints the installer's fallback message instead of failing the session (`.codex/SYNC.md:94`).

**Rollback.** `cp -p "$B/codex-hooks.json" ~/.codex/hooks.json`, then `shasum -a 256` must equal the manifest row. The installer's own `~/.codex/hooks.json.bak-<timestamp>` copy is a second fallback.

**Verification.** V5: `--check` prints `install-codex-hooks: OK /Users/michelkerkmeester/.codex/hooks.json` with exit 0, and the E6 census rerun prints 33 entries, 0 under `.opencode/`, 18 under `.skilled/` and 15 with no runner match.

### C2. Codex Trust Entry

**Current state.** `~/.codex/config.toml:21` is the header `[projects."/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode"]`, and line 22 holds its `trust_level`. `MAIN` has its own header at line 15 (E8). Whether any Codex session consults the `.opencode` entry is UNKNOWN.

**Change.**

```bash
F="$HOME/.codex/config.toml"
OLD='[projects."/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode"]'
NEW='[projects."/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled"]'
cp -p "$F" "$B/codex-config.toml"
grep -cxF "$NEW" "$F"
awk -v o="$OLD" -v n="$NEW" '$0==o{$0=n}1' "$B/codex-config.toml" > "$F"
diff "$B/codex-config.toml" "$F"
```

The `grep` must print 0 before the `awk` runs. A 1 means Codex already added a `.skilled` table, and a rename would duplicate it and stop Codex from parsing the file, so remove the `.opencode` header and its `trust_level` line instead. Writing through `>` keeps the file's inode and mode.

**Timing.** After C1.

**Rollback.** When `diff` shows line 21 as the only difference, `cat "$B/codex-config.toml" > "$F"`. When Codex has changed other lines since, reverse the one line with the same `awk` and `OLD` and `NEW` swapped.

**Verification.** V6: `diff` shows one changed line, `grep -cxF "$NEW" "$F"` prints 1, `grep -cF 'Public/.opencode"]' "$F"` prints 0 and `grep -c '^\[projects\.' "$F"` still prints 26. Python 3.9.6 has no `tomllib` (E24), so a parse proof waits for a Codex session start in phase 011.

### R1. Hermes Launcher Argument

**Current state.** `mcp_servers.code_mode.args[0]` at `~/.hermes/config.yaml:17` is the relative `.opencode/bin/mcp-code-mode-launcher.cjs` (E9), the value `.hermes/SYNC.md:42` tells the operator to register. A relative argument follows the directory Hermes starts in, so the entry serves every project Hermes runs in, not only `MAIN`. The launcher itself builds its server path from literal `.opencode` segments (`mcp-code-mode-launcher.cjs:19-26`), which phase 006 owns.

**Change.** Decided by the consumer contract, per goal decision D4:
- Consumers on this machine get a `.skilled` link (T019): rewrite line 17 to `.skilled/bin/mcp-code-mode-launcher.cjs`.
- Consumers keep only `.opencode`: keep line 17 and record it in `B/manifest.tsv` as kept by design.

```bash
F="$HOME/.hermes/config.yaml"
cp -p "$F" "$B/hermes-config.yaml"
awk '/^ *- \.opencode\/bin\/mcp-code-mode-launcher\.cjs$/ {sub(/\.opencode\//, ".skilled/")} 1' "$B/hermes-config.yaml" > "$F"
diff "$B/hermes-config.yaml" "$F"
```

**Timing.** After T019 and T020, so no project runs Hermes against a `.skilled/` path it does not have. Run no `hermes config` command before the backup exists, because whether Hermes rewrites the file on load is UNKNOWN.

**Rollback.** When `diff` shows line 17 as the only difference, `cat "$B/hermes-config.yaml" > "$F"`. Otherwise reverse the one line.

**Verification.** V7: `diff` shows line 17 only, or nothing beside a keep row in the manifest. `test -f "$MAIN/.skilled/bin/mcp-code-mode-launcher.cjs"` passes. Phase 011's live load test proves Hermes still starts `code_mode`.

### P1. Pi Agent Manifest

**Current state.** `~/.pi/agent/SYNC.md` is a regular file (`map-b-home.tsv:17`). Line 73 says `.pi/` derives from `.opencode/`. Line 75 names `.opencode/skills/system-spec-kit/scripts/pi/README.md`, which does not exist even today, while the generator README lives at `runtime/cli/pi/README.md` (E12, `.pi/SYNC.md:122`).

**Change.** Line 73: `.opencode/` becomes `.skilled/`. Line 75: the path becomes `.skilled/skills/system-spec-kit/runtime/cli/pi/README.md`, the path that resolves after the landing. The stale segment sits inside the token being rewritten, so correcting it is part of the same edit. The patterns match text, not line numbers, in case the file moved since the census.

```bash
F="$HOME/.pi/agent/SYNC.md"
cp -p "$F" "$B/pi-sync.md"
awk '{sub(/derives from `\.opencode\/`/, "derives from `.skilled/`")
      sub(/\.opencode\/skills\/system-spec-kit\/scripts\/pi\/README\.md/, ".skilled/skills/system-spec-kit/runtime/cli/pi/README.md")} 1' "$B/pi-sync.md" > "$F"
diff "$B/pi-sync.md" "$F"
```

**Timing.** After R1.

**Rollback.** Backup `cp -p ~/.pi/agent/SYNC.md "$B/pi-sync.md"`, restore `cp -p "$B/pi-sync.md" ~/.pi/agent/SYNC.md`.

**Verification.** V8: `grep -c '\.opencode' ~/.pi/agent/SYNC.md` prints 0, `test -f "$MAIN/.skilled/skills/system-spec-kit/runtime/cli/pi/README.md"` passes and `diff` shows lines 73 and 75 only.

### C3. Codex Prompt Directory

**Current state.** 38 stubs, each naming its command file twice under `.opencode/commands/` and last written Jul 16. Nothing in the tree writes them (E14). The set has drifted from the repository's generated prompts, with 15 stubs that exist only at home.

**Change.** T008 settles whether Codex 0.154.0 loads `~/.codex/prompts/`.
- Not loaded: no change. The directory joins the records in N2.
- Loaded: rewrite `.opencode/commands/` to `.skilled/commands/` in each stub whose target exists under `MAIN/.skilled/commands/`, 23 by the E14 comparison. Leave the others untouched and report them, since replacing the set with the repository's prompts would change which commands Codex offers.

```bash
cp -a ~/.codex/prompts "$B/codex-prompts"
for f in ~/.codex/prompts/*.md; do
  t="$(grep -o '\.opencode/commands/[A-Za-z0-9_./-]*\.md' "$f" | head -1)"
  [ -n "$t" ] && [ -f "$MAIN/.skilled/${t#.opencode/}" ] && sed -i '' 's#\.opencode/commands/#.skilled/commands/#g' "$f"
done
diff -r "$B/codex-prompts" ~/.codex/prompts
```

**Timing.** After P1.

**Rollback.** Backup `cp -a ~/.codex/prompts "$B/codex-prompts"`. Restore `rm -r ~/.codex/prompts && cp -a "$B/codex-prompts" ~/.codex/prompts`, after `diff -r` shows only the planned lines.

**Verification.** V9: the stubs still naming `.opencode/commands/` are exactly those whose target does not exist, `grep -l '\.opencode/commands/' ~/.codex/prompts/*.md | wc -l` prints 38 when not loaded and every `.skilled/commands/` path in the stubs passes `test -f`.

### N. Items Proven Unchanged

- `~/.pi/agent/trust.json` is keyed to `MAIN` and names no `.opencode` path (E13, `map-b-home.tsv:30`). T009 records its checksum, and T030 compares.
- `~/.zshrc` lines 3 and 32 add `~/.opencode/bin` to PATH under `# opencode CLI` comments. That directory does not exist, and `opencode` runs from `~/.local/bin` (E11). The move does not touch these lines. They are stale PATH entries to report, not to fix here.
- `~/.claude.json` holds one hit, a recorded first prompt (E10). Claude rewrites that file constantly, so T030 reruns the key-path walk instead of comparing checksums.
- History records stay as written: `~/.codex/memories/`, `~/.codex/shell_snapshots/`, `~/.codex/process_manager/chat_processes.json`, `~/.hermes/spawn-ledger.json`, `~/.claude/plans/`, `~/.pi/agent/pi-crash.log`, `~/.codex/prompts.bak-pre138/` and `~/.codex/prompts.backup.20260403091105/` (E15, E16, `map-b-home.tsv:25`).
- `MAIN/.git/hooks/` holds six links that git ignores while `core.hooksPath` is set (E22). They matter only on a machine without the global value, and the checklist covers that case.

This evidence moves three map B rows. `~/.claude.json` and `~/.zshrc` are `none`, not `manual` (`map-b-home.tsv:7`, `:9`), and the Hermes launcher path is relative, not a main-checkout path (`map-b-home.tsv:5`). Map B also lacks `~/.codex/prompts/`, `MAIN/.git/hooks/` and the consumer surfaces, which this plan adds.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:consumer-projects -->
## CONSUMER PROJECTS

### Current State

- 4 consumer roots link `.opencode` to `MAIN/.opencode`: `Obsidian Plugin`, `AI Systems`, `Mobile CLI` and `Websites/anobel.com`. The 6 worktrees of `Obsidian Plugin` carry the same link. None is tracked and every repository ignores it (E18), the shape `PUBLIC-RELEASE.md:22` documents.
- Consumers also link root files from `MAIN` (E20). Those files carry whatever phase 009 writes in `MAIN`, and today they name `.opencode/` (`opencode.json:15`, `.mcp.json:6`, `.utcp_config.json:147`).
- Consumer-owned configs name 15 `.opencode` paths, and 4 of them resolve today (E21).
- `anobel.com` sets its own `core.hooksPath`, and its 6 hook links chain through its `.opencode` link into `MAIN` (E22). The bridge does not cover it.

### How They Keep Working

Phase 004 decides the shape, and parent decision D5 keeps `.opencode/` resolvable for consumers (`../goal.md:50`). This table says what this phase does under each shape phase 004 can choose.

| Phase 004 shape | Consumer `.opencode` links | Consumer `.skilled` links | 4 live consumer-owned paths | `anobel.com` hooks |
|-----------------|----------------------------|---------------------------|----------------------------|--------------------|
| `.opencode` resolves every path consumers use, as a whole-directory link or a farm covering `skills`, `commands`, `agents`, `scripts`, `bin`, `hooks` and `install-guides` | Keep, no change | Add, when any root file consumers link from `MAIN` names `.skilled/` after phase 009 | Keep resolving, V4 proves it | Keep resolving, V4 proves it |
| `.opencode` keeps only the opencode runtime's entry points | Some consumer paths stop resolving | Required | Up to 4 break, in files this phase may not edit | Reinstall needed |

The second row breaks consumer-owned files, which contradicts D5. If phase 004 chooses it, T001 halts this phase and raises a LOGIC-SYNC with the parent.

### Change

When the contract needs `.skilled`, T019 runs this for each row that `scratch/consumer-links-classified.tsv` marks `add`:

```bash
while IFS=$'\t' read -r R action; do
  [ "$action" = add ] || continue
  if [ -e "$R/.skilled" ] || [ -L "$R/.skilled" ]; then echo "SKIP $R"; continue; fi
  C="$(git -C "$R" rev-parse --path-format=absolute --git-common-dir)"
  X="$C/info/exclude"
  S="exclude-$(basename "$(dirname "$C")" | tr ' A-Z.' '-a-z-')"
  if [ ! -e "$B/$S" ] && [ ! -e "$B/$S.absent" ]; then
    if [ -f "$X" ]; then cp -p "$X" "$B/$S"; else : > "$B/$S.absent"; fi
  fi
  ln -s "$MAIN/.skilled" "$R/.skilled"
  grep -qx '.skilled' "$X" 2>/dev/null || printf '.skilled\n' >> "$X"
  printf '%s\t%s\n' "$R/.skilled" "$MAIN/.skilled" >> "$B/consumer-links-created.tsv"
done < <(cut -f1,2 scratch/consumer-links-classified.tsv)
```

The link is absolute, like the existing `.opencode` links. The exclude line lives in the repository's common Git directory, so one line and one backup cover every worktree of that repository, named after it in kebab-case (`exclude-obsidian-plugin`, `exclude-anobel-com`). No tracked file changes.

The 30 temporary `AI Systems` worktrees under `/private/tmp/claude-501/` are skipped (E19). They are session scratch, 10 of them reach `MAIN` only through `AI Systems/.opencode` and their sessions recreate them.

T020 checks `anobel.com` after the landing with `for l in "$A/.git/hooks"/*; do [ -e "$l" ] || echo "BROKEN $l"; done`. No output means no change. Any output means `cp -a "$A/.git/hooks" "$B/anobel-git-hooks"`, then moving the broken links aside and running `bash .skilled/scripts/install-git-hooks.sh` from `$A`, which installs into `$A/.git/hooks` because that is its `core.hooksPath`.

### Rollback

For each row of `B/consumer-links-created.tsv`, `[ -L "$link" ] && [ "$(readlink "$link")" = "$target" ] && rm "$link"`. Then copy each `B/exclude-*` file back over its repository's `info/exclude`, or delete that file where an `.absent` marker was recorded. For `anobel.com`, `rm -f "$A/.git/hooks/"* && cp -a "$B/anobel-git-hooks/." "$A/.git/hooks/"`.

### Verification

V4:
- Every consumer `.opencode` link, and every link in `B/consumer-links-created.tsv`, passes `test -f "$link/skills/system-spec-kit/SKILL.md"`, the root sentinel (`repo-root.mjs:27`).
- Every root file from E20 passes `test -e` from its consumer root.
- The 4 consumer-owned paths from E21 still pass `test -e`.
- `git -C "$R" status --porcelain -- .skilled` prints nothing for each consumer root.
- A consumer-shaped scratch repository, holding `.opencode` and, when the contract adds it, `.skilled` links to `MAIN`, commits with V2's pattern and traces `pre-commit`.
<!-- /ANCHOR:consumer-projects -->

---

<!-- ANCHOR:other-machines -->
## OTHER MACHINES

This phase cannot reach another machine, and which machines hold a checkout or a consumer project is UNKNOWN (`001-deep-research/research/research.md:167`). The operator runs this checklist on each one after the migration is pushed. Steps 1 to 4 only read.

1. Find the primary checkout: run `git worktree list` in any clone and take the first path as `MAIN`. Never use a linked worktree.
2. Read the hook setup: `git config --global --get core.hooksPath`, then `readlink` on every entry of that directory. Without a global value, read `MAIN/.git/hooks/` instead, since those links are live there.
3. Read the home configs, printing file names and counts only: `grep -c '\.opencode'` on `~/.codex/hooks.json`, `~/.codex/config.toml`, `~/.hermes/config.yaml`, `~/.pi/agent/SYNC.md`, `~/.claude.json` and each shell profile, plus `ls ~/.codex/prompts | wc -l`, `crontab -l` and `~/Library/LaunchAgents`.
4. Find consumer projects with `find ~ -maxdepth 5 -name .opencode -type l`, and read each repository's local `core.hooksPath`.
5. Back up everything steps 2 to 4 found into `~/.skilled-cutover-backup/$STAMP/`, mode 700, with a manifest of paths, checksums and link targets.
6. Hooks: copy the resolved hook bodies into a bridge directory and point `core.hooksPath` at it, run `git -C "$MAIN" pull --ff-only`, relink the real directory from `MAIN` as item H1 shows, check every link, point `core.hooksPath` back and delete the bridge. On a machine without a global value, the installer targets `MAIN/.git/hooks/` by itself and no bridge is needed.
7. Codex hooks: from `MAIN`, `node .skilled/bin/install-codex-hooks.mjs --dry-run`, proceed only when kept equals that machine's third-party entry count, then install and require `--check` to print OK.
8. Codex trust, Hermes launcher and Pi manifest: apply items C2, R1 and P1 to the lines step 3 found, one file at a time, each diffed against its backup.
9. Consumers: apply the published consumer contract as the consumer section shows, including repositories with their own `core.hooksPath`.
10. Prove it with a scratch-repository commit that a non-conforming subject blocks, `--check` printing OK and `test -f` on the root sentinel through every consumer link. Record the machine and its results in the parent goal log.

A machine that cannot hold a bridge directory needs every git client stopped before step 6. Its commits during the landing then skip or fail their hooks, which phase 003's probe decides.
<!-- /ANCHOR:other-machines -->

---

<!-- ANCHOR:delegation -->
## DELEGATION

Parent decision D3 governs this section (`../goal.md:48`).

### The Orchestrator Makes Every Change

Backups, the bridge, the landing bracket, each home config, the Codex installer, consumer links, probes and any rollback run in the orchestrator's own session. Each item goes through backup, change and check before the next item starts. These steps reach every repository on the machine, and a delegate cannot edit `~/.claude.json` or `~/.codex/config.toml` without reading what they hold.

### DeepSeek Classifies Census Rows

DeepSeek V4.1 Flash, thinking max, on cli-pi through the LLM Gateway, the model and route phase 002 used (`002-per-runtime-reference-map/research/research.md:138`). Three units, each one short literal brief:

| Unit | Task | Reads | Writes | Returns |
|------|------|-------|--------|---------|
| `home-census-classify` | T004 | `scratch/home-census-raw.tsv`, `../002-per-runtime-reference-map/research/maps/map-b-home.tsv` | `scratch/home-census-classified.tsv` | Columns `path`, `class`, `map-b-row`, `reason`. Class is `config`, `record`, `backup`, `link` or `none`, and `map-b-row` is a line number or `missing` |
| `consumer-census-classify` | T006 | `scratch/consumer-links-raw.tsv`, the consumer contract section of phase 004's record | `scratch/consumer-links-classified.tsv` | Columns `root`, `action`, `contract-line`, `reason`. `root` is the directory holding the `.opencode` link, and action is `keep`, `add` or `skip` |
| `residue-census-classify` | T031 | `scratch/residue-census-raw.tsv`, `scratch/home-census-classified.tsv` | `scratch/residue-census-classified.tsv` | Columns `path`, `class`, `reason`. Class is `kept-by-design`, `record`, `backup` or `must-fix` |

### What Never Reaches The Delegate

The raw census holds paths, key names, line numbers, link targets and counts, never a value, because the orchestrator builds it with the evidence ledger's commands. No brief names or attaches a home file, a backup, `~/.hermes/.env` or `~/.pi/agent/auth.json`.

### Dispatch Rules

Read `cli-external-orchestration/cli-pi/SKILL.md` under the skills root before composing a brief. It requires a provider-qualified `--model` (`cli-pi/SKILL.md:21`), stdin closed with `</dev/null` (`:9`, `:189`) and `AI_SESSION_CHILD=1` with the exemption stated in the prompt (`:217`). Each brief binds write authority to its one output file, says no question needs asking and asks for kebab-case values.

### Checking Each Return

- The output's row count equals the input's.
- The orchestrator opens every row whose class drives an action, not a sample.
- `git status --porcelain` in the worktree shows only the one output file as new.
- A failed return is re-dispatched once with the failure named. If it fails again, the orchestrator classifies the rows and records the failure in the goal log.

### Why Delegate Rows This Small

Map B's home rows came from one lane (`class_basis` is `swe2 only` on every row of `map-b-home.tsv`), and that lane missed `~/.codex/prompts/`, `MAIN/.git/hooks/` and the consumer surfaces (E14, E18, E22). A second model family classifying the orchestrator's rows is a second lens at low cost. If a unit costs more than it catches, the orchestrator classifies directly and says so in the log.
<!-- /ANCHOR:delegation -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the ordered tasks and their state.

| Stage | Tasks | State it changes |
|-------|-------|------------------|
| Census and readiness | T001 to T009 | None |
| Backups and bridge | T010 to T012 | Backup root and bridge copies only |
| Landing bracket | T013 to T016 | `core.hooksPath` twice, `~/.config/git/hooks/` and `MAIN` through phase 004's landing |
| Home configs and consumers | T017 to T023 | One file or one link set per task |
| Verification and handoff | T024 to T035 | Temporary probe repositories that are deleted afterwards, plus the logs |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Resolution (V1) | Hook directories at checkpoints 1 to 5, final links, no worktree target | `checkpoint`, `readlink`, `install-git-hooks.sh --status` |
| Scratch repository (V2) | All seven hooks run from the relinked directory | `git` with `GIT_TRACE2_EVENT`, a local bare remote |
| Pre-migration clone (V3) | Hooks run in a checkout holding only `.opencode/` | `git clone --shared` of `MAIN` checked out at `PRE` |
| Consumers (V4) | Links, linked root files, consumer-owned paths, a consumer-shaped repository | `test -f`, `test -e`, `git status`, V2's pattern |
| Codex hooks (V5) | 18 replaced, 15 kept, no duplicates | `install-codex-hooks.mjs --dry-run` and `--check`, E6 census |
| Config diffs (V6 to V9) | Only the planned lines changed | `diff` against the copies in `B`, `grep -c`, `test -f` |
| Residue and checksums (V10) | Nothing unclassified, unchanged items unchanged | Evidence ledger rerun, `shasum -a 256` |

### V2 In Full

```bash
P="$(mktemp -d "${TMPDIR:-/tmp}/skilled-hook-probe-XXXXXX")"
unset SPECKIT_AUTOSYNC SPECKIT_LIVE_BRANCH
git init -q -b main "$P/repo" && git init -q --bare "$P/remote.git" && cd "$P/repo"
git commit --allow-empty -m "probe"; echo "exit=$?"
export GIT_TRACE2_EVENT="$P/trace2.json"
git commit --allow-empty -m "chore(probe): verify relinked hooks"
git commit --amend --allow-empty -m "chore(probe): exercise the post-rewrite hook"
git checkout -q -b side && git commit --allow-empty -m "chore(probe): add a side commit" && git checkout -q main
git merge --no-ff -m "Merge branch side" side
git push -q "$P/remote.git" main
unset GIT_TRACE2_EVENT
grep -c "$HOOKS/pre-commit" "$P/trace2.json"
grep -o '"hook_name":"[a-z-]*"' "$P/trace2.json" | sort | uniq -c
cd / && rm -r "$P"
```

Pass: the first commit prints `BLOCKED: commit message validation failed` and `exit=1` (`commit-msg:106-107`, `:247-262`), and every later command exits 0. `pre-push` also prints its missing `worktree-naming.sh` notice, because the scratch repository has no `.opencode/` (`pre-push:50-54`). Read the `pre-commit` count first: it tests the trace pattern on a hook known to have run, and only a non-zero count makes an absent `hook_name` meaningful. The `uniq -c` list must name all seven hooks.

### V3 In Full

```bash
O="$(mktemp -d "${TMPDIR:-/tmp}/skilled-old-layout-XXXXXX")"
git clone -q --shared --no-checkout "$MAIN" "$O/clone" && git -C "$O/clone" checkout -q --detach "$PRE"
( cd "$O/clone" && unset SPECKIT_AUTOSYNC SPECKIT_LIVE_BRANCH \
  && SPECKIT_SKIP_PREPARE_COMMIT_MSG=1 GIT_TRACE2_EVENT="$O/trace2.json" \
     git commit --allow-empty -m "chore(probe): verify hooks in the old layout" )
grep -o '"hook_name":"[a-z-]*"' "$O/trace2.json" | sort | uniq -c
rm -r "$O"
```

Pass: the commit exits 0 and the trace names `pre-commit`, `prepare-commit-msg`, `commit-msg` and `post-commit`. The clone keeps the probe away from `MAIN`'s own Git directory, and `SPECKIT_SKIP_PREPARE_COMMIT_MSG=1` stops the hook before it allocates a Commit-Id (`prepare-commit-msg:28-29`), so no shared counter moves.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 dangling-hook probe | Internal | Yellow, planned | The bridge makes this phase independent of it. Only the other-machine fallback needs the answer |
| Phase 004 shape, consumer contract and landing step | Internal | Red, not yet decided | T001 halts: no consumer plan, no Hermes decision, no landing to bracket |
| Phase 005 hook bodies for either root | Internal | Red, not yet built | Relinked hooks could skip gates in old-layout checkouts. V3 catches it |
| Phase 006 installers | Internal | Red, not yet built | The relink or the Codex reinstall fails closed at T015 or T017 |
| Phase 008 regenerated `.codex/hooks.json` | Internal | Red, not yet run | The Codex reinstall would install `.opencode/` adapters again |
| cli-pi with DeepSeek V4.1 Flash through the LLM Gateway | External | Yellow, used in phase 002 | The orchestrator classifies the rows and records the fallback |
| git 2.50.1, codex-cli 0.154.0, Hermes v0.21.1 | External | Green (E24) | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A check in T024 to T033 still fails after three repairs (parent D2), a probe voids the design or phase 004's rollback returns `MAIN` to the pre-landing tree.
- **Procedure**: Restore each item from `B` in reverse order of change, and check each restore before starting the next.

| Item | Restore command | Check |
|------|-----------------|-------|
| Codex prompts | `rm -r ~/.codex/prompts && cp -a "$B/codex-prompts" ~/.codex/prompts` | `diff -r "$B/codex-prompts" ~/.codex/prompts` prints nothing |
| Pi manifest | `cp -p "$B/pi-sync.md" ~/.pi/agent/SYNC.md` | `shasum -a 256` equals the manifest |
| Hermes config | `cat "$B/hermes-config.yaml" > ~/.hermes/config.yaml`, once `diff` shows only line 17 | `diff` prints nothing |
| `anobel.com` hooks | `rm -f "$A/.git/hooks/"* && cp -a "$B/anobel-git-hooks/." "$A/.git/hooks/"` | `readlink` matches the manifest |
| Consumer links | Remove each link in `B/consumer-links-created.tsv` whose `readlink` still matches, then restore each `B/exclude-*` | `test -L` fails for each removed link |
| Codex trust | `cat "$B/codex-config.toml" > ~/.codex/config.toml`, once `diff` shows only line 21 | `diff` prints nothing |
| Codex hooks | `cp -p "$B/codex-hooks.json" ~/.codex/hooks.json` | `shasum -a 256` equals the manifest |
| Global hooks | The stage rules in item H1 | Checkpoint on the directory `core.hooksPath` names |

One rule outranks the order: `core.hooksPath` never names a directory whose entries fail `test -e`. Restoring the original links before `MAIN` is back on `.opencode` would break it, so the bridge stays active until the tree is restored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Census and readiness -> Backups and bridge -> Landing bracket -> Home configs and consumers -> Verification and handoff
        ^                                          ^
phases 004 to 009 validated               phase 004's landing step
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Census and readiness | Phases 004 to 009 validated | Backups and bridge |
| Backups and bridge | Census and readiness | Landing bracket |
| Landing bracket | Backups and bridge, phase 004's landing step | Home configs and consumers |
| Home configs and consumers | Landing bracket | Verification and handoff |
| Verification and handoff | Home configs and consumers | Phase 011 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

These are estimates from the task list, not measurements.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Census and readiness | Medium | 1 to 2 hours, mostly reading the phase 004 to 008 records |
| Backups, bridge and bracket | High | 1 hour. The bridge is active only for the landing and the relink |
| Home configs and consumers | Medium | 1 to 2 hours |
| Verification and handoff | Medium | 1 to 2 hours |
| **Total** | | **4 to 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `B` exists with mode 700, and `B/manifest.tsv` has a complete row for every item
- [ ] `B/git-hooks-links.tsv` holds seven rows, and `B/core-hooks-path.txt` holds `/Users/michelkerkmeester/.config/git/hooks`
- [ ] `$BRIDGE` holds seven executable copies that `cmp` equal to their sources
- [ ] Phase 004's landing rollback is written and names its own commands

### Rollback Procedure
1. Stop at the failing task, and start no further item.
2. If `MAIN` must return to the pre-landing tree, rebuild the bridge from the current hook bodies and point `core.hooksPath` at it before phase 004's rollback runs.
3. Restore items in section 7's order, checking each before the next.
4. Restore the global hooks last, then point `core.hooksPath` at `$HOOKS` and delete the bridge.
5. Record the trigger, the restored items and their checks in the goal log, and tell the operator which items went back.

### Data Reversal
- **Has data migrations?** No. Every change is a file, a link or a config line outside Git.
- **Reversal procedure**: The copies and manifests under `B`, applied as section 7 lists. `B` stays until phase 011 closes.
<!-- /ANCHOR:enhanced-rollback -->

---
