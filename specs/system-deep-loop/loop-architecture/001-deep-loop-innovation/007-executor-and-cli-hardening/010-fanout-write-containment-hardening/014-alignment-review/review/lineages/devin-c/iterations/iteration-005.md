# Iteration 5: Maintainability — architecture contradictions, dead paths, stabilization replay

## Focus

Dimension: maintainability. Surface: general architecture (packet scope item 6) — dead paths, duplicated rules, counting drifts; stabilization replay of F001-F005. Files: `.opencode/commands/deep/assets/compiled/README.md`, `compiled/*.contract.md`, `legacy/README.md`, `legacy/*.body.md`, packet `spec.md`/`goal.md`/`review/deep-review-config.json`.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.10

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F006**: Compiled-contracts README counts four contracts where three exist, `.opencode/commands/deep/assets/compiled/README.md:19`. The OVERVIEW says the directory "stores the four flattened command contracts", but the directory holds exactly three contract files (`deep-ai-council.contract.md`, `deep-research.contract.md`, `deep-review.contract.md`) plus `manifest.jsonl`, and the README's own next paragraph says the inventory "is intentionally limited to the three commands registered with the contract compiler" (line 25). Either the manifest is being counted as a "contract" or the count drifted; the sentence should say three.

## Stabilization Replay (F001-F005)

| Finding | Severity | Replay result | Evidence re-read |
|---------|----------|---------------|------------------|
| F001 | P2 | stands | deep-review-auto.yaml:1-5 duplicate banner confirmed in this session's read |
| F002 | P2 | stands | auto:2150 `step_resource_map_coverage_gate` vs confirm:1564-1572 emit-only |
| F003 | P1 | stands | loop-protocol.md:280 stale claim; guard wired at deep-review-auto.yaml:1443-1795, confirm:1145-1191, fanout-run.cjs:3376-3494; deep-research loop-protocol:287-290 documents it |
| F004 | P2 | stands | deep-research loop-protocol:275 vs :287-290 self-contradiction re-read verbatim |
| F005 | P2 | stands | mode-registry.json 2 improvement lanes vs SKILL.md:80 "3" |

No P0/P1 finding was downgraded or overturned by the replay; the F003 adjudication packet's confidence (0.85) holds.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | compiled/README.md:19 vs directory inventory | Counting drift (F006); otherwise legacy/compiled pairing is consistent |
| checklist_evidence | pass | hard | packet docs | No unsupported completion claims |

## Assessment

- New findings ratio: 0.10
- Dimensions addressed: maintainability (final dimension — coverage complete: correctness, security, traceability, maintainability)
- Novelty justification: F006 is new; replay rows confirm the prior corpus.

## Ruled Out

- Orphaned legacy bodies or unmatched compiled contracts: ruled out — `legacy/README.md` and `compiled/README.md` both document a strict 3:3 pairing (ai-council/research/review) with agent-improvement and model-benchmark declared fallback-only and uncompiled; the directory listings agree.
- Fallback-chain drift (REQ-002/D2): ruled out — review-root `deep-review-config.json` fallback list (`cli-codex gpt-5.6-luna max fast`, `cli-pi deepseek-v4.1-flash max via llmgateway`) matches goal.md D2's LUNA-then-gateway order and the V4.1 stand-in note.
- Route-proof field drift (REQ-001): ruled out — this lane's five state records each carry `target_agent`, `resolved_route`, `agent_definition_loaded`, and `mode`, matching `.opencode/agents/deep-review.md:230` and the verify-iteration.cjs contract.

## Dead Ends

- Hunting for a fifth compiler-managed command: the compiled inventory is deliberately capped at three; improvement/benchmark are fallback-only by design, not a dead path.

## Recommended Next Focus

Synthesis: compile the lane report (maxIterationsReached stop reason; lane verdict CONDITIONAL due to active P1 F003; P2 advisories F001/F002/F004/F005/F006 for the merged registry).

Review verdict: PASS
