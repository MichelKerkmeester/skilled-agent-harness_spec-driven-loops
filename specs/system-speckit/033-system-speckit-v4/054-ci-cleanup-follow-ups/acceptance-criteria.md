---
title: "Acceptance Criteria: CI Cleanup Follow-ups"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one, covering the tmp gate change, the CI workaround removal, the playbook fixes and the cli-jev pipefail scripts."
trigger_phrases:
  - "ci cleanup follow-ups"
  - "spec gate tmp exemption"
  - "cli-jev pipefail"
  - "tmpdir ci workaround"
  - "drift guard errors"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups"
    last_updated_at: "2026-09-23T20:30:00Z"
    last_updated_by: "cli-pi-mimo-v2.6-pro"
    recent_action: "Closed the packet with every acceptance criterion met"
    next_safe_action: "None. The packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-054-ci-cleanup-follow-ups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: CI Cleanup Follow-ups

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups
**Level:** 2
**Status:** Complete
**Date:** 2026-09-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the spec gate core without the /tmp and /private/tmp location clause and a core test that builds a repository under /tmp, When the core suite runs the new test named a repository rooted under /tmp is gated like any other, Then the gate denies the write under enforcement like it does for any other repository | node --experimental-test-module-mocks --test spec-gate-core.test.mjs reported 108 of 108 pass with TMPDIR=/tmp and with the default temp dir, and the new test failed against the old gate before the change (wu1 and wu2). Anchor: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs:823. | Met | - |
| AC-002 | REQ-002 | Given the four spec-gate suites and the runtime root vitest project, When each runs with TMPDIR=/tmp and with the default temp dir, Then no suite regresses and the root project passes | The core suite reported 108 of 108, devin 15 of 15, cursor 17 of 17 and Pi 9 of 9 under both temp dirs, and the runtime root vitest project stood at 1,292 passed, 0 failed, 13 skipped after the communication-projection dist was built. Anchor: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1538. | Met | - |
| AC-003 | REQ-003 | Given the runtime vitest step in .github/workflows/spec-kit-check.yml without the 4-line TMPDIR workaround, When the step runs on the runner, Then it runs with the runner's default temp dir and passes | grep -c TMPDIR on .github/workflows/spec-kit-check.yml reported 0, and on the tree rebased onto origin/main the runtime root vitest project passed 1,294 tests with 0 failed under TMPDIR=/tmp and again under the default temp dir (wu3). Anchor: .github/workflows/spec-kit-check.yml:124. | Met | - |
| AC-004 | REQ-004 | Given the two manual-testing playbooks corrected in wording and expected count, When a repo-wide search looks for text that describes the /tmp exemption or the old 107 count, Then no such text remains anywhere | A repo-wide search found no other text describing the /tmp exemption or the old 107 count, and the playbooks were fixed in wu4, wu5 and wu7. Anchor: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md:75. | Met | - |
| AC-005 | REQ-005 | Given the six cli-jev probe scripts moved from set -u to set -uo pipefail, When bash -n parses each script and the sk-code drift guards run, Then every script parses and the drift guard reports 0 errors | bash -n on the six scripts reported all ok, and run-all-drift-guards.sh reported all 2 guards passed with Errors 0 against 6 before the change (wu6). Anchor: .skilled/skills/cli-jev/benchmark/reports/2026-09-20-hub-routing-baseline/raw/hub-routing-run.sh:5. | Met | - |

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

**Closeable:** Yes

Every criterion is Met and the packet is closeable.
<!-- /ANCHOR:closure -->
