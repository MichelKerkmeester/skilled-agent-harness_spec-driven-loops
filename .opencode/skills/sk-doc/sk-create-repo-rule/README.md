---
title: "create-repo-rule"
description: "Authors, revises and retires repo rules from a user's request, refusing most of them on four decision tests before anything gets written."
trigger_phrases:
  - "create repo rule"
  - "repo rule mode"
  - "what does create-repo-rule do"
  - "add a project rule"
  - "how do repo rules work"
  - "why was my rule refused"
importance_tier: normal
contextType: general
version: 1.1.0.0
---

# create-repo-rule

> Turn "this keeps happening" into a rule that loads at the moment it matters or a clear reason it should not exist.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Creating, revising or retiring a repo rule under `repo-rules/` |
| **Invoke with** | `/create:repo-rule`, "add a repo rule" or a direct read of `SKILL.md` |
| **Works on** | A described failure, an out-of-date rule or a rule nothing still needs |
| **Produces** | One rule file, two router rows and a pointer. Or a refusal naming where the content belongs |
| **Most likely outcome** | A refusal. The four tests decline more than they admit |

---

## 2. OVERVIEW

### Why This Skill Exists

Some failures repeat. Someone edits a file they never opened. Someone reports a green test run nobody watched finish. Someone deletes a migration with no way back. Catching those in review costs the same amount every time, so writing the constraint down where it loads at the moment of the action is cheaper.

The trouble is that rule sets rot in a specific way. They only ever grow. Every plausible suggestion becomes a file, the set reaches forty entries and nobody reads any of them. A set that grows because more rules feel thorough has already failed. This skill exists to hold that line, which is why it refuses most of what it is asked for.

### What A Repo Rule Is

A rule constrains how you do something. It loads when you are about to take a particular action and tells you what you may not do while taking it.

That makes it different from a skill. A skill loads when you need a capability and teaches you how. A rule loads when you are already working and narrows your options.

One question settles most cases. **If it tells you how to accomplish something it is a skill. If it tells you what you may not do while accomplishing it, it is a rule.**

### How A Rule Reaches You

Rules do not all load at once. The repository root holds `REPO RULES.md`, a router with a trigger table. Each row lists actions on the left and one rule file on the right.

1. You are about to take an action, say deleting a file or reporting a result.
2. You match that action against the trigger table. The action, never the topic of the request.
3. You open the one rule file that row names and follow it.
4. Two rows match, so you load both. No row matches, so nothing loads and you do not go looking for a rule to apply.

The load is mandatory. What you load is not the top of the ladder. A rule sits below `AGENTS.md` and below a live instruction from you. Where a rule and `AGENTS.md` appear to disagree, `AGENTS.md` wins, the rule is wrong and the right response is to say so rather than follow it.

That ordering earns its keep. A rule set that could override the harness would need a review process before anyone touched it. One that cannot be overridden can be edited freely, which is what makes the next part workable.

### Rules Are Meant To Change

A rule supplements the harness. It carries a `version` because it will change. It should be removed once nothing it prevents still happens.

This skill owns all three moves. A create mode that cannot delete produces a set nobody prunes, and an unpruned set is one nobody reads.

---

## 3. QUICK START

**Step 1: Describe the failure, not the file you want.** "We keep forgetting to check X before Y" works better than "add a rule with these sections." You do not need the vocabulary of the rule set.

**Step 2: Read what decides the answer.**

```bash
cat .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md
```

Four tests run before anything gets written. Reading them first tells you whether your request has a chance.

**Step 3: Check the structural invariant on whatever comes out.**

```bash
awk 'NR==1&&/^---$/{fm=1;next} fm&&/^---$/{fm=0;next} /^## [0-9]+\./{s++} /^---$/{d++} END{print "sections="s, "dividers="d, "lines="NR}' repo-rules/<file>.md
```

Sections and dividers match in all nine shipped rules and in the router. The command skips the frontmatter delimiters, so it reads the router correctly too. Lines at or under 160 is preferred, and over 250 means the rule needs splitting or cutting.

---

## 4. HOW IT WORKS

The four decision tests load on every path, including retirement, because "should this exist" and "should this still exist" are the same four questions.

Test 1 asks what must bind on a turn where no trigger fires. Content that holds unconditionally cannot live behind a trigger, so it belongs in `AGENTS.md` instead. Test 2 checks the router's scope statement, which puts routing out of bounds: which skill, which command, which model, which flags. Test 3 runs four conditions covering single rows, content another rule already carries and proposals with nothing to load them. Test 4 asks what fails today without the rule.

Survive all four and the anatomy reference and template load. You fill ten fixed elements: six-key frontmatter in one order, a title line, a routed-from line, a line stating the rule expands `AGENTS.md` and never overrides it, the actions that fire it, one bold sentence carrying the obligation, a numbered body in capitals, one divider per numbered section, a closing self-check and a link back to the router.

Then five reader tests decide whether the draft earns its load. Structure is checkable and it is not the bar. A rule can satisfy every assertion above and still say nothing you would change your behaviour over. None of those five can be automated, so a person has to read the draft and answer them.

Wiring comes last: a trigger row, an index row and a pointer from each `AGENTS.md` section the rule governs.

### Key Concept: Order Protects The Half-Finished State

