---
description: "Stack detection via marker files, intent classification, resource routing, and load-level selection"
---
# Smart Routing

Handles automatic stack detection, intent classification, and resource loading for the development orchestrator.

## Stack Detection

Stack detection is explicit and ordered. First match wins, then verification commands are selected for that stack.

```bash
[ -f "go.mod" ] && STACK="GO"
[ -f "Package.swift" ] && STACK="SWIFT"
[ -f "app.json" ] && grep -q "expo" app.json 2>/dev/null && STACK="REACT_NATIVE"
[ -f "package.json" ] && grep -Eq 'react-native|expo' package.json && STACK="REACT_NATIVE"
[ -f "next.config.js" -o -f "next.config.mjs" -o -f "next.config.ts" ] && STACK="REACT"
[ -f "package.json" ] && grep -Eq '"next"|"react"' package.json && STACK="REACT"
[ -f "package.json" ] && STACK="NODEJS"
```

## Phase Detection

```
TASK CONTEXT
    |
    +- STEP 0: Detect stack from marker files (routing + verification commands)
    |
    +- STEP 1: Weighted intent scoring (top-2 when ambiguity delta is small)
    |
    +- Phase 1: Implementation -> stack standards, architecture, patterns
    +- Phase 2: Testing/Debugging -> testing/debug resources + debugging checklist
    +- Phase 3: Verification -> stack verification commands + verification checklist
```

## Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `INTENT_MODEL`.

Knowledge is bundled in stack domains under `references/` and `assets/`:

```text
references/backend/go/
references/backend/nodejs/
references/frontend/react/
references/mobile/react-native/
references/mobile/swift/

assets/{category}/{stack}/checklists/
assets/{category}/{stack}/patterns/
```

## Resource Loading Levels

| Level       | When to Load             | Resources                        |
| ----------- | ------------------------ | -------------------------------- |
| ALWAYS      | Every skill invocation   | Stack standards baseline         |
| CONDITIONAL | If intent signals match  | Stack-focused docs + checklists  |
| ON_DEMAND   | Only on explicit request | Deeper stack references/patterns |

## Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/frontend/react/react_nextjs_standards.md"

STACK_FOLDERS = {
    "GO": ("backend", "go"),
    "NODEJS": ("backend", "nodejs"),
    "REACT": ("frontend", "react"),
    "REACT_NATIVE": ("mobile", "react-native"),
    "SWIFT": ("mobile", "swift"),
}

STACK_VERIFICATION_COMMANDS = {
    "GO": ["go test ./...", "golangci-lint run", "go build ./..."],
    "NODEJS": ["npm test", "npx eslint .", "npm run build"],
    "REACT": ["npm test", "npx eslint .", "npm run build"],
    "REACT_NATIVE": ["npm test", "npx eslint .", "npx expo export"],
    "SWIFT": ["swift test", "swiftlint", "swift build"],
}

NOISY_SYNONYMS = {
    "DEBUGGING": ["unstable", "janky", "freeze", "stutter", "regression", "flaky", "broken"],
    "TESTING": ["intermittent", "ci", "pipeline", "nondeterministic", "race"],
    "VERIFICATION": ["prove", "evidence", "before claiming", "sign off"],
}

MULTI_SYMPTOM_TERMS = [
    "unstable", "janky", "freeze", "stutter", "regression", "flaky", "empty payload", "intermittent"
]

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm target stack or provide marker files (go.mod, package.json, app.json, Package.swift)",
    "Name affected runtime path (web, mobile, backend, CI)",
    "Share one reproducible error/log snippet",
    "State current phase (implementation/debugging/verification)",
    "Confirm expected verification command set before completion claim",
]

INTENT_MODEL = {
    "IMPLEMENTATION": {"keywords": [("implement", 4), ("build", 3), ("create", 3), ("feature", 3)]},
    "DEBUGGING": {"keywords": [("bug", 4), ("fix", 4), ("error", 4), ("broken", 3)]},
    "TESTING": {"keywords": [("test", 4), ("unit", 2), ("integration", 2), ("coverage", 2)]},
    "VERIFICATION": {"keywords": [("verify", 4), ("done", 3), ("complete", 3), ("works", 2)]},
    "DATABASE": {"keywords": [("database", 4), ("sql", 3), ("migration", 3), ("schema", 2)]},
    "API": {"keywords": [("api", 4), ("endpoint", 3), ("handler", 3), ("route", 2)]},
    "DEPLOYMENT": {"keywords": [("deploy", 4), ("release", 3), ("docker", 3), ("kubernetes", 3)]},
}

LOAD_LEVELS = {
    "VERIFICATION": "MINIMAL",
    "DEBUGGING": "DEBUGGING",
    "TESTING": "FOCUSED",
    "DATABASE": "FOCUSED",
    "API": "FOCUSED",
    "DEPLOYMENT": "FOCUSED",
    "IMPLEMENTATION": "STANDARD",
}

AMBIGUITY_DELTA = 1

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
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

def detect_stack_candidates(workspace_files, package_json_text="", app_json_text="") -> list[str]:
    workspace = set(workspace_files or [])
    package_json = (package_json_text or "").lower()
    app_json = (app_json_text or "").lower()
    candidates = []

    if "go.mod" in workspace:
        candidates.append("GO")
    if "Package.swift" in workspace or any(name.endswith(".xcodeproj") for name in workspace):
        candidates.append("SWIFT")
    if "app.json" in workspace and "expo" in app_json:
        candidates.append("REACT_NATIVE")
    if "package.json" in workspace and ("react-native" in package_json or "expo" in package_json):
        candidates.append("REACT_NATIVE")
    if "next.config.js" in workspace or "next.config.mjs" in workspace or "next.config.ts" in workspace:
        candidates.append("REACT")
    if "package.json" in workspace and ("\"next\"" in package_json or "\"react\"" in package_json):
        candidates.append("REACT")
    if "package.json" in workspace:
        candidates.append("NODEJS")

    deduped = []
    seen = set()
    for stack_name in candidates:
        if stack_name not in seen:
            deduped.append(stack_name)
            seen.add(stack_name)
    return deduped or ["NODEJS"]

