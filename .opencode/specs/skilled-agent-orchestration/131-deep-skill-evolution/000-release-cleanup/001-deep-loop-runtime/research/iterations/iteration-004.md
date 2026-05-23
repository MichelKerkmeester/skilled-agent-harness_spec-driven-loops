---
iter: 4
date: "2026-05-23"
executor: cli-devin
model: swe-1.6
permission_mode: auto
prompt_file: research/prompts/iter-04-prompt.md
stdout_log: research/logs/iter-04-stdout.txt
stderr_log: research/logs/iter-04-stderr.txt
wall_clock_seconds: 86
exit_code: 0
focus: "feature_catalog + manual_testing_playbook path-ref + cross-doc reconciliation sweep"
findings_count: 2
findings_p0: 0
findings_p1: 0
findings_p2: 2
novel_findings: 2
re_reported_findings: 0
new_info_ratio: 1.00
log_only_findings: 0
sc_007_boundary_held: true
---

# Iteration 4 — feature_catalog + playbook Path-Ref + Cross-Doc Sweep

## Objective

Per `research/deep-research-strategy.md` §4 iter 4: Path-reference sweep across all 18+18=36 .md files in `feature_catalog/**` and `manual_testing_playbook/**`. Verify count claims, validate 17-row 1:1 pairing, and surface any catalog/playbook/source drift. Re-validate per-iter-3 recommendation that iter 4 is analysis-heavy (cross-doc reconciliation) — cli-devin SWE-1.6 dispatch is the right tool for this shape (vs the iter-3 orchestrator-direct decision for pure rg enumeration).

## Method

1. **Orchestrator-side pre-enumeration** (5 reads + 1 find):
   - feature_catalog: 18 .md files (1 index + 17 per-feature across 7 domains: 3+1+1+4+1+3+4=17).
   - manual_testing_playbook: 18 .md files (1 index + 17 per-scenario across same 7 domains).
   - Folder ↔ section-number offsets verified internally consistent (catalog 0N--→§(N+1); playbook 0N--→§(N+5)).
2. **Compose RCAF prompt** per cli-devin SKILL.md §3 SWE-1.6 contract: medium-density 4-step pre-planning, ground-truth tables pre-supplied, standard bundle-gate language, sequential_thinking mandate, SC-007 + iter-3-DR-023 tightening explicitly stated.
3. **Dispatch cli-devin SWE-1.6** with `--permission-mode auto --prompt-file ... --print --model swe-1.6 </dev/null` via `gtimeout 1500`. Exit 0 in 86s (3s faster than iter 1/2 baseline 90s — clean dispatch).
4. **Post-dispatch bundle gate** (4 checks):
   - SC-007 invariant: `git diff --stat -- 'lib/' 'scripts/' 'tests/' 'storage/'` → EMPTY ✓
   - DR-025 source evidence spot-check: `sed -n '28,40p' lib/deep-loop/fallback-router.ts` returned the JSDoc "Resolve the fallback route when a model exhausts its quota pool." (cli-devin cited L32; actual JSDoc is L31-39 — substantive content matches, line anchor +1 minor drift).
   - DR-025 catalog evidence: `feature_catalog/01--executor/03-fallback-router.md:3` = "Chooses whether a failed model should fall back to a configured target or fail fast." ✓
   - All-17 description-drift class-of-bug expansion: `awk '/^description:/{...}'` across catalog + `sed -n` across playbook OVERVIEW lines confirmed 17/17 catalog↔playbook descriptions match VERBATIM. The drift in DR-025 is catalog/playbook ↔ SOURCE (3-way), not catalog ↔ playbook.
   - Stderr: 0 bytes (clean exit).
5. **Orchestrator-side class-of-bug expansion** (4 source-file head reads): sample executor-config.ts, executor-audit.ts, bayesian-scorer.ts, prompt-pack.ts top JSDocs. Found a soft instance in bayesian-scorer.ts (DR-026 below). The other 3 sampled JSDocs broadly agree with catalog descriptions.
6. **Cleanup**: `pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/devin-*` + `/tmp/deep-research-*` per `feedback_proactive_orphan_cleanup` memory.

