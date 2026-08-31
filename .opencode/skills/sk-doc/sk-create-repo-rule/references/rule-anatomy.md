---
title: "Rule Anatomy Contract"
description: "The structure every repo rule carries, derived mechanically from the nine shipped files rather than asserted. Every MUST element is used by 9 of 9; every MAY element records why it varies; every divergence is classified as a permitted variant or a defect the contract forbids going forward."
trigger_phrases:
  - "rule anatomy"
  - "repo rule structure"
  - "MUST carry MAY carry"
  - "rule template contract"
  - "divergence classification"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule Anatomy Contract

Derived from the eight files under `repo-rules/` plus the router, parsed structurally by
`scratch/inventory.py`. Nothing below is aspirational: every MUST element was found in
8 of 8 rules, and the counts are measured, not recalled.

---

## 0. WHAT A REPO RULE IS

A repo rule **supplements the harness**. It is not a law and not a contract with the
runtime: it can be overridden by an explicit operator instruction, changed when it stops
matching how the work is actually done, and removed when it stops earning its load.

Three consequences the template must carry:

- **A rule sits below `AGENTS.md` and below a live operator instruction.** Every shipped
  rule says so in its own header line, verbatim, 8 of 8. That line is not boilerplate to
  be trimmed — it is the rule declaring its own rank.
- **A rule is revisable.** It carries a `version` field for exactly this reason. Writing
  one is not a permanent commitment, and treating it as one is what produces rules nobody
  will delete after they stop being true.
- **Removal is a normal outcome.** The set has already subtracted once — a duplicated
  restraint ladder whose rung numbering contradicted the authoritative one. A review that
  only ever adds has not reviewed anything.

This is why the mode owns changing and removing rules, not only creating them.

---

## 1. WHAT THE CORPUS AGREES ON

Every one of these is 9/9. A generated rule that omits any is not a rule of this set.

| Element | Shape | Evidence |
|---------|-------|----------|
| Frontmatter | Six keys, one order: `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `version` | 9/9, exactly one distinct key order across the corpus |
| Title line | `# Rule: <Subject>` | 9/9 |
| Routed-from line | `> Routed from [REPO RULES.md](../REPO%20RULES.md). <when to load>.` | 9/9 |
| Subordination line | `> Expands AGENTS.md, never overrides it — where they appear to disagree, AGENTS.md wins and this file is wrong. Say so.` | 9/9, verbatim |
| `## Fires when` | Unnumbered; a bullet list of actions, not topics | 9/9 |
| `## The rule` | Unnumbered; exactly one bold binding sentence, then at most a short gloss | 9/9 |
| Numbered body | `## N. ALL CAPS TITLE`, sequential from 1 | 9/9, all uppercase outside backticks |
| Divider discipline | One `---` per numbered section | 9/9 rules and the router — dividers equal numbered sections in all 10 files, with no exception |
| Closing self-check | Final numbered section, titled `SELF-CHECK`, a `- [ ]` checklist | 9/9 |
| Back-link | A resolving link to `../REPO%20RULES.md` | 9/9 |

**The strongest invariant is the divider rule.** Dividers equal numbered sections in all
ten files including the router, with zero variance. It is the one structural property a
generator can assert without qualification.

---

## 2. WHAT VARIES, AND WHY

These scale with the rule's subject. A generator sets no target for them.

| Element | Observed range | Why it varies |
|---------|----------------|---------------|
| `trigger_phrases` | 16-20 | Find surface, not an index. A rule with more distinct symptoms earns more phrases |
| Numbered sections | 6-12 | `uncertainty-and-honesty` needs 7; `evidence-and-proof` needs 12. Section count follows the subject |
| Self-check items | 5-11 | One per obligation the body actually creates |
| Total lines | 145-224 | Follows section count |
| Inter-rule cross-references | 0-5 per file, 10 links total across the set | Rules are more independent than the cross-reference doctrine implies. See section 4 |

---

## 3. LENGTH BANDS

Operator-set, and they replace the stale ~160 ceiling the set carried from when it was
six files. Counts include frontmatter, because that is what a reader loads.

| Band | Range | Meaning |
|------|-------|---------|
| **Preferred** | ≤ 160 | Where a rule should land. Most subjects fit |
| **Good** | 161-200 | Acceptable without comment |
| **At the limit** | 201-250 | Allowed, but the rule should be able to say why it needs the room |
| **Over** | > 250 | Split it, or cut it |

Measured against the shipped set:

| File | Lines | Band |
|------|-------|------|
| `hub-routing.md` | 127 | preferred |
| `uncertainty-and-honesty.md` | 145 | preferred |
| `blast-radius.md` | 154 | preferred |
| `root-cause.md` | 159 | preferred |
| `overengineering.md` | 164 | good |
| `scope-discipline.md` | 164 | good |
| `evidence-and-proof.md` | 209 | at the limit |
| `communication.md` | 219 | at the limit |
| `delegation-and-orchestration.md` | 224 | at the limit |

**Four preferred, two good, three at the limit, none over.** The corpus fits, which is
what makes this a usable constraint rather than a number to be revised again.

The three at the limit each absorbed content moved down from `AGENTS.md`, so their length
is explained rather than accidental. A new rule starting at 210 has no such explanation
and should be looked at.

> A band is checkable, which the proportionality rule this replaces was not. That
> trade was deliberate: an enforceable approximation beats an unenforceable truth.

---

## 4. A SECOND FINDING: THE RULES ARE NEARLY INDEPENDENT

The corpus carries **10 cross-reference links in total, 7 distinct pairs**, across 9 files, and only 3 files carry any. Every rule
links back to the router; almost none links sideways.

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
YAML. All eight files failed to parse on first authoring for exactly this reason, and the
failure is invisible to a reader: it looks correct and only a parser objects.

**`trigger_phrases` carry symptom vocabulary, not section titles.** The section titles are
already greppable from the body; the phrases exist to catch someone who has the problem
and does not know the rule's name. Measured: 161 phrases across 9 files, no duplicates,
every phrase resolving to exactly one rule.

---

## 6. SECTION ORDER

The body order is not arbitrary and is consistent where subjects overlap:

1. The mechanism or scale the rule turns on — the ladder, the tiers, the registers.
2. How to apply it, in the order a reader hits the decisions.
3. Composition with other rules, where any exists.
4. `WHAT THIS RULE IS NOT` — present in 3 of 8, and every one of those three was added
   after a misreading occurred. Recommended whenever a rule could be read as licence.
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
