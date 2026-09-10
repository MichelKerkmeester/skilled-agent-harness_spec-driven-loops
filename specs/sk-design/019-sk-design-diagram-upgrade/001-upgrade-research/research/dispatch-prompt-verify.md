GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. Nobody is at a prompt; no answer can reach you.
Your write authority is your lineage directory under:
  specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/lineages/
Write nothing outside it. Proceed directly to the work.

---

# TASK

A first lineage (GLM-5.3-Flash, label `glm`) produced 29 findings on how `sk-design-diagram`
should be upgraded to the `sk-design-chart` standard. Your job is two things, in this order:
**verify** its findings against the disk, then **deepen and extend** them. Five iterations,
one per angle, in the same order the first lineage used. Do not converge early: five
iterations are required. Keep each iteration under twelve tool calls; batch reads (one grep
over many files counts once); write the iteration file before moving on.

# READ THESE FIRST, IN THIS ORDER

1. `specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/dispatch-prompt.md`
   — the original brief: the two skills, the measured facts, the three non-negotiables, the five angles.
2. `specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/research.md`
   — the conductor's synthesis of the first lineage.
3. `specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/lineages/glm/iterations/iteration-00<n>.md`
   — the first lineage's iteration for the angle you are on. Read it at the start of each iteration.

Everything is local. Do not fetch anything.

# PER ITERATION

**Part A — verify.** For every numbered finding in the first lineage's iteration for this angle,
recount or re-read the claim against the disk and mark it one of:
- CONFIRMED — your evidence, with file:line or the exact command and its count.
- CORRECTED — what the disk actually says, with evidence. Be specific about the delta.
- UNVERIFIABLE — why, in one sentence.
The first lineage hand-counted several censuses (it says so). Recount mechanically. It also
listed "what this iteration could not settle" each time; settle every item where the disk has
the evidence, and say so where it does not.

**Part B — deepen and extend.** What the first lineage did not reach. Some known gaps:
- Angle 1: whether any example carries a second `<svg>`; the exact assertion text and regex
  for each proposed family, and the per-file failure counts for all 34, not samples.
- Angle 2: which files carry the 40 `#ffffff` occurrences and in what role; the two examples
  carrying neither the warm nor the cool rule-rgba; whether dark-column values are fixed
  derivations of light ones (compute it: is `#f08a59` a lightness shift of `#eb6c36` at a
  stated ratio?).
- Angle 3: whether the type scale reflows the 4px grid under substitute fonts — measure text
  widths if you can, otherwise state what would measure it; whether README's "inlined CSS"
  wording strictly conflicts with the remote stylesheet.
- Angle 4: read the screenshots. You can open PNG files. Judge whether the captures under
  `screenshots/` match the current skin (cool `#2d3142` ink on `#f5f5f5` paper) or the retired
  warm one; the first lineage could not open images. The precise ceiling wording in all 27
  `references/types/type-*.md` files, tabulated.
- Angle 5: challenge the phase order. Is there a cheaper order that still satisfies the
  base-clean and no-backlog doctrines? Name the seven decisions of phase 2 with your own
  recommended answer and the evidence for each, so the operator signs a proposal, not a list.

# THREE THINGS THAT ARE NOT UP FOR DEBATE

1. Decisions transfer; code never copies blindly. Every family must be re-stated for SVG.
2. A diagram chooses a skin; a chart follows the reader. Argue the model, do not assume it.
3. This phase produces findings. Do not rewrite any file outside your lineage directory.

# DO

- Cite every claim to a local file and line, or to the exact command you ran and its output.
- Append each iteration to `research/lineages/<your label>/research.md` under its own heading.
- Rank recommendations; mark each [implementable today] or [needs a contract decision].
- Disagree with the first lineage plainly when the disk disagrees with it.

# OUTPUT SHAPE

```
## Iteration <n> — <angle name>

### Verification of the first lineage
<one line per finding: F<angle>.<k> CONFIRMED | CORRECTED | UNVERIFIABLE — evidence>

### Settled from "could not settle"
<each item, settled or still open, with evidence>

### What was extended
<new measurements and findings, numbered, each with evidence>

### Recommendations
<ranked; each [implementable today] or [needs a contract decision]>

### What this iteration could not settle
<explicit, or "nothing">
```
