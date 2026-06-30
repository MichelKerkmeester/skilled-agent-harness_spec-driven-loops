# gpt-5.5-fast (high) Code-Remediation Report

_Source: cli-opencode dispatch into wt/0008-deep-review-fixes, fixing the dual-pass MiMo review findings (code). Verified by the operator + full suite 359/359 + drift 4/4 on main. The criteria-exec fail-closed change required updating two gate tests (remediation.vitest.ts by the agent; bundle-gate-exec-gate.vitest.ts by the operator)._

---

Implemented the requested code-only remediation.

| Item | Status |
|---|---|
| A1 scorer criteria-exec fail-closed | FIXED |
| A2 bundle-gate uses shared fail-closed gate | FIXED |
| A3 remediation gate tests updated | FIXED |
| B harness parser/cache/normalization/comment fixes | FIXED |
| C skill-benchmark maintainability fixes | FIXED |
| D double-wrapped RegExp simplified | FIXED |
| E D4 ablation helper sharing | FIXED |
| F dispatch positional-arg note | FIXED |
| G sweep test seam documented | FIXED |

**Files Modified**
- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs`
- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs`
- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs`
- `.opencode/skills/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts`
- `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs`
- `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs`
- `.opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs`

**node --check**
| File | Result |
|---|---|
| `harness.cjs` | PASS |
| `score-model-variant.cjs` | PASS |
| `bundle-gate.cjs` | PASS |
| `score-skill-benchmark.cjs` | PASS |
| `d4-ablation.cjs` | PASS |
| `dispatch-model.cjs` | PASS |
| `sweep-benchmark.cjs` | PASS |

**Behavior Notes**
- C: `modeAScore` remains single-round at final weighted normalization; added JSDoc/commenting and cohesion helpers without score-shape changes. Probe passed: `modeAScore=100`.
- D: RegExp construction now uses `new RegExp(a.pattern, 'g')`, preserving the prior match semantics without redundant wrapping.
- E: `d4-ablation.cjs` now uses `harness.clampScore01` and shared `buildGraderBase`; probe confirmed shared references/fields.
- F: Dispatch behavior unchanged; `cli-opencode` prompt remains the final positional arg and `input` remains `null`. Split deferred by design as higher-risk than the requested safe remediation.
- Only intended behavior change is A: criteria command execution is now fail-closed unless `DEEP_AGENT_ALLOW_CRITERIA_EXEC` is `1` or `true`, with `remediation.vitest.ts` updated.

**Extra Checks**
- Comment hygiene checker passed on all touched files.
- Lightweight probes passed for criteria gate, brace-balanced parser extraction, grader cache redaction, Mode A scoring, shared D4 helpers, and dispatch argv behavior.
- One cache-redaction probe initially used the wrong cache blob extension, then passed after correcting the probe to `.out.md`.

I did not run vitest because `node_modules` are unavailable and installs are banned. I ran no install, no package edit, no docs/spec/version edit, and no git add/commit/push/checkout/reset. Current `git status` also shows `.opencode/package.json` and `.opencode/package-lock.json` modified outside my touched-file list; I did not edit those.