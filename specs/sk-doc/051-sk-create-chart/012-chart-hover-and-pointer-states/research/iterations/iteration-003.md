# Iteration 003 — The Inert Register: Design and Enforcement

## Focus

ONE DELIVERABLE. Design the fourth interaction register — the one that lets a form declare itself deliberately inert — and say exactly how the checker enforces it. Tier-0 classification is closed (six correctly-inert, daily-range needs-pointer) and is input, not a question.

## Actions Taken

1. Read `check-corpus.cjs` lines 1100–1240 only: `styleRules`, `INTERACTION_REGISTERS` (:1130), `HYGIENE_RULE` (:1131), `checkInteractionHygiene` (:1138), `checkInteractionState` with the dim value-capture (:1173) and the ship-empty tooltip check (:1181), and the tooltip `fmt()` requirement (:1214).
2. Probe: ran the checker from the skill root — `RESULT: PASSED`, 0 errors — establishing the pre-mutation baseline the proving mutation will be measured against.
3. Probe: confirmed which templates carry any of the three registers today (13 files), that `heat-matrix.html` carries `data-chart-tooltip` (the proving-mutation target), and that every template carries `data-chart-table` (reconfirming the known universal).

## Findings

If the existing code makes part of this unnecessary: it does — the register vocabulary (:1130), the markup-region reader, and the register value-capture pattern (`data-chart-dim\s*=\s*"([^"]*)"` at :1173) already exist, so the new rule is a sibling branch inside the existing interaction checks, roughly one constant plus two branches, not a new subsystem.

### The attribute

The attribute is `data-chart-inert`, placed on the root `<figure>` element of the form, beside the declarations a pointer-answering form already carries. Its value holds the reason in one clause — `data-chart-inert="every encoded value is printed beside its mark"` — so the declaration and its justification travel in one attribute the checker can already parse, and there is no sibling attribute or separate manifest to drift. Reading precedent is direct: `checkInteractionState` already captures a register's value with a `data-chart-dim\s*=\s*"([^"]*)"` pattern (:1173), so the same shape reads the reason. It must NOT join `INTERACTION_REGISTERS` (:1130), because that array drives the `:focus:not(:focus-visible)` hygiene requirement (:1140), and an inert form answers no pointer, so it owes no focus rule.

### Enforcement decision table

Per-file, read from the markup region alone (same surface the hygiene check already uses). `carries` means the markup matches any of `data-chart-tooltip`, `data-chart-legend`, `data-chart-dim`.

| declares `data-chart-inert` | carries another register | Verdict | Message |
| --- | --- | --- | --- |
| no | no | **pass** | Silence is not a defect. The checker enforces consistency of declared registers, not completeness of annotation — a form whose pointer work has not landed yet (tier-2 today) is not lying by being quiet. All currently-silent forms pass on day one. |
| no | yes | **pass** (existing rules apply) | `checkInteractionHygiene` already demands the `:focus:not(:focus-visible)` rule (:1140) and `checkNumberFormat` already demands `fmt()` (:1214). Nothing new fires. |
| yes, value non-empty | no | **pass** | A deliberate, reasoned inert declaration — the six correctly-inert forms end here after migration. |
| yes, value empty/whitespace | no | **error** | `the form declares data-chart-inert with no reason. The value is the why — an inert form that cannot say why the static figure suffices has not made the declaration` |
| yes (any value) | yes | **error** | `the markup declares data-chart-inert and <carried list>. A form cannot both refuse the pointer and answer it — remove the inert declaration or the <register> register` |

Defended in a line: silence passing is the same philosophy the file already holds — `checkInteractionHygiene` validates what a form *declares*, never what it omits — and an error-on-silence rule would force all 21 forms to be annotated at once, which the migration below explicitly avoids.

### Migration ordering

The checker ships FIRST: with no template annotated, no file matches the new error branches (the 13 register-carrying files hit only pre-existing pass rows; the 8 silent forms pass as silence), so the corpus stays green the day the rule lands. The six correctly-inert forms are then annotated in a follow-up commit, each with its reason, and the suite stays green because none of them carries another register. Daily-range gets no attribute — and no static rule can demand one or forbid one, because its needs-pointer status is the packet's judgment about geometry-only encoding, not a markup property; the checker enforces self-consistency of declarations and the packet docs carry the classification.

### The proving mutation

The packet requires watching the checker FAIL on a deliberate mutation. Baseline: `node scripts/check-corpus.cjs` from the skill root prints `RESULT: PASSED` (verified this iteration).

```
cd .opencode/skills/sk-doc/sk-create-chart
# 1. Mutate: in assets/templates/heat-matrix.html, on the root <figure> element,
#    insert (heat-matrix.html already carries data-chart-tooltip in its markup — verified):
#      data-chart-inert="every encoded value is printed beside its mark"
# 2. Run: node scripts/check-corpus.cjs
#    Expect: RESULT: FAILED with an interaction-register error:
#      "the markup declares data-chart-inert and data-chart-tooltip. A form cannot
#       both refuse the pointer and answer it — remove the inert declaration or the
#       tooltip register"
# 3. Revert: git restore assets/templates/heat-matrix.html
# 4. Run again — expect RESULT: PASSED (baseline restored)
```

## Questions Answered

- What shape does the inert register take, and how does the checker enforce it? — ANSWERED: `data-chart-inert` on the root `<figure>`, reason in the value; enforcement by the decision table above as a sibling branch in the existing interaction checks; checker ships before annotations; proving mutation is the heat-matrix contradiction case.

## Questions Remaining

- Tooltip-vs-legend for the seven tier-2 forms (next iteration).
- Touch; keyboard focusability; whether daily-range's tooltip follows the box-plot mechanism verbatim.

## Next Focus

Tooltip-vs-legend for the seven tier-2 forms: for each, decide which register its partial pointer answer should declare, and whether any of them is silently mis-declared today.

## SCOPE VIOLATIONS

None. All writes this iteration stayed inside the run directory; templates and `check-corpus.cjs` were read-only.
