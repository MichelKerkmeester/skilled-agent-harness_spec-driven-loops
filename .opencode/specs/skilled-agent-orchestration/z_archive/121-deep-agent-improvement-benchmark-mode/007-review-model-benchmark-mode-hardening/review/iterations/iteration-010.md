# Deep Review Iteration 10 — Final Adversarial Verification

## Dimension: security (cross-cutting confirmation)

## Files Reviewed (verification pass)

| File | Lines | Finding Verified |
|------|-------|-----------------|
| `scripts/loop-host.cjs` | 73–75 | DR-001-P1-001/DR-002-P1-001 CONFIRMED |
| `scripts/dispatch-model.cjs` | 118–149, 165–189 | DR-001-P1-002 CONFIRMED |
| `scripts/scorer/deterministic/cwd-check.cjs` | 80–97, 142–147 | DR-001-P1-003 CONFIRMED |
| `scripts/scorer/score-model-variant.cjs` | 93–112 | DR-003-P1-001 CONFIRMED |
| `scripts/scorer/grader/harness.cjs` | 63–74, 110–124, 210–232 | DR-003-P1-002 CONFIRMED |
| `scripts/run-benchmark.cjs` | 106–125, 265–294 | DR-005-P1-001 CONFIRMED |
| `scripts/promote-candidate.cjs` | 160–179 | DR-005-P1-002 CONFIRMED |
| `scripts/scorer/deterministic/cwd-check.cjs` | 141–147 | DR-005-P1-003 CONFIRMED |
| `scripts/reduce-state.cjs` | 600–619 | DR-009-P1-001 CONFIRMED |
| `spec.md` | 120–134 | Traceability confirmation |

## Findings by Severity

### P0 — Blockers: 0
No new P0 findings.

### P1 — Required: 11 active (all confirmed unchanged)

| ID | Title | File:Line | Verification Result |
|----|-------|-----------|---------------------|
| DR-001-P1-001 | model-benchmark route never invokes generic dispatcher | `loop-host.cjs:73` | CONFIRMED — `steps[]` directly calls `run-benchmark.cjs`; `dispatch-model.cjs` is never invoked in the model-benchmark path |
| DR-001-P1-002 | Direct dispatcher ignores requested working directory | `dispatch-model.cjs:173` | CONFIRMED — `spawnSync` at line 173 has no `cwd` option; `dir` is only passed as CLI arg for `cli-opencode`, absent for all other executors |
| DR-001-P1-003 | D3 cwd checker misses sibling-prefix traversal | `cwd-check.cjs:86` | CONFIRMED — `startsWith` check allows `/repo/foobar` to escape `/repo/foo` |
| DR-002-P1-001 | model-benchmark route never invokes dispatcher (MiniMax) | `loop-host.cjs:73` | CONFIRMED — same as DR-001-P1-001 |
| DR-003-P1-001 | Benchmark criteria executes arbitrary shell commands | `score-model-variant.cjs:103` | CONFIRMED — `execSync(a.command, {cwd: cwdAbs})` executes string command from criteria |
| DR-003-P1-002 | D4 grader accepts unbounded model-provided scores | `harness.cjs:68` | CONFIRMED — `typeof parsed.score === 'number'` checks type only; no upper bound |
| DR-005-P1-001 | model-benchmark runner bypasses decoupled 5-dim scorer | `run-benchmark.cjs:114` | CONFIRMED — `scoreFixture()` is called directly; `score-model-variant.cjs` is never imported |
| DR-005-P1-002 | Promotion overclaims model-benchmark support | `promote-candidate.cjs:168` | CONFIRMED — `if (score.status !== 'scored')` rejects benchmark-complete status before checking benchmark report |
| DR-005-P1-003 | Deterministic checks use fixture JSON not explicit --cwd | `cwd-check.cjs:142` | CONFIRMED — positional args `<fixture.json> <output.md>`; no `--cwd` option |
| DR-009-P1-001 | Reducer/dashboard missing mode metadata | `reduce-state.cjs:608` | CONFIRMED — `record.type === 'benchmark_run'` check does not surface `mode` field |

**Downgrade assessment:** None of the 11 P1s warrant downgrade to P2:
- DR-001-P1-001/002: correctness + spec violation, not advisory
- DR-001-P1-003: path containment bypass with security implications
- DR-003-P1-001: command injection surface in scorer
- DR-003-P1-002: benchmark integrity poisoning via unbounded scores
- DR-005-P1-001: spec REQ-004 violation
- DR-005-P1-002: spec REQ-002 violation (promotion contract)
- DR-005-P1-003: spec REQ-004 violation (CLI contract)
- DR-009-P1-001: spec SC-002 violation (mode metadata)

### P2 — Suggestions: 4 active (confirmed unchanged)

| ID | Title | File:Line |
|----|-------|-----------|
| DR-003-P2-001 | Grader cache persists raw model output | `harness.cjs:219` |
| DR-004-P2-001 | dispute.cjs uses global fs monkey-patch | `dispute.cjs:71` |
| DR-007-P2-001 | Scorer tests assert shape, not behavior | `scorer.vitest.ts:55` |
| DR-007-P2-002 | Rate-limit backoff is synchronous busy wait | `dispatch-model.cjs:189` |

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | FAIL | spec.md:127 requires generic dispatcher; loop-host.cjs:73 does not invoke it |
| `checklist_evidence` | FAIL | TST-1 tests plan equality, not byte-identical state JSONL; scorer tests don't cover benchmark runner seam |
| `skill_agent` | PASS | MiniMax docs internally consistent across cli-opencode, sk-prompt, sk-prompt-models |

## Verdict: CONDITIONAL

**Rationale:** 11 P1 findings remain active after 10 iterations across all 4 dimensions. No findings were downgraded or marked false-positive. No new high-risk security surface was identified in this final pass that was not already captured.

The CONDITIONAL verdict signals that the code has correctness, traceability, and security issues that must be resolved before merge. P2-only remaining issues would enable a PASS with `hasAdvisories=true`.

## Next Dimension

All dimensions (correctness, security, traceability, maintainability) are complete. This iteration completes the 10-iteration adversarial verification pass.
