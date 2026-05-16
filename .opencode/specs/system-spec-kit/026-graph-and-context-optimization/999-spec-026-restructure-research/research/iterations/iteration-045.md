# Iter 045 — Track 11: cost-benefit per proposed merge

## Methodology

I evaluated unique merge decisions surfaced by iters 009, 013, 017, 021, 024, 026, and 038. Where later iterations repeated or broadened an earlier proposal, I counted the concrete action once and called out redesigns where the proposed shape was wrong.

Cost is judged by docs/files moved, broken-reference risk, validation/re-index work, and reversibility. Benefit is judged by recall hops saved, conceptual clarity, and maintenance reduction.

## Per-merge cost-benefit

### Merge 1: 014/052-mk-spec-memory-rename + 014/053-mk-spec-memory-rename-remediation
- Source iter: 009
- Cost: Low implementation work; moderate reference risk around MCP namespace history; standard validate/re-index; reversible because 053 is a remediation appendage.
- Benefit: Small recall gain; clearer single rename story; minor maintenance reduction.
- Verdict: PROCEED_AS_LOW_PRIORITY
- Rationale: The merge is correct but not urgent. It saves one hop for rename/remediation lookup, but the recall surface is narrow.

### Merge 2: 014/056-root-readme-deep-research + 014/057-root-readme-deeper-rewrite
- Source iter: 009
- Cost: Low to moderate; mostly preserving research artifacts under the rewrite packet; reversible if archived cleanly.
- Benefit: Good recall gain for root README evolution; clearer research-to-rewrite chain; one fewer packet.
- Verdict: PROCEED
- Rationale: 057 explicitly consumes 056. Keeping them separate mostly preserves process noise rather than load-bearing context.

### Merge 3: 014/041-cocoindex-ipc-observability + 014/042-cocoindex-refresh-split
- Source iter: 009
- Cost: Moderate; observability and contract-change evidence could blur; reference risk is real.
- Benefit: Some recall gain for CocoIndex timeout work, but weak conceptual clarity.
- Verdict: ABORT
- Rationale: Iter 009 itself identifies them as load-bearing siblings: 041 adds observability, 042 changes behavior. The merge cost exceeds recall benefit.

### Merge 4: 014 deep-review remediation loop into 022-local-llm-legacy-remediation
- Source iter: 009
- Cost: High; many review artifacts, duplicate numbering, verification history, and final-status evidence to preserve.
- Benefit: Good maintenance reduction, but recall would still need review/remediation structure.
- Verdict: REDESIGN
- Rationale: Do not merge everything into 022. Better shape: archive or index the review campaign artifacts while preserving final verification evidence.

### Merge 5: 014/056 + 057 + 058 + 059 into 059-cli-devin-deep-loop-alignment
- Source iter: 009
- Cost: High; mixes README research, SKILL.md alignment, and cli-devin loop methodology.
- Benefit: Medium recall benefit; narrative is real but not single-purpose enough.
- Verdict: REDESIGN
- Rationale: Keep 056→057 together, but do not absorb 058/059 into the same packet. The broader group is a theme, not one merge.

### Merge 6: 014 documentation consolidation, 050 + 054 + 055 + 058
- Source iter: 009
- Cost: Moderate; parent doc rewrites and scope boundaries between breadth sweep and deep core-skill work.
- Benefit: Medium recall and maintenance benefit.
- Verdict: REDESIGN
- Rationale: 050 and 058 are called out as load-bearing siblings. Archive one-time doc packets, but do not collapse distinct breadth/depth work into 050.

### Merge 7: 013/001-doctor-commands + 013/002-sandbox-testing-playbook
- Source iter: 013
- Cost: Low; implementation plus validation pair; superseded by 004/005; reversible as a historical packet.
- Benefit: Clear recall win; better “original doctor runtime foundation” story.
- Verdict: PROCEED
- Rationale: This is a clean implementation + test-harness historical merge. It reduces status drift and does not disturb the router cutover arc.

