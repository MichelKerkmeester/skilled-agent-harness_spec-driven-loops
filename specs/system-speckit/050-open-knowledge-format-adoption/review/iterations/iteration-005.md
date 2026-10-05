# Deep Review Iteration 5

## Dimension

Maintainability: compare the four frontmatter-value readers for case normalization, alias acceptance, and test coverage.

## Files Reviewed

- .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json:7,19
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:34,59
- .skilled/skills/sk-doc/shared/scripts/validate_document.py:1638-1640
- .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:72-81,137-145
- .skilled/skills/system-spec-kit/shared/context-types.ts:75-76,97-111
- .skilled/skills/system-spec-kit/runtime/cli/tests/check-frontmatter-values.vitest.ts:39-47
- .skilled/skills/sk-code/sk-code-review/references/review-core.md

The Python validator test, skill-doc checker test, and shared context-types test were not opened; their coverage is deferred. The prior dispatch failure record was read only to recover iteration metadata.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R5-P2-001 — Skill-doc checker applies case-sensitive frontmatter matching

- File: .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:139
- Evidence: cleanScalar trims and removes quotes but preserves case at lines 72-81. validateBlock checks the raw contextType and importance_tier values against sets at lines 137-145. The helper lowercases values at line 59, validate_document.py lowercases at line 1638, and resolveCanonicalContextType lowercases canonical and legacy alias inputs at line 107. Therefore mixed-case canonical values can be rejected by the skill-doc checker while accepted by the other lowercasing paths. The inspected helper test also accepts mixed-case Review and high aliases at lines 40-45.
- Impact: a mixed-case canonical value such as Implementation can pass the packet rule, Python validator, and context resolver but fail the skill-doc checker. Listed non-legacy aliases also differ between the lowercasing validators and the case-sensitive skill-doc checker.
- Finding class: cross-consumer.
- Recommendation: normalize case before the skill-doc checker performs canonical and alias membership checks, and add parity tests for mixed-case canonical and alias values.
- Confidence: high. The other three checker-specific test suites were not inspected, so test parity beyond the checked helper remains unknown.

## Traceability Checks

- Core spec-code and checklist-evidence checks: deferred; acceptance criteria were not reopened in this reduced-scope pass.
- Alias handling: ruled out as a distinct parity defect. The three validation sets include keys from the shared alias maps; context-types keeps general document aliases separate from the narrower legacy migration map.
- Test coverage: the inspected helper suite pins case-insensitive alias acceptance. The Python, skill-doc, and context-types checker suites remain deferred; this pass makes no claim that those suites lack coverage.
- Graph and semantic search: unavailable or unused; review used direct source reads and exact text searches.

## Verdict

PASS: this iteration found no P0 or P1 issues. One P2 advisory is recorded.

## Next Dimension

None; this was iteration 5 of 5.

Review verdict: PASS
