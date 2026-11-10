# Iteration 2: sk-code-ci Reference and Asset Family

## Focus

Audit `.skilled/skills/sk-code/sk-code-ci/` — `SKILL.md`, `ROUTER.md`, the four reference files and the three scaffold assets — for heading shape, section order, item order and the six enumerated defect classes.

## Actions Taken

1. Read all four references end to end: `ci-workflow-standards.md`, `job-shape-rules.md`, `trigger-and-filter-rules.md`, `protected-set.md`.
2. Extracted the heading map of the packet's `SKILL.md` and `ROUTER.md`.
3. Read `SKILL.md` §1-§2b and `ROUTER.md` in full.
4. Read the three assets (`ci-profile.template.json`, `job-block-template.yml`, `workflow-template.yml` head) to confirm the assets carry no rendered-Markdown defects.
5. Checked the skill template's H2 numbering contract (`skill-md-template.md`) to judge the `2b` section.

## Findings

1. None of the four ci references carries the template's `### Purpose` plus `### When to Use` pair, and they use three different OVERVIEW shapes: `ci-workflow-standards.md` opens with `### Purpose`, `### Universal Rules and Repository Values` and `### Reading the Enforcement Column`; `job-shape-rules.md` uses two plain paragraphs with no subheading; `trigger-and-filter-rules.md` uses one plain paragraph; `protected-set.md` uses `### The Profile` and `### Profile Keys`. The same packet therefore teaches four different "overview" contracts. [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md:22] [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:23] [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md:22] [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/protected-set.md:23]

2. `job-shape-rules.md` leaks authoring state into rendered prose: line 91 is a bare `status: landed` line between `## 5. THE COMPOSITE SETUP ACTION` and the section's first paragraph. A reader sees an unexplained status token and cannot tell whether it describes the section, the action or the repository. [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:89] [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:91] [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:93]

3. `ROUTER.md` duplicates its routing declaration: the §1 paragraph already lists all four references in load order and names the default resource, then §2 repeats the same four paths in the same order. The overview is also one 120-word paragraph with no subheading, so the duplication is invisible on a skim. [SOURCE: .skilled/skills/sk-code/sk-code-ci/ROUTER.md:23] [SOURCE: .skilled/skills/sk-code/sk-code-ci/ROUTER.md:33]

4. `SKILL.md` carries `## 2b. SMART ROUTING` between §2 and §3, which breaks the skill template's "Numbered H2 sections (ALL CAPS)" contract and records authoring history in the section number. The section also restates the hub bundling rule already given in §1 and the resource list already given in §2, so the reader meets the same routing facts three times before §3. [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:28] [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:40] [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:55] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:65]

## Ruled Out

- `ci-workflow-standards.md:54` naming `assets/workflow-template.yml` looked like a dangling link, but the asset exists at 81 lines, so it is a valid pointer.
- The three scaffold assets are YAML/JSON, not Markdown; their `#<<...>>` template directives are intentional scaffold syntax rather than rendering defects.
- The blank double line before `---` in two references is whitespace noise, not a rendering defect.

## Dead Ends

- Scoring the ci references against the asset template's Purpose/Usage pair: they are references, not assets, so the reference template's Purpose/When to Use pair is the correct baseline.

## Edge Cases

- Ambiguous input: the CI packet's assets are non-Markdown scaffolds, so "every asset" was interpreted as every asset that renders as prose; the JSON and YAML files were checked for existence and ordering only.
- Contradictory evidence: `ci-workflow-standards.md` has a `### Purpose` but no `### When to Use`; the template requires both, so it counts as a partial rather than a pass.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md:1-67`
- `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:1-137`
- `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md:1-88`
- `.skilled/skills/sk-code/sk-code-ci/references/protected-set.md:1-102`
- `.skilled/skills/sk-code/sk-code-ci/SKILL.md:1-99`
- `.skilled/skills/sk-code/sk-code-ci/ROUTER.md:1-66`
- `.skilled/skills/sk-code/sk-code-ci/assets/ci-profile.template.json`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:65`

## Assessment

- New information ratio: 0.85
- Questions addressed: CI reference/asset heading shape, section order and duplication.
- Questions answered: "Which sk-code-ci references and assets violate heading shape, section order or item order, and at which exact lines?"

## Reflection

- What worked and why: comparing sibling OVERVIEW shapes inside one packet surfaced the systematic divergence faster than checking each file against the template alone.
- What did not work and why: the mechanical scan cannot see leaked authoring state such as `status: landed`, because it is valid prose; only reading the section exposed it.
- What I would do differently: read `SKILL.md` and `ROUTER.md` before the references, because their duplicated routing prose explains why the references assume a reader already knows the load order.

## Recommended Next Focus

Iteration 3: `sk-code-frontend`, including the pre-fix `web-cascade-and-selectors.md` at commit `cd00629166`, to test which enumerated defect classes were fixed there and which remain elsewhere in the packet.
