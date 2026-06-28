# Iteration 4: Dispatch contracts for sub-agents and MiniMax-M3

## Focus

Investigate how to prevent dispatched sub-agents and small models from under-loading `sk-design` context.

## Findings

1. `sk-prompt-models` is the owner of per-model prompt craft for small models, including MiniMax-M3 via `cli-opencode`. It says the model profile must be read before dispatch and that executor mechanics live separately in `cli-opencode`. [SOURCE: file:.opencode/skills/sk-prompt-models/SKILL.md:3] [SOURCE: file:.opencode/skills/sk-prompt-models/SKILL.md:37] [SOURCE: file:.opencode/skills/sk-prompt-models/SKILL.md:207]

2. The canonical CLI prompt card says a model profile overrides cross-model defaults when one exists. It identifies skipped profile loading as the leading cause of underperformance on profiled models. [SOURCE: file:.opencode/skills/sk-prompt-models/assets/cli_prompt_quality_card.md:80] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/cli_prompt_quality_card.md:87]

3. MiniMax-M3's profile is not generic. It says MiniMax wants guardrail-heavy TIDD-EC framing plus dense pre-planning, specifically 4-5 ordered steps with input, output, acceptance criterion and verification command. [SOURCE: file:.opencode/skills/sk-prompt-models/references/models/minimax-m3.md:33] [SOURCE: file:.opencode/skills/sk-prompt-models/references/models/minimax-m3.md:56] [SOURCE: file:.opencode/skills/sk-prompt-models/references/models/minimax-m3.md:95]

4. `cli-opencode` requires passing the spec folder to dispatched sessions, and its prompt-construction rule says to consult `sk-prompt-models` before composing prompts for profiled small models. A thin prompt that omits spec folder, scope and context manifest violates this dispatch shape. [SOURCE: file:.opencode/skills/cli-opencode/SKILL.md:318] [SOURCE: file:.opencode/skills/cli-opencode/SKILL.md:319] [SOURCE: file:.opencode/skills/cli-opencode/SKILL.md:321]

5. The MiniMax executor template in `cli-opencode` mirrors the same TIDD-EC dense scaffold and says to omit `--agent`. It also gives a concrete invocation shape with `opencode run --model minimax-coding-plan/MiniMax-M3 --dir "$REPO_ROOT" "$(cat prompt.md)" </dev/null`. [SOURCE: file:.opencode/skills/cli-opencode/assets/prompt_templates.md:488] [SOURCE: file:.opencode/skills/cli-opencode/assets/prompt_templates.md:494] [SOURCE: file:.opencode/skills/cli-opencode/assets/prompt_templates.md:502]

## Sources Consulted

- `.opencode/skills/sk-prompt-models/SKILL.md`
- `.opencode/skills/sk-prompt-models/assets/cli_prompt_quality_card.md`
- `.opencode/skills/sk-prompt-models/references/models/minimax-m3.md`
- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/skills/cli-opencode/assets/prompt_templates.md`

## Assessment

`newInfoRatio`: 0.74

Novelty justification: connected context-loading failures to prompt-pack structure and showed why MiniMax-M3 is especially sensitive to thin delegation.

Confidence: high for MiniMax-M3; medium for other small models because only MiniMax was deeply inspected in this lineage.

## Reflection

What worked: The model-specific profile turns "small models need more context" into a concrete prompt contract.

What failed or was ruled out: "Use sk-design" is not a sufficient delegated instruction. The prompt must carry a manifest of exact required reads, output shape and verification.

## Recommended Next Focus

Convert the discovered contracts into hard gates and self-checks that an agent must complete before design build or audit completion.
