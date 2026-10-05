---
title: "Implementation Summary"
description: "The four P2 findings from packet 050's deep review are fixed, each pinned by a test that fails on the old code: the cutoff needs a real day, the value readers ignore YAML comments and case, and the census reads newline paths one by one."
trigger_phrases:
  - "050 review remediation summary"
  - "frontmatter value comment fix"
  - "cutoff date fix"
  - "census newline fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/012-review-remediation"
    last_updated_at: "2026-10-05T15:53:18Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed four review findings, each pinned by a fail-before test"
    next_safe_action: "Run strict validation, then commit and push the phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs"
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs"
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
    session_dedup:
      fingerprint: "sha256:bde682abfc70496b33125537adbe61797f1e77eb729d1bf52b329b983624a959"
      session_id: "scaffold-012-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-review-remediation |
| **Completed** | 2026-10-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet's deep review left four P2 advisories, and all four are fixed. The four readers of the shared value list now agree on what a `contextType` or `importance_tier` value is. The two inputs the review named can no longer skew a result without a word.

### Phase 12: review-remediation

A cutoff such as `9999-99-99` used to pass the date-shape check and, because the comparison is lexical, quietly turned the source-tag rule off. You now get the default cutoff and the existing note instead. A frontmatter line like `contextType: planning # why` used to read as `planning # why` and warn as outside the list. All three readers that parse it now read `planning`. The skill-doc checker also folds case, so `Planning` passes there as it already did everywhere else. A tracked document whose name holds a line feed used to throw off the census's batched read and file later documents under the wrong path. It now reads on its own.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` | Modified | `cutoffDate` requires a real calendar day |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs` | Modified | `scalarValue` drops a YAML inline comment |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | `_frontmatter_scalar` applies the same rule |
| `.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs` | Modified | `enumScalar` drops the comment and folds case for the two shared-list fields |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modified | Line-feed paths skip the batch read |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts` | Modified | Impossible-date case |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-frontmatter-values.vitest.ts` | Modified | Inline-comment case |
| `.skilled/skills/sk-doc/scripts/tests/test_frontmatter_values.py` | Modified | Inline-comment case |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-doc-frontmatter-checker.vitest.ts` | Modified | Mixed-case and inline-comment case |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Modified | Line-feed file name case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix sits where the review pointed, and each comes with one new test. To show that every test catches its defect, the five source files were swapped back to their committed versions with the new tests kept. Every new test failed, and every one passed again once the fixes were restored. The restored files were compared byte for byte with the fixed copies. The skill-doc checker then ran over the real tree with the old and the new code, and gave the same answer in both modes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Strip comments only from the two shared-list fields in the skill-doc checker | No finding covers titles or descriptions, and a description such as `Fix issue #12` would lose its tail if ` #` were cut there |
| Write the scalar rule once per reader rather than share one module | The readers are Python, ESM and CommonJS. One shared helper would add a cross-runtime import for a two-line rule |
| Route line-feed paths to the existing per-path read rather than parse replies by object id | `readCommittedText` already passes the path as one `git show` argument, so a filter fixes the framing with no new parser |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New tests against the pre-fix source | FAIL as intended: vitest 2 of 22 and 1 of 3, Python 7/8, census 63/64 |
| Same tests against the fix | PASS: vitest 22/22 and 3/3, Python 8/8, census 64/64 |
| Skill-doc checker on the real tree, old vs new | Same: `docs=101 violations=0` in `--shape` and `--coverage` |
| Every sk-doc Python suite | PASS, 33 of 33. The rename fixture harness failed once while docs were being written into the worktree it snapshots, then passed on a quiet rerun |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Search debt stays open.** The review's unreplayed measurements, the redirect-table audit and a cross-reader parity suite are review work, outside this phase.
<!-- /ANCHOR:limitations -->

---
