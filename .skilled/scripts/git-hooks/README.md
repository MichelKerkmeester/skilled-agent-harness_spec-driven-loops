---
title: "Git Hooks"
description: "Advisory-first git lifecycle hooks and their shared autostash and mass-deletion guards, installed via install-git-hooks.sh."
trigger_phrases:
  - "git hooks"
  - "pre-commit hook"
  - "autostash orphan guard"
  - "post-commit hook"
  - "pre-push hook"
---

# Git Hooks

> Source-of-truth git lifecycle hooks symlinked into `.git/hooks/` by `install-git-hooks.sh`, plus the shared guard helpers they source.

---

## 1. OVERVIEW

`.skilled/scripts/git-hooks/` holds the hook scripts this repo installs, usually machine-wide through a global `core.hooksPath`. Most checks here have their own bypass env var. The exceptions block by default: `pre-commit` runs eight blocking sub-gates, `pre-push` blocks outright, and `commit-msg` blocks with no bypass at all (see below).

Current state:

- `pre-commit` runs eight blocking sub-gates: comment hygiene, agent-mirror sync, mirror parity, prompt-card sync, MCP mutation-class, template phrase lint, compiled-routing re-mint and spec derived-metadata re-mint. Seven carry their own bypass flag. Template phrase lint blocks staged template defaults and editor fallbacks, and warns on other negative classes. Agent-mirror sync has none of its own, and `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` (or `SYSTEM_HOOKS_DISABLED=1`) turns off the whole pre-commit chain, that gate included. Comment hygiene checks the staged content, not the working tree, in one checker run. Every block from the two re-mint gates prints its bypass flag, and a packet dirty only in the gate's own derived files re-derives instead of blocking.
- `prepare-commit-msg` stamps the machine trailer paragraph: it mints a `Commit-Id:` through the sk-git ordinal allocator whenever one is absent, re-mints a fresh one on every cherry-pick (clean or continued after a conflict), keeps the existing id on amend, and appends `Spec:` only when `SPECKIT_COMMIT_SPEC` supplies the packet. It removes `Co-Authored-By:` and `Claude-Session:` lines, never the subject, and names each line it removed; any other line naming a vendor stays for `commit-msg` to report. It identifies this repository by the allocator's path, separates the block from prose with one blank line, keeps trailing comment lines (and a `git commit -v` scissors/diff tail) below the block when git will strip them, and exits untouched anywhere else. `SPECKIT_SKIP_PREPARE_COMMIT_MSG=1` skips it.
- `commit-msg` blocks a message that breaks the repository's own commit rules: the "Enforced rules" JSON block in its sk-git `commit-message-template.md`, read by `skills/sk-git/scripts/validate-message.mjs`. The validator is found beside the real hook script, so the machine-wide install enforces each repository's own template, and a repository with no rules block is not checked. There is no bypass; `--no-verify` only defers the block to `pre-push` and CI.
- `post-commit` publishes the just-completed commit to the shared live branch, and only from a linked worktree in a launch-wrapper session that exports both `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH`.
- `post-commit`, `post-merge` and `post-rewrite` anchor and surface any `--autostash` entry, including the stash object a `rebase --autostash` records in its sequencer directory before git re-applies it, so a conflicted (un-applied) autostash cannot be lost silently.
- `lib/autostash-orphan-guard.sh` is the one shared helper `post-commit`, `post-merge` and `post-rewrite` all source; `lib/mass-deletion-guard.sh` backs the `pre-push` mass-deletion gate; `lib/message-contract-gate.sh` gives `commit-msg` and `pre-push` the validator path and the no-node fallback.
- Each `SPECKIT_SKIP_*` gate in `pre-commit`, `prepare-commit-msg` and `pre-push` can also stay off for good. `lib/gate-config.sh` reads git config `speckit.hooks.<key>` from local and global config (a `git -c` flag or a `GIT_CONFIG_*` variable does not count) and, for a value of `off`, `false`, `no` or `0`, sets the gate's variable for that run and prints one line naming the setting. `lib/gates.tsv` is the one list of gates and keys, and `/doctor:git hooks` lists and changes them. The per-push approvals `SPECKIT_ALLOW_REMOTE_PUSH` and `SPECKIT_ALLOW_MASS_DELETION` are marked non-persistable and never read from config, and only a trusted toolchain repository reads any setting.
- `pre-push` runs six gates on every push. A mass-deletion ceiling blocks a destructive range. A permission gate blocks any push to a branch outside the remote allowlist unless that push is approved, and creating a branch needs the allowlist or approval naming the branch. The skill-metadata gate warns about stale generated metadata and never blocks; CI enforces it. The compiled-routing gate blocks a failing route guard, and a pushed commit that is HEAD must carry the routing bytes the guard approved. The track-root gate blocks a pushed ref whose tip's track roots do not list exactly the packets they hold. The message-contract gate re-checks every commit the push adds, meaning commits no remote-tracking ref already holds, and the name of a new branch, against the repository's templates, which is what catches a commit made with `--no-verify`. `main`, `skilled/v*` and branches in the allowlist file pass the permission gate with nothing set.
- Each gate finds its scripts under the source root the hook selects: whichever of `.skilled` and `.opencode` holds `skills/system-spec-kit/SKILL.md`, with `.skilled` preferred. The six lifecycle hooks (`prepare-commit-msg`, `pre-commit`, `pre-push`, `post-commit`, `post-merge` and `post-rewrite`) carry the same selection block, and `tests/source-root-selection.test.sh` holds the copies identical. Because the hooks run machine-wide and a cloned repository controls its own tree, a second block, also held identical by that test, keeps the selected root only for the checkout the hooks live in (or one of its worktrees) or a repository whose local config sets `skilled.trustRepoHooks=true` (a `git -c` flag or a `GIT_CONFIG_*` variable does not count); any other repository is treated as one without the toolchain, and its scripts never run. `commit-msg` is outside that block set: it finds its validator beside the installed hook. Every staged-path filter and pathspec names both roots. Where the toolchain ships, a missing gate script never passes in silence: a gate that can block exits 1 naming the path and its bypass, and a gate that cannot block warns. Any other repository the globally installed hooks run in sees no new output and no new block beyond the message contract.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                            GIT HOOKS                              │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ git commit   │ ───▶ │ pre-commit       │ ───▶ │ 8 blocking       │
│              │      │                  │      │ gates            │
└──────────────┘      └──────────────────┘      └──────────────────┘

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ git commit   │ ───▶ │ post-commit      │ ───▶ │ live-branch       │
│ (completed)  │      │                  │      │ autosync publish  │
└──────────────┘      └──────────────────┘      └──────────────────┘

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ git merge /  │ ───▶ │ post-merge /     │ ───▶ │ lib/autostash-    │
│ rebase       │      │ post-rewrite     │      │ orphan-guard.sh   │
└──────────────┘      └──────────────────┘      └────────┬─────────┘
                                                           ▼
                                                  ┌──────────────────┐
                                                  │ refs/autostash-   │
                                                  │ rescue/<sha>      │
                                                  └──────────────────┘

