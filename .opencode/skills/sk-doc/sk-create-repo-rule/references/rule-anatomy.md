---
title: "Rule Anatomy Contract"
description: "The structure every repo rule carries, derived mechanically from the shipped corpus rather than asserted. Every MUST element is used by every shipped rule; every MAY element records why it varies; every divergence is classified as a permitted variant or a defect the contract forbids going forward."
trigger_phrases:
  - "rule anatomy"
  - "repo rule structure"
  - "MUST carry MAY carry"
  - "rule template contract"
  - "divergence classification"
importance_tier: important
contextType: reference
version: 1.1.0.5
---

# Rule Anatomy Contract

Derived from the corpus under `repo-rules/` plus the router, parsed structurally rather
than recalled. Nothing below is aspirational: every MUST element is carried by every
shipped rule.

Corpus figures are deliberately not restated here. To see the current ones, run
`node .opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` (the
corpus checker) from the repository root — it reports count parity, link wiring,
trigger-phrase uniqueness, the line ceiling, frontmatter keys and divider parity for the
corpus as it stands.

---

## 0. OVERVIEW: WHAT A REPO RULE IS

A repo rule **supplements the harness**. It is not a law and not a contract with the
runtime: it can be overridden by an explicit operator instruction, changed when it stops
matching how the work is actually done, and removed when it stops earning its load.

Three consequences the template must carry:

- **A rule sits below `AGENTS.md` and below a live operator instruction.** Every shipped
  rule says so in its own header line, verbatim, without exception. That line is not
  boilerplate to be trimmed — it is the rule declaring its own rank.
- **A rule is revisable.** It carries a `version` field for exactly this reason. Writing
  one is not a permanent commitment, and treating it as one is what produces rules nobody
  will delete after they stop being true.
- **Removal is a normal outcome.** The set has already subtracted once — a duplicated
  restraint ladder whose rung numbering contradicted the authoritative one. A review that
  only ever adds has not reviewed anything.

This is why the mode owns changing and removing rules, not only creating them.

---

## 1. WHAT THE CORPUS AGREES ON

Every one of these is carried by every shipped rule. A generated rule that omits any is not a rule of this set.

| Element | Shape | Evidence |
|---------|-------|----------|
| Frontmatter | Six keys, one order: `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `version` | Every rule, in exactly one distinct key order across the corpus |
| Title line | `# Rule: <Subject>` | Every rule |
| Routed-from line | `> Routed from [REPO RULES.md](../REPO%20RULES.md). <when to load>.` | Every rule |
| Subordination line | `> Expands AGENTS.md, never overrides it. Where they appear to disagree, AGENTS.md wins and this file is wrong. Say so.` | Every rule, verbatim |
| `## Fires when` | Unnumbered; a bullet list of actions, not topics | Every rule |
| `## The rule` | Unnumbered; exactly one bold binding sentence, then at most a short gloss | Every rule |
| Numbered body | `## N. ALL CAPS TITLE`, sequential from 1 | Every rule, all uppercase outside backticks |
| Divider discipline | One `---` per numbered section | Every rule and the router — dividers equal numbered sections, with no exception |
| Closing self-check | Final numbered section, titled `SELF-CHECK`, a `- [ ]` checklist | Every rule |
| Back-link | A resolving link to `../REPO%20RULES.md` | Every rule |

**The strongest invariant is the divider rule.** Dividers equal numbered sections in
every file including the router, with zero variance. It is the one structural property a
generator can assert without qualification.

---

## 2. WHAT VARIES, AND WHY

These scale with the rule's subject. A generator sets no target for them.

| Element | What varies, and why |
|---------|----------------------|
| `trigger_phrases` | Find surface, not an index: a rule with more distinct symptoms earns more phrases |
| Numbered sections | Follows the subject — a rule that turns on more distinct mechanisms carries more sections |
| Self-check items | One per obligation the body actually creates |
| Total lines | Follows section count, which follows the subject |
| Inter-rule cross-references | Sparse; rules are more independent than the cross-reference doctrine implies. See section 4 |

---

## 3. LENGTH BANDS

Operator-set, and they replace the stale ~160 ceiling the set carried before these
bands. Counts include frontmatter, because that is what a reader loads.

| Band | Range | Meaning |
|------|-------|---------|
| **Preferred** | ≤ 160 | Where a rule should land. Most subjects fit |
| **Good** | 161-200 | Acceptable without comment |
| **At the limit** | 201-250 | Allowed, but the rule should be able to say why it needs the room |
| **Over** | > 250 | Split it, or cut it |

The **Over** band is also enforced mechanically: the corpus checker treats any rule over
250 as a failure.

A rule at the limit should be able to say why it needs the room — content moved down
from `AGENTS.md` is a sufficient reason. A new rule that reaches the limit with no such
explanation should be looked at.

> A band is checkable, which the proportionality rule this replaces was not. That
> trade was deliberate: an enforceable approximation beats an unenforceable truth.

---

## 4. A SECOND FINDING: THE RULES ARE NEARLY INDEPENDENT

Cross-references between rules are rare: every rule links back to the router, and almost
none links sideways.

That is a stronger result than the doctrine claimed. "Cross-reference rather than restate"
was written as a duplication guard, and the measured outcome is that rules rarely need
each other at all. A generated rule should therefore default to **zero** sideways links,
and add one only where it would otherwise restate another rule's doctrine.

---

## 5. THE FRONTMATTER SCHEMA

Six keys, in this order, matching the skill-reference schema:

```yaml
---
title: "Rule: <Subject>"
description: "<one sentence: the binding rule, restated for a reader who will not open the file>"
trigger_phrases:
  - "<the words someone reaches for when they have the problem>"
importance_tier: important
contextType: reference
version: 1.0.0.0
---
```

**`title` and `description` MUST be quoted.** Both routinely contain a colon — `title`
always does, because the convention is `Rule: <Subject>`. Unquoted, the block is invalid
YAML. Files have failed to parse on first authoring for exactly this reason, and the
failure is invisible to a reader: it looks correct and only a parser objects.

**`trigger_phrases` carry symptom vocabulary, not section titles.** The section titles are
already greppable from the body; the phrases exist to catch someone who has the problem
and does not know the rule's name. The corpus checker enforces uniqueness: no phrase is
claimed by two rules, so each phrase resolves to exactly one file.

---

## 6. SECTION ORDER

The body order is not arbitrary and is consistent where subjects overlap:

1. The mechanism or scale the rule turns on — the ladder, the tiers, the registers.
2. How to apply it, in the order a reader hits the decisions.
3. Composition with other rules, where any exists.
4. `WHAT THIS RULE IS NOT` — where present, it was added after a misreading occurred.
   Recommended whenever a rule could be read as licence.
5. `SELF-CHECK` — always last, one item per obligation the body creates.

---

## 7. SELF-CHECK

- [ ] Every MUST element in section 1 appears in the generated rule.
- [ ] Dividers equal numbered sections exactly.
- [ ] `title` and `description` are quoted, and the frontmatter parses.
- [ ] Trigger phrases are symptom vocabulary, and none duplicates another rule's.
- [ ] Every numbered section names a failure it prevents.
- [ ] Self-check items correspond one-to-one with the obligations the body creates.
- [ ] Sideways cross-references default to zero; any that exist replace a restatement.
- [ ] Length lands in a band, and a rule at the limit can say why it needs the room.
- [ ] The header line declaring the rule's rank below `AGENTS.md` is present, verbatim.