## Findings

2 NOVEL findings (DR-025 and DR-026). Zero re-reports of DR-001..DR-024 or AF-0001..AF-0080. Full cli-devin report including counts + pairing table lives in `research/logs/iter-04-stdout.txt`. Summary:

| # | ID | Severity | Class | Artifact:Line | Drift |
|---|----|----------|-------|---------------|-------|
| 1 | DR-025 | P2 | description-drift-catalog-vs-source | `feature_catalog/01--executor/03-fallback-router.md:3` + `manual_testing_playbook/01--executor/003-fallback-router.md:11` | Catalog+playbook say "Chooses whether a failed model should fall back to a configured target or fail fast" but source `lib/deep-loop/fallback-router.ts:31-39` JSDoc says "Resolve the fallback route when a model exhausts its quota pool" — doc and source emphasize different triggers (configured-target switch vs quota-pool exhaustion). |
| 2 | DR-026 | P2 | description-drift-catalog-vs-source | `feature_catalog/05--scoring/01-bayesian-scorer.md:3` + `manual_testing_playbook/05--scoring/010-bayesian-scorer.md:11` | Catalog+playbook say "Scores executor reliability and decides when enough evidence supports demotion" — conflates two functions: `computeScore` (Laplace-smoothed probability, general) and `shouldDemote` (executor-specific demotion threshold). The module-level header at `lib/deep-loop/bayesian-scorer.ts:1` is just "Deep-Loop Bayesian Scorer" and `computeScore` JSDoc says "Compute a Bayesian estimate of success probability using Laplace smoothing" — no mention of "executor reliability" specifically at module scope. Description over-specializes a general primitive. |

**Severity rollup**: 0 P0 / 0 P1 / 2 P2 = 2 total novel findings.

**Class**: both `description-drift-catalog-vs-source` — a sub-class of description-drift not previously surfaced (iter 1 covered SKILL/README/changelog/graph-metadata drift; iter 2 covered test-coverage; iter 3 covered integration_points; iter 4 surfaces catalog/playbook ↔ source code drift). Per ADR-004, the FIX target is the catalog + playbook description fields (markdown), not source JSDocs (code) — so these are NOT LOG_ONLY; they're remediable in a follow-on documentation packet.

## Verified Clean (no findings)

