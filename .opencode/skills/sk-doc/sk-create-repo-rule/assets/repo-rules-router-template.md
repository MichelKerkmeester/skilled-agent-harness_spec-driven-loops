---
title: "Repo Rules Router Template"
description: "The prerequisite. A repository with no trigger table cannot load a rule at all, so the mode emits this before writing its first rule. Structurally unlike a rule and deliberately so."
trigger_phrases:
  - "router template"
  - "REPO RULES.md scaffold"
  - "trigger table"
  - "no router exists"
  - "first rule in a repository"
importance_tier: important
contextType: reference
version: 1.1.0.4
---

# Repo Rules Router Template

Emitted only when `REPO RULES.md` does not exist. **Nobody asks for this** — it is
created because the destination is missing, the way a build makes a directory before
writing into it.

---

## 1. OVERVIEW

The router is **not a rule**, and the difference is measured, not stylistic: no
frontmatter, no `Fires when`, no `The rule`, no self-check, and four numbered sections
against a rule's six to twelve. It holds no doctrine of its own. Every rule it lists is
a file; the router is the index.

---

## 2. THE TEMPLATE

<!-- BEGIN TEMPLATE -->
```markdown
# REPO RULES

Repo-local operating rules. `AGENTS.md` **Gate 5 (§2)** makes reading this mandatory
before your first write of the session; this document then routes you to the one rule
file that governs what you are about to do. **It is a router, not a rulebook:** it
holds no rules of its own.

---

## 1. HOW TO USE THIS

1. **Match on the action you are about to take**, not the topic of the request.
2. **Load before the action.** A rule read afterwards is a post-mortem.
3. **A file already in context is not re-read.**
4. **Every trigger that fires is loaded, not just the first.** They compose; the more
   specific wins on conflict. Three and four firing at once is the normal case, not an
   edge case.
5. **Nothing fires → `AGENTS.md` alone governs.** Do not hunt for a rule to apply.

### Precedence

| Level | Source | Can be overridden? |
|-------|--------|--------------------|
| 1 | Every `AGENTS.md` hard blocker and mandatory gate | No |
| 2 | An explicit, in-the-moment operator instruction | Not applicable, it is the instruction |
| 3 | These rule files | Only by level 1 or 2 |
| 4 | General judgment | By anything above |

A rule file may tighten `AGENTS.md`. None relaxes a hard block or authorizes what
`AGENTS.md` forbids.

---

## 2. TRIGGER TABLE

| You are about to… | Load | It settles |
|-------------------|------|-----------|
| <the action, in the words someone would use> | [`<rule>.md`](repo-rules/<rule>.md) | <the question it answers> |

---

## 3. INDEX

| Rule | Summary |
|------|---------|
| [<Rule>](repo-rules/<rule>.md) | <the binding sentence, compressed to one line> |

---

## 4. SCOPE OF THIS DOCUMENT

**In:** <what this rule set is for, the categories of discipline it carries.>

**Out:** <what it deliberately excludes, and which document owns each instead.>
```
<!-- END TEMPLATE -->

---

## 3. WHAT THE ROUTER MUST NOT BECOME

**It holds no rules.** The moment a router explains *how* to do something rather than
*where to look*, it has become a rule file with a routing table attached, and the set has
two places to change instead of one.

**Its scope statement is load-bearing.** A trigger row pointing at a rule the scope
statement excludes is a document contradicting itself at the exact point a reader
consults it. The shipped router hit this twice and both times the boundary had to move.

**Every link resolves.** A router row pointing at a missing file is worse than a missing
row, because it looks like coverage.

---

## 4. ADDING A RULE LATER

Two rows, one file. If a new rule costs more than that, the router is not a router.

---

## 5. SELF-CHECK

- [ ] The router contains no doctrine of its own.
- [ ] Every trigger row is written on an action, not a topic.
- [ ] Every link resolves to a file that exists.
- [ ] The scope statement admits every rule the trigger table routes to.
- [ ] Trigger rows and index rows are the same count as the rule files.
