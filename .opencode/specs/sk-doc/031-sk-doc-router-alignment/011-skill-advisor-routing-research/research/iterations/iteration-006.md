# Iteration 6: Priority order for advisor routing improvements

## Focus

Rank the named end-to-end threshold parity suite against transport-budget reservation, output-contract reconciliation, metadata-hub vocabulary coverage, diagnostic taxonomy, and scorer calibration changes. The ranking optimizes first for confirmed correctness failures, then routing recall/resilience, then preventive coverage and operability.

## Actions Taken

1. Re-read the append-only state, reducer-owned strategy, and iterations 1-5 to recover the exact open claims and negative knowledge.
2. Cross-compared the candidate improvements against the hook, CLI fallback, threshold, runtime-parity, drift-guard, ambiguity, and compatibility sources.
3. Inspected the live timeout handoff and no-brief output path beside the current hook expectations.
4. Compared the committed calibration and scorer-evaluation baselines with the current corpus row counts and SHA-256 hashes, then confirmed those paths are clean in Git.

## Findings

### 1. Recommended implementation order

The evidence supports this order:

1. **P0 — Reconcile the no-brief output contract.** Decide whether skipped/fail-open cases return `{}` or the governance fallback directive, then align implementation, tests, and reference text. This is first because the current hook suite has four known failures and the chosen contract determines the assertions for every later handoff test. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research/research/iterations/iteration-003.md:36-42] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:228-245] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:143-178]
2. **P0 — Reserve fallback time and add live handoff timing coverage.** Give the primary subprocess less than the whole hook budget, reserve a bounded CLI slice, and test primary-timeout-to-warm-daemon success plus total-budget exhaustion. This repairs a confirmed resilience defect: the primary currently receives the entire hook timeout while the fallback receives only the remainder, potentially 1 ms. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:202-218] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:152-164] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research/research/iterations/iteration-003.md:22-26]
3. **P0 enablement — Repair calibration/evaluation freshness before changing scorer policy.** Reconcile the current corpus with both committed baselines and make one report join held-out top-1, ambiguity accuracy, confidence-floor frequency, Brier score, and ECE. This is measurement repair, not a scorer change. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/scorer-calibration-baseline.json:3-7] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:3-34] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:214-256]
4. **P1 — Add the metadata-hub advisor-discovery battery.** This closes the real pre-hub correctness boundary: hub-internal vocabulary checks can stay green while the advisor fails to discover a metadata-routed hub. Use representative public prompts and hard negatives, not a full alias mirror. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research/research/iterations/iteration-002.md:44-60]
5. **P1 — Add `advisor-threshold-surface-parity.vitest.ts`.** Keep the two-layer matrix from iteration 5: default/environment cases across MCP, shared brief, hook, and CLI; call-specific cases across MCP and the shared brief only. It is a strong preventive guard, but no numeric threshold drift was found, so it ranks behind current failures and the unguarded discovery boundary. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research/research/iterations/iteration-004.md:16-30] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research/research/iterations/iteration-005.md:16-24]
6. **P1/P2 — Split transport diagnostics and correct operator documentation.** Emit distinct causes for MCP-channel failure, warm-daemon absence, probe timeout, and CLI timeout, then document which are recoverable. This improves triage but does not restore routing by itself, so it follows the behavioral changes and guards. [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:224-245] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:523-548] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research/research/iterations/iteration-003.md:28-34]
7. **P2, gated — Change confidence floors, ambiguity margins, lane weights, or compatibility thresholds only after item 3.** Static evidence already shows policy quantization and correlated-evidence uncertainty, but parameter edits without a fresh joined report would be guesswork. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research/research/iterations/iteration-001.md:49-65]

### 2. Both committed calibration baselines are stale against the clean working-tree corpus

The current labeled corpus has 193 rows and SHA-256 `a270d01a...`. The calibration baseline records 200 rows and SHA `4b50b4ad...`; the scorer-eval baseline records 193 rows but SHA `b2c3a869...`. Git reports all three paths clean, so this is committed-state drift rather than an uncommitted operator edit. Both test implementations assert fixture hash equality, so their current baseline-freshness assertions would fail before providing trustworthy calibration guidance. [SOURCE: command `wc -l` and `shasum -a 256` over the routing-accuracy corpora] [SOURCE: command `git status --short` over the corpus and baseline paths] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/scorer-calibration-baseline.json:3-7] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:3-7] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/scorer-calibration.bench.ts:175-223] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:219-222]

This changes the Q5 ordering materially: calibration has high potential payoff, but calibration **changes** must wait; calibration **measurement repair** moves ahead of new routing-policy work.

### 3. The existing calibration evidence still points to a real problem, but cannot select a safe fix

The older 200-row calibration baseline reports ECE `0.138314`. Its populated `0.8-0.9` bucket averaged `0.845714` confidence at `0.705882` accuracy, consistent with the earlier finding that repeated `0.82` floors overstate probability-like meaning. The newer accuracy baseline reports holdout top-1 `60/78` and ambiguity top-1 `15/25`, but it does not join those outcomes to confidence-floor saturation or uncertainty bands. The direction is credible; the parameter choice is not yet evidence-backed. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/scorer-calibration-baseline.json:6-13] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/scorer-calibration-baseline.json:58-67] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:25-34]

### 4. The threshold suite should absorb or rename the misleading runtime-parity label

The existing file declares `['claude', 'opencode', 'opencode']` and tests the shared builder/renderer rather than public runtime surfaces. Either absorb its valid fixture assertions into the named surface suite or rename it to shared-brief runtime-tag coverage and remove the duplicate runtime claim. This cleanup belongs inside item 5; it is not a separate priority. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/runtime-parity.vitest.ts:1-28] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/runtime-parity.vitest.ts:32-105]

## Questions Answered

- Q5 is answered at implementation-order level. The named threshold suite ranks fifth: after output-contract reconciliation, transport-budget/handoff repair, calibration-measurement freshness, and metadata-hub discovery coverage; before diagnostic taxonomy and any scorer-policy calibration change.
- The suite should not encode hook call-specific override parity because that public input does not exist.

## Questions Remaining

- Q1 remains: after baseline freshness is repaired, quantify exact RRF normalization, `0.82` floor frequency, ambiguity-cluster composition, uncertainty bands, and held-out correctness in one joined report.
- The final numeric calibration proposal remains intentionally open until that report exists.

## Ruled-Out Directions

- Changing confidence floors, lane weights, ambiguity margins, or compatibility thresholds from the stale baselines is ruled out.
- Treating the threshold suite as the first fix is ruled out: it guards a synchronized contract while confirmed hook failures remain.
- Mirroring all hub aliases into graph metadata is ruled out; behavioral discovery fixtures test the actual boundary without duplicating vocabulary ownership.

## Assessment

- `newInfoRatio`: 0.68
- Novelty justification: The iteration produced a single evidence-ranked implementation order and discovered that both committed calibration baselines are stale against the clean current corpus, which changes calibration from an immediate modification candidate into a gated measurement task.
- Confidence: High for the first six ordering decisions and baseline mismatch; medium for the eventual calibration priority because Q1's joined empirical report is still missing.

## Next Focus

Q1: inspect the shared RRF helper and build a non-writing joined calibration report over the current full, holdout, and ambiguity corpora. First resolve which corpus revision is authoritative; then report confidence-floor saturation, ambiguity clusters, uncertainty, and correctness without changing scorer policy.

## SCOPE VIOLATIONS

None.
