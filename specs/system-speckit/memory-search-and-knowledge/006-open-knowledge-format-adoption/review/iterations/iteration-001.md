# Review Iteration 1

## Dimension

Correctness. The pass began with an inventory of the prompt-named code and direct tests, then inspected the citation resolver, source-tag cutoff path, shared-value readers, and the corresponding test cases. This is a complex multi-runtime scope. Review was static; tests were not run.

## Files Reviewed

- `[SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:215]` and `[SOURCE: .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs:198]` — citation extraction/resolution inventory and test-case inventory.
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:60]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:15]`, and `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts:190]` — cutoff, resolver wrapper, and edge-case tests.
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:52]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh:15]`, and `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/check-frontmatter-values.vitest.ts:39]` — enum parsing and warning behavior.
- `[SOURCE: .skilled/skills/system-spec-kit/shared/context-types.ts:34]`, `[SOURCE: .skilled/skills/system-spec-kit/shared/tests/context-types.test.ts:22]`, and `[SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json:2]` — runtime list loading, alias boundaries, and source data.
- `[SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1601]` and `[SOURCE: .skilled/skills/sk-doc/scripts/tests/test_frontmatter_values.py:42]` — Python reader and cases.
- `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:72]` and `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-doc-frontmatter-checker.vitest.ts:59]` — advisor scalar parsing and cases.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R1-P2-001 — Impossible date-shaped cutoff silently skips source-tag validation

`cutoffDate` accepts a ten-character `YYYY-MM-DD` shape without checking calendar validity. `main` then skips packets whose `Created` date compares at or before that string. An override such as `9999-99-99` therefore passes validation and skips every normally dated packet. The existing malformed-override test uses `soon`, which fails the shape check and does not cover this case. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:60] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:314] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts:197]

Recommendation: validate the full override as a real calendar date; on failure, use the default cutoff and report the fallback.

#### R1-P2-002 — Valid YAML inline comments become part of enum values

The advisor checker removes surrounding quotes but retains an inline YAML comment. A valid scalar such as `contextType: planning # rationale` is consequently checked as `planning # rationale` and rejected. The spec-kit helper and Python validator also retain the comment before membership checks, producing a false warning. The current tests do not include this valid YAML form. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:72] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:142] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:57] [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1635]

Recommendation: parse scalar comments using YAML rules, or share a frontmatter scalar parser, so valid comments do not create warnings or checker failures.

## Traceability Checks

- Core `spec_code`: partial. Phase 010 and 011 plans were consulted for the cutoff and shared-list contracts; this pass did not verify every acceptance criterion against the final implementation.
- Core `checklist_evidence`: partial. Phase 011 acceptance criteria were consulted, but their stored evidence was not rerun.
- Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not assessed in this correctness pass; retained for later dimensions.
- Citation resolution for whole spaced paths was reviewed and ruled out as a finding. The source-tag integration test covers whole spaced filenames. The context-type test explicitly pins document aliases separately from the narrower runtime legacy alias set. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts:203] [SOURCE: .skilled/skills/system-spec-kit/shared/tests/context-types.test.ts:33]
- Consumer integration through `input-normalizer.ts`, `session-extractor.ts`, and `frontmatter-migration.ts` remains deferred; the phase 011 plan names those consumers. [SOURCE: specs/system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc/plan.md:66]

New findings ratio: 1.0. This was the first iteration, with no prior findings; both findings are new.

## Verdict

PASS — there are no P0 or P1 findings. Two P2 advisories remain.

## Next Dimension

Security — inspect input boundaries, path refusal, and error handling in the same shipped validator surfaces.

Review verdict: PASS