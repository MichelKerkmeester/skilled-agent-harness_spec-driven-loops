# Deep Research Strategy: Agent Loops Improved Perfection Audit

**Session:** fanout-glm-1782884040803-9tnd8n
**Lineage:** glm (fan-out)
**Executor:** cli-opencode model=zai-coding-plan/glm-5.2
**Spec Folder:** deep-loops/030-deep-loop-improved

## Research Charter

### Research Topic
Find upgrade, fix, and expansion recommendations to perfect the deep-loops/030-deep-loop-improved packet across all 8 phases (001-008) and its own review tooling: remove drift between claimed-complete status and actual evidence, fix bugs, harden safety/observability, optimize the loop system relentlessly.

### Non-Goals
- Implementing any fixes (research only; report findings and recommendations)
- Modifying files outside the glm lineage artifact directory
- Re-running deep-review or deep-research loops on the packet

### Stop Conditions
- newInfoRatio < 0.01 for 3 consecutive iterations (convergence)
- maxIterations (35) reached
- All known leads verified, deepened, and supplemented with new discoveries

## Known Context

The packet `030-deep-loop-improved` is a multi-phase implementation packet migrated from `skilled-agent-orchestration/123-agent-loops-improved` (and referenced internally as `156-agent-loops-improved`). It has 8 phases (001-008), each with sub-phases. Phases 001-007 claim Complete status; phase 008 is In Progress. The packet has two deep-review fan-out lineages (codex: 50 iterations, glm: 11 iterations) and one abandoned native review lineage.

## What Worked
- (populated during iterations)

## What Failed
- (populated during iterations)

## Exhausted Approaches
- (populated during iterations)

## Next Focus
- Iteration 1: Overall packet structure + Phase Documentation Map Draft-status drift
- Iteration 2: Comment-hygiene violations (F-010-B5-0x markers) in YAML workflows
- Iteration 3: Stale completion_pct:0 frontmatter across child phases
- Iteration 4: Deep-review lineage CONDITIONAL verdicts + stale finding registries
- Iteration 5: Fan-out convergence threading verification (fanout-run.cjs)
- Iteration 6: computeLineageTimeoutMs 4-hour hard cap analysis
- Iteration 7: Abandoned native review lineage + stale lock + old path
- Iteration 8: ADR phases missing decision-record.md/checklist.md
- Iteration 9: graph-metadata.json key_files omissions (P1-007)
- Iteration 10: Empty scaffolds + weak-evidence phases
- Iteration 11: Old path/number references (123-agent-loops-improved migration residue)
- Iteration 12: Codex review iteration numbering collision (salvage placeholder duplicates)
- Iteration 13: description.json truncation + parent graph-metadata null last_active_child
- Iteration 14: Deepening — convergence math adequacy for high-reasoning models
- Iteration 15+: Convergence toward synthesis

## Questions to Answer
1. Are all Phase Documentation Map statuses consistent with actual evidence?
2. Are comment-hygiene violations fully catalogued across all YAML workflow files?
3. How many child docs carry stale completion_pct:0?
4. Were deep-review finding registries updated after 007-fan-out-hardening fixes?
5. Does fanout-run.cjs correctly thread --convergence into lineage prompts?
6. Is the 4-hour hard cap adequate for 30+ iteration high-reasoning loops?
7. Is the abandoned native lineage lock stale enough to be dangerous?
8. Do all ADR phases have decision-record.md?
9. Does graph-metadata.json include real implementation surfaces in key_files?
10. Are there NEW issues beyond the known leads?
