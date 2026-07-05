# Iteration 5 — Correctness Deep Pass: Onboarding Kit

## Dimension
correctness (deep pass 2: the onboarding kit)

## Files Reviewed
- `scripts/non-dev-ai-system/init_packaging.py:1-382`
- `assets/non_dev_ai_system/templates/deterministic_lint.py.template:1-84`
- `assets/non_dev_ai_system/templates/gauntlet.py.template:1-219`
- `assets/non_dev_ai_system/templates/regrade.py.template:1-110`
- `assets/non_dev_ai_system/templates/loop.py.template:1-605`
- `assets/non_dev_ai_system/templates/gates.py.template:1-103`
- `assets/non_dev_ai_system/templates/derive.py.template:1-92`
- `assets/non_dev_ai_system/templates/run.sh.template:1-38`
- `assets/non_dev_ai_system/packaging_config.example.json:1-231`
- `assets/non_dev_ai_system/packaging_config.schema.json:1-269`
- `Barter/Copywriter/benchmark/grader/hvr_lint.py:1-100` (live reference)
- `Barter/Copywriter/_loop/gauntlet.py:1-168` (live reference)
- `Barter/Copywriter/benchmark/grader/regrade.py:1-108` (live reference)
- `Barter/Copywriter/_gates/gates.py:1-110` (live reference)
- `Barter/Copywriter/_gates/derive.py:1-124` (live reference)

## Findings by Severity

### P0 (Blockers)
(none)

### P1 (Required)
(none)

### P2 (Suggestions)

