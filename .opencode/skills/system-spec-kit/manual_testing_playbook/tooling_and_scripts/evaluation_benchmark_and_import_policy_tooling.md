---
title: "245 -- Evaluation, benchmark, and import-policy tooling"
description: "This scenario validates evaluation, benchmark, and import-policy tooling for `245`. It focuses on confirming ablation, BM25 baseline, performance benchmarks, and policy regression coverage."
version: 3.6.0.14
---

# 245 -- Evaluation, benchmark, and import-policy tooling

## 1. OVERVIEW

This scenario validates evaluation, benchmark, and import-policy tooling for `245`. It focuses on confirming ablation, BM25 baseline, performance benchmarks, and policy regression coverage.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm ground-truth provenance, ablation, BM25 baseline, performance benchmark, and import-policy tooling coverage.
- Real user request: `Please validate Evaluation, benchmark, and import-policy tooling against npx tsx .opencode/skills/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run and tell me whether the expected signals are present: mapping preview logs DB provenance; ablation run succeeds and writes JSON; BM25 baseline run completes; performance benchmark writes scratch artifacts; policy suites pass.`
- Prompt: `Validate Evaluation, benchmark, and import-policy tooling against npx tsx .opencode/skills/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: mapping preview logs DB provenance; ablation run succeeds and writes JSON; BM25 baseline run completes; performance benchmark writes scratch artifacts; policy suites pass
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the runners and policy checks behave consistently with the current CLI and import-boundary contract, with invalid benchmarks clearly identified

---

## 3. TEST EXECUTION

### Prompt

```
Validate Evaluation, benchmark, and import-policy tooling against npx tsx .opencode/skills/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run and report cited pass/fail evidence.
```

### Commands

1. `npx tsx .opencode/skills/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run`
2. `SPECKIT_ABLATION=true npx tsx .opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts`
3. `npx tsx .opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts --verbose`
4. `npx tsx --tsconfig .opencode/skills/system-spec-kit/scripts/tsconfig.json .opencode/skills/system-spec-kit/scripts/evals/run-performance-benchmarks.ts system-spec-kit/022-hybrid-rag-fusion`
5. `cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/architecture-boundary-enforcement.vitest.ts tests/import-policy-rules.vitest.ts`

### Expected

Mapping preview logs DB provenance; ablation and BM25 runners complete with report output; performance benchmark writes `performance-benchmark-metrics.json` and `performance-benchmark-report.md` into the target scratch directory; policy suites pass

### Evidence

BLOCKED before command execution due to the scenario requiring writes outside the single approved write path.

Observed from this scenario file:

```text
38: 1. `npx tsx .opencode/skills/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run`
39: 2. `SPECKIT_ABLATION=true npx tsx .opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts`
40: 3. `npx tsx .opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts --verbose`
41: 4. `npx tsx --tsconfig .opencode/skills/system-spec-kit/scripts/tsconfig.json .opencode/skills/system-spec-kit/scripts/evals/run-performance-benchmarks.ts system-spec-kit/022-hybrid-rag-fusion`
42: 5. `cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/architecture-boundary-enforcement.vitest.ts tests/import-policy-rules.vitest.ts`
46: Mapping preview logs DB provenance; ablation and BM25 runners complete with report output; performance benchmark writes `performance-benchmark-metrics.json` and `performance-benchmark-report.md` into the target scratch directory; policy suites pass
```

Current execution constraints from the user instruction:

```text
Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
ALLOWED WRITE PATHS
.opencode/skills/system-spec-kit/manual_testing_playbook/tooling_and_scripts/evaluation_benchmark_and_import_policy_tooling.md (this file only)
```

Commands 2 and 4 are expected to write JSON/artifact outputs outside the allowed scenario file, so running the command sequence exactly would violate the approved write-path constraint. No TEST EXECUTION commands were run.

### Pass / Fail

- **BLOCKED**: The documented command sequence requires generated JSON/benchmark artifact writes outside the only approved write path, so the scenario cannot be executed under the current constraints.

### Failure Triage

Inspect `scripts/evals/map-ground-truth-ids.ts`, `run-ablation.ts`, `run-bm25-baseline.ts`, `run-performance-benchmarks.ts`, `check-architecture-boundaries.ts`, and `import-policy-rules.ts` if provenance, runner behavior, or policy checks fail

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/evaluation_benchmark_and_import_policy_tooling.md](../../feature_catalog/tooling_and_scripts/evaluation_benchmark_and_import_policy_tooling.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 245
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/evaluation_benchmark_and_import_policy_tooling.md`
