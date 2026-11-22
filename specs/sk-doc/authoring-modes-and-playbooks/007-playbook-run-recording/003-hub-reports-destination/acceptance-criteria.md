---
title: "Acceptance Criteria: Phase 3: hub-reports-destination"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub reports destination acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/003-hub-reports-destination"
    last_updated_at: "2026-11-22T11:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion with its evidence"
    next_safe_action: "Commit the phase on the operator's instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hub-reports-destination"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: hub-reports-destination

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `003-hub-reports-destination`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a mode with no benchmark folder, When the recorder runs with `--reports <hub>/benchmark/reports`, Then the run folder lands under the hub, the mode gets no benchmark folder, and the hub's index carries the hub name | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:179` asserts the mode gets no benchmark folder, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:181` asserts the hub index carries the hub name, and the suite prints `recorder hub reports: PASS (14 assertions)`; the sk-code dry run (T014) exits 0 | Met | - |
| AC-002 | REQ-001 | Given a `--reports` path that does not end in `benchmark/reports` or that belongs to anything other than the playbook's own skill or its direct parent hub, a folder holding `mode-registry.json`, When the recorder runs, Then it refuses the run with exit 1 before any write | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:184` asserts exit 1 for the typo path, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:174` for a parent without `mode-registry.json`, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:189` for the foreign reports folder, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:194` for a folder above the hub and `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:199` for a folder inside the playbook; `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:190` and `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:195` assert those folders are not created, and `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/record-playbook-run.test.cjs:204` accepts the hub through a symlink | Met | - |
| AC-003 | REQ-002 | Given `run-conversation-scenario.cjs --reports DIR`, When the runner ends, Then the printed `save results:` command carries `--reports` | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:558` asserts the printed save command carries `--reports`, and the suite reports `fail 0` (T012) | Met | - |
| AC-004 | REQ-003 | Given the sk-code-ci, sk-code-frontend and cli-mistral-vibe roots, When `validate-playbook-package.cjs --package` runs on each, Then each exits 0 with `violations=0` and each root names `--reports` | Exit 0 and `violations=0` for all three (T013). The flag appears at `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md:17`, `.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/manual-testing-playbook.md:17` and `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md:24` (T007, T009) | Met | - |
| AC-005 | REQ-004 | Given the 25 cli-mistral-vibe blocks, When the recorder saves them, Then the two report folders hold 22 and 3 PASS rows and no scenario file keeps a `Recorded Result` block | Parsed `results.csv` files: 22 records and 3 records, all PASS, 25 distinct scenario ids. Rows start at `.skilled/skills/cli-external-orchestration/benchmark/reports/2026-11-14--manual-testing-playbook--recorded-results/results.csv:3` and `.skilled/skills/cli-external-orchestration/benchmark/reports/2026-11-15--manual-testing-playbook--recorded-results/results.csv:3`; `rg -l 'Recorded Result'` over the playbook prints nothing (T008) | Met | - |

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

Every criterion is met. The parent and the phase validation results are recorded in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
