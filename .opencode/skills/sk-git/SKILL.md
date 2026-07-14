---
name: sk-git
description: "Git: numbered worktrees, conventional commits, PRs, merge/rebase, finish; routes git-worktrees/git-commit/git-finish; no spec."
allowed-tools: [Read, Bash, mcp__code_mode__call_tool_chain]
argument-hint: "[worktree|commit|finish]"
version: 1.3.2.0
---

<!-- Keywords: git-workflow, git-worktree, create-worktree, numbered-worktree, restructure-worktrees, worktree-prefix, wt-branch, owner-first-branch, skill-scoped-worktree, worktree-naming-allocator, skilled-branch, branch, commit, conventional-commits, pull-request, PR, merge, rebase, finish-work, integrate-changes, commit-hygiene, workspace-isolation, version-control, github, issues, pr-review, gitkraken, gitlens, gitlens-launchpad, gitlens-commit-composer, cross-platform-pr, multi-provider-issue -->
<!-- Owns: git worktree / create worktree / numbered worktree / restructure worktrees / worktree prefix / wt/ branch / owner-first branch / skill-scoped worktree / worktree naming allocator / skilled branch / branch / commit / conventional commits / pull request / PR / merge / rebase / finish work / integrate changes / git workflow / gitkraken / gitlens / gitlens launchpad / gitlens commit composer / cross-platform pr / multi-provider issue. Does NOT own: spec folders, memory, continuity, save context (system-spec-kit); code implementation, tests (sk-code). -->

# Git Workflows - Git Development Orchestrator

Unified workflow guidance across workspace isolation, commit hygiene, and work completion.

## 1. WHEN TO USE

### When to Use This Orchestrator

Use this orchestrator when:
- Starting new git-based work
- Unsure which git skill to use
- Following complete git workflow (setup → work → complete)
- Looking for git best practices (branch naming, commit conventions)

### When NOT to Use

- Simple `git status` or `git log` queries (use Bash directly)
- Non-git version control systems

### Keyword Triggers

**Owned (route here):** `git worktree`, `worktree`, `create worktree`, `numbered worktree`, `restructure worktrees`, `worktree prefix`, `wt/ branch`, `owner-first branch`, `skill-scoped worktree`, `worktree naming allocator`, `skilled branch`, `branch`, `commit`, `conventional commits`, `pull request`, `pr`, `pr review`, `merge`, `rebase`, `finish work`, `integrate changes`, `git workflow`, `github`, `issue`, `gitkraken`, `gitlens`, `gitlens launchpad`, `commit composer`

**Not owned (do NOT claim):** spec folders / memory / continuity / save context → `system-spec-kit`; code implementation / writing tests → `sk-code`. This skill commits and integrates that work; it does not author it.

---

## 2. SMART ROUTING


### Resource Loading Levels

| Level       | When to Load             | Resources                  |
| ----------- | ------------------------ | -------------------------- |
| ALWAYS      | Every skill invocation   | Quick reference baseline   |
| CONDITIONAL | If intent signals match  | Setup/commit/finish docs   |
| ON_DEMAND   | Only on explicit request | Extended patterns/templates|

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

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
    "ON_DEMAND_KEYWORDS": ["full git flow", "all templates", "full reference", "git worktree", "create worktree", "numbered worktree", "restructure worktrees", "worktree prefix", "wt/ branch", "owner-first branch", "skill-scoped worktree", "worktree naming allocator", "skilled branch", "experiment branch", "clean experiment branch", "routing-hardening", "routing-accuracy experiment"],
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

**MANDATORY**: The AI must NEVER autonomously decide between creating a git worktree or using the current branch.

The AI must NEVER create a new branch directly with `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`.

When git workspace triggers are detected (new feature, worktree, isolated workspace, etc.), the AI MUST ask the user to explicitly choose:

| Option                        | Description                              | Best For                        |
| ----------------------------- | ---------------------------------------- | ------------------------------- |
| **A) Create a git worktree**  | Isolated workspace in separate directory | Parallel work, complex features |
| **B) Work on current branch** | No new worktree created                  | Trivial changes, exploration    |

**AI Behavior**: ASK before proceeding, WAIT for explicit selection (A/B), NEVER assume, RESPECT choice throughout. Once chosen, reuse preference for the session unless the user requests a change. If a new branch is needed, create it only through `git worktree add -b ...`.

