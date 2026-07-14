---
title: "sk-git: Feature Catalog"
description: "Current-state inventory of sk-git's owner-first worktree naming, session isolation and reaping, commit/finish workflow guidance, and remote-platform integrations."
trigger_phrases:
  - "sk-git feature catalog"
  - "git workflow capabilities"
  - "worktree naming allocator"
  - "sk-git capability inventory"
last_updated: "2026-07-14"
version: 1.0.0.0
---

# sk-git: Feature Catalog

This document is the current feature inventory for the `sk-git` skill. It covers the owner-first worktree/branch naming grammar and its allocator, launch-wrapper session isolation with continuous-integration autosync and reaping, the deterministic commit/finish workflow guidance sk-git gives an operating AI, and the two remote-platform MCP integrations (GitHub, GitKraken) it routes to for PR and issue work.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `sk-git` feature surface. The four numbered sections below group the system by capability area: the naming grammar that keeps every branch legible, the session-lifecycle machinery that isolates concurrent AI work while keeping it visible, the workflow playbooks that shape how an AI creates worktrees/commits/finishes work, and the remote-platform integrations for PRs and issues.

---

## 2. WORKTREE NAMING

### Owner-first worktree naming grammar and allocator

#### Description

A clone-wide numbered allocator plus a set of grammar validators give every AI-created branch one owner-first shape — `<owner>/NNNN-<slug>` — pairing with a worktree directory `.worktrees/NNNN-<owner>-<slug>`.

#### Current Reality

`worktree-naming.sh` discovers canonical owner ids from every checked-in `SKILL.md`'s `name:` frontmatter, computes the next free number from a persisted high-water mark plus every registered worktree and every local/remote ref (so a partial view can never reissue a live number), and exposes `create`/`create-detached` to allocate-and-create in one step. The same validators it uses internally (`is_valid_owner`, `is_valid_slug`, `is_valid_branch`, `is_valid_pair`) are exposed as CLI subcommands and are sourced directly by the pre-push naming hook, so the two surfaces can never drift out of agreement.

#### Source Files

See [`worktree-naming/owner-first-worktree-naming.md`](worktree-naming/owner-first-worktree-naming.md) for full implementation and test file listings.

---

### Pre-push naming enforcement hook

#### Description

A `pre-push` git hook blocks the creation of new remote branches whose name breaks the owner-first grammar, without ever gating updates to a branch that already exists remotely.

#### Current Reality

The hook is migration-tolerant (only a brand-new remote branch is checked; existing branches of any name can still be pushed/updated), fail-open (a missing or broken naming validator produces a warning, never a blocked push), and always exempts `skilled/v*` release branches. An operator can bypass it for one push with `SPECKIT_SKIP_PREPUSH_NAMING=1`.

#### Source Files

See [`worktree-naming/pre-push-naming-enforcement.md`](worktree-naming/pre-push-naming-enforcement.md) for full implementation and test file listings.

---

## 3. SESSION LIFECYCLE

### Launch-wrapper session isolation

#### Description

An operator-opted-in launch wrapper places every top-level AI session in its own worktree, its own branch, and its own isolated MCP databases, so concurrent multi-runtime sessions never share a working tree or contend on a single-writer database lease.

#### Current Reality

`worktree-session.sh` detects whether the invoking process is a top-level session or an orchestrated child (`AI_SESSION_CHILD=1`, or already inside a linked worktree) and only isolates the former; a child execs in place inside its parent's worktree instead of nesting. A top-level session gets a numbered ephemeral worktree on a `work/<runtime>/<slug>` branch, shared `node_modules`/`dist` symlinked in from the main checkout, and per-session `SPEC_KIT_DB_DIR` / `SPECKIT_CODE_GRAPH_DB_DIR` / `SPECKIT_IPC_SOCKET_DIR` exports.

#### Source Files

See [`session-lifecycle/launch-wrapper-session-isolation.md`](session-lifecycle/launch-wrapper-session-isolation.md) for full implementation and test file listings.

---

### Worktree reaper

#### Description

A companion script that prunes finished launch-wrapper worktrees and reports (but does not by default kill) orphaned MCP daemons, without ever touching a human-created or still-active worktree.

#### Current Reality

