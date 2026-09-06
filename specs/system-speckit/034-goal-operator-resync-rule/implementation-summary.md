---
title: "Implementation Summary: Goal operator-copy resync rule"
description: "Every scaffolded goal.md now tells the working agent to resend the parent goal in chat when its durable slice changes."
trigger_phrases:
  - "goal resync shipped"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-goal-operator-resync-rule"
    last_updated_at: "2026-09-06T16:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Added the operator-copy resync rule to the goal addon and closed the packet"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:ec6de27a764ff0d27d6faa1ac2e2c76bd39a125d6a11facd0610311cf1f6a8ab"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-goal-operator-resync-rule |
| **Completed** | 2026-09-06 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every scaffolded goal.md now tells the working agent to resend the parent goal in chat when its durable slice changes, so the objective you hold in the session stays the objective the file describes.

### The rule

You paste a goal's durable slice as the session objective; from now on the agent sends the new text back whenever a decision, the binding table or a criterion changes, and amends a parent before a child when a child change reaches upward. Log entries never trigger a resend.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| templates/addons/goal.md.tmpl | Modified | Operator copy paragraph inside the directive anchor |
| references/workflows/goal-set-string-playbook.md | Modified | Section 5 states the rule and the amendment order |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two asserted edits, the template contract suites, the doc validator, and the goal template rendered through the inline gate renderer at Level 2 and phase into a throwaway scaffold, which carried the paragraph and validated strict before removal.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the rule inside the directive anchor rather than a new section | The goal document's anchors are a validated contract; a new anchor would need a manifest change for a two-sentence rule |
| No validator rule | Nothing can check what an operator pasted; the playbook already says so |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Template suites | level-contract-resolver, template-structure, scaffold-golden-snapshots, memory-template-contract pass |
| Playbook | `validate_document.py --blocking-only`: 0 issues |
| Render probe | goal.md rendered at Level 2 and phase contains the paragraph; a scaffolded packet carrying it prints RESULT: PASSED under `validate.sh --strict` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Existing goal files** Goal documents scaffolded before this change lack the paragraph until their next edit; the playbook binds the agent either way.
<!-- /ANCHOR:limitations -->

---
