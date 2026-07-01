# Iteration 18: Literal-Safe Pattern Adopters (KQ7)

**Focus track:** pattern | **Status:** complete

## Focus
Identify which commands/skills should adopt the deep.md literal-safe pattern (deterministic table + single bounded clarification + structured header + hard boundaries).

## Findings
- **Adopter #1: orchestrate.md deep-dispatch path — replace the judgment-filled Deep Route field (:207) and the incomplete priority table (:95-105) with deep.md-style registry resolution (this is KQ4).** [SOURCE: orchestrate.md:95-105,207; iter 12]
- **Adopter #2: the 4 deep-loop command entry points (/deep:research, /deep:review, /deep:context, /deep:ai-council) — each should emit a Resolved-route header at its CLI/template seam so the resolved route is never re-inferred downstream (../001 §3 already specified these headers; verify they landed).** [SOURCE: ../001/research.md §3 (pre-route edits table); commands/deep/{research,review,context,ai-council}.md]
- **Adopter #3: the cli-opencode executor seam — the CLI has no agent flag and passes a positional message (../001 §3.1); a structured route header in the prompt is the only identity carrier, so the literal-safe header must be mandatory there, not optional.** [SOURCE: ../001/research.md §3.1; cli-opencode/SKILL.md]
- **Non-adopter (intentional): general-purpose agents (@context, @code, @review) should NOT get a hard route table — their value is flexibility (orchestrate.md:99-105,116). The pattern applies to ROUTING surfaces, not execution surfaces.** [SOURCE: orchestrate.md:99-105,116; deep.md:59 (Claude-flex preserved)]

## Sources Consulted
- orchestrate.md:95-105,207
- ../001-deep-agent-router-and-orchestration/research/research.md §3,§3.1
- commands/deep/*.md
- cli-opencode/SKILL.md
- deep.md:59

## Assessment
- **newInfoRatio:** 0.55
- **Novelty justification:** Separates routing-surface adopters (orchestrate, commands, CLI seam) from execution-surface non-adopters, preventing pattern over-application.
- **Confidence:** 0.84
- **Key questions considered:** KQ7
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Routing-vs-execution split bounds where the pattern belongs.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ7 adversarial: where would the literal-safe pattern OVER-constrain and harm Claude-flex.