### Merge 8: 007/002-code-graph-self-contained-package into 007/014-system-code-graph-extraction
- Source iter: 017
- Cost: Low; explicit supersession; limited migration.
- Benefit: Strong clarity benefit; 014 is the real extraction packet.
- Verdict: PROCEED
- Rationale: 002 is historical context for 014. Keeping it standalone adds recall noise.

### Merge 9: 007 extraction children 016-020 into 014-system-code-graph-extraction
- Source iter: 017
- Cost: Moderate; five child summaries need preservation; validate/re-index required.
- Benefit: High recall and maintenance benefit; one coherent extraction arc.
- Verdict: PROCEED
- Rationale: These are sequential implementation phases of one extraction. The cost is mostly mechanical.

### Merge 10: 007 post-extraction cleanup 022-030 to archive
- Source iter: 017
- Cost: Moderate; nine folders, references, and index updates.
- Benefit: High maintenance reduction; large recall-noise reduction.
- Verdict: PROCEED
- Rationale: These are completed cleanup/audit packets. Archive preserves history while removing active-phase clutter.

### Merge 11: 007 deep-review campaign artifacts 031-034 to archive
- Source iter: 017
- Cost: Moderate; quality-gate evidence must remain discoverable.
- Benefit: High recall benefit for active work; fewer review/remediation hops.
- Verdict: PROCEED
- Rationale: Archive locally with final remediation evidence retained. A new cross-parent parent is heavier than needed.

### Merge 12: 007 comprehensive deep-review artifacts 037-039 to archive
- Source iter: 017
- Cost: Low to moderate; preserve 038 evidence.
- Benefit: Good recall and maintenance reduction.
- Verdict: PROCEED
- Rationale: Same pattern as Merge 11, with smaller scope.

### Merge 13: 007/035-code-folder-readmes to archive
- Source iter: 017
- Cost: Low.
- Benefit: Small; one packet removed.
- Verdict: PROCEED_AS_LOW_PRIORITY
- Rationale: Correct but not worth prioritizing ahead of larger cleanup groups.

### Merge 14: 009/007-copilot-writer-wiring into 009/006-copilot-wrapper-schema-fix
- Source iter: 021
- Cost: Low.
- Benefit: Medium, but superseded by the broader Copilot merge.
- Verdict: REDESIGN
- Rationale: The conservative merge is fine in isolation, but the better shape is Merge 15.

### Merge 15: 009/006 + 009/007 into 009/002-copilot-hook-parity-remediation
- Source iter: 021
- Cost: Moderate; Level 1 details move into Level 3 packet.
- Benefit: Strong conceptual clarity; one Copilot parity arc.
- Verdict: PROCEED
- Rationale: 002 is the foundational Copilot packet and 006/007 are enablers. The merged packet has a clearer purpose.

### Merge 16: Cross-parent deep-review quality gates into new 030-deep-review-quality-gates
- Source iter: 024, 026
- Cost: Very high; cross-parent moves, broken references, and spec-anchor disturbance.
- Benefit: Medium; saves thematic search hops but creates an artificial parent.
- Verdict: REDESIGN
- Rationale: The theme is real, but a new parent is too expensive. Prefer local archives plus a lightweight index/decision record.

### Merge 17: Cross-parent documentation alignment, retain 009/008 and archive one-time 014/007 docs
- Source iter: 024, 026
- Cost: Moderate; multiple parents and doc reference updates.
- Benefit: High; removes completed doc-cleanup noise while retaining hook-parity docs.
- Verdict: PROCEED
- Rationale: This captures most recall benefit without collapsing load-bearing documentation packets.

### Merge 18: Cross-parent MCP server/config merge, 014/051-053 with 007/021/024
- Source iter: 024
- Cost: High; architectural topology and operational rename work would blur.
- Benefit: Low to medium.
- Verdict: ABORT
- Rationale: The source already recommends keeping these separate. The conceptual merge is too broad.

