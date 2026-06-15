---
title: "Implementation Plan: Capability discrimination — hard fixtures + isolated dispatch + M3-vs-MiMo verdict"
description: "Fix the sweep's per-cell dispatch cwd-isolation so agentic file-writes land in temp dirs, build a hard partial-credit fixture pack that separates frontier models, and run a CI-gated M3-vs-MiMo capability verdict on correctness + real token-efficiency."
trigger_phrases:
  - "capability discrimination plan"
  - "sweep cwd isolation"
  - "hard partial-credit fixtures"
  - "m3 vs mimo capability verdict"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/004-capability-discrimination"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Build complete: cwd-isolation + 4 hard fixtures + 6 isolation tests; oracles validated"
    next_safe_action: "Await M3-vs-MiMo run, then synthesis verdict and strict validate"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-127-004"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Capability discrimination

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS `.cjs` harness) + TypeScript Vitest tests |
| **Framework** | model-benchmark sweep harness (`deep-improvement` skill) |
| **Storage** | Profile/fixture JSON assets; `eval/` results (aggregate + synthesis) |
| **Testing** | Vitest (`npx vitest run model-benchmark/tests/`) |

### Overview
Make the benchmark discriminate frontier-model capability rather than just format. Three moves: (1) fix `sweep-benchmark.cjs` so each cell dispatches with its per-cell `mkdtemp` temp dir as the `cwd` (the repo root was the pollution bug), with `try/finally` cleanup; (2) add a hard partial-credit fixture pack (tier T4) whose many adversarial hidden cases turn `correctness_pass_rate` into a fraction that separates "mostly right" from "fully right"; (3) run a real multi-sample MiniMax-M3 vs MiMo-V2.5-Pro comparison through the model-vs-model mode for a CI-gated verdict on correctness plus real token-efficiency.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2–3)
- [x] Success criteria measurable (SC-001..004)
- [x] Dependencies identified (003 dispatch envelope + paired-bootstrap CI; real scorer)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..004; isolation + tests done, run + verdict pending)
- [x] Tests passing — `npx vitest run model-benchmark/tests/` → 149 passed, exit 0
- [ ] Docs updated (spec/plan/tasks done; implementation-summary + synthesis pending the run)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sweep harness over a model × framework × fixture matrix; per-cell dispatch into an isolated temp working directory; partial-credit oracle scoring; paired-bootstrap CI gate to produce an honest WINNER/TIE/INCONCLUSIVE verdict.

### Key Components
- **`sweep-benchmark.cjs` (`dispatchCell`)**: dispatches each cell with `cwd` = the per-cell `mkdtemp` temp dir, then `try/finally fs.rmSync(dir, { recursive: true, force: true })`. A test-only `_dispatch` seam is exposed so isolation can be asserted without a live model.
- **Hard fixture pack (T4)**: `hard-merge-intervals`, `hard-parse-csv-line`, `hard-roman-to-int`, `hard-eval-expr` — each instructs "return ONLY the function source as text; do NOT write files" and carries 16–18 adversarial oracle cases.
- **Capability profile `capability-m3-vs-mimo.json`**: mode `model-vs-model`, models MiniMax-M3 + MiMo-V2.5-Pro (cli-opencode, variant `high`), frameworks `[costar]`, the 4 hard fixtures, `samplesPerCell: 3`, `correctnessGate.threshold: 1.0`, `reporting.groupBy: model`.
- **`code-task-scorer.cjs` (existing)**: the real partial-credit scorer; oracles are validated through it (reference → 1.0, wrong → <1.0).

### Data Flow
Profile → sweep enumerates cells → each cell dispatches into an isolated temp dir (prompt file in dir, model output captured) → `code-task-scorer.cjs` scores response against the fixture's hidden oracle cases → per-cell `correctness_pass_rate` + token usage → aggregate + paired-bootstrap CI → `eval/aggregate.json` verdict → `eval/synthesis.md` narrative.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase carries a `fix_bug` surface (the dispatch cwd-pollution bug), so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sweep-benchmark.cjs` `dispatchCell` | Producer of dispatch cwd; previously passed repo root | Update — pass per-cell temp dir as `cwd`; `try/finally` cleanup | 6 isolation tests + smoke (untracked set 33→33) |
| `sweep-benchmark.cjs` `_dispatch` seam | Test injection point for dispatch | Add — test-only seam so isolation is assertable offline | `sweep-isolation.vitest.ts` injects `_dispatch` |
| Hard fixtures (`benchmark-fixtures/hard-*.json`) | New oracle data consumed by scorer | Create — 4 T4 fixtures, 16–18 cases each | Oracle validation through real scorer (ref 1.0 / wrong <1.0) |
| `capability-m3-vs-mimo.json` profile | New consumer of fixtures + models | Create — model-vs-model, costar, samplesPerCell 3 | Profile-load test asserts shape |
| `code-task-scorer.cjs` | Existing scorer consuming fixtures | Unchanged — reused as-is | Oracle pass/fail spread proves it discriminates |
| `eval/{aggregate,synthesis}.*` | Run outputs | Create — owned by the background run, NOT this doc task | Pending the real run (not yet produced) |

