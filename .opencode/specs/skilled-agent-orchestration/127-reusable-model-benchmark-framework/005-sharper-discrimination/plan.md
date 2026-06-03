---
title: "Implementation Plan: Sharper discrimination — harder non-saturating fixtures + n=5 CI-certified M3-vs-MiMo margin"
description: "004 saturated 3 of 4 hard fixtures so the verdict rested on a single variance blip. This phase adds 3 genuinely-harder spec-heavy fixtures (semver-compare, normalize-path, int-to-words) with oracle-validated cases, keeps roman-to-int, and runs n=5 so the paired-bootstrap CI can certify a sharper margin or an honest TIE."
trigger_phrases:
  - "sharper discrimination plan"
  - "harder non-saturating fixtures"
  - "n=5 ci-certified margin"
  - "anti-saturation fixture pack"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/005-sharper-discrimination"
    last_updated_at: "2026-06-02T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixture build done: 3 harder oracle-validated fixtures + n=5 profile + 153 tests green"
    next_safe_action: "Run de-risk sweep (n=2, 16 cells) to confirm non-saturation before the full run"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v2.json"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-127-005"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Sharper discrimination

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
| **Storage** | Profile/fixture JSON assets; `eval/` results (results + aggregate + synthesis) |
| **Testing** | Vitest (`npx vitest run model-benchmark/tests/`) |

### Overview
Make the 127 verdict sharp and certifiable instead of resting on one variance blip. Three moves: (1) author 3 genuinely-harder, spec-heavy T4 fixtures (`harder-semver-compare`, `harder-normalize-path`, `harder-int-to-words`), each carrying 24 adversarial oracle cases so frontier models land at a *fraction* rather than 1.0; (2) validate every new fixture's oracle through the real `code-task-scorer.cjs` (reference impl → 1.0, deliberately-wrong impl → <1.0) before any run; (3) ship a new `capability-m3-vs-mimo-v2.json` profile (the 3 harder fixtures + the one fixture that discriminated, `hard-roman-to-int`, `samplesPerCell: 5`, correctness gate 1.0, groupBy model) and run a de-risk sweep then the full n=5 sweep so the paired-bootstrap CI (003) can certify a winner or honestly call a TIE.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2–3)
- [x] Success criteria measurable (SC-001..004)
- [x] Dependencies identified (004 fixtures + 003 paired-bootstrap CI; real `code-task-scorer.cjs`)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..004; fixtures + oracles + profile + tests done, de-risk run + full run + verdict pending)
- [x] Tests passing — `npx vitest run model-benchmark/tests/` → 153 passed, exit 0
- [ ] Docs updated (spec/plan/tasks/checklist done; implementation-summary + synthesis pending the run results)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sweep harness over a model × framework × fixture matrix; per-cell dispatch into an isolated temp working directory (inherited from 004); partial-credit oracle scoring; paired-bootstrap CI gate to produce an honest WINNER/TIE/INCONCLUSIVE verdict. This phase is additive — it adds harder fixtures + a profile, not new harness machinery.

### Key Components
- **Harder fixture pack (T4)**: `harder-semver-compare` (semverCompare — semver.org §11 precedence incl. pre-release identifiers + build-metadata-ignored), `harder-normalize-path` (normalizePath — Unix `..` beyond root, `.`, multi-slash, trailing-slash, empty), `harder-int-to-words` (intToWords — non-negative integer → American-English words: hyphenation, no "and", scale words, zero). Each carries 24 adversarial oracle cases and the "return ONLY the function source as text; do NOT write files" framing.
- **Sharper profile `capability-m3-vs-mimo-v2.json`**: fixtures `[harder-semver-compare, harder-normalize-path, harder-int-to-words, hard-roman-to-int]`, models MiniMax-M3 + mimo-v2.5-pro (cli-opencode, variant `high`), `sampling.samplesPerCell: 5`, correctness gate threshold 1.0, `reporting.groupBy: model`. Validated by `profile-validator.cjs` → valid.
- **`code-task-scorer.cjs` (existing)**: the real partial-credit scorer; the 3 new oracles are validated through it (reference → 1.0, deliberately-wrong → <1.0).
- **Test coverage (`sweep-isolation.vitest.ts`)**: fixture-shape coverage extended for the new pack; full suite → 153 passed.

