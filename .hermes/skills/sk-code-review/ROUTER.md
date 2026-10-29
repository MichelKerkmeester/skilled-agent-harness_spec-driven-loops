---
title: "sk-code-review Mode - Stack-Agnostic Findings-First Review Router"
description: "Sibling router for sk-code-review: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-code-review router"
  - "sk-code-review routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# sk-code-review Mode - Stack-Agnostic Findings-First Review Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-code/sk-code-review/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this mode when they ask for code review, PR review, merge readiness, an audit, a security review, request changes or findings over a diff. Its vocabulary is `review`, `code review`, `pr review`, `audit`, `security review`, `request changes`, `findings`, `blocking issues` and `merge readiness`. It routes to two resource families: the `references/` doctrine, which starts at `references/review-core.md` and adds the single-pass UX flow, the lightweight index and the PR-state dedup rules, and the `assets/` checklists and templates for security, correctness and quality, SOLID, dead-code removal, test quality and fix completeness.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`SECURITY`** fires on `security`, `auth`, `injection`, `vulnerability` and `race` at weight 5, the highest in the packet. It loads `assets/security-checklist.md`.
- **`QUALITY`** fires on `correctness`, `bug`, `regression`, `performance`, `boundary`, `contract`, `breaking change`, `backward compatible` and `compatibility` at weight 4. It loads `assets/code-quality-checklist.md`.
- **`KISS`** fires on `kiss`, `simple`, `simplicity`, `over-engineer` and `overengineering` at weight 3. It loads `assets/code-quality-checklist.md`, the file `QUALITY` and `DRY` also select.
- **`DRY`** fires on `dry`, `duplication`, `duplicate`, `copy-paste` and `repeated logic` at weight 3. It loads `assets/code-quality-checklist.md`.
- **`SOLID`** fires on `solid`, `architecture`, `design`, `coupling`, `cohesion`, `module`, `adapter`, `interface`, `abstraction`, `responsibility`, `dependency` and `boundary` at weight 3. It loads `assets/solid-checklist.md`.
- **`REMOVAL`** fires on `remove`, `dead code`, `cleanup` and `deprecate` at weight 3. It loads `assets/removal-plan.md`.
- **`TESTING`** fires on `test`, `tests`, `testing`, `coverage`, `assertion`, `mock`, `stub`, `fixture`, `test quality` and `brittle` at weight 3. It loads `assets/test-quality-checklist.md`.
- **`CORE`** fires on `review doctrine`, `review standards`, `review baseline`, `single pass`, `single-pass`, `interactive review` and `one-pass review` at weight 2. It loads `references/review-core.md` and `references/review-ux-single-pass.md`.
- **`COMPLETENESS`** fires on `fix completeness`, `incomplete fix`, `partial fix`, `complete the fix`, `all call sites`, `leftover` and `half-done` at weight 3. It loads `assets/fix-completeness-checklist.md`.
- **`PR_STATE`** fires on `pr state`, `pull request state`, `dedup`, `deduplicate`, `duplicate finding`, `already flagged`, `prior comment` and `repeated finding` at weight 3. It loads `references/pr-state-dedup.md`.
- **`SETUP`** fires on `quick reference`, `review setup`, `how to review`, `review workflow` and `review cheat sheet` at weight 2. It loads `references/quick-reference.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's deterministic intent-to-reference routing. Paths are relative to this skill root.

### Resource loading levels

| Level | Rule |
| --- | --- |
| ALWAYS | `DEFAULT_RESOURCES` |
| CONDITIONAL | `RESOURCE_MAP[intent]` |
| ON_DEMAND | every `RESOURCE_MAP` target when an `ON_DEMAND_KEYWORDS` term matches |

```python
import re
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
# Discover resources recursively across references and assets.
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCES = [
    "references/review-core.md",
    "references/review-ux-single-pass.md",
    "assets/security-checklist.md",
    "assets/code-quality-checklist.md",
    "assets/fix-completeness-checklist.md",
]

