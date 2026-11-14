---
title: "Implementation Summary"
description: "The findings that phases 006 to 008 logged outside the ledger are fixed in the files they cite. No document in the hub cites the dropped rule id, and the scripts README paths resolve."
trigger_phrases:
  - "out of ledger findings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/009-out-of-ledger-findings"
    last_updated_at: "2026-11-14T17:05:50Z"
    last_updated_by: "implement-workflow"
    recent_action: "Fixed eight documents in three packets and closed the phase 002 checklist line"
    next_safe_action: "Check the five completion criteria of the parent goal"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-out-of-ledger-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-out-of-ledger-findings |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The findings that phases 006 to 008 logged outside the ledger are fixed in the files they cite. No document in the hub cites the dropped rule id, and the scripts README paths resolve.

### Phase 9: out-of-ledger-findings

You can follow every path in the `sk-code-skilled` scripts README, because the two guard paths now start one level up. The two JS and CSS style checklists name the history-comment rule where they cited `CHK-CMT-07`. The `sk-code-skilled` entry document and four lines of the quality packet call the tree SKILLED, and OpenCode stays where it names a runtime. The playbook's test table lists all nine test files. The review playbook calls `pr-state-dedup.md` the sibling M-1 gate and says nothing about the depth alias. The three packets are at versions 2.2.1.0, 1.9.18.0 and 1.13.21.0. The phase 002 checklist line `CHK-012` is ticked.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-code-skilled/assets/checklists/js-css-style/` (two files) | Modified | The rule's name in place of `CHK-CMT-07` |
| `sk-code-skilled/SKILL.md` | Modified | `SKILLED system code`, version 2.2.1.0 |
| `sk-code-skilled/scripts/README.md` | Modified | Two guard paths that resolve |
| `sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md` | Modified | Two resolver test rows |
| `sk-code-review/manual-testing-playbook/efficiency-and-restraint/minimum-evidence-gate.md` | Modified | The M-1 row |
| `sk-code-review/SKILL.md` | Modified | Version 1.9.18.0 |
| `sk-code-quality/README.md` | Modified | Three `SKILLED` names |
| `sk-code-quality/SKILL.md` | Modified | One `SKILLED` name, version 1.13.21.0 |
| Three `changelog/` files | Created | One release note for each packet |
| `002-frontend-reach/tasks.md` | Modified | `CHK-012` ticked with the operator's answer |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each cited line was read and each edit was designed as literal text. Sixteen briefs went to DeepSeek V4.1 Flash at max thinking through cli-pi, six at a time, with same-file edits in sequence. One was a read-only second reading of the MCP server checklist, and one fixed a release note sentence the shape check found too long. Every diff was read. The orchestrating session ran each task's verify command, the packet tests, the review canary, the drift guards, the three playbook validators, the document validator, the README reference check, the changelog shape check and the setup battery. The commit gate raised the version of six changed documents through `frontmatter-version.mjs bump`. The code landed as `7f35cb2db1`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The playbook line that says seven test files stays | The scenario step it describes runs exactly seven files, so the sentence is true. Only the test table, which is the full inventory, gains the two rows |
| The two new rows name OC-011 as their overlap | That scenario replays routing through the replay library, which reads the router the resolver names. This is one reader's judgment |
| The rule id check reads Markdown only | A benchmark report from 2026-07-21 quotes the old id in JSON. It is a record of a past run, so the criterion was scoped with `-g '*.md'` before any row was marked |
| One code commit for the phase | The operator's commit policy for this packet is one code commit for each phase |
| Each version rose by a patch step | The phase changes wording, paths and table rows. No check, gate value or exit code changed |
| `fix open items` is read as the acknowledgement `CHK-012` waited on | The instruction named the open items, and that line was one of them. The reading is an assumption and the final report says so |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -c 'CHK-CMT' .skilled/skills/sk-code -g '*.md' -g '!**/changelog/**'` | Nothing printed, exit 1. The same pattern prints 1 on the committed copy of one checklist before the fix |
| `check_readme_references.py` on `sk-code-skilled/scripts/README.md` | `PASS`, 34 references, 0 unresolved. Before the fix: `FAIL`, 2 unresolved |
| `rg -c '^\| `scripts/tests/'` on the playbook root | `9`. Before the fix: `7` |
| `rg -c 'depth alias maps'` on the minimum-evidence scenario | Nothing printed, exit 1 |
| `rg -c 'OpenCode'` on the quality README and `SKILL.md` | Nothing with exit 1, and `1` |
| `node --test` on `sk-code-skilled/scripts/tests` and `sk-code-quality/scripts/tests` | 55 pass and 154 pass, 0 fail, the same counts as the baseline |
| `check-rule-copies.test.sh` and `check-rule-copies.js` | `All rule-canary test cases passed`, exit 0, and exit 0 |
| `run-all-drift-guards.sh` | `all 4 guards PASSED`, exit 0, with the same 21 warnings as the baseline |
| `validate-playbook-package.cjs --package` on the three packet playbooks | `PASS` with 12, 48 and 23 scenarios, 0 violations, 0 warnings |
| `validate_document.py` on five changed documents | Zero issues on each. The playbook root matched no document type rule |
| `check_changelog_shape.py` on the three release notes | `PASS` on each, after one sentence in the skilled note was split |
| The README reference check with one dead path added | `FAIL`, 1 unresolved, exit 1, then `PASS` and exit 0 after the restore, saved in `scratch/failure-path.txt` |
| `sk-code-setup-check.cjs` | `STATUS=OK legs=9`, exit 0 |
| `git show --stat 7f35cb2db1` | Twelve files, all under `sk-code-skilled/`, `sk-code-review/` and `sk-code-quality/` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The verification scenario's expected test count is stale.** `sk-code-skilled/manual-testing-playbook/authoring-verification/verification-alignment.md` says step 8 prints `tests 37`. The same seven files print `tests 46` today. The step's pass rule reads `fail 0` only, so the scenario still passes. No finding named it, so it is logged for the operator.
2. **Two more lines in `sk-code-skilled/SKILL.md` say OpenCode for the tree.** Lines 90 and 94 read `always kept within OpenCode` and `OpenCode-only implementation guardrails`. The logged finding named line 13 only.
3. **The MCP server checklist selector is narrower than the checklist's own usage list.** A second reader, shown only the checklist's opening, named registry entries and the choice between native registration and Code Mode as cases. The selector names a file that defines a server, registers its tools or sets how it starts. Nothing was changed.
4. **Ledger row `H7` is open by decision.** The `sk-code-ci` keyword copies wait on the operator's choice of a packet.
<!-- /ANCHOR:limitations -->

---
