# Iteration 4: Routing And Benchmark Evidence

## Focus

Use routing metadata and the operator-supplied benchmark score to identify md-generator routing improvements.

## Findings

- The user supplied `md-generator equals 76 of 100` for routing-benchmark Mode A. The expected `014-routing-benchmark` folder exists but contains only an empty `design-interface/` directory in this checkout, so no benchmark artifact could be cited.
- Parent graph metadata includes general design and style-reference signals, including `DESIGN.md` and `style reference` [SOURCE: .opencode/skills/sk-design/graph-metadata.json:49-65]. Its derived trigger list includes extract/generate/capture token phrases [SOURCE: .opencode/skills/sk-design/graph-metadata.json:67-116].
- The mode registry's md-generator aliases cover extraction/generation/capture/design-to-markdown but do not explicitly cover validation-only, report/preview/proof, example study, or update/fix existing DESIGN.md intents [SOURCE: .opencode/skills/sk-design/mode-registry.json:63-73].
- The md-generator skill explicitly owns validation-only, visual report generation, and example study use cases [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:34-40].

## Recommended Routing Additions

- Add aliases: `validate DESIGN.md`, `check tokens.json fidelity`, `style reference validation`, `DESIGN.md preview`, `visual report`, `fidelity proof`, `study style reference examples`, `DESIGN.md from live URL`.
- Add benchmark cases that distinguish md-generator from foundations: `design tokens from URL` should route to md-generator; `create a color token system from a brief` should route to foundations.
- Add boundary/refusal benchmark cases: brief-only DESIGN.md should not route to md-generator as a fulfilled extraction request; Figma/Open Design sources should route to their transports.

## What Was Tried And Failed

- Tried to locate the Mode A benchmark file under the named path. No files were present there, so exact failing prompts remain unknown.

## Assessment

- newInfoRatio: 0.43
- Novelty: medium. Routing gap is inferred from live metadata plus operator score, with the missing benchmark artifact clearly caveated.
- Next focus: examples and manual testing usefulness.
