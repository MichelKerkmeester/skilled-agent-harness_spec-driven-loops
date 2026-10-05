---
title: "Implementation Summary"
description: "One file now holds the contextType and importance_tier lists for spec docs and skill docs, and four checkers read it instead of keeping their own copies."
trigger_phrases:
  - "implementation summary"
  - "shared frontmatter value list"
  - "contextType unification"
  - "frontmatter values warn rule"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/003-context-type-unification"
    last_updated_at: "2026-10-04T10:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the shared list, the warn rule and the checker imports, cleaned 103 outlier docs"
    next_safe_action: "Close AC-006 in the operator-approved commit"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/shared/frontmatter-values.json"
      - ".skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-context-type-unification |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Spec docs and skill docs now take their `contextType` and `importance_tier` values from one file. Before this phase the spec corpus held 33 distinct `contextType` values and four tools kept their own lists. Now it holds 12, every one canonical or a listed alias, and a value outside the file draws a warning that names the values to use.

### Phase 3: context-type-unification

`shared/frontmatter-values.json` holds two named lists, following D1. The document list has the four canonical values and their aliases, such as `review` for `research`. The session list keeps the 11 values a save payload uses, because those drive project phase, importance tier and memory type in the CLI. The tier list has the six tiers plus aliases such as `high`.

Four readers import it. The spec-kit CLI imports it through `context-types.ts`. The new `FRONTMATTER_VALUES` rule reads it at warn severity. sk-doc's `validate_document.py` warns on it for every doc type. The skill-advisor checker keeps its error severity but no longer holds its own list.

When you write a doc, nothing changes unless the value is outside the file. Then the warning says which field, which value, and which canonical values to use instead.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/shared/frontmatter-values.json` | Created | The one list, document and session kinds kept apart |
| `.skilled/skills/system-spec-kit/shared/context-types.ts` | Modified | Derives the canonical list from the JSON and exports the session, alias and tier lists |
| `.skilled/skills/system-spec-kit/shared/tsconfig.json` | Modified | Ships the JSON with the build |
| `.skilled/skills/system-spec-kit/shared/tests/context-types.test.ts` | Modified | Pins the session list, the aliases and the tiers |
| `runtime/cli/utils/input-normalizer.ts`, `runtime/cli/extractors/session-extractor.ts`, `runtime/cli/lib/frontmatter-migration.ts` | Modified | Import the shared lists instead of literal copies |
| `runtime/cli/tests/phase-status-from-payload.vitest.ts` | Modified | Pins the project phase for `planning`, `debugging` and `decision` sessions; the existing case covers `review` |
| `runtime/cli/rules/check-frontmatter-values.sh`, `check-frontmatter-values-helper.cjs` | Created | The warn rule and the parser it calls |
| `runtime/cli/lib/validator-registry.json` | Modified | Registers `FRONTMATTER_VALUES` at warn severity |
| `.skilled/skills/system-spec-kit/README.md`, `ARCHITECTURE.md` | Modified | The registry count goes from 40 to 41 rules, which a CLI test enforces |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | Warns on a value outside the list |
| `.skilled/skills/sk-doc/scripts/tests/test_frontmatter_values.py` | Created | Seven cases, including a checkout without the list |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modified | Says aliases are legal and where the list lives |
| `.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs` | Modified | Reads the shared list |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-doc-frontmatter-checker.vitest.ts` | Created | An alias passes, an outside value fails |
| 103 spec docs in 58 packets | Modified | Outlier values mapped to canonical ones, then derived metadata repaired |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines came first: the CLI suite, the advisor suite, the `shared` tests and the advisor `--coverage` run. Then the shared file and its readers, then the rule. The rule shipped only after the cleanup, so on the day it lands it prints zero warnings. `scratch/cleanup.py` mapped each outlier to a canonical value and ran `repair-derived.cjs` on every touched packet. The mapping is recorded in `scratch/cleanup-report.json`.

The sweep ran the rule's own parser over every packet doc and skill doc, archives excluded as in the phase 002 census. It found 102 warnings before the cleanup (`scratch/sweep-before.tsv`) and 0 after (`scratch/sweep-after.tsv`). The generators were checked the same way: 96 templates and assets, 89 carrying `contextType`, 0 warnings, so none needed a change.

