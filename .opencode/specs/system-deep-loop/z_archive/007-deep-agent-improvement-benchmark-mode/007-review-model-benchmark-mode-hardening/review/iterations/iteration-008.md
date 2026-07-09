# Iteration 008

## Dimension

D4 Maintainability — second MiniMax pass. Focus: scorer decouple seam coupling, config-loading fragility, gitignored cache assumptions, and verbatim-port stale-assumption check. Cross-references iteration 007 findings DR-007-P2-001 and DR-007-P2-002.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:1-267` — full scorer entry point and port comment
- `.opencode/skills/deep-agent-improvement/scripts/scorer/lib/cache.cjs:30-36,162-186` — CACHE_ROOT path derivation and atomic write
- `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:114` — active benchmark scoring path
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118-133` — spawn spec construction
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:128-136` — smoke-run layer skip behavior
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:80-100` — path classification for the decoupled absolute-cwd path
- `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:58-77` — model-benchmark plan generation

## Findings by Severity

### P0

None.

### P1

None new in this iteration. Active P1s from prior iterations remain:

- **DR-005-P1-001** (`run-benchmark.cjs:114`): benchmark runner bypasses the decoupled 5-dim scorer. Confirmed unchanged; `scoreFixture()` is the active path, `score-model-variant.cjs` is never imported by the benchmark runner.
- **DR-005-P1-002** (`promote-candidate.cjs:168`): promotion rejects non-scored status before checking benchmark report. Confirmed unchanged.
- **DR-005-P1-003** (`cwd-check.cjs:142`): det-check CLIs still accept fixture JSON rather than explicit `--cwd`. Confirmed unchanged.

### P2

None new. DR-007-P2-001 and DR-007-P2-002 from iteration 007 are re-confirmed as subsumed P2 advisories, not independent blocking findings:

- **DR-007-P2-001** (scorer behavior under-tested): subsumed by DR-005-P1-001 — if the seam is remediated, behavior tests become the natural next step. No standalone finding warranted.
- **DR-007-P2-002** (blocking backoff spin): already captured as an advisory in the CONDITIONAL verdict; no new standalone P2 emitted.

## Traceability Checks

- `spec_code`: FAIL (unchanged). `run-benchmark.cjs:114` still calls `scoreFixture()` directly; `score-model-variant.cjs` is never imported. The spec.md:133 seam requirement is not met.
- `checklist_evidence`: FAIL (unchanged). TST-1 remains a plan-equality test, not a byte-identical state JSONL run (spec.md:125). No evidence the scorer is exercised through the benchmark path.
- `skill_agent`: PASS (unchanged from iter 7). MiniMax docs are internally consistent.
- `maintainability_test_quality`: FAIL due to DR-007-P2-001 (subsumed) and the persistent TST-1 evidence gap.
- `scorer_seam_clean`: PASS. `score-model-variant.cjs` is a clean decoupled entry point with primitive criteria + absolute cwd. The port comment (lines 7-21) accurately describes the design. No stale 120/003 fixture-file assumptions remain in the scorer entry point itself.
- `cache_assumptions`: PASS. Cache uses PACKET_ROOT-relative path (`path.join(PACKET_ROOT, 'cache')`) derived from `__dirname` at `cache.cjs:30`. This is consistent and predictable; no gitignored-path assumptions found.
- `config_loading_fragility`: PASS. `dispatch-model.cjs:118` builds the spawn spec safely with explicit arg arrays; no fragile config loading found in the benchmark path.

## Verdict

**CONDITIONAL** (unchanged). Iteration 8 found no new P0/P1/P2 findings. The second maintainability pass confirms:

1. The scorer decouple seam (`score-model-variant.cjs`) is correctly implemented — the issue is that `run-benchmark.cjs` never calls it, not that the scorer itself is broken.
2. The verbatim port is clean; no stale 120/003 assumptions remain in the scorer code.
3. Cache path assumptions are consistent and well-founded.
4. Config loading in the benchmark path is not fragile.

The unresolved P1 cluster (DR-005-P1-001/002/003) remains the sole blocker to a PASS verdict.

## Next Dimension

Iteration 9 (gpt-5.5, final executor pass) should perform adversarial verification of the prior P1 cluster: confirm DR-005-P1-001 is still unresolved in shipped code, check whether any 120/003 port artifacts were modified that could affect the seam, and assess whether the conditional verdict warrants a formal exception or if the P1s should be escalated.