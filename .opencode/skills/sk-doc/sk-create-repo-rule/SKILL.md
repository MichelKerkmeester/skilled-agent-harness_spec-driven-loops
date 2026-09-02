---
name: sk-create-repo-rule
description: Author, revise or retire a repo rule from a user's request, with the decision tests that refuse most of them.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.1.0.0
---

<!-- Keywords: create-repo-rule, /create:repo-rule, repo rule, REPO RULES.md, repo-rules, rule file, trigger table, rule router, operating discipline, always-loaded versus triggered -->

# create-repo-rule

`create-repo-rule` is the repo-rule authoring workflow packet of the `sk-doc` family. It
turns a user's request — a behaviour they want, or a failure they keep hitting — into a
file under `repo-rules/`, wired into that repository's `REPO RULES.md` router.

**Most requests should not become a rule.** The four decision tests in
`references/decision-tests.md` refuse more than they admit, and running them first is the
cheap order. Authoring a rule that then fails a test is the expensive one.

A repo rule **supplements the harness**. It sits below `AGENTS.md` and below a live
operator instruction, it can be changed when it stops matching the work, and it can be
removed when it stops earning its load. This mode owns all three.

---

## 1. WHEN TO USE

### Activation Triggers

- Someone asks for a repo rule, a project rule, or a convention that should bind before an action.
- Someone describes a recurring failure and asks how to stop it happening again.
- An existing rule needs changing because it no longer matches how the work is done.
- A rule needs retiring because nothing it prevents still happens.
- A repository needs a rule router because it has none.

Keyword triggers: `create repo rule`, `/create:repo-rule`, `repo rule`, `project rule`, `REPO RULES.md`, `repo-rules`, `add a rule`, `retire a rule`, `revise a rule`, `trigger table`, `rule router`.

### When NOT to Use

- **It teaches how to do something.** A skill is capability, a rule is constraint. Route to the skill-authoring mode.
- **It must bind on every turn.** Content that holds when no trigger fires belongs in the always-loaded document, not behind a trigger. This is decision test 1 and the most common refusal.
- **It is routing.** Which skill, which command, which agent, which flags. The always-loaded document and the skills it routes to own that.
- **It is one line, not a cluster.** A single row is a section inside an existing rule.
- **A sibling mode already produces it.** README, changelog, command, catalog, playbook and diagram all have owners.

---

## 2. SMART ROUTING

### Resource Domains

- `references/decision-tests.md` — whether the request may become a rule at all. Always first.
- `references/rule-anatomy.md` — what a rule must contain, what varies, the length bands.
- `references/creation-standards.md` — five reader tests deciding whether a well-formed rule is worth loading.
- `references/agents-md-integration.md` — the three wiring points, and the create, revise and retire orderings.
- `assets/repo-rule-template.md` — the blank for a new rule.
- `assets/repo-rules-router-template.md` — the prerequisite, when no router exists.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|--------------|-----------|
| ALWAYS | Every invocation | `references/decision-tests.md` |
| CONDITIONAL | The request survived the tests | `rule-anatomy.md`, `assets/repo-rule-template.md` |
| CONDITIONAL | The target repository has no router | `assets/repo-rules-router-template.md` |
| CONDITIONAL | Wiring an accepted rule | `agents-md-integration.md` |
| CONDITIONAL | A draft exists and is being finished or reviewed | `creation-standards.md` |

### Smart Router Pseudocode

The canonical resilient router discovers resources at call time, guards and loads only
what exists, scores the four operations, and returns a disambiguation checklist rather
than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/decision-tests.md"

INTENT_MODEL = {
    "CREATE": {"weight": 5, "keywords": ["add a rule", "new repo rule", "make a rule", "we should always", "stop doing"]},
    "REVISE": {"weight": 4, "keywords": ["update the rule", "change the rule", "the rule is wrong", "rule is out of date"]},
    "RETIRE": {"weight": 4, "keywords": ["remove the rule", "retire", "delete the rule", "no longer applies"]},
    "ROUTER": {"weight": 3, "keywords": ["no repo rules", "set up repo rules", "REPO RULES.md", "first rule"]},
}
RESOURCE_MAP = {
    "CREATE": ["references/decision-tests.md", "references/rule-anatomy.md", "assets/repo-rule-template.md"],
    "REVISE": ["references/rule-anatomy.md", "references/agents-md-integration.md"],
    "RETIRE": ["references/agents-md-integration.md"],
    "ROUTER": ["assets/repo-rules-router-template.md"],
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the behaviour to bind, or the failure that keeps happening",
    "Confirm the operation: create, revise or retire",
    "Confirm the target repository and whether it already has a REPO RULES.md",
]

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
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, inventory, loaded, seen) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(request) -> dict:
    text = request.text.lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    return scores

