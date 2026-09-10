GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. Nobody is at a prompt; no answer can reach you.
Your write authority is your lineage directory under:
  specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/lineages/
Write nothing outside it. Proceed directly to the work.

---

# TASK

Decide how `sk-design-diagram` should be upgraded to the standard `sk-design-chart` now holds —
the same features where they transfer, adapted where the diagram context differs (a skinnable
editorial system chosen per deliverable, 27 types, SVG connectors, no data block). Evidence, not
preference. Five angles, one per iteration, in order. Do not converge early: five iterations are
required. Keep each iteration under twelve tool calls; write the iteration file before moving on.

# EVERYTHING IS LOCAL. DO NOT FETCH ANYTHING.

The upgraded chart skill, the standard to compare against:
  .opencode/skills/sk-design/sk-design-chart/
    SKILL.md (11KB), README.md, references/{template-contract,color-system,catalog,design-md-theming}.md
    assets/templates/*.html        29 forms; each carries a light and a dark palette block generated from the source
    assets/color/palettes.json     the palette source: chrome, three systems, gates, and a derivation block
    assets/style-reference/evilcharts/   the one carried Style Reference; origin.md pins every file by hash
    scripts/check-corpus.cjs       42 families, ~6,100 assertions; the binding contract
    scripts/tests/corpus-mutations.test.cjs   84 cases; every family has a case that fails on a green base, or a stated browser exemption
    scripts/apply-design-md.cjs    themes the corpus from any DESIGN.md; --default reproduces the stock palette exactly
    changelog/v1.9.0.0.md through v2.5.0.0.md   how each contract arrived, and what review found each time
  .github/workflows/chart-corpus.yml   blocking CI gating on the literal RESULT: PASSED

The diagram skill, the subject:
  .opencode/skills/sk-design/sk-design-diagram/
    SKILL.md (37KB), README.md, references/foundations/style-guide.md, references/types/type-*.md (27)
    assets/templates/*.html (4 skins), assets/examples/*.html (34), assets/icons.html
    scripts/{drawio_extract.py,mermaid_extract.py,validate-flowchart.sh}; no HTML/SVG checker, no test suite
    screenshots/{templates,examples}/*.png
  .opencode/commands/design/diagram.md and assets/diagram-{auto,confirm}.yaml, diagram-presentation.txt

# FACTS ALREADY MEASURED — VERIFY, DO NOT RE-DERIVE

- 32 of 34 diagram examples type hex inside the SVG; example-er.html has 88 hex literals and 4 var(--color-*). One hex, #3d4460, appears in no guide. style-guide.md:50 says the examples "were built under an earlier skin" and defers regenerating them.
- 33 of 34 examples put <title> first inside <svg>; example-loop-terminal.html does not, against the skill's own accessible-SVG contract.
- All 38 diagram files fetch Geist and Instrument Serif from Google Fonts; the chart corpus forbids any external resource.
- No diagram file follows prefers-color-scheme; dark is a separate template. The chart carries both grounds in every file and accepts ?scheme=.
- Three version fields disagree: SKILL.md 1.0.0.0, README.md 1.0.0.7, style-guide.md 1.0.0.5. One changelog entry exists.
- diagram.md:67 names create-diagram-auto.yaml and create-diagram-confirm.yaml; the files are diagram-auto.yaml and diagram-confirm.yaml. Both YAMLs and SKILL.md say the mode belongs to sk-doc; sk-design's mode-registry.json registers it.

# THREE THINGS THAT ARE NOT UP FOR DEBATE

1. **Decisions transfer; code never copies blindly.** check-corpus.cjs is a chart checker. Every family you propose porting must be re-stated for SVG diagrams: what it reads, what it errors on, and which diagram file fails it today.
2. **A diagram chooses a skin; a chart follows the reader.** Light, dark and terminal are per-deliverable choices in the diagram skill. Do not assume the chart's dual-block model applies; decide whether it should, with reasons.
3. **This phase produces findings.** Later phases implement. Do not rewrite a file.

# THE FIVE ANGLES, ONE PER ITERATION, IN ORDER

**1 — The contract and its checker.** Read check-corpus.cjs's family list (grep "tally('") and the diagram SKILL.md RULES and SUCCESS CRITERIA. For each diagram rule that a regex over an SVG can hold — title-first <title>, prefixed ids, role="img", hex outside :root, the 4px grid on x/y/width/height, orthogonal-only connectors, accent on painted elements, node and arrow counts against the complexity budget, external resources — name the family, the assertion, and one example file that fails it today (open the file and cite the line). Name what cannot be held statically and why.

**2 — The token source and the repaint.** Compare style-guide.md's role table with the 25 distinct hex values typed across the examples. Design the token source the way palettes.json works: roles, per-skin values, gates that apply to diagrams (text on paper, stroke on paper, accent against ink), and a derivation record. Decide how the three skins live in one source and whether a file carries one skin or all of them. State what a repaint of 34 examples by value would change and what it would break.

**3 — Style reference, design-md and fonts.** The chart carries one Style Reference and an applicator that themes from any DESIGN.md. The diagram skill has onboarding (URL, skill, folder, manual) and a skin per deliverable. Decide: does the diagram skill take a carried reference and an applicator, keep onboarding, or both — and what palette-derivation would mean here. Then the fonts: Google Fonts versus a system stack, judged against what an editorial diagram loses without Geist and Instrument Serif, and against the "self-contained" claim README.md makes.

**4 — The corpus shape.** 34 examples against 4 templates, where the chart has 29 templates and no examples. Sort the examples: which are the one canonical file per type (a template in disguise), which are variants (dark, full, terminal, sketchy, consultant) and which are decoration. Decide the template/example split, what screenshots cover, what a catalog (the chart's references/catalog.md, read in both directions by the check) would look like for 27 types, and what moves out of the 37KB SKILL.md into references. Include the command: the stale names in diagram.md and the YAMLs.

**5 — The verification loop and the phase plan.** The chart's mutation suite refuses a case whose base already fails, whose anchor is missing, or whose failure comes from another family, and a completeness guard fails when a registered family has no case. Adapt that to the diagram checker from angle 1, name the CI gate, and say what a fresh-reader capture review catches for diagrams that no check can (connector overlap, label collisions, focal balance). Then sort every finding from angles 1 to 4 into [enforceable by a family] versus [judged], rank them, and propose the phases after this one: name, scope, the gate each ends on, and their order.

# DO

- Cite every claim to a local file and line.
- Append each iteration to research/lineages/<your label>/research.md under its own heading.
- Rank recommendations; mark each [implementable today] or [needs a contract decision].
- Say plainly when the diagram skill is already better, or when a chart feature should not transfer. That is a finding too.

# DO NOT

- Do not fetch anything. Everything is local.
- Do not propose a dependency, a build step or a framework.
- Do not edit any file outside your lineage directory.

# OUTPUT SHAPE

```
## Iteration <n> — <angle name>

### What was read
<local files, with line references>

### What was measured
<numbers computed, and how>

### Findings
<numbered, each with its evidence>

### Recommendations
<ranked; each [implementable today] or [needs a contract decision]>

### What this iteration could not settle
<explicit, or "nothing">
```
