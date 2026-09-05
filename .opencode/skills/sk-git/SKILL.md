---
name: sk-git
description: "Git: numbered worktrees, conventional commits, PRs, merge/rebase, and finish; single-skill workflow guidance with no spec."
allowed-tools: [Read, Bash, mcp__code_mode__call_tool_chain]
argument-hint: "[worktree|commit|finish]"
version: 1.5.2.0
hard_rules:
  - id: commit-scope-drops-untracked
    check: commit-scope-drops-untracked
    message: "Untracked files inside this commit's scope are silently excluded (exit 0, no warning). Naming the file directly errors; naming its directory doesn't. Run `git status` or check `git show --name-only HEAD`."
    severity: warn
  - id: commit-pathspec-empty-change
    check: commit-pathspec-empty-change
    message: "This path has nothing staged or modified — it contributes nothing to the commit. Confirm it's the one you meant."
    severity: warn
  - id: add-pathspec-matches-nothing
    check: add-pathspec-matches-nothing
    message: "This pathspec matches no files — nothing will be staged, and git won't say so. Check the path and working directory."
    severity: warn
  - id: add-pathspec-only-ignored
    check: add-pathspec-only-ignored
    message: "Every file this pathspec matches is ignored, so nothing will be staged. Use `git add -f` if intended."
    severity: warn
  - id: add-update-skips-untracked
    check: add-update-skips-untracked
    message: "`add -u` stages tracked modifications only; any new file in this change will be left behind."
    severity: warn
  - id: restore-discards-over-staged
    check: restore-discards-over-staged
    message: "Restoring this staged path's working tree leaves the index copy in place — it looks reverted while a stale version stays staged. Add `--staged` to clear both."
    severity: warn
  - id: checkout-from-ref-stages-silently
    check: checkout-from-ref-stages-silently
    message: "Restoring from a ref writes the index as well as the working tree, staging this content without an add. Check `git diff --cached` before committing."
    severity: warn
  - id: merge-strategy-resolves-one-sided
    check: merge-strategy-resolves-one-sided
    message: "A one-sided strategy resolves every conflict automatically and reports a clean result — the discarded side is never shown, indistinguishable from a conflict-free merge."
    severity: warn
  - id: case-only-pathspec-folds
    check: case-only-pathspec-folds
    message: "This path differs from a tracked file only by case, and the filesystem folds case: git resolves to the existing path, so the rename silently fails."
    severity: warn
  - id: staged-path-rewritten-by-filter
    check: staged-path-rewritten-by-filter
    message: "This path passes through a clean filter, so committed content differs from disk. The working copy won't show what you're committing — use `git show HEAD:<path>` to see the committed form."
    severity: warn
  - id: reset-hard-discards-changes
    check: reset-hard-discards-changes
    message: "The working tree has modifications, and `reset --hard` destroys them unrecoverably (the reflog protects commits, never uncommitted work). Stash first, or run `git status` to see what's at risk."
    severity: warn
  - id: clean-force-deletes-files
    check: clean-force-deletes-files
    message: "This clean would delete files — with `-x`, even what gitignore protects, like dependency trees and databases. `git clean -n` with the same flags previews the exact list."
    severity: warn
  - id: branch-force-delete-unmerged
    check: branch-force-delete-unmerged
    message: "This branch holds commits not merged into HEAD — exactly what `-d` refuses and `-D` bypasses. Note the branch tip SHA first: after deletion, only the reflog gets you back."
    severity: warn
  - id: stash-clear-drops-entries
    check: stash-clear-drops-entries
    message: "Stash entries exist, and `stash clear` discards all unrecoverably. `git stash list` shows what's about to drop; `stash drop` removes one entry by name instead."
    severity: warn
  - id: history-expiry-defeats-recovery
    check: history-expiry-defeats-recovery
    message: "Immediate expiry deletes the reflog safety net every git recovery relies on — dropped commits and resets are then gone for good."
    severity: warn
  - id: push-deletes-remote-ref
    check: push-deletes-remote-ref
    message: "This push deletes a ref on the remote — destructive at a distance, invisible locally. Confirm the branch name and that nobody else's work rides on it."
    severity: warn
  - id: force-push-without-lease
    check: force-push-without-lease
    message: "Plain `--force` overwrites the remote even if someone pushed after you last fetched; `--force-with-lease` fails instead — the entire difference between rewriting your own history and destroying someone else's."
    severity: warn
---

