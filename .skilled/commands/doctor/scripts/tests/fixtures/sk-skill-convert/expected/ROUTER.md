---
title: "sk-git Router"
description: "Sibling router for sk-git: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-git router"
  - "sk-git routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# sk-git Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request that names a worktree, a commit, a pull request, a merge, a finish, GitKraken or GitLens reaches sk-git, and this router picks from the worktree, commit, finish, GitKraken-MCP and shared-pattern reference families rather than from the whole folder. Spec folders and code implementation are routed elsewhere, so they never pull these files. A request whose keywords barely score loads the shared patterns and asks a disambiguation checklist instead of guessing.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **WORKSPACE_SETUP** — "worktree / create worktree / numbered worktree / restructure worktrees / workspace / parallel work" requests load `references/worktree-workflows.md` and `assets/worktree-checklist.md`. The near-miss phrasings "dirty workspace", "unclean" and "mixed changes" add weight to this intent without firing it alone.
- **COMMIT** — "commit / staged / message / conventional commit" requests load `references/commit-workflows.md` and `assets/commit-message-template.md`. "half-staged", "boundary" and "split commit" add weight to the same intent.
- **FINISH** — "finish / merge / pr / pull request / integrate" requests load `references/finish-workflows.md`, `assets/pr-template.md` and `references/github-mcp-integration.md`, the last one because a PR is opened across providers. "ship", "hotfix", "trunk" and "minimal risk" add weight.
- **GITKRAKEN_MCP** — "gitkraken / gitlens / launchpad / commit composer / cross-platform pr / multi-provider issue / gitlens start review / gitlens start work" requests load `references/gitkraken-mcp-integration.md` and nothing else, so the GUI and MCP path stays separate from the CLI flows.
- **SHARED_PATTERNS** — "convention / pattern / reference / branch naming" requests load `references/shared-patterns.md`, and every request that scores near zero loads it too, then adds the disambiguation checklist rather than defaulting to a family.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail behind the short summary: the loading levels and the router pseudocode.

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
    """Ambiguity selection: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md.

    Keep intents within ambiguity_delta of the top score, up to 2, or 3 under NOISY_SYNONYMS noise.
    """

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
