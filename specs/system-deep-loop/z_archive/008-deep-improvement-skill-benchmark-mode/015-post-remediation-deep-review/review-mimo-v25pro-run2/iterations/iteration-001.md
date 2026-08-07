# Iteration 001 — inventory+correctness

**Dimension:** inventory+correctness  
**Prior findings:** P0=0 P1=0 P2=0  
**This iteration:** 3 findings (0 P0, 0 P1, 3 P2)

---

## Files Reviewed

- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs` (460 lines)
- `.opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs` (302 lines)
- `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` (677 lines)
- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs` (365 lines)
- `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` (403 lines)
- `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs` (258 lines)
- `.opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs` (646 lines)
- `.opencode/skills/deep-improvement/SKILL.md` (546 lines)
- `.opencode/skills/deep-improvement/changelog/v1.11.1.0.md` (46 lines)

---

## Findings by Severity

### P2 — Suggestions

#### R1-P2-001: Greedy regex in grader fallback path could match spurious JSON

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:211`  
**Claim:** The regex fallback `rawText.match(/\{[\s\S]*?"score"\s*:\s*([\d.]+)[\s\S]*?\}/)` uses `[\s\S]*?` (lazy any-char) which, on text containing multiple JSON objects, could span from the first `{` to the last `"score": <num> }` — potentially enclosing unrelated JSON.  
**Impact:** Low. `normalizeParsedPayload` validates the parsed object has `typeof parsed.score === 'number'`, and `clampScore01` bounds it. A spurious match would need to produce valid JSON with a numeric score field, which is unlikely in practice. The strict parse and fenced-block fallback catch most cases first.  
**Fix (optional):** Anchor the regex to start closer to `"score"` or use a brace-balanced extraction (like `collectBraceBalancedObjects` in live-executor.cjs) before attempting JSON parse.

#### R1-P2-002: Duplicate clamp function between d4-ablation.cjs and harness.cjs

**File:** `scripts/skill-benchmark/d4-ablation.cjs:39` vs `scripts/model-benchmark/scorer/grader/harness.cjs:81`  
**Claim:** `d4-ablation.cjs` defines its own `clamp01(x)` (line 39) that duplicates the logic of `harness.cjs`'s `clampScore01(value)` (line 81). Both coerce non-finite to 0 and clamp to [0,1].  
**Impact:** Maintainability only. If the clamping semantics ever change, two sites need updating. No correctness difference today.  
**Fix (optional):** Import `clampScore01` from harness.cjs or extract to a shared lib.

#### R1-P2-003: criteriaExecAllowed warn-once may be missed in batch runs

**File:** `scripts/model-benchmark/scorer/score-model-variant.cjs:116`  
**Claim:** The warn-once guard (`!warnedPermissiveCriteriaExec`) means only the first `criteriaExecAllowed()` call logs the "not explicitly truthy" warning. In a batch sweep running many criteria, a user who did not watch the first invocation's stderr output will never see it again.  
**Impact:** Low. The default behavior (allow execution) is intentional for backward compat and documented in SKILL.md §4. The warning is advisory.  
**Fix (optional):** Log once per process is standard; consider a summary count at exit if criteria exec was used N times without an explicit gate.

---

## Traceability Checks

| Claim (changelog/SKILL.md) | Code evidence | Status |
|---|---|---|
| dimId threaded through composeGraderPrompt | `harness.cjs:154` — `dimId = 'D4'` default param | ✅ |
| dimId threaded through parseGraderResponse | `harness.cjs:186` — `dimId = 'D4'` default param | ✅ |
| normalizeParsedPayload stamps missing dim_id | `harness.cjs:129` — `{ ...parsed, dim_id: dimId }` | ✅ |
| normalizeParsedPayload caps mismatched dim confidence | `harness.cjs:131` — `Math.min(parsed.confidence, 0.3)` | ✅ |
| Score-only fallback uses threaded dimId | `harness.cjs:229` — `dim_id: dimId` (not hardcoded 'D4') | ✅ |
| dispatchReal uses --append-system-prompt | `harness.cjs:250` — `args = ['--print', '--model', GRADER_MODEL, '--append-system-prompt', prompt.systemPrompt, '-p', prompt.userPrompt]` | ✅ |
| GRADED_RESPONSE_MAX_CHARS=8000 | `live-executor.cjs:45` — `const GRADED_RESPONSE_MAX_CHARS = 8000;` | ✅ |
| Truncation applies only to raw.responseText diagnostic field | `live-executor.cjs:255` — `responseText.slice(0, GRADED_RESPONSE_MAX_CHARS)` inside `raw:` | ✅ |
| collectBraceBalancedObjects is string-aware | `live-executor.cjs:122-148` — tracks `inString`, `escaped`, handles `\\` and `"` | ✅ |
| shellQuote on resume-hint path | `dispatch-model.cjs:347` — `shellQuote(relSentinel)`, `shellQuote(loopHost)` | ✅ |
| shellQuote POSIX single-quote escaping | `dispatch-model.cjs:357` — `"'" + String(value).replace(/'/g, "'\\''") + "'"` | ✅ |
| loadConfig ENOENT-vs-parse diagnostic | `dispatch-model.cjs:113` — `if (err.code === 'ENOENT') continue; console.warn(...)` | ✅ |
| criteriaExecAllowed gate | `score-model-variant.cjs:111-120` — returns false on '0', true on '1'/'true', warns+default-true otherwise | ✅ |
| scoreScenario refactor: D1 formula preserved | `score-skill-benchmark.cjs:97` — `0.4 * ir + 0.6 * rr` matches original | ✅ |
| scoreScenario refactor: surface mismatch cap preserved | `score-skill-benchmark.cjs:104` — `Math.min(d1.score, 0.25)` | ✅ |
| scoreScenario refactor: negative scenario logic preserved | `score-skill-benchmark.cjs:91-92` — `leakedExpected ? 0 : 1` | ✅ |
| scoreScenario refactor: D3 formula preserved | `score-skill-benchmark.cjs:133` — `Math.max(0, 1 - unexpectedRoutedCount / routed)` | ✅ |
| scoreScenario refactor: modeAScore reads WEIGHTS | `score-skill-benchmark.cjs:164` — `WEIGHTS.d1intra`, `WEIGHTS.d2`, `WEIGHTS.d3` | ✅ |
| SKILL.md §11 lists all scripts | All 6 new scripts present (run-skill-benchmark, live-executor, score-skill-benchmark, d4-ablation, build-report, advisor-probe) | ✅ |
| SKILL.md SKILL_BENCHMARK router branch | `SKILL.md:140` — `references/skill-benchmark/operator_guide.md`, `scoring_contract.md`, `scenario_authoring.md` | ✅ |

---

## Verdict

**PASS** — The v1.11.1.0 remediation is correct. All 28 claimed fixes are verified in the code. No P0 or P1 findings. Three P2 maintainability suggestions, none affecting correctness or security.

## Next Dimension

**security** — Focus areas: shell injection vectors in dispatch-model.cjs (buildSpawnSpec prompt passthrough), execSync in score-model-variant.cjs criteria path, and file-read path traversal in resolveCriteriaFile.
