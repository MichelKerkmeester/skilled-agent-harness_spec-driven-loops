---
title: "Checklist: Deep-Review Remediation"
description: "Acceptance checks for the in-scope P0 fixes, the routed findings, and the staged validator hardening."
importance_tier: "high"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/011-review-remediation"
    last_updated_at: "2026-07-22T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Verified the in-scope P0 fixes on disk."
    next_safe_action: "Baseline the validator corpus before T006."
    blockers: []
    key_files: []
---

# Checklist: Deep-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:quality -->
## Quality

- [x] [P1] Zero NUL bytes across every changed markdown file
  - Evidence: `tr -dc '\000'` over the whole diff returns empty; both files went 2 -> 0 NUL.
- [x] [P1] The two restored headers keep uppercased prose plus the original code span
  - Evidence: `## 6. COLOUR NAMING (`` `## Tokens — Colors` ``)`; `## 2. TRANSPORT (direct API — opencode `` `--file` `` is broken here)`.
- [x] [P1] The named non-runnable commands run from one documented directory
  - Evidence: `create-skill/README.md` paths are repo-root-relative; `npx vitest run tests/import-policy-rules.vitest.ts` executes.

<!-- /ANCHOR:quality -->
---

<!-- ANCHOR:scope -->
## Scope

- [x] [P1] Out-of-scope findings routed, not fixed on this branch
  - Evidence: the 1,290 style-catalog links are sk-design's `library/bundles/` restructure (commit `a4b492c6` changed 0 link rows); F2 "missing overview" is pre-existing; import-policy test failures are runtime code.
- [x] [P2] The validator hardening is staged, not rushed
  - Evidence: `T006` deferred behind a corpus baseline because `is_uppercase_section` gates every document.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:signoff -->
## Sign-off

- [x] In-scope P0 blockers fixed and verified
- [ ] Validator hardening (T006) landed with tests and a clean corpus re-run
- [x] Parent packet re-validates and the branch state is recorded

<!-- /ANCHOR:signoff -->
