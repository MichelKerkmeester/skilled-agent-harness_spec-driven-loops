---
title: "Repo Rule Template"
description: "The blank a generated repo rule is filled from. Every element marked MUST is universal across the shipped corpus; the numbered body is open because section count follows the subject."
trigger_phrases:
  - "repo rule template"
  - "rule blank"
  - "fill a new rule"
  - "rule scaffold"
  - "what goes in a rule"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Repo Rule Template

Copy everything between the markers into `repo-rules/<subject>.md` and fill it. Angle
brackets are placeholders. Every instruction here is derived from the shipped corpus,
not from taste.

**Before filling anything, run `../references/decision-tests.md`.** Most requests should
not become a rule, and finding that out after writing one is the expensive order.

**Aim for 160 lines or fewer.** Up to 200 is fine, up to 250 is allowed if the rule can
say why it needs the room, and over 250 means split it or cut it.

---

## THE TEMPLATE

<!-- BEGIN TEMPLATE -->
```markdown
---
title: "Rule: <Subject>"
description: "<One sentence. The binding rule, restated for someone who will not open the file.>"
trigger_phrases:
  - "<the words someone types when they HAVE this problem — the temptation, the excuse, the symptom>"
  - "<not section titles; those are already greppable from the body>"
  - "<aim for 15-20; no phrase should also appear in another rule>"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule: <Subject>

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). <When to load this — one clause.>
> Expands `AGENTS.md`, never overrides it — where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- <An action you are about to take. Not a topic you are thinking about.>
- <Another action. Four to six is typical.>
- <Include the tempting-but-wrong action, because that is when the rule earns its load.>

## The rule

**<One sentence, bold. The whole rule. If it needs two sentences, it is two rules or a
vaguer rule than you have.>**

<Optional: one short paragraph that sharpens the sentence. Not a restatement.>

---

## 1. <FIRST SECTION, ALL CAPS>

<The mechanism the rule turns on — the ladder, the tiers, the registers. Whatever scale
the rest of the sections refer back to.>

<Every section must name a failure it prevents. If you cannot name one, cut the section.>

---

## 2. <SECOND SECTION>

<...>

---

## <N>. WHAT THIS RULE IS NOT

<Include this whenever the rule could be read as licence to do less. Three of the eight
shipped rules have it, and all three added it after someone misread the rule.>

- **Not <a misreading>.** <Why that reading is wrong.>

---

## <N+1>. SELF-CHECK

- [ ] <One item per obligation the body actually creates. Not a summary of the sections.>
- [ ] <Five to eleven items is the observed range.>
```
<!-- END TEMPLATE -->

---

## 1. WHAT IS NOT OPTIONAL

Ten elements are universal across all nine shipped rules. A file missing any of them is
not a rule of this set.

| Element | Why it is fixed |
|---------|-----------------|
| Six-key frontmatter, in order | One key order across all nine; discovery depends on it |
| `# Rule: <Subject>` | 9/9 |
| Routed-from line | 9/9; it is how a reader knows where the file sits |
| Subordination line, verbatim | 9/9; the rule declaring its own rank below `AGENTS.md` |
| `## Fires when` | 9/9; unnumbered |
| `## The rule` with one bold sentence | 9/9; unnumbered |
| Uppercase numbered sections, sequential | 9/9 |
| One `---` per numbered section | 9/9 including the router — the strongest invariant in the corpus |
| Closing `SELF-CHECK` | 9/9; always the last numbered section |
| A resolving back-link to the router | 9/9 |

---

## 2. TWO THINGS THAT LOOK LIKE STYLE AND ARE NOT

**Quote `title` and `description`.** Both routinely contain a colon — `title` always
does. Unquoted, the frontmatter is invalid YAML, and the failure is invisible to a
reader: it looks right and only a parser objects. Every shipped rule failed this on
first authoring.

**Default to zero sideways cross-references.** The corpus carries four inter-rule links
across eight files. Rules turn out to be nearly independent. Add a link only where it
replaces a restatement of another rule's doctrine.

---

## 3. SELF-CHECK

- [ ] The decision tests ran before any of this was filled in.
- [ ] All ten fixed elements are present.
- [ ] `title` and `description` are quoted and the frontmatter parses.
- [ ] Dividers equal numbered sections.
- [ ] Every numbered section names a failure it prevents.
- [ ] Trigger phrases are symptom vocabulary and none collides with another rule.
- [ ] Length is in a band, and if it is at the limit the rule can say why.