### Launch-Wrapper Worktrees vs the In-Session Ask-First Rule

The ask-first rule above governs **in-session** decisions: once an AI is running, it must not autonomously create a worktree. That is distinct from `.opencode/bin/worktree-session.sh`, a **launch wrapper** the operator opts into at the shell (e.g. `alias claude='bash /abs/.opencode/bin/worktree-session.sh claude'`). The wrapper runs *before* the AI starts and places each top-level session in its own worktree + branch + isolated MCP databases automatically; orchestrated children (`AI_SESSION_CHILD=1`, or already inside a linked worktree) exec in place. Because the wrapper acts pre-session at operator opt-in, it does not violate the in-session ask-first rule — the operator made the choice by aliasing the launch.

**Deliberate per-session deps override.** The wrapper **symlinks** the shared `node_modules`/`dist` from the main checkout into each worktree and gives each worktree its own MCP DBs (via `SPEC_KIT_DB_DIR` / `SPECKIT_CODE_GRAPH_DB_DIR` / `SPECKIT_IPC_SOCKET_DIR`). This is an intentional exception to the §4 "bare worktree lacks gitignored deps / DBs are a single global instance" guidance: that guidance is about *ad-hoc* worktrees for large reorgs, whereas the wrapper purpose-builds an isolated-but-runnable worktree. Strict-validate and memory reindex still run on `main`, never inside a wrapper worktree.

### Continuous Integration — the always-current live branch

Worktree isolation keeps concurrent, multi-runtime sessions safe, but it also hides each session's work from the operator's IDE (which is open on the primary checkout). The **continuous-integration workflow** resolves that without giving up isolation: each launch-wrapper session keeps its own worktree but **autosyncs** every commit to one shared **live branch** — whatever branch the primary checkout is on — and the IDE fast-forward-follows it, so the operator always sees what is currently active, seconds behind each commit. The wrapper bases the session worktree on the live branch and exports `SPECKIT_LIVE_BRANCH` + `SPECKIT_AUTOSYNC`; the `post-commit` hook then publishes via `git-sync.sh` (fetch → fast-forward-or-rebase-abort → non-force push). Visibility is at commit granularity only — never another session's un-committed buffer. Full model, safety contract, and operator setup: [continuous-integration.md](references/continuous-integration.md).

### Git Development Lifecycle Map

Git development flows through 3 phases:

**Phase 1: Workspace Setup** (Isolate your work)
- **git-worktrees** - Create isolated workspace with short-lived temp branches
- Prevents: Branch juggling, stash chaos, context switching
- Output: Clean workspace ready for focused development
- **See**: [worktree-workflows.md](./references/worktree-workflows.md)

**Phase 2: Work & Commit** (Make clean commits)
- **git-commit** - Analyze changes, filter artifacts, write Conventional Commits
- Prevents: Accidental artifact commits, unclear commit history
- Output: Professional commit history following conventions
- **See**: [commit-workflows.md](./references/commit-workflows.md)

**Phase 3: Complete & Integrate** (Finish the work)
- **git-finish** - Merge, create PR, or discard work (with tests gate)
- Prevents: Incomplete work merged, untested code integrated
- Output: Work successfully integrated or cleanly discarded
- **See**: [finish-workflows.md](./references/finish-workflows.md)

### Phase Transitions
- Setup → Work: Worktree created, ready to code
- Work → Complete: Changes committed, tests passing
- Complete → Setup: Work integrated, start next task

### Skill Selection Decision Tree

**Workspace Setup (Phase 1)**:
- Starting new feature/fix? → **git-worktrees** (isolated workspace)
- Quick fix on current branch? → Skip to Phase 2

**Work & Commit (Phase 2)**:
- Ready to commit? → **git-commit** (analyze, filter, write Conventional Commits)
- No changes yet? → Continue coding

**Complete & Integrate (Phase 3)**:
- Tests pass? → **git-finish** (merge, PR, keep, or discard)
- Tests failing? → Return to Phase 2

### Common Workflow Patterns

**Full Workflow** (new feature):
```
git-worktrees (create workspace) → Code → git-commit (commit changes) → git-finish (integrate)
```

**Quick Fix** (current branch):
```
Code → git-commit (commit fix) → git-finish (integrate)
```