### Data Flow
Profile → sweep enumerates cells (4 fixtures × 2 models × 5 samples = 40) → each cell dispatches into an isolated temp dir (prompt file in dir, model output captured) → `code-task-scorer.cjs` scores the response against the fixture's 24 hidden oracle cases → per-cell `correctness_pass_rate` + token usage → aggregate + paired-bootstrap CI → `eval/aggregate.json` verdict → `eval/synthesis.md` narrative (CI-certified winner or honest TIE).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] 3 harder T4 fixtures scaffolded under `benchmark-fixtures/` (`harder-semver-compare`, `harder-normalize-path`, `harder-int-to-words`), 24 oracle cases each
- [x] Sharper profile `capability-m3-vs-mimo-v2.json` created (4 fixtures, samplesPerCell 5, correctness gate 1.0, groupBy model)
- [x] Profile validated — `profile-validator.cjs` → valid

### Phase 2: Core Implementation
- [x] Oracle cases authored (24 each), "return ONLY the function source as text; do NOT write files" framing
- [x] Oracles validated through the real `code-task-scorer.cjs` (semver-compare 1.0/0.33, normalize-path 1.0/0.79, int-to-words 1.0/0.42)
- [x] Fixture-shape coverage extended in `sweep-isolation.vitest.ts` for the new pack

### Phase 3: Verification
- [x] Full suite green — `npx vitest run model-benchmark/tests/` → 153 passed, exit 0
- [ ] De-risk run (n=2, 16 cells) confirms ≥2 fixtures do not saturate (SC-002) (in progress)
- [ ] Full n=5 run (40 cells) → `eval/{results,aggregate}.json` + CI verdict (pending the de-risk gate)
- [ ] `eval/synthesis.md` states the CI-certified verdict or an honest TIE (SC-003) (pending the run)
- [ ] `validate.sh --strict` passes on this folder (SC-004) (pending all docs + results)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New fixtures parse + carry the expected oracle-case count; profile loads and validates | Vitest (`sweep-isolation.vitest.ts`) |
| Integration | Oracle validation: reference impls score 1.0 and deliberately-wrong impls <1.0 through `code-task-scorer.cjs` | `code-task-scorer.cjs` |
| Manual | De-risk run (n=2) confirms ≥2 fixtures do not saturate before the expensive full run | live dispatch + aggregate inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004 cwd-isolation + `hard-roman-to-int` fixture | Internal | Green | No proven isolation; the one discriminating fixture is lost |
| 003 paired-bootstrap CI | Internal | Green | No CI verdict gate; cannot certify WINNER/TIE |
| `code-task-scorer.cjs` (real partial-credit scorer) | Internal | Green | Oracles can't be validated; fixtures untrusted |
| cli-opencode dispatch (M3 + mimo-v2.5-pro at variant high) | External | Yellow | Run cannot execute; verdict deferred |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new fixture saturates (both frontier models 1.0) so the pack adds no signal, or oracle validation shows a deliberately-wrong impl scoring 1.0 (non-discriminating fixture).
- **Procedure**: Pull the offending fixture from `capability-m3-vs-mimo-v2.json`, re-derive its oracle values, and re-validate through `code-task-scorer.cjs`; keep the repo clean; do not run the full n=5 sweep until the de-risk run proves ≥2 fixtures discriminate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: harder fixtures + profile) ──► Phase 2 (Oracles + tests) ──► Phase 3 (Verify: suite ──► de-risk run ──► full n=5 run ──► synthesis ──► strict-validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (fixtures, profile) | 004 fixtures + 003 CI | Oracles, Tests |
| Oracles + tests | Setup | Verification |
| Verify (suite green) | Oracles + tests | De-risk run |
| De-risk run (n=2) | Verify | Full n=5 run |
| Full run + synthesis + strict-validate | De-risk run (≥2 fixtures discriminate) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (harder fixtures + profile) | High | Done |
| Oracles + tests | Med | Done |
| Verification (suite green) | Low | Done |
| De-risk run (n=2) | Med | In progress (run-bound) |
| Full run + synthesis + strict-validate | Med | Pending (run-bound) |
| **Total** | | **~50% complete (de-risk + full run + synthesis remain)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Oracles validated through the real scorer before trusting fixtures (semver-compare 1.0/0.33, normalize-path 1.0/0.79, int-to-words 1.0/0.42)
- [ ] De-risk run proves ≥2 fixtures do not saturate before the full run (pending)
- [ ] Re-run command documented in `eval/synthesis.md` (pending the run)

### Rollback Procedure
1. If the de-risk run shows a fixture saturates: pull it from `capability-m3-vs-mimo-v2.json`, re-derive harder oracle cases, re-validate through `code-task-scorer.cjs`.
2. If a live run pollutes the repo: stop the run, restore the untracked set, re-confirm the 004 cwd-isolation still holds.
3. Re-confirm the suite is green (`npx vitest run model-benchmark/tests/`) before re-attempting any run.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete any `eval/` artifacts from a bad run and re-run once the fixtures are re-proven to discriminate. `eval/` is owned by the background run, not this doc task.
<!-- /ANCHOR:enhanced-rollback -->
