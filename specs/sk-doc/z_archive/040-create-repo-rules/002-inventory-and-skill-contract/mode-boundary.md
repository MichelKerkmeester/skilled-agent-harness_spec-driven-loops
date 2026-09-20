---
title: "Mode Boundary: What sk-create-repo-rule Owns"
description: "Ownership against the twelve sibling sk-doc modes, plus the two questions a reader actually asks: is this a repo rule or a skill, and is this a repo rule or an AGENTS.md row."
trigger_phrases:
  - "mode boundary"
  - "repo rule or skill"
  - "sk-doc mode ownership"
  - "which create mode"
  - "does this overlap a sibling"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Mode Boundary: What sk-create-repo-rule Owns

Twelve modes already exist under `sk-doc`. This one earns a place only where none of them
reaches.

---

## 1. WHAT THIS MODE OWNS

**The mode turns a user's request into a rule file.** Someone asks for a rule — in their
own words, describing a behaviour they want or a failure they keep hitting — and the mode
decides whether that request may become a rule at all, then authors it.

Create is the common path, but not the only one. Because a rule is a revisable supplement
rather than law, the mode also **changes** a rule that has stopped matching the work and
**removes** one that has stopped earning its load, updating the router rows and pointers
in step. A create mode that cannot delete produces a set nobody prunes.

Concretely, it owns one file under `repo-rules/` plus the wiring that makes it reachable:

- The rule document itself, to `rule-anatomy.md`.
- Its two rows in `REPO RULES.md` — trigger table and index.
- Its pointer from the `AGENTS.md` section it governs.
- The refusal path: deciding a proposal is **not** a rule, and saying where it goes.

That last one is not incidental. Most of what this mode does is refuse — the shipped set
declined ten candidates and subtracted one table across six phases, and admitted two files.

---

## 2. WHAT IT DOES NOT OWN

| Not this mode | Owned by | The distinction |
|---------------|----------|-----------------|
| Authoring a skill | `sk-create-skill` | A skill is capability loaded to *do* something. A rule is discipline loaded before *acting*. Skills teach; rules constrain |
| Authoring the command that invokes this mode | `sk-create-command` | Phase 6 calls that mode rather than reimplementing it |
| Authoring `README.md` for the mode packet | `sk-create-readme` | Standard packet furniture |
| The mode's changelog | `sk-create-changelog` | Including the symlink convention into `.opencode/changelog/sk-doc/` |
| The feature catalog | `sk-create-feature-catalog` | |
| The manual testing playbook | `sk-create-manual-testing-playbook` | |
| Benchmark folders | `sk-create-benchmark` | |
| Scoring an existing rule's quality | `sk-create-quality-control` | This mode creates; quality control audits |
| Diagrams inside a rule | `sk-create-diagram` | Rules are prose and tables; if one needs a diagram, that is a different mode's output embedded |
| Editing `AGENTS.md` beyond adding a pointer | Nothing automated | The always-loaded document carries hard blockers. A generated pointer is mechanical; anything else is an operator decision |

---

## 3. THE TWO QUESTIONS PEOPLE ACTUALLY ASK

### "Is this a repo rule or a skill?"

| | Repo rule | Skill |
|---|-----------|-------|
| Loaded | Before an action, by trigger match | When a task needs the capability |
| Contains | What you must and must not do | How to do a thing |
| Fails by | Being ignored | Being wrong |
| Length | 145-224 lines, one file | A packet with references and assets |
| Authority | Below `AGENTS.md`, above general judgment | Domain expertise, no precedence claim |

**The test:** if it tells you *how to accomplish* something, it is a skill. If it tells
you *what you may not do while accomplishing it*, it is a rule.

### "Is this a repo rule or an `AGENTS.md` row?"

That is test 1 in `decision-tests.md`, and it is the more common confusion. Ask what
happens on a turn where no trigger fires. If the answer is "this still has to hold", it is
a row, not a rule.

---

## 4. THE REPOSITORY-SHAPED QUESTION

**Does this mode generate `REPO RULES.md` itself for a repository that has none?**

The inventory settles what was open. The router is structurally unlike the rules it
routes to — no frontmatter, no `Fires when`, no `The rule`, no self-check, four numbered
sections against the rules' six to twelve. It is a different document class that happens
to live nearby.

**Verdict: yes, but as a distinct output, not a variant of the rule template.** A
repository with no router cannot receive a rule at all — the trigger table is the only
thing that loads one. The mode must therefore be able to produce a router, and phase 3
builds two templates rather than one.

---

## 5. SELF-CHECK

- [ ] The proposal is not something a sibling mode already produces.
- [ ] If it teaches how to do something, it was routed to `sk-create-skill` instead.
- [ ] If it must bind when nothing fires, it was routed to `AGENTS.md` instead.
- [ ] Command, README, changelog and catalog were delegated to the modes that own them.
- [ ] A repository with no router gets a router first, from the second template.
