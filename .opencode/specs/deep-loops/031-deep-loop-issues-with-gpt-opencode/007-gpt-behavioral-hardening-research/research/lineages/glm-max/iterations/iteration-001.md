# Iteration 1: Evidence Inventory & Charter Anchoring

**Focus track:** foundation | **Status:** complete

## Focus
Establish the complete evidence inventory for KQ1-KQ9: read the predecessor research, phase 005/006 docs, and the deep.md/orchestrate.md/ai-council.md files to lock citation handles before any analysis.

## Findings
- **Root cause reconfirmed: subagent_type is normalized to "general" for every custom-agent dispatch; specialized identity is only prompt-injected, never runtime-enforced.** [SOURCE: ../001-deep-agent-router-and-orchestration/research/research.md §1; orchestrate.md:162]
- **deep.md is mode:primary with a deterministic 4-row route table resolved through mode-registry.json and an 8-step workflow whose only judgment call is a single clarification question.** [SOURCE: deep.md:34-46,63-79]
- **orchestrate.md exposes a free-text Deep Route field that the orchestrator must self-derive (mode=/execution=) from a Priority table that lists @deep-research at priority 2 but does NOT list deep-context/deep-review as separate rows.** [SOURCE: orchestrate.md:95-105,207]
- **ai-council is mode:all (directly invocable), not subagent-only.** [SOURCE: ai-council.md:4]
- **Phase 005 was inconclusive: 0/4 command-owned smokes reached a real leaf dispatch; all blocked by OPENCODE_PID self-invocation guards; the one decisive path (external non-OpenCode shell) was never taken.** [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:6,120-124]
- **Phase 006/FIX-5 is Parked on that inconclusive evidence, gated on phase-004-smoke producing schema-valid route-mismatched artifacts.** [SOURCE: 006-host-hard-identity-fix5/decision-record.md:20-22]

## Sources Consulted
- ../001-deep-agent-router-and-orchestration/research/research.md
- deep.md
- orchestrate.md
- ai-council.md
- 005-gpt-verification-smoke/verification-smoke.md
- 006-host-hard-identity-fix5/decision-record.md
- mode-registry.json
- goal-prompt.md

## Assessment
- **newInfoRatio:** 1.00
- **Novelty justification:** First pass of this lineage; every citation handle is newly established here.
- **Confidence:** 0.95
- **Key questions considered:** KQ1, KQ2, KQ3, KQ4, KQ5, KQ6, KQ7, KQ8, KQ9
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Reading primary agent/command files directly yields exact line citations for the charter claims.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ1 start: precisely characterize the cli-opencode self-invocation guard so the decisive external smoke can be specified.
