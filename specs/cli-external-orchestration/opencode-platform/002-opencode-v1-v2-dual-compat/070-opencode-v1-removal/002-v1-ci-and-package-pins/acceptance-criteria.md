---
title: "Acceptance Criteria: Phase 2: v1-ci-and-package-pins"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "v1 ci and package pins acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins"
    last_updated_at: "2026-11-19T09:04:23Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-v1-ci-and-package-pins"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: v1-ci-and-package-pins

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 002-v1-ci-and-package-pins
**Level:** 2
**Status:** Draft
**Date:** 2026-11-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the CI workflow, When its v1-gated step is searched, Then no `if: matrix.family == 'v1'` condition remains and the four suites run unconditionally | `rg -n -F "if: matrix.family == 'v1'" .github/workflows/opencode-dual-version.yml \| wc -l` prints 0, and the step's `node --test` command lists all four files Observed 2026-11-19: the v1 matrix condition count is 0, and the four suites pass in the unconditional step (5, 49, 6 and 14 tests, 0 failed). | Met | - |
| AC-002 | REQ-002 | Given the CI workflow, When the v1 entry, the both-versions job and the old name are searched, Then no match remains | `rg -n -F -e 'family: v1' -e 'Both versions installed' -e 'Dual-Version' .github/workflows/opencode-dual-version.yml \| wc -l` prints 0 Observed 2026-11-19: the count is 0. | Met | - |
| AC-003 | REQ-003 | Given the workflow and the setup helper, When the old v2 pin is searched, Then no match remains and the pin reads 2.3.2 | `rg -n -F '2.3.0' .github/workflows/opencode-dual-version.yml .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh \| wc -l` prints 0 Observed 2026-11-19: the count is 0 in the workflow and the setup helper. | Met | - |
| AC-004 | REQ-004 | Given the two package manifests, When `@opencode-ai/plugin` is searched, Then it is absent, or the recorded usage check shows OpenCode 2 needs it | `rg -l -F '@opencode-ai/plugin' .opencode/package.json .skilled/package.json \| wc -l` prints 0, or `scratch/sdk-usage.txt` records the keep decision Observed 2026-11-19: the count is 0. The usage check in `scratch/sdk-usage.txt` records the removal decision. | Met | - |
| AC-005 | REQ-005 | Given the compat and config-shape tests, When the v1 assertion and the v1 test name are searched, Then neither remains and the compat suite reports no failures | `rg -n -F 'keeps the v1 config shape' .skilled/bin/tests/opencode-config-shape.test.cjs \| wc -l` prints 0, and `node --test .skilled/bin/tests/opencode-compat-layout.test.cjs` prints `# fail 0` Observed 2026-11-19: the v1 test-name count is 0, and the compat suite reports `# tests 20`, `# pass 19`, `# fail 0`. | Met | - |
| AC-006 | REQ-006 | Given the root `opencode.json`, When its `variant` keys are checked against the live result, Then the file matches the decision recorded in `scratch/variant.txt` | `rg -n '"variant"' opencode.json \| wc -l` prints the count the recorded result implies Observed 2026-11-19: 2 `variant` keys in `opencode.json`, matching the recorded result "read (kept)" in `scratch/variant.txt`. The result rests on source evidence, not a live run. | Met | - |
| AC-007 | REQ-007 | Given the default-model-id test, When it runs on the v2 entry, Then it reports no failures | `node --test .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` prints `# fail 0` Observed 2026-11-19: `# tests 6`, `# pass 6`, `# fail 0`. | Met | - |
| AC-008 | REQ-008 | Given the final commit on the branch, When its CI run is read after the push, Then the run is green on the v2 entry | `gh run list --branch worktrees/477-opencode-v1-removal --limit 1` prints `success` for this workflow, after the operator's push go-ahead UNKNOWN: not run. The push needs the operator's go-ahead, so no CI run exists for the final commit. | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

No. Every criterion is Unmet because this phase has not been implemented yet, and AC-008 also waits for the operator's push go-ahead.
<!-- /ANCHOR:closure -->
