---
title: "Deep Research Strategy — Deep-Review Learnings for Deep-Research Uplift"
description: "10-iter cli-devin SWE-1.6 (1-8) + cli-codex gpt-5.5 high fast (9-10) on whether 118 deep-review upgrades propagate to deep-research."
---

# Deep Research Strategy

## Research Question

**Which of the recent upgrades shipped for deep-review (arc 118 — FULL_ISOLATE_NO_MCP runtime relocation, sk-doc canonical companions, 10-iter cli-devin deep-review, 27-finding fix-pack) should be applied as learnings or insights to improve the deep-research skill, and at what priority?**

## Sub-Questions

1. **Runtime dependency parity**: deep-research now consumes deep-loop-runtime (v1.12.0.0 changelog). Does it use the SAME surface as deep-review, or are there gaps?
2. **Workflow YAML cutover**: deep-research_auto + _confirm.yaml were updated in phase 118/005. Are the script invocations symmetric with deep-review, or are there asymmetries that should be reconciled?
3. **sk-doc canonical companions**: does deep-research have a feature_catalog + manual_testing_playbook + references at the same depth as deep-review? If not, which gaps are real vs intentional differences?
4. **27 fix-pack findings**: are any of the deep-review fixes ALSO needed in deep-research? (e.g. completion_pct=5 metadata staleness pattern; state_format.md field name drift)
5. **Adversarial coverage**: deep-research has been less recently audited than deep-review. Are there deep-research-specific findings (research convergence, claim adjudication, evidence quality) that the 118 deep-review audit didn't surface?
6. **Mixed-executor pattern**: the user requested cli-devin SWE-1.6 iters 1-8 + cli-codex gpt-5.5 iters 9-10. Document whether this hybrid pattern is canonical or experimental — and capture learnings.

## Dimensions

<!-- ANCHOR:research-dimensions -->
- **Runtime parity**: surface-level + behavioral
- **Documentation parity**: SKILL.md + README + changelog + feature_catalog + playbook + references + graph-metadata
- **Workflow YAML parity**: deep-review vs deep-research workflow shape
- **Test coverage parity**: lib + integration + lifecycle
- **Fix-pack applicability**: each 118 finding mapped to deep-research
<!-- /ANCHOR:research-dimensions -->

## Convergence Rule

- Max iterations: 10
- Convergence threshold: 0.10 (newFindingsRatio rolling average)
- Stop early ONLY if explicitly converged for 3 consecutive iters with strong signal

## Executor Profile (mixed)

- **Iters 1-8**: cli-devin v1.0.6.3 with `--model swe-1.6 --permission-mode dangerous` (user-specified)
  - RCAF prompt structure per cli-devin SWE-1.6 contract
  - Medium-density pre-planning
- **Iters 9-10**: cli-codex with `--model gpt-5.5 -c model_reasoning_effort=high -c service_tier=fast --sandbox workspace-write --approval-policy never` (user-specified final-iter polish)
  - GPT-5.5 high reasoning for synthesis-quality wrap

## Dispatch Pattern

Per-iter with explicit SIGKILL between (memory rule on Mac memory pressure)

## Per-Iter Output Contract

- `research/iterations/iteration-NNN.md` — narrative
- `research/deltas/iter-NNN.jsonl` — structured per-finding records
- `research/prompts/iteration-NNN.md` — actual prompt
- `research/logs/iter-NNN-{devin|codex}.log` — raw output

## Initial Read List (consumed by iter-1+)

- `.opencode/skills/deep-review/SKILL.md` (v1.4.0.0)
- `.opencode/skills/deep-review/changelog/v1.4.0.0.md`
- `.opencode/skills/deep-research/SKILL.md` (v1.12.0.0)
- `.opencode/skills/deep-research/changelog/v1.12.0.0.md`
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md`
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/review/review-report.md`
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/009-verification-changelog-closeout/implementation-summary.md`
- `.opencode/skills/deep-loop-runtime/SKILL.md` (v1.0.0)
- `.opencode/commands/deep/assets/deep_start-research-loop_{auto,confirm}.yaml`
