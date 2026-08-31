---
title: "Implementation Summary: Phase 2: Inventory and Skill Contract"
description: "Four contract documents derived from a mechanical parse of all nine governance files. The corpus proved almost perfectly regular - ten elements at 8-of-8, dividers-equal-sections at 9-of-9 - while the stated line ceiling turned out to be exceeded by five of eight files, and the rules turned out to be nearly independent at four cross-references total."
trigger_phrases:
  - "inventory result"
  - "anatomy contract"
  - "line ceiling defect"
  - "refusal reproduction"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/002-inventory-and-skill-contract"
    last_updated_at: "2026-08-31T11:33:09Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Derived the anatomy contract and recovered the decision tests"
    next_safe_action: "Scaffold the mode packet and build both templates"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-inventory-and-skill-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-inventory-and-skill-contract |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four contract documents that let phase 3 build a template without re-reading the corpus.
The eight rules turned out to agree far more than expected — and the inventory found one
real defect and one finding that changes the doctrine.

### The corpus is almost perfectly regular

Ten structural elements are 8-of-8, including one that is 9-of-9: **dividers equal
numbered sections in every file, with zero variance**, the router included. Frontmatter
carries six keys in exactly one order across all eight. `Fires when`, `The rule`, the
routed-from line, the subordination line and the closing self-check are universal, and
the subordination line is verbatim identical in all eight.

What varies is what should: trigger phrases 16-20, sections 6-12, self-check items 5-11,
length 145-224. Each tracks the subject rather than a house style.

### The stale ceiling, replaced with bands

The ~160-line ceiling stated when the set was six files is exceeded by **five of eight**,
and was never revisited after two rules were added and every file gained 16-20 lines of
frontmatter. I first proposed replacing it with proportionality — length earned from
section count. The operator set bands instead: 250 max, 200 good, 160 or lower preferred.

That is the better answer and it corrects mine. Proportionality was true but needed a
reader to apply it; a band is checkable. The corpus lands three preferred, two good, three
at the limit, none over — so the constraint fits what exists rather than needing revision
the moment it is written.

### The finding: the rules are nearly independent

**Four inter-rule cross-references across eight files.** Every rule links back to the
router; almost none links sideways. "Cross-reference rather than restate" was written as a
duplication guard, and the measured result is that rules rarely need each other at all. A
generated rule should default to zero sideways links.

### What the mode is actually for

It turns a user's request into a rule file. Someone describes a behaviour they want or a
failure they keep hitting, and the mode decides whether that may become a rule at all,
then authors it. Create is the common path but not the only one: because a rule is a
revisable supplement rather than law, the mode also changes rules that stopped matching
the work and removes ones that stopped earning their load.

The router question resolved alongside it. The mode emits `REPO RULES.md` for a repository
with none — but as a **prerequisite**, not a co-equal output. Nobody asks for the router;
it gets created because the destination does not exist yet, the way a build makes a
directory before writing into it. The two templates have different standing.

### What a rule is

Recorded as section 0 of the anatomy contract, because it governs everything after it: a
repo rule **supplements the harness**. It can be overridden by a live operator
instruction, changed when it stops matching the work, and removed when it stops earning
its load. Every shipped rule already declares its own rank below `AGENTS.md` in a verbatim
header line, 8 of 8 — that line is the rule stating it is not law.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `rule-anatomy.md` | Created | MUST and MAY elements, every one traced to the rules that use it |
| `decision-tests.md` | Created | Four tests deciding whether a rule may exist, each recovered from its source phase |
| `mode-boundary.md` | Created | Ownership against twelve sibling modes, plus the two questions people actually ask |
| `target-tree.md` | Created | The packet layout, inherited from `sk-create-command` |
| `scratch/inventory.py` | Created | The structural parser; the table it produced is the artifact |
| `scratch/refusal-reproduction.md` | Created | The ten-for-ten reproduction check |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Mechanically first, then by judgment, with a written artifact between the two so a reader
can tell which is which.

