# Iteration 8: Adversarial Re-check of Mode D vs Latency Confound (KQ2)

**Focus track:** mechanism | **Status:** complete

## Focus
Adversarially test whether mode D (stuck-on-flows) is a distinct mechanism or just the latency symptom mislabeled, to avoid building a fix on a confounded diagnosis.

## Findings
- **The two symptoms have different operator descriptions: "stuck" implies a halt/wait state; "slow" implies completion with long duration. They are observably separable in the report.** [SOURCE: research-prompt.md:21; goal-prompt.md OBSERVED SYMPTOMS]
- **Latency root cause is role-resolution overhead (../001 §3.1, CONFIRMED mechanism, magnitude inferred without GPT-vs-Claude wall-clock logs) — that mechanism produces slowness, not halts.** [SOURCE: ../001-deep-agent-router-and-orchestration/research/research.md §3.1,§9]
- **Mode D produces a halt (GPT stops at a perceived gate), which is a different observable than long-duration completion. So mode D is NOT the latency confound.** [SOURCE: logical separation; AGENTS.md HALT conditions]
- **Residual uncertainty (honest): no GPT-vs-Claude wall-clock or halt-event telemetry exists in this workspace, so the magnitude split between mode D and latency is inferred, not measured. KQ6 benchmark is the measurement path.** [SOURCE: ../001/research.md §9 (GPT-vs-Claude wall-clock not measured)]

## Sources Consulted
- research-prompt.md:21
- goal-prompt.md OBSERVED SYMPTOMS
- ../001-deep-agent-router-and-orchestration/research/research.md §3.1,§9

## Assessment
- **newInfoRatio:** 0.40
- **Novelty justification:** Strengthens mode D by ruling out the latency confound via symptom-description separation; flags the unmeasured-magnitude gap for KQ6.
- **Confidence:** 0.78
- **Key questions considered:** KQ2
- **Questions closed this iteration:** KQ2

## Reflection
**What worked:**
- Adversarial separation by observable type (halt vs duration) defends the diagnosis.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ3: ai-council subagent-only — enumerate what breaks under conversion.
