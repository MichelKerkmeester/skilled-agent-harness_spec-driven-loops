# Deep Review Strategy — 122/006 (9x MiniMax-M2.7-highspeed + 1x Opus-4.8)

## TARGET
All packet-122 work: the deep-improvement skill's Lane C (skill-benchmark) code, the `deep-agent-improvement` → `deep-improvement` rename, and the three-lane docs. Review-only — findings are reported, not fixed (operator decides).

## DIMENSIONS (one focus per iteration)
1. Lane C scorer correctness (router-replay, score-skill-benchmark, d5-connectivity)
2. Lane C orchestrator + harness (run-skill-benchmark, contamination-lint, advisor-probe, build-report, _args)
3. loop-host non-regression (additive skill-benchmark arm; Lane A/B byte-identical)
4. Rename completeness (no dangling deep-agent-improvement; advisor not split-brain; penalty not inert)
5. **sk-doc template alignment** (references/ + assets/skill-benchmark vs sk-doc skill templates) — operator-flagged PRIORITY
6. **Three-lane consistency** (agent, command, 3 mirrors, SKILL.md, README, feature_catalog) — operator-flagged PRIORITY
7. Security + tests (vitest coverage, contamination/path-escape/subprocess surface, fixture split)
8. Spec-folder doc integrity + completion claims (002-005 docs vs reality, no overclaim)
9. Docs-vs-code drift (scoring_contract, command invocation vs code)
10. **Opus 4.8**: adversarial verification of iters 1-9 findings + gap-fill + synthesis feed

## KNOWN CONTEXT
- Operator pre-identified two findings to confirm: (a) references/assets don't align with sk-doc reference/asset templates; (b) the agent + command are not properly three-lane (agent says "two co-equal lanes"; command calls D1-inter follow-on though it is built).
- Prior hardening: Phase 004 Opus code review (2 P0 + 2 P1 fixed); Phase 005 Opus close-out gate (SHIP, 0 P0/P1). This loop is an independent re-review.
- Lane C scope: D1-inter/D1-intra/D2/D3/D5 scored deterministically; D4 ablation + Mode B live trace are intentional follow-on (NOT defects).

## CONTRACTS
- READ-ONLY: no file under review is modified. Salvage pattern captures each agent's reply into its iteration .md.
- Each iteration: iterations/iteration-00N.md (ending "Review verdict: PASS|CONDITIONAL|FAIL") + state-parts + deltas JSONL.
- Severity: P0 correctness/security/contradiction; P1 degraded/incomplete; P2 style/docs.

## BOUNDARIES
Max 10 iterations. Per-iteration 8-11 tool calls. MiniMax dispatch uses TIDD-EC-shaped prompt (explicit Do/Don't) per the cli-opencode MiniMax contract.
