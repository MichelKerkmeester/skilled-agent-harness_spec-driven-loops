# Iteration 007 — security + tests

## Focus

Security review of Lane C vitest (`skill-benchmark.vitest.ts`) and its dependency modules: `contamination-lint.cjs` (path/identifier leakage), `d5-connectivity.cjs` (path-escape detection), `advisor-probe.cjs` (subprocess injection surface), plus fixture public/private split soundness and test coverage gaps.

---

## Findings

### P1 — Degraded / incomplete / missing validation

**Finding 1 — E2E test silently passes with zero scenarios**
- **File:** `.opencode/skills/deep-improvement/scripts/tests/skill-benchmark.vitest.ts:188-199`
- **Issue:** The end-to-end test invokes `run-skill-benchmark.cjs --skill cli-codex`. The `cli-codex` skill has **no fixtures directory** (`.opencode/skills/cli-codex/assets/skill-benchmark/fixtures/` does not exist). `loadFixtures` returns `[]`, so `report.scenarioRows` is empty. The test asserts `existsSync(jsonPath)`, `report.mode === 'skill-benchmark'`, and `report.schemaVersion === 'skill-benchmark-report.v1'` — all pass with a zero-scenario report. The test never checks `scenarioRows.length > 0`.
- **One-line fix:** Assert `report.scenarioRows.length > 0` in the e2e test, or use a skill that has real fixtures (e.g. deep-improvement itself).

---

**Finding 2 — advisor-probe prompt-to-subprocess data path is unverified**
- **File:** `.opencode/skills/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:35`
- **Issue:** `probeAdvisor` passes `String(prompt || '')` as a direct python3 argv argument: `spawnSync('python3', [py, String(prompt || '')], ...)`. While `spawnSync` without `shell: true` prevents OS-level command injection, the prompt reaches `skill_advisor.py` as `sys.argv[1]`. If that script or any transitive import were to pass `sys.argv[1]` into `exec()`/`eval()` or use it in a dynamic `importlib` path, prompt injection would be possible. Static scan of `skill_advisor.py` found no direct `eval()`/`exec()` on the prompt string, but the transitive import surface (e.g. `_RUNTIME_SPEC.loader.exec_module(_runtime_module)` at line 207) is not frozen by this review.
- **One-line fix:** Pass the prompt over stdin (`spawnSync('python3', [py, '-'], { input: prompt })`) or use an environment variable, to sever the argv data path.

---

**Finding 3 — No deep-improvement fixture contamination test**
- **File:** `.opencode/skills/deep-improvement/scripts/tests/skill-benchmark.vitest.ts:79-91`
- **Issue:** The contamination-lint describe block tests only `cli-codex`. The `deep-improvement` skill has its own public/private fixture pair (`agent-improve-001.public.json` / `.private.json`) but there is no test that (a) builds bannedVocab from `deep-improvement`'s router and (b) lints the `deep-improvement` fixture's own prompt. The deep-improvement SKILL.md router keywords include "deep-improvement", "bounded agent improvement", "5-dimension scoring" — these are exactly the terms that should be tested for absence from the public prompt.
- **One-line fix:** Add a test that builds `buildBannedVocab({ skillRoot: deep-improvement root, skillId: 'deep-improvement' })` and asserts `lintFixture` passes on the `deep-improvement` fixture prompt.

---

### P2 — Style / naming / docs

**Finding 4 — E2E test leaves temp directory orphaned**
- **File:** `.opencode/skills/deep-improvement/scripts/tests/skill-benchmark.vitest.ts:190`
- **Issue:** `mkdtempSync(join(tmpdir(), 'lc-e2e-'))` creates a temp directory that is never cleaned up. Not a security issue but pollutes `/tmp` and signals missing `afterEach`/`afterAll` cleanup.
- **One-line fix:** Add `afterAll(() => { try { rmSync(out, { recursive: true }); } catch {} })` or use `withTmpDir()` from vitest globals if available.

---

**Finding 5 — selectIntents AMBIGUITY_DELTA boundary is untested**
- **File:** `.opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs:22`
- **Issue:** `AMBIGUITY_DELTA = 1` means intents within exactly 1 point of the top score are kept. No test exercises the boundary (scores differ by 1, scores differ by 0, or empty score list). The test at `vitest.ts:68-71` tests `[{intent:'A',score:4},{intent:'B',score:3},{intent:'C',score:1}]` expecting `['A','B']` — but doesn't test equal scores (delta=0) or a single intent with zero matches.
- **One-line fix:** Add test cases: equal scores (delta=0 → both kept), score gap >1 (only top kept), and zero intents.

---

**Finding 6 — D1-inter negative-activation scenario not exercised in integration**
- **File:** `.opencode/skills/deep-improvement/scripts/tests/skill-benchmark.vitest.ts:124-131`
- **Issue:** The negative-activation scoring test (lines 124-131) uses a hand-constructed `routerResult` rather than a real fixture with `negativeActivation: true`. No end-to-end or unit test uses an actual `.public.json`/`.private.json` pair where `expected.negativeActivation` is `true` and verifies D3 credits are properly zeroed.
- **One-line fix:** Author a negative-activation fixture pair or add a `run-skill-benchmark`-level test that verifies a negative scenario row has `dims.d3.score === 0`.

---

## Verdict

The codebase is well-structured and the core security primitives (path-escape detection, no eval/exec, spawn without shell, contamination-lint gold隔离) are sound. Two P1 findings and two P2 findings are actionable. The most urgent is Finding 1 — the e2e test gives false confidence by passing with zero scenarios.

**Review verdict: CONDITIONAL**
