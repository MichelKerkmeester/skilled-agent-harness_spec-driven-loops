# Iteration 8 — Research Terminal: Final Handoff

## Focus

**Convergence acknowledged.** Iteration 7 declared convergence. Iteration 8 serves as the terminal research iteration — formalizing the complete build-delta synthesis and confirming the research packet is ready for implementation-agent handoff.

## Actions Taken

1. **Reviewed convergence state** — iteration 7 newInfoRatio=0.05 confirmed convergence threshold met.
2. **Verified findings registry** — 133 key findings across iterations 1-6, 0 open questions, 5/5 questions answered.
3. **Confirmed build-delta completeness** — 3 CREATE files, 4 MODIFY files, 5 BC invariants, 10 edge cases fully characterized.
4. **Verified per-seam interface contracts** — CandidateSource, Dispatcher, Scorer seams fully specified with signatures.

## Findings

### Research Completeness Summary

| Metric | Value |
|--------|-------|
| Total iterations | 8 (2 terminal) |
| Questions answered | 5/5 |
| Key findings | 133 |
| BC invariants | 5 (BC-INV-1 through BC-INV-5) |
| Edge cases | 10 (EC-1 through EC-10) |
| newInfoRatio | 0.00 (terminal; no new delta) |
| Status | CONVERGENCE |

### Build-Delta Ready for Implementation

**Files to CREATE:**
- `loop-host.cjs` — orchestrating entry point with `--mode` switch (default: agent-improvement)
- `dispatch-model.cjs` — model-agnostic CLI dispatcher, generalized from dispatch-minimax.cjs
- `buildGraderFn(mode)` factory in `eval-rig/grader/harness.cjs` — returns mode-appropriate grader

**Files to MODIFY:**
- `score-candidate.cjs` — rename evaluationMode 'dynamic-5d' → 'agent-improvement', add mode field to all records
- `run-benchmark.cjs` — add mode: 'model-benchmark' to all state records
- `promote-candidate.cjs` — accept --mode argument, mode-aware convergence routing
- `reduce-state.cjs` — add mode to profile bucket metadata, display in dashboard

### Per-Seam Interface Contracts

**CandidateSource Seam:**
```javascript
// @returns {{ proposal: { id: string, signature: string, meta?: object, filePath?: string, source: 'seeded'|'mutated'|'imported' }|null }}
```

**Dispatcher Seam:**
```javascript
// @param {{ prompt_file: string, executor: 'cli-opencode'|'cli-claude-code'|'cli-devin'|'cli-codex'|'cli-gemini', model?: string, agent?: string, mock?: boolean, mock_mode?: string, cwd?: string, timeout_ms?: number, variant?: string }}
// @returns {Promise<{ ok: boolean, exit_code: number, stdout: string, stderr: string, attempts: number, paused?: boolean, pause_reason?: string, mock?: boolean }>}
```

**Scorer Seam:**
```javascript
// @param {{ candidateId: string, candidateHash: string, fixture: object, outputText: string, rubricVersion: string, mode: 'real'|'mock', mockMode?: string }}
// @returns {Promise<{ fixtureId: string, weightedScore: number, dimensions: object, hard_gate_failed: boolean }>}
```

### Backward-Compat Invariants (BC-INV-1 to BC-INV-5)

| ID | Invariant |
|----|-----------|
| BC-INV-1 | loop-host.cjs --mode=agent-improvement OR no --mode produces byte-for-byte identical state JSONL as existing production path |
| BC-INV-2 | score-candidate.cjs callers work without modification |
| BC-INV-3 | scored record schema remains backward-compatible (new fields additive) |
| BC-INV-4 | reduce-state.cjs handles pre-feature records without mode field |
| BC-INV-5 | promote-candidate.cjs defaults to agent-improvement when mode absent/unknown |

### Implementation Edge Cases (EC-1 to EC-10)

| ID | Case |
|----|------|
| EC-1 | State log first-run (fs.appendFileSync creates parent dirs) |
| EC-2 | Unknown mode → warns stderr, falls back to agent-improvement |
| EC-3 | Mixed state log (pre/post feature records) |
| EC-4 | Concurrent execution (run-specific state log paths) |
| EC-5 | materialize-benchmark-fixtures.cjs failure propagation |
| EC-6 | Score cache collision (mode-differentiation in cache key) |
| EC-7 | infra_failure records carry correct mode field |
| EC-8 | promote-candidate.cjs mode routing for benchmark-complete status |
| EC-9 | variant argument forwarded only for model-benchmark |
| EC-10 | Rubric version not hardcoded when called from model-benchmark mode |

## Questions Answered

All 5 key questions fully answered:
- **Q1** (seam interface contracts): iterations 1 + 3
- **Q2** (dispatch generalization): iteration 2
- **Q3** (scorer port + rubric decoupling): iteration 3
- **Q4** (mode switch wiring): iteration 4
- **Q5** (backward-compat test strategy + edge cases): iteration 6

## Questions Remaining

None.

## Next Focus

**Research terminal.** Implementation agent should receive this packet with full build-delta. Implementation phase owns the code changes per the build-delta list. Research session complete.