A parser read all nine files into an element table — frontmatter keys, heading shapes,
divider positions, self-check counts, cross-reference targets, line and byte counts. No
sampling: a contract built from a sample is the failure the delegation rule names. Only
then was the contract written, and every MUST element in it carries a count from that
table rather than an impression.

The decision tests were **recovered rather than restated**. Each was traced to the phase
that established it: the always-loaded test to the research phase's finding that 18
`AGENTS.md` row-groups "reduce to one property — always-loaded force"; the scope boundary
to the router's own section 4, quoted rather than paraphrased; the four-part refusal test
to the adoption phase that used it to decline ten candidates.

That last one was then tested against itself. All ten candidates were re-run through the
recovered tests, and **all ten still fail, each by the test its original reason names**.
The original record labelled its conditions (a) through (d), mapping one-to-one onto the
recovered four-part test — which is the evidence that the recovery is the original rather
than a plausible reconstruction.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Parse mechanically before writing prose | An impression of eight similar files reliably reports them as identical; the point of the inventory is to find where they disagree |
| Adopt operator-set length bands over my proportionality rule | Mine was true and needed a reader; bands are checkable, and the corpus fits them without revision. An enforceable approximation beats an unenforceable truth |
| Record the ceiling breach without editing phase 1 | Phase 1 is closed. The bands govern what comes next; the shipped files stay as they are, and all of them fit anyway |
| Default generated rules to zero sideways cross-references | Measured, not assumed: four links across eight files. The corpus says rules are independent |
| Two templates with different standing | The rule template is what the mode is for; the router is a prerequisite emitted when the destination is missing. Treating them as co-equal would misdescribe the mode |
| Inherit the tree from `sk-create-command` | Closest sibling in shape — authors a document plus its wiring, and carries `assets/` for what it emits |
| Defer `benchmark/`, `feature-catalog/`, `manual-testing-playbook/` | Each has a precedent for arriving after the skill ships. Scaffolding them empty now builds for a future nobody asked for |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus byte-unchanged | PASS - md5 set identical to the baseline captured before any tool ran |
| Traceability: every MUST element cites the corpus | PASS - 10 elements, each with an 8/8 or 9/9 count from the element table |
| Coverage: every element class inventoried | PASS - 9 files x 6 element classes, no sampling |
| Decision tests recovered, not restated | PASS - each cites the phase record that established it |
| Ten-for-ten refusal reproduction | PASS - all ten candidates still refused, each by the test its original reason names |
| Contract documents parse as YAML | PASS - 4 of 4 |
| Open question settled by evidence | PASS - the router-generation question answered from the measured structural difference, not by preference |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The contract describes eight files by one primary author.** Regularity that high may reflect a single hand rather than a discovered optimum. A ninth rule written by someone else is the real test, and it has not happened.
2. **The bands are checkable but arbitrary at the edges.** Nothing distinguishes a 250-line rule from a 251-line one except the number. That is the price of enforceability, and it is the right price — but a rule at 248 has not earned anything by being under the line.
3. **The zero-sideways-links default is inferred from four data points.** Four links across eight files is a thin basis for a default, even though the direction is clear.
4. **The router template is specified but unexamined at depth.** The verdict that it is a distinct document class rests on structural absence — no frontmatter, no `Fires when`, no self-check. Nobody has asked what a *good* router looks like, only what this one is. It matters less now that the router is a prerequisite rather than a headline output, but phase 3 still inherits the gap.
5. **Change and remove are in scope but unspecified.** The mode owns updating and deleting rules, which follows from a rule being revisable. Neither path has a contract yet — what a removal does to the router rows, the pointer in the governed section, and the `version` field is phase 5's problem and is not yet written down.
6. **Nothing validates a generated rule against this contract.** Enforcement tooling stayed out of scope, consistent with every prior phase, so conformance depends on the mode following its own template.
<!-- /ANCHOR:limitations -->

---