def detect_stack(workspace_files, package_json_text="", app_json_text="") -> str:
    return detect_stack_candidates(workspace_files, package_json_text, app_json_text)[0]

def classify_intents(user_request, task=None):
    text = (user_request or "").lower()
    intent_scores = {intent: 0 for intent in INTENT_MODEL}

    for intent, cfg in INTENT_MODEL.items():
        for keyword, weight in cfg["keywords"]:
            if keyword in text:
                intent_scores[intent] += weight

    for intent, synonyms in NOISY_SYNONYMS.items():
        for synonym in synonyms:
            if synonym in text:
                intent_scores[intent] += 1.2

    if task and getattr(task, "needs_verification", False):
        intent_scores["VERIFICATION"] += 5
    if task and getattr(task, "is_debugging", False):
        intent_scores["DEBUGGING"] += 5
    if task and getattr(task, "is_testing", False):
        intent_scores["TESTING"] += 4

    ranked = sorted(intent_scores.items(), key=lambda pair: pair[1], reverse=True)
    primary_intent, primary_score = ranked[0]
    if primary_score == 0:
        return ("IMPLEMENTATION", None, intent_scores)

    secondary_intent, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary_intent, secondary_intent, intent_scores)
    return (primary_intent, None, intent_scores)

def select_load_level(primary_intent: str) -> str:
    return LOAD_LEVELS.get(primary_intent, "STANDARD")

def _filter_paths(paths, keywords):
    if not keywords:
        return paths
    lowered = [keyword.lower() for keyword in keywords]
    return [path for path in paths if any(keyword in path.lower() for keyword in lowered)]

def verification_commands_for(stack: str):
    return STACK_VERIFICATION_COMMANDS.get(stack, STACK_VERIFICATION_COMMANDS["NODEJS"])

def verification_command_candidates(stacks: list[str]) -> dict[str, list[str]]:
    return {stack_name: verification_commands_for(stack_name) for stack_name in stacks}

def select_intents(scores: dict[str, float], task_text: str, ambiguity_delta: float = 0.8, base_max_intents: int = 2, adaptive_max_intents: int = 3) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["IMPLEMENTATION"]

    noisy_hits = sum(1 for term in MULTI_SYMPTOM_TERMS if term in (task_text or ""))
    max_intents = adaptive_max_intents if noisy_hits >= 3 else base_max_intents

    selected = [ranked[0][0]]
    for intent, score in ranked[1:]:
        if score <= 0:
            continue
        if (ranked[0][1] - score) <= ambiguity_delta:
            selected.append(intent)
        if len(selected) >= max_intents:
            break
    return selected

def route_resources(user_request, task=None, workspace_files=None, package_json_text="", app_json_text=""):
    inventory = discover_markdown_resources()
    task = task or type("Task", (), {"query": user_request})()

    stack_candidates = detect_stack_candidates(workspace_files, package_json_text, app_json_text)
    stack = stack_candidates[0]
    category, folder = STACK_FOLDERS.get(stack, STACK_FOLDERS["NODEJS"])
    primary, secondary, intent_scores = classify_intents(user_request, task)
    task_text = _task_text(task)
    active_intents = select_intents(intent_scores, task_text, ambiguity_delta=0.8)
    load_level = select_load_level(primary)

    stack_ref_prefix = f"references/{category}/{folder}/"
    stack_asset_prefix = f"assets/{category}/{folder}/"
    stack_refs = sorted(path for path in inventory if path.startswith(stack_ref_prefix))
    stack_assets = sorted(path for path in inventory if path.startswith(stack_asset_prefix))

    loaded = []
    seen = set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)

    if sum(intent_scores.values()) < 0.5:
        load_if_available(f"assets/{category}/{folder}/checklists/debugging_checklist.md")
        load_if_available(f"assets/{category}/{folder}/checklists/verification_checklist.md")
        return {
            "stack": stack,
            "stack_candidates": stack_candidates,
            "intents": ["IMPLEMENTATION"],
            "intent_scores": intent_scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "verification_commands": verification_command_candidates(stack_candidates),
            "resources": loaded,
        }

    if load_level == "MINIMAL":
        load_if_available(f"assets/{category}/{folder}/checklists/verification_checklist.md")
    elif load_level == "DEBUGGING":
        debug_refs = _filter_paths(stack_refs, ["test", "debug", "error", "issue"])
        for path in (debug_refs or stack_refs[:6]):
            load_if_available(path)
        load_if_available(f"assets/{category}/{folder}/checklists/debugging_checklist.md")
    elif load_level == "FOCUSED":
        focused_keywords = [keyword for keyword, _weight in INTENT_MODEL.get(primary, {}).get("keywords", [])]
        focused_refs = _filter_paths(stack_refs, focused_keywords)
        for path in (focused_refs or stack_refs[:6]):
            load_if_available(path)
    else:
        for path in stack_refs:
            load_if_available(path)
        for path in stack_assets:
            load_if_available(path)

    return {
        "stack": stack,
        "stack_candidates": stack_candidates,
        "intents": active_intents,
        "intent_scores": intent_scores,
        "load_level": load_level,
        "verification_commands": verification_command_candidates(stack_candidates),
        "resources": loaded,
    }
```

## Cross References
- [[when-to-use]] - Activation triggers and phase overview
- [[how-it-works]] - Development lifecycle phases
- [[success-criteria]] - Verification commands per stack