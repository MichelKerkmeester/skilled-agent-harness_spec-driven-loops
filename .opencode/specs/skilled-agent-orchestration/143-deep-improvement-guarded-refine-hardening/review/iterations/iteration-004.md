# Deep Review — Iteration 4

## Dimension

maintainability (template/instance divergence, duplication, naming, change cost)

## Files Reviewed

- `scripts/non-dev-ai-system/init_packaging.py:1-382`
- `assets/non_dev_ai_system/packaging_config.schema.json:1-269`
- `assets/non_dev_ai_system/packaging_config.example.json:1-231`
- `assets/non_dev_ai_system/templates/*.template` (all 9)
- `scripts/shared/loop-host.cjs:1-330`
- `scripts/shared/model-family.cjs:1-82`
- `scripts/shared/extract-deliverable.cjs:1-37`
- `scripts/shared/fixture-lint.cjs:1-83`
- `scripts/shared/promote-candidate.cjs:1-386`
- `scripts/non-dev-ai-system/run-non-dev-ai-system.cjs:1-96`
- `Barter/Copywriter/_loop/loop.py:1-80`
- `Barter/Copywriter/_gates/gates.py:1-80`
- `Barter/Barter deals/_loop/loop.py:1-80`

## MANDATORY RECOVERY: R3-P1-001 Claim Adjudication

```json
{
  "claim": "init_packaging.py has schema validation gaps: harness sub-fields consumed by templates but not required by the schema or validated by init_packaging.py",
  "evidenceRefs": [
    "assets/non_dev_ai_system/packaging_config.schema.json:188-220",
    "scripts/non-dev-ai-system/init_packaging.py:109-111",
    "scripts/non-dev-ai-system/init_packaging.py:166-167",
    "assets/non_dev_ai_system/templates/run.sh.template:20"
  ],
  "counterevidenceSought": "Are the optional harness sub-fields actually consumed by templates in a way that breaks rendering when absent?",
  "alternativeExplanation": "The only harness-derived placeholder consumed by templates is {{BENCHMARK_VARIANT_CASES}} (run.sh.template:20), which is built from benchmark_mode_instructions (required + validated) and benchmark_variant_preludes (optional, .get() with {} default). When absent, variant_cases_lines produces valid bash with no prelude lines. The schema's ci_compact_path, ci_full_path, skill_dir_name fields are NEVER consumed by any template or init_packaging.py — they are dead config. The {{CI_PATH}} and {{SKILL_DIR}} tokens referenced in schema comments (line 195) appear only inside benchmark_mode_instructions strings that are shell-expanded at RUNTIME, not scaffolding-time placeholders. No template breaks when optional harness sub-fields are absent.",
  "finalSeverity": "P2",
  "confidence": 0.90,
  "downgradeTrigger": "benchmark_variant_preludes .get() fallback produces valid (empty) bash; ci_compact_path/ci_full_path/skill_dir_name are dead config never consumed by templates or scaffolder"
}
```

**Downgrade rationale:** The original P1 claim was that templates consume harness sub-fields the schema doesn't require. Concrete analysis shows:
1. `benchmark_variant_preludes` — optional, `.get()` fallback renders valid empty case statements.
2. `ci_compact_path`, `ci_full_path`, `skill_dir_name` — defined in schema, present in example, but **zero templates or init_packaging.py code consume them**. Dead config, not a validation gap.
3. The `{{CI_PATH}}` and `{{SKILL_DIR}}` tokens in schema docs (line 195) are shell-level `$CI`/`$skill_dir` expansions inside benchmark_mode_instructions text, not `{{KEY}}` scaffolding placeholders. `init_packaging.py` only replaces `{{CW}}`→`$CW` in those strings (line 172).

**Remaining gap (now P2):** No type validation on optional harness sub-fields. If `benchmark_variant_preludes` were a string instead of a dict, `init_packaging.py` would not catch it at validation time — the `.get()` on a string would raise AttributeError during build_placeholders. Downgraded because: (a) the schema documents the correct type, (b) the example shows the correct shape, (c) the failure mode is an immediate Python traceback at scaffolding time, not silent data corruption.

## Findings by Severity

### P0 (Critical)

(none new)

### P1 (Major)

(none new — R3-P1-001 downgraded to P2)

### P2 (Minor)

**R4-P2-001: Template-instance divergence — live instances drifted 100+ lines from templates**
- File: `Barter/Copywriter/_loop/loop.py:1-621` vs `templates/loop.py.template`
- The 9 templates are frozen snapshots of the initial Copywriter implementation. The live Copywriter instance has since gained: empty-region freeze guard (gates.py:67-69), TOCTOU lock improvements, additional journal events, and polish changes. The Barter deals instance was copy-pasted from the live Copywriter (not from templates) and diverged further with different dimensions/fixtures. Neither instance can be regenerated from templates without losing their improvements. A third packaging would get the stale template version, missing all post-scaffolding hardening.
- Dimension: maintainability

