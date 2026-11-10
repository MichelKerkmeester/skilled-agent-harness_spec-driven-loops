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