### Merge 19: Cross-parent skill realignment, 014/050 + 014/058 + 007/025
- Source iter: 024
- Cost: Moderate; risk of losing 050 breadth versus 058 depth distinction.
- Benefit: Medium.
- Verdict: REDESIGN
- Rationale: Archive completed one-time alignment where appropriate, but keep 050 and 058 distinct.

### Merge 20: Template system followups rehomed from 010 to 008/013
- Source iter: 026
- Cost: Moderate; no packet reduction, but reference migration required.
- Benefit: Real but mostly placement correctness.
- Verdict: PROCEED_AS_LOW_PRIORITY
- Rationale: This improves conceptual placement, but recall benefit is smaller than the archive/consolidation work.

### Merge 21: Empty scaffold cleanup under 010-template-levels
- Source iter: 026
- Cost: Low if content verification confirms emptiness.
- Benefit: Small to medium; removes false positives.
- Verdict: PROCEED_AS_LOW_PRIORITY
- Rationale: Do it after verifying 004-deferred-followups. Until then, it is cleanup, not core restructure.

### Merge 22: Phase 2, 004-runtime-executor-hardening into 003-continuity-memory-runtime with child phases preserved
- Source iter: 038
- Cost: High; 004 has nested child structure and distinct runtime narrative.
- Benefit: High; tighter runtime/memory phase and fewer top-level concepts.
- Verdict: PROCEED
- Rationale: Proceed only with mitigation: preserve child folders and add a decision record. That keeps reversibility acceptable.

### Merge 23: Phase 5, 008-skill-advisor internal phase restructure
- Source iter: 038
- Cost: High; 26 children need deeper sequencing analysis.
- Benefit: Potentially high, but unproven.
- Verdict: REDESIGN
- Rationale: Do not restructure now. Add a decision record deferring internal phases until a dedicated pass.

### Merge 24: Phase 11, 015-extracted-skills-isolation
- Source iter: 038
- Cost: Infinite for this pass; packet does not exist.
- Benefit: None until verified.
- Verdict: ABORT
- Rationale: Phantom phases cannot enter the target state.

### Merge 25: Phase 13, 000-release-cleanup outside the linear sequence
- Source iter: 038
- Cost: Low; mostly target-state documentation and sequencing.
- Benefit: High; avoids false dependency ordering.
- Verdict: PROCEED
- Rationale: Treating 000 as a meta-phase is cheaper and more accurate than forcing it into Phase 13.

## Aggregate stats

- Total merges proposed across all tracks: 25
- PROCEED: 11
- PROCEED_AS_LOW_PRIORITY: 4
- ABORT: 3
- REDESIGN: 7

## Cheapest-variant restructure

If the restructure executes only PROCEED merges, skipping LOW_PRIORITY work, the resulting linear phase list is:

1. Research and Baseline
2. Runtime and Memory Optimization, with 004 merged into 003 and child phases preserved
3. External Project Adoption
4. Code Graph Capability, with 002 and 016-020 consolidated into 014 and completed cleanup/review groups archived
5. Skill Advisor Capability, unchanged internally
6. Hook Parity Remediation, with 006/007 absorbed into 002
7. CocoIndex Daemon Resilience
8. Causal Graph Channel Routing
9. Doctor Update Orchestrator, with 001/002 merged as historical runtime foundation
10. Local Embeddings Setup, with only the high-confidence README research/rewrite merge applied
11. TanStack Security Audit

Meta-phase outside sequence:
- 000-release-cleanup

Skipped from the linear plan:
- 015-extracted-skills-isolation, because it does not exist

- Net reduction: 13 → 11 top-level phases; plus substantial internal packet reduction from code-graph, documentation, hook-parity, and doctor consolidation.
- Effort saved vs full plan: ~40%
- Recall benefit captured vs full plan: ~75%

## JSONL delta row

{"iter_id": "045", "timestamp_utc": "2026-05-16T03:52:01Z", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "merges_evaluated": 25, "proceed_count": 11, "abort_count": 3, "primary_evidence_files": ["iter-009/013/017/021/024/026/038"]}