**R4-P2-002: Near-identical duplication across Copywriter and Barter deals loop.py**
- Files: `Barter/Copywriter/_loop/loop.py`, `Barter/Barter deals/_loop/loop.py`
- Both loop.py files are 620+ lines with identical structure: KillSwitch class, sh(), journal(), acquire_lock(), make_worktree(), preflight gates, benchmark dispatch, re-grade, analyze_gap, propose, guarded_promote_n, convergence check, main(). Only ~30 lines differ (CW path, fixtures, dimensions, DIM_TO_DOC). Same duplication exists in gates.py, derive.py, regrade.py, gauntlet.py, and run.sh. This means every bug fix or improvement must be applied twice, and the two instances have already drifted (deals gates.py still says "Copywriter" in its docstring — R1-P2-001).
- Dimension: maintainability

**R4-P2-003: Dead schema fields — ci_compact_path, ci_full_path, skill_dir_name never consumed**
- File: `assets/non_dev_ai_system/packaging_config.schema.json:208-219`
- Three harness sub-fields are defined in the schema, documented with {{CI_PATH}}/{{SKILL_DIR}} token references, and populated in the example config — but no template or init_packaging.py code ever reads them. The tokens mentioned in the schema docs are shell-level runtime expansions inside benchmark_mode_instructions strings, not scaffolding placeholders. This misleads packaging authors into thinking these fields are functional.
- Dimension: maintainability

**R4-P2-004: Schema docs reference phantom scaffolding tokens {{CI_PATH}} and {{SKILL_DIR}}**
- File: `assets/non_dev_ai_system/packaging_config.schema.json:195`
- The benchmark_mode_instructions description says "May contain {{CW}} (replaced with $CW), {{CI_PATH}} (replaced with full CI load command), {{SKILL_DIR}} (replaced with $skill_dir)." Only {{CW}}→$CW replacement actually happens in init_packaging.py (line 172). {{CI_PATH}} and {{SKILL_DIR}} are never replaced by the scaffolder — they are implicit shell-variable conventions inside the instruction text, not template tokens. The docs conflate two different replacement mechanisms.
- Dimension: maintainability

**R4-P2-005: Stale docstring in Barter deals gates.py claims "Copywriter"**
- File: `Barter/Barter deals/_gates/gates.py:2`
- Docstring reads "Frozen scoring surface for the Copywriter auto-refine loop" — should say "Barter deals". This is R1-P2-001 re-observed in the maintainability dimension: the copy-paste duplication means stale identifiers persist. Noting here as a maintainability signal (the duplication that causes this class of bug is R4-P2-002).
- Dimension: maintainability (cross-ref: R1-P2-001 correctness)

**R4-P2-006: High change cost for a third packaging**
- Adding a third packaging requires: (1) create packaging_config.json, (2) run scaffolder for stale template output, (3) manually port 100+ lines of live-instance improvements (empty-region guard, lock hardening, additional journal events), (4) verify all 9 rendered files, (5) maintain three near-identical copies going forward. The template/instance divergence means the scaffolder is a starting point, not a reliable generator. Estimated effort: 2-3 hours per new packaging, plus ongoing sync cost.
- Dimension: maintainability

## R3-P2-005 Reconciliation

R3-P2-005 ("Schema does not require harness sub-fields that templates consume") overlaps with the adjudicated R3-P1-001 claim. Per the adjudication above, the concrete analysis shows the templates do NOT break when optional harness sub-fields are absent. R3-P2-001 already covers the dead-schema-fields aspect. R3-P2-005 can be merged into R4-P2-003 (dead schema fields) since the core issue is the same: fields exist in schema but nothing consumes them.

## Traceability Checks

- **Template placeholder audit**: 9 templates consume 28 unique `{{KEY}}` tokens. All 28 are produced by `build_placeholders()`. Schema-required fields map 1:1 to consumed tokens. Three schema fields (ci_compact_path, ci_full_path, skill_dir_name) are NOT consumed — dead config.
- **Init validation vs schema required**: `validate_config()` required list matches schema `required[]` exactly (14 fields). No gap on required fields.
- **Init validation vs template consumption**: All scaffolded placeholders derive from validated-or-defaulted config paths. No template will render broken Python/bash from valid config.

## Verdict

**CONDITIONAL** — P0=0, P1=2 (carried from prior iterations, both active: R1-P1-001 make_worktree, R1-P1-002 readScoreDelta), P2=17 (11 prior + 6 new this iteration). R3-P1-001 adjudicated and downgraded to P2. No new P0/P1. Maintainability dimension now covered.

## Next Dimension

All four dimensions covered (correctness, security, traceability, maintainability). Next iteration should assess convergence: no new P0/P1 across 2 consecutive iterations, coverage age ≥ 1, all dimensions covered. If convergence criteria met, issue PASS verdict with hasAdvisories=true (P2-only remainder).
