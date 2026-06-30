# Iteration 4: Testing And Tooling Leverage

## Focus

Evaluate manual scenarios and identify low-risk tooling improvements.

## Findings

1. Foundations already has six manual scenarios: color, typography, layout, adaptation, data visualization, and token handoff. The root playbook requires exact prompt, resources loaded, produced token/system plan, sibling-boundary evidence, and a verdict. [SOURCE: file:.opencode/skills/sk-design/design-foundations/manual_testing_playbook/manual_testing_playbook.md:11-38]
2. Each scenario carries useful `expected_intent` and `expected_resources` metadata. This is already close to a fixture matrix for routing and resource-loading checks. [SOURCE: file:.opencode/skills/sk-design/design-foundations/manual_testing_playbook/01--color/001-oklch-palette-and-dark-mode.md:10-14], [SOURCE: file:.opencode/skills/sk-design/design-foundations/manual_testing_playbook/04--data-viz/001-chart-encoding-and-color.md:10-14]
3. The layout, adaptation, data-viz, and token scenarios explicitly assert that foundations should run before `sk-code` handoff for static-system decisions. These are good routing regression prompts and should be reused in Mode A benchmark fixtures. [SOURCE: file:.opencode/skills/sk-design/design-foundations/manual_testing_playbook/03--layout/001-layout-rhythm-responsive.md:28-34], [SOURCE: file:.opencode/skills/sk-design/design-foundations/manual_testing_playbook/05--tokens/001-token-starter-handoff.md:28-35]
4. Current README verification validates package structure and README shape, then says manual scenarios should PASS or SKIP for environment reasons. It does not record an executed scenario matrix, nor tie the manual prompts to the routing benchmark. [SOURCE: file:.opencode/skills/sk-design/design-foundations/README.md:124-130]
5. Recommended tooling improvement: add a lightweight `manual_testing_playbook/results.md` or `routing-fixtures.md` that lists the six prompts, expected mode, expected resources, last verdict, and benchmark inclusion status. This adds trust without granting the foundations skill new runtime tools. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:1-5]

## Sources Consulted

- `manual_testing_playbook/manual_testing_playbook.md`
- `manual_testing_playbook/01--color/001-oklch-palette-and-dark-mode.md`
- `manual_testing_playbook/03--layout/001-layout-rhythm-responsive.md`
- `manual_testing_playbook/04--data-viz/001-chart-encoding-and-color.md`
- `manual_testing_playbook/05--tokens/001-token-starter-handoff.md`
- `README.md`

## Assessment

- newInfoRatio: 0.32
- Novelty: Moderate. The scenarios existed, but the benchmark-linkage opportunity is new for this run.
- Confidence: High for scenario inventory; medium for benchmark linkage because the benchmark artifact itself was absent.

## Reflection

- What worked: Scenario frontmatter is structured enough to reuse.
- What failed: No current results file proves the scenarios have recently run.
- Ruled out: Adding heavy automation or Bash-powered runtime checks to the foundations skill.

## Recommended Next Focus

Prioritize all findings and assemble the explicit do-not list.