Required inventories (this phase):
- Same-class producers: the only cwd-passing site is `dispatchCell`; no other dispatch entry passes a working directory.
- Consumers of changed symbols: `_dispatch` is consumed only by the isolation tests; fixtures are consumed by the scorer and the capability profile.
- Matrix axes: model (2) × framework (1, costar) × fixture (4) × samplesPerCell (3).
- Algorithm invariant: a real dispatch MUST NOT add untracked files to the repo (writes are confined to a temp dir that is removed in `finally`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] cwd-isolation fix landed in `dispatchCell` (temp dir as `cwd` + `try/finally` cleanup, `_dispatch` seam)
- [x] Hard fixture pack scaffolded (4 T4 fixtures under `benchmark-fixtures/`)
- [x] Capability profile `capability-m3-vs-mimo.json` created

### Phase 2: Core Implementation
- [x] Oracle cases authored (16/17/17/18 across the 4 fixtures), "return source as text; do NOT write files" framing
- [x] Isolation tests added (`sweep-isolation.vitest.ts`, 6 tests)
- [x] Oracles validated through the real `code-task-scorer.cjs` (reference → 1.0, wrong → <1.0)

### Phase 3: Verification
- [x] Full suite green — `npx vitest run model-benchmark/tests/` → 149 passed (143 baseline + 6 new), exit 0
- [x] Isolation smoke (1 real dispatch, no `--mock`): untracked set 33→33 (zero new files)
- [ ] Real multi-sample M3-vs-MiMo run → `eval/aggregate.json` verdict (in progress)
- [ ] `eval/synthesis.md` capability verdict (correctness + token-efficiency + caveats) (pending the run)
- [ ] `validate.sh --strict` passes on this folder (pending all docs + results)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Dispatch cwd lands under `os.tmpdir()` (not repo root), holds the prompt file, cleaned after single + 8-cell sweep; simulated model write does not leak; fixture-shape + profile-load | Vitest (`sweep-isolation.vitest.ts`) |
| Integration | Oracle validation: reference impls score 1.0 and wrong impls <1.0 through `code-task-scorer.cjs` | `code-task-scorer.cjs` |
| Manual | Isolation smoke with 1 real dispatch (no mock); confirm `git status` untracked count unchanged (33→33) | git + live dispatch |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003 dispatch envelope + paired-bootstrap CI | Internal | Green | No CI verdict gate; cannot certify WINNER/TIE |
| `code-task-scorer.cjs` (real partial-credit scorer) | Internal | Green | Oracles can't be validated; fixtures untrusted |
| cli-opencode dispatch (M3 + MiMo at variant high) | External | Yellow | Run cannot execute; verdict deferred |
| Dispatcher token/cost usage parser | External | Yellow | Token-efficiency may be partial (defensive-null envelope) — correctness remains primary signal |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Isolation smoke leaks files into the repo, or oracle validation shows a wrong impl scoring 1.0 (non-discriminating fixture).
- **Procedure**: Revert the `dispatchCell` cwd change and/or the offending fixture; keep the repo clean; do not run the live benchmark until isolation + oracles are proven again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: isolation + fixtures + profile) ──► Phase 2 (Oracles + tests) ──► Phase 3 (Verify: suite + smoke ──► run ──► synthesis ──► strict-validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (isolation, fixtures, profile) | 003 envelope + CI | Oracles, Tests |
| Oracles + tests | Setup | Verification |
| Verify (suite + smoke) | Oracles + tests | Real run |
| Real run + synthesis + strict-validate | Verify (proven isolation + oracles) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (isolation + fixtures + profile) | High | Done |
| Oracles + tests | Med | Done |
| Verification (suite + smoke) | Med | Done |
| Real run + synthesis + strict-validate | Med | In progress (run-bound) |
| **Total** | | **~70% complete (run + synthesis remain)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Isolation proven before any full run (smoke: untracked 33→33)
- [x] Oracles validated through the real scorer before trusting fixtures
- [ ] Re-run command documented in `eval/synthesis.md` (pending the run)

### Rollback Procedure
1. If a live run pollutes the repo: stop the run, `git clean`/restore the untracked set, revert the `cwd` change.
2. If an oracle is wrong (wrong impl scores 1.0): pull the fixture from the profile, re-derive oracle values, re-validate through `code-task-scorer.cjs`.
3. Re-confirm the suite is green (`npx vitest run model-benchmark/tests/`) before re-attempting the run.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete any `eval/` artifacts from a bad run and re-run once isolation + oracles are re-proven. `eval/` is owned by the background run, not this doc task.
<!-- /ANCHOR:enhanced-rollback -->
