---
name: {{SKILL_NAME}}
description: TODO one-line description of what this skill does and when to use it (verb + domain noun + trigger phrase)
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0.0
---

# {{SKILL_TITLE}}

[TODO: State the skill purpose in one sentence.]

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when:

- [TODO: Name a concrete user goal or task.]
- [TODO: Name a file type, system, or domain signal.]
- [TODO: Add one representative trigger phrase.]

### When NOT to Use

Do not use this skill for:

- [TODO: Name the nearest out-of-scope task.]
- [TODO: Point to the better workflow when applicable.]

---

## 2. SMART ROUTING

### Routing Signals

[TODO: Describe the signal that selects a resource or workflow path.]

### Resource Domains

- `references/` — optional guidance and domain knowledge.
- `assets/` — optional templates and reusable output material.
- `scripts/` — optional deterministic automation.

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
UNKNOWN_FALLBACK = {
    "load_level": "UNKNOWN_FALLBACK",
    "needs_disambiguation": True,
    "checklist": [
        "Confirm the task intent",
        "Provide one concrete input or expected output",
    ],
}

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError("Only skill-local markdown resources are routable")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def route_resources(request):
    inventory = discover_markdown_resources()
    selected = select_resources_for_request(request, inventory)
    if not selected:
        return {**UNKNOWN_FALLBACK, "resources": []}

    loaded = []
    for relative_path in selected:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in loaded:
            load(guarded)
            loaded.append(guarded)
    return {"resources": loaded}
```

[TODO: Replace `select_resources_for_request` with domain-specific routing logic.]

---

## 3. HOW IT WORKS

### Workflow

1. [TODO: Identify the input and relevant constraints.]
2. [TODO: Select the smallest applicable workflow or resource set.]
3. [TODO: Produce the requested artifact or result.]
4. [TODO: Run the appropriate verification.]

### Output Contract

[TODO: State what the skill returns, creates, or changes.]

### Verification

[TODO: Name the command or evidence that proves success.]

---

## 4. RULES

### ✅ ALWAYS

- [TODO: Add a required behavior.]
- [TODO: Add a verification requirement.]
- [TODO: Add a scope or safety constraint.]

### ❌ NEVER

- [TODO: Add a forbidden action.]
- [TODO: Add a known anti-pattern.]
- [TODO: Add a boundary the skill must not cross.]

### ⚠️ ESCALATE IF

- [TODO: Name an ambiguity that requires user input.]
- [TODO: Name a failure that blocks safe progress.]
- [TODO: Name a contract conflict that needs a decision.]

---

## 5. REFERENCES

### Core References

- [TODO: Add only references needed for deeper guidance.]

### Templates and Assets

- [TODO: Add reusable templates or assets when needed.]

### Loading Notes

- [TODO: State when optional resources should be loaded.]

---

## 6. SUCCESS CRITERIA

The task is complete when:

- [TODO: The requested outcome exists.]
- [TODO: Required validation passes.]
- [TODO: Remaining uncertainty is reported.]

---

## 7. INTEGRATION POINTS

### Inputs

- [TODO: Name upstream commands, tools, or artifacts.]

### Outputs

- [TODO: Name downstream consumers or handoff artifacts.]

### Related Workflows

- [TODO: Name adjacent skills or workflows and their boundaries.]