#### R5-P2-001: deterministic_lint.py.template applies re.I uniformly vs selective in live hvr_lint.py
- **File**: `templates/deterministic_lint.py.template:60`
- **Description**: The template's `lint()` function applies `re.I` (case-insensitive) to ALL patterns in the PATTERNS loop: `re.compile(entry["regex"], re.I)`. The live hvr_lint.py selectively applies `re.I` per pattern — notably, `non_eur_currency` does NOT use `re.I`. This means the template version would match lowercase currency codes ("usd", "gbp") while the live version only matches uppercase. The `semicolon` and `em_dash` patterns are also affected (though semicolon is case-irrelevant).
- **Impact**: Behavioral divergence between template-rendered and live lint. A packaging rendered from the template would flag lowercase currency codes that the proven Copywriter linter would pass.
- **Severity**: P2 (advisory — the template is more strict, not less; but it's a behavioral surprise for packagers who expect Copywriter-identical behavior)

#### R5-P2-002: gauntlet.py.template A5 threshold is >= 2 vs live >= 3
- **File**: `templates/gauntlet.py.template:95-96`
- **Description**: The template's A5 check is `d["hard_violations"] >= 2` while the live gauntlet.py (line 109) uses `>= 3`. The test string `"Reach influencers — leverage our platform; sign up."` produces 4 hard violations (influencers, em_dash, leverage, semicolon), so both thresholds pass. However, the template is less strict — it would accept a gauntlet run with only 2 violations where the live version expects 3+.
- **Impact**: If a future packaging reduces the lexicon (e.g., removes "leverage" from AI_VOCAB), the template gauntlet would still pass with 2 violations while the live Copywriter gauntlet would fail with < 3. This weakens the regression gate.
- **Severity**: P2 (advisory — threshold mismatch doesn't affect current Copywriter but would affect future packagings with smaller lexicons)

#### R5-P2-003: regrade.py.template rubric() includes ALL frozen files vs live's MEQT-only subset
- **File**: `templates/regrade.py.template:50-52`
- **Description**: The template's `rubric()` function uses `sorted(os.listdir(GATES))` to include ALL `.frozen.md` files in the grader rubric. The live regrade.py (line 49-50) hardcodes only `("meqt_system_prompt_s6.frozen.md", "meqt_depth_s4.frozen.md")` — it excludes `human_voice_rules.frozen.md`. The template would include HVR rules in the grader prompt, changing the grading criteria.
- **Impact**: The template-rendered regrade.py feeds a different rubric to the grader model than the proven Copywriter version. This could produce different independent scores for the same deliverable, breaking score comparability with the Copywriter baseline.
- **Severity**: P2 (advisory — the template's approach is arguably more correct (grader should see HVR rules), but it's a behavioral divergence from the proven instance)

#### R5-P2-004: init_packaging.py doesn't validate benchmark_variant_preludes keys against fixtures.variants
- **File**: `scripts/non-dev-ai-system/init_packaging.py:43`
- **Description**: `validate_config()` checks that `harness.benchmark_mode_instructions` is a non-empty object and that `fixtures.variants` is a non-empty array, but does NOT validate that `harness.benchmark_variant_preludes` keys (when present) are a subset of `fixtures.variants`. If a prelude key doesn't match any variant, it's silently ignored; if a variant has a prelude in `benchmark_mode_instructions` but not in `benchmark_variant_preludes`, the rendered run.sh may produce incorrect shell (the case statement would have no prelude for that variant).
- **Impact**: A misconfigured prelude/variant mapping would produce syntactically valid but semantically wrong shell code. The `variant_cases` builder (lines 164-177) iterates `fixtures["variants"]` and looks up preludes, so missing preludes default to empty string — this is safe. But extra prelude keys are dead config.
- **Severity**: P2 (advisory — the current behavior is safe due to `.get()` defaults, but the schema should enforce the subset relationship)

#### R5-P2-005: gauntlet.py.template A1/A2/A8 use generic file-walking vs live's hardcoded paths
- **File**: `templates/gauntlet.py.template:146-216`
- **Description**: The template's `_gauntlet_a1()`, `_gauntlet_a2()`, and `_gauntlet_a8()` helpers use generic file-walking logic (walk MANIFEST.json or knowledge base directory) to find files to mutate. The live gauntlet.py hardcodes specific file paths (e.g., `knowledge base/system/Copywriter - System - Prompt - v0.904.md` for A1). The template helpers are more robust (they work for any packaging), but they may mutate different files than intended — e.g., A1 might mutate a non-scoring doc if the MANIFEST.json is missing.
- **Impact**: The template gauntlet tests a different attack surface than the live version. If the MANIFEST.json is missing, A1 falls back to the first .md file in knowledge base/, which might not be a frozen scoring surface. This could produce a false-positive gauntlet pass (the attack mutates a non-critical file, and the guard correctly allows it).
- **Severity**: P2 (advisory — the template's approach is more general but less precise; the live version's hardcoded paths are Copywriter-specific but test the exact attack surface)

#### R5-P2-006: init_packaging.py partial-write on failure lacks atomicity
- **File**: `scripts/non-dev-ai-system/init_packaging.py:243-263`
- **Description**: `render_all()` writes files sequentially. If an exception occurs mid-way (e.g., disk full, permission error), some files will be written and others won't. There's no transactional mechanism or rollback. The `verify_render()` at the end catches compile errors, but if the process is killed (SIGKILL), the packaging is left in a partially rendered state.
- **Impact**: A partially rendered packaging would have some template files and some missing/old files. The `verify_render()` check would catch missing .py files, but non-.py files (run.sh, grader_prompt.md) wouldn't be verified. Re-running `init_packaging.py` would fix the state (idempotent overwrite), but the user might not know they need to re-run.
- **Severity**: P2 (advisory — idempotent re-run fixes the issue, but the lack of atomicity is a robustness gap)

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Template placeholder completeness | PASS | All 28 {{KEY}} tokens in 9 templates are produced by build_placeholders() (verified iter 4) |
| Schema-required vs consumed | PASS | 14 required fields map to consumed tokens; 3 dead fields identified (R4-P2-003) |
| Template behavioral equivalence | PARTIAL | R5-P2-001 (re.I), R5-P2-002 (threshold), R5-P2-003 (rubric scope) show divergence |
| Idempotency | PASS | render_all() overwrites; write_gitignore() merges; re-run is safe |
| --check-only path | PASS | Renders to temp dir, verifies, does not touch destination |
| Edge case: missing config fields | PASS | validate_config() checks all 14 required fields + sub-structure validation |
| Edge case: empty fixtures | PASS | validate_config() requires non-empty arrays for visible, held_out, variants |

## Verdict

**PASS-candidate** with `hasAdvisories=true`. All findings are P2 advisories. No P0/P1 issues found in this deep pass. The onboarding kit's core correctness is sound: template rendering produces syntactically valid Python/bash, validation catches missing fields, idempotency holds, and the --check-only path works. The behavioral divergences (R5-P2-001 through R5-P2-003) are documented as template-vs-live differences that packagers should be aware of.

## Next Dimension

All four dimensions are covered. This is a deep pass on correctness (the onboarding kit). No further dimensions remain. The review has converged with 0 P0, 2 P1 (from earlier iterations), and ~24 P2 advisories.
