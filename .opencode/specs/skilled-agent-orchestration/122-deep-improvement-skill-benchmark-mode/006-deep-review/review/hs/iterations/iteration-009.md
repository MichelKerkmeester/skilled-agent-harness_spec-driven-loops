# Iteration 009 — docs-vs-code drift (cross-cutting)

## Focus

Verify SKILL.md scoring_contract + references/skill-benchmark/scoring_contract.md describe what score-skill-benchmark.cjs ACTUALLY computes (weights D1=25/D2=20/D3=15/D4=25/D5=15; which dims are scored vs unscored). Verify command file's documented invocation matches loop-host's real planInvocation args. Flag every doc claim contradicted by code.

---

## Findings

### P1 — loop-host forwards dead options that run-skill-benchmark.cjs never consumes

**File:** `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:63-73`

**Issue:** `SKILL_BENCHMARK_RUN_OPTIONS` forwards `--profile`, `--state-log`, `--label`, `--grader`, `--k-runs` to `run-skill-benchmark.cjs`, but `run-skill-benchmark.cjs` only reads `args.skill`, `args['outputs-dir']`, `args['fixtures-dir']`, `args.output`, `args['trace-mode']`, and `args['advisor-mode']`. The five extra options are silently absorbed by `_args.cjs`'s permissive parser (line 9-22) but never used. This misleads operators into believing these flags affect the run.

**One-line fix:** Remove `'profile'`, `'state-log'`, `'label'`, `'grader'`, `'k-runs'` from `SKILL_BENCHMARK_RUN_OPTIONS` in loop-host.cjs, or implement the missing handlers in run-skill-benchmark.cjs.

---

### P2 — operator_guide.md and command file omit --advisor-mode despite run-skill-benchmark.cjs using it

**File:** `.opencode/skills/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:71`

**Issue:** `run-skill-benchmark.cjs` reads `args['advisor-mode']` (line 71) and `probeAdvisor()` is invoked when `advisorMode === 'python'` (lines 113-115). Neither `operator_guide.md` (lines 7-15) nor the command file `/deep:start-skill-benchmark-loop.md` (lines 25-30) documents `--advisor-mode`. Operators reading the canonical docs would not know this knob exists.

**One-line fix:** Add `[--advisor-mode=python]` to the documented invocation in operator_guide.md and the command file.

---

### P2 — default_profile.json ships weights but --profile option is unimplemented

**File:** `.opencode/skills/deep-improvement/assets/skill-benchmark/default_profile.json:5`

**Issue:** `default_profile.json` defines `"weights": { "d1inter": 12, "d1intra": 13, ... }` (line 5), signaling `--profile` should drive weight overrides. However, `run-skill-benchmark.cjs` never reads `args.profile` — weights are hardcoded in `score-skill-benchmark.cjs` line 22. The profile concept is scaffolding with no runtime wiring.

**One-line fix:** Either wire `--profile` loading in `run-skill-benchmark.cjs` or remove the dead `weights` field from `default_profile.json` until it is implemented.

---

### PASS — scoring_contract.md weights match score-skill-benchmark.cjs

**Source:** `scoring_contract.md:7` vs `score-skill-benchmark.cjs:22`

Both document: `D1=25 (inter 12 + intra 13) · D2=20 · D3=15 · D4=25 · D5=15 (hard gate)`.

Code: `const WEIGHTS = { d1inter: 12, d1intra: 13, d2: 20, d3: 15, d4: 25, d5: 15 };`

No drift. ✓

---

### PASS — scored vs unscored dimensions match between doc and code

**Source:** `scoring_contract.md:9-23` vs `score-skill-benchmark.cjs:100-107` vs `operator_guide.md:28-35`

All three agree: Mode A scores D1-intra, D2, D3, D5 (hard gate). D1-inter and D4 are deferred to live mode and reported as `unscored-mode-a`.

Code correctly normalizes the aggregate over only the measured dims (lines 100-107). No drift. ✓

---

### PASS — modeAScore normalization is honestly documented

**Source:** `scoring_contract.md:11` vs `score-skill-benchmark.cjs:107`

Doc: "the aggregate normalizes over the measured weights (D1-intra + D2 + D3) so the number is honest about coverage."

Code: `const wsum = measured.reduce((a, [, w]) => a + w, 0); const modeAScore = Math.round((measured.reduce((a, [s, w]) => a + s * w, 0) / wsum) * 100);`

Correct. ✓

---

## Verdict

**Review verdict: CONDITIONAL**

Rationale: One P1 (dead-forwarded options in loop-host.cjs that silently mislead operators), two P2s (undocumented `--advisor-mode` flag, unimplemented `--profile` option with dead weight data). No P0s. No correctness or security issues. The core scoring contract (weights + dimension coverage) is accurate and consistent across all doc + code sources.

---
