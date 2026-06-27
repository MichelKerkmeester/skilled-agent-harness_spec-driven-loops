# Iteration 5: Hard gates and pre-flight self-checks

## Focus

Convert reference requirements into enforceable gates that prevent repeat misses.

## Findings

1. A `sk-design` context manifest should be required before UI build or design audit work. Minimum fields: register posture, loaded modes, loaded shared references, foundations contrast status, audit/pre-flight artifact status, target surface, and evidence labels. This is directly supported by interface success criteria requiring register, dials, token plan, quality floor and pre-flight pass. [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:247]

2. Auto-pairing rule: `interface` alone is acceptable only for pure direction advice. Any build, redesign implementation, page/component generation, or "make this UI good" task should load `interface + register + foundations(color/typography/layout as applicable) + interface pre-flight`. Add `audit` when the user asks for review, release readiness, accessibility, score, critique, or when final delivery claims quality. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:56] [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:79] [SOURCE: file:.opencode/skills/sk-design/design-audit/SKILL.md:23]

3. Contrast gate: if any new or changed foreground/background pair exists, the agent must list the pair, source token/value, measured or computed status, and repair path. This follows foundations' contrast and gamut rule plus the OKLCH foreground/background repair sequence. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:272] [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:60]

4. Audit gate: any audit or release-readiness claim must fill the evidence worksheet or equivalent compact fields before scoring. "Not assessed" must not become pass. The audit packet explicitly forbids accessibility claims without keyboard, focus, name, semantics and contrast evidence. [SOURCE: file:.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md:62] [SOURCE: file:.opencode/skills/sk-design/design-audit/SKILL.md:321]

5. Sub-agent gate: the parent prompt should require the child to echo a loaded-context card before work begins and a proof-of-application card at the end. For MiniMax-M3, this must be embedded inside TIDD-EC with dense pre-plan steps, because that is the model-specific scaffold. [SOURCE: file:.opencode/skills/sk-prompt-small-model/references/models/minimax-m3.md:95] [SOURCE: file:.opencode/skills/sk-prompt-small-model/references/models/minimax-m3.md:126]

## Sources Consulted

- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md`
- `.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md`
- `.opencode/skills/sk-prompt-small-model/references/models/minimax-m3.md`

## Assessment

`newInfoRatio`: 0.64

Novelty justification: transformed source contracts into a proposed gate set and context manifest.

Confidence: medium-high. The gates are inferred from source contracts rather than already implemented scripts.

## Reflection

What worked: The observed misses align to four checkable proof fields: register loaded, color pairs checked, pre-flight filled, dispatch profile used.

What failed or was ruled out: Advisory reminders alone are insufficient. The agent must produce evidence that the right context was loaded and applied.

## Recommended Next Focus

Investigate fan-out merge and adoption discipline so lineage recommendations can be compared without unsafe automatic promotion.
