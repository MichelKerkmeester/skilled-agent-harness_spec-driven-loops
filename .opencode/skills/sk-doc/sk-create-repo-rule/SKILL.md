---
name: sk-create-repo-rule
description: Author, revise or retire a repo rule from a user's request, with the decision tests that refuse most of them.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
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
- A repository needs a `REPO RULES.md` router because it has none.

### When NOT to Use

- **It teaches how to do something** → `sk-create-skill`. A skill is capability; a rule is constraint.
- **It must bind on every turn** → it belongs in `AGENTS.md`, not behind a trigger. This is decision test 1 and it is the most common refusal.
- **It is routing** — which skill, which command, which agent, which flags → `AGENTS.md` and the skills it routes to.
- **It is one line, not a cluster** → a section inside an existing rule.
- **A sibling `sk-doc` mode already produces it** → README, changelog, command, catalog, playbook, diagram all have owners.

---

## 2. SMART ROUTING

### Resource Domains

- `references/decision-tests.md` — whether the request may become a rule at all. Always first.
- `references/rule-anatomy.md` — what a rule must contain, what varies, the length bands.
- `references/creation-standards.md` — quality bar above the structural floor.
- `references/agents-md-integration.md` — the wiring that makes a rule reachable.
- `assets/repo-rule-template.md` — the blank for a new rule.
- `assets/repo-rules-router-template.md` — the prerequisite, when no router exists.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|--------------|-----------|
| ALWAYS | Every invocation | `references/decision-tests.md` |
| CONDITIONAL | The request survived the tests | `rule-anatomy.md`, `assets/repo-rule-template.md` |
| CONDITIONAL | The target repository has no router | `assets/repo-rules-router-template.md` |
| CONDITIONAL | Wiring an accepted rule | `agents-md-integration.md` |
| ON_DEMAND | Quality review of a draft | `creation-standards.md` |

### Smart Router Pseudocode

```python
INTENT_SIGNALS = {
    "CREATE":  {"weight": 5, "keywords": ["add a rule", "new repo rule", "make a rule", "we should always", "stop doing"]},
    "REVISE":  {"weight": 4, "keywords": ["update the rule", "change the rule", "the rule is wrong", "rule is out of date"]},
    "RETIRE":  {"weight": 4, "keywords": ["remove the rule", "retire", "delete the rule", "no longer applies"]},
    "ROUTER":  {"weight": 3, "keywords": ["no repo rules", "set up repo rules", "REPO RULES.md", "first rule"]},
}

RESOURCE_MAP = {
    "CREATE": ["references/decision-tests.md", "references/rule-anatomy.md", "assets/repo-rule-template.md"],
    "REVISE": ["references/rule-anatomy.md", "references/agents-md-integration.md"],
    "RETIRE": ["references/agents-md-integration.md"],
    "ROUTER": ["assets/repo-rules-router-template.md"],
}

def route(request):
    # The tests load on every path including RETIRE, because "should this exist"
    # and "should this still exist" are the same four questions.
    load("references/decision-tests.md")
    intent = highest_scoring(INTENT_SIGNALS, request) or "CREATE"
    if target_repo_has_no_router():
        load("assets/repo-rules-router-template.md")   # prerequisite, not the ask
    for r in RESOURCE_MAP[intent]:
        load_if_available(r)
    return intent
```

Unknown intent falls back to `CREATE`, which runs the tests and refuses safely.

---

## 3. HOW IT WORKS

### Create

1. **Run the four decision tests.** Always-loaded, scope boundary, four-part refusal, restraint.
2. **On refusal**, name the test that failed and where the content goes instead — the tests' section 5 maps every refusal to a destination. Stop here. This is the common outcome.
3. **Check the destination exists.** No `REPO RULES.md` in the target repository means no rule can load; emit the router from `assets/repo-rules-router-template.md` first.
4. **Fill `assets/repo-rule-template.md`.** Ten fixed elements, open numbered body, aim under 160 lines.
5. **Wire it**: a trigger row and an index row in the router, and a pointer from the `AGENTS.md` section it governs.
6. **Verify**: frontmatter parses, dividers equal numbered sections, every link resolves, no trigger phrase collides with another rule.

### Revise

Same tests — a rule that no longer passes them should be retired, not patched. Then edit,
bump `version`, and re-verify. If the change alters when the rule fires, the router's
trigger row changes with it.

### Retire

Delete the file, remove both router rows, and remove the pointer from the governed
section. A rule removed but still listed is worse than one left in place. Record why it
went, so it is not re-proposed.

---

## 4. RULES

**Required**

- Run the decision tests before authoring, on every path.
- Emit the router first when the target repository has none.
- Quote `title` and `description` in frontmatter; both routinely contain a colon.
- Keep dividers equal to numbered sections.
- Name, in every numbered section, the failure it prevents.

**Forbidden**

- Writing a rule that must bind when no trigger fires. That is an `AGENTS.md` row.
- Putting routing, skill selection, or dispatch mechanics into a rule.
- Editing `AGENTS.md` beyond adding the pointer. The always-loaded document carries hard blockers; anything else is an operator decision.
- Adding a rule because the set looks thin. The set is subject to its own `overengineering.md`.
- Restating another rule instead of linking to it — though the default is no link at all.

**Escalate**

- The request needs an `AGENTS.md` change beyond a pointer.
- Two existing rules disagree, and the new rule would have to pick a side.
- The proposal fails a test but the operator wants it anyway — that is their call to make explicitly, not one to infer.

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