Create writes the file first, then the rows. Retire removes them in exactly the reverse order: pointer, index row, trigger row, then the file.

Both orderings answer the same question. What does an interrupted run leave behind? Write the file first and the worst case is a file nothing points at, which is inert and obvious. Add the row first and the worst case is a router row pointing at nothing, which reads as working coverage to anyone who looks. Always leave the safer wreck.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-repo-rule when someone describes a recurring failure and wants it stopped, when an existing rule no longer matches how the work is done, when a rule has stopped earning its load or when a repository needs a rule router because it has none.

Skip it when the request teaches a capability rather than constraining one, when the content must bind on every turn or when the request is about which skill or command to route to.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-create-skill` | Owns capability authoring. A skill teaches how, a rule constrains what you may not do |
| `sk-create-command` | Owns the `/create:repo-rule` command surface that invokes this mode |
| `sk-create-manual-testing-playbook` | Owns the playbook contract this packet's `manual-testing-playbook/` follows |
| `system-spec-kit` | Owns spec-folder documentation, which sits outside the rule set entirely |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Your request was refused and you disagree | Most requests are refused by design, usually on test 1 | Read which test refused it. The destination it names is generally a better home than a new file |
| A rule was written but never fires | It has a file and no trigger row, or the row describes a topic rather than an action | Check the router for a matching row, then check that the row lists actions you take |
| The router points at a file that does not exist | A retirement removed the file before the row | Remove the row too, then run the count check in section 8. Rows and files must match |
| A trigger phrase reaches the wrong rule | Two rules claim the same phrase | Sweep for duplicates. The set carries 161 phrases with zero collisions, so any duplicate is a defect |
| `validate_document.py --type reference` calls a rule invalid | A repo rule has no Overview section by design, and that type requires one | Use the structural check in section 8. All nine shipped rules fail that document type for this same reason |
| The draft passes every check and still reads as filler | Structure is checkable and it is not the bar | Run the five reader tests in `creation-standards.md`. They need a person, not a script |

---

## 7. FAQ

**Q: Why does it refuse so much?**

A: Because the alternative is a set nobody reads. Every rule you add raises the cost of loading the set and lowers the odds any single rule gets read. "Best practice" and "we might need it later" are the exact phrases that produce forty unread files.

**Q: My rule is correct. Why does test 1 still refuse it?**

A: Correctness is not what test 1 measures. It asks whether the content must bind when no trigger has fired. A rule that must always hold, filed behind a trigger, stops holding on every turn that trigger misses. It looks present in the repository and is absent in practice.

**Q: Can a rule override `AGENTS.md`?**

A: No, and the refusal is the useful part. Where they appear to disagree, the rule is wrong. Say so rather than following it.

**Q: What happens if the repository has no `REPO RULES.md`?**

A: The router gets emitted first, from a template. No router means no rule can load, whatever else is true. It is a prerequisite rather than the thing you asked for, and it gets reported that way.

**Q: How long should a rule be?**

A: At or under 160 lines is preferred and most subjects fit. 161 to 200 is fine without comment. 201 to 250 is allowed when the rule can say why it needs the room. Over 250 means splitting it or cutting it. Three of the nine shipped rules sit at the limit, and each absorbed content moved down from `AGENTS.md`, so their length is explained rather than accidental.

**Q: Is a refusal a dead end?**

A: No. Every refusal except the restraint one names a destination. The restraint refusal routes nowhere on purpose, and its recorded reason is the deliverable, so the same proposal does not arrive next quarter with nobody remembering why it was declined.

---

## 8. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Structural invariant | `awk 'NR==1&&/^---$/{fm=1;next} fm&&/^---$/{fm=0;next} /^## [0-9]+\./{s++} /^---$/{d++} END{print s, d, NR}' repo-rules/<file>.md` | The first two numbers match, and the third is at or under 250 |
| Router parity | `awk '/^## 2\. TRIGGER TABLE/{t=1} /^## 3\. INDEX/{t=0;i=1} /^## 4\./{i=0} t&&/repo-rules\//{tr++} i&&/repo-rules\//{ix++} END{print tr, ix}' 'REPO RULES.md'` | Both numbers equal the count of files in `repo-rules/` |
| Phrase collisions | `grep -rn '^  - "<phrase>"' repo-rules/` | At most one match. Anchor the pattern, because an unanchored search matches body prose |
| Playbook package | `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook` | `PASS`, tier `FAIL_CLOSED`, `violations=0` |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the create, revise and retire orderings |
| [`references/decision-tests.md`](./references/decision-tests.md) | The four tests deciding whether a rule may exist and where refused content goes |
| [`references/rule-anatomy.md`](./references/rule-anatomy.md) | The ten fixed elements, what varies and the length bands |
| [`references/creation-standards.md`](./references/creation-standards.md) | The five reader tests deciding whether a well-formed rule earns its load |
| [`references/agents-md-integration.md`](./references/agents-md-integration.md) | Wiring points, the scope check and the retire ordering |
| [`assets/repo-rule-template.md`](./assets/repo-rule-template.md) | The blank a new rule is filled from |
| [`assets/repo-rules-router-template.md`](./assets/repo-rules-router-template.md) | The router for a repository that has none |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Ten operator scenarios, seven of which end in a refusal or a halt |
