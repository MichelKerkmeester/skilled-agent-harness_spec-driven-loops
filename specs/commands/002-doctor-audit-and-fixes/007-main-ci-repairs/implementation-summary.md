---
title: "Implementation Summary"
description: "Three CI workflows that failed on every push to main pass again: the create-goal reports point at the renumbered packet, the README manifest lists three new folders and DOC-406 has its Prompt line."
trigger_phrases:
  - "main ci repairs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/007-main-ci-repairs"
    last_updated_at: "2026-11-02T12:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the three causes and passed each workflow's command locally"
    next_safe_action: "Push to origin/main and read the three workflows on the pushed commit"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json"
      - ".skilled/manual-testing-playbook/doctor-commands/doctor-routing-helper-handoff.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Spec folder: new child 007 under the doctor fixes parent (operator, 2026-11-02)"
      - "Workspace: reuse worktree 308, then push to origin/main (operator, 2026-11-02)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-main-ci-repairs |
| **Completed** | 2026-11-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three CI workflows had failed on every push to main since 2026-11-01, so they could no longer warn about a new break. Each had one leftover cause, and each is fixed where it sat.

### Phase 7: main-ci-repairs

The create-goal benchmark reports still linked into `specs/sk-doc/060-create-goal-mode/`, a number the specs renumber retired, so the link guard counted 18 broken links. They now point at `056-create-goal-mode`, where every linked file exists. The README manifest test compares the tree with a frozen list of durable folders, and three real folders had been added since: the decision-capture hook scripts, its state folder and the doctor-commands playbook. The list now includes them. The playbook contract wants a `Prompt:` line in each scenario, and DOC-406 said `Prompts:`. It now has a `Prompt:` line, and the root playbook names DOC-407 as the next free number.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/benchmark/reports/2026-09-26--manual-testing-playbook--create-goal*/` (8 files) | Modified | Packet path |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modified | Three new folders |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-routing-helper-handoff.md` | Modified | `Prompt:` line |
| `.skilled/manual-testing-playbook/manual-testing-playbook.md` | Modified | Next free DOC number |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each workflow's log was read, then its command was rerun locally to reproduce the failure. After the fixes the same three commands ran clean from the worktree root.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep old changelog entries that name `060-create-goal-mode` | They record what was true when written, and the link guard does not scan them |
| Add a `Prompt:` line instead of changing the validator | The contract is right, and every sibling scenario already carries the line |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-markdown-links.cjs` | PASS: `14038 links checked, 0 broken`, exit 0 (18 broken before) |
| `run-script-tests.sh` (sk-doc) | PASS: 48 PASS, `all sk-doc script tests passed`, exit 0 |
| `validate-playbook-package.cjs --strict` | PASS: root playbook `violations=0 warnings=12` (1 violation before), exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The root playbook keeps 12 warnings.** They were there before, and the workflow does not fail on warnings.
<!-- /ANCHOR:limitations -->

---