Dependency direction: git lifecycle event ───▶ hook script ───▶ lib/ guard helper
```

---

## 3. PACKAGE TOPOLOGY

```text
git-hooks/
+-- commit-msg                     # Template-contract gate (blocking, no bypass)
+-- pre-commit                   # 8 blocking sub-gates
+-- post-commit                     # Autosync publish + autostash orphan guard
+-- post-merge                      # Autostash orphan guard after merge
+-- post-rewrite                    # Autostash orphan guard after amend/rebase
+-- pre-push                        # Mass-deletion, remote-permission, skill-metadata, routing, track-root and message-contract gates
+-- lib/
|   +-- autostash-orphan-guard.sh   # Shared autostash anchor: stash list + rebase sequencer
|   +-- gate-config.sh              # Persistent gate settings from git config, sourced by pre-commit, prepare-commit-msg and pre-push
|   +-- gates.tsv                   # The gate registry: hook, config key, bypass variable, persistable
|   +-- mass-deletion-guard.sh      # Mass-deletion detection sourced by pre-push
|   `-- message-contract-gate.sh    # Validator lookup sourced by commit-msg and pre-push
`-- README.md
```

Allowed dependency direction:

```text
post-merge / post-rewrite → lib/autostash-orphan-guard.sh
post-commit → $SOURCE_ROOT/hooks/shared/hook-flags.sh, $SOURCE_ROOT/bin/git-sync.sh
pre-commit → $SOURCE_ROOT comment-hygiene checker, agent-mirror checker, mirror sync scripts, skill-advisor card-sync guard, doctor mutation-class guard, template-phrase-lint.mjs, $SOURCE_ROOT/bin/compiled-route-manifest.cjs
pre-push → $SOURCE_ROOT/skills/sk-git/scripts/worktree-naming.sh (sourced for the allowlist), lib/mass-deletion-guard.sh
pre-commit / prepare-commit-msg / pre-push → lib/gate-config.sh → lib/gates.tsv
```

Disallowed dependency direction:

```text
lib/autostash-orphan-guard.sh → hook-specific logic (stays a generic stash-anchoring guard)
hooks here → hard-fail without a bypass env var on their primary check (the message contract is the one deliberate exception: it has no bypass, and `pre-push` and CI stand behind `commit-msg`)
```

---

## 4. KEY FILES

| File | Responsibility | Bypass |
|---|---|---|
| `pre-commit` | Runs eight blocking sub-gates when their staged-path trigger matches: comment hygiene (on the staged content, in one checker run), agent-mirror sync, mirror parity, prompt-quality-card sync, the MCP mutation-class contract, template phrase lint, compiled-routing re-mint, and spec derived-metadata re-mint. Mirror parity runs only where the toolchain ships. The last two repair their artifact and stage the repair rather than instructing you to, which is the exception in this folder and is confined to artifacts derived from the staged input. Every block from these two gates prints its bypass flag, and a packet dirty only in its derived metadata re-derives instead of blocking. | `SPECKIT_SKIP_COMMENT_HYGIENE=1`, `SPECKIT_SKIP_PHRASE_LINT=1`, `SPECKIT_SKIP_MIRROR_PARITY=1`, `SPECKIT_SKIP_CARD_SYNC=1`, `SPECKIT_SKIP_MCP_MUTATION_CLASS=1`, `SPECKIT_SKIP_ROUTE_REMINT=1`, `SPECKIT_SKIP_SPEC_REMINT=1` (seven of the eight; agent-mirror sync has no switch of its own). `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` or `SYSTEM_HOOKS_DISABLED=1` turns off the whole chain |
| `commit-msg` | Runs `validate-message.mjs --commit` against the repository's own commit rules block and blocks on any violation, printing each rule id. The rules come from the directory git config `skgit.contractDir` names, otherwise from the first of `.sk-git/`, `.skilled/` and `.opencode/` that holds the sk-git templates. Without node or the validator it blocks only where the repository declares rules. | None |
| `post-commit` | Publishes the just-completed commit to the shared live branch through `$SOURCE_ROOT/bin/git-sync.sh --auto --quiet`, and only from a linked worktree in a launch-wrapper session that exports both `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH`. Also runs the autostash orphan guard. | `SPECKIT_AUTOSYNC=0` (this launch); `SYSTEM_LIVE_SYNC_DISABLED` or `SYSTEM_HOOKS_DISABLED` (whole live-sync loop) |
| `post-merge` | Sources `lib/autostash-orphan-guard.sh` and anchors any `--autostash` entry the merge left un-applied. | None; the guard is best-effort and never blocks |
| `post-rewrite` | Sources `lib/autostash-orphan-guard.sh` after an amend or rebase. The rewritten `old_commit new_commit` pairs git sends on stdin are unused. | None; the guard is best-effort and never blocks |
| `lib/autostash-orphan-guard.sh` | Defines `autostash_orphan_guard()`, the one function `post-commit`, `post-merge` and `post-rewrite` source. Reads the sequencer's recorded autostash object, so a rebase autostash is anchored before git re-applies it. Anchors every autostash entry under `refs/autostash-rescue/<sha>` so it survives garbage collection, prints recovery instructions and records an alert in `.skilled/logs/autostash-orphan-alerts.log`. | None; it always returns success |
| `pre-push` | Reads `<local ref> <local sha> <remote ref> <remote sha>` lines from stdin and runs six gates. The mass-deletion ceiling blocks a destructive range. The remote gate blocks any push to a branch outside the allowlist unless this one is approved: creating a branch needs `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`, an update accepts a bare `=1`, and `main`, `skilled/v*` and the allowlist file pass with nothing set. A naming-grammar gate ran here until it was removed for never refusing a push the remote gate would have allowed. Fails safe (exits 0) if `worktree-naming.sh` fails to source. Where the toolchain ships, a missing `worktree-naming.sh` blocks each push the remote gate would check until `SPECKIT_ALLOW_REMOTE_PUSH` approves it, a missing mass-deletion library blocks update pushes until `SPECKIT_ALLOW_MASS_DELETION=1` and a missing route guard blocks until `SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1`. The track-root gate runs `sweep-track-roots.mjs --rev` on each pushed ref's tip rather than the working tree, because a shared checkout holds other sessions' unfinished packets, and it leaves out a symlinked track, whose files belong to another repository. It blocks when a track root's `children_ids` differ from that track's packets, and a missing sweep blocks until `SPECKIT_SKIP_PREPUSH_TRACK_GATE=1`. The skill-metadata gate warns and never blocks. An update to the exact `SPECKIT_LIVE_BRANCH` passes the remote gate when `SPECKIT_AUTOSYNC=1`; creating that branch still needs the allowlist or `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`. The routing-commit-parity check runs only where the route guard exists, and only for a pushed commit that is HEAD. The message-contract gate runs `validate-message.mjs --rev-list` over the commits each push adds (those no remote-tracking ref of any remote, and no old remote tip, already holds), releases and `main` included, and `--branch` on a new branch; a validator crash is reported apart from a rule failure, and the gate has no bypass. | `SPECKIT_ALLOW_MASS_DELETION=1`, `SPECKIT_MASS_DELETION_THRESHOLD=<n>`, `SPECKIT_ALLOW_REMOTE_PUSH=1` or `=<branch>`, `SPECKIT_SKIP_PREPUSH_SKILL_GATE=1`, `SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1` (route guard and parity), `SPECKIT_SKIP_PREPUSH_TRACK_GATE=1` |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Blocking vs advisory | `commit-msg`, `pre-commit`'s eight named sub-gates and `pre-push`'s six gates may fail their git operation. Every other check in this folder is advisory or best-effort (`\|\| true` on the guard call). |
| Missing gate scripts | Where the toolchain ships, a blocking gate whose script is missing exits 1 naming the path. The exception is the `pre-commit` template phrase lint, which warns and lets the commit through when its linter or `node` is missing. `prepare-commit-msg`, `post-commit`, `post-merge` and `post-rewrite` warn instead, because git ignores their exit status or they never block by contract. Elsewhere a missing script adds no new output and no new block. |
| Autostash ownership | Only `lib/autostash-orphan-guard.sh` writes `refs/autostash-rescue/*` and the alert log. Hooks source it rather than duplicating the anchor-and-alert logic. |
| Autosync scope | `post-commit` publishes only from a linked worktree in a launch-wrapper session. The primary checkout never auto-publishes, and a blocked publish stays local. |
| Installation | Hooks are plain files here; `install-git-hooks.sh` is what makes them live, by symlinking each into `.git/hooks/`. Editing a hook here takes effect immediately for anyone whose `.git/hooks/<name>` is still the symlink. Run `install-git-hooks.sh --status` to see where the live hook actually resolves, because a global `core.hooksPath` can shadow this checkout. |

Autostash-guard flow:

```text
╭──────────────────────────────────────────╮
│ merge / rebase --autostash completes      │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ hook sources the autostash orphan guard   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ every stash entry anchored under          │
│ refs/autostash-rescue/<sha>               │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ recovery instructions printed and logged  │
│ to .skilled/logs/autostash-orphan-alerts │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

```bash
bash .skilled/scripts/install-git-hooks.sh             # symlink all hooks in this folder into .git/hooks/
bash .skilled/scripts/install-git-hooks.sh --uninstall  # remove symlinks this installer created
bash .skilled/scripts/install-git-hooks.sh --status     # report where each hook resolves
```

Hooks are not invoked directly; git calls them by name during the matching lifecycle event once installed.

---

## 7. VALIDATION

```bash
bash -n .skilled/scripts/git-hooks/pre-commit
bash -n .skilled/scripts/git-hooks/post-commit
bash -n .skilled/scripts/git-hooks/post-merge
bash -n .skilled/scripts/git-hooks/post-rewrite
bash -n .skilled/scripts/git-hooks/pre-push
bash -n .skilled/scripts/git-hooks/prepare-commit-msg
bash -n .opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh
bash -n .skilled/scripts/git-hooks/lib/gate-config.sh
bash .skilled/scripts/git-hooks/tests/gate-config.test.sh
git commit --allow-empty -m "hook smoke"
```

Expected result: syntax checks pass, and the smoke commit runs silently unless a blocking sub-gate or advisory drift check has something to report.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../../skills/system-spec-kit/runtime/ENV-REFERENCE.md`](../../skills/system-spec-kit/runtime/ENV-REFERENCE.md)
- [`lib/README.md`](lib/README.md)
- [`../../skills/sk-git/scripts/worktree-naming.sh`](../../skills/sk-git/scripts/worktree-naming.sh)
