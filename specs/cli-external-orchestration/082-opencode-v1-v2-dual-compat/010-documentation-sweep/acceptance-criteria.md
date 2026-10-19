---
title: "Acceptance Criteria: Phase 10: documentation-sweep"
description: "The criteria this packet must satisfy before it may be closed. Each one is met, waived by a decision record or superseded by one."
trigger_phrases:
  - "documentation sweep acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/010-documentation-sweep"
    last_updated_at: "2026-10-18T12:45:10Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-documentation-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: documentation-sweep

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `cli-external-orchestration/082-opencode-v1-v2-dual-compat/010-documentation-sweep`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Evidence | Status | Waiver |
|-------|-----|---------------------|--------------|----------|--------|--------|
| AC-001 | REQ-001, REQ-006 | Given each touched doc, When its sk-doc validator runs with the type from its inventory row, Then the exit status is 0 | Run `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <doc> --type <type>` for each touched doc. Observe each exit status in `doc-inventory.md`. Evidence: doc-inventory.md:60 and scratch/checks/after.tsv | 41 of 41 docs exit 0 from `validate_document.py` with the type in their row. Three READMEs run as `readme`, their type of record (scratch/decisions.txt 4) | Met
| AC-002 | REQ-002 | Given each changed skill, hub and playbook package, When its sk-doc package check runs, Then the exit status is 0 | Run `validate_skill_package.py <skill folder>` for each changed skill or hub. Run `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package <playbook folder>` for each changed playbook. Run `validate_catalog_package.py --package <ID>` for each changed catalog. Evidence: doc-inventory.md:68 | cli-opencode exit 0 (4,899 words), the hub exit 0 after the manifest re-mint, cli-devin and cli-claude-code exit 0, playbook package exit 0 (55 scenarios, 0 violations), catalog package exit 0 | Met
| AC-003 | REQ-003, REQ-007 | Given the touched docs, When the v1-only flags are searched, Then each hit names version 1 or says the claim is unverified | Run `rg -n -e '--command' -e '--dir' -e '--share' -e '--port' -e '--pure' <touched docs>` and read each hit. Evidence: doc-inventory.md:78 and scratch/checks/v1-hits-context.txt | 384 hits over the 41 inventory docs. 284 carry the version on their own line. Of the other 100, 56 sit under a tagged heading, 26 beside tagged text and 18 under the version note. None is untagged | Met
| AC-004 | REQ-004 | Given each touched doc, When its DQI is scored, Then `dqi.total` is 75 or higher | Run `python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py <doc>` and read `dqi.total` for each touched doc. Evidence: doc-inventory.md:60 | Every `dqi.total` is 77 or more. The lowest is 77 | Met
| AC-005 | REQ-005 | Given each touched doc, When the human-voice scan runs, Then its exit status is 0 and a manual human-voice note is recorded | Run `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <doc>` for each touched doc. Record the manual note in `doc-inventory.md`. Evidence: doc-inventory.md:82 | Every `hvr_scan.py` exit is 0 with no hard finding. The manual pass is the reviews' check 6, recorded in doc-inventory.md | Met

The Verification cell holds the exact check to run. The Evidence cell stays empty until the orchestrator runs that check. Then it holds the observed output and exit status.

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

All five criteria are Met, each checked by the orchestrator on the final tree on 2026-10-19. The reviews and their closures are in doc-inventory.md, and the rulings are scratch/decisions.txt.
<!-- /ANCHOR:closure -->