`worktree-reaper.sh` removes a `work/<runtime>/<slug>` worktree only when all three hold at once: the tree is clean, its branch is merged into the live integration tip (the primary checkout's actual `HEAD`, not a possibly stale local `main`), and its session is proven inactive by a marker file recording a now-dead process id. Detached worktrees, human owner-first worktrees, and any wrapper worktree with a missing or unreadable marker are always report-only. Orphan daemon killing is opt-in via `--reap-daemons`.

#### Source Files

See [`session-lifecycle/worktree-reaper.md`](session-lifecycle/worktree-reaper.md) for full implementation and test file listings.

---

### Continuous integration autosync

#### Description

An always-current live branch model keeps every concurrent AI session's committed work visible in the operator's IDE checkout within seconds, without giving up per-session worktree isolation.

#### Current Reality

Each launch-wrapper session bases its worktree on whatever branch the primary checkout currently has open, and a `post-commit` hook publishes every commit to that live branch via `git-sync.sh` — fast-forwarding when possible, rebasing only the session's own commits when the live tip has moved, and aborting cleanly (never half-applying) on a rebase conflict. `git-live-follow.sh` fast-forwards the operator's IDE checkout as the live branch advances, and never touches a dirty or diverged tree.

#### Source Files

See [`session-lifecycle/continuous-integration-autosync.md`](session-lifecycle/continuous-integration-autosync.md) for full implementation and test file listings.

---

## 4. WORKFLOW PLAYBOOKS

### Numbered worktree workflows

#### Description

The end-to-end workflow an AI follows to gather inputs, verify safety, create a numbered owner-first worktree, and report status — covering fast-merge, long-running, and detached-experiment lifecycle strategies.

#### Current Reality

The AI must ask the user to choose between a worktree and the current branch before any worktree is created, and must never create a branch with `git branch`/`git checkout -b`/`git switch -c` directly. All three lifecycle strategies share the identical owner-first naming and creation mechanics; they differ only in how the resulting branch is managed afterward.

#### Source Files

See [`workflow-playbooks/numbered-worktree-workflows.md`](workflow-playbooks/numbered-worktree-workflows.md) for full implementation and test file listings.

---

### Conventional commit workflows

#### Description

A deterministic commit-message contract (`type(scope)[!]: imperative summary`) plus artifact-filtering and scoped-staging guidance so an AI-authored commit is atomic, self-contained, and never sweeps in another session's in-flight work.

#### Current Reality

Type and scope selection both follow a fixed first-match priority order; a `commit-msg` hook enforces the structural contract (bypass: `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`). On a dirty shared tree, the AI stages only its own explicit pathspecs and asserts the staged set against a deny-pattern before committing, rather than using a broad `git add -A`/`git add .`.

#### Source Files

See [`workflow-playbooks/conventional-commit-workflows.md`](workflow-playbooks/conventional-commit-workflows.md) for full implementation and test file listings.

---

### Finish and integration workflows

#### Description

The structured completion flow that gates on passing tests, then presents exactly four integration choices — merge locally, push and open a PR, keep as-is, or discard — and executes the chosen path safely.

#### Current Reality

Discard requires a typed `discard` confirmation after a permanent-deletion warning. A finish that ends in a worktree/detached-HEAD push onto a shared branch reconciles the operator's primary checkout afterward rather than leaving the pushed work invisible there. An optional release step creates both an annotated tag and a GitHub release (a tag alone never produces a release), stripping the leading H1 from a changelog file before publishing its body.

#### Source Files

See [`workflow-playbooks/finish-and-integration-workflows.md`](workflow-playbooks/finish-and-integration-workflows.md) for full implementation and test file listings.

---

### Large reorg playbook

#### Description

A step-ordered runbook for a large rename/reorg (hundreds-to-thousands of `git mv`) that keeps file-rename operations confined to a worktree while deferring the spec-kit toolchain and the global memory/vector database reindex to `main` after merge.

#### Current Reality

A fresh worktree lacks gitignored build dependencies, so toolchain runs inside it can silently no-op on zero files; the memory and vector databases are a single global instance, not one per worktree, so reindexing from inside a reorg worktree would index paths that do not yet exist on `main`. The playbook snapshots the gitignored databases before starting, verifies renames landed as `R`-status, and sweeps leftover gitignored cruft that `git mv` leaves behind in old source directories.

#### Source Files

See [`workflow-playbooks/large-reorg-playbook.md`](workflow-playbooks/large-reorg-playbook.md) for full implementation and test file listings.

---

## 5. REMOTE PLATFORM INTEGRATION

### GitKraken MCP integration

#### Description

Cross-platform (GitHub/GitLab/Azure DevOps/Bitbucket/Jira) access to GitLens AI workflows plus issue and PR management via Code Mode, reserved for operations with no local git equivalent.

#### Current Reality

GitKraken MCP's local-mutation tools (`git_add_or_commit`, `git_push`, `git_branch`, `git_worktree`, `git_stash`, etc.) duplicate sk-git's own Bash-based, rule-gated workflow and must never substitute for it; two internal helper tools are self-declared app-only and must never be called. The integration is reserved for GitLens AI workflows (commit composer, launchpad triage, AI-driven review/work-start) and cross-provider issue/PR/repository operations that local git and GitHub MCP cannot reach.

#### Source Files

See [`remote-platform-integration/gitkraken-mcp-integration.md`](remote-platform-integration/gitkraken-mcp-integration.md) for full implementation and test file listings.

---

### GitHub MCP integration

#### Description

Full CRUD access to GitHub's remote PR, issue, and repository operations via Code Mode, layered on top of (not replacing) local git and the `gh` CLI.

#### Current Reality

Local `git` stays the tool for commit/diff/status/log/merge/worktree operations; GitHub MCP is preferred for PR reviews and comments, issue management, and CI/CD status/logs where its API is richer than `gh` alone. Branch creation is explicitly routed back to local `git worktree add -b ...` rather than GitHub MCP's `github_create_branch`.

#### Source Files

See [`remote-platform-integration/github-mcp-integration.md`](remote-platform-integration/github-mcp-integration.md) for full implementation and test file listings.
