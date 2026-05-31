# Iteration 2 — Lane C Orchestrator + Harness Correctness

## Focus

Dim C orchestrator (`run-skill-benchmark.cjs`) and harness scripts (`contamination-lint.cjs`, `advisor-probe.cjs`, `build-report.cjs`, `_args.cjs`). Five axes: malformed-fixture degradation, contamination banned-vocab breadth, advisor-probe spawn/timeout/rank math, build-report anti-drift, arg parsing.

---

## Findings

### P0 — Correctness / Crash

**P0-F1 | contamination-lint.cjs:46-47**
- **Issue:** `seg` is `const` inside the for-of block scope; referenced outside that scope on line 47: `if (seg && seg.length > 3) tokens.add(seg);`. This is a `ReferenceError` that fires for ANY resource path whose segments include any token > 3 characters (e.g. `references/skill-advisor/foo.md` → `references`, `skill-advisor`, `foo` all added, but the loop body throws before returning).
- **Fix:** Move the length check inside the loop body: `for (const seg of resourcePath.split('/')) { if (seg.length > 3) tokens.add(seg); }`

---

**P0-F2 | run-skill-benchmark.cjs:54**
- **Issue:** `priv = fs.existsSync(privPath) ? JSON.parse(fs.readFileSync(privPath, 'utf8')) : { expected: {} }` — the `JSON.parse` executes as the truthy branch of the ternary, meaning it is NOT inside the `try` block that starts at line 51. A malformed private fixture throws an uncaught exception, crashing the entire run with `TypeError: Cannot read property 'expected' of undefined` (line 59) because `priv` was never assigned.
- **Fix:** Move private fixture loading inside the `try` block alongside the public load.

---

**P0-F3 | advisor-probe.cjs:35**
- **Issue:** `spawnSync('python3', [py, String(prompt || '')], {...})` — when `probeAdvisor` is called with prompt=`undefined` (e.g. `fx.public.prompt` is absent in the fixture), `String(undefined || '')` → `"undefined"` is passed as a CLI arg, which the Python advisor would try to route. More critically, `timeoutMs` parameter is accepted but never forwarded to the call site of `probeAdvisor` in `run-skill-benchmark.cjs:113-115`.
- **Fix:** Pass `timeoutMs` explicitly at the call site; guard prompt with `?? ''` not `|| ''`.

---

### P1 — Degraded / Incomplete / Missing Validation

**P1-F4 | score-skill-benchmark.cjs:65-66**
- **Issue:** `expected.resources` being `undefined` (not `[]`) causes the `filter` to treat `expected.resources` as non-Array, yielding an empty-watched `have` Set. `wasted` = `routed.length` (all resources count as wasted). D3 then becomes `1 - routed/routed = 0`. Combined with negative scenario D1-intra giving `score=1` when nothing leaked (line 45), D2 (= dims.d1intra.score) gets 1.0 — the scoring inconsistency is minor but the undefined/[] ambiguity means the fixture contract is unclear.
- **Fix:** Normalize `expected.resources ?? []` at the top of `scoreScenario`.

---

**P1-F5 | score-skill-benchmark.cjs:73**
- **Issue:** `routed === 0` produces `Math.max(0, 1 - 0/0)` = `Math.max(0, NaN)` = `NaN`. This NaN propagates into `measured`, contaminating `wsum` and `modeAScore`. The guard `routed === 0` is supposed to handle the zero-routing case as perfect efficiency, but the math is broken.
- **Fix:** Change `Math.max(0, 1 - wasted / routed)` to `routed === 0 ? 1 : Math.max(0, 1 - wasted / routed)` — but this guard already exists at line 73; the issue is it comes AFTER the NaN-producing expression in some branch ordering. Explicit: `const d3Score = routed === 0 ? 1 : wasted / routed === 0 ? 1 : Math.max(0, 1 - wasted / routed)`.

---

**P1-F6 | advisor-probe.cjs:68**
- **Issue:** For `negative=true` scenarios, the condition `rank === null || rank > 5` treats "skill at rank 6" as success (score=1) and "skill at rank 5" as failure (score=0). But rank 5 is a strong negative signal (skill detected but ranked low), while rank 6+ means the skill was not even in the top-5 recommendations at all — which should be the success threshold for negative scenarios. The boundary is wrong.
- **Fix:** For negative, success should be `rank === null || rank > 3` (skill absent from or barely in top recommendations); alternatively score 0.5 for rank 4-5 as "marginal leak."

---

**P1-F7 | run-skill-benchmark.cjs:71 / _args.cjs**
- **Issue:** `_args.cjs` requires `--advisor-mode=value` syntax (regex at line 13 matches `--key=value`). A bare `--advisor-mode python` is treated as bare flag → `true`. `advisorMode === 'python'` then fails (it's the boolean `true`), so the probe is not triggered. However `|| 'off'` default means the string `"false"` or `"0"` passed via `--advisor-mode=false` would be truthy (probe not triggered) without being the explicit `'python'` string. The CLI design is fragile.
- **Fix:** Document the `=value` requirement; add explicit falsy-string check: `const probe = advisorMode === 'python' ? probeAdvisor({ prompt: fx.public.prompt || '', timeoutMs: 60000 }) : undefined`.

---

### P2 — Style / Naming / Docs

**P2-F8 | build-report.cjs:18**
- **Issue:** `d.score == null` (coercing equality) also matches `undefined`, so the branch correctly renders unscored dims. However `d.status || 'unscored'` would render `_undefined_` if status is literally the string `"undefined"` from JSON (unlikely but possible with manual edits to report.json). Minor anti-pattern.
- **Fix:** Use `d.status ?? 'unscored'` (nullish coalescing).

---

**P2-F9 | contamination-lint.cjs:29**
- **Issue:** `trigger_phrases:` YAML block regex requires list items on immediately following lines with no blank-line tolerance. A blank line between `trigger_phrases:` and its `-` items silently produces zero triggers. Same for `frontmatterTriggers` parsing of `name:` — `^name:` anchors to line start, which is correct for frontmatter but fragile.
- **Fix:** Document that frontmatter must have blank-line-free list items; add a warning if no triggers extracted from a non-empty `trigger_phrases:` block.

---

**P2-F10 | contamination-lint.cjs:57**
- **Issue:** `add()` silently drops strings that `trim().length <= 2`. While this helps avoid false positives on short words, it also drops legitimate 2-3 char tokens (e.g. skill id `sk` or `py`). The threshold of 2 is arbitrary and could miss real contamination.
- **Fix:** Lower threshold to `> 1` to allow 2-char tokens; document why.

---

## Verdict

**Review verdict: CONDITIONAL**

Rationale: Two P0 crashes (P0-F1 `seg` scope bug, P0-F2 uncaught private fixture parse) and one P0 (P0-F3 prompt undefined) exist. P0-F1 and P0-F2 would crash any real run against a skill with resources, making them high-probability in practice. P1-F5 (NaN in D3) can corrupt aggregate scoring for zero-routing scenarios. The three P1s degrade correctness of advisor-based scoring and negative-scenario handling. The P2s are minor.

The harness is structurally sound in design but has three crash bugs that would fire on normal inputs. These must be fixed before the Lane C CI gate is reliable.
