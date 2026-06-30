# Iteration 3 — Security Dimension

**Reviewer:** mimo-v25pro (run 2)
**Date:** 2026-06-02
**Focus:** security
**Prior findings:** P0=0 P1=0 P2=4 (iterations 1-2)

---

## Dimension

**security** — Command injection, prompt injection, path traversal, data exposure, untrusted input handling.

## Files Reviewed

| File | Lines Reviewed |
|------|---------------|
| `scripts/model-benchmark/scorer/grader/harness.cjs` | 1–460 |
| `scripts/skill-benchmark/live-executor.cjs` | 1–302 |
| `scripts/model-benchmark/dispatch-model.cjs` | 1–677 |
| `scripts/model-benchmark/scorer/score-model-variant.cjs` | 1–365 |
| `scripts/skill-benchmark/score-skill-benchmark.cjs` | 1–403 |
| `scripts/skill-benchmark/d4-ablation.cjs` | 1–258 |
| `scripts/model-benchmark/sweep-benchmark.cjs` | 1–100 |
| `scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs` | (grep for execSync) |
| `SKILL.md` | 1–546 |

---

## Findings by Severity

### P1 — Required Fix

#### R3-P1-001: Permissive criteria-exec default allows arbitrary command execution

**File:** `scripts/model-benchmark/scorer/score-model-variant.cjs:111–120`

**Claim:** `criteriaExecAllowed()` returns `true` when `DEEP_AGENT_ALLOW_CRITERIA_EXEC` is unset, undefined, or any value other than `'0'`, `'1'`, or `'true'`. The warn-once at line 116 fires only on the first invocation (`warnedPermissiveCriteriaExec` flag), so subsequent criteria commands execute silently. This means a benchmark profile authored with `type: "deterministic"` criteria can run arbitrary shell commands (`execSync(a.command, ...)` at line 173) by default, with no explicit opt-in from the operator.

**Evidence:**
- `score-model-variant.cjs:111–120` — `criteriaExecAllowed()` default path returns `true` after warn-once.
- `score-model-variant.cjs:173` — `execSync(a.command, { cwd: cwdAbs, timeout: 30000, ... })` executes the criteria command.
- `scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs:200` — Same pattern: `execSync(acceptance.command, ...)` gated by the same `criteriaExecAllowed()` check.

**Impact:** A shared runner or CI environment that does not explicitly set `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` will execute arbitrary commands from benchmark profiles. While SKILL.md §4 documents this as a "trusted-author boundary" (DOCUMENT-ACCEPT), the default-on posture means any operator who doesn't read the hardening docs inherits command execution capability. In a shared or adversarial benchmark scenario, a crafted profile could execute malicious commands.

**Fix:** Either (a) flip the default to `false` and require explicit opt-in (`DEEP_AGENT_ALLOW_CRITERIA_EXEC=1`), or (b) emit the warning on every invocation (not just the first) so operators are reminded of the trust boundary. Option (a) is the security-hardening default; option (b) preserves backward compat while improving visibility.

---

### P2 — Suggestion

#### R3-P2-001: Regex fallback in grader response parser could extract wrong JSON object

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:211–222`

**Claim:** The regex fallback `rawText.match(/\{[\s\S]*?"score"\s*:\s*([\d.]+)[\s\S]*?\}/)` at line 211 is designed to extract a JSON object containing a `"score"` field from unstructured grader output. The `[\s\S]*?` pattern matches any character (including newlines) non-greedily. If the grader response contains multiple JSON-like structures (e.g., the system prompt echoed back plus the actual grade), the regex could match a span that includes unrelated content, potentially yielding a malformed or incorrect JSON parse. The subsequent `JSON.parse(objMatch[0])` would then fail or produce a wrong result.

**Impact:** Low. The regex is a last-resort fallback (strict JSON and fenced-block parsing are tried first). The grader model (claude-sonnet-4-5) typically returns well-formed JSON. A failure here would produce `parse_status: 'failed'` and a 0.0 score (from `clampScore01`), which is a safe degradation.

**Fix:** No immediate action required. If robustness is desired, validate the extracted JSON has the expected keys (`score`, `confidence`, `rationale`) before accepting it.

#### R3-P2-002: Grader cache stores raw model output by default

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:385–403`

