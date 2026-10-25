---
title: "Changelog: Phase 3: versioned-placeholder-gate [054-weak-model-spec-authoring/003-versioned-placeholder-gate]"
description: "Chronological changelog for the Phase 3: versioned-placeholder-gate phase."
trigger_phrases:
  - "weak model spec authoring versioned placeholder gate changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-24

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate` (Level 3)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

An unfilled template hint now fails strict validation once a new packet leaves Draft, and only warns while it is Draft. Older packets keep the verdict they had.

### Added

- The five core templates now hold 217 `[YOUR_VALUE_HERE: ...]` tokens in place of bare bracketed hints, and their stamps read v2.3.
- A lifecycle in the orchestrator and in the shell rule: a v2.3 doc warns on an unfilled token while `spec.md` is Draft and errors at any other status.
- `placeholder-token-gate.vitest.ts`, five tests: four pinned cells and a parity check between the orchestrator and the shell rule.
- A lifecycle section in the validation rules reference.

### Changed

- Five manifest entries moved to v2.3.
- Two existing tests and the scaffold snapshot moved to the v2.3 stamp.
- A doc with an older stamp keeps the error it always had, and `[NEEDS CLARIFICATION:` is an error everywhere.

### Fixed

- The angle-bracket form of the token is deferred the same way in both checkers. The orchestrator matched it and the shell rule did not, so a Draft doc used to warn in one and pass silently in the other.
- The repo era report counts only stamps older than v2.2 as legacy, so the manifest bump no longer inflates the pre-v4 count.

### Verification

- Strict validation of this phase folder: RESULT: PASSED
- Failing test first, then green after the code change, and three scripted breaks turned it red again
- Census over 4688 folders: 4496 PASS and 192 FAIL before and after, identical per folder
- Suite: matching counts plus the new test, exit=0
- Review: 1 finding, applied

### Files Changed

| File | Action | What changed |
|---|---|---|
| `templates/core/*.tmpl` (4) and `templates/addons/acceptance-criteria.md.tmpl` | Modified | Hints converted to tokens, stamped v2.3 |
| `templates/spec-kit-docs.json` | Modified | Five manifest entries moved to v2.3 |
| `runtime/lib/validation/orchestrator.ts` | Modified | Stamp and Draft lifecycle in the placeholder check |
| `runtime/cli/rules/check-placeholders.sh` | Modified | The same lifecycle in the shell rule |
| `runtime/cli/tests/placeholder-token-gate.vitest.ts` | Created | Five gate tests |
| `references/templates/template-guide.md, references/validation/validation-rules.md` | Modified | Guide corrected, lifecycle section added |

### Follow-Ups

- The post-edit scanner misses a hint inside a fenced block and a token with a colon. This phase records both and fixes neither.
- `upgrade-level.sh` copies tokens into older docs, so a v2.2 doc that gains a template section then holds tokens that error.
- `README.md` and the template mapping asset still say `[PLACEHOLDER]` and are left to the documentation phase.
