# Iteration 12: Orchestrate Hardening v2: Delegate to deep.md (KQ4)

**Focus track:** orchestrate | **Status:** complete

## Focus
Determine whether orchestrate can delegate its deep-dispatch entirely to deep.md (single routing truth) and what the smallest edit is.

## Findings
- **Both are mode:primary (orchestrate.md:4, deep.md:4), so deep.md can be the canonical deep router and orchestrate can hand off. The handoff target is the /deep:* command or a direct @deep dispatch with a pre-resolved Deep Route header.** [SOURCE: orchestrate.md:4; deep.md:4,69-75]
- **Smallest edit: replace orchestrate.md:95-105 deep rows + the :207 judgment-filled Deep Route field with a single deterministic rule — "if the request matches a /deep:* mode or names deep-context/deep-review/deep-research/ai-council, dispatch @deep with the Deep Route header resolved from mode-registry.json and STOP; do not self-derive mode/execution."** [SOURCE: orchestrate.md:95-105,207; deep.md:34-46 (registry resolution); mode-registry.json]
- **This converts orchestrate deep-routing from judgment-grade to table-lookup-grade by reusing deep.md's registry resolution + bounded clarification gate (deep.md:66), matching deep.md determinism exactly.** [SOURCE: deep.md:66; orchestrate.md:207 contrast]
- **Claude-flex preservation: orchestrate keeps full decomposition authority for NON-deep work; only the deep-dispatch path is table-locked. This is additive to the :206 Agent-selection logic, not subtractive of Claude's planning.** [SOURCE: orchestrate.md:194-225 (task decomposition stays); deep.md:59 (Claude-flex preserved)]

## Sources Consulted
- orchestrate.md:4,95-105,206-207
- deep.md:4,34-46,59,66,69-75
- mode-registry.json

## Assessment
- **newInfoRatio:** 0.60
- **Novelty justification:** Specifies the exact single-rule edit that makes orchestrate deep-dispatch table-lookup-grade by delegating to deep.md, with a flex-preservation boundary.
- **Confidence:** 0.87
- **Key questions considered:** KQ4
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Reusing deep.md registry resolution avoids inventing a second table.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
Adversarial: can orchestrate fully delegate without losing its decomposition/evaluation authority?