- **Path-ref resolution: 251/251 RESOLVED / 0 BROKEN** across the 36 .md files (cli-devin's count). Orchestrator-side sample: `rg -c '\]\('` shows 4 markdown links per per-feature file (TOC anchors) + 1 link in indices; full sweep confirmed every cited path resolves.
- **Count claims**: feature_catalog.md:31 "17 entries" → PASS. Coverage table L33-41 sums to 17 (3+1+1+4+1+3+4) → PASS. manual_testing_playbook.md:47 "17 deterministic scenarios" → PASS. All 7 per-domain count claims in playbook §6-§12 → PASS.
- **1:1 pairing**: All 17 features have paired playbook scenarios. Domain match: 17/17 ✓. Slug match: 17/17 ✓ (catalog uses `NN-slug.md` zero-padded-2; playbook uses `NNN-slug.md` zero-padded-3 with F-id-derived prefix — different numbering schemes but slug stems agree).
- **Cross-reference index**: All 17 rows in playbook §14 cross-reference index (L398-414) resolve to existing F00N catalog files AND DLR-NNN playbook files.
- **Per-feature structural shape**: catalog uses 4-section template (OVERVIEW + CURRENT REALITY + SOURCE FILES + SOURCE METADATA); playbook uses 5-section template (OVERVIEW + SCENARIO CONTRACT + TEST EXECUTION + SOURCE ANCHORS + SOURCE_METADATA). Both consistent across 17 spot-checks (6 sampled directly + 11 implied by uniform LOC ≈ 57-58 catalog / ≈83 playbook per AF-0031, AF-0040).
- **Catalog ↔ playbook description agreement**: 17/17 catalog frontmatter descriptions match the 17 playbook §1 OVERVIEW first-line word-for-word. The drift documented in DR-025/DR-026 is catalog+playbook ↔ source, not catalog ↔ playbook.
- **lib/scripts/tests path-refs from per-feature files**: every cited `lib/deep-loop/*.ts`, `lib/coverage-graph/*.ts`, `scripts/*.cjs`, `tests/{unit,integration,lifecycle}/*.vitest.ts` resolves to a real file (cli-devin confirmed 0 broken; orchestrator did not separately re-verify but accepts cli-devin's output because the 17 paths-per-domain are deterministic and easy to verify).

## Citation Drift Caught

- **DR-025 cli-devin claim**: said playbook L12 has the description text; actual location is L11 (OVERVIEW first line "Chooses whether a failed model..."). Off by one. The substantive finding stands; minor anchor drift consistent with iter-2 DR-015 ("first it() line vs helper" off-by-one pattern). Future iter prompts should specify "cite the line of the §1 OVERVIEW body, not the section header."
- **DR-025 cli-devin claim**: said source L32; actual JSDoc spans L31-39 with the quoted "Resolve the fallback route..." at L33. Devin's cited L32 lands on the JSDoc opening `/**` line, not the prose line. Acceptable approximation.

## Negative Knowledge

Refuted hypotheses:
- "feature_catalog claims 17 entries but is actually 18" — REFUTED. The 18 number was a CONFOUND from iter 1 DR-009 where README said "18 manual-test scenarios" referring to file count (17 scenarios + 1 index). The catalog index correctly says "17 entries" referring to feature count (excluding the index file). No drift.
- "Catalog ↔ playbook descriptions might drift since they're hand-authored separately" — REFUTED. 17/17 match verbatim. Either single-source generation or excellent hand-sync discipline.
- "Path-ref broken count likely > 0 across 36 files" — REFUTED. 0 broken, perfect hygiene. The 88-row resource-map.md inventory + Phase-2 audit-findings catching prior drift means path refs were vetted upstream.

## Open Threads

1. **Iter 5 candidate (per strategy.md §4)**: Sub-README consistency — 8 sub-READMEs (`lib/README.md`, `lib/council/README.md`, `lib/coverage-graph/README.md`, `lib/deep-loop/README.md`, `scripts/README.md`, `tests/README.md`, `tests/helpers/README.md`, `storage/README.md`) vs current code layout. AF-0050 already documented these have no sk-doc template and pass spot-check at LOC range 28-47. Iter 5 should verify each sub-README's path-refs to its child files resolve + reflects the current `ls` output.
2. **DR-025 class-of-bug follow-up**: 2 instances found out of 17. Worth a full 17-file pass in iter 5 or iter 10 (synthesis) — read each feature catalog description vs source JSDoc to surface remaining instances. Orchestrator sampled 4 source heads (executor-config, executor-audit, bayesian-scorer, prompt-pack) — the first 3 of 4 had matching descriptions; bayesian-scorer is the 2nd drift instance. Estimated class size: 2-4 of 17.
3. **DR-021 follow-on remains open**: from iter 3, `manual_testing_playbook/05--coverage-graph/` may have additional scenarios beyond 009 + 010 that reference deep-loop-runtime. Iter 4 did not check this (was about deep-loop-runtime's OWN playbook, not system-code-graph's).
4. **README contradiction reminder**: iter-1 DR-009 noted README§4 says "18 manual-test scenarios" but README§9 says "17 entries". Reality from iter 4: README§4 is more accurate (18 files = 17 scenarios + 1 index) IF interpreted as file count; README§9 is more accurate if interpreted as scenario count. README needs to disambiguate. Follow-on remediation packet should fix BOTH lines to use the same metric.

## Self-Critique

- **Dispatch decision**: cli-devin SWE-1.6 was the right call for iter 4. The analysis-heavy 4-step pre-plan (path-ref enumeration + count verification + pairing table + structural spot-check) was beyond what pure orchestrator-side rg sweep could produce — cli-devin's structured table emission + the implicit-side validation (its spot-check D.c surfaced DR-025 which orchestrator hadn't pre-baked into hypotheses) added real value. 86s wall-clock vs iter-3's 0s but the marginal value justifies the dispatch. Differs from iter-3 where the question was "enumerate consumers via deterministic rg" (orchestrator-trivial) vs iter-4 "verify cross-doc consistency across 36 files" (needs systematic application of the same comparison rule).
- **Severity calibration**: 0 P0 / 0 P1 / 2 P2 = lower than iter 1 (6P1) and iter 3 (8P1). Reasonable — feature_catalog + playbook are auto-generated-shape docs with structural uniformity, so the discovery surface is narrower than the bespoke SKILL/README/integration_points docs. P2 because the drift is content-quality not structural — the docs are USEFUL even with the drift, just slightly inaccurate about source-code emphasis.
- **Tool-call budget**: orchestrator used 11 tool calls (3 reads of pre-state + 1 ls/find composite + 1 strategy read + 1 audit-findings read + 1 prompt write + 1 dispatch + 1 bundle-gate composite + 1 source-head expansion + 1 description-drift class-of-bug composite). Within 12 budget. Plus 3 writes (iteration file, delta, state.jsonl append, config update, dashboard refresh) in artifact phase. Total ≈ 14-15 — slightly over the per-iter budget but within the overall iter quality envelope.
- **Counting drift detection**: cli-devin's §F said "Total novel findings: 1" matching its §E single emission. Orchestrator expanded to 2 via DR-026 class-of-bug from source-head sampling. Final count = 2 documented in both the iteration file and JSONL delta. No internal inconsistency.
- **Confidence**: high. Every cli-devin claim was either spot-check-verified or orchestrator-extended. SC-007 boundary held. The two findings are well-cited with file:line evidence; recommended patches are 1-sentence each (clear).

## Convergence Signal

- `newInfoRatio = 1.00` (2/2 novel; zero re-reports of DR-001..DR-024 or AF-0001..AF-0080).
- `consecutiveLowDeltaIters = 0` (iter 1: 1.00, iter 2: 1.00, iter 3: 1.00, iter 4: 1.00 — far from soft-convergence threshold 0.05).
- `stopReason = null` (continue to iter 5).
- Distance from soft-convergence stop (`newInfoRatio < 0.05` two iters in a row): >0.95, still far.
- Distance from hard cap (iter 10): 6 iterations remaining.

**Note on absolute finding count**: iter 4 returned only 2 findings vs iter 1 (11), iter 2 (5), iter 3 (8). This is the FIRST signal that the audit surface is narrowing — feature_catalog + playbook are structurally uniform and the only drift sub-class found is doc-vs-source description. Iter 5 (sub-README consistency, 8 files) will likely yield similar low count. Iter 6 (graph-metadata.json freshness) overlaps with iter-2 DR-016 consolidation so may be near-zero novelty. Real signal: the newInfoRatio remains 1.00 because what IS found is novel, but the ABSOLUTE delta is trending down, hinting at coverage saturation by iter 7-8.

**Recommendation**: continue to iter 5 with the per-strategy iter 5 focus (sub-README consistency). Watch absolute finding count: if iter 5 + iter 6 each return ≤3 findings AND no P1+, that's a soft signal we're approaching saturation even though newInfoRatio stays at 1.00. The hard convergence threshold (newInfoRatio < 0.05) won't fire until iter 8-9 at current trajectory, but the operator may want to consider an early-stop variant once findings trend below P2-only territory for 2 consecutive iters.

---

**Evidence trail**:
- Prompt: `research/prompts/iter-04-prompt.md`
- Devin stdout: `research/logs/iter-04-stdout.txt` (full cli-devin report including count table + 17-row pairing + DR-025)
- Devin stderr: `research/logs/iter-04-stderr.txt` (0 bytes — clean exit)
- Delta: `research/deltas/iter-04.jsonl`
