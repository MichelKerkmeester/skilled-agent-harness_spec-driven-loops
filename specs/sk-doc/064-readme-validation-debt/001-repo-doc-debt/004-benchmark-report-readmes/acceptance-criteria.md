---
title: "Acceptance Criteria: Benchmark report READMEs: restructure 235 legacy reports to the numbered template and resolve their broken references"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "benchmark report readmes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt/004-benchmark-report-readmes"
    last_updated_at: "2026-10-27T09:30:00Z"
    last_updated_by: "lane-e-conductor"
    recent_action: "Recorded evidence for every criterion"
    next_safe_action: "None; criteria are met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-e-repo-doc-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Benchmark report READMEs: restructure 235 legacy reports to the numbered template and resolve their broken references

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/070-repo-doc-debt/004-benchmark-report-readmes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 235 restructured reports, When the README validator runs on each, Then every one is valid with no blocking error and no warning | `validate_document.py --type readme --json` over the 235: 235 valid, 0 blocking errors, 0 warnings; a six-file spot check in the final tree printed `valid: True, total_issues: 0` | Met | - |
| AC-002 | REQ-002 | Given a restructured report and its HEAD revision, When the non-heading, non-separator, non-blank lines are compared as a multiset, Then no line was lost or invented | line checker: `checked=235 pass=235 fail=0`, exit 0 | Met | - |
| AC-003 | REQ-003 | Given the six broken references inside benchmark report READMEs, When the audit reruns, Then the removed-runner reference reads as words and the five log paths stay as gitignored runtime paths | the sk-code report carries `node <skill-benchmark runner>` and the removal sentence; `git check-ignore -v` matches `.gitignore:299:*.log` for each of the five paths | Met | - |
| AC-004 | REQ-005 | Given the rewritten tree, When the two README tests run, Then the verdict diff is empty and discovery still reproduces | `PARITY PASS: verdict diff is empty` with `diff_entries=0`, exit 0; `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible` | Met | - |
| AC-005 | REQ-004 | Given the 13 touched skills, When each patch entry is written, Then every carrier for that skill names the same version | 13 entries exist; mcp-tooling `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` all name 1.8.5.0; sk-vision `SKILL.md` and its `.hermes` copy both name 0.3.7.0 | Met | - |
| AC-006 | REQ-001 | Given the whole repo, When the audit reruns, Then the template-invalid count is the two READMEs another lane owns | `"template_invalid": 2`, being `.skilled/commands/create/readme.md` and the `sk-create-repo-rule` fixture README | Met | - |

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

Every criterion is met: the 235 reports validate clean, keep every non-heading line, and the repo's README checks read the result as a fix rather than as drift.
<!-- /ANCHOR:closure -->
