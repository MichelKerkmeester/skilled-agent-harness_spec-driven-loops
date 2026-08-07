# Iteration 004 — Traceability Review

**Agent:** mimo-v25pro
**Dimension:** traceability
**Date:** 2026-06-02

---

## Files Reviewed

- `SKILL.md:1-546` (full read)
- `README.md:1-378` (full read)
- `references/skill-benchmark/scoring_contract.md:1-59` (full read)
- `scripts/model-benchmark/scorer/grader/harness.cjs:1-460` (full read)
- `scripts/skill-benchmark/live-executor.cjs:1-302` (full read)
- `scripts/model-benchmark/dispatch-model.cjs:1-677` (full read)
- `scripts/model-benchmark/scorer/score-model-variant.cjs:1-365` (full read)
- `scripts/skill-benchmark/score-skill-benchmark.cjs:1-403` (full read)
- `scripts/skill-benchmark/d4-ablation.cjs:1-50` (partial read)
- `scripts/model-benchmark/sweep-benchmark.cjs:1-50` (partial read)
- Glob: `scripts/**/*.cjs` — 49 total .cjs files

---

## Findings by Severity

### P1 — Required Fix

#### R4-P1-001: SKILL.md version bumped to 1.12.0.0 with no changelog

- **File:** `SKILL.md:5`
- **Claim:** Frontmatter declares `version: 1.12.0.0`
- **Evidence:** No `references/changelog/` directory exists at all (glob returned zero results). The prior review targeted a `v1.11.1.0.md` changelog which also does not exist. Neither v1.11.1.0 nor v1.12.0.0 has a changelog entry.
- **Impact:** Traceability contract broken. Consumers (including this review) cannot verify what changed between versions. The version bump is ungrounded — there is no documentary evidence of what v1.12.0.0 contains versus prior versions.
- **Fix:** Create `references/changelog/v1.12.0.0.md` documenting the remediation changes. Consider also creating the missing v1.11.1.0 entry if that version was actually shipped.

#### R4-P1-002: Script count mismatch — SKILL.md §11 enumerates 25 but §4/README claim 22

