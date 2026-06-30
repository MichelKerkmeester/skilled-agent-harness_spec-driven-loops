# Deep Review Report - Codex Fan-Out Lineage

## Executive Summary

Verdict: **CONDITIONAL**

Active findings: P0=0, P1=1, P2=3. `hasAdvisories=true`.

The lineage covered correctness, security, traceability, maintainability, both required core protocols, and one stabilization pass. No P0 was found. The active P1 is F001, a guided-run CLI parsing defect that can accept malformed arguments instead of failing usage before planning/execution.

## Planning Trigger

Route to remediation planning for F001 before treating the `sk-design` review surface as release-ready. F002, F003, and F004 are advisory and can ride the same cleanup packet if scope permits.

## Active Finding Registry

| Finding | Severity | Dimension | Evidence | Status |
|---------|----------|-----------|----------|--------|
| F001 | P1 | correctness | `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:47-65` | active |
| F002 | P2 | correctness | `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:73-87` | active |
| F003 | P2 | traceability | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/build-report.cjs:80-87` | active |
| F004 | P2 | maintainability | `.opencode/agents/design.md:6-18` | active |

### F001 - Guided-run accepts malformed arguments

`parseGuidedRunArgs` selects the first non-flag token as URL and reads flag values without proving the next token is a value. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:47] This can turn `--output out` into `url=out` when the URL is missing, or `--output --fast` into `output=--fast`. The wrapper later creates the output directory and writes `write-prompt.md` when a run proceeds. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:136]

### F002 - Guided-run preflight misses exact skill-root output

`runPreflight` only rejects descendants with `startsWith(SKILL_ROOT + path.sep)`, so the exact skill root reports safe in preflight. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:79] Downstream `extract.ts` rejects the exact skill root, which keeps this advisory. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:266]

### F003 - Benchmark report omits computed advisory signals

`aggregate()` computes advisory signals for route telemetry, recipe miss rate, mode precision, and relative ranking. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1303] `renderReport()` only prints D4 task-outcome and asset recall, so report.md readers miss the rest. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/build-report.cjs:80]

### F004 - Runtime design agent permission drift

OpenCode grants `webfetch` and `external_directory` to the design agent. [SOURCE: .opencode/agents/design.md:13] Claude and Codex do not mirror those permissions. [SOURCE: .claude/agents/design.md:4] [SOURCE: .codex/agents/design.toml:5]

## Remediation Workstreams

1. Guided-run parser hardening: fix F001 by consuming positional URL and value-bearing flags explicitly; add tests for missing URL, missing `--output`, `--output --fast`, and unknown flags.
2. Guided-run preflight parity: fix F002 by mirroring `extract.ts` exact-root and descendant checks.
3. Benchmark report visibility: fix F003 by rendering route telemetry, recipe miss rate, mode precision, and relative ranking summaries in report.md.
4. Runtime parity decision: fix or document F004 by aligning agent permissions or recording why OpenCode intentionally has broader capability.

## Spec Seed

- Require guided-run to reject malformed argv before preflight succeeds.
- Require guided-run preflight and extractor output-path guards to share exact containment semantics.
- Require skill-benchmark human report to surface all aggregate advisory signals that are material to route/report review.
- Require runtime design-agent permission differences to be either aligned or explicitly documented.

## Plan Seed

- Add a parser helper to `guided-run.ts` that validates required value-bearing flags.
- Add unit tests in `guided-run.test.ts` for missing positional URL and missing/flag-looking `--output` values.
- Update `runPreflight()` to reject `outputPath === SKILL_ROOT`.
- Extend `build-report.cjs` advisory section and add a renderer test using aggregate output with mode precision, route telemetry, recipe miss rate, and relative ranking.
- Decide whether OpenCode's broader design agent permissions are intentional; then update the sibling runtime files or add a parity note.

## Traceability Status

| Protocol | Status | Gate | Result |
|----------|--------|------|--------|
| spec_code | partial | hard | Core routing and command-surface claims align; report parity is partial due F003. |
| checklist_evidence | pass | hard | Named deterministic checks and standing invariants have source/test evidence. |
| skill_agent | partial | advisory | Core workflow aligns; permission surface drifts. |
| agent_cross_runtime | partial | advisory | F004 captures the runtime permission delta. |

## Deferred Items

- F002, F003, and F004 are advisories unless a downstream release gate decides report parity or runtime permission parity must become required.
- Live extraction smoke was not run in this read-only lineage.
- Memory continuity save was not run because the fan-out instruction limited writes to this lineage directory.

## Audit Appendix

### Iteration Table

| Iteration | Dimension | New P0/P1/P2 | Ratio | Verdict |
|-----------|-----------|--------------|-------|---------|
| 1 | correctness | 0/1/1 | 0.86 | CONDITIONAL |
| 2 | security | 0/0/0 | 0.00 | PASS |
| 3 | traceability | 0/0/1 | 0.09 | PASS |
| 4 | maintainability | 0/0/1 | 0.08 | PASS |
| 5 | stabilization | 0/0/0 | 0.00 | PASS |

### Convergence Replay

- Dimension coverage: 4 / 4.
- Required core protocols: covered.
- Latest two ratios: 0.08 -> 0.00.
- Rolling stop average: 0.04.
- Graph convergence: STOP_ALLOWED.
- Stop reason: converged.

### Evidence And Scope Gates

- Evidence gate: pass. Every active finding has file:line evidence.
- Scope gate: pass. Findings stay within `skill:sk-design`, runtime design agents, and named benchmark side-scope.
- P0 resolution gate: pass. Active P0=0.
- Claim adjudication gate: pass. F001 has a typed adjudication packet.

### Verification Evidence

- `design-command-surface-check.mjs --json`: status pass, drift empty.
- `numeric_law_check.py --json`: ok true, 12 rows.
- `variant_parameter_check.py --json`: ok true, 5 rows.
- `find .opencode/skills/sk-design -name graph-metadata.json`: one parent hub identity.