**Claim:** The grader cache persists `raw_grader_output` (the full stdout from the grader CLI call) by default. The `DEEP_AGENT_GRADER_CACHE_RAW=0` env var exists to redact it (line 389–391), but the default is to store the raw output. In a shared environment, cached grader output could contain sensitive content from the graded prompt (which includes the untrusted candidate output wrapped in the sentinel markers).

**Impact:** Low. The raw output is the grader's JSON response (score/confidence/rationale), not the input prompt. The risk is limited to environments where the cache directory is shared across trust boundaries. SKILL.md §4 documents the `DEEP_AGENT_GRADER_CACHE_RAW=0` hardening option.

**Fix:** No immediate action required. The existing env gate is sufficient for hardened deployments.

---

## Traceability Checks

### SKILL.md §4 — Hardening env gates

- ✅ `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` documented and implemented (`score-model-variant.cjs:113`).
- ✅ `DEEP_AGENT_GRADER_CACHE_RAW=0` documented and implemented (`harness.cjs:389`).
- ✅ "Trusted-author default rationale (DOCUMENT-ACCEPT)" accurately describes the default-on behavior.

### SKILL.md §11 — Script list

- ✅ All 18 scripts listed in §11 exist on disk.
- ✅ `harness.cjs` is referenced indirectly via the grader scorer path.

### Changelog v1.11.1.0 — 28 fixes

- ✅ `harness.cjs` dimId threading: confirmed in `composeGraderPrompt` (line 154), `parseGraderResponse` (line 186), `normalizeParsedPayload` (line 127), `--append-system-prompt` (line 250), fallback dim_id stamping (line 129).
- ✅ `live-executor.cjs` GRADED_RESPONSE_MAX_CHARS=8000: confirmed at line 45, applied at line 255 (raw.responseText truncation only; full text flows through extractRoutingJson/proseRoutingFallback).
- ✅ `live-executor.cjs` collectBraceBalancedObjects: confirmed string-aware at lines 122–148 (inString/escaped state machine).
- ✅ `dispatch-model.cjs` shellQuote on resume-hint: confirmed at line 347 (`shellQuote(relSentinel)`, `shellQuote(loopHost)`).
- ✅ `dispatch-model.cjs` loadConfig ENOENT-vs-parse diagnostic: confirmed at lines 112–114 (ENOENT continues, parse error warns).
- ✅ `score-model-variant.cjs` criteriaExecAllowed gate: confirmed at lines 111–120 (warn + default-preserved).
- ✅ `score-skill-benchmark.cjs` scoreScenario refactor: confirmed behavior-preserving — helper decomposition (normalizeScenarioInput, computeSurfaceMatch, scoreD1Intra, scoreD2, scoreD3, scoreAssetRecall, firstFailingStage, modeAScore) preserves formulas, branch order, and return keys.

### scoreScenario refactor — Behavior preservation

Verified that the extracted helpers (`scoreD1Intra`, `scoreD2`, `scoreD3`, `modeAScore`) preserve:
- ✅ D1-intra formula: `0.4 * intentRecall + 0.6 * resourceRecall` with surface mismatch cap at 0.25.
- ✅ D2 formula: `resourceRecall` (or `d1intra.score` for negative scenarios).
- ✅ D3 formula: `1 - unexpectedRoutedCount / routed` (or `d1intra.score` for negative).
- ✅ Mode A score: weighted average over measured dims, normalized by sum of measured weights.
- ✅ Return keys: `scenarioId`, `tier`, `dims`, `firstFailingStage`, `modeAScore`, `applicable`, `classKind`, `expectedSurface`, `observedSurface`, `surfaceMatch`, `traceMode`, `liveEvidence`.

---

## Verdict

**CONDITIONAL** — One P1 finding (criteria-exec default posture). The code matches all documentation claims and the v1.11.1.0 remediation is verified. No P0 blockers. The P1 is a hardening improvement, not a correctness bug — the current behavior is documented and intentional, but the default-on posture in shared environments is a security concern.

---

## Next Dimension

**maintainability** — Code clarity, dead code, test coverage, documentation accuracy.