<!-- Keywords: git-workflow, git-worktree, create-worktree, numbered-worktree, restructure-worktrees, worktree-prefix, wt-branch, worktree-branch, branch-naming-allocator, skilled-branch, branch, commit, conventional-commits, pull-request, PR, merge, rebase, finish-work, integrate-changes, commit-hygiene, workspace-isolation, version-control, github, issues, pr-review, gitkraken, gitlens, gitlens-launchpad, gitlens-commit-composer, cross-platform-pr, multi-provider-issue -->
<!-- Owns: git worktree / create worktree / numbered worktree / restructure worktrees / worktree prefix / wt/ branch / worktree branch / branch naming allocator / skilled branch / branch / commit / conventional commits / pull request / PR / merge / rebase / finish work / integrate changes / git workflow / gitkraken / gitlens / gitlens launchpad / gitlens commit composer / cross-platform pr / multi-provider issue. Does NOT own: spec folders, memory, continuity, save context (system-spec-kit); code implementation, tests (sk-code). -->

# Git Workflows - Git Development Guide

Unified workflow guidance across workspace isolation, commit hygiene, and work completion.

## 1. WHEN TO USE

### When to Use This Guide

Use this guide when starting new git-based work, following a complete git workflow (setup, work,
complete), unsure which git skill to use, or seeking git best practices (branch naming, commits).

### When NOT to Use

- Simple `git status`/`git log` queries (use Bash directly)
- Non-git version control systems

### Keyword Triggers

**Owned:** `git worktree`, `worktree`, `create worktree`, `numbered worktree`, `restructure worktrees`, `worktree prefix`, `wt/ branch`, `worktree branch`, `branch naming allocator`, `skilled branch`, `branch`, `commit`, `conventional commits`, `pull request`, `pr`, `pr review`, `merge`, `rebase`, `finish work`, `integrate changes`, `git workflow`, `github`, `issue`, `gitkraken`, `gitlens`, `gitlens launchpad`, `commit composer`

**Not owned:** spec folders / memory / continuity / save context → `system-spec-kit`; code implementation / writing tests → `sk-code`.

---

## 2. SMART ROUTING


### Resource Loading Levels

| Level       | When to Load             | Resources                  |
| ----------- | ------------------------ | -------------------------- |
| ALWAYS      | Every skill invocation   | Quick reference baseline   |
| CONDITIONAL | If intent signals match  | Setup/commit/finish docs   |
| ON_DEMAND   | Only on explicit request | Extended patterns/templates|

### Smart Router Pseudocode

Authoritative routing logic: scoped loading, weighted intent scoring, ambiguity handling.