**Parallel Work** (multiple features):
```
git-worktrees (feature A) → Code → git-commit
git-worktrees (feature B) → Code → git-commit
git-finish (feature A) → git-finish (feature B)
```

---

## 4. RULES

### ✅ ALWAYS

1. **Use deterministic conventional commit format** - All authored commits follow `type(scope): summary`; preserve the explicitly exempt Git-generated subjects defined below
2. **Create worktree for parallel work** - Never work on multiple features in the same worktree
3. **Verify branch is up-to-date** - Pull latest changes before creating PR
4. **Name worktree-created branches with the owner-first grammar** - Format: `{OWNER}/{NNNN}-{slug}` where `{OWNER}` is a canonical skill id (the `name:` frontmatter of an `.opencode/skills/**/SKILL.md`, e.g. `sk-git`) or the literal `skilled` for cross-cutting/system/release work, `{NNNN}` is a 4-digit zero-padded clone-wide counter, and `{slug}` is a lowercase-kebab description (e.g., `sk-git/0001-owner-first-naming`, `skilled/0002-release-hardening`). The matching directory is `.worktrees/{NNNN}-{OWNER}-{slug}`. Owner-first naming makes a Git-UI branch tree legible by owning skill instead of a flat pile. Never hand-compute `{NNNN}` — allocate it through `.opencode/skills/sk-git/scripts/worktree-naming.sh` (`create <owner> <slug> [base]` to create the worktree directly, or `allocate` to just reserve a number), which holds a clone-wide lock and seeds the counter from the stored high-water mark plus every registered worktree, local ref, and remote ref, so a number is never reissued. This is distinct from the launch wrapper's ephemeral per-session worktrees (`work/{runtime}/{slug}` + `.worktrees/{runtime}-{slug}`), which stay a separate, machine-owned, auto-managed and auto-reaped lane, intentionally not numbered or owner-scoped. Legacy `wt/{NNNN}-{name}` branches predating this convention are permitted-but-non-conformant; migrate them by renaming the branch and its directory into the owner-first form, never by rewriting history.
5. **Reference spec folder in commits** - Include spec folder path in commit body when applicable
6. **Clean up after merge** - Delete local and remote feature branches after successful merge
7. **Squash commits for clean history** - Use squash merge for feature branches with many WIP commits
8. **Defer toolchain + DB work to main on large reorgs** - For large rename/reorg, do file/`git mv` ops in the worktree but run the spec-kit toolchain (strict validate, generators, metadata regen) and ALL memory reindex/re-embed on `main` AFTER merge. A bare worktree lacks gitignored deps (`node_modules`/`dist`) and the memory/vector DBs are a single global instance — never per-worktree. See [large-reorg-playbook.md](references/large-reorg-playbook.md).
9. **Scan for gitignored leftovers after a rename wave** - After `git mv` + merge, detect dirs with disk files but 0 tracked files (`git ls-files <dir>` empty and `git status --porcelain --untracked-files=all` clean) and `rm -rf` them — they are stale ignored cruft (`.DS_Store`, `*.log`, `*.pyc`) left behind by `git mv`.
10. **Verify rename history is preserved** - After a rename wave confirm `R`-status (not delete+add) before commit, and after merge confirm the tree has no old+new duplicate folders.
11. **GitHub release bodies never start with an H1** - The release title field already renders `vX.X.X.X — Title`; a body-leading `# vX.X.X.X` duplicates it on the Releases page. The H1 belongs ONLY to the changelog md file in the repo. When publishing from a changelog file, strip the leading H1 (and following blank lines) into a temp notes file before `gh release create/edit --notes-file`. Full mechanics: [finish-workflows.md](references/finish-workflows.md) Step 6.
12. **Route GitKraken MCP's local-mutation tools back to Bash** - GitKraken MCP (`gitkraken.gitkraken_*`) exposes `git_add_or_commit`, `git_push`, `git_pull`, `git_fetch`, `git_checkout`, `git_branch`, `git_worktree`, and `git_stash`, which duplicate local git mutations already gated by this skill's no-direct-branch-creation rule (❌ NEVER #2), numbered worktree naming (✅ ALWAYS #4), and the commit-message logic below. Never call these GitKraken MCP tools as a substitute for the existing Bash-based workflow; reserve GitKraken MCP for GitLens AI workflows and cross-platform issue/PR/repository operations with no local equivalent. Full detail: [gitkraken-mcp-integration.md](references/gitkraken-mcp-integration.md) §2.
13. **Honor an authorized operator's explicit direct-push directive on a protected branch** - Protected-branch rules (PR-required, verified signatures, code scanning) primarily gate EXTERNAL contributors. When the operator holds bypass rights and explicitly asks to commit/push directly to a protected branch, do a direct `git push` — do NOT default to a PR detour, re-ask whether to use a PR, or frame the bypass / resulting unsigned commit as a problem. Still apply full commit hygiene: scope the commit to the intended files only (a shared or dirty tree may hold concurrent work — never blind `git add -A`), use Conventional Commits, and report plainly that the push bypassed protection. Whether a given operator/repo grants that bypass authority is recorded in operator memory, not in this codebase-agnostic skill.
14. **Commit substantial work before an autostash-prone operation** - `git merge|pull|rebase --autostash` (and any `pull.rebase=true` / `rebase.autoStash=true` config) stashes the uncommitted tree, runs the operation, then re-applies it — but on a re-apply CONFLICT git leaves the whole changeset stranded in the stash behind a warning that tool-driven git easily swallows, one `git stash drop`/`clear`/gc away from permanent loss. Before merging/pulling/rebasing a large or shared-branch changeset, COMMIT it (or make an explicit `git stash` you own and pop yourself) instead of relying on `--autostash` for the changeset. The `post-merge`/`post-rewrite` guard ([git-hooks/lib/autostash-orphan-guard.sh](../../scripts/git-hooks/lib/autostash-orphan-guard.sh)) is a safety net, not a substitute: it anchors every autostash under `refs/autostash-rescue/<sha>` (GC-proof) and prints a visible, logged alert. If that alert is still present after the operation completes, your work was NOT re-applied — recover with `git stash pop` and commit immediately, BEFORE any `git stash drop/clear`.
15. **Reconcile the primary checkout after pushing a detached/worktree HEAD to a shared branch** - `git push origin HEAD:<branch>` from a detached HEAD or an isolated worktree advances the REMOTE `<branch>` but never moves the local `<branch>` ref that another checkout (typically the operator's primary tree) has checked out, so the pushed work is safe on origin yet INVISIBLE there until a separate sync — the work looks "lost" when it is not. After such a push, verify the primary checkout's `<branch>` actually contains the pushed commit; if it does not, state plainly that the work is on origin but not yet in that tree and hand over the safe sync recipe. NEVER stash/rebase/reset a primary tree that is dirty, diverged, or owned by a concurrent session (its own stash on the stack, its HEAD moving between commands) — forcing a sync there risks orphaning that session's autostash (ALWAYS #14) or clobbering its in-flight commits; give the operator the recipe to run from a clean tree instead. See [finish-workflows.md](references/finish-workflows.md) Step 5b.
16. **Let launch-wrapper sessions autosync; never hand-roll the publish** - Under the continuous-integration model, a launch-wrapper session publishes each commit to the live branch automatically via the `post-commit` hook calling `git-sync.sh` (gated on the wrapper-injected `SPECKIT_AUTOSYNC=1` + `SPECKIT_LIVE_BRANCH`). Do NOT manually `git push origin HEAD:<live>` or manually rebase onto the live branch to "make work visible" — `git-sync.sh` already fast-forwards-or-rebases and never force-pushes; a hand-rolled push risks the exact non-force / abort-on-conflict invariants it protects. If autosync is blocked (a printed conflict), resolve per its message; do not force it. The primary checkout follows via `git-live-follow.sh` (fast-forward-only) and is never worked in. Full contract: [continuous-integration.md](references/continuous-integration.md).
17. **Reap worktrees before branches, and only the exempt wrapper lane** - When cleaning up a finished worktree, always remove the worktree directory (`git worktree remove`) BEFORE deleting its branch (`git branch -d`) — a branch still checked out by a worktree cannot be deleted, so removal must lead. `.opencode/bin/worktree-reaper.sh` auto-reaps ONLY the launch-wrapper lane (`work/{runtime}/{slug}` pairs), and only when all three hold: the tree is clean, the branch is merged into the LIVE integration tip (the primary checkout's actual `HEAD`, not a possibly-stale local `main`), and the session is proven inactive by its marker file (`<common-git-dir>/worktree-sessions/<runtime>-<slug>.pid` recording a now-dead pid). Owner-first task worktrees, detached worktrees, and any wrapper worktree with a missing/unreadable marker or a live pid are always report-only — the reaper never removes them; absence of proof is never proof of absence. Enforcement of the naming grammar itself is a migration-tolerant pre-push hook: it only gates the creation of brand-new remote branches (existing non-conformant branches are never rewritten or blocked), and it never blocks `skilled/v*` release branches.

### Commit Message Logic (Human-Clear and AI-Deterministic)

Use this logic whenever an AI writes or rewrites a commit message. The goal is
a subject that explains the outcome in `git log --oneline` and a body that
explains the reason without requiring packet knowledge or internal jargon.
Enforced structurally (not clarity semantics) by the `commit-msg` hook — see
[git-hooks/commit-msg](../../scripts/git-hooks/commit-msg); bypass with
`SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git commit ...` only when the hook is
genuinely wrong about a specific message, not to skip writing a real one.

#### 1. Classify Special Git Messages

Preserve Git-generated subjects unchanged when they begin with `Merge `,
`Revert "`, `fixup! `, `squash! `, or `amend! `.

Intentional checkpoints are not exempt. Write them as
`chore(wip): checkpoint <specific state>` or use the documented bypass when
a deliberately non-conventional message is required.

#### 2. Authored Subject Contract

Format:

```text
type(scope)[!]: imperative summary
```

Allowed types:

`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `merge`, `perf`, `refactor`,
`release`, `revert`, `style`, `test`.

Hard requirements:

- Type and scope are required for every authored subject.
- Scope is lowercase kebab-case, a stable subsystem name, and not a packet,
  phase, task, or other numeric-only identifier.
- Summary starts with a lowercase imperative verb.
- Summary names the changed behavior or artifact, not the work process.
- Summary does not end with punctuation or contain repeated spaces.
- Summary is specific enough to distinguish this commit from adjacent work.
- Subject should be at most 80 characters and must not exceed 100 characters.
- A `!` requires a `BREAKING CHANGE:` footer.

Do not use vague summaries such as `update`, `changes`, `fix bug`, `cleanup`,
`misc changes`, `work in progress`, or `update stuff`.

Move process metadata such as packet numbers, phases, waves, lanes, task
counts, model names, review rounds, remediation labels, and verification
claims to the body or `Refs:` line unless the term is part of the behavior
being changed.

#### 3. Type Selection Order

Use first match:

1. `release` for publishing a version or release.
2. `docs` when every substantive changed path is documentation.
3. `fix` when existing behavior was incorrect, unsafe, or failing.
4. `feat` when the commit adds new usable behavior or support.
5. `perf` when measured performance improves without changing behavior.
6. `refactor` when implementation structure changes without behavior changes.
7. `test` when only tests or test fixtures change.
8. `ci` when only CI workflow behavior changes.
9. `build` when only build or dependency mechanics change.
10. `style` when only formatting changes.
11. `revert` or `merge` for authored revert or merge messages.
12. `chore` only when no more specific type applies.

Tests and documentation shipped with a feature or fix inherit that feature or
fix type. Do not choose `chore` merely because the commit touches many files.

#### 4. Scope Selection Order

Use first match after identifying the one logical owner:

1. One owning `.opencode/skills/<name>/...` subsystem -> `<name>`.
2. `.opencode/scripts/git-hooks/...` or its installer -> `git-hooks`.
3. `AGENTS.md` or runtime agent definitions -> `agents`.
4. `.opencode/commands/...` -> `commands`.
5. `opencode.json`, `.utcp_config.json`, or equivalent root config -> `config`.
6. Root `README.md` only -> `readme`.
7. Spec-document or generated packet-metadata maintenance only -> `specs`.
8. Documentation spanning multiple owners -> `docs`.
9. One dominant top-level component -> that component's lowercase name.
10. Inseparable cross-repository change -> `repo`.

If two independent owners remain, split the commit instead of inventing a
combined scope. Never use a numeric packet identifier as the scope.

#### 5. Summary Construction

Apply this sequence:

1. State the primary outcome of the staged diff.
2. Start with the action: `add`, `prevent`, `preserve`, `route`, `remove`,
   `restore`, `clarify`, `split`, or another precise imperative verb.
3. Name the affected behavior or artifact.
4. Add the user-visible or system-visible effect when the object alone is
   ambiguous.
5. Remove implementation chronology, review claims, packet labels, and
   duplicate Conventional Commit prefixes.
6. Read only the subject and ask: "Would a maintainer understand what changed
   without opening the packet?" If not, rewrite it.

#### 6. Body Contract

A body is required when any condition applies:

- Four or more paths are staged.
- The change fixes a regression, failure, race, security issue, or data risk.
- The reason or tradeoff is not obvious from the subject.
- The change is breaking or has migration requirements.
- The commit spans code plus generated metadata or multiple repository areas.

A body may be omitted only for a small, self-explanatory change affecting at
most three paths.

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

Use only sections that carry useful information. Explain internal terms on
first use. Verification claims must state what actually ran and its result.

#### 7. Deterministic Self-Check

Before committing, verify in order:

1. Special Git-generated message, or valid authored format.
2. Type selected by the first matching type rule.
3. Scope selected by the first matching scope rule and not numeric-only.
4. Summary contains an imperative action and a concrete object.
5. Subject is understandable without packet or workflow context.
6. Subject is at most 100 characters; rewrite when over 80 if possible.
7. Required body explains why and records meaningful verification.
8. Breaking behavior has `!` and a `BREAKING CHANGE:` footer.
9. The same staged diff and metadata would produce the same subject again.

### ⛔ NEVER

1. **Force push to main/master** - Protected branches must never receive force pushes
2. **Never create branches directly** - Use `git worktree add -b ...`; never use `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`
3. **Commit directly to protected branches WITHOUT operator authorization** - Default to feature branches + PRs. EXCEPTION: when the operator has bypass authority on that branch and explicitly directs a direct commit/push, honor it (see ALWAYS #13) — do not force a PR detour.
4. **Leave worktrees uncleaned** - Remove worktree directories after merge
5. **Commit secrets or credentials** - Use environment variables or secret management
6. **Create PRs without description** - Always include context, changes, and testing notes
7. **Merge without CI passing** - Wait for all checks to complete
8. **Rebase public/shared branches** - Only rebase local, unpushed commits
9. **Bypass a git hook with `--no-verify`** - Never skip commit-msg, pre-commit, or pre-push validation with `--no-verify`; if a hook is genuinely wrong about a specific case, fix the hook or use its own documented override (e.g. `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`), not a blanket hook bypass
10. **Amend a commit that has already been pushed or merged** - Rewriting published history breaks other clones' ancestry and any autosynced live branch; commit a new change (or `git revert`) instead once a commit has left the local repo

### ⚠️ ESCALATE IF

1. **Merge conflicts cannot be auto-resolved** - Complex conflicts require human decision on which changes to keep
2. **GitHub MCP returns authentication errors** - Token may be expired or permissions insufficient
3. **Worktree directory is locked or corrupted** - May require manual cleanup with `git worktree prune`
4. **Force push to protected branch is requested** - This requires explicit approval and understanding of consequences
5. **CI/CD pipeline fails repeatedly** - May indicate infrastructure issues beyond code problems
6. **Branch divergence exceeds 50 commits** - Large divergence suggests need for incremental merging strategy
7. **Submodule conflicts detected** - Submodule updates require careful coordination
8. **Strict-validate run inside a bare worktree** - Its exit code is meaningless (missing gitignored deps may make it silently no-op on zero files). Re-run on `main` post-merge before trusting any result. See [large-reorg-playbook.md](references/large-reorg-playbook.md).

---

## 5. REFERENCES

### Core Workflows
| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [worktree-workflows.md](references/worktree-workflows.md) | 7-step workspace creation | Directory selection, branch strategies, large-reorg caveats (§8b) |
| [large-reorg-playbook.md](references/large-reorg-playbook.md) | Step-ordered large rename/reorg runbook | Worktree-only renames; toolchain + DB run on main post-merge |
| [commit-workflows.md](references/commit-workflows.md) | 7-step commit workflow | Artifact filtering, Conventional Commits, scoped-staging discipline for a dirty tree / unrelated WIP (§3 Step 7) |
| [finish-workflows.md](references/finish-workflows.md) | 5-step completion flow | PR creation, cleanup, merge |
| [continuous-integration.md](references/continuous-integration.md) | Always-current live branch | Autosync each commit to a shared live branch the IDE follows; per-session isolation preserved; non-force / abort-on-conflict safety contract |
| [shared-patterns.md](references/shared-patterns.md) | Reusable git patterns | Error recovery, conflict resolution, rename-heavy / large-reorg merge verification (§10) |
| [quick-reference.md](references/quick-reference.md) | Command cheat sheet | Common operations |
| [github-mcp-integration.md](references/github-mcp-integration.md) | GitHub MCP remote ops | PRs, issues, CI/CD via Code Mode |
| [gitkraken-mcp-integration.md](references/gitkraken-mcp-integration.md) | GitKraken MCP cross-platform ops | GitLens AI workflows, PRs/issues across GitHub/GitLab/Azure DevOps/Bitbucket/Jira via Code Mode |

### Assets
| Asset | Purpose | Usage |
|-------|---------|-------|
| [worktree-checklist.md](assets/worktree-checklist.md) | Worktree creation checklist | Pre-flight verification |
| [commit-message-template.md](assets/commit-message-template.md) | Commit format guide | Conventional Commits |
| [pr-template.md](assets/pr-template.md) | PR description template | Consistent PR format |

---

## 6. SUCCESS CRITERIA

### Workspace Setup Complete
- Workspace prepared in the selected mode (`git worktree` or current branch)
- If a worktree was selected, it was created in the correct directory (`.worktrees/` or user-specified)
- Any worktree-created branch naming follows convention (`{OWNER}/{NNNN}-{slug}`)
- User confirmed workspace choice (worktree/current branch)

### Commit Complete
- All changes reviewed and categorized
- Artifacts filtered out (build files, coverage, etc.)
- Commit message follows Conventional Commits format
- Only public-value files staged

### Integration Complete
- Tests pass before merge/PR
- PR description includes context, changes, and testing notes
- Branch up-to-date with base branch
- Worktree cleaned up after merge (if used)
- Local and remote feature branches deleted

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

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Gate 3**: File modifications require spec folder question per AGENTS.md Gate 3 (HARD BLOCK)
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Continuity**: `/speckit:resume` is the recovery surface; canonical packet context is read from `handover.md -> _memory.continuity -> spec docs`

### Continuity Integration

Use canonical packet continuity for context recovery first, then use Spec Kit Memory MCP only when packet-native sources are exhausted:

```text
// Recover the active packet before planning git work
/speckit:resume
// Recovery order: handover.md -> _memory.continuity -> spec docs

// If packet-native sources are exhausted, use Spec Kit Memory MCP for wider lookups
memory_search({ query: "branch strategy decisions", includeContent: true })

// After major commits or workflow completion
// Save context with: /memory:save or "save context to [spec-folder]"
```

**Best Practices**:
- Use `/speckit:resume` at session start to recover active packet context
- Prefer `handover.md`, `_memory.continuity`, and canonical spec docs before broader memory queries
- Save context after significant commits or before ending a session
- Reference spec folder in commit messages for traceability

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/quick-reference.md`, `references/worktree-workflows.md`, `references/commit-workflows.md`, `references/finish-workflows.md`, `references/github-mcp-integration.md`, `references/shared-patterns.md`, `assets/commit-message-template.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

### Manual Testing Playbook

Manual testing scenarios for this skill live in `manual-testing-playbook/manual-testing-playbook.md` (root index) plus 41 per-feature scenario files (`GIT-001`..`GIT-041`) across 7 category directories under `manual-testing-playbook/<topic>/<scenario>.md` — worktree setup, commit formation, safety refusals, integration and PR, recovery and edge cases, cross-CLI orchestration, and owner-first worktree tooling. Run scenarios via `bash .opencode/skills/sk-doc/scripts/validate_document.py manual-testing-playbook/manual-testing-playbook.md` for structural validation; execute scenarios in opencode/Claude/OpenCode sessions for behavioral verification.

### Feature Catalog

A companion `feature-catalog/feature-catalog.md` package catalogs every sk-git capability with its entry point — the owner-first naming allocator/validators (`scripts/worktree-naming.sh`), launch-wrapper session isolation (`.opencode/bin/worktree-session.sh`), the worktree reaper (`.opencode/bin/worktree-reaper.sh`), the pre-push naming hook (`.opencode/scripts/git-hooks/pre-push`), continuous-integration autosync, and the worktree/commit/finish/GitKraken/GitHub/large-reorg workflows.

Related skills: `system-spec-kit` for packet recovery and continuity, and `sk-doc` for PR, release, and documentation quality.
