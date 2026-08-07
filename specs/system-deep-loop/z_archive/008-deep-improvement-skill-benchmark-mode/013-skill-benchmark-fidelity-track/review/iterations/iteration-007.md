# Iteration 007 — security (deep)

## Dimension
Security (deep) — focused on command injection, prompt injection, untrusted data handling, and env-gated execution surfaces.

## Files Reviewed
- `scripts/model-benchmark/dispatch-model.cjs:340-347` — buildResumeHint shell command construction
- `scripts/model-benchmark/scorer/grader/harness.cjs:94-139` — untrusted delimiter defense
- `scripts/model-benchmark/scorer/grader/harness.cjs:147-197` — parseGraderResponse regex fallback
- `scripts/model-benchmark/scorer/grader/harness.cjs:320-369` — cache raw output gating
- `scripts/model-benchmark/scorer/score-model-variant.cjs:145-167` — deterministic execSync gate
- `scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs:154-204` — Layer-3 execSync gate
- `scripts/model-benchmark/dispatch-model.cjs:73-77` — writeCapableOptIn
- `scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md:1-45` — grader prompt
- `SKILL.md:289-291` — hardening env gates documentation

## Findings by Severity

### P1 — Required Fix

**R7-P1-001: `buildResumeHint` shell command injection via unsanitized path**
- **File:** `scripts/model-benchmark/dispatch-model.cjs:340-347`
- **Claim:** `buildResumeHint(sentinelPath)` constructs a shell command string by concatenating `relSentinel` and `loopHost` paths without shell escaping. The result is written to the pause sentinel JSON file as `resume_via`. If `sentinelPath` contains shell metacharacters (spaces, semicolons, backticks), the resume hint becomes an injection vector when a user copies and pastes it.
- **Impact:** A sentinel path crafted with shell metacharacters could execute arbitrary commands when the operator pastes the resume hint. While sentinel paths are typically derived from `opts.state_dir` or `DEEP_AGENT_STATE_DIR` (operator-controlled), the code does not enforce this invariant — `opts.state_dir` comes from CLI args (`--state-dir=`) and is unsanitized.
- **Fix:** Use `JSON.stringify(relSentinel)` or shell-quote the path, or emit a structured resume instruction (JSON object with separate fields) instead of a raw shell command string.

**R7-P1-002: Regex fallback in `parseGraderResponse` accepts structurally wrong JSON**
- **File:** `scripts/model-benchmark/scorer/grader/harness.cjs:170-176`
- **Claim:** The `fallback_regex` path uses `rawText.match(/\{[\s\S]*?"score"\s*:\s*([\d.]+)[\s\S]*?\}/)` to extract a JSON object from untrusted model output. This regex is non-greedy on the prefix but greedy on the suffix (`[\s\S]*?` before `}`), so it matches the *first* opening brace through the *last* closing brace that contains a `"score"` field — potentially spanning multiple JSON objects or capturing extraneous content. The parsed result is then fed to `clampScore01` for the score, but `rationale` and `evidence` fields from the fallback-parsed JSON pass through to the cache and consumers without bounds checking.
- **Impact:** A grader response containing two JSON objects (e.g., one legitimate, one adversarial with inflated rationale/evidence) could have the wrong object selected. While the score is clamped, the rationale and evidence could leak adversarial content into the benchmark report and cache.
- **Fix:** After regex extraction, validate that the parsed object has the expected `dim_id` field matching `D4` before accepting it as a valid fallback. Reject if `dim_id` is missing or wrong.

### P2 — Suggestion

**R7-P2-001: `DEEP_AGENT_ALLOW_CRITERIA_EXEC` defaults to permissive**
- **File:** `scripts/model-benchmark/scorer/score-model-variant.cjs:151`, `bundle-gate.cjs:173`
- **Claim:** The criteria-exec gate defaults to enabled (executes profile-supplied commands) unless explicitly set to `'0'`. SKILL.md:290 documents this as a "trusted-author default" with backward-compat rationale. While intentional, the default-on posture means a benchmark profile from an untrusted source (e.g., a contributed fixture) could execute arbitrary commands during scoring.
- **Impact:** Latent injection surface when profiles are sourced from external contributors. Not an exploit today (profiles are trusted-author), but the surface widens as the benchmark framework accepts more profiles.
- **Fix:** Document the trust boundary more prominently in the benchmark operator guide. Consider requiring an explicit opt-in (`=1`) for new profiles rather than defaulting on.

**R7-P2-002: Grader prompt concatenation passes system+user as single arg**
- **File:** `scripts/model-benchmark/scorer/grader/harness.cjs:208`
- **Claim:** `dispatchReal` passes `prompt.systemPrompt + '\n\n' + prompt.userPrompt` as a single `-p` argument to the claude CLI. If the system prompt is very long (approaching shell arg limits), this could be silently truncated. More importantly, the two-prompt contract is invisible to the CLI — it sees one argument.
- **Impact:** Low — the claude CLI handles large prompts, and the delimiter defense still works. But if the CLI ever parses `-p` content for control sequences, the concatenated format could cause unexpected behavior.
- **Fix:** Consider passing system and user prompts as separate arguments if the claude CLI supports `--system-prompt` and `-p` separately, or document the concatenation contract.

## Traceability Checks

| Claim (SKILL.md / changelog) | Code evidence | Status |
|---|---|---|
| SKILL.md:290 — `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses BOTH criteria-exec paths | score-model-variant.cjs:151 ✓, bundle-gate.cjs:173 ✓ | **PASS** |
| SKILL.md:291 — `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output | harness.cjs:344-346 ✓ | **PASS** |
| SKILL.md:290 — "Trusted-author default rationale (DOCUMENT-ACCEPT)" | score-model-variant.cjs:147-150 comment matches | **PASS** |
| SKILL.md:287 — "write-capable evaluation requires DEEP_AGENT_DISPATCH_WRITE=1" | dispatch-model.cjs:74-77 ✓, buildSpawnSpec guards all executors | **PASS** |
| SKILL.md:287 — "Read-only by default (F-P1-1)" | dispatch-model.cjs:393-444 — all 5 executors enforce read-only unless writeCapableOptIn() | **PASS** |
| changelog — D4-R task-outcome instrument | d4-ablation.cjs:134-236 ✓, system-grader-task-outcome.md:1-45 ✓ | **PASS** |

## Verdict
**CONDITIONAL** — Two P1 findings (shell injection in resume hint, regex fallback acceptance of wrong-dim_id JSON) require fixes. No P0 blockers. Security posture is generally strong: env-gated exec surfaces, read-only dispatch default, untrusted delimiter defense, and score clamping are all present and correct.

## Next Dimension
**Traceability** — deep verification that SKILL.md, READMEs, changelog, and reference trigger_phrases accurately reflect the actual code behavior.
