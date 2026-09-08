---
title: "Iteration 8: The Measurement Belt — evals/ and the Six Measurement Directories"
trigger_phrases: []
---
# Iteration 8: The Measurement Belt — evals/ and the Six Measurement Directories

## Focus

Q5's second half (the evals/ check gate: what it gates, who runs it, what its allowlist machinery really sees), the wired status of the six measurement directories (observability, optimizer, kpi, metrics, resource-map, sweep), and the four-sweeps reconciliation. This closes the directory inventory: after this iteration every directory under runtime/cli/ carries a caller verdict.

## Actions Taken

1. Listed all seven directories (evals 12, observability 7, optimizer 7, kpi 2, metrics 3, resource-map 2, sweep 2); read the strict-pass workflow's execution lines.
2. Ran the caller search for each measurement artifact across .opencode + .github, excluding the artifact's own directory, tests included.
3. Resolved the .mjs-coverage question from iteration 5: read the boundary check's scan predicate (check-architecture-boundaries.ts:80) and the import-policy-allowlist.json readers (3 checks).
4. Grep-verified whether any /deep: command invokes the resource-map extractor, against the deep-research YAML's own resource_map contract (deep-research-auto.yaml:175,252-256).

## Findings

1. CORRECTION/UPGRADE of finding f-iter005-003 — the "ungoverned crossing" dissolves: `evals/check-architecture-boundaries.ts:80` scans `.ts`, `.js`, `.mjs` AND `.cjs` (the .mjs lane does NOT escape), the governed zones are exactly what ARCHITECTURE.md:100 enumerates (lib/, core/, handlers/ — not hooks/), and three checks read the allowlist (check-allowlist-expiry, check-no-mcp-lib-imports, check-no-mcp-lib-imports-ast — the "governed" adjective is enforced by an EXPIRY check, the mechanism I doubted). Therefore retrieval→hooks/lib is policy-consistent, my iteration-5 "two readings" collapses to a documentation-precision remark, and the allowlist+expiry machinery is MORE thorough than I credited. What survives of that finding: the 3-repo-roots duplication and the zone-list extrapolation trap. Severity: P2, recommendation amended from fix to document.

2. `kpi/quality-kpi.sh` (100L: "Defect-rate reporting for generated continuity support") — declared: the defect-rate lane. Observed: ZERO references anywhere (5 surfaces + workflows + tests + docs: NONE-FOUND; neither registry). One script, one README, no caller of any kind. Severity P1. Recommendation: remove the directory.

