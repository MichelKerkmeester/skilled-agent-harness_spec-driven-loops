---
title: "Implementation Summary"
description: "The playbook validator now reports a scenario whose prompt copies disagree, where before it passed them clean. It warns rather than fails, and the corpus holds 60 such copies across 12 packages."
trigger_phrases:
  - "playbook prompt sync warning"
  - "PROMPT_UNSYNCED"
  - "playbook prompt fields disagree"
  - "turn 1 prompt out of sync"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/058-playbook-prompt-sync"
    last_updated_at: "2026-09-23T17:29:43Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped the PROMPT_UNSYNCED warning with suite and fleet evidence"
    next_safe_action: "Fix the 60 disagreeing copies package by package, then consider making the check fail closed"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-058-playbook-prompt-sync"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 058-playbook-prompt-sync |
| **Completed** | 2026-09-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A playbook can no longer say one prompt in its contract and another in its table, its chain or its root summary without the validator saying so. Before this, the Prompt Synchronization Gate was a sentence nobody checked, and a scenario whose Turn 1 had drifted from its root entry passed clean.

### Warn when a playbook scenario's prompt fields disagree

`validate-playbook-package.cjs` takes the structured prompt in `SCENARIO CONTRACT` as the reference and compares three copies with it: the execution table's Exact Prompt cell, a conversation chain's Turn 1 input and the root summary's prompt. Each copy whose words differ is reported as a `PROMPT_UNSYNCED` warning at its own file and line. Quotes, backticks, emphasis and spacing are ignored, because an operator types the words and not the formatting. The Turn 1 copy is in the gate because it is the one a scenario runner sends.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modified | The comparison and the root summary index |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | Modified | Eight assertions in both directions |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` | Modified | Gate text, validator scope, version 1.0.2.0 |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/README.md` | Modified | Prompt sync leaves the manual spot-check list |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/changelog/v1.0.2.0.md` | Created | Release entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The corpus was measured first, and the count decided the severity: every package is fail-closed, so a hard check would have failed CI for 12 packages at once. The first fleet run raised 103 warnings. Reading them showed two false-positive shapes, quotes inside a code span and backticks around one token, and normalizing both brought the count to 60, each a real difference in wording.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Warning, not violation | The corpus already holds 60 disagreements, and a fail-closed check would block unrelated work until all were fixed |
| Turn 1 joins the gate | The runner sends the chain's Turn 1, so a drifted chain runs a different test from the one the root indexes |
| Attribute a root prompt only from a block linking one scenario and holding one prompt | An index section or an ambiguous block would otherwise pin the wrong prompt on a scenario |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/tests/validate-playbook-package.test.cjs` | PASS: 33 fixture, 8 contract and 8 prompt sync assertions |
| Suite against three broken builds: check disabled, index guard removed, backtick normalization removed | Each fails at the assertion written for it |
| 42-scenario playbook, scratch copy | Unchanged copy 0 warnings. Changed contract 3, changed Turn 1, table or root 1 each. All 42 root summaries map |
| Fleet run, previous validator against this one | 58 packages, identical statuses and violation counts, exit 0 both, 60 warnings across 12 packages |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 60 existing disagreements stay open.** They are reported, not fixed, and belong to their package owners.
2. **A root layout that states a prompt outside the scenario's heading block is not compared.** Such a copy is skipped rather than guessed at.
<!-- /ANCHOR:limitations -->

---
