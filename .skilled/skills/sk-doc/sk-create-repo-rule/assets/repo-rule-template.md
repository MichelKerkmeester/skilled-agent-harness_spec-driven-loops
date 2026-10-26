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
version: 1.1.1.0
---

# Repo Rule Template

Copy everything between the markers into the target repository's rules directory
(`.skilled/repo-rules/<subject>.md` where a `.skilled` source root exists,
`repo-rules/<subject>.md` otherwise) and fill it. Angle brackets are placeholders. The
routed-from link below resolves from `.skilled/repo-rules/`. Under a root `repo-rules/`,
write `../REPO%20RULES.md` instead.
Every instruction here is derived from the shipped corpus, not from taste.

---

## 1. OVERVIEW

**Before filling anything, run `../references/decision-tests.md`.** Most requests should
not become a rule, and finding that out after writing one is the expensive order.

**Aim for 160 lines or fewer.** Up to 200 is fine, up to 250 is allowed if the rule can
say why it needs the room, and over 250 means split it or cut it.

A rule earns the example line when it names a habit.

---

## 2. THE TEMPLATE

<!-- BEGIN TEMPLATE -->
```markdown
---
title: "Rule: <Subject>"
description: "<One sentence. The binding rule, restated for someone who will not open the file.>"
trigger_phrases:
  - "<the words someone types when they HAVE this problem — the temptation, the excuse, the symptom>"
  - "<not section titles; those are already greppable from the body>"
  - "<one phrase per distinct symptom, with no count target; no phrase should also appear in another rule>"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule: <Subject>

> Routed from [`REPO RULES.md`](../../REPO%20RULES.md). <When to load this. One clause.>
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- <An action you are about to take. Not a topic you are thinking about.>
- <Another action. Four to six is typical.>
- <Include the tempting-but-wrong action, because that is when the rule earns its load.>

## The rule

**<One sentence, bold. The whole rule. If it needs two sentences, it is two rules or a
vaguer rule than you have.>**

<Optional: one short paragraph that sharpens the sentence. Not a restatement.>

<Optional: one example line, the tempting wrong move beside its repair.>

- **Wrong: <the tempting move>.** <The repair: what to do instead.>

---

## 1. <FIRST SECTION, ALL CAPS>

<The mechanism the rule turns on: the ladder, the tiers, the registers. Whatever scale
the rest of the sections refer back to.>

<Every section must name a failure it prevents. If you cannot name one, cut the section.>

---

## 2. <SECOND SECTION>

<...>

---

## <N>. WHAT THIS RULE IS NOT

<Include this whenever the rule could be read as licence to do less. The rules that
have it added it after someone misread the rule.>

- **Not <a misreading>.** <Why that reading is wrong.>

---

## <N+1>. SELF-CHECK

- [ ] <One item per obligation the body actually creates. Not a summary of the sections.>
- [ ] <Five to eleven items is the observed range.>
```
<!-- END TEMPLATE -->

---

## 3. WHAT IS NOT OPTIONAL

Ten elements are universal across every shipped rule, and `check-repo-rules.cjs` counts them
on the live corpus. A file missing any of them is
not a rule of this set.

| Element | Why it is fixed |
|---------|-----------------|
| Six-key frontmatter, in order | One key order across every rule, and discovery depends on it |
| `# Rule: <Subject>` | Every rule |
| Routed-from line | Every rule, and it is how a reader knows where the file sits |
| Subordination line, verbatim | Every rule, the rule declaring its own rank below `AGENTS.md` |
| `## Fires when` | Every rule, unnumbered |
| `## The rule` with one bold sentence | Every rule, unnumbered |
| Uppercase numbered sections, sequential | Every rule |
| One `---` per numbered section | Every rule and the router, the strongest invariant in the corpus |
| Closing `SELF-CHECK` | Every rule, always the last numbered section |
| A resolving back-link to the router | Every rule |

---

## 4. TWO THINGS THAT LOOK LIKE STYLE AND ARE NOT

**Quote `title` and `description`.** Both routinely contain a colon, and `title` always
does. Unquoted, the frontmatter is invalid YAML, and the failure is invisible to a
reader: it looks right and only a parser objects. Every shipped rule failed this on
first authoring.

**Default to zero sideways cross-references.** Sideways links stay few next to the
doctrine each rule holds, and `check-repo-rules.cjs` reports the live count. Add a link only where it
replaces a restatement of another rule's doctrine.

---

## 5. SELF-CHECK

- [ ] The decision tests ran before any of this was filled in.
- [ ] All ten fixed elements are present.
- [ ] `title` and `description` are quoted and the frontmatter parses.
- [ ] Dividers equal numbered sections.
- [ ] Every numbered section names a failure it prevents.
- [ ] Trigger phrases are symptom vocabulary and none collides with another rule.
- [ ] Length is in a band, and if it is at the limit the rule can say why.