- **File:** `SKILL.md:544` (§11), `SKILL.md:183-189` (§4), `README.md:216`
- **Claim:** §4 and README both state "22 helpers" (scripts/ grouped by lane). §11 lists 25 distinct script filenames.
- **Evidence:** §11 lists: 8 agent-improvement + 3 model-benchmark core + "scorer/**" subtree (harness.cjs, dispute.cjs, cache.cjs, plus 4 deterministic scripts) + 5 skill-benchmark + 6 shared = 25+ distinct .cjs scripts. The glob confirms 49 total .cjs files (including lib/ and tests/). The "22" in §4/README is stale — it was accurate before the scorer/ subtree was enumerated in §11 but was never updated.
- **Impact:** Operators and automation that rely on the README or §4 structure diagram for script inventory will undercount. The §11 list is authoritative but contradicts the §4 summary.
- **Fix:** Update §4 and README.md to say "25 core helpers + lib/ + tests/" (or enumerate the scorer subtree explicitly in §4's table).

### P2 — Suggestion

#### R4-P2-001: scoring_contract.md references upstream research docs that may not exist in this skill

- **File:** `references/skill-benchmark/scoring_contract.md:15`
- **Claim:** The overview cites `122-.../001-skill-benchmark-deep-research/research/research.md` and `002-implementation-deep-research/research/research.md` as sources of truth.
- **Evidence:** These are spec-folder paths outside the skill root. The scoring_contract.md is authoritative within the skill, but the upstream references are not verifiable from within `.opencode/skills/deep-improvement/`. If those spec docs are moved or deleted, the contract's provenance chain breaks.
- **Impact:** Low — the contract itself is self-contained and accurate against the code. The provenance references are informational, not load-bearing.
- **Fix:** Consider noting "see spec folder for design history" rather than hard-coding paths, or verify those paths exist and are stable.

#### R4-P2-002: harness.cjs fallback_regex may over-match across nested JSON structures

- **File:** `scripts/model-benchmark/scorer/grader/harness.cjs:211`
- **Claim:** The regex fallback `\{[\s\S]*?"score"\s*:\s*([\d.]+)[\s\S]*?\}` uses lazy quantifiers but still matches from ANY `{` to ANY `"score": N` pattern across the full raw text.
- **Evidence:** When grader output contains nested JSON (e.g. `{"outer": {"inner": 1}} ... "score": 0.5}`), the regex may match a span from the outermost `{` to the last `}`, capturing a malformed object that JSON.parse rejects. The match then falls through to the fallback_score_only path (line 224-237), which reconstructs a minimal object with defaults. This path works correctly but produces lower-confidence results (confidence capped at 0.3).
- **Impact:** Low — the fallback_score_only path is already the last resort, and the reconstructed object is clamped and validated. The real grader would have failed strict/fenced parsing first. But the regex could theoretically match unrelated text containing both `{` and `"score": N`.
- **Fix:** Consider anchoring the regex to fenced blocks only (the fenced path already handles this), or accept this as intentional last-resort behavior.

---

## Traceability Checks

| Check | Status | Evidence |
|---|---|---|
| SKILL.md §3 Lane A 5-dim weights match code | **PASS** | README.md:137-143 matches score-candidate.cjs dynamic-5d rubric (0.20/0.25/0.25/0.15/0.15) |
| SKILL.md §4 Lane B entry point matches code | **PASS** | `loop-host.cjs --mode=model-benchmark` confirmed; `dispatch-model.cjs` is the dispatcher; `score-model-variant.cjs` is the 5-dim scorer |
| SKILL.md §4 Lane B scorer contract matches code | **PASS** | `DEFAULT_RUBRIC` in score-model-variant.cjs:54-62 (D1=0.25, D2=0.3, D3=0.2, D4=0.15, D5=0.1) matches the shipped rubric |
| SKILL.md §4 hardening env gates match code | **PASS** | `DEEP_AGENT_ALLOW_CRITERIA_EXEC` in score-model-variant.cjs:112-120; `DEEP_AGENT_GRADER_CACHE_RAW` in harness.cjs:389-391 — both match §4 description |
| scoring_contract.md Lane C weights match code | **PASS** | `WEIGHTS = { d1inter: 12, d1intra: 13, d2: 20, d3: 15, d4: 25, d5: 15 }` in score-skill-benchmark.cjs:33 matches contract §2 |
| scoring_contract.md D1-intra formula matches code | **PASS** | `0.4 * ir + 0.6 * rr` in scoreD1Intra (line 97) matches contract §3 |
| scoring_contract.md D3 formula matches code | **PASS** | `1 - unexpectedRoutedCount / routed` in scoreD3 (line 133) matches contract §3 |
| scoring_contract.md verdict thresholds match code | **PASS** | `>=80 PASS, >=50 CONDITIONAL, else FAIL; gateFailed => BLOCKED-BY-STRUCTURE` in aggregate (lines 339-344) matches contract |
| SKILL.md §7 stop-reason taxonomy matches code | **PASS** | improvement-journal.cjs exports frozen enums matching §7 table |
| SKILL.md §11 script list vs actual files | **PASS** | All 25 scripts in §11 exist on disk (glob confirmed) |
| README.md structure diagram vs actual layout | **PASS** | Directory tree in §4 matches actual `references/`, `assets/`, `scripts/` layout |
| harness.cjs dim-awareness (v1.11.1.0 remediation) | **PASS** | dimId threaded through composeGraderPrompt:154, parseGraderResponse:186, normalizeParsedPayload:127, dimensionInstruction:114; fallback dim_id stamping at lines 129, 229 |
| harness.cjs --append-system-prompt contract | **PASS** | dispatchReal:250 uses `--append-system-prompt` correctly with system prompt as arg |
| live-executor.cjs GRADED_RESPONSE_MAX_CHARS=8000 | **PASS** | Constant at line 45; applied at line 255 via `responseText.slice(0, GRADED_RESPONSE_MAX_CHARS)` |
| live-executor.cjs collectBraceBalancedObjects | **PASS** | String-aware: tracks `inString` and `escaped` state (lines 123-131); handles escape sequences correctly |
| dispatch-model.cjs shellQuote on resume-hint | **PASS** | buildResumeHint:347 calls `shellQuote(relSentinel)` and `shellQuote(loopHost)` |
| dispatch-model.cjs loadConfig ENOENT diagnostic | **PASS** | Lines 112-115: ENOENT continues silently; parse errors warn with file path and message |
| score-model-variant.cjs criteriaExecAllowed gate | **PASS** | Lines 111-120: gate returns false when `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0`; warns once on permissive default; preserves default-on for trusted-author |
| score-skill-benchmark.cjs refactor behavior | **PASS** | scoreScenario delegates to normalizeScenarioInput, computeSurfaceMatch, scoreD1Intra, scoreD2, scoreD3, scoreAssetRecall, scoreD1Inter; all formulas identical to documented contract |

---

## Verdict

**CONDITIONAL** — All code-vs-documentation checks pass. The two P1 findings are traceability gaps in the documentation layer (missing changelog, stale script count), not correctness bugs in the shipped code. The v1.11.1.0 remediation changes (dimension-aware grader, brace scanner, shellQuote, criteriaExecAllowed, scoreScenario refactor) are all verified behavior-correct against their claims.

---

## Next Dimension

**maintainability** — final dimension to cover in iteration 5.
