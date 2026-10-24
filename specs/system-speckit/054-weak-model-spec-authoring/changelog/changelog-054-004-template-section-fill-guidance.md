---
title: "Changelog: Phase 4: template-section-fill-guidance [054-weak-model-spec-authoring/004-template-section-fill-guidance]"
description: "Chronological changelog for the Phase 4: template-section-fill-guidance phase."
trigger_phrases:
  - "weak model spec authoring template section fill guidance changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-24

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance` (Level 3)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Every `## ` section in the four core templates now carries one `<!-- FILL: ... -->` line with a good and a weak example about the `--quiet` flag, and so does every content section in the ten addon templates. Seven anchor placements that crossed a level gate are repaired, 14 hand-written examples are aligned with the template contract, and two guards stop the result from drifting.

### Added

- A fill line in each core template section: spec 24, plan 18, tasks 22, implementation-summary 6. Each gives one instruction plus a good and a weak example about the `--quiet` flag.
- A fill line in each content section of the ten addon templates, 61 in all (research 20, resource-map 11).
- `runtime/cli/spec/check-example-drift.sh`, a read-only guard that fails when a rendered example drifts from the template anchors or holds an HTML comment tail in its description.
- `runtime/cli/tests/example-drift.vitest.ts`, which runs the guard inside the suite.
- `runtime/cli/tests/template-fill-guidance.vitest.ts`, 16 renders that require one fill line per section and pin the anchor counts.

### Changed

- 14 hand-written examples now match the template anchor contract. The Level 3 spec example drops the `risk-matrix` and `user-stories` anchors, which resolves phase 001 ledger rows L-A-015 and L-A-016.
- The scaffold golden snapshot is regenerated for the new fill lines. A mutation probe proved it still catches a render change.
- Plan rows B01, B02 and B21 follow the review fix.

### Fixed

- Four spec template anchors that crossed a level gate: `nfr`, `edge-cases` and the two `questions` placements.
- Three research addon anchors that crossed a level gate: `core-architecture`, `changelog-updates` and `integration-patterns`.
- Review P1: the Level 2 enhanced rollback fill line now says to delete the section when the packet ships no deployable service. Review P2: both non-functional requirements fill lines now offer deleting the section.

### Verification

- Strict validation of this phase folder - RESULT: PASSED
- Fill test, 16 renders - Tests 16 passed (16)
- Golden snapshots - Tests 12 passed (12) without -u, mutation probe 1 failed and 11 passed (12)
- Example drift guard - EXAMPLE_DRIFT_OK, wrapper Tests 1 passed (1)
- Anchor counts - diff of the 16-line baseline and after files printed nothing
- Crossing command - Printed nothing on every .tmpl
- Full suite - Start and end both exit=0. The second vitest run grew from 2067 to 2084 tests (17 added) and from 181 to 183 files. The first run is unchanged at 4162 tests
- Frontier review - 9 lines: 1 P1 and 1 P2 fixed, 7 P2 recorded in goal.md section 4

### Files Changed

| File | Action | What changed |
|---|---|---|
| `templates/core/*.md.tmpl (4)` | Modified | 70 fill lines and four spec anchor repairs |
| `templates/addons/*.md.tmpl (10)` | Modified | 61 fill lines and three research anchor repairs |
| `templates/examples/level-*/*.md (14)` | Modified | Anchors aligned, content kept |
| `runtime/cli/spec/check-example-drift.sh` | Created | Read-only example drift guard |
| `runtime/cli/tests/example-drift.vitest.ts` | Created | Wires the guard into the suite |
| `runtime/cli/tests/template-fill-guidance.vitest.ts` | Created | 16 renders, one fill line per section, anchor counts pinned |
| `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modified | Regenerated with -u after the template edits |
| `spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, implementation-summary.md` | Modified | Plan rows B01, B02 and B21 follow the review fix, the rest records evidence |

### Follow-Ups

- One fill line per section, not per hint. A section with eight tokens has one governing instruction. The tokens stay field-level prompts.
- The drift guard checks anchors and descriptions, not prose quality. The frontier review read the prose at phase close.
- The packet types are out of scope. templates/packet-types serves research and review packets and keeps its current guidance.
- Only five sections carry the delete option. The contract marks 20 or more optional anchors. The review's six other P2 lines and the out of order sections in the Level 3+ implementation summary example are open for the operator.
- A leftover fill comment is not a placeholder. The gate does not count it, so a filled document can still carry the line.