def route_repo_rule_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()

    # The tests load on every path including RETIRE, because "should this exist"
    # and "should this still exist" are the same four questions.
    load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
    scores = score_intents(request)

    if max(scores.values() or [0]) < 3:                       # Tier 1: unclear scope
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                      # Tier 2: happy path
    if target_repo_has_no_router():
        load_if_available("assets/repo-rules-router-template.md", inventory, loaded, seen)
    for resource in RESOURCE_MAP[intent]:
        load_if_available(resource, inventory, loaded, seen)
    return {"intent": intent, "resources": loaded}
```

Unknown intent returns the disambiguation checklist with the tests already loaded, so the
cheap refusal path stays available even when the operation is unclear.

---

## 3. HOW IT WORKS

### Create

1. **Run the four decision tests.** Always-loaded, scope boundary, four-part refusal, restraint.
2. **On refusal**, name the test that failed and where the content goes instead — the tests' section 5 maps every refusal to a destination. Stop here. This is the common outcome.
3. **Check the destination exists.** No `REPO RULES.md` in the target repository means no rule can load; emit the router from `assets/repo-rules-router-template.md` first.
4. **Fill `assets/repo-rule-template.md`.** Ten fixed elements, open numbered body, aim under 160 lines.
5. **Run `references/creation-standards.md` against the draft.** Structure is checkable and is not the bar; a rule can pass every assertion and be worth nobody's context.
6. **Wire it**: a trigger row and an index row in the router, and a pointer from the `AGENTS.md` section it governs.
7. **Verify**: frontmatter parses, dividers equal numbered sections, every link resolves, no trigger phrase collides with another rule.

### Revise

Run the decision tests again first — a rule that no longer passes them should be retired,
not patched. Then edit, and if the change alters *when* the rule fires, change the trigger
row in the same edit or the router lies silently. Bump `version`. Full ordering and the
`version` convention: `references/agents-md-integration.md` §4.

### Retire

Pointer first, then index row, then trigger row, then the file — create inverted, so no
intermediate state leaves a row pointing at nothing. Record why it went. Do not archive;
git holds the history. Full ordering: `references/agents-md-integration.md` §5.

---

## 4. RULES

### ✅ ALWAYS

1. Run the decision tests before authoring, on every path including retire.
2. Emit the router first when the target repository has none.
3. Quote `title` and `description` in frontmatter; both routinely contain a colon.
4. Keep dividers equal to numbered sections.
5. Make clear, in every numbered section, what goes wrong without it — in the section's substance if not in a dedicated line.
6. Name the failed test and the destination on every refusal.

### ⛔ NEVER

1. Write a rule that must bind when no trigger fires. That is an `AGENTS.md` row.
2. Put routing, skill selection, or dispatch mechanics into a rule.
3. Edit `AGENTS.md` beyond adding or removing a pointer. The always-loaded document carries hard blockers; anything else is an operator decision.
4. Add a rule because the set looks thin. The set is subject to its own `overengineering.md`.
5. Restate another rule instead of linking to it — though the default is no link at all.
6. Report a refusal as a failure. It is the designed outcome for most requests.

### ⚠️ ESCALATE IF

1. The request needs an `AGENTS.md` change beyond a pointer, or a widening of the router's scope statement.
2. Two existing rules disagree, and the new rule would have to pick a side.
3. The proposal fails a test but the operator wants it anyway — that is their call to make explicitly, not one to infer.

---

## 5. SUCCESS CRITERIA

- A generated rule passes the same structural checks the shipped corpus passes.
- A refused request leaves the user knowing which test it failed and where the content belongs.
- A retired rule leaves no dangling router row or pointer.
- The rule set does not grow because rules were easy to write.

---

## 6. REFERENCES

Routed by [`references/README.md`](references/README.md). Load
`references/decision-tests.md` first on every path; everything else is conditional.