3. Three stranded research harnesses inside the GATE directory — `evals/run-phase2-closure-metrics.mjs`, `evals/collect-redaction-calibration-inputs.ts`, `evals/run-redaction-calibration.ts`: ZERO callers (not in package.json:24's check, not in check:ast, NONE-FOUND elsewhere); they are some earlier phase's closure-metrics and redaction-calibration apparatus, living beside the 6 LIVE checks a reviewer must mentally skip. Severity P1. Recommendation: remove (or relocate into the owning packet's evidence — the 035 track).

4. `observability/` (7 files, 1903L) — declared: "Smart-router telemetry recording and measurement (live wrapper plus static corpus harness)" (cli/README.md:76; the dir's own smart-router-* names). Observed: its committed OUTPUTS exist (smart-router-measurement-report.md, smart-router-measurement-results.jsonl — the measurement ran); its invocation surface is documentation-shaped ONLY: 2 sk-doc test FIXTURES (durable-directory-manifest.json, baseline-readme-verdicts.json), the trigger-index (the scripts' own trigger_phrases — they are Gate 1 discoverable), and NO hook, plugin, command, or workflow; the "live-session-wrapper" has no installer. The results were consumed by whom: caller-not-verified (likely the 035/001 evidence chain). Severity P2. Recommendation: document the one-shot-measurement covenant (or remove after the 035 archival).

5. `metrics/fable-metrics.cjs` — declared: "Deep-loop behavioral efficiency scoring from opencode event logs". Observed: WIRED via the doctor (commands/doctor/assets/doctor-fable-mode.yaml + doctor/scripts/fable-mode-check.cjs) — the doctor's "fable mode" — correcting the stranded-suspect prior; the residual question: "fable" is ONE MODEL's frozen baseline (fable-baseline.json) hard-coded into a shared package's doctor — the 005-overengineering question, not this one. Severity P2 (the model-coupling). Recommendation: document.

6. `resource-map/extract-from-evidence.cjs` (554L, "Deep review/research evidence to resource-map.md ledger") — declared: the evidence-to-resource-map bridge. Observed: 4 references, ALL documentation (2x deep-research playbook, 1x deep-review playbook, 1x feature-catalog); NO command, YAML, hook, or workflow invokes it — while the /deep:research command YAML independently specifies resource_map_output: "{artifact_dir}/resource-map.md" andDetect/seed semantics (deep-research-auto.yaml:175,252-256) — the workflow hand-rolls the deliverable the extractor automates. This lineage's own resource-map.md is the live demonstration: produced by hand per the workflow contract, while the tool waits. Severity P1. Recommendation: fix — the /deep:research and /deep:review synthesis steps should call extract-from-evidence.cjs (or it should be removed and the playbook language updated).

7. The four-sweeps quadrant (Q3/Q4 consolidation, first Exhibits) — FOUR sweep implementations, FOUR different directories, TWO wired: (a) sweep/strict-pass-freshness.ts — CI-wired (.github/workflows/strict-pass-freshness-report.yml:56, the strict-pass freshness gate; its workflow also runs repair-derived at :94); (b) ops/process-sweep.ts — plugin-wired (.opencode/plugins/session-cleanup.js); (c) retrieval/sweep-memory-residue.mjs — unwired (f-iter005-002); (d) spec/sweep-track-roots.mjs — unwired (f-iter002-003). None of the four shares code with another (each re-derives folder-walking/timeout/reporting). Severity P2 (the duplication is systemic, the individually-correct verdicts already filed). Recommendation: merge — one sweep module, four thin invokers, or at least one directory.

## Positive Controls (verified, not findings)

- optimizer/ (7 files, 1960L: replay-runner, replay-corpus, promote, rubric, search, optimizer-manifest, audit/) — invoked from THREE agent definitions (.opencode/agents/orchestrate.md, review.md, code.md): the offline-optimization loop is the orchestrator/review/code chain's documented procedure, the strongest AI-contract wiring in the audit.
- The gate's self-knowledge: the 6th leg of the check gate (check-source-dist-alignment.ts) + the AST/cycle/allowlist-expiry variants + import-policy-rules.ts — a coherent 6-check+shared-policy+allowlist+expiry MODULE, indistinguishable from a deliberate system; the failure is single and total: nobody automated runs it (f-iter007-003).
- The strict-pass workflow is exactly as honest as its name: node --import tsx (freshness) + JSON-parse guard + repair-derived (:53-94).

## Questions Answered

- Q5 (COMPLETE, second half): the evals/ check gate — 6 checks + import-policy-rules + allowlist, wired ONLY into package.json:24 check + check:ast, which NOBODY automated runs (f-iter007-003); the allowlist is enforced+expiry-checked; the .mjs lane IS scanned; 3 research harnesses strand inside the gate directory.
- Q1 (COMPLETE): every directory under runtime/cli/ now carries a caller verdict — 35 directories, no unconcluded zone left.

## Questions Remaining

- Q3 (the last parity leg: root check-scripts + package.json); Q4 (the rollup — drafted, lands in synthesis); Q6 (framing + ../lib + shared: the repo-root triple, the coverage-graph citations, the twin pattern).

## What Worked / What Failed

- Worked: reading the scan predicate (check-architecture-boundaries.ts:80) before theorizing about enforcement — one line dissolved iteration-5's counterexample.
- Worked: the zero-callers greps INCLUDING tests and docs — "zero" means zero, and kpi/ earned its removal honestly.
- Failed: none; no approach exhausted.

## Ruled Out

- "The .mjs lane escapes the import-policy checks" — the predicate scans four extensions (check-architecture-boundaries.ts:80).
- "metrics/ is stranded" — the doctor's fable mode invokes it.
- "resource-map/extract-from-evidence.cjs backs the /deep:research resource_map" — the command YAML specifies the artifact; no step names the tool.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/evals/check-architecture-boundaries.ts:80] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/evals (12 files, ls) + import-policy-allowlist.json readers: check-allowlist-expiry, check-no-mcp-lib-imports, check-no-mcp-lib-imports-ast] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:53-94] [SOURCE: .opencode/commands/doctor/assets/doctor-fable-mode.yaml + doctor/scripts/fable-mode-check.cjs] [SOURCE: .opencode/agents/orchestrate.md, review.md, code.md] [SOURCE: .opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md] [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:175,252-256] [SOURCE: .opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/observability (committed outputs: smart-router-measurement-report.md, results.jsonl)]

## Next Iteration

Iteration 9: the cross-package ledger — every no-caller claim re-verified against the full five-surface sweep; the duplication exhibits consolidated (repo-root ×3, template mechanisms ×3, scorers, phase-classifiers, the coverage-graph citations into cli/lib from the deep-loop, shared/ overlaps); the framing question assembled (package.json:4 vs what the 35 directories do); the registry's final bill.