INTENT_SIGNALS = {
    "SECURITY": {"weight": 5, "keywords": ["security", "auth", "injection", "vulnerability", "race"]},
    "QUALITY": {"weight": 4, "keywords": ["correctness", "bug", "regression", "performance", "boundary", "contract", "breaking change", "backward compatible", "compatibility"]},
    "KISS": {"weight": 3, "keywords": ["kiss", "simple", "simplicity", "over-engineer", "overengineering"]},
    "DRY": {"weight": 3, "keywords": ["dry", "duplication", "duplicate", "copy-paste", "repeated logic"]},
    "SOLID": {"weight": 3, "keywords": ["solid", "architecture", "design", "coupling", "cohesion", "module", "adapter", "interface", "abstraction", "responsibility", "dependency", "boundary"]},
    "REMOVAL": {"weight": 3, "keywords": ["remove", "dead code", "cleanup", "deprecate"]},
    "TESTING": {"weight": 3, "keywords": ["test", "tests", "testing", "coverage", "assertion", "mock", "stub", "fixture", "test quality", "brittle"]},
    "CORE": {"weight": 2, "keywords": ["review doctrine", "review standards", "review baseline", "single pass", "single-pass", "interactive review", "one-pass review"]},
    "COMPLETENESS": {"weight": 3, "keywords": ["fix completeness", "incomplete fix", "partial fix", "complete the fix", "all call sites", "leftover", "half-done"]},
    "PR_STATE": {"weight": 3, "keywords": ["pr state", "pull request state", "dedup", "deduplicate", "duplicate finding", "already flagged", "prior comment", "repeated finding"]},
    "SETUP": {"weight": 2, "keywords": ["quick reference", "review setup", "how to review", "review workflow", "review cheat sheet"]},
}

RESOURCE_MAP = {
    "SECURITY": ["assets/security-checklist.md"],
    "QUALITY": ["assets/code-quality-checklist.md"],
    "KISS": ["assets/code-quality-checklist.md"],
    "DRY": ["assets/code-quality-checklist.md"],
    "SOLID": ["assets/solid-checklist.md"],
    "REMOVAL": ["assets/removal-plan.md"],
    "TESTING": ["assets/test-quality-checklist.md"],
    "CORE": ["references/review-core.md", "references/review-ux-single-pass.md"],
    "COMPLETENESS": ["assets/fix-completeness-checklist.md"],
    "PR_STATE": ["references/pr-state-dedup.md"],
    "SETUP": ["references/quick-reference.md"],
}

ON_DEMAND_KEYWORDS = ["deep review", "full review", "all checks", "comprehensive", "flag false positives", "blocking regressions", "list findings", "read-only only", "underrepresented", "scope correctly"]
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm review scope (diff/staged/files/commit range)",
    "Confirm risk priority (security/correctness/performance/maintainability/test quality/contract safety)",
    "Confirm architecture lens (KISS/DRY/SOLID required or optional)",
    "Confirm stack context (system-code/web/full-stack)",
    "Confirm findings-only vs findings+fix follow-up",
]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "description", "")),
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
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def keyword_present(keyword: str, text: str) -> bool:
    """Boundary-aware match: bare substrings misroute ('pr' in 'improve prompt')."""
    return re.search(rf"(?<![a-z0-9]){re.escape(keyword)}(?![a-z0-9])", text) is not None

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword_present(keyword, text):
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUALITY"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

# Rule overrides: the resolver algorithm lives in review-core.md, section 9.

def route_review_resources(task):
    inventory = discover_markdown_resources()
    text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)

    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in DEFAULT_RESOURCES:
        load_if_available(relative_path)

    if sum(scores.values()) < 0.5:
        return {
            "intents": ["QUALITY"],
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    if any(keyword_present(keyword, text) for keyword in ON_DEMAND_KEYWORDS):
        for paths in RESOURCE_MAP.values():
            for relative_path in paths:
                load_if_available(relative_path)

    return {"intents": intents, "scores": scores, "resources": loaded}
```
