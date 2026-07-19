# Iteration 3: Anthropic Creation Prompt Anatomy

## Focus
Extract reusable creation-prompt structure from Anthropic's frontend-design skill.

## Actions Taken
1. Fetched the official Anthropic frontend-design skill.
2. Compared it with this repository's vendored `design-interface` mode.
3. Separated orchestration patterns from design-judgment content.

## Findings
1. The external prompt starts with a role, quality stakes, brief specificity, and one justified risk. That establishes a creative contract before mechanics, unlike the current command's setup-first framing. [SOURCE: https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md]
2. Its grounding rule converts missing brief facts into a bounded assumption: name subject, audience, and page job, state the choice, then derive from the subject's world. This is a better fallback than either failing on thin briefs or asking an exhaustive interview. [SOURCE: https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md]
3. Its executable scaffold is explicit and ordered: brainstorm a compact token system, critique against known defaults, revise, build from the revised plan, and self-critique the render. The plan has concrete slots for palette, type roles, layout/wireframe, and one signature. [SOURCE: https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md]
4. The local `design-interface` mode already vendors and expands this doctrine, including ground -> token system -> critique -> build -> self-critique plus quality and handoff gates. Commands should invoke and expose the phase contract, not duplicate the principles text. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:14-16] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:59-69] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:196-227]
5. The reusable command template is therefore: `Creative Contract -> Brief Resolution -> Grounding Evidence -> Mode Call -> Visible Plan/Build Stages -> Critique/Proof -> Handoff`. Mode-specific content fills these slots. [INFERENCE: based on findings 1-4]

## Questions Answered
- The durable Anthropic creation structure and the no-duplication boundary.

## Questions Remaining
- How a multi-turn tool such as Open Design changes the build scaffold.
- How audit should fit the namespace.

## Ruled Out
- Copying the full Anthropic skill into every command.
- Making a fixed visual style or named aesthetic part of command intake.

## Assessment
- New information ratio: 0.84
- Novelty justification: Five findings add the external creation sequence and a project-native seven-stage template.

## Reflection
- What worked: comparing upstream and vendored sources identified the exact authority boundary.
- What failed: treating a creation prompt as merely a richer list of questions.
- Next adjustment: inspect Open Design's multi-turn discovery/build/revision lifecycle.

## Recommended Next Focus
Map Open Design's discovery form, system reuse, build turn, render inspection, and targeted revision into command-template stages.