Nothing is committed (root decision D4).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the document list and the session list apart in one file | A save payload's `contextType` classifies the session and drives phase, tier and memory type. Folding the two would change CLI behavior for `debugging` and `decision` |
| The advisor checker keeps error severity | D4 says so: it already gates CI on skill docs, so only its source of values changed, and its `--coverage` result stayed at 101 docs and 0 violations |
| Leave the advisor's tier weights alone | They decide ranking; an alias such as `high` would move results if weighted, so ranking stays exactly as before |
| No version hand-set on the edited skill doc | The fourth digit counts commits that touched the file, and `frontmatter-version.mjs apply` runs in the same commit as the change (`frontmatter-versioning.md` §4). A hand-set value would be stale when the commit lands |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `shared` tests | PASS, 18/18 |
| sk-doc `test_frontmatter_values.py` | PASS, 7/7 |
| Advisor suite | PASS, 1084 passed and 6 skipped, against a baseline of 1082 and 6. The delta is the two new checker tests |
| Advisor `--coverage` | PASS, 101 docs and 0 violations, same as the baseline |
| CLI suite | PASS, vitest 1648 passed and 19 skipped, same as the baseline. The legacy and validation legs print the same 39 summary lines (`scratch/cli-summary-baseline.txt`, `scratch/cli-summary-after.txt`). The first rerun failed one test, which caught the README's 40-rule claim, so that claim and `ARCHITECTURE.md` now say 41 |
| CLI behavior probe on the built `dist` | PASS. Three new phase cases pass, and two of them fail when the normalizer is pointed at the document list, so they catch a merge of the two lists. Every value in the HEAD lists behaves as before in the normalizer and the session extractor, with one recorded deviation, below |
| Warn, never error, on a planted value | PASS. A copy of a plan with `contextType: "architecture"`: the rule returns `warn` with the message naming the four canonical values. `validate_document.py` adds exactly one `frontmatter_value_outside_list` warning, and its exit code and blocking errors are identical to the unplanted original |
| Spec-doc distinct `contextType` | 33 before, 12 after, all canonical or listed aliases |
| Corpus sweep | 102 warnings before, 0 after |
| Packet results, D1 | PASS. Each of the 58 edited packets was validated on its own with its HEAD content and again with the edits, folder by folder: 191 folders, 0 changed sets of failing or warning rules (`scratch/d1-proof.json`, `scratch/d1_proof.py`). `FRONTMATTER_VALUES` is left out because it is the rule under test |
| `/doctor:skill-graph-freshness` | PASS, no drift on any axis |
| `/doctor:skill-advisor` read-only commands | `skill_graph_validate` valid with 0 errors. Its 14 warnings are all the existing `sanitizer_version` class, and no skill `graph-metadata.json` changed. `advisor_status` is live with 14 skills |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The normalizer now accepts `discovery`.** Its old literal list had 10 values and the session extractor's had 11. Both now read the 11-value session list, so a save payload with `discovery` passes input validation where it failed before. No other value changed.
2. **Archived packets are not swept.** `z_archive` folders still hold 25 distinct off-list values. The census and the sweep leave archives out by design, and the rule never runs on an archived packet unless someone validates it directly.
3. **Repairs refreshed other derived fields.** Running `repair-derived.cjs` on the 58 packets also refreshed stale derived fields in their `graph-metadata.json`, such as old `.opencode` paths. Those changes come from the repair tool, not from the mapping.
4. **Two parent packets were already failing.** `026-…/001-release-readiness/002-release-readiness-deep-review-audits` and `026-…/004-followup-post-program/003-post-program-quality-pass` fail `SPEC_DOC_INTEGRITY` on links to child `checklist.md` files that an earlier commit retired. They fail the same way at HEAD. `cleanup.py` first recorded them as passing because it read the last `RESULT:` line, which for a phase parent is its final child's. The script now reads the first line, and the D1 row above replaces that measurement.
5. **Each edited doc's own version waits for the commit.** Phase 007 wrote the skill changelogs and bumped each skill's `SKILL.md` version. The fourth digit of an edited doc's version, such as `frontmatter-templates.md`, counts the commits that changed it, so `frontmatter-version.mjs apply` can only raise it in the commit that carries this change.
<!-- /ANCHOR:limitations -->

---
