---
title: "Acceptance Criteria: Phase 14: skilled-and-doc-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skilled and doc alignment acceptance criteria"
  - "alignment clean criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment"
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
# Acceptance Criteria: Phase 14: skilled-and-doc-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `014-skilled-and-doc-alignment`
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
| AC-004 | REQ-004 | Given a report naming N findings, When the fix pass ends, Then every finding is either fixed or carries a reason in `scratch/rebuttals.md`, and no finding is dropped | `rg -c '^## ' scratch/rebuttals.md` prints the settled count and `node -e "console.log(require(process.argv[1]).length)" "$RUN/findings.json"` prints the total, so the settled count plus the fixed count accounts for every finding. `findings.json` is a bare array, which is why the length is read directly and not through a key count | Unmet | - |
| AC-005 | REQ-005 | Given both reports, When both commands re-run, Then each report's open count reads `0` and the recheck's `still_open` and `new` rows both read `0` | `RUN=$(ls -d "$SA"/*/ \| tail -1) && rg -n '^\| (still_open\|new) \| 0 \|' "$RUN/recheck.md"` prints two lines, and `RUN=$(ls -d "$DA"/*/ \| tail -1) && rg -n '^- Open findings: 0' "$RUN/report.md"` prints one line | Unmet | - |
| AC-006 | REQ-006 | Given the `USAGE` block and the `VERB_SPECS` table after phases 001 to 011 land, When the help is read, Then the distinct verbs it lists equal the table's keys. The pair reads 11 and 11 today, so the row is unmet on the post-012 state and not on the baseline | `node .skilled/bin/bots.cjs --help \| rg -o '^  [a-z]+' \| sort -u \| wc -l` prints the same number as `node -e "const s=require('fs').readFileSync('.skilled/bin/bots.cjs','utf8');const m=s.match(/const VERB_SPECS = \{([\s\S]*?)\n\};/);console.log([...m[1].matchAll(/^  ([a-z]+):/gm)].length)"` | Unmet | - |
| AC-007 | REQ-007 | Given the skill docs, README, feature catalog and playbook after the fix pass, When the three package validators run, Then each exits 0 and the playbook prints `violations=0`. All three validators are green at this phase's setup, so the row is a regression guard: a violation that reappears after the fix pass is a finding T014 closes | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/system-skilled-bots` exits 0, `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exits 0 and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-skilled-bots/manual-testing-playbook` prints `violations=0` | Unmet | - |
| AC-008 | REQ-008 | Given both run folders, When `implementation-summary.md` is written, Then it names both roots, the clean criterion and the re-measured help-line and verb counts | `rg -n 'local-skilled-alignment\|local-doc-alignment\|Open findings: 0' implementation-summary.md` prints at least three lines | Unmet | - |
| AC-009 | REQ-009 | Given the last run of each command, When the evidence copy is made, Then `evidence/skilled-alignment/` and `evidence/doc-alignment/` each hold `report.md`, `findings.json` and `recheck.md`, and each report reads `- Open findings: 0`, so the clean close is checkable from the packet after the run folders are pruned | `rg -n '^- Open findings: 0' evidence/*/report.md` prints two lines, one per evidence folder, and `ls evidence/skilled-alignment evidence/doc-alignment` lists three files in each. The six source paths and the doc run's `recheck.md` rule are `design/records.md` section 12 | Unmet | - |
| AC-010 | REQ-010 | Given `.skilled/crates/bots-tui` exists, When the skill docs are read and the sk-code explain probe runs on a `.skilled/crates/bots-tui` `.rs` file, Then `SKILL.md` and `README.md` name `sk-code-skilled` as the Rust standards the crate relies on, and the probe names the Rust language and a Rust checklist part | `rg -l 'sk-code-skilled' .skilled/skills/system-skilled-bots/SKILL.md .skilled/skills/system-skilled-bots/README.md` lists both files, and `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --explain .skilled/crates/bots-tui/src/main.rs` prints `"language": "rust"` and a `rust-checklist` path | Unmet | - |
| AC-011 | REQ-011 | Given the crate's `design/` folder holds seven copies and a test reads only `mockups.md` and `chat-mockups.md`, When 014's crate design docs waves W4a to W4c run, Then the folder holds the two fixtures and a `README.md`, the other five live on as one product-voice status-mode reference, the CI guard diffs only the two fixtures and the status mode lists the reference | `ls .skilled/crates/bots-tui/design` prints exactly `README.md`, `chat-mockups.md` and `mockups.md`. `rg -n 'specs/\|\[SOURCE:\|REQ-[0-9]\|\bT[0-9]{3}\b\|\b0[0-9]{2}-' .skilled/skills/system-skilled-bots/bots-status/references/terminal-screen.md` exits 1. `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` exits 0 for the reference and for `.skilled/crates/bots-tui/design/README.md`. The guard's two `diff` commands exit 0 when run by hand. `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` prints `OK: parent-skill-check`, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/system-skilled-bots` exits 0, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub system-skilled-bots` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub system-skilled-bots` both print `RESULT: PASSED`, and `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` exits 0 | Unmet | - |

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

AC-005 and AC-009 are unmet: neither report has been produced yet, so the clean criterion has nothing to read and the evidence copy has nothing to copy. Every other row is unmet for the same reason, and the packet closes when the last run of each command reports zero open findings and that last run is copied into `evidence/`. AC-011 is unmet because the crate design docs waves W4a to W4c have not run.
<!-- /ANCHOR:closure -->
