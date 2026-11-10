---
title: "Acceptance Criteria: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "node security patch update acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/repo-operations/004-node-security-patch-update"
    last_updated_at: "2026-11-10T11:36:56Z"
    last_updated_by: "codex"
    recent_action: "Met every criterion with the supplied release, test and diagnostic evidence"
    next_safe_action: "Operator to delete the eight older nvm versions"
    blockers: []
    key_files:
      - spec.md
      - plan.md
      - tasks.md
      - acceptance-criteria.md
      - implementation-summary.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-node-security-patch-update"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `system-speckit/repo-operations/004-node-security-patch-update`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 2026-10-23 security notice and 2026-11-10 release index, When the supported release floors are selected, Then the floors are 22.23.4, 24.22.1 and 26.12.1, with 24.22.2 and 26.13.0 the newest releases on their lines and no patched Node 20 release available | The supplied release-index confirmation states 22.23.4 is a security release, 24.22.2 and 26.13.0 are newest on their lines, and Node 20 had no release after 20.20.2 in March 2026 | Met | - |
| AC-002 | REQ-001 | Given the Code Mode server and CI workflows, When their runtime selections are updated, Then .nvmrc is 24.22.2, all 37 setup-node steps name 22, and the two Node 20 rerun blocks are removed | The supplied change record names .skilled/skills/mcp-code-mode/mcp-server/.nvmrc, counts all 37 setup-node steps and identifies the removed rerun blocks in opencode-plugin-tests.yml and sk-code-script-tests.yml. Both workflow files parse as YAML. | Met | - |
| AC-003 | REQ-001 | Given the ten affected package manifests and seven package-lock files, When their engine ranges are synchronized, Then nine manifests use ^22.23.4 \|\| ^24.22.1 \|\| >=26.12.1, the Code Mode server uses >=24.22.1 <25.0.0, and 14 lock entries match | The supplied change record lists all ten affected package locations and confirms 14 synchronized entries in seven package-lock files. | Met | - |
| AC-004 | REQ-002 | Given the published minimums and runtime diagnostics, When a supported interpreter is checked, Then the documentation, doctor floor and launcher range reflect the selected patched floors and the Code Mode launcher requires Node 24.22.1 or newer on the 24 line | CONTRIBUTING.md, the two system-spec-kit README files, the doctor test runner hint, mcp-doctor.sh and the launcher test constant were updated. mcp-doctor.sh printed [PASS] Node.js v26.13.0 and [PASS] Node engine range satisfied by the nvm 24.22.2 interpreter. | Met | - |
| AC-005 | REQ-002 | Given the approved machine update, When the patched interpreters and local node link are installed, Then nvm has 22.23.4, 24.22.2 and 26.13.0 and ~/.local/bin/node points to the nvm 26.13.0 binary | The supplied machine-step record confirms all three nvm installs and the link update. The mcp-doctor result confirms the host reports Node.js v26.13.0. | Met | - |
| AC-006 | REQ-002 | Given the node-engine-resolver and mcp-code-mode-launcher suites, When the recorded tests run, Then the shared result is documented accurately, including the unchanged direct-server failure | The supplied test result is 21 passed and 1 failed. The single direct-server test failure matches the result before the change because mcp-server dependencies are absent. The resolver real-host test failed before patched Node 24 was installed, as expected. The doctor test runner reports the same failing tests with and without this change. | Met | - |
| AC-007 | REQ-002 | Given the Barter host fallback pin, When its separate host change is recorded, Then it names Node 26.13.0 and remains attributable to its own commit | The supplied host-repository fact states its fallback .nvmrc moved from v26.10.0 to v26.13.0 in commit d5f4d628e. | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is Met with the supplied release, configuration, test or diagnostic evidence. The eight older nvm versions were then uninstalled on the operator's instruction.
<!-- /ANCHOR:closure -->
