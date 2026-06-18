# Iteration 003 — Security

**Dimension:** security
**Prior findings:** P0=0 P1=1 P2=4 (across iterations 2)
**Already-covered dimensions:** inventory+correctness, correctness

---

## Files Reviewed

- `scripts/model-benchmark/scorer/grader/harness.cjs:1-460` — D4 grader dispatcher, prompt composition, response parser, cache
- `scripts/skill-benchmark/live-executor.cjs:1-302` — live dispatch executor, brace scanner, response parser
- `scripts/model-benchmark/dispatch-model.cjs:1-677` — model-agnostic CLI dispatcher, shell quoting, pause sentinel
- `scripts/model-benchmark/scorer/score-model-variant.cjs:1-365` — 5-dim scorer, criteria exec gate
- `scripts/skill-benchmark/score-skill-benchmark.cjs:1-403` — Lane C D1-D5 scorer
- `scripts/skill-benchmark/d4-ablation.cjs:1-258` — D4/D4-R ablation
- `scripts/model-benchmark/sweep-benchmark.cjs:1-646` — benchmark matrix sweep
- `scripts/skill-benchmark/executor-dispatch.cjs:1-123` — executor-to-orchestrator seam
- `references/skill-benchmark/scoring_contract.md:1-59` — scoring contract
- `changelog/v1.11.1.0.md:1-46` — remediation changelog
- `SKILL.md:1-546` — skill definition

---

## Findings by Severity

### P1 (Required Fix)

#### R3-P1-001: `criteriaExecAllowed()` defaults to permissive with misleading guidance

**File:** `scripts/model-benchmark/scorer/score-model-variant.cjs:111-120`

**Claim:** The `criteriaExecAllowed()` function defaults to `true` (arbitrary shell execution allowed from profile criteria) when `DEEP_AGENT_ALLOW_CRITERIA_EXEC` is unset. The warning message at line 116 reads "preserving trusted-profile default execution" which actively encourages keeping the permissive default. The `execSync(a.command)` at line 173 runs the criteria command in the fixture's cwd with no sandboxing.

**Evidence:**
- `score-model-variant.cjs:111-120`: `criteriaExecAllowed()` returns `true` when env var is unset
- `score-model-variant.cjs:116`: warning text "preserving trusted-profile default execution. Set it to 0 to disable criteria commands"
- `score-model-variant.cjs:173`: `execSync(a.command, { cwd: cwdAbs, timeout: 30000 })` — unsandboxed shell exec

**Impact:** In shared-runner or untrusted-profile deployments, an attacker who can modify a benchmark profile JSON can achieve arbitrary code execution. The warning text discourages disabling the gate by framing the permissive default as "trusted." The changelog (v1.11.1.0.md:24) calls this "explicit" but the default is still open.

**Fix:** Change the warning to be security-neutral ("not explicitly set; defaulting to ALLOW. Set DEEP_AGENT_ALLOW_CRITERIA_EXEC=0 to disable for untrusted profiles") and add a note in SKILL.md §4 Hardening env gates recommending `=0` for shared runners.

#### R3-P1-002: Regex fallback for grader score extraction is fragile

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:211-222`

**Claim:** The regex fallback `rawText.match(/\{[\s\S]*?"score"\s*:\s*([\d.]+)[\s\S]*?\}/)` uses non-greedy `[\s\S]*?` before `"score"`, which in edge cases with multiple JSON objects containing "score" keys may match a wrong inner substring. The closing `}` match is also non-greedy, potentially truncating the JSON before all required fields are captured.

**Evidence:**
- `harness.cjs:211`: regex pattern with non-greedy quantifiers
- `harness.cjs:212-222`: attempts `JSON.parse(objMatch[0])` on the matched substring

**Impact:** A grader response with commentary containing a partial `{"score": ...}` fragment before the real JSON could cause the regex to extract the wrong object, producing an incorrect D4 score.

**Fix:** Replace with a brace-counting approach similar to `collectBraceBalancedObjects` in `live-executor.cjs`, or at minimum use greedy matching: `/\{[\s\S]*"score"\s*:\s*([\d.]+)[\s\S]*\}/` to capture the outermost object.

### P2 (Suggestion)

#### R3-P2-001: Cache raw grader output redaction is partial

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:389-411`

**Claim:** When `DEEP_AGENT_GRADER_CACHE_RAW=0`, the `raw_grader_output` field is redacted, but the cache blob at lines 394-403 still persists `fixture_id`, `variant_hash`, `rubric_version`, and the grader model name. For sensitive deployments, the fixture metadata (embedded in the cache key and write metadata) leaks grading criteria identity.