```python
import re
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick-reference.md"

INTENT_SIGNALS = {
    "WORKSPACE_SETUP": {"weight": 4, "keywords": ["worktree", "create worktree", "numbered worktree", "restructure worktrees", "workspace", "parallel work"]},
    "COMMIT": {"weight": 4, "keywords": ["commit", "staged", "message", "conventional commit"]},
    "FINISH": {"weight": 4, "keywords": ["finish", "merge", "pr", "pull request", "integrate"]},
    "GITKRAKEN_MCP": {"weight": 4, "keywords": ["gitkraken", "gitlens", "launchpad", "commit composer", "cross-platform pr", "multi-provider issue", "gitlens start review", "gitlens start work"]},
    "SHARED_PATTERNS": {"weight": 3, "keywords": ["convention", "pattern", "reference", "branch naming"]},
}

NOISY_SYNONYMS = {
    "WORKSPACE_SETUP": {"dirty workspace": 2.2, "unclean": 1.4, "mixed changes": 1.5},
    "COMMIT": {"half-staged": 2.0, "boundary": 1.4, "split commit": 1.4},
    "FINISH": {"ship": 1.5, "hotfix": 1.6, "trunk": 1.8, "minimal risk": 1.4},
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm base branch (main/master/trunk)",
    "Confirm whether staged/unstaged changes should be split",
    "Provide required PR policy (squash, template fields, checks)",
    "Confirm hotfix urgency versus cleanup tolerance",
]

RESOURCE_MAP = {
    "WORKSPACE_SETUP": ["references/worktree-workflows.md", "assets/worktree-checklist.md"],
    "COMMIT": ["references/commit-workflows.md", "assets/commit-message-template.md"],
    "FINISH": ["references/finish-workflows.md", "assets/pr-template.md", "references/github-mcp-integration.md"],
    "GITKRAKEN_MCP": ["references/gitkraken-mcp-integration.md"],
    "SHARED_PATTERNS": ["references/shared-patterns.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full git flow", "all templates", "full reference", "git worktree", "create worktree", "numbered worktree", "restructure worktrees", "worktree prefix", "wt/ branch", "worktree branch", "branch naming allocator", "skilled branch", "experiment branch", "clean experiment branch", "routing-hardening", "routing-accuracy experiment"],
    "ON_DEMAND": ["references/shared-patterns.md", "assets/commit-message-template.md"],
}

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def keyword_present(keyword: str, text: str) -> bool:
    """Boundary-aware match: bare substrings misroute ('pr' in 'improve prompt')."""
    return re.search(rf"(?<![a-z0-9]){re.escape(keyword)}(?![a-z0-9])", text) is not None

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and workflow flags."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword_present(keyword, text):
                scores[intent] += cfg["weight"]
    for intent, synonyms in NOISY_SYNONYMS.items():
        for term, weight in synonyms.items():
            if keyword_present(term, text):
                scores[intent] += weight
    if getattr(task, "needs_isolated_workspace", False):
        scores["WORKSPACE_SETUP"] += 4
    if getattr(task, "has_staged_changes", False):
        scores["COMMIT"] += 4
    if getattr(task, "ready_to_integrate", False):
        scores["FINISH"] += 4
    return scores

def select_intents(scores: dict[str, float], task_text: str, ambiguity_delta: float = 1.0, base_max_intents: int = 2, adaptive_max_intents: int = 3) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["SHARED_PATTERNS"]

    noisy_hits = sum(1 for term in ["dirty workspace", "half-staged", "hotfix", "minimal risk", "trunk"] if keyword_present(term, task_text or ""))
    max_intents = adaptive_max_intents if noisy_hits >= 2 else base_max_intents

    selected = [ranked[0][0]]
    for intent, score in ranked[1:]:
        if score <= 0:
            continue
        if (ranked[0][1] - score) <= ambiguity_delta:
            selected.append(intent)
        if len(selected) >= max_intents:
            break
    return selected[:max_intents]

def route_git_resources(task):
    inventory = discover_markdown_resources()
    task_text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, task_text, ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    if sum(scores.values()) < 0.5:
        load_if_available("references/shared-patterns.md")
        return {
            "intents": ["SHARED_PATTERNS"],
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword_present(keyword, text) for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

## 3. HOW IT WORKS

### Workspace Choice Enforcement

**MANDATORY**: The AI must NEVER autonomously choose between a git worktree and the current branch, and must NEVER create a branch directly with `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`.

When a git workspace trigger fires, the AI MUST ask the user to explicitly choose:

| Option                        | Description                              | Best For                        |
| ----------------------------- | ---------------------------------------- | ------------------------------- |
| **A) Create a git worktree**  | Isolated workspace in separate directory | Parallel work, complex features |
| **B) Work on current branch** | No new worktree created                  | Trivial changes, exploration    |

**AI Behavior**: ASK before proceeding, WAIT for explicit selection (A/B), NEVER assume, RESPECT choice for the session unless the user requests a change. Create any needed branch only through `git worktree add -b ...`.

### Launch-Wrapper Worktrees vs the In-Session Ask-First Rule

The ask-first rule above governs **in-session** decisions: once running, an AI must not autonomously create a worktree. `.opencode/bin/worktree-session.sh`, a **launch wrapper** the operator opts into at the shell, is different: it runs *before* the AI starts, placing each top-level session in its own worktree + branch + isolated MCP databases (orchestrated children with `AI_SESSION_CHILD=1`, or already inside a linked worktree, exec in place) — acting pre-session at operator opt-in, so it doesn't violate the ask-first rule.

**Deliberate per-session deps override.** The wrapper **symlinks** the shared `node_modules`/`dist` into each worktree and gives each its own MCP DBs (via `SPEC_KIT_DB_DIR` / `SPECKIT_IPC_SOCKET_DIR`) — an intentional exception to the §4 "bare worktree lacks gitignored deps" guidance, which targets *ad-hoc* large-reorg worktrees, not this one. Strict-validate and metadata regeneration run on `main` only.

### Continuous Integration — the always-current live branch

Worktree isolation keeps concurrent, multi-runtime sessions safe but hides each session's work from the operator's IDE. The **continuous-integration workflow** fixes this: each launch-wrapper session **autosyncs** every commit to one shared **live branch** (whatever branch the primary checkout is on), fast-forward-followed by the IDE — the operator sees what's active seconds behind each commit. The wrapper exports `SPECKIT_LIVE_BRANCH` + `SPECKIT_AUTOSYNC`; the `post-commit` hook publishes via `git-sync.sh` (fetch → fast-forward-or-rebase-abort → non-force push), commit-granularity only. Full model: [continuous-integration.md](references/continuous-integration.md).

### Remote Push Permission Enforcement

**MANDATORY**: The AI must NEVER push a branch to `origin` outside the remote allowlist without a fresh, explicit go-ahead for THAT push — a prior approval doesn't carry forward to the next push.

The remote allowlist is `main`, `skilled/v*` release branches, plus anything in [remote-branch-allowlist.txt](scripts/remote-branch-allowlist.txt). Everything else needs an ask before every push to origin.

"Explicit go-ahead" is either an in-turn instruction that already names the push (e.g. "push this branch" — do NOT ask again), or a direct question the AI asks that the operator answers yes to.

Once granted, set `SPECKIT_ALLOW_REMOTE_PUSH=1` for that one `git push` only, never the session. The [pre-push hook](../../scripts/git-hooks/pre-push) backstops this, blocking any push to a non-allowlisted branch unless that env var is set — an unasked push fails instead of landing silently. Full contract: [remote-branch-policy.md](references/remote-branch-policy.md).

**Continuous-integration exception**: the launch-wrapper's autosync publish (ALWAYS #16) targets only `$SPECKIT_LIVE_BRANCH` (chosen before the session started) and is exempt because `git-sync.sh` never blocks mid-hook (see [continuous-integration.md](references/continuous-integration.md)). Autosync to any OTHER branch still asks.

### Preflight Advisory — the rules reach you at command time

The `hard_rules:` block at the top of this file is executed, not just documentation: a preflight
advisory hook evaluates every visible `git` command against those rules and live repository state
— firing only on the specific risky state, never a bare verb match — and prints the matching rule
as typed. It advises and never blocks; enforcement stays with the pre-commit, commit-msg, and
pre-push hooks.

All six AI runtimes carry the same shared hook (Claude/Codex/Devin via PreToolUse, Cursor via a
Shell-payload proxy, OpenCode via the `sk-git-preflight-advisory` plugin, Pi via a native
extension). Full docs: [scripts/hooks/README.md](scripts/hooks/README.md) (registration, delivery,
fail-open), [scripts/lib/README.md](scripts/lib/README.md) (rule engine, tests), and
[manual-testing-playbook/](manual-testing-playbook/manual-testing-playbook.md) (operator scenario).

Suppression: `SKGIT_ADVISORY=0` (global), `SKGIT_ADVISORY_SKIP=<rule-id>` (one rule), or a
`SKGIT_ADVISORY_SKIP=commit`-style prefix (a family).

### Git Development Lifecycle Map

Git development flows through 3 phases:

| Phase | Goal | Prevents | Output | See |
|-------|------|----------|--------|-----|
| **1. Workspace Setup** | Isolate work in a short-lived temp branch | Branch juggling, stash chaos | Clean, focused workspace | [worktree-workflows.md](./references/worktree-workflows.md) |
| **2. Work & Commit** | Analyze changes, filter artifacts, write Conventional Commits | Bad commits, unclear history | Clean commit history | [commit-workflows.md](./references/commit-workflows.md) |
| **3. Complete & Integrate** | Merge, create a PR, or discard work (tests-gated) | Untested code merged | Work integrated or discarded | [finish-workflows.md](./references/finish-workflows.md) |

### Phase Transitions
Setup (worktree created) → Work → Complete (committed, tests passing) → back to Setup (integrated).

### Workflow Selection Guide
- New feature/fix → Phase 1; quick fix → Phase 2.
- Ready to commit → Phase 2; no changes yet → keep coding.
- Tests pass → Phase 3; failing → return to Phase 2.

### Common Workflow Patterns

- **Full**: all 3 phases.
- **Quick fix**: skip Phase 1.
- **Parallel**: repeat Phases 1-2 per feature, then Phase 3 for each.

---

## 4. RULES

### ✅ ALWAYS

1. **Use deterministic conventional commit format** - All authored commits follow `type(scope): summary`; preserve the explicitly exempt Git-generated subjects defined below
2. **Create worktree for parallel work** - Never work on multiple features in the same worktree
3. **Verify branch is up-to-date** - Pull latest changes before creating PR
4. **Name worktree-created branches with the numbered-worktree grammar** - `worktrees/{NNN}-{slug}` (directory `{base}/{NNN}-{slug}`) for a worktree-backed branch, or `branches/{NNN}-{slug}` for a dedicated branch with none. `{base}` defaults to `.worktrees`; set git config `speckit.worktreeBase` (or env `SPECKIT_WORKTREE_BASE`) to an absolute path to relocate worktrees OUT of the checkout (all tooling resolves this base, including the legacy `.worktrees` layout). `{NNN}` is a 3-digit zero-padded per-namespace counter (001..999): `worktrees/` and `branches/` number independently, sequential, never skipped or reused, so `worktrees/003` and `branches/003` may coexist. `{slug}` is lowercase-kebab (e.g., `worktrees/0001-auth-hardening`). Never hand-compute `{NNN}`: allocate via `.opencode/skills/sk-git/scripts/worktree-naming.sh` (`create <slug> [base]`, `create-branch <slug> [base]`, or `allocate [worktrees|branches]`) — it locks and seeds each counter from its high-water mark plus every matching ref. `skilled/v*` and `main` are reserved; `backup/<anything>` refs are legal but unnumbered. Distinct from the launch wrapper's unnumbered `work/{runtime}/{slug}` + `.worktrees/{runtime}-{slug}` lane (see above).
5. **Reference spec folder in commits** - Include spec folder path in commit body when applicable
6. **Clean up after merge** - Delete local and remote feature branches after successful merge
7. **Squash commits for clean history** - Use squash merge for feature branches with many WIP commits
8. **Defer toolchain + DB work to main on large reorgs** - Do file/`git mv` ops in the worktree, but run the spec-kit toolchain and ALL metadata regeneration on `main` after merge: a bare worktree lacks gitignored deps (`node_modules`/`dist`), so the generators there crash or silently no-op. See [large-reorg-playbook.md](references/large-reorg-playbook.md).
9. **Scan for gitignored leftovers after a rename wave** - After `git mv` + merge, detect dirs with disk files but 0 tracked files (`git ls-files <dir>` empty, `git status --porcelain --untracked-files=all` clean) and `rm -rf` them — stale cruft left by `git mv`.
10. **Verify rename history is preserved** - After a rename wave confirm `R`-status (not delete+add) before commit, and after merge confirm the tree has no old+new duplicate folders.
11. **GitHub release bodies never start with an H1** - The release title field already renders `vX.X.X.X — Title`, so a body-leading `# vX.X.X.X` duplicates it — the H1 belongs ONLY to the repo's changelog md. When publishing from a changelog, strip the leading H1 (and blank lines) into a temp notes file before `gh release create/edit --notes-file`. Full mechanics: [finish-workflows.md](references/finish-workflows.md) Step 6.
12. **Route GitKraken MCP's local-mutation tools back to Bash** - GitKraken MCP (`gitkraken.gitkraken_*`) exposes `git_add_or_commit`, `git_push`, `git_pull`, `git_fetch`, `git_checkout`, `git_branch`, `git_worktree`, and `git_stash` — duplicates of mutations already gated by NEVER #2, ALWAYS #4, and the commit-message logic. Never call these as a Bash substitute; reserve it for GitLens AI workflows and cross-platform issue/PR/repository ops with no local equivalent. Full detail: [gitkraken-mcp-integration.md](references/gitkraken-mcp-integration.md) §2.
13. **Honor an authorized operator's explicit direct-push directive on a protected branch** - Protected-branch rules primarily gate EXTERNAL contributors. When the operator holds bypass rights and explicitly asks for one, do it — do NOT default to a PR detour, re-ask, or frame the bypass as a problem. Still apply full commit hygiene (scope to intended files, never blind `git add -A`; use Conventional Commits) and report plainly the push bypassed protection. Bypass authority lives in operator memory, not this codebase-agnostic skill.
14. **Commit substantial work before an autostash-prone operation** - `git merge|pull|rebase --autostash` (or `pull.rebase=true`/`rebase.autoStash=true`) stashes the tree, runs the operation, then re-applies it — but a re-apply CONFLICT strands the changeset behind an easily-missed warning, one `git stash drop`/`clear`/gc from permanent loss. Before merging/pulling/rebasing a large or shared-branch changeset, COMMIT it (or stash and pop it yourself) instead of `--autostash`. The `post-merge`/`post-rewrite` guard ([git-hooks/lib/autostash-orphan-guard.sh](../../scripts/git-hooks/lib/autostash-orphan-guard.sh)) is a safety net, not a substitute: it anchors autostashes under `refs/autostash-rescue/<sha>` and alerts visibly if not re-applied — recover with `git stash pop` and commit immediately, before any `git stash drop/clear`.
15. **Reconcile the primary checkout after pushing a detached/worktree HEAD to a shared branch** - `git push origin HEAD:<branch>` from a detached HEAD or isolated worktree advances the REMOTE `<branch>` but never the local ref in the primary checkout — the work is safe on origin yet INVISIBLE there until a separate sync. Verify the primary checkout's `<branch>` contains the commit; if not, say plainly it's on origin but not yet there, and hand over the safe sync recipe. NEVER stash/rebase/reset a primary tree that is dirty, diverged, or concurrently owned — forcing a sync risks orphaning its autostash (ALWAYS #14) or clobbering commits; give the operator the recipe for a clean tree instead. See [finish-workflows.md](references/finish-workflows.md) Step 5b.
16. **Let launch-wrapper sessions autosync; never hand-roll the publish** - Under the continuous-integration model (see above), autosync already publishes every commit to the live branch via `git-sync.sh`. Do NOT manually `git push origin HEAD:<live>` or rebase onto the live branch to "make work visible" — a hand-rolled push risks the invariants `git-sync.sh` protects. If autosync is blocked (a printed conflict), resolve per its message; don't force it. The primary checkout follows via `git-live-follow.sh` (fast-forward-only) and is never worked in. Full contract: [continuous-integration.md](references/continuous-integration.md).
17. **Reap worktrees before branches, and only the exempt wrapper lane** - Always remove a finished worktree's directory (`git worktree remove`) BEFORE deleting its branch (`git branch -d`) — a checked-out branch can't be deleted. `.opencode/bin/worktree-reaper.sh` auto-reaps ONLY the launch-wrapper lane (`work/{runtime}/{slug}` pairs), and only when all hold: clean tree, branch merged into the LIVE integration tip (the primary checkout's real `HEAD`, not a stale local `main`), and the session proven inactive by its marker file (`<common-git-dir>/worktree-sessions/<runtime>-<slug>.pid`, a dead pid). Human task worktrees, dedicated branches, detached worktrees, and any wrapper worktree with a missing/unreadable marker or live pid stay report-only — absence of proof is never proof of absence. Naming-grammar enforcement is a migration-tolerant pre-push hook: new remote branches only, never `skilled/v*`.
18. **Ask before every push to a branch outside the remote allowlist** - See [Remote Push Permission Enforcement](#remote-push-permission-enforcement) above for mechanics; a prior approval never carries forward to the next push. Allowlist: [remote-branch-policy.md](references/remote-branch-policy.md).

### Commit Message Logic (Human-Clear and AI-Deterministic)

Use this logic whenever an AI writes or rewrites a commit message: the subject explains the
outcome in `git log --oneline`, and the body explains the reason without packet knowledge or
jargon. The `commit-msg` hook enforces structure, not clarity — see
[git-hooks/commit-msg](../../scripts/git-hooks/commit-msg); bypass with
`SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git commit ...` only when the hook is genuinely wrong, never
to skip writing a real message.

#### 1. Classify Special Git Messages

Preserve Git-generated subjects unchanged when they begin with `Merge `, `Revert "`, `fixup! `,
`squash! `, or `amend! `. Intentional checkpoints are not exempt: write them as
`chore(wip): checkpoint <specific state>`, or use the documented bypass when required.

#### 2. Authored Subject Contract

Format:

```text
type(scope)[!]: imperative summary
```

Hard requirements:

- Type and scope are required; scope is lowercase kebab-case, a stable subsystem name, never a
  packet, phase, task, or other numeric-only identifier.
- Summary starts with a lowercase imperative verb, names the changed behavior or artifact (not
  the work process), ends without punctuation, has no repeated spaces, and is specific enough to
  distinguish this commit from adjacent work.
- Subject should be at most 80 characters and must not exceed 100.
- A `!` requires a `BREAKING CHANGE:` footer.

Do not use vague summaries like `update`, `changes`, `cleanup`, or `work in progress`.

Move process metadata (packet numbers, phases, waves, lanes, task counts, model names, review
rounds, remediation labels, verification claims) to the body or `Refs:` line unless part of the
behavior being changed.

#### 3. Type Selection Order

Use first match:

1. `release` — publishing a release.
2. `docs` — every substantive path is documentation.
3. `fix` — existing behavior was incorrect, unsafe, or failing.
4. `feat` — adds new usable behavior or support.
5. `perf` — measured performance improves, behavior unchanged.
6. `refactor` — structure changes without behavior changes.
7. `test` — only tests or fixtures change.
8. `ci` — only CI workflow behavior changes.
9. `build` — only build or dependency mechanics change.
10. `style` — only formatting changes.
11. `revert`/`merge` — authored revert or merge messages.
12. `chore` — no more specific type applies.

Tests and documentation shipped with a feature or fix inherit that feature or fix type; do not
choose `chore` merely because the commit touches many files.

#### 4. Scope Selection Order

First match, by logical owner:

1. `.opencode/skills/<name>/...` -> `<name>`.
2. `.opencode/scripts/git-hooks/...` or installer -> `git-hooks`.
3. `AGENTS.md` or runtime agent definitions -> `agents`.
4. `.opencode/commands/...` -> `commands`.
5. `opencode.json`, `.utcp_config.json`, or equivalent config -> `config`.
6. Root `README.md` only -> `readme`.
7. Spec-doc or generated packet-metadata maintenance only -> `specs`.
8. Documentation spanning multiple owners -> `docs`.
9. A dominant top-level component -> its lowercase name.
10. Inseparable cross-repository change -> `repo`.

If two independent owners remain, split the commit instead of inventing a combined scope.

#### 5. Summary Construction

Apply this sequence:

1. State the primary outcome of the staged diff.
2. Start with a precise imperative action (`add`, `remove`, `route`, `clarify`, etc.) naming the
   affected behavior or artifact.
3. Add the visible effect when the object alone is ambiguous.
4. Remove chronology, review claims, and duplicate Conventional Commit prefixes.
5. Read only the subject and ask: "Would a maintainer understand what changed without opening
   the packet?" If not, rewrite it.

#### 6. Body Contract

A body is required when any condition applies:

- Four or more paths are staged.
- The change fixes a regression, failure, race, security issue, or data risk — or is breaking / has migration requirements.
- The reason or tradeoff is not obvious from the subject.
- The commit spans code plus generated metadata or multiple repository areas.

Omit a body only for a small, self-explanatory change affecting at most three paths.

Preferred structure:

```text
Context: <plain-language problem or reason>

Changes:
- <observable change>
- <observable change>

Verification:
- `<command>` -> <observed result>

Refs: <issue, PR, or spec path>
```

Use only sections that carry useful information, explain internal terms on first use, and state
in verification what actually ran and its result.

#### 7. Deterministic Self-Check

Before committing, verify message format (§1-2), type (§3), scope (§4), summary (§5), and body
(§6) satisfy their rule, and that the same staged diff would produce the same subject again.

### ⛔ NEVER

1. **Force push to main/master** - Protected branches must never receive force pushes
2. **Never create branches directly** - Via `git worktree add -b ...`; never `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`
3. **Commit directly to protected branches WITHOUT operator authorization** - Default to feature branches + PRs, except when the operator has bypass authority and explicitly directs a direct commit/push (see ALWAYS #13) — don't force a PR detour.
4. **Leave worktrees uncleaned** - Remove worktree directories after merge
5. **Commit secrets or credentials** - Use environment variables or secret management
6. **Create PRs without description** - Always include context, changes, and testing notes
7. **Merge without CI passing** - Wait for all checks to complete
8. **Rebase public/shared branches** - Only rebase local, unpushed commits
9. **Bypass a git hook with `--no-verify`** - Never skip commit-msg, pre-commit, or pre-push validation this way; if a hook is genuinely wrong, fix it or use its documented override (e.g. `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`), not a blanket bypass
10. **Amend a commit that has already been pushed or merged** - Rewriting published history breaks other clones and any autosynced live branch; commit a new change (or `git revert`) instead once it's left the local repo

### ⚠️ ESCALATE IF

1. **Merge conflicts cannot be auto-resolved** - Needs a human decision on which changes to keep
2. **GitHub MCP returns authentication errors** - Token may be expired or permissions insufficient
3. **Worktree directory is locked or corrupted** - May require manual cleanup with `git worktree prune`
4. **Force push to protected branch is requested** - Requires explicit approval and understanding of consequences
5. **CI/CD pipeline fails repeatedly** - May indicate infrastructure issues beyond code problems
6. **Branch divergence exceeds 50 commits** - Suggests an incremental merging strategy
7. **Submodule conflicts detected** - Updates require careful coordination
8. **Strict-validate run inside a bare worktree** - Its exit code is meaningless (ALWAYS #8: missing gitignored deps). Re-run on `main` post-merge before trusting any result. See [large-reorg-playbook.md](references/large-reorg-playbook.md).

---

## 5. REFERENCES

### Core Workflows
| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [worktree-workflows.md](references/worktree-workflows.md) | 7-step workspace creation | Directory selection, branch strategies, large-reorg caveats |
| [large-reorg-playbook.md](references/large-reorg-playbook.md) | Step-ordered large rename/reorg runbook | Worktree-only renames; toolchain + DB run on main |
| [commit-workflows.md](references/commit-workflows.md) | 7-step commit workflow | Artifact filtering, Conventional Commits, scoped-staging |
| [finish-workflows.md](references/finish-workflows.md) | 5-step completion flow | PR creation, cleanup, merge |
| [continuous-integration.md](references/continuous-integration.md) | Always-current live branch | Autosync each commit; the IDE follows |
| [shared-patterns.md](references/shared-patterns.md) | Reusable git patterns | Error recovery, conflict resolution, large-reorg verification |
| [quick-reference.md](references/quick-reference.md) | Command cheat sheet | Common operations |
| [github-mcp-integration.md](references/github-mcp-integration.md) | GitHub MCP remote ops | PRs, issues, CI/CD via Code Mode |
| [gitkraken-mcp-integration.md](references/gitkraken-mcp-integration.md) | GitKraken MCP cross-platform ops | GitLens AI, cross-platform PRs/issues |

### Assets
| Asset | Purpose |
|-------|---------|
| [worktree-checklist.md](assets/worktree-checklist.md) | Worktree creation checklist |
| [commit-message-template.md](assets/commit-message-template.md) | Commit format guide |
| [pr-template.md](assets/pr-template.md) | PR description template |

---

## 6. SUCCESS CRITERIA

### Workspace Setup Complete
- Workspace prepared in the selected mode (`git worktree` or current branch), user-confirmed
- Any worktree lives in the correct directory (`.worktrees/` or user-specified), branch named per convention (`worktrees/{NNN}-{slug}` or `branches/{NNN}-{slug}`)

### Commit Complete
- All changes reviewed, categorized, and artifact-filtered (build files, coverage, etc.); only public-value files staged
- Commit message follows Conventional Commits format

### Integration Complete
- Tests pass and branch up-to-date before merge/PR
- PR description includes context, changes, and testing notes
- Worktree cleaned up and local/remote feature branches deleted after merge (if used)

### Quality Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| **Pre-commit** | Artifacts excluded and staged-content gates pass | Yes |
| **Commit-msg** | Message structure passes; clarity warnings reviewed | Structure only |
| **Pre-merge** | Tests pass, branch up-to-date | Yes |
| **Pre-PR** | Description complete, CI passing | Yes |
| **Post-merge** | Worktree removed, branches cleaned | No |

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the framework in [AGENTS.md](../../../AGENTS.md):
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Gate 3**: File modifications require the spec folder question (AGENTS.md, HARD BLOCK)
- **Tool Routing**: AGENTS.md Section 6 decision tree
- **Continuity**: see Continuity Integration below

### Continuity Integration

Recovery sequence (widen with ripgrep only once packet-native sources are exhausted):

```text
// Recover the active packet before planning git work
/speckit:resume
// Recovery order: handover.md -> _memory.continuity -> spec docs

// If packet-native sources are exhausted, widen with the ripgrep recipe in
// system-spec-kit/references/retrieval/retrieval-conventions.md §2.1.
// Exit 1 is a clean no-hit, not an error.
rg --no-config --json --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'branch strategy decisions' specs .opencode

// After major commits or workflow completion
// Save context with: /speckit:save or "save context to [spec-folder]"
```

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically from `references/`, `assets/`, and `scripts/` — see §5 for the core set.

### Manual Testing Playbook

Manual testing scenarios live in `manual-testing-playbook/manual-testing-playbook.md` (root index) plus scenario files (`GIT-001`..`GIT-042`) across 8 categories under `manual-testing-playbook/<topic>/<scenario>.md`. Run `bash .opencode/skills/sk-doc/scripts/validate_document.py manual-testing-playbook/manual-testing-playbook.md` for structural validation; run scenarios in opencode/Claude/OpenCode for behavioral checks.

### Feature Catalog

A companion `feature-catalog/feature-catalog.md` catalogs every sk-git capability's entry point — naming allocator/validators (`scripts/worktree-naming.sh`), launch-wrapper isolation (`.opencode/bin/worktree-session.sh`), worktree reaper (`.opencode/bin/worktree-reaper.sh`), naming hook (`.opencode/scripts/git-hooks/pre-push`), CI autosync, and the worktree/commit/finish/GitKraken/GitHub/large-reorg workflows.

Related: `system-spec-kit` (packet recovery, continuity), `sk-doc` (PR, release, documentation quality).
