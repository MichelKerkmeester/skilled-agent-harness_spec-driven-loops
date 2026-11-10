### .skilled/skills/sk-prompt/README.md

- [P2] .skilled/skills/sk-prompt/README.md:159 | 6 | The detailed fit and skip guidance comes after the workflow, although readers need it before deciding whether to use the skill. | Move lines 159–161 into Section 2 after line 38 and before “The Framework Layer.”
- [P2] .skilled/skills/sk-prompt/README.md:38 | 7 | This paragraph combines routing, checklist and early exit, drafting, self-checking, scoring, and delivery. | Convert the remaining process description into an ordered list with one item for each action, preserving their current order and claims.
- [P2] .skilled/skills/sk-prompt/README.md:15 | 3 | The intro repeats the workflow summary in “What It Does.” | Replace the intro with `> The prompt comes first; the explanation follows.` and remove the matching output-order sentence from line 38.

### .skilled/skills/sk-prompt/ROUTER.md

- [P2] .skilled/skills/sk-prompt/ROUTER.md:97 | 8 | The resource list and loading-level table omit `assets/cli-prompt-quality-card.md`, though the intent model and resource map route to it. | Add the file to the resource list and add a `CONDITIONAL` row for `CLI_FAST_PATH` in the loading-level table.

### .skilled/skills/sk-prompt/SKILL.md

- [P2] .skilled/skills/sk-prompt/SKILL.md:41 | 1 | The WHEN TO USE section includes a resource path, which the skill template reserves for SMART ROUTING. | Move the sentence beginning `The DESIGN_GEN intent loads` into Section 2’s existing resource-loading paragraph.
- [P2] .skilled/skills/sk-prompt/SKILL.md:61 | 1 | SMART ROUTING has six nonblank lines, below the template’s 8–12 line requirement. | Split the clauses after the semicolons on lines 60–61 into separate prose lines, preserving their wording.
- [P2] .skilled/skills/sk-prompt/SKILL.md:179 | 8 | The “Asset Files” inventory omits `assets/framework-registry.json`. | Add `- [framework-registry.json](./assets/framework-registry.json) - Machine-readable scaffold registry with code-oriented slot templates for a subset of five frameworks`.
- [P2] .skilled/skills/sk-prompt/SKILL.md:306 | 10 | “RELATED PLAYBOOK” is an unnumbered H2 after the related-resources section; render validation also flags both issues. | Replace it with `### RELATED PLAYBOOK` and place its content under Section 9 after line 304.

### .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md

- [P2] .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md:17 | 3 | The intro repeats the purpose stated in the overview. | Replace it with `The sections below cover the fast path and escalation boundary for CLI prompt work.`
- [P1] .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md:85 | 5 | Tier 1 directs the reader to dispatch before the later section states that persona injection is mandatory. | Insert `Apply Section 6 (PERSONA INJECTION) before any external-CLI dispatch.` before the dispatch instruction.
- [P2] .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md:56 | 7 | This paragraph combines the preferred planning density, its trade-offs, and model-specific responsibilities. | Split it into three bullets at those claim boundaries, preserving the existing wording.

### .skilled/skills/sk-prompt/assets/format-guide-json.md

- [P2] .skilled/skills/sk-prompt/assets/format-guide-json.md:17 | 3 | The intro repeats the JSON purpose and benefits stated in the overview. | Replace it with `The examples below show prompts delivered as JSON.`

### .skilled/skills/sk-prompt/assets/format-guide-markdown.md

- [P2] .skilled/skills/sk-prompt/assets/format-guide-markdown.md:17 | 3 | The intro repeats the Markdown purpose and benefits stated in the overview. | Replace it with `The examples below show prompts delivered as Markdown.`

### .skilled/skills/sk-prompt/assets/format-guide-yaml.md

- [P2] .skilled/skills/sk-prompt/assets/format-guide-yaml.md:17 | 3 | The intro repeats the YAML purpose and benefits stated in the overview. | Replace it with `The examples below show prompts delivered as YAML.`

### .skilled/skills/sk-prompt/references/improvement-checklist.md

- [P2] .skilled/skills/sk-prompt/references/improvement-checklist.md:24 | 4 | The overview lacks the template’s Purpose and When to Use opening. | Add `### Purpose` before the purpose statement and `### When to Use` before the applicable trigger guidance.
- [P2] .skilled/skills/sk-prompt/references/improvement-checklist.md:18 | 3 | The intro repeats the one-pass sequence that opens the overview. | Replace it with `This reference explains the checklist and delivery rules used by sk-prompt.`
- [P1] .skilled/skills/sk-prompt/references/improvement-checklist.md:52 | 5 | The instruction to mark every checklist row appears before the later effort rules that limit `$short` to four rows. | Move the effort-level rules from lines 76–87 before the checklist, renumbering sections to keep integer headings in order.
### .skilled/skills/sk-prompt/references/patterns-evaluation.md

- [P2] .skilled/skills/sk-prompt/references/patterns-evaluation.md:20 | 1 | The reference template’s opening divider is missing between the intro and OVERVIEW | Insert `---` and a blank line before `## 1. OVERVIEW`.
- [P2] .skilled/skills/sk-prompt/references/patterns-evaluation.md:22 | 4 | OVERVIEW omits Purpose and places Core Principle before When to Use | Insert `### Purpose\n\nThis reference helps readers choose and refine prompts, then assess their quality with CLEAR scoring.` before line 22; move the existing Core Principle block (lines 22–24) to after the When to Use list.
- [P2] .skilled/skills/sk-prompt/references/patterns-evaluation.md:42 | 7 | The paragraph packs the ordered skeleton elements and preset-selection rules together | Replace the paragraph with:
  
  ```markdown
  Every prompt starts from one default skeleton, in this order:
  1. Task and outcome
  2. Context
  3. Constraints and priorities
  4. Output format
  5. Examples, when they help
  6. Success criteria
  
  Add a role or steps only when they change the response. The seven frameworks below are optional presets: apply one when the user or caller names it, or when its fit is clear from the task. No preset is required.
  ```
- [P2] .skilled/skills/sk-prompt/references/patterns-evaluation.md:343 | 5 | The rule to ask for conclusions and criteria rather than a reasoning transcript follows the example it governs | Move line 343 to immediately after line 328, before the YAML example.
- [P2] .skilled/skills/sk-prompt/references/patterns-evaluation.md:378 | 5 | The instruction for formatting few-shot cases follows the example it governs | Move line 378 to immediately after line 363, before the YAML example.