**Impact:** Low — metadata exposure only, not prompt content. But a hardened deployment expecting full redaction would still leak fixture identifiers.

**Fix:** Document that `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts only raw model output, not metadata. Optionally add a `DEEP_AGENT_GRADER_CACHE_METADATA=0` gate for full redaction.

#### R3-P2-002: `buildSpawnSpec` prompt passed as positional CLI argument

**File:** `scripts/model-benchmark/dispatch-model.cjs:413-422`

**Claim:** For `cli-opencode`, the prompt text is passed as a positional argument (`args.push(promptText)`). While `execFileSync` avoids shell injection, prompts containing null bytes or extremely long content could cause issues with argument parsing. The `cli-claude-code` path (line 428) also passes the prompt via `-p` as an argument.

**Impact:** Low — `execFileSync` is safe from shell injection. Theoretical edge case with null bytes or argv length limits.

**Fix:** Consider passing the prompt via stdin for `cli-opencode` (as done for `cli-codex` at line 438-439) for consistency and to avoid argv limits.

#### R3-P2-003: Double-wrapped RegExp in `scoreAcceptanceDeterministic`

**File:** `scripts/model-benchmark/scorer/score-model-variant.cjs:146`

**Claim:** `new RegExp(new RegExp(a.pattern).source, 'g')` double-wraps the pattern. The inner `new RegExp(a.pattern)` compiles the pattern, then `.source` extracts it, then the outer `new RegExp(..., 'g')` recompiles with the `g` flag. If `a.pattern` already contains regex metacharacters, the inner compilation may throw.

**Impact:** Low — criteria patterns are profile-authored and expected to be valid regex. The double-wrap is redundant but not harmful for valid inputs.

**Fix:** Simplify to `new RegExp(a.pattern, 'g')`.

---

## Traceability Checks

| Claim | Source | Code Match | Verdict |
|-------|--------|------------|---------|
| Grader is dimension-aware (dimId threaded) | changelog v1.11.1.0:11 | `harness.cjs:154,186,266,326,338` — dimId in compose/parse/mock/gradeD4 | PASS |
| normalizeParsedPayload stamps/caps mismatched dim_id | changelog v1.11.1.0:12 | `harness.cjs:127-143` — caps confidence to 0.3, annotates rationale | PASS |
| --append-system-prompt used for grader dispatch | changelog v1.11.1.0:13 | `harness.cjs:250` — `--append-system-prompt` flag in dispatchReal | PASS |
| GRADED_RESPONSE_MAX_CHARS=8000 cap | changelog v1.11.1.0:17 | `live-executor.cjs:45` — `const GRADED_RESPONSE_MAX_CHARS = 8000` | PASS |
| collectBraceBalancedObjects is string-aware | changelog v1.11.1.0:18 | `live-executor.cjs:118-148` — tracks inString/escaped state | PASS |
| shellQuote on resume-hint path | changelog v1.11.1.0:22 | `dispatch-model.cjs:356-358` — POSIX single-quote escaping | PASS |
| loadConfig ENOENT-vs-parse diagnostic | changelog v1.11.1.0:23 | `dispatch-model.cjs:113-114` — ENOENT skips, parse errors warn | PASS |
| criteriaExecAllowed gate (warn + default-preserved) | changelog v1.11.1.0:24 | `score-model-variant.cjs:111-120` — warns, returns true by default | PASS |
| scoreScenario split is behavior-preserving | changelog v1.11.1.0:28 | `score-skill-benchmark.cjs:194-260` — delegates to named helpers | PASS |
| D1-D5 weights: D1=25(inter12+intra13) D2=20 D3=15 D4=25 D5=15 | scoring_contract.md:25 | `score-skill-benchmark.cjs:33` — WEIGHTS match | PASS |
| D4 unscored in Mode A aggregate by design | scoring_contract.md:46 | `score-skill-benchmark.cjs:240` — `{ score: null, unscored: ... }` | PASS |
| D4-R advisory signal, never summed into verdict | scoring_contract.md:48 | `score-skill-benchmark.cjs:334-337` — advisorySignals only | PASS |

---

## Verdict: CONDITIONAL

The v1.11.1.0 remediation is well-executed: the dimension-aware grader, brace scanner, shell quoting, and criteria-exec gate all work as documented. The one security concern (P1: criteriaExecAllowed permissive default with encouraging warning text) is a design choice rather than a bug, but it warrants a more neutral warning and explicit hardening guidance in the documentation. The regex fallback fragility (P1) is a correctness concern that could produce wrong scores under adversarial grader responses.

## Next Dimension: traceability (deeper docs-vs-code audit)
