---
title: "Acceptance Criteria: Phase 13: skilled-and-doc-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skilled and doc alignment acceptance criteria"
  - "alignment clean criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment"
    last_updated_at: "2026-11-25T19:32:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-skilled-and-doc-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 13: skilled-and-doc-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `013-skilled-and-doc-alignment`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`SA` is `${XDG_STATE_HOME:-$HOME/.local/state}/local-skilled-alignment/system-skilled-bots` and `DA` is `${XDG_STATE_HOME:-$HOME/.local/state}/local-doc-alignment/system-skilled-bots`. `RUN` is the newest folder under either root, which `ls -d "$SA"/*/ | tail -1` prints, because a run folder is named by its UTC timestamp.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `topics.json` holds ten topics and none names this skill, When the `system-skilled-bots` topic is added, Then the topic resolves with three `codeRoots` and three `checks` | `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');const x=t.topics['system-skilled-bots'];console.log(x.codeRoots.length, x.checks.length)"` prints `3 3` | Unmet | - |
| AC-002 | REQ-002 | Given the packet's `.skilled` change set, When `/local-skilled-alignment :auto` runs, Then its run folder holds `report.md`, `findings.json` and `fix-plan.md` | `RUN=$(ls -d "$SA"/*/ \| tail -1) && ls "$RUN/report.md" "$RUN/findings.json" "$RUN/fix-plan.md"` exits 0 | Unmet | - |
| AC-003 | REQ-003 | Given the new topic, When `/local-doc-alignment system-skilled-bots :auto` runs, Then its run folder holds the same three files | `RUN=$(ls -d "$DA"/*/ \| tail -1) && ls "$RUN/report.md" "$RUN/findings.json" "$RUN/fix-plan.md"` exits 0 | Unmet | - |
| AC-004 | REQ-004 | Given a report naming N findings, When the fix pass ends, Then every finding is either fixed or carries a reason in `scratch/rebuttals.md`, and no finding is dropped | `rg -c '^## ' scratch/rebuttals.md` prints the rebutted count and `node -e "console.log(Object.keys(require(process.argv[1])).length)" "$RUN/findings.json"` prints the total, so the rebutted count plus the fixed count accounts for every finding | Unmet | - |
| AC-005 | REQ-005 | Given both reports, When both commands re-run, Then each report's open count reads `0` and the recheck's `still_open` and `new` rows both read `0` | `RUN=$(ls -d "$SA"/*/ \| tail -1) && rg -n '^\| (still_open\|new) \| 0 \|' "$RUN/recheck.md"` prints two lines, and `RUN=$(ls -d "$DA"/*/ \| tail -1) && rg -n '^- Open findings: 0' "$RUN/report.md"` prints one line | Unmet | - |
| AC-006 | REQ-006 | Given the `USAGE` block and the `VERB_SPECS` table after phases 001 to 011 land, When the help is read, Then the distinct verbs it lists equal the table's keys. The pair reads 11 and 11 today, so the row is unmet on the post-012 state and not on the baseline | `node .skilled/bin/bots.cjs --help \| rg -o '^  [a-z]+' \| sort -u \| wc -l` prints the same number as `node -e "const s=require('fs').readFileSync('.skilled/bin/bots.cjs','utf8');const m=s.match(/const VERB_SPECS = \{([\s\S]*?)\n\};/);console.log([...m[1].matchAll(/^  ([a-z]+):/gm)].length)"` | Unmet | - |
| AC-007 | REQ-007 | Given the skill docs, README, feature catalog and playbook after the fix pass, When the three package validators run, Then each exits 0 and the playbook prints `violations=0`. All three pass today, so the row is unmet on the post-fix state and not on the baseline | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/system-skilled-bots` exits 0, `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exits 0, and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-skilled-bots/manual-testing-playbook` prints `violations=0` | Unmet | - |
| AC-008 | REQ-008 | Given both run folders, When `implementation-summary.md` is written, Then it names both roots, the clean criterion and the re-measured help-line and verb counts | `rg -n 'local-skilled-alignment\|local-doc-alignment\|Open findings: 0' implementation-summary.md` prints at least three lines | Unmet | - |

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

AC-005 is unmet: neither report has been produced yet, so the clean criterion has nothing to read. Every other row is unmet for the same reason, and the packet closes when the last run of each command reports zero open findings.
<!-- /ANCHOR:closure -->
