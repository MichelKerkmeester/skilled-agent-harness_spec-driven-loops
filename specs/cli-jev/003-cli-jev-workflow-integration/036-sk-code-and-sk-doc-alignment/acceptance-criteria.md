---
title: "Acceptance Criteria: Phase 36: sk-code-and-sk-doc-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment acceptance criteria"
  - "closure gate"
  - "drift and validator criteria"
  - "stderr tag criteria"
  - "alignment waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/036-sk-code-and-sk-doc-alignment"
    last_updated_at: "2026-09-30T11:42:56Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-036-sk-code-and-sk-doc-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 36: sk-code-and-sk-doc-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/036-sk-code-and-sk-doc-alignment
**Level:** 2
**Status:** Planned
**Date:** 2026-09-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The five rows mirror the five completion criteria in `goal.md`. The Verification cell names the command and the expected output. No observed evidence is pasted yet, because nothing in this phase is built.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 9 C1 files findings.md lists at `089693d899`, When each carries the missing `COMPONENT:` or `MODULE:` marker in the header style it already uses, Then `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over a staged copy of the 34 in-scope code files prints `Errors: 0` and `Warnings: 0` | `verify_alignment_drift.py --check-exact-headers --fail-on-warn <stage>` read from the staged copy of the 34 in-scope code files, with `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/raw/mode-routing-run.sh` left out. Expected: `Scanned files: 34`, `Findings: 0`, `Errors: 0`, `Warnings: 0`. Baseline: `Findings: 10`, `Errors: 10` over 35 files | Unmet | - |
| AC-002 | REQ-002 | Given the 11 C2 scripts, When each stderr diagnostic carries the `[<script-name>]` prefix and no other behavior changes, Then a grep shows the prefix in every script and each changed script's own test suite passes | `grep` each of the 11 C2 scripts for its own `[<script-name>]` prefix, then run each changed script's own `node --test` or `python3` suite. Expected: every script matches its prefix, no bare `error:` diagnostic remains, and each suite passes 0 failed. `cli-deem.mjs` keeps its JSON stderr contract and is not grepped for a tag | Unmet | - |
| AC-003 | REQ-003, REQ-004 | Given the two scenario files and the four catalog entries, When the dated transcripts and the Feature ID bullets are removed, Then the playbook package validator exits 0 with status PASS and the catalog validator lists no violation whose leaf is one of the packet's 28 catalog entries | `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/manual-testing-playbook` and `validate_catalog_package.py --json`. Expected: exit 0 with `"status": "PASS"` for the package, and no `packet_history_metadata` or other violation whose file is one of the packet's 28 catalog entries. Baseline: two `BAKED_RUN_TRANSCRIPT` errors at `hub-routing/alias-still-resolves.md:71` and `hub-routing/judgment-request-routes-to-transport.md:74`, and four `packet_history_metadata` violations | Unmet | - |
| AC-004 | REQ-005, REQ-006 | Given the seven D3 files and the two READMEs, When the prose hard blockers are fixed and both READMEs are written, Then `hvr_scan.py` reports hard blockers only on the recorded false positives and `validate_document.py` returns VALID on all 89 audited docs plus the new README | `hvr_scan.py` over the packet's docs and `validate_document.py` over the 89 docs plus `.skilled/skills/cli-classifier/benchmark/injection-screen/README.md`. Expected: hard blockers only on the recorded false positives, 89 of 89 `VALID` with 0 errors, and the new README `VALID` at DQI band good or better. The baseline is 20 hard blockers, of which the recorded false positives are the `reply-harness` path occurrences | Unmet | - |
| AC-005 | REQ-009, REQ-010 | Given the 31 scripts and this phase folder, When comment hygiene, the key grep and the phase validator run, Then hygiene reports 0 violations, the key grep exits 1, and `validate.sh --strict` prints `RESULT: PASSED` | `check-comment-hygiene.sh` over the 31 scripts, `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` over the changed scripts, and `validate.sh specs/cli-jev/003-cli-jev-workflow-integration/036-sk-code-and-sk-doc-alignment --strict`. Expected: 31 of 31 clean, grep exit 1 with no match, and `RESULT: PASSED` with `Errors: 0  Warnings: 0`. Baseline for hygiene: 31 of 31 clean, so a violation is a regression | Unmet | - |

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

All five rows are `Unmet`. Nothing in this phase is built. The rows carry the packet, and this statement is rewritten at close from the observed command output.
<!-- /ANCHOR:closure -->

---
